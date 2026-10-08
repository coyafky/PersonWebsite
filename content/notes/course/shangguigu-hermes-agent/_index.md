---
title: "尚硅谷Hermes Agent教程，零基础玩转hermes爱马仕多智能体"
date: "2026-09-24"
summary: >-
  尚硅谷的 Hermes Agent 长课，一个视频 51 个分P、总时长 7 小时 42 分。开场与安装篇先讲课程定位、版本与软硬件需求、母公司背景（Nous Research）、产品介绍，然后命令行与桌面两种安装、订阅配置、更新卸载、切换模型；能力篇（官方篇名）把 Hermes 作为单个 Agent 的能力讲透 —— 会话管理、会话存储与跨会话搜索、Dashboard、工具集（FireCrawl）、终端后端（含 Docker）、MCP、上下文文件（SOUL.md）、持久化记忆与外置记忆提供商；进化篇讲它如何自我进化与自动化 —— 技能体系、用技能读 PDF 写 PPT、扩展技能、Curator 维护、钩子函数与安全、插件、Cron 定时任务；协作篇讲多 Agent 与多人协作 —— 消息网关（邮箱/微信）、Profile、任务委派、Kanban；最后实战篇用一个完整案例把 4 个 Profile Agent、微信消息平台、GitHub 推送与持久记忆、定时推送筛选选题、Kanban 多任务协作全部串起来。课程主角 Hermes 就是 Nous Research 的开源项目 NousResearch/hermes-agent，仓库与官方文档全程可对照学习。
status: published
platform: "Bilibili"
instructor: "尚硅谷"
url: "https://www.bilibili.com/video/BV1c5TL6eEkC/"
tags:
  - "Hermes"
  - "AI Agent"
  - "多 Agent"
  - "MCP"
  - "Skill"
  - "Kanban"
lang: zh
englishSummary: >-
  A 51-part (7h42m) Hermes Agent tutorial by Shangguigu. The intro covers versions, hardware requirements, Nous Research background, CLI/Desktop install, subscription, update and model switching. The capability chapters dive into sessions, storage & cross-session search, dashboard, toolsets (FireCrawl), terminal backends incl. Docker, MCP, context files (SOUL.md) and memory (incl. external providers). The evolution chapters cover the skill system, skills in action (PDF to PPT), Curator, hooks & their security, plugins and cron. The collaboration chapters cover message gateways (email/WeChat), profiles, delegation and Kanban. A final case study wires it together: 4 profile agents, WeChat platform, GitHub pushes, scheduled topic curation and Kanban collaboration. Built on Nous Research's open-source hermes-agent.
---

## 这个课程讲了什么

一句话：**不是调 API，而是把 Hermes 当作一个真正能自主干活的 AI Agent 来搭建（视频简介官方原话）。**

课程主角是 Nous Research 的开源项目 **Hermes Agent**（仓库 [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)）——官方 README 的自我定位是「The self-improving AI agent built by Nous Research」：唯一内置学习回路的 agent（从经验里创建技能、使用中自我改进、主动沉淀知识、跨会话建立对你的模型）。所以这门课的“配套资料”其实有两条线：视频简介给的是公众号（尚硅谷教育回复 Hermes），而 Hermes 本身的官方仓库与官方文档站全程可对照，下面课时清单里的定位就是把每个分P 钉到了官方仓库/文档的真实位置上。

官方分P 标题自带篇章名：**能力篇（P11–P25）/ 进化篇（P26–P33）/ 协作篇（P34–P42）/ 实战篇（P43–P51）**，下面模块 2–5 就是照这个切的，模块名沿用官方叫法；**模块 1（P1–P10）没有官方篇名，「开场与安装」是我按内容归纳的**（课程简介、版本与软硬件、公司背景、产品介绍、安装、桌面应用与订阅、更新卸载、基础配置与切换模型）。

课程自带一条贯穿全片的能力主线，正好可以用 Hermes 官方文档的目录来对照：

| 篇章（官方篇名） | 覆盖内容 | 对应官方文档 |
| --- | --- | --- |
| 能力篇（P11–P25） | 会话 / 会话存储与搜索 / Dashboard / 工具集（FireCrawl）/ 终端后端（Docker）/ MCP / 上下文文件（SOUL.md）/ 记忆 | Features：Memory、Skills、MCP、Tools、Context files |
| 进化篇（P26–P33） | 技能体系 / 读 PDF 写 PPT / 扩展技能 / Curator / 钩子与安全 / 插件 / Cron | Features：Skills、Curator、Hooks、Plugins、Cron |
| 协作篇（P34–P42） | 消息网关（邮箱 / 微信）/ Profile / 任务委派 / Kanban | Messaging：Email、Feishu 等；Features：Delegation、Kanban |
| 实战篇（P43–P51） | 端到端案例：4 个 Profile Agent → 微信平台 → GitHub 推送 → 定时选题 → Kanban 协作 → 总结 | 把前面所有能力串成一个真实多智能体系统 |

