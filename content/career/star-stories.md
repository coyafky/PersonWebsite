---
title: "STAR 故事"
date: "2026-06-08"
summary: "基于真实经历的结构化 STAR 故事，用于面试和申请材料。"
status: published
lang: zh
englishSummary: "Structured STAR stories based on real experiences for interviews and applications."
---

## 故事 1：从零搭建 Agent Team 开发工作流

### Situation（情境）
AI 部工作需要频繁使用 AI 工具进行开发，但单个 AI agent 能力有限——设计、编码、测试、部署混在一起容易出错。需要一个多角色分工的 Agent Team 来系统化开发流程。

### Task（任务）
搭建一套四角色 Agent Team（Architect / Coder / Tester / Deployer），让每个角色各司其职、协作完成完整的开发流水线。

### Action（行动）
- 在 Claude Code 中利用 custom agents 功能定义四个角色，每个角色有独立的 system prompt、工具权限和 skill 配置
- 从 182 个 Hermes skills 和 90+ 个 Claude Code skills 中筛选 39 个精准装配到四个角色
- 设计完整的协作 SOP：PLAN → BUILD → VERIFY → SHIP 四阶段流水线
- 集成 Addy Osmani 的 agent-skills 仓库中的 12 个方法论 skill

### Result（结果）
- 四角色 Agent Team 完整落地，39 个 skills 精准分配
- 每个角色有明确的职责边界（Architect 不写代码、Tester 不修 bug 等）
- 可复用的协作工作流文档化，后续每个新项目可直接套用
- 在轮毂领域学习项目中验证了完整工作流

---

## 故事 2：AI 内容自动化——从口述到发布

### Situation（情境）
公司需要持续产出技术内容，但写作启动成本高——每次打开编辑器面对空白页都需要很大的心理启动能量。

### Task（任务）
设计一条从「口述录音」到「自动发布博客」的 AI 内容生产链路，降低写作启动成本。

### Action（行动）
- 设计完整链路：飞书妙记录音 → Lark CLI 转文字 → Hermes Skill 生成结构化博客 → GitHub/Vercel 自动推送
- 参考 LucasBlog 仓库（Astro + Tailwind CSS + Vercel）作为博客框架
- 搭建 Personal Website 内容系统：content/inbox 素材入口 + 四条转化链路
- 创建 4 个 Claude Code 命令和 personal-website-content-sync Hermes skill

### Result（结果）
- 内容生产从「打开编辑器」降低到「打开飞书说两句话」
- 四条转化链路：inbox→blog / inbox→weekly / project→career / draft→publish
- 周末可以批量将一周的碎片记录自动转化为周记草稿

---

## 故事 3：车膜知识库从零到可调用资产

### Situation（情境）
公司车膜品牌「有膜有漾」需要系统化的知识资产来支撑内容营销。但品牌信息分散在各处——产品资料、飞书文档、行业文章——每次做内容都需要重新搜集信息。

### Task（任务）
搭建一个结构化、可被 AI 直接调用的车膜行业知识库。

### Action（行动）
- 设计知识库结构：wiki 页面（概念+实体+对比）+ raw 深度文章 + JSONL 结构化记录
- 从知乎、懂车帝、什么值得买、B 站等多平台采集 200+ 条内容
- 对每条内容进行分类、标注、结构化处理
- 最终产出 38 页 wiki + 27 篇 raw 文章 + 304 条 JSONL 结构化记录（12 个文件）
- 设计 GEO 品牌基线测试框架，利用知识库提取关键词种子进行 AI 可见性测试

### Result（结果）
- 车膜知识库从零搭建到可调用，等效 ~434 条结构化记录
- GEO 基线测试可直接从知识库提取关键词种子，减少 70% 手动整理时间
- 为后续内容营销和 AI 搜索优化提供了坚实的数据基础

---

## 故事 4：生图系统技术选型

### Situation（情境）
公司需要为车膜产品搭建 AI 图像生成能力，让客户在线上预览车膜效果。但「颜色准确性」是关键——看起来高清但颜色不准等于没用。

### Task（任务）
评估三种可能的生图技术方案，选出最可靠的方向。

### Action（行动）
- 方案 1：高清拍摄后 AI 渲染 → 判断不可行（光照、材质、模型渲染误差导致色差不可控）
- 方案 2：基于商家电子版图片渲染 → 不可行（缺少可直接使用的电子版图片素材）
- 方案 3：色差仪获取 L/A/B 精确数值后线上预览 → ✅ 选定（成本更高但工程可控）
- 后续推进：完成飞书 MGS 生图系统配置、调试、优化，并向团队汇报

### Result（结果）
- 三方案对比判断完成，避免在不可行方案上浪费资源
- MGS 生图系统完成从配置到团队汇报的完整闭环
- 从 W14 调研到 W17 落地，技术方向始终一致
