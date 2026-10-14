import type { Metadata } from "next";
import { CollectionList } from "@/components/collection-list";
import { SkillCard } from "@/components/skill-card";
import { getSkillPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "AI 工作流实践",
  description: "把 AI 能力做成可复用工作流的原创开发、业务改造与解析实测记录。",
};

export default async function SkillsPage() {
  const skills = await getSkillPosts();

  return (
    <div className="page-shell skills-index">
      <CollectionList
        title="AI 工作流实践"
        eyebrow="SKILLS / WORKFLOW PRACTICE"
        description="把 AI 能力做成可复用工作流。这里区分原创开发、基于第三方的业务改造，以及对开源 Skill 的解析与实测。"
        emptyLabel="暂无已发布的工作流实践。"
      >
        <div className="skill-card-grid">
          {skills.map((skill) => <SkillCard key={skill.slug} skill={skill} />)}
        </div>
      </CollectionList>
    </div>
  );
}
