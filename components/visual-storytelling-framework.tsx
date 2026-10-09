type StorytellingDimension = {
  english: string;
  title: string;
  description: string;
};

const DEFAULT_DIMENSIONS: StorytellingDimension[] = [
  {
    english: "01 · Story Arc",
    title: "故事结构",
    description: "开端、发展、转折、结局",
  },
  {
    english: "02 · Character Consistency",
    title: "角色一致性",
    description: "身份、外貌、服装、配饰",
  },
  {
    english: "03 · Scene Continuity",
    title: "场景连续性",
    description: "地点、建筑、道具、天气",
  },
  {
    english: "04 · Shot Progression",
    title: "镜头衔接",
    description: "远景、中景、近景、特写",
  },
  {
    english: "05 · Action Continuity",
    title: "动作连续性",
    description: "姿态、运动方向、接触关系",
  },
  {
    english: "06 · Emotional Progression",
    title: "情绪递进",
    description: "期待、好奇、紧张、释然",
  },
  {
    english: "07 · Time Continuity",
    title: "时间连续性",
    description: "昼夜变化、光线、事件先后",
  },
  {
    english: "08 · Visual Consistency",
    title: "视觉语言一致性",
    description: "色调、画幅、风格、排版",
  },
];

export function VisualStorytellingFramework({
  dimensions = DEFAULT_DIMENSIONS,
  label = "VISUAL STORYTELLING FRAMEWORK",
}: {
  dimensions?: StorytellingDimension[];
  label?: string;
}) {
  return (
    <section className="visual-storytelling-framework" aria-label="视觉叙事的八大控制维度">
      <p className="visual-storytelling-framework-label">{label}</p>
      <ol className="visual-storytelling-framework-grid">
        {dimensions.map((dimension) => (
          <li className="visual-storytelling-framework-item" key={dimension.english}>
            <p className="visual-storytelling-framework-english">{dimension.english}</p>
            <h3>{dimension.title}</h3>
            <p className="visual-storytelling-framework-description">{dimension.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
