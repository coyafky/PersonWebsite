---
title: "P10 10_Hermes Desktop基础配置切换模型"
date: "2026-09-24"
summary: >-
  P10 · 10_Hermes Desktop基础配置切换模型（21:00）
status: published
tags:
  - "Hermes"
  - "LLM"
lang: zh
chapter: "P10"
series: "shangguigu-hermes"
seriesOrder: 10
---

## 课时概要

开场 · Hermes Desktop 基础配置与切换模型。官方 README 的模型段：**Use any model you want — Nous Portal, OpenRouter, OpenAI, your own endpoint, and many others**；切换用 `hermes model`，不用改代码、无锁定。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[10_Hermes Desktop基础配置切换模型](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=10) ｜ 时长 21:00 ｜ P10

## 本节要点

- 官方 Quickstart：**`hermes model` 是最关键的一步配置**——交互式选择 provider 与模型。
- provider 列表（官方节选，均为 key 型或 OAuth 型）：Nous Portal、OpenAI Codex、Anthropic、OpenRouter、Fireworks、DeepSeek、Kimi/Moonshot、Alibaba Qwen、xAI、MiniMax、Ollama、LM Studio、自定义端点（vLLM/SGLang/Ollama 等 OpenAI 兼容 API）……
- 配置存储分两处（官方）：密钥与 token → `~/.hermes/.env`；非密钥配置 → `~/.hermes/config.yaml`；`hermes config set` 自动把值写到正确文件。
- 模型最小上下文 64K（官方）；随时可切 provider：`hermes model`，无锁定。
- 配置查看/修改命令：`hermes config get` / `hermes config set` / `hermes setup`（全量向导）。

## 关键概念

- **provider**：模型来源（Anthropic / OpenAI / DeepSeek / OpenRouter / 本地端点…），`hermes model` 切换。
- **config.yaml vs .env**：非密钥配置放 yaml、密钥放 .env 的分离设计，`hermes config set` 自动分拣。

## 代码 / 实操

```bash
hermes model                     # 交互式选 provider + 模型
hermes config set model anthropic/claude-opus-4.6   # 直接设（示例）
hermes config set terminal.backend docker           # 切终端后端（示例）
hermes config get                # 看当前配置
```
本机实测：`.env` 里有 key 型 provider 的凭证（含 OPENCODE_GO_API_KEY、DEEPSEEK_API_KEY、MINIMAX 系列等，值不展示）；`config.yaml` 的 `model.provider` 目前为 deepseek 系，`terminal.backend: local`；doctor 显示 Config v46 最新。

## 我的收获

**用户此前已完成本模块的学习与配置**；以下是本机实测状态（2026-09-24）：

- 本机 provider 路线：key 型为主（DeepSeek 官方 key + OpenCode Go 等），未走 Portal OAuth——与视频开场「不是调 API」的定位呼应，配置层完全不锁模型。
- `terminal.backend: local` 说明本机未开 Docker 沙箱（P17 会深入）。
- 「切 provider 不改代码」实测为真：09-24 我做过 DeepSeek → OpenCode Go 的迁移，只改配置不动仓库。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
