---
title: "4.6 Next.js项目的两种部署方式"
date: "2026-09-20"
summary: >-
  Next.js 项目的两种运行方式：静态部署 vs 常驻 Node 服务。
status: published
tags:
  - "Next.js"
  - "运维"
lang: zh
chapter: "4.6"
series: "zero-to-fullstack"
seriesOrder: 18
---

## 课时概要

前端收官课。Next.js 项目上线有两条路：A 常驻 Node 服务（能耐最大、最重），B 静态导出 `out/`（轻、Nginx 直接发）。我们选 B——加一行 `output: "export"`，Nginx root 指向 `out/` 并配 `try_files`。讲清为什么不走 Next 全栈，而是「静态前端 + 独立 Python 后端」。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】4.6-Next.js项目的两种部署方式](https://www.bilibili.com/video/BV1FiTq6fE8N/) ｜ 时长 27:57 ｜ 模块 4 · 现代前端

**讲义**：[模块 4.6：把前端项目发布到公网（李勃老师.com）](https://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-4-6/)

> 这节没有配套 demo，就在已有 `zero-to-tech` 项目上动手。

## 本节要点

- Next 默认产物 `.next/` **不能直接丢给 Nginx**：CSS/JS 散在 `.next/static/`、无后缀路由要运行时现办、混着服务器才懂的文件——它是喂给 `next start` 那台服务的。
- **路 A：常驻 Next 服务**（`npm run start`）——按每个请求当场现画，能耐最大，但是 Node 进程 7×24 常驻，重。
- **路 B：静态导出**（`output: "export"` → 干净的 `out/`）——每页一个真实 HTML，Nginx 直接发，服务器不用常驻任何东西。
- **「内容动态」≠「必须走 A」**：登录/读库/实时数值绝大多数是「静态前端 + 后端 API」，页面还是静态文件，数据浏览器事后现取。
- 我们这个项目数据全硬编码，选 **B**。落地只有两处不同：① `next.config.mjs` 加 `output: "export"`；② Nginx `root` 指向 `out/` + `try_files $uri $uri.html $uri/ =404`。
- 课程不走 Next 全栈，选**静态前端 + 独立 Python 后端**：解耦、Python 后端生态更成熟、Next 全栈还年轻（2025.12 爆出过 CVSS 10.0 的 RSC 远程代码执行漏洞）。

## 笔记正文（讲义整理）

### 为什么 .next/ 不能直接给 Nginx

`npm run build` 后 `.next/server/app/` 里虽有真实 html，但不能像 `dist/` 那样直接发：

- 那些 html 引用的 CSS/JS 散在 `.next/static/`，凑不成一个干净网站根目录；
- `/text-lab` 这种无后缀网址该回哪个文件、404 怎么兜，是 `next start` 那台服务运行时现办的；
- 还混着 `.rsc` 数据、manifest、服务端 JS——浏览器看不懂。

### 两条路怎么选

| | 路 A：常驻 Next 服务 | 路 B：静态导出 out/ |
| --- | --- | --- |
| 怎么跑 | 服务器 `next start`，Node 进程 7×24 | 纯静态文件夹，Nginx 直接发 |
| 能耐 | 请求时现场拼 HTML（连库/读密钥） | build 时就定死，不能现场拼 |
| 代价 | 重、费服务器资源 | 页面内容 build 时必须确定 |
| 适合 | 电商/新闻/社媒重内容 | 博客/文档/纯展示 + 后端 API |

关键澄清：**「内容动态」≠「必须走 A」**——登录、读数据库、实时数值，绝大多数是静态前端 + 浏览器事后调 API。我们的项目选 B。

### 落地 B：两处不同

```js
// next.config.mjs 加一行
const nextConfig = { output: "export" };
```

```nginx
server {
  root /home/ubuntu/zero-to-tech/out;   # 4.4 是 dist，这次是 out
  index index.html;
  location / {
    try_files $uri $uri.html $uri/ =404;  # /text-lab → 自动补 .html
  }
}
```

流程还是 4.4 那套：本地 push → 服务器 pull → `npm install` → `npm run build` → reload。浏览器直接敲 `/text-lab` 直达，404/白屏/SEO 三病全消。

### 为什么不走 Next 全栈

路 A 的进阶就是「Next 全栈」——同一项目里写后端接口。课程不走，改走**静态前端 out/ + 独立 Python 后端**：① 前后端解耦，利于建立「两个独立角色」的心智；② Python 做算法/数据后端生态更成熟；③ Next 全栈还年轻——2025 年 12 月 RSC 爆出 CVSS 10.0 远程代码执行漏洞，未登录一个 HTTP 请求即可跑任意代码。

> 这就是 4.4→4.5→4.6 的闭环：4.4 部署后 F12 发现页面是浏览器现画的 → 4.5 Next 预渲染成真实 HTML → 4.6 一行 export 导成 out/ 上线。

![Next.js 两条部署路：选 B 静态导出](/diagrams/nextjs-deploy-paths.png)

## 和 GFG / 课程笔记的连接

| 这节概念 | 已学过的对应 |
| --- | --- |
| 静态前端 + 后端 API | **模块 5 的预告**：Python 后端算情感分数/拼音，前端调接口 |
| Nginx root + try_files | 2.4/3.5/4.4 同一台 Nginx，这次 root 从 dist 换成 out |
| 服务端组件 vs 客户端组件 | 4.5 已讲：都预渲染，客户端组件多送一份 JS |
| 本地 push → 服务器 pull → build | 3.4/3.5 建的 Git 肌肉记忆，这次多一步 build |
| CI/CD 自动跑 | 现在先人肉；认得这个词，以后再学 |

> 你这个博客站本身就是路 B 的活例子——build 出一堆静态 HTML，Nginx 直接发，没有常驻 Node 服务。

## 关键概念

- **路 A（常驻服务）**：`next start` 跑着的 Node 进程，请求时现场渲染。
- **路 B（静态导出）**：`output: "export"`，build 出干净的 `out/`，交给 Nginx。
- **try_files**：Nginx 找不到无后缀路径时自动补 `.html` 再找。
- **Next 全栈**：前后端写在同一个 Next 项目里（`app/api/...`）。
- **静态前端 + 后端 API**：本课程的路线——前端纯静态，后端独立（Python），靠 API 通话。

## 代码 / 实操

```bash
# 1. next.config.mjs 加一行
#    const nextConfig = { output: "export" };

# 2. 本地 build 验证
npm run build
ls out/               # index.html / text-lab.html / 404.html / _next/static/

# 3. 提交推送
git add next.config.mjs && git commit -m "chore: static export" && git push

# 4. 服务器
cd ~/zero-to-tech && git pull && npm install && npm run build

# 5. Nginx：root 指向 out/，location 加 try_files
sudo vim /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 以后更新：commit → push → 服务器 pull → npm run build
```

## 我的收获

1. 「内容动态」和「必须常驻服务」是两回事——静态前端 + 浏览器调 API 能干掉绝大多数动态需求，这是 B 能选的底气。
2. 4.4/4.5/4.6 是一条被痛推着走的闭环：先发现问题，再用框架根治，最后落地部署。
3. 新技术（Next 全栈）再香也要掂量稳不稳——那个 CVSS 10.0 漏洞就是活生生的例子；解耦的「静态前端 + 独立后端」对新手更友好。

## 待深入

*（待填：没听懂、想回头查的。）*
