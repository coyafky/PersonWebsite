---
title: "Hermes config set 自动路由（秘钥配置 env）"
date: "2026-06-05"
summary: "Hermes 自动路由与多 Provider 配置：.env 存秘钥（OPENAI / DEEPSEEK / QWEN / GEMINI / Router）+ config.yaml 引用 + router.mode=auto 自动按 task_type / context_length / complexity 选择 Provider。覆盖 5 类典型路由规则（coding / geo_research / cheap_batch / long_context / high_reasoning）。包含完整 .gitignore 建议与跨环境配置差异。"
tags:
  - hermes
  - 配置
  - 路由
  - Provider
  - 多模型
status: draft
lang: zh
topic: hermes
englishSummary: "Hermes automatic routing and multi-Provider configuration: .env stores secrets (OPENAI / DEEPSEEK / QWEN / GEMINI / Router) + config.yaml references + router.mode=auto automatically picks Provider by task_type / context_length / complexity. Covers 5 typical routing rules (coding / geo_research / cheap_batch / long_context / high_reasoning). Includes complete .gitignore recommendations and cross-environment config differences."
---

# Hermes config set 自动路由（秘钥配置 env）

> 配置目标：
> 不把 API Key 写死在 `config.yaml`，而是写进 `.env`；
> `config.yaml` 只负责引用环境变量；
> Hermes 根据任务类型、成本、速度、能力，自动选择不同模型 Provider。

---

## 一、整体关系

```txt
.env
  ↓ 提供密钥与 base_url
config.yaml
  ↓ 定义 provider、模型、路由规则
hermes config set
  ↓ 写入/更新配置
Router
  ↓ 根据任务自动选择模型
Agent 执行任务
```

一句话：

```txt
.env 存密钥
config.yaml 存路由规则
hermes config set 修改配置
auto_router 自动选模型
```

---

## 二、`.env`：专门存秘钥

建议你的 `.env` 这样写：

```env
# ===============================
# OpenAI
# ===============================
OPENAI_API_KEY=sk-xxxxxxxx
OPENAI_BASE_URL=https://api.openai.com/v1

# ===============================
# DeepSeek
# ===============================
DEEPSEEK_API_KEY=xxxxxxxx
DEEPSEEK_BASE_URL=https://api.deepseek.com

# ===============================
# Qwen / 通义千问
# ===============================
QWEN_API_KEY=xxxxxxxx
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# ===============================
# Gemini
# ===============================
GEMINI_API_KEY=xxxxxxxx

# ===============================
# Router
# ===============================
HERMES_ROUTER_MODE=auto
DEFAULT_PROVIDER=openai
DEFAULT_MODEL=gpt-5.5-thinking
CHEAP_MODEL=deepseek-chat
FAST_MODEL=qwen-plus
LONG_CONTEXT_MODEL=gemini-2.5-pro
CODING_MODEL=gpt-5.5-thinking
```

注意：`.env` 不要提交到 Git。

`.gitignore` 里一定要有：

```gitignore
.env
.env.local
.env.production
```

---

## 三、`config.yaml`：引用 `.env` 中的秘钥

`config.yaml` 不直接写 Key，而是这样引用：

```yaml
provider:
  default: openai

  providers:
    openai:
      api_key: ${OPENAI_API_KEY}
      base_url: ${OPENAI_BASE_URL}
      models:
        default: gpt-5.5-thinking
        coding: gpt-5.5-thinking
        reasoning: gpt-5.5-thinking

    deepseek:
      api_key: ${DEEPSEEK_API_KEY}
      base_url: ${DEEPSEEK_BASE_URL}
      models:
        default: deepseek-chat
        cheap: deepseek-chat
        coding: deepseek-coder

    qwen:
      api_key: ${QWEN_API_KEY}
      base_url: ${QWEN_BASE_URL}
      models:
        default: qwen-plus
        fast: qwen-plus
        long: qwen-max

    gemini:
      api_key: ${GEMINI_API_KEY}
      models:
        default: gemini-2.5-pro
        long_context: gemini-2.5-pro
```

这样做的好处：

```txt
配置文件可以提交
密钥不会泄露
本地和云端可以用不同 .env
模型路由规则清晰
```

---

## 四、自动路由配置

自动路由可以放在 `config.yaml` 的 `router` 模块里：

```yaml
router:
  mode: auto

  default:
    provider: openai
    model: gpt-5.5-thinking

  rules:
    - name: coding
      match:
        task_type:
          - code
          - refactor
          - debug
          - frontend
          - backend
      use:
        provider: openai
        model: gpt-5.5-thinking

    - name: geo_research
      match:
        task_type:
          - geo
          - search
          - citation
          - brand_research
      use:
        provider: qwen
        model: qwen-plus

    - name: cheap_batch
      match:
        task_type:
          - batch_generate
          - prompt_expand
          - rewrite
      use:
        provider: deepseek
        model: deepseek-chat

    - name: long_context
      match:
        context_length: long
      use:
        provider: gemini
        model: gemini-2.5-pro

    - name: high_reasoning
      match:
        complexity:
          - high
          - architecture
          - planning
      use:
        provider: openai
        model: gpt-5.5-thinking
```

