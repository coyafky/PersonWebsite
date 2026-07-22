---
title: "React 的心智模型：UI 是状态的函数"
date: "2026-07-21"
summary: "React 最核心的心智模型只有一句话：UI = f(state)。理解了这句话，就理解了为什么 React 要发明组件、JSX、Virtual DOM、单向数据流这些概念。这篇笔记从「jQuery 时代的 UI 开发痛点」出发，推导出 React 的设计动机，然后拆解这个心智模型的三层含义。"
tags:
  - React
  - 心智模型
  - 组件
  - Virtual DOM
  - 单向数据流
status: published
lang: zh
topic: react
englishSummary: "React's core mental model in one sentence: UI = f(state). Understanding this unlocks why React invented components, JSX, Virtual DOM, and unidirectional data flow. This note traces back from the pain points of jQuery-era UI development to derive React's design motivations, then unpacks the three layers of this mental model."
---

# React 的心智模型：UI 是状态的函数

> 这篇笔记整理的是 React 最底层的思维方式——不是 API，不是语法，而是 React 想让你的大脑怎么想问题。

## 一、jQuery 时代的问题

在 React 出现之前（2013 年以前），前端开发的主流方式是 **jQuery + 手动 DOM 操作**。

一个「点击按钮，计数器 +1」的功能长这样：

```js
// jQuery 时代的写法
let count = 0;

$('#btn').on('click', function() {
  count++;
  $('#display').text(count);
});

// 初始化时也要手动设置 DOM
$('#display').text(count);
```

**这个模式的问题**：
1. **状态和 UI 不同步**：`count` 变量（状态）和 `#display`（UI）是两套独立的系统。你必须手动在每次状态变化后更新 UI。忘了更新？UI 就卡在旧状态。
2. **初始化和更新是两套逻辑**：初始化要写一遍 `$('#display').text(count)`，点击更新又要写一遍。同样的 UI 描述出现了两次。
3. **复杂 UI 不可维护**：当页面上有 10 个会变化的状态、互相依赖显示/隐藏 5 个区域时，DOM 操作的代码会变成一团乱麻——你根本追踪不到「谁在什么时候改了哪个 DOM」。

这些问题不是 jQuery 的错——jQuery 只是简化了 DOM 操作。**根本问题是「用 DOM 操作来表达 UI 变化」这件事本身就不对。**

## 二、React 的答案：UI = f(state)

React 的核心思想来自一个函数式编程的概念：

```
UI = f(state)
```

**翻译成人话**：给定一份数据（state），React 能自动生成对应的 UI。你只需要描述「state 是什么」，不需要描述「怎么把 state 变成 DOM」。

### 2.1 同一个功能，React 怎么写

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

**和 jQuery 版本的本质区别**：

| | jQuery | React |
|---|---|---|
| **你操作什么** | DOM 节点（`$('#display')`） | 状态（`count`） |
| **UI 怎么更新** | 你手动去改 DOM | React 自动重渲染 |
| **初始化和更新** | 两套不同的代码 | 同一套 return 的 JSX |

**关键洞察**：React 代码里没有任何 `document.getElementById`、没有任何 `.text()`、`.html()`。**你只描述了「count 是几，span 就显示几」，React 负责把这件事落实。**

### 2.2 这就是声明式（Declarative）

React 的范式叫**声明式编程**——你声明「UI 应该是什么样」，不写「如何一步步把 UI 变成那样」。

```
声明式（React）：     "如果 count = 3，span 里就显示 3"
命令式（jQuery）：    "找到 #display 节点，把它的文本内容改成 3"
```

**声明式的优势**：
- **代码量随复杂度线性增长**：加一个新状态 = 加一个新 state + 在 JSX 里引用它。jQuery 里加一个新状态 = 在所有可能改变它的地方加 DOM 操作。
- **调试时你只需要看 state**：UI 出错了 → 检查 state 当前值。jQuery 下 UI 出错了 → 你不知道是哪个 DOM 操作在什么时候改的。
- **测试时可以只测逻辑**：`expect(render(<Counter/>)).toMatchSnapshot()`，不需要测 DOM 操作。

