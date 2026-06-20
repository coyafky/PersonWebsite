---
title: "Hermes 的配置优先级"
date: "2026-06-05"
summary: "Hermes 8 层配置优先级链：系统默认 < config.yaml < .env < Profile/Soul/USER < 项目级 < Agent 级 < CLI 参数 < 用户本次明确指令。安全配置（system safety policy > production env safety > agent restrictions > user instruction）单独一条独立通道，始终高于普通配置。给出配置冲突时的 4 个判断原则（安全 / 本次任务 / env 覆盖 / Agent 覆盖项目），以及 config inspect 命令设计。"
tags:
  - hermes
  - 配置优先级
  - 安全
  - 覆盖链
status: draft
lang: zh
topic: hermes
englishSummary: "Hermes 8-layer config priority chain: System default < config.yaml < .env < Profile/Soul/USER < Project < Agent < CLI args < User instruction. Security config (system safety policy > production env safety > agent restrictions > user instruction) runs on a separate channel always above normal config. Provides 4 conflict-resolution principles (safety / current task / env override / agent overrides project) plus a config inspect command design."
---

# Hermes 的配置优先级

可以理解成：

> **越靠近"当前执行任务"的配置，优先级越高；越通用、越底层的配置，优先级越低。**

也就是说，Hermes 不会只看一个配置文件，而是会把多层配置合并后再运行。

---

# 一、推荐理解顺序

从低到高，通常是：

```txt
默认内置配置
  ↓
全局 config.yaml
  ↓
.env 环境变量
  ↓
Profile / Soul / USER 配置
  ↓
项目级配置
  ↓
Agent 级配置
  ↓
命令行参数
  ↓
本次任务显式指令
```

优先级越往下越高。

---

# 二、完整优先级示意

```txt
优先级 8：用户本次明确指令
优先级 7：CLI 命令行参数
优先级 6：Agent 专属配置
优先级 5：项目级配置
优先级 4：Profile / Soul / USER
优先级 3：环境变量 .env
优先级 2：config.yaml
优先级 1：系统默认配置
```

可以把它理解成一个"覆盖链"：

```txt
Default < config.yaml < .env < Project < Agent < CLI < User Instruction
```

---

# 三、每一层分别是什么

## 1. 系统默认配置：最低优先级

这是 Hermes 内部写死的默认值。

例如：

```yaml
runtime:
  mode: cli
  log_level: info
  memory_persistence: true
```

作用是：

> 即使用户什么都没配置，Hermes 也能启动。

但它优先级最低，只要其他地方配置了，就会被覆盖。

---

## 2. `config.yaml`：基础运行配置

`config.yaml` 是 Hermes 的主配置文件。

它通常定义：

```yaml
provider:
  default: openai

runtime:
  mode: cli
  log_level: info

agent:
  skills_dir: ./Skills
  tools_dir: ./Tools

router:
  mode: auto
```

它负责回答：

```txt
Hermes 怎么运行？
用哪些模型？
工具目录在哪里？
是否启用自动路由？
默认 Agent 是谁？
```

但是，如果 `.env` 或命令行参数里有同名配置，`config.yaml` 会被覆盖。

---

## 3. `.env`：环境变量与秘钥配置

`.env` 的优先级通常高于 `config.yaml`。

比如 `config.yaml` 写：

```yaml
provider:
  model: gpt-4o
```

但 `.env` 写：

```env
OPENAI_MODEL=gpt-5.5-thinking
```

如果 `config.yaml` 中引用的是：

```yaml
provider:
  model: ${OPENAI_MODEL}
```

那么最终生效的是：

```txt
gpt-5.5-thinking
```

`.env` 主要管：

```txt
API Key
Base URL
数据库地址
运行环境
工具开关
安全开关
默认模型
```

---

## 4. `SOUL.md / USER.md / Profile.md`：Agent 行为配置

这一层不是纯技术配置，而是"行为配置"。

例如：

```txt
SOUL.md     决定价值观
USER.md     决定用户和项目长期背景
Profile.md  决定 Agent 岗位职责
```

它通常会影响：

```txt
回答风格
任务边界
交付标准
是否主动复盘
是否必须引用来源
是否允许调用某些技能
```

这类配置通常高于基础 `config.yaml`，因为它定义的是某个 Agent 的"工作方式"。

---

## 5. 项目级配置：当前项目优先

如果 Hermes 同时服务多个项目，那么每个项目可以有自己的配置。

例如：

```yaml
project:
  name: lanhui-geo-site
  language: zh-CN
  target_region: China
  default_agent: GEOAgent
  output_style: business-readable
```

它会覆盖通用配置。

比如全局默认语言是英文，但项目配置写中文：

```yaml
language: zh-CN
```

那么该项目里就应该优先中文输出。

---

## 6. Agent 级配置：某个 Agent 自己的规则

不同 Agent 可以有自己的模型、工具、记忆和输出规范。

例如：

```yaml
agents:
  GEOAgent:
    model: qwen-plus
    tools:
      web_search: true
      terminal: false
    output_format: table

  FrontendAgent:
    model: gpt-5.5-thinking
    tools:
      terminal: true
      file_write: true
    output_format: code
```

