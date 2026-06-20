---
title: "如何写好 Skill：终极实战经验手册"
date: "2026-06-17"
summary: "如何写好 Skill 终极实战手册（基于腾讯程序员团队经验 + Anthropic 官方做法）：Skill 本质是结构化 Prompt Engineering（SKILL.md + scripts + references + assets），Anthropic 渐进式加载 3 层机制（Level 1 元数据常驻 50-150 Token / Level 2 SKILL.md 触发加载 ≤500 行 / Level 3 脚本按需），5 类典型场景（代码迁移 / 代码审查 / 写文档 / 项目初始化 / 自动化测试），6 个核心技巧（Description 决定触发 / 开头讲清目标 / 祈使句+解释为什么 / Before vs After 对比 / Few-Shot 多示例 / 决策树流程图），模块化拆分原则（>500 行就拆 / 主 Skill 编排子 Skill / 单一职责），与 Rule 的本质区别（Rule 是底线全局约束 / Skill 是按需触发的能力包），12 类反模式，13 项检查清单，5 类常见错误与排查，4 步发布流程。"
tags:
  - hermes
  - Skill
  - Prompt Engineering
  - 写作规范
  - Anthropic
  - 最佳实践
status: draft
lang: zh
topic: hermes
englishSummary: "Ultimate handbook on writing Skills (based on Tencent programmer team experience + Anthropic official practices): Skills are structured Prompt Engineering (SKILL.md + scripts + references + assets), Anthropic's progressive loading 3-level mechanism (Level 1 metadata resident 50-150 Token / Level 2 SKILL.md triggered ≤500 lines / Level 3 scripts on-demand), 5 typical scenarios (code migration / code review / doc writing / project init / automated testing), 6 core techniques (Description drives trigger / clear goal upfront / imperative + why explanation / Before vs After comparison / Few-Shot examples / decision tree flowchart), modular split principles (>500 lines → split / main Skill orchestrates sub-Skills / single responsibility), essential difference from Rules (Rule = global constraint / Skill = on-demand capability), 12 anti-patterns, 13-item checklist, 5 common errors & troubleshooting, 4-step publishing process."
---

# 如何写好 Skill：终极实战经验手册

> 原文出处：腾讯程序员 / 腾讯技术工程（作者：jackjchou）
>
> 本文把我们写 Skill 踩过的坑、总结出的经验，再加上 Anthropic 官方的一些好做法，整理到了一起。希望能帮你少走弯路，把团队积累的知识真正"喂"给 AI，让它干活更靠谱。本文示例以 Go 语言为主，兼顾 Python、Java 等语言，所有原则和技巧适用于任何编程语言。

## 阅读建议

文章比较长，不同背景的读者可以按需跳读：

| 你的情况 | 推荐阅读路径 |
|---|---|
| **从没写过 Skill，想快速上手** | 一 → 二（重点看 2.5 Quick Start）→ 三 → 八 |
| **写过但效果不好，想提升质量** | 三 → 五 → 十二（反模式）→ 十三（检查清单） |
| **负责团队 Skill 规范和管理** | 四 → 七 → 十一 → 十二 |
| **想了解 MCP 和外部服务集成** | 六 |
| **Skill 跑不通，想排查问题** | 九 → 十 |

---

## 一、先搞清楚 Skill 是什么

### 1.1 Skill 到底是啥

说白了，Skill 就是给 AI 编程助手（Claude Code、CodeBuddy 等）"加装"的能力包。本质上，它是一种**结构化的 Prompt Engineering**——通过标准的文件格式，把分散在人脑中的领域知识、操作流程和最佳实践，转化为 AI 可理解、可执行的指令集。

物理上看，它就是一个文件夹，里面放一个 `SKILL.md` 文件，再加上一些可选的脚本和参考资料。核心就三样东西：

- **指令（Instructions）**：告诉 AI 该怎么干活，按什么步骤来
- **上下文（Context）**：给 AI 补课，告诉它你的项目背景、团队规范这些它不可能凭空知道的东西
- **工具（Tools）**：一些辅助脚本、配置模板，AI 可以直接拿来用

打个比方：裸着的 AI 就像一个刚入职的新人，啥都得问；装了 Skill 之后，就像拿到了老员工整理的操作手册，照着就能干。

