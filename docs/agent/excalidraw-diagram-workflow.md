# Excalidraw 图表工作流

> 本文件记录本项目用 Excalidraw 画配图的**边界、做法与验收方式**。
> 图表选档的权威规范是 [`content-style-guide.md`](content-style-guide.md) 第 7 节；本文件是它在 Excalidraw 这一档上的落地细则。两处冲突时以第 7 节为准。

---

## 1. 为什么用它

`content-style-guide.md` 第 7 节把图分成三档（A mermaid / B 手写 HTML-SVG 转 PNG / C AI 生图）。Excalidraw 属于 **B 档的一种更省力的实现**，它相对老式 B 档的优势是「源码是文本」：

| | mermaid（A 档） | Excalidraw（B 档） | 手写 HTML 截图（老 B 档） |
|---|---|---|---|
| 产物 | SVG，浏览器渲染 | `.excalidraw` JSON + PNG | PNG |
| 可版本控制 | ✅ | ✅ JSON 是纯文本 | ❌ 只有二进制 |
| 改图成本 | 改一行重新生成 | 拖进 excalidraw.com 手动微调 | 改 HTML 重截 |
| 布局控制 | 自动布局，难精确摆放 | 坐标级精确 | 坐标级精确 |
| 二次编辑 | 要改源码 | 可视化直接编辑 | 要改源码 |

**它真正解决的问题**：mermaid 是自动布局，画不了「并排多阶段对比」这类需要精确坐标的图。`docs/diagrams/stack-frame-lifecycle.excalidraw` 就是例子——四个阶段横向并排、每列一个栈容器、帧的位置有语义（栈顶在上），mermaid 的 subgraph 画出来会挤成一团。

## 2. 什么场景不要用它

这是本节最重要的一段。

### 2.1 关键信息不能只存在于图里

**Excalidraw 导出的是 PNG，图里的文字 AI 读不到。**

实测（2026-10-17，Production）：

```
# mermaid 的源码在服务端 HTML 里，爬虫能读到
curl -s https://www.coyafkyonline.site/blog/<slug> | grep "Chief 总管家"
→ 命中；页面里有 <p class="mdx-diagram-fallback"> 降级块，内含完整 mermaid 源码

# Excalidraw 导出的 PNG 是纯像素，一个字都读不到
```

本站是讲 GEO 的站，主张就是「内容要能被 AI 摘取」。**用一张 AI 读不到的图去承载核心论据，是自相矛盾的。**

所以硬规则：

> 图里的每一个数字、名称、关系，正文必须有对应的文字表述。图用来强化记忆，不用来独占信息。

### 2.2 纯流程、时序、状态机继续用 mermaid

mermaid 免费、可被索引、可版本控制，且自动布局足够好。不要为了好看而换。判断标准：**如果 mermaid 能画清楚，就用 mermaid。**

### 2.3 不要用它画承载核心数据的信息图

数字类的图（对比表、趋势）留在正文表格里。第 7.5 节「正文已用表格说清的内容不再出图」这条在这里同样适用。

## 3. 工具与工作方式

用 `excalidraw-skill`（已装在 `.agents/skills/excalidraw-skill/`，`.gitignore` 忽略了它，需要时用下面命令重装）：

```bash
npx -y mcp-excalidraw-server install-skill --dir .agents/skills
```

底层是 `mcp-excalidraw-server`，三种驱动方式，优先用前两种：

1. **MCP 工具**（若工具列表里有 `excalidraw/*`）
2. **CLI**（默认）—— `npx -y mcp-excalidraw-server <command>`
3. REST API（最后选择）

### ⚠️ 端口冲突

canvas server 默认占 **3000 端口**，与 `npm run dev` 冲突。画图时务必换端口：

```bash
export PORT=3312
export EXPRESS_SERVER_URL=http://127.0.0.1:3312
```

### 基本流程

