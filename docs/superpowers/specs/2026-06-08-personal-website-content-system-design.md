# Personal Website Content System Design

Date: 2026-06-08
Status: Approved design, pending implementation plan

## Goal

Build a personal website with Next.js, Vercel, Markdown, and MDX that supports long-term writing while also preparing strong job-search material. The site should be easy for the owner to maintain and clear enough for Hermes agent to help with drafting, weekly summaries, project archives, and career material.

The first version should prioritize a static, file-based content system. Markdown files remain the source of truth. Hermes works directly with the repository, creates drafts, improves metadata, and maintains career-ready summaries without needing a CMS or database.

## Audience And Positioning

The site uses a mixed model with a clear career entry point.

Primary readers:

- Recruiters and hiring managers who need to quickly understand skills, projects, impact, and growth.
- The site owner, who needs a reliable place to record weekly notes, technical writing, ideas, and project history.
- Public readers who may discover essays, notes, or project write-ups.

The site should feel like a quiet but warm personal workspace. It should not be a marketing landing page or an overly decorative portfolio. The home page should make the career path obvious while still showing that the site is maintained over time.

## Information Architecture

The first version uses this top-level navigation:

```txt
Home / Blog / Weekly / Projects / Career / About
```

### Home

Home introduces the owner, target direction, and core capabilities. The first viewport should provide two strong paths:

- View Projects
- Career Notes

Below the introduction, Home shows recent Blog posts, recent Weekly entries, and selected Projects. This makes the site useful for job-search scanning while also showing ongoing activity.

### Blog

Blog contains technical articles, ideas, learning notes, and longer reflections. The default language is Chinese. Important posts may include English summaries for international or job-search readability.

### Weekly

Weekly contains weekly notes and stage reviews. This section records growth over time. Hermes can transform bullets, fragments, and logs into weekly drafts.

### Projects

Projects contains structured project records. Project pages can use MDX when they need richer presentation, such as screenshots, custom sections, diagrams, or embedded demos.

Each project should explain:

- Background
- Problem
- Goal
- Role
- Technical stack
- Approach
- Challenges
- Result or impact
- Links
- Resume-ready bullets

### Career

Career is an ability index, not a replacement for a resume PDF. It aggregates selected projects, English bullets, STAR stories, a skills matrix, and resume links. Its job is to connect claims with evidence.

### About

About contains a more personal introduction, background, interests, contact information, and writing motivation.

## Content Model

Content lives under `content/`:

```txt
content/
  blog/
    2026-06-frontend-note.md
  weekly/
    2026-W24.md
  projects/
    personal-website.mdx
  career/
    profile.md
    bullets.md
    star-stories.md
```

Markdown is the default format. MDX is reserved for projects or pages that need React components, interactive examples, diagrams, or complex display blocks.

### Blog Frontmatter

Required fields:

- `title`
- `date`
- `summary`
- `tags`
- `status`
- `lang`

Optional fields:

- `englishSummary`
- `updated`
- `canonical`

### Weekly Frontmatter

Required fields:

- `title`
- `week`
- `date`
- `highlights`
- `tags`
- `status`

Optional fields:

- `mood`
- `englishSummary`

### Project Frontmatter

Required fields:

- `title`
- `date`
- `summary`
- `role`
- `stack`
- `links`
- `impact`
- `resumeBullets`
- `status`

Optional fields:

- `cover`
- `featured`
- `englishSummary`
- `period`

### Career Content

Career content is a small repository of reusable job-search material. It may include:

- Profile summary
- English resume bullets
- STAR stories
- Skills matrix
- Selected project evidence
- Resume download links

Some career content may be source material rather than public content. The implementation should make publication explicit instead of assuming everything under `content/career/` is public.

## Technical Architecture

The site uses a static-content-first Next.js App Router architecture deployed on Vercel.

```txt
content/*.md/.mdx
  -> lib/content parses frontmatter and validates schemas
  -> app/* renders list and detail pages
  -> generateStaticParams creates static routes
  -> generateMetadata creates page metadata
  -> Vercel deploys the site
```

Recommended stack:

