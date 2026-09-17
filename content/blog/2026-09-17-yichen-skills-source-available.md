---
title: "拆 yichen-skills：41.5% 的 fork 率，和一本中国内容创作者的私人工具箱"
date: "2026-09-17"
updated: "2026-09-17"
summary: "这是我拆的第六个技能仓库，也是唯一一个「私人工作流」型——微信解密、剪映无头生成、火山 ASR、X 切片、公众号批量导出，19 个技能。但最让我意外的是它的 fork 率：41.5%，是前五个仓库的 4 到 6 倍。原因不复杂——这些技能必须被改才能用（你自己的微信、你的 Obsidian 路径、你的账号），而每个 fork 出去的人第一件事就是改路径和配置。它的许可证也因此不是开源的，是「源可用 + 商用需授权」。另外有一个细节我觉得前五个仓库都该学：它的 CI 里装着一个隐私扫描器，会拦截私人路径、私钥和六种凭据形态——把「别提交敏感信息」从 README 里的一句请求，变成了会挂红的门禁。"
tags:
  - "AI Skill"
  - "内容创作"
  - "开源"
  - "隐私工程"
  - "拆解"
status: published
lang: zh
englishSummary: "A teardown of mcncarl/yichen-skills — the sixth skill repo I have taken apart, and the first 'personal workflow' one: WeChat DB decryption, headless Jianying draft generation, Volcengine ASR, X thread slicing, batch WeChat MP export. What surprised me most is its fork rate: 41.5%, four to six times higher than the previous five repos. The reason is simple — these skills must be edited before they work (your WeChat, your Obsidian path, your accounts). Its license follows from that: not open source but source-available, with commercial use requiring authorization. One detail I think the other five repos should copy: its CI runs a privacy scanner that rejects personal paths, private keys, and six credential shapes."
---

# 拆 yichen-skills：41.5% 的 fork 率，和一本中国内容创作者的私人工具箱

这是第六个。前五个分别是[封面 Skill](/blog/2026-09-15-xialingguo-ip-cover-skill/)、[diagram-design](/blog/2026-09-15-diagram-design-skill-engineering/)、[hypit](/blog/2026-09-15-hypit-video-compiler-agent-skill/)、[agent-skills](/blog/2026-09-16-agent-skills-catalog-evals/)、[Strix](/blog/2026-09-16-strix-pentest-closure-discipline/)。

而这一个，是我拆到现在**唯一一个"私人工作流"型**的仓库。

前五个都在做"给别人用的工具"：封面模板、图表引擎、视频编译器、生命周期技能包、渗透测试。**这一个更像某个人把自己每天在用的东西整理出来公开了**——19 个技能，全部围绕一件具体的事：**把中文内容创作者的日常工作流打通**。

作者是**逸尘**，仓库里没有真名，只有微信 `yichen365ai`。

## 主要作用

**它把内容创作者散落在微信、剪映、X、公众号、Obsidian 之间的活儿，做成了 19 个可被 Claude Code / Codex 调用的技能。**

它自己列的 21 项能力，我按方向重排了一下：

| 方向 | 技能 | 干什么 |
| --- | --- | --- |
| **微信数字资产** | `wechat-local-vault` | 解密 Mac 微信 4.x 本地库，提取聊天/朋友圈/收藏夹 |
| | `wechat-windows-reader` | 读已授权的 Windows 脱机明文快照（实验性） |
| | `wechat-mp-batch-exporter` | 批量导出公众号历史文章、原创列表、阅读量、评论 |
| | `wecom-local-vault` | 只读解析 macOS 企业微信 5.x 数据库 |
| | `wecom-operations` | 通过官方 CLI 建文档、管待办和会议 |
| | `mac-wechat-dual-open` | Mac 微信双开，第二个图标改蓝色 |
| **视频生产** | `jianying-edit` | 无界面生成/修改剪映原生草稿并导出 MP4 |
| | `volc-asr` | 火山 ASR 转写、SRT 字幕、口播粗剪 |
| | `asr` | 统一 ASR 路由（纯文本走 Step，时间戳走火山） |
| | `x-slicer` | 一条 X 链接 → 1080×1440 图片组 + 成片，11 套模板 |
| **内容归档** | `content-archive` | 抖音/小红书/公众号/YouTube/B站/小宇宙已知链接归档 |
| | `bookmarks-export` | 私人收藏导出（小红书/抖音/X） |
| **研究** | `web-research` | 跨搜索→确认→归档→转写的总路由 |
| | `unified-search` | 13 个平台的只读发现（含微博、知乎、B站、小宇宙） |
| | `chatgpt-web-research` | 用已登录的 ChatGPT 官网做调研 |
| | `codex-chatgpt` | ChatGPT 做调研/架构/审查，Codex 独占本地写入 |
| | `grok-consult` | 不切主模型，让 GPT 调 Grok 原生搜 X |
| **基建** | `agent-memory` | 装 Markdown/Obsidian-first 的记忆库 |
| | `x-article-draft-uploader` | Obsidian 长文 → X Articles 草稿（只存草稿，不发布） |

