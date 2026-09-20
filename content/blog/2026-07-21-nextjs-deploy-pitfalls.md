---
title: "Next.js 个人网站从0到1部署：7个真实踩坑全记录"
date: "2026-07-21"
summary: "用 Next.js 16 App Router + MDX 搭个人网站，从本地能跑到公网能访问，中间踩了 TypeScript 严格模式的 build 报错、中文文件名跨平台编码错乱、MDX 配置遗漏、路由组布局继承、draft/published 内容过滤、以及 Vercel 自动部署的「push即上线」风险。这篇把 7 个坑的完整因果链——从第一个报错到最终修复——全部记录下来，每个坑都附了错误信息、根因和修复方案。"
tags:
  - "zero-to-tech"
  - "Next.js"
status: published
lang: zh
category: "技术/前端部署"
englishSummary: "Deploying a personal site with Next.js 16 App Router + MDX from localhost to production. Seven real pitfalls documented with error messages, root causes, and fixes: TypeScript strict-mode build failures that dev mode hides, CJK filename encoding issues across platforms, MDX pageExtensions configuration, route group layout inheritance, draft/published content filtering, CSS approach decisions, and the risks of Vercel auto-deploy on main push."
---

# Next.js 个人网站从0到1部署：7个真实踩坑全记录

> 这是 **zero-to-tech** 系列的第十三篇。前面讲了 API 的理论和实践，这一篇换个角度——把一个 Next.js 网站从本地 `localhost:3000` 推到公网，中间会经历什么。

这个个人网站的技术栈是 **Next.js 16 App Router + TypeScript strict + MDX + Vercel 部署**。从 2026 年 6 月 8 日第一行代码，到 6 月 20 日第一次 Vercel 部署失败，再到后续多次踩坑修复——每一个坑都留在了 git history 里。

这篇不写原理，写**踩坑**——真实的报错信息、查错过程、根因分析和修复方案。

---

## 一句话总结

> **Next.js 部署到 Vercel 并不难，但 `next dev` 能跑不代表 `next build` 能过**。TypeScript strict 模式在 build 阶段的检查比 dev 更严、中文文件名在不同操作系统间编码不一致、MDX 的 `pageExtensions` 配置很容易漏、路由组的布局继承规则容易忽略。**每个坑的修复成本都在 15 分钟以内——但前提是你知道报错信息在说什么。这篇就是帮你翻译这些报错信息的。**

---

## 一、项目起点：技术选型和最初架构

### 1.1 为什么选这个栈

| 选择 | 原因 |
|------|------|
| **Next.js App Router** | 内容型网站，App Router 的文件系统路由天然匹配 Markdown 目录结构 |
| **TypeScript strict** | 不想部署后才发现类型错误 |
| **MDX（next-mdx-remote）** | 能在 Markdown 里嵌入 React 组件（Callout、Timeline、Mermaid 图表） |
| **Vercel** | Next.js 官方平台，push 即部署，零配置 |
| **全局 CSS（无 Tailwind）** | 个人网站追求设计控制力，不想被 utility class 约束 |

### 1.2 最初的目录结构

```
PersonalWebsite/
├── app/                    # App Router
│   ├── layout.tsx          # 根布局
│   ├── globals.css         # 全局样式
│   └── (site)/             # 主站路由组
│       ├── page.tsx        # 首页
│       └── blog/           # 博客
├── components/             # UI 组件
├── content/                # Markdown 内容
├── lib/                    # 工具库（reader.ts / schemas.ts）
├── next.config.mjs
├── tsconfig.json
└── package.json
```

**这个结构写完后，本地 `next dev` 一切正常，页面都能渲染。以为可以部署了。**

---

## 二、踩坑 1：`next dev` 通过 ≠ `next build` 能过

### 错误现象

```bash
$ npm run build

Failed to compile.

./components/animations.tsx:42:7
Type error: Type 'RefObject<HTMLDivElement>' is not assignable to
  type 'RefObject<HTMLElement> | ((instance: HTMLElement | null) => void)'.
```

### 为什么 dev 不报错

Next.js 的 dev 模式为了启动速度，用的是 **SWC（Speedy Web Compiler）做快速转译，不跑完整的 TypeScript 类型检查**。`next build` 才会跑 `tsc` 的全量类型检查。

**本质原因**：`framer-motion` 的 `motion.div` / `motion.section` / `motion.li` 等组件的 `ref` 类型是一个联合类型——每个变体的 `ref` 类型不同。当一个组件可能返回不同 HTML 标签时，TypeScript strict 模式拒绝接受 `RefObject<HTMLDivElement>` 赋值给联合类型。

### 修复

```tsx
// ❌ 修复前：ref 类型太窄
const Comp = resolveMotionTag(tag)
return <Comp ref={ref} ... />  // ❌ ref 类型对不上

// ✅ 修复后：放宽 ref 类型 + cast
const Comp = resolveMotionTag(tag) as ElementType
// ref 类型: RefObject<HTMLElement | null>
```

**修复成本**：改 3 行代码。**查错成本**：看了 15 分钟类型定义。

### 教训

