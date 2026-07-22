---
title: "React 渲染机制：从 setState 到 DOM 更新"
date: "2026-07-21"
summary: "setState 之后 React 到底做了什么？这篇笔记用 6 张图拆解 React 渲染的全链路：Trigger（触发）→ Render（计算）→ Commit（写入）三站地铁、Virtual DOM 蓝图与真实 DOM 建筑、Reconciliation 找不同游戏、Key 的停车位类比（以及 key=index 为什么会导致状态错位）、State 保存与重置的规则（同类型+同位置→保留，否则→重置）。读完你能解释 React 为什么快、为什么 key 不能乱给、以及 state 什么时候会被意外重置。"
tags:
  - React
  - 渲染机制
  - Virtual DOM
  - Reconciliation
  - Fiber
  - Key
status: published
lang: zh
topic: react
englishSummary: "What exactly does React do after setState? This note uses 6 diagrams to unpack the full render pipeline: Trigger → Render → Commit as a three-stop subway, Virtual DOM as architectural blueprint vs real DOM building, Reconciliation as a spot-the-difference game, Key as parking spot analogy (and why key=index causes state misalignment), and state preservation vs reset rules (same type+position → keep, otherwise → reset)."
---

# React 渲染机制：从 setState 到 DOM 更新

> 这是 React 学习笔记的第六篇。前五篇讲了心智模型、组件、声明式、数据流、State。这一篇回答一个核心问题：**setState 之后，React 到底做了什么？**

理解渲染机制不是为了面试，而是为了写出不卡顿的应用、避免无谓的重渲染、以及理解 state 为什么有时候会被「莫名其妙」地重置。

---

## 一、Trigger → Render → Commit：三站地铁

### 心智模型

```
  🚉 Trigger               🚉 Render                🚉 Commit
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ 什么触发了    │       │ React 做什么  │       │ 结果是什么    │
│              │       │              │       │              │
│ 首次加载     │  ───→ │ 调用组件函数  │  ───→ │ 更新 DOM     │
│ setState    │       │ 计算新 UI    │       │ 运行 effect  │
│ props 变化  │       │ 和旧 UI diff │       │              │
│ context 变化 │       │              │       │              │
└──────────────┘       └──────────────┘       └──────────────┘
```

**React 的渲染流程是三个连续的阶段，像地铁三站。** 每个阶段有明确的分工——不是你 setState 之后 React 就立刻去改 DOM 的。

### 第一站：Trigger（触发）

三种情况会触发渲染：

| 触发条件 | 何时发生 |
|---------|---------|
| **首次渲染** | 组件第一次挂载（`ReactDOM.createRoot` 或 `app.render()`） |
| **setState** | 组件内部调 `setState`（不管新值和旧值是否不同） |
| **父组件重渲染** | 父组件传入的 props 引用变化，或父组件本身重渲染 |

**注意**：即使 `setCount(0)` 调了 100 次，count 始终是 0，React 仍然会触发一次渲染——它不会自动跳过「新值等于旧值」的情况（除非你用 `React.memo` 或类似的优化）。

### 第二站：Render（计算）

**这是 React 在「脑子里」做的事——不碰 DOM。**

```
React 拿到 setState 的通知
        │
        ▼
调用组件函数（你的 Counter、App、ProductCard 这些函数重新跑一遍）
        │
        ▼
生成新的 React Element Tree（JS 对象，不是 DOM）
        │
        ▼
和旧的 React Element Tree 做 diff（Reconciliation）
        │
        ▼
算出哪些 DOM 节点需要新增 / 修改 / 删除
```

**关键理解**：Render 阶段只是「计算」。React 在内存里算出 UI 应该变成什么样、和现在的 UI 差在哪——但它还没去改浏览器里的 DOM。

### 第三站：Commit（写入）

**Render 算出了差在哪，Commit 负责去改。**

```
React 拿到 diff 结果（一堆「增删改」指令）
        │
        ▼
按顺序执行 DOM 操作：
  ├── 创建新节点（document.createElement / appendChild）
  ├── 修改属性（element.setAttribute / 改 className）
  └── 删除旧节点（element.removeChild）
        │
        ▼
DOM 更新完毕 → 浏览器重新绘制
        │
        ▼
React 跑 useEffect 的 cleanup + effect（副作用在 Commit 之后跑）
```

### 为什么分两阶段

| 阶段 | 做什么 | 能否中断 | 用户能看见吗 |
|------|--------|---------|------------|
| **Render** | 纯计算（diff） | 可以中断（Fiber 架构） | 看不见 |
| **Commit** | 改 DOM | 不能中断（一中断 DOM 就坏了） | 看得见 |

