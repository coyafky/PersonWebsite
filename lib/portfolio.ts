/** Editorial summaries grounded in the published project case studies. */
export const portfolioCases = [
  {
    slug: "feishu-crm-sales-assistant",
    category: "企业 AI 应用",
    title: "让销售用一句话，完成客户录入。",
    summary:
      "用飞书与 AI 助理连接线索录入、跟进记录和销售表格核对，让工具贴合一线的工作习惯。",
    responsibility: "业务规则 · 字段设计 · AI 行为约束",
    tab: "客户跟进",
    input: "销售发来客户信息",
    steps: ["提取字段", "人工确认", "写入飞书"],
    output: "可追溯的客户与跟进记录",
    boundary: "已在门店日常使用；微信客户仍需人工转入。",
  },
  {
    slug: "geoflow-content-pipeline",
    category: "AI 营销工作流",
    title: "把选题到归档，连成一条内容管线。",
    summary:
      "整理产品选题库，连接内容母版、平台改写和飞书归档，让营销内容生产有流程、有记录。",
    responsibility: "选题体系 · 平台改写规则 · 流程搭建",
    tab: "营销内容",
    input: "产品知识与选题",
    steps: ["生成母版", "平台改写", "归档追踪"],
    output: "有来源、有状态的内容记录",
    boundary: "管线已跑通；知识库未完备，内容效果尚未验证。",
  },
  {
    slug: "sales-knowledge-base-matching",
    category: "业务知识应用",
    title: "让产品资料，成为销售能调用的知识。",
    summary:
      "将车型适配目录接入销售助理，设计检索调用链与回答边界，让资料能够服务实际咨询。",
    responsibility: "知识梳理 · 检索流程 · 回答边界",
    tab: "知识检索",
    input: "客户提出车型适配问题",
    steps: ["检索目录", "匹配资料", "限定回答"],
    output: "有资料依据的产品建议",
    boundary: "接入链路已跑通；公司知识库仍在建设。",
  },
] as const;
