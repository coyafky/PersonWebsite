import { Icons0Document, Icons0Idea, Icons0Portfolio } from "@/components/icons0";
import { MdxContent } from "@/components/mdx-content";
import {
  type CareerPost,
  getCareerPosts,
  getFeaturedProjects,
} from "@/lib/content";

export const metadata = {
  title: "Career",
  description: "Career evidence, resume bullets, and project-backed stories.",
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

export default async function CareerPage() {
  const [projects, careerItems] = await Promise.all([
    getFeaturedProjects(),
    getCareerPosts(true),
  ]);
  const sortedCareerItems = sortCareerItems(careerItems);

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>Career</h1>
        <p>一个连接技能、项目证据和求职材料的能力索引。</p>
      </header>
      <section className="career-grid">
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
      </section>
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
          {projects.map((project) => (
            <li key={project.slug}>
              <strong>{project.title}</strong>
              <span>{project.resumeBullets[0]}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}