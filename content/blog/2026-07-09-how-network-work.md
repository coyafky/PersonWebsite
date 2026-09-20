---
title: "网络是怎么工作的：从浏览器输入网址，到页面出现在你眼前"
date: "2026-07-09"
summary: "打开浏览器、输入网址、回车，页面就出现了——但这背后到底发生了什么？拆开 DNS 解析、TCP 三次握手、TLS 握手、HTTP 请求/响应、浏览器渲染 6 个关键阶段，建立对 Web 网络请求的完整心智模型。"
tags:
  - "zero-to-tech"
  - "HTTP"
status: published
lang: zh
category: "技术/网络基础"
englishSummary: "You type a URL and a page appears. But what actually happens? This piece breaks down the 6 key stages of a web request — DNS resolution, TCP three-way handshake, TLS handshake, HTTP request/response, browser rendering — into a complete mental model for beginners."
---

# 网络是怎么工作的：从浏览器输入网址，到页面出现在你眼前

> 这是 **zero-to-tech** 系列的第一篇。我打算用「从最基础的认知开始，把一件事讲清楚」的方式，写一些程序员/产品/AI 从业者应该知道但可能没系统学过的底层知识。第一篇，从最经典的「输入网址到页面出现」开始。

我第一次认真想这个问题，是工作第 2 年。当时一个老同事问我：「你说说，从你在浏览器输入 `https://example.com` 到页面出现在你眼前，中间发生了什么？」

我当时支支吾吾说了「请求发出去、服务器返回 HTML、浏览器渲染」，觉得这是答案。但其实——这只是答案的轮廓。中间真正发生了什么，至少有 6 个关键阶段，每一步都可能让页面打不开。

这篇文章想把这 6 步彻底拆开。

---

## 一句话总结

> 一个 HTTP 请求的一生：**浏览器 → DNS → TCP → TLS → HTTP → 服务器 → 浏览器渲染**。每一步都有明确的输入、输出、失败模式。

---

## 一、整体流程：从 URL 到页面，6 个关键阶段

```
浏览器输入 URL
    ↓
① DNS 解析（域名 → IP）
    ↓
② TCP 三次握手（建立连接）
    ↓
③ TLS 握手（HTTPS 才有，建立加密通道）
    ↓
④ HTTP 请求（浏览器告诉服务器要什么）
    ↓
⑤ 服务器处理 + HTTP 响应（返回 HTML / JSON / 文件）
    ↓
⑥ 浏览器解析 + 渲染（HTML → DOM、CSS → CSSOM、合成 → 像素）
```

每一步都可能失败：

- DNS 失败 → 浏览器提示「找不到服务器」
- TCP 失败 → 连接超时
- TLS 失败 → 「您的连接不是私密连接」
- HTTP 失败 → 404 / 500 / 网络错误
- 服务器失败 → 502 / 503
- 渲染失败 → 白屏 / 样式错乱

所以「页面没出来」可能是任何一步出的问题。下面把每一步讲清楚。

---

## 二、① DNS 解析：把域名翻译成 IP

**为什么需要这一步**：网络上的计算机只用 IP 地址互相找（`142.250.190.78` 这种），但人记不住一长串数字，所以发明了域名（`google.com`）。DNS（Domain Name System）就是「互联网的电话簿」，负责把域名翻译成 IP。

**怎么查的**（简化版）：

```
浏览器缓存 → 系统缓存 → 路由器缓存 → ISP DNS 服务器 → 根 DNS → 顶级域 DNS → 权威 DNS
```

每一步都可能命中，命中就直接返回。`dig +trace example.com` 命令可以让你看完整查询链路。

**关键点**：

- DNS 默认走 UDP（速度快、无连接），响应超过 512 字节时切换到 TCP
- 现代 DNS 还支持加密（DNS over HTTPS / DNS over TLS），保护隐私
- **CDN 的核心就是 DNS**：通过把域名解析到不同 IP，让用户访问最近的服务器

