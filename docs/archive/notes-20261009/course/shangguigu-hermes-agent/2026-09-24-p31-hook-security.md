---
title: "P31 31_进化篇_钩子系统的安全保护功能"
date: "2026-09-24"
summary: >-
  P31 · 31_进化篇_钩子系统的安全保护功能（2:40）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P31"
series: "shangguigu-hermes"
seriesOrder: 31
---

## 课时概要

进化篇 · 钩子系统的安全保护功能。钩子能拦截/改写行为，因此 Hermes 有对应的安全防护设计（本分P 时长仅 2:40，是最短的分P）。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档 Hooks 页（含 Gateway Event Hooks / Plugin Hooks / Shell Hooks / Outbound Webhooks 四节）与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[31_进化篇_钩子系统的安全保护功能](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=31) ｜ 时长 2:40 ｜ P31

## 本节要点

- **信任模型一（gateway hooks）：放文件即同意（trusted-by-placement）**。`hooks/` 目录是**按位置信任**的扩展点 —— **没有 enable 列表**，`plugins.enabled` / `plugins.disabled` **不适用于它**（gateway hooks 不是 plugins）。
-   · **何时加载**：gateway 启动时**一次**；多 profile 网关下每个被服务 profile 自己的 `hooks/` 在该 profile 内首次触发事件时加载。⚠️ **CLI / TUI / Desktop / cron 永不加载**。
  · **加载什么**：`<profile home>/hooks/` 下**同时**含「能解析出非空 `events` 的 `HOOK.yaml`」**和**「`handler.py`」的子目录。缺任一 → **静默跳过**；manifest 无效或 `events` 为空 → 记一条 `[hooks] Skipping …`。
  · **怎么执行**：`handler.py` **在进程内 import** —— 模块体在 import 时就运行，`handle` 被注册；**它以 gateway 进程的身份运行，拥有 gateway 的同等权限**（已加载的凭证、工具、插件状态）。
  · ⚠️ **没有沙箱、没有首次使用提示，`HERMES_SAFE_MODE` 也不会跳过这个加载器。**
  · 官方的推理：**能往你 profile home 里写文件的人，本来就能通过 `config.yaml` 的 shell hooks 或 `plugins.enabled` 以你的身份跑代码**，所以这个目录与 `~/.hermes/` 其余部分处在**同一个信任边界**内。结论：**放进去之前，请像审一个插件那样审 `handler.py`。**
- **信任模型二（shell hooks）：首次使用逐对提示 + 持久化 allowlist**。每个唯一的 **`(event, command)` 对**首次被遇到时提示你批准，决定持久化到 **`~/.hermes/shell-hooks-allowlist.json`**；之后的运行（CLI 或 gateway）跳过提示。
- **三个逃生舱**（任一即可绕过交互提示）：`--accept-hooks` 标志（如 `hermes --accept-hooks chat`）｜ `HERMES_ACCEPT_HOOKS=1` 环境变量 ｜ `hooks_auto_accept: true`。⚠️ **非 TTY 运行（gateway / cron / CI）必须用三者之一** —— 否则**任何新加的钩子会静默保持未注册**，只留下一条警告。
- ⚠️ **脚本编辑是被静默信任的**：allowlist 以**精确的命令字符串**为键，**不是脚本的哈希** → 改磁盘上的脚本**不会**使同意失效。因此 `hermes hooks doctor` 会标出 **mtime 漂移**，让你发现脚本被改过并决定是否重新批准。（换句话说：**改一个已被批准的 hook 脚本 = 一次静默提权**。）
- **手动 allowlist**（适合非 TTY / 服务账号部署，运维没法交互回答首次提示）：文件是 `~/.hermes/shell-hooks-allowlist.json`，期望格式是一个 `approvals` 数组，每条记录 `event` 与**完全一致**的 `command` 字符串。⚠️ 官方点名一个坑：**「以路径为键、带 `sha256` 字段」的对象不是期望格式，不会批准该钩子**。手动写完用 `hermes hooks list` 核验。
- **fail-open vs fail-closed（P31 最该记的一条）**：默认 shell hooks **fail open** —— **spawn 失败、超时、stdout 不可解析** 三种情况都**只记警告、动作照常进行**。官方说这对**可观测性**钩子是正确默认，但对**安全闸门**是错的：**「一个崩掉的密钥扫描器绝不能静默放行它本该审查的那次工具调用」**。
-   · 在 `pre_tool_call` 条目上加 **`fail_closed: true`**（也接受 Cursor / Claude Code 的拼法 `failClosed`）即可反转：**命令不存在/不可执行、超时、非 JSON 输出（比如一段 stack trace）三种失败都变成阻断**，报 `hook <command> failed closed: <reason>`；而「干净退出 + 合法 no-op JSON（`{}`）」仍然放行。
  · `fail_closed` **只对有阻断能力的事件生效**（当前就是 `pre_tool_call`）；设在别的事件上 → **配置解析期**警告并忽略。
  · `hermes hooks test` 会如实反映这些语义 —— 它的 `parsed` 行显示 dispatcher 实际会收到的 block 形状。
