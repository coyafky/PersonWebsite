---
title: "Hermes Learning"
summary: "Hermes Agent 学习笔记合集——从配置、记忆、技能到实战的完整记录。"
date: "2026-06-19"
status: published
topic: hermes
lang: zh
englishSummary: "Hermes Agent study notes — a full traversal of configuration, memory, skills, and hands-on patterns distilled from the owner's Obsidian vault."
---

# Hermes Learning

> 草稿：以下内容整理自 Obsidian 的《Hermes Agent 知识架构图》和《Hermes Agent 学习资料库》。owner 会在框架完成后修订。

## 什么是 Hermes

Hermes 是一个面向开发者的 AI Agent 运行时：把工具调用、记忆、技能、上下文管理包装成可复用、可观测的工作单元。Hermes 的核心思想是**让 Agent 像一个可调试的服务**——你能查看它调了哪个工具、读了哪段记忆、为什么选了这个 Skill，而不是只能看到最终输出。

## 笔记组织方式

按"由浅入深、由内到外"的顺序：

1. **安装与配置**——CLI 启动方式、`config.yaml` 字段、会话管理
2. **记忆系统**——短期/长期记忆的存储结构、检索机制、写入策略
3. **技能开发**——SKILL.md 写法、纯 LLM Skill vs 工具型 Skill、发布到 ClawHub
4. **实战案例**——用 Hermes 做的具体项目（YouTube 阅读理解生成器、英语学习 Agent 等）

## 适合谁读

- 想用 Agent 改造工作流但不知道从哪开始的产品 / 开发同学
- 已经在用 Hermes / OpenClaw / Claude Code，想深入了解底层机制
- 准备做"AI 应用工程师"方向求职、需要项目证据的求职者

## 引用说明

所有笔记都来自实战过程中整理的 Obsidian 笔记，写作时已经过脱敏处理。涉及公司内部信息、客户数据、个人隐私的内容会跳过或抽象化。
