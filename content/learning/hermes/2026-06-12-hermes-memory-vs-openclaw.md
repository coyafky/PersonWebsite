---
title: "深度拆解 Hermes 记忆系统：它如何修正 OpenClaw 的记忆误区"
date: "2026-06-12"
summary: "深度对比 Hermes 与 OpenClaw 的记忆设计哲学：Hermes 的 11 段系统提示词组装顺序（让稳定前缀保持不变以利用 Prompt Caching）、4 层记忆架构（固化 MEMORY.md+USER.md 提示词 / SQLite session_search / Skills 程序记忆 / Honcho 深层用户建模），对比 OpenClaw 的 Markdown 中心化误区（流水账 / 提示词臃肿 / 缓存命中差）。核心 3 原则：冷热分离（热=常驻 / 温=索引 / 冷=SQLite / 深层=Honcho）、缓存优先（限制常驻容量换提示词稳定）、按需检索。设计哲学：记忆不是越多越好，系统提示词也不是所有信息都该进入的地方——应该在正确层级、以正确成本、记住正确的事情。"
tags:
  - hermes
  - OpenClaw
  - 记忆系统
  - 架构对比
  - Prompt Caching
  - 设计哲学
status: draft
lang: zh
topic: hermes
englishSummary: "Deep comparison of Hermes vs OpenClaw memory design philosophy: Hermes's 11-segment system prompt assembly order (keeping stable prefixes unchanged for Prompt Caching), 4-layer memory architecture (frozen MEMORY.md+USER.md prompts / SQLite session_search / Skills procedural memory / Honcho deep user modeling), vs OpenClaw's Markdown-centric pitfalls (running logs / bloated prompts / poor cache hits). 3 core principles: hot-cold separation (hot=resident / warm=index / cold=SQLite / deep=Honcho), cache-first (limit resident capacity for prompt stability), on-demand retrieval. Design philosophy: more memory isn't better, system prompt isn't where everything belongs — remember the right things at the right layer with the right cost."
---

# 深度拆解 Hermes Agent 的记忆系统：它如何修正 OpenClaw 的记忆误区

如果你关注过 ChatGPT、Claude、Clawdbot 等 AI Agent 的记忆机制，就会发现一个核心问题始终绕不开：

**AI Agent 到底应该如何"记事"？**

Hermes Agent 之所以值得研究，是因为它不是一个只能通过行为观察来猜测内部机制的黑盒系统。Hermes 是开源项目，代码库和文档都可以直接查看。因此，我们不需要单纯依靠提示词测试来逆向推断它的记忆逻辑，而是可以直接沿着代码路径分析它如何构建提示词状态、如何持久化会话、如何清理记忆，以及如何检索历史对话。

简单来说，Hermes 并不是只有一套记忆系统，而是采用了四层记忆架构：

```text
1. 写入 MEMORY.md 和 USER.md 的高密度提示词记忆
2. 通过 session_search 调用的 SQLite 历史会话检索系统
3. 类似程序记忆的 Skills 技能管理机制
4. 可选的 Honcho 层，用于更深层的用户建模
```

贯穿这套设计的核心原则非常明确：

```text
保持提示词稳定，以便利用 Prompt Caching；
把复杂、低频、长尾的信息交给工具按需检索。
```

这也是 Hermes 相比 OpenClaw 更成熟的地方。

---

## 一、Hermes 的上下文结构

要理解 Hermes 的记忆系统，首先要看它到底向模型发送了什么。

Hermes 的系统提示词大致按照以下顺序组装：

```text
[0] 默认智能体身份
[1] 工具使用行为指南
[2] Honcho 集成模块（可选）
[3] 可选系统消息
[4] 固化的 MEMORY.md 快照
[5] 固化的 USER.md 快照
[6] 技能索引
[7] 上下文文件，例如 AGENTS.md、SOUL.md 等规则文件
[8] 日期、时间与平台信息
[9] 对话历史
[10] 当前用户消息
```

这个顺序非常关键。

Hermes 的提示词构建器有一个明确目标：**让稳定的提示词前缀尽可能长时间保持不变**。