## 我学到了什么

*（跟课过程中逐节补。）*

## 我会怎么用

*（跟课过程中逐节补。）*

## 课时清单

*（跟课过程中逐节补。）*

## 我会怎么用

*（跟课过程中逐节补。）*

## 课时清单

**共 5 个模块 · 51 个分P · 总时长约 7:42:47**

分P 编号、标题、时长与链接均逐条取自 B 站视频接口，核对日期 2026-09-24。⚠️ 「讲了什么」一列是我按 Hermes 官方仓库与官方文档写的**定位**，不是内容摘要（本视频没有逐分P 的官方简介，视频简介只给了公众号获取配套资料）。**能力篇 / 进化篇 / 协作篇 / 实战篇的切分沿用分P 标题里的官方篇名。**

### 模块 1 · 开场与安装（10 分P）

| 分P | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| P1 | [01_Hermes课程简介](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=1) | 6:51 | 开场 · 课程简介 |
| P2 | [02_Hermes Agent课程介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=2) | 6:32 | 开场 · Hermes Agent 课程介绍 —— 课程大纲与学习路径 |
| P3 | [03_Hermes Agent版本内容和软硬件需求](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=3) | 3:02 | 开场 · Hermes Agent 的版本内容与软硬件需求 |
| P4 | [04_Hermes Agent母公司背景介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=4) | 8:13 | 开场 · Hermes Agent 母公司背景介绍 |
| P5 | [05_Nous Research其他产品介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=5) | 7:40 | 开场 · Nous Research 其他产品介绍 |
| P6 | [06_Hermes Agent项目介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=6) | 7:51 | 开场 · Hermes Agent 项目介绍 |
| P7 | [07_Hermes Agent命令行安装](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=7) | 14:18 | 开场 · 命令行安装（curl 一键脚本） |
| P8 | [08_Hermes Agent桌面应用安装和订阅配置](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=8) | 8:18 | 开场 · Hermes Desktop 桌面应用安装与订阅配置 |
| P9 | [09_Hermes Agent更新和卸载](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=9) | 9:27 | 开场 · Hermes Agent 更新和卸载 |
| P10 | [10_Hermes Desktop基础配置切换模型](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=10) | 21:00 | 开场 · Hermes Desktop 基础配置与切换模型 |

### 模块 2 · 能力篇：单 Agent 的能力（15 分P）

| 分P | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| P11 | [11_能力篇_会话管理](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=11) | 5:56 | 能力篇 · 会话管理 |
| P12 | [12_能力篇_会话存储和跨会话搜索](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=12) | 16:25 | 能力篇 · 会话存储与跨会话搜索 |
| P13 | [13_能力篇_Dashboard浏览器使用](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=13) | 7:11 | 能力篇 · Dashboard（浏览器）使用 |
| P14 | [14_能力篇_工具集切换FireCrawl的key](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=14) | 10:10 | 能力篇 · 工具集切换 FireCrawl 的 key |
| P15 | [15_能力篇_工具集扩展使用](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=15) | 5:29 | 能力篇 · 工具集扩展使用 |
| P16 | [16_能力篇_终端后端切换介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=16) | 8:00 | 能力篇 · 终端后端切换介绍 |
| P17 | [17_能力篇_终端后端在Docker中使用](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=17) | 10:51 | 能力篇 · 终端后端在 Docker 中使用 |
| P18 | [18_能力篇_其他工具扩展功能](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=18) | 1:43 | 能力篇 · 其他工具扩展功能（本分P 时长仅 1:43，是最短的一节之一） |
| P19 | [19_能力篇_MCP本地服务](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=19) | 7:13 | 能力篇 · MCP 本地服务 |
| P20 | [20_能力篇_MCP远程服务器工具使用](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=20) | 12:57 | 能力篇 · MCP 远程服务器工具使用 |
| P21 | [21_能力篇_MCP服务扩展介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=21) | 6:31 | 能力篇 · MCP 服务扩展介绍 |
| P22 | [22_能力篇_上下文文件Soul_md](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=22) | 11:01 | 能力篇 · 上下文文件 SOUL.md |
| P23 | [23_能力篇_上下文文件的工作目录](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=23) | 10:17 | 能力篇 · 上下文文件的工作目录 |
| P24 | [24_能力篇_持久化记忆介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=24) | 8:09 | 能力篇 · 持久化记忆介绍 |
| P25 | [25_能力篇_外置记忆提供商](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=25) | 6:05 | 能力篇 · 外置记忆提供商 |

