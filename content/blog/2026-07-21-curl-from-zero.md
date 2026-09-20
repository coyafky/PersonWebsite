---
title: "curl从0-1：Agent最常用的HTTP探针"
date: "2026-07-21"
summary: "AI Agent（Claude Code / Codex / Hermes）在终端里跑得最多的命令之一就是 curl。它不是浏览器，没有「回车就出页面」的便利——但它让 Agent 能精确控制 HTTP 请求的每一个字节，然后一字不漏地读每一个字节的响应。这一篇从 Agent 的视角讲 curl：为什么 Agent 不用 Postman、13 个核心标志怎么用、Agent 高频使用的 8 个实战模式、以及 curl 输出背后的 HTTP 协议细节。读完你能像 Agent 一样高效地探索任何 API。"
tags:
  - "zero-to-tech"
  - "AI Agent"
status: published
lang: zh
category: "技术/计算机基础"
englishSummary: "curl is one of the most frequently run commands by AI Agents (Claude Code / Codex / Hermes). It's not a browser — there's no 'press enter → see page' convenience — but it lets agents precisely control every byte of an HTTP request and read every byte of the response. This piece covers curl from an agent's perspective: why agents choose curl over Postman, 13 core flags and how to use them, 8 high-frequency agent patterns, and the HTTP protocol details hidden in curl's output. After reading, you'll explore any API as efficiently as an agent does."
---

# curl从0-1：Agent最常用的HTTP探针

> 这是 **zero-to-tech** 系列的第十五篇。前面讲了「终端 / Linux 基础」里提过 curl，也讲了「API 从0-1」里把 curl 当探针用。这一篇把 curl 单独拎出来，从 **AI Agent 的视角**讲清楚：为什么 Agent 都爱用 curl、它有哪些核心标志、Agent 的高频使用模式是什么、以及 curl 输出背后藏着哪些 HTTP 协议细节。

如果你看过 Claude Code 的输出——那些 `● curl -s https://api.example.com/...` 的绿色提示——你会发现 Agent 几乎每一步都在用 curl。**curl 就是 Agent 的眼睛和手指**——它用 curl 去「摸」外部世界、去「看」API 返回了什么。

这一篇的目标：**让你能像 Agent 一样用 curl 探索任何 HTTP 服务，并且能读懂 curl 输出里的每一行信息。**

---

## 一句话总结

> **curl = 终端里的 HTTP 请求构造器**。它不是浏览器，没有任何 GUI，只有一句话：「告诉我 URL、方法、headers、body，我把 HTTP 请求发出去，然后把服务器返回的每个字节原封不动地打印给你」。13 个核心标志（`-X` `-H` `-d` `-s` `-v` `-i` `-I` `-o` `-L` `-k` `-w` `-x` `--data-binary`）覆盖 95% 的使用场景。Agent 用 curl 而不是 Postman 的原因就一个：**curl 是纯文本进、纯文本出，Agent 能读、能理解、能据此决定下一步**。

---

## 一、为什么 AI Agent 都用 curl

### 1.1 一句话答案

**因为 curl 是文本进、文本出，没有 GUI、没有 JavaScript 渲染、没有任何「隐藏信息」——Agent 能完全控制输入、完全理解输出。**

### 1.2 curl vs Postman vs 浏览器：Agent 视角的对比

| 维度 | curl | Postman | 浏览器 |
|------|------|---------|--------|
| **输入** | 纯文本命令 | GUI 点击 | GUI 点击 |
| **输出** | 纯文本（HTTP verbatim） | 格式化 JSON + UI 面板 | 渲染后的页面 |
| **Agent 能读吗** | ✅ 完美 | ❌ 需要插件/API | ❌ 输出是 DOM，不是 HTTP |
| **脚本化** | ✅ Shell 脚本 | ⚠️ 有 CLI 但繁琐 | ❌ 需要 Puppeteer/Playwright |
| **可组合** | ✅ 管道 `\|` + 重定向 | ❌ | ❌ |
| **精确控制** | ✅ 每个 byte 都能控制 | ⚠️ GUI 限制 | ❌ 浏览器自动加了大量 header |
| **速度** | ⚡ 几十ms | 🐢 启动就要几秒 | 🐢 渲染还要时间 |

