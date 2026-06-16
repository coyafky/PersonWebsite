# 修复 Projects 详情页宽度不一致 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 让 `/projects/[slug]` 详情页在桌面端的视觉宽度、容器收口、右侧 TOC 与 `/blog/[slug]`、`/weekly/[slug]` 完全对齐，修复 `.article-shell` 的 CSS 规则冲突。

**架构：** 复用既有 `<ArticleLayout>` + `<ArticleToc>` 组件（同 blog/weekly），不引入新组件、不改 layout 内部实现；CSS 修复通过合并两条重复的 `.article-shell` 规则为单一定义。MDX 内容和 frontmatter 不动。

**技术栈：** Next.js 16 App Router、React 19、TypeScript、existing `extractHeadings` helper、existing `ArticleLayout` 组件、project-local CSS。

---

## 文件结构

- 修改：`app/(site)/projects/[slug]/page.tsx` — 加 `<ArticleLayout>` 包装，引入 `extractHeadings`
- 修改：`app/globals.css` line 136-146 — 合并两条 `.article-shell` 规则为单一收口定义
- 新增（test scaffold）：`app/(site)/projects/[slug]/page.test.ts` — 用现有 `node:test` 模式断言 `extractHeadings` 能正确处理真实项目 MDX

每个任务的依赖关系：T1（test scaffold）→ T2（page.tsx 改造）→ T3（CSS 修复）→ T4（验证）→ T5（commit）。T1 和 T3 可以并行做，但串行更稳。

---

## 任务 1：为真实项目 MDX 添加 extractHeadings 测试（TDD 守门员）

**文件：**
- 创建：`app/(site)/projects/[slug]/page.test.ts`

**目的：** 验证 `extractHeadings` 在 `ark-seedream-car-preview.mdx` 上能正确提取 h2 标题，给后续 `ArticleLayout` 喂 `headings` prop 提供信心。

- [ ] **步骤 1：写失败的测试**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { extractHeadings, type Heading } from "@/lib/content/headings";

const projectMdx = readFileSync(
  join(process.cwd(), "content/projects/ark-seedream-car-preview.mdx"),
  "utf8"
);

