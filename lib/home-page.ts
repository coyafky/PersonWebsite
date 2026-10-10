export type HomeEntryPoint = {
  href: "/notes" | "/projects" | "/gallery";
  title: string;
  description: string;
};

export type HomeProcessStep = {
  key: "capture" | "transform" | "proof";
  label: string;
  title: string;
  description: string;
};

export type HomeProofStep = {
  label: "INPUT" | "BUILD" | "OUTPUT";
  value: string;
};

export type HomeProof = {
  href: string;
  eyebrow: string;
  title: string;
  summary: string;
  status: string;
  steps: HomeProofStep[];
};

export const homePageModel = {
  signature: "workflow-panel" as const,
  heroProof: {
    href: "/projects/ark-seedream-car-preview",
    eyebrow: "FEATURED CASE / PROVEN",
    title: "车膜预览生图系统",
    summary: "客户发一张实车图，系统生成贴膜预览，再通过飞书回传。",
    status: "CUSTOMER PHOTO → AI PREVIEW → DELIVERY",
    steps: [
      { label: "INPUT", value: "实车照片 + 色卡" },
      { label: "BUILD", value: "Ark Seedream + Prompt 约束" },
      { label: "OUTPUT", value: "可确认的预览图" },
    ],
  } satisfies HomeProof,
  entryPoints: [
    {
      href: "/notes",
      title: "Notes",
      description: "把学习、阅读和实验留下的原始材料整理成可复用的知识。",
    },
    {
      href: "/projects",
      title: "Projects",
      description: "查看从问题出发、经过工具处理，最后留下结果的真实项目。",
    },
    {
      href: "/gallery",
      title: "Gallery",
      description: "观察 AI 视觉实验中的提示词、变量和最终判断。",
    },
  ] satisfies HomeEntryPoint[],
  process: [
    {
      key: "capture",
      label: "01 / CAPTURE",
      title: "先把问题留下来",
      description: "从笔记、素材和现场问题开始，不急着把它包装成答案。",
    },
    {
      key: "transform",
      label: "02 / TRANSFORM",
      title: "让 AI 和工具参与",
      description: "把重复工作拆成流程，让 Agent、脚本和视觉工具各自处理擅长的部分。",
    },
    {
      key: "proof",
      label: "03 / PROOF",
      title: "留下可以验证的结果",
      description: "最终交付、失败记录和复盘一起留下，形成下一次工作的起点。",
    },
  ] satisfies HomeProcessStep[],
} as const;
