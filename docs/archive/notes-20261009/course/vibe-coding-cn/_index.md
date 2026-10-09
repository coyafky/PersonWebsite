---
title: "vibe-coding-cn：中文 Vibe Coding 从入门到精通教程"
date: "2026-09-26"
summary: >-
  一份用中文写成的 Vibe Coding 长期知识库，按「教程」而不是「提示词合集」组织：从网络环境与 CLI 配置、第一个可验证闭环项目讲起，再往上是问题求解与状态转移闭环等核心概念、思维模型与编程哲学，最后落到架构模板、质量门禁、技术栈和开发流程。全部正文在 docs/ 下，按 从零开始 / 核心概念 / 哲学方法论 / 参考资料 / 开发流程 五个板块维护；另有 research/ 研究域记录外部项目与工程范式。
status: published
platform: "GitHub"
instructor: "tradecatlabs（原 tukuaiai）"
url: "https://github.com/tradecatlabs/vibe-coding-cn"
tags:
  - "Vibe Coding"
  - "AI编程"
  - "Prompt 工程"
  - "AI Agent"
  - "工程实践"
lang: zh
englishSummary: >-
  A Chinese-language long-form knowledge base for Vibe Coding, organised as a tutorial rather than a prompt collection. It runs from environment and CLI setup and a first verifiable closed-loop project, through core concepts (problem framing, goal-driven verifiable state transition), into thinking models and programming philosophy, and finally architecture templates, quality gates, technology stacks and the repo's own development workflow. All prose lives under docs/, split into five sections; research/ holds a separate study domain for external projects and engineering paradigms.
---

## 这个课程讲了什么

一句话：**它不是一套提示词合集，而是一份按「教程」组织的长期知识库——把 Vibe Coding 从环境配置一路铺到工程门禁。**

官方对自身的定义写得很直接（出自仓库 `llms.txt` 的「一句话定义」）；「vibe-coding-cn 是中文 Vibe Coding 从入门到精通教程，不是单纯的 Prompt 集合，而是一套从想法、PRD、技术方案、任务拆解、AI 编码、测试、部署到复盘的完整 AI 结对编程工作流。」

和 B 站课程不同，这门课的「课时」是**仓库里的文档正文**——全部在 `docs/` 下，按五个板块维护（`getting-started` / `concepts` / `philosophy` / `references` / `workflow`）。所以下面每讲的「标题」用的是官方文档标题，「官方定位」一列逐字取自仓库 `docs/README.md` 的完整细粒度目录。本课表把 `references/` 的 11 篇切成了模块 4 与模块 5 两段——**这个切分不是官方目录**，依据是官方 `references/README.md` 自己的原话：前半是「已拆成独立模板」的项目结构类，后半是「作为查阅型参考文档维护」的门禁与经验类。

### 官方学习路径

官方 `学习地图` 给了五条路线，同一套正文按目的重排——选路线比按顺序读更重要：

| 路线 | 适合谁 | 目标 |
| --- | --- | --- |
| 零基础路线 | 不会编程或刚开始 | 跑通从想法到项目的最小闭环 |
| 开发者路线 | 已会写代码 | 建立 AI 结对编程工作流 |
| Prompt 路线 | 想提升提问质量 | 把需求表达成可执行指令 |
| Skill 路线 | 想沉淀复用能力 | 把高频任务做成可重复调用的技能 |
| 质量门禁路线 | 担心 AI 乱写代码 | 用测试、CI、schema、清单约束 AI 输出 |

官方还额外给了一条「建议顺序」（出自同一篇）：问题求解 → 状态转移闭环 → 网络环境配置 → Codex / ChatGPT 订阅与登录准备 → Codex CLI 配置 → 让 Codex Agent 主动配置开发环境 → Vibe Coding 经验 → 第一个项目 → 拼好码 → 工程实践 → Skills 技能大全。

### 篇幅分布（实测，不是估计）

