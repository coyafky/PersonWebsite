# 内容审计 · 2026-09-24

> 口径：本机静态扫描 `content/` 全部 321 个内容文件 + 现场 `curl` 线上页面核对。
> 所有数字均为实测，脚本 `node scripts/audit-content.mjs`（`--json` 出机器可读版）。
> 与 `optimization-audit-2026-09-18.md` 分工：那份查**仓库卫生/代码/渲染**，这份只查**内容可信度 + 阅读连通性 + 作品集可检索性**。

---

## 0. 一句话结论

**文字层面的问题都是小问题；真正拖后腿的是三件结构性的事：**
① 首页和导航按「内容类型」分栏，访客看不到「你做过什么」；
② 你最想被看到的三件事（CRM / 知识库 / 内容管线）只存在于 `blog/`，**不在 `projects/`**；
③ `series` 导航机制已经写好，但 **58/58 篇一个都没填** → 系列阅读全靠读者自己翻。

另有 **77 处内部死链**（29 个目标 / 27 个文件）仍未修复，且已由线上 `curl` 确认是真 404。

---

## 1. 🔴 结构性问题（优先级最高，因为招聘方第一眼看的不是文字）

### 1.1 首页没有「作品」，只有「栏目」

`app/(site)/page.tsx` 的构成 = Hero + 10 个 `portalEntries`。这 10 个入口**全部按内容类型命名**：

| 入口 | 描述原文 |
|---|---|
| Blog | 技术、想法和工程实践的长文。 |
| Weekly | 每周记录读了什么、做了什么、卡在哪。 |
| Learning | 按主题整理的结构化学习笔记。 |
| Book List | 读过的书、读书笔记、长期沉淀的认知。 |
| Course List | 视频课程笔记、按模块和课时组织。 |
| Projects | 做过的项目与可验证的能力证据。 |

`components/site-nav.tsx` 的 `navItems` 同样是 10 项按类型平铺（Blog / Diary / Weekly / Learning / Book List / Course List / Projects / Gallery / Tools / About）。

**后果**：一个只花 30 秒看首页的招聘方，看到的是「这是一个学习记录站」，看不到「这个人解决过什么业务问题」。
**对照**：`2026-06-08-first-note` 这种脚手架空文和 `2026-08-23-crm-sales-assistant-feishu` 这种代表案例，在首页的权重完全一样。

### 1.2 三个最强案例不在作品集目录里

`content/projects/` 只有 5 个：

| 项目 | featured |
|---|---|
| `ark-seedream-car-preview.mdx` | ✅ |
| `card-color-lab-manager.mdx` | ✅ |
| `openclaw-business-agent.mdx` | ✅ |
| `personal-website.mdx` | ✅ |
| `ai-image-generation-learning.mdx` | ❌ |

而 `getFeaturedProjects()` 是 `filter(featured).slice(0, 3)` —— **4 个 featured 里随机丢 1 个**（按读取顺序）。

飞书 CRM 销售助理、1188 篇产品目录知识库、GEOFlow 内容生产线、小红书/抖音图文管线 —— 这四件事**都只以 blog 形式存在**，`projects/` 里一个都没有。
而 blog 没有 `featured` 字段（`schemas.ts` 里只有 `projectSchema` 有）。

**结论**：作品的入口在 `projects/`，但作品本身在 `blog/`，两边不通。

### 1.3 `series` 机制空转

`lib/content/schemas.ts` 里 `series` / `seriesOrder` 是 base 字段，`components/series-nav.tsx` 已实现，`app/(site)/blog/[slug]/page.tsx:60` 已按 `seriesOrder` 排序 ——

**实测：58 篇 blog，填写 `series` 的 = 0 篇。**

同理 `status`：**58/58 全是 `published`**，`draft` / `archived` 一个没用。所以现在没有任何机制能把「测试文/脚手架文」挡在公开区之外。

---

## 2. 🔴 死链：77 处 / 29 个目标 / 27 个文件（全部可机械修复）

根因：内链写的是**加日期前缀之前的旧 slug**。线上已确认：