规模：**3,058 star / 1,268 fork**，2026-02-11 建仓（7 个月），199 个文件、约 2.66 MB，主语言 Python。

**这个仓库该被写的原因，不是它有多少技能——是它的 fork 率。**

## 41.5%：一个比 star 数更能说明问题的数字

我把六个仓库的 fork/star 比拉出来对比了一下：

| 仓库 | star | fork | **fork / star** |
| --- | --- | --- | --- |
| diagram-design | 40,516 | 2,583 | 6.4% |
| agent-skills | 95,465 | 10,111 | 10.6% |
| Strix | 63,059 | 6,887 | 10.9% |
| hypit | 6,694 | 795 | 11.9% |
| xialingguo-ip | 153 | 29 | 19.0% |
| **yichen-skills** | **3,058** | **1,268** | **41.5%** |

**41.5%。是图表引擎的 6.5 倍，是生命周期技能包的 4 倍。**

这个数字的含义很清楚：**star 是"我想要这个"，fork 是"我必须动它"。** 前面几个仓库的 fork 大多是"收藏/备份"性质的——装上就能用，没必要改。而这一个，**每一个想用它的人，第一件事都得改文件。**

原因就写在它的安装说明里：

> 如果你有自定义技能目录，也可以使用自定义路径……`<OBSIDIAN_VAULT>/...` 只是示例

**这些技能全都要接进"你自己的东西"**：你的微信、你的 Obsidian 库、你的 Chrome 配置、你的公众号账号、你的小红书登录态、你的火山 ASR 密钥。没有一个人的电脑和另一个人的长得一样，所以**改路径不是可选项，是启动条件。**

这跟 diagram-design 那种"装上就能出图"的东西是两个物种。一个是产品，一个是**工具箱**。

### 而这个数字，正好解释了它的许可证

它的许可证叫 **Personal Learning and Non-Commercial Use License**——不是标准的开源协议（GitHub 把它标成 `NOASSERTION`）。核心三条：

1. **禁止商用**：不得出售、出租、再许可、提供付费访问、放进付费产品或服务、用于客户交付，或任何以盈利/商业运营为目的用途——除非事先取得书面许可
2. **禁止作为竞争性或打包产品再分发**：可以 fork 来个人学习，但不得重新发布、镜像、打包、做成公开技能合集/模板包/市场上架物/SaaS 组件/代理交付物/课程资产/公司内部工具包
3. **保留署名 + 尊重第三方许可**

而商用的口子在 README 里写得很直白：

> 加入逸尘的付费社群 **TradeWinds**，即可解锁本仓库所有 Skills 的商用授权。

**我一开始觉得这有点矛盾**：一个 fork 率 41.5% 的仓库，几乎每个使用者都在改它，而许可证说"不许再分发"。但想清楚之后发现它**恰好是这个形态的合理解**：

- 这些技能**必须依赖私有数据才有价值**（你的微信、你的账号）。所以"代码被拿走"本身不致命——**没有那套数据，代码是空壳**。
- 而真正会被拿走的是**方法**（怎么解密微信、怎么无头驱动剪映、怎么把公众号历史拉全）。这些是知识，不是代码。
- 所以它的策略是：**代码给你改，方法收授权费。** 而 CI 那个隐私扫描器（下面会讲）保证了"代码里不含任何私人东西"——**所以它可以安心公开。**

