import { codeToHtml, bundledLanguages } from "shiki";
import { Tabs } from "@/components/tabs";
import { CopyButton } from "@/components/copy-button";

type CodeTab = {
  label: string;
  code: string;
  language?: string;
  filename?: string;
};

export async function CodeTabs({
  items,
  label = "代码示例",
}: {
  items: CodeTab[];
  label?: string;
}) {
  const tabs = await Promise.all(
    items.map(async (item) => {
      const language =
        item.language && item.language in bundledLanguages
          ? item.language
          : "text";
      // Shiki escapes source text; never insert user-authored HTML here.
      const html = await codeToHtml(item.code, {
        lang: language,
        theme: "github-light",
      });
      return {
        label: item.label,
        children: (
          <div className="mdx-code-sample">
            <div className="code-block-header">
              <span>{item.filename ?? language}</span>
              <CopyButton text={item.code} />
            </div>
            <div
              className="mdx-highlighted-code"
              tabIndex={0}
              role="region"
              aria-label={item.filename ?? item.label}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        ),
      };
    }),
  );
  return (
    <div className="mdx-code-tabs">
      <Tabs tabs={tabs} label={label} />
    </div>
  );
}
