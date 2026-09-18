import Link from "next/link";
import { AboutHero } from "@/components/about/AboutHero";
import { ProjectRail, type RailItem } from "@/components/about/ProjectRail";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/animations";
import { MdxContent } from "@/components/mdx-content";
import { type CareerPost, getCareerPosts, getProjectPosts } from "@/lib/content";

export const metadata = {
  title: "About",
  description:
    "冯科雅 (Coya) —— 我把 AI 接进真实业务：怎么做事、做过什么、以及我看重什么。",
};

/**
 * 我的做事方式（原 /about 的「Skills & Stack」+ profile.md 的「工作风格」合并压缩）。
 *
 * 前 4 条直接来自 content/career/profile.md 的「工作风格」段（你自己写的原文），
 * 第 5 条是我从这一周的 lab 记录里提炼的 —— 不合适就删。
 * 这里刻意用「行为」而不是「能力标签」来描述：能力标签是简历语言，行为不是。
 */
const traits: { title: string; desc: string }[] = [
  {
    title: "多件事一起跑",
    desc: "并行推进是默认模式，不串行等待。手上同时开几条线，互相之间不阻塞。",
  },
  {
    title: "先要「下一步」，不要开放题",
    desc: "比起「你想怎么做？」，更擅长接过一个明确的目标往下推。目标不清时我会先去把目标问清。",
  },
  {
    title: "能自动跑的绝不手动盯",
    desc: "重复的事一律做成定时任务或脚本。设一次，让它自己跑，我只在出问题时介入。",
  },
  {
    title: "结论要有依据，不接受空安慰",
    desc: "数据说话。拿不出依据的结论就是没结论，哪怕它听起来很顺。对自己也一样。",
  },
  {
    title: "不把「看起来对」当成「实测对」",
    desc: "现象对、理由可能是错的。所以习惯把说法变成能跑出数字的断言 —— 能证伪的才算数。",
  },
];

/** 能力面：把原来的 skills 数组 + 4 组 techStack 压成 3 行 */
const stack: { label: string; items: string[] }[] = [
  { label: "语言 / 框架", items: ["TypeScript", "Python", "Next.js", "SQL"] },
  { label: "AI 工程", items: ["Hermes Agent", "Claude Code", "Codex CLI", "Agent Teams", "OpenClaw"] },
  { label: "内容与协作", items: ["Obsidian", "飞书", "Git / GitHub", "Vercel"] },
];

/**
 * 折叠区只放**已经发生过的事**：学历、任职、简历条目、STAR 故事。
 *
 * 刻意排除：
 *  - profile.md —— 内容已拆进上面三节，再渲染就是重复
 *  - goal-roadmap / goal-checklist —— 「6 个月路线图 / JD 覆盖度 / 达标自检」，
 *    全是朝前看的目标，不是「我做过什么」。这两个文件已于 2026-09-18 删除。
 *
 * 注意 bullets 目前是 status: draft → 走 getCareerPosts() 时不会渲染。
 * 保留在名单里，等它改成 published 就会自动出现在折叠区。
 */
// 注意 bullets 目前是 status: draft → 走 getCareerPosts() 时不会渲染。
// 保留在名单里，等它改成 published 就会自动出现在折叠区。
const CAREER_FOLD_ORDER = ["bullets", "star-stories"];

function sortCareer(items: CareerPost[]) {
  return [...items]
    .filter((item) => CAREER_FOLD_ORDER.includes(item.slug))
    .sort((a, b) => CAREER_FOLD_ORDER.indexOf(a.slug) - CAREER_FOLD_ORDER.indexOf(b.slug));
}