```bash
export PATH="/opt/homebrew/bin:$PATH"      # cwebp 等工具在 homebrew 下
export npm_config_cache=/tmp/npm-cache-excal   # 本机 ~/.npm-cache-new 有 root 权限问题
export PORT=3312 EXPRESS_SERVER_URL=http://127.0.0.1:3312

npx -y mcp-excalidraw-server start
npx -y mcp-excalidraw-server clear --yes
npx -y mcp-excalidraw-server add elements.json
npx -y mcp-excalidraw-server screenshot --out /tmp/preview.png --scale 2   # 看效果
# 反复 update 修正，直到质量检查全过
npx -y mcp-excalidraw-server export --out docs/diagrams/<name>.excalidraw
npx -y mcp-excalidraw-server screenshot --out docs/diagrams/<name>.png --scale 2
npx -y mcp-excalidraw-server stop
```

只渲染已提交的文件（不需要 canvas server，可进 CI）：

```bash
npx -y mcp-excalidraw-server render docs/diagrams/x.excalidraw --out x.png
```

### 元素写法（CLI 会自动规范化）

```jsonc
// 形状上的标签：直接写 text，工具会转成 Excalidraw 的绑定文本格式
{"id":"a","type":"rectangle","x":80,"y":80,"width":200,"height":90,
 "text":"外层函数 outer()","backgroundColor":"#a5d8ff","fontFamily":5}

// 箭头绑定：用 startElementId / endElementId，自动连到边缘
{"type":"arrow","x":0,"y":0,"startElementId":"a","endElementId":"b"}

// 背景大矩形不要放 text（见下方反模式）
```

- `fontFamily: 5` 是 Excalidraw 0.18 的默认字体 Excalifont。**不指定会退成 1（Virgil）**，与站内其他图不一致
- 形状宽度参考 `max(160, 标签字数 * 12)`，高度单行 60、两行 78

## 4. 三条反模式

### 4.1 背景大矩形不要放标签

给背景矩形加 `text` 会在矩形**正中**生成一个绑定文本，正好压在里面所有元素上，且无法移动。

```jsonc
// ❌ 错：标签会居中，盖住区域内的所有元素
{"id":"zone","type":"rectangle","x":50,"y":50,"width":800,"height":400,"text":"栈容器"}

// ✅ 对：矩形只画框，标签用独立 text 元素
{"id":"zone","type":"rectangle","x":50,"y":50,"width":800,"height":400,
 "backgroundColor":"transparent","strokeStyle":"dashed"},
{"id":"zone-label","type":"text","x":70,"y":30,"width":120,"height":24,
 "text":"栈顶","fontSize":14}
```

### 4.2 避免跨区域长箭头

跨区箭头会穿过中间所有元素。连线限制在同一区/同一层内；跨区关系用注记文字表达。

### 4.3 箭头标签少用

标签画在箭头中点。短箭头上会压住两端形状。只在关系名真的必要时加，且 ≤12 字。

## 5. 验收：必须看渲染图

**这是本项目踩过的最贵的坑。**

### 教训：检查 JSON 结构不等于图是对的（2026-10-17）

第一版栈帧图和 Zero-click 图是用手写 Python 脚本生成的。脚本把文字存在矩形的 `text` 字段里、`boundElements: null`，箭头也没有 `startBinding`/`endBinding`。

当时的「验证」是自写的 SVG 预览脚本——它**恰好读的就是 `rect.text`**，于是判定通过。**但导出的文件在真实 Excalidraw 里所有方块都是空的。**

根因：Excalidraw 的标准结构是「独立 text 元素 + `containerId` 指向形状 + 形状用 `boundElements` 反指」。只在形状上放 `text` 不会被渲染。当时的 `mdx:check` 那套结构检查也查不出这个问题。

**结论：Excalidraw 文件必须用官方渲染器出图并肉眼看，不能只查 JSON。**

### 验收清单

出图后逐项看：

