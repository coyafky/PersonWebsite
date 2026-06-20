---
title: "Hermes Web Search 配置指南"
date: "2026-05-14"
summary: "Hermes Agent Web Search 完整配置指南：基础启用（toolsets 启用 web_search）、Provider 选型对比（SerpAPI / Brave Search / Tavily / DuckDuckGo / Bing / Google CSE / 自建 SearXNG）、env 与 config.yaml 双层配置、防滥用措施（rate_limit / 缓存 TTL / 黑名单 / 人工审批）、4 类典型查询场景（事实查询 / GEO 基线测试 / 竞品监控 / 实时新闻）以及 6 条最佳实践。"
tags:
  - hermes
  - Web Search
  - 联网搜索
  - 配置
  - Provider
status: draft
lang: zh
topic: hermes
englishSummary: "Hermes Agent Web Search complete configuration guide: basic enable (toolsets web_search), Provider comparison (SerpAPI / Brave Search / Tavily / DuckDuckGo / Bing / Google CSE / self-hosted SearXNG), env + config.yaml dual-layer config, abuse prevention (rate_limit / cache TTL / blacklist / manual approval), 4 typical query scenarios (fact lookup / GEO baseline test / competitor monitoring / real-time news), and 6 best practices."
---

# Hermes Web Search 配置指南

> 让 Hermes Agent 具备联网搜索能力，是构建真实可用 Agent 的关键一步。本文整理 Web Search 的配置方法、Provider 选型与最佳实践。

## 一、为什么需要 Web Search

虽然大模型的知识截止日期越来越新，但仍然存在局限：

- 最新事件（突发新闻、政策变化）
- 实时数据（股价、天气、物流）
- 私域知识（企业内部文档、未公开信息）
- 事实核查（避免幻觉）

通过 Web Search，Agent 可以：

- 回答"今天 X 发生了什么"
- 验证"这段引用的真实出处"
- 抓取"竞品最新动态"
- 收集"行业最新论文"

## 二、基础启用方式

### 2.1 启用 toolsets

```yaml
# config.yaml
toolsets:
  web_search:
    enabled: true
    provider: serpapi  # 可选：serpapi, brave, tavily, duckduckgo
```

或通过 CLI 临时启用：

```bash
hermes chat --toolsets "web,terminal,web_search"
```

### 2.2 环境变量

```bash
# .env
WEB_SEARCH_ENABLED=true
WEB_SEARCH_PROVIDER=serpapi
SERPAPI_API_KEY=your_serpapi_key_here
```

## 三、Provider 选型

| Provider | 优点 | 缺点 | 适用场景 |
| --- | --- | --- | --- |
| **SerpAPI** | 结果质量高、支持多搜索引擎 | 收费、按搜索次数计费 | 商业级搜索 |
| **Brave Search** | 隐私优先、独立索引 | API 配额较少 | 隐私敏感场景 |
| **Tavily** | 专为 AI Agent 设计、结构化输出 | 收费 | 复杂 Agent 任务 |
| **DuckDuckGo** | 免费、无追踪 | 结果质量不稳定 | 轻量使用 |
| **Bing Search API** | 国内可访问、稳定 | 需 Azure 账号 | 企业级 |
| **Google CSE** | 结果精准 | 需绑定域名 | 个人/小项目 |
| **自建 SearXNG** | 完全可控 | 需自行维护 | 技术爱好者 |

### 推荐组合

```yaml
# 默认使用 SerpAPI（质量高）
web_search:
  default: serpapi

# 备用使用 DuckDuckGo（免费）
fallback:
  - duckduckgo
  - tavily
```

## 四、配置示例

### 4.1 完整 config.yaml

```yaml
web_search:
  enabled: true
  default_provider: serpapi

  providers:
    serpapi:
      api_key: ${SERPAPI_API_KEY}
      engine: google
      region: cn  # 中国大陆结果

    brave:
      api_key: ${BRAVE_API_KEY}
      safesearch: strict

    tavily:
      api_key: ${TAVILY_API_KEY}
      max_results: 10
      include_raw_content: true

    duckduckgo:
      max_results: 5
      region: zh-CN

  # 防滥用配置
  rate_limit:
    requests_per_minute: 30
    requests_per_hour: 500
    requests_per_day: 5000

  # 结果缓存
  cache:
    enabled: true
    ttl: 3600  # 1 小时

  # 结果过滤
  filter:
    blacklist_domains:
      - spam.example.com
      - ads.example.com

  # 安全
  safety:
    block_malicious_urls: true
    require_approval_for:
      - download_files
      - submit_forms
```

### 4.2 .env 完整配置

```env
# Web Search 配置
WEB_SEARCH_ENABLED=true
SERPAPI_API_KEY=your_serpapi_key
BRAVE_API_KEY=your_brave_key
TAVILY_API_KEY=your_tavily_key

# 限制
WEB_SEARCH_DAILY_LIMIT=1000
WEB_SEARCH_CACHE_TTL=3600
```