**Render 可以中断是 React 16 Fiber 架构的核心创新**。如果一次 Render 要算很久（比如 1000 个组件要 diff），React 可以暂停、让浏览器先响应用户的点击，然后再回来继续算。这就是为什么 React 16 之后大列表的输入不再卡顿。

---

## 二、重新渲染 ≠ 删除重建

### 错误直觉

```
很多人以为的"重新渲染"：
  删除页面上的所有 DOM
        ↓
  重新创建所有 DOM
        ↓
  页面闪一下
```

### 实际过程

```
真正的"重新渲染"：
  组件函数重新执行（你的代码）

        ↓

  产生新的 React Element Tree（JS 对象数组）

        ↓

  和旧的 React Element Tree 做比较（diff）

        ↓

  只更新变化的部分（可能只改了一个文本节点）
```

### 代码验证

```jsx
function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clock">
      <h1>当前时间</h1>
      <p>{time.toLocaleTimeString()}</p>   {/* 只有这个 <p> 的文本在变 */}
      <footer>Powered by React</footer>    {/* 这个 <footer> 从未被重新创建 */}
    </div>
  );
}
```

**每秒 setTime 触发一次重渲染，但 `<footer>` 元素从未被删除重建。** React 对比新旧 Tree 后发现：`<div>` 还在、`<h1>` 还在、`<p>` 还在（只是文本变了）、`<footer>` 还在——于是它只更新了 `<p>` 的 `textContent`，其他 DOM 节点纹丝不动。

---

## 三、Virtual DOM：建筑蓝图

### 心智模型

```
React Element Tree（Virtual DOM）= 建筑蓝图 📐
DOM                              = 真实建筑 🏗️
diff                             = 比较新旧蓝图
patch                            = 按差异施工
```

```
旧蓝图                          新蓝图
┌──────────┐                   ┌──────────┐
│ <div>    │                   │ <div>    │
│   <h1>A  │                   │   <h1>A  │  ← 没变，不动
│   <p>B   │                   │   <p>C   │  ← 文本变了，换掉
│ </div>   │                   │ </div>   │
└──────────┘                   └──────────┘

      比较新旧蓝图 → 只有 <p> 变了 → 只施工 <p>
```

### 为什么需要在 JS 里维护一份 DOM 的描述

**直接操作 DOM 很慢。在 JS 内存里比较对象很快。**

```
操作真实 DOM：
  读一个属性 → 触发浏览器重排 → 算 CSS → 算布局 → 你改了一个值
  → 又触发重排 → 又算 CSS → 又算布局
  （每次操作都是昂贵的）

操作 Virtual DOM（JS 对象）：
  读一个属性 → 访问 JS 对象 → O(1)
  改一个属性 → 改 JS 对象 → O(1)
  （全部在内存里完成，不碰浏览器渲染引擎）

最后一次性把算好的结果告诉 DOM：
  "你只需要改这三个节点"
  （最小化真实 DOM 操作）
```

### Virtual DOM 不是「比真实 DOM 快」

**严格来说，Virtual DOM 不比直接操作真实 DOM 快**——如果手动只改需要改的 DOM 节点，速度是一样的。

**Virtual DOM 的价值在于**：你不需要自己计算「哪些 DOM 节点需要改」。你只需要声明「UI 应该长这样」，React 帮你算出差了什么并执行最小更新。**它牺牲了理论上的极速（直接操作），换来了开发者的便利和可维护性（声明式描述）。**

---

## 四、Reconciliation（调和）：找不同游戏

### 心智模型

```
旧 Tree                         新 Tree

<ul>                            <ul>
  <li key="a">A</li>              <li key="a">A</li>  ← 保留
  <li key="b">B</li>              <li key="c">C</li>  ← 创建
  <li key="c">C</li>              <li key="b">B</li>  ← 移动
</ul>                            </ul>

React 逐一比较后决定：
  1. li-a：key 和位置都没变 → 保留
  2. li-c：旧树有 li-b 在这里 → 移动到 li-a 后面
  3. li-b：旧树没有 → 创建新的
  4. 旧树的 li-c？删掉 → 实际是新 li-c 的 DOM 被删了
```

**Reconciliation = React 的 diff 算法**。它比较新旧两棵 React Element Tree，返回一份「最小更新操作清单」。

### Diff 算法的三个假设

React 的 diff 算法不是通用的 Tree Diff（O(n³)），而是基于两个假设做了优化（O(n)）：

