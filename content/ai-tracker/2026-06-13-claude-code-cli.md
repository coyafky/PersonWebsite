---
title: "Claude Code CLI 的工程化设计"
date: "2026-06-13"
summary: "把 Claude Code 终端 agent 拆开看,它怎么管理上下文、回滚与权限,以及我们能学什么。"
tags:
  - Claude Code
  - Anthropic
  - terminal
  - agent
status: published
sourceType: tool
signal: 2
signalLabel: "参考"
sourceUrl: "https://docs.claude.com/claude-code"
sourceTitle: "Claude Code Documentation"
author: "Anthropic"
publishedAt: "2026-06-11"
topics:
  - Agent
  - 工具链
lang: zh
englishSummary: "A look at how Claude Code handles context, rollback, and permissions in the terminal."
takeaways:
  - "上下文管理不靠压缩,而靠显式的文件引用和分片读取。"
  - "权限模型做在 tool 层面,不是 agent 层面,这点比大多数自建 agent 都干净。"
questions:
  - "分片读取对超大型仓库的延迟成本?"
  - "权限粒度能否延伸到企业 SSO?"
relatedPosts:
  projects:
    - "ark-seedream-car-preview"
---

## 上下文策略

Claude Code 没有走"塞下整个仓库"的路线。它要求显式声明要读哪些文件,并把读取结果按分片管理。

## 权限与回滚

工具调用被分门别类(只读、写文件、执行命令),权限可以分别授予。这与自建 agent 常见的"一把梭"形成对照。

## 对我们工作的启发

`ark-seedream-car-preview` 里遇到的"agent 误改远端配置"问题,根因就是权限没拆。Claude Code 的做法值得抄过来。
