# Rare UI 采纳评估 — 怎么落到我们的项目里

- 日期：2026-09-20
- 状态：**已执行** —— 走 B 路径，`fluid-orb` 已移植进 PersonalWebsite（见 §9）
- 证据来源：rareui.com 站点/组件页、`https://www.rareui.com/r/<name>.json`（标准 shadcn registry-item）、GitHub API（swamimalode07/rare-ui）、两个项目的实际文件与 package.json

---

## 0. 结论先说

1. **Rare UI 不是"装一个依赖库"，是 shadcn 生态的第三方 registry。** 装进来的是**你自己的源码文件**，可改可删、零锁定、退出成本≈0。
2. 装的前提是 **Tailwind + `cn()` + `motion`**。
   → **峰徊独立站天然契合**（它的 REUSE 阶梯第 2 层本来就是 shadcn/ui）；**PersonalWebsite 需要"单文件移植"或引入 Tailwind（架构级改动）**。
3. 21 个组件里，按我们两个项目的**真实缺口**算，只值得拿 **3–4 个**；其余不是不能用，是「用了会跟我们的设计取向打架」或「和我们已有的东西重叠」。

---

## 1. 它到底是什么（实测事实）

- 站点：rareui.com ｜ 作者 @swamimalode ｜ 仓库 github.com/swamimalode07/rare-ui
- **MIT**（GitHub API `license.spdx_id = mit`）
- 1152 ★ / 50 fork ｜ created 2026-06-10 ｜ **last push 2026-09-19**（昨天，仍在活跃开发）
- **21 个组件**，全部在 `components/ui/*.tsx`（清单见 §5）
- 安装方式（组件页原文，已验证 registry JSON 返回 200）：
  ```
  npx shadcn@latest add swamimalode07/rare-ui/notification-bell
  # 或直接吃 registry JSON
  npx shadcn@latest add https://www.rareui.com/r/notification-bell.json
  ```
- 自述定位：*"Every component is a single file you own, not a dependency you install."*
- 许可条款（组件页 License & Usage）：free for personal & commercial ✅ ｜ attribution appreciated ｜ don't resell as your own kit
- 仓库自带 `AGENTS.md` / `CLAUDE.md` / `CONVENTIONS.md` → 对 agent 友好

### ⚠️ 两条必须先知道的诚实说明

1. 作者自述：*"Most components here are recreations of great work from around the web. I don't claim to be the original creator - this is my attempt to reverse-engineer, replicate…"* → **不少是逆向复刻件**，用在商业站前需要逐个看第三方 IP 风险（尤其 emoji-reaction、family-drawer 这种明显带平台特征的）。
2. 站点页脚有 Pricing / Sponsors 档位 —— 但**组件本身 MIT 免费**，赞助是自愿的。别被 Pricing 页面误导。

---

## 2. 技术门槛（逐份 registry JSON 实测）

**21/21 的共同点：**
- 全部带 `"use client"`
- 全部声明 `registryDependencies: ["utils"]` → 需要 shadcn 的 `cn`（= `clsx` + `tailwind-merge`）
- 全部用 **Tailwind class 写样式**，含 arbitrary values（例：`bg-[#F4F4F9] dark:bg-[#262626]`）
- 多数依赖 **`motion`**（import 路径 `motion/react`，即 framer-motion 的新包名）
- 多数实现了 `useReducedMotion` → 尊重 `prefers-reduced-motion`

**两个项目的现实对照：**

| | PersonalWebsite（本工作目录） | 峰徊独立站 |
|---|---|---|
| 框架 | Next 16.2.7 + React 19.2.7 ✅ | 骨架未建（package.json 仅 zod + 工具链） |
| Tailwind | ❌ 无。手写 CSS 变量体系：`app/globals.css` + `design.md` token | ⚠️ S1 待建；`reference/nextjs-starter` 已带 shadcn **new-york** |
| `cn` / clsx / tailwind-merge | ❌ 全无 | ✅ reference 里有 `@/lib/utils` |
| 动画库 | `framer-motion ^12.40.0`（≈ `motion`） | 待定 |
| `components.json` | ❌ 无 | ✅ reference 里有（`iconLibrary: lucide`，别名 @/components/ui） |
| radix | ❌ 无 | ✅ dropdown-menu / select / slot / toast |
| **判定** | **需"单文件移植"，或引入 Tailwind（动到整套设计 token）** | **零摩擦**，但受 D-012 设计权威约束 |

