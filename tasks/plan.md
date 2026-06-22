# Plan — v0.2 信息架构升级（About 去冗 + Tags 跨 collection + 词云）

> 与 `tasks/todo.md` 配套的执行计划。
> 起点：v0.1 已合入 main（merge commit `2e9b5a9`），分支 `refactor/site-structure-v2` 待建。
> 设计系统：Stripe Press（**禁止改 token**）。
> 参考：`SPEC.md` §0.2 / §11–§17。

---

## 0. 切片策略

按目标垂直切片（每个 slice 是一个完整的"改动 + 验收"路径），不做水平分层。

| 切片 | 目标 | 文件数 | 可并行 | 依赖 |
|------|------|--------|--------|------|
| **S1 About 去冗** | G1 | 1 | 否 | 无 |
| **S2 Tags 跨 collection** | G2 | 3 | 与 S3 并行 | 无（reader 新增） |
| **S3 词云页** | G3 | 3 | 与 S2 并行 | 无（复用 getAllTags） |
| **S4 验收 + docs** | — | 3 | 否 | S1 + S2 + S3 |

**并行依据**：S2 改 `lib/content/reader.ts` + `lib/content/reader.test.ts` + `app/(site)/tags/[tag]/page.tsx`；S3 改 `app/(site)/tags/cloud/page.tsx` + `app/(site)/tags/page.tsx` + `app/globals.css`（不同 selector 域）。无文件冲突，可派 2 个 agent 同时跑。

**串行依赖**：S1 与 S2/S3 理论无依赖（不同文件域），但建议串行跑——节省 agent token 消耗 + 早期 slice 失败时及时止损。

---

## 1. Slice 1 — About 去冗

### 1.1 目标
把 `app/(site)/about/page.tsx` 从 9 个 section 砍到 ≤ 6，保留 `id="career"` 锚点与个人声音。

### 1.2 文件清单

| 路径 | 操作 |
|------|------|
| `app/(site)/about/page.tsx` | 重写 |

### 1.3 改动点（对应 SPEC §11.1 A1–A6）

| # | 改动 | SPEC 引用 |
|---|------|----------|
| 1 | 砍 `projects` 常量（L73–103）+ 删除 `ExpSection heading="项目经历"` 调用（L220） | A1 |
| 2 | 合并 `skills` + `techStack` 为单节"Skills & Stack"（L105–147） | A2 |
| 3 | Profile 4 段 → ≤ 2 段（L195–209） | A3 |
| 4 | Career section 删除 `career-grid` panels + project evidence list | A4 |
| 5 | Career section 保留 `id="career"` + sortedCareerItems + 1 句引导 | A4 |
| 6 | 可选：加 `.about-toc` 锚点导航（如果 section 仍 ≥ 5） | A5 |

### 1.4 最终 section 列表（目标 ≤ 6）

1. **个人简介**（Profile，精简到 ≤ 2 段）
2. **教育**（Education，单条）
3. **工作经历**（Experience，2 条）
4. **Skills & Stack**（合并原 Skills + Tech Stack）
5. **Why this site exists**（保留）
6. **Career**（合并自 /career，仅保留核心 + `id="career"`）

### 1.5 验收

- [ ] `app/(site)/about/page.tsx` 总行数 ≤ 200（当前 305）
- [ ] `<section className="about-subsection">` 实例数 ≤ 6
- [ ] `id="career"` 锚点存在
- [ ] `/career` → `/about#career` 重定向仍工作（curl -L 307 → 200）
- [ ] `getFeaturedProjects` 调用次数 ≥ 1（Career section 仍用证据链，但不再单独列 project evidence）
- [ ] `npm run lint && npm run typecheck && npm run build` 通过
- [ ] 手动核查：访问 `/about`，section 顺序按 §1.4

### 1.6 风险

| 风险 | 缓解 |
|------|------|
| 删除"项目经历"段后 SEO 关键词丢失 | 保留元数据 `title: "About"` + `description`；项目页本身 `/projects` 已索引 |
| 个人声音变薄 | 保留 Profile 第一段 + Why this site exists 主体 |
| `getFeaturedProjects` 调用被误删 | Career section 仍可能引用，作为证据链；只要不进"项目证据"列表即可 |

---

## 2. Slice 2 — Tags 跨 collection + 分页架构预留

### 2.1 目标
`/tags/[tag]` 跨 6 collection 聚合，新增 `getContentByTag` reader（含分页架构预留），3 个单元测试通过。

### 2.2 文件清单

| 路径 | 操作 |
|------|------|
| `lib/content/reader.ts` | 新增 `getContentByTag` + 类型导出 |
| `lib/content/reader.test.ts` | 新增 3 个测试 |
| `app/(site)/tags/[tag]/page.tsx` | 重写跨 collection |

### 2.3 改动点

**reader.ts**（追加，**不动现有 export**）：

