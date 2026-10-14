import Link from "next/link";
import { BusinessWorkflow } from "@/components/business-workflow";
import { getBlogPosts, getProjectPosts } from "@/lib/content";
import { portfolioCases } from "@/lib/portfolio";

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    getProjectPosts(),
    getBlogPosts(),
  ]);
  const selectedCases = portfolioCases.flatMap((item) => {
    const project = projects.find((project) => project.slug === item.slug);
    return project ? [{ ...item, project }] : [];
  });

  return (
    <div className="page-shell portfolio-home">
      <section className="portfolio-hero" aria-labelledby="home-hero-title">
        <div className="portfolio-intro">
          <span className="section-kicker">COYA FENG / 冯科雅</span>
          <p className="portfolio-role">企业 AI 应用 · 营销工作流</p>
          <h1 id="home-hero-title">
            把 AI 接进业务，
            <br />
            让想法落到<span>日常工作。</span>
          </h1>
          <p className="portfolio-description">
            我关注企业里具体而重复的问题：客户如何跟进、内容如何生产、知识如何被使用。用
            AI 和合适的工具，把它们做成可执行、可复盘的工作流程。
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="#selected-work">
              查看项目案例 <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button secondary" href="/about">
              关于我与经历
            </Link>
          </div>
          <p className="portfolio-location">
            计算机科学背景 <span aria-hidden="true">/</span> 广州 · 佛山
          </p>
        </div>
        <BusinessWorkflow
          availableSlugs={selectedCases.map((item) => item.slug)}
        />
      </section>

      <div className="practice-strip" aria-label="实践领域">
        <span>从实际业务出发</span>
        <p>销售与客户管理</p>
        <p>营销内容生产</p>
        <p>企业知识应用</p>
      </div>

      <section
        className="portfolio-section"
        id="selected-work"
        aria-labelledby="selected-work-title"
      >
        <div className="section-heading">
          <div>
            <span className="section-kicker">SELECTED WORK</span>
            <h2 id="selected-work-title">做过的事，留下的结果。</h2>
          </div>
          <Link href="/projects">
            全部项目 <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="business-case-grid">
          {selectedCases.map((item) => (
            <article className="business-case" key={item.slug}>
              <div className="business-case-top">
                <span className="section-kicker">{item.category}</span>
                <span aria-hidden="true">↗</span>
              </div>
              <h3>
                <Link href={`/projects/${item.slug}`}>{item.title}</Link>
              </h3>
              <p>{item.summary}</p>
              <div className="business-case-role">
                <span>我的工作</span>
                <p>{item.responsibility}</p>
              </div>
              <div className="business-case-state">
                <span>{item.project.stage}</span>
                <p>{item.boundary}</p>
              </div>
              <Link className="case-read-link" href={`/projects/${item.slug}`}>
                阅读完整案例 <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        className="portfolio-method portfolio-section"
        aria-labelledby="method-title"
      >
        <div>
          <span className="section-kicker">HOW I WORK</span>
          <h2 id="method-title">
            先理解业务，
            <br />
            再选择工具。
          </h2>
          <p>
            技术是实现路径。更重要的是，谁会使用、怎样融入现有流程，以及结果如何检查。
          </p>
          <Link className="text-link" href="/about">
            了解我的工作方式 ↗
          </Link>
        </div>
        <ol className="method-list">
          <li>
            <span>01</span>
            <div>
              <h3>把问题说清楚</h3>
              <p>梳理使用者、业务目标和输入资料，明确哪些环节值得交给 AI。</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>做出能用的流程</h3>
              <p>
                连接现有工具，把业务规则、人工确认和异常处理放进同一条工作流。
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>验证，也记录边界</h3>
              <p>保留实际交付、使用反馈和失败记录，让下一次迭代有依据。</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="portfolio-section" aria-labelledby="writing-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">FIELD NOTES</span>
            <h2 id="writing-title">持续实践，也持续记录。</h2>
          </div>
          <Link href="/blog">全部文章 ↗</Link>
        </div>
        <div className="recent-writing">
          {posts.slice(0, 3).map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <time dateTime={post.date}>{post.date}</time>
              <h3>{post.title}</h3>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        <div className="explore-links">
          <Link href="/notes">学习笔记 ↗</Link>
          <Link href="/gallery">AI 视觉作品 ↗</Link>
          <Link href="/tools">实用小工具 ↗</Link>
        </div>
      </section>

      <section className="portfolio-contact" aria-labelledby="contact-title">
        <div>
          <span className="section-kicker">LET’S TALK</span>
          <h2 id="contact-title">聊聊企业里的下一个 AI 应用。</h2>
          <p>关注企业 AI 应用、营销运营与效率工具方向的工作机会。</p>
        </div>
        <a className="button primary" href="mailto:coya20020824@gmail.com">
          联系我 <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
}
