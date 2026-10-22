import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const requireFromCwd = createRequire(path.join(process.cwd(), "package.json"));
const artifactToolPath = requireFromCwd.resolve("@oai/artifact-tool");
const { Presentation, PresentationFile } = await import(pathToFileURL(artifactToolPath).href);

export const CANVAS = Object.freeze({
  width: 1280,
  height: 720,
  margin: 64,
  contentWidth: 1152,
  top: 40,
  contentTop: 92,
  contentBottom: 640,
  footerRule: 676,
  footerText: 684,
  safeBottom: 696,
});

export const SP = Object.freeze({
  1: 8,
  2: 12,
  3: 16,
  4: 24,
  5: 32,
  6: 40,
  7: 48,
  8: 64,
  9: 80,
  10: 96,
  11: 160,
});

export const FONT = Object.freeze({
  serifZh: "Noto Serif SC",
  sansZh: "Microsoft YaHei",
  sans: "Arial",
  mono: "Arial",
});

const SWISS_BASE = Object.freeze({
  paper: "#FAFAF8",
  ink: "#0A0A0A",
  grey1: "#F0F0EE",
  grey2: "#D4D4D2",
  grey3: "#737373",
  line: "#E0E0E0",
  text2: "#525252",
  white: "#FFFFFF",
  card: "#F0F0EE",
});

export const SWISS_THEMES = Object.freeze({
  ikb: Object.freeze({ ...SWISS_BASE, name: "克莱因蓝 IKB", accent: "#002FA7", accentOn: "#FFFFFF", accentBright: "#5B7BFF" }),
  lemon: Object.freeze({ ...SWISS_BASE, name: "柠檬黄", accent: "#FFD500", accentOn: "#0A0A0A", accentBright: "#FFE45C" }),
  green: Object.freeze({ ...SWISS_BASE, name: "柠檬绿", accent: "#C5E803", accentOn: "#0A0A0A", accentBright: "#DFF45A" }),
  orange: Object.freeze({ ...SWISS_BASE, name: "安全橙", accent: "#FF6B35", accentOn: "#FFFFFF", accentBright: "#FF8B62" }),
});

export const MAGAZINE_THEMES = Object.freeze({
  ink: Object.freeze({ name: "墨水经典", ink: "#0A0A0B", paper: "#F1EFEA", tint: "#E8E5DE", inkTint: "#18181A" }),
  indigo: Object.freeze({ name: "靛蓝瓷", ink: "#0A1F3D", paper: "#F1F3F5", tint: "#E4E8EC", inkTint: "#152A4A" }),
  forest: Object.freeze({ name: "森林墨", ink: "#1A2E1F", paper: "#F5F1E8", tint: "#ECE7DA", inkTint: "#253D2C" }),
  kraft: Object.freeze({ name: "牛皮纸", ink: "#2A1E13", paper: "#EEDFC7", tint: "#E0D0B6", inkTint: "#3A2A1D" }),
  dune: Object.freeze({ name: "沙丘", ink: "#1F1A14", paper: "#F0E6D2", tint: "#E3D7BF", inkTint: "#2D2620" }),
});

export function normalizeStyle(style) {
  const value = String(style || "swiss").toLowerCase();
  if (["a", "magazine", "editorial", "journal"].includes(value)) return "magazine";
  if (["b", "swiss", "international"].includes(value)) return "swiss";
  throw new Error(`Unknown style: ${style}`);
}

export function getTheme(style, theme) {
  const normalizedStyle = normalizeStyle(style);
  const key = String(theme || (normalizedStyle === "swiss" ? "ikb" : "ink")).toLowerCase();
  if (normalizedStyle === "swiss") {
    const tokens = SWISS_THEMES[key];
    if (!tokens) throw new Error(`Unknown Swiss theme: ${theme}`);
    return { ...tokens, style: "swiss", key };
  }
  const tokens = MAGAZINE_THEMES[key];
  if (!tokens) throw new Error(`Unknown magazine theme: ${theme}`);
  return {
    ...tokens,
    style: "magazine",
    key,
    accent: tokens.inkTint,
    accentOn: tokens.paper,
    accentBright: tokens.inkTint,
    grey1: tokens.tint,
    grey2: "#CFC8BC",
    grey3: "#726A5F",
    line: "#D6CFC3",
    text2: "#4A443C",
    white: "#FFFFFF",
    card: tokens.tint,
  };
}

export function colSpan(start, span, options = {}) {
  const gap = options.gap ?? 24;
  const left = options.left ?? CANVAS.margin;
  const width = options.width ?? CANVAS.contentWidth;
  if (!Number.isInteger(start) || start < 1 || start > 12) throw new RangeError("start must be 1..12");
  if (!Number.isInteger(span) || span < 1 || start + span - 1 > 12) throw new RangeError("span does not fit the 12-column grid");
  const column = (width - 11 * gap) / 12;
  return {
    left: Math.round(left + (start - 1) * (column + gap)),
    width: Math.round(span * column + (span - 1) * gap),
  };
}

