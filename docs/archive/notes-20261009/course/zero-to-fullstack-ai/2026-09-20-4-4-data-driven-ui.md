---
title: "4.4 数据驱动界面"
date: "2026-09-20"
summary: >-
  数据驱动的界面是怎么组织出来的。
status: published
tags:
  - "React"
  - "前端"
lang: zh
chapter: "4.4"
series: "zero-to-fullstack"
seriesOrder: 16
---

## 课时概要

React 最大的转变：从「操作页面」变成「改变值」。这一节讲数据驱动界面的三种玩法——props + 数据与界面分离（site.js）、state（自己会变的值）、URL 路由（把页面状态写进网址），最后把 Vite+React 工程发布到公网（比 4.1 多一道：服务器上 npm install + build）。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】4.4-数据驱动界面](https://www.bilibili.com/video/BV1Dg7H6oEHQ/) ｜ 时长 42:12 ｜ 模块 4 · 现代前端

**讲义**：[模块 4.4：让数据驱动界面（李勃老师.com）](https://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-4-4/)

**配套 demo**：

```bash
git clone https://github.com/joylibo/zero-to-tech-demos.git
cd zero-to-tech-demos/zero-to-tech-4-4
npm install && npm run dev
```

## 本节要点

- **界面照着「值」显示，值变显示就变**——这就是数据驱动界面，React 最核心的思想。
- **数据与界面分离**：文案集中到 `src/data/site.js` 这张「纯内容清单」，组件只管怎么显示；改文案只动这一个文件，做多语言只要再备一份表。
- **state（状态）**：组件自己揣着、有默认值、允许改、一改界面当场跟——「已输入 N 字」随打字跳就是典型。
- **路由写进 URL**：state 存在内存里刷新就丢；把「在哪一页」写进网址，刷新不丢、链接能发、前进后退都好使（真实项目用 react-router）。
- 从外部取数据（后端 API）也是数据驱动——模块 5 的种子。
- 工程化项目上线比 4.1 多一道：源码不含 dist，服务器要先 `npm install` 再 `npm run build`，Nginx 的 `root` 指向 `dist/`。

## 笔记正文（讲义整理）

### 数据与界面分离

以前改首页那句「关于我」，要钻进 `HomePage.jsx` 一堆标签里找。现在把所有文案抽到 `src/data/site.js`：

```js
export const home = {
  heroTitle: "关于我",
  heroSubtitle: "项目，创意，灵感，心得，我的作品",
  // …
};
```

组件不再写死文案，只去这张表取值。**改 site.js 保存，页面大标题当场变，组件代码一个字没碰。** 组件管「怎么显示」，site.js 管「显示什么」。好处立刻来：做多语言只要再备一份英文内容表，组件一个不碰；以后接后端 API，这张表还能改成从网络取。

### 状态（state）：自己会变的值

有些值不是外面喂的，是组件用着用着自己变的——输入框里「当前文字」就是 state：你打字就在改它，下面「已输入 N 字」照着它算，**一变立刻跳**。App 记住「当前在哪一页」也是同一个机制。React 内部替你盯着这个值，值一变自动刷新界面——这是它最核心的引擎。

### 用 URL 管路由

上节用 state 管页面切换，问题是 URL 一直是 `/`：刷新就回首页、复制链接发给别人打开也是首页——因为 state 存在浏览器内存里，刷新即清空。

正确做法是把「在哪一页」写进 URL：demo 里点「文字实验室」，地址栏变成 `/text-lab`，**刷新还在、能复制给朋友、前进后退都好使**。真实项目不手搓，用现成的 **react-router**（认得这个名字即可）。

### 把工程化项目发布到公网

4.1 那次拉下来的是原生 html/css/js，Nginx 直接服务。这次是 Vite+React：

1. 服务器装 Node（nvm install 24）；
2. 本地 push、服务器 pull；
3. 服务器上 `npm install` + `npm run build` 产出 `dist/`；
4. Nginx 的 `root` 从源码目录改成 `…/zero-to-tech/dist`，`nginx -t` + reload。

以后每次更新：本地 push → 服务器 pull → `npm install` → `npm run build`。

![界面照着值显示：值的三种玩法 + 工程化发布多一步](/diagrams/data-driven-ui.png)

## 和 GFG / 课程笔记的连接

| 这节概念 | Python / 已学过的对应 |
| --- | --- |
| site.js 集中管内容、组件只管显示 | 数据/配置 和 代码逻辑分离（GFG 里把参数集中在文件、主程序读） |
| state 自己变、界面跟着变 | 变量值变了程序输出就变——只是 React 替你自动重渲染 |
| URL 路由 | 模块 5 后端会讲：网址路径对应哪个处理函数，同一思想 |
| 服务器上 npm install + build | 2.4/3.5 那台 Nginx 还是同一个，只是这次 root 指向 dist |
| 从 API 取数据 | 模块 5：后端把情感分数算好，前端 fetch 来显示 |

> 我们这个个人站其实就是「数据驱动」：md 文件里写内容（数据），模板负责排版（组件）；你改一篇 md，站点就重渲染——和 site.js 是同一个道理。

## 关键概念

- **数据驱动界面**：界面照着值显示，值变显示就变。
- **数据与界面分离**：内容集中到一张表，组件只管怎么显示。
- **state（状态）**：组件自己揣着、会变、一变界面就跟的值。
- **路由（routing）**：当前显示哪一页；写进 URL 才刷新不丢、可分享。
- **react-router**：真实项目用的路由库（认得名字即可）。
- **dist 部署**：工程化项目上线的是 build 产物，不是源码。

## 代码 / 实操

```bash
# 本地：升级项目（从 demo 拷 site.js / useRoute.js，覆盖 App/HomePage/TextLabPage/InputCard）
npm run dev     # 验证：地址栏变、刷新还在、字数跳、改 site.js 页面变

# 发布到公网
# 1) 服务器装 Node（nvm）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
. "$HOME/.nvm/nvm.sh" && nvm install 24

# 2) 本地 push，服务器 pull
cd ~/zero-to-tech && git pull

# 3) 服务器上装依赖并构建
npm install
npm run build

# 4) Nginx root 指向 dist
sudo vim /etc/nginx/sites-enabled/default
#   root /home/ubuntu/zero-to-tech/dist;
sudo nginx -t && sudo systemctl reload nginx

# 以后每次更新：本地 push → 服务器 pull → npm install → npm run build
```

## 我的收获

1. 「界面照着值显示」一句话打通了 props、state、路由——它们只是值存的地方不同（外部喂/自己揣/写进 URL）。
2. 数据和界面分离是性价比极高的习惯：改文案不碰组件，做多语言、接后端都顺。
3. 工程化项目上线比原生多一道 build——这就是组件化换来的成本，服务器上的 Node 是新角色。

## 待深入

*（待填：没听懂、想回头查的。）*