---

## 3. 三条落地路径

| 路径 | 做什么 | 成本 | 什么时候选 |
|---|---|---|---|
| **A. 挂进规则层** | 峰徊 `REUSE.md` 第 3 层（registry/GitHub/npm）挂上 rareui 作为候选来源之一，`AGENTS.md` 套件索引加一行 | 极低（改 2 个文件） | 只想"账上记着"，等 S1 真有页面再挑 |
| **B. 挑真缺口的用** | 只在有明确缺口时按 §4 挑 1–2 个 `npx shadcn add` 进来 | 低 | 峰徊 S1 之后 |
| **C. 单文件移植** | 取一份 registry JSON 的 `content`，把 Tailwind class 换成本地 token class，放进 PersonalWebsite `components/` | 中（1 个文件 1 次手改） | 想现在就看到效果、又不想动架构 |

### C 路径的可行清单（按移植成本排序，数据来自 registry JSON 实测）

| 组件 | 体积 | `className=` 数 | arbitrary values | npm 依赖 | 移植难度 |
|---|---:|---:|---:|---|---|
| `fluid-orb` | 5.0 KB | 2 | 0 | **无** | 低（纯 WebGL canvas） |
| `matrix-orb` | 7.0 KB | 3 | 0 | **无** | 低 |
| `bounce-sidebar` | 5.3 KB | 5 | 2 | motion | 低 |
| `hook-sidebar` | 6.5 KB | 7 | 0 | motion | 低 |
| `gravity-letters` | 19.8 KB | 4 | 0 | **无** | 低（class 少，只是文件长） |
| `proximity-sidebar` | 9.6 KB | 4 | 1 | motion | 低 |
| `gooey-nav` | 7.6 KB | 5 | 8 | motion | 中 |
| `grid-reveal` | 18.9 KB | 4 | 1 | motion | 低 |
| `animated-counter` | 9.8 KB | 9 | 0 | motion | 低 |
| `notification-bell` | 10.2 KB | 8 | 15 | motion, @radix-ui/react-slot | 中 |
| `task-list` | 10.2 KB | 7 | 12 | motion | 中 |
| `otp-input` | 11.5 KB | 8 | 4 | motion | 中 |
| `delete-button` | 8.4 KB | 8 | 11 | motion | 中 |
| `scroll-progress` | 12.9 KB | 22 | 2 | motion | 中 |
| `github-activity` | 19.2 KB | 26 | 9 | motion | 中高 |
| `step-player` | 13.2 KB | 6 | 12 | motion, flubber | 中高 |
| `code-block` | 16.9 KB | 13 | 2 | motion, prism-react-renderer, lucide-react | 中高 |
| `emoji-reaction` | 17.8 KB | 14 | 2 | motion, react-apple-emojis, lucide-react, @radix-ui/react-slot | 高 |
| `duration-picker` | 12.3 KB | 10 | 10 | motion, figma-squircle, flubber, react-use-measure, @radix-ui/react-slot | 高（5 个包） |
| `folder-component` | 15.0 KB | 11 | 0 | motion | 中 |
| `family-drawer` | 31.0 KB | 35 | 58 | motion, vaul | 高 |

> 注：「体积」= registry JSON 里 `files[].content` 的字符数（源码字符，不是压缩后体积）。

---

## 4. 场景映射 —— 不选"看着好看"，选"真缺口"

### PersonalWebsite（个人站 / AI 学习博客）

| 组件 | 落点 | 判定 |
|---|---|---|
| `github-activity` | `/about` 或项目页：真实数据 + 有叙事 | ✅ **最推荐** |
| `scroll-progress` | 文章页阅读进度（给现有 `article-toc` / `back-to-top` 补位） | ✅ 推荐 |
| `gravity-letters` | 首页 hero 标题（零依赖，好移植） | ⚠️ 可作为，但必须守 reduced-motion |
| `fluid-orb` / `matrix-orb` | AI 文章封面、`/tools` 页氛围 | ⚠️ 轻量但纯装饰，别喧宾夺主 |
| `code-block` | ❌ **重叠** —— 已有 shiki + rehype-pretty-code + copy-button，按 REUSE「重叠度」检查应当**拒绝** |
| `otp-input` / `duration-picker` / `delete-button` / `notification-bell` / `family-drawer` | ❌ 无对应场景 | 拒绝 |

