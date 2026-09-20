---
title: "API从0-1：从看懂接口到自己设计接口"
date: "2026-07-09"
summary: "前端开发者迟早要面对一个问题：数据从哪来？API 就是答案。这一篇不是 API 百科全书，而是一条从0到1的路径——先用 fetch 拉回第一份数据（0），理解 HTTP 请求和响应的结构，掌握 REST 风格的设计约定，最后自己搭一个能跑的 API 端点（1）。中间穿插 GitHub API 实战和 3 个帮你避坑的心智模型。"
tags:
  - "zero-to-tech"
  - "HTTP"
status: published
lang: zh
category: "技术/前端基础"
englishSummary: "Every frontend developer eventually faces the question: where does the data come from? The answer is APIs. This piece is not an API encyclopedia — it's a 0-to-1 path: first pull data with fetch (0), understand HTTP request/response structure, master REST design conventions, then build a working API endpoint yourself (1). Includes GitHub API hands-on practice and 3 mental models to help you avoid common pitfalls."
---

# API从0-1：从看懂接口到自己设计接口

> 这是 **zero-to-tech** 系列的第十一篇。前面讲了 React 怎么管 UI、状态怎么驱动页面。但有一个问题一直没回答——**数据从哪来**？商品列表、用户头像、文章内容……都来自某个远端服务器，前端通过 **API** 把它们拉回来。这一篇带你从「只会调 fetch」走到「能自己设计并搭建一个 API」。

我第一次用 `fetch` 拉 GitHub 用户数据时，盯着控制台的输出看了很久，心想：「这个 `.json()` 是干嘛的？为什么不能直接 `data.name`？」

后来才明白：**API 响应在网络上是字符串**——浏览器拿到的是「一堆字节」，`response.json()` 本质上是在做 `JSON.parse`。**API 调用不是对象之间互传，是两段程序按约定对话**。

这一篇的目标：**让你不仅能看懂别人的 API、会调别人的 API，还能自己设计并搭建一个能跑的 API**。

---

## 一句话总结

> **API = 两个软件之间的对话规则**。最常见的 HTTP API 由 **方法（GET/POST/PUT/DELETE）+ 路径（/users/123）+ Headers（元信息）+ Body（JSON 数据）** 组成，服务器返回 **状态码（2xx/4xx/5xx）+ 响应体**。理解这 5 个要素，你就理解了 API 的 90%。剩下的 10% 是鉴权和设计风格。

---

## 一、什么是 API：一个你必须先想通的概念

### 1.1 餐厅类比

把 API 想成**餐厅点餐**，这个类比可以用很久：

```
你（客户端）                  后厨（服务器）
   │                              │
   │  招手、说「一份牛排」         │
   │  ─────────────────────→     │
   │          服务员（API）        │
   │  ←─────────────────────     │
   │      端上来牛排              │
```

**API 就是那个服务员**：
- 你不用自己进后厨（不用知道后厨怎么运作）
- 有一套固定的点菜流程（接口规范）
- 点什么菜、什么口味（请求格式）
- 上什么菜、什么火候（响应格式）

### 1.2 技术定义

> **API**（Application Programming Interface，应用程序编程接口）= **一套让两个软件互相调用、互相传数据的约定**。

关键词是「**约定**」——不是「实现」。你不需要知道 GitHub 后端用什么语言、什么数据库，你只需要知道：

```
发 GET 请求到 https://api.github.com/users/coyafky
→ 你会拿到一个 JSON 对象，里面有 login、name、avatar_url 等字段
```

这个约定一旦确立，前端和后端可以各自独立开发，只要都遵守约定，最后就能对接上。

### 1.3 你已经在用 API 了

你可能没意识到，但你每天都在用 API：

```js
// 浏览器 API —— 浏览器暴露给 JS 的能力
document.querySelector('.title')           // DOM API
localStorage.setItem('token', 'abc123')    // 存储 API
fetch('/api/users')                         // 网络 API

// 库 API —— React 暴露给使用者的能力
import { useState, useEffect } from 'react'
const [count, setCount] = useState(0)
```

**「一切你能调用的外部能力，都通过 API 暴露」**——库、框架、操作系统、远端服务，全部遵守这个规律。

本篇聚焦的是 **HTTP API**（也叫 Web API）——通过网络发 HTTP 请求来调用的那一类。这也是前端开发者打交道最多的 API。

---

## 二、你的第一个 API 调用：从 0 开始

### 2.1 用浏览器直接看 API 返回

