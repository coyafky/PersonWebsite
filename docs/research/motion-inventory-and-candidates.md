# 本站动效清单 & 值得新增的候选

- 日期：2026-09-20
- 状态：**A1/A2/B1/B2/A3 全部实施并验收**（§9、§10、§12、§13）；lab 预览台见 §8
- 验收框架：根目录 `design.md`（本站动效纪律的**规范层**，不是建议）
- 方法：先在仓库里实测现有动效，再判缺口；每条候选都要过「重叠度 + 成本 + reduced-motion 可降级 + 是否只是装饰」四道

---

## 0. 结论先行

1. **本站的动效纪律已经很严**，`design.md` 里写着两条硬约束：
   - 「动效全部提供 `prefers-reduced-motion: reduce` 降级」→ 新增必须有降级
   - 「打破"纵向同形堆叠"时优先改**排布方向**，而不是加装饰」→ **这条直接否掉了大部分"加动效"的动机**
   加上 surface 判定「本站绝大多数是 Read，`/gallery` 是 Experience」→ **Read 面不该堆动效**。

2. **真正值得加的只有 3 条**（§3 的 A1–A3），其余一律进 §4 的拒绝名单。

3. ⚠️ **更正上一轮我的错误建议**：我说 `scroll-progress`（rareui）"是真的补缺口"——**错了**。本站**已有**阅读进度条：`components/article-toc.tsx` 的 `.article-progress__bar`，用 `transform: scaleX()` + `will-change: transform`，还带 `role="progressbar"` / `aria-valuenow`。重叠，应当拒绝。这正是 REUSE「重叠度」检查该拦住的东西，我上一轮没查就说了。

---

## 1. 现有动效清单（逐项实测）

| 类别 | 实测结果 | 证据 |
|---|---|---|
| **motion token** | **只有 2 个**，且都是微交互尺度：`fast: 150ms ease`、`smooth: 200ms cubic-bezier(.175,.885,.32,1.1)` | `design.md` 机器可读 token 块 |
| **CSS transition** | 55 处声明。属性分布：`background` 18 / `color` 11 / `box-shadow` 11 / `none` 6 / `transform` 5 / `width` 1 / `text-decoration` 1 | `grep -o "transition: *[a-z-]*" app/globals.css \| sort \| uniq -c` |
| **@keyframes** | **只有 1 个**：`music-np-in` | 同上 |
| **framer-motion** | 9 个文件：`about/AboutHero` `about/ProjectRail` `animations.tsx` `back-to-top` `content-card` `hero-section` `image-lightbox` `tabs` `timeline`（全站 37 个组件） | `grep -rl framer-motion` |
| **页面切换** | 已有：`PageTransitionWrapper` 挂在 `app/(site)/layout.tsx` | 同文件 |
| **滚动揭示** | 已有但**只用在 `/about`**：`RevealOnScroll`（`useInView`，`once: true`） | `grep -rl RevealOnScroll` |
| **滚动驱动 CSS** | **0 命中**：`animation-timeline` / `scroll-timeline` / `scroll-driven` 全无 | grep |
| **阅读进度** | **已有**：`.article-progress` + `__bar`，`scaleX()`，`transition: transform 80ms linear`，`role="progressbar"` | `components/article-toc.tsx:133` |
| **滚动吸附** | 已有：`/about` 的 `ProjectRail`（`scroll-snap-type: x mandatory`） | globals.css:4449 |
| **hover 微交互** | 已有：`content-card` 的 `whileHover={{y:-2}}`；卡片/链接的 background·color·box-shadow 过渡 | 同表 |
| **reduced-motion 降级** | **6 个块** | `grep -c prefers-reduced-motion` |
| **/gallery（唯一 Experience 面）** | `gallery-card.tsx` 里 `motion\|transition\|animate` 命中 **0**；封面只有 CSS hover 缩放 | grep |
| **图片占位** | `placeholder="blur"` **0 命中**；4 个文件用 `next/image` | grep |
| **聚合数字展示** | 有真实数字但无过渡：音乐库「{tracks.length} 首」、「16:54:29」、课程节数、各 tag 计数 | `MusicLibrary.tsx:176` |

**一句话概括现状**：transition 几乎全是 hover 态；`@keyframes` 只有 1 个；滚动揭示只覆盖 1 个页面；**滚动驱动能力为零**；而唯一被官方指定为 Experience 的 `/gallery`，动效反而最少。

---

## 2. 缺口（4 条，都是上表推出来的）

1. **没有"进入"型动效语汇**：两个 token 都是 150/200ms 的 hover 尺度，**连一个入场时长档都没有**；除 `/about` 外内容都是硬出现。
2. **没有滚动驱动能力**：`animation-timeline` 0 命中。这是唯一「零 JS + 天然可降级」的新能力。
3. **`/gallery` 名不正言顺地缺动效**：官方指定它是 Experience 面，实际动效数最少（0）。
4. **图片是硬贴上去的**：无 `placeholder="blur"`，长文/画廊里的图"啪"一下出现 —— 这恰好是 `design.md` 反对的视觉抖动。

---

## 3. 值得加（A 档，只有 3 条）

### A1. `/gallery` 封面的「显影」揭示 ⭐ 最推荐

- **补哪个缺口**：缺口 3（Experience 面动效最少）
- **做法**：进入视口时 `opacity 0→1` + `clip-path: inset()` 由中心/单向揭开（可选叠 `filter: blur(8px)→0`）
- **为什么不是装饰**：本站 `/gallery` 是**AI 生图实验档案**，"图从模糊显影出来"与"生成"这一主题同构；而 hover 缩放解决不了"图是硬贴上去的"这个体感问题。**theme-fit 是它唯一的正当理由**，不能只因为"好看"。
- **成本**：低。要么纯 CSS scroll-driven，要么一个 framer-motion 包装（站上已有 framer-motion）
- **reduced-motion**：直接静态显示（`@media (prefers-reduced-motion: reduce)` 里把 `clip-path`/`opacity` 复位）
- **风险**：画廊是网格，同时进入视口的卡片多 → 需要 stagger 或只对首屏外做，否则像"整页在闪"

### A2. 图片的 blur-up 占位（LQIP）

- **补哪个缺口**：缺口 4（图片硬出现 + 视觉抖动）
- **做法**：给 `next/image` 提供 `blurDataURL`（或静态 import 让 Next 自动生成），配 `placeholder="blur"`
- **为什么不是装饰**：它减少的是**加载过程中的视觉跳动**，而 `design.md` 明确反对抖（`❌ 不要用 transition: width/height/padding/margin（会触发 layout 抖动）`）—— 这条与它有同一个价值取向
- **成本**：低到中。⚠️ 关键约束：`next/image` 对**字符串路径**不会自动生成 `blurDataURL`，必须改用静态 import 或显式提供 → 需要先确认画廊/文章的图片引用方式
- **reduced-motion**：无关（这是加载态，不是动效）

### A3. 侧栏 TOC 的 active 指示器滑动

