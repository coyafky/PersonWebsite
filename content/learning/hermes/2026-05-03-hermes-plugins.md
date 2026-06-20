---
title: "HermesAgent Plugins 使用整理"
date: "2026-05-03"
summary: "HermesAgent Plugins 系统完整使用整理：Plugin vs Skill 的 5 维对比、4 种 Plugin 类型（Tool / Hook / Memory Provider / Context Engine）、完整目录结构、Plugin manifest 编写、3 个示例 Plugin（自定义工具 / pre_llm_call hook / 自定义 memory provider）、生命周期与热加载、与 Skills/Memory/Profile 的协同、4 步开发流程、最佳实践与常见错误。"
tags:
  - hermes
  - Plugins
  - 扩展
  - 工具
  - Hook
status: published
lang: zh
topic: hermes
englishSummary: "Complete HermesAgent Plugins system guide: Plugin vs Skill 5-dimension comparison, 4 Plugin types (Tool / Hook / Memory Provider / Context Engine), complete directory structure, Plugin manifest writing, 3 example Plugins (custom tool / pre_llm_call hook / custom memory provider), lifecycle and hot reload, coordination with Skills/Memory/Profile, 4-step development workflow, best practices and common pitfalls."
---

# HermesAgent Plugins 使用整理

> 基于 HermesAgent 项目的 Plugins 完整使用说明整理。

---

## 一、什么是 Plugin

Plugin 是 HermesAgent 的扩展机制——通过 Plugin 可以在不修改核心代码的情况下，注入：

- **新工具**：自定义函数 / API 集成
- **新钩子**：拦截 Agent 行为
- **新记忆**：自定义 memory 后端
- **新上下文引擎**：自定义上下文组装逻辑

Plugin 让 HermesAgent 像一个"操作系统"——核心提供基础能力，Plugin 扩展具体应用。

## 二、Plugin vs Skill

很多人混淆 Plugin 和 Skill，它们的区别：

| 维度 | Plugin | Skill |
| --- | --- | --- |
| 形式 | Python / JS 代码包 | Markdown + 可选代码 |
| 触发 | 加载即生效 | 显式调用或条件触发 |
| 复杂度 | 高（需要编程） | 低（写文档即可） |
| 适合 | 深度扩展 / 自定义工具 | 工作流模板 |
| 性能 | 启动加载 | 按需加载 |
| 版本 | semver | 文件内容 |

**简单说**：

- **Skill** = "教 Agent 怎么做一件事"（文档）
- **Plugin** = "给 Agent 增加一个新能力"（代码）

## 三、Plugin 的 4 种类型

### 3.1 Tool Plugin（自定义工具）

```yaml
# plugin.yaml
type: tool
name: feishu_sender
description: 发送飞书消息工具
entry: feishu_sender:FeishuSender
```

```python
# feishu_sender.py
from hermes.plugins import Tool

class FeishuSender(Tool):
    name = "feishu_sender"
    description = "发送飞书消息到指定 webhook"

    parameters = {
        "webhook": {
            "type": "string",
            "description": "飞书 webhook URL",
            "required": True,
        },
        "message": {
            "type": "string",
            "description": "消息内容（支持 markdown）",
            "required": True,
        },
    }

    def execute(self, webhook: str, message: str):
        import requests
        response = requests.post(webhook, json={
            "msg_type": "interactive",
            "card": {
                "elements": [{"tag": "markdown", "content": message}]
            }
        })
        return {"status": response.status_code, "response": response.json()}
```

### 3.2 Hook Plugin（钩子）

```yaml
type: hook
name: content_safety_filter
hooks:
  - event: pre_llm_call
    entry: content_safety_filter:before_llm
  - event: post_llm_call
    entry: content_safety_filter:after_llm
```

```python
# content_safety_filter.py
from hermes.plugins import Hook

class ContentSafetyFilter(Hook):
    def before_llm(self, context):
        # 检查用户消息是否包含敏感词
        if self.contains_sensitive(context.messages[-1]):
            raise ValueError("内容包含敏感词，已拦截")
        return context

    def after_llm(self, context):
        # 记录所有 LLM 调用到审计日志
        self.audit_log.write({
            "timestamp": context.timestamp,
            "model": context.model,
            "tokens": context.tokens,
            "response": context.response[:200],
        })
        return context
```

### 3.3 Memory Provider Plugin（自定义记忆后端）

```yaml
type: memory_provider
name: notion_memory
description: 把记忆存储到 Notion 数据库
entry: notion_memory:NotionMemoryProvider
```