---

## 三、② TCP 三次握手：建立可靠连接

**为什么需要这一步**：IP 协议本身不可靠（包可能丢失、可能乱序、可能重复），TCP 在 IP 之上提供「可靠的、有序的、双向的」数据流。建立这种连接需要双方确认对方「能收能发」，所以是 3 次握手：

```
客户端 → SYN → 服务器          "我想建立连接"
客户端 ← SYN + ACK ← 服务器    "好，我也准备好了"
客户端 → ACK → 服务器          "收到，连接建立"
```

**为什么是 3 次不是 2 次**：如果只有 2 次，服务器不知道自己的「我能收」是否被客户端收到。3 次能保证双方都确认双向通道通畅。

**关键点**：

- HTTP/1.1 默认每个请求都重新建立 TCP 连接（很慢），所以浏览器会做连接复用（keep-alive）
- HTTP/2 和 HTTP/3 进一步优化：多路复用 + QUIC（基于 UDP）让握手只需 1 次往返

---

## 四、③ TLS 握手：HTTPS 才有的加密通道

**为什么需要这一步**：TCP 是明文传输，中间任何一个路由器都能看到你发的内容（密码、cookie、信用卡号）。TLS（Transport Layer Security）在 TCP 之上建立一个加密通道，让中间人看不到内容、也篡改不了。

**现代 TLS 1.3 的握手**（简化）：

```
客户端 → ClientHello（支持的加密算法 + 随机数）
客户端 ← ServerHello + 证书 + 密钥交换
客户端 → 密钥交换 + Finished
（握手完成，后续都是加密通信）
```

**关键点**：

- 服务器证书由 CA（证书颁发机构）签发，浏览器验证证书链 → 验证域名 → 验证有效期
- TLS 1.3 把握手从 TLS 1.2 的 2-RTT 降到 1-RTT，HTTP/3 + QUIC 进一步降到 0-RTT
- 「您的连接不是私密连接」= 证书验证失败，常见原因：证书过期、域名不匹配、自签名证书

---

## 五、④ HTTP 请求：浏览器告诉服务器要什么

TCP / TLS 通道建立后，浏览器开始发 HTTP 请求。最小请求长这样：

```http
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36
Accept: text/html,application/xhtml+xml
Accept-Language: zh-CN,zh;q=0.9
Cookie: session=abc123
```

**关键点**：

- **方法**：GET / POST / PUT / DELETE / PATCH … 表示意图
- **路径 + 查询参数**：`/index.html?page=2`
- **Host**：因为一台服务器可能托管多个域名，Host 告诉它我要访问哪个
- **Headers**：浏览器信息、接受的内容类型、cookie、认证 token …
- **Body**（可选）：POST/PUT 时才有，表单数据或 JSON

---

## 六、⑤ 服务器处理 + HTTP 响应

服务器（一个跑着 Nginx / Node / Python 的进程）收到请求，做几件事：

1. 路由匹配：`/` → 哪个 handler
2. 鉴权：cookie / token 验证
3. 业务逻辑：查数据库、调下游服务、计算
4. 构造响应：HTML / JSON / 文件
5. 返回 HTTP 响应

响应长这样：

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1256
Cache-Control: max-age=3600
Set-Cookie: id=xyz789; HttpOnly

