---
title: "GEO 是什么：让内容被生成式引擎引用，而不是只在 Google 里被点开"
date: "2026-07-09"
summary: "GEO（Generative Engine Optimization）是面向 ChatGPT / Claude / Perplexity 等生成式答案引擎的内容优化方法。它和传统 SEO 不是替代关系，而是回答层、引用层、可抽取性层的一次升级。"
tags:
  - GEO
  - Generative Engine Optimization
  - AI Search
  - SEO
  - LLM
status: published
lang: zh
topic: geo
englishSummary: "GEO (Generative Engine Optimization) is the practice of making content discoverable and citable by generative answer engines like ChatGPT, Claude, and Perplexity. It is not a replacement for SEO but a new layer focused on retrievability, citation, and extractability."
---

# GEO 是什么：让内容被生成式引擎引用，而不是只在 Google 里被点开

> 这篇文章还在 draft 状态，是 GEO 主题的开篇。我会先建立最基础的心智模型：GEO 解决什么问题、和 SEO 是什么关系、和回答引擎之间怎么发生关系。后续文章再进入工程细节。

## 一句话定义

**GEO（Generative Engine Optimization，生成式引擎优化）** 是为了让内容被生成式 AI 搜索——ChatGPT、Claude、Perplexity、Gemini、豆包、元宝、Kimi——正确检索、抽取、引用、并出现在最终合成答案里所做的一系列优化。

它的优化对象不是“十条蓝色链接的排名”，而是**一段 AI 生成回答中的引用源和被引用片段**。

## GEO 出现的背景

2024 年之后，用户的搜索行为发生了一次明显迁移：

| 场景 | 之前 | 现在 |
|------|------|------|
| 想了解一个概念 | Google + 点开 3~5 个网页 | 直接问 ChatGPT / Perplexity |
| 想比较两个工具 | 搜索 “X vs Y review” | 直接问 AI 给对比 |
| 想找代码示例 | Google + StackOverflow | 直接问 AI 给可运行片段 |
| 想做研究综述 | Google Scholar 反复筛 | 让 Perplexity / Elicit 综合 |

这意味着：内容生产者的“目标对象”从**搜索引擎爬虫**变成了**生成式引擎的检索 + 引用系统**。这两个系统的评判逻辑差别很大。

## GEO 和 SEO 是什么关系

很多人会把 GEO 理解为 “SEO 2.0”，但更准确的说法是：**GEO 是 SEO 之上的一个新层，而不是替代**。

| 维度 | SEO | GEO |
|------|-----|-----|
| 优化对象 | Google / Bing 排名 | 生成式引擎的引用选择 |
| 评价信号 | 关键词匹配、外链、PageRank | 相关性、可信度、可抽取性、source attribution |
| 目标结果 | 用户点进页面 | 内容被合成进 AI 回答里 |
| 用户路径 | 搜索 → 点击 → 阅读 | 提问 → 直接看答案（可能点击也可能不点击） |
| 内容形式 | 适合长文、landing page | 适合结构化、可被切片、可被引用 |

我的判断是：

- 短期（1~2 年）：GEO 和 SEO 并存。Google 自己也在嵌入 AI Overview，SEO 仍然是基础。
- 中期（2~5 年）：GEO 会成为内容方必须考虑的核心能力。如果 AI 不引用你，你几乎不存在。
- 长期：GEO 的边界会和 AEO（Answer Engine Optimization）、LLM Optimization 收敛，但叫法会变。

## 生成式引擎选源时到底看什么

这是 GEO 的核心问题。Princeton 和 Georgia Tech 在 2023 年的论文 *GEO: Generative Engine Optimization* 里给了一个简化模型：

1. **查询改写 + 检索**：用户的提问被改写成多个检索 query
2. **候选文档召回**：从向量库 / 网页 / 知识图谱召回候选
3. **重排序（Rerank）**：用一个模型给候选打分
4. **生成 + 引用选择**：模型在生成回答时决定引用哪几个片段

在 (3) 和 (4) 阶段，内容本身的信号决定了它被引用的概率：

- **结构化程度**：标题层级、列表、表格、定义块——AI 更容易“切下来”用
- **引用密度**：是否有数据、来源、研究支撑
- **可验证性**：事实是否可被独立核查
- **权威信号**：作者背景、专业度、站点的可信度
- **新鲜度**：是否在持续更新

而传统 SEO 的很多打法——关键词堆砌、外链购买、meta keyword——对生成式引擎几乎无效，甚至有害（被识别为低质信号）。

## GEO 的工程边界

GEO 不是“把内容塞给 AI”。它有几个明显边界：

1. **不能操纵训练数据**：你不能把自己的内容塞进大模型的预训练 corpus。GEO 优化的是**检索时**的可发现性，不是训练时的权重。
2. **不能买引用**：AI 引擎不会因为你付钱就引用你。引用选择是模型行为，不是竞价排名。
3. **必须尊重 robots / AI bot 控制**：网站可以通过 `robots.txt`、`User-agent: GPTBot` 等机制选择是否让 AI 爬取。GEO 的前提是**允许**被爬。

这也是为什么 `llms.txt` 这种标准会被提出——它不是 GEO 的一部分，但它是 GEO 的“前置协议”：先告诉 AI 哪些内容可以读，再谈怎么优化。

## 我自己的 GEO 起点

对我来说，开这个学习主题不是为了“追热点”，而是有一个具体动机：**我自己写的 Markdown 内容系统，能不能被 AI 引擎引用**？

具体想验证几件事：

- 这个 PersonalWebsite 的内容结构（标题层级、frontmatter、tag 系统）是不是对 AI 友好
- RSS、sitemap、structured data 这些已有的 SEO 资产，对 GEO 够不够用
- 是不是要补 `llms.txt`、AI bot 友好的 sitemap
- 怎么衡量“我的内容被哪个 AI 引擎引用过”

这些问题会在后续文章里一个一个回答。

## 这篇文章的结论

GEO 不是 SEO 的替代，而是一次**优化对象的迁移**：从“让用户点进来”到“让 AI 引用我”。它依赖的信号和 SEO 重叠但不重合，更看重结构化、可抽取性、可信度和可验证性。

对内容生产者来说，2026 年最实际的态度可能是：**SEO 是地基，GEO 是新楼层。地基不能丢，但新楼层不盖，就会慢慢被新的搜索形态排除在外**。

## 继续学习

- Princeton & Georgia Tech: [GEO: Generative Engine Optimization (arXiv:2311.09735)](https://arxiv.org/abs/2311.09735)
- [llms.txt 提案](https://llmstxt.org/)
- Google: [AI features and your website (Search Central)](https://developers.google.com/search/docs/appearance/ai-features)