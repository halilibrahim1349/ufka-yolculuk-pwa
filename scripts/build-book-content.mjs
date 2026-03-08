import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const rootDir = path.resolve(".");
const inputPath = path.join(rootDir, "data", "book-pages-ocr.json");
const outputPath = path.join(rootDir, "data", "book-content.js");
const sectionScriptPaths = [
  "data/quiz-data.js",
  "data/section-s123-fix.js",
  "data/section-s4.js",
  "data/section-s5.js",
  "data/section-s6.js",
  "data/section-s7.js",
  "data/section-s8.js",
  "data/section-s9.js",
].map((relativePath) => path.join(rootDir, relativePath));

const parsePageRange = (value) => {
  const match = String(value || "").match(/(\d+)\s*-\s*(\d+)/);
  if (!match) {
    return { start: null, end: null };
  }
  return {
    start: Number.parseInt(match[1], 10),
    end: Number.parseInt(match[2], 10),
  };
};

const cleanText = (value) =>
  String(value || "")
    .replace(/([A-Za-zÇĞİÖŞÜçğıöşüÂÎÛâîû])-\s+([A-Za-zÇĞİÖŞÜçğıöşüÂÎÛâîû])/gu, "$1$2")
    .replace(/\b\d+\s*\|\s*Yeni Yüzyılda Nasıl İnanmalı\??/giu, " ")
    .replace(/\b[A-ZÇĞİÖŞÜÂÎÛ' .-]{3,}\s*\|\s*\d+\b/gu, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();

const detectPrintedPageOffset = (pages) => {
  const firstMatch = pages.find((page) => /\|\s*(\d+)/.test(page.text || ""));
  if (!firstMatch) {
    return 0;
  }
  const match = String(firstMatch.text).match(/\|\s*(\d+)/);
  if (!match) {
    return 0;
  }
  const printedPage = Number.parseInt(match[1], 10);
  return printedPage - firstMatch.pageNumber;
};

const loadSections = () => {
  const context = vm.createContext({ window: {}, console });
  for (const scriptPath of sectionScriptPaths) {
    const source = fs.readFileSync(scriptPath, "utf8");
    vm.runInContext(source, context, { filename: scriptPath });
  }
  const sections = context.window?.UFKA_DATA?.sections;
  if (!Array.isArray(sections)) {
    throw new Error("UFKA_DATA.sections could not be loaded.");
  }
  return sections.map(({ id, title, shortTitle, pageRange, description, summary }) => ({
    id,
    title,
    shortTitle,
    pageRange,
    description,
    summary: Array.isArray(summary) ? summary : [],
    ...parsePageRange(pageRange),
  }));
};

const rawBook = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const sections = loadSections();
const printedPageOffset = detectPrintedPageOffset(rawBook.pages || []);

const pages = (rawBook.pages || []).map((page) => {
  const bookPage = page.pageNumber + printedPageOffset;
  const matchingSections = sections.filter(
    (section) =>
      Number.isInteger(section.start) &&
      Number.isInteger(section.end) &&
      bookPage >= section.start &&
      bookPage <= section.end,
  );

  return {
    id: `page-${page.pageNumber}`,
    pdfPage: page.pageNumber,
    bookPage,
    pageLabel: `Kitap s. ${bookPage}`,
    sectionIds: matchingSections.map((section) => section.id),
    sectionTitles: matchingSections.map((section) => section.title),
    text: cleanText(page.text),
    wordCount: page.wordCount || 0,
  };
});

const payload = {
  title: "Yeni Yuzyilda Nasil Inanmali?",
  subtitle: "Kitap OCR metni uygulama icine gomulu arama verisi",
  source: rawBook.source,
  sourcePageCount: rawBook.pageCount || rawBook.endPage || pages.length,
  printedPageOffset,
  generatedAt: new Date().toISOString(),
  sections: sections.map((section) => ({
    id: section.id,
    title: section.title,
    shortTitle: section.shortTitle,
    pageRange: section.pageRange,
    startPage: section.start,
    endPage: section.end,
    description: section.description,
    summary: section.summary,
  })),
  pages,
};

fs.writeFileSync(outputPath, `window.UFKA_BOOK_DATA = ${JSON.stringify(payload, null, 2)};\n`, "utf8");
console.log(
  JSON.stringify(
    {
      output: outputPath,
      sections: sections.length,
      pages: pages.length,
      printedPageOffset,
    },
    null,
    2,
  ),
);
