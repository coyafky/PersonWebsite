# 博客精简方案（60 → 23 篇）

制定时间：2026-10-06
决策来源：用户选择「激进精简 + 教程合并 + archived 保留 + 全文去 AI 味改写」

---

## 一、诊断：为什么现在看着像 AI 站

| 证据 | 数字 | 说明 |
|---|---|---|
| 日期聚簇 | 08-23 一天 **17 篇**、07-09 一天 **11 篇** | 47% 内容挤在两天，非自然写作节奏 |
| 标签集中 | `zero-to-tech` **16 篇**、`AI 生图` **12 篇**、`拆解` **5 篇** | 三个标签吃掉 55% |
| 标题模具 | **52/60** 用「主标题：副标题」冒号句式 | 列表页一眼望去全是同一模具 |
| 教科书编号 | 生图系列 H2 用「一、二、三…」 | 教材体，不是文章体 |
| 第一人称缺失 | 生图系列 **6 篇「我」= 0**，个人经历信号 = 0 | 没有作者的痕迹 |
| 否定式排比 | 「不是」**473** 次 /「而是」**101** 次 | 典型 AI 句式指纹 |
| 仓库流水 | 「拆 X 万 star」4 篇互相引用形成闭环 | star 数会过期，且彼此互链像内循环 |

**核心病灶**：内容按「知识覆盖」组织，不是按「我做了什么」组织。
个人网站的可信度来自第一人称经验，不来自教程完备度。

---

## 二、分级结果

### A 级 — 保留并深度改写（15 篇）
有真实个人经验、第一人称密集、或主题具唯一性。

| 文件 | 保留理由 |
|---|---|
| 2026-10-03-7-rules-of-power-notes.mdx | 「我」48 次，有抵触点开→警惕的真实心理转折 |
| 2026-09-16-strix-pentest-closure-discipline.md | 「我」35，有「我原以为…读完发现」的认知反转 |
| 2026-09-10-ai-knowledge-base-matching.md | 「我」28 + 经历 3，真实业务场景 |
| 2026-09-15-diagram-design-skill-engineering.md | 「我」24 + 经历 4，58 条 CI 关卡是硬发现 |
| 2026-09-21-json-render-generative-ui-architecture.mdx | 「我」23，架构判断有观点 |
| 2026-08-23-geoflow-content-production-pipeline.md | 「我」18 + 经历 6，有「原料才是瓶颈」的真实结论 |
| 2026-08-22-ai-teaching-system-design.md | 「我」17，学习方法论来自自身实践 |
| 2026-08-24-page-by-page-reading.md | 「我」13，自建 Skill 的设计过程 |
| 2026-06-25-why-write-prd-spec-before-project.md | 「我」13，Claude Code 实战观点 |
| 2026-08-23-douyin-cover-skill.md | 「我」11，亲手做的 Skill |
| 2026-08-23-xiaohongshu-graphic-pipeline.md | 「我」6，真实管线（含「商业只敢放图4」的判断） |
| 2026-08-23-hermes-streaming-cards-feishu.md | 「我」8 + 经历 2，真实排坑 |
| 2026-07-21-nextjs-deploy-pitfalls.md | 经历信号 **14**（全场最高），7 个真实踩坑 |
| 2026-09-17-cwebp-batch-image-conversion.md | 短小具体，有可复用的真实结论 |
| 2026-10-04-headless-wordpress-graphql-client.mdx | 近期真实重构，有踩到的两个问题 |

### B 级 — 合并为零（4 篇新长文，吃掉 16 篇 + 3 篇散篇）