### 1.3 Agent 的工作流里 curl 在哪

```
Agent 思考: "我需要知道这个 API 返回什么结构"
    │
    ▼
Agent 跑: curl -s https://api.example.com/users/1
    │
    ▼
Agent 读: {"id":1,"name":"Coya","email":"..."}
    │
    ▼
Agent 思考: "好的，返回的是 {id, name, email} 结构，我可以写 fetch 代码了"
    │
    ▼
Agent 写: const res = await fetch('https://api.example.com/users/1')
```

**每一步 curl 的输出都是 Agent 的「眼睛」**——它靠读 curl 的输出来理解 API 的返回格式，然后据此写代码。

---

## 二、curl 的本质：一个 HTTP 请求构造器

### 2.1 最简命令

```bash
curl https://api.github.com/users/coyafky
```

**curl 做的事**：
1. 解析 URL（`https://api.github.com/users/coyafky`）
2. 发起 DNS 查询（`api.github.com` → IP 地址）
3. 建立 TCP 连接 + TLS 握手（因为 `https`）
4. 构造 HTTP 请求：`GET /users/coyafky HTTP/1.1`
5. 把请求发出去
6. 把服务器返回的 response body **打印到终端**
7. 关闭连接

### 2.2 curl 不是浏览器

**浏览器访问同一个 URL 时**：
1. 同上（步骤 1-4）
2. 服务器返回 HTML
3. 解析 HTML → 发现 `<link>` 标签 → 发更多请求拿 CSS
4. 解析 CSS → 发现 `@import` → 又发请求
5. 解析 JS → 执行 `fetch('/api/data')` → 再发请求
6. 渲染页面

**curl 在第 6 步就停了**。它只关心「发了什么 HTTP 请求、收到了什么 HTTP 响应」。至于响应里的 HTML 长什么样、CSS 怎么渲染、JS 里做了什么，curl 一概不管。

**这就是为什么 Agent 用 curl**：Agent 想要的是「HTTP 层面的真相」，不是「浏览器渲染后的假象」。

---

## 三、13 个核心标志（按使用频率排列）

### 3.1 必知标志（每天用）

| 标志 | 完整写法 | 作用 | 例 |
|------|---------|------|-----|
| `-X` | `--request` | 指定 HTTP 方法 | `-X POST` |
| `-H` | `--header` | 添加请求头（可用多次） | `-H "Content-Type: application/json"` |
| `-d` | `--data` | 请求 body（自动用 POST） | `-d '{"name":"Coya"}'` |
| `-s` | `--silent` | 静默模式（不显示进度条） | `-s` |
| `-v` | `--verbose` | 详细模式（看请求+响应头） | `-v` |
| `-i` | `--include` | 响应里包含 HTTP 头 | `-i` |
| `-I` | `--head` | **只**发 HEAD 请求，只看响应头 | `-I` |

### 3.2 常用标志（遇到场景就想起来）

| 标志 | 完整写法 | 作用 | 例 |
|------|---------|------|-----|
| `-o` | `--output` | 保存响应到文件 | `-o image.png` |
| `-L` | `--location` | 跟随重定向 | `-L` |
| `-k` | `--insecure` | 跳过 TLS 证书验证 | `-k` |
| `-w` | `--write-out` | 输出格式化信息（耗时、状态码） | `-w "%{http_code}"` |
| `-x` | `--proxy` | 通过代理发请求 | `-x http://127.0.0.1:8080` |

### 3.3 特殊标志（知道了省时间）

| 标志 | 完整写法 | 作用 |
|------|---------|------|
| `--data-binary` | — | 发原始 body（不处理换行、不 strip） |
| `--data-raw` | — | 同 `-d` 但不对 `@` 做文件展开 |

---

## 四、Agent 高频使用的 8 个实战模式

### 模式 1：快速探查 API 返回结构（Agent 的第一步）

```bash
# 最简探查 — 看 API 返回什么 JSON 结构
curl -s https://api.github.com/users/coyafky
```