export function equalCols(count, options = {}) {
  const gap = options.gap ?? 24;
  const left = options.left ?? CANVAS.margin;
  const width = options.width ?? CANVAS.contentWidth;
  if (!Number.isInteger(count) || count < 1 || count > 12) throw new RangeError("count must be 1..12");
  const column = (width - (count - 1) * gap) / count;
  return Array.from({ length: count }, (_, index) => ({
    left: Math.round(left + index * (column + gap)),
    width: Math.round(column),
  }));
}

export function equalRows(count, options = {}) {
  const gap = options.gap ?? 24;
  const top = options.top ?? CANVAS.contentTop;
  const bottom = options.bottom ?? CANVAS.contentBottom;
  if (!Number.isInteger(count) || count < 1) throw new RangeError("count must be a positive integer");
  const available = bottom - top - (count - 1) * gap;
  const height = available / count;
  return Array.from({ length: count }, (_, index) => ({
    top: Math.round(top + index * (height + gap)),
    height: Math.round(height),
  }));
}

export function makeBox(left, top, width, height) {
  return { left: Math.round(left), top: Math.round(top), width: Math.round(width), height: Math.round(height) };
}

function approxTextWidth(text, size) {
  let width = 0;
  for (const ch of String(text)) {
    if (ch === "\n") continue;
    width += /[\u3000-\u9fff\uff00-\uffef]/.test(ch) ? size : size * 0.56;
  }
  return width;
}

function approxLines(text, size, width) {
  return String(text)
    .split("\n")
    .reduce((total, line) => total + Math.max(1, Math.ceil(approxTextWidth(line, size) / Math.max(1, width - 8))), 0);
}

export class DeckKit {
  constructor({ style = "swiss", theme, title = "Guizang deck" } = {}) {
    this.style = normalizeStyle(style);
    this.tokens = getTheme(this.style, theme);
    this.fonts = FONT;
    this.title = title;
    this.deck = Presentation.create({ slideSize: { width: CANVAS.width, height: CANVAS.height } });
    this.slideNo = 0;
    this.slideNames = new Map();
    this.textEntries = [];
    this.shapeEntries = [];
  }

  slide({ background = this.tokens.paper, name } = {}) {
    const slide = this.deck.slides.add();
    slide.background.fill = background;
    this.slideNo += 1;
    if (name) this.slideNames.set(this.slideNo, name);
    return slide;
  }

  trackShape(slide, name, box) {
    this.shapeEntries.push({ slide: this.slideNo, name, ...box });
  }

  shape(slide, name, config) {
    const shape = slide.shapes.add({ geometry: config.geometry || "rect", name, ...config });
    this.trackShape(slide, name, config.position);
    return shape;
  }

  text(slide, name, x, y, w, h, value, options = {}) {
    const box = makeBox(x, y, w, h);
    const shape = slide.shapes.add({
      geometry: "textbox",
      name,
      position: box,
      fill: "none",
      line: { style: "solid", fill: "none", width: 0 },
    });
    shape.text = String(value ?? "");
    const resolved = {
      typeface: options.typeface ?? (this.style === "magazine" && options.serif ? FONT.serifZh : FONT.sansZh),
      fontSize: options.fontSize ?? 20,
      color: options.color ?? this.tokens.ink,
      lineSpacing: options.lineSpacing ?? 1.35,
      alignment: options.alignment ?? "left",
      verticalAlignment: options.verticalAlignment ?? "top",
      wrap: options.wrap ?? "square",
      ...(options.bold === undefined ? {} : { bold: options.bold }),
      ...(options.italic === undefined ? {} : { italic: options.italic }),
    };
    shape.text.style = resolved;
    this.trackShape(slide, name, box);
    if (options.audit !== false) {
      this.textEntries.push({ slide: this.slideNo, name, ...box, value: String(value ?? ""), size: resolved.fontSize, lead: resolved.lineSpacing });
    }
    return shape;
  }

  rect(slide, name, x, y, w, h, fill, options = {}) {
    return this.shape(slide, name, {
      geometry: options.geometry || "rect",
      position: makeBox(x, y, w, h),
      fill,
      line: options.lineColor && options.lineColor !== "none"
        ? { style: "solid", fill: options.lineColor, width: options.lineWidth ?? 1 }
        : { style: "solid", fill: "none", width: 0 },
    });
  }

  rule(slide, name, x, y, width, options = {}) {
    return this.rect(slide, name, x, y, width, options.thickness ?? 1, options.color ?? this.tokens.line);
  }