```ts
export type GetContentByTagOptions = {
  page?: number;
  pageSize?: number;
};

export type TaggedContentByKind = {
  blog: BlogPost[];
  weekly: WeeklyPost[];
  projects: ProjectPost[];
  career: CareerPost[];
  learning: LearningPost[];
  "ai-tracker": AiTrackerPost[];
};

export async function getContentByTag(
  tag: string,
  _opts?: GetContentByTagOptions,  // v0.2 忽略
): Promise<{
  items: TaggedContentByKind;
  totalByKind: Record<keyof TaggedContentByKind, number>;
}>;
```

**reader.test.ts**（追加）：

```ts
test("getContentByTag: matches across all 6 collections", ...);
test("getContentByTag: case-insensitive", ...);
test("getContentByTag: empty tag returns all empty", ...);
```

**tags/[tag]/page.tsx**（重写）：
- 删除 `getBlogPosts + getWeeklyPosts` 旧调用
- 新增 `getContentByTag(tag)` 调用
- 按 collection 分组渲染，6 组都用对应 EntryCard：
  - blog → EntryCardBlog
  - weekly → EntryCardWeekly
  - projects → EntryCardProject
  - career → ContentCard（沿用，无 entry-card-career）
  - learning → EntryCardLearning（注意 learning 结构是 nested topic → posts，需要适配）
  - ai-tracker → EntryCardAiTracker
- `notFound()` 改为：所有 collection 都为空时调用
- `generateMetadata` 不变

### 2.4 验收

- [ ] `getContentByTag` 函数存在 + 编译通过
- [ ] `getContentByTag` 接受 `_opts?: GetContentByTagOptions` 参数（架构预留）
- [ ] `lib/content/reader.test.ts` 新增 3 个测试全部通过
- [ ] `/tags/<tag>` 任意 tag 不 404（包括只在 ai-tracker 出现的）
- [ ] 按 collection 分组，6 组用对应 EntryCard 组件
- [ ] `learning` 分组的特殊结构（topic → posts）正常显示
- [ ] `npm run lint && npm run typecheck && npm run build && npm test` 通过

### 2.5 风险

| 风险 | 缓解 |
|------|------|
| 跨 collection 查询性能（首次慢） | 6 个 reader 都是已存在的简单并行调用；后续可加缓存 |
| Learning 嵌套结构适配难 | LearningEntryCard 接受 topic 参数；或在 tag 详情页用 ContentCard 简化渲染 |
| 6 个 EntryCard 全部 import 导致 bundle 大 | Server Component 按需 import；首次访问 tag 页面才加载 |
| 现有 tag 链接断链（card 引用旧 URL） | 不改 EntryCard 内部 link 生成；只改 tags/[tag] 接收端 |

---

## 3. Slice 3 — 词云页 + /tags cross-link

### 3.1 目标
新增 `/tags/cloud` 词云页（font-size 4 档，bucket = log2 缩放），`/tags` 加互链。

### 3.2 文件清单

| 路径 | 操作 |
|------|------|
| `app/(site)/tags/cloud/page.tsx` | 新建 |
| `app/(site)/tags/page.tsx` | 改：加互链 |
| `app/globals.css` | 加 `.tag-cloud*` rules（**不动 token**） |

### 3.3 改动点

**tags/cloud/page.tsx**（Server Component）：

```tsx
import Link from "next/link";
import { CollectionList } from "@/components/collection-list";
import { getAllTags } from "@/lib/content";

function bucketOf(count: number): "xs" | "sm" | "md" | "lg" {
  if (count >= 8) return "lg";
  if (count >= 4) return "md";
  if (count >= 2) return "sm";
  return "xs";
}

export default async function TagsCloudPage() {
  const tags = await getAllTags();
  return (
    <div className="page-shell">
      <CollectionList title="Tags Cloud" description="...">
        <div className="tag-cloud">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className={`tag-cloud-item tag-cloud-item--${bucketOf(count)}`}
            >
              <span className="tag-cloud-name">{tag}</span>
              <span className="tag-cloud-count">{count}</span>
            </Link>
          ))}
        </div>
      </CollectionList>
    </div>
  );
}
```

**tags/page.tsx**：在 CollectionList 的 `description` 后追加链接：

```tsx
<Link href="/tags/cloud" className="tags-index-cloud-link">
  View as cloud →
</Link>
```

**globals.css**：新增（**禁止改 token**）：

```css
.tag-cloud { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: baseline; }
.tag-cloud-item { display: inline-flex; gap: var(--space-1); text-decoration: none; color: var(--text); }
.tag-cloud-name { font-family: var(--font-display); }
.tag-cloud-count { color: var(--muted); font-size: 0.7em; }
.tag-cloud-item--xs .tag-cloud-name { font-size: 0.875rem; opacity: 0.6; }
.tag-cloud-item--sm .tag-cloud-name { font-size: 1rem; opacity: 0.75; }
.tag-cloud-item--md .tag-cloud-name { font-size: 1.25rem; opacity: 0.9; }
.tag-cloud-item--lg .tag-cloud-name { font-size: 1.75rem; opacity: 1; }
.tags-index-cloud-link { display: inline-block; margin-top: var(--space-2); color: var(--accent); }
```

