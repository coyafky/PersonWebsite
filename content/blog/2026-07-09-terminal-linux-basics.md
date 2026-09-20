---
title: "终端和 Linux 直觉：AI 工具最常用的 20 个指令"
date: "2026-07-09"
summary: "那个黑窗口到底是什么？为什么 AI 工具（Claude Code / Codex / Hermes）几乎都靠终端指挥电脑？这一篇把终端、Shell、家目录、20 个最常用指令、VSCode 集成终端、以及 Claude Code 实战里最高频的命令行用法一次性讲清楚。读完之后你能看懂 AI Agent 在跑什么，也能自己跑最基础的几条命令。"
tags:
  - "zero-to-tech"
  - "AI Agent"
status: published
lang: zh
category: "技术/计算机基础"
englishSummary: "What is that black window really? Why do AI tools like Claude Code / Codex / Hermes mostly drive the computer through the terminal? This piece explains the terminal, Shell, home directory, 20 most-used commands, VSCode integrated terminal, and Claude Code's most common command-line usage in one go. After reading, you'll understand what AI Agents are actually running, and you can run the basic commands yourself."
---

# 终端和 Linux 直觉：AI 工具最常用的 20 个指令

> 这是 **zero-to-tech** 系列的第三篇。前两篇分别讲了「网络是怎么工作的」和「认识你的电脑（文件、路径、VSCode）」。这一篇我们把视线移到那个黑窗口——**终端**——以及为什么现在的 AI 工具几乎都靠它在干活。

如果你用过 Claude Code、Codex、Cursor Agent、Hermes 这类 AI Agent，你大概率见过类似这样的输出：

```
● Reading file: lib/content/reader.ts
● Running command: npm test
● Edited file: app/(site)/blog/[slug]/page.tsx
```

这些「读文件」「跑命令」「改文件」背后，AI 其实就是在终端里跑命令——和你手动敲 `ls`、`cd`、`npm test` 是**同一套机制**。

这一篇的目标：让你**看懂 AI Agent 在跑什么**，并且**自己能跑最基础的 20 条命令**。

---

## 一句话总结

> **终端 = 一个让你用文本命令操作电脑的工具**。Shell 是解析命令的程序（macOS 默认 zsh，Linux 默认 bash）。家目录是 `~`。AI Agent 之所以「会干活」，本质上是因为它能在终端里跑命令、读结果、然后决定下一步。

---

## 一、终端、Shell、Console、命令行是什么关系

这几个词经常混用，但严格说有一点区别：

| 词 | 含义 |
|----|------|
| **终端 (Terminal)** | 一个**应用程序**，提供那个黑窗口界面。负责显示输入框、显示输出、捕获按键 |
| **Shell** | 终端里**真正解释你输入的命令**的程序。macOS 默认 `zsh`，Linux 默认 `bash`，Windows 默认 PowerShell |
| **Console** | 历史上指物理控制台（直接连主机的键盘+显示器），现在常和 Terminal 混用 |
| **命令行 (Command Line / CLI)** | 一种「用文本命令代替图形界面」的操作风格的总称 |

**最朴素的理解**：

```
你（敲键盘）
   ↓ 输入 "ls"
终端应用（捕获按键 + 显示文字）
   ↓ 把 "ls" 传给 Shell
Shell（解析 "ls"，找到 /bin/ls 程序，跑起来）
   ↓ 把 /bin/ls 的输出传回去
终端应用（显示在你的屏幕上）
```

**日常对话中**：说「在终端里跑命令」「打开命令行」「用 Shell」基本都是同一件事——打开那个黑窗口，敲命令，让电脑执行。

---

## 二、目录概念：树 + 家目录 + 当前位置

上一篇已经讲过文件系统是一棵树。这里补几个**终端里的目录概念**，是后面所有命令的地基。

### 2.1 三个特殊目录符号

| 符号 | 含义 | 例（假设你在 `/Users/coya/projects/website`） |
|------|------|----------------------------------------------|
| `.` | 当前目录 | `./src/app.ts` → `/Users/coya/projects/website/src/app.ts` |
| `..` | 上级目录 | `../shared/utils.ts` → `/Users/coya/projects/shared/utils.ts` |
| `~` | 家目录（home） | `~/Documents/notes.md` → `/Users/coya/Documents/notes.md` |