| 新文章 | 合并来源 | 说明 |
|---|---|---|
| `2026-07-09-code-foundations.md` | know-your-computer / how-network-work / terminal-linux-basics / git-version-control | 4 篇 → 1 篇「从终端到 Git」 |
| `2026-07-09-frontend-toolchain.md` | js-modules-history / npm-and-vite / react-frontend-rules / react-data-driven-ui | 4 篇 → 1 篇「模块化到 React」 |
| `2026-07-21-http-and-api.md` | api-basics / curl-from-zero / api-practice-review | 3 篇 → 1 篇 |
| `2026-07-21-deploy-and-nginx.md` | server-deploy-and-nginx / nginx-from-zero / github-remote-and-mcp | 3 篇 → 1 篇 |
| （并入上面/散篇归档） | computational-thinking-guide / vibe-coding-terminology / ai-agent-12-principles | 术语类 → 见 C |

> ⚠️ 合并篇保留 `zero-to-tech` 标签，但**去掉「这是第 N 篇」的流水账衔接**，
> 改为以「我当时卡在哪」为线索重组。

### C 级 — archived（32 篇）
文件保留、直链可访问，但不出现在列表/首页/标签/sitemap。

**生图系列 9 篇** —— 全系列归档（教材体、无第一人称、同日批量产物）：
aspect-ratio / camera-angle / lens / lighting-variables / material-variables /
mindset / mood-variables / print-color-management / shot-type / style-variables /
visual-variable-formula

**术语/概念类 3 篇**：
computational-thinking-guide（21k 纯说理）/ vibe-coding-terminology（51k 术语表）/
ai-agent-12-principles（32k 原理综述）

**Hermes/飞书重复 5 篇**（保留 streaming-cards 一篇即可）：
hermes-feishu-bot-config / hermes-multi-profile-replication /
hermes-multi-profile-streaming-practice / feishu-image-generation-fixed-workflow /
crm-sales-assistant-feishu

**教程被合并的 13 篇**（见 B 级来源）

**其余 2 篇**：
- 2026-06-08-first-note.mdx —— 已是 archived，720 字节占位
- 2026-05-20-ai-enterprise-efficiency.md —— 「我」1 次，通篇无个人痕迹
- 2026-06-12-color-rendering-ark-seedream.md —— 「我」0，纯技术说明

### D 级 — 需人工确认（1 篇）
- 2026-08-13-ai-era-seo-survival-guide.md —— SEO 主题，与本站自身相关，但「我」仅 6 次

---

## 三、执行顺序

1. **先写 B 级 4 篇合并长文**（新建，不覆盖源文件）
2. **把 C 级 32 篇 status 改为 `archived`**（脚本批量，可回滚）
3. **A 级 15 篇 + B 级 4 篇 = 19 篇，做全文去 AI 味改写**
   - 标题：破掉冒号模具，改成陈述/疑问/具名
   - 开头：第一句必须是具体场景，不能是定义
   - 正文：清理「不是…而是」排比、三段式、破折号堆叠
4. **验证**：`content:audit` + 列表页计数 23 + 构建通过

---

## 四、去 AI 味改写规则（对 19 篇统一执行）

| 症状 | 改法 |
|---|---|
| 「X 不是 A，而是 B」 | 直接说 B，删掉否定半句 |
| 「本质上 / 核心是 / 关键在于」 | 删，直接陈述 |
| 三段式排比「A、B 和 C」 | 拆成三句或删成两句 |
| 破折号 —— 堆叠 | 每段最多 1 个，其余改逗号或句号 |
| 「方法论 / 维度 / 闭环 / 赋能」 | 换成具体动作词 |
| 标题「主：副」冒号式 | 改成陈述句或疑问句 |
| 开头是定义句 | 改成具体场景/时间/问题 |

参考本项目已有的 `docs/agent/content-style-guide.md`（阮一峰中文技术文档规范）。

---

## 五、回滚

全部改动只碰 frontmatter 的 `status` 字段 + 新建 4 个文件，无物理删除。
回滚 = 把 `archived` 改回 `published` + 删 4 个新文件。

已留两份备份：`/tmp/blog-backup-2239xx`（会话起始态）、`/tmp/blog-backup-titles-xxxxxx`（编码修复后、改标题前）。

---

## 六、执行结果（2026-10-06 完成）