打开浏览器，在地址栏输入：

```
https://api.github.com/users/coyafky
```

你会看到一堆 JSON 文本——这就是一个 API 响应。浏览器地址栏发的是 GET 请求，GitHub 的服务器收到后，返回了这个用户的公开信息。

### 2.2 用 fetch 拉回第一份数据

在浏览器的开发者工具 Console 里粘贴：

```js
const res = await fetch('https://api.github.com/users/coyafky')
const user = await res.json()
console.log(user.name)      // 输出什么？
console.log(user.public_repos)  // 输出什么？
```

**发生了什么**：

```
1. fetch(url)              → 浏览器向 GitHub 服务器发了一个 GET 请求
2. await                   → 等服务器响应（网络往返，通常几十到几百毫秒）
3. res                     → 拿到一个 Response 对象（包含状态码、headers、body）
4. res.json()              → 把 body 里的 JSON 字符串解析成 JS 对象
5. user                    → 现在你可以 user.name、user.avatar_url 随便用了
```

**你已经完成了从 0 到 0.1**——你能调一个真实世界的 API 了。

### 2.3 fetch 最常见的两个坑

**坑 1：`fetch` 返回的不是数据**

```js
// ❌ 错误：data 是 Response 对象，不是 JSON
const data = await fetch('https://api.github.com/users/coyafky')
console.log(data.name)  // undefined

// ✅ 正确：先 .json() 解析
const res = await fetch('https://api.github.com/users/coyafky')
const data = await res.json()
console.log(data.name)  // "coyafky"
```

**坑 2：HTTP 错误不会让 fetch reject**

```js
// 404 不会抛异常！res.ok 才是判断标准
const res = await fetch('https://api.github.com/users/不存在的用户')
// res.status === 404，res.ok === false
// 但代码不会进 catch

// ✅ 正确做法：手动检查
if (!res.ok) {
    throw new Error(`请求失败: ${res.status}`)
}
const data = await res.json()
```

这两个坑是新手最高频的卡点。理解它们背后的原因（Response 对象结构、fetch 的设计哲学），API 调用的 90% 的坑就踩完了。

---

## 三、解剖一个 HTTP 请求：5 要素

### 3.1 请求的结构

```http
POST https://api.example.com/articles
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
User-Agent: Mozilla/5.0

{"title":"API从0-1","content":"正文...","tags":["api","web"]}
```

| 要素 | 例子 | 作用 |
|------|------|------|
| **方法** | `POST` | 我要做什么（读/写/改/删） |
| **路径** | `/articles` | 操作哪个资源 |
| **Headers** | `Content-Type: application/json` | 元信息（格式、身份、偏好） |
| **空行** | （Headers 后的空行） | 分隔 Headers 和 Body |
| **Body** | `{"title":"..."}` | 实际要传的数据 |

**日常工作中你不需要手写原始 HTTP**——`fetch` 和 `axios` 帮你组装好了。但理解这个结构，出问题时才看得懂调试信息。

### 3.2 5 个 HTTP 方法

| 方法 | 含义 | 有 Body 吗 | 幂等 |
|------|------|-----------|------|
| **GET** | 读取 | 通常没有 | ✅ |
| **POST** | 创建 | 有 | ❌ |
| **PUT** | 整体替换 | 有 | ✅ |
| **PATCH** | 局部更新 | 有 | ⚠️ |
| **DELETE** | 删除 | 通常没有 | ✅ |

**幂等** = 调 1 次和调 100 次结果一样。GET 永远是幂等的。POST 不是——创建用户调 100 次就创建 100 个。

### 3.3 响应的结构

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /articles/456

