import type { ReactNode } from "react";

export function Accordion({
  title,
  children,
  open = false,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="mdx-accordion" open={open}>
      <summary>{title}</summary>
      <div className="mdx-accordion-body">{children}</div>
    </details>
  );
}