**`~` 是终端给你省事的**：你不用打 `/Users/coya/...` 这么长，打 `~` 就代表你的家目录。

### 2.2 家目录是什么

每个用户都有一个**默认目录**，登录后「默认就在这里」：

| 系统 | 家目录路径 |
|------|-----------|
| macOS | `/Users/<用户名>` |
| Linux | `/home/<用户名>` |
| Windows (WSL) | `/home/<用户名>` |

**为什么要有家目录**：
- 配置文件、下载、文档、个人代码默认都放这下面（`~/.zshrc`、`~/Documents`、`~/.npm`）
- 多个用户之间互相隔离
- `~` 在任何子目录里都「立刻回到家」，不用记一长串路径

### 2.3 当前位置（pwd）

Shell 始终有一个「我现在在哪个目录」的状态。`pwd` 命令（Print Working Directory）会显示这个位置：

```bash
$ pwd
/Users/coya/projects/website
```

**重要**：所有相对路径（`./`、`../`）都是基于这个「当前位置」。**改了当前位置，相对路径的解析就变了**。

---

## 三、基础终端命令 20 个

下面这 20 个命令覆盖 90% 的日常场景。按用途分组。

### 3.1 导航类（在哪儿 / 去哪儿）

| 命令 | 作用 | 例 |
|------|------|----|
| `pwd` | 显示当前目录 | `pwd` → `/Users/coya/projects/website` |
| `ls` | 列出当前目录内容 | `ls` → `README.md src public` |
| `ls -la` | 列出全部内容（含隐藏文件 + 详细信息） | `ls -la` |
| `cd <dir>` | 切换目录 | `cd src` → 进入 src |
| `cd ..` | 回到上级目录 | |
| `cd ~` | 直接回到家目录 | |
| `cd -` | 回到上一次所在的目录（在两个目录间反复跳很方便） | |

**`ls -la` 的输出长这样**：

```
drwxr-xr-x  12 coya  staff   384  7月  9 10:23 .
drwxr-xr-x   5 coya  staff   160  7月  9 09:01 ..
-rw-r--r--   1 coya  staff  1234  7月  9 10:23 README.md
drwxr-xr-x   8 coya  staff   256  7月  9 10:20 src
```

- `d` 开头 = 目录（directory），`-` 开头 = 普通文件
- `rwx` = 读 / 写 / 执行权限
- 后面是大小、修改时间、名字

### 3.2 查看文件类

| 命令 | 作用 | 例 |
|------|------|----|
| `cat <file>` | 整个文件打印到终端（适合小文件） | `cat README.md` |
| `head -n 20 <file>` | 看前 20 行 | `head -n 20 app.ts` |
| `tail -n 20 <file>` | 看后 20 行 | `tail -n 20 app.ts` |
| `tail -f <file>` | 实时跟踪文件末尾（日志神器） | `tail -f /var/log/system.log` |
| `less <file>` | 分页浏览（大文件友好，按 q 退出） | `less huge.log` |

### 3.3 搜索类

| 命令 | 作用 | 例 |
|------|------|----|
| `grep "pattern" <file>` | 在文件里找匹配行 | `grep "TODO" src/app.ts` |
| `grep -rn "pattern" <dir>` | 在目录下递归找匹配行（含行号） | `grep -rn "TODO" src/` |
| `rg "pattern"` | ripgrep，比 grep 快很多（AI 工具最爱用） | `rg "useState" app/` |
| `find <dir> -name "*.ts"` | 按文件名查找 | `find src -name "*.ts"` |

**`rg` (ripgrep) 是现代搜索的事实标准**。如果你的电脑装了 Rust 工具链，`cargo install ripgrep` 就能装上。Claude Code、Cursor、VSCode 内部搜索都用它。

### 3.4 文件操作类

| 命令 | 作用 | 例 |
|------|------|----|
| `mkdir <dir>` | 创建目录 | `mkdir src/components` |
| `mkdir -p a/b/c` | 递归创建（a 不存在也会自动建） | |
| `cp <src> <dst>` | 复制文件 | `cp README.md README.bak` |
| `mv <src> <dst>` | 移动 / 重命名 | `mv old.ts new.ts` |
| `rm <file>` | 删除文件（**不可恢复**） | `rm old.ts` |
| `rm -rf <dir>` | 强制删除目录（**最危险命令之一**） | `rm -rf node_modules` |
| `touch <file>` | 创建空文件 / 更新修改时间 | `touch new.md` |

