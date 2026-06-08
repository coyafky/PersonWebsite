# Content Library

This directory will contain content loading, parsing, validation, and sorting utilities.

Planned responsibilities:

- Read Markdown and MDX files from `content/`.
- Parse frontmatter.
- Validate content schemas.
- Generate slugs.
- Filter public content by `status: published`.
- Sort Blog, Weekly, and Projects.
- Provide typed data to `app/` routes.

Do not put React components here. UI belongs in `components/` and route files.