`-s` 去掉进度条，输出就是纯 JSON。Agent 拿到这个输出后就能判断：返回了哪些字段、是什么类型、嵌套多深。然后据此写代码。

### 模式 2：带鉴权的 API 调用

```bash
# Bearer Token（最常用）
curl -s https://api.github.com/user \
  -H "Authorization: Bearer ghp_xxxxxxxxxxxx" \
  -H "Accept: application/vnd.github+json"

# API Key（放在 header 里）
curl -s https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-xxxxxxxxxxxx"
```

**Agent 的典型使用场景**：拿到用户的 API key → 先 curl 一下确认 key 有效 → 再写代码。

### 模式 3：POST JSON 数据

```bash
curl -s -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name":"Coya","role":"engineer"}'
```

**三个要素缺一不可**：
- `-X POST` — 告诉服务器这是创建操作
- `-H "Content-Type: application/json"` — 告诉服务器 body 是 JSON（不是 form）
- `-d '{...}'` — 实际数据

**漏了 `Content-Type: application/json`**，很多框架默认会当 `application/x-www-form-urlencoded` 解析——导致后端拿不到数据。

### 模式 4：调试模式 — 看请求和响应的完整报文

```bash
curl -v https://api.github.com/users/coyafky
```

**输出解读**：

```
*   Trying 140.82.121.5:443...          ← TCP 连接
*   Connected to api.github.com          ← 连接成功
*   SSL connection using TLSv1.3         ← TLS 握手完成
>   GET /users/coyafky HTTP/1.1          ← 发出的请求行
>   Host: api.github.com                 ← 发出的请求头
>   User-Agent: curl/8.4.0
>   Accept: */*
>
<   HTTP/1.1 200 OK                      ← 收到的响应行
<   Content-Type: application/json       ← 收到的响应头
<   ...
<
  {"login":"coyafky",...}                ← 响应 body
```

**`>` 行 = 你发出的**，**`<` 行 = 服务器返回的**。`-v` 是调试 API 的最强工具——你能看到完整的请求和响应报文，一个字节都不差。

### 模式 5：只看响应头（不下载 body）

```bash
# HEAD 请求 — 不下载 body
curl -I https://example.com

# 输出:
# HTTP/1.1 200 OK
# Content-Type: text/html
# Content-Length: 1256
# ...
```

**Agent 用 `-I` 的场景**：检查一个 URL 是否可访问、看文件大小（`Content-Length`）、确认服务器类型（`Server` header）。

### 模式 6：下载文件

```bash
# 下载图片
curl -s -o dog.jpg https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg

# -o 指定文件名
# -O 用 URL 里的文件名（curl -O https://example.com/file.zip）
```

Agent 用这个来下载要处理的文件——比如下载一个示例 CSV 看看格式，然后据此写解析代码。

### 模式 7：跟随重定向

```bash
# 不加 -L：看到 301/302 就停了
curl -I http://github.com
# HTTP/1.1 301 Moved Permanently
# Location: https://github.com

# 加 -L：自动跟随到最终目的地
curl -s -L http://github.com -o /dev/null -w "%{url_effective}\n"
# https://github.com/
```

**Agent 用 `-L` 的场景**：确保能拿到最终页面内容，而不是重定向中间状态。

### 模式 8：提取特定信息（`-w` 的威力）

```bash
# 只输出 HTTP 状态码
curl -s -o /dev/null -w "%{http_code}" https://api.github.com/users/coyafky
# 200

# 看 API 响应耗时
curl -s -o /dev/null -w "time_total: %{time_total}s\n" https://api.github.com
# time_total: 0.387s

# 看 DNS 解析 + TCP 连接 + TLS 握手各花了多少
curl -s -o /dev/null -w "\
dns: %{time_namelookup}s
tcp: %{time_connect}s
tls: %{time_appconnect}s
total: %{time_total}s
" https://api.github.com/users/coyafky
# dns: 0.012s
# tcp: 0.085s
# tls: 0.156s
# total: 0.387s
```

**Agent 用 `-w` 的场景**：检查 API 可用性、监控延迟、排查性能问题。`-w` 可能是 curl 里最被低估的标志。