原因在于，大模型供应商通常会提供 Prompt Caching 机制。如果系统提示词前缀保持稳定，就可以提高缓存命中率，从而降低延迟和成本。

这一个设计目标，基本解释了 Hermes 记忆架构的大部分取舍。

如果某条信息每轮对话都需要使用，Hermes 会把它压缩到极小，并直接注入提示词；如果某条信息很长、历史性强、低频使用，Hermes 就不会把它常驻在提示词里，而是通过工具按需检索。

---

## 二、第一层：固化的提示词记忆

Hermes 的内置记忆系统非常小。

它将持久记忆存储在本地目录：

```text
~/.hermes/memories/
```

里面主要有两个文件：

```text
MEMORY.md
USER.md
```

### 1. MEMORY.md

`MEMORY.md` 用于存储智能体自身需要记住的事项，例如：

```text
环境信息
项目规范
工具行为差异
反复出现的错误修正
长期有效的经验教训
```

它的容量限制约为：

```text
2,200 字符
```

### 2. USER.md

`USER.md` 用于存储用户相关信息，例如：

```text
用户偏好
沟通风格
身份背景
长期稳定的工作习惯
```

它的容量限制约为：

```text
1,375 字符
```

两个文件加起来大约只有 1,300 个 Token 左右。

这个容量看起来非常小，但这是 Hermes 有意为之。

Hermes 不希望把所有历史信息都塞进系统提示词，而只希望把最高频、最稳定、最值得常驻的信息保留下来。

---

## 三、记忆快照：会话期间保持稳定

在会话开始时，Hermes 会加载 `MEMORY.md` 和 `USER.md`，并将它们渲染进系统提示词。

之后，这两个文件在当前会话中会形成一个固定快照。

也就是说：

```text
会话中途新增的记忆会立即写入硬盘；
但不会立即改变当前系统提示词；
只有在新会话开始，或触发压缩导致提示词重建时，才会重新加载。
```

这个设计非常重要。

它保证了当前会话中的系统提示词前缀不会频繁变化，从而提升 Prompt Caching 的稳定性。

渲染后的记忆区块大致类似这样：

```text
═══════════
MEMORY（你的个人笔记）[67% — 1,474 / 2,200 字符]
═══════════

用户的项目是一个位于 ~/code/myapi 的 Rust Web 服务，使用 Axum + SQLx

§

这台机器运行 Ubuntu 22.04，安装了 Docker 和 Podman

§

用户喜欢简洁回复，讨厌冗长解释
```

---

## 四、Hermes 记忆设计的几个关键细节

Hermes 的提示词记忆设计有几个非常值得借鉴的细节。

### 1. 使用字符限制，而不是 Token 限制

Hermes 使用字符数控制记忆容量，而不是 Token 数。

这样做的好处是：记忆系统与具体模型无关。

不同模型的分词方式不同，如果使用 Token 限制，就需要依赖特定模型的 Tokenizer。使用字符限制则简单、稳定、可移植。

### 2. 使用简单的纯文本格式

记忆条目之间使用 `§` 分隔。

没有复杂的向量数据库，没有自定义二进制结构，也没有过度工程化的存储系统。

这让记忆文件可读、可编辑、可调试。

### 3. 严格控制系统提示词空间

Hermes 非常重视系统提示词的稳定性和成本。

它不会把所有历史都塞进提示词，而是只保留最有价值的事实。

### 4. 记忆是"精选状态"，不是"流水账"

这是 Hermes 和 OpenClaw 最大的区别之一。

OpenClaw 更接近 Markdown 中心化存储，容易把大量过程记录、任务进度和长期文件当作事实来源。

Hermes 则更克制。

它倾向于保存：

```text
用户偏好
环境事实
稳定规范
反复出现的错误修正
长期有效的工作方式
```

但不倾向于保存：

```text
任务进度
临时 TODO
一次性会话结果
短期上下文
过程性流水账
```

Hermes 的目标不是"记住更多"，而是"只记住最值得常驻的内容"。

---

## 五、memory 工具：添加、替换与删除