```
404  /blog/how-network-work          →  200  /blog/2026-07-09-how-network-work
404  /learning/geo/what-is-geo       →  200  /learning/geo/2026-07-09-what-is-geo
```

⚠️ **修 learning 的链接时必须带二级主题段**：`/learning/<topic>/<slug>`。
（`/learning/2026-07-09-what-is-geo` 也是 404 —— 我第一版脚本给的建议路径就是错的，已修正。）

分布：`learning 47 处` ｜ `blog 29 处` ｜ `projects 1 处`
来源最集中的文件是 GEO 系列（11 个文件贡献了 47 处，其中 `2026-07-21-geo-from-keywords-to-ai-search.md` 一个文件 6 处）。

完整映射表（出现次数 × 正确地址）见本文件末尾附录 A。

---

## 3. 🟠 可信度：这是求职场景里最贵的瑕疵

我先做了全量口径统计（**346 处**命中，分布：`blog 149 / learning 155 / book-list 35 / course-list 5 / career 2`），
然后**逐类复核**，结论如下 —— 其中大部分是误报，真正的硬问题只有 6 条：

### 3.1 🔴 同一篇文里三个互相矛盾的时间口径（`2026-03-21-openclaw-youtube-reading-comprehension.md`）

| 位置 | 原文 |
|---|---|
| `:247` | mermaid 柱状图 `bar [30, 60, 60, 20, 170]` vs `bar [2, 0, 2, 3, 7]` |
| `:251` | **效率提升：24 倍** |
| `:321` | 计划表写「170min vs 7min 柱状图」 |
| `:343` | 正文写「**全程 2 分钟，自动化完成！⚡**」 |

7 分钟和 2 分钟是同一篇文章里的两个数。而「24 倍」= 170÷7，**分母里不含教师审核、返工、排版校对**。
另外 `:375` 写「**项目地址：（待发布到 ClawHub）**」，但标题/结语用的是「从零到发布」的语气。

### 3.2 🔴 fork/star 比值被当成「率」（`2026-09-17-yichen-skills-source-available.md`）

- `:56` 小标题：「`41.5%：一个比 star 数更能说明问题的数字`」
- `:69`：「**41.5%。是图表引擎的 6.5 倍，是生命周期技能包的 4 倍。**」

fork/star 是**两个计数的比值**，读不出「41.5% 的使用者 fork 了」。
文中据此推出的「每个使用者都必须改文件」「大量 fork 是因为想学作者的工作方式」「这解释了作者选许可证的动机」三条，都是**未验证的推断**（摘要里也写着「最让我意外的是它的 fork 率」）。

### 3.3 🔴 对话残留（同一篇）

- `:239`：「**既然这个仓库跟你的日常（微信、小红书、抖音、公众号、剪映）重叠度是六个里最高的**」——预设了某位具体读者的工作背景
- `:324`：「**如果里面有哪个技能对你手上的活儿正好有用……跟我说一声，我可以先帮你把它的实现和边界完整过一遍，再决定要不要接进来。**」

**已确认仍在当前文件里**（本次审计实时扫出，非历史记录）。线上链接：`/blog/2026-09-17-yichen-skills-source-available`

补充同一篇的 `:54-72`：那张对比表里的 star/fork 数字（`40,516` / `95,465` / `63,059` / `6,694` / `153` / `3,058`）**没有标注记录日期** —— 而文章自己在 `2026-09-16-agent-skills-catalog-evals.md:241` 引用的原话就是「star 数在博客里的引用极其不一致，而且每周都在变」。

### 3.4 🟠 引用数据缺条件

| 文件:行 | 原文 | 问题 |
|---|---|---|
| `2026-08-13-ai-era-seo-survival-guide.md:150` | Google 只要出现 AI Overview，第一名的点击率就掉 58% | 无来源、无时间、无适用条件；Ahrefs 原文是「特定时期数据上观察到的关联」 |
| `2026-07-09-server-deploy-and-nginx.md:281` / `2026-07-21-nginx-from-zero.md:4` | 全球 top 100 万网站里超过 30% 用它 | 合理但需注明数据源与年份（且它出现在 summary 里） |
| `2026-08-23-ai-image-generation-print-color-management.md:80` | 250g/m² 以下的纸一般不超过 280% | 印刷工艺经验值，需注明依据 |
| `2026-07-09-terminal-linux-basics.md:402` | 99% 是环境变量问题 | 修辞夸张，建议改「大多数情况」 |

