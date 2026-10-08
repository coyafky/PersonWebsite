# App Routes

This directory will hold the Next.js App Router implementation.

Planned public routes:

```txt
/          Home
/blog      Blog list
/blog/[slug]
/notes     Notes index (topic / book / course collections)
/notes/[collection]
/notes/[collection]/[slug]
/projects
/projects/[slug]
/career
/about
```

The first implementation should keep pages static and read from `content/` through `lib/content/`.