| 假设 | 含义 | 你的责任 |
|------|------|---------|
| **不同类型 → 子树全换** | `<div>` 变成 `<span>` → 整个子树删除重建 | 不要频繁切换元素类型 |
| **相同类型 → 只更新属性** | `<div className="a">` → `<div className="b">` → 只更新 className | 无需额外操作 |
| **Key 标记身份** | 用 key 告诉 React「这个是同一个元素，只是位置变了」 | **给列表元素稳定的 key** |

### 没有 Key 时 React 的行为

```jsx
// 没有 key → React 按位置（index）判断
<ul>
  <li>A</li>   // 位置 0 → A
  <li>B</li>   // 位置 1 → B
  <li>C</li>   // 位置 2 → C
</ul>

// 在开头插入 D
<ul>
  <li>D</li>   // 位置 0 → 原来是 A → React：A 变成了 D？改文本！
  <li>A</li>   // 位置 1 → 原来是 B → React：B 变成了 A？改文本！
  <li>B</li>   // 位置 2 → 原来是 C → React：C 变成了 B？改文本！
  <li>C</li>   // 位置 3 → 新建一个
</ul>

// 结果：React 改了前 3 个 li 的文本，新建了第 4 个
// 其实它只需要创建一个新的 li-D，其他三个不用动
```

**有了 key 之后**：

```jsx
<ul>
  <li key="a">A</li>
  <li key="b">B</li>
  <li key="c">C</li>
</ul>

// 在开头插入 <li key="d">D</li>
// React 看 key：
//   d → 新的，创建
//   a → 还在，保留
//   b → 还在，保留
//   c → 还在，保留
// 结果：只创建了一个新的 li-D，其他三个不动 ✅
```

---

## 五、Key：停车位

### 心智模型

```
没有稳定的 key（React 只看位置）：

  车位 1    车位 2    车位 3
┌───────┐ ┌───────┐ ┌───────┐
│ A 车   │ │ B 车   │ │ C 车   │
└───────┘ └───────┘ └───────┘

插入 D 车在第一位：

  车位 1    车位 2    车位 3    车位 4
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ D 车   │ │ A 车   │ │ B 车   │ │ C 车   │
└───────┘ └───────┘ └───────┘ └───────┘

React 不知道车可以"开走换位"—
它以为车位的车被"换掉"了。
每个车位都要重新装修。

───────────────────────────────────

有稳定的 key（React 认车不认位）：

  车位 1    车位 2    车位 3
┌───────┐ ┌───────┐ ┌───────┐
│ID:101 │ │ID:102 │ │ID:103 │
│ A 车   │ │ B 车   │ │ C 车   │
└───────┘ └───────┘ └───────┘

插入 ID:104 D 车：

  车位 1    车位 2    车位 3    车位 4
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ID:104 │ │ID:101 │ │ID:102 │ │ID:103 │
│ D 车   │ │ A 车   │ │ B 车   │ │ C 车   │
└───────┘ └───────┘ └───────┘ └───────┘

React 认出了 ID：
  ID:101 → 还在，只是挪到车位 2
  ID:102 → 还在，只是挪到车位 3
  ID:103 → 还在，只是挪到车位 4
  ID:104 → 新的

只建了一个新车位，三辆车没动。✅
```

### key=index 为什么是坏的

```jsx
// ❌ key={index} — 数组顺序一变，state 就错位
{todos.map((todo, index) => (
  <TodoItem key={index} todo={todo} />
))}

// 场景：删除第一项
// 旧：[{id:1, text:'A'}, {id:2, text:'B'}, {id:3, text:'C'}]
// key: [       0,              1,              2      ]

// 新：[{id:2, text:'B'}, {id:3, text:'C'}]
// key: [       0,              1      ]
//
// React 看：key=0 还在 → 保留这个 DOM（但内容从 A 变成了 B）
//           key=1 还在 → 保留这个 DOM（但内容从 B 变成了 C）
//           key=2 没了 → 删掉（实际是 C 的 DOM 被删了）
//
// 问题：如果 TodoItem 里有自己的 state（比如编辑状态、展开状态），
//       A 的 state 会被「传」给 B，因为 React 复用了同一个 DOM 节点。
//       B 的 state 被「传」给 C，C 的 state 直接丢了。

// ✅ key={todo.id} — 认数据不认位置
{todos.map(todo => (
  <TodoItem key={todo.id} todo={todo} />
))}
// 删了 id=1 → React 知道 id=1 的组件该卸了，id=2 和 id=3 的组件保持不变
```

### Key 的关键规则

