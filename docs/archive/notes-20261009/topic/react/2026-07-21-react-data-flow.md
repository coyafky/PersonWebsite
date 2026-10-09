---
title: "React 数据流：组件之间怎样传递数据"
date: "2026-07-21"
summary: "React 组件树里，数据怎么从 A 组件传到 B 组件？这篇笔记用 5 张图覆盖 5 种核心模式：Props（父→子单向绑定）、Children（插槽式组合）、单向数据流（数据向下、事件向上）、状态提升（兄弟组件同步）、受控与非受控（谁握着方向盘）。每种模式都附带代码示例和判断标准，读完能回答「这个状态应该放在哪、通过什么方式传」。"
tags:
  - "React"
status: published
lang: zh
topic: react
englishSummary: "How does data travel between components in a React tree? This note uses 5 diagrams to cover 5 core patterns: Props (parent→child one-way binding), Children (slot composition), unidirectional data flow (data down, events up), lifting state up (sibling sync), and controlled vs uncontrolled (who holds the steering wheel). Each pattern includes code examples and judgment criteria."
---

# React 数据流：组件之间怎样传递数据

> 这是 React 学习笔记的第四篇。前面讲了心智模型、组件拆分、声明式和命令式。这一篇聚焦一个实际问题：**在组件树里，数据怎么从 A 传到 B？**

React 有 5 种核心的数据传递模式。这篇文章用 5 张图覆盖所有模式，每一张图对应一个你必须理解的概念。

---

## 一、Props：父组件向下发快递

### 心智模型

```
父组件
 ├── title:   "React 学习笔记"
 ├── price:   99
 └── image:   "/covers/react.png"
       │
       │  props（快递包裹）
       ▼
子组件（签收拆包）
```

**Props 就是父组件给子组件的「快递包裹」**。父组件把数据打包好（传 props），子组件签收拆包（用 props），但不能改包裹里的东西（只读）。

### 代码

```jsx
// 父组件 — 打包数据
function ProductPage() {
  const product = {
    title: 'React 学习笔记',
    price: 99,
    image: '/covers/react.png',
  };

  return <ProductCard
    title={product.title}    // ← 打包 title
    price={product.price}    // ← 打包 price
    image={product.image}    // ← 打包 image
  />;
}

// 子组件 — 签收拆包
function ProductCard({ title, price, image }) {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <span>¥{price}</span>
    </div>
  );
}
```

### 关键规则

| 规则 | 解释 |
|------|------|
| **只能父传子** | props 方向不可逆——子组件不能「push」数据给父组件 |
| **只读** | 子组件收到 props 后不能改它。`props.title = '新标题'` → React 直接报错 |
| **任何 JS 值都能传** | 字符串、数字、对象、数组、函数、JSX 元素——全都可以作为 props |
| **props 变化 → 子组件重渲染** | 父组件传入新的 props 引用 → React 重新执行子组件函数 |

### 传函数 = 给子组件一个「向上通知」的方式

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  return <Child onIncrement={() => setCount(count + 1)} />;
  //             ↑ 传一个函数下去
}

function Child({ onIncrement }) {
  return <button onClick={onIncrement}>+1</button>;
  //                  ↑ 子组件调用这个函数 → 父组件的 state 变化
}
```

**这不是「子组件改了父组件的 state」**。这是「父组件把自己的 setState 包成函数，交给子组件，子组件调用这个函数时，本质上是父组件自己在改自己的 state」。**数据所有权始终在父组件。**

---

## 二、Children：组件插槽

### 心智模型

```
<Card>
  <ProductInfo />
</Card>

         ↓ 等价于 ↓

Card 外壳
┌──────────────────────┐
│                      │
│   children 插槽       │
│   ┌──────────────┐   │
│   │ ProductInfo  │   │
│   └──────────────┘   │
│                      │
└──────────────────────┘
```

**Children 是 React 内置的特殊 prop**。你在组件标签之间写的东西，React 自动把它作为 `children` prop 传进去。**它让你可以「包住」任意内容，而不需要提前知道内容是什么。**

### 代码

```jsx
// 一个可以包住任何内容的卡片
function Card({ children }) {
  return (
    <div className="card">
      {children}    // ← 任意内容都会在这里渲染
    </div>
  );
}

// 使用：Card 不知道自己要包什么，完全由使用者决定
<Card>
  <h3>Hello</h3>
  <p>这段内容会出现在卡片里</p>
</Card>

<Card>
  <img src="/avatar.jpg" />
  <UserInfo name="Coya" />
</Card>
```

### Children vs Props：什么时候用哪个

```jsx
// 用 Props：内容的结构是固定的，只需要填充数据
function ProductCard({ title, price, image }) { ... }
<ProductCard title="书" price={99} image="/book.jpg" />

