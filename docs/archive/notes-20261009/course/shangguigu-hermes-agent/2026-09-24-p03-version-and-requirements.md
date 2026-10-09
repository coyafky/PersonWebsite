---
title: "P3 03_Hermes Agent版本内容和软硬件需求"
date: "2026-09-24"
summary: >-
  P3 · 03_Hermes Agent版本内容和软硬件需求（3:02）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P3"
series: "shangguigu-hermes"
seriesOrder: 3
---

## 课时概要

开场 · Hermes Agent 的版本内容与软硬件需求。

官方 README 的安装段写明：installer 会处理 uv、Python 3.11、Node.js、ripgrep、ffmpeg；Windows 原生还自带便携 Git Bash（MinGit 解到 `%LOCALAPPDATA%\hermes\git`，免管理员、与系统 Git 完全隔离）。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[03_Hermes Agent版本内容和软硬件需求](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=3) ｜ 时长 3:02 ｜ P3

## 本节要点

- 官方 [Platform Support](https://hermes-agent.nousresearch.com/docs/getting-started/platform-support)：**Tier 1** = macOS(Apple Silicon) / Windows 10-11 / Linux & WSL2 / Docker；**Tier 2** = Android(Termux) / Nix（best-effort）；**不支持** = AUR、pypi、brew、macOS x86(Intel)。
- 官方 [Installation 前置](https://hermes-agent.nousresearch.com/docs/getting-started/installation)：非 Windows 平台只需 **Git**；Linux 另需 `curl` + `xz-utils`；Desktop 需 `g++`/`build-essential`。Python/Node/rg/ffmpeg 由 installer 自动装，不用手动。
- 官方 Quickstart：模型**最小上下文 64K tokens**——窗口更小的模型无法支撑多步工具调用，启动时会被拒绝。
- 官方 Quickstart：本机/本地模型要把 context 设到至少 64K（如 Ollama `-c 65536`）。

## 关键概念

- **Tier 1 / Tier 2 平台**：官方支持矩阵的分级 —— Tier 1 保证不破坏安装与更新，Tier 2 尽力维护。
- **软硬件需求**：Git（必需）+ curl/xz-utils（Linux）+ g++（桌面版）；Python 3.11 / Node.js / ripgrep / ffmpeg 由安装器自动处理。

## 代码 / 实操

检查本机是否满足前置：
```bash
git --version          # 必须
curl --version | head -1
```
本机实测（macOS，开发机）：已满足全部前置，`hermes doctor` 环境项 ✓——Python 3.11.15、SQLite 3.53.1、venv 激活。

## 我的收获

**用户此前已完成本模块的学习与配置**；以下是本机实测状态（2026-09-24）：

- 本机为 macOS，符合 Tier 1（Apple Silicon 才能装官方 Desktop 安装器）。
- 本机 Hermes 不再需要手动装 Python/Node/rg/ffmpeg——安装器全自动（我最初 4 月手工装过，09-23 大升级时已验证这条）。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