- **顺序与优先级**：Python 插件钩子与 shell hooks 走**同一个 `invoke_hook()` dispatcher**；**Python 先注册**（`discover_and_load()`）、**shell 后注册**（`register_from_config()`）→ **平局时 Python 的 `pre_tool_call` 决定优先**。**第一个有效的 block 胜出**（聚合器一旦收到带非空 message 的 `{"action":"block","message": str}` 就立即返回），并且**列表里任何位置出现的 block 都压过更早返回的 `approve`**。
- **插件钩子的超时语义也分方向**：在超时受限的热路径钩子（`post_tool_call` / `pre_llm_call`，以及策略钩子 `pre_tool_call`）里，Python 回调阻塞超过 `plugins.hook_callback_timeout`（默认 **30s**，设 0 关闭，上限 600）会被**放弃且不 join worker**，好让 agent 循环继续。⚠️ **超时或仍在运行的 `pre_tool_call` 回调 fail closed（阻断工具）；其他受限钩子 fail open（跳过）。**有文档化调用线程契约的钩子（`subagent_stop`）永不被搬到超时 worker 上。
- **官方的 shell hooks 安全指引（五条）**：① shell hooks **以你的完整用户凭证运行** —— 与一条 cron 条目或 shell alias **同等的信任边界** ② 把 `config.yaml` 里的 `hooks:` 块**当作特权配置** ③ **只引用你自己写的、或完整审过的脚本** ④ 把脚本放在 `~/.hermes/agent-hooks/` 内，**让路径便于审计** ⑤ 拉取共享配置后**重跑 `hermes hooks doctor`**，在它们注册之前发现新加的钩子。**若 config.yaml 受团队版本控制，改 `hooks:` 段的 PR 要按审 CI 配置的标准来审。**

## 关键概念

- **trusted-by-placement（按位置信任）**：把文件放进指定目录就等于启用的模式 —— 无 enable 列表、无提示、无沙箱。
- **同意模型 / `shell-hooks-allowlist.json`**：shell hooks 的「首次逐对提示 + 持久化批准」机制。
- **三个逃生舱**：`--accept-hooks` / `HERMES_ACCEPT_HOOKS=1` / `hooks_auto_accept: true`。
- **mtime 漂移**：脚本被改过但 allowlist 仍以命令串为键有效 —— `doctor` 会标出来给你人工复核。
- **fail-open / fail-closed**：钩子自身故障时默认放行；`fail_closed: true` 让 `pre_tool_call` 的故障变成阻断。
- **exit code 2 = block**：Claude Code / Cursor 兼容的最简阻断协议。
- **同一 dispatcher / Python 优先 / 首个 block 胜出**：多钩子同时存在时的裁决规则。
- **hook_callback_timeout**：插件热路径回调的 30 秒上限，超时后 `pre_tool_call` 阻断、其他跳过。

## 代码 / 实操

