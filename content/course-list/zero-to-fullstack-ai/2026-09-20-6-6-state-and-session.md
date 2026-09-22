---
title: "6.6 状态与会话"
date: "2026-09-20"
summary: >-
  状态与会话——让应用记住「你是谁」。
status: published
tags:
  - "FastAPI"
  - "后端"
lang: zh
chapter: "6.6"
series: "zero-to-fullstack"
seriesOrder: 29
---

## 课时概要

模块 6 收官。为什么换个浏览器能看到别人的历史？因为 HTTP 是**无状态**的——处理完就忘，压根不认人。解法不是把 HTTP 改成有状态，而是承认它无状态，再在应用层把状态「长回来」：用 **session_id（UUID）+ cookie** 把散落的请求认成同一个人。跨源要带 cookie 得两头点头，最后看清会话≠认证、以及大模型「记忆」其实是把历史每次重发。

> 以上为 UP 主的 B 站官方简介，非观看笔记；只有跟完这一节才算自己的理解。

**视频**：[【零到全栈】6.6-状态与会话](https://www.bilibili.com/video/BV1Q6bH6xEZS/) ｜ 时长 50:56 ｜ 模块 6 · 生态、数据与状态

**讲义**：[模块 6.6：状态与会话（李勃老师.com）](https://xn--ygr25xpohxwz.com/zero-to-fullstack/lessons/module-6-6/)

**配套 demo**：`zero-to-tech-demos/zero-to-tech-6-6/`（HistoryModal.jsx 等）。

## 本节要点

- **HTTP 无状态**：处理完一轮就把状态全扔了，下个请求是全新陌生人。无状态不是缺陷，是为「海量陌生请求」做的刻意选择——换来可水平扩展。
- **状态**：决定下一步会怎样的一组参数（游戏存档）；我们一路在给状态找活得更久的地方（浏览器→内存→硬盘）。
- **会话（session）是被构造出来的「认定」**：把一串独立请求认成同一个人；cookie 是运送 session_id 的「工具」——一个是概念一个是工具，不存在二选一。
- 标识三条件：唯一 / 每次都带 / 猜不出；**cookie 的真正价值是「自动带」**。
- 跨源带 cookie **两头点头**：后端 `allow_credentials=True`（且不能用 `*`）+ 前端 `credentials: "include"`。
- 动手：history 表加 `session_id` 列；`get_session_id()` 先看 cookie 没有就发新 UUID；存/查都认 `WHERE session_id=?`。
- **会话≠认证**：清 cookie 就当你是新访客；登录/注册是在会话之上再加一层「凭什么证明我是我」。
- 大模型「记住你」的真相：模型无记忆，是客户端把整段 messages 每次重发；上下文窗口=messages 长度上限。

## 笔记正文（讲义整理）

### 问题：换个浏览器看到别人的历史

前端加了历史弹窗后，换浏览器/无痕窗口——刚才打的字一字不差出现在新浏览器里。因为所有访客的记录混在一张表，网站**不认人**。

### 为什么不认人：HTTP 无状态

一个请求一轮就结束，服务器把这一轮的状态全扔了，下个请求当你是全新陌生人。DeepSeek API 更极端：刚说「我记住了」，下一次问「我叫什么」它说不知道——它根本没有「刚才」。

> 无状态不是缺陷：FastAPI/Vite 官网压根不需要认人。只有要为每个人分别留住东西（历史/购物车/偏好）时，认人才是坎。

### 矛盾与出路

底层要**遗忘**（才能海量扩展），人的活动要**记忆**（事情有前因后果）。谁都不让步，只剩一条路：**承认底层无状态，在它上面用最小代价把状态长回来**——服务器只要能认出「这是同一个人」就行，历史本身存数据库。

### 会话 + cookie

- **session_id** 用 `uuid.uuid4().hex` 生成（唯一、猜不出）；
- cookie 是 HTTP 头里的一行：响应头 `Set-Cookie`（发纸条），请求头 `Cookie`（带纸条）；
- cookie 真正值钱的是**自动**——浏览器存着、每次请求自动带；Local/Session Storage 不会自动发；
- cookie 五个属性：`Max-Age=2592000`（30 天，最重要）、`HttpOnly`、`SameSite=lax`、`Path=/`。

![无状态 → 会话：cookie 带 session_id，把散落请求认成同一个人](/diagrams/session-cookie-why-stateless.png)

### 动手四步

0. **两头点头**：后端 `allow_credentials=True`（不能 `*`）+ 前端两处 fetch 加 `credentials:"include"`；
1. history 表加 `session_id` 列，索引改 `(session_id, created_at)`（先筛后排）；
2. `get_session_id(request, response)`：先读 cookie，没有就 `uuid4()` 并 `set_cookie`；
3. `save_record(sid, ...)` / `get_history(sid, limit)` 都认 session_id；
4. 两个接口先 `sid = get_session_id(...)` 再干活，返回体一个字没变。

验证：`curl -i /api/history` 看 `set-cookie:` 那行；浏览器 F12 → Application → Cookies 能看到；Network 请求头自动带 `Cookie: session_id=...`。各看各的，公共账本消失。

### 边界 + 大模型的「记忆」

会话≠认证：清 cookie 就当你是新人。登录/OAuth 是在会话之上再盖一层身份。

大模型「记住你」是另一种解法：**状态存在客户端**，每次把整段 messages 重发。上下文窗口=messages 长度上限，对话越长越慢越贵，compact 就是压缩这个数组。

|  | 状态存哪 | 每次带什么 |
| --- | --- | --- |
| Web 会话 | 服务器（history 表） | 只带一个 32 字符 id |
| 裸调大模型 API | 客户端自己 | 整段 messages 历史 |

## 和 GFG / 课程笔记的连接

| 这节内容 | GFG / 已学 |
| --- | --- |
| `uuid.uuid4().hex` | GFG 标准库 uuid 模块 |
| cookie 是 HTTP 头的一行 | 5.3 一去回对称结构——Set-Cookie 是响应头、Cookie 是请求头 |
| 跨源带凭证 | 5.5 CORS 那节埋的线（当时没写 `*` 就是等今天） |
| WHERE session_id=? | 6.4 SQL 第一课 |
| 状态活多久 | 6.3 文件存储→6.5 数据库，一路在给状态找更久的地方 |

> 这节几乎全是新概念，但每一步都挂在已学上：CORS、SQL、HTTP 头、无状态——把前面的线收了一次。

## 关键概念

- **无状态（stateless）**：服务器处理完就忘，任意两次请求独立。
- **状态（state）**：决定下一步会怎样的一组参数；需要存档才活得久。
- **会话（session）**：把散落请求认定为同一个来访者的一次连续交互——是「认定」不是物件。
- **cookie**：浏览器自动存/自动带的一小块数据，运送 session_id 的工具；本质是 HTTP 头里的一行字符串。
- **UUID**：几乎不会重复的随机 id。
- **HttpOnly / SameSite / Max-Age**：cookie 的安全与有效期属性。
- **认证（auth）**：在会话之上再加「凭什么证明我是我」。

## 代码 / 实操

```python
# main.py
import uuid
from fastapi import Request, Response
def get_session_id(request, response) -> str:
    sid = request.cookies.get("session_id")
    if not sid:
        sid = uuid.uuid4().hex
        response.set_cookie("session_id", sid, httponly=True,
                            samesite="lax", max_age=60*60*24*30)
    return sid
# CORS: allow_credentials=True
# storage: save_record(sid, ...) / get_history(sid, limit)
#          WHERE session_id = ? ORDER BY created_at DESC LIMIT ?
# 前端 fetch 加 credentials:"include"
```

## 我的收获

1. 无状态不是缺点是选择：为可水平扩展，把「认人」这件事下放给应用层。
2. cookie 和 session 不在一个层面：一个是运送 id 的工具，一个是「把请求认成同一个人」的关系——存包处的纸条/编号/那档子事，一下分清。
3. 大模型「记忆崩溃」的真相看懂了：它从没记过，是客户端每次把 messages 重发，上下文窗口就是这个数组的长度上限。

## 待深入

*（待填：没听懂、想回头查的。）*
