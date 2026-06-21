import { Icons0Document, Icons0Idea, Icons0Portfolio } from "@/components/icons0";
import { MdxContent } from "@/components/mdx-content";
import { type CareerPost, getCareerPosts, getFeaturedProjects } from "@/lib/content";

export const metadata = {
  title: "About",
  description:
    "冯科雅 (Coya) —— CS 背景，AI 提效实践者。个人介绍、经历、项目与技术栈。",
};

// 期望的展示顺序：goal-roadmap → goal-checklist → profile → bullets → star-stories
const careerOrder: Record<string, number> = {
  "goal-roadmap": 1,
  "goal-checklist": 2,
  profile: 3,
  bullets: 4,
  "star-stories": 5,
};

function sortCareerItems(items: CareerPost[]) {
  return items.toSorted((a, b) => {
    const orderA = careerOrder[a.slug] ?? 100;
    const orderB = careerOrder[b.slug] ?? 100;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return b.date.localeCompare(a.date);
  });
}

type ExpItem = {
  period: string;
  title: string;
  desc: string;
  link?: { href: string; label: string };
};

type TechCategory = {
  label: string;
  items: string[];
};

const education: ExpItem[] = [
  {
    period: "2021.09–2025.06",
    title: "佛山大学 · 计算机科学与技术",
    desc:
      "本科。主修：操作系统、数据库、软件工程、软件测试。" +
      "毕业设计：智能家教推荐系统，参与测试用例编写、接口测试及问题跟进，" +
      "使用 Postman 发现并协同修复 3 处接口问题。",
  },
];

const experience: ExpItem[] = [
  {
    period: "2025.06–2025.08",
    title: "美鑫梳刷制造有限公司 · 阿里巴巴国际站运营",
    desc:
      "根据 B2B 买家搜索习惯整理英文标题写法，结合 AI 工具产出 20+ 组标题方案；" +
      "使用 Excel 清洗 100+ 条客户询盘数据，按内容进行关键词标记和分类整理；" +
      "结合 Google Trend 趋势上新和上架新品。",
  },
  {
    period: "2025.09–2025.12",
    title: "广州互诚密胺制品有限公司 · 外贸业务员",
    desc:
      "参与海外客户开发、产品介绍、报价沟通和订单跟进；" +
      "通过客户筛选、主动沟通、需求确认和持续跟进，任职期间促成 2 单成交；" +
      "根据客户反馈整理需求信息，协助推进后续沟通和销售跟进。",
  },
];

const projects: ExpItem[] = [
  {
    period: "2026.04",
    title: "OpenClaw 业务 Agent 设计与落地",
    desc:
      "基于 OpenClaw + 飞书搭建车膜客服、门店后台线索整理、营销内容助手 3 类业务 Agent 原型，" +
      "打通消息入口、Agent 路由和 workspace 规则文件；设计汽车品牌海报自动化 workflow，" +
      "适配 9:16 朋友圈营销海报场景。",
    link: { href: "/projects/openclaw-business-agent", label: "查看项目档案" },
  },
  {
    period: "2026.04",
    title: "车膜换色 Demo 设计",
    desc:
      "围绕车膜门店展示场景，设计「客户发送车图 + 颜色需求 → 返回换色效果参考」的业务原型；" +
      "针对颜色表达不标准的问题，梳理 HEX 色值和提示词结合的映射逻辑，" +
      "缩短客户理解成本和销售沟通成本。",
    link: {
      href: "/projects/ark-seedream-car-preview",
      label: "查看项目档案",
    },
  },
  {
    period: "2026.06",
    title: "个人网站内容系统",
    desc:
      "Next.js App Router + Markdown/MDX 内容系统，统一博客、周记、项目档案、求职材料于同一 Git 仓库，" +
      "包含 inbox → 内容的四条自动化转化链路。",
    link: { href: "/projects/personal-website", label: "查看项目档案" },
  },
];

const skills: ExpItem[] = [
  {
    period: "能力",
    title: "AI 应用与工作流",
    desc:
      "能使用 OpenClaw、飞书等工具搭建轻量业务 Agent，支持客服、内容起稿和线索整理场景。",
  },
  {
    period: "能力",
    title: "业务理解与执行",
    desc:
      "能围绕门店咨询、内容获客、客户跟进等场景梳理流程，并输出可演示的 AI 原型。",
  },
  {
    period: "能力",
    title: "沟通与协作",
    desc: "熟悉使用飞书进行信息同步、问题跟进和跨角色协作。",
  },
  {
    period: "能力",
    title: "英文沟通",
    desc: "具备基本英语听说读写能力，参加过第 138 届广交会。",
  },
];

