---
title: "P7 07_Hermes Agent命令行安装"
date: "2026-09-24"
summary: >-
  P7 · 07_Hermes Agent命令行安装（14:18）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P7"
series: "shangguigu-hermes"
seriesOrder: 7
---

## 课时概要

开场 · 命令行安装（curl 一键脚本）。官方 README Quick Install（Linux/macOS/WSL2/Termux）：`curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`；Windows 原生用 PowerShell `iex (irm https://hermes-agent.nousresearch.com/install.ps1)`。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[07_Hermes Agent命令行安装](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=7) ｜ 时长 14:18 ｜ P7

## 本节要点

- 官方安装命令（macOS/Linux/WSL2/Termux）：
```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```
- Windows 原生（PowerShell）：`iex (irm https://hermes-agent.nousresearch.com/install.ps1)`
- 安装器自动处理：uv、Python 3.11、Node.js v26、ripgrep、ffmpeg，以及 repo clone、venv、全局 `hermes` 命令与 provider 配置；Windows 还自带便携 Git Bash（无需管理员）。
- 默认布局：用户模式 → 代码在 `~/.hermes/hermes-agent/`，`hermes` 二进制符号链到 `~/.local/bin/hermes`，数据在 `~/.hermes/`；root 模式 → `/usr/local/lib/hermes-agent/` + `/usr/local/bin/hermes`。
- 装完 `source ~/.bashrc`（或 `.zshrc`），然后 `hermes` 直接开聊。

## 关键概念

- **git 安装器**：官方推荐的一键脚本安装方式，装完既是可运行环境也是 git 仓库（`hermes update` 靠它拉新代码）。
- **HERMES_HOME / ~/.hermes/**：实例的 home 目录，config.yaml、.env、SOUL.md、skills、sessions、cron 等全部状态都在这里。

## 代码 / 实操

```bash
# 官方一键安装（macOS/Linux/WSL2/Termux）
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
source ~/.zshrc   # 或 ~/.bashrc
hermes            # 开聊
```
本机实测：安装目录 `/Users/fkycoya/.hermes/hermes-agent`，Install method: git，版本 **v0.21.5 (2026.9.24)**，`hermes doctor` 环境检查全绿。

## 我的收获

**用户此前已完成本模块的学习与配置**；以下是本机实测状态（2026-09-24）：

- 本机就是 git 方式安装的（4 月起，09-23 从 v0.15.1 直升 v0.21.4，今日实测已 v0.21.5）——与官方推荐路径一致。
- 「installer 自动装 Python/Node/rg/ffmpeg」这条我踩过：09-23 升级时 root 权限污染 + uv 重装依赖，但这些是环境问题，不是安装器设计问题。
- Windows 便携 Git Bash（MinGit）说明官方对“免管理员安装”很重视，与 macOS 行为一致。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
