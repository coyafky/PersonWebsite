# Design Refactor Baseline (2026-06-21)

> **Purpose**: Backup of pre-Stripe-Press design tokens for rollback reference.
> **Do not edit** — this is a frozen snapshot of `app/globals.css` `:root` and `[data-theme="dark"]` blocks captured before the Stripe Press refactor (branch `feature/stripe-press-refactor`).
> **To rollback**: copy the blocks below back into `app/globals.css` `:root` and `[data-theme="dark"]`.

---

## Original `:root` (lines 1–39)

```css
:root {
  color-scheme: light;

  /* 主底色：暖白 / 浅灰 / 雾蓝灰 */
  --background: #F5EFE6;     /* 暖白 page background */
  --surface: #FBF7EF;        /* 暖白卡片表面 */
  --surface-soft: #ECE5D8;   /* 浅灰，二级表面 */
  --surface-mist: #DDE2E7;   /* 雾蓝灰，三级表面 / 分隔 */

  /* 文字：炭灰 */
  --text: #2A2D33;           /* 炭灰主文字 */
  --muted: #5C616B;          /* 弱化炭灰 */
  --border: #E0DCD3;         /* 暖浅灰描边 */

  /* 强调色：深墨蓝 + 玫瑰梅子 */
  --accent: #2A3656;         /* 深墨蓝 — 主链接、icon、meta、callout 左边 */
  --accent-strong: #1A2138;  /* 更深的墨蓝 — primary 按钮底色、强面板底色 */
  --accent-soft: #E5E0DA;    /* 暖中性 — icon-shell 底色、柔和衬底 */

  --rose: #A07A8C;           /* 柔和玫瑰梅子 — 二级强调 */
  --rose-soft: #F2E7EC;      /* 梅子 soft — 备用 */

  /* 点缀色：金色 / 杏色 — 严格用于 hover 和标签 */
  --gold: #C9A66B;           /* 金色 — hover 边框、tag 文字 */
  --gold-soft: #F3E9D2;      /* 杏色 soft — hover 背景、tag 背景 */

  /* 强面板（hero 中的 "Markdown / MDX" 行等）— 深墨蓝 */
  --surface-strong: #1A2138;

  /* 几何与阴影 */
  --shadow: 0 20px 60px rgb(42 45 51 / 0.08);
  --radius: 8px;
  --container: 1120px;

  /* AI Tracker signal 强度 */
  --signal-strong: var(--gold);
  --signal-mid: var(--rose);
  --signal-soft: var(--muted);
}
```

## Original `[data-theme="dark"]` (lines 41–66)

```css
[data-theme="dark"] {
  color-scheme: dark;

  --background: #15191E;
  --surface: #1E242B;
  --surface-soft: #262D35;
  --surface-mist: #2E3640;

  --text: #E2E6EB;
  --muted: #929AA5;
  --border: #323942;

  --accent: #8EA4D2;
  --accent-strong: #B8CCF0;
  --accent-soft: #262D35;

  --rose: #C99DA8;
  --rose-soft: #32252A;

  --gold: #D4B87A;
  --gold-soft: #363025;

  --surface-strong: #B8CCF0;

  --shadow: 0 20px 60px rgb(0 0 0 / 0.25);
}
```

## Original `app/layout.tsx` font block (lines 1–12)

```tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
```

`<html className={inter.className}>` (line 43).

## Original `app/globals.css` typography (lines 72–79)

```css
html {
  min-width: 320px;
  background: var(--background);
  color: var(--text);
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
}
```

---

## Migration Targets (Stripe Press)

| Token | From | To (light) | To (dark) |
|-------|------|------------|-----------|
| Background | `#F5EFE6` / `#15191E` | `oklch(95% 0.025 80)` | `oklch(20% 0.015 60)` |
| Surface | `#FBF7EF` / `#1E242B` | `oklch(89% 0.03 75)` | `oklch(25% 0.02 65)` |
| Text | `#2A2D33` / `#E2E6EB` | `oklch(20% 0.015 60)` | `oklch(95% 0.025 80)` |
| Accent | `#2A3656` / `#8EA4D2` | `oklch(35% 0.08 200)` (foil teal) | `oklch(75% 0.08 200)` |
| Radius | `8px` | `0` (signature) | (inherits) |
| Font (body) | Inter | Source Serif 4 | (inherits) |
| Font (display) | Inter | Fraunces | (inherits) |

See `docs/agent/skills-usage.md` for full Stripe Press DNA notes.
