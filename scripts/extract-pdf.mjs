import fs from "node:fs";
import path from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/extract-pdf.mjs <input.pdf> <output.json>");
  process.exit(1);
}

const normalizeWhitespace = (value) =>
  value
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();

const main = async () => {
  const absoluteInput = path.resolve(inputPath);
  const absoluteOutput = path.resolve(outputPath);
  const data = new Uint8Array(fs.readFileSync(absoluteInput));
  const loadingTask = getDocument({
    data,
    disableFontFace: true,
    useSystemFonts: true,
  });
  const pdf = await loadingTask.promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const text = normalizeWhitespace(
      textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .filter(Boolean)
        .join(" "),
    );

    pages.push({
      pageNumber,
      text,
      wordCount: text ? text.split(/\s+/).length : 0,
    });
  }

  fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });
  fs.writeFileSync(
    absoluteOutput,
    JSON.stringify(
      {
        source: absoluteInput,
        pageCount: pdf.numPages,
        pages,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        source: absoluteInput,
        pageCount: pdf.numPages,
        output: absoluteOutput,
      },
      null,
      2,
    ),
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