**全量复核结果**：`绝对化措辞` 命中 39 处（blog），我逐条看过，**基本全是合法的设计纪律**（「绝不砍 description」「绝不把 App Secret 写死在模板里」「零成本迭代」指免费卡额度），**不建议批量改**。

### 3.5 🟠 外部数据（star 数）缺「记录日期」—— 18 处

部分文章写得很好（`2026-09-17-yichen-skills-source-available.md:52`「2026-02-11 建仓」、`2026-09-15-xialingguo-ip-cover-skill.md:20`「9 月 10 日建的仓库，五天内 125 star」），
但另一些只给数字不给日期：`40k stars`、`95,125 star`、`62,913 star`、`17k star`、`3,058 star / 1,268 fork`。
`2026-09-16-agent-skills-catalog-evals.md:241` 自己甚至还引用了「star 数在博客里的引用极其不一致，而且每周都在变」——**说明作者已经意识到这个问题，但没落到自己的文章上**。

### 3.6 🟠 脚手架文章在线

`content/blog/2026-06-08-first-note.mdx`（标题「第一篇记录」，正文是「可以写：为什么要维护这个网站…」+「## 表格示例」）——
线上实测 **`http://119.91.205.130/blog/2026-06-08-first-note` → 200**。
它还是全站 summary 唯一短于 40 字的帖子（「个人网站内容系统启动时的第一篇草稿。」）。

---

## 4. 🟡 内容治理长尾

| 项 | 实测 |
|---|---|
| 标签总数 | **117 个**，其中 **38 个只出现 1 次**（不可导航） |
| blog 缺 `englishSummary` | 4 篇：`2026-07-27-vibe-coding-terminology`、`2026-07-29-hermes-multi-profile-replication`、`2026-07-29-hermes-multi-profile-streaming-practice`、`2026-07-30-feishu-image-generation-fixed-workflow` |
| 跨文重复段落 | 7 段，但**逐条看过，全是误报**：重复的是「上一篇 / 下一篇」导航块、共用代码片段、mermaid 的 `style` 行。**不是内容注水** |
| 内容间引用分布 | 165 处内链 / 57 个目标 —— 对一个 58 篇文章的站来说偏低，且 27 个文件承担了 77 处错误引用 |

---

## 5. ✅ 已确认健康（不要动）

| 项 | 实测 |
|---|---|
| 图片引用 | content 里所有 `![](...)` 指向的 `public/` 文件 **0 缺失** |
| frontmatter | 按**各集合自己的 schema** 校验，**必填字段 0 缺失**（我第一版按 blog 的必填去套 projects/weekly，报了 36 条假缺失，已修正） |
| SEO 基建 | `app/sitemap.ts` / `robots.ts` / `rss.xml` / `feed.xml` 齐备 |
| 结构化数据 | `components/json-ld.tsx` 已输出 `BlogPosting`（headline / description / datePublished / author / publisher） |
| 构建产物一致性 | 线上 58 篇与本地一致（2026-09-23 已核对） |

---

## 6. 🎯 新发现的机会（针对「AI 专员」定位）

1. **没有 `llms.txt`**（`public/` 下只有 robots/sitemap 相关）。一个讲 GEO 的站自己不提供给 AI 读的说明文件，是个现成的反差。
2. **JSON-LD 里的 author 太薄**：目前只有 `Person / name: "Coya Feng"`，缺 `jobTitle`、`sameAs`（GitHub / 飞书？）、`knowsAbout`。这三个字段成本极低，且直接服务于「AI 引用你」。
3. **dead link 修完后，可以让 GEO 系列的内链**变成一条**真正可爬的链路** —— 现在 GEO 系列的交叉引用**一半是 404**，等于把系列内链的 SEO 价值全丢了。
4. **`series` 一旦填上**，`series-nav` 立刻可用，且可以给「营销内容生产」这类专题做一个总览入口 —— **不需要写新代码**。

