import Link from "next/link";
import { CollectionList } from "@/components/collection-list";
import { TOOLS } from "@/lib/tools/registry";

export const metadata = {
  title: "Tools",
  description:
    "可以直接用的小工具：番茄钟、倒计时。全部在浏览器本地运行，不需要登录，也不会上传任何数据。",
};

export default function ToolsPage() {
  return (
    <div className="page-shell">
      <CollectionList
        title="Tools"
        description="可以直接用的小工具。全部跑在浏览器本地 —— 没有后端调用，输入的时长和进度只存在你自己的浏览器里。"
      >
        <div className="tool-index-grid">
          {TOOLS.map((tool) => (
            <Link className="tool-index-card" href={`/tools/${tool.id}`} key={tool.id}>
              <h2 className="tool-index-title">{tool.title}</h2>
              <p className="tool-index-summary">{tool.summary}</p>
              <ul className="tool-index-keywords">
                {tool.keywords.map((keyword) => (
                  <li key={keyword}>{keyword}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </CollectionList>
    </div>
  );
}
