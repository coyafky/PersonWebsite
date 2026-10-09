"use client";

import { useEffect, useState } from "react";
import { ImageLightbox } from "@/components/image-lightbox";

type LightingDirection = {
  id: string;
  label: string;
  description: string;
  prompt: string;
  src: string;
};

const LIGHTING_DIRECTIONS: LightingDirection[] = [
  {
    id: "front",
    label: "顺光",
    description: "光线从相机方向照向人物，面部受光均匀，画面清楚、直接。",
    prompt: "顺光，光线从相机方向照向主体，人物面部受光均匀，阴影柔和。",
    src: "/images/course/gpt-image-2/lesson6/08.svg",
  },
  {
    id: "side",
    label: "侧光",
    description: "光线从主体侧面进入，明暗分区明显，适合强调脸部或材质的立体结构。",
    prompt: "侧光，光线从主体右侧进入，面部与服装形成清晰但自然的明暗层次。",
    src: "/images/course/gpt-image-2/lesson6/07.svg",
  },
  {
    id: "back",
    label: "逆光",
    description: "光线位于主体后方，轮廓更突出，主体正面可能进入剪影或低曝光状态。",
    prompt: "逆光，太阳位于主体后方，人物轮廓出现清晰边缘光，正面保留适度细节。",
    src: "/images/course/gpt-image-2/lesson6/09.svg",
  },
  {
    id: "rim",
    label: "侧逆光",
    description: "光线从主体后侧斜向进入，同时保留侧面细节，兼顾轮廓光和空间层次。",
    prompt: "侧逆光，光线从主体右后方斜向照射，发丝与肩部有轮廓光，侧面保留材质细节。",
    src: "/images/course/gpt-image-2/lesson6/10.svg",
  },
];

export function LightingDirectionCarousel() {
  const [activeIndex, setActiveIndex] = useState(3);
  const active = LIGHTING_DIRECTIONS[activeIndex];

  function selectDirection(index: number) {
    setActiveIndex((index + LIGHTING_DIRECTIONS.length) % LIGHTING_DIRECTIONS.length);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") selectDirection(activeIndex - 1);
      if (event.key === "ArrowRight") selectDirection(activeIndex + 1);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  return (
    <section className="lighting-direction-carousel" aria-labelledby="lighting-direction-title">
      <div className="lighting-direction-carousel-header">
        <div>
          <p className="lighting-direction-carousel-eyebrow">LIGHT DIRECTION · 06.10</p>
          <h3 id="lighting-direction-title">选择光线方向，观察光影关系</h3>
          <p>点击底部选项，或使用键盘左右方向键切换同一人物在四种光线方向下的示意图。</p>
        </div>
        <span className="lighting-direction-carousel-index">
          {String(activeIndex + 1).padStart(2, "0")} / {String(LIGHTING_DIRECTIONS.length).padStart(2, "0")}
        </span>
      </div>

      <div className="lighting-direction-carousel-stage">
        <button
          className="lighting-direction-carousel-arrow is-prev"
          type="button"
          aria-label="上一个光线方向"
          onClick={() => selectDirection(activeIndex - 1)}
        >
          ←
        </button>
        <ImageLightbox src={active.src} alt={`${active.label}光线方向示意图`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- local SVG lesson diagrams are intentionally switchable. */}
          <img className="lighting-direction-carousel-image" src={active.src} alt={`${active.label}光线方向示意图`} />
        </ImageLightbox>
        <button
          className="lighting-direction-carousel-arrow is-next"
          type="button"
          aria-label="下一个光线方向"
          onClick={() => selectDirection(activeIndex + 1)}
        >
          →
        </button>
      </div>

      <div className="lighting-direction-carousel-caption" aria-live="polite">
        <div>
          <span className="lighting-direction-carousel-label">{active.label}</span>
          <p>{active.description}</p>
        </div>
        <div className="lighting-direction-carousel-prompt">
          <span>提示词片段</span>
          <p>{active.prompt}</p>
        </div>
      </div>

      <div className="lighting-direction-carousel-tabs" role="tablist" aria-label="光线方向">
        {LIGHTING_DIRECTIONS.map((direction, index) => (
          <button
            className={index === activeIndex ? "is-active" : ""}
            key={direction.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            onClick={() => selectDirection(index)}
          >
            {direction.label}
          </button>
        ))}
      </div>
    </section>
  );
}
