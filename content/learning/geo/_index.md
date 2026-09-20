---
title: "GEO 学习"
summary: "Generative Engine Optimization 学习笔记——围绕 ChatGPT、Claude、Perplexity、Gemini 等生成式 AI 搜索的内容优化方法与工程实践。"
date: "2026-07-09"
status: published
topic: geo
tags:
  - "GEO"
  - "LLM"
lang: zh
englishSummary: "A structured Generative Engine Optimization (GEO) track: how to make content discoverable, citable, and useful inside AI-driven search and answer engines such as ChatGPT, Claude, Perplexity, and Gemini."
---

# GEO 学习

这个主题整理我对 **Generative Engine Optimization（GEO，生成式引擎优化）** 的系统学习：它要解决的问题、它和传统 SEO 的差别，以及如何让内容被生成式 AI 搜索正确检索、引用和回答。

## 为什么开这个主题

2024 年开始，搜索的形态发生了根本变化。用户不再只问 Google，而是越来越多地直接问 ChatGPT、Claude、Perplexity、Gemini、豆包、元宝、通义、Kimi。

这些“答案引擎”的工作方式和传统搜索引擎不一样：

- 它们不返回十条蓝色链接，而是直接合成一段回答
- 它们依赖检索增强生成（RAG）、网页抓取、引用源选择
- 它们的“排名”逻辑从关键词匹配迁移到了**对内容的相关性、可信度、可抽取性的判断**

这意味着：传统 SEO 的很多打法（关键词堆砌、外链、meta keyword）正在失效，而新的优化对象——“如何让生成式引擎愿意引用我”——正在快速成型。

## 我想回答的问题

- GEO 和 SEO、AEO（Answer Engine Optimization）、AIO（AI Optimization）到底是什么关系？
- 生成式引擎在选源、选引用时看哪些信号？
- 内容的结构、密度、可信度如何影响“被引用率”？
- 我现有的 Markdown 内容系统、个人网站，要怎么适配 GEO？
- GEO 的边界和伦理：什么是合理优化，什么是污染训练数据？

## 学习路径

- **第 1 层**：GEO 是什么，和 SEO 有什么本质差别（已写）
- **第 2 层**：生成式引擎怎么选源——RAG、citation、source attribution
- **第 3 层**：内容侧的可优化信号——结构化数据、引用密度、权威性、可验证性
- **第 4 层**：工程侧——schema、robots、AI bot 控制、llms.txt、内容可抽取性
- **第 5 层**：衡量与迭代——如何知道我的内容被 AI 引用了

## 资源

- [Princeton & Georgia Tech: GEO 论文（arXiv:2311.09735）](https://arxiv.org/abs/2311.09735)
- [Princeton GEO 项目页](https://www.princeton.edu/~chiya2/geopage.html)
- [Google Search Central: AI features & your website](https://developers.google.com/search/docs/appearance/ai-features)
- [llms.txt 提案](https://llmstxt.org/)
- [Otterly.AI / Profound 等 GEO 监测工具](https://www.tryprofound.com/)