**`next dev` 是「能跑」，`next build` 才是「能部署」**。每次涉及 `app/` / `components/` / `lib/` 的改动后，push 前必须 `npm run build`。这个教训后来直接固化成了项目规则。

---

## 三、踩坑 2：中文文件名 — 跨平台编码问题

### 错误现象

文件在 macOS 上正常显示，但 `git status` 里显示乱码：

```bash
$ git status
Untracked files:
  "content/blog/2026-06-25-\344\270\272\344\273\200\344\271\210..."
```

同事在 Windows 上 clone 后文件名完全不可读，终端补全也失效。

### 根因

macOS HFS+ 和 Windows NTFS 对 UTF-8 文件名的处理方式不同。macOS 用 NFD（Normalization Form D）编码，Windows/Linux 用 NFC。同一个中文字在两种编码下字节序列不一样，导致：
- `git status` 显示转义后的八进制序列
- 跨平台 checkout 后文件名不匹配
- Shell 的 tab 补全失效

### 修复

```bash
# 把所有中文文件名改成英文 slug
git mv content/blog/2026-06-25-为什么写具体项目前要先写清楚prd和spec.md \
       content/blog/2026-06-25-why-write-prd-spec-before-project.md
```

**规则**：**文件名只用 ASCII 字符**（a-z、0-9、连字符）。中文放在 frontmatter 的 `title` 字段里，不在文件名里。

### 教训

Next.js 的文件系统路由（`[slug]`）会把文件名映射为 URL。如果文件名有中文，URL 里就会出现百分号编码——既不美观，SEO 也吃亏。**在项目一开始就用英文 slug**，省掉后面批量改名的麻烦。

---

## 四、踩坑 3：MDX 配置 — `pageExtensions` 漏了就是 404

### 错误现象

```bash
$ npm run dev
# 访问 /blog/my-post → 404
# 明明 content/blog/my-post.md 存在
```

### 根因

Next.js 默认只把 `.tsx` / `.ts` / `.jsx` / `.js` 文件识别为页面。你加了 `.md` 和 `.mdx` 页面（通过 `@next/mdx` 插件），但忘了告诉 Next.js 这些扩展名也是「合法页面」。

### 修复

```js
// next.config.mjs
const withMDX = createMDX({
  extension: /\.mdx?$/,
})

const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  //                ↑ 必须加上 md 和 mdx
}

export default withMDX(nextConfig)
```

两处配置缺一不可：
- `createMDX({ extension })` — 告诉插件哪些文件要编译为 MDX
- `pageExtensions` — 告诉 Next.js 哪些扩展名要当作页面路由

### 教训

MDX 的配置有两个独立入口。漏了任何一个，表现都是 404——不会报错，只会静默失败。排查时很容易怀疑是文件路径问题，而不是配置遗漏。

---

## 五、踩坑 4：路由组 `(site)` 的布局继承

### 设计意图

想让「网站页面」共享一个布局（导航栏 + 页脚），但不想让 RSS feed、sitemap、OG image 生成页继承这个布局。

### 做法

```bash
app/
├── layout.tsx          # 根布局（所有页面共享 — 仅 HTML/body/字体）
├── (site)/
│   ├── layout.tsx      # 站点布局（导航栏 + main + 页脚）
│   ├── page.tsx        # 首页
│   └── blog/
├── robots.txt/
├── sitemap.xml/
└── rss.xml/
```

路由组 `(site)` 的圆括号让它不参与 URL 路径，但**仍然参与组件树**。`(site)/layout.tsx` 只包裹 `(site)` 内的页面，不影响 `sitemap.xml` 等。

### 坑在哪里

很容易在 `(site)/layout.tsx` 里引入只在站点页面用得到的依赖（比如 `SearchDialog`、`BackToTop`），然后忘了 `sitemap.xml` 等路由不应该加载这些组件。

**解决方案**：根布局保持最小化（只定义 `<html>`、`<body>`、字体加载），业务组件全放在 `(site)/layout.tsx` 里。路由组的边界就是依赖的边界。

### 教训

路由组是「无声的布局隔离」。利用好它可以避免全局加载不必要的组件，但需要刻意维护这个边界——每次在 layout 里加东西，都想一下：「sitemap.xml 需要这个吗？」

---

## 六、踩坑 5：draft vs published — 内容过滤在 reader 层

### 设计意图

我写文章时状态是 `draft`，写完审过之后手动改成 `published`。网站构建时只应该包含 `published` 的内容。

### 第一次实现的做法（有问题）

在页面组件里加判断：

```tsx
// ❌ 每个页面都要判断，容易漏
export default function BlogList() {
  const posts = getAllPosts()
  const published = posts.filter(p => p.status === 'published')
  return ...
}
```

**问题**：每个页面组件都要手动过滤，新增一个栏目（weekly、projects、book-list）就要在对应的页面组件里加同样的逻辑。迟早会漏掉一个。

### 正确做法

在 reader 层统一过滤：

```ts
// lib/content/reader.ts
export function getBlogPosts(): ContentItem[] {
  const posts = readAllFromDir("content/blog")
  return posts
    .filter(p => p.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date))
}
```