```python
# notion_memory.py
from hermes.plugins import MemoryProvider

class NotionMemoryProvider(MemoryProvider):
    def __init__(self, config):
        self.notion = NotionClient(config["notion_token"])
        self.database_id = config["database_id"]

    def save(self, memory):
        return self.notion.pages.create(
            database_id=self.database_id,
            properties={
                "Title": {"title": [{"text": {"content": memory.title}}]},
                "Content": {"rich_text": [{"text": {"content": memory.content}}]},
                "Tags": {"multi_select": [{"name": t} for t in memory.tags]},
            }
        )

    def recall(self, query, top_k=5):
        results = self.notion.databases.query(
            database_id=self.database_id,
            filter={"property": "Content", "rich_text": {"contains": query}},
            page_size=top_k,
        )
        return [self._parse_memory(r) for r in results["results"]]
```

### 3.4 Context Engine Plugin（自定义上下文组装）

```yaml
type: context_engine
name: geo_optimized_context
description: 为 GEO 任务优化的上下文组装
entry: geo_optimized_context:GEOContextEngine
```

```python
# geo_optimized_context.py
from hermes.plugins import ContextEngine

class GEOContextEngine(ContextEngine):
    def assemble(self, agent_state):
        # 1. 加载用户偏好
        user_prefs = agent_state.user_profile

        # 2. 加载项目事实（蓝辉轻改）
        project_facts = agent_state.memory.recall(
            type="project_facts",
            scope="lanhui-geo",
            top_k=10,
        )

        # 3. 加载 GEO 相关 procedural
        procedures = agent_state.memory.recall(
            type="procedural",
            tags=["geo"],
            top_k=3,
        )

        # 4. 加载 Skill（按需）
        skills = []
        if agent_state.task.matches("content"):
            skills.append(agent_state.skills.get("geo-content-generator"))

        # 5. 组装上下文
        return {
            "system_prompt": self.build_system_prompt(
                user_prefs, project_facts, procedures, skills
            ),
            "messages": agent_state.messages,
            "tools": self.filter_tools(agent_state),
        }
```

## 四、目录结构

```text
~/.hermes/plugins/
├── installed/                # 已安装的 Plugin
│   ├── feishu_sender/
│   │   ├── plugin.yaml       # Plugin 元信息
│   │   ├── feishu_sender.py  # 实现代码
│   │   ├── README.md
│   │   └── tests/
│   │       └── test_feishu.py
│   ├── content_safety_filter/
│   │   ├── plugin.yaml
│   │   └── content_safety_filter.py
│   └── notion_memory/
│       ├── plugin.yaml
│       └── notion_memory.py
├── available/                # 可安装但未启用
└── dev/                      # 开发中的 Plugin
    └── my_custom_plugin/
```

## 五、Plugin Manifest

每个 Plugin 必须有 `plugin.yaml`：

```yaml
# 必填字段
name: my_plugin              # Plugin 唯一名称
version: 1.0.0               # semver
type: tool                   # tool / hook / memory_provider / context_engine
description: Plugin 描述
entry: my_plugin:MyPluginClass  # 模块路径:类名

# 选填字段
author: 冯科雅 <coya@example.com>
license: MIT
homepage: https://github.com/...

# 依赖
dependencies:
  python:
    - requests>=2.28.0
    - pyyaml>=6.0
  hermes:
    - ">=1.0.0"

# 权限声明
permissions:
  - network:http              # HTTP 调用
  - network:https
  - filesystem:read           # 文件读
  - filesystem:write:./workspace  # 限定路径写

# 配置
config_schema:
  api_key:
    type: string
    required: true
    env: MY_PLUGIN_API_KEY
    sensitive: true
  timeout:
    type: integer
    default: 30
  enabled_features:
    type: array
    default: []

# 钩子定义（仅 hook 类型）
hooks:
  - event: pre_llm_call
    priority: 100
    async: false
  - event: post_llm_call
    priority: 100

# 工具定义（仅 tool 类型）
tools:
  - name: my_tool
    description: 工具描述
    parameters:
      param1:
        type: string
        required: true

# 标签
tags: [productivity, automation]

# 平台支持
platforms:
  - linux
  - macos
  - windows
```

## 六、安装与管理

### 6.1 安装

```bash
# 从本地目录安装
hermes plugin install ./my_plugin

# 从 GitHub 安装
hermes plugin install https://github.com/user/hermes-plugin-feishu

# 从 Plugin Hub 安装
hermes plugin install feishu-sender
```