| 规则 | 原因 |
|------|------|
| **Key 只对同层兄弟生效** | 全局唯一的 key 不会帮助跨层 diff |
| **Key 必须是稳定的** | 如果 key 每次渲染都变，React 会删除重建所有组件 |
| **不要用 `Math.random()` 当 key** | 每次渲染 key 都不同 → 每次渲染都全部删除重建 → 性能最差 + state 全丢 |
| **不要用 `index` 当 key** | 列表顺序变化时 state 错位 |
| **用数据里的唯一 ID** | `todo.id`、`user.id`、`item.slug` 是最好的 key |
| **Key 只对列表有意义** | 非列表的元素不需要 key |

---

## 六、State 保存与重置

### 核心规则

```
State 的生命周期取决于组件在 UI 树（不是 JSX 代码）里的位置。

React 对 state 的决定：

  相同类型 + 相同位置 ──→ 保留 State ✅
  不同类型 / 不同 key / 不同位置 ──→ 重置 State 🔄
```

### 心智模型

```
场景 1：相同类型 + 相同位置

<Counter />                      <Counter />
   位置：第一个子元素                 位置：第一个子元素（没变）
   类型：Counter                     类型：Counter（没变）
           ↕
       State 保留 ✅

───────────────────────────────────

场景 2：不同类型

<Counter />                      <div>切换了</div>
   类型：Counter                     类型：div（变了！）
           ↕
       State 重置 🔄 — 旧的 Counter 被卸载，div 是新组件

───────────────────────────────────

场景 3：相同类型 + 不同 key

<Counter key="a" />              <Counter key="b" />
   key="a"                          key="b"（变了！）
           ↕
       State 重置 🔄 — React 认为这是两个不同的组件实例

───────────────────────────────────

场景 4：组件在不同位置

<div>                             <section>
  <Counter />                       <Counter />  ← 位置变了
</div>                            </section>
           ↕
       State 重置 🔄 — 在 UI 树里的位置不同
```

### 代码示例

```jsx
function App() {
  const [showA, setShowA] = useState(true);

  return (
    <div>
      {/* 两种写法，state 的行为完全不同 */}

      {/* 写法 1：条件渲染 — State 会重置 */}
      {showA
        ? <Counter key="a" />
        : <Counter key="b" />    // key 不同 → React 卸载旧的，创建新的 → State 重置
      }

      {/* 写法 2：CSS 隐藏 — State 保留 */}
      <div style={{ display: showA ? 'block' : 'none' }}>
        <Counter />               {/* 一直在这里 → State 保留 */}
      </div>
    </div>
  );
}
```

### 如何刻意重置 State

| 方法 | 代码 | 原理 |
|------|------|------|
| **换 key** | `key={version}` | React 认 key 不认类型，key 变了就重建 |
| **换类型** | `{show ? <A/> : <div/>}` | 类型变了，整个子树重建 |
| **换位置** | 放在不同的父元素下 | 在 UI 树里的位置变了 |

### 如何刻意保留 State

| 方法 | 代码 | 原理 |
|------|------|------|
| **保持类型 + 位置** | 条件渲染时两边用相同类型 | `<A/>` 和 `<A/>` 是相同类型 |
| **CSS 隐藏代替卸载** | `display: none` | 组件没卸载，只是看不见 |
| **稳定 key** | `key={item.id}` | 列表重排序时 React 能认出是同一个组件 |

---

## 七、渲染全链路总结

```
用户点击按钮
      │
      ▼
handleClick() 调 setState(newValue)
      │
      ▼
┌─────────────────────────────────────────────┐
│ 第一站：Trigger                             │
│ React 标记这个组件需要重新渲染               │
│ （同一事件里的多次 setState 被批量处理）       │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│ 第二站：Render（纯计算，可中断）               │
│                                             │
│ 1. 重新执行组件函数 → 新 React Element Tree   │
│ 2. Reconciliation：和旧 Tree 做 diff         │
│    · 比较类型（不同 → 全换）                  │
│    · 比较 props（同类型 → 只更新改了的属性）     │
│    · 比较 key（同 key → 保留；新 key → 创建）  │
│ 3. 生成 DOM 操作清单                         │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│ 第三站：Commit（不可中断）                     │
│                                             │
│ 1. 按清单执行 DOM 操作                        │
│    · 创建新节点（createElement + appendChild） │
│    · 更新属性（setAttribute / className）     │
│    · 删除旧节点（removeChild）               │
│ 2. 浏览器重新绘制                            │
│ 3. 跑 useEffect（cleanup → effect）         │
└─────────────────────────────────────────────┘

全程中，只有需要改的 DOM 节点被触碰。
其他节点纹丝不动。
```