- Next.js App Router
- TypeScript
- `@next/mdx` for MDX support
- `gray-matter` for frontmatter parsing
- `zod` for content schema validation
- `remark` and `rehype` plugins as needed for headings, slugs, code highlighting, and link handling

No CMS, database, comments, authentication, or search service is required for the first version. Local Markdown files are more transparent for Git review and easier for Hermes to edit reliably.

## Hermes Agent Workflow

Hermes has three responsibilities.

### Semi-Automated Content Production

The owner provides bullets, project notes, fragments, or logs. Hermes creates `.md` or `.mdx` drafts, fills frontmatter, writes summaries, proposes tags, and adds English summaries where useful.

Hermes-created content defaults to:

```yaml
status: draft
```

Hermes must not mark content as `published` unless the owner explicitly asks it to publish.

### Content Operations

Hermes periodically helps maintain the content library:

- Create weekly drafts from logs and bullets.
- Find old drafts that need review.
- Suggest topics that can become Blog posts.
- Detect missing metadata.
- Identify projects without impact or resume bullets.
- Keep content indexes coherent.

### Project Archive And Career Material

Hermes turns project records into project pages, STAR stories, English bullets, and career evidence. Resume bullets must trace back to real projects or experiences.

Hermes must separate:

- Facts
- Inferences
- Items needing confirmation

This avoids overstating accomplishments in job-search material.

## Publishing Rules

`status` controls visibility:

- `draft`: visible only locally or in internal tooling
- `published`: visible on public pages
- `archived`: hidden from primary lists but kept in the repository

Public pages must only include `published` content unless a route is explicitly designed for private review.

The implementation should fail the build for published content when:

- Required frontmatter is missing.
- Date or week formats are invalid.
- A slug is duplicated.
- A summary is missing.
- Project content lacks `role`, `stack`, or `impact`.
- Resume bullets are malformed.

Draft content may be incomplete, but it should not appear on public pages.

## Page Experience

The visual direction is a quiet personal workspace with clear hierarchy and strong readability.

Home should lead with:

- Name or identity
- Target direction
- Core capabilities
- View Projects CTA
- Career Notes CTA

Blog and Weekly pages should emphasize reading, filtering, and scanning. Article pages should use a single-column reading layout with title, date, summary, tags, and optional English summary.

Projects should use structured cards and detail pages. Project detail pages should make evidence easy to scan: role, stack, problem, solution, impact, and resume bullets.

Career should function as an ability index with selected projects, STAR stories, English bullets, skills, and resume links.

Cards should be used only for repeated items or framed information blocks. Whole page sections should not be nested inside decorative cards. The visual palette should use a neutral base, one accent color, and limited status colors.

## Testing Strategy

Content parsing should have focused unit tests for:

- Blog schema validation
- Weekly schema validation
- Project schema validation
- Career content handling
- Sorting by date or week
- Filtering by `status`
- Slug generation and duplicate detection

Page-level verification should include smoke checks for:

- Home renders
- Blog list renders
- Blog detail renders
- Weekly list renders
- Project list renders
- Project detail renders
- Career page renders
- Metadata is generated for public pages

Before deployment, verify:

- Vercel build passes
- Main navigation works
- Mobile reading layout is usable
- Important links are valid
- Published pages have metadata

RSS and sitemap are useful, but they can be implemented either in the first version or immediately after the first public version.

## Out Of Scope For First Version

The first version will not include:

- CMS integration
- Database-backed content
- Comment system
- Authentication
- Full-text search service
- Newsletter
- Analytics dashboard
- Automated publishing without owner approval
- Complex knowledge graph

These can be added later after the file-based content workflow is stable.

## Success Criteria

The design succeeds when:

- The owner can add a Blog post, Weekly entry, Project page, or Career note by creating a Markdown or MDX file.
- Hermes can generate useful drafts without guessing the content structure.
- Public pages only show approved published content.
- Recruiters can reach Projects and Career material from the home page quickly.
- Project pages produce reusable evidence for job applications.
- The repository remains understandable without a database or CMS.

## References

- Next.js MDX guide: https://nextjs.org/docs/app/guides/mdx
- Next.js `generateStaticParams`: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- Next.js `generateMetadata`: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Vercel Next.js framework docs: https://vercel.com/docs/frameworks/nextjs
