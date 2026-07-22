# Project Claude Commands

This repository includes project-local Claude Code commands in `.claude/commands/`.

Available commands:

- `/prompt-boost`
  Translates a rough request into a repository-aware implementation brief.
  It is the discovery layer before `/spec`, `/plan`, or `/dispatch`.

- `/dispatch`
  Runs a request through a repository-aware expert pipeline.
  It is aligned with the user's existing Claude Code subagents and defaults to:
  `architect -> coya-coding-agent -> tester -> deployer`.

- `/knowledge-field`
  Runs or explains the Obsidian → inbox → content workflow for the personal
  knowledge field. It is the command entry for `knowledge-field.config.json`
  and the `npm run knowledge:*` scripts.

- `/write-blog-from-source`
  Creates a pending blog draft from a URL, Obsidian/local Markdown file,
  directory, exported Feishu Markdown, or pasted text. It never publishes or
  deploys without a later confirmation command.

## Why this exists

The project is content-heavy and agent-assisted. A repository-aware prompt command helps Claude Code avoid generic scaffolding and produce instructions that match:

- `app/(site)/` routing
- `lib/content/` schemas and readers
- Markdown / MDX content rules
- Hermes publishing boundaries
- Existing visual and naming conventions

## Usage

Example:

```txt
/prompt-boost 为 blog 和 weekly 增加 RSS 输出，并确保 draft 内容不会进入 feed
```

```txt
/dispatch docs/superpowers/specs/2026-06-11-claude-code-continuation-spec.md
```

```txt
/knowledge-field sync
```

```txt
/write-blog-from-source content/inbox/ideas/example.md
```