### 峰徊独立站（B2B 轮毂站；设计权威见 D-012 = Vercel 式克制；impeccable 默认取向是 quieter / distill 而非 bolder / overdrive）

| 组件 | 判定 |
|---|---|
| `scroll-progress` | ✅ 长技术页 / 产品页阅读进度，最不违和 |
| `task-list` | ⚠️ 可承载"选型 checklist"，需重做视觉 |
| `folder-component` | ⚠️ 可当"四条产品线"入口，但拟物偏 playful |
| `step-player` | ⚠️ 可承载"询盘/验收步骤"，但 B2B 要专业不要播放器 |
| `gravity-letters` / `fluid-orb` / `matrix-orb` / `grid-reveal` / `bounce-sidebar` / `proximity-sidebar` / `gooey-nav` / `emoji-reaction` | ❌ 与克制取向冲突，且会盖过证据内容 |

---

## 5. 21 个组件全清单 + 依赖（实测）

| 组件 | 体积(字符) | 依赖 |
|---|---:|---|
| `animated-counter` | 9,799 | motion |
| `bounce-sidebar` | 5,315 | motion |
| `code-block` | 16,916 | motion, prism-react-renderer, lucide-react |
| `delete-button` | 8,449 | motion |
| `duration-picker` | 12,290 | motion, figma-squircle, flubber, react-use-measure, @radix-ui/react-slot |
| `emoji-reaction` | 17,767 | motion, react-apple-emojis, lucide-react, @radix-ui/react-slot |
| `family-drawer` | 31,035 | motion, vaul |
| `fluid-orb` | 5,002 | — |
| `folder-component` | 14,971 | motion |
| `github-activity` | 19,239 | motion |
| `gooey-nav` | 7,631 | motion |
| `gravity-letters` | 19,758 | — |
| `grid-reveal` | 18,883 | motion |
| `hook-sidebar` | 6,532 | motion |
| `matrix-orb` | 6,955 | — |
| `notification-bell` | 10,169 | motion, @radix-ui/react-slot |
| `otp-input` | 11,526 | motion |
| `proximity-sidebar` | 9,631 | motion |
| `scroll-progress` | 12,939 | motion |
| `step-player` | 13,242 | motion, flubber |
| `task-list` | 10,157 | motion |

（21/21 另需 `registryDependencies: ["utils"]`，即 shadcn 的 `cn`。）

站点分类口径：Display 5（folder / code block / gravity letters / github activity / step player）｜AI kit 2（fluid orb / grid reveal）｜Navigation 3（bounce sidebar / proximity sidebar / scroll progress）｜Inputs 2（duration picker / OTP input）｜Feedback 2（emoji reaction / notification bell）｜New 3（notification bell / step player / grid reveal）—— 站点自报 14+，仓库实际 21 个。

---

## 6. 真要采纳，先过这 7 项（对齐峰徊 `REUSE.md` 的引入检查）

1. **许可证** — MIT ✅；但"recreations of great work"→ 复刻件可能含第三方 IP，商用站逐个看
2. **活跃度** — 1152★、昨天还在 push ✅
3. **兼容性** — Tailwind v4 / React 19 实测兼容性 **⚠️ 未验**
4. **体积与依赖树** — 见 §5；`duration-picker` 一条拉 5 个包，最该警惕
5. **退出成本** — 极低（源码归你，删文件即可）
6. **安全** — 单个 `.tsx`，仍需逐个人工过快检（**未做**）
7. **重叠度** — 先按 §4 把重叠的排掉（`code-block` 就是典型）

---

## 7. 未核验边界（诚实清单）

- ❌ Tailwind 版本兼容性（rareui 自己用哪版没查）、React 19 下的实测渲染
- ❌ SSR / hydration 行为（全部 `use client`，但静态导出下会不会出问题未测）
- ❌ WebGL 组件（fluid-orb / matrix-orb）在低端机 / 移动端的性能与耗电
- ❌ 21 个文件的逐个安全扫描（只看过 notification-bell 的头部）
- ❌ rareui 站点自报"14+ 组件"与仓库 21 个的差异原因（未追）
- 只精读了 `notification-bell` 的源码，其余按 registry 元数据 + 站点描述判断

---

## 8. 下一步（待定）

选一条走：**A** 挂规则层 ／ **B** 挑真缺口用 ／ **C** 单文件移植进 PersonalWebsite。

---

## 9. 已执行：走 B 路径，移植 `fluid-orb`（2026-09-20 13:17–13:40）

