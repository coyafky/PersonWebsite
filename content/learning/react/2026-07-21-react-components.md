---
title: "React 组件：拆分、组合和复用 UI 的基本单元"
date: "2026-07-21"
summary: "组件是 React 最小的建筑单元。这篇笔记从「为什么需要组件」出发，拆解组件的本质（函数 + props → JSX）、组件的组合模式（children、组合 vs 继承）、组件的渲染规则（纯函数、props 不变则输出不变）、以及 5 种日常高频组件模式（受控/非受控、组合组件、render props、HOC、Slot）。目标是：不是为了学 API，而是为了建立「如何拆组件」的判断力。"
tags:
  - React
  - 组件
  - props
  - 组合
  - 设计模式
status: published
lang: zh
topic: react
englishSummary: "Components are React's smallest building block. This note starts from 'why components', then unpacks component essence (function + props → JSX), composition patterns (children, composition over inheritance), rendering rules (pure functions, same props → same output), and 5 high-frequency component patterns (controlled/uncontrolled, compound components, render props, HOC, Slot pattern). The goal is not API memorization, but developing judgment on how to split components."
---

# React 组件：拆分、组合和复用 UI 的基本单元

> 这是 React 学习笔记的第二篇。上一篇建立了心智模型（UI = f(state)），这一篇聚焦 f 的载体——组件。读完你应该能回答：「这段代码应该拆成一个组件吗？」「拆到哪一层？」「用什么方式组合？」

## 一、为什么需要组件：一个你想先想通的问题

### 1.1 没有组件时

```jsx
// 一个页面上的「用户卡片」出现了 3 次
<div>
  <!-- 卡片 1 -->
  <div class="card">
    <img src="/avatars/alice.jpg" />
    <h3>Alice</h3>
    <p>Frontend Engineer</p>
    <button>关注</button>
  </div>

  <!-- 卡片 2 -->
  <div class="card">
    <img src="/avatars/bob.jpg" />
    <h3>Bob</h3>
    <p>Backend Engineer</p>
    <button>关注</button>
  </div>

  <!-- 卡片 3 — 又复制了一遍 -->
  <div class="card">
    <img src="/avatars/charlie.jpg" />
    <h3>Charlie</h3>
    <p>Designer</p>
    <button>关注</button>
  </div>
</div>
```

**问题**：
- 改了卡片样式 → 3 个地方都要改
- 想加一个「已关注」状态 → 3 个地方都要加逻辑
- 想写测试 → 没有独立的单元可以测，只能测整个页面

### 1.2 抽成组件

```jsx
function UserCard({ name, role, avatar }) {
  const [followed, setFollowed] = useState(false);

  return (
    <div className="card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{role}</p>
      <button onClick={() => setFollowed(!followed)}>
        {followed ? '已关注' : '关注'}
      </button>
    </div>
  );
}

// 使用
<UserCard name="Alice" role="Frontend" avatar="/avatars/alice.jpg" />
<UserCard name="Bob"   role="Backend"  avatar="/avatars/bob.jpg" />
<UserCard name="Charlie" role="Designer" avatar="/avatars/charlie.jpg" />
```

**组件给了你三样东西**：
1. **封装**：样式 + 行为 + 状态打包在一起，一个组件 = 一个独立单元
2. **复用**：传不同的 props，同一个组件结构产生不同内容
3. **可测试**：`render(<UserCard name="Alice" />)` 就够了，不需要渲染整个页面

## 二、组件的本质：函数

### 2.1 函数组件 = 纯函数 + JSX 返回值

```jsx
// 一个组件就是一个函数
function Greeting(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 箭头函数也行
const Greeting = ({ name }) => <h1>Hello, {name}</h1>;
```

**入参**：`props`（父组件传下来的数据）。
**出参**：JSX（React 用来构建 Virtual DOM 的指令）。
**规则**：同一个 props 传入，应该返回同样的 JSX。React 把组件当成「纯函数」来优化——如果 props 没变，React 可能会跳过重渲染。

### 2.2 props：组件和外界唯一的通信通道

```jsx
// props 可以是任何 JS 值
<ArticleCard
  title="Hello"              // string
  likes={42}                 // number
  isPublished={true}          // boolean
  author={{ name: "Coya" }}  // object
  tags={["react", "web"]}     // array
  onLike={(id) => {...}}      // function
  footer={<span>❤</span>}    // JSX（ReactElement）
/>
```

**关键规则**：

