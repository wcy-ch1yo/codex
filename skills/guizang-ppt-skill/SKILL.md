---
name: guizang-ppt-skill
description: 生成原生、可编辑的 PowerPoint 演示文稿（.pptx），保留歸藏 PPT 的“电子杂志 × 电子墨水”和“瑞士国际主义”两套视觉系统、主题色与版式骨架。用于分享、演讲、发布会、课程展示、答辩和提案等需要原生 PPT 的场景；也用于把既有网页演示迁移为可编辑 PPTX。用户明确只要网页或 HTML 演示时不要使用本技能。
---

# 归藏 PPT · 原生 PowerPoint 版

> 来源识别：视觉系统与原始规范来自 [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill)，作者歸藏。本安装副本将默认交付物改成了原生 `.pptx`，但保留原技能的两种风格、主题色、网格、字号层级和版式语言。来源与赞助信息只用于确认出处，不要写进生成的演示文稿。

## 输出契约

这些是硬约束：

1. 默认输出一个真正的 `.pptx`，不是网页、PDF、长图或 HTML 套壳。
2. 16:9 画布。统一按 `1280 × 720` CSS px 设计；PowerPoint 导出时保持同比例。
3. 标题、正文、编号、线条、色块和简单图表必须是原生可编辑对象。禁止把整页渲染成一张图片再塞进 PPT。
4. 图片只承担照片、截图、插画或复杂信息图；不要在图片里重复页眉、页脚、页码、主标题或装饰边框。
5. 一份 deck 只能用风格 A 或风格 B 中的一种，不能混用字体与版式系统。
6. 每个正文页必须从登记版式中选择一页，并在构建计划里记录 `Lxx` / `Sxx`。不要临场发明第五种布局。
7. 每页写演讲者备注；有外部事实、数据或素材时，在备注末尾加入 `[Sources]`。

## 两套视觉系统

### 风格 A · 电子杂志 × 电子墨水（默认）

- 衬线标题、非衬线正文、等宽元数据；用字号和留白建立层级。
- 暖色纸感背景，克制的墨色，少量高亮。适合人文、观察、文化、品牌与故事型分享。
- 视觉基准：`assets/template.html`；主题：`references/themes.md`；版式：`references/layouts.md`。
- 原生 PPT 版用色块、细线和字重模拟“电子墨水”，不要试图在 PowerPoint 里复刻 WebGL 流体背景。

### 风格 B · 瑞士国际主义（Swiss Style）

- 全程无衬线；单一高饱和 accent 色；极致字号对比；12 栏网格；直角、纯色、细线、留给内容呼吸的负空间。
- 适合科技、产品、数据、研究、工程与设计类分享。
- 视觉基准：`assets/template-swiss.html`；主题：`references/themes-swiss.md`；版式锁：`references/swiss-layout-lock.md`；骨架：`references/layouts-swiss.md`。
- 原生 PPT 版可用点阵、极细网格和直角几何模拟背景，但不能加渐变、阴影、圆角或网页式浮层。

## 何时使用

适合：

- 需要可继续编辑、发给老师/同事、在 PowerPoint 或 WPS 里打开的演示文稿。
- 分享、演讲、发布会、课程作业、开题/答辩、提案和汇报。
- 需要把归藏风格的网页 deck 转成原生 PPTX。

不适合：

- 用户明确要求单文件 HTML、网页动画、观众屏同步或横向滑动网页。
- 需要大量交互、实时数据或复杂网页组件；这些应改用 HTML。

如果用户确实要网页版，明确说明将改用旧版 HTML 资源，不要把 HTML 当成 `.pptx` 交付。

## 工作流

### Step 0 · 更新策略

本安装副本是“PPT 原生版”，不要自动执行上游 `git pull`。上游默认仍是 HTML 工作流，直接更新会覆盖本地的 PPT 生成约定。只有用户明确要求同步上游视觉更新时，才先备份当前技能再处理。

### Step 1 · 需求澄清

如果用户已经给出主题、受众、用途和大致内容，直接进入规划；只对会改变结果的信息提问，一次最多问 1-3 个关键问题。用户没有提供时，按以下默认值推进并说明假设：

| 维度 | 默认 |
|---|---|
| 风格 | A · 电子杂志风；技术/数据内容优先 B |
| 时长 | 15 分钟约 10-12 页；20 分钟约 14-16 页；30 分钟约 20-24 页 |
| 受众 | 普通大学生/跨专业听众，少术语，多类比 |
| 主题色 | 风格 A 用墨水经典；风格 B 用克莱因蓝 IKB |
| 备注 | 每页 2-5 条提词卡式要点，不写逐字稿 |

需要确认的 6 件事：