## 五、使用方式

### 5.1 在对话中直接触发

```text
用户：今天 OpenAI 发布新模型了吗？

Agent 调用 web_search 工具 → 搜索结果 → 总结回答
```

### 5.2 在 Skill 中显式调用

```python
# skill_code.py
from hermes import web_search

@skill(name="tech_news_digest")
def tech_news_digest(topics: list[str]) -> str:
    results = []
    for topic in topics:
        results.extend(
            web_search.search(
                query=f"{topic} 最新进展 2026",
                max_results=5,
            )
        )
    return summarize_results(results)
```

### 5.3 Cron 自动执行

```bash
hermes cron create \
  --name "tech-news-daily" \
  --prompt "搜索今天 AI 领域重要新闻，整理成中文摘要" \
  --schedule "0 9 * * *" \
  --skill "web_search"
```

## 六、最佳实践

### 6.1 缓存常见查询

同一查询短时间内多次调用 → 浪费配额 + 增加延迟。

```yaml
cache:
  enabled: true
  ttl: 3600
  storage: redis  # 可选 redis 分布式缓存
```

### 6.2 多 Provider 备份

主 Provider 限流时自动切换：

```yaml
web_search:
  primary: serpapi
  fallback:
    - brave
    - duckduckgo
```

### 6.3 限制查询频率

防止 Agent 失控狂搜：

```yaml
rate_limit:
  per_minute: 30
  per_hour: 500
```

### 6.4 过滤低质量来源

```yaml
filter:
  blacklist_domains:
    - known-spam.com
  min_quality_score: 0.5
```

### 6.5 结合 Context 文件

在 Skill 中加入"如何判断搜索结果可信度"的指引：

```yaml
# SKILL.md
context_files:
  - search_evaluation_rules.md
```

### 6.6 监控与日志

```yaml
logging:
  web_search:
    log_queries: true
    log_results: false  # 不记录原始结果，避免敏感信息
    metrics:
      - query_count
      - avg_latency
      - error_rate
```

## 七、典型场景配置

### 场景 1：事实查询（轻量）

```yaml
web_search:
  default_provider: duckduckgo
  max_results: 3
  cache_ttl: 86400  # 24 小时
```

### 场景 2：GEO 基线测试（深度）

```yaml
web_search:
  default_provider: serpapi
  max_results: 20
  region: cn
  include_citations: true
  cache_ttl: 1800  # 30 分钟
```

### 场景 3：竞品监控（高频）

```yaml
web_search:
  default_provider: tavily
  schedule: "every 6 hours"
  rate_limit:
    per_day: 5000
```

### 场景 4：实时新闻（实时）

```yaml
web_search:
  default_provider: brave
  cache_ttl: 300  # 5 分钟
  freshness: one_day
```

## 八、常见问题

### Q1：搜索结果不相关？

- 检查 query 是否包含过多关键词
- 尝试拆成多个小查询
- 使用更具体的搜索引擎（Google vs Bing）

### Q2：搜索配额超限？

- 启用缓存
- 切换到 DuckDuckGo 或 Brave 等免费 Provider
- 升级 SerpAPI 计划

### Q3：搜索结果包含恶意链接？

- 启用 `block_malicious_urls: true`
- 配置 blacklist_domains
- 在 Skill 中加入链接验证步骤

### Q4：如何处理中文搜索？

```yaml
providers:
  serpapi:
    engine: baidu  # 百度
  brave:
    country: CN
    language: zh-hans
```

### Q5：搜索结果是英文，Agent 不会翻译？

在 Skill 中显式加入翻译步骤：

```yaml
skill_prompt: |
  1. 用 web_search 搜索关键词
  2. 如果结果是英文，先翻译成中文
  3. 总结 3-5 条最重要的信息
```

## 九、与记忆系统的协同

Web Search 的结果可以临时加入上下文，也可以写入 MEMORY.md：

```yaml
memory_integration:
  auto_write:
    enabled: true
    trigger_keywords:
      - 用户偏好
      - 长期事实
      - 项目背景
  expire_after_days: 30
```

例如：

- 搜索"X 公司最新财报" → 临时上下文，不写入 MEMORY.md
- 搜索"用户公司主营业务" → 写入 MEMORY.md，长期保留

## 十、总结

Web Search 是 Hermes Agent 的"眼睛"——让它能跳出训练数据看真实世界。

核心原则：

1. **选对 Provider**：质量、成本、隐私三维平衡
2. **启用缓存**：避免重复搜索浪费
3. **限制频率**：防止 Agent 失控
4. **过滤低质**：屏蔽垃圾来源
5. **结合记忆**：搜索结果按重要性分流（临时 / 长期）
6. **监控日志**：发现问题持续优化

合理配置的 Web Search 能让 Hermes Agent 从"纸上谈兵"变成"能看会用"的真实助手。
