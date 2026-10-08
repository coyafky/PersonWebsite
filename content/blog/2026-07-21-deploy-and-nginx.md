---
title: "我第一次把网站部署上线，卡在了四道坎上"
date: "2026-07-21"
updated: "2026-10-06"
summary: "2026 年 7 月的一个晚上，我在浏览器里输入服务器 IP，回车之后等来一行 403 Forbidden。文件确实在，命令行里 ls 看得到，浏览器就是不给看。这篇把我从本地代码走到线上 HTTPS 服务的过程按「卡住的顺序」重写了一遍：GitHub 远程与 SSH key、文件权限与 www-data、Nginx 配置的四层结构和三种最简写法、502/504 与日志排查，以及后来省事的 certbot、GitHub Actions 和 GitHub MCP。配置片段和命令都可以直接复制。"
tags:
  - "zero-to-tech"
  - "部署"
  - "GitHub"
status: published
lang: zh
category: "技术/计算机基础"
englishSummary: "One evening in July 2026 I typed my server's IP into a browser and got a 403 Forbidden — the files were there, `ls` showed them, but the browser refused to serve them. This post rewrites my path from local code to a live HTTPS service in the order I actually got stuck: GitHub remotes and SSH keys, file permissions and www-data, Nginx's four-layer config structure plus three minimal configs, 502/504 debugging via logs, and the things that saved me later — certbot, GitHub Actions, and GitHub MCP. All config snippets and commands are copy-paste ready."
---

2026 年 7 月的一个晚上，我在浏览器里输入那台服务器的公网 IP，回车之后转了十几秒，最后跳出一行 403 Forbidden。文件我确认已经传上去了，终端里 `ls` 能看到 `index.html`，可浏览器就是不肯给我看。

那时候我以为部署是件门槛很高的事。后来我发现，卡住人的是报错信息和真实原因常常不在同一层：403 跟网络无关，502 跟 Nginx 配置无关。下面按我当时卡住的顺序写，每一处都附上真正解决问题的那几行命令。

## 第一道坎：我的代码怎么跑到另一台机器上

我最早部署网站用的是 WinSCP：本地改完，把文件拖到远程窗口，再手动重启服务。文件一多就漏传，漏了也不报错，只在线上表现成一个怪 bug，怎么都复现不出来。

换成 Git 之后，这件事变成一次配置加一条命令。先在 GitHub 上建一个空仓库，注意不要勾 README 和 .gitignore 初始化，否则本地第一次 push 会因为历史不同被拒绝。然后在本地目录里：

```bash
cd ~/projects/my-app
git remote add origin git@github.com:coyafky/my-app.git
git remote -v                 # 确认 origin 指向对的地址
git push -u origin main
```

`-u` 是 `--set-upstream` 的简写，设完之后以后直接 `git push` 就行。

`origin` 只是那个远程地址的别名，换成别的名字也一样跑。我 fork 别人的项目时会配两个远程：

```bash
git remote add origin    git@github.com:coyafky/some-project.git     # 我的 fork，能 push
git remote add upstream  git@github.com:original/some-project.git    # 上游，只能 pull
```

推送走 SSH，所以还得配一次 key。GitHub 推荐 ed25519：

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub    # 整段贴进 GitHub Settings → SSH and GPG keys
ssh -T git@github.com        # 看到 Hi <你的用户名>! 就通了
```

macOS 上让钥匙串记住 passphrase，省得每次输：

```bash
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519

