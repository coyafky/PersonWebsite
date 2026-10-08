# AGENTS

This file is for AI agents (Hermes, Claude Code, Codex) working in this project.

## Project Overview

TODO: Describe what this project does, who it is for, and what problem it solves.

## Build Commands

```bash
npm install
npm run dev
npm run build
npm run typecheck
```

## Architecture

TODO: Describe data flow and service ownership.

## Content Standards

All Chinese content under `content/` must follow `docs/agent/content-style-guide.md`.
It is the single authoritative writing spec for this project, based on
[ruanyf/document-style-guide](https://github.com/ruanyf/document-style-guide) (public domain).

- Read it before writing blog / weekly / projects / course-list / book-list / learning / diary / career content.
- It also defines the figure policy: when to insert a diagram, and which tier to use
  (mermaid / HTML-to-PNG / AI image generation).
- Gates before publishing: `npm run typecheck`, `npm run lint`, `npm run test`,
  `npm run content:audit`. Adding images also requires `npm run images:check`
  (already wired into `prebuild`).

## Security Baseline

- Validate all input server-side
- Never trust client-provided identity, scope, or permissions
- Use Supabase RLS for row-level data isolation
- Store secrets in .env.local — never commit credentials
- No secrets in logs or error messages
- Follow OWASP Top 10

## Engine Guidance

- Complex multi-file changes, new features → Claude Code
- Quick targeted fixes, single-file changes → Codex
- Deploy, monitor, notify, schedule → Hermes
- UI/UX exploration before coding → Claude Design (human step)
- Not sure? Tell Hermes: run choose-engine

## Monitoring

- Health endpoint: /api/health
- Error tracking: Sentry
- Uptime: Uptime Kuma polling /api/health every 60s

## Deployment

- Platform: Vercel
- Production: main branch → automatic deploy
- Preview: feature branches → preview deployment

## Commit Conventions

- One commit per meaningful change
- Never commit .env.local or credentials