---

## 7. 建议执行顺序

| 顺序 | 动作 | 风险 | 工作量 |
|---|---|---|---|
| 1 | 修 77 处死链（附录 A 映射表，逐条唯一对应） | 极低（纯字符串替换） | 一条脚本 |
| 2 | 删/下线 `2026-06-08-first-note`（或改 `status: archived`） | 极低 | 1 分钟 |
| 3 | 修 openclaw 那篇的三个时间口径 + `待发布` 表述 | 低 | 30 分钟 |
| 4 | 改写 yichen 那篇 41.5% 一节 + 删 2 处对话残留 | 低 | 30 分钟 |
| 5 | 给 4 处外部数据补来源/日期条件 | 低 | 30 分钟 |
| 6 | 填 `series` / `seriesOrder`（GEO 系列 / 生图 11 篇 / 零基础技术 一组） | 低 | 1 小时 |
| 7 | 把 CRM / 知识库 / 内容管线**升级为 `projects/` 条目**，并让首页出现「精选作品」区 | 中（动 IA 与组件） | 半天 |
| 8 | 加 `llms.txt` + 补 JSON-LD 的 `jobTitle`/`sameAs`/`knowsAbout` | 低 | 1 小时 |

**1–5 是「止血」，7 才是「让网站真的能帮你找工作」。**

---

## 附录 A · 死链映射表（29 个目标 / 77 处）

| 死链目标 | 出现次数 | 正确地址 |
|---|---|---|
| `/blog/how-network-work` | 15 | `/blog/2026-07-09-how-network-work` |
| `/learning/geo/source-in-geo-4-tier-guide` | 9 | `/learning/geo/2026-07-09-source-in-geo-4-tier-guide` |
| `/learning/geo/geo-from-keywords-to-ai-search` | 6 | `/learning/geo/2026-07-21-geo-from-keywords-to-ai-search` |
| `/learning/geo/geo-three-core-elements` | 6 | `/learning/geo/2026-07-21-geo-three-core-elements` |
| `/learning/geo/why-enterprises-see-no-geo-effect` | 5 | `/learning/geo/2026-07-09-why-enterprises-see-no-geo-effect` |
| `/learning/geo/geo-source-matrix` | 5 | `/learning/geo/2026-07-21-geo-source-matrix` |
| `/learning/geo/geo-ai-search-answer-mechanism` | 4 | `/learning/geo/2026-07-21-geo-ai-search-answer-mechanism` |
| `/learning/geo/geo-trust-citation-and-brand-recommendation` | 3 | `/learning/geo/2026-07-21-geo-trust-citation-and-brand-recommendation` |
| `/blog/nginx-from-zero` | 2 | `/blog/2026-07-21-nginx-from-zero` |
| `/learning/geo/geo-semantic-chunking-and-vectorization` | 2 | `/learning/geo/2026-07-21-geo-semantic-chunking-and-vectorization` |
| `/learning/geo/doubao-recall-shift-to-douyin` | 2 | `/learning/geo/2026-07-09-doubao-recall-shift-to-douyin` |
| `/blog/react-data-driven-ui` | 1 | `/blog/2026-07-09-react-data-driven-ui` |
| `/blog/terminal-linux-basics` | 1 | `/blog/2026-07-09-terminal-linux-basics` |
| `/blog/git-version-control` | 1 | `/blog/2026-07-09-git-version-control` |
| `/blog/server-deploy-and-nginx` | 1 | `/blog/2026-07-09-server-deploy-and-nginx` |
| `/blog/js-modules-history` | 1 | `/blog/2026-07-09-js-modules-history` |
| `/blog/react-frontend-rules` | 1 | `/blog/2026-07-09-react-frontend-rules` |
| `/blog/npm-and-vite` | 1 | `/blog/2026-07-09-npm-and-vite` |
| `/blog/github-remote-and-mcp` | 1 | `/blog/2026-07-09-github-remote-and-mcp` |
| `/blog/know-your-computer` | 1 | `/blog/2026-07-09-know-your-computer` |
| `/blog/api-basics` | 1 | `/blog/2026-07-09-api-basics` |
| `/blog/api-practice-review` | 1 | `/blog/2026-07-21-api-practice-review` |
| `/blog/nextjs-deploy-pitfalls` | 1 | `/blog/2026-07-21-nextjs-deploy-pitfalls` |
| `/learning/geo/what-is-geo` | 1 | `/learning/geo/2026-07-09-what-is-geo` |
| `/learning/geo/geo-mention-vs-citation-and-platform-differences` | 1 | `/learning/geo/2026-07-21-geo-mention-vs-citation-and-platform-differences` |
| `/learning/geo/geo-intent-and-question-classification` | 1 | `/learning/geo/2026-07-21-geo-intent-and-question-classification` |
| `/learning/geo/geo-knowledge-base-as-core-lever` | 1 | `/learning/geo/2026-07-21-geo-knowledge-base-as-core-lever` |
| `/learning/geo/geo-scope-discipline-and-measurement` | 1 | `/learning/geo/2026-07-21-geo-scope-discipline-and-measurement` |
| `/learning/ai-image-generation` | 1 | `/learning/ai-image-generation/2026-08-22-what-is-ai-image-generation` |

