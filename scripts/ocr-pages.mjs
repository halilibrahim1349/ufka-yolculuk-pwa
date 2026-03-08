import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { createCanvas, DOMMatrix, ImageData, Path2D } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

globalThis.DOMMatrix = DOMMatrix;
globalThis.ImageData = ImageData;
globalThis.Path2D = Path2D;

const require = createRequire(import.meta.url);
const createWorker = require("tesseract.js/src/createWorker");
const turData = require("@tesseract.js-data/tur");

const [, , inputPath, outputPath, startArg = "1", endArg = startArg, scaleArg = "2"] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/ocr-pages.mjs <input.pdf> <output.json> [startPage] [endPage] [scale]");
  process.exit(1);
}

class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return { canvas, context };
  }

  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

const normalizeWhitespace = (value) =>
  value
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();

const main = async () => {
  const absoluteInput = path.resolve(inputPath);
  const absoluteOutput = path.resolve(outputPath);
  const startPage = Number.parseInt(startArg, 10);
  const endPage = Number.parseInt(endArg, 10);
  const scale = Number.parseFloat(scaleArg);
  const data = new Uint8Array(fs.readFileSync(absoluteInput));
  const pdf = await getDocument({ data, useSystemFonts: true }).promise;
  const canvasFactory = new NodeCanvasFactory();
  const worker = await createWorker("tur", 1, {
    langPath: turData.langPath,
    gzip: turData.gzip,
    cacheMethod: "none",
  });
  const pages = [];

  try {
    for (let pageNumber = startPage; pageNumber <= Math.min(endPage, pdf.numPages); pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
      await page.render({
        canvasContext: canvasAndContext.context,
        viewport,
        canvasFactory,
      }).promise;

      const image = canvasAndContext.canvas.toBuffer("image/png");
      const result = await worker.recognize(image);
      const text = normalizeWhitespace(result.data.text || "");
      pages.push({
        pageNumber,
        text,
        wordCount: text ? text.split(/\s+/).length : 0,
      });
      canvasFactory.destroy(canvasAndContext);
      console.log(`OCR ${pageNumber}/${endPage} -> ${text.slice(0, 120)}`);
    }
  } finally {
    await worker.terminate();
  }

  fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });
  fs.writeFileSync(
    absoluteOutput,
    JSON.stringify(
      {
        source: absoluteInput,
        startPage,
        endPage,
        scale,
        pages,
      },
      null,
      2,
    ),
    "utf8",
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
