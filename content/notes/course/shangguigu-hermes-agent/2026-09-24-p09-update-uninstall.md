---
title: "P9 09_Hermes Agent更新和卸载"
date: "2026-09-24"
summary: >-
  P9 · 09_Hermes Agent更新和卸载（9:27）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P9"
series: "shangguigu-hermes"
seriesOrder: 9
---

## 课时概要

开场 · Hermes Agent 更新和卸载。官方文档站有专门页面：**Updating**（`docs/getting-started/updating`，已核实 200）。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[09_Hermes Agent更新和卸载](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=9) ｜ 时长 9:27 ｜ P9

## 本节要点

- 更新：单条命令 `hermes update`（拉最新 main + 更新依赖 + 提示配置新选项）。
- 跳过配置新选项后可用 `hermes config check` + `hermes config migrate` 补。
- 关闭被动更新提示：`hermes config set updates.check false`（默认 true）。
- 更新流程（官方 Updating 文档）：**pre-update 快照 → git pull → 语法校验+自动回滚 → 依赖安装 → 配置迁移 → 桌面重建 → gateway 自动重启**；gateway 先 drain（等在手任务，上限 `agent.restart_after_turn_timeout` 默认 30 分钟）。
- `hermes update --branch <name>` 可更非默认分支；`--check` 只预览落后多少。

## 关键概念

- **pre-update snapshot**：更新前自动存的状态快照（含 pairing、cron、config.yaml、.env、auth.json 等运行时文件），失败可用快照恢复。
- **drain-first 重启**：gateway 更新后先拒绝新任务、等在手任务跑完再退出重启，避免掐断长任务。

## 代码 / 实操

```bash
hermes update          # 更新到最新
hermes config check    # 见缺的新配置项
hermes config migrate  # 交互式补配置
hermes update --check  # 只看落后多少
```
本机实测：`hermes --version` 显示 **v0.21.5 (2026.9.24) · Up to date**——上一次大升级是 09-23（v0.15.1 → v0.21.4，跨 30,482 提交），今天已是最新。

## 我的收获

**用户此前已完成本模块的学习与配置**；以下是本机实测状态（2026-09-24）：

- 09-23 的升级让我实测了整条更新链路：pre-update 备份、gateway drain、配置迁移（7 个 profile v0/v23 → v46）。
- 踩过的坑：更新前必须先解决 root 权限污染（`.git`/venv/缓存属主），否则 `hermes update` 会 Permission denied；升级完 gateway 可能因新「一 host 一 gateway」架构崩溃循环，需要 `--force`。
- 卸载：官方没有单独一键卸除命令，移除 `~/.hermes/` 与 `~/.local/bin/hermes` 即可（本机保留安装，未卸载）。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
