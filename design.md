---
name: Coya's Site — PersonalWebsite
description: 内容优先的个人站：日记、博客、学习笔记、项目与方法论，Stripe Press 气质的编辑式排版。
# ── 机器可读 token。这些是**规范层**（normative），下面正文只提供应用语境。 ──
# 全部取自 app/globals.css 里**实际生效**的那套 :root（见 Overview 的陷阱说明）。
colors:
  background: "#f3f5f2"
  surface: "#ffffff"
  surface-soft: "#e9ece8"
  surface-hover: "#e1e5df"
  text: "#11130f"
  text-secondary: "#50554d"
  muted: "#7b8278"
  accent: "#3157ff"
  accent-hover: "#1538d8"
typography:
  body:
    fontFamily: "\"Avenir Next\", Avenir, \"Helvetica Neue\", \"PingFang SC\", sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  brand-label:
    fontFamily: "\"Arial Narrow\", \"Avenir Next Condensed\", sans-serif"
    fontSize: "13px"
    fontWeight: 800
    letterSpacing: "0.12em"
  code:
    fontFamily: "\"SF Mono\", \"Fira Code\", \"Fira Mono\", \"Roboto Mono\", Menlo, Monaco, Consolas, monospace"
  readout:
    fontFamily: "\"Avenir Next\", Avenir, \"Helvetica Neue\", \"PingFang SC\", sans-serif"
    fontSize: "clamp(56px, 12vw, 96px)"
    fontWeight: 600
    letterSpacing: "-0.04em"
rounded:
  control: "10px"
  card: "18px"
  pill: "9999px"
spacing:
  unit: "4px"
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-5: "24px"
  space-6: "32px"
  space-7: "40px"
  space-8: "48px"
  space-9: "64px"
  space-10: "96px"
elevation:
  border: "0 0 0 1px rgba(17, 19, 15, 0.09)"
  card: "0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 2px rgba(0, 0, 0, 0.04)"
motion:
  fast: "150ms ease"
  smooth: "200ms cubic-bezier(.175, .885, .32, 1.1)"
layout:
  container: "1200px"
  headerHeight: "68px"
---

## Overview

PersonalWebsite 是一个**内容优先**的个人站，不是产品营销页。绝大多数页面属于 DESIGN.md 意义上的
**Read** 模式（日记 68 篇、博客 57 篇、学习笔记、周记）——结构为理解服务，排版的职责是让人愿意多待一会儿。
唯一的 **Experience** 模式页面是 `/gallery`（AI 生图作品集）：作品主导，界面后退。

视觉方向是 Stripe Press 气质的编辑式排版：克制的暖灰底、单一交互色、以「阴影当边框」代替 CSS border、
大量留白、衬线/窄体混排的层级感。

> ### ⚠️ 陷阱：`app/globals.css` 里有两个 `:root`，只有第二个生效
>
> **第一个 `:root` 不是"死代码"，而是被部分覆盖。** 实测：它声明 33 个 token，
> 其中 **15 个被第二个 `:root` 覆盖**，另外 **18 个仍然生效** —— 包括全部
> `--space-1`…`--space-10`、`--transition-fast`、`--transition-smooth`、
> `--radius-pill`、`--container`、`--shadow-border-strong`、`--shadow-menu`、
> `--shadow-modal`、`--noise-opacity`。
> 所以「往第一个里加 token」有时生效有时不生效 —— **新 token 一律加第二个 `:root`**。
>
> 被覆盖的 15 个：`--background` `--surface` `--surface-soft` `--surface-hover`
> `--text` `--text-secondary` `--muted` `--accent` `--accent-hover`
> `--shadow-border` `--shadow-card` `--radius` `--radius-card` `--header-height`
> `--focus-ring`。
>
> 历史坑（**已修**，2026-09-20）：`--focus-ring` 原先只在第一个 `:root` 里定义，
> 用的是旧主题蓝 `#0072F5`，而第二个 `:root` 覆盖颜色时漏了它 —— 全站 18 处焦点环
> 的蓝和 `--accent` 不是同一个蓝。现已补进第二个 `:root`，白环也改用 `--surface`。
>
> **正文字体同样被后面一条 `html` 规则覆盖**，实际是
> `"Avenir Next", Avenir, "Helvetica Neue", "PingFang SC"` ——
> 文件前部那条 `font-family: Inter` 的 `html` 规则**不在渲染**。
> 因此 impeccable 在旧行号 75 报的 `overused-font (Inter)` 是对**失效声明**的误报。