cat >> ~/.ssh/config <<EOF
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
EOF
```

服务器上也要单独配一把 key，才能 `git clone` 我的仓库。我在服务器上生成，只勾 read only：

```bash
ssh-keygen -t ed25519 -C "server-deploy-key"
cat ~/.ssh/id_ed25519.pub
```

把输出贴到仓库的 Settings → Deploy keys。服务器只需要拉代码，给它写权限没有意义。

网页操作我后来基本不做了。`gh` 装好、`gh auth login` 一次之后，建仓库加推送能压成一行：

```bash
gh repo create my-app --public --source=. --remote=origin --push
```

常用的几个：

| 命令 | 干什么 |
|---|---|
| `gh repo view --web` | 浏览器打开当前仓库 |
| `gh issue list` / `gh issue create` | 看 / 建 issue |
| `gh pr create` / `gh pr checkout 456` | 建 PR / 把 PR 分支拉到本地 |
| `gh api user/repos --jq '.[].full_name'` | 直接调 API，用 `--jq` 挑字段 |

`gh api` 是终端里的终极武器，网页上能点的动作几乎都能换成一次 API 调用，写脚本时尤其省事。

## 第二道坎：文件在，Nginx 说 403

回到开头那个 403。真实原因在读文件的用户：我以 root 登录，看得见文件；Nginx 以 `www-data` 这个用户运行，它读 root 创建的文件时权限不够。修法是改所有者：

```bash
chown -R www-data:www-data /var/www/my-app/
```

权限这块我后来只记四个数字，够用：

| 数字 | 含义 | 用在哪 |
|---|---|---|
| 755 | 所有者全权限，其他人可读可进入 | 目录 |
| 644 | 所有者可读写，其他人只读 | 普通文件 |
| 600 | 只有所有者可读写 | `.env`、私钥 |
| 700 | 只有所有者有全部权限 | `~/.ssh` 这类私密目录 |

数字是 r=4、w=2、x=1 相加的结果。目录要能进去，所以必须有 x；普通文件一般不需要 x。

```bash
chmod 755 /var/www/my-app
chmod 644 /var/www/my-app/index.html
chmod 600 /var/www/my-app/.env
```

`.env` 那行我每次都单独做。里面有数据库密码和 API key，权限给宽了等于公开。

还有个容易忽略的点：新建文件的默认权限由 umask 决定，目录 777 减 umask、文件 666 减 umask，默认 `0022` 出来正好是 755 和 644。我不再依赖它，部署脚本里显式写 `chmod`，谁把 umask 改成什么都影响不到结果。

## 第三道坎：nginx.conf 里全是新词

我第一次 `vim /etc/nginx/nginx.conf`，满屏的 `server`、`location`、`proxy_pass`、`upstream`，不知道这些块谁包着谁。自己搭过几次之后才摸清，这套配置只描述一件事：什么样的请求，交给谁处理。

我用的类比是一栋写字楼。大堂设一个收发室，所有外部请求先到这里；收发室看信封上的公司名（`server_name`）判断这是谁的信，再看信件类型（`location`）判断送哪个部门；普通资料直接去档案室取（`root` 指向磁盘目录），需要处理的转给办公室（`proxy_pass` 转到 `127.0.0.1:3000` 这种本地端口）。

### 四层结构，从上到下由粗到细

```nginx
worker_processes  auto;        # 全局层：Nginx 进程本身

events {
    worker_connections  1024;
}

