---
title: "React State 与页面交互：从事件到状态更新"
date: "2026-07-21"
summary: "State 是 React 组件最核心的概念——它是组件用来「记住」交互信息的机制。这篇笔记用 6 张图覆盖 State 的全链路：事件触发（门铃）→ setState 通知重渲染（不等于直接修改变量）→ 渲染快照（每次渲染的 state 是常量）→ 更新队列（批量处理的原理）→ 不可变更新（为什么要用展开运算符而不是直接赋值）。读完你不仅会用 useState，还能解释闭包陷阱和批量更新的底层原因。"
tags:
  - React
  - State
  - useState
  - setState
  - 事件处理
  - 不可变
status: published
lang: zh
topic: react
englishSummary: "State is React's core mechanism for components to 'remember' interaction information. This note uses 6 diagrams to cover the full state chain: event triggers (doorbell) → setState notifies re-render (≠ direct variable mutation) → render snapshots (state is a constant per render) → update queue (batching mechanics) → immutable updates (why spread instead of direct assign). After reading, you'll not only use useState fluently but also understand closure traps and batching."
---

# React State 与页面交互：从事件到状态更新

> 这是 React 学习笔记的第五篇。前面讲了心智模型、组件拆分、声明式思维、数据传递。这一篇聚焦 State——它是 React 最核心的动态机制，也是新手最容易踩坑的地方。

---

## 一、Event 事件：用户的门铃

### 心智模型

```
用户点击按钮
      │
      ▼
┌──────────┐
│  onClick  │  ← 门铃（你在 JSX 里装的）
└────┬─────┘
     │
     ▼
事件处理函数       ← 门铃响了，你来开门
     │
     ▼
  setState         ← 你决定做点什么（改变状态）
     │
     ▼
  React 重渲染      ← 房子内部自动重新布置
```

**事件就是用户按门铃。** 你（开发者）在每个门（按钮、输入框、表单）上装了门铃（onClick、onChange、onSubmit）。用户按下时，你写的函数被调用。函数里可以读当前状态、调 setState 改变未来状态。

### 代码

```jsx
function Doorbell() {
  const [rings, setRings] = useState(0);

  function handleRing() {
    //            ↑ 事件处理函数 — 门铃响了，你来开门
    setRings(rings + 1);
    //          ↑ 告诉 React：「重渲染时用这个新值」
  }

  return (
    <div>
      <p>门铃被按了 {rings} 次</p>
      <button onClick={handleRing}>
        {/*       ↑ 门铃 — 用户点击时触发 */}
        按门铃
      </button>
    </div>
  );
}
```

### 三个关键规则

| 规则 | 为什么 |
|------|--------|
| **事件处理函数以 `handle` 开头** | 约定 — 一眼能看出这是事件处理函数，不是普通函数 |
| **传函数引用，不传函数调用** | `onClick={handleRing}` 不是 `onClick={handleRing()}` — 后者在渲染时就跑了 |
| **事件处理函数是唯一能调 setState 的地方** | 渲染过程中调 setState 会导致无限循环 |

---

## 二、State：组件的记忆盒子

### 心智模型

```
Component
┌─────────────────────────┐
│                         │
│  UI 描述（JSX）          │  ← 基于当前 state 画出来的 UI
│  <p>次数：{rings}</p>    │
│                         │
│  ┌───────────────────┐  │
│  │ State Memory      │  │  ← 组件的「记忆」
│  │                   │  │
│  │ rings = 3         │  │     每次渲染时读这个值
│  │ isOpen = true     │  │
│  │ userName = "Coya"  │  │
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
```

**State 是组件用于「记住」交互信息的机制。** 普通变量在函数执行完后就销毁了——下次渲染时函数从头跑，变量重新初始化。State 是 React 帮你保存的——它在组件生命周期内保持存在，下一次渲染时 React 把它交还给你。

### State vs 普通变量的关键区别

```jsx
function Demo() {
  // ❌ 普通变量 — 每次渲染都重置为 0
  let count = 0;

  // ✅ State — React 记得上次渲染的值
  const [count, setCount] = useState(0);

  function handleClick() {
    // count = count + 1;    // ❌ 普通变量：改了也没用，下次渲染又变回 0
    //                        //    而且 React 不知道你改了它

    setCount(count + 1);     // ✅ State：React 知道值变了 → 安排重渲染
  }
}
```

| | 普通变量 `let count = 0` | State `const [count, setCount] = useState(0)` |
|---|---|---|
| **下次渲染时值** | 重置为初始值 | React 记住上次的值 |
| **变化后触发重渲染** | 不会 | 会 |
| **React 知道它变了吗** | 不知道 | 知道 |
| **用途** | 计算中间值、不需要记忆的东西 | 需要跨渲染记住的东西 |

### State 的特点

