---
name: md-to-mdx
description: 把 content/ 下合适的 .md 文章按特征定制自给自足组件并转为 .mdx
argument-hint: "[可选：指定文章路径或目录；不指定则扫描 content/{blog,weekly,projects,career}/*.md]"
user-invocable: true
---

# MD → MDX — 按文章特征定制组件并升级格式

你是内容协作助手。扫描 `content/` 下的 `.md` 文章，对命中「时间线 / 对比 / 关键指标 / 决策流」四种特征的文章，**为每篇文章定制一个自给自足的小组件**（无 prop），然后把 `.md` 转成 `.mdx` 复用这些组件。

> 特征识别规则详见同目录的 [`_md-to-mdx/feature-rules.md`](./_md-to-mdx/feature-rules.md)；四个组件模板在 [`_md-to-mdx/templates/`](./_md-to-mdx/templates/) 下。

## 为什么走"按文章定制组件"

- **绕开 RSC 序列化坑**：`next-mdx-remote/rsc` 会把 MDX 里 `<Timeline items={[...]} />` 这种**数组字面量 prop** 直接丢弃，连带把 `<Mermaid chart={\`...\`} />` 这种**模板字面量 prop** 也丢弃。让组件自给自足（数据放在模块级常量，MDX 里只 import + 无 prop 调用），是最稳的解。
- **贴合每篇文章的视觉表达**：通用组件适用于"够用就好"，但周记 / 长博客的结构差异很大，定制组件让重点信息直接拿到视觉密度。
- **改动最小**：只动 `content/`，不动 `components/`、`app/`、`lib/`、`globals.css`。

---

## 步骤

### 1. 扫描候选

```bash
Glob: content/{blog,weekly,projects,career}/**/*.md
```

对每个 `.md`：

- 用 Read 工具看 frontmatter（YAML 头）
- 同 slug 已存在 `.mdx` → 跳过
- `status === 'published'` → 默认跳过（除非用户明确授权）
- `status === 'draft'` 或 `status === 'archived'` → 进入候选

输出候选清单（路径 + 当前 status + 摘要 + 标题）。

### 2. 特征识别

按 [`feature-rules.md`](./_md-to-mdx/feature-rules.md) 检测四种特征：

| 特征 | 命中动作 |
|------|----------|
| 时间线 | 抽数据 → 拷贝 `timeline.template.tsx` → 改名 `[slug]-timeline.tsx` |
| 对比 | 抽数据 → 拷贝 `comparison.template.tsx` → 改名 `[slug]-comparison.tsx` |
| 指标 | 抽数据 → 拷贝 `stats.template.tsx` → 改名 `[slug]-stats.tsx` |
| 决策流 | 抽图表 → 拷贝 `flow.template.tsx` → 改名 `[slug]-flow.tsx` |

每个候选文件可同时命中多个特征（一个文件生成多个组件）。

输出「候选 + 命中特征 + 推荐模板」表格。

### 3. 草拟定制组件

对每个命中的特征：

1. 从 `_md-to-mdx/templates/<feature>.template.tsx` 读取模板
2. 把 `// TODO: REPLACE` 占位数据替换成从原文抽出的真实内容
3. 把函数名 `<XxxFeature>` 改为 `<SlugFeature>`（如 `W15Timeline`）
4. **保留**模板自带的文件头注释，方便日后识别"这是模板实例"
5. **不写文件**——把拟好的代码用 ```tsx 代码块展示给用户

### 4. 草拟 MDX 改造

对每个候选文件：

1. 文件名：`xxx.md` → `xxx.mdx`（slug 不变）
2. 在 frontmatter 之后、`# <标题>` 之前插入 import 语句：
   ```mdx
   import W15Timeline from "./w15-timeline"
   ```
3. 把原文中的对应段落替换为：
   ```mdx
   <W15Timeline />
   ```
4. **不动**：frontmatter（特别是 `status`）、slug、其他正文段落、英文摘要

输出 diff 预览（before/after 各一段），让用户审阅替换是否合理。

### 5. 等待用户确认

> ⚠️ **绝不**自动执行写操作。

请用户逐个勾选：

- [ ] 同意（执行转换）
- [ ] 跳过
- [ ] 改命名（指定新的 slug / 函数名）
- [ ] 调整数据（指定要改的字段）

### 6. 执行（用户确认后）

按用户确认顺序：

1. 创建组件 `.tsx` 文件（与 MDX 同目录）
2. `git mv` 或 Read + Write 把 `.md` 改为 `.mdx`
3. 在 MDX 顶部插入 import 语句
4. 替换对应段落为组件 JSX

### 7. 验证

```bash
npm run lint
npm run typecheck
npm run build
```

转换报告里点出：

- 创建了哪些组件文件
- 哪些 MDX 文件被重命名 + 加了哪些 import
- 任何残留的 RSC 序列化风险（出现 `<Xxx items={[...]} />` 或 `<Xxx chart={\`...\`} />`）
- 任何验证失败的环节

---

## 组件模板速查

| 特征 | 模板路径 | 复用的通用组件 / CSS 类 | 默认命名 |
|------|----------|------------------------|----------|
| 时间线 | `_md-to-mdx/templates/timeline.template.tsx` | `@/components/timeline`（`<Timeline>`） | `<Slug>Timeline` |
| 对比 | `_md-to-mdx/templates/comparison.template.tsx` | `.card-grid` + `.content-card` | `<Slug>Compare` |
| 指标 | `_md-to-mdx/templates/stats.template.tsx` | `.career-grid` + `.career-panel` | `<Slug>Stats` |
| 决策流 | `_md-to-mdx/templates/flow.template.tsx` | `@/components/mermaid`（`<Mermaid>`，`"use client"`） | `<Slug>Flow` |

模板实例化位置：与目标 MDX 同目录，命名为 `[slug]-[feature].tsx`。

---

## 约束

- ❌ 不创建新通用组件（只定制文章级组件）
- ❌ 定制组件**禁止接受 prop**（自给自足，数据放在模块级常量）
- ❌ 不修改 `status`、slug、其他 frontmatter 字段
- ❌ 不引入新依赖
- ❌ 不动 `components/`、`app/`、`lib/`、`app/globals.css`
- ❌ 用户确认前**绝不**写文件
- ❌ 不修改任何 `status: published` 的 `.md`（除非用户明确授权）
- ❌ Mermaid 的 `chart` prop 禁止用模板字面量（必须是双引号字符串或模块级常量）
- ✅ 复用现有全局 CSS 类：`.callout` / `.timeline` / `.tabs` / `.mermaid` / `.card-grid` / `.content-card` / `.career-grid` / `.career-panel`
- ✅ TypeScript strict、无 `any`
- ✅ 保留模板头注释，便于后续维护

---

## 验收清单

- [ ] `_md-to-mdx/feature-rules.md` 存在并被引用
- [ ] `_md-to-mdx/templates/` 下有 4 个模板文件
- [ ] 候选清单包含路径 / status / 命中特征 / 推荐模板
- [ ] 草拟的组件代码展示给用户审阅（**未写盘**）
- [ ] MDX 改造的 diff 预览展示给用户审阅（**未写盘**）
- [ ] 用户逐个确认后才执行写操作
- [ ] 转换后 `npm run lint` / `typecheck` / `build` 全部通过
- [ ] 转换报告点出所有残留的 RSC 序列化风险
- [ ] 不修改任何 `status: published` 的 `.md`（除非用户明确授权）