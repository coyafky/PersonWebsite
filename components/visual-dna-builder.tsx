"use client";

import { useMemo, useState } from "react";

type StyleTemplate = {
  id: string;
  label: string;
  description: string;
};

type VisualDimension = {
  id: string;
  label: string;
  description: string;
};

const STYLE_TEMPLATES: StyleTemplate[] = [
  {
    id: "car-commercial",
    label: "汽车商业广告",
    description: "高级商业摄影、清晰产品轮廓、克制背景与有方向性的高光。",
  },
  {
    id: "white-product",
    label: "白底电商产品",
    description: "干净白底、主体居中、边缘清晰，适合商品主图与目录展示。",
  },
  {
    id: "film-poster",
    label: "电影感海报",
    description: "有叙事感的环境、明确的视觉中心、电影级光影与色彩层次。",
  },
];

const VISUAL_DIMENSIONS: VisualDimension[] = [
  {
    id: "lighting",
    label: "光影",
    description: "大型条形柔光源、连续金属高光、轻微轮廓光",
  },
  {
    id: "composition",
    label: "构图",
    description: "主体位于视觉中心偏下，保留顶部留白，画面边缘不裁切主体",
  },
  {
    id: "material",
    label: "材质",
    description: "真实金属反射、清晰接缝、适度粗糙度，避免塑料感",
  },
  {
    id: "camera",
    label: "镜头",
    description: "三分之四侧前视角，中等焦段，透视自然，主体比例稳定",
  },
];

function buildPrompt(
  style: StyleTemplate,
  subject: string,
  dimension: VisualDimension,
  customDimension: string,
) {
  const dimensionDescription = customDimension.trim() || dimension.description;

  return `请生成一张${style.label}风格的图片。

主体：${subject.trim() || "一件需要展示的产品"}。

视觉重点：${dimension.label}。
风格描述：${style.description}
具体要求：${dimensionDescription}。

画面要求：主体清晰，结构真实，层次分明，避免无关元素。请保持整体风格统一，不添加虚假的品牌 Logo、水印或多余文字。`;
}

export function VisualDnaBuilder({
  initialSubject = "一辆金属蓝色新能源汽车 SUV",
}: {
  initialSubject?: string;
}) {
  const [selectedStyleId, setSelectedStyleId] = useState(STYLE_TEMPLATES[0].id);
  const [subject, setSubject] = useState(initialSubject);
  const [selectedDimensionId, setSelectedDimensionId] = useState(VISUAL_DIMENSIONS[0].id);
  const [customDimension, setCustomDimension] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedStyle =
    STYLE_TEMPLATES.find((style) => style.id === selectedStyleId) ?? STYLE_TEMPLATES[0];
  const selectedDimension =
    VISUAL_DIMENSIONS.find((dimension) => dimension.id === selectedDimensionId) ??
    VISUAL_DIMENSIONS[0];

  const prompt = useMemo(
    () => buildPrompt(selectedStyle, subject, selectedDimension, customDimension),
    [customDimension, selectedDimension, selectedStyle, subject],
  );

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="visual-dna-builder" aria-labelledby="visual-dna-title">
      <div className="visual-dna-builder-header">
        <div>
          <p className="visual-dna-builder-eyebrow">INTERACTIVE PRACTICE · 23.14</p>
          <h3 id="visual-dna-title">Visual DNA 逆向 Prompt 构建器</h3>
          <p>
            先选一个参考风格模板，再调整一个视觉维度。组件会把你的选择整理成一段可以继续修改的提示词。
          </p>
        </div>
        <span className="visual-dna-builder-status" aria-label="本练习在浏览器本地运行">
          LOCAL
        </span>
      </div>

      <div className="visual-dna-builder-grid">
        <div className="visual-dna-builder-form">
          <fieldset className="visual-dna-fieldset">
            <legend>参考风格模板</legend>
            <div className="visual-dna-style-options">
              {STYLE_TEMPLATES.map((style) => (
                <label
                  className={`visual-dna-style-option ${
                    selectedStyleId === style.id ? "is-selected" : ""
                  }`}
                  key={style.id}
                >
                  <input
                    checked={selectedStyleId === style.id}
                    name="visual-dna-style"
                    onChange={() => setSelectedStyleId(style.id)}
                    type="radio"
                    value={style.id}
                  />
                  <span className="visual-dna-radio" aria-hidden="true" />
                  <span>{style.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="visual-dna-control">
            <span>新主体</span>
            <input
              onChange={(event) => setSubject(event.target.value)}
              placeholder="例如：一只戴着银色护目镜的橘猫"
              type="text"
              value={subject}
            />
          </label>

          <label className="visual-dna-control">
            <span>选择要修改的视觉维度</span>
            <select
              onChange={(event) => setSelectedDimensionId(event.target.value)}
              value={selectedDimensionId}
            >
              {VISUAL_DIMENSIONS.map((dimension) => (
                <option key={dimension.id} value={dimension.id}>
                  {dimension.label}
                </option>
              ))}
            </select>
          </label>

          <div className="visual-dna-description" aria-live="polite">
            <span>当前风格描述</span>
            <p>{selectedDimension.description}</p>
          </div>

          <label className="visual-dna-control">
            <span>
              自定义该维度 <small>（可选）</small>
            </span>
            <textarea
              onChange={(event) => setCustomDimension(event.target.value)}
              placeholder="例如：左上方大型柔光箱，右后方方形轮廓光。"
              rows={3}
              value={customDimension}
            />
          </label>
        </div>

        <div className="visual-dna-output">
          <div className="visual-dna-output-heading">
            <div>
              <span className="visual-dna-output-kicker">PROMPT PREVIEW</span>
              <h4>可复制的提示词</h4>
            </div>
            <span className="visual-dna-output-count">{prompt.length} chars</span>
          </div>
          <pre className="visual-dna-prompt" aria-live="polite">
            {prompt}
          </pre>
          <button className="visual-dna-copy" onClick={copyPrompt} type="button">
            {copied ? "已复制 Prompt" : "复制提示词"}
            <span aria-hidden="true">↗</span>
          </button>
          <p className="visual-dna-note">
            这是一个本地练习组件。它不会调用模型，也不会上传你输入的内容；你可以把结果复制到任意生图工具中继续实验。
          </p>
        </div>
      </div>
    </section>
  );
}
