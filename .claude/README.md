# Project Claude Commands

This repository includes project-local Claude Code commands in `.claude/commands/`.

Available commands:

- `/prompt-boost`
  Turns a natural-language request into a repository-aware implementation prompt.
  It scans the current Next.js / content-system structure before writing the prompt.

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
