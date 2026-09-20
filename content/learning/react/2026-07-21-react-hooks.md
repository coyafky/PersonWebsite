---
title: "React Hooks 工具箱：从记忆到副作用的完整地图"
date: "2026-07-21"
summary: "Hooks 是 React 16.8 之后组件逻辑的核心载体。这篇笔记先给一张总图（5 大类 10 个 Hooks 的用途和关系），然后用 9 张图逐一拆解：useState（记事本）、useReducer（调度中心）、useContext（广播塔）、useReducer+Context（总部系统）、useRef（储物柜）、useEffect（外部世界同步器）、「你可能不需要 Effect」判断树、useMemo/useCallback（工厂缓存）、Custom Hook（工具包）。读完你能回答「这个场景该用哪个 Hook」。"
tags:
  - "React"
status: published
lang: zh
topic: react
englishSummary: "Hooks are the core carrier of component logic since React 16.8. This note starts with a big-picture map (5 categories, 10 Hooks), then uses 9 diagrams to unpack each one: useState (notepad), useReducer (dispatch center), useContext (broadcast tower), useReducer+Context (headquarters system), useRef (locker), useEffect (external world synchronizer), 'You might not need Effect' decision tree, useMemo/useCallback (factory cache), and Custom Hook (toolkit bag). After reading, you'll know which Hook to reach for in any scenario."
---

# React Hooks 工具箱：从记忆到副作用的完整地图

> 这是 React 学习笔记的第七篇。前面讲了心智模型、组件、声明式、数据流、State、渲染机制。这一篇把所有 Hooks 放在一张地图上——不逐个背 API，而是理解每个 Hook 解决什么问题、什么时候用它、以及它们之间的关系。

---

## 零、Hooks 工具箱总图

```
React Hooks 工具箱

记忆类（让组件「记住」东西）
├── useState         → 简单值（开关、计数、输入框）
├── useReducer       → 复杂状态逻辑（多字段表单、购物车）
└── useRef           → 记住但不触发渲染（DOM 引用、定时器 ID、上一次值）

数据共享类（跨组件传递数据）
├── useContext       → 跨层传递 props（主题、语言、用户信息）
└── useSyncExternalStore → 订阅外部 store（Redux、Zustand 底层用的就是这个）

副作用类（和 React 之外的世界交互）
├── useEffect        → 网络请求、订阅、DOM 操作、计时器
└── useLayoutEffect  → 在浏览器绘制之前同步执行（读布局尺寸）

性能类（控制「什么时候该重新算」）
├── useMemo          → 缓存计算结果（避免每次渲染都重算）
├── useCallback      → 缓存函数引用（避免子组件不必要重渲染）
└── useTransition    → 标记低优先级更新（保持 UI 响应）

复用类（把多个 Hook 打包）
└── Custom Hook      → 复用状态逻辑，不是复用状态本身
```

**关键区分**：Ref 更新不会触发组件重新渲染。State 更新会。这是 useRef 和 useState 最本质的区别。

---

## 一、useState：记事本

### 心智模型

```
组件需要「记住」简单信息
          │
          ▼
       useState

就像一个记事本，组件在上面写了什么，
下次渲染时还能看到。

适用场景：
  开关（isOpen）        输入框（text）
  当前选项（selectedTab） 数量（count）
  展开状态（expanded）   加载状态（loading）
```

### 代码

```jsx
// 每一个 useState 就是记事本上的一项
function ChatRoom() {
  const [messages, setMessages] = useState([]);     // 记1：聊天记录
  const [inputText, setInputText] = useState('');   // 记2：输入框内容
  const [isConnected, setIsConnected] = useState(false); // 记3：连接状态
  const [showEmoji, setShowEmoji] = useState(false);     // 记4：表情面板

  // 每次渲染，React 把这 4 个值原样交还给你
}
```

### useState 的三个常识

