# AI 生图课程 MDX 组件手册

> 更新日期：2026-10-09
>
> 用途：记录 GPT Image 2 课程中已经实现的 MDX 组件，方便后续 Agent 继续写课文、迁移素材和扩展互动练习。

## 1. 组件总览

| 组件 | 用途 | 是否可复用 | 当前使用位置 |
|---|---|---:|---|
| `ImageCaptionGrid` | 多张图片并排展示，每张图片配标题和说明 | 是 | 第 5、13 节 |
| `ImageTextList` | 左侧图片、右侧说明文字的纵向列表 | 是 | 第 5、12 节 |
| `VisualStorytellingFramework` | 展示视觉叙事八大控制维度 | 是 | 第 8、18 节 |
| `VisualDnaBuilder` | 交互式 Visual DNA Prompt 生成器 | 是 | 第 1、23 节 |
| `LightingDirectionCarousel` | 四种光线方向选择轮播图 | 当前为课程专用 | 第 6 节 |

所有组件都已经在 `components/mdx-content.tsx` 注册。课程 MDX 文件中不需要写 `import`。

## 2. 图片资源约定

课程本地图片统一放在：

```text
public/images/course/gpt-image-2/<lesson-name>/
```

在 MDX 中使用根路径引用：

```mdx
src="/images/course/gpt-image-2/lesson12/06.png"
```

不要写成：

```mdx
src="public/images/course/gpt-image-2/lesson12/06.png"
```

优先使用课程目录中的本地图片。源教程里没有本地对应素材时，才保留原始外部图片地址。

添加或复制图片后运行：

```bash
npm run images:manifest
npm run images:check
```

## 3. `ImageCaptionGrid`：图片说明网格

### 适用场景

- 两张、三张或更多图片的横向比较；
- 透视、构图、风格、镜头等选项对比；
- 每张图片需要一个短标题和一句解释。

### 基础用法

```mdx
<ImageCaptionGrid title="三种透视：从正对空间到强烈俯仰" columns={3}>
  <ImageCaptionItem
    src="/images/course/gpt-image-2/lesson13/02.jpeg"
    alt="一条正对镜头的建筑走廊"
    title="一点透视"
    description="正对空间，主要线条汇聚到一个消失点。"
  />

  <ImageCaptionItem
    src="/images/course/gpt-image-2/lesson13/05-2.jpeg"
    alt="从斜侧面观察的建筑转角"
    title="两点透视"
    description="斜看转角，左右两个水平方向分别向远处消失。"
  />

  <ImageCaptionItem
    src="/images/course/gpt-image-2/lesson13/04.jpeg"
    alt="仰视高层建筑的强烈透视"
    title="三点透视"
    description="强烈俯视或仰视，垂直线也参与汇聚。"
  />
</ImageCaptionGrid>
```

### 属性

`ImageCaptionGrid`：

- `title`：可选，网格标题；
- `columns`：可选，列数，建议使用 `2` 或 `3`。

`ImageCaptionItem`：

- `src`：可选，本地图片路径；没有图片时会显示占位块；
- `alt`：必填，图片无障碍描述；
- `title`：必填，图片标题；
- `description`：可选，图片说明。

### 注意事项

不要这样传数组：

```mdx
<ImageCaptionGrid items={[...]} />
```

`next-mdx-remote/rsc` 对 MDX 中的数组字面量 props 支持不稳定。应使用 `ImageCaptionItem` 子组件。

## 4. `ImageTextList`：左图右文列表

### 适用场景

- 人物姿态、动作、材质、环境等分项教学；
- 每一项都需要较长说明；
- 图片和解释之间存在明确的一一对应关系。

### 基础用法

```mdx
<ImageTextList
  title="四类基础姿态：先确认身体如何被支撑"
  intro="姿态提示词不能只写动作名称，还要交代接触面、重心和四肢关系。"
>
  <ImageTextItem
    src="/images/course/gpt-image-2/lesson12/06.png"
    alt="站立、坐姿、蹲姿和躺姿的四格姿态示意"
    eyebrow="01 · Body Pose"
    title="站、坐、蹲、躺"
    description="先判断身体的主要支撑面，再描述髋部、膝盖、脚部和手臂的位置。"
    keywords="standing, seated, squatting, lying"
  />

  <ImageTextItem
    src="/images/course/gpt-image-2/lesson12/05.png"
    alt="双腿均衡承重与单腿承重的姿态对比"
    eyebrow="02 · Weight Balance"
    title="重心与平衡"
    description="描述承重腿，可以减少人物像悬浮或失去平衡。"
    keywords="balanced weight, contrapposto"
  />
</ImageTextList>
```

### 属性

`ImageTextList`：

