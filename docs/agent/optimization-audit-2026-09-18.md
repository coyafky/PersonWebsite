# PersonalWebsite 优化审计

> 审计日期：2026-09-18 ｜ 方法：实跑 `npm test` / `npx tsc --noEmit` / `npx eslint .` / `npm run build`，外加资源引用、内部链接、依赖、git 历史四类静态审计。
> 所有数字均为本机实测，未使用估算。

---

## 0. 一句话结论

**代码本身是健康的**（typecheck 0 错、lint 0 error、build 221 页 18s 通过），
问题集中在 **仓库卫生**（375 MB 死资源 + 死依赖）、**内容层**（38% 的内部链接是 404）、
**渲染策略**（3 个本该静态的入口在服务端按需渲染）和 **结构性重复**（三套复制粘贴路由）。

---

## 1. 🔴 P0 · 立刻处理（低风险 / 高收益）

### 1.1 `public/image-assept/` —— 201 MB 死资源（占 public 的 75%）

| 项 | 实测值 |
|---|---|
| 大小 | **201 MB**（`轮毂正常_files/` 174 MB + `picture/` 27 MB） |
| 引用 | **0 处**（`app/` `components/` `lib/` `content/` 全目录 grep 无命中） |
| git 状态 | `?? public/image-assept/` —— **未跟踪，同时也未被 .gitignore 忽略** |
| 内容 | `轮毂正常_files/` 是**保存网页时落下的资源目录**；`picture/` 是 AI 生成图 |

**三重代价**：① 每次 build / deploy 都上传这 201 MB；② 目录名 `assept` 是 `accept` 的拼写错误；
③ 未 ignore → 一次 `git add .` 就把 201 MB 送进仓库。

**建议**：移出 `public/`（挪到 `~/Documents/Alma/` 之类的外部目录），并在 `.gitignore` 补 `public/image-assept/`。

### 1.2 `public/audio/` —— 47 MB 商业音乐，零引用，已入 git

- 10 个 mp3，`git ls-files` 确认**全部已被跟踪**，合计 47 MB
- 文件名指向商业歌曲：`yellow-coldplay.mp3`、`paradise-coldplay.mp3`、`lovely-billie-eilish.mp3`、
  `watermelon-sugar.mp3`、`something-just-like-this.mp3` 等
- 代码 / 内容里**引用数为 0**（唯一命中在 `.alma-snapshots/` 哈希清单里）
- 依赖里的 `react-modern-audio-player` 同样**零引用**

**风险**：`public/` 下的文件会被 Next.js 原样静态发布 —— 等于把这些音轨挂在站点上公开可下载。
建议先确认是否有意公开；若无，从工作区与 git 历史移除（历史清理需 `filter-repo`）。

### 1.3 🔴 14 个内部链接指向 404（29 处 / 15 个文件）

**根因**：博客后来统一加了日期前缀（`api-basics.md` → `2026-07-09-api-basics.md`），
但正文里的交叉引用仍写着**旧 slug**。

- 全站内容里共 **37 个**不同的内链目标 → **14 个（38%）解析不到任何文件**
- 出现 **29 次**，散落在 **15 个**内容文件

全部 14 个都有 **1:1 的对应文件**，可机械修复：

| 正文里的死链 | 实际文件 |
|---|---|
| `/blog/api-basics` | `2026-07-09-api-basics.md` |
| `/blog/api-practice-review` | `2026-07-21-api-practice-review.md` |
| `/blog/git-version-control` | `2026-07-09-git-version-control.md` |
| `/blog/github-remote-and-mcp` | `2026-07-09-github-remote-and-mcp.md` |
| `/blog/how-network-work` | `2026-07-09-how-network-work.md` |
| `/blog/js-modules-history` | `2026-07-09-js-modules-history.md` |
| `/blog/know-your-computer` | `2026-07-09-know-your-computer.md` |
| `/blog/nextjs-deploy-pitfalls` | `2026-07-21-nextjs-deploy-pitfalls.md` |
| `/blog/nginx-from-zero` | `2026-07-21-nginx-from-zero.md` |
| `/blog/npm-and-vite` | `2026-07-09-npm-and-vite.md` |
| `/blog/react-data-driven-ui` | `2026-07-09-react-data-driven-ui.md` |
| `/blog/react-frontend-rules` | `2026-07-09-react-frontend-rules.md` |
| `/blog/server-deploy-and-nginx` | `2026-07-09-server-deploy-and-nginx.md` |
| `/blog/terminal-linux-basics` | `2026-07-09-terminal-linux-basics.md` |