---

## 五、读懂 curl 输出：Agent 视角的关键信息提取

### 5.1 Agent 从 `-v` 输出中提取的信息

当 Agent 跑 `curl -v https://api.example.com/users/1`，它在看这些：

```
*   Trying 10.0.0.1:443...              ← 看 DNS 解析到的 IP 对不对
*   SSL connection using TLSv1.3         ← 看加密协议版本
>   GET /users/1 HTTP/1.1                ← 确认请求行正确
>   Authorization: Bearer ***            ← 确认鉴权 header 发出去了
<   HTTP/1.1 404 Not Found               ← ★ 关键：状态码
<   Content-Type: application/json       ← ★ 关键：响应格式
<   X-RateLimit-Remaining: 4999          ← ★ 关键：还剩多少次调用
<
  {"error":"user not found"}             ← ★ 关键：错误信息
```

Agent 会同时读取状态码、Content-Type、限流 header、和 body 里的错误信息——然后综合判断出了什么问题。

### 5.2 Agent 是如何「读」API 的

```
Agent 的思考链:
1. HTTP 404     → 资源不存在
2. Content-Type → 是 JSON，可以直接 JSON.parse
3. body         → {"error":"user not found"} → 确认是"用户不存在"，不是"接口不存在"
4. 下一步       → 检查用户 ID 是否正确，或者换个存在的用户 ID 试试
```

**这就是 Agent 用 curl 而不是 Postman 的根本原因**——curl 的输出是一个完整的、可逐行解析的文本块，Agent 可以把状态码、header、body 一起「读」进去，然后推理。

---

## 六、curl vs fetch：何时用哪个

| 场景 | curl | fetch |
|------|------|-------|
| **探索新 API** | ✅ 首选 — 即时反馈 | ❌ 要写代码 |
| **脚本化/自动化** | ✅ Shell 脚本 | ⚠️ 要 Node 环境 |
| **前端应用代码** | ❌ 浏览器里跑不了 | ✅ 原生支持 |
| **需要 JS 渲染** | ❌ 不跑 JS | ⚠️ fetch 本身也不跑 JS |
| **CI/CD 流水线** | ✅ 零依赖 | ❌ 需要 Node |
| **查看完整 HTTP 报文** | ✅ `-v` 一条命令 | ❌ DevTools Network 面板 |

**规则**：**先 curl 探路，确认能通 → 再写 fetch 代码。** 不要上来就写前端代码调 API——90% 的问题（鉴权不对、CORS 不通、返回格式不对）用 curl 一步就能发现。

### 常用 curl → fetch 的对应关系

| curl | fetch |
|------|-------|
| `curl <url>` | `await fetch(url)` |
| `-X POST` | `method: 'POST'` |
| `-H "Key: Value"` | `headers: { 'Key': 'Value' }` |
| `-d '{"k":"v"}'` | `body: JSON.stringify({k:'v'})` |
| `-I` | `method: 'HEAD'` |
| `-L` | `redirect: 'follow'`（fetch 默认跟随） |
| `-k` | 无直接对应（fetch 强制验证证书） |

---

## 七、curl 和管道的组合：Agent 的瑞士军刀

### 7.1 格式化 JSON

```bash
# curl 返回的 JSON 很难读 → 管道给 jq 格式化
curl -s https://api.github.com/users/coyafky | python3 -m json.tool
# 或（如果没有 python）:
# curl -s https://api.github.com/users/coyafky | jq .

# 提取特定字段
curl -s https://api.github.com/users/coyafky | python3 -c "import sys,json; print(json.load(sys.stdin)['name'])"
```

### 7.2 只关心 HTTP 状态码

```bash
# 静默模式 + -w 格式化输出 = 只输出状态码
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://example.com)
echo "状态码: $HTTP_CODE"

# 在脚本里判断
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ 服务正常"
else
    echo "✗ 服务异常: $HTTP_CODE"
fi
```

### 7.3 Agent 的真实使用案例

Agent 在写代码前验证 API 的典型流程：

