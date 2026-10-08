---
title: "零到全栈：AI 时代的全栈开发系列课程"
date: "2026-09-20"
summary: >-
  李勃老师出品的零基础全栈开发系列课，共 7 个模块 30 集。从「认识你的电脑」一路走到把自研的 zero-to-tech 应用真正部署上线，串起前端（HTML → React → Next.js）、后端（Python → FastAPI）、数据（文件存储 → SQLite）与运维（SSH / Nginx / 云服务器）四条主线，并在每一环回答「AI 时代为什么还要学全栈」。
status: published
platform: "Bilibili"
instructor: "李勃老师"
url: "https://www.bilibili.com/video/BV16jREBdEX5/"
tags:
  - "全栈开发"
  - "AI编程"
  - "Next.js"
  - "FastAPI"
lang: zh
englishSummary: >-
  A 30-episode beginner full-stack course by Li Bo (李勃老师) on Bilibili. It walks
  from computer basics through HTML/CSS/JS, Git and GitHub, React and Next.js, then
  Python and FastAPI on the backend, file storage to SQLite, and finally deploys a real
  app to a cloud server with Nginx. 7 modules, 30 episodes, ~17 hours total.
---

## 这个课程讲了什么

一句话：**把「一个应用是怎么长出来的」完整走一遍，并真的上线它。**

课程的目标读者是零基础的人，UP 主在开场课里给出的落点是：完整理解一个应用是怎么长出来的、真的上线一个产品、能够更得心应手地使用 AI、具备开发更多产品的核心能力。它的立场不是「AI 时代不用学编程了」，而是反过来——AI 带来了零基础上手的可能性，但要把 AI 用成协作者而不是抽奖机，你仍然得知道前端、后端、运维各自在干什么，以及它们之间怎么接起来。

四条主线：

| 主线 | 覆盖内容 | 对应模块 |
| --- | --- | --- |
| 前端 | HTML / CSS / JS → 模块化 → Vite → React → Next.js | 模块 3、4 |
| 后端 | API 概念 → HTTP 手搓 → Python / venv → FastAPI → CORS 联调 | 模块 5 |
| 数据 | 第三方库 / PyPI → 文件存储 → SQL / SQLite → 状态与会话 | 模块 6 |
| 运维 | 终端与 Linux → 互联网概念 → 租服务器 / SSH / Nginx → 部署上线 | 模块 2、7 |

课程自带一条贯穿始终的项目线：从模块 4 起用到的 demo，到模块 6 逐步长成 `zero-to-tech`，最后在模块 7 第一次被发布到公网。

> 课程结构的官方描述（出自 1.2 节）：开场与准备 → 计算机与互联网 → 前端基础 → 现代前端 → 初试后端 → 生态的力量 → 全栈部署 → 结课。

### 现在的连载状态

截至 2026-09-20 核对，B 站合集共 **7 个模块、30 集**，模块 7 目前只有 1 集（7.1 部署上线），官方课程安排里还排在后面的「结课」尚未出片——所以这门课**看起来仍在更新中**，上面的课时清单是当日快照，不是最终形态。

## 我学到了什么

*（跟课过程中逐节补。）*

## 我会怎么用

*（跟课过程中逐节补。）*

## 课时清单

**共 7 个模块 · 30 集 · 总时长约 17 小时（16:54:29）**

课时编号、标题、时长与链接均逐条取自 B 站官方合集，核对日期 2026-09-20。⚠️ 合集里的模块标题只有「模块1」…「模块7」这类编号，**下面的模块名（开场与准备、现代前端……）是我按内容归纳的**，用来便于检索，不代表官方命名；「讲了什么」一列依据 UP 主的官方简介归纳，不是逐句引用。

### 模块 1 · 开场与准备（3 集）

