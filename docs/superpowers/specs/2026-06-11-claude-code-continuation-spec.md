# Claude Code Continuation Spec

Date: 2026-06-11
Status: Ready for Claude Code handoff
Current branch: `feature/next-mdx-foundation`

## Purpose

This document hands off the current Personal Website implementation to Claude Code for continued development. The project is already a working Next.js App Router site with Markdown/MDX content, schema validation, static route generation, and icons0 Carbon icons.

Claude Code should continue from the existing architecture instead of scaffolding a new project or replacing the content model.

## Current State

The repository currently contains:

- A Next.js 16 App Router application.
- React 19 and TypeScript.
- Markdown and MDX content stored under `content/`.
- Content parsing and validation in `lib/content/`.
- Public routes under `app/(site)/`.
- Local Carbon icons sourced from icons0.dev in `components/icons0.tsx`.
- Hermes agent workflow documentation in `docs/agent/`.
- Existing design spec in `docs/superpowers/specs/2026-06-08-personal-website-content-system-design.md`.

Recent commits:

```txt
621937f feat: add icons0 carbon icons
abde264 feat: add next mdx content foundation
822332d chore: add personal website folder skeleton
b727eed docs: add personal website content system design
```

## Existing Architecture

```txt
content/*.md/.mdx
  -> lib/content parses frontmatter with gray-matter
  -> lib/content validates schemas with zod
  -> app/(site) renders static public pages
  -> generateStaticParams builds detail routes
  -> generateMetadata sets per-page metadata
  -> Vercel can deploy the static-content-first site
```

Important files:

- `app/(site)/page.tsx`: Home page.
- `app/(site)/layout.tsx`: Public site shell.
- `app/(site)/blog/page.tsx`: Blog list.
- `app/(site)/blog/[slug]/page.tsx`: Blog detail.
- `app/(site)/weekly/page.tsx`: Weekly list.
- `app/(site)/weekly/[slug]/page.tsx`: Weekly detail.
- `app/(site)/projects/page.tsx`: Project list.
- `app/(site)/projects/[slug]/page.tsx`: Project detail.
- `app/(site)/career/page.tsx`: Career page.
- `app/(site)/about/page.tsx`: About page.
- `components/content-card.tsx`: Reusable content card.
- `components/icons0.tsx`: Local icons0 Carbon icon components.
- `components/mdx-content.tsx`: MDX renderer.
- `components/site-nav.tsx`: Site navigation.
- `lib/content/schemas.ts`: Content schemas.
- `lib/content/reader.ts`: Content loading and query functions.
- `app/globals.css`: Current visual system.

## Product Direction

The site should remain a mixed personal knowledge base and career-preparation website.

Primary goals:

- Help the owner write and maintain Blog, Weekly, Project, and Career content.
- Let Hermes agent safely create drafts and career material.
- Let recruiters quickly find project evidence and career-ready summaries.
- Keep content file-based and Git-reviewable.

The site should feel like a quiet personal workspace: readable, restrained, and warm. Avoid turning it into a marketing landing page, dashboard, or decorative portfolio.

## Content Rules

Content source remains:

```txt
content/
  blog/
  weekly/
  projects/
  career/
```

Default format:

- Use `.md` for normal writing.
- Use `.mdx` only for project pages or content that needs React components.

Visibility:

- `status: draft` is not public.
- `status: published` is public.
- `status: archived` is hidden from primary lists.

Claude Code must not loosen this rule. Public pages should only render `published` content.

## Hermes Agent Boundary

Hermes may create and edit drafts, summaries, tags, weekly notes, project records, resume bullets, and STAR stories.

Hermes must not automatically publish content. Publishing requires explicit owner approval by setting:

```yaml
status: published
```

For career material, Hermes must separate:

- Facts
- Inferences
- Items needing confirmation

Resume bullets must be traceable to project content, weekly notes, or confirmed experience.

## Next Development Scope

Claude Code should focus on a small, shippable next version. The next version should improve content quality, routing completeness, and deploy-readiness without adding a CMS or database.

### Required Improvements