**这是我在前五个仓库里没见过的模式。** 前五个都是 MIT/Apache 直接送（agent-skills 明确写"MIT——在你的项目、团队和工具里随便用"），因为它们的价值在于通用能力，商用不损失什么。而这个仓库的价值在于**一个人的具体经验**，所以它在"公开以获客"和"收费以变现"之间选了这条线。

## 它的技能不是"提示词"，是有验收清单的工程

我原本以为"私人工具箱"意味着质量参差。挑了一个细看——`yichen-x-slicer`（把一条 X 帖子做成 3:4 图片组和成片），然后改观了。

它的 SKILL.md 里有 **12 条硬验收条件**，摘几条：

> 3. **所有 PNG 都是 1080×1440，且归一化后的选中文本按顺序被完整覆盖。**
> 4. **每一帧上的 `source-label` 都是空的，且视觉尺寸为零。**
> 5. 输出里不出现任何引用贴文本、引用贴媒体、或被排除的 Thread 节点。
> 6. **ZIP 里只含编号的最终 PNG，且条目与当前 PNG 的哈希一致。**
> 8. 每个 MP4 有一条 1080×1440、H.264、30fps 的视频流。**它有且仅当至少一个选中的非引用贴原生视频含有效源音轨时才有一条音频流；否则音频流数为零。**
> 12. 对每个原生视频页，QA 证明下载的 MP4 可完整解码……**对源音轨页面，QA 对照一条独立重建的源音轨时间轴，证明完整的无转场源区间以及每一个四帧转场；并核验允许的源音轨范围之外、sample-accurate 的完整补集。对源静音页面，QA 证明对应区间是静音的。**

**第 12 条我读了三遍。** 它说的是：这个工具会验算"该有声的地方有声、该静音的地方静音"，而且是**逐采样点（sample-accurate）**核验的——不是"听起来差不多"。

它对边界也写得很硬：

> - 只通过 FxTwitter **匿名**读取公开 X 数据；**不使用 X 登录态或 Cookie。**
> - 运行时媒体**只接受**来自 HTTPS `pbs.twimg.com` 或 `video.twimg.com`，**包括每一个重定向跳转**。原生 MP4 下载必须停在确切主机 `video.twimg.com`。**拒绝本地路径、`file:`/`data:` URL、超大响应、错误 MIME 类型、非图片签名、非 MP4 视频签名。**
> - 当 Thread 节点的数字 status ID 无效、焦点作者身份缺失、或引用贴的 `t.co` URL 无法从顶层 URL 实体解析时 **fail closed**。
> - **不生成也不添加 TTS、配音、BGM 或音乐。**

**域名白名单 + 逐跳校验 + fail closed + 不猜。** 这是一套有真实安全考量的设计，不是"让 AI 小心一点"。

工程化也不止于此。它有**真测试**和**真 CI**：

- `yichen-x-article-draft-uploader/tests/test_local_contracts.py` —— **111 KB**
- `yichen-x-slicer/scripts/test.mjs` —— 43 KB
- `yichen-unified-search/tests/` —— 12 个测试文件，`test_route_search.py` 一个就 43 KB
- `yichen-web-research/tests/test_hengzong_evidence.py` —— 41 KB
- **3 个 GitHub Actions workflow**（research-skills / x-article-draft-uploader / wechat-windows-reader）
- `licenses/` 下 5 个第三方许可证原文，`THIRD_PARTY_NOTICES.md` 13 KB

**一个个人项目，为 19 个技能配了 3 条 CI 流水线和几十万字节的契约测试。** 这已经超出"我把自己的脚本发出来"很多了。

## ⭐ 我最想推荐的一条：它的 CI 里有一个隐私扫描器

这是全仓库我觉得**前五个仓库都该抄**的地方。

在 `research-skills.yml` 的最后一步，有一个叫 **"Reject private paths and credential-shaped values"** 的检查。它内联了一段 Python，把所有仓库文件读一遍，然后匹配两组正则：

**第一组：私人路径和私钥材料**

```python
forbidden_patterns = {
    'personal macOS path':   re.compile(r'/Users/[A-Za-z0-9._-]+/'),
    'personal Linux path':   re.compile(r'/home/[A-Za-z0-9._-]+/'),
    'personal Windows path': re.compile(r'[A-Za-z]:\\Users\\[A-Za-z0-9._-]+\\'),
    'private key material':  re.compile(r'BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY'),
}
```