Hermes 通过 `memory` 工具管理 `MEMORY.md` 和 `USER.md`。

这个工具主要支持三种操作：

```text
add：添加记忆
replace：替换记忆
remove：删除记忆
```

其中一个实用设计是：`replace` 和 `remove` 支持子字符串匹配。

这意味着你不需要记住某条记忆的内部 ID，只需要提供该条目中一段唯一文本，系统就可以定位并修改它。

此外，Hermes 还会做安全检查。

它会拒绝完全重复的内容，并拦截可能包含风险的信息，例如：

```text
提示词注入
凭证泄露
隐藏 Unicode 字符
恶意指令
```

这说明 Hermes 并不只是"把内容写进文件"，而是在记忆写入环节就加入了安全边界。

---

## 六、第二层：session_search 历史会话检索

如果说 `MEMORY.md` 和 `USER.md` 是 Hermes 的"热记忆"，那么 `session_search` 就是它的"长尾回溯系统"。

Hermes 会将过去的会话存储在 SQLite 数据库中，并建立完整的索引和搜索能力。

当模型需要回忆过去讨论过的内容时，它不会直接翻 `MEMORY.md`，而是通过 `session_search` 检索历史会话。

工作流程大致如下：

```text
1. 在历史消息中进行全文搜索
2. 按会话对结果分组
3. 加载匹配度最高的会话
4. 使用一个低成本辅助模型总结相关内容
5. 将精炼后的回顾结果返回给主模型
```

这是一种非常务实的设计。

它比把完整历史塞进每一次提示词中更便宜，也更高效。

更重要的是，它把"常驻记忆"和"偶发回忆"区分开了。

常驻记忆负责高频事实，历史检索负责低频上下文。

---

## 七、第三层：压缩与 Memory Flush

长对话会带来一个常见问题：上下文越来越长，成本越来越高，模型也越来越难抓住重点。

Hermes 会在会话变长时，对中间部分进行压缩。

但压缩是有损的。

一旦旧对话被压缩，某些重要事实就可能丢失。

为了解决这个问题，Hermes 在压缩之前会执行一次"记忆冲刷"，也就是 Memory Flush。

在压缩前，系统会提醒模型：

```text
会话即将被压缩，请保存任何值得长期记住的内容。
优先保存用户偏好、修正建议和重复模式，而不是具体任务细节。
```

然后 Hermes 会运行一次额外的模型调用，并且只开放 memory 工具。

如果模型判断有内容值得保存，它就会在对话被压缩前，把这些内容写入 `MEMORY.md` 或 `USER.md`。

这个设计非常关键。

它相当于在上下文被清洗之前，让模型主动挑选哪些内容应该进入长期记忆。

---

## 八、第四层：作为程序记忆的 Skills

Hermes 不只记住事实，也记住"如何做事"。

这就是 Skills 系统。

Skills 存储在：

```text
~/.hermes/skills/
```

当 Hermes 发现一个复杂流程、修复了一个棘手问题，或者总结出一套更好的操作方法时，可以将它保存为 Skill。

这类记忆可以理解为"程序记忆"。

大多数记忆系统只关注语义记忆，例如：

```text
名字
偏好
身份
事实
历史对话
```

但真正的 Agent 不只需要知道"发生过什么"，还需要知道"下次应该怎么做"。

Skills 就解决了这个问题。

为了效率，Hermes 不会把所有技能内容都塞进系统提示词，而是只注入技能索引。

当某个任务需要用到对应技能时，再按需加载具体技能内容。

这与 `session_search` 的思路一致：

```text
索引常驻，内容按需加载。
```

---

## 九、第五层：Honcho 深层用户建模

Hermes 还支持可选的 Honcho 层。

如果本地记忆像 Hermes 的笔记本，那么 Honcho 更像一个跨平台、跨设备的用户模型系统。

它可以帮助 Agent 建立更深层的用户画像，并在不同环境中保持记忆连续性。

Honcho 的设计重点同样围绕 Prompt Caching。

它的集成方式很巧妙：

