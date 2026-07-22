---
title: "从手搓API到调用API：一次完整的实践复盘"
date: "2026-07-21"
summary: "上一篇 API从0-1 讲了理论，这一篇是实践复盘。我们用 Node.js 手搓了一个 30 行的 API 服务器，又用 Dog API 做了一个瀑布流画廊——两条代码加起来不到 300 行，但把「写 API」和「调 API」两端的知识都覆盖了。这篇复盘拆解每个技术决策背后的原因，把两端串成一条完整的请求-响应链路，最后提炼出 4 个不管用不用框架都成立的核心模式。"
tags:
  - zero-to-tech
  - API
  - Node.js
  - fetch
  - 实践
  - HTTP
  - 复盘
status: published
lang: zh
category: "技术/前端基础"
englishSummary: "The previous post covered API theory; this one is a practice retrospective. We hand-built a 30-line Node.js API server and a waterfall dog image gallery using the Dog API — less than 300 lines total, but covering both sides of API development. This retrospective breaks down the reasoning behind each technical decision, connects both sides into a complete request-response chain, and extracts 4 core patterns that hold true regardless of framework."
---

# 从手搓API到调用API：一次完整的实践复盘

> 这是 **zero-to-tech** 系列的第十二篇，也是「API从0-1」的实践姊妹篇。上一篇我们讲了 API 的理论——HTTP 方法、REST 风格、状态码、鉴权。这一篇不再讲新概念，而是复盘两个实战项目：**一个 30 行的 API 服务器**和**一个 Dog API 瀑布流画廊**。加起来不到 300 行代码，但覆盖了「写 API」和「调 API」两端的所有核心知识。

如果你看完了上一篇的理论，觉得「大概懂了但不知道怎么写」——这一篇就是写完之后回过头来，告诉你**为什么每个决策是对的、每个坑为什么会出现**。

---

## 一句话总结

> **写 API 和调 API 是一体两面**。服务器端做的事（解析请求 → 匹配路由 → 返回 JSON）和客户端做的事（构造请求 → 发送 → 解析响应）构成了一个完整的循环。理解了这个循环，不管用 Express 还是手写 `http.createServer`，用 fetch 还是 axios，本质上都是在操作同一个东西：**HTTP 协议规定的「请求-响应」对话**。

---

## 一、我们做了哪两件事

### 1.1 项目一：手搓一个 API 服务器（server.js）

30 行代码，三个端点，零依赖：

```js
// 核心骨架（完整版见 API从0-1 第五节）
import http from 'node:http'

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')

    if (req.method === 'GET' && req.url === '/api/articles') {
        res.writeHead(200)
        res.end(JSON.stringify(articles))
    } else if (req.method === 'GET' && req.url?.startsWith('/api/articles/')) {
        const id = Number(req.url.split('/').pop())
        const article = articles.find(a => a.id === id)
        article
            ? res.end(JSON.stringify(article))
            : res.end(JSON.stringify({ error: '文章不存在' }))
    } else {
        res.writeHead(404)
        res.end(JSON.stringify({ error: '接口不存在' }))
    }
})

server.listen(3001)
```

### 1.2 项目二：Dog Gallery 瀑布流画廊（index.html）

520 行单文件，调用 Dog CEO API，展示了品种筛选、骨架屏、加载更多、灯箱：

```js
// 核心调用逻辑（完整版见 practice/dog-gallery/index.html）
async function fetchDogImages(breed = '', count = 12) {
    const url = breed
        ? `${API_BASE}/breed/${breed}/images/random/${count}`
        : `${API_BASE}/breeds/image/random/${count}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data.message  // string[]
}
```

**两个项目放在一起看**——一个写 API，一个调 API。恰好构成一个完整的「请求-响应」闭环。

---

## 二、写 API 端：四个必须理解的技术决策

手搓 server.js 时，每行代码背后都有一个设计决策。拆开看：

### 2.1 为什么用 `http.createServer` 而不是 Express

**不是因为我们不用框架**——而是因为**先理解底层机制，框架才不是黑盒**。

`http.createServer` 是 Node.js 的原生 HTTP 模块。它暴露了一个回调 `(req, res) => {}`，**每个 HTTP 请求过来就调一次这个回调**。Express / Fastify / Hono 这些框架本质上就是在这个回调外面包了一层路由匹配器：

```
http.createServer  ← 原生层：收到请求，调回调
         ↓
    Express/Fastify  ← 路由层：帮你匹配 URL pattern，调用对应的 handler
         ↓
    你的 handler  ← 业务层：处理逻辑，返回数据
