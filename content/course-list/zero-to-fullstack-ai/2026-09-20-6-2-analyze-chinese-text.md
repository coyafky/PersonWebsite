---
title: "6.2 让网页真的会分析文字"
date: "2026-09-20"
summary: >-
  项目里程碑：用 pypinyin 给中文标拼音、用 snownlp 算句子情感，让网页真的会分析文字。
status: published
tags:
  - "Python"
  - "FastAPI"
lang: zh
chapter: "6.2"
series: "zero-to-fullstack"
seriesOrder: 25
---

## 课时概要

把 6.1 装的两个库接进 `/api/analyze`：只改函数**内部**，路径/方法/请求体/返回字段一个不动。score 用 SnowNLP 真打分、pinyin 用 lazy_pinyin 真标注、label 自己从分数换算。前端一行没改——因为**约定没变，内部随便换**。顺带认清模型的边界和「小模型→大模型 API→本地部署」的谱系。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】6.2-让网页真的会分析文字](https://www.bilibili.com/video/BV1c7u861Emf/) ｜ 时长 16:07 ｜ 模块 6 · 生态、数据与状态

**讲义**：[模块 6.2：让网页真的会分析文字（李勃老师.com）](https://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-6-2/)

## 本节要点

- **只动 analyze 函数内部**：接口约定（路径/方法/请求体/返回字段）一个不动。
- `score = round(SnowNLP(text).sentiments, 2)`；`pinyin = " ".join(lazy_pinyin(text, style=Style.TONE))`。
- **label 没有现成函数**，得自己从 score 换算：`score_label()` 里 ≥0.6 积极、≤0.4 消极、中间中性——**阈值是产品决定**，不是标准答案。
- **为什么前端不用改**：约定不变，内部随便换；哪怕换模型、换语言重写后端，前端都无感。
- **模型的边界**：「今天下午三点开会」被判消极、「呵呵真棒」当积极——模型没有常识，只有训练时见过的世界。
- **小模型 ↔ 大模型 API ↔ 本地部署开源模型**是一条连续谱系，按预算/隐私/精度选段；对项目来说都只是「再换一次芯」。

## 笔记正文（讲义整理）

### 换芯

```python
from pypinyin import lazy_pinyin, Style
from snownlp import SnowNLP

def score_label(score):
    if score >= 0.6:
        return "偏积极"
    elif score <= 0.4:
        return "偏消极"
    else:
        return "中性"

@app.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    text = req.text
    score = round(SnowNLP(text).sentiments, 2)          # 真模型打分
    return {
        "text": text,
        "score": score,
        "label": score_label(score),                    # 数字→结论，自己换算
        "pinyin": " ".join(lazy_pinyin(text, style=Style.TONE)),  # 真拼音带声调
    }
```

实测：「我特别喜欢这部电影」0.95 偏积极；「太失望了」0.00 偏消极。逗号会原样留在拼音里（lazy_pinyin 只译汉字），正常。

### 为什么前端一行没改

路径还是 `/api/analyze`、POST、请求体 `{"text":...}`、返回四字段——**约定没变，变的只是约定背后的实现**。`/docs` 文档也纹丝没动。哪怕用 Java 重写后端，只要约定不变，前端无感。

### 模型的边界

| 输入 | score | 翻车点 |
| --- | --- | --- |
| 今天下午三点开会 | 0.26 偏消极 | 中性陈述被判消极 |
| 呵呵，真是太棒了呢 | 0.94 偏积极 | 反讽被当成真夸 |

snownlp 是在**商品评论**语料上训的，擅长「像评论的句子」。**模型没有常识，只有训练时见过的世界**——用之前先弄清它哪里不准，比迷信分数重要。大模型也一样，只是边界更远更隐蔽（幻觉）。

### 小模型 ↔ 大模型谱系

|  | 本地小模型 snownlp | 大模型 API（DeepSeek） |
| --- | --- | --- |
| 花钱 | 免费 | 按量计费 |
| 联网 | 不需要 | 必须 |
| 速度 | 毫秒级 | 秒级 |
| 准确度 | 够用、边界明显 | 强、连反讽都懂 |
| 隐私 | 不出本机 | 文本发给第三方 |

再远一步：开源大模型权重公开，可**本地部署**（1.5B/7B/70B…越大越聪明越吃显卡）。**没有绝对的好，只有合不合适**。教学项目用免费快离线的本地库完全够；真做产品按预算/隐私/精度选段——对项目来说都是再换一次芯。

![换芯：接口约定不变，内部随便换](/diagrams/api-swap-internal.png)

## 和 GFG / 课程笔记的连接

| 这节内容 | GFG / 已学 |
| --- | --- |
| `score_label(score)` 函数 + if/elif | GFG 函数定义、条件分支——你亲手写的第一个业务函数 |
| `round(x, 2)` / `" ".join(...)` | GFG 内置函数与字符串方法 |
| 约定不变内部随便换 | 5.1「API 是约定」的服务方视角；5.4 占位值当时就预告了今天 |
| 模型有边界 | 新认知；大模型幻觉同理 |

> 这节是你第一次把 GFG 里学的函数/条件分支写成**产品逻辑**——阈值 0.6/0.4 不是知识点，是你拍板的产品决定。

## 关键概念

- **换芯**：只改接口内部实现，不动对外约定。
- **score_label**：把模型给的数字分换算成人能读的结论；阈值是产品决定。
- **模型边界**：模型只懂训练语料里的分布，中性句/反讽会翻车。
- **本地部署 / 私有化部署**：把开源大模型权重下载到自己机器跑。
- **参数尺寸**：1.5B/7B/70B（B=十亿），越大越聪明越吃资源。

## 代码 / 实操

```python
# backend/main.py
from pypinyin import lazy_pinyin, Style
from snownlp import SnowNLP

def score_label(score):
    if score >= 0.6: return "偏积极"
    elif score <= 0.4: return "偏消极"
    else: return "中性"

# analyze 里：
#   score = round(SnowNLP(text).sentiments, 2)
#   "label": score_label(score)
#   "pinyin": " ".join(lazy_pinyin(text, style=Style.TONE))
```

## 我的收获

1. 「约定不变，内部随便换」今天从理论变成亲身体会——前端一行没动，能力全换了。
2. label 的阈值不是科学是产品决定：分数模型给，「多少算积极」我说了算。
3. 模型会翻车不奇怪，知道它在哪翻车比迷信分数重要；这条对大模型也成立。

## 待深入

*（待填：没听懂、想回头查的。）*