## 三、React 如何实现「自动同步」

「UI = f(state)」听起来很美，但 React 怎么做到的？三个核心机制：

### 3.1 Virtual DOM：在 JS 里算，算完再动 DOM

```
你调用 setState
    │
    ▼
React 在 JS 里重新跑一遍你的函数 → 得到新的 Virtual DOM 树（JS 对象）
    │
    ▼
React 对比新旧两棵 Virtual DOM 树（diff 算法）
    │
    ▼
React 算出差了什么（最小更新量）
    │
    ▼
React 只动那些真正需要改的真实 DOM 节点
```

**为什么需要 Virtual DOM**：直接操作真实 DOM 很慢。在 JS 内存里比较两棵树很快。React 帮你做「算出差了什么 → 最小化 DOM 操作」这一步。

### 3.2 单向数据流：永远从上往下

```
App (state: { user, articles })
 │
 ├──→ Header (props: user)
 │      └── 只能读 user，不能改
 │
 └──→ ArticleList (props: articles)
        ├──→ ArticleCard (props: article)
        └──→ ArticleCard (props: article)
```

**数据只往一个方向流**：父组件通过 props 传数据给子组件。子组件不能直接改父组件的 state——它只能通过父组件传下来的函数（如 `onDelete`）来「通知」父组件。

**为什么单向**：如果是双向绑定（Angular 1.x 的风格），数据可以在任何地方被任何组件改——出问题时你找不到是谁改的。单向数据流下，**state 的修改永远发生在一个明确的地方（setState），追踪起来很简单。**

### 3.3 组件：把 UI 拆成可复用的「状态 + 渲染」单元

```jsx
// 一个组件 = 状态（state）+ 渲染（JSX）+ 行为（事件处理）
function ArticleCard({ article, onLike }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card">
      <h3>{article.title}</h3>
      {expanded && <p>{article.content}</p>}
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? '收起' : '展开'}
      </button>
      <button onClick={() => onLike(article.id)}>点赞</button>
    </div>
  );
}
```

**每个组件是一个独立的「微应用」**——有自己的状态（`expanded`），有自己的 UI 描述（JSX），有自己的行为（展开/收起）。通过 props 和外界通信（接收 `article` 数据，发出 `onLike` 事件）。

## 四、这个心智模型的三层含义

**第一层（会用）**：我知道 `UI = f(state)`。改 UI 不直接操作 DOM，改 state 就行。

**第二层（理解）**：我知道 React 为什么这么设计。声明式比命令式更可预测、更容易调试、更容易测试。Virtual DOM + diff + 单向数据流是实现「自动同步」的三个支柱。

**第三层（判断）**：我能判断「这个状态应该放在哪个组件」。共享的状态往上提（lifting state up），局部状态就地管理，全局状态用 Context/Zustand。**状态的位置决定了数据流的结构，数据流的结构决定了应用的可维护性。**

## 五、从心智模型到日常编码

| 你写的代码 | 对应心智模型的哪部分 |
|-----------|-------------------|
| `const [x, setX] = useState(...)` | 声明「这是 UI 依赖的状态」 |
| `<div>{x}</div>` | 声明「UI 应该反映这个状态」 |
| `onClick={() => setX(x+1)}` | 声明「这个事件会改变状态」 |
| 不写 `document.getElementById` | 相信 React 会自动同步 |
| `useEffect(() => {...}, [x])` | 声明「状态 x 变化时，运行这个副作用」 |

**React 想从你身上拿走的**：手动 DOM 操作。
**React 想给你的**：一份「状态 → UI」的声明式映射关系，让你只关心数据和逻辑。

理解了这个心智模型，后面学 Hooks、Context、Redux、Next.js 的 Server Components 时，你会反复看到同一个主题：**把「怎么做」变成「要什么」，把命令式变成声明式。**
