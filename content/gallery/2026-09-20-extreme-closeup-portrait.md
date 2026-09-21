---
title: "极端近景肖像 · 镜头贴到 28 厘米"
date: "2026-09-20"
summary: "把 50mm 镜头推到距脸 28cm：主体占满 93% 画幅，整张照片靠量化约束立住。"
image: "/gallery/2026-09-20-extreme-closeup-portrait.webp"
model: "gpt-image-2 (micu)"
prompt: "极端近景 肖像 量化构图"
fullPrompt: |-
  Extreme close-up portrait photograph, 9:16 vertical. A fully clothed adult East Asian woman in her twenties wearing a plain off-white cotton crew-neck shirt, long black hair loose and slightly messy with a few strands across her cheeks, small oval face, dark brown eyes looking straight into the lens with quiet intensity, natural rosy cheeks, softly closed mouth. A calm, attentive, restrained expression; she is not posing at all.

  Composition: 50mm lens placed about 28 cm from her face, subject filling roughly 93% of the frame, tightly framed from the top of her hair down to her shoulders, face positioned slightly left of center. Gray background completely out of focus and indistinct.

  Lighting neutral and even, with gentle highlights on the eyes. Color balance roughly 55% skin tones, 21% off-white, 16% black hair, 8% background. Low saturation overall, natural film-like skin texture, subtle softness at the centre of the frame from the very close working distance. Photorealistic candid snapshot, editorial photography, tasteful and modest.
negativePrompt: "过度磨皮，数码感，浓妆，影棚布光，二次元，摆拍姿势"
params:
  ratio: "9:16"
  style: "写实肖像"
  technique: "极端近景 / 50mm 距脸 28cm"
  lighting: "中性光"
  resolution: "768×1376"
  provider: "micu (gpt-image-2)"
tags:
  - "肖像"
  - "近景"
status: published
lang: zh
englishSummary: "A 50mm lens pushed to 28cm from the face: the subject fills 93% of the frame, and the whole shot is held up by quantified composition and colour constraints."
---

# 极端近景肖像 · 镜头贴到 28 厘米

**一句话概括**：距离本身就是一个提示词——把机位、占比、色彩配比全部写成数字，画面几乎无处可偏。

**8 维拆解**：

| 维度 | 内容 |
|------|------|
| 主体 | 成人女性，胸上近景 |
| 风格 | 写实肖像 / 纪实快照 |
| 构图 | 极端近景，主体占约 93%，脸部略偏左 |
| 光影 | 中性光，高光落在眼睛 |
| 色彩 | 低饱和：55% 肤色 / 21% 米白 / 16% 黑发 / 8% 背景 |
| 技术 | 50mm 镜头、距脸约 28cm、浅景深 |
| 氛围 | 安静、专注、未摆拍 |
| 参数 | 9:16 竖构图 |

> 这条提示词真正起作用的是**数字**，不是形容词。\"距脸 28cm\"、\"占画幅 93%\"、\"55% 肤色 / 21% 米白 / 16% 黑发 / 8% 背景\"——机位、占比、色彩配比全部量化后，模型几乎没有跑偏的余地。另外 \"she is not posing at all\" 这句是必要的：不写它，模型会本能地给出一个端正的影棚姿势，而这张图要的恰恰是没准备好的那一秒。

> ⚠️ 实测踩到的坑：**原稿的情绪描写会被内容审核拦下**（HTTP 400「疑似成人内容」）。删掉氛围化的身体描写、只保留机位与光线这类可测量的视觉参数后，一次通过。结论不是\"不能拍亲密感\"，而是**把氛围翻译成可测量的参数**——距离、占比、高光位置——既绕开审核，复现性也更好。下方 fullPrompt 是**实际通过审核并生成这张图的版本**，不是最初草稿。
