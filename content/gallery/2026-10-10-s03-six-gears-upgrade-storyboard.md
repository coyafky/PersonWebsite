---
title: "S03 蓝辉整车升级车间 · 六大装备故事板"
date: "2026-10-10"
summary: "六个施工 beat 的多图故事板案例：从轮毂、底盘护板、电动踏板，到隔热窗膜、改色膜和 TPU 隐形车衣。"
image: "/gallery/2026-10-10-s03-six-gears-beat-a-wheel-upgrade.webp"
referenceImages:
  - "/gallery/2026-10-10-s03-six-gears-character-reference.webp"
carouselImages:
  - src: "/gallery/2026-10-10-s03-six-gears-beat-a-wheel-upgrade.webp"
    label: "A · 轮毂升级"
  - src: "/gallery/2026-10-10-s03-six-gears-beat-b-underbody-protection.webp"
    label: "B · 底盘防护"
  - src: "/gallery/2026-10-10-s03-six-gears-beat-c-power-step.webp"
    label: "C · 电动踏板"
  - src: "/gallery/2026-10-10-s03-six-gears-beat-d-window-film.webp"
    label: "D · 隔热窗膜"
  - src: "/gallery/2026-10-10-s03-six-gears-beat-e-color-wrap.webp"
    label: "E · 个性改色"
  - src: "/gallery/2026-10-10-s03-six-gears-beat-f-ppf.webp"
    label: "F · 隐形车衣"
model: "GPT Image 2"
prompt: "S03 六大装备连续升级故事板"
fullPrompt: |-
  {
    "shot_id": "S03",
    "title_cn": "六大装备连续升级（记忆点）⭐",
    "title_en": "Six Gears Full Upgrade",
    "duration": "11s（6 beat 各约 1.8s，豆包拆 6 段 2s 抽卡）",
    "format": "9:16",
    "scene": "SCENE_04 蓝辉整车升级车间（车辆上举升机，六个工位依次施工）",
    "scene_name_cn": "蓝辉升级车间 · 六大装备施工中",
    "character": "CHAR_LANXIAOHUI_TECH_LION_001（可不出镜，施工看板指挥）",
    "character_view": "VIEW_SIDE",
    "character_expression": "EXP_04（自信认可）",
    "character_pose": "POSE_03（指向/指挥）",
    "vehicle": "EV_SUV_001（上举升机，原厂态→逐步升级）",
    "product": "六大装备：LANHUI_WHEEL_001 运动轮毂 / 底盘护板 / 电动踏板 / 隔热窗膜 / 改色膜 / TPU 隐形车衣",
    "prop": "四柱举升机 / 轮毂拆装台 / 底盘工位 / 踏板工位 / 无尘贴膜间 / 改色区 / 车衣区",
    "camera": {
      "shot": "close_up ×6（每 beat 一工位特写）",
      "angle": "eye_level / 低角度",
      "lens": "50mm / 85mm"
    },
    "composition": {
      "subject": "车辆举升居中，施工工位与装备高亮右侧 1/3，字幕位固定",
      "format": "9:16"
    },
    "action": "六个工位依次施工：轮毂拆装换新 → 举升机下装底盘护板 → 车门侧装电动踏板 → 贴膜间贴隔热窗膜 → 改色区车身改色 → 车衣区覆盖隐形车衣",
    "camera_motion": "六 beat 快切（每 beat 固定机位近景，施工动作）",
    "locks": {
      "must_keep": [
        "EV_SUV_001 车身几何（举升机上升起）",
        "SCENE_04 车间结构与工位位置",
        "各装备结构（五辐轮毂 / 装甲 / 踏板 / 膜）",
        "LANHUI 蓝橙氛围灯"
      ],
      "avoid": [
        "车辆变形",
        "轮毂辐条数变化",
        "装备结构混乱",
        "设备位置跳变",
        "老式汽修感"
      ]
    },
    "style_tail": "Q 版萌系 2.5D 动漫风格：三渲二（cel-shading）动漫渲染，干净描边线，圆润 Q 版造型，大眼星点高光，高饱和明快配色（蓝辉深海军蓝 / 品牌蓝 / 品牌橙为主），动漫式大块面光影与 LED 光效，整体质感接近高质量国产动漫番剧。",
    "beats": [
      {
        "beat": "A",
        "name": "轮毂升级",
        "keyframe_prompt": "Q 版萌系 2.5D 动漫风格。蓝辉整车升级车间轮毂拆装工位：银灰色新能源 SUV（EV_SUV_001）上举升机，一只原厂轮毂被拆下，拆装机臂自动操作，一只全新五辐深枪灰金属运动轮毂（LANHUI_WHEEL_001：银色精加工切削面、品牌蓝橙点缀）被安装到位，星点高光迸发。工位灯阵照亮，画面右侧 1/3 高亮字幕位（轮毂升级）。竖屏 9:16 近景，轮毂特写居中，拆装机从右侧操作。禁止：轮毂变形、辐条数变化、车辆变形、塑料感。"
      },
      {
        "beat": "B",
        "name": "底盘防护",
        "keyframe_prompt": "Q 版萌系 2.5D 动漫风格。蓝辉升级车间底盘施工工位：银灰色新能源 SUV（EV_SUV_001）在四柱举升机上完全升起，技师在车底安装金属底盘护板（深灰装甲质感、蓝辉蓝橙边缘光），护板自动吸附贴合车底，拼接处亮起锁定灯。低角度机位仰拍车底，工具墙背景。竖屏 9:16，低角度车底装甲特写，技师手持护板居中。禁止：装甲变形、车辆变形、机械结构混乱。"
      },
      {
        "beat": "C",
        "name": "电动踏板",
        "keyframe_prompt": "Q 版萌系 2.5D 动漫风格。蓝辉升级车间电动踏板安装工位：银灰色新能源 SUV（EV_SUV_001）停在车门侧施工区，车门开启，技师安装电动踏板，踏板从车身下方自动伸出展开（蓝辉蓝橙边缘光、金属银面板），完全展开后锁定。侧面视角，车间灯阵照明。竖屏 9:16，车门与踏板侧面特写居中。禁止：踏板变形、车门变形、车辆变形。"
      },
      {
        "beat": "D",
        "name": "隔热窗膜",
        "keyframe_prompt": "Q 版萌系 2.5D 动漫风格。蓝辉无尘贴膜间（SCENE_03）：银灰色新能源 SUV（EV_SUV_001）车窗特写，贴膜技师用蓝色检测灯扫过玻璃，玻璃瞬间变成高级深色隔热窗膜效果（渐变深蓝、细腻反光），扫描光残影留在玻璃上。无尘间灯光与检测灯。竖屏 9:16，车窗特写居中，扫描光从右向左。禁止：玻璃变形、膜面起泡、车辆变形。"
      },
      {
        "beat": "E",
        "name": "个性改色",
        "keyframe_prompt": "Q 版萌系 2.5D 动漫风格。蓝辉升级车间改色膜施工区：银灰色新能源 SUV（EV_SUV_001）停在改色区，技师贴改色膜，车身颜色快速切换：银灰 → 冰莓粉 → 战斗灰 → 帝王紫 → 液态银（动漫式渐变色带、星点高光），最终定格液态银。身后是色卡墙与膜卷架。竖屏 9:16，车身侧面 3/4 居中，色带从车头流向车尾。禁止：车身变形、颜色乱跳、车辆变形。"
      },
      {
        "beat": "F",
        "name": "隐形车衣",
        "keyframe_prompt": "Q 版萌系 2.5D 动漫风格。蓝辉升级车间隐形车衣施工区：银灰色新能源 SUV（EV_SUV_001）完成改色后停在车衣区，技师用刮板贴透明 TPU 隐形车衣，能量膜从车头如流水般覆盖到车尾（透明膜层带轻微折射光、边缘蓝橙光），一颗小碎石撞击车身形成能量波纹后弹开。膜卷架与刮板工具背景。竖屏 9:16，车身侧面特写，膜流方向为车头 → 车尾。禁止：车衣变形、车身变形、碎石穿膜。"
      }
    ],
    "video_generation": {
      "mode": "Image → Video（6 beat 拆 6 段各 2s，豆包 3s 档逐段抽卡）",
      "model": "豆包（省卡：先抽 beats A 轮毂 + F 车衣两个高光段）",
      "motion": "每 beat 工位施工动作 + 装备变化 + 灯光卡点",
      "transition": "六 beat 硬切 + 科技音效卡点（咔 → 嗒 → 唰 → 叮 → 嗡 → 啵）"
    }
  }