典型现场：`content/blog/2026-07-21-api-practice-review.md:345`
```md
上一篇：[API从0-1：从看懂接口到自己设计接口](/blog/api-basics)   ← 404
```

### 1.4 仓库体积与垃圾文件

| 目录 | 大小 | 说明 |
|---|---|---|
| `.next` | 1.6 GB | 构建产物（已 ignore，可随时删） |
| `node_modules` | 630 MB | 正常 |
| `public` | 268 MB | 其中 248 MB 是 1.1 / 1.2 的死资源 |
| `.git` | **227 MB** | `size-pack: 0`、`count: 1857` → **从未 gc，全是 loose object** |
| `.alma-snapshots` | 176 MB | Alma 的文件快照，被放在项目目录内（已 ignore） |
| `output` | 36 MB | 未跟踪的生图输出 |

**建议**：`git gc --aggressive --prune=now`（能显著压缩 loose 对象）；
把 `.alma-snapshots` 迁出项目目录。

**已跟踪的垃圾**（`git ls-files` 确认）：
`.playwright-cli/` 12 个调试文件（console log + page yml）、`practice/`（dog-gallery、local-api 两个玩具实验）、
`tasks/plan.md`、`tasks/todo.md`（v0.3 的旧计划）。

---

## 2. 🟠 P1 · 渲染策略（三个入口在做无用功）

build 输出的路由类型实测：

| 路由 | 类型 | 问题 |
|---|---|---|
| `/blog` | **ƒ Dynamic** | 主内容入口，因读 `searchParams.page` 分页 → 每次请求都服务端渲染 |
| `/tags/[tag]` | **ƒ Dynamic** | **没有 `generateStaticParams`** → 每个标签页都按需渲染 |
| `/feed.xml` | **ƒ Dynamic** | 硬编码 `export const dynamic = "force-dynamic"` |
| `/rss.xml` | **ƒ Dynamic** | 复用 feed 的 GET，同样被强制动态 |

对照：`/blog/[slug]`、`/diary`、`/learning/[topic]`、`/book-list/[book]` 等**全部是 ○/● 静态**。
也就是说只有这 4 个入口没吃到静态化红利。

**建议**：
- `/tags/[tag]` 补 `generateStaticParams()`（列出 `getAllTags()`）→ 变成 ● SSG，成本几乎为零
- `/feed.xml` 的 `force-dynamic` 改成 revalidate（内容更新走重建即可）
- `/blog` 分页若想静态化，改成 `/blog/page/2` 形式的 route segment
  （代价是 URL 变化，属可选）

另有一条 build 警告：`⚠ Using edge runtime on a page currently disables static generation for that page`
（来源 `app/api/og/route.tsx` 的 `export const runtime = "edge"`）。

---

## 3. 🟠 P1 · 客户端 JS

| 项 | 实测 |
|---|---|
| `.next/static` 下 JS 总量 | 4.2 MB（全量，非单页载荷） |
| 全量 gzip 后 | ~1.10 MB |
| 最大单个 chunk | 572 KB —— 是 **mermaid** |
| client component 数量 | 17 个 |

**已经做得好的一点**：`components/mermaid.tsx` 用的是**懒加载单例**
（`await import("mermaid")` 包在 promise 缓存里）→ 572 KB 只在真有图的页面加载。这是正确做法。

