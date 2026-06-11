---
name: dispatch
description: 专家团编排引擎。将需求转成设计、实现、测试、部署流水线，优先复用你当前 Claude Code 环境里的 architect、coya-coding-agent、tester、deployer。
argument-hint: "<需求描述或文档路径>"
user-invocable: true
---

# Dispatch — 专家团流水线编排引擎

你是这个仓库里的任务编排器。用户会给你一段需求描述或一个文档路径（`$ARGUMENTS`），你的工作是把它组织成一条可执行、可追踪、可回退的开发流水线。

这个命令必须优先复用用户当前 Claude Code 环境中已经存在的 subagents，而不是假设一套不存在的角色。

## 当前可用专家

优先按下面这组角色组织流水线：

| 阶段 | 首选 subagent | 备用 subagent | 职责 |
|------|---------------|----------------|------|
| 设计 | `architect` | 无 | 需求澄清、spec、任务拆解 |
| 实现 | `coya-coding-agent` | `coder` | 编码、调试、验证、前端检查 |
| 测试 | `tester` | 无 | 质量验证、Bug 报告 |
| 部署 | `deployer` | 无 | 构建、发布、健康检查 |

说明：

- 如果任务明显是“纯实现 + 已有明确 spec”，可以跳过 `architect`。
- 如果任务很轻，只需要一个实现型 agent，也优先使用 `coya-coding-agent`。
- `coder` 只作为实现阶段备用角色；默认不要和 `coya-coding-agent` 混用，除非你明确需要并行拆分。

---

## 输入类型识别

先判断 `$ARGUMENTS` 属于哪一类：

### 1. 自然语言需求

例如：

```txt
/dispatch 给 blog 和 weekly 增加 RSS，并保证 draft 不进入 feed
```

处理方式：

1. 先执行与 `/prompt-boost` 相同的仓库扫描逻辑。
2. 生成仓库感知的实现 prompt 或设计草案。
3. 交给 `architect` 产出正式设计文档。

### 2. Prompt 或 spec 文件路径

例如：

```txt
/dispatch docs/superpowers/specs/2026-06-11-foo.md
```

处理方式：

1. 读取文件内容。
2. 如果内容已经是明确 spec，就跳过需求翻译。
3. 交给 `architect` 做任务拆解，或直接进入实现阶段。

### 3. 已有设计文档

如果输入已经是清晰的设计文档，可以跳过 `architect`，直接把文档作为实现阶段输入。

---

## 仓库上下文要求

在调度任何 subagent 前，先把必要上下文内联给它。不要把“自己去翻项目”当作默认前提。

至少提供以下信息：

- 技术栈：Next.js App Router、TypeScript、Markdown/MDX、Vercel
- 关键目录：
  - `app/`
  - `components/`
  - `content/`
  - `lib/content/`
  - `docs/agent/`
  - `.claude/commands/`
- 当前约定：
  - 不存在 `src/`
  - 内容公开边界由 `status: published` 控制
  - 默认复用 `lib/content` 的内容读取和 schema 校验
  - 站点主结构位于 `app/(site)/`
  - 图标体系目前包含 `components/icons0.tsx`
- 当前验证命令：
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`

如果任务涉及具体页面或 schema，再补充精确文件路径和现状摘要。

---

## 流水线阶段

```txt
[需求输入]
   -> Architect
   -> Gate 1
   -> Coya Coding Agent
   -> Gate 2
   -> Tester
   -> Gate 3
   -> Deployer
   -> 交付
```

### 阶段 1：Architect

当输入不是现成 spec 时，先交给 `architect`。

`architect` 的目标：

1. 澄清需求和边界
2. 分析影响范围
3. 产出 spec / 设计文档
4. 拆解任务
5. 定义验收标准

要求输出格式：

```markdown
# 设计文档：[标题]

## 需求分析

## 影响范围

## 关键决策

## 子任务列表
### Task 1
- 文件：
- 内容：
- 依赖：
- 验收标准：