当某个 Agent 被调用时，它的配置会覆盖项目级配置。

---

## 7. 命令行参数：临时覆盖

命令行参数通常优先级更高。

例如：

```bash
hermes run --agent FrontendAgent --model gpt-5.5-thinking --no-terminal
```

即使 `config.yaml` 中写了：

```yaml
terminal: true
```

命令行里 `--no-terminal` 也应该临时覆盖它。

---

## 8. 用户本次明确指令：最高优先级

这是最高层。

例如你本次说：

```txt
不要联网，只基于已有内容回答。
```

即使 `config.yaml` 里写：

```yaml
web_search: true
```

也应该以你本次指令为准。

---

# 四、用一个例子理解

假设各层配置如下：

## `config.yaml`

```yaml
provider:
  default_model: qwen-plus

tools:
  terminal: true
```

## `.env`

```env
DEFAULT_MODEL=gpt-5.5-thinking
ENABLE_TERMINAL=false
```

## `GEOAgent.md`

```md
默认使用中文输出。
必须结构化回答。
不能执行终端命令。
```

## 命令行

```bash
hermes run --agent GEOAgent --model deepseek-chat
```

## 用户本次指令

```txt
这次请用表格输出，不要调用任何工具。
```

最终生效结果应该是：

```txt
Agent：GEOAgent
模型：deepseek-chat
语言：中文
输出：表格
终端：关闭
工具：不调用
回答方式：结构化
```

---

# 五、配置冲突时怎么判断

Hermes 遇到冲突时，可以按这个原则：

## 1. 安全配置优先

即使用户说：

```txt
允许执行危险命令
```

但系统安全配置写：

```env
ALLOW_DANGEROUS_COMMANDS=false
```

那么应该以安全配置为准。

安全类配置应该拥有特殊优先级。

## 2. 本次任务指令优先

非安全类配置，通常用户本次指令最高。

## 3. 环境变量覆盖静态配置

`.env` 比 `config.yaml` 更接近运行环境。

## 4. Agent 专属配置覆盖项目通用配置

项目配置是大方向，Agent 配置是具体岗位。

---

# 六、安全配置的特殊优先级

严格来说，Hermes 的配置优先级应该分成两条线：

## 普通配置优先级

```txt
默认配置 < config.yaml < .env < 项目配置 < Agent配置 < CLI参数 < 用户本次指令
```

## 安全配置优先级

```txt
系统安全策略 > 生产环境安全配置 > Agent限制 > 用户指令
```

即使用户说：

```txt
直接执行 rm -rf 某个目录
```

Hermes 也不应该执行。

所以更准确地说：

> 用户指令对普通行为最高；
> 系统安全策略对危险行为最高。

---

# 七、推荐的 Hermes 配置合并逻辑

可以这样设计：

```txt
1. 加载系统默认配置
2. 读取 config.yaml
3. 读取 .env，并替换 ${VAR}
4. 加载项目配置 project.yaml
5. 加载目标 Agent Profile
6. 应用 CLI 参数
7. 解析用户本次指令
8. 进行安全策略校验
9. 得到最终运行配置
```

对应流程：

```txt
Default
  ↓
config.yaml
  ↓
.env substitution
  ↓
project config
  ↓
agent profile
  ↓
CLI override
  ↓
user instruction
  ↓
safety guardrails
  ↓
final runtime config
```

---

# 八、建议你在 Hermes 中做一个 `config inspect`

为了排查配置优先级，最好设计一个命令：

```bash
hermes config inspect
```

输出最终生效配置：

```yaml
effective_config:
  provider:
    name: openai
    model: gpt-5.5-thinking
    source: cli

  tools:
    terminal:
      enabled: false
      source: env

  agent:
    name: GEOAgent
    source: cli

  output:
    format: table
    source: user_instruction
```

重点是显示 `source`。

这样你就能知道：

```txt
这个模型是从哪里来的？
这个工具为什么被关闭？
这个 Agent 为什么这样输出？
这个 API Key 从哪里读取？
```

---

# 九、适合你项目的推荐优先级

针对 GEO / 官网 / Agent 团队 场景，建议采用：

```txt
1. Security Policy
2. User Instruction
3. CLI Override
4. Agent Profile
5. Project Config
6. .env
7. config.yaml
8. Default
```

也就是：

```txt
安全策略永远最高；
用户本次任务其次；
Agent 岗位规则高于项目通用规则；
.env 高于 config.yaml；
默认配置最低。
```

---

# 十、一句话总结

Hermes 的配置优先级可以记成：

```txt
安全第一，本次指令第二；
Agent 专属高于项目通用；
.env 高于 config.yaml；
默认配置最低。
```

更工程化的表达是：

```txt
Default
< config.yaml
< .env
< Project Config
< Agent Config
< CLI Args
< User Instruction
< Security Guardrails
```

最终目标不是"谁覆盖谁"这么简单，而是让 Hermes 在不同任务、不同 Agent、不同部署环境下，都能清楚地知道：

```txt
用哪个模型
走哪个 Provider
开哪些工具
读哪些记忆
按什么规则执行
遇到风险如何拦截
```