**无暗色模式**：`color-scheme: light`，全站只有 `@media (prefers-reduced-motion: reduce)` 一个媒体偏好分支。
新增样式不需要写暗色变体，但**必须**为动效提供 reduced-motion 降级。

## Colors

九个颜色，全部走 CSS 变量，组件里不写死色值。

| Token | 值 | 用途 |
|---|---|---|
| `--background` | `#f3f5f2` | 页面底色（暖灰，不是纯白） |
| `--surface` | `#ffffff` | 卡片 / 面板 |
| `--surface-soft` | `#e9ece8` | 次级块、chip、进度槽、输入框 |
| `--surface-hover` | `#e1e5df` | hover 态背景 |
| `--text` | `#11130f` | 正文与标题 |
| `--text-secondary` | `#50554d` | 次级正文、摘要 |
| `--muted` | `#7b8278` | 元信息、标签、时间 |
| `--accent` | `#3157ff` | **唯一的交互色** |
| `--accent-hover` | `#1538d8` | accent 的 hover |

**铁律：`--accent` 是全站唯一的交互色。** 不要引入第二个彩色。需要强调非交互内容时，
用 `--text` 的加粗或 `--surface-soft` 的底，不要用彩色。

正文色是 `#11130f`（带绿倾向的近黑），**不是纯黑** —— 这是暖灰底上唯一可读的组合。

## Typography

三种角色，各司其职：

- **正文**：`"Avenir Next", Avenir, "Helvetica Neue", "PingFang SC"`（由文件后部的
  `html` 规则设定，**不是**文件前部那条 `Inter`），16px / 1.55。用于所有正文、标题、摘要。
- **窄体标签**：`"Arial Narrow", "Avenir Next Condensed"`，13px / 800 / `letter-spacing: 0.12em` /
  大写。用于 `.brand`、section label（`about-section-label` 这类）、工具卡 meta。
  **这是刻意的排版语汇，不是随手选的**：窄体大写给"标签/编号"提供和正文完全不同的质感，
  在一屏里形成"印刷品"的层级。
- **等宽**：`"SF Mono"` 系列，用于代码与键盘提示（`kbd`）。

**数字对齐**：任何会随时间跳动的数字（计时器读数、统计值）必须加
`font-variant-numeric: tabular-nums`，否则等宽不足会让整串数字横向抖动。

标题字重 600、负字距（`-0.02em` 到 `-0.0475em`），只对大字号使用；正文不加负字距。

## Layout

- 容器：`--container: 1200px`；页面外壳用 `.page-shell`，窄版加 `.narrow`。
- 间距：4px 基数，`--space-1` … `--space-10`（4 → 96px）。**只用这些 token，不写裸 px。**
- 区块：`.page-header`（页头）+ `.about-subsection` / `.content-section`（内容段）+
  `.collection-list`（集合页骨架）。
- 页头吸顶：`.site-header` 是 `position: sticky; top: 12px` 的胶囊条，高度 `--header-height`。
- 栅格：优先 `grid-template-columns: repeat(auto-fit, minmax(<最小可读宽>, 1fr))`，
  尽量避免写死列数。

**反模式**：连续纵向堆叠形状相同的模块会读成"清单/简历"。需要打破时用横向画廊
（见 `/about` 的 `ProjectRail`）或错落的网格，而不是换配色。

## Elevation & Depth

**核心手法：阴影当边框。** 站点不用 `border` 表达边界，一律用 `box-shadow` 的 1px 展开：

- `--shadow-border`: `0 0 0 1px rgba(17, 19, 15, 0.09)` —— 最轻的边界（次级按钮、chip、输入框）
- `--shadow-card`: `0 0 0 1px rgba(17, 19, 15, 0.1), 0 16px 44px rgba(17, 19, 15, 0.06)`
  —— 卡片（**已被第二个 `:root` 覆盖为暖色**，不再是冷黑）