http {                         # HTTP 层：所有 HTTP 配置的容器
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {                   # Server 层：一个域名 / 一个网站
        listen       80;
        server_name  example.com;

        location / {           # Location 层：某个路径的规则
            root   /var/www/html;
            index  index.html;
        }

        location /api/ {
            proxy_pass http://127.0.0.1:3000;
        }
    }
}
```

一个 `http` 里能放多个 `server`，所以一台机器可以同时 host 好几个网站；一个 `server` 里能放几十个 `location`。请求进来先匹配域名，再匹配路径，方向永远从粗到细。

### 我常用的三种配置

**静态文件**：

```nginx
server {
    listen       80;
    server_name  localhost;

    root   /var/www/my-site;
    index  index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

**反向代理**，用得最多的一种：

```nginx
server {
    listen       80;
    server_name  api.example.com;

    location /static/ {
        root   /var/www/app/public;
        expires 30d;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`proxy_set_header` 那四行我每次原样带上。少了它们，应用日志里所有请求的来源 IP 都是 `127.0.0.1`，线上出问题时没法定位；应用也不知道原始请求走的是 HTTP 还是 HTTPS，拼出来的回调地址会错。

**SPA 兜底**，前端项目必配：

```nginx
server {
    listen       80;
    server_name  spa.example.com;

    root   /var/www/spa/dist;
    index  index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

改完配置的两条命令我形成了肌肉记忆：

```bash
sudo nginx -t         # 先查语法，输出 test is successful 才继续
sudo nginx -s reload  # 热重载，不断已有连接
```

跳过 `-t` 直接 reload，语法错了会导致新配置加载失败，服务直接中断。

### location 的匹配顺序，我踩过一次

同一层里有多个 `location` 时，命中的不一定是写在前面的那个。顺序是这样：先看有没有精确匹配 `= /path`，命中就结束；否则记下最长的前缀匹配；如果这个最长前缀带 `^~`，用它；否则按配置文件里的先后顺序试正则，第一个命中的正则胜出；都没有就用记下的最长前缀。

```nginx
location = /api/health { return 200 "精确匹配"; }
location ^~ /static/   { return 200 "前缀优先"; }
location ~ \.php$      { return 200 "正则"; }
location /api/         { return 200 "普通前缀"; }
location /             { return 200 "兜底"; }
```

这组规则下，`/api/test.php` 命中 `~ \.php$`，不走 `/api/`。正则优先级高于普通前缀，这一条我吃过亏：给 `/api/` 写的限流一直没生效，请求被后面的正则截走了。想保住某个前缀，写成 `^~ /api/`。

### 刷新一下就 404

这个坑是纯前端项目特有的。React 或 Vue 打包出来只有一个 `index.html`，路由由浏览器里的 JS 控制。用户在 `/blog/123` 上按 F5，请求直接打到 Nginx，而磁盘上并没有 `blog/123.html`。

`try_files $uri $uri/ /index.html` 让 Nginx 按顺序试文件、试目录，都找不到就回退到 `index.html`，把路由交还给前端。少了这一行的症状很有迷惑性：首页正常，点进去也正常，唯独刷新和直接发链接会 404。

## 第四道坎：502 和 504 的报错指向错了地方

502 Bad Gateway 我遇到过很多次。第一次以为配置写错了，改了半天 `proxy_pass`，真实原因是我重启应用之后进程崩了，3000 端口上没有东西在听。

判断方法很直接，在服务器上自己访问一次：

```bash
curl http://127.0.0.1:3000     # 应用活着吗
lsof -i :3000                  # 端口被谁占着
```

504 Gateway Timeout 是另一回事：应用活着，但处理超过默认 60 秒没返回。要么优化应用，要么调大 `proxy_read_timeout`。403 回到权限那一节，404 去查 `root`、`alias`、`try_files` 三个地方。

日志比搜索引擎快，我养成了先开一个窗口 tail 着：

```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

error.log 里会写明原因，`connect() failed (111: Connection refused)` 是上游没起，`Permission denied` 是权限。access.log 用来确认请求到底有没有到 Nginx：如果里面没有你那条请求，问题在 DNS 或防火墙，不在配置里。

## HTTPS 只用了两条命令

证书这块我原本以为很麻烦，实际 certbot 一次搞定：

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d example.com -d www.example.com
```

它会问邮箱、条款，最后问要不要把 HTTP 全部重定向到 HTTPS，选是。之后自动做完四件事：验证域名所有权、签证书、改 Nginx 配置加 `listen 443 ssl` 和证书路径、装一个 systemd timer 定期续期。

配完的配置长这样：

```nginx
server {
    listen 443 ssl;
    server_name example.com www.example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}
```

`301` 是永久重定向，浏览器和搜索引擎会记住；临时跳转用 `302`。续期可以自己验一次：

```bash
sudo certbot renew --dry-run
```

## 我受够了每次发版都 SSH 上去

手动部署的流程是完全固定的：连上去、`git pull`、装依赖、构建、重启。既然固定，就该交给脚本。

```bash
#!/bin/bash
# deploy.sh
set -e

cd /var/www/my-app

echo "→ 拉取最新代码"
git pull origin main

echo "→ 安装依赖"
npm ci          # 按 lockfile 装，比 npm install 严格

echo "→ 构建"
npm run build

echo "→ 重启应用"
pm2 reload my-app

echo "✓ 部署完成 $(date)"
```

然后让 GitHub Actions 在 push 的时候替我 SSH 上去跑它。仓库 Settings → Secrets and variables → Actions 里加三个 secret：`SERVER_HOST`、`SERVER_USER`、`SSH_PRIVATE_KEY`。

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/my-app
            ./deploy.sh
```

整条链路就成型了：

```mermaid
flowchart LR
    DEV["本地 git push"]
    GH["GitHub Actions"]
    VPS["服务器跑 deploy.sh"]
    NGINX["Nginx reload"]
    USER["用户访问 HTTPS"]

    DEV --> GH
    GH -->|"SSH"| VPS
    VPS --> NGINX
    NGINX --> USER
```

我 push 一次，半分钟后线上就是新版本，中间不用碰服务器。

`pm2 reload` 会有一两秒中断。要做到零中断，我在 upstream 里留两个端口，部署时先起新端口，验证通过再改 upstream 切过去：

```nginx
upstream my_app {
    server 127.0.0.1:3000;
    # server 127.0.0.1:3001;   # 下一版起在这个端口，验证通过后切过来
}
```

## 用久了之后默认加上的几个配置

限流，防接口被刷：

```nginx
http {
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    server {
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://127.0.0.1:3000;
        }
    }
}
```

Gzip，减少传输体积：

```nginx
http {
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;
    gzip_comp_level 5;
    gzip_vary on;
}
```

WebSocket 反向代理，比普通反代多三处：HTTP 版本必须是 1.1，必须传 `Upgrade` 和 `Connection` 两个 header，超时时间要留够。

```nginx
location /ws/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 86400s;
}
```

负载均衡，把请求分给多个实例：

```nginx
upstream app_servers {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    location / {
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

CORS 我一律放在应用层处理，Nginx 再加一遍会出现重复 header。

## 再后来，我让 Claude Code 自己去读 issue

配好 GitHub MCP 之后，我对 Claude Code 说的第一句话是：把这个仓库所有 open 的 issue 按优先级排个序。它直接调 API 拿到了列表，我一个网页都没开。

配置写在 `~/.claude.json` 或项目的 `.mcp.json`：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<your_pat>"
      }
    }
  }
}
```

PAT 在 Settings → Developer settings → Personal access tokens 生成。scope 我只勾必要的：`repo`、读写 issue、读写 PR。这个 token 等于我 GitHub 账号的部分权限，有效期设短一点，定期轮换，绝不贴进聊天窗口或截图。

装好之后能派出去的活就具体多了：看 issue #45 的复现步骤，定位代码，改掉，跑测试，然后建 PR 并在描述里写清根因。配合 git worktree，还能让它同时开三个独立目录各修一个 issue，各建各的 PR，我只做 review。

## 回头看

这套东西我学了两遍。第一遍照着教程敲命令，线上挂了还是不会修；第二遍被 403、502、刷新 404 各折磨一次之后，才真的理解每层在干什么。

整条链路只有五个动作：把代码推到远程、让服务器拉下来、把文件权限配给 `www-data`、用 Nginx 把 80 和 443 的请求转到应用、用 Actions 把前三步自动化。每个动作单独看都不复杂，我真正记住的一条经验是报错的那一层往往不是出问题的那一层，查的时候先往上或往下挪一层。