1. **私有**：一个组件的 state 对其他组件不可见（除非你通过 props 传下去）
2. **隔离**：同一个组件的两个实例，各有各的 state——互不影响
3. **持久**：在组件挂载期间，React 帮你保存它
4. **触发渲染**：setState 是触发组件重渲染的唯一方式（除了父组件传的 props 变了）

---

## 三、setState 不等于直接修改变量

### 心智模型

```
普通变量赋值：              React setState：

count = count + 1          setCount(count + 1)
     │                           │
     ▼                           ▼
  count 变成新值            1. count 安排为新的值
     │                     2. React 记录「这个组件需要重渲染」
     │                     3. 下次渲染时，useState 返回新值
     ▼
  React 完全不知道
  页面保持不变 ❌                 页面更新 ✅
```

**`setCount(count + 1)` 不是「把 count 改成 count + 1」**。它是「告诉 React：下次渲染时，useState 返回的新值应该是 count + 1，并且现在就去安排那次渲染」。

### 代码证据

```jsx
function Demo() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count);  // 输出什么？
    // → 0（不是 1！）
    // 因为「这次渲染」的 count 不会变——setCount 影响的是「下次渲染」的 count
  }

  return (
    <div>
      <p>count: {count}</p>  {/* 第一次渲染：0。点击后重渲染：1 */}
      <button onClick={handleClick}>+1</button>
    </div>
  );
}
```

**`setCount` 之后的 `console.log(count)` 输出的是旧值**。因为 setCount 只安排未来的渲染，不改变当前渲染中的 count。**当前渲染中的 state 值是固定的——就像一张已经拍好的照片。**

---

## 四、State 是一次渲染的快照

### 心智模型

```
时间 →

Render 1                         Render 2
count = 0                        count = 1
┌──────────┐                     ┌──────────┐
│  📷 快照1 │                     │  📷 快照2 │
│          │    setCount(1)      │          │
│ count=0  │ ──────────────────→ │ count=1  │
│ UI 用 0  │                     │ UI 用 1  │
└──────────┘                     └──────────┘

事件处理函数读取的是它「出生」时
所在那次渲染的 state 快照值。
```

**每次渲染有它自己的 state 值**。事件处理函数「属于」触发它的那次渲染——它捕获的是那次渲染的 state 值，不是未来的值。

### 经典的定时器闭包陷阱

```jsx
function Trap() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);  // 这是什么？
      // ↑ 永远是 setCount(0 + 1) = setCount(1)
      //    因为这个 effect 属于 count=0 的那次渲染
      //    它永远「看到」count = 0
    }, 1000);
    return () => clearInterval(timer);
  }, []);  // ← 空依赖：effect 只在 mount 时跑一次

  // 结果：count 从 0 → 1，然后就停在 1 不动了
  return <p>{count}</p>;
}
```

**修复：用函数式更新**

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1);  // ← 不是读外部 count，而是 React 把当前快照值传给你
    //     React 保证 c 永远是最新值
  }, 1000);
  return () => clearInterval(timer);
}, []);

// 结果：count 持续递增 0 → 1 → 2 → 3 ...
```

**函数式更新的原理**：`setCount(c => c + 1)` 不是在当前渲染里读 `count`，而是告诉 React：「重渲染时，把当前的 state 值传入这个函数，用返回值作为新 state。」React 负责把最新值传给 `c`。

---

## 五、状态更新队列：批量处理的原理

### 心智模型

```
同一个事件处理函数里的多次 setState
会进入一个「更新队列」，React 排队处理：

setCount(c => c + 1)  ──┐
setCount(c => c + 1)  ──┼──→ 更新队列 ──→ 一次重渲染
setCount(c => c + 1)  ──┘       │
                                ▼
                          0 → 1 → 2 → 3

React 在同一个事件里
等到所有 setState 都排好队
才开始计算最终状态并安排重渲染。
```

### 为什么「连续 3 次 setCount(count + 1) 不等于 +3」

```jsx
function Demo() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);  // setCount(0 + 1) = setCount(1)
    setCount(count + 1);  // setCount(0 + 1) = setCount(1)  ← 还是同一个 count！
    setCount(count + 1);  // setCount(0 + 1) = setCount(1)  ← 同一个快照
  }
  // 点击后：count = 1（不是 3！）

  function handleClickFixed() {
    setCount(c => c + 1);  // c = 0 → 1
    setCount(c => c + 1);  // c = 1 → 2  ← React 把上次更新的结果传给 c
    setCount(c => c + 1);  // c = 2 → 3  ← 链式累加
  }
  // 点击后：count = 3
}
```

| 写法 | 读取的值 | 连续 3 次的结果 | 原理 |
|------|---------|---------------|------|
| `setCount(count + 1)` | 当前渲染快照的 count | 只 +1 | 三次都读同一个旧值 |
| `setCount(c => c + 1)` | React 传入的最新值 | +3 | 每次排队，链式累加 |

### 什么时候用函数式更新

```
需要函数式更新的场景：
  setCount(count + 1)
  setCount(count + 1)
  └── 同一个事件里多次 setState，且每次依赖上一次的结果
  └── 在 useEffect / setInterval 里更新 state（闭包陷阱）