1. Add sitemap and robots support.
2. Add RSS feed for Blog and Weekly content.
3. Improve metadata and Open Graph defaults.
4. Add a draft-safe content validation command.
5. Add better empty states and public-page fallbacks.
6. Add a real personal profile data file or config module so Home, Career, and About do not rely on generic copy.
7. Add a first-pass resume asset path and visible resume link on Career.
8. Improve MDX prose support for headings, lists, links, code, blockquotes, and callouts.
9. Add a `content` or `validate:content` npm script that can be run before build.
10. Add focused tests for content parsing and status filtering.

### Optional Improvements

These are useful but should come after required improvements:

- Tag pages or tag filtering.
- Search.
- Reading time.
- Table of contents.
- Project screenshots and media assets.
- Timeline view for Weekly.
- A print-friendly resume page.
- Theme switcher.
- Analytics.

## Out Of Scope

Claude Code should not add these in the next version:

- CMS integration.
- Database-backed content.
- Authentication.
- Comment system.
- Newsletter.
- Complex knowledge graph.
- Heavy animation system.
- Large UI framework migration.
- Automatic publish workflows.

## Design Constraints

Preserve the existing visual direction:

- Neutral background.
- Restrained accent color.
- Small-radius cards.
- Clear typography.
- Readable single-column article pages.
- Icons0 Carbon icons for navigation and major content affordances.

Do not introduce a one-note purple/blue gradient theme, oversized decorative sections, nested cards, or large marketing hero patterns.

When adding UI:

- Use existing CSS tokens in `app/globals.css`.
- Prefer small focused components in `components/`.
- Keep content parsing out of React components.
- Keep server-side data loading in Server Components.
- Add client components only when interaction is required.

## Technical Requirements

Use the current stack:

- Next.js 16.
- React 19.
- TypeScript.
- `@next/mdx`.
- `next-mdx-remote/rsc`.
- `gray-matter`.
- `zod`.
- CSS in `app/globals.css`.

The project scripts currently include:

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run lint
```

Add new scripts only when they support validation, testing, or deployment readiness.

## Proposed File Additions

Claude Code may add files such as:

```txt
app/robots.ts
app/sitemap.ts
app/feed.xml/route.ts
lib/site/profile.ts
lib/site/metadata.ts
lib/content/validate.ts
tests/content/reader.test.ts
tests/content/status-filtering.test.ts
public/resume/.gitkeep
```

Exact paths can change if a better local pattern emerges, but responsibilities should remain clear.

## Acceptance Criteria

The next version is acceptable when:

- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- Content validation catches invalid `published` content.
- Draft content does not appear in public pages, RSS, sitemap, or metadata indexes.
- `/`, `/blog`, `/weekly`, `/projects`, `/career`, `/about` all render successfully.
- Existing detail routes still render:
  - `/blog/2026-06-08-first-note`
  - `/weekly/2026-W24`
  - `/projects/personal-website`
- Sitemap and robots routes exist.
- RSS feed route exists and includes only published Blog or Weekly entries.
- Career page has a visible resume link that points to the intended resume asset path.
- Home/About/Career use a single profile data source instead of duplicated generic text.

## Verification Commands

Run these before handing work back:

```bash
npm run lint
npm run typecheck
npm run build
```

If tests are added, also run:

```bash
npm test
```

After starting the dev server:

```bash
npm run dev
```

Check these routes in a browser:

```txt
/
/blog
/blog/2026-06-08-first-note
/weekly
/weekly/2026-W24
/projects
/projects/personal-website
/career
/about
/sitemap.xml
/robots.txt
/feed.xml
```

## Known Notes

`npm audit` currently reports moderate warnings through the Next.js dependency chain. Do not run `npm audit fix --force` unless the resulting dependency changes are reviewed carefully, because forced audit fixes can downgrade or replace major framework versions.

The current implementation removed `lucide-react` and uses local icons0 Carbon SVG components. Continue using `components/icons0.tsx` for site-level iconography unless there is a clear reason to add another icon source.

## Handoff Instruction For Claude Code

Start by reading:

1. `README.md`
2. `docs/superpowers/specs/2026-06-08-personal-website-content-system-design.md`
3. `docs/superpowers/specs/2026-06-11-claude-code-continuation-spec.md`
4. `lib/content/schemas.ts`
5. `lib/content/reader.ts`

Then implement the required improvements in small commits. Keep the site static-content-first and preserve the existing content model.