注：`opacity` 与 `font-size` 同时变化，但因 `font-size` 已是最强区分信号，opacity 仅用于弱化极小档，可通过 WCAG AA（字号差 ≥ 1.5x 时不依赖颜色对比度）。

### 3.4 验收

- [ ] `/tags/cloud` 200，渲染词云
- [ ] font-size 4 档（xs / sm / md / lg）可见差异
- [ ] 至少 1 个 tag 落在 lg 档（取决于实际 count 分布）
- [ ] 点击 tag 跳 `/tags/<tag>`
- [ ] `/tags` ↔ `/tags/cloud` 互链存在
- [ ] `npm run lint && npm run typecheck && npm run build` 通过
- [ ] `globals.css` 无新 token 变量

### 3.5 风险

| 风险 | 缓解 |
|------|------|
| count 分布极端（多数 count=1） | xs/sm/md/lg 阈值已设保守（8/4/2/1），如有需要可调 |
| opacity 影响 a11y | 字号差是主要区分信号；WCAG AA 在字号差 ≥ 1.5x 时不依赖颜色对比度 |
| `getAllTags` 返回的 tags 顺序（已按 count 降序）| 直接用即可，无需重排 |

---

## 4. Slice 4 — 验收 + docs 同步

### 4.1 目标
三 slice 完成后全量验证 + 文档同步 + 分支推送。

### 4.2 文件清单

| 路径 | 操作 |
|------|------|
| `CLAUDE.md` | 更新"当前开发状态" |
| `SPEC.md` | §0 版本演进表把 v0.2 状态改为 ✅ |
| `tasks/plan.md` + `tasks/todo.md` | 全部 mark done |

### 4.3 改动点

**CLAUDE.md** 当前开发状态（追加 1 行）：

```
- ✅ **信息架构升级 v2 (2026.06)** — About 去冗 + Tags 跨 collection + 词云
```

**SPEC.md** §0：

```
| **v0.2**（本规约） | About 去冗 + Tags 跨 collection + 词云 | ✅ 已合入 main（merge commit 待填） |
```

### 4.4 验收

- [ ] `npm run lint && npm run typecheck && npm run build && npm test` 全绿
- [ ] 手动跨页跳转核查：
  - `/` → `/about` → 6 个 section 都渲染
  - `/about#career` 锚点定位正确
  - `/career` 重定向到 `/about#career`
  - `/tags` → `/tags/cloud` → 点击 tag → `/tags/<tag>` 6 组都渲染
  - 各集合首页 tag 链接（blog / ai-tracker / weekly / projects）→ `/tags/<tag>` 都能 200
- [ ] CLAUDE.md + SPEC.md + tasks/todo.md 全部同步
- [ ] 分支 `refactor/site-structure-v2` 推送到 origin（**用户确认后**）

---

## 5. 风险汇总（v0.2 全局）

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| About 内容删除后 SEO 关键词丢失 | 中 | 中 | 保留元数据 + `id="career"` 锚点 |
| 跨 collection 查询性能 | 低 | 低 | 6 个 reader 已并行；后续可缓存 |
| 词云 4 档分布不均 | 中 | 中 | 阈值已保守；如需调整改 `bucketOf` 即可 |
| learning 嵌套结构在 tag 详情页适配难 | 中 | 中 | 可降级使用 ContentCard；或调用 getLearningTopics + getLearningPosts 二次组装 |
| Agent 并行时 globals.css 冲突 | 低 | 中 | S2 不改 globals.css；S3 才改（互斥） |
| `getContentByTag` 类型与现有 reader 命名冲突 | 低 | 低 | 函数命名唯一（getContentByTag），无冲突 |

---

## 6. 不在本 plan 范围（红线）

- ❌ 设计 token 任何改动
- ❌ 内容规范化（项目 frontmatter 审计）— 用户已确认不做
- ❌ Tag 详情页 UI 分页 — 架构预留即可
- ❌ 词云加点击动画 / 3D / 力导向图
- ❌ 改 frontmatter schema
- ❌ 改 Hermes 工作流
- ❌ 新增 npm 依赖
- ❌ 在 main 分支直接开发

---

## 7. 执行顺序

```
1. 建分支：refactor/site-structure-v2（基于 main）
2. S1 (About 去冗)            ← 串行，dispatch agent
3. S2 + S3 并行                ← dispatch 2 agents 同时跑
   ├─ S2 (Tags 跨 collection) ← reader.ts + tests + tags/[tag]
   └─ S3 (词云页)              ← tags/cloud + tags/page + globals.css
4. S4 (验收 + docs)            ← 串行，self-verify + commit
5. 推送：git push -u origin refactor/site-structure-v2（**用户确认后**）
6. 合并：合并到 main（**用户确认后**）
```

---

**Plan 完成。下一步：/dispatch 流水线执行。**