---
title: "2.4 服务器、SSH和Nginx实战"
date: "2026-09-20"
summary: >-
  重要实战课：租一台 Linux 云服务器（Ubuntu），SSH 登录远程主机，安装并简单配置 Nginx。
status: published
tags:
  - "SSH"
  - "Nginx"
  - "运维"
lang: zh
chapter: "2.4"
series: "zero-to-fullstack"
seriesOrder: 7
---

## 课时概要

零到全栈的重要实战课：上一节讲的服务器、IP、端口，这一节全部亲手体验一遍——租一台 Ubuntu 云服务器，用 SSH 远程登录进去，安装 Nginx，然后在浏览器里通过公网 IP 第一次看到自己的页面。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】2.4-服务器、SSH和Nginx实战](https://www.bilibili.com/video/BV1ULLn62Eba/) ｜ 时长 51:51 ｜ 模块 2 · 计算机与互联网

**讲义**：[模块 2.4：准备好云服务器（李勃老师.com）](https://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-2-4/)

## 本节要点

- 服务器 = 另一台电脑，但有四点不同：有公网 IP、没有屏幕鼠标、24 小时开机、跑无图形界面的 Linux。
- 内网 IP 只能「主动出去」，不能被陌生人主动找到；公网 IP 两个方向都通——网站需要被任何人随时访问，所以服务器必须有公网 IP。
- 买服务器：Ubuntu（建议 24.04 LTS）、最低配够用、确认有公网 IP；拿到三样东西：公网 IP + 用户名 + 密码。
- SSH 是远程登录的标准方式：`ssh 用户名@公网IP`，默认走 22 端口；登录后提示符变成 `ubuntu@your-server:~$`。
- 装 Nginx：`sudo apt install nginx -y`，Nginx 负责监听 80 端口、把网页内容返回给浏览器。
- 安全组（防火墙）在云控制台放行两个端口：22（SSH 登录）和 80（浏览器访问）。
- 改 Nginx 默认页：配置里 `root /var/www/html;`，顺着路径找到源文件，Vim 改完刷新浏览器就看到变化。

## 笔记正文（讲义整理）

### 服务器和个人电脑的四个不同

**不同 1：有真正的公网 IP。** 自己电脑连 WiFi 拿到的是路由器分配的内网地址（如 `192.168.1.5`），互联网上的人找不到它。那微信消息怎么进来的？关键在谁先发起连接——微信 App 一启动就主动连微信服务器、保持连接不断，消息顺着这条已建好的连接推过来。**内网 IP 只能「主动出去」，不能「被陌生人主动找到」；公网 IP 两个方向都通。** 网站需要被任何人随时找到，所以服务器必须有公网 IP。

**不同 2：没有屏幕鼠标键盘。** 服务器插在机房机架上，人们远程登录进去用终端操作它。

**不同 3：需要一直开着。** 24 小时不间断，网站随时能访问。

**不同 4：跑 Linux、没有图形界面。** 这就是前面花时间讲终端和命令行的原因。

### 租一台云服务器

云厂商把硬件和网络准备好，按配置/时间租给你。购买抓住四点：

- 买的是**服务器**（云服务器或轻量应用服务器），不是对象存储、数据库、CDN；
- 操作系统选 **Ubuntu**（初学者资料最多、命令最好对齐，建议 24.04 LTS）；
- 配置从最低档开始，最便宜就够用；
- 确认机器有**公网 IP**。

买完拿到三样东西：**公网 IP 地址、登录用户名（通常 `ubuntu` 或 `root`）、登录密码**。最后去控制台的防火墙（安全组）里确认 **22 端口**已放行。

### SSH：远程登录

SSH 是登录远程 Linux 服务器的标准方式，在自己电脑的终端里执行：

```
ssh 用户名@服务器公网IP
```

SSH 默认监听 **22 端口**，所以要先确保 22 端口开放。第一次连接问你信不信任这台机器，输 `yes`；然后输密码（输入时屏幕不显示任何字符，正常）。登录成功，提示符变成 `ubuntu@your-server:~$`——这一刻你操控的已经不是眼前这台电脑，而是网络另一端的 Linux 服务器。

### 先在服务器上跑熟悉的命令

```
pwd    # 通常是 /home/ubuntu 或 /root
ls     # 新家目录是空的
cd /
ls     # 看到标准 Linux 目录结构：bin boot dev etc home ...
```

和本地 macOS 差别很大——因为这本来就是另一台机器、另一套操作系统。

### 用 apt 安装 Nginx

让服务器提供网页服务，需要一个软件：持续监听 80 端口、有请求就返回内容——这就是 Nginx。

```
sudo apt update
sudo apt install nginx -y
systemctl status nginx     # 看到 Active: active (running) 就成了
```

两个新词：`sudo` = 以更高权限执行（类似 Windows「以管理员身份运行」）；`apt` = Ubuntu 的软件安装工具。

### 浏览器访问公网 IP

Nginx 默认监听 **80 端口**。在云控制台的安全组里放行 TCP 80 后，浏览器打开 `http://你的公网IP`，看到 **Welcome to nginx!**——说明上一节讲的整条链路第一次真实发生了：

> 浏览器 → IP → 服务器 → 80 端口 → Nginx → 返回页面 → 浏览器显示

### 找到并修改默认页面

默认页面对应服务器上一个真实 HTML 文件。看配置找到它在哪：

```
cat /etc/nginx/sites-available/default   # 找 root /var/www/html;
cd /var/www/html
ls                                        # index.nginx-debian.html
sudo vim /var/www/html/index.nginx-debian.html
```

Vim 生存四步改一行字：`i` → 写 → `Esc` → `:wq` → 回车。浏览器刷新，看到你自己写的那句话——公网页面被你改了。

![从你的电脑到公网页面：SSH 走 22 端口远程登录操作，访客走 80 端口访问 Nginx 提供的网页](/diagrams/server-ssh-nginx.png)

### 最常见的卡点

- **SSH 连不上**：用户名/密码对不对、机器是否开机、安全组是否放行 22。
- **浏览器打不开 IP**：安全组没放行 TCP 80 入站流量——最常漏的一步。
- **Nginx 不是 active (running)**：重装或 `sudo systemctl start nginx`。
- **Vim 改了没生效**：确认真的 `:wq` 保存了。

## 和 GFG / 课程笔记的连接

这一节是 2.3 概念的第一次「真机体验」，后面的笔记正好接上：

| 2.3 的概念 | 这一节里第一次真实发生 |
| --- | --- |
| 服务器 = 另一台电脑 | SSH 登录后 `pwd`/`ls` 看到的是另一套目录结构 |
| 端口是服务的入口 | SSH 走 22、Nginx 走 80，安全组分别放行 |
| 请求 → 响应 | 浏览器访问 `http://公网IP`，Nginx 返回 Welcome 页 |
| 自己写服务器 | 模块 5 的 FastAPI / GFG 的 Flask 笔记：你写一个程序监听端口、收到请求返回内容，和 Nginx 干的是同一类事 |

## 关键概念

- **公网 IP vs 内网 IP**：内网只能主动出去，公网两个方向都通；网站需要被任何人随时找到。
- **云服务器**：云厂商管好硬件，你按配置/时间付费，拿到一台远程 Linux 机器。
- **SSH**：远程登录 Linux 服务器的标准方式，默认 22 端口。
- **安全组 / 防火墙**：云控制台里控制哪些端口对外放行的开关。
- **sudo / apt**：高权限执行 / Ubuntu 的软件安装工具。
- **Nginx**：监听 80 端口、把网页文件返回给浏览器的软件。
- **systemctl**：管理后台服务状态的命令（`active (running)` = 正在跑）。

## 代码 / 实操

```
# 本地终端：SSH 登录
ssh ubuntu@你的公网IP          # 首次 yes，输密码（不显示字符）

# 服务器上：熟悉环境
pwd && ls
cd / && ls

# 安装 Nginx
sudo apt update
sudo apt install nginx -y
systemctl status nginx         # Active: active (running)

# 找默认页面源文件
cat /etc/nginx/sites-available/default   # 找 root /var/www/html;
cd /var/www/html && ls
sudo vim /var/www/html/index.nginx-debian.html   # i → 改 → Esc → :wq

# 浏览器打开 http://你的公网IP 刷新看变化
```

## 我的收获

1. 服务器不是玄学：它就是另一台电脑，只是有公网 IP、没屏幕、24 小时开机、跑无图形界面的 Linux。
2. 端口是真实存在的门：22 这扇门给 SSH 登录用，80 这扇门给浏览器访问用，门开不开由云控制台的安全组说了算。
3. 「改一个文件 → 刷新浏览器 → 公网页面变了」这条链路走通，就是从概念到发布的第一次闭环。

## 待深入

*（待填：没听懂、想回头查的。）*