export default async function AboutPage() {
  const [projects, careerItems] = await Promise.all([
    getProjectPosts(),
    // ⚠️ 不传 true。旧版这里写的是 getCareerPosts(true)（includeDrafts），
    // 而 content/career/ 里有 3 份 status: draft —— 等于把草稿公开发布在
    // 一个静态页上还进了 sitemap。草稿就是草稿，不该因为「顺手传了个 true」上线。
    getCareerPosts(),
  ]);

  // 精选置顶，其余按日期倒序 —— 与 /projects 的口径一致
  const railItems: RailItem[] = [...projects]
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.date.localeCompare(a.date);
    })
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      meta: [project.role, project.period].filter(Boolean).join(" · "),
      href: `/projects/${project.slug}`,
    }));

  const foldedCareer = sortCareer(careerItems);

  return (
    <div className="page-shell narrow about-page">
      <AboutHero>
        <p>
          计算机科学本科 · AI 提效实践者。关注 Agent 工作流、内容工程与生成式视觉，
          也持续记录每一次从问题到交付的过程。
        </p>
        <div className="about-proof-strip" aria-label="Focus areas">
          <span>AI WORKFLOWS</span>
          <span>CONTENT SYSTEMS</span>
          <span>APPLIED LEARNING</span>
        </div>
      </AboutHero>

      {/* ① 我是谁 */}
      <RevealOnScroll>
        <section className="about-subsection">
          <span className="about-section-label">WHO I AM</span>
          <h2>我是谁</h2>
          <div className="about-profile">
            <p>
              我习惯从一个不够清楚的问题开始：先拆出业务目标、输入、流程和验证方式，再判断
              AI 应该接管哪一步、哪些判断必须留给人。最终交付的不只是一次演示，而是能继续使用、
              复盘和迭代的工作方法。
            </p>
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
      </RevealOnScroll>

      {/* ② 我做过什么 —— 横向画廊 */}
      <RevealOnScroll>
        <section className="about-subsection">
          <span className="about-section-label">WHAT I&apos;VE BUILT</span>
          <h2>我做过什么</h2>
          <p className="muted-block">
            横着看，一共 {railItems.length} 件。每个都能点进去看细节和当时踩过的坑。
          </p>
        </section>
      </RevealOnScroll>

      <ProjectRail items={railItems} />

      <RevealOnScroll>
        <p className="about-more">
          <Link className="button secondary" href="/projects">
            全部项目 →
          </Link>
        </p>
      </RevealOnScroll>

      {/* ③ 我的特点和优势 */}
      <RevealOnScroll>
        <section className="about-subsection">
          <span className="about-section-label">HOW I WORK</span>
          <h2>我的特点和优势</h2>
          <StaggerContainer className="about-traits">
            {traits.map((trait) => (
              <StaggerItem className="about-trait" key={trait.title}>
                <h3 className="about-trait-title">{trait.title}</h3>
                <p className="about-trait-desc">{trait.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="about-stack">
            {stack.map((group) => (
              <div className="about-stack-row" key={group.label}>
                <span className="about-stack-label">{group.label}</span>
                <span className="about-stack-items">
                  {group.items.map((item) => (
                    <span className="about-stack-chip" key={item}>
                      {item}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      {/* 折叠：经历与求职材料 */}
      <RevealOnScroll>
        <details className="about-fold">
          <summary>
            <span className="about-section-label">MORE</span>
            <span className="about-fold-title">经历与求职材料</span>
            <span className="about-fold-hint">
              教育、工作经历、简历条目与 STAR 故事 —— 都是已经发生的事，默认收起
            </span>
          </summary>

          <div className="about-fold-body">
            <section className="about-fold-block">
              <h3>教育</h3>
              <ul className="exp-list">
                <li className="exp-card">
                  <span className="exp-period">2021.09–2025.06</span>
                  <span className="exp-title">佛山大学 · 计算机科学与技术</span>
                  <p className="exp-desc">
                    本科。主修：操作系统、数据库、软件工程、软件测试。
                    毕业设计：智能家教推荐系统，参与测试用例编写、接口测试及问题跟进。
                  </p>
                </li>
              </ul>
            </section>

            <section className="about-fold-block">
              <h3>工作经历</h3>
              <ul className="exp-list">
                <li className="exp-card">
                  <span className="exp-period">2025.06–2025.08</span>
                  <span className="exp-title">美鑫梳刷制造有限公司 · 阿里巴巴国际站运营</span>
                  <p className="exp-desc">
                    整理 B2B 买家搜索习惯与英文标题写法，结合 AI 工具产出 20+ 组标题方案；
                    清洗 100+ 条客户询盘数据并分类标记。
                  </p>
                </li>
                <li className="exp-card">
                  <span className="exp-period">2024.09–2024.11</span>
                  <span className="exp-title">广州互诚密胺制品有限公司 · 外贸业务员</span>
                  <p className="exp-desc">
                    参与海外客户开发、产品介绍、报价沟通与订单跟进，任职期间促成 2 单成交。
                  </p>
                </li>
              </ul>
            </section>

            {foldedCareer.map((item) => (
              <section className="about-fold-block" key={item.slug}>
                <h3>{item.title}</h3>
                <MdxContent source={item.body} />
              </section>
            ))}
          </div>
        </details>
      </RevealOnScroll>
    </div>
  );
}
