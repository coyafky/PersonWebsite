---
title: "4.2 Vite、npm与前端构建"
date: "2026-09-20"
summary: >-
  在只懂 HTML/CSS/JS 的前提下，讲清 npm、package.json、Node.js、Vite、build 这些现代前端概念。
status: published
tags:
  - "npm"
  - "Vite"
  - "Node.js"
lang: zh
chapter: "4.2"
series: "zero-to-fullstack"
seriesOrder: 14
---

## 课时概要

在 4.1 模块化代码的基础上请进构建工具：装 Node.js 和 npm、`npm init` 生成 `package.json`、用 `npm install -D vite` 装上 Vite，跑通 `dev`（热更新）/ `build`（打包成 dist）/ `preview`（本地验产物），搞清 `dependencies` vs `devDependencies`、源码 ≠ 运行代码。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】4.2-Vite、npm与前端构建](https://www.bilibili.com/video/BV1k3JA6cEAt/) ｜ 时长 58:22 ｜ 模块 4 · 现代前端

**讲义**：[模块 4.2：Vite, npm 与前端构建（李勃老师.com）](https://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-4-2/)

## 本节要点

- 4.1 之后还剩三件难受：看一眼要 push/pull 一整轮、打开页面十几个请求、改 css 被浏览器缓存——它们靠手动治不好，要靠**构建工具**。
- 构建工具夹在「工程治理 / 开发体验 / 用户体验」之间做翻译，替你做三件事：**起本地服务器热更新、把碎文件合并、给文件名加 hash**。
- **Node.js** 是让 JS 跳出浏览器在你电脑上跑的环境（像跑 .py 要装 Python）；它附赠 **npm**——JS 的应用商店，类比 apt，但**按项目管**。
- `npm init -y` 生成 `package.json`（项目档案），只留 `name`/`version`；`npm install -D vite` 装进 `node_modules` 并记进 `devDependencies`，同时生成锁版本的 `package-lock.json`（要提交 git）。
- 三条命令：`npm run dev`（开发热更新）、`npm run build`（产出 dist）、`npm run preview`（本地验 dist）；scripts 是命令别名表，名字自己起。
- **源码 ≠ 运行代码**：你维护源码，上线跑的是 `dist`；`node_modules` 和 `dist` 写进 `.gitignore` 不提交。
- **dependencies 是砖**（anime 等运行时库，会上线）；**devDependencies 是脚手架**（Vite 等工具，不上线）。

## 笔记正文（讲义整理）

### 三件难受

1. 想看一眼效果，得 push → 服务器 pull → 刷新一整轮；
2. F12 Network 一排请求：8 个 css 各走一趟；
3. 改了 css 刷新没变，其实是浏览器缓存了旧文件。

### 构建工具做什么

三方拉扯：工程治理要规范、开发者要顺手、浏览器要快。工具夹中间做翻译，把你写的源码转成浏览器要的样子，一一对症：

- 本地起服务器，保存即自动刷新（**热更新**）→ 治难受 1
- 8 个 css 合成 1 个 → 治难受 2
- 文件名加 **hash**，内容一变名字就变，缓存自动失效 → 治难受 3

选的工具是 **Vite**（法语「快」，作者尤雨溪）。

### Node.js 与 npm

Vite 是 JS 写的命令行工具，浏览器外跑 JS 要先装 **Node.js**（类比跑 .py 要装 Python）。Node 附赠 **npm**——JS 的应用商店，类比 apt。关键区别：**apt 装整机、npm 只管当前项目**。

```
node -v && npm -v        # 确认装好
npm init -y              # 生成 package.json
npm install -D vite      # 装 Vite（开发依赖）
```

`package.json` 是项目档案（JSON = 键:值的纯文本数据格式）；`node_modules` 是装出来的东西（又大又多，别翻）；`package-lock.json` 锁死精确版本、要提交 git。

### 三条命令

```
npm run dev       # 本地起服务器 localhost:5173，改完秒看（热更新）
npm run build     # 打包出 dist/：css/js 合并、文件名加 hash
npm run preview   # 本地起服务器看 dist 产物
```

`scripts` 里给命令起别名，`npm run xxx` 就是翻档案照本执行；dev/build/preview 这三个名字是自己起的。

### 源码 ≠ 运行代码

你维护 `js/`、`css/` 源码（多、好读）；上线跑的是 `dist`（少、压缩、改名）。改网站永远改源码再 build，**别手改 dist**。`node_modules` 和 `dist` 都是可重建产物，写进 `.gitignore`。

### dependencies vs devDependencies（这节最该带走的直觉）

```
npm install vite     → devDependencies   # 脚手架：盖房用，盖完即撤，上线网站里没有 Vite
npm install animejs  → dependencies     # 砖：运行时真用，打进 dist 随之上线
```

把 4.1 那行 CDN 长网址换成 `import ... from "animejs"`，再 build——anime 被打进本地 bundle，不再依赖别人的 CDN，版本也锁死。

![构建工具夹在中间：源码经 Vite 变成浏览器要的 dist](/diagrams/vite-build-pipeline.png)

## 和 GFG / 课程笔记的连接

前端这套工具链，和 Python 生态是一一对应的：

| 前端（npm/Vite） | Python（GFG 笔记里熟） |
| --- | --- |
| Node.js | Python 解释器（跑 .py 要装它） |
| npm | pip / 应用商店 |
| `package.json` | `requirements.txt` / `pyproject.toml`（记依赖清单） |
| `node_modules` | `site-packages` / venv（装出来的库，不提交） |
| `npm run dev/build` | 项目里的脚本入口 |
| dependencies（运行时库） | 项目 `requirements` 里的 requests 等 |
| devDependencies（开发工具） | pytest、ruff 这类只开发时用的工具 |
| `.gitignore` 排除 node_modules | Python 项目排除 venv/、__pycache__ |

> 你在 GFG 里 `pip install requests` 然后 import，和这里 `npm install animejs` 然后 `import ... from "animejs"` 是同一个动作——只是 JS 这才补上包管理这一课。

## 关键概念

- **构建工具 / 构建（build）**：把源码转成浏览器可高效运行的产物的工具和过程。
- **Node.js**：浏览器外运行 JS 的环境。
- **npm**：JS 包管理器，按项目管理依赖。
- **package.json / package-lock.json**：项目档案 / 锁死精确版本。
- **node_modules**：装出来的依赖堆，不提交 git。
- **dev / build / preview**：开发服务器 / 打包 / 预览产物。
- **dist**：build 产出的、真正上线运行的那份。
- **dependencies vs devDependencies**：运行时要用的库 vs 只开发时帮忙的工具。

## 代码 / 实操

```bash
# 1. 装 Node（含 npm），新终端验证
node -v && npm -v

# 2. 项目根目录初始化
npm init -y
# 手动把 package.json 精简到只留 name / version

# 3. 装 Vite（开发依赖）
npm install -D vite

# 4. scripts 加别名
#   "dev": "vite", "build": "vite build", "preview": "vite preview"

# 5. 日常
npm run dev        # 开发，localhost:5173 热更新
npm run build      # 出 dist/
npm run preview    # 本地看 dist

# 6. .gitignore
#   node_modules
#   dist

# 7. 把 anime 从 CDN 收进本地
npm install animejs
# cards.js: import { animate, stagger } from "animejs";
npm run build
```

## 我的收获

1. 三件难受不是我手笨，是缺工具——构建工具就是干这个的：热更新、合并、加 hash。
2. 「源码 ≠ 运行代码」这句最值钱：以后永远改源码、重新 build，别碰 dist。
3. dependencies（砖）和 devDependencies（脚手架）看着像，其实一个上线一个不上线——以后装包先问自己：它是网站运行时用的，还是只是帮我干活的？

## 待深入

*（待填：没听懂、想回头查的。）*