**可优化点**：`app/(site)/layout.tsx` 引入了 `PageTransitionWrapper`（framer-motion），
意味着 **framer-motion 在整站每个页面都会进 client bundle** —— 对一个以文字为主的站点偏重。
7 个文件用到 framer-motion，可考虑：① 页面切换动画换成纯 CSS；② 只在需要的页面按需引入。

---

## 4. 🟡 P2 · 结构与可维护性

### 4.1 三套近乎复制粘贴的路由

`learning/` ｜ `book-list/` ｜ `course-list/` 是同一个「主题 → 笔记」两级结构的三份实现：

| 页面 | 行数 |
|---|---|
| `learning` / `[topic]` / `[topic]/[slug]` | 53 / 83 / 102 |
| `book-list` / `[book]` / `[book]/[slug]` | 39 / 90 / **115** |
| `course-list` / `[course]` / `[course]/[slug]` | 39 / 98 / **115** |

实测 `book-list/[book]/[slug]/page.tsx` 与 `course-list/[course]/[slug]/page.tsx` 的 diff：
**差异几乎全是字符串字面量**（`book-list/` ↔ `course-list/`、`book` ↔ `course`、
`seriesNotes` 的路径拼接、JSON-LD 的 path），逻辑完全一致。

**建议**：抽一个 `TopicCollectionPage` 工厂 / 共享组件，三处传不同配置。
注意 —— 这属于**重构**，收益是可维护性而非用户可见性能，建议排在 P0/P1 之后。

### 4.2 `weekly` 是已退役的内容类型，但仍然全链路活着

你 9/17 明确「把周记内容拆分成日记，不做周记了」，但：

- `content/weekly/` 仍有 **23 个文件**，其中 **14 个是 `status: draft`**
- 仍有完整路由 `/weekly` + `/weekly/[slug]`（build 里产出 9 条）
- 仍占 **sitemap**、仍占 **RSS feed**（`feed.xml` 的内容源是 blog + **weekly**）
- 仍占 **footer 导航**，而新的 `/diary`（68 篇）**反而不在 footer 里**
- 组件层还有 `entry-card-weekly.tsx`

而 68 篇 diary 已经是从 weekly 重建出来的 —— **两套内容在讲同一件事**。

**建议**：明确 weekly 的去留。若确认退役 → `/weekly` 加 301 重定向到对应 diary 日期，
feed 内容源换成 diary，footer 换掉。

### 4.3 死代码与死依赖

| 对象 | 状态 |
|---|---|
| `components/theme-provider.tsx` | **从未被 import**（全库唯一引用是它自己） |
| `next-themes@^0.4.6` | 只有 `theme-provider.tsx` 用 → 随之变成死依赖。且实测主题是 CSS 级处理，没走它 |
| `react-modern-audio-player@^2.4.1` | **0 引用** |
| `@vercel/og@^0.11.1` | **0 引用**（`app/api/og` 用的是 `next/og`） |
| `shiki@^4.2.0` | **0 直接引用**（由 rehype-pretty-code 间接带入） |

### 4.4 weekly 文件名破坏了 slug 一致性

`content/weekly/` 里 **22 个文件是 `2026-WNN`，2 个是 `2026-W-NN`**（`2026-W-21.md`、`2026-W-31.mdx`）。
schema 的正则是 `/^\d{4}-W\d{2}$/`，只校验 frontmatter，所以校验通过 —— 但**产出的 URL 不一致**：

`/weekly/2026-W18` ✅ ｜ `/weekly/2026-W-21` ⚠️ ｜ `/weekly/2026-W19` ✅

---

## 5. 🟡 P3 · 工程与细节

### 5.1 有 1 个测试文件从来没被跑过

```json
"test": "node --test --experimental-strip-types $(find lib -name '*.test.ts' -type f)"
```