改动盘点（与「会话起始态」逐文件 sha256 对账）：**新增 4 篇、物理删除 0、归档 37 篇、原地编辑 21 篇**。

| 指标 | 改前 | 改后 |
|---|---|---|
| 发布文章 | 60 篇 | **25 篇** |
| `zero-to-tech` 教程 | 16 篇散篇 | **4 篇合并长文** |
| 冒号式标题「主：副」 | 52/60 | **0/25** |
| 正文重复 H1 | 22 篇（详情页已渲染 h1，正文那个是重复的） | **0 篇** |
| 破折号 `——`（正文） | 约 230 处 | **4 处** |
| 「不是 A 而是 B」（正文） | 约 100 处 | **2 处** |
| 首日批量灌入 | 08-23 一天 17 篇、07-09 一天 11 篇 | 已按合并/归档消化 |

**验收（均为实测，非自述）**
- `npm run typecheck` 0 错误
- `npm test` 87/87 通过
- `npm run prebuild`（images:check + gallery:check）0 error（2 个 warning 是归档文章里的既有 legacy 资源引用）
- `npx next build --webpack` 构建成功
- 构建产物：**25 个详情页 + 1 个 `/blog/archive` 列表页**，与 published 清单逐项吻合；draft 与 archived 均被正确排除
- **每个页面恰好 1 个 H1**（重复 H1 已清除）
- 全 `content/` 0 处非法 UTF-8、0 处相邻重复行、0 处代码围栏/小节/链接漂移（与备份对账）

**过程中修掉的两个真问题**
1. 两篇合并文（`frontend-toolchain`、`http-and-api`）被写入时末尾多出一段半行残片并丢了首字节，导致文件不是合法 UTF-8 → 已按「在残片前截断」修复，全文复检 0 处非法编码。
2. 详情页 `<h1>{post.title}</h1>` 之外，22 篇正文自己还带一个 `# 标题` → 每页两个 H1。已把正文那个删除。

---

## 七、待决定 / 已知问题

1. **归档文章直链返回 404**（实测），并非「仍可通过直链访问」——`generateStaticParams()` 走 `getBlogPosts()`（仅 published），页面用 `notFound()` 兜底。
   三个选项：(a) 维持现状，旧链接 404；(b) 给旧 slug 增加重定向（指向合并后的新文或 `/blog`），SEO 最平滑；(c) 改路由让 archived slug 可渲染但加 `noindex`，兼顾可达性与不被收录。
2. **归档文件仍参与 `content:audit`**（会扫全部内容，含 archived），低分项里有一部分是已归档文章。
3. **环境问题（与本次改动无关）**：`node_modules/@next/swc-darwin-arm64` 只剩 README + package.json，原生二进制缺失（疑为 2026-10-05 磁盘清理的副作用）→ `npm run build`（Turbopack）会直接报平台不支持，须改用 `npx next build --webpack`，或补装该可选依赖。
4. **本次改动未 commit / 未 push**（提交需显式授权）。
5. 尾部的两篇零碎内容（`2026-04-20-ai-fable-prompt` 仅 935 字、`2026-05-10-agentic-workflow`）保留在 published，可再议是否归档。

---

## 八、第二轮：内容模块三合一为 /notes（2026-10-06 完成）

### 背景
Learning / Book List / Course List 三个模块在**代码层面本来就是同一个东西的三个副本**：
- frontmatter 完全同构（都用 `series` + `seriesOrder` + `chapter`，都按子目录组织集合）
- `lib/content/reader.ts` 有 12 个平行取数函数（179 行）
- 3 个卡片组件（134 行）+ 9 个路由文件（741 行）
- 合计约 450 行重复代码

### 决策
三合一为 `/notes`，用 `kind`（topic/book/course）区分来源；**URL 扁平化**（`/notes/<collection>`，不带 kind）——
前提是 15 个集合 id 全局唯一（已验证）。