### 1.2 为什么要写 Skill

做过项目的人都有体会，以下这些问题经常遇到：

| 痛点 | 实际表现 | Skill 怎么解决 |
|---|---|---|
| **知识太散** | 经验藏在 TAPD、Wiki、代码注释、甚至某个人的脑子里 | 全部整理进 Skill，将知识结构化封装为标准技能包 |
| **重复搬砖** | 同样的活反复干，每次都要手动来一遍 | 写成 Skill 让 AI 自动跑 |
| **做出来的东西不统一** | 张三做一个样，李四做另一个样 | 用 Skill 固定流程，谁来做都一个标准 |
| **新人上手慢** | 来个新人得教半天，对方还不一定记得住 | Skill 本身就是最好的培训材料 |
| **人走知识也走** | 核心成员一离职，很多"部落知识"就没了 | 把经验沉淀进 Skill，知识完整留存 |

### 1.3 Skill 怎么运作的

> ⚠️ 以下加载机制以 Claude Code 为参考。不同 AI 编程工具（CodeBuddy、Cursor 等）的 Skill 加载策略可能有差异，请以各平台官方文档为准。

Anthropic 设计了一个"渐进式加载"机制，分成三层：

```text
Level 1: 元数据（name + description）   → 始终驻留在 AI 上下文中
Level 2: SKILL.md 主体                  → Skill 被匹配触发时加载
Level 3: 附带的脚本和参考资料           → 执行过程中按需引用
```

**各层的作用和约束**：

| 层级 | 加载时机 | 内容要求 | Token 成本参考 |
|---|---|---|---|
| **Level 1** | 常驻（每次对话都在） | name + description，控制在 100 字以内 | 约 50-150 Token / 个 Skill |
| **Level 2** | 匹配触发时一次性加载 | SKILL.md 正文，建议不超过 500 行 | 约 2,000-5,000 Token |
| **Level 3** | 执行中按需读取 | 脚本、参考文档、模板等 | 按实际引用大小计算 |

为什么要关注 Token 成本？因为 **Skill 不是免费的**——每加载一个 Skill 都会占用上下文窗口。假设你装了 20 个 Skill，光 Level 1 就要吃掉 1,000-3,000 Token；如果 AI 一次触发了 2 个 Skill，Level 2 又要再加 4,000-10,000 Token。上下文越满，AI 的注意力越分散，回答质量反而可能下降。

**如何估算 Skill 的 Token 消耗**：

