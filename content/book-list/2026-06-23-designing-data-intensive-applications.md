---
title: "数据密集型应用设计"
date: "2026-06-23"
summary: "把数据系统的可靠性、可扩展性、可维护性三个维度讲透 — 工程师读完之后能跳出具体技术栈,看清架构选择的 trade-off。"
status: published
author: "Martin Kleppmann"
genre: "工程实践"
tags:
  - "数据系统"
  - "DDIA"
  - "分布式"
  - "可靠性"
  - "可扩展性"
lang: zh
englishSummary: "DDIA separates data systems into three concerns: reliability, scalability, and maintainability. After reading, an engineer can reason about architecture trade-offs without getting stuck in specific tech stacks."
---

## 这本书讲了什么

Martin 把数据系统拆成 3 个独立维度的关注点:
- **可靠性**(Reliability) — 系统在硬件故障、软件错误、人为错误面前仍能继续正确工作
- **可扩展性**(Scalability) — 即使负载增加,系统也能保持合理性能
- **可维护性**(Maintainability) — 工程师能与系统共舞,不被它反噬

第 1 章用 Twitter 的 timeline 案例做开场:从纯读扩散(读时聚合)到混合策略(对大 V 用推、对普通用户用拉),展示同一个问题在不同负载下的解法完全不同。这章最重要的不是具体技术,而是"先定义问题,再讨论解法"的工作方式。

## 我学到了什么

- 可靠性不是单一指标,是故障域(failure domain)、可用性百分比、MTTR 的组合
- 可扩展性必须先定义"负载参数"(QPS / 写吞吐 / 存储增长)再讨论 — 不存在绝对的"可扩展"
- Twitter 案例让我理解:**架构选择是产品决策,不是技术决策**(取决于读多还是写多)
- 我之前做项目总想"一上来就上分库分表",但其实大多数系统根本没到那一步

## 我会怎么用

- 下次做架构 review 时,先用这 3 个维度做自检清单
- 评估技术选型时不再问"这个组件多强",而问"在什么负载下它最强"

## 引用与摘录

> "Reliability means continuing to work correctly, even when things go wrong."(Ch.1)

> "A system is called scalable if it can remain effective and efficient as its load grows."(Ch.1)

> "Describing a load by the number of read queries per second makes sense for a system whose main job is to serve queries to humans."(Ch.1, Twitter 案例)