### 执行
1. **内容迁移**（225 篇，零丢失）：`content/{learning,book-list,course-list}/` → `content/notes/{topic,book,course}/`
2. **24 篇草稿定档**（用户按档位拍板）：4 篇通用方法论转 published，21 篇转 archived
3. **代码合并**：12 函数 → 5 个泛化函数（`getNoteCollections` / `findNoteCollection` / `getNoteCollectionIndex` / `getNoteCollectionNotes` / `getNoteBySlug`）；9 路由 → 3 新页 + 9 个 308 桩；3 卡片 → 1 个 `entry-card-note.tsx`
4. 同步更新 `site-nav` / 首页 / `sitemap.ts` / 3 个脚本 / `.claude/commands/book-list-from-inbox.md` / `ALMA.md` / `CLAUDE.md`

### 验收（全部实测）
- typecheck 0 错误 ｜ lint 0 新增（8 warning 均为既有 baseline）｜ test 87/87 ｜ prebuild 0 error ｜ 构建退出码 0
- **15/15 集合页**：200 ／ 恰好 1 个 h1 ／ 0 断图
- **9/9 旧 URL 全部 308**，Location 指向正确新地址
- sitemap 205 条 notes URL，旧三路径 0 条
- 旧函数名／旧组件名／旧内容路径全库 grep **零命中**

### 过程中修掉的三个真问题（合并前不可见）
1. **MDX 编译崩溃**：`understanding-ai-agent-design/_index.md` 有 4 个 `<!-- TODO -->`。旧 book/learning 集合页**不编译**索引正文（MdxContent 出现 0 次），新页面统一编译才踩到 → 改为 MDX 合法的 `{/* TODO */}`。
2. **5 个 topic 索引有重复 H1**：正文 `# 标题` 与 frontmatter title 逐字相同，页面已渲染 `<h1>{title}</h1>` → 每页 2 个 h1。同样因旧页不渲染索引正文而一直隐藏。已删除。
3. **一个我自己差点写成的 bug**：批量改 status 时把 frontmatter 子串的偏移量用在整文上，会写到错误位置 —— 被写入前断言拦住，零文件受损。

### 遗留
- Hermes 去重（learning 29 篇 ↔ 课程 52 篇）**尚未做**，用户选择「先合并，去重下一步」
- 4 篇转 published 的 Hermes 笔记中，有部分提及公司实体词（蓝辉/有膜有漾），公开前是否保留待定
- 本次改动**未 commit**

### 回滚
`~/.config/alma/backups/pw-notes-merge-20261006-234015/content-three-modules.tar.gz`（244 条目）

---

## 九、第三轮：下架 Diary 与 Weekly 模块（2026-10-07 完成）

用户指令：「现在不需要 Daily 和 weekly 中内容」（Daily = Diary 模块）。

### 决策（用户授权「按你建议的模式执行」）
沿用 blog 归档与 notes 三合一已验证的模式：
1. **4 个路由 → `permanentRedirect`（308）**，`/diary` `/diary/[slug]` `/weekly` `/weekly/[slug]` 全部 → `/blog`
2. **内容 `status` 改 `archived`**，不物理删除 → diary 68 篇 + weekly 23 篇 = **91 篇**，可逆
3. **RSS 只留 blog**（原为 blog + weekly）
4. 清理全部下游：导航 / 首页门户 / 首页 hero 面板 / **页脚** / sitemap / 搜索 API / **tags 聚合** / 文档

### 实测结果