- `--shadow-menu` / `--shadow-modal` —— 浮层（仍是旧主题值，改动前注意）

hover 抬升用 `transform: translateY(-2px ~ -3px)` 配 accent 描边 + 一层柔和投影，
不要用放大（`scale`）—— 会让相邻元素显得错位。

焦点态统一 `box-shadow: var(--focus-ring)` + `outline: none`（双环 pattern）。
`--focus-ring` = `0 0 0 2px var(--surface), 0 0 0 4px var(--accent)`（2026-09-20 修正：
原先它只在被覆盖的那个 `:root` 里定义，用的是旧蓝 `#0072F5`）。

## Shapes

| Token | 值 | 用于 |
|---|---|---|
| `--radius` | `10px` | 控件：按钮、输入框、`kbd` |
| `--radius-card` | `18px` | 卡片、面板、折叠区 |
| `--radius-pill` | `9999px` | 胶囊：chip、导航条、进度槽、圆点 |

三层足够。不要引入第四种圆角；`0` 圆角属于已废弃的旧主题，不要用。

## Components

- **`.button`**：`min-height: 40px`、`padding: 0 var(--space-4)`、`border: none`、`gap: 9px`。
  `.button.primary` = `background: var(--text)` + 白字（**深色实心，不是 accent**）；
  `.button.secondary` = 透明底 + `--shadow-border`。二者都可直接用在 `<button>` 与 `<Link>` 上。
- **卡片**：`--radius-card` + `--shadow-card` + `--space-5` 内距；hover 抬升见上。
- **chip / 标签**：`--radius-pill` + `--surface-soft` + 12–13px + `--text-secondary`。
- **section label**：窄体大写 13px/800，颜色 `--muted`；当前区块是"活跃"态时才用 `--accent`。
- **Callout**：`--surface-soft` 底 + `--shadow-border`，两列栅格（`auto 1fr`）——
  左边是**文字标签**（说明 / 注意 / 警告 / 提示 / 结论），右边是内容。
  用标签而不是 emoji 或彩色边来区分类型；危险级别才把标签压成 `--text`。
  这既是本站既有的层级语言，也避免了把 accent 用在非交互元素上。
- **横向画廊（`/about` `ProjectRail`）**：`overflow-x: auto` + `scroll-snap-type: x mandatory`，
  不劫持纵向滚动；窄屏（<=720px）退回纵向堆叠。

## Do's and Don'ts

**Do**
- 只用上面列出的 token；新增颜色前先问"能不能用 `--text` 加粗或 `--surface-soft` 解决"。
- 动效全部提供 `prefers-reduced-motion: reduce` 降级（`transition: none` / 去掉 `transform`）。
- 会跳动的数字加 `tabular-nums`。
- 打破"纵向同形堆叠"时优先改**排布方向**（横向/错落），而不是加装饰。
- 加新页面时确认它属于哪种 surface 模式（本站绝大多数是 Read，`/gallery` 是 Experience）。

**Don't**
- ❌ 不要用 `border`，用 `--shadow-border` 系列。
- ❌ 不要引入第二个彩色（`--accent` 是唯一交互色）。
- ❌ 不要写死色值、不要硬编码 px 间距、不要新增圆角档位。
- ❌ 不要用 `transition: width / height / padding / margin`（会触发 layout 抖动）——
  改用 `transform: scaleX()` 或 `grid-template-rows`。
- ❌ 不要给卡片加单侧粗色边（`border-left: 3px solid` 这类）—— 已被判定为
  AI 生成 UI 最典型的破绽。`/callout` 曾经就是这么写的，2026-09-20 已改为
  「第二中性层 + 文字标签」（见 Components）。
- ❌ 不要为了"更现代"把 `"Arial Narrow"` 换成别的高对比 sans：窄体大写标签是本站的
  刻意语汇，不是疏忽。
- ❌ 不要在 `app/globals.css` 的第一个 `:root`（第 8–63 行）里加 token —— 它是死代码，
  写进去不会生效。**新 token 一律加在第二个 `:root`（约第 3152 行起）。**