1. 风格 A 还是 B？
2. 受众、场景和交流目标是什么？
3. 页数与时长？
4. 有没有原始资料、旧 PPT、图片或截图？
5. 主题色选哪套？
6. 有没有必须出现或不能出现的内容？

选择主题色时只从预设中挑，不接受随意自定义 hex。需要推荐时：A 默认墨水经典，B 默认克莱因蓝；技术内容用 A 的靛蓝瓷或 B 的克莱因蓝。

### Step 2 · 先写叙事，再排版

为整份 deck 写一句话目标：

> 到最后一页，**谁**应该**理解/相信/决定什么**，因为**什么核心结论**。

再列页面计划。每页至少包含：

| 页码 | 章节 | 版式 ID | 页面目的 | 观众看到的主结论 | 备注要点 | 建议时长 |
|---|---|---|---|---|---|---:|

叙事优先使用：钩子 → 背景与冲突 → 机制/证据 → 转折 → 收束/未来。不要用“目录 + 若干并列知识点 + 谢谢”替代论证。

风格 B 的正文页只能使用 `S01-S22`；封面与收尾可用 IKB 封面/左侧 IKB 收尾。风格 A 使用 `L01-L10`。7-8 页至少使用 6 种不同版式；10 页以上至少使用 8 种；连续 3 页不要使用同一种主体结构。

同时规划主题节奏：`hero dark` / `hero light` / `light` / `dark` 交替，不能整份 deck 只有白底正文页。

### Step 3 · 读对应的视觉规范

开始构建前必须阅读：

- 所有任务：`references/pptx-native.md`。
- 风格 A：`references/themes.md`、`references/layouts.md`，并查看 `assets/template.html` 的 `<style>`。
- 风格 B：`references/themes-swiss.md`、`references/swiss-layout-lock.md`、`references/layouts-swiss.md`，并查看 `assets/template-swiss.html` 的 `<style>`。
- 风格 B 的 S08 地点/路线内容：`references/swiss-map-component.md`。PPT 版用静态地图图片或简化路径图承载地理信息，点位、标签和连线仍用原生对象，不实现 MapLibre 交互。
- 图片：`references/image-prompts.md`；用户截图：`references/screenshot-framing.md`。
- 正式演讲：`references/presenter-mode.md` 只取内容结构；网页演讲者 UI 不再适用。

HTML 模板在本版本中是 golden source，只用于读取颜色、字体、间距、网格和版式骨架。不要修改 HTML 后把它当交付物。

### Step 4 · 用原生 PowerPoint 构建

遵循 `presentations` 技能的原生 PPTX 工作流：使用 `@oai/artifact-tool` 的 JavaScript ESM API，不能用 Python 绘制幻灯片或生成旧式 PPT。先确认运行时依赖，再在临时构建目录写项目专用的 `build-deck.mjs`。

如果当前环境无法解析 `@oai/artifact-tool`，明确报告运行时阻塞；不要退回 HTML、整页图片或 `python-pptx` 假交付。

可以复制 `scripts/pptx-core.mjs` 到构建目录，直接复用其中的画布、主题、网格、文字、形状、页眉页脚、备注和审计助手。不要在每份 deck 里重新发明坐标系统。`pptx-core.mjs`、`render-pptx.mjs` 和 `audit-pptx.mjs` 都从当前工作目录解析 `@oai/artifact-tool`，所以应在已经配置好运行时依赖的构建目录中运行。

每个页面函数应：

1. 选择登记版式并建立统一内容框。
2. 先放背景色块、页眉、页脚和分隔线，再放内容。
3. 用 `name` 给文字框和关键图形稳定命名，方便后续检查和修改。
4. 保持文本可编辑；不要在图片里写标题或正文。
5. 需要图片时只放入版式指定的图片槽位，并保留清晰的裁切安全区。
6. 用 `slide.speakerNotes.textFrame.setText([...])` 写备注与来源。
7. 输出前运行项目内的几何审计，不要靠“看起来应该能装下”。

### Step 5 · 演讲备注

每页备注默认 2-5 条，结构如下：

- 这一页在全场中的任务。
- 观众看不到但需要听到的解释、例子或判断依据。
- 与下一页的连接。
- `[Sources]`：外部数据、图片、引文和关键史实来源；没有外部来源可省略。

不要让备注出现在页面上，也不要把“讲解稿/时间分配/设计说明”写进观众可见文本。

### Step 6 · 质量检查

交付前必须完成：

1. 导出所有页面的 PNG，逐页看文字换行、裁切、重叠、留白、对齐和颜色。
2. 打开 PPTX，确认它是 16:9，且文字与图形可以直接编辑。
3. 运行：

```bash
node scripts/audit-pptx.mjs <deck.pptx>
node scripts/render-pptx.mjs <deck.pptx> <preview-dir>
```