glob **只扫 `lib/`**。而 `app/(site)/projects/[slug]/page.test.ts`（对真实 MDX 做 `extractHeadings` 断言）
在 `lib/` 之外 → **不在收集范围内，从未执行**。

实测当前：`tests 32 / pass 32 / fail 0`（只覆盖 4 个 lib 测试文件），
而项目有 ~6,652 行 TS/TSX。

**建议**：glob 改成扫全仓（排除 node_modules / .next）。

### 5.2 没有 CI

全仓**没有任何 GitHub Actions workflow**（`.yml` 命中全是 `.playwright-cli/` 的调试文件）。
typecheck / lint / test / build 全靠手动跑。建议加一个最小 workflow 把这四条串起来。

### 5.3 SEO / a11y 细节

| 项 | 现状 | 建议 |
|---|---|---|
| `<html lang>` | 硬编码 `zh-CN`（`app/layout.tsx`） | schema 里 blog/diary 都有 per-post `lang` 字段，但没反映到 HTML —— 英文文章的 `lang` 是错的 |
| twitter card | `summary` | 站点有 OG 图能力 → `summary_large_image` 更合适 |
| `<html>` 无 `theme-color` | — | 移动端地址栏配色 |
| 图片 `alt` | ✅ 全部有（`<Image>` 与 `<img>` 0 处缺失） | 无需处理 |
| `entry-card-project.tsx` | 封面用 `alt=""` | 属装饰图，可接受 |

### 5.4 8 条 lint warning（未使用 import）

`app/feed.xml/route.ts`（3）、`components/json-ld.tsx`（3）、`components/related-posts.tsx`（1）、
`scripts/diary-from-weekly.mjs`（1，`WEEKDAY_CN` 定义了没用）。顺手可清。

---

## 6. 已确认健康的部分（无需动）

- ✅ `npx tsc --noEmit` → **0 error**
- ✅ `npx eslint .` → **0 error / 8 warning**
- ✅ `npm run build` → **221 页，18s 通过**
- ✅ `npm test` → **32/32 pass**
- ✅ 图片优化：全站用 `next/image`，**0 处裸 `<img>`**
- ✅ mermaid 懒加载策略正确
- ✅ 内容层有 **zod schema 校验** + **重复 slug 检测**（`reader.ts` 会 `throw`）
- ✅ 有 `prebuild` 钩子跑 `images:check`（图片引用完整性门禁）
- ✅ sitemap / RSS / JSON-LD / OG 图 / canonical 都已实现
- ✅ `/rss.xml` 是 `/feed.xml` 的显式别名（注释写明「单一事实来源」）—— 这是有意设计，不是重复

---

## 7. 建议执行顺序

| 批次 | 内容 | 风险 | 预估 |
|---|---|---|---|
| **第 1 批** | 1.1 移出 image-assept + ignore ｜ 1.3 修 14 个死链 ｜ 5.4 清 warning | 极低 | ~20 min |
| **第 2 批** | 1.2 处理 audio ｜ 1.4 `git gc` + 清跟踪垃圾 ｜ 5.1 修 test glob | 低 | ~30 min |
| **第 3 批** | 2 三个路由静态化 ｜ 4.3 删死代码/死依赖 | 中（要回归验证） | ~1 h |
| **第 4 批** | 4.2 weekly 退役决策 ｜ 5.2 加 CI ｜ 5.3 SEO 细节 | 中（含产品决策） | ~1.5 h |
| **第 5 批** | 4.1 三套路由抽象 ｜ 3 framer-motion 瘦身 | 中（重构） | ~2 h |

---

## 8. 需要你拍板的三个问题

1. **`public/audio/` 的 10 首音乐**：是要公开提供的（那要考虑版权），还是当年遗留忘了删？
2. **`weekly` 栏目**：确认退役 → 做 301 到 diary？还是保留为历史存档？
3. **本批要执行到哪一批**？（第 1 批是零风险的，随时可开工）
