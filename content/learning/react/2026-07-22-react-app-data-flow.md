---
title: "React 应用中的数据流：从本地状态到服务器数据"
date: "2026-07-22"
summary: "前面的笔记讲了 React 的组件、State、Hooks 和渲染机制——都是「零件」层面的知识。这篇把视角升到「应用」层面：一个真实的 React 应用里，数据从哪来、怎么分类、怎么流转。用 5 张架构图覆盖：三种状态的分类（本地/共享/服务器）、数据请求的完整链路、Loading/Error/Empty/Success 四态机、表单的输入→校验→提交流程、以及状态管理工具的选型阶梯。核心观点：不是所有数据都该进 Context 或全局 Store。"
tags:
  - "React"
  - "架构"
status: published
lang: zh
topic: react
englishSummary: "Previous notes covered React's components, state, hooks, and rendering — all at the 'parts' level. This note zooms out to the application level: where does data come from, how is it categorized, and how does it flow in a real React app? Five architecture diagrams cover: three-state classification (local/shared/server), full data request pipeline, Loading/Error/Empty/Success four-state machine, form input→validate→submit flow, and state management selection ladder. Core thesis: not all data belongs in Context or a global Store."
---

# React 应用中的数据流：从本地状态到服务器数据

> 这是 React 学习笔记的第八篇。前面七篇讲了心智模型、组件、声明式、数据流、State、渲染机制、Hooks——都是「零件」层面的知识。这一篇把视角升到「应用」层面：**一个真实的 React 应用里，数据从哪来、怎么分类、怎么流转。**

---

## 一、本地状态、共享状态、服务器状态

### 心智模型

不是所有数据都是同一种东西。按「数据的归属和生命周期」分成三类：

```
本地状态（Local State）
  — 只属于一个组件，用完即弃
  ├── 弹窗开关（isOpen）
  ├── 输入框内容（inputText）
  ├── 当前选中的标签（activeTab）
  └── 展开/收起（expanded）
  → 放在组件内部，用 useState

共享客户端状态（Shared Client State）
  — 多个组件需要读写，存在于用户会话期间
  ├── 当前登录用户（user）
  ├── 主题（theme）
  ├── 语言偏好（locale）
  └── 购物车（cart）
  → 用 Context / Zustand，只放真正共享的数据

服务器状态（Server State）
  — 数据在服务端，前端只是「缓存了一份」
  ├── 产品列表
  ├── 用户订单
  ├── 文章内容
  └── 搜索结果
  → 用 React Query / SWR / fetch + useEffect
     （数据的所有权在服务端，前端只是暂时持有）
```

### 为什么要区分这三类

**把不同类型的数据混在一起，是 React 应用架构混乱的第一大来源。**

一个常见的错误：把产品列表（服务器数据）也放进 Context 或 Redux——结果你不仅要管理「当前显示哪些产品」，还要管理「数据是不是在加载中」「缓存是否过期」「如何重试失败的请求」——这些是数据获取库（React Query / SWR）的职责，不是你该手写的逻辑。

| | 本地状态 | 共享客户端状态 | 服务器状态 |
|---|---|---|---|
| **存放位置** | useState（组件内） | Context / Zustand | React Query / SWR |
| **生命周期** | 组件卸载即消失 | 用户会话期间 | 服务端是唯一真相源 |
| **谁拥有数据** | 组件 | 客户端 | 服务器 |
| **例子** | `isOpen` | `user` `theme` `cart` | 产品列表、文章、订单 |

**核心原则**：**把服务器状态交给数据获取库管理**——它们帮你处理缓存、去重、重试、过期、后台刷新。**Context 只放真正的客户端共享状态**——主题、用户、语言偏好。**其他都是本地状态**——放在需要它的组件里。

---

## 二、数据请求流程：从组件到数据库再回来

### 心智模型

```
Component（组件）
    │
    │ 发起请求
    ▼
API Route / Server（服务器）
    │
    │ 查询
    ▼
Database（数据库）
    │
    │ 返回数据
    ▼
JSON Response
    │
    │ 解析
    ▼
Loading / Success / Error（三种结果）
```

### 传统做法：useEffect + fetch

```jsx
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg message={error.message} />;
  return <ProductGrid products={products} />;
}
```

**这个模式能跑，但你要自己处理的细节很多**：cancelled 标志（防内存泄漏）、竞态条件（快速切换 tab 导致旧数据覆盖新数据）、缓存、重试、后台刷新——每个组件里都要重复写一遍这些逻辑。

### 现代做法：React Query（TanStack Query）