  vrule(slide, name, x, y, height, options = {}) {
    return this.rect(slide, name, x, y, options.thickness ?? 1, height, options.color ?? this.tokens.line);
  }

  ellipse(slide, name, x, y, w, h, fill, options = {}) {
    return this.shape(slide, name, {
      geometry: "ellipse",
      position: makeBox(x, y, w, h),
      fill,
      line: options.lineColor && options.lineColor !== "none"
        ? { style: "solid", fill: options.lineColor, width: options.lineWidth ?? 1 }
        : { style: "solid", fill: "none", width: 0 },
    });
  }

  chrome(slide, { left = "", right = "", dark = false, rule = true, leftWidth = 760 } = {}) {
    const color = dark ? this.tokens.paper : this.tokens.grey3;
    this.text(slide, `chrome-left-${this.slideNo}`, CANVAS.margin, CANVAS.top, leftWidth, 18, left, {
      typeface: FONT.mono, fontSize: 13, color, lineSpacing: 1, audit: false,
    });
    this.text(slide, `chrome-right-${this.slideNo}`, 900, CANVAS.top, 316, 18, right, {
      typeface: FONT.mono, fontSize: 13, color, alignment: "right", lineSpacing: 1, audit: false,
    });
    if (rule) this.rule(slide, `chrome-rule-${this.slideNo}`, CANVAS.margin, 64, CANVAS.contentWidth, { color: dark ? "#FFFFFF55" : this.tokens.line });
  }

  foot(slide, { left = "", right = "", dark = false } = {}) {
    const color = dark ? this.tokens.paper : this.tokens.grey3;
    this.rule(slide, `foot-rule-${this.slideNo}`, CANVAS.margin, CANVAS.footerRule, CANVAS.contentWidth, { color: dark ? "#FFFFFF44" : this.tokens.line });
    this.text(slide, `foot-left-${this.slideNo}`, CANVAS.margin, CANVAS.footerText, 800, 18, left, {
      typeface: FONT.mono, fontSize: 12, color, lineSpacing: 1, audit: false,
    });
    this.text(slide, `foot-right-${this.slideNo}`, 960, CANVAS.footerText, 256, 18, right, {
      typeface: FONT.mono, fontSize: 12, color, alignment: "right", lineSpacing: 1, audit: false,
    });
  }

  notes(slide, lines) {
    const notes = Array.isArray(lines) ? [...lines] : [String(lines)];
    const layoutName = this.slideNames.get(this.slideNo);
    if (layoutName && !notes.some((line) => String(line).startsWith("[Layout]"))) {
      notes.unshift(`[Layout] ${layoutName}`);
    }
    slide.speakerNotes.textFrame.setText(notes);
    return slide;
  }

  audit() {
    const problems = [];
    for (const entry of this.textEntries) {
      const lines = approxLines(entry.value, entry.size, entry.width);
      const needed = lines * entry.size * entry.lead;
      if (needed > entry.height + 6) {
        problems.push(`slide ${entry.slide}: "${entry.name}" needs ~${Math.round(needed)}px in ${entry.height}px (${lines} lines, ${entry.size}px)`);
      }
    }
    for (let i = 0; i < this.textEntries.length; i += 1) {
      for (let j = i + 1; j < this.textEntries.length; j += 1) {
        const a = this.textEntries[i];
        const b = this.textEntries[j];
        if (a.slide !== b.slide) continue;
        const ox = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
        const oy = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);
        if (ox > 2 && oy > 2) problems.push(`slide ${a.slide}: textbox collision "${a.name}" x "${b.name}" (${Math.round(ox)}x${Math.round(oy)}px)`);
      }
    }
    for (const entry of this.shapeEntries) {
      if (entry.left < -1 || entry.top < -1 || entry.left + entry.width > CANVAS.width + 1 || entry.top + entry.height > CANVAS.height + 1) {
        problems.push(`slide ${entry.slide}: out of canvas "${entry.name}" [${entry.left},${entry.top},${entry.left + entry.width},${entry.top + entry.height}]`);
      }
    }
    return problems;
  }

  printAudit() {
    const problems = this.audit();
    if (problems.length) {
      console.log(`layout audit: ${problems.length} finding(s)`);
      for (const problem of problems) console.log(`  - ${problem}`);
    } else {
      console.log("layout audit: clean");
    }
    return problems;
  }

  async save(outputPath, { audit = true } = {}) {
    const findings = audit ? this.printAudit() : [];
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    const pptx = await PresentationFile.exportPptx(this.deck);
    await pptx.save(outputPath);
    console.log(`built ${this.deck.slides.items.length} slides -> ${outputPath}`);
    return findings;
  }
}

export function createDeckKit(options = {}) {
  return new DeckKit(options);
}