**红线**：`rm -rf` 没有回收站，删了就是删了。永远先 `ls` 确认要删的是不是真的那个。

### 3.5 系统 / 进程类

| 命令 | 作用 | 例 |
|------|------|----|
| `ps` | 显示当前用户的进程 | `ps` |
| `ps aux` | 显示所有进程（很常用） | `ps aux \| grep node` |
| `top` / `htop` | 实时显示系统资源占用（按 q 退出） | `top` |
| `kill <pid>` | 杀进程（按 PID） | `kill 12345` |
| `kill -9 <pid>` | 强制杀进程 | `kill -9 12345` |
| `which <cmd>` | 显示命令的可执行文件路径 | `which node` → `/usr/local/bin/node` |
| `env` | 显示所有环境变量 | `env \| grep PATH` |

### 3.6 组合类（多个命令串起来）

| 符号 | 作用 | 例 |
|------|------|----|
| `\|` | 管道：把前一个命令的输出传给后一个 | `ps aux \| grep node` |
| `>` | 重定向：把输出写入文件（覆盖） | `ls > files.txt` |
| `>>` | 追加重定向（不覆盖） | `echo "done" >> log.txt` |
| `&&` | 前一个成功才跑后一个 | `npm install && npm test` |
| `\|\|` | 前一个失败才跑后一个 | `npm test \|\| echo "test failed"` |
| `*` | 通配符，匹配任意字符 | `rm *.tmp` |
| `~` | 家目录 | `cd ~` |
| `Ctrl + C` | 终止当前正在跑的命令 | （不是命令，是快捷键，但救过所有人的命） |

**最常用的组合范式**：

```bash
# 找一个文件里有没有某个关键字
grep -rn "TODO" src/

# 在所有 .ts 文件里找
rg "useState" --type ts

# 跑测试，失败才显示
npm test || echo "测试失败"

# 先装依赖再跑测试（前者失败就不跑后者）
npm install && npm test
```

---

## 四、VSCode + 终端：把两个工具合二为一

VSCode 的杀手锏之一就是**集成终端**——不用切窗口，编辑器里直接跑命令。

### 4.1 打开方式

| 快捷键 | 作用 |
|--------|------|
| `Ctrl + `` (macOS 是 `Cmd + ``) | 打开 / 关闭集成终端 |
| `Ctrl + Shift + `` | 新建一个终端实例 |
| 菜单 → Terminal → New Terminal | 鼠标党 |

打开后，VSCode 下方 / 右侧会出现一个真正的 Shell 窗口（zsh / bash / PowerShell），和系统独立终端**完全等价**。

### 4.2 最佳实践

1. **打开项目根目录**：VSCode 的「打开文件夹」心智模型（上一篇讲过）和终端的「当前位置」**完全对齐**——打开文件夹后，集成终端默认就在项目根。
2. **拆分终端**：VSCode 可以同时开多个终端，并排或上下排。跑 dev server 一个、跑 test 一个、跑 git 一个，互不干扰。
3. **选中即复制 + 右键粘贴**：VSCode 集成终端默认就是这种行为，鼠标党也能用。
4. **任务系统**：VSCode 可以把常用命令（`npm run dev` / `npm test`）配置成「任务」，菜单 / 快捷键一键跑，不用每次手敲。

---

## 五、Claude Code 的「终端哲学」：它本质上就是终端里的一个 Agent

理解了前面所有概念，Claude Code 是什么就清楚了：

```
Claude Code = 一个能跑 Shell 命令的 AI Agent
           + 能读 / 写文件的工具
           + 一个持续的「读 → 思考 → 跑命令 → 看结果 → 再思考」循环