{"id":456,"title":"API从0-1","createdAt":"2026-07-09T10:30:00Z"}
```

| 要素 | 例子 | 作用 |
|------|------|------|
| **状态码** | `201 Created` | 告诉客户端结果是什么（成功/失败/重定向） |
| **Headers** | `Content-Type: application/json` | 响应元信息 |
| **Body** | `{"id":456,...}` | 实际返回的数据 |

### 3.4 状态码速查

不需要背，记住**区间含义**就够了：

| 区间 | 含义 | 见到时的反应 |
|------|------|-------------|
| **2xx** | 成功 | 正常处理数据 |
| **3xx** | 重定向 | 浏览器会自动跟过去，一般不用管 |
| **4xx** | 你（客户端）的问题 | 检查 URL、参数、鉴权 |
| **5xx** | 服务器的问题 | 等一会儿重试，或联系后端 |

**最常遇到的 5 个**：

| 状态码 | 含义 | 出现时怎么做 |
|--------|------|-------------|
| **200 OK** | 成功 | 正常解析数据 |
| **201 Created** | 创建成功（POST） | 拿返回的新资源 |
| **401 Unauthorized** | 没登录/没带 token | 检查 Authorization header |
| **404 Not Found** | URL 写错了或资源不存在 | 检查路径拼写 |
| **500 Internal Server Error** | 服务器代码挂了 | 看后端日志 |

---

## 四、REST 风格：用 URL 表达资源

### 4.1 核心约定

**REST**（Representational State Transfer）是 HTTP API 最主流的设计风格。它的核心思想只有一句话：

> **URL 表达资源（名词），HTTP 方法表达动作（动词）。**

| 操作 | URL | 方法 | 一句话 |
|------|-----|------|--------|
| 看所有文章 | `/articles` | GET | 把文章列表给我 |
| 看某一篇 | `/articles/123` | GET | 把第 123 号文章给我 |
| 新建文章 | `/articles` | POST | 帮我创建一篇新文章（数据在 body） |
| 改文章 | `/articles/123` | PUT | 把 123 号文章整体替换 |
| 删文章 | `/articles/123` | DELETE | 删掉 123 号文章 |
| 看文章的评论 | `/articles/123/comments` | GET | 拿 123 号文章下的所有评论 |

### 4.2 REST 的好品味 vs 坏品味

```http
# ✅ 好：URL 是名词，方法表达动作
GET  /articles/123
POST /articles
DELETE /articles/123

# ❌ 坏：URL 暴露了内部实现
GET  /api/getArticles?id=123
POST /api/doCreateArticle
GET  /api/deleteUser
```

**判断标准**：一个好的 API URL 应该读起来像「资源的路径」，而不是「函数的调用」。

### 4.3 一个完整的 REST 调用链路

```mermaid
sequenceDiagram
    actor U as 用户
    participant FE as 前端 (React)
    participant API as API 服务器
    participant DB as 数据库

    U->>FE: 点击「文章列表」
    FE->>API: GET /api/articles
    API->>DB: SELECT * FROM articles
    DB-->>API: 返回 50 行
    API-->>FE: 200 OK + [{id:1,title:"..."},...]
    FE->>FE: setState(articles)
    FE-->>U: 渲染出 50 篇文章
```

**每一步的意义**：
1. 用户点击 → 触发前端代码
2. 前端发 HTTP 请求 → 越过网络
3. API 服务器收到 → 查数据库
4. 数据库返回数据 → API 组装成 JSON
5. 前端收到 JSON → 更新 UI

---

## 五、从 0 到 1：自己搭一个 API

> 这是本篇的核心——从「只会调别人 API」到「自己能写一个 API」。

### 5.1 最小可用的 Node.js API

新建一个文件 `server.js`：

```js
// server.js —— 一个不到 30 行的 API 服务器
import http from 'node:http'

const articles = [
    { id: 1, title: 'Hello World', content: '第一篇内容' },
    { id: 2, title: 'API从0-1', content: '从调接口到自己写接口' },
]

const server = http.createServer((req, res) => {
    // 设置 CORS，允许前端跨域调用
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')

    // 路由：根据方法和路径分发
    if (req.method === 'GET' && req.url === '/api/articles') {
        res.writeHead(200)
        res.end(JSON.stringify(articles))
    } else if (req.method === 'GET' && req.url?.startsWith('/api/articles/')) {
        const id = Number(req.url.split('/').pop())
        const article = articles.find(a => a.id === id)
        if (article) {
            res.writeHead(200)
            res.end(JSON.stringify(article))
        } else {
            res.writeHead(404)
            res.end(JSON.stringify({ error: '文章不存在' }))
        }
    } else {
        res.writeHead(404)
        res.end(JSON.stringify({ error: '接口不存在' }))
    }
})

server.listen(3001, () => {
    console.log('API 服务器跑在 http://localhost:3001')
})
```

### 5.2 跑起来

```bash
node server.js
# 输出: API 服务器跑在 http://localhost:3001
```

新开一个终端，用 curl 测试：

```bash
# 获取所有文章
curl http://localhost:3001/api/articles
# → [{"id":1,"title":"Hello World",...},{"id":2,"title":"API从0-1",...}]

# 获取单篇文章
curl http://localhost:3001/api/articles/1
# → {"id":1,"title":"Hello World","content":"第一篇内容"}

