---
title: "5.2 Python安装和环境设置"
date: "2026-09-20"
summary: >-
  Python 安装与环境设置，围绕 venv 讲清一台机器上有多个 Python 环境时该怎么处理。
status: published
tags:
  - "Python"
  - "后端"
lang: zh
chapter: "5.2"
series: "zero-to-fullstack"
seriesOrder: 20
---

## 课时概要

装 Python、给项目建专属虚拟环境（venv）、跑第一个 Python 程序（生成 JSON）、装第一个第三方库 requests（代码版 curl）调一次 API，pip 和 requirements.txt 一次落地。后端环境备齐。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】5.2-Python安装和环境设置](https://www.bilibili.com/video/BV1M5Nu6pEuK/) ｜ 时长 50:21 ｜ 模块 5 · 初试后端

**讲义**：[模块 5.2：Python 的安装和环境设置（李勃老师.com）](https://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-5-2/)

## 本节要点

- **先有运行环境再谈写代码**：和前端先装 Node 一个道理，后端先装 Python；`python3 --version` 验证。
- **一台电脑可能有多个 Python**：`which python3` 查当前用的是哪个（排查环境问题第一招）；想用特定版本直接敲 `python3.12`。
- **venv 给每个项目一套自己的 Python**：建 → 激活 → 装包只进这个项目 → `deactivate` 退出。
- **`.venv` 不进 Git**（和 `node_modules` 一样），但 `requirements.txt` 要进 Git——别人拿到一条 `pip install -r requirements.txt` 装齐。
- **运行 Python 程序 = `python3 xxx.py`**：不用构建、不用浏览器。
- **报错是线索**：`ModuleNotFoundError: No module named 'requests'` = 这个第三方库还没装。
- **pip 是后端的 npm**；装包前先看提示符 `(zero-to-tech)` 在不在。

## 笔记正文（讲义整理）

### 装 Python、确认用的是哪一个

```bash
python3 --version          # 验证
which python3              # 现在敲 python3 到底执行哪一个
which -a python3           # 把候选全列出来，排最前的生效
python3.12 --version       # 明确用某个版本就直接带版本号
```

`python` vs `python3` 的来历：Python 2→3 不兼容升级，长期并存，系统约定 `python3` 指新版。

### venv：每个项目一套自己的 Python

```bash
cd ~/zero-to-tech/backend
python3 -m venv --prompt=zero-to-tech .venv   # 建，--prompt 自定义提示符
source .venv/bin/activate                      # 激活，提示符变成 (zero-to-tech)
which python                                   # 现在指进 .venv 了
# …干活…
deactivate                                     # 退出
```

立规矩：`.venv` 不进 Git（`.gitignore` 加 `backend/.venv/`）。已在用 conda 的别混用——课程用 venv（AI Agent 能从项目目录认出依赖）。

> 后端目录就放 `~/zero-to-tech/backend/`，前端不强行挪成对称结构——项目是长出来的，结构带着历史痕迹，不碍事就不为对称而重构。前后端独立体现在**两个进程、两套依赖、两种部署**，不在目录长相。

### 第一个程序：生成 JSON

```python
import json                          # 标准库，import 即用
site_name = "zero-to-tech"           # 变量：名字 = 值

def make_data():                     # def 定义函数；缩进本身就是语法
    data = {"message": "hello, world", "from": site_name}
    return json.dumps(data)          # 把字典转成 JSON 文本

print(make_data())                   # 打印到终端
```

```bash
python3 first_json.py
# → {"message": "hello, world", "from": "zero-to-tech"}
```

标准库（json/datetime/random/os/**http.server**——下一节就用）装 Python 时自带；第三方库要先 `pip install` 才能 `import`。

### 装 requests：代码版 curl 调 API

```python
# api_demo.py
import requests
resp = requests.get("https://api.ipify.org?format=json")
print(resp.json())
```

```bash
python3 api_demo.py
# → ModuleNotFoundError: No module named 'requests'   报错是线索：还没装

pip install requests                  # 先看提示符是 (zero-to-tech)
pip show requests                     # Location 指进 .venv——装进对了地方
python3 api_demo.py
# → {'ip': '114.86.123.45'}   通了！和 5.1 curl 干的是同一件事
```

> 字典 ≈ JSON：`json.dumps` 产出双引号 JSON 文本；`resp.json()` 把 JSON 解析成 Python 字典（打印用单引号）。

### requirements.txt：给依赖记账

```bash
pip freeze > requirements.txt         # 钉死版本清单
pip install -r requirements.txt       # 后端版 npm install
```

| 前端 | 后端 | 干的活 |
| --- | --- | --- |
| `npm` | `pip` | 装第三方包 |
| `node_modules/` | `.venv/` | 装到哪（都不进 Git） |
| `package.json` | `requirements.txt` | 依赖清单（都进 Git） |

![Python 环境：venv 工作流 + 前后端工具对照](/diagrams/python-venv-setup.png)

## 和 GFG / 课程笔记的连接

这节开始，GFG 的 Python 笔记直接对上号：

| 这节内容 | GFG 笔记 |
| --- | --- |
| `import json` / 标准库 | GFG 里 import 语法、json/datetime/os 标准库章节 |
| `def` + 缩进是语法 | GFG 全程就是缩进——你早写过几百遍了 |
| `requests.get/post` | GFG Web 章节里的 HTTP 请求库 |
| 字典 ≈ JSON | GFG 里的 dict；单引号 vs 双引号的区别正好对上 |
| `pip` / `requirements.txt` | 4.2 前端 npm / package.json 的后端镜像 |

> 你在 GFG 里写 Python 时多半没建过 venv（全局装包）。从今天起立个新习惯：**后端项目先建 venv、激活了再装包**。

## 关键概念

- **venv（虚拟环境）**：给每个项目一套自己的 Python 和第三方包，互不干扰。
- **激活（activate）/ 退出（deactivate）**：进入/离开当前项目的虚拟环境。
- **标准库 vs 第三方库**：前者装 Python 时自带，后者要 `pip install`。
- **pip**：装 Python 第三方库的工具，后端的 npm。
- **requirements.txt**：依赖清单，钉死版本，进 Git。
- **缩进即语法**：Python 靠缩进（不是花括号）划分代码块。

## 代码 / 实操

```bash
# 装完 Python 后
cd ~/zero-to-tech/backend
python3 -m venv --prompt=zero-to-tech .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

# 装第三方库
pip install requests
pip show requests                  # 确认 Location 在 .venv 里

# 依赖清单
pip freeze > requirements.txt
# .gitignore 加一行：backend/.venv/

# 运行
python3 first_json.py
python3 api_demo.py
```

## 我的收获

1. `which python3` 是排查环境问题的万能第一招——先搞清楚现在用的是哪一个，很多怪事一眼看穿。
2. venv 不只是规矩，`pip show` 看到 Location 指进 `.venv` 那一刻，「为什么要隔离」才算真正落地。
3. 前端后端工具一一对上：npm↔pip、node_modules↔.venv、package.json↔requirements.txt——换皮不换骨。

## 待深入

*（待填：没听懂、想回头查的。）*
