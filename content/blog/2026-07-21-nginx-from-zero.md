---
title: "Nginx从0-1：从看懂配置到自己写配置"
date: "2026-07-21"
summary: "Nginx 是全球 top 百万网站里超过 30% 在用的 Web 服务器和反向代理。但它的配置文件对新手来说像天书——`server`、`location`、`proxy_pass`、`upstream` 全是新概念。这一篇用一个「收发室」类比帮你建立心智模型，然后从 3 个最简配置开始（静态文件 / 反向代理 / SPA 兜底），深入到 location 匹配规则，最后覆盖负载均衡、限流、Gzip、日志调试等实战模式。读完你能自己写一个完整的 Nginx 配置。"
tags:
  - zero-to-tech
  - Nginx
  - 反向代理
  - Web服务器
  - DevOps
  - 部署
status: published
lang: zh
category: "技术/计算机基础"
englishSummary: "Nginx powers over 30% of the world's top million websites as a web server and reverse proxy. But its config files look cryptic to newcomers. This piece builds a mental model using a 'mailroom' analogy, then progresses through 3 minimal configs (static files / reverse proxy / SPA fallback), dives deep into location matching rules, and covers production patterns like load balancing, rate limiting, Gzip, and log debugging. After reading, you'll be able to write a complete Nginx config yourself."
---

# Nginx从0-1：从看懂配置到自己写配置

> 这是 **zero-to-tech** 系列的第十四篇。上一篇「部署踩坑」里提到了 Nginx，但只是作为部署链路的一环。这一篇把 Nginx 单独拎出来，从零开始讲清楚：它是什么、配置文件的结构怎么理解、3 个最简配置怎么写、以及 6 个生产环境常用模式。

Nginx 的配置文件对新手来说像天书。我第一次打开 `/etc/nginx/nginx.conf` 时，满屏的 `server` `location` `proxy_pass` `upstream`，完全不知道这些块之间是什么关系。

后来我自己搭了几次服务器，才意识到**Nginx 的配置语言本质上只有一件事：定义「什么样的请求 → 走什么规则 → 得到什么结果」**。搞懂了这件事，剩下的都是查文档。

这一篇的目标：**让你能从零写出一个生产可用的 Nginx 配置，并且能解释每一行在干什么。**

---

## 一句话总结

> **Nginx = 高性能的 HTTP 请求路由器**。它不写业务逻辑，只做一件事：**根据请求的域名、路径、Header，决定把这个请求转发给谁、或者直接返回什么文件**。配置文件里的 `server` 定义「哪个域名」、`location` 定义「哪个路径」、`proxy_pass` / `root` 定义「交给谁处理」。理解了这三层匹配关系，Nginx 配置的核心你就掌握了。

---

## 一、Nginx 到底是什么：一个「收发室」类比

### 1.1 先忘掉技术术语

把一栋写字楼想象成你的服务器：

```
写字楼大堂（服务器）
    │
    ├── 收发室（Nginx — 80/443 端口）
    │     │
    │     ├── 信件分类（server_name — 看收件人是谁）
    │     ├── 部门匹配（location — 看信件类型）
    │     └── 转发规则（proxy_pass / root — 送哪个办公室 / 直接处理）
    │
    ├── 财务部（Node 应用 — 127.0.0.1:3000）
    ├── 人事部（Python 应用 — 127.0.0.1:5000）
    └── 档案室（静态文件 — /var/www/html）
```

**Nginx 就是这个收发室**：
- 所有外部来的请求先进收发室（80/443 端口）
- 收发室看信封（`server_name`）判断是给哪个公司的
- 再看信件类型（`location`）判断该送哪个部门
- 普通文件直接去档案室拿（`root`），需要处理的转给具体部门（`proxy_pass`）

**应用进程（Node / Python）不需要自己面对互联网**——它们只需要在本地端口上等着（`127.0.0.1:3000`），收发室会替它们处理所有「互联网协议层」的脏活。