```

**你应该先手写一次 `http.createServer`**，不是为了以后都手写，而是为了以后用框架时，你知道 `app.get('/api/articles', handler)` 这行代码在底层干了什么。

### 2.2 为什么路由匹配是 `req.method + req.url` 的组合

```js
if (req.method === 'GET' && req.url === '/api/articles')
```

**两个条件缺一不可**。只匹配 URL 的话，`DELETE /api/articles` 和 `GET /api/articles` 会走到同一个 handler——这意味着删文章和读文章的逻辑会混在一起。

这就是 REST 的核心：**URL 表达资源，方法表达动作**。同一个 URL `/api/articles`，GET 是拿列表，POST 是创建，DELETE 是删除。把方法纳入路由匹配，才能区分这些操作。

### 2.3 为什么手动写 `res.writeHead(200)` 和 `res.writeHead(404)`

状态码是客户端判断请求结果的唯一标准信号。服务器端不写正确的状态码，客户端就无从判断：

```js
// 服务端：返回 404 + 错误 JSON
res.writeHead(404)
res.end(JSON.stringify({ error: '文章不存在' }))

// 客户端：靠状态码决定怎么处理
const res = await fetch('/api/articles/999')
if (!res.ok) {
    // ← 这里能进 if，是因为服务端写了 404（不是 200）
    //    如果服务端写 200 但 body 里放 error，客户端就抓不到这个错误
    showError()
}
```

**状态码和 Body 是两个独立通道**。状态码负责「结果的类别」（成功/客户端错/服务端错），Body 负责「具体内容」。服务端如果把错误信息塞进 200 Body 里，客户端就得解析完 JSON 才能判断是否出错——又慢又容易漏。

### 2.4 CORS header 为什么必须加

```js
res.setHeader('Access-Control-Allow-Origin', '*')
```

浏览器有一个安全机制叫**同源策略**：一个域名的网页只能调用同域名下的 API。`http://localhost:3000` 上的页面调 `http://localhost:3001` 的 API，端口不一样就算跨域。

不加这行 header 的结果：请求发出去了，服务器也返回了数据，但**浏览器拒绝把数据交给你的 JS 代码**。开发者在 Console 里会看到一个经典红色报错：

```
Access to fetch at 'http://localhost:3001/api/articles' from origin
'http://localhost:3000' has been blocked by CORS policy
```

加上 `Access-Control-Allow-Origin: *` 就是告诉浏览器：「这个服务器允许任何域名来调」。生产环境中应该换成具体域名，但原理一样。

---

## 三、调 API 端：四个最容易踩的坑

Dog Gallery 项目里，每个技术决策都对应了博客里讲过一个坑：

### 3.1 `fetch(url)` 返回的是 Response，不是数据

```js
// ── 正确：两步 ──
const res = await fetch(url)   // ① 拿到 Response 对象（含状态码、headers、body 流）
const data = await res.json()  // ② 把 body 流解析成 JS 对象

// ── 错误（新手写法）：一步 ──
const data = await fetch(url)  // data 是 Response 对象，data.message 是 undefined
```

**为什么是两步**：因为 Response 对象除了 body 还带了状态码和 headers——这两个信息在判断「请求是否成功」时和 body 同等重要。如果一步就给你 body，状态码就被扔掉了。

### 3.2 `fetch` 不会在 HTTP 错误时 reject

```js
const res = await fetch('https://dog.ceo/api/breed/不存在的品种/images/random/12')
// res.status === 404，但代码不会进 catch——fetch 只在网络不通时 reject
// 必须手动检查：
if (!res.ok) throw new Error(`HTTP ${res.status}`)
```

