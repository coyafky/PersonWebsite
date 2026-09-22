---
title: "7.1 用朴素的方式部署上线"
date: "2026-09-20"
summary: >-
  第一次把 zero-to-tech 应用发布到互联网：最朴素的部署方案，含配置、环境与服务器操作。
status: published
tags:
  - "Nginx"
  - "运维"
  - "部署"
lang: zh
chapter: "7.1"
series: "zero-to-fullstack"
seriesOrder: 30
---

## 课时概要

第一次把 zero-to-tech 发布到互联网。朴素方案：Nginx 在 80 端口送静态前端，uvicorn 在 8000 端口跑后端。先在本地把「写死的地址」抽成配置（.env + python-dotenv），再上服务器 git pull、建 venv、写配置、`fastapi run`、开 8000 防火墙、最后用 nohup 让后端在 SSH 断开后继续活。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】7.1-用朴素的方式部署上线](https://www.bilibili.com/video/BV1XKei6CEua/) ｜ 时长 51:32 ｜ 模块 7 · 全栈部署

**讲义**：[模块 7.1：先上线——最朴素的部署方案（李勃老师.com）](https://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-7-1/)

## 本节要点

- **朴素架构**：Nginx 80 端口送前端静态文件；uvicorn 8000 端口送后端 API。浏览器 JS 直接 fetch `http://服务器IP:8000`。
- **代码回答「怎么做」，配置回答「对着谁做」**：地址/密钥/端口随机器变，不该写死。
- **配置不进 Git**（可能含密钥）；但要进 Git 的 `.env.example` 示例文件——键写全、值是示例，`cp .env.example .env` 改值即用。
- **后端配置抽进 `backend/.env`**：`python-dotenv` 的 `load_dotenv()` + `os.getenv()`；allow_origins 不再写死。
- 服务器上：`python3 --version` + `which python3` 先问版本和位置；`python3 -m venv` + `pip install -r requirements.txt`。
- **`fastapi run` vs `fastapi dev`**：run 监听 `0.0.0.0`（外网可进）、不自动重启；dev 只听 `127.0.0.1`、有 reload。
- **nohup 后台**：`nohup .venv/bin/fastapi run > backend.log 2>&1 &`——& 丢后台 / nohup 不随 SSH 死 / `> log` 接输出 / `2>&1` 错误也进文件。
- 留了三个缺点给下节：nohup 只管住 SSH 断开（不重启不自愈）、8000 裸奔无日志无加密、前后端跨源。

## 笔记正文（讲义整理）

### 朴素部署架构

```
浏览器 ──80端口──> Nginx ──> 静态前端（out/）
   └──8000端口──> uvicorn(fastapi run) ──> history.db
```

前端是 4.6 那套（build 出 out/，Nginx 送）；后端是本地同款（uvicorn 守 8000）。SQLite 随代码运行自动建，不用单独部署。

### 五大挑战 → 四件事

1. **配置**（前端 `.env.local` 不进 git；后端 allow_origins 写死 localhost）——本地办完；
2. 换成 `fastapi run`——一条命令；
3. 云平台安全组放行 8000；
4. 让后端后台常驻——最后办。

### 配置抽离（本地先做）

```python
# backend/main.py
import os
from dotenv import load_dotenv
load_dotenv()
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS").split(",")
# app.add_middleware(..., allow_origins=ALLOWED_ORIGINS, ...)
```

```bash
pip install python-dotenv && pip freeze > requirements.txt
```

`.gitignore`：`.env*` + `!.env.example`（示例文件要进 git）。两份 `.env.example`（前端/后端）键写全、值给 `http(s)://[ip]:[port]` 示例。

> Next.js 配置按优先级找一串：`.env.production.local > .env.production > .env`，本机私有永远盖过公共。

### 服务器上

```bash
ssh 用户@IP && cd ~/zero-to-tech && git pull
python3 --version && which python3          # 两件事：有没有/用的哪个
cd backend
python3 -m venv --prompt=zero-to-tech .venv
source .venv/bin/activate
pip install -r requirements.txt
# 前端: cp .env.example .env.production  →  NEXT_PUBLIC_API_BASE_URL=http://IP:8000
# 后端: cp .env.example .env           →  ALLOWED_ORIGINS=http://IP  （不带端口！）
npm install && npm run build                # 前端
fastapi run                                 # 后端，听 0.0.0.0:8000
```

> 为什么后端 `.env` 的 ALLOWED_ORIGINS 不带端口？线上前端是 Nginx 在 80 端口提供，80 是 http 默认端口，浏览器 Origin 根本不带它。

### 后台常驻

```bash
nohup .venv/bin/fastapi run > backend.log 2>&1 &
#  & 后台 / nohup 不随 SSH 死 / > log 接输出 / 2>&1 错误也进同一文件
tail -f backend.log    # 看日志
ps aux | grep fastapi  # 找 PID
kill PID               # 停
```

![朴素部署架构 + 四件事 + nohup 四零件](/diagrams/deploy-naive-architecture.png)

## 和 GFG / 课程笔记的连接

| 这节内容 | GFG / 已学 |
| --- | --- |
| `os.getenv` / python-dotenv | GFG 的 os.environ；6.5 的 `.env` 思想 |
| venv + requirements.txt | 5.2/6.1 立的规矩，服务器上原样重演 |
| git pull 拉代码 | 3.4 GitHub 远程同步 |
| Nginx 送静态前端 | 2.4/3.5/4.6 前端部署那套 |
| nohup/进程/日志 | 2.2 终端直觉；前台/后台进程 |
| fastapi run vs dev | 5.4 见过 `fastapi dev`，今天换生产命令 |

> 这节几乎全是「把前面学过的东西在另一台机器上重演」——venv、requirements、Nginx、git pull，新东西只有配置抽离和 nohup。

## 关键概念

- **配置 vs 代码**：代码回答怎么做，配置回答对着谁做；同一份代码配不同配置服务不同环境。
- `.env` / `.env.example`：真实配置不进 git，示例配置进 git 教别人怎么填。
- `fastapi run`：生产模式，监听 `0.0.0.0`（外网可进），不自动重启。
- **nohup**：让进程不随 SSH 断开被杀；`&` 放后台；`2>&1` 错误输出并进日志。
- **安全组/防火墙**：云平台默认不开 8000，要手动放行。
- **README 做完再写**：把走通的路记下来，别写想当然。

## 代码 / 实操

```bash
# 本地：抽配置
pip install python-dotenv && pip freeze > requirements.txt
# 后端 .env: ALLOWED_ORIGINS=http://localhost:3000
# .gitignore: .env*  +  !.env.example
git add -A && git commit && git push

# 服务器
ssh 用户@IP && cd ~/zero-to-tech && git pull
python3 --version && which python3
cd backend && python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # 填 ALLOWED_ORIGINS=http://IP
npm install && npm run build
nohup .venv/bin/fastapi run > backend.log 2>&1 &
# 云平台放行 8000；浏览器访问 http://IP 验证
```

## 我的收获

1. 「代码回答怎么做、配置回答对着谁做」一句话把 .env 的意义讲透了——地址这种值本就不该进代码。
2. `fastapi dev` 听 127.0.0.1、`fastapi run` 听 0.0.0.0——一个字母的差别决定外网能不能进。
3. nohup 四个零件拆开学：光有 `&` 不够，人走它照样死；nohup 才是「别挂断」。

## 待深入

*（待填：没听懂、想回头查的。）*
