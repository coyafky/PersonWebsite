---
title: "Next.js 入门：App Router 与约定式路由"
date: "2026-06-25"
summary: "Next.js App Router 入门笔记：约定式文件路由、特殊文件（page / layout / loading / error / not-found）、嵌套布局、动态段、路由组（route group）的基本用法与心智模型。"
tags:
  - nextjs
  - App Router
  - 路由
  - 入门
status: draft
lang: zh
topic: nextjs
englishSummary: "Next.js App Router primer: convention-based file routing, special files (page / layout / loading / error / not-found), nested layouts, dynamic segments, and route groups — the mental model that replaces Pages Router's pages/ folder."
---

# Next.js 入门：App Router 与约定式路由

> 这是一篇**骨架示例**，用来演示学习笔记的写作格式。owner 会在掌握足够实战素材后重写为正式版本。

## 一句话总结

App Router 用**文件夹即路由、文件即 UI 单元**的方式组织应用，每个路由段可以包含 4 类特殊文件：`page`（页面）、`layout`（布局）、`loading`（加载态）、`error` / `not-found`（错误与 404）。

## 文件约定速查

| 文件 | 作用 | 是否必需 |
|------|------|---------|
| `page.tsx` | 路由的 UI 内容 | 是（叶子路由） |
| `layout.tsx` | 包裹子路由的共享布局 | 否 |
| `loading.tsx` | `Suspense` 边界 + loading UI | 否 |
| `error.tsx` | 错误边界（必须是 Client Component） | 否 |
| `not-found.tsx` | 404 UI | 否 |
| `route.ts` | API endpoint（非页面） | 否 |

## 嵌套布局

`layout.tsx` 会自动包裹该目录下的所有子路由和 `page.tsx`，并且**子布局会嵌套在父布局内部**——根布局 + 段布局 + 叶子页面三层结构是最常见的形态。

```tsx
// app/layout.tsx（根布局）
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
```

## 动态段 vs 路由组

- **动态段** `[slug]`：把路径段作为参数传给 `page` 的 props
- **catch-all** `[...slug]`：收集后续所有段
- **可选 catch-all** `[[...slug]]`：参数可缺失
- **路由组** `(group)`：括号包裹的目录**不影响 URL**，只用来分组 + 套独立 layout

> 路由组是组织大型项目的关键工具——比如 `(marketing)` 和 `(app)` 两组共享不同 layout，URL 上看不出来。

## 心智模型

App Router 不再是"页面 + 客户端跳转"的 SPA 思维，而是**服务端组件树**。每个 `page.tsx` 默认在服务端渲染，可以直接读数据库、调内部 API，子组件按需标 `"use client"` 才能用 hooks。

## 下一步

- Server Component vs Client Component 的边界
- `fetch` 缓存与 `revalidate` 的四种模式
- Server Action 与表单提交

---

> 本文的反面案例：曾经以为 `layout` 是"页面模板"，实际上它是**持久化的 UI 壳**——状态不会随页面切换重置，这是 streaming 与 partial rendering 能 work 的前提。