```bash
# 1. 验证 API 是否可达 + 看返回结构
curl -s https://dog.ceo/api/breeds/image/random/1 | python3 -m json.tool

# 2. 看完整 HTTP 报文（确认 CORS、Content-Type 等头）
curl -s -I https://dog.ceo/api/breeds/image/random/1

# 3. 测试异常路径（看 404 的返回格式）
curl -s https://dog.ceo/api/breed/不存在的狗/images/random/1 | python3 -m json.tool

# 4. 确认延时
curl -s -o /dev/null -w "总耗时: %{time_total}s" https://dog.ceo/api/breeds/image/random/50

# 之后才写代码:
# const res = await fetch('https://dog.ceo/api/breeds/image/random/12')
```

**每多做一个 curl 验证，少写一次错误处理代码**。

---

## 八、常见错误信息速查

| 错误信息 | 原因 | 解决 |
|---------|------|------|
| `curl: (6) Could not resolve host` | DNS 解析失败 — URL 写错了或没联网 | 检查域名拼写、`ping` 一下试试 |
| `curl: (7) Failed to connect` | TCP 连接失败 — 端口没开或 IP 不对 | 检查服务器是否在运行、防火墙是否放行 |
| `curl: (28) Operation timed out` | 请求超时 — 服务器无响应 | 加 `--connect-timeout 5` 设短超时 |
| `curl: (35) SSL connection error` | TLS 证书验证失败 | 用 `-k` 跳过验证（仅开发环境！） |
| `curl: (52) Empty reply from server` | 服务器收到请求但没回任何东西 | 服务器进程可能崩了 |
| `curl: (60) SSL certificate problem` | 自签名证书或过期证书 | `-k` 跳过，或更新证书 |

**Agent 看到这些错误后的行为**：根据错误码判断问题类型 → 如果是连接问题，检查服务器状态；如果是 SSL 问题，加 `-k` 再试；如果是超时，换更小的请求量。

---

## 九、给新手的 3 个心智模型

1. **curl = 「终端里的微型浏览器」——但不渲染**。浏览器 = curl + HTML 解析器 + CSS 引擎 + JS 引擎 + GPU 渲染。你以为「打开网页」是一步，其实浏览器做了五步。curl 只做第一步（发请求 + 收响应），所以 Agent 用它——Agent 只需要「HTTP 层面的真相」，不需要渲染。

2. **curl 的输出 = 服务器给你的「原始答案」**。浏览器可能被广告拦截器、缓存、JS 错误、CORS 策略影响，你看到的「页面」可能远离了服务器给的原始内容。**curl 给你的是未经任何处理的原始 HTTP 响应**——调试时这才是你想要的。

3. **先 curl，再代码**。调试 API 时最怕的是什么？你写了 30 行 `fetch` 代码，跑起来报错，然后你不知道是 API 本身有问题，还是你的代码有问题。**先 curl 一下，如果 curl 能通，问题在代码；如果 curl 都不通，问题在 API。** 这一步能省掉一半的盲目调试时间。

---

## 十、一句话总结

> **curl = 终端里的 HTTP 请求构造器，也是 AI Agent 最核心的「感知器官」**。它用纯文本构造请求、用纯文本接收响应——Agent 能完全控制输入、完全理解输出。13 个核心标志覆盖 95% 场景：`-s` 静默、`-X` 指定方法、`-H` 加 Header、`-d` 加 Body、`-v` 看完整报文、`-i` 看响应头、`-I` 只看头、`-o` 下载文件、`-L` 跟随重定向、`-k` 跳过证书、`-w` 格式化输出。**Agent 的工作流永远是「先 curl 探路 → 确认返回结构 → 再写代码」**——有了 curl，你不需要猜 API 的行为，你直接问它。

---

## 这个系列下一篇会写什么

- **zero-to-tech / TypeScript 是什么：为什么新项目应该用 TypeScript**
- **zero-to-tech / Docker 是什么：为什么「在我电脑上能跑」还不够**
- **zero-to-tech / 进程、线程、内存：你的电脑同时在跑多少事**

上一篇：[Nginx从0-1：从看懂配置到自己写配置](/blog/nginx-from-zero)
第一篇：[网络是怎么工作的](/blog/how-network-work)