| 规则 | 为什么 |
|------|--------|
| props 是**只读**的 | 如果你在子组件里 `props.name = 'hack'`，React 会报错。单向数据流的基础就是「子组件不能改 props」 |
| props 变化 → 组件重渲染 | 这是 React 的默认行为。父组件传入的 props 变了，子组件重新跑一遍函数 |
| 传函数给子组件 = 让子组件「向上通信」 | `onLike` 不是「子组件改了父组件的 state」，而是「子组件告诉父组件：用户点了赞，你来处理」 |

### 2.3 一个函数组件的完整解剖

```jsx
function ArticleCard({ article, onLike }) {
  //  ┌── 1. 局部状态（组件私有的记忆）
  const [expanded, setExpanded] = useState(false);

  //  ┌── 2. 副作用（和外部世界交互）
  useEffect(() => {
    document.title = `在看: ${article.title}`;
  }, [article.title]);

  //  ┌── 3. 事件处理（用户交互 → 状态变化）
  function handleToggle() {
    setExpanded(prev => !prev);
  }

  //  ┌── 4. JSX 返回值（UI 描述）
  return (
    <div className="card">
      <h3>{article.title}</h3>
      {expanded && <p>{article.content}</p>}
      <button onClick={handleToggle}>
        {expanded ? '收起' : '展开'}
      </button>
      <button onClick={() => onLike(article.id)}>
        点赞 {article.likes}
      </button>
    </div>
  );
}
```

**一个组件内部有 4 层**：局部 state（记忆）、effect（副作用）、事件处理（交互）、JSX（UI 描述）。**每次渲染，这 4 层从上到下完整跑一遍。**

## 三、组件组合：children 和「组合优于继承」

### 3.1 children — React 最常用的组合方式

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// 使用
<Card>
  <h3>Hello</h3>
  <p>这是卡片内容</p>
</Card>
```

`children` 是 React 内置的 prop——你在组件标签之间写的东西，会被自动传进来。**它让组件可以「包住」任意内容，而不需要提前知道内容是什么。**

### 3.2 组合 vs 继承

React 社区有一个强共识：**不要用继承来扩展组件，用组合。**

```jsx
// ❌ 继承 — React 不推荐
class SpecialCard extends Card { ... }

// ✅ 组合 — React 的标准做法
function SpecialCard({ title, children }) {
  return (
    <Card>
      <div className="special-badge">精选</div>
      <h3>{title}</h3>
      {children}
    </Card>
  );
}
```

**为什么组合优于继承**：
- 继承会带来层级依赖（子类依赖父类的实现细节），改了父类可能破坏所有子类
- 组合的依赖关系是显式的（通过 props 传入），接口清晰，不依赖内部实现
- React 的 `children` + props 模式天然支持任意嵌套

### 3.3 三种 children 的使用模式

```jsx
// 模式 1：透传 children — 布局类组件
function PageLayout({ children }) {
  return (
    <div className="page">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

// 模式 2：多个 children slot — 命名插槽
function SplitPane({ left, right }) {
  return (
    <div className="split-pane">
      <div className="left">{left}</div>
      <div className="right">{right}</div>
    </div>
  );
}

<SplitPane
  left={<ContactList />}
  right={<ChatBox />}
/>

// 模式 3：children 作为函数 — render props（后面会深入）
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);
  }, [url]);
  return children(data);  // ← children 是函数
}

<DataFetcher url="/api/users">
  {data => data ? <UserList users={data} /> : <Spinner />}
</DataFetcher>
```

## 四、组件渲染：什么触发了它

### 4.1 三个重渲染触发条件

```
组件重新渲染（函数重新执行）当且仅当：

1. 父组件传的 props 引用变了
2. 自己内部的 state 通过 setState 变了
3. 自己订阅的 context 值变了
```

### 4.2 props 的「引用变了」陷阱

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ 每次 Parent 渲染，这个对象都是新引用 → Child 必重渲染
  return <Child style={{ color: 'red' }} />;

  // ✅ 抽到组件外面，引用不变 → Child 不会无谓重渲染
  const style = useMemo(() => ({ color: 'red' }), []);
  return <Child style={style} />;
}
```

### 4.3 React.memo：跳过纯渲染

```jsx
const Child = React.memo(function Child({ name }) {
  console.log('Child 渲染了');
  return <div>{name}</div>;
});

// props 没变 → Child 不会重新执行
<Child name="Coya" />  // 只渲染一次
<Child name="Coya" />  // memo 发现 props 没变 → 跳过
<Child name="Bob" />   // props 变了 → 重新渲染
```

**memo 的原理**：React 在渲染前做一次浅比较——如果所有 props 的引用都和上次一样，就跳过这次渲染。**它解决的是「父组件重渲染导致所有子组件跟着跑一遍」的性能浪费。**

## 五、5 种高频组件模式

