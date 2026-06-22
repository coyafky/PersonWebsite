import { type CareerPost, getCareerPosts } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";

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
  const careerItems = await getCareerPosts(true);
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

      {/* Skills & Stack */}
      <section className="about-subsection">
        <h2>Skills &amp; Stack</h2>
        <ul className="exp-list">
          {skills.map((item) => (
            <li className="exp-card" key={item.title}>
              <span className="exp-period">{item.period}</span>
              <span className="exp-title">{item.title}</span>
              {item.desc ? <p className="exp-desc">{item.desc}</p> : null}
            </li>
          ))}
        </ul>
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
        {sortedCareerItems.map((item) => (
          <section key={item.slug} className="content-section">
            <div className="section-heading">
              <h2>{item.title}</h2>
            </div>
            <MdxContent source={item.body} />
          </section>
        ))}
      </section>
    </div>
  );
}