- **补哪个缺口**：缺口 1（状态变化是硬切）
- **现状**：`article-toc.tsx` 只用 `aria-current="location"` + 文字色变化表达"当前在哪个标题"
- **做法**：一个 2px `--accent` 细条在 220px 侧栏内滑到当前项（framer-motion `layoutId` 最省事，站上已有 framer-motion）
- **为什么不是装饰**：它是**状态指示**，回答"我读到文章哪一段"；`design.md` 允许 accent 用于交互元素
- **成本**：中。要对每个 link 做位置测量或靠 `layoutId`
- **⚠️ 与阅读进度条部分功能重叠**：都回答"我在哪"。判定：**优先级低于 A1/A2**，先别做

---

## 4. 拒绝名单（这部分才是答案的重点）

### 4.1 rareui 剩余组件（21 个逐条判）

| 组件 | 判定 | 理由 |
|---|---|---|
| `scroll-progress` | ❌ **重叠** | 本站已有 `.article-progress`（scaleX + role=progressbar）。**我上一轮的错误建议** |
| `code-block` | ❌ 重叠 | 已有 shiki + rehype-pretty-code + copy-button |
| `gravity-letters` | ❌ 装饰 | 687 行物理引擎（其中 356 行是 `useFallingGlyphs`），Read 面纯装饰，且依赖精确字体度量 |
| `fluid-orb` | ✅ 已用 | 上一轮已移植，作为 hero 面板的 LIVE 信号（唯一合理位置）。再加第二处即装饰 |
| `matrix-orb` / `grid-reveal` | ❌ 装饰 | Read 面无信息量 |
| `bounce-sidebar` / `proximity-sidebar` / `hook-sidebar` / `gooey-nav` | ❌ 无场景 + 冲突 | 本站是**顶部 sticky 胶囊导航**，没有侧栏；鼠标跟随类在阅读面是干扰 |
| `emoji-reaction` | ❌ 无场景 | 站上无评论/互动系统 |
| `animated-counter` | ⚠️ 见 4.2 | |
| `otp-input` / `duration-picker` / `delete-button` / `notification-bell` / `family-drawer` / `task-list` / `step-player` | ❌ 无场景 | 站上没有表单验证、时长选择、销毁操作、通知中心、iOS 抽屉、任务管理、分步播放 |
| `folder-component` | ❌ 语汇冲突 | 拟物文件夹与本站"编辑式 + 窄体大写标签"的刻意语汇不搭 |

### 4.2 其他被考虑后拒绝的

| 候选 | 判定 | 理由 |
|---|---|---|
| **View Transitions API** / Next `experimental.viewTransition` | ❌ 重叠 | `PageTransitionWrapper` 已挂在 `app/(site)/layout.tsx`，页面切换已有 |
| **CSS scroll-driven reveal 全站化** | ⚠️ 是重构不是新增 | 语义上与已有 `RevealOnScroll` 重叠；它是"用 CSS 版替换 JS 版以省 JS"，**属于重构收益，不该混进"新动效"清单**。且浏览器支持有分歧（§5） |
| **打字机 / 光标闪烁** | ❌ | 典型 AI 生成 UI 破绽，且与本站「窄体大写标签」这套刻意语汇直接冲突 |
| **全站视差滚动** | ❌ | hero 已有 lens 视差；Read 面视差拖累阅读 |
| **骨架屏 shimmer** | ❌ 无场景 | 静态导出站没有异步加载面；唯一的异步是本地音乐库扫描（本地 IO，且已有加载态 `--:--`） |
| **数字过零 `animated-counter`** | ⚠️ 弱 | 属"加装饰"，`design.md` 反对。**唯一正当用法**：`/about` 能力证据区用一次，让"这些数字是精确统计出来的"被感知到。优先级最低 |
| **标题字级入场 / 文字乱序飞入** | ❌ | Read 面纯装饰 |
| **`/labs/motion` 之外的任何常驻环境动画** | ❌ | 站上已有 1 个常驻动画（fluid-orb LIVE 信号）+ 悬浮播放条，再多就吵 |

---

## 5. ⚠️ 事实分歧：scroll-driven 的浏览器支持

搜到的两个来源**互相矛盾**，我不替它们裁决：

