---
title: "4.5 看懂Next.js"
date: "2026-09-20"
summary: >-
  看懂一个 Next.js 项目的结构与运行方式。
status: published
tags:
  - "Next.js"
  - "前端"
lang: zh
chapter: "4.5"
series: "zero-to-fullstack"
seriesOrder: 17
---

## 课时概要

纯 React 上线后暴露三个问题（直接访问子路径 404、首屏白屏慢、SEO 差），病根都是「页面是浏览器临时算出来的」。Next.js 是 React 之上的生产级框架：用「文件夹=路由」接管路由，把每一页预渲染成真实 HTML 文件，三病同治。认识服务端/客户端组件（`"use client"` 开关）。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】4.5-看懂Next.js](https://www.bilibili.com/video/BV1NxK962E2t/) ｜ 时长 35:03 ｜ 模块 4 · 现代前端

**讲义**：[模块 4.5：Next.js——React 之上的生产级框架（李勃老师.com）](https://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-4-5/)

**配套 demo**：

```bash
git clone https://github.com/joylibo/zero-to-tech-demos.git
cd zero-to-tech-demos/zero-to-tech-4-5
npm install && npm run dev   # 默认端口从 5173 变成 3000
```

## 本节要点

- 纯 React（Vite 打包）发给浏览器的是**空壳 index.html + 一个大 JS**，页面是浏览器跑完 JS 现画的——这引出三个问题：**直接访问 `/text-lab` 报 404、首屏白屏、SEO 抓不到内容**，同一病根。
- **Next.js = React 之上的生产级框架**：React 管组件，Next 在上面加一层管「上线必须的事」——路由 + 把页面预渲染成真实 HTML。
- **文件夹 = 路由**：`app/page.jsx` → `/`，`app/text-lab/page.jsx` → `/text-lab`；加页面只要新建文件夹，不用注册、不用配置（约定优于配置）。
- **`"use client"` 是个开关**：不写=服务端组件，build 时画成 HTML 就完，快、利于 SEO；写上=客户端组件，除了 HTML 再多送一份 JS 让它在浏览器里活过来。客户端组件**也会预渲染**，只是额外能交互。
- `npm run build` 后 `.next/server/app/` 下真有 `index.html`、`text-lab.html` 两个文件——404 的病根除了。
- 以后从 0 起新项目用 `npm create next-app@latest`；它会问要不要 **Tailwind CSS**（认得即可，写前端建议用）。

## 笔记正文（讲义整理）

### 纯 React 上线的三个尴尬

F12 看 Network：浏览器先下载几乎空的 `index.html`，再下大 JS，**JS 跑完页面才画出来**。于是：

1. 地址栏直接敲 `/text-lab` → **404**（服务器上根本没这个文件，它是浏览器临时画的）；
2. 网速慢时访客先看一片**白屏**；
3. 搜索引擎爬虫很多不跑 JS，拿到的是空壳 → **SEO 差**。

病根一句话：**页面不是真实文件，是浏览器临时算的**。

### Next.js 怎么治

从根上治：提前把每一页画好、存成真实 HTML 放服务器——`/text-lab` 真有文件、访客一来就拿到成品、爬虫直接读到内容。Next 把这事连同路由一起标准化了：

| 层 | 谁来管 | 你能感觉到的 |
| --- | --- | --- |
| 工程化（依赖/构建） | Vite / Next 内置 | `npm install` / `npm run build` |
| UI 组件 | React | `<Nav />`、`state` |
| 路由、SEO、首屏 | **Next.js** | 文件夹=页面、`<Link>`、部署不 404 |

### 文件夹 = 路由

4.4 手搓的 `useRoute.js` 和 `App.jsx` 整块消失，换成 `app/` 目录：

```
app/
  layout.jsx          # 全站外壳
  page.jsx            # → / 这一页
  text-lab/
    page.jsx          # → /text-lab 这一页
```

想加 `/blog`？新建 `app/blog/page.jsx` 就行。`<Link href="...">` 接管全站跳转。

### `"use client"` 开关

- 纯展示组件（HomeView/TextLabView/PageHeading、app 里的 page）**不写**——默认服务端组件，build 时画成 HTML，快且 SEO 友好。
- 要交互/动画的组件（Nav、InputCard、ResultCard、AnimatedCardGrid）顶上写 `"use client"`——客户端组件，除了 HTML 再多送一份 JS 让它活。

> 点破误会：客户端组件**也会预渲染成 HTML**，只是额外多一份 JS。这行字不是「不预渲染」，是「**还要**在浏览器里再跑一遍」。

### build 后真有两个 HTML

```
.next/server/app/
  index.html      ← 真实存在
  text-lab.html   ← 真实存在
```

404 的病根除了。但注意：Next 的产物不像 `dist/` 那样能直接丢给 Nginx，怎么部署是下一节（4.6）的事。

![纯 React 三问题 → Next.js 预渲染一招解决](/diagrams/nextjs-prerender.png)

## 和 GFG / 课程笔记的连接

| 这节概念 | 已学过的对应 |
| --- | --- |
| 文件夹 = 路由 | **你这个个人站本身就是**：`content/course-list/.../4-5-*.md` 对应 URL——约定优于配置，一模一样 |
| 404 / 白屏 / SEO | 3.5 部署时刚踩过 404 权限坑；这次是「子路径真有文件」的问题 |
| 服务端组件 vs 客户端组件 | 模块 5 后端会展开：服务器现场算内容再发下来 |
| `"use client"` | 2.3 请求响应：服务器发 HTML，浏览器跑 JS——这行字就是决定谁先画 |
| Tailwind CSS | 一个样式库，认得即可，写前端让 AI 用它 |

## 关键概念

- **Next.js**：React 之上的生产级框架，管路由 + 预渲染。
- **预渲染**：build 时把每页生成真实 HTML 文件，而非浏览器临时算。
- **文件夹=路由**：`app/` 下的目录结构直接对应 URL。
- **服务端组件（Server Component）**：默认，服务器/build 时画成 HTML，快、利于 SEO。
- **客户端组件（Client Component）**：标 `"use client"`，额外送 JS 到浏览器做交互。
- **SEO**：让爬虫抓得到、看得懂网页内容。
- **Tailwind CSS**：流行的工具类样式方案（认得即可）。

## 代码 / 实操

```bash
# 看 demo
cd zero-to-tech-demos/zero-to-tech-4-5
npm install && npm run dev      # localhost:3000

# build 看产物
npm run build
#   ○ (Static) prerendered as static content
ls .next/server/app/            # index.html / text-lab.html 真的存在

# 把 ~/zero-to-tech 除 .git 外全删，拷入 4-5 文件
npm install && npm run dev
git add . && git commit -m "chore: migrate to next.js" && git push

# 以后从 0 起新项目
npm create next-app@latest
```

## 我的收获

1. 「空壳 HTML + 大 JS」和「真实 HTML 文件」的差别，一句话解释了 404/白屏/SEO 三个问题——它们是同一个病根。
2. 文件夹=路由是「约定优于配置」最直观的样子：你自己的博客站就是这么跑的。
3. `"use client"` 不是不预渲染，是「还要在浏览器里再跑一遍」——这个误会点破了就清楚了。

## 待深入

*（待填：没听懂、想回头查的。）*
