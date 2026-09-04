# Blog Image Workflow

博客图片采用仓库内的本地静态资产，不额外引入 CMS 或对象存储。图片数量较少时，这种方式的引用最稳定，也能跟随文章一起接受 Git 审查。

## 目录约定

每篇文章拥有一个与文章 slug 同名的独立目录：

```text
content/blog/2026-08-23-example.md
public/images/blog/2026-08-23-example/
  architecture.webp
  result-comparison.png
```

图片文件名使用简短、可读的英文 kebab-case。优先使用 WebP 或 AVIF；需要透明背景时可使用 PNG，需要保留矢量时可使用 SVG。建议单张图片控制在 1 MB 内，超过 3 MB 会被检查命令警告。

## 添加图片

不要手动猜目录和 URL，使用导入命令：

```bash
npm run images:add -- \
  --post 2026-08-23-example \
  --file /absolute/path/to/chart.png \
  --name architecture \
  --alt "系统架构图"
```

命令会：

1. 确认对应的博客文章存在；
2. 将图片复制到文章自己的资产目录，并拒绝覆盖同名文件；
3. 输出可以直接粘贴进 Markdown/MDX 的引用。

输出示例：

```md
![系统架构图](/images/blog/2026-08-23-example/architecture.png)
```

`alt` 描述图片传达的信息，而不是重复写“图片”或文件名。它用于无障碍阅读，也会在图片加载失败时显示。

## 发布前检查

```bash
npm run images:check
```

`npm run build` 会通过 `prebuild` 自动执行同一项检查，缺失文件、错误目录或空 `alt` 会阻止部署。

检查包括：

- Markdown 和 HTML 图片是否有非空 `alt`；
- 本地图片文件是否真实存在；
- 新图片是否放在当前文章自己的 `/images/blog/<slug>/` 目录；
- 管理目录内是否有未被引用的图片；
- 图片是否超过 3 MB。

历史文章仍可继续使用 `/diagrams/...` 等旧路径，检查时只会给出 warning。新增图片统一走 `/images/blog/<slug>/...`。

## 边界

- 当前机制负责博客正文内图片，不承担 Gallery 作品管理；Gallery 继续使用自己的 `content/gallery` 与 `public/gallery`。
- 暂不增加博客封面 frontmatter。等列表页确实需要封面时，再在内容 schema 中加入可选 `cover` 字段。
- 不建议引用外部图片 URL，避免来源失效、跨域配置和隐私问题。