**这是 fetch 被吐槽最多的地方**。`res.ok` 等价于 `res.status >= 200 && res.status < 300`。养成每次 `fetch` 后检查 `res.ok` 的习惯。

### 3.3 loading/error/data 三种状态缺一不可

```js
// 三种 UI 状态，代码里必须都有对应：
// loading  → 骨架屏（shimmer 动画）
// data     → 图片卡片 + 品种标签
// error    → 错误提示 + 重试按钮
```

新手最容易漏的是 **loading 状态**——数据没回来时页面空白，用户不知道是在加载还是坏了。**error 状态**也常被漏——网络一断就白屏，用户不知道怎么恢复。

两个状态的实现成本都很低（骨架屏 8 个 div，错误提示 3 行 HTML），但对用户体验的提升是天壤之别。

### 3.4 并发控制：状态锁

```js
async function loadImages(append = false) {
    if (state.loading) return  // ← 状态锁：上一次还在加载就不发新请求
    state.loading = true
    // ... fetch and render ...
    state.loading = false
}
```

没有这行 `if (state.loading) return`，用户连续点「获取狗狗」5 次就发出 5 个请求——结果可能是旧的请求后回来，覆盖掉新请求的数据。**状态锁是最简单的并发控制方案**，它保证同一时间只有一个请求在飞。

---

## 四、两端打通：一个请求的完整旅程

现在我们把 server.js 和 Dog Gallery 串起来，模拟一个从「点按钮」到「看到图片」的完整链路：

```
┌─────────────────────────────────────────────────┐
│  浏览器 (Dog Gallery)                             │
│                                                  │
│  1. 点「获取狗狗」                                 │
│  2. 构造 URL:                                     │
│     https://dog.ceo/api/breeds/image/random/12   │
│  3. fetch(url) → 浏览器发 HTTP 请求                │
│               │                                  │
└───────────────┼──────────────────────────────────┘
                │
                │  GET /api/breeds/image/random/12
                │  Host: dog.ceo
                │  Accept: */*
                │
                ▼
┌─────────────────────────────────────────────────┐
│  Dog API 服务器                                   │
│                                                  │
│  4. http.createServer 回调收到 req                │
│  5. req.method === 'GET' ✓                      │
│  6. req.url 匹配 /api/breeds/image/random/12 ✓   │
│  7. 查数据库（随机选 12 张图片 URL）                │
│  8. 拼 JSON:                                     │
│     {"message":["https://...", ...],"status":"success"}
│  9. res.writeHead(200)                           │
│  10. res.end(jsonString)  ← 把 JSON 字符串发回去   │
│               │                                  │
└───────────────┼──────────────────────────────────┘
                │
                │  HTTP/1.1 200 OK
                │  Content-Type: application/json
                │  {"message":["https://...", ...]}
                │
                ▼
┌─────────────────────────────────────────────────┐
│  浏览器 (Dog Gallery)                             │
│                                                  │
│  11. fetch 拿到 Response 对象                     │
│  12. if (!res.ok) → res.status === 200, 跳过      │
│  13. await res.json() → JSON.parse(jsonString)   │
│  14. data.message → ["url1", "url2", ...]        │
│  15. 遍历 URL 数组，创建 <img> 标签，插入 DOM       │
│  16. 用户看到狗狗图片 🐕                            │
│                                                  │
└─────────────────────────────────────────────────┘
```

**这个链路的精髓**：

1. 第 5-9 步（服务端）和第 11-15 步（客户端）操作的是**同一个 HTTP 协议的两种角色**——一个生产响应，一个消费响应
2. JSON 在传输时是字符串（第 10 步），到了客户端才被 parse 成对象（第 13 步）。这就是为什么 `res.json()` 是异步的——它要等整个 body 流读完才能 parse
3. 状态码 200 是客户端信任响应的前提（第 12 步）——如果服务器写了 500，客户端的处理分支完全不同

---

## 五、两端共通的 4 个核心模式