不需要函数式更新的场景：
  setCount(count + 1)  // 就一次
  setTodos([...todos, newTodo])  // 不依赖旧 state 的计算结果
```

**简单规则**：如果新值需要基于旧值算出来（`c => c + 1`），用函数式。如果新值是独立的值（`setTodos(newArray)`），直接传新值。

---

## 六、不可变更新：为什么不能直接改

### 心智模型

```
错误做法：直接涂改原始对象              正确做法：创建新版本

user.name = "Tom"                   setUser({
                                      ...user,
                                      name: "Tom"
                                    })

原始对象被污染 ❌                      原始对象保持不变
React 不知道变了 ❌                    React 看到新引用 → 安排重渲染 ✅
PureComponent / memo 失效 ❌          PureComponent / memo 正常工作 ✅
```

**React 用引用比较（===）判断 props 和 state 是否变化。** 你直接 `user.name = "Tom"` 改了内部字段，但 `user` 这个对象的引用没变 → React 的浅比较认为「没变化」→ 可能跳过重渲染或者依赖旧数据的计算出错。

### 代码对比

```jsx
function Demo() {
  const [user, setUser] = useState({ name: 'Coya', age: 28 });

  // ❌ 错误：直接修改
  function wrongUpdate() {
    user.name = 'Tom';           // 改了原始对象
    setUser(user);               // 引用没变 — React 可能跳过渲染
  }

  // ✅ 正确：创建新对象
  function correctUpdate() {
    setUser({
      ...user,                   // 复制所有旧字段
      name: 'Tom',               // 覆盖要改的字段
    });
  }

  // ✅ 函数式更新 + 不可变（最安全）
  function bestUpdate() {
    setUser(prev => ({
      ...prev,
      name: 'Tom',
    }));
  }
}
```

### 常见数据结构的不可变更新模式

```jsx
// ── 对象：更新一个字段 ──
setUser({ ...user, age: 29 });

// ── 对象：更新嵌套字段 ──
setUser({
  ...user,
  profile: {
    ...user.profile,
    bio: '新的自我介绍',
  },
});

// ── 数组：添加元素 ──
setTodos([...todos, newTodo]);         // 末尾添加
setTodos([newTodo, ...todos]);         // 开头添加

// ── 数组：删除元素 ──
setTodos(todos.filter(t => t.id !== id));  // 删指定元素
setTodos(todos.slice(0, -1));             // 删最后一个

// ── 数组：更新元素 ──
setTodos(todos.map(t =>
  t.id === id ? { ...t, done: true } : t
));

// ── 数组：插入元素 ──
const idx = 2;
setTodos([
  ...todos.slice(0, idx),
  newTodo,
  ...todos.slice(idx),
]);
```

### 为什么 React 选择「不可变」这个约束

```
如果允许直接修改：
  user.name = "Tom" + setUser(user)
  → React 不知道你改了什么 — 它要 deep compare 整个对象树才能知道
  → 如果 user 被多个组件引用，改了它会影响所有地方
  → PureComponent / memo 失效 — 引用没变所以跳过渲染，但内容其实变了

不可变更新：
  setUser({ ...user, name: "Tom" })
  → user !== newUser（引用变了）→ React 立即知道有变化
  → 浅比较（O(1)）就够了，不需要 deep compare
  → 旧对象保持完整 — 可以安全地用于比较、撤销、调试
```

**总结**：不可变不是 React 的教条，是它高效 diff 的基础。给了 React 一个 O(1) 的「变化检测」方式（引用比较），才让 Virtual DOM diff 可以只比较「变了的子树」而不是整棵树。

---

## 七、总结：State 的全链路

```
用户操作
  │
  ▼
事件触发（onClick / onChange / onSubmit）
  │
  ▼
事件处理函数（handleXxx）
  │
  ├── 读取当前渲染的 state 快照值（不是未来值）
  ├── 需要基于旧值计算？→ 用函数式更新（c => c + 1）
  └── 不可变更新（{ ...obj, field: newVal } / [...arr, newItem]）
  │
  ▼
setState 被调用
  │
  ├── 不是「改变变量」，是「安排未来的渲染使用新值」
  ├── 同一个事件里的多次 setState 进入更新队列排队
  └── React 批量处理（一次事件只触发一次重渲染）
  │
  ▼
React 重渲染组件
  │
  ├── 函数重新执行
  ├── useState 返回新值
  └── JSX 基于新 state 生成新 UI 描述
  │
  ▼
React diff 新旧 Virtual DOM → 最小化 DOM 操作 → 页面更新 ✅
```
