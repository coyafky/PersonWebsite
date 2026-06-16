export const metadata = {
  title: "About",
  description:
    "冯科雅 (Coya) —— CS 背景，AI 提效实践者。个人介绍、经历与技术栈。",
};

type ExpItem = {
  period: string;
  title: string;
  desc: string;
};

type TechCategory = {
  label: string;
  items: string[];
};

const education: ExpItem[] = [
  {
    period: "2021.09–2025.06",
    title: "佛山大学 · 计算机科学与技术",
    desc: "本科。主修：操作系统、数据库、软件工程、软件测试。",
  },
];

const experience: ExpItem[] = [
  {
    period: "2025.06–2025.07",
    title: "美鑫机械梳刷制造有限公司 · 阿里国际站运营",
    desc: "整理英文标题写法，AI 工具产出 20+ 组标题；清洗询盘数据 100+ 条；整理巴西/日本市场调研。",
  },
  {
    period: "2024.09–2024.11",
    title: "广州互诚（Melamine） · 外贸销售",
    desc: "客户沟通与订单跟进，促成 2 单成交。",
  },
];

const projects: ExpItem[] = [
  {
    period: "2025.02–2025.05",
    title: "智能家教推荐系统",
    desc: "测试用例编写、Postman 接口测试、文档维护。",
  },
  {
    period: "2025",
    title: "AI 工具部署与应用实践",
    desc: "搭建个人 AI 操作系统（Hermes Agent + Obsidian），持续维护 182+ Hermes skills 和 90+ Claude Code skills，搭建四角色 Agent Team（Architect / Coder / Tester / Deployer）。",
  },
  {
    period: "2025",
    title: "个人网站内容系统",
    desc: "Next.js App Router + Markdown/MDX 内容系统，包含 inbox → 内容的四条自动化转化链路。",
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
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AboutPage() {
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
            2002 年生，佛山大学计算机科学与技术本科（2025 届）。现任 AI
            部成员，负责「用 AI 为企业提效」，坐标广州 / 佛山。
          </p>
          <p>
            已从「会用工具」向「用工具搭建系统」完成第一次跃迁。当前重点：把 AI
            能力转化为真实业务价值——理解业务 + 技术落地 + 人员协作。
          </p>
          <p className="muted-block">
            喜欢并行推进、结构化输出、数据驱动。需要明确的下一步指令，不喜欢「你想怎么做？」式的空泛提问。
          </p>
        </div>
      </section>

      {/* Education */}
      <ExpSection heading="教育" items={education} />

      {/* Work Experience */}
      <ExpSection heading="工作经历" items={experience} />

      {/* Projects / Experience */}
      <ExpSection heading="项目经历" items={projects} />

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
    </div>
  );
}