<!DOCTYPE html>
<html>
...
</html>
```

**关键的状态码**：

| 区间 | 含义 | 常见值 |
|------|------|--------|
| 1xx | 信息 | 100 Continue |
| 2xx | 成功 | 200 OK、201 Created、204 No Content |
| 3xx | 重定向 | 301 Moved Permanently、302 Found、304 Not Modified |
| 4xx | 客户端错误 | 400 Bad Request、401 Unauthorized、404 Not Found |
| 5xx | 服务端错误 | 500 Internal Server Error、502 Bad Gateway、503 Service Unavailable |

---

## 七、⑥ 浏览器渲染：HTML → 像素

服务器返回 HTML 后，浏览器开始渲染。这是一个非常复杂的过程，简化版流程：

```
HTML 字节 → 解析成 DOM 树
CSS 字节 → 解析成 CSSOM 树
DOM + CSSOM → 渲染树（Render Tree）
渲染树 → 布局（Layout）→ 计算每个元素的位置和大小
布局结果 → 绘制（Paint）→ 像素
多个层 → 合成（Composite）→ 显示在屏幕上
```

**关键点**：

- **DOM**：文档对象模型，把 HTML 标签变成 JS 可以操作的树形结构
- **CSSOM**：CSS 对象模型
- **重排（Reflow）**：几何属性变化（width / height / position），开销大
- **重绘（Repaint）**：外观变化（color / background），开销中等
- **合成**：transform / opacity 这种 GPU 加速属性，开销最小

这就是为什么前端性能优化常听到「避免重排、优先 transform 动画」。

---

## 八、把这 6 步串起来

| 阶段 | 协议 | 耗时（首次） | 失败表现 |
|------|------|------------|---------|
| ① DNS | UDP / TCP | 1-100 ms | 找不到服务器 |
| ② TCP | TCP | 1-RTT（约 50ms） | 连接超时 |
| ③ TLS | TLS 1.3 | 1-RTT（约 50ms） | 您的连接不是私密连接 |
| ④ HTTP | HTTP/1.1-3 | < 1ms（本地构造） | 几乎不会失败 |
| ⑤ 服务器 | 应用层 | 10ms-3s | 500 / 502 / 503 |
| ⑥ 渲染 | 浏览器 | 100ms-2s | 白屏 / 样式错乱 |

**首次打开一个陌生网站**：DNS + TCP + TLS + HTTP + 服务器 + 渲染 ≈ 300ms ~ 3s
**再次打开（命中缓存）**：可以压到 100ms 以内

这就是为什么「优化 Web 性能」其实是在优化这条链路的每一段：

- DNS：上 CDN、预解析（`<link rel="dns-prefetch">`）
- TCP / TLS：HTTP/3 + QUIC、连接复用、TLS 1.3
- HTTP：缓存、压缩、HTTP/2 多路复用
- 服务器：异步处理、缓存层（Redis）、数据库优化
- 渲染：减少重排、SSR / SSG、代码分割

---

## 九、给非网络工程师的 3 个心智模型

1. **网络请求是分层的**：应用层（HTTP）→ 传输层（TCP / UDP）→ 网络层（IP）→ 链路层（以太网 / WiFi）。每一层只关心自己的事，出了问题也只对应特定层的诊断工具（`ping` 看 IP、`traceroute` 看路由、`curl -v` 看 HTTP）。

2. **加密是分阶段建立的**：HTTP 是明文、HTTPS 是 HTTP + TLS、TLS 握手完成后才走 HTTP。这意味着 HTTPS 不是另一种协议，而是「在加密通道里跑的 HTTP」。

3. **浏览器不是渲染器，是操作系统**：Chromium 内核的进程数（Browser / Renderer / GPU / Network / Utility…）和线程调度逻辑，跟 Linux 调度类似。理解浏览器行为，对理解很多前端性能问题帮助很大。

---

## 十、一句话总结

> 一个 HTTP 请求的完整链路：**浏览器 → DNS → TCP → TLS → HTTP → 服务器 → 浏览器渲染**。每一步都有明确的协议、明确的耗时区间、明确的失败模式。理解这条链路，「页面打不开」就不再是玄学，而是可以一段一段定位的具体问题。

---

## 这个系列下一篇会写什么

- **zero-to-tech / HTTPS 证书是怎么签出来的**：CA、CSR、证书链
- **zero-to-tech / HTTP/2 和 HTTP/3 到底优化了什么**：多路复用、QUIC、0-RTT
- **zero-to-tech / CDN 是怎么让你「就近访问」的**：DNS 调度、边缘节点、回源