| 课时 | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| 1.1 | [为什么在AI时代还要学全栈开发](https://www.bilibili.com/video/BV16jREBdEX5/) | 6:47 | 解释什么是全栈——前端、后端、运维各自负责什么，技术栈之间怎么咬合；并从「AI 红利」的视角讲掌握编程知识的价值。 |
| 1.2 | [这门课是怎么安排的](https://www.bilibili.com/video/BV1Sd9XBPENn/) | 9:27 | 课程结构与学完能得到什么：完整理解一个应用是怎么长出来的、真的上线一个产品、更得心应手地使用 AI。 |
| 1.3 | [课前准备](https://www.bilibili.com/video/BV1BhReBaEJw/) | 4:29 | 开课前的环境与资料准备（官方配套资料在李勃老师.com）。 |

### 模块 2 · 计算机与互联网（4 集）

| 课时 | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| 2.1 | [认识你的电脑](https://www.bilibili.com/video/BV1zcRhBsEob/) | 19:12 | 从零建立对「电脑」这件事本身的直觉。 |
| 2.2 | [终端与Linux直觉](https://www.bilibili.com/video/BV1iaRRBHEgV/) | 29:14 | 终端不是黑魔法：建立命令行与 Linux 的基本直觉。 |
| 2.3 | [互联网是怎么工作的](https://www.bilibili.com/video/BV1RA556qESY/) | 20:01 | 从 web 角度讲清互联网的底层概念：IP、域名、DNS、端口号、服务器。 |
| 2.4 | [服务器、SSH和Nginx实战](https://www.bilibili.com/video/BV1ULLn62Eba/) | 51:51 | 重要实战课：租一台 Linux 云服务器（Ubuntu），SSH 登录远程主机，安装并简单配置 Nginx。 |

### 模块 3 · 前端基础（5 集）

| 课时 | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| 3.1 | [前端基础——HTML](https://www.bilibili.com/video/BV1AuG562ESE/) | 39:29 | HTML、CSS、JavaScript 的基本介绍，外加 Markdown 是什么。 |
| 3.2 | [结构、样式与交互分离](https://www.bilibili.com/video/BV1hxGJ6gEaK/) | 13:38 | 如何在 HTML 中引用独立的 .js / .css 文件，把结构、样式、交互三件事拆开。 |
| 3.3 | [Git入门到实操](https://www.bilibili.com/video/BV1biV86TEVd/) | 24:31 | Git 的安装与基本使用：从入门到建仓库、再到提交代码。 |
| 3.4 | [GitHub与远程同步](https://www.bilibili.com/video/BV1VxVE6LEXr/) | 27:03 | 创建 GitHub 仓库并与本地仓库关联，实现远程同步（UP 主标注「重要程度 +++++」）。 |
| 3.5 | [服务器部署与Nginx配置](https://www.bilibili.com/video/BV15P7y6cEzf/) | 38:09 | 用 git clone 把静态代码部署到服务器：HTTPS 与 SSH 两种拉取方式，逐段解读 nginx 配置，最终公网可访问。 |

### 模块 4 · 现代前端（6 集）

| 课时 | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| 4.1 | [现代前端基础——模块化](https://www.bilibili.com/video/BV1fmEi6DE9b/) | 36:49 | 现代前端第一课——模块化，现代前端的基石。 |
| 4.2 | [Vite、npm与前端构建](https://www.bilibili.com/video/BV1k3JA6cEAt/) | 58:22 | 在只懂 HTML/CSS/JS 的前提下，讲清 npm、package.json、Node.js、Vite、build 这些现代前端概念。 |
| 4.3 | [React,前端开发规则](https://www.bilibili.com/video/BV1FX7F6UEWq/) | 56:00 | React 到底是什么，以及前端开发要遵守的规则。 |
| 4.4 | [数据驱动界面](https://www.bilibili.com/video/BV1Dg7H6oEHQ/) | 42:12 | 数据驱动的界面是怎么组织出来的。 |
| 4.5 | [看懂Next.js](https://www.bilibili.com/video/BV1NxK962E2t/) | 35:03 | 看懂一个 Next.js 项目的结构与运行方式。 |
| 4.6 | [Next.js项目的两种部署方式](https://www.bilibili.com/video/BV1FiTq6fE8N/) | 27:57 | Next.js 项目的两种运行方式：静态部署 vs 常驻 Node 服务。 |

### 模块 5 · 初试后端（5 集）

| 课时 | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| 5.1 | [什么是API](https://www.bilibili.com/video/BV1cDT16HEkE/) | 22:59 | 后端第一课：API 是什么，并亲自上手调用两个真实 API。 |
| 5.2 | [Python安装和环境设置](https://www.bilibili.com/video/BV1M5Nu6pEuK/) | 50:21 | Python 安装与环境设置，围绕 venv 讲清一台机器上有多个 Python 环境时该怎么处理。 |
| 5.3 | [理解HTTP，手搓一个API](https://www.bilibili.com/video/BV1jzKK6aExw/) | 45:28 | 先不上框架：用手搓的方式学 HTTP 基础。语言会变、框架会变，HTTP 协议不会过时。 |
| 5.4 | [FastAPI入门](https://www.bilibili.com/video/BV1LW3K63ExS/) | 36:12 | 从手搓切换到 FastAPI 框架，并实现一个 POST 接口。 |
| 5.5 | [前后端联调和CORS](https://www.bilibili.com/video/BV13M3U6HEnk/) | 42:06 | 联调中常见的 CORS block 问题，以及如何用 FastAPI 的 CORS 中间件解决浏览器信任问题；附带前端环境配置。 |

### 模块 6 · 生态、数据与状态（6 集）

| 课时 | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| 6.1 | [第三方库与PyPI](https://www.bilibili.com/video/BV1MeM66DELp/) | 22:45 | 不是所有功能都要从 0 开发：学会用第三方库，避免重复造轮子。 |
| 6.2 | [让网页真的会分析文字](https://www.bilibili.com/video/BV1c7u861Emf/) | 16:07 | 项目里程碑：用 pypinyin 给中文标拼音、用 snownlp 算句子情感，让网页真的会分析文字。 |
| 6.3 | [数据库前传--文件存储](https://www.bilibili.com/video/BV11YbR6gEMZ/) | 38:23 | 数据库前传：不用数据库时数据可以怎么存，以及这么存会有什么问题。 |
| 6.4 | [数据库正传--SQL与SQLite](https://www.bilibili.com/video/BV1AR8U6REzY/) | 51:35 | 数据库正传：为什么需要数据库，用 SQLite 演示它长什么样、怎么操作，并讲 SQL、索引、自增字段这些通识。 |
| 6.5 | [重构, 在项目中使用SQLite](https://www.bilibili.com/video/BV1s94X6cEvx/) | 45:51 | 项目重构：把原来的文件存储换成数据库存储。 |
| 6.6 | [状态与会话](https://www.bilibili.com/video/BV1Q6bH6xEZS/) | 50:56 | 状态与会话——让应用记住「你是谁」。 |

### 模块 7 · 全栈部署（1 集）

| 课时 | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| 7.1 | [用朴素的方式部署上线](https://www.bilibili.com/video/BV1XKei6CEua/) | 51:32 | 第一次把 zero-to-tech 应用发布到互联网：最朴素的部署方案，含配置、环境与服务器操作。 |

### 配套资料

- 官方配套站点：[李勃老师.com/zero-to-fullstack](https://xn--ygr25xpohxwz.com/zero-to-fullstack/)
- 随课 demo 代码：[github.com/joylibo/zero-to-tech-demos](https://github.com/joylibo/zero-to-tech-demos)（按课时分目录，如 `zero-to-tech-4-5`）
- 随课做出来的产品：`zero-to-tech`（模块 7 部署上线的主角）
