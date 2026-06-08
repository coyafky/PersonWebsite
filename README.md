# Personal Website

This repository is the source for a personal website built around long-term writing, project records, weekly reflection, and career preparation.

The site is designed for:

- Maintaining personal writing in Markdown and MDX.
- Turning project work into portfolio and resume evidence.
- Letting Hermes agent safely create drafts, summarize weekly notes, and maintain career material.
- Deploying as a static-content-first Next.js site on Vercel.

## Structure

```txt
app/              Future Next.js App Router pages
components/       Reusable UI components
content/          Markdown and MDX source content
docs/agent/       Hermes writing and maintenance protocols
docs/superpowers/ Design specs and implementation plans
lib/content/      Future content parsing and validation utilities
public/           Static assets
```

## Publishing Rule

Content starts as `status: draft`. Public pages should only show `status: published` content after explicit owner approval.