- `title`：可选，列表标题；
- `intro`：可选，列表引导语。

`ImageTextItem`：

- `src`：可选，本地图片路径；
- `alt`：必填，图片描述；
- `eyebrow`：可选，小标签或英文分类；
- `title`：必填，条目标题；
- `description`：必填，条目说明；
- `keywords`：可选，提示词关键词。

## 5. `VisualStorytellingFramework`：视觉叙事框架

### 适用场景

用于解释连续图像、分镜和视觉叙事中的八个控制维度：故事结构、角色一致性、场景连续性、镜头衔接、动作连续性、情绪递进、时间连续性和视觉语言一致性。

### 基础用法

```mdx
### 18.2 视觉叙事的八大控制维度

<VisualStorytellingFramework />
```

组件内部已经维护默认数据，因此推荐使用无 props 版本。

## 6. `VisualDnaBuilder`：Visual DNA 互动生成器

### 适用场景

- 从参考风格中提取视觉语言；
- 修改主体、光影、构图、材质或镜头；
- 需要让读者在页面中选择参数并复制 Prompt。

### 基础用法

```mdx
<VisualDnaBuilder />
```

### 指定默认主体

```mdx
<VisualDnaBuilder initialSubject="一辆金属蓝色新能源 SUV" />
```

组件行为：

- 选择参考风格模板；
- 输入新的主体；
- 选择需要修改的视觉维度；
- 补充自定义描述；
- 实时生成 Prompt；
- 点击按钮复制 Prompt；
- 输入内容只在浏览器本地处理，不上传到服务器。

目前支持的默认视觉模板包括汽车商业广告、白底电商产品和电影感海报。

## 7. `LightingDirectionCarousel`：光线方向选择轮播

### 适用场景

当前用于第 6 节光影课程，展示四种光线方向：顺光、侧光、逆光和侧逆光。

### 用法

```mdx
<LightingDirectionCarousel />
```

### 交互行为

- 点击底部标签切换；
- 点击左右箭头切换；
- 使用键盘左右方向键切换；
- 点击主图打开大图查看；
- 当前选项会同步更新说明和提示词片段。

### 当前本地素材

```text
public/images/course/gpt-image-2/lesson6/07.svg
public/images/course/gpt-image-2/lesson6/08.svg
public/images/course/gpt-image-2/lesson6/09.svg
public/images/course/gpt-image-2/lesson6/10.svg
```

### 可复用性说明

这个组件的交互结构可以复用，但目前四个选项和 Prompt 文案写在组件内部，属于“课程专用数据 + 可复用交互外壳”。

如果未来要用于色温、景别或材质选择，建议把数据抽成配置：

```ts
type CarouselOption = {
  id: string;
  label: string;
  description: string;
  prompt: string;
  src: string;
};
```

然后再把 `LightingDirectionCarousel` 重构为通用的 `ImageOptionCarousel`。

## 8. 新 Agent 使用组件的流程

处理新的课程文章时，按下面顺序判断：

1. 先阅读文章，确认内容是对比、分项说明、框架解释还是参数交互。
2. 两张或多张图片横向对比，使用 `ImageCaptionGrid`。
3. 图片左侧、说明右侧，使用 `ImageTextList`。
4. 八维框架或固定知识结构，使用 `VisualStorytellingFramework`，或创建同样的无 props 文章专用组件。
5. 需要选择参数并生成 Prompt，使用 `VisualDnaBuilder`，或创建新的 client component。
6. 需要图片轮播，先确认组件数据是否固定；固定课程内容可以创建专用轮播，多个课程复用时再抽象成通用组件。
7. 本地图片优先放到 `public/images/course/gpt-image-2/<lesson>/`。
8. 修改后运行：

```bash
npm run typecheck
npm run lint
npm run images:check
npm run content:audit
npx next build --webpack
```

## 9. MDX 组件维护规则

- 组件文件放在 `components/`；
- 在 `components/mdx-content.tsx` 中注册后，MDX 才能直接使用；
- 交互组件必须使用 `"use client"`；
- 图片说明必须填写有意义的 `alt`；
- MDX 中优先使用子组件传递重复数据，避免数组字面量 props；
- 课程页面不要为了组件化删除原教程的解释文字；
- 组件应服务于内容结构，不要把普通段落全部改成卡片；
- 如果组件只服务一个课程章节，应明确记录为“课程专用”，不要误认为通用组件。

## 10. 相关文件

```text
components/mdx-content.tsx
components/image-caption-grid.tsx
components/image-text-list.tsx
components/visual-storytelling-framework.tsx
components/visual-dna-builder.tsx
components/lighting-direction-carousel.tsx
app/globals.css
```