// 用 Children：内容的结构是不固定的，由使用者决定放什么
function Card({ children }) { ... }
<Card>
  <h3>书</h3>           ← 可以是任何结构
  <p>¥99</p>
  <button>购买</button>
</Card>
```

**判断标准**：如果组件对外只提供「数据填充」（标题、价格、图片），用 props。如果组件对外提供「结构容器」（卡片、弹窗、布局），用 children。

---

## 三、单向数据流：数据向下，事件向上

### 心智模型

```
数据向下流（瀑布）              事件向上冒（喷泉）

   App (state)                  ProductCard
      │                           ↑
      │ props                     │ onLike(id)
      ▼                           │
  ProductList                  ProductList
      │                           ↑
      │ props                     │ callback
      ▼                           │
  ProductCard                    App
```

**React 的数据流是单向的**：数据（state、props）只能从上往下流。子组件不能「推」数据给父组件——它只能通过**父组件传下来的回调函数**来「通知」父组件某件事发生了。

### 代码

```jsx
function App() {
  const [posts, setPosts] = useState([...]);

  function handleLike(id) {
    setPosts(posts.map(p =>           // ← 数据更新永远发生在 App
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    ));
  }

  // 数据向下 ↓                         事件向上 ↑
  return <PostList
    posts={posts}                       // ← 数据（向下）
    onLike={handleLike}                 // ← 回调（给子组件向上通知的通道）
  />;
}

function PostList({ posts, onLike }) {
  return posts.map(post =>
    <PostCard
      key={post.id}
      post={post}                       // ← 数据继续向下
      onLike={onLike}                   // ← 回调继续向下
    />
  );
}

function PostCard({ post, onLike }) {
  return (
    <div>
      <h3>{post.title}</h3>
      <button onClick={() => onLike(post.id)}>  // ← 调用回调（事件向上）
        点赞 {post.likes}
      </button>
    </div>
  );
}
```

### 为什么会这么设计

**如果是双向绑定**（Angular 1.x 风格），数据可以在任何地方被任何组件改——出问题时你找不到是谁在什么时候改的。**单向数据流下，state 的修改永远发生在一个明确的地方（setState 在哪个组件，数据就归属于哪个组件）。**

### 追踪数据变化的黄金法则

**看到一个 bug — 打开 React DevTools — 看 Components 面板 — 顺着组件树往下，找到这个数据来自哪个 state — 找到那个 setState 调用 — 这就是数据变化的唯一源头。**

如果是双向绑定，这条追踪链在第一环就断了。

---

## 四、状态提升：让兄弟组件共享数据

### 问题场景

两个兄弟组件需要共享同一份数据——比如 Panel A 的输入框需要和 Panel B 的显示区域同步：

```
错误做法：各自管理各自的状态

  Panel A [state: inputValue]     Panel B [state: displayValue]
      │                                │
      └──── 不同步！A 改了 B 不知道 ────┘

正确做法：把状态提到最近的共同父组件

         Parent [state: value]
          ↙              ↘
  Panel A                Panel B
  (读 value             (读 value
   调 onChange)          直接用)
```

**React 官方把这个操作叫 lifting state up（状态提升）**。核心思想：**需要共享的状态，放在需要它的所有组件的最近共同父组件里。**

### 代码

```jsx
// ❌ 错误：两个 Panel 各管各的 state — 永远不同步
function PanelA() {
  const [text, setText] = useState('');
  return <input value={text} onChange={e => setText(e.target.value)} />;
}
function PanelB() {
  const [text, setText] = useState('');
  return <p>{text}</p>;  // ← 和 Panel A 的 text 是两回事
}

// ✅ 正确：状态提升到父组件
function Parent() {
  const [text, setText] = useState('');    // ← 唯一的真值

  return (
    <div>
      <PanelA text={text} onTextChange={setText} />  // 数据向下
      <PanelB text={text} />                          // 数据向下
    </div>
  );
}

function PanelA({ text, onTextChange }) {
  return <input
    value={text}
    onChange={e => onTextChange(e.target.value)}  // 事件向上
  />;
}

function PanelB({ text }) {
  return <p>{text}</p>;
}
```

### 怎么找到「最近的共同父组件」

```
        App
         │
    ┌────┴────┐
  Header    Content
            ┌──┴──┐
          PanelA PanelB    ← 这两个需要共享 text
                            → text 放在 Content（最近的共同父组件）
