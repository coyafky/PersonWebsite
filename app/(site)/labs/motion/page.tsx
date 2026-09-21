import { MotionLab } from "@/components/labs/motion-lab";

export const metadata = {
  title: "Motion Lab",
  description: "动效候选预览台 —— 不进导航、不进 sitemap。",
  // 这页是评估用的工作台，不该出现在搜索结果里
  robots: { index: false, follow: false },
};

export default function MotionLabPage() {
  return (
    <div className="page-shell">
      <MotionLab />
    </div>
  );
}