### 6.2 启用/禁用

```bash
hermes plugin list
hermes plugin enable feishu_sender
hermes plugin disable feishu_sender
```

### 6.3 卸载

```bash
hermes plugin uninstall feishu_sender
```

### 6.4 更新

```bash
hermes plugin update feishu_sender
hermes plugin update --all
```

### 6.5 查看详情

```bash
hermes plugin info feishu_sender
```

输出：

```text
Name:        feishu_sender
Version:     1.2.0
Type:        tool
Status:      enabled
Author:      冯科雅
License:     MIT
Description: 发送飞书消息工具

Tools:
  - feishu_sender

Permissions:
  - network:http
  - network:https

Config:
  api_key: ***REDACTED***
  webhook: https://open.feishu.cn/...
```

## 七、Plugin 生命周期

```text
discover    发现插件（扫描 installed/）
  ↓
load        加载代码（import）
  ↓
validate    校验 manifest
  ↓
init        实例化插件对象
  ↓
register    注册到 HermesAgent
  ↓
enable      启用（注入到运行时）
  ↓
hooks       执行钩子
  ↓
disable     禁用（从运行时移除）
  ↓
unload      卸载代码
  ↓
remove      删除文件
```

## 八、热加载

修改 Plugin 代码后无需重启 Hermes：

```bash
hermes plugin reload feishu_sender
```

或在 plugin 中监听文件变化自动重载（开发模式）：

```bash
hermes --dev-mode
```

> 注意：某些类型的 Plugin 修改后必须重启，如修改了 manifest 结构、权限声明、依赖。

## 九、典型使用场景

### 场景 1：飞书集成

安装飞书 Plugin：

```bash
hermes plugin install hermes-plugin-feishu
```

配置：

```bash
hermes config set plugins.feishu_sender.webhook https://open.feishu.cn/...
```

使用：

```text
用户：给飞书群发个测试消息。
Agent：调用 feishu_sender 工具 → 发送成功。
```

### 场景 2：内容安全过滤

安装内容安全 Plugin：

```bash
hermes plugin install hermes-plugin-content-safety
```

启用后，所有 LLM 调用都会经过内容安全检查：

```text
用户：帮我写一个绕过 XX 的脚本。
Agent：内容安全拦截 → 拒绝回答。
```

### 场景 3：自定义 Memory 后端

```bash
hermes plugin install hermes-plugin-notion-memory
hermes config set memory.provider notion_memory
```

之后所有记忆都存到 Notion 数据库：

```text
用户：记住我们做蓝辉轻改 GEO。
Agent：保存到 Notion 数据库（可团队共享）。
```

## 十、Plugin 开发最佳实践

### 10.1 单一职责

一个 Plugin 只做一件事。

```yaml
# 错误 ❌：万能 Plugin
name: super_plugin
features: [tool, hook, memory, context]

# 正确 ✅：拆分
name: feishu_sender      # 只负责发送
name: feishu_storage     # 只负责存储
name: feishu_auth        # 只负责认证
```

### 10.2 权限最小化

```yaml
# 错误 ❌：全权限
permissions:
  - filesystem:*
  - network:*
  - system:*

# 正确 ✅：最小权限
permissions:
  - network:https:open.feishu.cn  # 只允许访问飞书
  - filesystem:read:./workspace   # 只读 workspace
```

### 10.3 错误处理

```python
class FeishuSender(Tool):
    def execute(self, webhook, message):
        try:
            response = requests.post(webhook, json={...}, timeout=10)
            response.raise_for_status()
            return {"status": "ok", "response": response.json()}
        except requests.Timeout:
            return {"status": "error", "error": "timeout", "retry": True}
        except requests.HTTPError as e:
            return {"status": "error", "error": str(e), "retry": False}
        except Exception as e:
            self.logger.exception("feishu_sender failed")
            return {"status": "error", "error": "internal_error"}
```

### 10.4 测试覆盖

```python
# tests/test_feishu.py
import pytest
from feishu_sender import FeishuSender

def test_send_success():
    sender = FeishuSender(webhook="http://mock.feishu")
    result = sender.execute("hello")
    assert result["status"] == "ok"

def test_send_timeout():
    sender = FeishuSender(webhook="http://timeout.feishu")
    result = sender.execute("hello")
    assert result["status"] == "error"
    assert result["retry"] is True
```

### 10.5 版本管理

