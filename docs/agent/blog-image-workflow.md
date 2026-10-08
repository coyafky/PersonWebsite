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

## 封面图（cover）

博客列表卡片与详情页支持为文章配一张封面。封面同样是仓库内的托管静态资产，走与正文图片**完全相同**的目录约定与校验规则。

在 frontmatter 里成对声明两个字段：

```yaml
cover: /images/blog/2026-08-23-example/cover.webp
coverAlt: 一张展示示例系统架构的示意图
```

- **字段名**：`cover` 与 `coverAlt`，两者都是**可选**字段：缺省时列表页与详情页降级为纯文字布局，照旧正常构建（站内 58 篇博客现已全部配图，但新文章可以先不配）。
- **`cover` 路径要求**：根相对路径，且必须落在该文章自己的 `/images/blog/<slug>/` 目录下；扩展名需在图片白名单内（`.avif/.gif/.jpeg/.jpg/.png/.svg/.webp`）。不接受远程 URL、`data:` 或 `blob:`。
- **`coverAlt` 必填**：只要写了 `cover`，`coverAlt` 就不能缺失或为空（与正文图片的 alt 规则一致）。
- **导入方式**：照旧用导入命令把封面落到正确目录，不要在 frontmatter 里手写一个文件不存在的路径：

  ```bash
  npm run images:add -- \
    --post 2026-08-23-example \
    --file /absolute/path/to/cover.png \
    --name cover \
    --alt "一张展示示例系统架构的示意图"
  ```

  命令回显的 Markdown 引用可忽略；把 `/images/blog/2026-08-23-example/cover.webp` 填进 frontmatter 的 `cover` 即可。
- **检查器覆盖范围**：`npm run images:check`（以及 `npm run build` 的 `prebuild`）现在**把 frontmatter 的 cover 也当成一个受管理引用**：
  - 按与正文图片相同的规则校验（根相对、必须在该文章自己的目录、扩展名白名单、文件真实存在、单张 ≤ 3 MB）；
  - 把它登记进「已引用」集合，**不会再误报 `unused managed image`**；
  - 有 `cover` 而无 `coverAlt`（或为空）→ 记为 **error**；
  - 只写了 `coverAlt` 却没有 `cover` → 记为 **warning**（多半是笔误）。
- **无封面时的降级行为**：列表卡片与详情页都不渲染封面节点（`cover` 缺失时那段 JSX 完全不输出，不留空 `<div>`），排版回退为改动前的纯文字布局。

### 封面视觉规范（站内统一风格）

58 篇博客封面共用同一套视觉语言。新增封面请沿用，不要另起一套：

- **尺寸**：严格 **1600 × 900**（16:9），WebP。列表卡片与正文页的封面容器都写死 `aspect-ratio: 16 / 9` 加 `object-fit: cover`——尺寸不是 16:9 会被无声裁切，manifest 登记的宽高也会与真实文件对不上。
- **底与光**：明亮白场（带极轻微纸纹或布纹），单一侧光，柔和浅灰投影，留白充足。
- **主体**：纸、卡纸、哑光陶瓷一类**无字素材**的静物小场景。不出现人脸、品牌物、界面截图。
- **颜色**：全图近乎单色（白 / 暖灰），**唯一的彩色是一条细亮蓝线**（或一小段蓝胶带、蓝条），且全图只出现一处。
- **绝对不出现**：文字、数字、字母、logo、图表刻度、坐标轴。模型很爱自作主张加字，出图后要逐张核对——本项目已有一次封面里编出数据源中并不存在的列名的先例。
- **隐喻层级**：主体只表达文章的**抽象动作或关系**（收拢 / 拆解 / 对齐 / 铺开 / 归一），**不画具体技术架构**；架构图属于正文配图，不属于封面。
- **`coverAlt`**：用中文描述这张图实际展示的内容，不复述标题、不写「本文封面」。

生成走 `micu-image`（`gpt-image-2`），出图后归一化到精确 1600×900（居中裁切，不拉伸），再转 WebP：

```bash
magick in.png -resize 1600x900^ -gravity center -extent 1600x900 -strip tmp.png
scripts/webp-batch.sh tmp.png -q 86
# 产物落到 public/images/blog/<slug>/cover.webp
```

## 边界

- 当前机制负责博客正文内图片，不承担 Gallery 作品管理；Gallery 继续使用自己的 `content/gallery` 与 `public/gallery`。
- 封面（frontmatter `cover` / `coverAlt`）已纳入本机制，规则见上文「封面图（cover）」一节；无封面时列表页与详情页降级为纯文字布局，不渲染空节点。
- 不建议引用外部图片 URL，避免来源失效、跨域配置和隐私问题。
