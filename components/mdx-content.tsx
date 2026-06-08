import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

function Callout({ children }: { children: ReactNode }) {
  return <aside className="callout">{children}</aside>;
}

const components = {
  Callout,
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="markdown-body">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