### 模块 3 · 进化篇：技能、钩子、插件与定时任务（8 分P）

| 分P | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| P26 | [26_进化篇_技能体系简介](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=26) | 18:02 | 进化篇 · 技能体系简介 |
| P27 | [27_进化篇_使用技能读取PDF编写PPT](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=27) | 9:15 | 进化篇 · 实操演示：使用技能读取 PDF 编写 PPT |
| P28 | [28_进化篇_扩展技能模块](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=28) | 7:47 | 进化篇 · 扩展技能模块 |
| P29 | [29_进化篇_Curator技能维护](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=29) | 9:00 | 进化篇 · Curator 技能维护 |
| P30 | [30_进化篇_钩子函数](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=30) | 6:59 | 进化篇 · 钩子函数 |
| P31 | [31_进化篇_钩子系统的安全保护功能](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=31) | 2:40 | 进化篇 · 钩子系统的安全保护功能 |
| P32 | [32_进化篇_插件功能](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=32) | 7:27 | 进化篇 · 插件功能 |
| P33 | [33_进化篇_Cron定时任务](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=33) | 12:59 | 进化篇 · Cron 定时任务 |

### 模块 4 · 协作篇：消息网关、Profile 与 Kanban（9 分P）

| 分P | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| P34 | [34_协作篇_消息网关使用邮箱](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=34) | 11:32 | 协作篇 · 消息网关使用邮箱 |
| P35 | [35_协作篇_消息网关邮件调用Hermes](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=35) | 5:41 | 协作篇 · 消息网关邮件调用 Hermes —— 通过发邮件把任务交给 Hermes 执行（邮件作为指令入口） |
| P36 | [36_协作篇_微信配置消息网关](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=36) | 12:36 | 协作篇 · 微信配置消息网关 |
| P37 | [37_协作篇_Profile功能介绍和演示](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=37) | 6:03 | 协作篇 · Profile 功能介绍和演示 |
| P38 | [38_协作篇_任务委派展示](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=38) | 7:56 | 协作篇 · 任务委派展示 |
| P39 | [39_协作篇_Kanban意义和架构](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=39) | 7:51 | 协作篇 · Kanban 的意义和架构 |
| P40 | [40_协作篇_Kanban核心概念介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=40) | 8:25 | 协作篇 · Kanban 核心概念介绍 |
| P41 | [41_协作篇_Kanban任务执行演示](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=41) | 7:51 | 协作篇 · Kanban 任务执行演示 |
| P42 | [42_协作篇_Kanban任务一键分配](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=42) | 9:03 | 协作篇 · Kanban 任务一键分配 |

### 模块 5 · 实战篇：完整案例（9 分P）

| 分P | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| P43 | [43_实战篇_案例介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=43) | 3:47 | 实战篇 · 案例介绍 —— 把能力篇 / 进化篇 / 协作篇串成一个端到端案例的引言 |
| P44 | [44_实战篇_创建4个独立的Profile Agent](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=44) | 13:53 | 实战篇 · 创建 4 个独立的 Profile Agent |
| P45 | [45_实战篇_配置微信的消息平台](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=45) | 6:28 | 实战篇 · 配置微信的消息平台 |
| P46 | [46_实战篇_完成GitHub的推送并持久记忆](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=46) | 11:37 | 实战篇 · 完成 GitHub 的推送并持久记忆 |
| P47 | [47_实战篇_使用定时推送完成筛选选题](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=47) | 16:14 | 实战篇 · 使用定时推送完成筛选选题 |
| P48 | [48_实战篇_使用Kanban多任务协作完成任务设计](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=48) | 8:26 | 实战篇 · 使用 Kanban 多任务协作完成任务设计 |
| P49 | [49_实战篇_完成复杂任务的协同工作](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=49) | 16:48 | 实战篇 · 完成复杂任务的协同工作 |
| P50 | [50_实战篇_进化和监控维护功能](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=50) | 9:36 | 实战篇 · 进化和监控维护功能 |
| P51 | [51_实战篇_总结实战案例](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=51) | 3:41 | 实战篇 · 总结实战案例 |

### 配套资料

- 官方代码仓库：[NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)（248,571 stars，MIT，2026-09-24 核对）——「The agent that grows with you」
- 官方文档站：[Hermes Agent Docs](https://hermes-agent.nousresearch.com/docs/)（Getting Started / Guides / Features / Messaging / Developer guide，页面均逐条核实可访问）
- 官方中文 README：[README.zh-CN.md](https://github.com/NousResearch/hermes-agent/blob/main/README.zh-CN.md)
- 官方一键安装（Linux/macOS/WSL2）：`curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`
- 课程配套资料（官方渠道）：关注公众号「尚硅谷教育」，回复「Hermes」免费获取（视频简介原话）
