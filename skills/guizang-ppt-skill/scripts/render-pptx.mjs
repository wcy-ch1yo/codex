import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const requireFromCwd = createRequire(path.join(process.cwd(), "package.json"));
const artifactToolPath = requireFromCwd.resolve("@oai/artifact-tool");
const { FileBlob, PresentationFile } = await import(pathToFileURL(artifactToolPath).href);

const [inputPath, outputDir] = process.argv.slice(2);
if (!inputPath || !outputDir) {
  console.error("Usage: node render-pptx.mjs <deck.pptx> <preview-dir>");
  process.exit(1);
}

const deck = await PresentationFile.importPptx(await FileBlob.load(inputPath));
await fs.mkdir(outputDir, { recursive: true });

let count = 0;
for (const slide of deck.slides.items) {
  count += 1;
  const png = await deck.export({ slide, format: "png", scale: 2 });
  const name = `slide-${String(count).padStart(2, "0")}.png`;
  await fs.writeFile(path.join(outputDir, name), new Uint8Array(await png.arrayBuffer()));
}

const montage = await deck.export({ format: "webp", montage: true, scale: 1 });
await fs.writeFile(path.join(outputDir, "deck-contact-sheet.webp"), new Uint8Array(await montage.arrayBuffer()));
console.log(`rendered ${count} slides -> ${outputDir}`);