页面组件只调 `getBlogPosts()`，不关心过滤逻辑。**过滤规则是数据层的职责，不是 UI 层的职责**。

### 教训

「哪些内容应该出现在生产环境」是一个**数据层决策**，不应该散布在各个 UI 组件里。reader 层统一过滤 = 一处改，全局生效 = 不会因为新增页面而漏掉过滤。

---

## 七、踩坑 6：CSS 方案 — 为什么没选 Tailwind

### 需要回答的问题

每次给别人看这个项目，都会被问：「为什么不用 Tailwind？」

### 真实原因

| 维度 | Tailwind | 全局 CSS + 语义 className |
|------|----------|--------------------------|
| **设计自由度** | 受限于 utility class 的组合 | 完全控制 |
| **Markdown 内容样式** | 需要 `@apply` 或 `prose` 插件 | 直接写 `.content h2` 等选择器 |
| **MDX 组件** | className 长串 | 语义化，可读 |
| **个人维护** | utility class 记忆负担 | 自己定的命名，一看就懂 |

对于团队协作的项目，Tailwind 的约束是优势（防止每个人写自己的 CSS）。对于一个人的个人网站，**全局 CSS 的灵活性和直白性更合适**。

### 具体做法

```css
/* globals.css */
:root {
  --bg: #faf9f6;
  --text: #2d2a26;
  --accent: #c77d4b;
  --radius: 12px;
}

.article-shell {
  max-width: 720px;
  margin: 0 auto;
}

.article-shell h2 {
  font-size: 1.5rem;
  margin-top: 2.5rem;
}
```

CSS 自定义属性做 token，语义 className 做布局和排版，全局文件管理。**简单直接，没有构建工具层面的一行额外配置。**

### 教训

技术选型没有标准答案。Tailwind 适合团队项目（约束 = 安全），全局 CSS 适合个人项目（灵活 = 高效）。**先问「我的使用场景是什么」，再选方案，而不是跟着潮流走。**

---

## 八、踩坑 7：Vercel 部署 — push 即上线的利与弊

### 部署流程

```bash
# 1. 本地验证
npm run build    # 确保能过
npm test         # 30 个测试全绿

# 2. 提交并推送
git add <files>
git commit -m "feat: ..."
git push origin main

# 3. Vercel 自动触发 — 什么都不用做
# → clone repo
# → npm install
# → npm run build
# → 部署到 <project>.vercel.app
```

### 利

- **零配置**：连接 GitHub 仓库后自动部署
- **预览部署**：每个 PR 自动生成一个预览 URL
- **回滚**：Vercel 保留每个部署版本，一键回滚到任意历史版本
- **HTTPS 自动**：不用自己配证书

### 弊（踩过的坑）

**最大的风险：一次失败的 push 直接让线上挂掉**。

这就是为什么「踩坑1」里那个 TypeScript 报错如此严重——它不是在本地报的，是在 Vercel build 阶段报的。`main` 分支 `git push` 后，旧的线上版本被新的失败构建替代，**站点直接不可访问**。

### 应对策略

1. **本地 `npm run build` 是最后一道防线**——push 前必须跑
2. **大改动走分支 + PR**——用 Vercel 的 preview deployment 在合并前验证
3. **熟悉 Vercel 的回滚操作**——出问题了能在 30 秒内恢复

### 教训

自动化部署是双刃剑。方便是真方便，但「push = deploy」意味着每一次 push 都是在做生产发布。**把「push 前 build」刻进肌肉记忆。**

---

## 九、部署检查清单

每次 push 前过一遍，30 秒省 30 分钟：

```
□ npm run build      → 通过（无 TS 报错）
□ npm test           → 全部通过
□ 文件名不含中文      → git status 无乱码
□ pageExtensions     → 包含 md / mdx
□ 新增内容 status    → 应是 draft（除非要发布）
□ reader 层过滤      → 只返回 status: published
□ 路由组边界         → 新增组件放对 layout
```

---

## 十、一句话总结

> **Next.js 部署到 Vercel 的门槛很低——连接 GitHub 仓库就完了。但「能部署」和「部署不出事」之间隔了 7 个坑**：`next dev` 不跑完整类型检查、中文文件名跨平台编码不一致、MDX 需要两处配置、路由组布局继承需要刻意维护边界、draft/published 过滤应该在数据层不在 UI 层、CSS 方案没有银弹、以及 `push = deploy` 意味着每次推送都是在做生产发布。**每个坑都不大，但每个都能让站点挂掉。push 前 `npm run build` + 过一遍检查清单，是最便宜的保险。**

---

## 这个系列下一篇会写什么

- **zero-to-tech / TypeScript 是什么：为什么新项目应该用 TypeScript**
- **zero-to-tech / Docker 是什么：为什么「在我电脑上能跑」还不够**
- **zero-to-tech / Git 进阶：rebase / stash / cherry-pick 什么时候用**

上一篇：[从手搓API到调用API：一次完整的实践复盘](/blog/api-practice-review)
第一篇：[网络是怎么工作的](/blog/how-network-work)
