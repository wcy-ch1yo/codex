import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const requireFromCwd = createRequire(path.join(process.cwd(), "package.json"));
const artifactToolPath = requireFromCwd.resolve("@oai/artifact-tool");
const { FileBlob, PresentationFile } = await import(pathToFileURL(artifactToolPath).href);

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node audit-pptx.mjs <deck.pptx>");
  process.exit(1);
}

const deck = await PresentationFile.importPptx(await FileBlob.load(inputPath));
const snapshot = await deck.inspect({ kind: "slide,textbox,shape,notes", maxChars: 500000 });
const records = String(snapshot.ndjson || "")
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const geometry = records.filter((record) => record.name && (record.bbox || record.position));
const textboxes = geometry.filter((record) => record.kind === "textbox");
const notesBySlide = new Map(
  records.filter((record) => record.kind === "notes").map((record) => [record.slide, record.text || ""]),
);
const boxOf = (record) => record.bbox
  ? { left: record.bbox[0], top: record.bbox[1], width: record.bbox[2], height: record.bbox[3] }
  : record.position;
const bySlide = new Map();
for (const record of geometry) {
  const slideNumber = record.slideNumber ?? record.slide ?? record.slideIndex ?? "?";
  if (!bySlide.has(slideNumber)) bySlide.set(slideNumber, []);
  bySlide.get(slideNumber).push(record);
}

let findings = 0;
for (let slideNumber = 1; slideNumber <= deck.slides.items.length; slideNumber += 1) {
  if (!notesBySlide.get(slideNumber)?.trim()) {
    console.log(`slide ${slideNumber}: speaker notes are empty`);
    findings += 1;
  }
}
for (const textbox of textboxes) {
  if (/\[必填\]|\{\{|TODO|TBD/.test(String(textbox.text || ""))) {
    console.log(`slide ${textbox.slide ?? "?"}: unresolved placeholder in "${textbox.name}"`);
    findings += 1;
  }
}
for (const [slideNumber, items] of bySlide) {
  const texts = items.filter((record) => record.kind === "textbox");
  for (let i = 0; i < texts.length; i += 1) {
    for (let j = i + 1; j < texts.length; j += 1) {
      const a = texts[i];
      const b = texts[j];
      const aBox = boxOf(a);
      const bBox = boxOf(b);
      const overlapX = Math.min(aBox.left + aBox.width, bBox.left + bBox.width) - Math.max(aBox.left, bBox.left);
      const overlapY = Math.min(aBox.top + aBox.height, bBox.top + bBox.height) - Math.max(aBox.top, bBox.top);
      if (overlapX > 2 && overlapY > 2) {
        console.log(`slide ${slideNumber}: textbox overlap "${a.name}" x "${b.name}" (${Math.round(overlapX)}x${Math.round(overlapY)}px)`);
        findings += 1;
      }
    }
  }
  for (const item of items) {
    const box = boxOf(item);
    const right = box.left + box.width;
    const bottom = box.top + box.height;
    if (box.left < -1 || box.top < -1 || right > 1281 || bottom > 721) {
      console.log(`slide ${slideNumber}: out of canvas "${item.name}" [${box.left},${box.top},${right},${bottom}]`);
      findings += 1;
    }
  }
}

console.log(`slides: ${deck.slides.items.length}; textboxes: ${textboxes.length}; findings: ${findings}`);
if (!deck.slides.items.length) {
  console.error("deck has no slides");
  process.exitCode = 1;
} else if (findings) {
  process.exitCode = 2;
}