参考资料板块是这门课明显的重心：`references/` 里一篇 `现代企业数字化平台架构`（V2.98）就占 1,427,890 字节 / 21,777 行，比其余 32 篇加起来还多；`AI 编程质量门禁与常见坑` 78,065 字节 / 1,902 行排第二。反过来 `常识` 只有 412 字节 / 8 行。**阅读顺序上建议先跳过那篇 1.4 MB 的总账，它更像可检索的企业架构基线，不是通读材料。**

## 我学到了什么

*（读的过程中逐篇补。）*

## 我会怎么用

*（读的过程中逐篇补。）*

## 课时清单

**共 6 个模块 · 33 讲 · 合计约 1,863,946 字节 / 35,174 行**

标题与「官方定位」逐条取自仓库 `docs/README.md` 与各板块 README，核对日期 2026-09-26（commit `3b875974`）。⚠️ 模块 4 / 模块 5 的切分见上文说明，是**我按官方自述切的**，不是官方目录结构；`AGENTS.md` 那一讲也不在 `docs/` 里，它在仓库根。

### 模块 1 · 从零开始（6 讲）

官方目录名。仓库自己的说法是「本目录只保留入门路线索引，正文拆到独立文档」。

| 课时 | 标题 | 篇幅 | 官方定位 |
| --- | --- | --- | --- |
| P01 | [学习地图](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/getting-started/learning-map.md) | 6,208 字节 / 141 行 | 新手、开发者、团队、Prompt、Skill 和质量门禁的路线选择。 |
| P02 | [网络环境配置](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/getting-started/network-environment.md) | 4,569 字节 / 153 行 | OpenAI、GitHub、文档和依赖源访问。 |
| P03 | [CLI 配置](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/getting-started/cli-setup.md) | 15,251 字节 / 505 行 | Codex CLI 默认路线与 OpenCode 备选路线。 |
| P04 | [开发环境搭建](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/getting-started/development-environment.md) | 9,435 字节 / 260 行 | 让 Agent 主动配置开发依赖、编辑器建议和测试命令。 |
| P05 | [Vibe Coding 经验](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/getting-started/vibe-coding-experience.md) | 4,234 字节 / 100 行 | 通用语言能力、人机分工、机器门禁和入门铁律。 |
| P06 | [第一个项目](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/getting-started/first-project.md) | 12,928 字节 / 310 行 | 用本地待办清单走通需求、实现、验收和 Git 保存。 |

### 模块 2 · 核心概念（9 讲）

官方目录名。官方定位：「本目录解释 Vibe Coding 的核心概念，不承载工具安装细节」。

| 课时 | 标题 | 篇幅 | 官方定位 |
| --- | --- | --- | --- |
| P07 | [问题求解](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/concepts/problem-solving.md) | 17,262 字节 / 581 行 | 用目标、现状、差距、标准、约束、对象和路径定义问题。 |
| P08 | [Vibe Coding 状态转移闭环](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/concepts/vibe-coding-state-transition.md) | 16,061 字节 / 353 行 | 用固定目标、可变策略和分层反馈统一理解 Vibe Coding。 |
| P09 | [Vibe Coding 修仙映射](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/concepts/vibe-coding-cultivation-model.md) | 4,476 字节 / 112 行 | 用修仙比喻说明 Vibe Coding 的七个基础对象和四层结构。 |
| P10 | [拼好码](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/concepts/glue-coding.md) | 20,728 字节 / 510 行 | 复用成熟能力，用胶水代码连接、编排、适配业务流程。 |
| P11 | [系统构建方法](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/concepts/system-building.md) | 6,984 字节 / 153 行 | 自顶向下、自底向上与分而治之的组合使用。 |
| P12 | [开发范式演进](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/concepts/development-paradigms.md) | 1,646 字节 / 28 行 | 软件工程组织方式的演进。 |
| P13 | [语言层要素](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/concepts/language-layers.md) | 12,983 字节 / 560 行 | 看懂代码所需的语言层要素。 |
| P14 | [关键词系统](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/concepts/keyword-system.md) | 1,925 字节 / 179 行 | Vibe Coding 与工程协作中的高频关键词。 |
| P15 | [递归自优化系统](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/concepts/recursive-self-optimizing-system.md) | 6,585 字节 / 191 行 | 递归自优化生成系统的形式化模型。 |