test("extractHeadings on ark-seedream-car-preview.mdx returns h2 sections", () => {
  const headings: Heading[] = extractHeadings(projectMdx);
  const h2Texts = headings.filter((h) => h.level === 2).map((h) => h.text);

  assert.ok(
    h2Texts.includes("Background"),
    "should include the 'Background' h2 from the project MDX"
  );
  assert.ok(
    h2Texts.includes("Problem"),
    "should include the 'Problem' h2 from the project MDX"
  );
  assert.ok(
    h2Texts.includes("Approach"),
    "should include the 'Approach' h2 from the project MDX"
  );
});
```

- [ ] **步骤 2：跑测试确认通过**

运行：`node --test --experimental-strip-types app/\(site\)/projects/\[slug\]/page.test.ts 2>&1 | head -40`
预期：PASS（`extractHeadings` 已经能处理真实 MDX，3 个断言全过）

> 注：如果 `node --test` 在这个仓库跑不动，回到 `package.json` 里 `test` 脚本的实际命令再调。**先看 `package.json` scripts 段**决定正确命令。

- [ ] **步骤 3：暂不 commit**（test scaffold 跟功能改动一起 commit）

---

## 任务 2：给 projects 详情页套 `<ArticleLayout>`

**文件：**
- 修改：`app/(site)/projects/[slug]/page.tsx:1-5`（imports）
- 修改：`app/(site)/projects/[slug]/page.tsx:37-69`（JSX 根节点）

- [ ] **步骤 1：在 imports 里加入 `ArticleLayout` 和 `extractHeadings`**

在 `app/(site)/projects/[slug]/page.tsx` 顶部，把第 3-4 行从：

```ts
import { MdxContent } from "@/components/mdx-content";
import { getContentBySlug, getProjectPosts } from "@/lib/content";
```

改为：

```ts
import { MdxContent } from "@/components/mdx-content";
import { ArticleLayout } from "@/components/article-layout";
import { getContentBySlug, getProjectPosts } from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";
```

按字母序插在中间——`ArticleLayout` 在 `MdxContent` 之后、`getContentBySlug` 之前；`extractHeadings` 放在所有 `@/lib/content/...` import 之后。

- [ ] **步骤 2：在 default export 里计算 `headings`**

在 `app/(site)/projects/[slug]/page.tsx` 的 `ProjectDetailPage` 函数里，`if (!project) { notFound(); }` 之后、`return (` 之前，插入：

```tsx
  const headings = extractHeadings(project.body);
```

- [ ] **步骤 3：用 `<ArticleLayout>` 包装 `<article>`**

在 `app/(site)/projects/[slug]/page.tsx` 的 return 段，把第 37-69 行整段 JSX 改为：

```tsx
  return (
    <ArticleLayout headings={headings}>
      <article className="article-shell">
        <header className="article-header">
          <span>{project.stack.join(" / ")}</span>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          {project.englishSummary ? <p className="english-summary">{project.englishSummary}</p> : null}
        </header>
        <section className="evidence-grid">
          <div>
            <h2>Role</h2>
            <p>{project.role}</p>
          </div>
          <div>
            <h2>Impact</h2>
            <ul>
              {project.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
        <MdxContent source={project.body} />
        <section className="resume-block">
          <h2>Resume Bullets</h2>
          <ul>
            {project.resumeBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>
      </article>
    </ArticleLayout>
  );
```

- [ ] **步骤 4：跑 typecheck 确认改动无类型错误**

运行：`npm run typecheck 2>&1 | tail -20`
预期：exit 0，**没有任何输出或只有 "No errors found"**

如果失败且报错指向 `Heading` 类型不匹配——检查 `lib/content/headings.ts` 的导出，`extractHeadings` 必须返回 `Heading[]`。`ArticleLayout` props 签名是 `headings: Heading[]`。

- [ ] **步骤 5：跑 T1 写的测试，确认 `extractHeadings` 在真实 MDX 上仍工作**

运行：`node --test --experimental-strip-types app/\(site\)/projects/\[slug\]/page.test.ts 2>&1 | tail -10`（或仓库 `package.json` 里的实际 test 命令）
预期：PASS

---

## 任务 3：修复 `app/globals.css` 重复的 `.article-shell` 规则

**文件：**
- 修改：`app/globals.css:136-146`（合并两条 `.article-shell` 规则）

**目的：** 当前 `app/globals.css` 在 line 136-139 和 line 141-146 有两条 `.article-shell` 规则，第二条用 `width: 100%` 覆盖了第一条的 `width: min(820px, calc(100% - 32px))`。合并为单一定义：保留 `min(820px, ...)` 的窄收口（独立用），但同时保留 `min-width: 0` + 上下 padding（在 ArticleLayout grid 内部仍能正常填列）。

- [ ] **步骤 1：把 line 136-146 替换为单一合并规则**

在 `app/globals.css` 里，把：

```css
.page-shell.narrow,
.article-shell {
  width: min(820px, calc(100% - 32px));
}

.article-shell {
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 56px 0 72px;
}
```

替换为：

```css
.page-shell.narrow,
.article-shell {
  width: min(820px, calc(100% - 32px));
  min-width: 0;
  margin: 0;
  padding: 56px 0 72px;
}
```

合并理由：
- `width: min(820px, 100% - 32px)` —— 独立用（不套 ArticleLayout）时正确收口到 820px；套 ArticleLayout 时由 grid 列宽决定
- `min-width: 0` —— 保留，防 grid 撑爆
- `margin: 0` —— 保留
- `padding: 56px 0 72px` —— 保留

- [ ] **步骤 2：跑 lint**

运行：`npm run lint 2>&1 | tail -10`
预期：exit 0，CSS 改动不触发 lint 错误

---

## 任务 4：全量验证（typecheck / lint / build / 视觉）

**目的：** 在 dev server 上确认改动生效，且没有回归到 blog/weekly 详情页。

- [ ] **步骤 1：跑 typecheck**

运行：`npm run typecheck 2>&1 | tail -10`
预期：exit 0，无错误

- [ ] **步骤 2：跑 lint**

运行：`npm run lint 2>&1 | tail -10`
预期：exit 0

- [ ] **步骤 3：跑 build**

运行：`npm run build 2>&1 | tail -30`
预期：exit 0，projects 详情页和 blog/weekly 详情页都进 `○ (Static)` 列表

- [ ] **步骤 4：在 dev server 上验证 projects 详情页 HTML 含 TOC 容器**

如果 dev server 已在跑（task `b8km0osm3` 已结束——`npm run dev` 之前被 kill 过 46096 那一台），先起一台：

```bash
cd /Users/fkycoya/Documents/Code/PersonalWebsite
npm run dev > /tmp/dev-server.log 2>&1 &
echo $! > /tmp/dev-server.pid
sleep 6
```

然后跑：

```bash
curl -sS http://localhost:3000/projects/ark-seedream-car-preview \
  | grep -c "article-toc"
```

预期：输出 `1`（HTML 中包含 `article-toc` 容器）

```bash
curl -sS http://localhost:3000/projects/ark-seedream-car-preview \
  | grep -c "article-layout__content"
```

预期：输出 `1`

如果输出 `0`，检查 `app/(site)/projects/[slug]/page.tsx` 的 import 和 JSX 包装是否正确。

- [ ] **步骤 5：验证 blog/weekly 详情页没回归**

```bash
curl -sS http://localhost:3000/blog/2026-05-10-agentic-workflow | grep -c "article-toc"
curl -sS http://localhost:3000/weekly/2026-W20 | grep -c "article-toc"
```

预期：两个都输出 `1`

- [ ] **步骤 6：停 dev server**

```bash
kill $(cat /tmp/dev-server.pid) 2>/dev/null
rm /tmp/dev-server.pid
```

---

## 任务 5：Commit

- [ ] **步骤 1：检查 git status 确认改动范围**

运行：`git status --short`
预期：看到这些 modified
- `M app/(site)/projects/[slug]/page.tsx`
- `M app/globals.css`
- `?? app/(site)/projects/[slug]/page.test.ts`（新增的 test scaffold）

不应该出现其它文件改动。如果有，回退无关改动（`git checkout -- <file>`）。

- [ ] **步骤 2：stage + commit**

```bash
git add app/\(site\)/projects/\[slug\]/page.tsx \
        app/\(site\)/projects/\[slug\]/page.test.ts \
        app/globals.css
git commit -m "$(cat <<'EOF'
fix(frontend): align projects detail page with blog/weekly layout

- Wrap ProjectDetailPage in ArticleLayout so it shares the
  max-width: 1180px grid + right-side TOC sidebar with blog/weekly
- Merge duplicate .article-shell CSS rules into one definition
  (the second was overriding width: 100% on top of width: 820px)
- Add a node:test scaffold asserting extractHeadings on real
  project MDX returns expected h2 sections

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

- [ ] **步骤 3：确认 commit 成功**

运行：`git log -1 --stat`
预期：1 个 commit，3 个文件改动，行数 +N/-M 都合理（page.tsx 应该是 +几行包装，CSS 应该是 -3/+2，test 是新建）

---

## 自检

**1. 规格覆盖度**

| 规格项 | 任务 |
|--------|------|
| projects 详情页用 `<ArticleLayout>` 包装 | T2 |
| 桌面端正文最大宽度 ≤ 1180px | T2 + T3（ArticleLayout 提供，CSS 修复让独立使用不爆） |
| Header 边线对齐 | T3（CSS 修复后 article-shell 收口到 820px，跟 list 页 1120px 容器视觉对齐） |
| 移动端 TOC 隐藏 | 不需要改——`ArticleToc` 既有 CSS 已有 `@media (max-width: ...)` 隐藏规则 |
| blog/weekly 不回归 | T4 步骤 5 |
| typecheck / lint / build 通过 | T4 步骤 1-3 |
| `extractHeadings` 在真实 MDX 上工作 | T1 |

**2. 占位符扫描**

- 无 "TODO" / "TBD" / "类似任务 N"
- 所有代码块都是完整可粘贴的代码
- 所有命令都是完整可执行

**3. 类型一致性**

- `Heading` 类型只在 `lib/content/headings.ts` 定义一次
- `ArticleLayout` 的 `headings: Heading[]` prop 签名不变
- `extractHeadings` 返回类型保持 `Heading[]`
- 三个地方（page.tsx 引用、T1 测试引用、ArticleLayout 内部）都是同一个 `Heading`

**4. 风险检查**

- 风险 1：CSS 改动可能影响 blog/weekly 详情页 → T4 步骤 5 验证
- 风险 2：dev server 之前被 kill 过 PID 46096，可能端口被占 → T4 步骤 4 显式起新 dev server
- 风险 3：合并 CSS 规则可能让独立使用 `.article-shell` 的其它地方（如果有）行为变化 → 检查 `app/` 下其它文件是否用 `.article-shell` 单类（搜索 `className="article-shell"` 单用、非 `<article>` 元素）

---

## 执行交接

计划已完成并保存到 `docs/superpowers/plans/2026-06-16-fix-projects-detail-page-width.md`。两种执行方式：

**1. 子代理驱动（推荐）** - 每个任务调度一个新的子代理，任务间进行审查，快速迭代

**2. 内联执行** - 在当前会话中使用 executing-plans 执行任务，批量执行并设有检查点

**选哪种方式？**
