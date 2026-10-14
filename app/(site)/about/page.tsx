import Link from "next/link";
import { MdxContent } from "@/components/mdx-content";
import { PrintProfile } from "@/components/print-profile";
import { getCareerPosts, getProjectPosts } from "@/lib/content";
import { portfolioCases } from "@/lib/portfolio";

export const metadata = {
  title: "关于冯科雅",
  description:
    "冯科雅 Coya：计算机科学背景，关注企业 AI 应用、营销运营和效率工具。查看项目实践、工作经历与联系方式。",
};

const abilities = [
  {
    title: "业务理解",
    description: "从销售、运营的实际工作出发，梳理需求、字段口径和业务规则。",
    tools: "客户跟进 / 需求拆解 / 流程设计",
  },
  {
    title: "AI 应用落地",
    description:
      "连接 Agent、飞书与现有资料，让自然语言输入进入可确认、可追溯的流程。",
    tools: "Hermes / OpenClaw / 飞书 / Python",
  },
  {
    title: "营销内容运营",
    description:
      "组织选题和产品知识，配置平台改写规则，并记录内容来源与生产状态。",
    tools: "选题体系 / GEOFlow / 内容归档",
  },
];

export default async function AboutPage() {
  const [projects, careerPosts] = await Promise.all([
    getProjectPosts(),
    getCareerPosts(),
  ]);
  const publicCases = portfolioCases.filter((item) =>
    projects.some((project) => project.slug === item.slug),
  );
  const careerItems = careerPosts.filter((item) =>
    ["bullets", "star-stories"].includes(item.slug),
  );
  return (
    <div className="page-shell profile-page">
      <header className="profile-hero">
        <div>
          <span className="section-kicker">ABOUT / COYA FENG</span>
          <h1>
            冯科雅 <span>Coya</span>
          </h1>
          <p className="profile-position">企业 AI 应用 · 营销运营 · 效率工具</p>
          <p>
            计算机科学背景，做过外贸销售与电商运营，现在关注如何把 AI
            接进企业的日常工作。从业务需求出发，用工具搭建流程，再用实际反馈检查结果。
          </p>
          <div className="hero-actions">
            <a className="button primary" href="mailto:coya20020824@gmail.com">
              邮件联系 ↗
            </a>
            <PrintProfile />
          </div>
          <a className="profile-email" href="mailto:coya20020824@gmail.com">
            coya20020824@gmail.com
          </a>
        </div>
        <dl className="profile-facts">
          <div>
            <dt>所在地</dt>
            <dd>广州 / 佛山</dd>
          </div>
          <div>
            <dt>教育背景</dt>
            <dd>
              佛山大学
              <br />
              计算机科学与技术 · 本科
            </dd>
          </div>
          <div>
            <dt>当前实践</dt>
            <dd>
              企业 AI 提效
              <br />
              销售助理与营销工作流
            </dd>
          </div>
          <div>
            <dt>求职方向</dt>
            <dd>企业 AI 应用与营销</dd>
          </div>
        </dl>
      </header>
      <section className="portfolio-section" aria-labelledby="ability-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">WHAT I BRING</span>
            <h2 id="ability-title">把业务和工具连接起来。</h2>
          </div>
        </div>
        <div className="profile-abilities">
          {abilities.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span>{item.tools}</span>
            </article>
          ))}
        </div>
      </section>
      <section
        className="portfolio-section"
        aria-labelledby="profile-work-title"
      >
        <div className="section-heading">
          <div>
            <span className="section-kicker">PROJECT EXPERIENCE</span>
            <h2 id="profile-work-title">项目实践</h2>
          </div>
          <Link href="/projects">全部项目 ↗</Link>
        </div>
        <div className="profile-projects">
          {publicCases.map((item) => (
            <Link href={`/projects/${item.slug}`} key={item.slug}>
              <span className="section-kicker">{item.category}</span>
              <h3>
                {item.title} <span aria-hidden="true">↗</span>
              </h3>
              <p>{item.summary}</p>
              <p className="profile-case-boundary">{item.boundary}</p>
            </Link>
          ))}
        </div>
      </section>
      <section
        className="portfolio-section profile-experience"
        id="experience"
        aria-labelledby="experience-title"
      >
        <div>
          <span className="section-kicker">EXPERIENCE</span>
          <h2 id="experience-title">经历与教育</h2>
        </div>
        <div className="experience-list">
          <article>
            <span>当前实践</span>
            <h3>AI 部成员 · 企业提效</h3>
            <p>
              参与企业 AI
              工具部署与应用，围绕销售线索、知识检索和营销内容设计工作流程。具体职责与项目边界见项目案例。
            </p>
          </article>
          <article>
            <span>2025.06 — 2025.07</span>
            <h3>美鑫机械梳刷制造有限公司</h3>
            <h4>阿里国际站运营</h4>
            <p>
              结合 AI 工具整理 20+ 组英文标题；清洗 100+
              条询盘数据，参与巴西、日本市场调研与产品资料整理。
            </p>
          </article>
          <article>
            <span>2024.09 — 2024.11</span>
            <h3>广州互诚密胺制品有限公司</h3>
            <h4>外贸销售</h4>
            <p>参与客户沟通、产品介绍和订单跟进，任职期间促成 2 单成交。</p>
          </article>
          <article>
            <span>2021.09 — 2025.06</span>
            <h3>佛山大学</h3>
            <h4>计算机科学与技术 · 本科</h4>
            <p>
              学习操作系统、数据库、软件工程和软件测试。毕业设计为智能家教推荐系统，参与测试用例编写、Postman
              接口测试和文档维护。
            </p>
          </article>
        </div>
      </section>
      {careerItems.map((item) => (
        <details className="profile-stories" key={item.slug}>
          <summary>
            {item.title}
            <span>展开项目复盘与补充材料</span>
          </summary>
          <MdxContent source={item.body} />
        </details>
      ))}
      <section className="portfolio-contact">
        <div>
          <span className="section-kicker">CONTACT</span>
          <h2>从一个具体的业务问题聊起。</h2>
          <p>欢迎交流企业 AI 应用与营销方向的工作机会。</p>
        </div>
        <a className="button primary" href="mailto:coya20020824@gmail.com">
          联系我 ↗
        </a>
      </section>
    </div>
  );
}