### 1.2 不只是一个类比

这个类比映射到真实的 Nginx 功能：

| 类比 | Nginx 配置 | 真实作用 |
|------|-----------|---------|
| 收发室 | `listen 80;` | 接收外部 HTTP 请求 |
| 看信封 | `server_name example.com;` | 根据域名分发（一台服务器可以 host 多个网站） |
| 信件类型 | `location /api/ { }` | 根据 URL 路径匹配规则 |
| 送财务部 | `proxy_pass http://127.0.0.1:3000;` | 反向代理到 Node 应用 |
| 档案室取文件 | `root /var/www/html;` | 直接从磁盘 serve 静态文件 |
| 安检 | `limit_req` | 限流 / 安全策略 |

### 1.3 Nginx 不做什么

理解 Nginx 的边界同样重要：

| Nginx 做 | Nginx 不做 |
|-----------|------------|
| 路由 HTTP 请求 | 执行业务逻辑 |
| Serve 静态文件 | 查数据库 |
| 反向代理到应用 | 生成动态 HTML（那是 PHP/Node/Python 的事） |
| 终止 HTTPS（TLS） | 用户认证（可以做基础 auth，但复杂的不行） |
| 负载均衡 | 会话管理 |
| 限流 / 访问控制 | 支付处理 |

**Nginx 是基础设施层的工具，不是应用层的工具。** 它像水管和电线——把请求准确、高效地送到正确的地方，但不管送到之后怎么处理。

---

## 二、安装和第一次启动：5 分钟跑起来

### 2.1 安装

```bash
# macOS
brew install nginx

# Ubuntu/Debian
sudo apt update && sudo apt install nginx -y

# 验证
nginx -v
# nginx version: nginx/1.24.0
```

### 2.2 基础命令

```bash
# 启动（macOS 用 brew services start nginx）
sudo systemctl start nginx

# 停止
sudo systemctl stop nginx
# 或直接 sudo nginx -s stop

# 重载配置（不中断服务 — 这个命令你会经常用）
sudo nginx -s reload
# 或 sudo systemctl reload nginx

# 测试配置语法（改完配置先跑这个，确认没问题再 reload）
sudo nginx -t
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# 开机自启
sudo systemctl enable nginx
```

### 2.3 启动后验证

```bash
# 浏览器打开 http://localhost:8080（macOS brew 默认 8080）
# 或者 curl
curl -I http://localhost:8080

# 应该看到:
# HTTP/1.1 200 OK
# Server: nginx/1.24.0
```

看到 Nginx 默认欢迎页，说明安装成功。现在你可以开始改配置了。

---

## 三、配置文件结构：一张图看懂

### 3.1 整体层级

```
/etc/nginx/nginx.conf          ← 主配置（一般不直接改）
    │
    └── include conf.d/*.conf; ← 从这里引入你的配置文件（推荐）
         │
         └── /etc/nginx/conf.d/my-site.conf  ← 你的配置写在这里
```

**一个配置文件的最小完整结构**：

```nginx
# 1. 全局层 — 影响 Nginx 整体行为
worker_processes  auto;         # 工作进程数

events {
    worker_connections  1024;   # 每个进程最大连接数
}

# 2. HTTP 层 — 所有 HTTP 相关配置的容器
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # 3. Server 层 — 一个网站 / 域名
    server {
        listen       80;
        server_name  example.com;

        # 4. Location 层 — 某个 URL 路径的规则
        location / {
            root   /var/www/html;
            index  index.html;
        }

        location /api/ {
            proxy_pass http://127.0.0.1:3000;
        }
    }
}
```

### 3.2 四层结构速查