### 模式 1：受控组件 vs 非受控组件

```jsx
// 受控组件 — state 在父组件，子组件只负责显示 + 通知
function ControlledInput({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}

// 使用
const [text, setText] = useState('');
<ControlledInput value={text} onChange={setText} />

// ─────────────────────────────────

// 非受控组件 — state 在子组件内部，用 ref 拿值
function UncontrolledInput({ defaultValue }) {
  const inputRef = useRef(null);
  return <input ref={inputRef} defaultValue={defaultValue} />;
}
```

| | 受控 | 非受控 |
|---|---|---|
| **state 在哪** | 父组件 | 子组件内部 |
| **获取值** | `value` prop 实时同步 | `ref.current.value` 需要时才拿 |
| **适用场景** | 表单需要实时验证、联动 | 简单的「提交时拿一次值」 |

**默认写受控组件**。受控组件是 React 单向数据流的自然延伸——所有 state 在一处管理，不分散。

### 模式 2：组合组件（Compound Components）

```jsx
// 一个 Tabs 组件，拆成多个子组件，通过 context 隐式通信
function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
}

Tabs.TabList = function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
};

Tabs.Tab = function Tab({ id, children }) {
  const { active, setActive } = useTabsContext();
  return (
    <button
      className={active === id ? 'active' : ''}
      onClick={() => setActive(id)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ id, children }) {
  const { active } = useTabsContext();
  return active === id ? <div>{children}</div> : null;
};

// 使用 — 极其自然的声明式写法
<Tabs defaultTab="react">
  <Tabs.TabList>
    <Tabs.Tab id="react">React</Tabs.Tab>
    <Tabs.Tab id="vue">Vue</Tabs.Tab>
  </Tabs.TabList>
  <Tabs.Panel id="react">React 很牛</Tabs.Panel>
  <Tabs.Panel id="vue">Vue 也很牛</Tabs.Panel>
</Tabs>
```

**这个模式的核心思想**：子组件之间通过 `context` 隐式通信，使用者不需要手动管理 `active` 状态。看起来像原生 HTML（`<select>` + `<option>`），但背后是 React 组件的强大组合能力。

### 模式 3：Render Props

```jsx
function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return children(pos);  // ← 把状态当参数传给 children 函数
}

// 使用 — 使用者决定怎么渲染，MouseTracker 只负责提供数据
<MouseTracker>
  {({ x, y }) => (
    <p>鼠标位置: ({x}, {y})</p>
  )}
</MouseTracker>
```

**Render Props 的本质**：把一个「怎么渲染」的决定权从组件内部交给使用者。`MouseTracker` 负责追踪鼠标，但鼠标坐标怎么展示（文本？坐标图？小猫图片跟随？）由使用者通过 children 函数决定。

### 模式 4：高阶组件（HOC）

```jsx
// HOC = 一个函数，输入一个组件，输出一个增强后的组件
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();

    if (loading) return <Spinner />;
    if (!user) return <Redirect to="/login" />;

    return <Component {...props} user={user} />;
  };
}

// 使用
const ProtectedDashboard = withAuth(Dashboard);
<ProtectedDashboard />  // 自动检查登录状态
```

**HOC vs Render Props**：
- HOC：逻辑复用，在组件「外面」包装（对原组件透明）
- Render Props：逻辑复用，在组件「里面」注入数据（对使用者透明）

**2026 年的趋势**：大部分 HOC 和 Render Props 的场景可以被自定义 Hooks 替代。Hooks 更轻、没有嵌套地狱、类型推导更好。

### 模式 5：Slot 模式（多内容注入点）

```jsx
function Card({ header, children, footer }) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

<Card
  header={<h3>标题</h3>}
  footer={<button>操作</button>}
>
  <p>卡片正文内容 — 这是 children</p>
</Card>
```

**比用一个 props 传内容更自然**——你可以一眼看出卡片的三个部分，而不是在 children 里用 CSS 区分。

## 六、组件设计的判断框架

面对一个 UI，问三个问题来决定怎么拆：

```
1. 这个部分会重复出现吗？
   → 是 → 抽成组件。否 → 看问题 2。

2. 这个部分有自己独立的状态吗？
   （展开/收起、选中/未选中、输入框的值...）
   → 是 → 抽成组件，把状态封在里面。

3. 这个部分复杂到影响主组件的可读性了吗？
   （超过 150 行、嵌套超过 4 层）
   → 是 → 抽成组件，用 props 传数据进去。
```

**不要过度拆分**。如果一个部分只出现一次、没有独立状态、就 5 行代码——留在原地比单独一个文件好。**组件拆分是为了降低复杂度，不是为了制造文件数量。**
