import { CopyButton } from "@/components/copy-button";

type TerminalLine = { command: string; output?: string };

export function Terminal({
  lines,
  title = "终端示例",
}: {
  lines: TerminalLine[];
  title?: string;
}) {
  return (
    <figure className="mdx-terminal">
      <figcaption>
        <span>{title}</span>
        <CopyButton text={lines.map((line) => line.command).join("\n")} />
      </figcaption>
      <div
        className="mdx-terminal-content"
        tabIndex={0}
        role="region"
        aria-label={title}
      >
        {lines.map((line, index) => (
          <div key={index}>
            <pre className="mdx-terminal-command">
              <span aria-hidden="true">$ </span>
              <code>{line.command}</code>
            </pre>
            {line.output && (
              <pre className="mdx-terminal-output">
                <code>{line.output}</code>
              </pre>
            )}
          </div>
        ))}
      </div>
    </figure>
  );
}