const techStack: TechCategory[] = [
  {
    label: "Languages & Frameworks",
    items: ["TypeScript", "Python", "JavaScript", "Next.js", "Astro", "SQL"],
  },
  {
    label: "AI & Agent Tools",
    items: ["Hermes Agent", "Claude Code", "Codex CLI", "OpenCode", "OpenClaw", "Agent Teams"],
  },
  {
    label: "Productivity & Content",
    items: ["Obsidian", "Feishu / Lark", "Git / GitHub", "VSCode", "Vercel"],
  },
  {
    label: "Testing & Data",
    items: ["Postman", "Excel", "Mermaid", "gray-matter", "Zod"],
  },
];

function ExpSection({
  heading,
  items,
}: {
  heading: string;
  items: ExpItem[];
}) {
  return (
    <section className="about-subsection">
      <h2>{heading}</h2>
      <ul className="exp-list">
        {items.map((item) => (
          <li className="exp-card" key={item.title}>
            <span className="exp-period">{item.period}</span>
            <span className="exp-title">{item.title}</span>
            {item.desc ? <p className="exp-desc">{item.desc}</p> : null}
            {item.link ? (
              <a className="exp-link" href={item.link.href}>
                {item.link.label} →
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function AboutPage() {
  const [featuredProjects, careerItems] = await Promise.all([
    getFeaturedProjects(),
    getCareerPosts(true),
  ]);
  const sortedCareerItems = sortCareerItems(careerItems);

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>About</h1>
        <p>冯科雅 (Coya) · 计算机科学本科 · AI 提效实践者</p>
      </header>

      {/* Profile */}
      <section className="about-subsection">
        <h2>个人简介</h2>
        <div className="about-profile">
          <p>
            2002 年生，佛山大学计算机科学与技术本科（2025 届）。当前在职，任 AI
            部成员，负责「用 AI 为企业提效」，坐标佛山禅城。
          </p>
          <p>
            已从「会用工具」向「用工具搭建系统」完成第一次跃迁。当前重点：把 AI
            能力转化为真实业务价值——理解业务 + 技术落地 + 人员协作。
          </p>
          <p className="muted-block">
            喜欢并行推进、结构化输出、数据驱动。需要明确的下一步指令，不喜欢「你想怎么做？」式的空泛提问。
          </p>
          <p className="muted-block">
            联系邮箱：
            <a href="mailto:coya20020824@gmail.com">coya20020824@gmail.com</a>
          </p>
        </div>
      </section>

      {/* Education */}
      <ExpSection heading="教育" items={education} />

      {/* Work Experience */}
      <ExpSection heading="工作经历" items={experience} />

      {/* Projects / Experience */}
      <ExpSection heading="项目经历" items={projects} />

      {/* Skills */}
      <ExpSection heading="专业技能" items={skills} />

      {/* Tech Stack */}
      <section className="about-subsection">
        <h2>常用工具 &amp; 技术栈</h2>
        <div className="tech-grid">
          {techStack.map((category) => (
            <div className="tech-category" key={category.label}>
              <h3>{category.label}</h3>
              <ul className="tech-pills">
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Why this site exists */}
      <section className="about-subsection">
        <h2>Why this site exists</h2>
        <div className="about-profile">
          <p>
            这个网站不是一次性作品集，而是一个持续维护的内容系统。它把日常记录、项目复盘和职业材料放到同一个
            Git 仓库里，让每一次写作都能为长期成长和求职准备留下证据。
          </p>
          <p className="muted-block">
            Built with Next.js App Router + TypeScript + Markdown/MDX. Deployed
            on Vercel.
          </p>
        </div>
      </section>

      {/* Career — 合并自原 /career 路由 */}
      <section className="about-subsection">
        <h2 id="career">Career</h2>
        <p className="muted-block">
          一个连接技能、项目证据和求职材料的能力索引。原 /career 路由已合并到此页。
        </p>
        <div className="career-grid">
          <div className="career-panel">
            <Icons0Portfolio />
            <h2>Focus</h2>
            <p>Frontend engineering, AI-assisted workflows, and product-minded development.</p>
          </div>
          <div className="career-panel">
            <Icons0Document />
            <h2>Resume Material</h2>
            <p>English bullets and STAR stories live in `content/career/` as reviewable drafts.</p>
          </div>
          <div className="career-panel">
            <Icons0Idea />
            <h2>Evidence</h2>
            <p>Career claims should trace back to real projects, weekly notes, or confirmed experience.</p>
          </div>
        </div>
        {sortedCareerItems.map((item) => (
          <section key={item.slug} className="content-section">
            <div className="section-heading">
              <h2>{item.title}</h2>
            </div>
            <MdxContent source={item.body} />
          </section>
        ))}
        <section className="content-section">
          <div className="section-heading">
            <h2>Project Evidence</h2>
          </div>
          <ul className="evidence-list">
            {featuredProjects.map((project) => (
              <li key={project.slug}>
                <strong>{project.title}</strong>
                <span>{project.resumeBullets[0]}</span>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}