### 模块 3 · 哲学方法论（5 讲）

官方目录名。官方定位：「本目录沉淀可迁移的思维模型、编程哲学和底层认知框架」。

| 课时 | 标题 | 篇幅 | 官方定位 |
| --- | --- | --- | --- |
| P16 | [思维模型](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/philosophy/thinking-models.md) | 8,918 字节 / 230 行 | 第一性原理、奥卡姆剃刀、多阶思维、状态空间等认知工具。 |
| P17 | [组合描述模型](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/philosophy/compositional-description-model.md) | 22,871 字节 / 540 行 | 用对象、状态、快照、序列、过程、变换、同一/差异与关系描述复杂系统。 |
| P18 | [编程之道](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/philosophy/programming-dao.md) | 8,252 字节 / 321 行 | 编程哲学与工程判断。 |
| P19 | [软件工程的朴素真理](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/philosophy/software-engineering-truths.md) | 10,395 字节 / 245 行 | 代码、复杂度、需求、维护、质量、架构和团队的工程常识。 |
| P20 | [方法论工具箱](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/philosophy/methodology-toolbox.md) | 26,019 字节 / 705 行 | 现象学还原、正反合、可证伪主义、形式化方法等提效工具。 |

### 模块 4 · 架构模板与数据服务（5 讲）

⚠️ 这不是官方目录：官方只有 references/ 一个板块。这个切分依据是官方 references/README 自己的说法——「项目结构、Python 骨架、企业架构、Dataset First 已拆成独立模板」。

| 课时 | 标题 | 篇幅 | 官方定位 |
| --- | --- | --- | --- |
| P21 | [项目架构模板（工程实践）](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/references/project-architecture-template.md) | 14,595 字节 / 466 行 | 常见项目结构、架构设计原则、最低门禁和检查清单。 |
| P22 | [通用 Python 项目骨架](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/references/python-project-skeleton.md) | 13,325 字节 / 695 行 | Python 应用、服务、脚本工具和库项目的通用骨架。 |
| P23 | [企业级架构模板](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/references/enterprise-architecture-template.md) | 32,577 字节 / 912 行 | 中大型工程组织、平台工程和多产品线参考模型。 |
| P24 | [现代企业数字化平台架构](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/references/modern-enterprise-architecture-template.md) | 1,427,890 字节 / 21,777 行 | ⚠️ 官方索引给这一篇的描述本身就有 1,034 字符，把全文目次列了一遍；这里不复制，请点开原文看。文件的文档定位原话是：说明现代企业数字化平台的总体架构、核心组成、团队职责、治理机制、技术原则和落地路径。 |
| P25 | [Dataset First 数据服务](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/references/dataset-first-data-service.md) | 7,269 字节 / 227 行 | 数据服务模板。 |

### 模块 5 · 质量门禁、工程经验与技术栈（6 讲）

⚠️ 同上，是 references/ 的后半。官方原话：「质量门禁、常见坑、技术栈和底层逻辑作为查阅型参考文档维护」。

| 课时 | 标题 | 篇幅 | 官方定位 |
| --- | --- | --- | --- |
| P26 | [常识](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/references/common-sense.md) | 412 字节 / 8 行 | AI 编程和工程交付前的最低判断线。 |
| P27 | [代码组织](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/references/code-organization.md) | 2,358 字节 / 57 行 | 模块化、命名、注释、格式化、文档和工具。 |
| P28 | [开发经验](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/references/development-experience.md) | 7,705 字节 / 260 行 | 编码规范、架构原则和常见基础设施经验。 |
| P29 | [AI 编程质量门禁与常见坑](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/references/quality-gates-and-pitfalls.md) | 78,065 字节 / 1,902 行 | 系统提示词、强前置条件、常见坑和硬门禁。 |
| P30 | [底层程序逻辑设计与工程优化项](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/references/low-level-program-logic.md) | 9,769 字节 / 579 行 | 运行模型、并发模型、数据模型、性能模型和工程交付检查清单。 |
| P31 | [技术栈](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/references/technology-stack.md) | 30,669 字节 / 1,691 行 | 技术栈选型、组合案例与初学者学习路径。 |

