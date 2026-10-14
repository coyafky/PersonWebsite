"use client";

import {
  Children,
  isValidElement,
  useId,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

const subscribe = () => () => {};

type LightboxProps = { src: string; alt: string; children: ReactNode };

export function ImageLightbox({ src, alt, children }: LightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const labelId = useId();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const hasLink = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === "a",
  );
  const open = () => dialog.current?.showModal();

  return (
    <>
      <span
        className="lightbox-trigger"
        role={hasLink ? undefined : "button"}
        tabIndex={hasLink ? undefined : 0}
        aria-label={hasLink ? undefined : `放大图片：${alt}`}
        onClick={(event) => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
            return;
          event.preventDefault();
          open();
        }}
        onKeyDown={(event) => {
          if (!hasLink && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            open();
          }
        }}
      >
        {children}
      </span>
      {hydrated &&
        createPortal(
          <dialog
            className="mdx-lightbox"
            ref={dialog}
            aria-labelledby={labelId}
            onClick={(event) => {
              if (event.target === event.currentTarget) dialog.current?.close();
            }}
          >
            <button
              className="mdx-lightbox-close"
              type="button"
              onClick={() => dialog.current?.close()}
            >
              关闭图片
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element -- original image for full-size inspection. */}
            <img src={src} alt={alt} className="lightbox-image" />
            <p id={labelId}>{alt}</p>
          </dialog>,
          document.body,
        )}
    </>
  );
}