这样：

- coding 类任务 → openai/gpt-5.5-thinking
- GEO 研究类 → qwen/qwen-plus
- 批处理 / 重写 → deepseek/deepseek-chat（便宜）
- 长上下文 → gemini/gemini-2.5-pro
- 复杂规划 → openai/gpt-5.5-thinking（强推理）
- 其他 → 默认 openai/gpt-5.5-thinking

---

## 五、`hermes config set` 的两种使用方式

### 5.1 临时切换模型

```bash
hermes config set provider.default openai
hermes config set provider.model gpt-5.5-thinking
```

### 5.2 切换路由模式

```bash
hermes config set router.mode auto
hermes config set router.mode manual
hermes config set router.mode cost_first
hermes config set router.mode speed_first
```

### 5.3 启用 fallback

```bash
hermes fallback add deepseek deepseek-chat
hermes fallback add qwen qwen-plus
hermes fallback list
```

---

## 六、为什么需要自动路由

### 1. 成本

- 不是所有任务都需要 GPT-5.5-Thinking
- 批处理、长内容重写、prompt 扩展用 DeepSeek 便宜 10 倍以上
- 自动按规则切模型，每月账单可能从 $300 → $80

### 2. 速度

- 小任务用小模型，响应更快
- 不需要 30 秒等一个总结

### 3. 能力差异

- 中文 GEO 内容 → Qwen 更稳定
- 长上下文 → Gemini 2.5 Pro 更合适
- 复杂架构推理 → GPT-5.5-Thinking

### 4. 稳定性

- 主 Provider 限流时，fallback 自动接管
- 多 Provider 多模型 = 高可用

---

## 七、配置优先级

当 .env、config.yaml、CLI 参数冲突时：

```txt
CLI 参数 > .env > config.yaml > 默认值
```

例如：

- `hermes run --model deepseek-chat` → 临时用 deepseek
- `.env` 里 `DEFAULT_MODEL=...` → 覆盖 config.yaml
- `config.yaml` 里 `provider.default.model: ...` → 兜底

---

## 八、推荐的工程实践

### 1. .env.example 必须提交

```env
# .env.example
OPENAI_API_KEY=
OPENAI_BASE_URL=
DEEPSEEK_API_KEY=
QWEN_API_KEY=
GEMINI_API_KEY=
DEFAULT_MODEL=
```

### 2. config.yaml 可提交

因为没有写明文 Key，只有 `${VAR}` 引用。

### 3. 生产环境用独立 .env

- 本地：`.env.local`
- 测试：`.env.staging`
- 生产：`.env.production`

### 4. 路由规则要可解释

每个路由规则都写清楚：

```yaml
- name: coding
  match:
    task_type: [code, refactor]
  use:
    provider: openai
    model: gpt-5.5-thinking
  reason: "代码任务对上下文理解和工具调用要求高"
```

不要让路由规则变成黑盒。

---

## 九、最容易踩的坑

### 1. Key 名称不匹配

```env
# .env
OPENAI_API_KEY=sk-xxx
```

```yaml
# config.yaml
api_key: ${OPENAI_KEY}   # 少了 AI，读取失败
```

### 2. Base URL 写错

- OpenAI 官方：`https://api.openai.com/v1`
- DeepSeek：`https://api.deepseek.com`
- Qwen 兼容模式：`https://dashscope.aliyuncs.com/compatible-mode/v1`
- 国内腾讯云部署时，OpenAI 官方地址可能不通，需要代理

### 3. Router 规则写得太复杂

- 规则太多反而难维护
- 建议从 5-8 条核心规则开始，逐步迭代

### 4. Fallback 链没测试

- 主模型挂了才知道 fallback 不工作
- 必须定期演练：临时禁用主模型，验证 fallback 自动接管

### 5. 模型上下文长度不一致

- 切到小上下文模型后，大文档读取失败
- 路由规则要考虑 context_length

---

## 十、一句话总结

Hermes 自动路由的核心做法：

```txt
.env 存所有秘钥
config.yaml 引用秘钥 + 定义路由规则
hermes config set 动态调整配置
Router 按 task_type / context_length / complexity 自动选 Provider
Fallback 链保稳定
```

最终目标是：

```txt
同样的 Hermes 代码
不同的 Provider 组合
不同的成本 / 速度 / 能力组合
稳定的可用性
```

对于企业自动化场景（蓝辉轻改 GEO、运营 Agent、Coding Agent Team），自动路由是 Hermes 上生产的关键能力，建议至少配置 3 个 Provider + 5 条路由规则 + fallback 链。