| 层级 | 关键字 | 作用 | 可以有几个 |
|------|--------|------|-----------|
| 全局 | `worker_processes` `error_log` | 影响 Nginx 进程本身 | 1 个（整个配置唯一） |
| HTTP | `http { }` | 所有 HTTP 配置的容器 | 1 个 |
| Server | `server { }` | 定义一个虚拟主机（一个域名/网站） | 多个（一台服务器 host 多个网站） |
| Location | `location { }` | 定义某个 URL 路径的处理规则 | 多个（每个 server 里可以有几十个） |

**理解优先级的关键**：请求进来后，Nginx 先匹配 `server_name`（域名），再匹配 `location`（路径），然后执行该 location 里的指令。**方向永远是从粗到细。**

---

## 四、最简配置 1：纯静态文件服务器

这是 Nginx 最简单的用法——把文件夹里的文件直接 serve 出去。

### 4.1 配置

```nginx
# /etc/nginx/conf.d/static-site.conf
server {
    listen       80;
    server_name  localhost;

    # 指定静态文件根目录
    root   /var/www/my-site;
    index  index.html;

    # 所有请求都去找文件
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 4.2 每行在干什么

```
┌─────────────────────────────────────────────────────────┐
│ listen 80;           ← 监听 80 端口（HTTP 标准端口）       │
│ server_name localhost; ← 匹配域名为 localhost 的请求       │
│ root /var/www/my-site;← 文件系统的根目录                   │
│ index index.html;    ← 访问 / 时默认返回 index.html         │
│ try_files $uri =404; ← 按顺序找文件，找不到就 404           │
│   $uri  → 请求路径对应的文件（如 /about → /about.html）     │
│   $uri/ → 请求路径作为目录（如 /blog/ → /blog/index.html）   │
│   =404  → 都找不到返回 404                                 │
└─────────────────────────────────────────────────────────┘
```

### 4.3 跑起来

```bash
# 创建测试文件
sudo mkdir -p /var/www/my-site
echo '<h1>Hello Nginx</h1>' | sudo tee /var/www/my-site/index.html

# 测试配置
sudo nginx -t

# 重载
sudo nginx -s reload

# 验证
curl http://localhost
# <h1>Hello Nginx</h1>
```

---

## 五、最简配置 2：反向代理到应用

这是 Nginx 最常见的用法——把请求转发给背后的 Node/Python/Go 应用。

### 5.1 场景

```
浏览器                    Nginx                    你的应用
  │                        │                         │
  │ GET /api/users ─────→  │ 收到请求                 │
  │                        │ 匹配到 location /api/    │
  │                        │ proxy_pass 转发的 ──────→ │ 127.0.0.1:3000/api/users
  │                        │                         │ 处理业务
  │                        │ ←────── 返回 JSON ────── │
  │ ←──── 200 + JSON ───── │                         │
