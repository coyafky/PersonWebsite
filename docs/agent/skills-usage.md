# Skills 使用指南

本项目使用 Anthropic Agent Skills 协议来给 Claude Code 等工具注入结构化的领域能力。当前已配置的 skill：

| Skill | 来源 | 触发场景 |
|------|------|---------|
| `web-design-engineer` v1.2.2 | `ConardLi/garden-skills` | 视觉前端任务（页面/组件/动效/数据可视化） |

## web-design-engineer

### 装在哪里

`.claude/skills/web-design-engineer/` — 沿用项目 `.claude/commands/` 的目录约定。

**不要**改 `SKILL.md` 本体。skill 是上游产物，定制会让未来升级时 merge 冲突。本项目的定制都写在这里。

### 何时触发

**用**：

- 新做一个页面（首页、about、learning 主题页等）
- 新做一个视觉组件（卡片、卡片网格、对话框、动效时间线）
- 重做现有页面或组件（设计语言升级）
- 设计数据可视化（图表、仪表盘）
- 设计 slide deck / interactive prototype

**不用**：

- 小修小补（改个颜色、加个 padding、调个间距）
- 内容/逻辑任务（改文案、改 frontmatter、加 reader 函数）
- 非视觉编码（API、CLI、测试、CI）
- Bug 修复（除非涉及视觉回归）
- 配置文件改动（`next.config.mjs`、`tsconfig.json`）

判断标准：**如果任务"画在屏幕上"是新作品或重做，就触发；如果是已经存在的视觉上做小调整，就不触发**。

### 触发后怎么用

1. **先读 SKILL.md 顶部 description** 确认是这类任务
2. **Step 0**：涉及具体产品/品牌/SDK → 先 `WebSearch` 验证事实
3. **Step 1**：用 AskUserQuestion 澄清需求（按"够用就开干"原则，不机械问 10 个）
4. **Step 2**：读 `references/style-recipes/INDEX.md` 选 1 个 design anchor，**读完对应 anchor 文件再动笔**
5. **Step 3a**：在动笔前用自然语言宣告"我会用 X 字体、Y 配色、Z 间距"（skill 强制要求）
6. **Step 4**：先出 v0 草稿（HTML 结构 + 关键样式），让用户早看到方向
7. **Step 5**：完整构建
8. **Step 7**：自己跑 Design Critique（Keep / Fix / Quick Wins）

### Design Anchor 选择策略

25 个 anchor 中，**个人网站不同页面适合不同 anchor**：

| 页面类型 | 推荐 anchor | 理由 |
|---------|------------|------|
| 首页 / 营销 | `stripe-press.md` | 出版品牌质感，排版驱动 |
| about | `aesop.md` 或 `dieter-rams-braun.md` | 极简、内容优先 |
| learning 列表 | `linear.md` 或 `bloomberg-terminal.md` | 信息密度高、工具感 |
| 项目详情 | `tufte-dataink.md` 或 `pentagram.md` | 数据/作品展示 |
| 404 / 错误页 | `monocle-magazine.md` 或 `y2k-retrofuturism.md` | 玩票、轻松 |

**不要**在 5 个页面切 5 个 anchor。**先选 1 个用 1-2 周再评估**。设计系统稳定 > 多样性。

### 与现有 `.claude/commands/` 的关系

| 命令 | 关系 |
|------|------|
| `prompt-boost` | **上游**：rough request → 精确 brief |
| `web-design-engineer` | **下游**：拿到 brief 后做视觉执行 |
| `dispatch` | 横向：把多 skill 编排成流水线 |
| 其他 (`blog-from-notes` / `weekly-from-inbox` / `md-to-mdx` 等) | **不冲突**：内容/工作流任务，不涉及视觉 |

**典型串联**：

```text
用户: "帮我重做首页 hero 区域"
  → /prompt-boost 把需求翻译成精确 brief
  → web-design-engineer 选 anchor + 设计系统宣告 + 出 v0
  → 评审 → 完整构建
```

### 已知冲突

| 冲突 | 现状 | 处理 |
|------|------|------|
| 反 Inter 字体 | `app/layout.tsx:9` 用 `next/font/google` Inter | **先不换**。换字体是大动作（影响所有页面 + SEO/性能）。Skill 触发时**新做的部分**用 anchor 字体，已存在的部分不强求 |
| 反 AI 蓝紫渐变 | 部分组件可能用 `linear-gradient(135deg, #667eea, #764ba2)` 风格 | 触发时新做的部分避开，已有不强求 |
| 反 emoji 图标 | 项目用 `components/icons0.tsx` 自建图标 | ✅ 已合规 |

### 升级 skill

上游 `ConardLi/garden-skills` 更新时：

```bash
cd /tmp && rm -rf gs.tgz garden-skills-main
curl -sL https://codeload.github.com/ConardLi/garden-skills/tar.gz/refs/heads/main -o gs.tgz
tar -xzf gs.tgz
diff -rq .claude/skills/web-design-engineer/ /tmp/garden-skills-main/skills/web-design-engineer/
# 检查变更是否影响本项目的 anchor 选择 / 触发场景
# 如果只是 references/ 增量更新，直接覆盖；如果 SKILL.md 变了，review 后再覆盖
cp -R /tmp/garden-skills-main/skills/web-design-engineer/* .claude/skills/web-design-engineer/
```

## 添加新 skill

新增 skill 流程：

1. 在 `references/` 里挑 skill 或自己写一个 `SKILL.md`
2. 复制到 `.claude/skills/<skill-name>/`
3. 更新本文件"当前已配置的 skill"表格
4. 更新 `CLAUDE.md` 的 "Available Skills" 段
5. 在 PR 描述里说明：触发场景 / 不适用场景 / 与已有 skill 的关系
