---
title: "3.4 GitHub与远程同步"
date: "2026-09-20"
summary: >-
  创建 GitHub 仓库并与本地仓库关联，实现远程同步（UP 主标注「重要程度 +++++」）。
status: published
tags:
  - "GitHub"
  - "Git"
lang: zh
chapter: "3.4"
series: "zero-to-fullstack"
seriesOrder: 11
---

## 课时概要

本地存档解决「可回退」，远程同步解决「可备份、可协作、可部署」。这一节在 GitHub 建空仓库、配 SSH 密钥、关联本地与远程、第一次 push，并跑通以后的日常三步（add / commit / push）。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】3.4-GitHub与远程同步](https://www.bilibili.com/video/BV1VxVE6LEXr/) ｜ 时长 27:03 ｜ 模块 3 · 前端基础

**讲义**：[模块 3.4：GitHub 与远程同步（李勃老师.com）](http://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-3-4/)

## 本节要点

- 远程仓库 = 本地仓库的「云端可信副本」，解决三个现实问题：电脑坏了代码没了、多人协作没有同步点、部署没法稳定拉同一份代码。
- 在 GitHub 建仓库时**不要勾 Initialize README**——本地已有文件，远程保持空仓最利于第一次同步。
- SSH 是免密推送的钥匙：`ssh-keygen` 生成一对，**私钥留在本地**（`~/.ssh/id_ed25519`，别外传），**公钥**（`.pub` 那行）贴到 GitHub。
- `git remote add origin <地址>` 把本地和远程挂钩；`origin` 是远程的约定名字。
- 第一次推送用 `git push -u origin main`：`-u` 建立本地分支与远程分支的跟踪关系，以后只敲 `git push` 就行。
- 日常节奏就三步：`git add .` → `git commit -m "…"` → `git push`。
- `push` 是本地→远程，`pull` 是远程→本地（多人协作/多台机器时才需要）。

## 笔记正文（讲义整理）

### 为什么要有远程仓库

3.3 把本地 Git 跑通了，但代码只在本机：电脑坏了或换机迁移成本高、多人协作没有统一同步点、部署时没法稳定拉同一份代码。远程仓库就是在本地仓库之外再加一份「网络上的可信副本」，最常见的平台是 GitHub。

### 第 1 步：在 GitHub 建空仓库

New repository → 名字 `zero-to-tech` → Public/Private 随意 → **不要勾 Initialize README**（本地已有文件，远程空仓最顺）。建好复制 SSH 地址：

```
git@github.com:你的用户名/zero-to-tech.git
```

### 第 2 步：配 SSH（每台电脑一次）

```
ssh-keygen -t ed25519 -C "你的邮箱"   # 一路回车
cat ~/.ssh/id_ed25519.pub             # 复制公钥整行
```

GitHub → Settings → SSH and GPG keys → New SSH key，把公钥粘贴进去。验证：

```
ssh -T git@github.com
```

看到认证成功就通了。私钥 `id_ed25519`（无 `.pub`）留在本地别外传；万一 SSH 一时配不通，可临时改用 HTTPS 地址先跑通。

### 第 3 步：关联本地与远程

```
cd ~/zero-to-tech
git remote add origin git@github.com:你的用户名/zero-to-tech.git
git remote -v        # 验证挂没挂上
```

### 第 4 步：第一次 push

```
git branch           # 看是 main 还是 master
git push -u origin main
```

`-u` = 建立本地分支与远程分支的跟踪关系，之后只敲 `git push`。

### 第 5 步：GitHub 页面验证

刷新仓库页，看到 `index.html` / `style.css` / `script.js` / `.gitignore` 都在，链路通了。

![本地仓库与远程仓库的双向同步：push 上传、pull 拉回](/diagrams/github-push-pull.png)

### 以后的日常三步

```
git add .
git commit -m "写清楚这次改了什么"
git push
```

不想记命令也可以用 GitHub Desktop，图形化看改动、提交、推送——和命令行操作的是同一个仓库。

## 和 GFG / 课程笔记的连接

GFG Python 主线不讲 Git/GitHub，但这套流程就是所有代码项目的日常：

| 课程里做的 | 现实里的对应 |
| --- | --- |
| 本地仓库 → push 到 GitHub | 我们这个 PersonalWebsite 就是这样：本地写完文章，push 到 GitHub，部署端再拉下来发布 |
| SSH 公钥贴 GitHub | 和 2.4 租服务器用 SSH 登录是同一把钥匙思路——谁持有私钥谁就能连 |
| push / pull 双向 | 以后在公司、在另一台电脑上写代码，pull 拉最新、push 传新写的 |
| GitHub Desktop 可图形化 | 不记命令也行，但命令行是后面自动化部署的基础 |

## 关键概念

- **远程仓库**：GitHub 上的云端副本，负责备份、协作、部署。
- **SSH 密钥对**：一把钥匙两个齿——私钥本地留，公钥贴平台；证明「我是我」免密码。
- **`origin`**：远程仓库的约定别名，不用每次写一长串地址。
- **`push` / `pull`**：本地→远程上传 / 远程→本地拉取。
- **`-u` 跟踪关系**：第一次 push 时绑定本地分支和远程分支，以后省参数。

## 代码 / 实操

```
# GitHub 网页上：New repo，不勾 README，复制 SSH 地址

# 本地：配 SSH（每台电脑一次）
ssh-keygen -t ed25519 -C "你的邮箱"
cat ~/.ssh/id_ed25519.pub       # 贴到 GitHub Settings

ssh -T git@github.com           # 验证

# 项目里：关联 + 首推
cd ~/zero-to-tech
git remote add origin git@github.com:你的用户名/zero-to-tech.git
git remote -v
git branch
git push -u origin main

# 日常
git add .
git commit -m "…"
git push
```

## 我的收获

1. 本地存档 + 远程备份是两件事：Git 管历史，GitHub 管副本，缺一个都不踏实。
2. SSH 密钥对是「免密码通行证」——私钥打死不外露，公钥随便贴，比每次输密码安全又省事。
3. 日常就是三步循环：改 → commit → push。把这个肌肉记忆养成，代码再也不会因为电脑出事而丢。

## 待深入

*（待填：没听懂、想回头查的。）*