**第二组：六种凭据形态**

```python
credential_patterns = {
    'GitHub token':     re.compile(r'gh[pousr]_[A-Za-z0-9]{20,}'),
    'OpenAI-style key': re.compile(r'\bsk-[A-Za-z0-9_-]{20,}'),
    'Google API key':   re.compile(r'\bAIza[0-9A-Za-z_-]{30,}'),
    'AWS access key':   re.compile(r'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b'),
    'JWT':              re.compile(r'\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b'),
    'Bearer token':     re.compile(r'(?i)\bbearer\s+[A-Za-z0-9._~+/-]{20,}=*'),
}
```

扫到任何一条，直接 `SystemExit`，**CI 挂红。**

**为什么我觉得这条特别重要？**

因为 README 里那些"请勿上传真实凭据、真实聊天记录、客户数据、API key、本机路径"的叮嘱——**在别的项目里就是一句叮嘱，靠人自觉。** 而这个仓库把它变成了**机器检查**。

我这两天拆的仓库里，这个主题出现过好几次：[diagram-design](/blog/2026-09-15-diagram-design-skill-engineering/) 说过**"一条只活在散文里的规则，就是一条会发版坏例子的规则"**；[Strix](/blog/2026-09-16-strix-pentest-closure-discipline/) 把"结案纪律"做成**无条件注入每个 Agent 的系统提示**。

**yichen-skills 是同一个道理在隐私维度上的实现**：不许泄露隐私 → 写一条正则 → 让 CI 拦住。

而且这个检查对**这个仓库格外必要**——一个要处理微信数据库、企业微信快照、公众号凭据、Chrome Cookie 的仓库，作者本地一定存在这些文件。**一个手滑的 `cp` 或者一次 `git add .`，就能把真实密钥推上公开仓库。** 有这道门禁，那种事故在 push 前就被拦住了。

**这是"私人工具箱公开化"必须付的成本，也是它敢公开的底气。**

## 第二件值得学的事：「授权闸门」

第二个反复出现的模式，是**把"授权"做成流程里的一道闸**。

我数了一下，README 和各技能说明里，"**当前任务明确授权**"这类措辞出现了几十次，而且是有具体形状的：

- **小红书 Cookie 必须取得当前任务明确授权**
- **可选飞书沉淀也只在用户明确要求时执行**
- **扫码登录、凭证捕获、证书信任、代理修改和任何微信桌面端动作都必须先得到用户确认**
- **收藏导出只可用于用户本人有权访问的数据；不得绕过访问控制、验证码、限流或平台安全措施**
- **搜索与开放式发现不进入归档层**
- **搜索结果不会自动进入下载**
- **已经提交到某服务商的任务不会静默改投另一家**
- **清理临时文件前必须得到用户明确允许**

**这一批规则在防同一件事：Agent 顺着"看起来合理"的下一步自己走下去。**

我前面拆 agent-skills 时提过一个概念——它的技能里有"Red Flags"章节，用来标记"出问题的迹象"。**而 yichen-skills 的做法不同：它不检查迹象，它设置闸门。** 每一次跨越"公开数据 → 私人数据"、"读到 → 下载"、"生成 → 发布"的边界，都必须有当前这一次的明确授权。

注意那个修饰语：**"当前任务"**。不是"用户以前授权过"、不是"上次问过他同意了"。**授权是单次有效的、跟具体任务绑定的。** 这对一个会处理微信和私人收藏的工具来说，是唯一站得住的默认值。

还有个我喜欢的细节——它给"数据去哪了"做了一张**表**。`unified-search` 的 README 里逐条列：

