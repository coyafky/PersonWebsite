# Todo — v0.2 信息架构升级

> 与 `plan.md` 配套的逐项任务清单。
> 每个任务对应 plan.md 中的某个 slice 子步骤。
> 状态: pending → in_progress → done

---

## Slice 1 — About 去冗

- [ ] **S1.1** 砍 `app/(site)/about/page.tsx` 中 `projects` 常量（L73–103）+ 删除 `ExpSection heading="项目经历"` 调用（L220），改为 1 句引导 + `/projects` 链接
- [ ] **S1.2** 合并 `skills` + `techStack` 为单节"Skills & Stack"（L105–147），保留所有条目不丢事实
- [ ] **S1.3** Profile 4 段 → ≤ 2 段（保第一段 + 联系邮箱，砍 2 个 muted-block）
- [ ] **S1.4** Career section 删除 `career-grid` panels + project evidence list，保留 `id="career"` + sortedCareerItems + 1 句引导
- [ ] **S1.5** 运行 `npm run lint && npm run typecheck && npm run build`
- [ ] **S1.6** 手动核查：访问 `/about` + `/career` 重定向 + `/about#career` 锚点

## Slice 2 — Tags 跨 collection + 分页架构预留

- [ ] **S2.1** 在 `lib/content/reader.ts` 新增 `GetContentByTagOptions` + `TaggedContentByKind` 类型 + `getContentByTag(tag, opts?)` 函数（opts 接受但忽略）
- [ ] **S2.2** 在 `lib/content/reader.test.ts` 新增 3 个测试：跨 collection / 大小写不敏感 / 空 tag 返回空
- [ ] **S2.3** 重写 `app/(site)/tags/[tag]/page.tsx`：用 `getContentByTag` 跨 6 collection 聚合，按 collection 分组渲染（6 组用对应 EntryCard 或 ContentCard）
- [ ] **S2.4** learning 分组的特殊结构适配（topic → posts），如果难处理可降级 ContentCard
- [ ] **S2.5** `notFound()` 改为：所有 collection 都为空时调用
- [ ] **S2.6** 运行 `npm run lint && npm run typecheck && npm run build && npm test`
- [ ] **S2.7** 手动核查：访问 `/tags/AI`（跨 collection）+ `/tags/only-in-ai-tracker`（单 collection）+ `/tags/__nonexistent__`（应 404）

## Slice 3 — 词云页 + /tags cross-link

- [ ] **S3.1** 新建 `app/(site)/tags/cloud/page.tsx`：Server Component，调用 `getAllTags()`，按 count 映射 4 档 bucket（lg ≥ 8 / md ≥ 4 / sm ≥ 2 / xs = 1）
- [ ] **S3.2** 修改 `app/(site)/tags/page.tsx`：加"View as cloud →"链接到 `/tags/cloud`
- [ ] **S3.3** 在 `app/globals.css` 新增 `.tag-cloud*` + `.tags-index-cloud-link` rules（**禁止改 token**）
- [ ] **S3.4** 运行 `npm run lint && npm run typecheck && npm run build`
- [ ] **S3.5** 手动核查：访问 `/tags/cloud` + 4 档字号可见 + 点击 tag 跳 `/tags/<tag>` + `/tags` 互链

## Slice 4 — 验收 + docs 同步

- [ ] **S4.1** 修改 `CLAUDE.md`「当前开发状态」：追加"信息架构升级 v2"
- [ ] **S4.2** 修改 `SPEC.md` §0 版本演进表：把 v0.2 状态改为 ✅，填 merge commit
- [ ] **S4.3** 全量 `npm run lint && npm run typecheck && npm run build && npm test`
- [ ] **S4.4** 手动跨页跳转核查：`/` → `/about` → 6 个 section 都渲染 / `/about#career` 锚点定位 / `/career` 重定向 / `/tags` ↔ `/tags/cloud` / 各集合首页 tag 链接
- [ ] **S4.5** 对照 SPEC §17 验收标准：3 组逐项打勾（About 去冗 / Tags 跨 collection / 词云页 / 工程 / 设计未破坏）
- [ ] **S4.6** 推送分支 `refactor/site-structure-v2` 到 origin（**用户确认后**）
- [ ] **S4.7** 合并到 main（**用户确认后**）

---

## 进度概览

| Slice | 标题 | 任务数 | 状态 |
|-------|------|-------|------|
| 1 | About 去冗 | 6 | pending |
| 2 | Tags 跨 collection + 分页预留 | 7 | pending |
| 3 | 词云页 + /tags cross-link | 5 | pending |
| 4 | 验收 + docs 同步 | 7 | pending |

总计：25 个子任务。

---

## 执行提示

- 每个 Slice 完成后立即更新本文件状态（`pending` → `done`）
- Slice 2 + Slice 3 可并行（互相不依赖、文件域不重叠）
- Slice 2 不改 `globals.css`；Slice 3 才改（互斥防冲突）
- 任何 slice 失败 = 立即修，不累积到下一 slice
- 每个 slice 完成后用独立 commit（便于 revert）