```yaml
# 遵循 semver
version: 1.2.3
# MAJOR.MINOR.PATCH
# MAJOR: 不兼容改动
# MINOR: 向后兼容的新功能
# PATCH: 向后兼容的 bug 修复
```

### 10.6 文档完备

```markdown
# feishu_sender

## 功能
发送飞书消息到指定 webhook。

## 安装
\`\`\`bash
hermes plugin install ./feishu_sender
\`\`\`

## 配置
\`\`\`bash
hermes config set plugins.feishu_sender.webhook https://...
\`\`\`

## 使用
\`\`\`
用户：给飞书发消息。
Agent：调用 feishu_sender 工具。
\`\`\`

## 权限
- network:https:open.feishu.cn

## 许可
MIT
```

## 十一、Plugin 调试

### 11.1 启用调试日志

```bash
hermes --log-level=DEBUG
```

或针对特定 Plugin：

```bash
hermes config set plugins.feishu_sender.debug true
```

### 11.2 查看 Plugin 执行

```bash
hermes plugin trace feishu_sender
```

输出：

```text
[2026-05-16 10:30:15] feishu_sender.execute called
  webhook: https://open.feishu.cn/...
  message: "Hello"
[2026-05-16 10:30:16] feishu_sender.execute success (1023ms)
```

### 11.3 单测

```bash
hermes plugin test feishu_sender
```

会运行 Plugin 自带的测试。

## 十二、常见错误

### 错误 1：Plugin 加载失败

```text
Error: Failed to load plugin 'feishu_sender'
  ModuleNotFoundError: No module named 'requests'
```

修复：添加依赖到 plugin.yaml 或 requirements.txt。

### 错误 2：权限不足

```text
Error: Plugin 'feishu_sender' lacks permission 'network:https'
```

修复：在 plugin.yaml 添加 permissions。

### 错误 3：版本冲突

```text
Error: Plugin 'feishu_sender' requires hermes>=2.0.0, current=1.5.0
```

修复：升级 Hermes 或降低 Plugin 版本要求。

### 错误 4：Hook 执行顺序

```yaml
# 多个 Plugin 注册同一 hook 时
hooks:
  - event: pre_llm_call
    priority: 100    # 数字越大越先执行
```

## 十三、Plugin 与 Skills/Memory/Profile 协同

### 13.1 Plugin 调用 Skill

```python
class FeishuSender(Tool):
    def execute(self, message):
        # 调用 Skill
        summary = self.agent.skills.invoke(
            "summarize",
            content=message,
            max_length=200,
        )
        return self.send_to_feishu(summary)
```

### 13.2 Plugin 写入 Memory

```python
class FeishuSender(Tool):
    def execute(self, message):
        # 写入 Memory
        self.agent.memory.remember(
            type="project_facts",
            content={"fact": f"已发送飞书消息：{message[:50]}"},
            scope="feishu-logs",
        )
        return self.send_to_feishu(message)
```

### 13.3 Plugin 在 Profile 中启用

```yaml
# profiles/work.yaml
plugins:
  enabled:
    - feishu_sender
    - content_safety_filter
  disabled:
    - notion_memory
```

不同 Profile 启用不同 Plugin。

## 十四、发布 Plugin

### 14.1 准备发布

```text
my_plugin/
├── plugin.yaml
├── my_plugin.py
├── README.md
├── LICENSE
├── CHANGELOG.md
├── requirements.txt
└── tests/
```

### 14.2 发布到 Plugin Hub

```bash
hermes plugin publish
```

需要：

- 通过所有测试
- 有完整 README
- 明确 license
- 遵循 semver

### 14.3 在 GitHub 发布

```bash
git tag v1.0.0
git push origin v1.0.0
hermes plugin install https://github.com/user/my_plugin@v1.0.0
```

## 十五、总结

HermesAgent 的 Plugin 系统核心：

- **4 种类型**：Tool / Hook / Memory Provider / Context Engine
- **结构化 manifest**：明确的元信息和权限声明
- **热加载**：开发友好
- **权限控制**：最小权限原则
- **与现有模块协同**：Skill / Memory / Profile
- **生态发布**：Plugin Hub + GitHub

掌握 Plugin 开发后，可以构建：

- 企业内部工具（飞书 / 钉钉 / Slack 集成）
- 自定义后端（Notion / Airtable / 数据库）
- 安全审计（日志 / 监控 / 内容过滤）
- 工作流自动化（定时任务 / 事件触发）

Plugin 是 HermesAgent 走向"操作系统"的关键——把核心做小，把生态做大。