写 API 和调 API 都做完了，回头看，有 4 个模式在两端反复出现：

### 模式 1：约定 > 实现

```
server.js 的约定：       GET /api/articles/:id  →  返回 article JSON
Dog API 的约定：        GET /breeds/image/random/:count  →  返回 { message: string[] }
```

**API 的价值不在实现，在约定**。server.js 的 articles 存内存数组还是 MongoDB 完全不重要——只要约定不变，调它的前端代码一行都不用改。Dog API 后端用什么语言、什么数据库，你甚至不需要知道。

这就是「前后端分离开发」和「不同服务互相通信」的根本基础。

### 模式 2：状态码 + Body 双通道信号

```
服务端发信号：          res.writeHead(404) + { error: 'xxx' }
客户端读信号：          if (!res.ok) { handleError() } else { useData() }
```

**状态码负责分类（成功/失败），Body 负责详情（数据/错误信息）**。这两个通道独立但配合使用。少了任何一个，客户端的状态判断逻辑就会出问题。

### 模式 3：JSON 是网络上的字符串

```
服务端：  JSON.stringify(articles)  →  JS 对象 → 网络字符串
客户端：  await res.json()          →  网络字符串 → JS 对象
```

**网络传输的不可能是 JS 对象，只能是字节流**。JSON 是目前最主流的人类可读序列化格式。`JSON.stringify`（序列化）和 `JSON.parse`（反序列化）是这层转换的核心。

理解这一点，很多「为什么」就有答案了：
- 为什么 `undefined` 和函数不能放进 API 响应 → JSON 不支持这两个类型
- 为什么 `res.json()` 是异步的 → 它要等整个字符串都收到才能 parse
- 为什么有 Binary API（gRPC 用 Protocol Buffers） → 跳过「人类可读」这个约束，数据更小更快

### 模式 4：loading → data/error 的三态机

```
服务端：  收到请求 → 处理中 → 返回 200 + data / 返回 4xx/5xx + error
客户端：  发请求   → 等待   → 显示 data / 显示 error
```

**每一次 API 调用都是一台三态状态机**：等待态 → 成功态/失败态。UI 层的骨架屏/列表/错误提示，服务端的 try/catch → 200/500，本质上都在建模同一台状态机。

---

## 六、你现在能做什么

两个项目写完，你手里有 4 个可以继续发展的方向：

| 方向 | 起点 | 下一步 |
|------|------|--------|
| **API 服务器升级** | server.js | 换成 Express，加 POST 端点（接收前端传来的数据并写入存储） |
| **画廊功能增强** | Dog Gallery | 加搜索（按品种关键字过滤）、加收藏（localStorage 存喜欢的图片） |
| **两端打通** | 两个项目拼一起 | 把画廊换成调你自己的 server.js，数据从本地服务器拉 |
| **部署上线** | server.js | 用 Vercel / Railway 部署服务器，让朋友从公网访问 |

---

## 七、一句话总结

> **写 API 和调 API 是同一枚硬币的两面**。服务端用 `req.method + req.url` 做路由，用 `res.writeHead` + `res.end(json)` 返回结果；客户端用 `fetch(url)` 发请求，用 `res.ok` + `res.json()` 处理结果。两端之间传输的是 HTTP 文本——JSON 在飞过去之前是 `JSON.stringify` 的字符串，飞到了之后再 `JSON.parse` 回对象。**理解了这个「请求-响应」循环的工作方式，以后遇到 Express / Fastify / axios / React Query / tRPC 这些框架和工具，你都能一眼看出它们在这一循环的哪个环节加了什么抽象。**

---

## 这个系列下一篇会写什么

- **zero-to-tech / React Hooks 深入：useState / useEffect / useRef 到底在干什么**
- **zero-to-tech / 进程、线程、内存：你的电脑同时在跑多少事**
- **zero-to-tech / TypeScript 是什么：为什么新项目应该用 TypeScript**

上一篇：[API从0-1：从看懂接口到自己设计接口](/blog/api-basics)
第一篇：[网络是怎么工作的](/blog/how-network-work)
