---
title: "4.1 现代前端基础——模块化"
date: "2026-09-20"
summary: >-
  现代前端第一课——模块化，现代前端的基石。
status: published
tags:
  - "前端"
  - "Node.js"
lang: zh
chapter: "4.1"
series: "zero-to-fullstack"
seriesOrder: 13
---

## 课时概要

模块 4 开篇：当网站从一个页面长到多个页面、多个 css/js 文件，传统 `<script>` 写法撞墙——顺序一错就崩、全局变量撞名。破局第一招就是**模块化**：`import` / `export` 明文声明依赖。把 4-1 demo 从传统 script 改造成 ES 模块，并理解「为什么不能再双击打开、必须走服务器」。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】4.1-现代前端基础——模块化](https://www.bilibili.com/video/BV1fmEi6DE9b/) ｜ 时长 36:49 ｜ 模块 4 · 现代前端

**讲义**：[模块 4.1：现代前端第一步——模块化（李勃老师.com）](https://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-4-1/)

**配套 demo**：

```bash
git clone https://github.com/joylibo/zero-to-tech-demos.git
cd zero-to-tech-demos/zero-to-tech-4-1
```

## 本节要点

- 第三方库可以直接用 URL 引入（CDN）：`<script src="https://cdn.../anime.iife.min.js">` 和 `<script src="js/nav.js">` 本质一样，一个住网上、一个住本地。
- **灾难一：暗依赖 + script 顺序**。`cards.js` 默默依赖 anime.js，但这条规矩没写在代码里，只藏在 `<script>` 的排列顺序里；顺序错一格就报 `anime is not defined`。
- **灾难二：全局污染**。库把名字挂在 `window` 全局上共用，库一多就撞名——后来的悄悄盖掉先来的，没人通知。
- **模块化 = 共享靠明文声明**：文件里默认私有，想对外给就 `export`，想用别人的就 `import`。没有暗依赖、没有全局撞名。
- `ES` = ECMAScript = JavaScript 官方标准；`import`/`export` 是 ES6（2015）正式定义的。
- 改造后 HTML 底部从四行 `<script>` 变成一行 `<script type="module" src="js/main.js">`；依赖顺序由代码声明、浏览器自己算。
- **新规矩**：ES 模块不能再双击 `file://` 打开（浏览器报 CORS 错），必须通过服务器——正好部署到 3.5 那台 Nginx。

## 笔记正文（讲义整理）

### 网站变大之后的样子

两个页面（个人主页 + 文字实验室）、全站导航栏、卡片随机飞入动画、分数滚动动画。文件从 1 个 html 变 2 个、css 8 个、js 3 个。引入第三方动画库 anime.js：

```html
<script src="https://cdn.jsdelivr.net/npm/animejs@4/lib/anime.iife.min.js"></script>
```

和 `<script src="js/nav.js">` 本质一样——浏览器眼里都是「一个资源」，只是一个在本地、一个在别人服务器（CDN）上。

### 两个灾难

**灾难一：顺序坑。** `cards.js` 里直接用 `anime.animate(...)`，但它没声明自己依赖 anime.js。这条依赖只藏在 `<script>` 的先后顺序里——把 anime 那行挪到 cards 后面，刷新就报 `Uncaught ReferenceError: anime is not defined`。

**灾难二：全局污染。** 库往 `window` 全局挂自己的名字，所有文件共用一张台面。项目一大，两个库挂同名的东西，后来的悄悄盖掉先来的——`cards.js` 里那个 `anime` 到底是哪个，根本猜不到。

### 破局：模块化

| | 传统 `<script>` | 模块化 |
| --- | --- | --- |
| 默认可见性 | 全世界都看得见（window） | 默认只有自己看得见 |
| 共享方式 | 公共台面随便拿 | 对外给要 `export`，想用要 `import` |
| 依赖关系 | 暗依赖，靠排顺序 | 明写在文件顶部 `import` 里 |
| 撞名 | 后来的盖掉先来的 | 各文件作用域隔离，撞不上 |

### 改造长什么样

`cards.js` 顶部把依赖挑明：

```js
import { animate, stagger } from "https://cdn.jsdelivr.net/npm/animejs@4/+esm";
export function initCardsAnim() {
  animate(".card", { /* … */ });
}
```

新建 `main.js` 当总入口：

```js
import { initNav } from "./nav.js";
import { initCardsAnim } from "./cards.js";
import { initScoreAnim } from "./score.js";
initNav(); initCardsAnim(); initScoreAnim();
```

HTML 底部四行 script 收成一行：

```html
<script type="module" src="js/main.js"></script>
```

顺序由浏览器按 `import` 自己算；`anime` 这个名字再不出现在全局。

### 新规矩：必须走服务器

改完双击 index.html，页面空白、控制台 CORS 报错——这是 ES 模块的安全规则：模块要被「正式请求」、要有 origin，`file://` 被一刀切拒绝。好在服务器 3.5 那台已经有了，按 push/pull/Nginx 那套部署上去就行。

### 一段历史

JS 1995 年诞生，**前 20 年没有官方模块系统**；2009 年 Node.js 带出 CommonJS（社区方案）；**2015 年 ES6 正式定义 `import`/`export`**；2017 年前后浏览器才原生支持 `<script type="module">`。模块化是 20 年的痛逼出来的——工程化的第一块基石。

![改造前的两个灾难，模块化怎么治](/diagrams/js-modules-before-after.png)

## 和 GFG / 课程笔记的连接

模块化不是新概念——**Python 你早就在用**：

| JS 模块化 | Python（GFG 笔记里天天见） |
| --- | --- |
| `import { animate } from "anime"` | `from pathlib import Path`、`import os` |
| `export function initNav()` | 一个 .py 文件里 `def` 的函数，别的文件 import 就能用 |
| 文件即模块，默认私有 | 一个 .py 就是一个模块，不 import 别的文件看不见 |
| 第三方库走 CDN URL | 第三方库 `pip install` 后 import |
| ES Modules（浏览器） | 即 Python 自带的 import 系统，同一思想 |

> GFG 里你写过的 `from pathlib import Path`、`import requests`，和这里的 `import { animate }` 是同一个动作：**明文声明我要用谁**。区别只是 JS 这次才在语言层面补上这一课。

## 关键概念

- **第三方库 / CDN**：别人做好、发布在网上的 js，直接用 URL 引入。
- **暗依赖**：A 文件用了 B 提供的东西，但代码里没写、只靠加载顺序。
- **全局污染**：多个库往 `window` 挂同名变量，后来的覆盖先来的。
- **`import` / `export`**：模块化两关键词——拿别人的要 import，给别人的要 export。
- **ES Modules / ES6**：JavaScript 官方模块系统，2015 年 ES6 引入。
- **`<script type="module">`**：声明这行脚本按 ES 模块方式加载，必须走服务器不能 file://。

## 代码 / 实操

```bash
git clone https://github.com/joylibo/zero-to-tech-demos.git
cd zero-to-tech-demos/zero-to-tech-4-1
# 改造前：四行 script 顺序敏感
# 改造后：
#   cards.js / score.js / nav.js 顶部 import + export
#   新建 main.js：import 三个并调用
#   HTML 底部只留：<script type="module" src="js/main.js"></script>
# 然后部署到 3.5 那台 Nginx 看效果
```

## 我的收获

1. 项目一大，「全堆在全局 + 手排顺序」必然撞墙——不是我菜，是这种写法本身到顶了。
2. `import`/`export` 的本质就是「把暗依赖写成明依赖」：一个文件依赖谁，翻到顶看 import 就知道。
3. 模块化的代价（必须走服务器）3.5 已经替我铺好路了——前面学的东西一点没浪费。

## 待深入

*（待填：没听懂、想回头查的。）*