### 模块 6 · 开发流程与协作契约（2 讲）

官方 workflow/ 板块 + 仓库根 AGENTS.md。官方 workflow/README 说「本目录收敛项目开发流程，回答从接到任务到提交推送应该怎么做」。

| 课时 | 标题 | 篇幅 | 官方定位 |
| --- | --- | --- | --- |
| P32 | [开发流程](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/docs/workflow/development-process.md) | 875 字节 / 16 行 | 默认任务推进顺序、质量门禁和交付闭环。 |
| P33 | [仓库协作契约（AGENTS.md）](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/AGENTS.md) | 20,707 字节 / 407 行 | ⚠️ 这一篇不在 docs/ 里，是仓库根的 AGENTS.md。官方把它排在「团队路线」优先阅读第 1 条、「AI Agent 读取路径」第 1 条。 |

### 配套资料

- 官方仓库：[tradecatlabs/vibe-coding-cn](https://github.com/tradecatlabs/vibe-coding-cn)（16,400 stars / 1,659 forks / MIT / 默认分支 `develop`；核对日期 2026-09-26，HEAD `3b875974`）
- ⚠️ 仓库 README 里的徽章、Wiki 链接、zread.ai 链接仍指向**旧账号 `tukuaiai`**，而 GitHub API 返回的现归属是 `tradecatlabs/vibe-coding-cn`（`LICENSE` 版权行写的是「Nicolas Zullo, tukuaiai, 123olp」）。旧路径会 301 跳转，但直连 API 已查不到 `tukuaiai/` 这个所有者——**要引用请用 `tradecatlabs/`**。
- 机器可读索引：[`llms.txt`](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/llms.txt)（4,569 字节 / 101 行，官方给 AI 读的入口清单）
- AI 引用语料：[`assets/ai-citation/`](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/assets/ai-citation)（含 `llms-full.txt` 与 `recommended-answer.md`）
- 技能库：[`skills/README.md`](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/skills/README.md)——主仓库只保留 3 个：`auto-skill`（生成/重构/校验 Skills 的元技能）、`auto-tmux`、`claude-official-skills`。官方明说领域型/工具型大包不在主仓库维护。
- 提示词库：[`prompts/README.md`](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/prompts/README.md)
- 工具目录：[`tools/`](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/tools)（1.7 MB：`chat-vault` / `config` / `external` / `prompts-library`）
- 研究域：[`research/README.md`](https://github.com/tradecatlabs/vibe-coding-cn/blob/develop/research/README.md)——官方自述「当前包含 35 个外部仓库研究域；另有三个外部源事实镜像、两个内部工程研究项目、Harness 与 tmux 主题研究对象」。⚠️ 它**不是教程正文**，是长期跟踪对象；实测该目录 15 MB、40 个子目录 / 46 个顶层条目。
- 仓库自身门禁：`Makefile` 定义了一整套检查目标——`make lint` / `check-links` / `check-details` / `check-doc-structure` / `check-directory-docs` / `check-metadata` / `check-ai-citation` / `check-research-raw` / `check-source-facts` / `check-wiki`（出自根 `AGENTS.md` 的 Must-Run Commands）
- 本课表的「官方定位」一列逐字取自仓库 `docs/README.md` 的完整细粒度目录；「原文引言」逐字取自各篇正文的开头 blockquote 或摘要段。核对日期 2026-09-26，对应 commit `3b8759744e7fd12cb79c4fbe3ac6c6455edfb779`。
