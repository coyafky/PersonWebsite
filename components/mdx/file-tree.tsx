export type FileTreeItem = {
  name: string;
  comment?: string;
  children?: FileTreeItem[];
};

function Branch({ items }: { items: FileTreeItem[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={`${item.name}-${index}`}>
          <span className="mdx-file-name">
            <span aria-hidden="true" className="mdx-file-icon">
              {item.children ? "▤" : "─"}
            </span>
            {item.name}
            {item.children ? "/" : ""}
          </span>
          {item.comment && (
            <span className="mdx-file-comment">{item.comment}</span>
          )}
          {item.children && <Branch items={item.children} />}
        </li>
      ))}
    </ul>
  );
}

export function FileTree({
  items,
  title = "文件结构",
}: {
  items: FileTreeItem[];
  title?: string;
}) {
  return (
    <figure className="mdx-file-tree">
      <figcaption>{title}</figcaption>
      <div tabIndex={0} role="region" aria-label={title}>
        <Branch items={items} />
      </div>
    </figure>
  );
}
