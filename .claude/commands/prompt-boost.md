---
name: prompt-boost
description: Translate a rough request into a precise, repository-aware implementation prompt for this Personal Website project.
argument-hint: "<rough request>"
user-invocable: true
---

# /prompt-boost - Personal Website Prompt Refinement

Use this command before `/spec`, `/plan`, or `/dispatch` when the user's request is vague,
broad, or missing project-specific context.

## Role In The Workflow

`/prompt-boost` is the discovery and translation layer:

```text
rough request -> /prompt-boost -> precise prompt -> /spec or /plan or /dispatch
```

It does not replace a product spec or PRD. It makes the next step clearer and safer.

## Repository Context Rules

This command must stay faithful to the real structure of this repository.

- The project uses top-level `app/`, not `src/app/`.
- Main content lives in `content/`.
- Content rules and Hermes workflow live in `docs/agent/`.
- Project-local Claude commands live in `.claude/commands/`.
- Public pages are primarily under `app/(site)/`.
- Public content is controlled by `status: published`.

Do not assume missing folders, tools, APIs, or business systems.

## Process

### 1. Read project guidance first

Always read:

- `CLAUDE.md`

Read `AGENTS.md` only if it exists.

### 2. Scan project context relevant to the request

Use fast repository inspection first (`rg`, `rg --files`, `sed`, `find`).

Prioritize:

- `package.json`
- `next.config.mjs`
- `tsconfig.json`
- `eslint.config.mjs`
- `app/`
- `components/`
- `lib/`
- `content/`
- `docs/agent/`
- `docs/superpowers/specs/`
- `public/`
- `.claude/commands/`

### 3. Identify what the user is really asking for

Extract:

- user intent
- affected routes
- affected content collections
- affected components
- affected schemas / content readers
- affected assets
- affected commands or agent workflow docs
- technical and product risks

### 4. Resolve obvious defaults from project conventions

Infer defaults only when the repository already points to them. For example:

- prefer Server Components
- reuse `lib/content`
- do not introduce `src/`
- keep content in Markdown / MDX
- keep unpublished content behind `status: draft`

### 5. Mark unresolved decisions explicitly

If something is ambiguous, do not hide it. Call it out and recommend a default.

### 6. Produce a structured Markdown prompt

The output should be ready to feed into `/spec`, `/plan`, or `/dispatch`.

## What To Scan In This Repository

### Technical stack and configuration

Extract concrete facts from:

- `package.json`
- `next.config.mjs`
- `tsconfig.json`
- `eslint.config.mjs`
- `app/globals.css`

### Routes

Inspect:

- `app/layout.tsx`
- `app/(site)/layout.tsx`
- `app/(site)/page.tsx`
- `app/(site)/blog/`
- `app/(site)/weekly/`
- `app/(site)/projects/`
- `app/(site)/career/`
- `app/(site)/about/`

Also check whether system routes such as `route.ts`, `sitemap.ts`, or `robots.ts` exist.

### Components

Inspect:

- `components/site-nav.tsx`
- `components/content-card.tsx`
- `components/mdx-content.tsx`
- `components/icons0.tsx`
- any additional components relevant to the request

Capture:

- whether they are Server or Client Components
- their role in the page hierarchy
- reusable patterns already present

### Content system

Inspect:

- `lib/content/reader.ts`
- `lib/content/schemas.ts`
- `lib/content/index.ts`
- `content/README.md`
- relevant files in `content/blog/`, `content/weekly/`, `content/projects/`, `content/career/`, `content/inbox/`

Capture:

- content kinds
- frontmatter expectations
- zod schema boundaries
- content loading functions
- visibility rules for drafts vs published content

### Hermes / Claude workflow

Inspect:

- `docs/agent/hermes-content-workflow.md`
- `docs/agent/inbox-to-content-workflow.md`
- `docs/agent/hermes-usage-guide.md`
- existing files under `.claude/commands/`

Capture:

- what Hermes is allowed to do
- what requires owner review
- whether the request touches writing workflow, agent commands, or publishing boundaries

## Output Format

Return a structured Markdown brief with these sections:

```markdown
# [Requirement Title]

## User Goal
[What the user wants and the intended result]

## Business / Project Result
[Why this change matters in the context of this personal website]

## Relevant Project Context

### Technical Stack
- ...

### Relevant Routes
- ...

### Relevant Components
- ...

### Relevant Content / Data Model
- ...

### Relevant Commands / Agent Docs
- ...

## Affected Files And Modules
- [path] - [why it matters]

## Proposed Implementation Boundaries
- In scope:
- Out of scope:
- Constraints:

## Acceptance Criteria
- [ ] ...
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes

## Ambiguities And Recommended Defaults
- Ambiguity:
  - Recommended default:
  - Why:

## Recommended Next Command
- `/spec` if product intent or structure is still unsettled
- `/plan` if a spec already exists and implementation planning is next
- `/dispatch` if the work is approved and ready for agent-team execution
```

## Rules

- Do not edit code.
- Do not invent business facts.
- Do not assume `src/` exists.
- Prefer repository facts over generic Next.js advice.
- Prefer spec creation over direct implementation when intent is still fuzzy.
- Call out risks around content visibility, schema changes, and Hermes publishing boundaries when relevant.