# 不存在的文章
curl http://localhost:3001/api/articles/999
# → {"error":"文章不存在"}
```

### 5.3 和前端的 fetch 打通

在浏览器 Console 里（任意网页都可以，跨域由 CORS header 解决）：

```js
const res = await fetch('http://localhost:3001/api/articles')
const articles = await res.json()
console.table(articles)
```

**你刚刚完成了从 0 到 1**：
1. 写了一个能处理 HTTP 请求的服务器（30 行代码）
2. 实现了 REST 风格的路由（`GET /api/articles`、`GET /api/articles/:id`）
3. 返回了 JSON 格式的数据
4. 处理了 404 错误
5. 前端用 fetch 成功调通

**这就是一个 API 的最小完整闭环。**

### 5.4 这个简陋服务器和生产环境的差距

| 维度 | 这个例子 | 生产环境 |
|------|---------|---------|
| **路由** | 手动 if/else | Express / Fastify / Hono 等框架 |
| **数据** | 内存数组（重启就丢） | 数据库（PostgreSQL / MySQL / MongoDB） |
| **鉴权** | 无（谁都能调） | JWT / OAuth / API Key |
| **错误处理** | 只返回 JSON | 统一的错误码 + 日志 + 告警 |
| **部署** | 本机 `node server.js` | 容器化 + 负载均衡 + 域名 + HTTPS |

但核心机制是一样的：**收到 HTTP 请求 → 解析方法和路径 → 处理业务逻辑 → 返回 JSON 响应**。理解了这个循环，你就理解了所有 API 框架的底层原理。

---

## 六、鉴权入门：API 不是谁都能调的

### 6.1 为什么需要鉴权

上一节的 API 没有任何保护——任何知道 URL 的人都能调。真实世界的 API 需要回答一个问题：**你是谁？**

不鉴权的后果：
- 任何人都能删你的数据
- 任何人都能看到别人的隐私
- 攻击者能刷爆你的服务器

### 6.2 最常用的两种方式

| 方式 | 怎么做 | 适用场景 |
|------|--------|---------|
| **API Key** | 请求时带一个长字符串 `X-API-Key: sk_live_xxx` | 服务端到服务端、第三方 API |
| **Bearer Token（JWT）** | 请求时带 `Authorization: Bearer <token>` | SPA + 后端、移动端 + 后端 |

### 6.3 Bearer Token 实战

```js
// 登录 → 服务器返回 token
const loginRes = await fetch('https://api.example.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'coya@example.com', password: '...' })
})
const { token } = await loginRes.json()

// 之后每次请求带上 token
const res = await fetch('https://api.example.com/me', {
    headers: { 'Authorization': `Bearer ${token}` }
})
const user = await res.json()
```

**JWT 长什么样**：

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyM30.abc123def456
   ↑ Header            ↑ Payload         ↑ Signature
  （算法）             （用户信息）        （签名，防篡改）
```

服务端验证时，用密钥算一遍签名，对得上就信任 payload 里的信息——**不需要查数据库**。这就是 JWT 的「无状态」特性。

### 6.4 一个带简单鉴权的 API 示例

在上面的 `server.js` 中加入 token 验证：

```js
// 在 createServer 回调最前面加上
const TOKEN = 'secret-token-123'

// 简单的 Bearer Token 验证
const authHeader = req.headers['authorization']
if (!authHeader || authHeader !== `Bearer ${TOKEN}`) {
    res.writeHead(401)
    res.end(JSON.stringify({ error: '未授权，请提供有效的 token' }))
    return
}
```

现在不带 token 的请求会被拒绝：

```bash
# ❌ 不带 token
curl http://localhost:3001/api/articles
# → {"error":"未授权，请提供有效的 token"}

# ✅ 带 token
curl -H "Authorization: Bearer secret-token-123" \
     http://localhost:3001/api/articles
# → [{"id":1,...}]
```

---

## 七、curl：你的 API 探针

### 7.1 为什么程序员都用 curl

**curl** 是一个在终端里发 HTTP 请求的工具。任何 API 的第一件事都是 `curl` 试一下——因为它：
- 零依赖（macOS/Linux 自带）
- 输出干净，没有浏览器的各种干扰
- 能精确控制每个 header 和参数

### 7.2 常用命令