```jsx
function ProductList() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(r => r.json()),
    staleTime: 5 * 60 * 1000,  // 5 分钟内不重新请求
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMsg message={error.message} />;
  return <ProductGrid products={products} />;
}
```

**React Query 帮你处理了**：缓存、去重（同一时间对同一数据的多次请求自动合并）、后台刷新、窗口重新聚焦时自动重拉、失败重试、分页/无限滚动。

**2026 年的共识**：服务端数据的获取和缓存应该交给专门的库（React Query / SWR），而不是手写 `useEffect + fetch`。

---

## 三、Loading、Error、Empty、Success：四态机

### 心智模型

```
每一个数据请求都应该覆盖四种状态。
不是三种——是四种。

     Idle（还没开始）
        │
        │ 发起请求
        ▼
    Loading（加载中）
        │
   ┌────┼────┬──────┐
   ▼    ▼    ▼      ▼
Error Empty Success (无更多数据)
         (列表为空)
```

**Empty 和 Success 是不同的状态**。Empty 是「请求成功了，但数据为空」（搜索无结果、空列表）。Success 是「请求成功了，有数据」。如果你用 `data.length === 0` 来判断 Empty，那 Loading 阶段也会命中这个判断——这时你会在页面上闪现「暂无数据」的文字。

### 代码

```jsx
function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // 1. Loading — 骨架屏
  if (isLoading) {
    return <UserListSkeleton count={5} />;
  }

  // 2. Error — 错误提示 + 重试按钮
  if (error) {
    return (
      <ErrorState
        message={error.message}
        onRetry={() => {/* refetch */}}
      />
    );
  }

  // 3. Empty — 空状态引导
  if (users.length === 0) {
    return (
      <EmptyState
        icon="👤"
        title="还没有用户"
        description="创建第一个用户开始吧"
        action={<button>创建用户</button>}
      />
    );
  }

  // 4. Success — 正常数据展示
  return <UserGrid users={users} />;
}
```

### 四态的 UI 策略

| 状态 | UI 策略 | 何时出现 |
|------|---------|---------|
| **Loading** | 骨架屏，保留空间布局 | 首次加载、切换筛选条件 |
| **Error** | 错误描述 + 重试按钮 | 网络断开、服务器 500 |
| **Empty** | 引导性文案 + 行动按钮 | 搜索无结果、新用户无数据 |
| **Success** | 数据展示 | 正常 |

**关键规则**：Loading 用骨架屏而不是 Spinner。骨架屏保留了页面布局的「形状预期」——用户知道数据会出现在哪里。Spinner 只有一个旋转的圆圈——用户不知道下一秒会出现什么。

---

## 四、表单：输入 → 校验 → 提交

### 心智模型

```
  Input（输入框）
     │
     │ onChange
     ▼
 Form State（表单状态）
     │
     │ Validate（校验）
     ▼
 Validation（校验结果）
     │
     │ Submit（提交）
     ▼
  Server（服务器）
     │
     ├── Success → 跳转 / 提示 / 清空表单
     └── Error   → 显示服务端错误
```

### 最小可用的表单结构

```jsx
function SignupForm() {
  // 1. 表单 state（所有字段集中管理）
  const [form, setForm] = useState({
    name: '', email: '', password: '',
  });

  // 2. 校验 state
  const [errors, setErrors] = useState({});

  // 3. 提交状态
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // 4. 字段变化
  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    // 字段变了 → 清除该字段的校验错误
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  // 5. 客户端校验
  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = '名字不能为空';
    if (!form.email.includes('@')) newErrors.email = '邮箱格式不正确';
    if (form.password.length < 6) newErrors.password = '密码至少 6 位';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // 6. 提交
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '注册失败');
      }
      // Success → 跳转
      window.location.href = '/welcome';
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label="名字" error={errors.name}>
        <input value={form.name} onChange={e => handleChange('name', e.target.value)} />
      </Field>
      <Field label="邮箱" error={errors.email}>
        <input value={form.email} onChange={e => handleChange('email', e.target.value)} />
      </Field>
      <Field label="密码" error={errors.password}>
        <input type="password" value={form.password}
               onChange={e => handleChange('password', e.target.value)} />
      </Field>
      {serverError && <div className="server-error">{serverError}</div>}
      <button type="submit" disabled={submitting}>
        {submitting ? '注册中...' : '注册'}
      </button>
    </form>
  );
}
```

### 表单的四层状态