- 来源 A（Mozilla connect 讨论串）：Chromium 2023 就有，**Safari 2025 跟上**；**Firefox stable 仍在 flag 后**（Nightly 默认开，列为 Interop 2026 优先项）；caniuse 口径约 **82.6%** 全球支持，**差 Baseline 的 85% 门槛**（[ZKO World 标题即"Not Baseline Yet, Ship Them Anyway"](https://zko.world)）
- 来源 B（同一批搜索结果里的另一条）：称 *"animation-timeline: scroll() 和 view() 达到跨浏览器 baseline，Firefox 和 Safari 全支持，production-ready 无需前缀"*（提到 Safari 26.4）

**结论不依赖裁决**：`view()` 的天然降级就是"元素静止显示"，所以**不支持也不坏事** —— 只是不能把关键信息/唯一表达手段押在它上面。A1 若走这条路，必须保证「没动画时，就是现在这个样子」。

⚠️ 未核：我没去查 caniuse 原始页面或 Firefox 的 release notes，以上是搜索摘要，**不能作为定论**。

---

## 6. 配套：`/labs/motion` 预览页

动效这种东西**看不了就等于没评估**。所以另建了一个 lab 页，把 A1–A3 各做成可对比的 demo：

- 每个 demo 都带**「降级预览」开关** → 直接展示 reduced-motion 用户看到的样子，不用改系统设置
- 每个 demo 标注：补哪个缺口 / 成本 / 拒绝的替代方案
- ⚠️ 该页 `robots: { index: false, follow: false }`，且**不进 sitemap**（`app/sitemap.ts` 是手写枚举，不会自动收录）、**不进任何导航**
- surface 定位：Experience

---

## 7. 未核验边界（诚实清单）

- ❌ **我没有"看"过任何动效** —— 本轮会话截图工具报"当前模型不支持图像输入"，所有判断来自代码、CSS 与数值，**主观顺眼程度需人眼确认**
- ❌ 没测 A1 的 `clip-path` 在低端机 / 大图上的性能
- ❌ 没核 `next/image` 在本站的实际用法（是字符串路径还是静态 import）——这决定 A2 的实现方式，**实施前必须先查**
- ❌ scroll-driven 的浏览器支持未读原始 caniuse / release notes（§5）
- ❌ 没评估动效对 LCP/CLS 的实测影响
- 只精读了 `article-toc.tsx` / `gallery-card.tsx` / `content-card.tsx` / `animations.tsx` 四个文件，其余按 grep 结果判断

---

## 8. `/labs/motion` 已建成 + 验收（2026-09-20 13:5x–14:0x）

### 交付
- `app/(site)/labs/motion/page.tsx` —— 路由，`robots: { index: false, follow: false }`
- `components/labs/motion-lab.tsx` —— 客户端组件，3 个 demo + 降级预览开关
- `app/globals.css` —— 追加 `.ml-*` 样式（只在这一页用）

### 工程决策（值得记）

1. **A1 全程零 JS**。用 `@supports (animation-timeline: view())` 套 `@media (prefers-reduced-motion: no-preference)`，**两个条件都满足才启用**；否则停在「完全显示」的静态基线。所以：
   - 不支持 `view()` 的浏览器 → 看到最终态（就是现在站上的样子），**不需要写兜底代码**
   - reduced-motion 用户 → 同上
   - **降级不是"加了动效再补降级"，而是"动效是叠加在静态基线之上的一层"** —— 这是本站该沿用的写法
2. **能力徽标用 CSS 自己判断**（`.ml-cap::after` + `@supports` 改 `content`），没有一行 JS 去 `CSS.supports()`。
3. **TOC 指示器必须定位在 `button` 内部**。第一版写在 `.ml-toc` 里配 `top:0; bottom:0` → 会变成一根通高的条，`layoutId` 量到的是整列高度，滑不动。**`layoutId` 要量的是每个实例自己的盒子。**
4. 等宽字体沿用站内 `.hero-panel-label` 的写法 `"SF Mono", "Fira Code", monospace` —— **不要写 `var(--font-mono, …)`，本站没有这个变量**（那是 shadcn 的约定）。

### 验收（全部实测）

| 项 | 结果 |
|---|---|
| `npm run typecheck` | 0 ✅ |
| `npm run lint` | 0 error / **8 warning（与改前同数，零新增）** ✅ |
| `npm test` | 74/74 ✅ |
| `npm run build` | ✅ `/labs/motion` = **○ 静态** |
| 产物 robots | `<meta name="robots" content="noindex, nofollow"/>` ✅ |
| **sitemap 污染** | `sitemap.xml` 里 `labs` 出现 **0 次** ✅（`app/sitemap.ts` 是手写枚举，不会自动收录） |
| **`view()` 时间线是否真成立** | `CSS.supports('animation-timeline','view()')` = true；元素 `getAnimations()[0]` 的 **`timeline.constructor.name === "ViewTimeline"`** ✅ |
| **滚动是否真的驱动数值** | 三档单调变化：scrollY 0 / 242 / 628 → opacity **0.2549 → 0.9304 → 1**；clip-path `inset(8.94% round 10px)` → `inset(0.84%)` → `inset(0%)`。**无一行 JS 参与** ✅ |
| `round 10px` | keyframe 里的 `var(--radius)` 正确解出 ✅ |
| **降级预览开关** | 开 → `animCount` **1 → 0**、`clip-path` `inset(0%)` → **`none`**、blur 图 `filter` → `none`。动画是被**真正移除**，不是减速 ✅ |
| A2 加载窗口内对照 | loading：左 `visibility: hidden`（空白）vs 右 `visible` + `filter: blur(16px)`；loaded：左 `filter: none` vs 右 `filter: blur(0px)` ✅ |
| `--transition-smooth` | 浏览器解出 `.2s cubic-bezier(.175, .885, .32, 1.1)` ✅（虽然定义在第一个 `:root`，确实生效） |
| TOC 指示器 | 点击后 `aria-current` 与指示器盒子一起迁移到新项；颜色 `rgb(49,87,255)` = `--accent` ✅ |

### ⚠️ 未验 / 弱证据

- **"滑动"这个动作本身没测到中间帧**。测到的是点击后 900ms 的**稳定位置**（已正确迁移），以及 `layoutId` 的存在。严格说只证明了「指示器跟随 active 项」，没证明「过渡是滑动而非瞬移」。
- **外观顺眼程度仍未人眼确认**：本轮截图依旧不可用（模型不支持图像输入），所有判断仍是数值与属性层面的。**动效的最终判据只能是看。**
- 未测大图 × `clip-path` 在低端机的性能；未测动效对 LCP/CLS 的影响。

### 🔧 如果采纳 A1，会冒出一个 token 决策（需你拍）

`design.md` 的 motion token **只有 2 个**：`fast 150ms` / `smooth 200ms`，都是微交互尺度。A1 走 `view()` 路线不需要时长（滚动映射），**但 A2 的 blur-up 需要约 400ms 量级的过渡**，而现有 token 里没有这个档 —— 现在我用的是 `--transition-smooth`（200ms），比理想值短。

所以若采纳，要定一件事：**是复用 `smooth` 200ms，还是新增一个"进入/揭示"档**？按 `design.md` 的硬规则，新 token **只能加在第二个 `:root`**（第一个是死代码，写进去不生效）。

---

## 9. A1 已实施：`/gallery` 封面「显影」（2026-09-20 14:35–14:55）

用户选了 A1。改动只有一个文件：`app/globals.css` 末尾追加约 40 行。
**零 JS、零依赖、零新 token** —— 顺带绕开了 §8 末尾那个「要不要新增入场时长档」的决策（滚动映射没有时长）。

### ⭐⭐ 两个只有真浏览器才能发现的坑（本节是本文档最值钱的部分）

#### 坑 1：`overflow: hidden` 的祖先会让 `view()` 时间线冻死

第一版把动画和时间线都写在封面上（`animation-timeline: view()`），**看起来完全正确、CSS 校验通过、`ViewTimeline` 也确实挂上了 —— 但整段动画是个 no-op**：

| 实测 | scrollY 0 / 400 / 650 / 900 / 1100 |
|---|---|
| 5 个封面 × 全部滚动位置 | `opacity` 恒为 1、`clip-path` 恒为 `inset(0%)`、`playState` 恒为 `finished` |

**根因**：`.entry-card-gallery` 为了让图的圆角和卡片圆角对齐，带 `overflow: hidden`；而 **`overflow: hidden` 会让元素自己成为一个滚动容器**。`view()` 时间线量的是**主体最近的滚动容器** —— 封面是卡片的后代，于是它量的是卡片那个**永不滚动的滚动口**，时间线永远定格在区间之外。

**判别实验**（注入 `.entry-card-gallery { overflow: visible }` 后立刻复活）：

| scrollY | 封面 top | opacity | clip-path | timeline |
|---|---|---|---|---|
| 0 | 951 | **0** | `inset(11%)` | -15.5% |
| 500 | 451 | **0.9191** | `inset(0.890%)` | 27.7% |
| 800 | 151 | **1** | `inset(0%)` | 53.7% |

**修法：时间线声明在卡片上、动画声明在封面上。**
```css
.entry-card-gallery      { view-timeline-name: --gallery-entry; }  /* 主体=卡片，它的最近滚动容器才是视口 */
.entry-card-gallery-cover{ animation-timeline: --gallery-entry; animation-range: entry 6% cover 30%; }
```
`@supports` 守卫也要跟着加一项：`@supports ((animation-timeline: view()) and (view-timeline-name: --gallery-entry))`。

> **可迁移结论**：任何"带 `overflow: hidden` 用于裁圆角/裁溢出的容器"，其内部元素都**不能**自己挂 `view()` 时间线。要么把时间线挂到那个容器上，要么挂到容器外的祖先上。

#### 坑 2：裁切不能放在卡片上，否则描边阴影被一起裁掉

本站卡片的描边是 `box-shadow`（`--shadow-border`），而 **`clip-path` 会连 `box-shadow` 一起裁掉**。所以裁切放在 `.entry-card-gallery-cover`（自身无阴影）上；卡片的 `--shadow-border` 与 trigger 的 `focus-ring`（也是 box-shadow）都不受影响。
实测佐证：全滚动位置 `cardClip: none` + `cardShadow: rgba(17,19,15,0.09) 0 0 0 1px` 完好。

### 实现

```css
@keyframes gallery-develop-in {
  from { opacity: 0; clip-path: inset(11% 11% 11% 11%); }
  to   { opacity: 1; clip-path: inset(0% 0% 0% 0%); }
}
@supports ((animation-timeline: view()) and (view-timeline-name: --gallery-entry)) {
  @media (prefers-reduced-motion: no-preference) {
    .entry-card-gallery       { view-timeline-name: --gallery-entry; }
    .entry-card-gallery-cover { animation: gallery-develop-in linear both;
                                animation-timeline: --gallery-entry;
                                animation-range: entry 6% cover 30%; }
    .entry-card-gallery:nth-child(3n + 2) .entry-card-gallery-cover { animation-range: entry 12% cover 36%; }
    .entry-card-gallery:nth-child(3n)     .entry-card-gallery-cover { animation-range: entry 18% cover 42%; }
  }
}
```
按列错开的「3 列」来自网格定义 `repeat(auto-fill, minmax(320px, 1fr))` 在 1200px 容器下恰好 3 列。

### 验收（全部实测）

| 项 | 结果 |
|---|---|
| `npm run typecheck` / `lint` / `test` / `build` | 0 ｜ 0 error·**8 warning 零新增** ｜ **74/74** ｜ ✓ Compiled + 378 页 ✅ |
| 产物 CSS | `.next/static/chunks/43915111x9kv7.css` 里 keyframes + `view-timeline-name` + 三档 `animation-range` 全在 ✅ |
| 产物 HTML | `gallery.html` 5 个 `.entry-card-gallery-cover` ✅ |
| 5 张卡一致性（dev） | 全部 `gallery-develop-in` + `ViewTimeline`；按列 `entry 6%/12%/18%` 与 `cover 30%/36%/42%` ✅ |
| **dev 运行时（干净页）** | scrollY 0 / 400 / 650 / 1100 → opacity **0 → 0.5367 → 1 → 1**；clip `inset(11%) → inset(5.096%) → inset(0%) → inset(0%)` ✅ |
| **生产构建运行时** | 起 `next start -p 3100` 实测，`location.port === "3100"`，**数字与 dev 完全一致** ✅ |
| 卡片不受损 | 全位置 `cardClip: none`、`cardShadow` 完好 ✅ |

### ⚠️ 本轮踩到的两个方法论坑（记给自己）

1. **断言写在 `write()` 之后**：我用 `assert b.count("gallery-develop-in") == 3` 校验写入，实际只出现 2 次 → 脚本 exit 1，但**文件其实已经正确写入**。校验失败 ≠ 写入失败，差点误判成"没写进去"。断言应该数对，或者放在 write 前。
2. **后台 grep 还没跑完就读输出**：`grep -rl view-timeline-name .next` 被自动转后台，我读到 `=== 全 .next 搜 view-timeline-name ===` 后面是空的，一度判成"被压缩器剥掉了"。实际只是**结果还没 flush**。后来直接看生产 CSS 才确认全在。
   → **"没搜到"和"还没搜完"长得一模一样。** 拿 grep 的阴性结果下结论前，必须确认进程已退出。

### 未核验边界

- ❌ **外观仍未人眼确认**（截图工具报模型不支持图像输入）—— 11% 的起始内缩量、6%→30% 的区间快慢是否顺眼，需要人眼看。
- ❌ 未测 `prefers-reduced-motion: reduce` 下的真实降级（只能验证 CSS 结构：动效包在 `no-preference` 里，reduce 用户拿到静态基线）。**未做系统级模拟**。
- ❌ 未测不支持 `view()` 的浏览器（当前浏览器支持；降级是结构性保证，非实测）。
- ❌ 未测低端机 / 大图下的 `clip-path` 性能，未测对 CLS 的影响（`clip-path` 不触发布局，理论上无害）。

---

## 10. A2 已实施：文章内图片的宽高占位 + blur-up（2026-09-20 14:57–15:25）

### ⭐ 结论先行：A2 不是动效，是个 CLS 修复

上一轮我把 A2 归为「动效候选」，并说它卡在「要不要新增 ~400ms 揭示时长 token」的决策上。
**实测之后这个判断是偏的**：真正的实装路径走 Next 原生 `placeholder="blur"`，
而它的机制**根本不产生 CSS 动画**（见 §10.3）。所以：
- **A2 零动效 → 不涉及 motion token → 上一轮那个待拍决策自动作废**
- 它的主要价值也不是"好看"，是**消掉一个 450px 的布局跳动**

### 10.1 落点：数据说了算，不是 gallery

上一轮我默认 A2 的落点是 gallery（图最大）。量完之后**反了**：

| | 原图体积 | 加载前高度 | 宽高是否已知 |
|---|---|---|---|
| `/gallery/*.webp`（5 张） | 53–330 KB | 已预留（`IMG_W/IMG_H` 从 `params.ratio` 推） | ✅ 已知 |
| **博客正文 PNG（9 张）** | **1.9–2.4 MB** | **0px** | ❌ **未知** |
| `/projects` 卡片图 | — | 已预留（固定 `400×240`） | ✅ 已知 |
| `site-mark.svg` | 矢量 | 已预留（`34×34`） | ✅ 已知 |

→ **只有 `components/mdx-content.tsx` 的 `MdxImage` 有 CLS 问题**，而且它是重灾区。

#### 修复前实测（真浏览器）

| 指标 | 实测 |
|---|---|
| 图片未加载时高度 | **0 px** |
| 加载后高度 | **450 px** |
| **CLS 幅度** | **450 px = 视口(772px) 的 58%** |
| 单张实际传输 | 94 / 100 / 138 / 154 KB（请求 `w=1920` 档） |
| 加载耗时 | **1069–1177 ms**（本地 dev，含转码） |
| `blurDataURL` | 全站 0 命中 |

**根因**：`<Image width={0} height={0} sizes=... >` 是 Next 官方的响应式写法，但浏览器**无法从 0/0 推断宽高比** → 图片到达前高度为 0 → 到达瞬间把下方内容整体推下去。这正是 `design.md` 里点名反对的「视觉抖动」。

### 10.2 实现（3 个文件 + 1 处挂载）

1. **`scripts/image-manifest.mjs`**（新建，161 行）
   - 扫 `public/**` 全部位图（跳过 `image-assept/` 快照归档）
   - `sips` 读真实像素尺寸；`cwebp -q 45 -resize 24 0` 出 24px 缩略图 → base64
   - 输出 `lib/image-manifest.ts`：`{ [publicUrl]: { width, height, blurDataURL } }`
   - ⚠️ 本机 `sips -s format webp` **不支持**（不报错但不出文件）→ 改用 `cwebp`
2. **`lib/image-manifest.ts`**（生成物，**进 git**）—— 16 张图，占位数据合计 **5.3 KB**（平均 330 B/张）
   - 进 git 的理由：dev 模式不跑 prebuild，文件不存在就没有占位
3. **`components/mdx-content.tsx`** —— `MdxImage` 改为按清单取 `width/height` + `placeholder="blur"`；**清单里没有该图就退回 0/0 老行为**（降级安全，不阻塞构建）
4. **`package.json`** —— `prebuild` 前插 `npm run images:manifest`（另加 `images:manifest` 脚本）
   - `.prettierignore` 新建并排除生成物

#### 刻意删掉的东西

第一版写了增量判断 + `--check`，**两个都删了**：
- 增量：指纹存在生成文件里，抠 JSON 时第一个 `{` 落在 `export type ImageMeta = {` → 增量判定**永远失败**、`--check` **永远误报**（实测踩到）
- 而它挂在 prebuild 上，每次构建必跑，不存在「忘了重新生成」；全量只要 **1.5s**
→ **多余的轮子就是 bug 来源。**

### 10.3 ⭐ 机制发现：Next 的 blur 占位不是 CSS 动画

实测未被加载图片的 `style` 属性，展开后是：

```html
background-image: url("data:image/svg+xml;charset=utf-8,
  <svg viewBox='0 0 1448 1086'>
    <filter id='b'><feGaussianBlur stdDeviation='20'/>…</filter>
    <image style='filter: url(#b);' href='data:image/webp;base64,…'/>
  </svg>")
```

**模糊是烘进 SVG 滤镜的**，缩略图当 `background-image` 贴在 img 上；图片加载完 Next 直接撤掉这层底图。computed `transition: all` = `all 0s`（CSS 初始值，**没有时长**）。

三个直接推论：
1. **零 CSS 动画** → `design.md` 的「动效必须提供 reduced-motion 降级」**不适用**
2. **不需要新 token**
3. 想看「加载完撤下占位」的状态差异，别把它当 bug：首屏图 `complete: true` + 无 blur style 是**正常收尾**，不是没生效（本轮差点误判）

### 10.4 代价（诚实数字）

| 项 | 数值 |
|---|---|
| 占位样式未压缩 | 6 处合计 **6,978 字符（6.8 KB）**，占该页 HTML 的 7.1% |
| **gzip 后真实网络代价** | **+2,498 B（2.44 KB）**，占该页 gzip 体积的 9.9% |
| 压缩率 | base64+SVG 的重复结构被压掉 **64%** |

→ **2.44 KB 换掉 450px 的 CLS**，这笔账不亏。

### 10.5 验收（全实测）

| 项 | 结果 |
|---|---|
| typecheck / lint / test / build | 0 ｜ 0 error·8 warning（零新增）｜ **74/74** ｜ ✓ Compiled + 378 页 ✅ |
| prebuild 挂钩 | 构建时确实跑了 `images:manifest`（16 张）✅ |
| 产物 HTML | `width="0" height="0"` 出现 **0 次**（全部换成真实尺寸）；`data:image/webp;base64` **12 次**；6 张图全带 `background-size:cover` 占位 ✅ |
| **CLS（与修复前同一套对称测量）** | 空图高度 **450px** = 加载后 **450px** → **CLS 幅度 0**（修复前 450）✅ |
| dev 运行时 | 6 张图宽高全非零；4 张未加载的图**全部**带 blur 占位 ✅ |
| **生产构建运行时** | 起 `next start -p 3100` 实测（`location.port==="3100"`）：`clsAmplitudePx: 0`、`dimsAllNonZero: true`、`pendingWithBlur 4/4` ✅ |
| 清单完整性 | 内容引用的 **11 处本地图片全部有占位，0 缺失** ✅ |

### ⚠️ 诚实边界

1. **lab 里的 A2 demo 和真实实装不是同一个机制**。`/labs/motion` 里那个是用 `filter: blur(16px)` + CSS 过渡去模糊**同一张大图** —— 那是**假 blur-up**：模糊的是全尺寸真图，所以它**并不减少空白期**，只改变了"出现"的观感。真实实装是 24px 缩略图先到。**lab 只能验证方向，不能替代实装验收。**
2. **只在一篇（6 张图）上逐张实测**。其余篇目靠「清单完整性检查」保证覆盖（11/11），但没有逐页跑过真浏览器。
3. **外观仍未人眼确认** —— 截图工具依旧报模型不支持图像输入。模糊图放大 33 倍后的观感、24px 这个尺寸选得合不合适，**得人眼看**。
4. **慢网下的观感未测**：localhost 无法模拟限速，"缩略图先到"这个收益在真网络下有多大，没有数据。
5. 未测 `placeholder` 对 LCP 的影响（图片本身仍要等 next/image 优化端点转码，1069ms 那个数字没变）。

---

## 11. 其余页面的动效体检（2026-09-20 15:05–15:35）

### 11.0 结论：值得做的只有 2 条，而且都**不是"加动效"**

| 判定 | 项 | 类型 |
|---|---|---|
| ✅ B1 | 两处 `<details>` 折叠的展开过渡 | **状态切换补过渡**（design.md 明列的技法） |
| ✅ B2 | `.tool-progress-fill` 的 `transition: width` | **修违规**（每秒 5 次布局失效） |
| ⚠️ B3 | 搜索弹窗瞬间进出场 | 越界（全局组件，不属于"页面"） |
| ❌ | 给文本列表页加滚动揭示 | 纯装饰 —— **与 A1 的决定性区别见 11.3** |
| ❌ | `/timeline`、`/diary` 这两个 20 屏长页加动效 | 解法是**改排布方向**，不是加装饰 |

### 11.1 全景：路由 × 现行动效 × 真实长度（真浏览器实测）

| 路由 | 屏数（scrollH/视口） | 条目 | 在跑的动画 | 现有动效来源 |
|---|---:|---:|---:|---|
| `/diary` | **20.7** | 68 篇 | 0 | 无 |
| `/timeline` | **19.5** | 57 篇 | 0 | 无 |
| `/blog` | 4.8 | 分页 | 0 | 无 |
| `/about` | 3.9 | — | **2** | AboutHero + ProjectRail + RevealOnScroll |
| `/weekly` | 3.3 | 23 | 0 | 无 |
| `/projects` | 2.8 | 5 | 0 | 无 |
| `/course-list` | 2.2 | 5 门 | 0 | 无 |
| `/learning` | 1.4 | 59 | 0 | 无 |
| `/tools` `/book-list` `/tags/cloud` | 1.4 | — | 0 | 无 |
| `/gallery` | — | 5 | — | **A1 显影**（§9） |
| `/` | — | — | — | hero lens + fluid-orb + content-card hover |

> 条目数一列我的选择器 `[class*="entry-card-"]` 会连子元素一起算（如 `entry-card-blog-title`），**虚高**；屏数是可靠的，也是真正要看的那个数。

**两个离群值一目了然**：`/timeline` 与 `/diary` 比其他页长一个数量级（19.5 / 20.7 屏 vs 其余 1.4–4.8 屏）。**其余页面根本不长，没有"滚动叙事"可言。**

### 11.2 ✅ B1：两处 `<details>` 折叠是硬切

`grep "<details"` 命中 2 处：
- `app/(site)/about/page.tsx:188` → `.about-fold`
- `components/entry-card-learning.tsx:33` → `.entry-card-learning`（Learning 栏按主题折叠的卡）

两处都用原生 `<details>`，展开/收起**没有任何过渡**，内容是"跳"出来的。

**为什么这条够格（不是装饰）**：`design.md` 的 Don'ts 里**点名**了正确做法 ——
> ❌ 不要用 `transition: width / height / padding / margin`（会触发 layout 抖动）—— 改用 `transform: scaleX()` 或 **`grid-template-rows`**

也就是说**设计权威已经预见了"展开/折叠"这个场景并给了技法，而站上两处折叠都没用**。这和 B2 是同一类：不是加新东西，是把已有的状态切换按既有规则做对。

**可行性（能力已实测，技法未端到端验证）**：
| 检查 | 结果 |
|---|---|
| `CSS.supports('interpolate-size','allow-keywords')` | **true** ✅ |
| `CSS.supports('selector(::details-content)')` | **true** ✅ |
| `CSS.supports('grid-template-rows','0fr')` / `('1fr')` | **true** / **true** ✅ |
| 合成测试（0fr→1fr 是否真产生过渡） | ⚠️ **不成立** —— 我漏了 recipe 的另一半（直接子元素需要 `overflow: hidden; min-height: 0`），`animRightAfterFrame: 0`、`heightMid: 0` |

→ 两条路都在（现代写法 `details::details-content { block-size: 0 → auto }` + `interpolate-size`，或经典 `grid-template-rows` 写法），**但技法本身我没验完**，实施时要用完整 recipe 再测一次。

**成本**：纯 CSS，零 JS，保留原生 `<details>` 的可访问性（键盘/`aria-expanded` 全自动）。
**reduced-motion**：现有行为就是"无过渡"，直接落在静态基线上 —— 与 A1 同一个模式。

### 11.3 ❌ 拒绝：给文本列表页加滚动揭示 —— 它与 A1 有决定性的区别

这次最该说清的一条。**A1 合理、列表页不合理，不是因为"gallery 是 Experience"，而是因为一个更硬的理由：**

| | `/gallery`（A1 做了） | 文本列表页（不做） |
|---|---|---|
| 元素到达页面时处于什么状态 | 图片**确实有加载延迟**（94–154KB，实测 1069–1177ms），期间是空白 | 文本**本来就在 HTML 里**，随页面一起到达 |
| 滚动时看到的东西 | 视口外的图**尚未加载** → 有"迟到出现"可被修饰 | 已经在那里了 → 没有"迟到"可修饰 |
| 动效在解决什么 | 掩盖加载空档 + Experience 面的显影语义 | 什么都不解决 |
| 判定 | ✅ | ❌ **纯装饰，design.md 明确反对** |

**→ 可复用的判据：只有当元素"到达得比页面晚"，揭示才有意义。文本列表不满足这个前提。**

### 11.4 ❌ 拒绝：`/timeline`（19.5 屏）与 `/diary`（20.7 屏）

它们确实是站上最长、最单调的两个页面 —— 但正因如此，`design.md` 的这条直接决定了解法：
> 「打破"纵向同形堆叠"时优先改**排布方向**（横向/错落），而不是加装饰」

- `/diary` = 68 张同形卡片一路码下来 → 要动就动**结构**（按月份分组 + 分组标题、或改横向卡片轨）
- `/timeline` = 57 条同形时间线节点 → 同理（按年份分段）
- **加动效只会让"更长的同形堆叠"变得更好看，不解决它。**

（顺带记一个与动效无关的发现：`.entry-card-learning { border-bottom: 1px solid rgba(0,0,0,0.06) }` 用了 `border`，而 design.md 明写「❌ 不要用 border，用 `--shadow-border` 系列」。同一文件里 `.entry-card-gallery-details` 就曾因此被改过。这是独立于动效的问题，未动。）

### 11.5 ⚠️ B3（越界项）：搜索弹窗进出场是瞬时的

`components/search-dialog.tsx`（117 行）里 `motion|AnimatePresence|transition|initial|animate` **命中 0**；`.search-overlay` / `.search-dialog` 的 CSS 里 `transition|animation|opacity|transform` 也**命中 0**。

→ ⌘K 一按，遮罩（`rgba(0,0,0,0.4)` + `backdrop-filter: blur(4px)`）和对话框**瞬间出现**，关掉也瞬间消失。这是个高频交互面，遮罩硬闪的观感明显。

**但它不是"页面"**，所以我单列出来，不算在本次问题的范围内。成本很低（站上已有 framer-motion）。

### 11.6 已排除（本来就不用动）

| 项 | 现状 | 判定 |
|---|---|---|
| 页面切换 | `PageTransitionWrapper` 已挂 `app/(site)/layout.tsx` | 已有 |
| 卡片 hover | `content-card` `whileHover={{y:-2}}`；`.tool-index-card:hover` | 已有 |
| 图片灯箱 | `image-lightbox` 用 framer-motion | 已有 |
| Tabs / Timeline 组件 | 均用 framer-motion | 已有 |
| 阅读进度 | `article-toc` `transform: scaleX()`（**正确写法**） | 已有 |
| 工具页读数 | `.tool-readout` + `tabular-nums`（design.md 要求） | 已有 |
| 筛选 / 排序 | 站上没有客户端筛选面（`/blog` 是静态分页） | 无场景 |
| 骨架屏 | 静态导出站无异步加载面 | 无场景 |
| 数字过零 `animated-counter` | 仍属"加装饰"（§4.2） | 弱，不做 |

### 11.7 未核验边界

- ❌ **外观一律未人眼确认** —— 截图工具仍报模型不支持图像输入
- ⚠️ **B1 的技法未端到端验证**（合成测试因漏 recipe 而不成立，只验了能力位）
- ❌ 未测 B2 改法（`scaleX`）在真实工具页上的效果 —— 只验了 `transform` 过渡成立（`transitions: 1`, `props: ["transform"]`）
- ❌ `/tools`、`/book-list`、`/tags/cloud` 的条目数与我的选择器不匹配（都返回 0），**这三页的结构我没查清**，屏数（1.4）可信但条目组成不确定
- ❌ 只扫了 11 条路由，未覆盖 `[slug]` 详情页族群（它们共用 `article-layout`，动效取决于该布局）
- ❌ 未测 B3 的进出场对可访问性的影响（焦点管理、`prefers-reduced-motion`）

---

## 12. B1 + B2 已实施（2026-09-20 15:20–15:45）

两条一起做了。改动 3 个文件：`app/globals.css`（2 处）、`components/tools/CountdownTimer.tsx`、`components/tools/PomodoroTimer.tsx`。

### 12.1 ⭐⭐ B1 的技法验证：4 次失败之后才拿到可复现的结论

这一节比实现本身重要。**技法我差点误判成"不可用"并放弃。**

| 轮次 | 做法 | 结果 |
|---|---|---|
| 1 | 合成测试：`grid-template-rows: 0fr → 1fr`，直接改 inline style 后立刻读 | `transitions: 0` —— **测早了**，过渡尚未启动 |
| 2 | 加一帧再读 | 仍 `0` —— **漏了 recipe 的另一半**（直接子元素要 `overflow: hidden; min-height: 0`） |
| 3 | 真实页面 `.about-fold` 注入 `::details-content` 方案 | 8ms 内 133 → 3517，**又像不成立** |
| 4 | 同上，但 `interpolate-size` 改放 `:root` | **成功了**（133 → 3058 → 3408 → 3519 → 3526） |
| 5 | 换回 `details` 作用域 / 再换 `:root`，各测一遍 | **两次都不动** —— 与第 4 轮**直接矛盾** |
| 6 | **改用全新创建的 `<details>` 元素** | **3/3 完全可复现**（`distinctHeights: 20`） |

**结论：第 4/5 轮矛盾的原因是测试夹具，不是被测对象。** 我一直在拿同一个已经渲染过、还被反复程序化 toggle 的 `.about-fold` 做实验 —— `content-visibility` 的离散过渡状态机在反复 toggle 后卡住了。换成一次性新建的元素后立刻稳定。

🔑 **可迁移教训（这是本文档里第二次栽在同一类问题上）**：
- **"复用同一个 DOM 元素反复 toggle"会污染测量结果** —— 性能/动画类实验要用一次性新建的元素
- **同一份 CSS 反复给出相反结果时，第一个要怀疑的是夹具**，不是"这特性不稳"
- `CSS.supports(...)` 返回 `true` **只说明语法被识别**，不说明技法能动画（第 3–5 轮就是活证据）

### 12.2 B1 实现与三个关键决策

```css
@supports ((selector(::details-content)) and (interpolate-size: allow-keywords)) {
  @media (prefers-reduced-motion: no-preference) {
    details { interpolate-size: allow-keywords; }
    details::details-content {
      block-size: 0;
      overflow: hidden;
      transition:
        block-size var(--transition-smooth),
        content-visibility var(--transition-smooth);
      transition-behavior: allow-discrete;
    }
    details[open]::details-content { block-size: auto; }
  }
}
```

1. **为什么不是 `grid-template-rows`（design.md 列的另一条）**：`entry-card-learning` 里是**多个直接子元素**（`<p>` + `<ul>`），走 grid 那条路得加包裹层 = 改 markup。`::details-content` 一路对**两处都零 markup 改动**。`about-fold` 里其实已经有 `.about-fold-body` 包裹层，但统一用一条技法更好维护。
2. **守卫必须组合两个能力，缺一个就整块不生效**：如果只有 `::details-content` 支持而 `interpolate-size` 不支持，`block-size: 0` 会照常生效、而 `0 → auto` 插不了值 → **内容永久停在 0 高度（内容消失级事故）**。所以两个都测。
3. **作用域收窄到 `details`，不放 `:root`**：`interpolate-size` 让 `auto` 变成可插值，等于**放宽 design.md「不要 transition width/height」那条护栏** —— 只放宽到这两处折叠，别影响全站。实测收窄同样成立（3/3）。
4. **`transition-behavior: allow-discrete` 必须写在 `transition` 简写之后**：简写会把 `transition-behavior` 重置回 `normal`，写在前面会被吃掉。与 `animation` 简写会重置 `animation-timeline` 是同一类顺序陷阱。
5. **时长用 `var(--transition-smooth)`**（= 200ms + 站上那条 cubic-bezier），不新增 token —— 顺带把上一轮"要不要新增揭示时长档"的问题继续避开。

### 12.3 B2 实现

`.tool-progress-fill`：`transition: width` → `transition: transform` + `width: 100%` + `transform-origin: left center` + `will-change: transform`；两个组件把内联样式从 `width: X%` 改成 `transform: scaleX(X)`。

对齐的对象是**站内已有的正确写法** `.article-progress__bar`（它本来就是 `transform: scaleX()`）—— 同一站两条进度条原先两套写法，现在一致了。

### 12.4 验收（全实测）

| 项 | 结果 |
|---|---|
| typecheck / lint / test / build | 0 ｜ 0 error·**8 warning 零新增** ｜ **74/74** ｜ ✓ Compiled + 378 页 ✅ |
| 产物 CSS | `details::details-content{...}`、`interpolate-size`、`transition-behavior:allow-discrete` 均在；`.tool-progress-fill` 已是 `transition:transform var(--transition-fast)` + `transform-origin:0`（`left` 被压成 `0`）✅ |
| **B1 · /about 展开**（全新页面 + 真实点击） | `distinctHeights: 15`，`133 → 2270 → 3158 → 3562 → 3595 → 3602 → 3591 → 3564 → 3526` ✅ |
| **B1 · /about 收起** | `distinctHeights: 14`，`3526 → 2274 → 1086 → 499 → 222 → 133` ✅ **双向都有过渡** |
| **B1 · /learning 折叠**（多子元素那处） | `distinctHeights: 16`，`79 → 128 → 171 → 197 → 203 → 206 → 209` ✅ |
| 作用域生效 | `getComputedStyle(details).interpolateSize === "allow-keywords"` ✅ |
| **B2 · 判据：宽度零变化** | **300 个运行时采样 → `widthVariants: 1`（宽度自始至终一个值）、`transformVariants: 138`** ✅ |
| B2 · 样式 | `transitionProperty: "transform"`、`transform-origin: 0px 2px`、`will-change: transform`、内联 `transform: scaleX(0)`、**`hasWidthPercent: false`** ✅ |
| **生产构建运行时**（`next start -p 3100`） | B1 两处 + B2 全部**在生产包上复测通过**（`location.port === "3100"`）✅ |

**回弹是设计内的**：展开序列里 `3602 → 3591 → 3564 → 3526` 的那点过冲，来自 `--transition-smooth` 的 `cubic-bezier(.175,.885,.32,1.1)`（控制点 y=1.1 会越过 1）—— 与站上其它动效同一个缓动，不是我引入的。

### 12.5 ⚠️ 产物验证的一个意外

`.tool-progress-fill` **不在预渲染 HTML 里**（`tools/countdown.html` 里零命中）。查清是**故意的**：`CountdownTimer` 用 `useCountdown` 返回的 `hydrated` 做守卫（状态来自 localStorage，不能 SSR）。
→ 所以 B2 的产物验证**只能走运行时**。我一开始按 A1/A2 的老办法 grep 产物 HTML，得到空结果，差点误判成"没生效"。

### ⚠️ 未核验边界

1. **`::details-content` 的跨浏览器支持我没查**（Chrome/Edge/Safari/Firefox 各自的版本门槛）。守卫保证了不支持的引擎退回今天的硬切，**但"退回是否真的干净"没有实测**。
2. **`prefers-reduced-motion: reduce` 未做系统级模拟** —— 只验证了 CSS 结构（动效包在 `no-preference` 内，reduce 时整块不生效 = 现有行为）。
3. **`/learning` 只点了 5 个 `<details>` 里的第 1 个**，其余 4 个（以及 `/learning` 各 topic 页）未逐个点。
4. **外观仍未人眼确认**：展开 200ms 的观感、过冲幅度是否合适，得人眼看。截图工具依旧报模型不支持图像输入。
5. 未测 364px 窄屏下的表现（`about-fold` 展开后高 3526px，窄屏会更长）。
6. 未测键盘操作（`<summary>` 用 Enter/Space 触发）是否同样有过渡 —— 理论上走同一条 CSS，未实测。

---

## 13. A3 已实施：TOC 当前项标记「滑过去」（2026-09-20 15:50–16:10）

改动 2 个文件：`components/article-toc.tsx`（+35/−14）、`app/globals.css`（+1 处 position、移走 1 处 background、加 2 条新类）。

### 13.1 设计决策：不是"加一根新细条"，是让已有的标记滑起来

我在 §11 里把 A3 描述成「一个 2px `--accent` 细条在侧栏内滑动」。**读完 CSS 发现那个描述会让它变成纯装饰** —— 因为：

```css
.article-toc a:hover                      { background: var(--surface-soft); }
.article-toc a[aria-current="location"]   { color: var(--accent); background: var(--surface-soft); font-weight: 600; }
```

**当前位置标记本来就存在**：一块 `--surface-soft` 的圆角底（hover 用的是同一个颜色 —— 这是站上 TOC 行高亮的既有语言）。再叠一根 accent 细条，就是在一个已经会说话的标记上再加一个标记。

所以改成：**把这块底从「各画各的再硬切」变成「同一个元素滑过去」**。
- 零新颜色（`background` 逐字保留 `--surface-soft`，实测 `rgb(233,236,232)` = #E9ECE8）
- 零新圆角档位（`var(--radius)`，实测 `10px`）
- 零新尺寸（`inset: 0` 贴合 `a` 的 padding 盒）
- hover 那条**保持原样**（即时反馈，不参与滑动）

**静止时是像素级一致的** —— 实测 `markerTop === linkTop`、`markerH === linkH`、`radius: 10px`，动画结束后仍 `boxMatches: true`，且内联样式只剩 `opacity: 1`（**无残留 transform**）。

### 13.2 ⭐⭐ 中间帧：补上了我在 §8 承认的缺口

上一轮我写过「**动效的"滑动"动作没测到中间帧**，只测到稳定位置」。A3 的核心价值就是"滑"，所以这次必须测到。

**方法**：在页面自己的 rAF 循环里装采样器（跨 eval 调用存活）→ 再触发 scroll 改变 activeId → 高频记录标记的 `getBoundingClientRect()`。

**dev 结果**：

```
143 个采样 → 30 个不同位置
114 → 115 → 119 → 143 → 153 → 170 → 188 → 204 → 222 → 236 → 250 → 262 → 277
    → 287 → 297 → 305 → 314 → 320 → 326 → 331 → 335 → 339 → 342 → 344 → 346 → 348 → 349 → 350 → 351 → 352
```

**生产构建结果**：128 采样 → 27 个不同位置，同样单调爬升 + 收敛尾巴。

**逐帧时序（323px 行程）**：

| 指标 | 值 |
|---|---|
| 行程 | **323 px** |
| 首帧序列 | `19ms:84 → 28ms:86 → 35ms:95 → 44ms:110 → 52ms:130 → 61ms:150 → 69ms:172 → 77ms:196 → 86ms:218` |
| **单帧最大位移** | **24 px**（≈ 一个半行高，不是"跳"） |
| 收敛 | **434 ms**（19ms 起 → 453ms 稳定在 407） |

**尺寸也在插值**：`widthVariants: 14`（206→220 连续变化）—— 二级项与三级项的缩进/字号不同，framer-motion 同时插值位置与尺寸。

### 13.3 ⚠️ 一个方法论陷阱（记一笔）

我第一次看中间帧数据时被**去重序列**误导：`84, 86, 89, 102, **229**, 252 …` 里 102→229 看着像"跳了 127px"，我差点去调弹簧参数。**但去重列表丢掉了重复值** —— 逐帧序列显示 `102` 到 `229` 之间其实经过了多个帧，真实单帧最大位移只有 **24px**。

→ **判"是不是跳"，必须看逐帧序列（带时间戳），不能看去重后的位置集合。** 和 §11 那个「选择器连子元素一起算导致条目数虚高」是同一类：**聚合视图会骗人。**

### 13.4 reduced-motion：这类是 JS 侧降级，和前三条不同

| | 降级点 |
|---|---|
| A1（gallery 显影）、B1（`<details>`） | **CSS 侧**：动效包在 `@media (prefers-reduced-motion: no-preference)` 里 |
| B2（进度条） | CSS 侧（`transition: none` 那条已有块） |
| **A3（TOC 标记）** | **JS 侧**：`useReducedMotion()` → `transition={{ duration: 0 }}` |

原因：framer-motion 的 `layoutId` **默认不看** `prefers-reduced-motion`，必须在 JS 里自己接。所以本站的动效降级现在有**两种机制**，以后加动效要先判它属于哪一类。

⚠️ **未做系统级 reduced-motion 模拟**（与 A1/B1/B2 同样的边界）—— 只验证了代码路径存在，没实测过 `duration: 0` 时的实际表现。

### 13.5 为什么用弹簧而不是固定时长

站点 motion token 只有 `--transition-fast`(150ms) / `--transition-smooth`(200ms)，**没有弹簧**。这里用了 framer-motion 的 `{ type: "spring", stiffness: 420, damping: 34 }`，理由是**这个动效会被打断**：快速滚动时 activeId 会连续变化，弹簧能从当前速度自然改投目标（无急停感），而固定时长的 tween 会从当前位置重新起一条缓动曲线。

⚠️ 代价：**引入了站上第一个"弹簧"运动语汇，没有 token 依据**。若要与设计系统对齐，需要定一个弹簧 preset —— 这与 §8 那个"要不要新增入场时长档"是同一类待决事项。**实测 434ms/323px 的收敛比例是合适的（不是闪一下）**。

### 13.6 验收（全实测）

| 项 | 结果 |
|---|---|
| typecheck / lint / test / build | 0 ｜ 0 error·**8 warning 零新增** ｜ **74/74** ｜ ✓ Compiled + 378 页 ✅ |
| 产物 CSS（压缩后） | `.article-toc a[aria-current=location]{color:var(--accent);font-weight:600}` —— **`background` 确实移走了**；`article-toc__marker` / `__label` 均在 ✅ |
| 产物 HTML | `article-toc__label` **15 个**（15 条 TOC 全包上了）；`article-toc__marker` **0 个** —— **这是对的**：SSR 时 `activeId=""`，本来就没有当前项（与 `aria-current="location"` 的 0 次一致） |
| 静止态盒子 | `markerTop === linkTop`、`markerH === linkH`、`radius: 10px`、`bg: rgb(233,236,232)` = `--surface-soft` ✅ |
| 动画后静止态 | `boxMatches: true`；内联样式只剩 `opacity: 1`（**无残留 transform**）✅ |
| **中间帧（dev）** | 143 采样 → **30 个不同位置**，单调爬升 + 收敛尾巴 ✅ |
| **中间帧（生产 `:3100`）** | 128 采样 → **27 个不同位置**；`location.port==="3100"` ✅ |
| 时序 | 行程 323px、**单帧最大位移 24px**、**收敛 434ms** ✅ |
| 尺寸插值 | `widthVariants: 14`（206→220）✅ |

### ⚠️ 未核验边界

1. **外观仍未人眼确认**（截图工具报模型不支持输入图像）。**这条尤其要紧**：A3 的价值就是观感 —— 434ms 是太快还是太慢、弹簧手感如何，**只有眼睛能判**。参数在 `transition` 里，改一个数的事。
2. **reduced-motion 未做系统级模拟**（只验代码路径）。
3. **只测了一篇文章**（`2026-08-23-ai-image-generation-shot-type`，15 条 TOC）；短 TOC（3–5 条）和更长 TOC 未测。
4. **移动端分支未测**：`< 1100px` 时 TOC 走 toggle + 面板，`navContent` 相同所以标记也会渲染，但面板 `display:none` 时盒子为零 —— 展开面板后的滑动未实测。
5. **快速连续滚动时的连续打断未测**（弹簧改投目标的实际表现）。
6. 弹簧参数无 token 依据（§13.5）。
7. 未测对 TOC 的 `overflow-y: auto`（`max-height: calc(100vh - 100px)`）在长 TOC 下被裁剪时的表现。
