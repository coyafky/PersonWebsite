---
title: "P5 05_Nous Research其他产品介绍"
date: "2026-09-24"
summary: >-
  P5 · 05_Nous Research其他产品介绍（7:40）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P5"
series: "shangguigu-hermes"
seriesOrder: 5
---

## 课时概要

开场 · Nous Research 其他产品介绍。官方 README 里反复提到 **Nous Portal**（[portal.nousresearch.com](https://portal.nousresearch.com)）—— Nous 自己的模型端点平台，与 OpenRouter、OpenAI 等并列作为 Hermes 可用的 provider。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[05_Nous Research其他产品介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=5) ｜ 时长 7:40 ｜ P5

## 本节要点

- 官方 README 提到的 Nous 自家产品：**Nous Portal**（[portal.nousresearch.com](https://portal.nousresearch.com)）——订阅制模型端点，一个订阅覆盖 300+ 模型 + Tool Gateway（web 搜索、生图、TTS、云浏览器）。
- 官方 Quickstart 的「最快路径」就是 Portal：`hermes setup --portal` 一条命令完成登录 + 设 provider + 开 Tool Gateway。

## 关键概念

- **Nous Portal**：Nous 的订阅平台；对 Hermes 用户 = 零配置的 provider + 工具网关。
- **Tool Gateway**：Portal 订阅附带的工具服务（web 搜索 / 生图 / TTS / 云浏览器），免去逐个工具配 key。

## 代码 / 实操

```bash
hermes setup --portal   # 官方最快路径：Portal 登录 + provider + Tool Gateway
```
本机实测：`.env` 里没有 Portal key，`hermes doctor` 显示 **Nous Portal auth (not logged in)**——本机走的是 key 型 provider，没用 Portal。

## 我的收获

**用户此前已完成本模块的学习与配置**；以下是本机实测状态（2026-09-24）：

- 本机选择的是 key 型 provider（见 P10），不是 Portal 订阅——两条路线都可行，本课用的是自己的配置。
- Portal 的「300+ 模型 + 工具网关」是省心路线，适合不想管多个 key 的场景。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
