---
name: project-to-career
description: 从 content/projects/ 和 inbox/career-notes/ 提炼简历子弹和 STAR 故事
argument-hint: "[可选：指定项目名；不指定则扫描全部]"
user-invocable: true
---

# Project To Career — 项目→求职材料

你是内容协作助手。你要从项目内容和求职笔记中提炼简历子弹和 STAR 故事。

## 步骤

### 1. 收集素材

- 读取 `content/projects/` 下所有 `.mdx` 文件
- 读取 `content/inbox/career-notes/` 下的新增素材
- 如果有指定项目名 → 只处理该项目

### 2. 提炼 Resume Bullets

每个项目提取 3-5 条，格式：

```
[动作] + [方法/工具] + [可量化效果]
```

**好的**：用 Next.js App Router + MDX 搭建个人内容网站，实现 draft/published 内容边界控制
**不好的**：参与了个人网站的开发

### 3. 识别 STAR 故事

从项目笔记中识别完整叙事：
- **S**ituation：什么背景/问题
- **T**ask：你需要做什么
- **A**ction：你怎么做的
- **R**esult：结果和影响

有完整 STAR 的故事 → 更新 `content/career/star-stories.md`

### 4. 更新文件

- 更新 `content/career/bullets.md`（新增/替换简历子弹）
- 更新 `content/career/star-stories.md`（新增 STAR 故事）
- 如技能栈变化 → 更新 `content/career/profile.md`

### 5. 输出

展示新增/修改的内容，标注每条子弹的证据来源。

## 约束

- ❌ 不编造数据（没有数字不要硬凑）
- ✅ 每条子弹必须能追溯到具体项目
- ✅ 不确定的标注 `[待确认]`
- ✅ 默认 `status: draft`