```

### 5.2 配置

```nginx
server {
    listen       80;
    server_name  api.example.com;

    # 静态资源让 Nginx 直接处理（比 Node 快 10 倍）
    location /static/ {
        root   /var/www/app/public;
        expires 30d;
    }

    # 其他请求转发给 Node 应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.3 `proxy_set_header` 这四行为什么不能省

**问题：应用怎么知道真正的客户端 IP？**

Nginx 转发请求时，应用看到的请求来自 `127.0.0.1`（Nginx 自己），不是真实用户 IP。你在应用的日志里会看到所有请求都是 `127.0.0.1`——调试时完全无法定位。

`proxy_set_header` 这四行就是解决这个问题的：

```nginx
proxy_set_header Host $host;
# → 把原始请求的 Host header 传给应用（否则应用收到的是 127.0.0.1:3000）

proxy_set_header X-Real-IP $remote_addr;
# → 把真实客户端 IP 放在 X-Real-IP header 里

proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
# → 记录完整的代理链（如果前面还有 CDN / 负载均衡）

proxy_set_header X-Forwarded-Proto $scheme;
# → 告诉应用原始请求用的是 HTTP 还是 HTTPS
```

**结论：每次写 `proxy_pass`，顺手把这四行加上。少任何一行，未来都可能成为排查问题的盲区。**

### 5.4 常见 502/504 排查

| 错误 | 最可能的原因 | 第一件事 |
|------|-------------|---------|
| **502 Bad Gateway** | `proxy_pass` 的应用没启动或端口错了 | `curl http://127.0.0.1:3000` 看应用活着没 |
| **504 Gateway Timeout** | 应用处理超时（默认 60 秒） | 调大 `proxy_read_timeout` 或优化应用性能 |
| **连接 refused** | 应用没监听在指定端口 | `lsof -i :3000` 看端口被谁占了 |

---

## 六、最简配置 3：SPA 路由兜底

### 6.1 SPA 的特殊需求

SPA（React / Vue / Next.js 静态导出）只有**一个 HTML 入口文件**（`index.html`），路由由前端 JS 控制。用户访问 `/blog/123` 时，服务器上没有 `blog/123.html` 这个文件——但不能返回 404，因为前端路由会处理。

### 6.2 配置

```nginx
server {
    listen       80;
    server_name  spa.example.com;

    root   /var/www/spa/dist;
    index  index.html;

    location / {
        # ★ 关键：找不到文件就回退到 index.html
        try_files $uri $uri/ /index.html;
    }

    # 静态资源（JS/CSS/图片）— 加长缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.3 `try_files` 的执行顺序

```
用户请求 GET /blog/123
  │
  ├── try $uri → /blog/123 这个文件存在吗？
  │    └── 如果存在 → 直接返回该文件
  │    └── 如果不存在 ↓
  │
  ├── try $uri/ → /blog/123/ 这个目录存在吗？
  │    └── 如果存在 + 目录下有 index.html → 返回 index.html
  │    └── 如果不存在 ↓
  │
  └── try /index.html → 返回 index.html（让前端路由处理 /blog/123）
```

**没有这行配置时**：用户直接访问 `/blog/123` 或刷新页面 → Nginx 找不到文件 → 404。这是 SPA 部署的经典翻车场景。

---

## 七、location 匹配规则：一个被严重低估的知识点

### 7.1 四种匹配方式

`location` 是 Nginx 配置里使用频率最高的指令，但它的匹配规则很多人只是一知半解。

| 语法 | 类型 | 优先级 | 例 |
|------|------|--------|-----|
| `= /path` | 精确匹配 | **最高** | `= /api/health` |
| `^~ /path/` | 前缀匹配（不检查正则） | 高 | `^~ /static/` |
| `~ pattern` | 区分大小写的正则 | 中 | `~ \.php$` |
| `~* pattern` | 不区分大小写的正则 | 中 | `~* \.(jpg|png)$` |
| `/path/` | 普通前缀匹配 | 最低 | `/api/` |

### 7.2 匹配过程

Nginx 收到一个请求后，按这个顺序找匹配的 location：

```
1. 先找「精确匹配」 = /path
   → 找到了？直接用它。结束。

2. 再找所有「前缀匹配」（包括 ^~ 和普通前缀）
   → 记下最长的那个前缀匹配

3. 如果最长前缀是 ^~ 类型 → 用它。结束。

4. 否则，按配置文件里的顺序找「正则匹配」
   → 第一个匹配的正则 → 用它。结束。

5. 没有正则匹配 → 用第 2 步里记下的最长前缀匹配。
```

### 7.3 一个帮你彻底理解的例子

```nginx
location = /api/health {
    return 200 "精确匹配: health check";
}

location ^~ /static/ {
    return 200 "前缀优先: static 文件";
}

location ~ \.php$ {
    return 200 "正则: PHP 文件";
}

location /api/ {
    return 200 "普通前缀: API 请求";
}

location / {
    return 200 "兜底: 其他所有请求";
}
```

| 请求路径 | 命中哪个 location | 原因 |
|---------|------------------|------|
| `/api/health` | `= /api/health` | 精确匹配优先级最高 |
| `/static/logo.png` | `^~ /static/` | 前缀优先，不检查正则 |
| `/api/users` | `/api/` | 最长的普通前缀匹配 |
| `/index.php` | `~ \.php$` | 正则匹配到 `.php` 结尾 |
| `/api/test.php` | `~ \.php$` | **注意！** 正则优先级高于普通前缀 `/api/` |
| `/about` | `/` | 兜底 |

### 7.4 最关键的一条规则

**正则匹配 `~` 会覆盖普通前缀匹配 `/path/`，但不会覆盖 `^~` 和 `=`。**

这就是为什么 `/api/test.php` 命中了 `~ \.php$` 而不是 `/api/`——正则的优先级高于普通前缀。如果你想保护 `/api/` 不被正则抢走，用 `^~ /api/`。

---

## 八、6 个生产环境常用模式

### 模式 1：负载均衡

```nginx
# 定义一组后端服务器
upstream app_servers {
    # 默认轮询（round-robin）
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;

    # 可选：加权（weight 越大分配越多）
    # server 127.0.0.1:3000 weight=3;
    # server 127.0.0.1:3001 weight=1;
}

server {
    location / {
        proxy_pass http://app_servers;  # ← 用 upstream 名代替具体地址
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 模式 2：限流 — 防刷

```nginx
# 在 http 块里定义限流规则
http {
    # 每个 IP 每秒最多 10 个请求（超出返回 503）
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    server {
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            # burst=20  →  允许瞬间多 20 个请求排队
            # nodelay    →  不延迟，超出 burst 直接 503
            proxy_pass http://127.0.0.1:3000;
        }
    }
}
```

### 模式 3：Gzip 压缩 — 减少传输体积

```nginx
http {
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;       # 小于 1KB 不压缩（压缩反而变大）
    gzip_comp_level 5;          # 压缩级别 1-9（5 是性价比较好的点）
    gzip_vary on;               # 告诉 CDN「这个资源有压缩版」
}
```

### 模式 4：CORS — 允许跨域访问

```nginx
server {
    location /api/ {
        # 允许跨域的域名
        add_header Access-Control-Allow-Origin "https://example.com";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";

        # ★ OPTIONS 预检请求直接返回 204，不转发给应用
        if ($request_method = OPTIONS) {
            return 204;
        }

        proxy_pass http://127.0.0.1:3000;
    }
}
```

**注意**：如果应用代码里也设置了 CORS header，Nginx 里再加会导致重复 header。二选一：要么在 Nginx 层统一处理 CORS，要么在应用层处理。

### 模式 5：WebSocket 代理

```nginx
server {
    location /ws/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;                    # ← WebSocket 需要 HTTP/1.1
        proxy_set_header Upgrade $http_upgrade;     # ← 协议升级
        proxy_set_header Connection "upgrade";      # ← 保持连接
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;                  # ← WebSocket 长连接不超时
    }
}
```

**WebSocket 的反代和普通 HTTP 反代有三处不同**：HTTP 版本必须是 1.1、必须传 `Upgrade` 和 `Connection` header、超时时间要设得足够长。

### 模式 6：域名重定向（HTTP → HTTPS / 旧域名 → 新域名）

```nginx
# HTTP 永久重定向到 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}

# 旧域名重定向到新域名
server {
    listen 80;
    server_name old-domain.com;
    return 301 https://new-domain.com$request_uri;
}
```

`301` 是「永久重定向」——浏览器和搜索引擎会记住这个映射。临时跳转用 `302`。

---

## 九、调试三板斧：出问题先做这三件事

### 第一板斧：`nginx -t` — 配置语法检查

```bash
sudo nginx -t
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**每次改完配置，先跑 `nginx -t`，通过再 `reload`。** 跳过这一步直接 reload 的风险：如果配置有语法错误，Nginx 可能会拒绝加载，服务中断。

### 第二板斧：看 error.log — 运行时错误

```bash
# 实时跟踪错误日志
sudo tail -f /var/log/nginx/error.log

# 查看最近 50 条
sudo tail -n 50 /var/log/nginx/error.log

# 常见错误解读
# "connect() failed (111: Connection refused)" → proxy_pass 的应用没启动
# "Permission denied" → 文件权限不对
# "primary script unknown" → root 路径不对
```

### 第三板斧：看 access.log — 请求是否到达

```bash
# 实时看谁在访问
sudo tail -f /var/log/nginx/access.log

# 输出格式（默认）:
# 1.2.3.4 - - [21/Jul/2026:10:30:00 +0800] "GET /api/users HTTP/1.1" 200 1234
#    ↑ IP        ↑ 时间                    ↑ 请求行               ↑ 状态码 ↑ 响应大小

# 加自定义日志格式（调试时很有用）
log_format debug '$remote_addr [$time_local] "$request" '
                 '$status $body_bytes_sent '
                 '"$http_referer" "$http_user_agent" '
                 'upstream=$upstream_addr rt=$upstream_response_time';
```

**如果 access.log 里没有你期望的请求记录**，说明请求根本没到达 Nginx——检查 DNS、防火墙、安全组。

### 调试命令速查

```bash
sudo nginx -t                          # 配置语法检查（改配置后第一步）
sudo nginx -s reload                   # 热重载（不中断服务）
sudo tail -f /var/log/nginx/error.log  # 实时错误日志
sudo tail -f /var/log/nginx/access.log # 实时访问日志
curl -I http://localhost               # 快速验证响应头
curl -v http://localhost/api/users     # 看完整请求-响应过程
```

---

## 十、给新手的 3 个心智模型

1. **Nginx 的配置文件就是一套「请求路由规则表」**。`server` 按域名筛选、`location` 按路径筛选、`proxy_pass` / `root` 决定怎么处理。**把配置文件从上到下读，你就能还原出 Nginx 对每个请求做了什么**——没有黑魔法，只有规则匹配。

2. **`try_files` 是 SPA 部署的灵魂**。所有现代前端框架（React / Vue / Next.js）都是 SPA 或类似 SPA——只有 `index.html` 一个入口，路由在前端。没有 `try_files $uri /index.html`，用户刷新除首页外的任何页面都会 404。**记住这行配置，它救过我的命。**

3. **出问题先看日志，看日志先看 error.log**。Nginx 的 error.log 会明确告诉你错在哪——端口占用、权限不足、上游连接失败、语法错误——每一条都有精确的行号。**养成 `tail -f error.log` 的习惯，比 Google 搜索快。**

---

## 十一、一句话总结

> **Nginx = 一个高性能的 HTTP 请求路由器**。它的配置文件由四层结构组成（全局 → http → server → location），每一层都是「匹配条件 + 处理动作」的组合。**三个最简配置覆盖 90% 场景**：静态文件用 `root` + `try_files`、反向代理用 `proxy_pass` + 四个 `proxy_set_header`、SPA 用 `try_files $uri /index.html`。location 匹配有 4 种方式和明确的优先级（精确 > 前缀^~ > 正则 > 普通前缀）。生产环境加上负载均衡（`upstream`）、限流（`limit_req`）、Gzip、CORS、WebSocket 代理这 5 个模式就够了。**调试靠三板斧：`nginx -t` 查语法、`tail -f error.log` 查错误、`tail -f access.log` 查请求是否到达。**

---

## 这个系列下一篇会写什么

- **zero-to-tech / TypeScript 是什么：为什么新项目应该用 TypeScript**
- **zero-to-tech / Docker 是什么：为什么「在我电脑上能跑」会变成「在我容器里能跑」**
- **zero-to-tech / Git 进阶：rebase / stash / cherry-pick 什么时候用**

上一篇：[Next.js 个人网站从0到1部署：7个真实踩坑全记录](/blog/nextjs-deploy-pitfalls)
第一篇：[网络是怎么工作的](/blog/how-network-work)