用户选了 B。**选 fluid-orb 而不是 gravity-letters**，理由是实测出来的：

| | fluid-orb | gravity-letters |
|---|---|---|
| 行数 | 199 | **687** |
| 其中物理引擎 | 0 | `useFallingGlyphs` 占 356 行 |
| Tailwind class 数 | 3 | 4（但 cn() 调用 + 内联样式拼接更绕） |
| 收益 | 环境氛围 | 入场动画 |

gravity-letters 要精确测量字体度量才能把字落到位，一旦本机字体（Avenir Next / PingFang）对不上就容易出残影或错位 —— 移植风险远大于收益。fluid-orb 是自包含的 WebGL 着色器，可验证性强。

### 三处改动（其余逐字保留）

1. Tailwind 工具类 → 本站 CSS 类 `.fluid-orb` / `.fluid-orb-canvas`（写进 `app/globals.css` 末尾，沿本文件"末尾追加章节"惯例）
2. `cn()`（shadcn 的 `@/lib/utils`）→ 本站没有这个工具，改成拼字符串
3. 默认颜色 → 读 CSS 变量 `--accent`（否则默认值是 Rare UI 自己的 `#1A73F2`，跟本站 `#3157FF` 不是同一个蓝）

**着色器保真度已核**：`VERT` / `FRAG` 两个模板字符串与上游 **sha1 完全一致**（78 / 1519 字符）。`hexToRgb` 只改了兜底色。

### 落点

`components/hero-section.tsx` 的 `.hero-panel-label` 里，"LIVE / 2026" 前面 —— 那里本来就是个状态信号位，环境光球放这里语义最贴。

### 验收（全部实测）

| 项 | 结果 |
|---|---|
| 着色器一致性 | sha1 与上游逐字相同 ✅ |
| `npm run typecheck` | 0 ✅ |
| `npm run lint` | 0 error / 8 warning（与改前同数，零新增）✅ |
| `npm test` | 74/74 ✅ |
| `npm run build` | ✅ |
| 静态产物 `.next/server/app/index.html` | `data-slot="fluid-orb"` ×1、`<canvas class="fluid-orb-canvas">` ×1、`hero-panel-live` ×1 ✅ |
| 真浏览器 · WebGL | context 存活、`isContextLost()=false`、`glError=0`、着色器编译+链接成功 ✅ |
| 真浏览器 · 像素 | 44×44 缓冲里 1484/1936 像素不透明 = **76.7%**（22px 圆的几何占比是 78.5%）→ 圆形遮罩正确、抗锯齿边缘存在 ✅ |
| 真浏览器 · 取值 | `--accent` 解出 `#3157ff` → token 路径生效（非兜底值）✅ |
| 真浏览器 · DPR | 22px × DPR2 = 44×44 缓冲，2x 上限生效 ✅ |
| 真浏览器 · 类名 | `class="fluid-orb"` **精确**，无残留 Tailwind ✅ |
| 真浏览器 · 布局 | 面板 scrollOverflow X/Y = 0、文档无横向溢出、球与文字同一行（top 都是 298）✅ |

### ⚠️ 两件必须说清的边界

1. **视觉外观未验证**。本轮会话的截图工具明确报"当前模型不支持图像输入"，所以**没有人真正"看过"这个球长什么样**。上面全是几何/像素/属性层面的测量。22px 这个尺寸是否顺眼，需要人眼确认。
2. **dev overlay 里有一条陈旧报错**：`SyntaxError: Identifier 'originalQuery' has already been declared`。查清如下 —— `originalQuery` 在**本站源码树零命中**，它来自 Next.js 自身内部（`node_modules/next/dist/server/route-modules/route-module.js` 等）；日志时间戳 `04:10:44Z` = 本地 12:10:44，**比本次第一次改动（13:17）早 1 小时 7 分**；冷加载后该遮罩尺寸仍是 `[0,0]`（未显示），且页面 WebGL 正常。→ 与本次移植无关。

### 未做（有意）

- 没给 `fluid-orb` 写测试：本站测试是 node 跑的 `lib/*.test.ts` 逻辑测试，WebGL 组件在 node 里测不了。真实验证走的是浏览器。
- 没做「离屏暂停动画」等优化：`requestAnimationFrame` 在后台标签页本来就不触发，上游行为已够。
- 颜色只在挂载时读一次 —— 运行中若主题切换导致 `--accent` 变化，球不会重新着色（已在组件注释里写明）。
