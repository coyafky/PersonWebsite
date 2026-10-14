import { Children, type ReactNode } from "react";

type CollectionListProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  emptyLabel?: string;
  actions?: ReactNode;
};

/**
 * Generic collection-page skeleton: title + optional description + optional
 * actions slot, then a body that either renders the supplied children or an
 * empty-state hint. Server Component.
 */
export function CollectionList({
  title,
  eyebrow,
  description,
  children,
  emptyLabel,
  actions,
}: CollectionListProps) {
  const isEmpty = Children.count(children) === 0;

  return (
    <section className="collection-list">
      <header className="collection-list-header">
        <div className="collection-list-heading">
          {eyebrow ? <span className="section-kicker">{eyebrow}</span> : null}
          <h1 className="collection-list-title">{title}</h1>
          {description ? (
            <p className="collection-list-description">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="collection-list-actions">{actions}</div>
        ) : null}
      </header>
      <div className="collection-list-body">
        {isEmpty ? (
          <p className="empty-state">{emptyLabel ?? "No items yet."}</p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
