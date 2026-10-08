---
title: "5.4 FastAPI入门"
date: "2026-09-20"
summary: >-
  从手搓切换到 FastAPI 框架，并实现一个 POST 接口。
status: published
tags:
  - "FastAPI"
  - "Python"
  - "API"
lang: zh
chapter: "5.4"
series: "zero-to-fullstack"
seriesOrder: 22
---

## 课时概要

从手搓切到 FastAPI：认识 Flask/Django/FastAPI，搞清 FastAPI（管定义接口）和 uvicorn（管跑服务器）两个角色。用 FastAPI 重写 `/api/profile`，再用 pydantic 的 `BaseModel` 加一个自动解析校验的 POST `/api/analyze`。/docs 自动长出接口文档。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】5.4-FastAPI入门](https://www.bilibili.com/video/BV1LW3K63ExS/) ｜ 时长 36:12 ｜ 模块 5 · 初试后端

**讲义**：[模块 5.4：从手搓到框架，FastAPI 登场（李勃老师.com）](https://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-5-4/)

## 本节要点

- **框架 = 把每个后端都要干的杂活打包复用**；手搓过一遍，才知道框架替我们干了什么。
- **FastAPI 管「接口该做什么」，uvicorn 管「让接口跑起来」**；uvicorn 收到请求交给 FastAPI。
- 启动两条命令都行：`uvicorn main:app --reload`（手动挡）、`fastapi dev`（自动挡，替我们跑 uvicorn + reload）——以后统一用后者。
- **装饰器 `@app.get("/path")`**：这个路径的 GET 请求交给下面函数处理——读懂意思即可，不用学会写。
- **BaseModel（pydantic）声明请求形状**：`text: str` 一句话，FastAPI 自动收字节/解析 JSON/校验字段，缺了或类型错就回 422。
- `/docs` 自动接口文档：代码一改文档跟着变。
- `__pycache__/` 不进 Git；`pip freeze > requirements.txt` 更新依赖账。
- **读报错先看最后一行**（什么错），再往上找自己文件的行号（在哪儿）；读不懂丢给 AI。

## 笔记正文（讲义整理）

### 选 FastAPI

Flask（老牌轻量）/ Django（大而全）/ FastAPI（最年轻，专为写 API 生）。选 FastAPI 三个理由：样板少、类型校验反馈直接、自动接口文档。和 4.3 选 React 一样——**框架概念相通**，用明白一个再看别的都是熟面孔。

### 重写 /api/profile：杂活去哪了

```python
from fastapi import FastAPI
app = FastAPI()
profile = {"heroTitle": "关于我", "heroSubtitle": "…"}

@app.get("/api/profile")   # 装饰器：这个路径的 GET 交给下面函数
def get_profile():
    return profile         # 返回 dict，FastAPI 自动变 JSON
```

| 5.3 手搓版 | FastAPI 版 |
| --- | --- |
| `if self.path == ...` 路由 | `@app.get(...)` 一行 |
| `send_response(200)` | 自动 |
| `send_header("Content-Type", ...)` | 自动 |
| `json.dumps().encode()` | 自动序列化 dict |
| `else` 兜底 404 | 自动（回 `{"detail":"Not Found"}`） |

### 启动

```bash
pip install "fastapi[standard]"      # standard = 本体+推荐配件，uvicorn 随包装进来
fastapi dev                          # 自动找 main.py、自动 reload
# 手动挡认脸：uvicorn main:app --reload（main:app = 文件 main.py 里的 app 变量）
```

浏览器开 `http://localhost:8000/docs`——接口文档自动长出来，能 Try it out / Execute。

### 加 POST /api/analyze：三步

```python
from pydantic import BaseModel          # ① 引入

class AnalyzeRequest(BaseModel):         # ② 声明请求形状：必须有 text 且是字符串
    text: str

@app.post("/api/analyze")               # ③ 接口
def analyze(req: AnalyzeRequest):
    return {"text": req.text, "score": 0.5,
            "label": "偏平静", "pinyin": "（模块 6 再说）"}
```

`req: AnalyzeRequest` 这个类型声明，让 FastAPI 自动完成手搓时代最狼狈的活：收字节、解析 JSON、校验字段。故意发 `{"txt": "..."}` 字段名错 → **422**，自动指出缺 `text`，校验代码一行没写。

> score/label/pinyin 现在是**写死的占位**，模块 6 换真的——这正是 API 的好处：内部实现整个换掉，接口不变，调用方毫无感觉。

### 报错怎么看（生存技能）

故意把 `req.text` 写成 `req.txt`：

- 调用方写错字段 → **422**（请求方的错）；我们自己代码写错 → **500**（服务方的错）。谁的错，状态码分得清。
- 终端红字是 **traceback**：先看**最后一行**（`AttributeError: ... no attribute 'txt'`），再往上找 `File ".../main.py", line XX`。读不懂整段丢给 AI。

![手搓 vs FastAPI：杂活去哪了](/diagrams/fastapi-handmade-vs-framework.png)

## 和 GFG / 课程笔记的连接

| 这节内容 | GFG 笔记 / 已学 |
| --- | --- |
| `@app.get` 装饰器 | GFG 里见过 decorator；这节要求读懂不要求会写 |
| `class AnalyzeRequest(BaseModel)` | GFG 的类与继承 |
| pydantic 数据校验 | GFG 里讲类型/校验的章节；`text: str` 这种类型标注 |
| 框架打包杂活 | 4.3 React 框架——「框架=管一摊事的规则」，同一句话换了个领域 |
| pip install / requirements.txt | 5.2 刚立的规矩，这次换包名再走一遍 |

> 你在 GFG 里学的 Python 语法，到这里全部归位：类、继承、类型标注，不再是练习题，而是用来声明「接口长什么样」。

## 关键概念

- **FastAPI**：Python 后端框架，专为写 API，自动生成文档、自动校验。
- **uvicorn**：运行服务器（ASGI），守端口、把请求交给 FastAPI。
- **装饰器 `@app.get/post`**：把路径和方法绑到处理函数上。
- **BaseModel / pydantic**：声明数据形状，自动解析校验请求体。
- **422**：请求体校验不通过（请求方的错）。
- **traceback**：Python 报错回溯，最后一行说是什么错，往上找文件行号。
- **/docs**：FastAPI 自动生成的交互式接口文档。

## 代码 / 实操

```bash
cd ~/zero-to-tech/backend && source .venv/bin/activate
pip install "fastapi[standard]"
fastapi dev                    # 跑在 8000 端口

# 另开终端验证
curl http://localhost:8000/api/profile
curl http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "今天的风很轻"}'
curl -i ...                    # -i 连响应头/状态码一起看

# .gitignore 加：__pycache__/  *.py[cod]
pip freeze > requirements.txt  # 更新依赖账
```

## 我的收获

1. 手搓过一遍再用框架，最大的收获不是省事，是确切知道框架替我藏了哪几行。
2. BaseModel 一句声明顶手搓时代读字节+解析+校验一整套——「声明形状，自动完成」是框架的核心爽点。
3. 422 vs 500 这一对比，把「谁的错」讲透了；traceback 从最后一行读起，这个习惯得养成。

## 待深入

*（待填：没听懂、想回头查的。）*