**把安全闸门设成 fail-closed**（官方原文示例）：
```yaml
hooks:
  pre_tool_call:
    - matcher: "terminal|write_file|patch"
      command: "~/.hermes/agent-hooks/secret-scan.sh"
      timeout: 10
      fail_closed: true      # failClosed 也接受（Cursor / Claude Code 拼法）
```

失败时的行为对照（官方表）：
| 失败类型 | fail-open（默认）| `fail_closed: true` |
|---|---|---|
| 命令不存在 / 不可执行 | 警告后放行 | **阻断** |
| 超时 | 警告后放行 | **阻断** |
| 非 JSON stdout（如 stack trace）| 警告后放行 | **阻断** |
| 干净退出 + 合法 no-op JSON `{}` | 放行 | 放行 |

**最简阻断钩子（退出码 2 即可，无需 JSON）**：
```bash
#!/usr/bin/env bash
echo "policy violation: rm -rf is not permitted" >&2
exit 2
```

**手动 allowlist 格式**（非 TTY / 服务账号场景）：
```json
{
  "approvals": [
    { "event": "post_llm_call", "command": "/home/hermes/.hermes/hooks/my-hook.py" }
  ]
}
```

```bash
hermes hooks list                    # 核验手动条目 / 看同意状态
hermes hooks doctor                  # 查可执行位 / allowlist / mtime 漂移 / JSON 合法性
hermes hooks revoke <command>        # 撤销批准（下次重启生效）
hermes --accept-hooks chat           # 逃生舱之一
```

**本机实测**（2026-09-25，三个安全面全空）：
```
hermes hooks list    → No shell hooks or outbound webhooks configured
hermes hooks doctor  → No shell hooks configured — nothing to check
~/.hermes/agent-hooks/            → 不存在
~/.hermes/shell-hooks-allowlist.json → 不存在（从未批准过任何 shell hook）
~/.hermes/hooks/                  → 空目录（这是「按位置信任、无沙箱无提示」的那个位置）
config.yaml                       → 无 hooks: 段、无 hooks_auto_accept
```

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25）：

- 本机在三个安全面上**全是空的**：`hooks list` 无条目 ｜ 无 `agent-hooks/` 目录 ｜ **无 `shell-hooks-allowlist.json`**（意味着从来没有 shell hook 被批准过）→ 严格说，hook 这一层的**攻击面目前是零**。
- `~/.hermes/hooks/` 这个**唯一「放进去就会以 gateway 进程身份、在进程内、不经任何审批地执行」的位置**，本机实测是**空目录** —— 这是我最该定期盯一眼的目录（官方明说它没有沙箱、没有首次提示、连 `HERMES_SAFE_MODE` 都不拦）。
- 官方点名的那个静默失败（非 TTY 场景新钩子会**未注册**而不是报错）在本机是**真实风险**：我的 `hooks_auto_accept` 没设、默认 false，而 gateway / cron 都是非 TTY —— 以后要加 hook，必须显式带 `--accept-hooks` 或设环境变量，否则会「配了但没生效」。
- 💡 对我自己运维的直接价值：我现在用的 `approvals.deny`（拦 `rm*` / `rmdir` / `unlink` 那类）是「**拦已知危险**」，而 `fail_closed: true` 的 `pre_tool_call` 钩子是「**闸门自己坏了也不放行**」—— 两种性质不同，正好可以搭配成两层。
- ⚠️ 一条要刻进肌肉记忆的：**allowlist 键的是命令字符串、不是脚本哈希** → 我以后改一个已批准的 hook 脚本**不需要**重新批准，**而这正是它的危险之处**（改脚本＝静默提权）。所以 `hermes hooks doctor` 的 mtime 漂移检查不能只当装饰，得真看。
- 🔍 顺带对照：Hermes 自己的安全检查是有分层的 —— `hermes doctor` 里我看到过 **MCP Server Security ✓**（无可疑 MCP stdio 命令），而 hooks 这一层它单独设了 allowlist + doctor 两个机制。也就是说「扩展点各有各的门禁」，不是一个大开关。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
