---
title: "5.5 前后端联调和CORS"
date: "2026-09-20"
summary: >-
  联调中常见的 CORS block 问题，以及如何用 FastAPI 的 CORS 中间件解决浏览器信任问题；附带前端环境配置。
status: published
tags:
  - "FastAPI"
  - "HTTP"
  - "后端"
lang: zh
chapter: "5.5"
series: "zero-to-fullstack"
seriesOrder: 23
---

## 课时概要

模块 5 收官。让 React（3000）和 Python（8000）真正握手：主页数据来自 `GET /api/profile`，文字实验室点按钮走 `POST /api/analyze`。路上撞两堵墙——CORS：第一堵拦简单 GET 的响应读取，第二堵拦下带 JSON POST 的 OPTIONS 预检。最后把写死的后端地址收进 `.env.local`。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】5.5-前后端联调和CORS](https://www.bilibili.com/video/BV13M3U6HEnk/) ｜ 时长 42:06 ｜ 模块 5 · 初试后端

**讲义**：[模块 5.5：前后端联调与 CORS（李勃老师.com）](https://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-5-5/)

**配套 demo**：`zero-to-tech-demos` 仓库的 `zero-to-tech-5-5/`，覆盖同名 jsx 和 lab.css。

## 本节要点

- **联调先找线索，别看见红字就改代码**：一次请求在三处留痕——浏览器 Network（发出了吗）→ 后端终端（收到了吗、怎么处理的）→ 浏览器 Console（结果为什么没交到代码手里）。
- **源 = 协议 + 域名 + 端口**；3000 和 8000 端口不同就是两个源，跨源。
- **CORS 拦的不是请求到达后端，而是浏览器不让网页 JS 读未经许可的跨源响应**——所以 curl 一直畅通，它不是网页。
- 解法：后端响应带 `Access-Control-Allow-Origin`；FastAPI 用 `CORSMiddleware` 中间件统一加 `allow_origins`。
- **带 JSON 的 POST 是「不简单请求」**，浏览器自动先发 **OPTIONS 预检**，通过才发真正的 POST；要补 `allow_methods=["GET","POST"]`。
- **后端地址属于配置**，别散在组件里：`.env.local` 的 `NEXT_PUBLIC_` 前缀变量（可进浏览器，**不能放密钥**），改完要重启 dev。

## 笔记正文（讲义整理）

### 跑起两边

```bash
# 终端 1：后端
cd ~/zero-to-tech/backend && source .venv/bin/activate && fastapi dev   # :8000
# 终端 2：前端
cd ~/zero-to-tech && npm run dev                                       # :3000
```

先把 `/api/profile` 补成和 `site.js` 的 `home` 同构（featuredWork/identity），标题临时加「（来自后端）」做验证标记。前端用 demo 里的 5-5 版本覆盖 HomeView/TextLabView/InputCard/ResultCard/lab.css。

### 第一堵墙：CORS 拦响应

页面没变。按三站排查：

1. **Network**：`/api/profile` 请求存在 → 发出去了；
2. **后端终端**：`GET /api/profile 200 OK` → 收到且成功；
3. **Console**：红字 `blocked by CORS policy: No 'Access-Control-Allow-Origin'`。

请求到了、后端也回了，**但浏览器不让网页 JS 读这份响应**。源 = 协议+域名+端口，3000→8000 跨源。解法：

```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
)
```

刷新，标题变成「关于我（来自后端）」。

### 第二堵墙：POST 被预检拦下

点「开始分析」报 `Failed to fetch`。Network 里发现一条**从没写过的 `OPTIONS`** 失败，真正的 POST 根本没发出去。

- 这个 OPTIONS 是**浏览器自动发的 CORS 预检**（preflight），不是我们的代码；
- 简单 GET 直接发；带 `Content-Type: application/json` 的 POST 不简单，先预检问「允许这个源/这个方法/这个头吗」，通过才发真 POST；
- Console 说 `Method POST is not allowed`——我们只写了 allow_origins，没写方法。补：

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
)
```

再点，Network 里是两条：OPTIONS 预检通过 → 真正的 POST，结果区出来了。

![联调三站排查 + CORS 两副面孔](/diagrams/cors-debugging.png)

### 把写死的地址收进配置

前端代码里 `http://localhost:8000` 散在两处，换环境就得满项目搜。它不是业务逻辑，是**配置**。

```bash
# 前端根目录 .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

```js
const API = process.env.NEXT_PUBLIC_API_BASE_URL;
fetch(`${API}/api/profile`)
```

- `NEXT_PUBLIC_` 前缀 = 可进浏览器代码，所以**只能放可公开的值，不能放密钥**；
- 改完 `.env.local` 要重启 `npm run dev`；
- `.env*` 已在 `.gitignore`，不进 Git。

### 全链路打通

```
输入文字 → 浏览器发 POST → OPTIONS 预检通过 → FastAPI 校验
→ Python 计算 → 返回 JSON → 前端更新界面
```

模块 5 收官：5.1 调 API → 5.2 Python/venv → 5.3 手搓 HTTP → 5.4 FastAPI → 5.5 前后端握手。欠账：拼音/情感分数还是占位、结果没历史——模块 6 用第三方库把分析变真。

## 和 GFG / 课程笔记的连接

| 这节内容 | GFG / 已学 |
| --- | --- |
| 三站排查法 | 5.3「报错是线索」的延伸——先定位断在哪一站，别盲改 |
| `process.env` 环境变量 | GFG 的 `os.environ`；`.env` 文件是同一思想 |
| CORS | 全新网络概念；记住它是**浏览器**的规则，curl 不受限 |
| OPTIONS 预检 | 5.3 方法表里 OPTIONS「我能做什么」——今天派上用场 |
| FastAPI CORSMiddleware | 5.4 的框架，中间件=请求响应必经的一层处理 |

> 你在 GFG 里学的 `os.environ` 和这里的 `process.env` 是同一个概念：跟环境绑定的值别写死在代码里。

## 关键概念

- **源（origin）**：协议 + 域名 + 端口，任一不同即跨源。
- **CORS**：浏览器对网页 JS 读跨源响应的安全规则；响应头 `Access-Control-Allow-Origin` 是后端的许可。
- **预检（preflight）**：浏览器对「不简单」跨源请求自动先发的 OPTIONS，问清楚再发真请求。
- **中间件**：请求进入/响应离开必经的一层统一处理。
- **.env.local / NEXT_PUBLIC_**：前端环境配置；带 `NEXT_PUBLIC_` 前缀才进浏览器，且不能放密钥。

## 代码 / 实操

```bash
# 两个终端
cd ~/zero-to-tech/backend && source .venv/bin/activate && fastapi dev
cd ~/zero-to-tech && npm run dev

# 后端加 CORS（main.py）
#   from fastapi.middleware.cors import CORSMiddleware
#   app.add_middleware(CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_methods=["GET","POST"])

# 前端 .env.local
#   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
# 改完重启 npm run dev
```

## 我的收获

1. 联调的功夫在「定位断在哪一站」：Network → 后端终端 → Console，一站一站排除，比盯着代码猜高效得多。
2. CORS 不是身份验证，也拦不住 curl——它只对网页 JS 生效；理解「请求到了但读不到」这个反差，CORS 就通了。
3. 配置和业务代码分开，是个迟早要还的债——趁散落在两处时就收进 .env，别等十几个文件再收拾。

## 待深入

*（待填：没听懂、想回头查的。）*