```
1. 初始值只在第一次渲染时使用
   useState(getExpensiveValue())  ← ❌ 每次渲染都跑
   useState(() => getExpensiveValue())  ← ✅ 惰性初始化，只跑第一次

2. setState 安排重渲染，不改变当前值
   setCount(5)
   console.log(count) // 还是旧值 → 变化在下一次渲染

3. 新值基于旧值 → 用函数式更新
   setCount(c => c + 1)  ← React 保证 c 是最新值
```

---

## 二、useReducer：状态处理中心

### 心智模型

```
UI 发出 Action（用户的意图）
      │
      ▼
{ type: "ADD_PRODUCT", payload: { id, name } }
      │
      ▼
┌──────────────┐
│   Reducer    │  ← 一个纯函数，描述「旧 state + action → 新 state」
│              │
│ (state,      │
│  action)     │
│  → newState  │
└──────┬───────┘
       │
       ▼
  新 State
       │
       ▼
   UI 更新
```

**Reducer 适合把复杂状态更新逻辑集中到一个函数中。** 当多个操作以不同方式修改同一块 state 时，把修改逻辑集中在 reducer 里比分散在多个事件处理函数中更清晰。

### useState vs useReducer 的选择

```jsx
// ── useState：简单状态，各自独立 ──
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [age, setAge] = useState(0);

// ── useReducer：多个字段经常一起变，逻辑复杂 ──
const [form, dispatch] = useReducer(formReducer, {
  name: '', email: '', age: 0,
});

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return { name: '', email: '', age: 0 };
    case 'LOAD_DRAFT':
      return action.draft;
    default:
      return state;
  }
}

// 使用 — 意图很清晰
dispatch({ type: 'SET_FIELD', field: 'name', value: 'Coya' });
dispatch({ type: 'RESET' });
```

| useState | useReducer |
|----------|-----------|
| 状态独立，一个 state 一个 setter | 多个状态经常联动修改 |
| 更新逻辑简单，散落在事件处理函数中 | 更新逻辑集中在一个 reducer 函数里 |
| 适合 1-3 个简单 state | 适合复杂表单、购物车、多步骤流程 |

---

## 三、useContext：广播塔

### 心智模型

```
         ThemeProvider（广播塔）
              │
            📡 广播：theme = "dark"
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
  Header    Page     Footer
  （收到）  （收到）  （收到）

不需要通过 props 一层层传递。
任何后代组件都能直接「收听」广播。
```

### 它解决什么问题

```jsx
// ❌ 没有 Context：props 逐层传递 — props drilling
<App>                           // theme 在这
  <Header theme={theme} />      // 传一次
  <Page theme={theme}>          // 传一次
    <Sidebar theme={theme} />   // 传一次
    <Content theme={theme}>     // 传一次
      <Article theme={theme} /> // 传一次 — Header 根本不需要 theme，
                                //         但它被逼着传了一路
    </Content>
  </Page>
</App>

// ✅ 有 Context：需要的组件自己拿
<ThemeProvider value={theme}>   // 在这广播
  <Header />                    // 不传了
  <Page>
    <Sidebar />
    <Content>
      <Article />               // 自己用 useContext 接收
    </Content>
  </Page>
</ThemeProvider>
```

### Context 不是状态管理的替代品

```
Context 解决的是：
  "我不想把 props 传 5 层才到真正需要它的组件"

Context 不解决的是：
  "我有 20 个组件、50 个 state 需要协同管理"
  → 这时候需要 Zustand / Redux 这类状态管理库

Context 的局限：
  - 值变了，所有用这个 Context 的组件都会重渲染
  - 没有 selector 机制（不能只订阅一部分数据）
  - 不适合高频更新的数据
```

---

## 四、useReducer + Context：总部调度系统

### 心智模型

```
Context：把 state 和 dispatch「广播」到各部门
Reducer：集中处理所有修改规则

         ┌──────────────────┐
         │   总部 (Provider) │
         │                  │
         │  state           │  ← 全局共享的数据
         │  dispatch        │  ← 各部门发送 action 的通道
         └──────┬───────────┘
                │
      ┌─────────┼─────────┐
      ▼         ▼         ▼
   任务部    库存部    报表部
  （可以发     （可以发     （可以读
   action）    action）    state）
```

