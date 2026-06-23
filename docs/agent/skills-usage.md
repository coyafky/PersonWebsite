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
| 反 Inter 字体 | ~~`app/layout.tsx:9` 用 `next/font/google` Inter~~ | ✅ **已解决 (2026.06)** — Fraunces (display) + Source Serif 4 (body) + Inter (UI chrome only) 走 `next/font/google` |
| 反 AI 蓝紫渐变 | ~~部分组件可能用 `linear-gradient(135deg, #667eea, #764ba2)` 风格~~ | ✅ **已解决 (2026.06)** — 所有 hex 迁移 oklch，hero 双层 gradient 简化为单层 surface |
| 反 emoji 图标 | 项目用 `components/icons0.tsx` 自建图标 | ✅ 已合规 |

### 已应用的设计系统：Stripe Press (2026.06)

整个站点的 design system 已迁移到 Stripe Press 锚点（`.claude/skills/web-design-engineer/references/style-recipes/stripe-press.md`）。核心决策：

- **字体**：Fraunces (display, opsz 144) / Source Serif 4 (body) / Inter (UI only)
- **配色**：暖象牙底 + 暖墨字 + 单一 foil-stamp teal accent；全部走 oklch
- **几何**：全局 0 圆角（Stripe Press signature）；hairline 1px / accent 2px
- **动效**：1500ms opacity-only crossfade；fadeUp 800ms；hover 仅 `y: -2`

**实施记录**：
- 分支：`feature/stripe-press-refactor`
- 8 个原子 commit
- Baseline 备份：`docs/agent/design-refactor-baseline.md`
- 5 维 critique：`docs/agent/stripe-press-critique.md`（全维度 ≥ 7/10，avg 7.6）
- **新做/重做的视觉任务仍以 Stripe Press 为 anchor**；未来如要换 anchor，需要先 review CLAUDE.md 决策



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

## transitions-dev

### 装在哪里
`.claude/skills/transitions-dev/` — 沿用项目 `.claude/commands/` 目录约定。

**不要**改 `SKILL.md` 本体。skill 是上游产物（[JakubAntalik/transitions.dev](https://github.com/JakubAntalik/transitions.dev)），定制会让未来升级时 merge 冲突。本项目的覆写写在 `app/globals.css` 的 `:root` 段（见 spec §6.1），不动 skill 内的 `_root.css`。

### 何时触发

**用**：
- 设计组件级微交互（modal / dropdown / tabs / copy 反馈 / 错误抖动 / 文字 reveal / panel 滑入 / icon 切换 / card 状态变化 / tooltip / accordion / 等 21 种）
- 写新组件时遇到"这个状态切换该怎么动"的疑问
- 想给 AI 工具（Claude Code / Cursor / Copilot）注入"产品级动效词汇表"

**不用**：
- 跨页路由级 transition（仍用 framer-motion `PageTransitionWrapper`）
- 列表 stagger（仍用 framer-motion `StaggerContainer`）
- 与 Stripe Press 1500ms 编辑式节奏冲突的场景（直接用项目 `--transition-slow: 1500ms`）
- 小修小补（hover 改个颜色 / 改个 padding）

判断标准：**「组件级状态切换」用 transitions-dev；「跨页 / 列表入场」用 framer-motion；「颜色 / 间距 / hover 微调」用 globals.css token。**

### 触发后怎么用

1. 在 Claude Code 输入 `transitions reveal` —— 列出 21 个过渡目录
2. 输入 `transitions review` —— 扫描项目，给出"哪些地方适合用哪个过渡"的就绪报告
3. 输入 `transitions apply <name>` —— 自动检测 + 1 行理由 + 等待确认后安装
4. 输入 `transitions refine` —— 微调已安装过渡的 durations / easings

### 21 个过渡速查
（详见 `SKILL.md` 内 21 个 reference）

| # | 名称 | 典型场景 |
|---|------|----------|
| 1 | Card resize | 容器 width/height 变化 |
| 2 | Number pop-in | 数字更新（每位 blur + slide） |
| 3 | Notification badge | 角标浮出 + spring pop |
| 4 | Text states swap | 同位文字替换（blur + slide） |
| 5 | Menu dropdown | origin-aware 展开 |
| 6 | Modal open/close | 居中 scale + fade |
| 7 | Panel reveal | 面板滑入 + cross-blur |
| 8 | Page side-by-side | 左右推入（不替代 framer-motion） |
| 9 | Icon swap | 同位 icon 替换（scale + blur） |
| 10 | Success check | 庆祝完成（stroke-draw + Y-bob） |
| 11 | Avatar group hover | hover 时整行 spring + falloff |
| 12 | Error state shake | 校验失败抖动 |
| 13 | Input clear with dissolve | 搜索框清空 |
| 14 | Skeleton loader | 占位 + cross-fade 加载完成 |
| 15 | Shimmer text | loading 文案流光 |
| 16 | Tabs sliding | 激活指示器滑动 |
| 17 | Tooltip open/close | 延迟 fade + scale |
| 18 | Texts reveal | 多行 stagger reveal |
| 19 | Card hover tilt | 3D tilt（⚠️ 与 Stripe Press 0 圆角美学冲突，本项目不用） |
| 20 | Plus to menu morph | FAB 圆形变面板 |
| 21 | Accordion expand | 折叠面板 grid-rows |

### 与现有 `.claude/commands/` 和 skill 的关系

| 工具 | 关系 |
|------|------|
| `web-design-engineer` skill | 横向：当 transitions-dev 不够用（复杂视觉场景）时由 web-design-engineer 出设计 |
| `transitions-dev` skill | 纵向：组件级微交互的事实标准 |
| `prompt-boost` / `dispatch` | 上游 / 编排：与本 skill 不冲突 |

### Style Overrides
本项目把 transitions-dev 默认节奏统一覆写到与 Stripe Press 协调的中等档（500-700ms，easeOut）。覆写表在 `app/globals.css` 末尾；详见 `docs/agent/spec-v0.4-transitions-dev.md` §6.1。

## 添加新 skill

新增 skill 流程：

1. 在 `references/` 里挑 skill 或自己写一个 `SKILL.md`
2. 复制到 `.claude/skills/<skill-name>/`
3. 更新本文件"当前已配置的 skill"表格
4. 更新 `CLAUDE.md` 的 "Available Skills" 段
5. 在 PR 描述里说明：触发场景 / 不适用场景 / 与已有 skill 的关系