| 层 | 数据 | 例子 |
|----|------|------|
| **字段值** | `form.name` `form.email` | 用户输入的内容 |
| **字段错误** | `errors.name` `errors.email` | 校验失败的信息 |
| **提交状态** | `submitting` | 是否正在提交 |
| **服务端错误** | `serverError` | 服务器返回的错误（如邮箱已被注册） |

**四层缺一层都会导致用户体验不完整**。常见的遗漏是「字段错误」——用户提交后才看到红色提示，但改了字段后错误还在。修复方法：`handleChange` 里清除对应字段的错误。

### 表单库的选择

| 场景 | 推荐 |
|------|------|
| 1-2 个简单字段 | 手写（上面这个模式） |
| 3-10 个字段，有复杂校验 | React Hook Form |
| 复杂动态表单（增删字段） | React Hook Form + Zod |
| 已有 Formik 的旧项目 | 继续用 Formik |

**2026 年的主流选择是 React Hook Form**——它以非受控组件（ref）为基础，不会在每个字符输入时触发整个表单重渲染，性能比完全受控的表单好一个数量级。

---

## 五、状态管理选型：不是越强越好

### 心智模型

```
状态管理方案的选择是一个阶梯——
不是谁「最强」就用谁，而是「刚刚够用」最好。

  External Store（Zustand / Redux）
      ↑ 跨页面复杂状态
  Reducer + Context
      ↑ 更新逻辑复杂
  Context
      ↑ 层级太深，不想逐层传 props
  状态提升
      ↑ 兄弟组件需要共享
  useState（组件内）
      ↑ 页面复杂，需要拆分

你从最下面开始，遇到问题再往上走。
不是一开始就站在最上面。
```

### 每一层的适用场景

```jsx
// 第 1 层 — useState：组件内部使用
function Toggle() {
  const [isOpen, setIsOpen] = useState(false);  // 只在这个组件里用
  // ...
}

// 第 2 层 — 状态提升：兄弟组件需要共享
function Parent() {
  const [text, setText] = useState('');         // A 和 B 都需要
  return (
    <>
      <PanelA text={text} onTextChange={setText} />
      <PanelB text={text} />
    </>
  );
}

// 第 3 层 — Context：层级太深，不想 props drilling
const ThemeContext = createContext('light');
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <DeepTree />  {/* 10 层嵌套都不需要传 props */}
    </ThemeContext.Provider>
  );
}

// 第 4 层 — Reducer + Context：更新逻辑复杂
// 购物车：ADD / REMOVE / UPDATE_QTY / CLEAR / APPLY_COUPON
// 这些逻辑放在一个 reducer 里比散落在各处清晰得多

// 第 5 层 — External Store：跨页面、高频更新、需要 selector
import { create } from 'zustand';
const useStore = create((set) => ({
  user: null,
  cart: [],
  addToCart: (item) => set((s) => ({ cart: [...s.cart, item] })),
}));
```

### 选型判断标准

| | useState | Context | Reducer+Context | External Store |
|---|---|---|---|---|
| **共享范围** | 单组件 | 子树 | 子树 | 全局 |
| **更新频率** | 不限 | 低（变了全部重渲染） | 中 | 不限 |
| **复杂逻辑** | 简单 | 简单 | 复杂（多 action 类型） | 不限 |
| **学习成本** | 零 | 低 | 中 | 中-高 |
| **代表工具** | — | createContext | useReducer+Context | Zustand, Redux |

### 服务器状态：独立的维度

```
不管选什么客户端状态方案，
服务器状态应该用专门的数据获取库：

           服务器状态
               │
    ┌──────────┴──────────┐
    │                     │
 React Query          SWR
 (TanStack Query)     (Vercel)

不要用 useEffect + useState 手写请求逻辑。
不要把服务器数据塞进 Redux / Zustand。
```

---

## 六、总结：一张完整的应用数据流图

```
                             用户操作
                                │
                    ┌───────────┴───────────┐
                    │                       │
              本地 UI 状态             触发数据请求
         （useState / useRef）              │
          弹窗、表单、动画            ┌──────┴──────┐
                                    │             │
                              客户端共享状态   服务器状态
                           （Context/Zustand）（React Query）
                              用户、主题       产品、文章

                              所有请求经过四态机：
                              Loading → Error / Empty / Success

                              表单走独立管线：
                              Input → Validate → Submit → Server
```

**数据流设计的三个原则**：

1. **就近原则**：state 放在刚好够用的最近组件里，不要过早提升
2. **分类原则**：服务器数据 ≠ 客户端共享状态 ≠ 本地状态，用不同的工具管理
3. **完整原则**：每个数据请求覆盖四种 UI 状态（Loading / Error / Empty / Success），不遗漏