| 路线 | 离开本机进程的数据 | 接收方与边界 |
| --- | --- | --- |
| AI HOT | AI 动态发现词及可选分类/日期条件 | AI HOT 公开 API；**AI 生成摘要只是发现线索，不是已核验证据** |
| Firecrawl | 显式提供的公开站点 Map 种子 URL…以及 `Authorization` header 中的凭据 | 仅 Firecrawl；**Scrape 设置 `storeInCache=false`；Map 不作缓存控制声明，两条路线都不承诺零数据保留** |
| 微博 | 公开关键词查询 | 先发给 `m.weibo.cn` 并使用**仅驻留内存**的临时匿名访客会话……**Cookie 值不进入适配器命令、结果或日志** |
| X Quick / Research | 为当前有界搜索生成的每个查询 | 通过官方 Grok CLI 发给 xAI；**只有明确额度耗尽时才允许匿名 FxTwitter** |

**"数据出本机"的清单，逐条写清接收方和不承诺什么。** 尤其是"不承诺零数据保留"那句——一个营销文案会写"我们不存储你的数据"，它写的是"**这两条路线都不承诺零数据保留，不得被解读为零数据保留承诺**"。这种诚实反过来建立了信任。

## 还有一件小事，但很说明问题

`yichen-content-archive` 的 `scripts/` 目录里，原先独立的抖音和小红书抓取器被**融合**了：

```
douyin_download.py          10.9 KB
xiaohongshu_fetch.py        22.5 KB
wechat_mp_local.py          23.7 KB
x_known_url.py              24.4 KB
xiaoyuzhou_opencli.py       15.1 KB
xiaoyuzhou_stepfun.py       14.0 KB
```

README 对此的解释是：

> 原先独立的抖音和小红书抓取器现在**只保留一个事实源**。

**这是个很成熟的维护决策。** 同一个抓取逻辑如果存在两份，早晚会出现"改了一份忘了一份"。把它合并掉，虽然是"减少功能面"，但换来了唯一事实源。

同样的思路还出现在 `yichen-asr` 上——它是 `volc-asr` 和 Step 之上的**路由层**，而且带一条约束：

> 已提交到某服务商的任务**不会静默改投另一家**。

**路由层最容易犯的错误就是"失败了偷偷换一个"**，因为那样看起来更"健壮"。但在这里不行：两家 ASR 的计费和结果可能不同，静默切换会让用户对不上账。**"不静默改投"是一条关于账目清晰性的规则，不是一条关于技术健壮性的规则。**

## 一件我该说清楚的事：它对你不一定合适

这一节我犹豫了一下要不要写，因为它不是技术内容。但既然这个仓库跟你的日常（微信、小红书、抖音、公众号、剪映）重叠度是六个里最高的，我得把这件事说清楚。

**它的许可证明确禁止商业用途**，而"商业用途"的定义在这个仓库里写得很宽：

> 凡涉及**客户交付、付费产品或服务、公司内部部署、市场打包、课程打包**及其他商业用途，均须事先取得作者明确的书面授权。

**所以如果你想把其中某个技能用进门店的内容运营、或者给客户做东西——那属于需要授权的范围。** 免费的是"个人学习和非商业个人工作流"。

我不是在替它的许可证说话，也不是在吓你。**是这个仓库的技能太贴近你的活儿了，而"贴近"恰恰意味着"容易在商业场景里用上"。** 真要用的话，路径很清楚：它的商用口子就是付费社群 TradeWinds，微信 `yichen365ai`（作者说验证信息里要备注"商业授权"）。

**另外它的技能本身也有一层现实约束**，值得知道：

