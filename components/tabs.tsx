"use client";

import {
  Children,
  isValidElement,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

type TabItem = { label: string; children: ReactNode };
const subscribe = () => () => {};

export function Tab({ children }: TabItem) {
  return <>{children}</>;
}

export function Tabs({
  tabs,
  children,
  label = "内容选项",
}: {
  tabs?: TabItem[];
  children?: ReactNode;
  label?: string;
}) {
  const id = useId();
  const [active, setActive] = useState(0);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const items =
    tabs ??
    Children.toArray(children).flatMap((child) =>
      isValidElement<TabItem>(child) && typeof child.props.label === "string"
        ? [{ label: child.props.label, children: child.props.children }]
        : [],
    );
  if (!items.length) return null;
  const selected = Math.min(active, items.length - 1);

  return (
    <div className="tabs">
      <div
        className="tabs-nav"
        role="tablist"
        aria-label={label}
        hidden={!hydrated}
      >
        {items.map((item, index) => (
          <button
            key={index}
            ref={(node) => {
              triggers.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={index === selected}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={index === selected ? 0 : -1}
            className={`tabs-trigger ${index === selected ? "active" : ""}`}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % items.length;
              else if (event.key === "ArrowLeft")
                next = (index - 1 + items.length) % items.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = items.length - 1;
              else return;
              event.preventDefault();
              setActive(next);
              triggers.current[next]?.focus();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={index}
          className="tabs-panel"
          id={`${id}-panel-${index}`}
          role={hydrated ? "tabpanel" : undefined}
          aria-labelledby={hydrated ? `${id}-tab-${index}` : undefined}
          tabIndex={hydrated ? 0 : undefined}
          hidden={hydrated && index !== selected}
        >
          {!hydrated && (
            <strong className="tabs-fallback-label">{item.label}</strong>
          )}
          {item.children}
        </div>
      ))}
    </div>
  );
}