| 项 | 结果 |
|---|---|
| 旧 URL（含详情、含不存在的 slug） | **6/6 → 308 → /blog** |
| 存留路由 | **12/12 → 200** |
| 全站路由冒烟（含 15 个 notes 集合） | **34/34 → 200** |
| 页脚 Sections 列 | Blog ｜ Notes ｜ Projects ｜ Tools ｜ About（**无 Diary/Weekly**） |
| 页脚 Recent 列 | Blog ｜ Book ｜ Course |
| 导航项 | Blog ｜ Notes ｜ Work ｜ Gallery ｜ Tools ｜ About（**6 项**） |
| 首页门户 | blog / notes / projects / gallery / about / tools（**6 项**） |
| sitemap | 248 URL ｜ **/diary 0 ｜ /weekly 0** |
| RSS | 25 item ｜ **/weekly/ 0 ｜ /diary/ 0 ｜ [Weekly] 0** |
| 搜索 API | 命中 0 条指向旧路由 |
| tags | **100 → 99 个**（「工作日记」消失）；`/tags/工作日记` → 404（正确，已无内容携带该标签） |
| tags 详情页 | 只渲染 Blog / Notes 段，**无 Diary/Weekly 段**、零旧路由链接 |
| 内容引用 `/tags/*` 的死链 | **0 处**（内容里根本没有 tags 链接） |
| 归档状态 | diary 68/68 archived ｜ weekly 23/23 archived |

**门禁**：`tsc` 0 错误 ｜ `eslint` **7 warning（baseline 8 → 零新增）** ｜ `npm test` 87/87 ｜ `prebuild` 0 error ｜ `next build --webpack` 退出码 0 ｜ `content:audit` 0 ｜ `knowledge:doctor` 全 OK

### ⚠️ 过程中我自己造成并修复的事故（重要教训）
**我对同一个文件并发发了多个 `Edit`，触发写入竞态，把 3 个文件写坏**：
- `app/sitemap.ts` —— 尾部出现重复残片（第 91-118 行是垃圾），花括号失衡 `28/33`
- `lib/content/reader.ts` —— 915 行起语法崩坏，`tsc` 报 7 个错误
- `app/api/search/route.ts` + `app/feed.xml/route.ts` —— **导入改了、函数体没改**（一处 Edit 覆盖了另一处）

**根因**：我在给 subagent 的指令里明确写了「不要对同一个文件并发发多个 Edit（曾发生并行写竞态，互相覆盖）」—— **然后我自己违反了这条**。

**修复方式**：从备份恢复 → 用**单次原子写入**（一个 Python 脚本内做完全部替换 + 写入前断言 + 写入后回读校验）重做全部改动。
**关键**：**`tsc` 是这类损坏唯一可靠的判定手段** —— 我写的括号配平检查有假阳性（字符串/正则里的括号会干扰），而 `tsc` 直接报出 915 行语法错误。

**沉淀纪律**：改同一文件的多处内容 → **必须一个脚本一次写入**（替换前 `assert t.count(old)==1`，写入前断言结构，写入后回读 `assert open(p).read()==t`）。

### 📌 遗留（惰性，未删，属用户文件）
下架后这些成为孤儿，但**都不影响构建与运行时**：
- `scripts/diary-from-weekly.mjs`、`scripts/diary-sanitize.mjs` —— 处理已退休模块的脚本
- `.claude/commands/weekly-from-inbox.md` —— ⚠️ **不能删**：`knowledge:doctor` 的命令清单里点名检查它，删了 doctor 会失败
- `docs/agent/diary-pipeline-plan.md` —— 历史过程文档
- `lib/content/reader.ts` 里的 `getDiaryPosts` / `getDiaryPostsPaginated` / `getDiaryArchive` / `getWeeklyPosts` —— **保留是有意的**：与「内容归档而非物理删除」保持同一套可逆性，删了会破坏对称（要复活时函数已不在）
- `lib/content/schemas.ts` 的 diary/weekly schema —— 同上，保留

### 🔍 下游自动化核查（主动查了，结论：无影响）
- Alma cron 只有 1 个任务 `daily-work-journal`（每日 22:00），写的是 `content/inbox/logs/`，**不碰 weekly/diary** ✅
- `~/.config/alma/skills/work-log-to-weekly-report/`（会写 `content/weekly/`）**当前没有挂 cron**，处于休眠状态 → 若将来启用，产出会落进已退休目录
- `runs.json`（运行史）里残留 3 条 weekly 相关记录，那只是历史，不是活跃任务

