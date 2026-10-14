---
name: Coya — AI for Business
description: 面向企业 AI 应用与营销岗位的个人作品集，兼顾长期写作与知识记录。
reference: https://design.ricoui.com/brands/airtable
colors:
  background: "#fafbf9"
  surface: "#ffffff"
  surface-soft: "#f0f2f0"
  surface-hover: "#e6eae6"
  text: "#18231f"
  text-secondary: "#52605a"
  muted: "#66736c"
  accent: "#3157ff"
  accent-hover: "#2342c7"
  accent-soft: "#edf1ff"
typography:
  display: '"Avenir Next", "Helvetica Neue", "PingFang SC", sans-serif'
  body: '"Avenir Next", Avenir, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif'
  label: '"Arial Narrow", "Avenir Next Condensed", sans-serif'
  utility: '"SF Mono", Menlo, Consolas, monospace'
rounded:
  control: 10px
  card: 18px
  pill: 9999px
layout:
  container: 1200px
  reading: 760px
  headerHeight: 76px
---

# Coya — AI for Business

## 定位与参考选择

面向招聘企业 AI 应用、AI 产品运营和营销效率岗位的人。首页首先回答：我是谁、能解决什么业务问题、有哪些实际交付，以及如何联系。

主参考：[RICOUI / Airtable](https://design.ricoui.com/brands/airtable)（2026-10-14 查看）。借鉴它以业务工作流组织内容、留白、适中字重、深色主按钮和清晰的案例卡片。保留本站的蓝色交互色、中文阅读体验及个人身份，不复制商标、宣传文案或商业字体。

比较过 [Notion](https://design.ricoui.com/brands/notion)：其知识组织思路适合笔记页面，但多色插画与企业产品营销首屏不作为本站主视觉。旧版 Knowledge Field 的知识积累仍是辅助内容，求职入口提升到第一层。

## 视觉设定

明亮偏中性的底色、墨绿倾向的深色文字、单一蓝色交互色。页面不铺网格、粒子或大面积渐变。签名元素是首页「业务工作流卡」：从客户跟进、营销内容、知识检索切换到实际项目的处理流程，点击进入案例。这是项目流程说明，不模拟线上实时数据。

首页方案：

```text
标识                    项目 / 关于 / 写作 / 笔记 / 视觉 / 工具    联系
个人定位 + 主要行动                  可切换的业务流程
企业应用 / 营销内容 / 知识整理        三个业务领域
精选案例                            真实阶段 + 个人职责 + 结果
工作方法                            从需求到可复盘的交付
近期写作                            持续学习与复盘
联系入口
```

自检修订：移除用工具名称和大数字撑起首屏的方案。把业务问题和实际项目放在中心；不编造效率提升、客户评价、任职信息或上线成果。已跑通但尚未验证业务价值的管线，要把限制一并展示。

## 全站规则

- 色值只在 `app/globals.css` 唯一的 `:root` 定义。`app/portfolio.css` 是当前页面展示层，消费这些 token，不另建主题根节点。
- 字体采用系统字体栈，不依赖联网获取字体。正文 16px、行高 1.7；长文行高 1.85。中文大标题行高至少 1.2，不用过密负字距。
- 标题 500–600 字重；大标题 40–64px；段落标题 24–32px；元信息至少 12px。窄体标签只承担栏目说明，等宽字体用于日期与状态。
- 4px 基础间距；使用 `--space-1` 至 `--space-10`。内容容器 1200px，长文约 760px；区块留白 64–96px。
- 控件圆角 10px、卡片 18px、胶囊 9999px。轻阴影表达卡片边界，避免层层套卡、大面积玻璃效果和悬浮胶囊导航。
- 导航始终可见，项目和关于优先。窄屏导航可横向滚动，不能被直接隐藏。触控入口至少 44px，键盘焦点清晰，提供跳转正文入口。
- 首页和关于页是作品集；项目是业务案例；博客和笔记是阅读；画廊由作品主导；工具页优先保证可操作性。
- 项目卡展示业务主题、摘要、阶段及技术标签；详情保留职责、结果、边界和实现记录。案例不全部跨整行堆叠。
- 中文导航和正文保持一致，英文只用于辅助栏目标签。联系邮箱来自现有公开资料。
- 动效仅用于操作反馈；尊重 `prefers-reduced-motion`。关键信息无需等待入场动画，打印关于页时保留经历与联系方式。

## 验收

运行 typecheck、lint、test、content:audit、build（含 images:check 和 gallery:check）。浏览器检查首页、项目列表和详情、关于、博客、笔记、画廊和工具页；覆盖桌面与 390px / 320px 窄屏，验证导航、搜索、流程切换、联系和打印入口。已有内容告警需单独记录。