```

### 什么时候该提，什么时候不该提

| 提 | 不提 |
|----|------|
| 两个兄弟组件确实依赖同一份数据 | 数据只在一个组件及其子组件里用 |
| 数据需要在 A 改、B 显示 | 数据可以各管各的，互不影响 |
| 不加提升，两个组件会不同步 | 提了之后，父组件塞进一个和它无关的 state |

**误判的成本**：你有一个 `isOpen` 状态，只在一个 Modal 里用，但你把它提到了 App 层——结果 App 每次打开 Modal 都要重渲染，连带所有子组件一起跑。**state 放在刚好够用的组件里，不多一层，不少一层。**

---

## 五、受控组件与非受控组件：谁握着方向盘

### 类比

```
受控组件 = 教练车 — 父组件握着方向盘
  ┌─────────────────┐
  │  value="hello"  │  ← 父组件告诉子组件"显示什么"
  │  onChange={fn}  │  ← 父组件监听子组件"用户做了什么"
  └─────────────────┘
  父组件决定一切，子组件只是执行。

非受控组件 = 自动驾驶 — 组件自己握着方向盘
  ┌─────────────────┐
  │ defaultValue="a"│  ← 初始值而已
  │  ref            │  ← 父组件需要时"问一下"当前值
  └─────────────────┘
  子组件自己管理状态，父组件需要时才取值。
```

### 代码对比

```jsx
// ── 受控组件 — 父组件握着方向盘 ──
function Parent() {
  const [name, setName] = useState('');

  return (
    <>
      <ControlledInput
        value={name}              // ← 父组件告诉子组件"显示什么"
        onChange={setName}        // ← 父组件监听"用户输入了什么"
      />
      <p>当前输入: {name}</p>      // ← 父组件永远知道最新值
    </>
  );
}

function ControlledInput({ value, onChange }) {
  return <input
    value={value}                // ← 值来自父组件
    onChange={e => onChange(e.target.value)}  // ← 通知父组件
  />;
}

// ── 非受控组件 — 组件自己握着方向盘 ──
function Parent() {
  const inputRef = useRef(null);

  function handleSubmit() {
    console.log(inputRef.current.value);  // ← 需要时才"问"
  }

  return (
    <>
      <UncontrolledInput defaultValue="初始值" ref={inputRef} />
      <button onClick={handleSubmit}>提交</button>
      {/* ↑ 父组件不知道实时值，只有提交时才知道 */}
    </>
  );
}

function UncontrolledInput({ defaultValue, ref }) {
  return <input defaultValue={defaultValue} ref={ref} />;
  //                ↑ 初始值                        ↑ ref 让父组件能"问"
}
```

### 选择标准

| 场景 | 用哪种 | 原因 |
|------|--------|------|
| **需要实时验证**（输入时即时显示错误） | 受控 | 父组件需要知道每个字符 |
| **两个输入框联动**（A 变化时 B 也跟着变） | 受控 | 父组件需要协调两个输入 |
| **提交时一次性取值**（简单的搜索框） | 非受控 | 不需要实时值，简单就好 |
| **表单字段很多**（15+ 字段） | 非受控 | 每个都受控会导致大量无意义的重渲染 |
| **即时格式化**（信用卡号加空格、手机号加分隔符） | 受控 | 每个字符输入后需要立即格式化 |

**默认写受控组件**。React 文档和社区都推荐受控作为默认选择——它让数据流保持单向、可预测。只在两种情况下退到非受控：性能敏感（字段太多）或者你真的不需要实时值（提交时一次性读）。

---

## 六、五种模式的决策树

遇到「数据怎么传」的问题时，按这个顺序问自己：

```
1. 数据只在一个组件内部用？
   → useState，不需要传。结束。

2. 父→子，单向传数据？
   → Props。结束。

3. 父组件需要「包住」不确定的内容？
   → Children。结束。

4. 兄弟组件需要共享同一份数据？
   → 找最近的共同父组件，状态提升。结束。

5. 表单输入：需要实时验证/联动/格式化？
   → 受控组件（value + onChange）。
   不需要？→ 非受控组件（defaultValue + ref）。
```

---

## 七、总结：一张总览图

```
数据流向总览

                    App (state)
                      │
          ┌───────────┼───────────┐
          │           │           │
      props ↓    props ↓     props ↓
     Header    Content      Footer
                 │
         ┌───────┴───────┐
         │  props + 回调  │
     props ↓    onEvent ↑ │
    PanelA             PanelB
   (受控)              (children 插槽)
    │
    │ 状态提升：
    │ 需要同步的 state 放在
    │ 最近的共同父组件 (Content)
```

**数据永远向下流（props）**。事件通知永远向上冒（onClick / onChange / onXxx 回调）。**这两个方向加起来，构成了 React 应用中所有的数据传递路径。** 没有第三条路——没有兄弟组件之间直接传数据、没有子组件推数据给父组件、没有全局变量随意读写。正是这个严格的约束，让 React 应用在变大之后依然可追踪、可调试。