- 英文：约 1 Token / 4 字符
- 中文：约 1 Token / 1.5-2 字符
- 在线工具：[OpenAI Tokenizer](https://platform.openai.com/tokenizer)

> ⚠️ 以上数据基于 Claude tokenizer 估算，不同模型（GPT-4、Gemini 等）的 tokenizer 实现不同，实际消耗会有 ±20% 的差异。

**核心原则：Level 1 越精准越好（决定触发时机），Level 2 越精简越好（减少 Token 消耗），Level 3 放心放（按需加载不占常驻空间）**。

**Skill 的触发模式**：

| 触发模式 | 说明 | 典型场景 |
|---|---|---|
| **自动触发** | AI 根据 description 语义匹配，自动决定是否加载 | 用户正常提问，AI 判断相关则触发 |
| **手动触发** | 用户主动通过命令（如 `/skill xxx`）指定使用 | 需要精确控制使用哪个 Skill 时 |
| **规则触发** | 基于文件类型、目录、特定操作等条件自动触发 | 打开 `.go` 文件时自动加载 Go 相关 Skill |

### 1.4 Skill 能用在哪些场景

| 场景 | 举例 |
|---|---|
| **代码迁移/改造** | 框架升级、换 API、架构重构这些 |
| **代码审查** | 按团队规范自动跑一遍 Review，直接出报告 |
| **写文档** | 按固定格式生成 API 文档、使用说明等 |
| **项目初始化** | 按团队模板一键搭好项目骨架、配好 CI/CD |
| **自动化测试** | 根据接口定义自动生成测试用例 |
| **数据处理** | 数据库变更、Excel 分析、日志解析这些体力活 |

---

## 二、Skill 长什么样

### 2.1 最基本的样子

最简版的 Skill 就是一个文件夹加一个 `SKILL.md`：

```text
my-skill/
└── SKILL.md          # 核心配置文件（必需）
```

如果场景复杂一些，可以加更多东西进去：

```text
my-skill/
├── SKILL.md              # 核心指令文件（必需）
├── scripts/              # 可执行脚本（可选）
│   ├── check.sh
│   └── transform.py
├── references/           # 参考文档（可选）
│   ├── api-spec.md
│   └── style-guide.md
└── assets/               # 静态资源（可选）
    └── template.json
```

### 2.2 SKILL.md 里面写什么

`SKILL.md` 分两部分：上面是一段 **YAML 头信息**（告诉系统这个 Skill 叫什么、干什么），下面是 **Markdown 正文**（具体的指令和说明）。

**YAML 头信息部分**（放在文件最上面）：

```yaml
---
name: my-skill-name           # 必需：唯一标识符，小写，用连字符分隔
description: >                 # 必需：清晰描述功能和触发场景
  将项目中的旧版 HTTP 客户端迁移到新版统一请求库。
  适用于 Go 项目中使用了 old-http-client 模块，
  需要替换为 unified-httpclient 的场景。
license: MIT                   # 可选：许可证
metadata:                      # 可选：扩展元数据
  author: TeamName
  version: "1.0"
---
```

> 💡 **关于 description 的语言**：建议用中文编写（如果团队和 AI 工具主要使用中文对话），也可以中英双语，以提高触发匹配率。

**Markdown 正文部分**（参考模板）：

```markdown
# Skill 名称

## 概述
描述 Skill 的目的、适用场景和核心价值。

## 前置条件
执行前需要满足的条件和检查步骤。

## 处理步骤
### Step 1: xxx
### Step 2: xxx

## 代码示例
Before/After 对比或 Few-Shot 示例。

## 验证清单
- [ ] 检查项 1
- [ ] 检查项 2

## 常见问题
### Q: xxx？
A: xxx

## 相关 Skill
- [相关 Skill 名称](链接)
```

### 2.3 放在哪里

Skill 放的位置不同，生效范围也不同：

| 位置 | 路径 | 作用范围 |
|---|---|---|
| **用户级** | `~/.claude/skills/` 或 `~/.codebuddy/skills/` | 所有项目 |
| **项目级** | `项目根目录/.claude/skills/` 或 `.codebuddy/skills/` | 当前项目 |

不同工具的路径可能不同，这里只是示意，以使用工具的官方文档为准。为什么要强调生效范围，主要原因还是刚才提到的按需加载。

### 2.4 Skill 和 Rule 有什么区别

刚接触的同学经常把 Skill 和 Rule 搞混。简单说：**Rule 是"底线"，Skill 是"技能"**。

| 维度 | Rule | Skill |
|---|---|---|
| **定位** | 全局约束，始终生效 | 按需触发的能力包 |
| **加载方式** | 每次对话都自动加载 | 匹配用户意图时才加载 |
| **典型内容** | 编码规范、安全红线、代码风格 | 迁移流程、审查模板、项目初始化 |
| **长度** | 宜短（始终占用上下文） | 可长（触发时才占用） |
| **触发条件** | 无需触发，始终生效 | 依赖 description 匹配 |
| **文件格式** | `.md`，放在 rules 目录 | `SKILL.md`，放在 skills 目录 |

**选择建议**：

- 所有对话都该遵守的（如"SQL 必须参数化"、"提交信息用英文"）→ 写 Rule
- 特定任务才需要的（如"从 v2 迁移到 v3"、"生成 API 文档"）→ 写 Skill

### 2.5 Quick Start：5 分钟写出你的第一个 Skill

光看理论容易犯困，先跟着做一个最小可用的 Skill 感受一下。以"自动生成 Go 单元测试"为例：

**第一步**：创建目录和文件

```bash
mkdir -p ~/.codebuddy/skills/go-test-gen
touch ~/.codebuddy/skills/go-test-gen/SKILL.md
```

**第二步**：写入以下内容

```yaml
---
name: go-test-gen
description: >
  为 Go 函数自动生成表驱动的单元测试。
  当用户要求编写测试、生成测试用例或补充单测时触发。
  适用于所有 Go 项目。
metadata:
  version: "1.0"
---

# Go 单元测试生成

## 目标
为指定的 Go 函数生成表驱动（table-driven）风格的单元测试。

## 规则
1. 使用 `testing` 标准库，不引入第三方测试框架
2. 测试函数命名为 `TestXxx`，与被测函数对应
3. 使用 `t.Run` 子测试 + 表驱动模式
4. 覆盖：正常输入、边界值、错误输入 三类场景

## 示例

**输入函数**：

```go
func Add(a, b int) int {
    return a + b
}
```

**生成的测试**：

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positive numbers", 1, 2, 3},
        {"zero values", 0, 0, 0},
        {"negative numbers", -1, -2, -3},
        {"mixed signs", -1, 1, 0},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := Add(tt.a, tt.b); got != tt.want {
                t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.want)
            }
        })
    }
}
```

## 验证

```bash
go test ./... -v -run TestXxx
```
```

**第三步**：试一试

在对话中输入："帮我为 `pkg/utils/math.go` 里的函数写单元测试"——AI 应该会自动触发这个 Skill。

这就是一个完整的 Skill。后面的章节会教你如何把它写得更好。

---

## 三、写出好 Skill 的关键技巧

> 💡 **开始写之前，先想清楚一件事**：你的 Skill 是一件事还是好几件事？如果内容预计会超过 500 行，或者包含多个独立的工作流程，建议先看"模块化"章节，想好结构再动笔。磨刀不误砍柴工。

### 3.1 Description 写好了，一切就成功了一半

Description 这个字段太重要了。AI 就是靠它来判断"用户现在说的这个事，该不该用这个 Skill"。写得太笼统，AI 不知道啥时候该用；写得太窄，很多该触发的场景又漏了。

**反面案例** ❌：

```yaml
description: 处理代码迁移
```

**正面案例** ✅：

```yaml
description: >
  将项目中的旧版 HTTP 客户端迁移到新版统一请求库。
  适用于 Go 项目中使用了 old-http-client 模块，
  需要替换为 unified-httpclient 的场景。
  包含 import 路径替换、请求参数适配和错误处理改造。
```

**一个实用的小技巧**："触发评估"：你可以自己想 20 个问题（一半该触发、一半不该触发），然后测试一下 AI 是不是每次都能正确判断。如果命中率不够高，就回来调 description。

### 3.2 开头就说清楚：做什么、为什么、要不要做

别让 AI 猜你的意图。每个 Skill 上来就该把三件事说明白：**做什么、为什么、怎么判断是否需要做**。

**反面案例** ❌：

```markdown
# API 对接
把旧的 API 调用改成新的。
```

**正面案例** ✅：

```markdown
## 目标
将项目中的 HTTP 请求从 `old-http-client` 迁移到 `unified-httpclient`，实现统一的请求层管理。

## 适用判断
执行前检查项目是否使用了旧版客户端：

```bash
grep "old-http-client" go.mod
```

如果**未使用**该模块，可跳过此 Skill。
```

几个要点：

1. **把起点和终点说清楚**——从哪迁到哪，别含糊
2. **告诉 AI 什么时候不用做**——给个前置检查条件，及时跳过
3. **给出具体的检查命令**，而非模糊描述

### 3.3 用祈使句下指令，解释"为什么"

写 Skill 的时候有两个原则特别管用：

**第一，别用商量的口吻，直接说"做什么"**

```markdown
# ❌ 不推荐
你应该检查 Go 版本，然后你需要选择合适的方案。

# ✅ 推荐
检查 Go 版本。根据版本号选择对应方案：
- Go < 1.18 → 使用 interface{} 做泛型替代
- Go >= 1.18 → 使用原生泛型（type parameters）
```

**第二，与其一堆"MUST"，不如讲清楚为什么**

```markdown
# ❌ 不推荐
必须使用参数化查询。绝对不能拼接字符串。必须验证所有输入。

# ✅ 推荐
使用参数化查询而非字符串拼接来构建 SQL。字符串拼接会导致 SQL 注入漏洞——攻击者可以通过输入 `'; DROP TABLE users; --` 来删除整张表。
```

AI 要是理解了背后的道理，遇到你没想到的情况也能做出合理判断。光靠"MUST"只是死记硬背，换个场景就傻了。

### 3.4 给出"改之前 vs 改之后"的对比

这是 Skill 中最关键的部分——让 AI 清楚知道"改什么"和"改成什么"。

**方式一：注释标注（适合简单变更）**

```go
// Before
import oldhttp "github.com/example/old-http-client"
// After
import uhttp "github.com/example/unified-httpclient"
```

**方式二：完整文件对比（适合复杂变更）**

```go
// Before (pkg/request/client.go)
package request
import oldhttp "github.com/example/old-http-client"
func MakeRequest(service, action string, data map[string]interface{}) (*oldhttp.Response, error) {
    return oldhttp.Do(&oldhttp.Request{Service: service, Action: action, Data: data})
}

// After (pkg/request/client.go)
package request
import uhttp "github.com/example/unified-httpclient"
func MakeRequest(service, action string, data map[string]interface{}) (*uhttp.Response, error) {
    return uhttp.Do(&uhttp.Request{Service: service, Action: action, Data: data})
}
```

**方式三：Diff 格式（推荐，最直观）**

```diff
--- a/pkg/request/client.go
+++ b/pkg/request/client.go
@@ -3,7 +3,7 @@ package request
-import oldhttp "github.com/example/old-http-client"
+import uhttp "github.com/example/unified-httpclient"

-    return oldhttp.Do(
+    return uhttp.Do(
```

### 3.5 Few-Shot，多给几个例子，AI 就不会瞎发挥

经验之谈：在 Skill 里放 3-5 个高质量的输入/输出示例，AI 的表现会稳定很多。光靠文字描述，AI 可能理解偏了；但给了具体的示例，它就知道"哦，原来你要的是这个效果"。

**几个关键原则**：

- **覆盖典型场景**：正常情况、边界情况、错误情况各来一个
- **输入输出成对出现**：每个示例都要有"给什么"和"出什么"
- **示例之间有差异**：别搞 3 个长得差不多的，要能展示不同的处理分支
- **先放最典型的**：AI 会更倾向于模仿前面的示例，把最常见的场景放第一个

### 3.6 善用可视化：决策树与流程图

现实中很多任务不是一条路走到底的，可能有好几种情况。这时候用表格或者流程图把不同情况列出来，AI 就不容易搞混。

复杂流程光靠文字描述，不管是人还是 AI 都容易看晕。画个 ASCII 图有这些好处：

- 整个流程一目了然，不用在脑子里"编译"
- 分支判断看得清清楚楚
- AI 读图比读长段文字理解得更准确
- 纯文本格式，不需要什么画图工具

---

## 四、Skill 太长了怎么办——拆（模块化）

### 4.1 什么时候该拆

一个 Skill 干一件事，这是最理想的状态。但如果你发现以下情况，就该考虑拆分了：

- 文件写着写着超过 500 行了（Anthropic 建议的上限）
- 包含多个可独立的工作流程
- 有些步骤可以单独用，没必要每次都把整个 Skill 跑一遍
- 不同部分改动频率差很多，一个月改三次另一个半年不动

### 4.2 拆成什么样——模块化设计

**简单场景：一个文件搞定**

```text
my-skill/
└── SKILL.md  # 所有内容在一个文件
```

**复杂场景：拆成主 Skill + 子 Skill**

```text
project-migration/                  # 主 Skill：流程总览与编排
├── SKILL.md
└── steps/                          # 拆分出的子步骤文档，主 SKILL.md 按顺序引用
    ├── 00-environment-setup.md
    ├── 01-dependency-update.md
    └── 02-api-migration.md

project-migration-sub-env-setup/    # 子 Skill：可独立调用
├── SKILL.md
└── scripts/
    └── check-env.sh

project-migration-sub-api-migrate/  # 子 Skill：可独立调用
├── SKILL.md
└── references/
    └── api-mapping.json
```

### 4.3 主 Skill 如何编排子 Skill

拆出来了，主 SKILL.md 里怎么写才能让 AI 按顺序跑？下面是一个主 Skill 编排子步骤的示例：

```markdown
## 执行流程
按以下顺序依次执行各子步骤，**每个步骤完成后运行其验证命令确认无误再继续**：

### Step 1: 环境初始化
读取并执行 [环境初始化](steps/00-environment-setup.md) 中的所有步骤。

**检查点**：

```bash
bash scripts/check-env.sh
```

### Step 2: 依赖更新
读取并执行 [依赖更新](steps/01-dependency-update.md) 中的所有步骤。

**检查点**：

```bash
go mod tidy && go build ./...
```

### Step 3: API 迁移
读取并执行 [API 迁移](steps/02-api-migration.md) 中的所有步骤。

**检查点**：

```bash
grep -rn "old-http-client" . --include="*.go" | wc -l
# 预期输出：0
```

## 注意事项
- 如果某个步骤的检查点未通过，**停止后续步骤**，先修复当前问题
- 每个子步骤也可以独立使用，无需跑完整个流程
```

### 4.4 拆分的几个原则

**原则一：一个子 Skill 只管一件事（单一职责）**

别搞"大而全"，每个子 Skill 专注做好一件事就行：

| 子 Skill | 职责 | 可独立使用 |
|---|---|---|
| `env-setup` | 环境初始化与依赖配置 | ✅ |
| `api-migration` | API 调用层迁移 | ✅ |
| `config-transform` | 配置文件格式转换 | ✅ |
| `test-adaptation` | 测试用例适配 | ✅ |

**原则二：把依赖关系写明白**

子 Skill 之间有先后顺序的，在文档里写清楚，别让 AI 猜：

```markdown
## 前置条件
**⚠️ 重要**：执行本步骤之前，必须先完成 **环境初始化** 环节。

## 相关 Skill
- 前置：[project-migration-sub-env-setup](../project-migration-sub-env-setup/SKILL.md)
- 后续：[project-migration-sub-test-adaptation](../project-migration-sub-test-adaptation/SKILL.md)
```

**原则三：每个子 Skill 都能单独使用**

拆出来的子 Skill 不应该离了主流程就没法跑。

---

## 五、进阶写法

### 5.1 能用表格就用表格

AI 读表格比读大段文字准确得多。能结构化的信息，尽量用表格呈现。

### 5.2 善用代码块标注语言

```go
// 明确标注语言类型，AI 渲染更准确
```

### 5.3 用代码块的标题组织章节

不要写大段文字，多用：

```markdown
## 标题
### 子标题
```

让 AI 能快速定位章节。

---

## 六、MCP 集成

### 6.1 Skill 怎么调用 MCP

有些任务需要调用外部服务（GitHub、数据库、CI/CD 等），这时可以通过 MCP（Model Context Protocol）让 Skill 拥有调用外部工具的能力。

### 6.2 集成方式

```yaml
# SKILL.md 中声明依赖的 MCP 服务
---
name: my-skill
description: ...
required_mcps:
  - github
  - postgres
---
```

### 6.3 调用示例

在 Skill 正文中明确告诉 AI 怎么调用：

```markdown
## 工具调用
当需要查询 Issue 时，使用 `github:list_issues` 工具，传入仓库名。
当需要插入数据时，使用 `postgres:execute_sql` 工具。
```

---

## 七、Skill 仓库管理

### 7.1 目录结构

团队共享的 Skill 仓库通常这样组织：

```text
team-skills/
├── README.md
├── backend/
│   ├── go-microservice/
│   ├── api-migration/
│   └── db-migration/
├── frontend/
│   ├── react-component/
│   └── vue-template/
└── devops/
    ├── ci-setup/
    └── deploy/
```

### 7.2 版本管理

每个 Skill 都应该有版本号：

```yaml
metadata:
  version: "1.2.0"
```

遵循 semver：

- MAJOR：不兼容改动
- MINOR：向后兼容的新功能
- PATCH：向后兼容的 bug 修复

### 7.3 权限与共享

- 用户级 Skill：自己用
- 项目级 Skill：当前项目用
- 团队级 Skill：通过 Git 仓库共享

---

## 八、常见反模式

写 Skill 容易踩的坑：

| 反模式 | 表现 | 后果 |
|---|---|---|
| **Description 太短** | 只有一两个词 | AI 不知道何时触发，命中率低 |
| **Description 太长** | 把所有细节塞进 description | 浪费常驻 Token 预算 |
| **指令用商量的口吻** | "你可以尝试..." | AI 不敢做决定 |
| **没有 Before/After** | 只描述抽象规则 | AI 不知道具体怎么改 |
| **示例太少** | 0-1 个示例 | AI 容易瞎发挥 |
| **示例都是 happy path** | 没有错误场景 | AI 遇到异常不知道怎么办 |
| **Skill 太长不拆** | 1000+ 行单文件 | Token 消耗大、加载慢 |
| **硬编码路径** | `/Users/zhangsan/...` | 别人用不了 |
| **不写验证步骤** | 只给指令不给检查方法 | 改错了不知道 |
| **依赖未声明** | 用了某个工具不告诉 AI | AI 不知道能否用 |
| **中英混杂混乱** | 同一概念多种说法 | AI 困惑 |
| **没写何时不用** | 没有"适用判断" | AI 过度触发 |

---

## 九、检查清单

发布 Skill 前过一遍：

- [ ] name 用 kebab-case（小写 + 连字符）
- [ ] description 控制在 100 字以内但足够精准
- [ ] 开头讲清"做什么 / 为什么 / 何时不用"
- [ ] 关键指令用祈使句
- [ ] 每个"MUST"都解释了"为什么"
- [ ] 给了 Before / After 对比
- [ ] 至少有 2-3 个 Few-Shot 示例
- [ ] 复杂流程画了流程图
- [ ] SKILL.md 正文 ≤ 500 行
- [ ] 没有硬编码路径
- [ ] 写了验证清单
- [ ] 常见问题覆盖了主要场景
- [ ] 元数据（author / version / license）齐全

---

## 十、常见错误与排查

### 10.1 Skill 没触发

- description 太笼统 → 写更具体的触发场景
- description 用词与用户提问不一致 → 用用户常用的词描述
- 路径放错了 → 检查 ~/.claude/skills/ 还是项目内 .claude/skills/

### 10.2 Skill 触发了但效果差

- 指令太抽象 → 加具体示例
- 没有边界条件 → 加"什么时候不做"
- Few-Shot 太少 → 加到 3-5 个

### 10.3 Token 消耗过大

- Level 1 description 太长 → 精简到 100 字内
- Level 2 SKILL.md 太长 → 拆成主 Skill + 子 Skill
- Level 3 脚本被全文加载 → 改成"按需读取"

### 10.4 AI 不遵守指令

- 用了商量的口吻 → 改成祈使句
- 没解释"为什么" → 补充背后的原理
- 多个相互冲突的指令 → 整理优先级

### 10.5 加载慢或报错

- YAML 格式错误 → 用 YAML 校验器
- 路径含特殊字符 → 改为纯 ASCII
- 权限问题 → 检查文件权限

---

## 十一、版本控制与发布

### 11.1 Git 管理

```bash
cd ~/.claude/skills/
git init
git add .
git commit -m "feat: add go-test-gen skill v1.0"
git tag v1.0.0
```

### 11.2 升级流程

1. 修改 SKILL.md
2. 更新 metadata.version（遵循 semver）
3. 在 CHANGELOG.md 写变更说明
4. 测试触发场景
5. 提交 commit

### 11.3 团队共享

通过 Git 仓库共享：

```bash
git remote add origin https://github.com/your-team/skills.git
git push -u origin main
```

其他成员：

```bash
git clone https://github.com/your-team/skills.git ~/.claude/skills/
```

---

## 十二、总结

写好 Skill 的核心原则：

1. **Description 是灵魂**——决定 AI 是否触发
2. **指令要明确**——祈使句 + 解释为什么
3. **示例要充分**——3-5 个 Few-Shot 覆盖典型场景
4. **对比要直观**——Before/After 让 AI 知道改什么
5. **结构要清晰**——表格 / 流程图 / 章节标题
6. **长度要克制**——Level 2 ≤ 500 行，长的就拆
7. **验证要完整**——每个 Skill 都给检查清单

**Skill 不是 Prompt 的堆砌，而是结构化的领域知识封装**。它的价值不在于字数多少，而在于：

- ✅ 团队经验能否被 AI 准确理解
- ✅ AI 执行结果是否稳定可复现
- ✅ 新人能否通过 Skill 快速上手

掌握这些原则，团队积累的知识就能真正"喂"给 AI，让它干活更靠谱。