- [ ] **文字完整**——没有截断、没有空方块（空方块 = 绑定结构错了）
- [ ] **无重叠**——形状不互相压，背景容器完整包住子元素
- [ ] **箭头不穿模**——连线不横穿无关元素
- [ ] **箭头标签不压形状**
- [ ] **间距 ≥ 40px**，正文 ≥16px、标题 ≥20px
- [ ] **背景矩形的标签没被居中**（见 4.1）
- [ ] `fontFamily` 全为 5

结构自检（补充手段，不能替代看图）：

```bash
python3 -c "
import json
d=json.load(open('docs/diagrams/<name>.excalidraw'))
els=d['elements']; by={e['id']:e for e in els}
bound=[e for e in els if e['type']=='text' and e.get('containerId')]
bad=[t['id'] for t in bound
     if not any(b['type']=='text' and b['id']==t['id']
                for b in (by[t['containerId']].get('boundElements') or []))]
ab=[a['id'] for a in els if a['type']=='arrow'
    for k in ('startBinding','endBinding')
    if (a.get(k) and a[k]['elementId'] not in by)]
print('绑定反指缺失:', bad or '无')
print('箭头悬空:', ab or '无')
print('fontFamily:', sorted(set(e.get('fontFamily') for e in els if e['type']=='text')))
"
```

## 6. 落点

| 类型 | 路径 |
|---|---|
| 源文件（可编辑、进 git） | `docs/diagrams/<name>.excalidraw` |
| 导出的位图（备查） | `docs/diagrams/<name>.png` |
| 要放进博客正文时 | `public/images/blog/<slug>/<name>.webp` |

### 6.1 一条命令落进博客（推荐）

Excalidraw 只能导出 PNG，而博客图片规范要求 WebP + 正确目录 + 登记 manifest。手工要四步，容易漏，所以串成了一条命令：

```bash
npm run excalidraw:add -- \
  --diagram docs/diagrams/<name>.excalidraw \
  --post <blog-slug> \
  --name <image-name> \
  --alt "描述这张图传达的信息"
```

它依次做四件事：

1. `mcp-excalidraw-server render` —— 离线渲染 PNG（**不需要启动 canvas server，因此不占 3000 端口**）
2. `scripts/webp-batch.sh -m lossless` —— 转无损 WebP。**图表是线条图，无损比有损更小且像素级无损**（实测 233 KB → 70 KB）
3. `scripts/content-images.mjs add` —— 写入 `public/images/blog/<slug>/`，复用现有的 slug 校验与「拒绝覆盖同名文件」
4. `npm run images:manifest` —— 登记宽高与模糊占位（消除 CLS）

常用选项：

| 选项 | 说明 |
|---|---|
| `--scale 1-4` | 渲染倍率，默认 2 |
| `--mode lossless\|lossy` | 默认 lossless |
| `--png <path>` | 已有 PNG 时跳过渲染 |
| `--keep-temp` | 保留中间产物（排查用） |

产物超过 3 MB（`images:check` 的阈值）时会提示，可降 `--scale` 或改 `--mode lossy`。

命令会回显可直接粘贴的 Markdown 引用：

```md
![外层调用内层时栈帧的四个阶段](/images/blog/<slug>/<image-name>.webp)
```

⚠️ 图注要求见 `content-style-guide.md` 7.2 第四步——图下必须有一句解读。

### 6.2 现有示例

- [`docs/diagrams/stack-frame-lifecycle.excalidraw`](diagrams/stack-frame-lifecycle.excalidraw) — 并排四阶段的空间布局
- [`docs/diagrams/geo-zero-click.excalidraw`](diagrams/geo-zero-click.excalidraw) — 两条链路对比 + 数据带

这两张目前只作为文档资产存在 `docs/diagrams/`，尚未进任何博客正文。

## 7. 中文字体

无浏览器渲染用内置字体（Excalifont / Virgil / Cascadia / Liberation），**不含中文**，中文回退到系统字体并打印警告。

- 本机 macOS 有中文字体，正常
- 若在 Linux 服务器上渲染（如 B 线），需先装 CJK 字体，否则中文会变方块

canvas 页面的字体来自 esm.sh CDN，离线时会退成系统字体；headless 渲染不受影响。