### 代码

```jsx
// 1. 定义 Reducer + Context
const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'ADD':
      return [...tasks, { id: Date.now(), text: action.text, done: false }];
    case 'TOGGLE':
      return tasks.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case 'DELETE':
      return tasks.filter(t => t.id !== action.id);
    default:
      return tasks;
  }
}

// 2. Provider — 广播 state + dispatch
function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

// 3. 自定义 Hook — 封一层，组件不用直接碰 Context
function useTasks() {
  return useContext(TasksContext);
}
function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

// 4. 组件使用
function TaskList() {
  const tasks = useTasks();              // 只读数据
  const dispatch = useTasksDispatch();   // 只发指令
  // ...
}
```

**这个模式把一个页面的状态管理打包成了自包含的「微系统」**：Provider 提供数据，Reducer 处理逻辑，自定义 Hook 提供接口。组件只需要 `useTasks` 和 `useTasksDispatch`——不知道 Context 和 Reducer 的存在。

---

## 五、useRef：储物柜

### 心智模型

```
┌─────────────────────────────┐
│         useRef              │
│                             │
│  ┌───┐ ┌──────┐ ┌────────┐ │
│  │DOM│ │定时器│ │上一次值│ │
│  └───┘ └──────┘ └────────┘ │
│                             │
│  保存那些「需要记住，        │
│  但不影响 UI」的东西         │
└─────────────────────────────┘

State 改变 → 触发渲染 🔄
Ref 改变   → 不触发渲染 🔇
```

### 四个经典用途

```jsx
function Demo() {
  // 1. 引用 DOM 元素
  const inputRef = useRef(null);
  function focusInput() {
    inputRef.current.focus();  // 直接操作 DOM
  }

  // 2. 保存定时器 ID
  const timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setInterval(() => {}, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // 3. 保存上一次的值
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(count);
  useEffect(() => {
    prevCountRef.current = count;  // 渲染后更新
  });
  // prevCountRef.current 永远是上一次渲染的 count

  // 4. 保存「不影响 UI 但需要跨渲染持久化」的数据
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      console.log('首次渲染！');
    }
  });
}
```

### Ref vs State

| | State | Ref |
|---|---|---|
| **变化时触发渲染** | ✅ | ❌ |
| **可变（mutable）** | ❌ 不可变更新 | ✅ 直接 `.current = xxx` |
| **渲染期间可读** | ✅ 渲染快照值 | ⚠️ 读的是最新值（不是快照） |
| **用途** | 驱动 UI 的数据 | 不驱动 UI 的持久数据 |

---

## 六、useEffect：外部世界同步器

### 心智模型

```
   React 世界                    外部世界
  ┌───────────┐               ┌───────────┐
  │           │               │           │
  │  State    │──同步──→      │ 网络请求   │
  │  Props    │               │ DOM API   │
  │  UI       │               │ 视频播放   │
  │           │               │ 第三方库   │
  │           │   ←──数据──   │ 浏览器API  │
  └───────────┘               └───────────┘

  Effect 是连接 React 和外部世界的桥。
  它的主要作用是「同步」，不是「所有逻辑都放进去」。
```

### 代码

```jsx
function VideoPlayer({ src, isPlaying }) {
  const videoRef = useRef(null);

  // Effect：把 React state 同步到外部系统（video DOM 元素）
  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();   // video 是外部系统
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);              // isPlaying 变了 → 重新同步

  return <video ref={videoRef} src={src} />;
}
```

### 依赖数组的三个模式

| 依赖 | 行为 | 使用场景 |
|------|------|---------|
| `useEffect(fn)` — 无依赖 | 每次渲染后都跑 | 极少用 |
| `useEffect(fn, [])` — 空数组 | 只在 mount 后跑一次 | 连接外部服务、加全局事件监听 |
| `useEffect(fn, [a, b])` — 有依赖 | 依赖变化时跑 | 同步 props/state 到外部系统 |

### cleanup 函数：避免内存泄漏