```bash
# GET（最简单）
curl https://api.github.com/users/coyafky

# 只看响应头
curl -I https://api.github.com

# POST + JSON body
curl -X POST http://localhost:3001/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer secret-token-123" \
  -d '{"title":"新文章","content":"正文"}'

# 看完整调试信息（查问题神器）
curl -v https://api.github.com/users/coyafky
```

### 7.3 curl 和 fetch 的对应关系

| curl | fetch |
|------|-------|
| `curl <url>` | `await fetch(url)` |
| `-H "Key: Value"` | `headers: { 'Key': 'Value' }` |
| `-X POST` | `method: 'POST'` |
| `-d '{...}'` | `body: JSON.stringify({...})` |
| `-I` | `method: 'HEAD'` |

建议：**以后遇到新 API，先用 curl 试试，通了再写成 fetch 代码**。curl 出错的信息通常比 `fetch` 更直接。

---

## 八、实战：把 GitHub API 当成你的练习场

GitHub API 是学 API 的最佳练习场：**无需鉴权就能调大部分公开接口，返回的 JSON 结构清晰，文档齐全**。

### 8.1 几个可以直接玩的接口

```bash
# 查用户信息
curl https://api.github.com/users/coyafky

# 查仓库列表
curl https://api.github.com/users/coyafky/repos

# 查某个仓库
curl https://api.github.com/repos/coyafky/PersonWebsite

# 查仓库的 README（返回 base64 编码的 markdown）
curl https://api.github.com/repos/coyafky/PersonWebsite/readme
```

### 8.2 React 组件实战

```jsx
import { useState, useEffect } from 'react'

function GitHubUser({ username }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        async function load() {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch(`https://api.github.com/users/${username}`)
                if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
                const data = await res.json()
                if (!cancelled) setUser(data)
            } catch (err) {
                if (!cancelled) setError(err)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [username])

    if (loading) return <p>加载中...</p>
    if (error) return <p>出错了: {error.message}</p>
    if (!user) return null

    return (
        <div>
            <img src={user.avatar_url} width={80} alt={user.login} />
            <h2>{user.name || user.login}</h2>
            <p>{user.bio}</p>
            <p>粉丝: {user.followers} · 仓库: {user.public_repos}</p>
        </div>
    )
}
```

这个组件包含了一个完整的 API 调用模式：**loading → error → data** 三种状态 + `cancelled` 防止组件卸载后 setState。

---

## 九、给新手的 3 个心智模型

1. **API = 约定，不是实现**。你不需要知道 GitHub 后端用什么语言、什么数据库，你只需要知道「发这个请求，会拿到这个格式的响应」。**接口是契约，实现是黑盒**。这是前后端能分离开发、不同服务能互相通信的根本原因。

2. **一切 API 调用都是「请求 + 响应」**。无论 fetch、curl、axios 还是 Postman，本质上都是组装一个 HTTP 请求（方法 + URL + Headers + Body），发出去，然后解析响应（状态码 + Headers + Body）。**工具在变，HTTP 协议不变**。理解了协议，换什么工具都是换皮。

3. **从「调 API」到「写 API」只有 30 行代码的距离**。第五节的 `server.js` 就是证明——一个能处理路由、返回 JSON、处理错误的 API 服务器只用了 30 行。Express、Fastify、Hono 这些框架本质上就是帮你把路由分发、参数解析、错误处理这些重复劳动抽象掉。**理解底层机制后，框架不再是魔法。**

---

## 十、一句话总结

> **API = 两个软件之间的对话规则**。HTTP API 由 **方法 + 路径 + Headers + Body** 组成请求，服务器返回 **状态码 + Headers + Body**。REST 风格用 URL 表达资源、HTTP 方法表达动作。鉴权（Bearer Token / API Key）告诉服务器你是谁。**从 0 到 1 的关键一步：用 Node.js 的 `http` 模块写 30 行代码，你就能搭出一个能跑、能返回 JSON、能被前端 fetch 调通的 API**。理解了请求-响应的底层循环，所有 API 框架（Express / Fastify / Hono）都不再是黑盒。

---

## 这个系列下一篇会写什么

- **zero-to-tech / React Hooks 深入：useState / useEffect / useMemo 到底在干什么**
- **zero-to-tech / TypeScript 是什么：为什么新项目应该用 TypeScript**
- **zero-to-tech / 进程、线程、内存：你的电脑同时在跑多少事**

上一篇：[React 数据驱动 UI：从 setState 到 DOM 更新的完整链路](/blog/react-data-driven-ui)
第一篇：[网络是怎么工作的](/blog/how-network-work)