negativePrompt: |-
  车辆变形，车身几何改变，SUV 车型改变，轮毂辐条数变化，装备结构混乱，设备位置跳变，老式汽修感，轮毂变形，装甲变形，踏板变形，玻璃变形，膜面起泡，车身颜色乱跳，车衣变形，碎石穿膜，塑料感，低清晰度，脏乱背景，角色脸型变化，头灯变形，制服变形，品牌标识乱码，水印，错误字幕，错误比例，横版构图
params:
  ratio: "9:16"
  shotId: "S03"
  duration: "11s"
  beatCount: "6"
  outputCount: "6"
  vehicle: "EV_SUV_001"
  character: "CHAR_LANXIAOHUI_TECH_LION_001"
  scene: "SCENE_04 蓝辉整车升级车间"
  product: "六大装备连续升级"
  style: "Q 版萌系 2.5D 三渲二动漫风格"
  carouselMode: "点击标签切换 A-F 六个 beat"
tags:
  - "故事板"
  - "多图生成"
  - "S03"
  - "六大装备"
  - "汽车改装"
  - "蓝小辉"
  - "视频分镜"
  - "轮播案例"
status: published
lang: zh
englishSummary: "A six-beat S03 storyboard for Lan Hui's EV upgrade workshop, covering wheel replacement, underbody protection, power steps, window film, color wrap, and TPU paint protection film in a consistent 2.5D animation style."
---

## 故事板结构

这条案例记录一个“原始角色图 + 故事板提示词 + 六个施工画面”的多图生成流程。图一是蓝小辉角色参考图，A～F 是同一条 S03 视频分镜中的六个连续升级 beat。

Gallery 使用轮播模式展示六个施工画面。点击标签即可切换工位，展开卡片后可以查看角色参考图、完整故事板提示词和视频生成参数。

## 六个施工 beat

| Beat | 工位 | 画面重点 | 镜头方向 |
| --- | --- | --- | --- |
| A | 轮毂拆装台 | 五辐深枪灰金属运动轮毂安装到位 | 轮毂近景 |
| B | 底盘工位 | 深灰装甲质感护板贴合车底 | 低角度仰拍 |
| C | 踏板工位 | 金属电动踏板从车身下方展开 | 车门侧面 |
| D | 无尘贴膜间 | 蓝色检测灯扫过并改变车窗膜色 | 车窗特写 |
| E | 改色区 | 车身颜色经过多段色带切换后定格液态银 | 侧面 3/4 |
| F | 车衣区 | 透明 TPU 膜从车头流动覆盖到车尾 | 车身侧面 |

## 轮播组件约定

`carouselImages` 按 A～F 的时间顺序保存六张成品图。`image` 指向第一张高光段，`referenceImages` 保存原始角色图。这个结构适合视频分镜、产品系列图和同一提示词的多版本输出。