4. 如果环境里可用 `slides_test.py`，再对最终 `.pptx` 跑一次溢出检测。
5. 检查每页是否有版式 ID 对应的结构、主题色是否只有一套、页面标题是否一致、来源是否写入备注。
6. 修正所有无意的重叠、越界、空占位、缺行、错字和图片变形后才交付。

只做代码检查不算完成；必须看最终渲染页。contact sheet 只用于看整体节奏，不代替逐页检查。

## 原生 PPT 的转译原则

### 画布与网格

- 画布：`1280 × 720`，左右安全边距 `64px`，顶部 `40px`，底部页脚安全线约 `680px`。
- 12 栏网格：内容宽 `1152px`，栏间距 `24px`；所有标题、图片和卡片优先吸附网格。
- 8px 间距基线；常用间距 `8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80px`。
- 页面右上角用短 meta 和页码，不要做网页导航条或可点击控件。

### 字体与字号

- 风格 A：标题用 `Noto Serif SC`（缺失时用系统宋体），正文用 `Microsoft YaHei` / `Arial`。
- 风格 B：全部无衬线，中文用 `Microsoft YaHei`，数字和英文用 `Arial`；不要出现衬线标题。
- 推荐层级：封面主标题 72-108px；章节页标题 56-72px；正文页标题 40-56px；小标题 24-32px；正文 18-22px；meta 12-14px。
- 中文标题先看字数，再决定字号；标题太长先改文案或换版式，不要把正文压到 14px 以下。

### 形状与颜色

- 风格 B 只用直角矩形、细线、点阵和单一 accent。禁止渐变、阴影、圆角和半透明卡片叠层。
- 风格 A 可以保留纸感底色、细规则线和少量边框；不要做玻璃拟态、发光或网页式悬浮阴影。
- accent 只用主题预设中的一个；若 accent 色本身很深（如 IKB），其色块上使用白色文字。

### 图片

- 单张主图优先 `S22` 的 21:9 顶部条带；多图优先 `S15/S16` 的统一图片格。
- 照片或人物图先确定槽位，再裁切；主体不要被标题、caption 或页脚压住。
- 信息截图和 UI 图使用 `contain` 或保留完整信息；照片可用 `cover`，但统一安全区。
- 图片必须是素材，不要让图片内部自带标题、页码、logo、边框或页脚。

### 动画与网页功能

- 原生 PPT 中优先保持静态最终态；可以加少量 PowerPoint 入场动画，但不要模拟 WebGL、滚动视差、鼠标跟随、观众屏同步或网页演讲者面板。
- 页面需要一个明确的主视觉层级；不要用“每页同一套淡入”代替版式设计。

## 版式索引

风格 B：严格使用 `S01-S22`（详见 `references/swiss-layout-lock.md` 与 `references/pptx-native.md`）。

风格 A：使用 `L01-L10`：

1. 开场封面
2. 章节幕封
3. 数据大字报
4. 左文右图
5. 图片网格
6. 两列流水线
7. 悬念/问题页
8. 大引用页
9. 并列对比
10. 图文混排

## 资源导览

```text
guizang-ppt-skill/
├── SKILL.md                       ← 本文件的默认交付约定（PPTX）
├── assets/
│   ├── template.html              ← 风格 A 视觉 golden source（只读参考）
│   ├── template-swiss.html        ← 风格 B 视觉 golden source（只读参考）
│   └── screenshot-backgrounds/    ← 截图背景素材
├── scripts/
│   ├── pptx-core.mjs              ← 原生 PPT 令牌、画布、网格、文字/形状、备注与审计
│   ├── render-pptx.mjs            ← 逐页渲染 PNG + contact sheet
│   └── audit-pptx.mjs             ← 几何越界、文字框重叠和页数检查
└── references/
    ├── pptx-native.md             ← PPT 画布、组件、版式和构建约定（必读）
    ├── themes.md                  ← 风格 A 5 套主题
    ├── themes-swiss.md            ← 风格 B 4 套主题
    ├── layouts.md                 ← 风格 A 版式骨架
    ├── swiss-layout-lock.md       ← 风格 B 22 页版式锁
    ├── layouts-swiss.md           ← 风格 B 版式细节
    ├── image-prompts.md           ← 配图提示词
    ├── screenshot-framing.md      ← 截图适配
    ├── presenter-mode.md          ← 备注结构参考（网页 UI 不适用于 PPTX）
    └── checklist.md               ← 视觉检查清单（按 PPTX 章节执行）
```

## 参考作品与来源

风格 A 对齐 *Monocle* 杂志式排版、电子墨水质感和留白；风格 B 对齐 Massimo Vignelli、Josef Müller-Brockmann 的网格系统以及 *Helvetica Forever* 的无衬线语言。

视觉规范与原始模板来自 `op7418/guizang-ppt-skill`。本版本只改变交付技术栈，不改变两套风格的视觉意图。