- `jianying-edit`（剪映无头生成）**不包含核心项目**——它只是公开的 Skill 入口，需要另外拿到 [mcncarl/jianying-headless](https://github.com/mcncarl/jianying-headless) 的访问权限，而且要求**匹配版本的剪映**和固定的源码/运行库哈希
- `wechat-local-vault` 是 **macOS 专属**，依赖 frida 引导密钥提取，微信更新后可能失效
- `wechat-windows-reader` 自己标着**实验性**——"尚未证明全面兼容真实微信 4.x 数据库"
- `mac-wechat-dual-open` 是**微信更新后需要重新运行 `repair`**，且推送通知可能不稳定
- `wecom-operations` 的本地图片上传需要**你另行提供一个 helper**，仓库不分发

**这不是"装上就一劳永逸"的东西。它是一套需要维护的工具，作者也老实标了每一处会坏在哪。**

## 六个仓库：它们其实在回答同一个问题的不同版本

拆到这里，我发现这六个仓库构成了一条挺清楚的谱系。**不是能力高低的谱系，是"它假设使用者是谁"的谱系：**

| 仓库 | 它假设使用者 | 交付的是 | 许可 |
| --- | --- | --- | --- |
| [夏林果封面](/blog/2026-09-15-xialingguo-ip-cover-skill/) | 不会描述需求的人 | 一份不把人问烦的表单 | 未标注 |
| [diagram-design](/blog/2026-09-15-diagram-design-skill-engineering/) | 需要出图的人 | 一套带几何验证的设计系统 | MIT |
| [hypit](/blog/2026-09-15-hypit-video-compiler-agent-skill/) | 要批量做视频的人 | 一门语言 + 编译器 + 运行时 | Apache + 条件 |
| [agent-skills](/blog/2026-09-16-agent-skills-catalog-evals/) | 要用 agent 做完整项目的人 | 25 条流程 + 三层评测 | MIT |
| [Strix](/blog/2026-09-16-strix-pentest-closure-discipline/) | 要给自己的系统做安全评估的人 | 结案纪律 + 工具链 | Apache |
| **yichen-skills** | **有自己一套活儿要干的人** | **一套需要你先改一遍的工具箱** | **源可用 + 商用授权** |

前五个是**产品**：装上、触发、得到结果，你和作者的关系是"用户 vs 作者"。

**第六个是工具箱。** 它的正确用法不是"用"，是**"搬进自己家、改成自己的尺寸、然后当成自己的东西"**——这也正是 41.5% 那个数字在说的事。

我觉得它给整个"技能仓库"这个形态补上了一块前五个都没覆盖的东西：**有些知识长在具体的人身上，长在他的路径、他的账号、他的工作习惯里。** 这类东西没法做成一个通用的产品，只能公开成"源头"，让每个人 fork 出去改。

**而只要公开，就必须面对它带来的问题——所以它才有了那道隐私扫描的门禁，和那一整套授权闸门。**

## 怎么装

**用官方 CLI 装单个技能**（比如 X 切片）：

```bash
npx skills add mcncarl/yichen-skills --skill yichen-x-slicer
```

**或者直接复制目录**到你的技能路径：

```bash
# Claude Code 常见路径
~/.claude/skills/
# Agents 常见路径
~/.agents/skills/
```

作者建议**保持目录名不变**（`yichen-x-article-draft-uploader` 之类），因为技能之间会互相引用。

**有一个例外**：`yichen-grok-consult` 是 Codex 插件，**光复制目录不能用**，必须走 marketplace：

```bash
codex plugin marketplace add mcncarl/yichen-skills --ref main
codex plugin add yichen-grok-consult@yichen-skills
```

**环境依赖按需装**（都是小件）：Python 3.9+、Playwright（X 草稿/抖音）、`pycryptodome` + `zstandard`（微信解析）、`Pillow`（双开图标）、`ffmpeg`/`ffprobe`（ASR 粗剪、切片），以及 Node 18+（Grok 咨询、X 切片）。

**Web Research 家族必须五个目录一起装**——`validate_family.py` 会检查这一点。

仓库地址：[github.com/mcncarl/yichen-skills](https://github.com/mcncarl/yichen-skills) · 中文说明 [README.zh.md](https://github.com/mcncarl/yichen-skills/blob/main/README.zh.md)

---

最后说一个我在拆的过程中冒出来的念头。

前两天拆那五个仓库时，我的感受一直是"**这些东西做得真讲究**"——讲究的评测、讲究的验证、讲究的边界。

拆完这一个，我的感受变成了另一种：**讲究是可以在很私人的尺度上长出来的。**

19 个技能、111 KB 的契约测试、CI 里那段隐私扫描、几十处"当前任务明确授权"——这些不是一家公司在做产品，**是一个人把自己的工作流整理了一遍，顺手把该防的地方都防上了。**

它公开的与其说是一堆工具，不如说**是"一个人怎么干这种活"的完整记录**。而这恰好是它能被 fork 一千多次的原因：你想学的往往不是"那个工具"，是**"那个人是怎么做的"**。

如果里面有哪个技能对你手上的活儿正好有用——微信解析、剪映、ASR、还是公众号批量导出——跟我说一声，我可以先帮你把它的实现和边界完整过一遍，再决定要不要接进来。