```jsx
useEffect(() => {
  // 建立连接 / 订阅
  const connection = createConnection(serverUrl, roomId);
  connection.connect();

  // 返回 cleanup 函数
  return () => {
    connection.disconnect();  // 下次 effect 跑之前 / 组件卸载时执行
  };
}, [roomId]);  // roomId 变了 → cleanup 旧连接 → 建新连接
```

---

## 七、你可能不需要 Effect

### 心智模型

```
拿到一个需求后，先问自己：

        这个逻辑是否在同步外部系统？
                    │
            ┌───────┴───────┐
            │               │
           是               否
            │               │
            ▼               ▼
      可能用 Effect     不要急着用 Effect
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
     渲染中直接     放进事件       使用 key
     计算即可      处理函数       重置状态
          │             │             │
          ▼             ▼             ▼
      const        onClick={     <Comp
      result =      () => {      key={id}
      items.        addItem()    />
      filter(...)   }
```

**React 官方明确建议：如果没有外部系统参与，仅仅是根据 props 或 state 计算数据，通常不需要 Effect。**

### 三种「不该用 Effect」的场景

```jsx
// ❌ 场景 1：渲染中可以直接计算的值
function TodoList({ todos, filter }) {
  const [visibleTodos, setVisibleTodos] = useState([]);

  // ❌ 用 Effect 过滤
  useEffect(() => {
    setVisibleTodos(todos.filter(t => matchesFilter(t, filter)));
  }, [todos, filter]);

  // ✅ 直接在渲染中计算
  const visibleTodos = todos.filter(t => matchesFilter(t, filter));
}

// ❌ 场景 2：事件处理中可以做的事
function ProductPage({ productId }) {
  // ❌ 用 Effect 同步到分析系统
  useEffect(() => {
    analytics.track('view', { productId });
  }, [productId]);

  // ✅ 在事件处理函数里做
  function handleBuy() {
    analytics.track('purchase', { productId });  // 用户行为 → 事件处理
    buy(productId);
  }
}

// ❌ 场景 3：可以用 key 重置的状态
function Profile({ userId }) {
  const [bio, setBio] = useState('');

  // ❌ 用 Effect 在 userId 变化时重置 bio
  useEffect(() => {
    setBio('');
  }, [userId]);

  // ✅ 用 key 让 React 自动重建组件
  return <EditProfile key={userId} />;
  // key 变了 → React 卸载旧组件 → 创建新组件 → bio 自动重置为 ''
}
```

### Effect 的「正当用途」清单

| 能放进 Effect 的 | 不能放进 Effect 的 |
|-----------------|-------------------|
| 连接外部服务（WebSocket、数据库） | 渲染中可以直接算出的值 |
| 操作 DOM（focus、scroll、measure） | 响应用户操作（放事件处理函数） |
| 订阅/取消订阅 | 重置子组件 state（用 key） |
| 第三方库集成（D3、地图、图表） | 组件间通信（用 state 提升） |
| 全局事件监听 | 数据变换/过滤（渲染中直接做） |

---

## 八、useMemo 与 useCallback：工厂缓存

### 心智模型

```
useMemo — 缓存「计算结果」

  输入 [a, b, c]
       │
       ▼
  ┌──────────┐
  │ 昂贵计算  │  →  结果 X
  └──────────┘
       │
  依赖 [a, b] 没变？
       │
   是 → 直接返回缓存的 X（不重算）
   否 → 重新计算

───────────────────────────────────

useCallback — 缓存「函数本身」

  依赖 [a, b] 没变？
       │
   是 → 返回同一个函数引用
   否 → 创建新函数

fn === fn  // true（依赖没变时）
```

### 代码