```text
会话第一轮：Honcho 上下文织入系统提示词；
后续轮次：Honcho 回溯内容附加在当前用户消息后，而不是修改系统提示词。
```

这样既能让 AI 读取最新用户背景，又不会频繁改变系统提示词前缀。

换句话说，Honcho 既提供了更深的用户建模能力，又尽量不破坏缓存稳定性。

---

## 十、Hermes 与 OpenClaw 的核心区别

Hermes 和 OpenClaw 的最大区别，在于它们对"记忆应该放在哪里"的理解不同。

OpenClaw 更接近：

```text
以 Markdown 文件为中心的记忆系统
```

它倾向于把长期文件、日志、任务状态和事实记录放在 Markdown 中，让文件本身成为主要事实来源。

这种方式直观、简单，但容易出现一个问题：

```text
记忆越来越像流水账，提示词越来越臃肿。
```

Hermes 的思路则更工程化：

```text
提示词记忆严格限量；
历史会话进入 SQLite；
需要时再通过 session_search 检索；
技能只注入索引；
复杂用户建模交给 Honcho。
```

它的核心判断是：

```text
不是所有信息都配进入系统提示词。
```

系统提示词是黄金地段，只应该放最稳定、最高频、最有价值的信息。

---

## 十一、Hermes 做对了什么？

Hermes 的记忆系统最值得总结的地方有三点。

### 1. 冷热分离

Hermes 把记忆分成不同温度：

```text
热记忆：MEMORY.md / USER.md，常驻提示词
温记忆：Skills 索引，常驻但轻量
冷记忆：SQLite 历史会话，按需搜索
深层记忆：Honcho，跨会话用户建模
```

这让不同类型的信息进入不同层级，而不是混在一个大记忆池里。

### 2. 缓存优先

Hermes 清楚意识到：频繁改动系统提示词，会导致缓存失效、延迟增加、成本上升。

因此它宁愿限制常驻记忆容量，也要保持提示词稳定。

这是一种非常成熟的工程取舍。

### 3. 承认记忆是多类型的

Agent 的记忆不是单一概念。

它至少包括：

```text
用户画像
长期偏好
环境事实
历史会话回溯
程序技能
上下文压缩前的关键事实
跨平台用户建模
```

Hermes 没有试图用一种存储方式解决所有问题，而是为不同记忆类型设计了不同位置。

---

## 十二、对 AI Agent 记忆系统的启发

Hermes 的记忆系统给我们一个非常重要的启发：

```text
记忆系统最难的不是存多少，而是什么时候该记、什么时候该忘、应该放在哪一层。
```

很多 Agent 之所以越用越混乱，是因为它们把临时上下文、长期偏好、任务状态、历史结果和操作经验混在一起。

结果就是：

```text
记忆越来越多
提示词越来越长
缓存命中越来越差
模型越来越容易跑偏
成本越来越高
```

Hermes 的方案不是堆更大的向量库，也不是无限扩展系统提示词，而是把记忆分层治理。

这才是 Agent 长期运行时真正需要的能力。

---

## 十三、总结

Hermes Agent 的记忆系统最值得学习的，不是某一个具体文件，也不是某一个工具调用，而是它背后的设计哲学：

```text
不要试图让 AI 记住一切。
要让它在正确的层级，以正确的成本，记住正确的事情。
```

它通过四类机制实现这一点：

```text
MEMORY.md / USER.md：保存最稳定、最高频的提示词记忆
session_search：保存可检索的历史会话回溯
Skills：保存可复用的程序记忆
Honcho：支持更深层的用户建模
```

Hermes 修正了 OpenClaw 的一个关键误区：

```text
记忆不是越多越好；
系统提示词也不是所有信息都应该进入的地方。
```

真正成熟的 Agent 记忆系统，应该遵循三个原则：

```text
冷热分离
缓存优先
按需检索
```

Hermes 的设计证明了一点：

记忆的目的不是让 Agent 看起来无所不知，而是让它在长期使用中更稳定、更便宜、更符合用户习惯，也更不容易被无关历史拖累。

真正的诀窍不是记住更多，而是在合适的位置，记住真正有用的东西。
