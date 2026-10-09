---
title: "P8 08_Hermes Agent桌面应用安装和订阅配置"
date: "2026-09-24"
summary: >-
  P8 · 08_Hermes Agent桌面应用安装和订阅配置（8:18）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P8"
series: "shangguigu-hermes"
seriesOrder: 8
---

## 课时概要

开场 · Hermes Desktop 桌面应用安装与订阅配置。官方 README 顶部同时给出 Hermes Agent 与 Hermes Desktop 两个入口；桌面 App 是仓库里的 `apps/desktop/`（Electron）。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[08_Hermes Agent桌面应用安装和订阅配置](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=8) ｜ 时长 8:18 ｜ P8

## 本节要点

- 官方 Installation：**macOS/Windows 推荐用 Hermes Desktop 安装器**（下载后运行，同时装 CLI + 桌面应用）；macOS 安装器 **仅 Apple Silicon**，Intel Mac 不受支持。
- CLI-only 安装后想加桌面：直接 `hermes desktop`。
- Desktop 是仓库里的 `apps/desktop/`（Electron 应用），提供图形化的会话/配置/模型管理。
- 官方文档提到 Desktop 自带更新器（updater），与 CLI 的 `hermes update` 独立。

## 关键概念

- **Hermes Desktop**：官方桌面应用（Electron），用于图形化管理 Hermes；`hermes desktop` 命令可从 CLI 拉起。
- **订阅配置**：Desktop/CLI 里配置 provider 与订阅（如 Nous Portal、Anthropic Max、xAI SuperGrok 等 OAuth 订阅或 API key）。

## 代码 / 实操

```bash
hermes desktop   # CLI-only 安装后补装/拉起桌面应用
```
本机实测：`/Applications/` 下已装 **Hermes Agent CN Desktop.app**（0.7.0）与 **Hermes.app**（0.0.1）——桌面端已配置完成。

## 我的收获

**用户此前已完成本模块的学习与配置**；以下是本机实测状态（2026-09-24）：

- 本机两套 Desktop app 都已安装（CN Desktop 0.7.0 是主力），说明桌面形态的安装与订阅本机已完成。
- Desktop 的 Electron 结构（`apps/desktop/`）在官方仓库可见，但我日常主要用 CLI。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