```jsx
function ProductList({ products, minPrice }) {
  // useMemo：缓存过滤结果
  // 只有当 products 或 minPrice 变化时才重新过滤
  const filtered = useMemo(
    () => products.filter(p => p.price >= minPrice),
    [products, minPrice]
  );

  // useCallback：缓存函数引用
  // 只有当依赖变化时才创建新函数
  // 配合 React.memo 使用时，避免子组件因为「函数引用变了」而无谓重渲染
  const handleBuy = useCallback(
    (id) => {
      console.log('购买', id);
      checkout(id);
    },
    []  // 没有依赖 → 函数引用永远不变
  );

  return filtered.map(p =>
    <ProductCard key={p.id} product={p} onBuy={handleBuy} />
  );
}

// 子组件用 memo 包裹
const ProductCard = React.memo(function ProductCard({ product, onBuy }) {
  // 只有 product 或 onBuy 引用变化时才重渲染
  return <div onClick={() => onBuy(product.id)}>{product.name}</div>;
});
```

### 什么时候用，什么时候不用

| 用 | 不用 |
|----|------|
| 计算明显需要时间（复杂排序、大数据过滤） | 简单计算（`a + b`，`arr.map(...)`） |
| 传给 `React.memo` 的子组件作为 prop | 子组件本来就会因为其他原因重渲染 |
| 作为其他 Hook 的依赖（useEffect、useMemo） | 普通的事件处理函数 |
| 计算结果在多次渲染间引用需要稳定 | 每次渲染重新创建的成本可以忽略 |

**不要在每个函数上包裹 `useCallback`**。`useCallback` 和 `useMemo` 本身也有开销——创建依赖数组、比较依赖是否变化。对于轻量计算，不做缓存比做缓存更快。

---

## 九、Custom Hook：把几个工具装进工具包

### 心智模型

```
useState    ─┐
useEffect   ─┤
useCallback ─┤
              ├──→ 封装成一个 Custom Hook
useRef      ─┤        ↓
              │   useOnlineStatus()
              │   useWindowSize()
              │   useLocalStorage()
useMemo     ─┘   useDebounce()

复用的是「状态逻辑」，不是「状态本身」。
每个组件调用同一个 Custom Hook，
各自拥有一份独立的状态。
```

### 代码

```jsx
// 把多个 Hook 打包成一个有意义的工具
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline()  { setIsOnline(true); }
    function handleOffline() { setIsOnline(false); }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// 使用 — 极其简洁
function App() {
  const isOnline = useOnlineStatus();
  return <div>{isOnline ? '在线' : '离线'}</div>;
}

// 多个组件调用 — 各自独立
function Header() {
  const isOnline = useOnlineStatus();  // Header 自己的 isOnline
  // ...
}
function Footer() {
  const isOnline = useOnlineStatus();  // Footer 自己的 isOnline
  // 两个 isOnline 是独立的 state，互不影响
}
```

### Custom Hook 的命名和规则

| 规则 | 原因 |
|------|------|
| **以 `use` 开头** | React 靠这个前缀检查 Hooks 规则 |
| **内部可以调其他 Hook** | 这就是 Custom Hook 存在的意义——组合 |
| **返回有用信息** | 返回 state、函数、ref——调用方只需要知道「能拿到什么」 |
| **每个实例独立** | 头像的 `useOnlineStatus` 和页脚的 `useOnlineStatus` 各有各的 state |

---

## 十、Hooks 决策矩阵

遇到一个需求，按顺序问自己：

```
1. 组件需要「记住」信息吗？
   ├── 简单值 → useState
   ├── 复杂状态逻辑（多字段联动）→ useReducer
   └── 记住但不触发渲染 → useRef

2. 数据需要跨多个层级传递吗？
   ├── 只是避免 props 层层传递 → useContext
   └── 复杂共享状态 + 高频更新 → Zustand / Redux（不是 Context 的活）

3. 需要和 React 之外的世界交互吗？
   ├── 是的，需要同步外部系统 → useEffect
   └── 不是，只是在组件内计算或响应用户操作 → 不要用 Effect

4. 需要优化性能吗？
   ├── 计算很昂贵 → useMemo
   ├── 函数引用需要稳定（传给 memo 的子组件）→ useCallback
   └── 不是性能瓶颈 → 不需要这两个

5. 多段逻辑需要复用吗？
   ├── 是的，在多个组件间复用「状态逻辑」→ Custom Hook
   └── 只在一个组件里用 → 直接写 Hook 即可
```