> 注：`2026-09-18` 那份审计报的是「29 处 / 14 个目标」—— 那次只扫了 blog。
> 本次把 `learning/` 一起扫进来，真实量是 **77 处 / 29 个目标**。

---

## 9. 执行记录（2026-09-24 09:22–09:35）

用户拍板：**① 先修死链，再做作品集化 ② `2026-06-08-first-note` 改 `status: archived` 下线**

### 已执行

| 动作 | 结果 |
|---|---|
| 修 29 个死链目标 / 77 处 | **全部替换完成**，重跑审计 → **死链 0** |
| 改动文件 | 27 个内容文件（+ `package.json` + `first-note` 共 29 个） |
| 修前校验 | 29 个建议地址**逐个对照 `content/` 下真实文件**，0 个不通过 |
| dry-run | 预演结果 **77 处 / 27 文件**，与审计计数**逐项吻合**才落盘 |
| `2026-06-08-first-note` | `status: published` → `archived` |

### 验证（不是"跑完没报错"，是实测）

| 验收项 | 方法 | 结果 |
|---|---|---|
| 死链归零 | `node scripts/audit-content.mjs --json` | **0** |
| frontmatter 仍完好 | 同上 | **0 缺失** |
| 图片引用未受伤 | 同上 | **0 缺失** |
| 状态分布 | 同上 | `published 57 / archived 1` |
| 归档文真的下线 | 本地 `next start` + `curl` | `/blog/2026-06-08-first-note` → **404** ✅ |
| 修好的链接真的能开 | 同上 | `/blog/2026-07-09-how-network-work` → **200**、`/learning/geo/2026-07-09-what-is-geo` → **200** ✅ |
| 类型检查 | `npx tsc --noEmit` | **通过** |
| lint | `npx eslint .` | **0 error / 10 warning**（与修前同数，未新增） |
| 构建 | `npm run build` | **通过** |
| 构建产物 | `.next/server/app/blog/` 与源逐项比对 | 57 篇全构建，`first-note` **未产出页面**（只有 `next start` 期间被写入的 404 缓存文件） |

> ⚠️ 排查时的一个坑（记录备查）：`.next/server/app/blog/<slug>.html` 里出现的 `how-network-work.html` / `2026-06-08-first-note.html`
> **不是真页面**，而是 `next start` 期间对这两个 URL 请求 **404 后写的缓存**（mtime 09:31:42 = curl 时刻，
> 而所有真页面的 mtime 是 09:28:4x = 构建时刻；且这两个文件里搜不到正文标题）。
> **判断某个 slug 有没有被构建，要看 mtime 和内容，不能只看文件存在。**

### 未执行（等排期）

- 第 3–5 项（openclaw 时间口径 / yichen 的 41.5% / 外部数据来源）
- 第 6 项（填 `series`）
- **第 7 项（作品集化）← 进行中**
- 第 8 项（`llms.txt` + JSON-LD 富化）