### 回滚
`~/.config/alma/backups/pw-diary-weekly-removal-20261007-090138/`（4 个路由 + 6 个被改文件）
内容回滚 = 把 `archived` 改回 `published` + 恢复路由（备份里有原文件）

---

## 十、第四轮：inbox 移出版本控制 + career 保持原样（2026-10-07 完成）

### 性质判定：两个模块完全相反，不能同一套处理

| | inbox | career |
|---|---|---|
| 性质 | **活的素材工作区**（内容管线输入侧） | **已发布的简历材料** |
| frontmatter | **24 个文件全无** | 有（schema 内） |
| 路由 | **无 /inbox 路由** | 无独立路由（已合并到 /about，307） |
| 渲染 | `reader.ts` **不扫它** | 2 篇 published，**真的渲染在 /about** |
| 下游 | `knowledge-field.config.json` 的 **5 条 routes 全指向它**；Alma cron `daily-work-journal`（每日 22:00）往 `logs/` 写 | `/about` 的折叠求职区 |

### 决策（用户拍板）
- **inbox → 只移出 git**（保留目录与内容，不影响 Hermes/cron 继续读写）
- **career → 保持 draft 不动**（代码注释已明确「草稿不渲染是有意设计」；英文简历子弹公开价值低）

### inbox 执行
1. `.gitignore` 追加 `content/inbox/`（带 4 行说明：它是输入侧、含公司实体名与内部决策、不进公共仓库）
2. `git rm -r --cached content/inbox` —— **只移索引，不动磁盘**

**校验（关键，防止误删）**：
- git 跟踪 **24 → 0** ✅
- 磁盘文件 **29 → 29 一个不少** ✅
- `git check-ignore` 对新旧文件均生效（`.gitignore:38`）

### ⚠️ 遇到的坑：`.git/index.lock` 死锁（第二次）
- 0 字节、创建于 **9-27**、无进程持有 → 挡住所有 git 写操作（`git rm --cached` 直接 fatal）
- 确认是死锁后清除，写操作恢复
- 📌 与第三轮记的是**同一个残留**（不是本轮引入）。**这会挡住 commit** —— 提交前若报 lock 错误，就是它

### 验收（全实测）
- `knowledge:doctor` → 5 条 inbox routes **全 OK**（管线没断）
- `content:audit` → 仍可跑（它扫 inbox，退出码 0）
- `tsc` 0 错误 ｜ `eslint` **7 warning（零新增）** ｜ `npm test` **87/87** ｜ `next build --webpack` 退出码 0
- 线上冒烟 **12/12 → 200**
- `/about`：STAR 故事渲染 ✅ ｜ **draft 的 bullets 未渲染** ✅（符合设计）｜ 单 h1

### career 结论：无需精简
3 篇内容实测**无 TODO/占位**（仅 `profile.md` 有 1 处「待补」字样，属文案性质），2 篇在岗、1 篇有意 draft。
**它已经是干净状态** —— 无独立路由、已合并进 /about、草稿不渲染是有意设计。

### 全站终态（本轮后）

| 模块 | published | archived | draft |
|---|---|---|---|
| blog | 25 | 38 | 1 |
| notes | 190 | 20 | 0 |
| diary | 0 | 68 | 0 |
| weekly | 0 | 23 | 0 |
| projects | 8 | 0 | 0 |
| gallery | 5 | 0 | 0 |
| career | 2 | 0 | 1 |
| **合计** | **230** | **149** | **2** |

`inbox`：29 个文件，**不进 git、不渲染**（活的私人工作区）

### 状态
本轮改动 **未 commit**（项目规则：提交需显式授权）。
⚠️ 提交前注意：inbox 那 24 条 `D` 是**移出索引**，配合 `.gitignore` 才成立 —— **两者必须一起提交**，只提交其一会导致「内容被删」或「忽略规则失效」。