## 验收标准
- [ ] ...
- [ ] `npm run lint` 通过
- [ ] `npm run typecheck` 通过
- [ ] `npm run build` 通过
```

### Gate 1

把设计文档展示给用户，等待确认。

- 用户确认后，才能进入实现阶段。
- 用户提出修改意见时，返回 `architect` 修订。

---

### 阶段 2：实现者

默认使用 `coya-coding-agent`。

只有在以下情况才考虑改用 `coder`：

- 你明确只想要一个更纯粹的实现 agent
- 当前任务完全不需要浏览器验证、前端设计判断或更强的验证闭环

实现阶段规则：

1. 严格依据 spec 实现
2. 优先小步提交、增量修改
3. 保持现有仓库结构，不引入 `src/`
4. 优先复用现有组件、schema、读取函数
5. 完成后必须跑：
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`

如果任务可并行拆分：

- 只在子任务边界清晰、文件冲突风险低时并行
- 并行实现时可让多个实现 agent 工作，但必须提前明确各自负责的文件范围
- 合并后重新执行完整验证

默认策略仍然是串行优先，因为这个仓库当前更偏内容系统和站点结构，冲突成本可能高于并行收益。

### Gate 2

进入测试前，必须满足：

- `npm run lint` 通过
- `npm run typecheck` 通过
- `npm run build` 通过

任何一个失败，都回到实现阶段修复。

---

### 阶段 3：Tester

测试阶段使用 `tester`，只测不修。

测试内容：

1. 对照 spec 和验收标准逐项验证
2. 检查核心路由和交互
3. 复跑类型检查和构建
4. 如果是前端页面，补浏览器可见性和渲染检查

Bug 报告格式：

```markdown
# Bug 报告

## Bug 1: [标题]
- 严重度: P0 / P1 / P2 / P3
- 文件:
- 现象:
- 期望:
- 重现步骤:
```

### Gate 3

- `P0` / `P1`：必须回退给实现阶段修复
- `P2` / `P3`：记录为已知问题，可继续推进
- 无阻断问题：进入部署阶段

测试修复最多循环 3 轮。超过后终止并向用户报告。

---

### 阶段 4：Deployer

只有在用户明确要求部署、发布预览、检查线上环境时，才进入 `deployer` 阶段。

部署阶段职责：

1. 确认构建环境
2. 再次执行构建
3. 检查部署目标和环境变量
4. 执行 preview 或 production 部署
5. 部署后做健康检查
6. 必要时回滚

如果用户没有要求部署，交付报告里要明确写“未部署”。

---

## 与 `/prompt-boost` 的关系

如果输入是模糊需求，优先先走一遍 `/prompt-boost` 的思路：

1. 扫描仓库
2. 把自然语言翻译成精确 prompt / spec
3. 再交给 `architect`

不要在项目上下文还没摸清时直接开始调度实现阶段。

---

## 调度策略

### 串行优先

默认采用：

1. `architect`
2. `coya-coding-agent`
3. `tester`
4. `deployer`（如需要）

### 并行条件

只有在下面条件都成立时才并行：

- 子任务职责完全独立
- 修改文件集合基本不重叠
- 合并成本低
- 验收标准可以分别验证

如果没有明显收益，不要为了“看起来高级”而强行并行。

---

## 交付报告格式

最终输出：

```markdown
# 交付报告：[需求标题]

## 概要
- 状态：
- 采用流水线：

## 阶段结果
- Architect：
- Implementer：
- Tester：
- Deployer：

## 变更文件
| 文件 | 操作 | 说明 |
|------|------|------|

## 验证结果
- lint：
- typecheck：
- build：

## 已知问题
- ...

## 后续建议
- ...
```

---

## 重要原则

1. 复用真实存在的 subagents，不虚构角色。
2. 实现阶段默认优先 `coya-coding-agent`。
3. 没有用户确认，不跳过设计门禁。
4. 没有通过 lint / typecheck / build，不进入测试。
5. 测试发现阻断问题，必须回退修复。
6. 没有明确部署请求，不擅自进入发布阶段。
7. 始终把必要项目上下文内联给下游 agent，而不是让它凭空猜。

---

## 输出后动作

当用户调用 `/dispatch` 时：

1. 先说明你识别到的输入类型
2. 说明准备走的流水线阶段
3. 如果需要设计门禁，就先展示设计文档并等待确认
4. 如果输入已经是明确 spec，就说明将跳过哪些阶段