```

### 5.1 Claude Code 在背后跑什么

你在 Claude Code 里说「帮我看看这个项目用了哪些依赖」，它大概会做这些事：

```bash
1. pwd                           # 确认在哪个目录
2. ls                            # 看项目结构
3. cat package.json              # 读依赖清单
4. rg "import.*from" src/ | head # 看代码里实际 import 了什么
5. ls node_modules | head -n 30  # 看装了什么包
```

每一步都是一个真实的 Shell 命令。Claude Code 跑完这些，把输出读回来，让模型「看见」结果，再决定下一步。

### 5.2 为什么 AI Agent 都靠终端

- **统一接口**：所有开发工具（git、npm、python、docker、curl）都暴露命令行
- **可组合**：管道 + 重定向 + 脚本，能拼出几乎任何操作
- **可观察**：每个命令的输入输出都是文本，AI 容易「读」和「理解」
- **可回放**：命令序列本身就是「操作日志」，人能审计 AI 干了什么

**这就是为什么 2024 年之后所有 AI 编程工具（Claude Code / Codex / Cursor Agent / Aider / Hermes）都在终端里干活**——终端是「让 AI 操作电脑」最自然、最强大的接口。

---

## 六、Claude Code 实战最常用的 15 个命令详解

下面这 15 个命令，是 AI Agent 在你的项目里**最高频**跑的命令。理解了它们，你就看懂了 AI 90% 的行为。

### 6.1 `ls` / `ls -la`：搞清楚在哪儿、有啥

```bash
ls                # 看文件名
ls -la            # 看详细信息 + 隐藏文件
ls src/           # 看子目录
```

**AI 怎么用**：进入任何新目录、第一次读项目，必跑。

### 6.2 `pwd`：确认当前位置

```bash
pwd
```

**AI 怎么用**：避免「我以为我在 X 目录，其实我在 Y 目录」的尴尬。每次改完目录后必跑。

### 6.3 `cat <file>`：读小文件

```bash
cat README.md
cat package.json
```

**AI 怎么用**：读配置文件、小段代码。

### 6.4 `head -n 50` / `tail -n 50`：读大文件的开头/结尾

```bash
head -n 50 lib/content/reader.ts
tail -n 20 app.log
```

**AI 怎么用**：大文件不全读，先看头尾判断结构。

### 6.5 `grep -rn "pattern" <dir>`：在目录里找文本

```bash
grep -rn "TODO" src/
grep -rn "import.*react" app/ | head -n 20
```

**AI 怎么用**：理解代码结构、找定义、找引用、找遗留问题。

### 6.6 `rg "pattern"`：比 grep 更快的搜索

```bash
rg "useState" --type tsx
rg "TODO" -n
rg "console.log" src/ | wc -l   # 数一数有多少个
```

**AI 怎么用**：日常搜索的首选。`--type` 按语言过滤，`-n` 显示行号。

### 6.7 `find <dir> -name "*.ext"`：按文件名找

```bash
find src -name "*.test.ts"
find . -name "*.md" -not -path "./node_modules/*"
```

**AI 怎么用**：找特定类型的文件（比如所有测试文件）。

### 6.8 `git status` / `git diff` / `git log`：理解代码变更

```bash
git status                 # 哪些文件改了
git diff                   # 改了什么
git diff --staged          # 暂存区里改了什么
git log --oneline -n 20    # 最近 20 条提交
```

**AI 怎么用**：改代码前看现状、改完代码后给用户总结。这是 Claude Code 最频繁的「自我审视」动作。

### 6.9 `npm test` / `npm run build` / `npm run lint`：跑项目的质量门

```bash
npm test           # 跑测试
npm run build      # 构建（确认能编译过）
npm run lint       # 代码风格检查
```

**AI 怎么用**：改完代码后**必跑**——不跑测试 / 构建的 AI Agent 是不负责任的。你看到 Agent 跑 `npm run build`，就是它在「自证」没改坏东西。

### 6.10 `node <script>` / `npx <cmd>`：跑临时代码

```bash
node script.js              # 跑 JS 脚本
npx tsc --noEmit            # 跑 TypeScript 编译器，不输出文件
npx eslint src/             # 跑 ESLint
npx prettier --check .      # 跑 Prettier
```

**AI 怎么用**：本地验证类型、跑一次性脚本。

### 6.11 `curl <url>`：从终端发 HTTP 请求

```bash
curl https://api.example.com/users
curl -X POST -H "Content-Type: application/json" -d '{"name":"x"}' https://api.example.com/users
curl -I https://example.com   # 只看响应头
```

**AI 怎么用**：调试 API、自己测一下接口、下载文件、抓网页。

### 6.12 `mkdir` / `mv` / `cp` / `rm`：文件和目录操作

```bash
mkdir -p src/components      # 递归创建目录
mv old.ts new.ts             # 改文件名
cp src.ts src.ts.bak         # 备份
rm tmp.txt                   # 删文件
rm -rf node_modules          # 删目录（经典：清空依赖重装）
```

**AI 怎么用**：建文件、改文件名、清缓存。**`rm -rf` 永远慎用**——AI 也会犯糊涂，建议重要的目录手动加确认。

### 6.13 `env` / `echo $VAR`：看环境变量

```bash
env                       # 列出所有
echo $PATH                # 看 PATH
echo $NODE_ENV            # 看某个变量
```

**AI 怎么用**：调试「为什么命令找不到」「为什么用了错的配置」——99% 是环境变量问题。

### 6.14 `which <cmd>`：确认命令装在哪儿

```bash
which node
which python3
which git
```

**AI 怎么用**：避免「我以为装了其实没装」「装了但不是这个版本」。

### 6.15 `tail -f <log>`：实时跟踪日志

```bash
tail -f /var/log/system.log
tail -f npm-debug.log
```

**AI 怎么用**：调试运行时错误、监控 dev server 输出。

---

## 七、Shell 组合的 5 个核心符号

这 5 个符号能让 20 个命令变成 200 个能力。

### 7.1 管道 `|`：把输出当输入

```bash
ps aux | grep node           # 找所有 node 进程
ls -la | head -n 10          # 只看前 10 行
cat file.txt | wc -l         # 数行数
```

**本质**：左边的 stdout 变成右边的 stdin。

### 7.2 重定向 `>` / `>>`：把输出写文件

```bash
ls > files.txt               # 覆盖写入
echo "done" >> log.txt       # 追加
```

**本质**：把 stdout 改成「写文件」。

### 7.3 条件执行 `&&` / `||`

```bash
npm install && npm test                  # 前者成功才跑后者
git add . && git commit -m "fix bug"     # 经典两步走
npm test || echo "测试挂了"               # 失败才提示
```

**本质**：布尔控制流，决定后续命不跑。

### 7.4 通配符 `*` / `?` / `[abc]`

```bash
ls *.md                     # 所有 Markdown
rm test-?.log               # test-1.log, test-2.log ...
ls [abc]*.txt               # 以 a/b/c 开头的 .txt
```

**本质**：文件名匹配，避免手写一长串。

### 7.5 后台运行 `&` 和 `nohup`

```bash
npm run dev &                # 后台跑 dev server（不阻塞当前终端）
nohup python server.py &    # 退出终端也不停
```

**本质**：不阻塞当前 shell，让长任务在后台跑。

---

## 八、给新手的 3 个心智模型

1. **终端是 AI Agent 的「手和脚」**：Claude Code / Cursor Agent / Codex 之所以能「干活」，本质就是它们能在终端里跑命令 + 读结果。把终端想成 AI 的「身体」，文件 / 网络 / 进程是它的「环境」，就理解了为什么所有 AI 工具都在押注终端。

2. **当前位置（pwd）是一切的隐含上下文**：所有相对路径、所有「当前目录里的文件」都基于这个状态。改 `cd` 之前先 `pwd`，进陌生目录先 `ls`，永远知道自己「在哪儿」。

3. **命令 + 组合 = 图灵完备**：单个命令能力有限，但管道 / 重定向 / 条件执行 / 通配符让组合几乎可以表达任何操作。这和编程里的「函数 + 组合」是一个道理——**简单原语 + 组合能力 > 复杂原语**。

---

## 九、一句话总结

> **终端 = 文本命令操作电脑的界面**，Shell 解释命令（macOS zsh，Linux bash），家目录 `~` 是你的默认地盘。20 个核心命令（`ls` / `cd` / `cat` / `grep` / `rg` / `find` / `mv` / `rm` / `git` / `npm` ...）覆盖 90% 场景，5 个组合符号（`|` `>` `&&` `||` `*`）让它们变成无穷能力。Claude Code / Codex / Cursor Agent 本质上就是「能跑终端命令的 AI」，所以你理解了终端，就理解了 AI 工具在干什么。

---

## 这个系列下一篇会写什么

- **zero-to-tech / Git 是什么：版本控制的最小心智模型**
- **zero-to-tech / 进程、线程、内存：你的电脑同时在跑多少事**
- **zero-to-tech / VSCode 进阶：调试器、断点、launch.json**

上一篇：[认识你的电脑：文件、路径、和那个叫 VSCode 的编辑器](/blog/know-your-computer)
第一篇：[网络是怎么工作的](/blog/how-network-work)