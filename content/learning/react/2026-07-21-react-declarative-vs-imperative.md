---
title: "声明式与命令式：React 和原生 DOM 的思维方式对比"
date: "2026-07-21"
summary: "React 最关键的范式转变是「声明式」取代「命令式」。这篇笔记用同一个功能（计数器、Todo List、搜索过滤）在原生 JS DOM 和 React 中的两种实现做并排对比，拆解声明式的三个核心优势（可预测、自描述、易测试）和一个真实代价（diff 开销），最后给出判断框架：什么时候声明式帮你省事，什么时候命令式更直接。"
tags:
  - React
  - JavaScript
  - DOM
  - 声明式
  - 命令式
  - 心智模型
status: published
lang: zh
topic: react
englishSummary: "React's key paradigm shift is replacing imperative DOM manipulation with declarative UI description. This note compares the same features (counter, Todo List, search filter) implemented in vanilla JS DOM vs React side by side, unpacks three advantages of declarative code (predictable, self-describing, testable) and one real cost (diff overhead), and ends with a judgment framework for when declarative helps and when imperative is simpler."
---

# 声明式与命令式：React 和原生 DOM 的思维方式对比

> 这是 React 学习笔记的第三篇。上一篇拆解了组件，这一篇回到 React 最底层的范式转变：**声明式（Declarative）取代命令式（Imperative）**。不是学新 API，而是学会用另一种方式思考 UI。

## 一、两个概念：一句人话定义

想象你打车去机场：

```
命令式（上车后每一步都指挥司机）：
  "下一个路口右转"
  "过了红绿灯走左边车道"
  "前面 200 米靠边停下"
  — 你告诉司机「怎么做」，每一步都要精确描述

声明式（上车后只说目的地）：
  "我要去白云机场 T2"
  — 你只告诉司机「要什么结果」，具体怎么开由司机决定
```

在 UI 编程里：

```
命令式（原生 JS DOM）：
  — 你手动操作 DOM：找到节点 → 改属性 → 插元素 → 删元素
  — 你告诉浏览器「每一步怎么做」

声明式（React）：
  — 你描述 UI 在每种 state 下长什么样
  — 你告诉 React「我要什么结果」，React 负责把 DOM 变成那样
```

## 二、同一个功能，两种实现

### 2.1 计数器

**原生 JS — 命令式**

```js
// HTML: <span id="count">0</span>
//       <button id="btn">+1</button>

let count = 0;
const span = document.getElementById('count');
const btn = document.getElementById('btn');

// 初始渲染 — 手动写一遍
span.textContent = count;

// 事件绑定 + 手动更新 — 再手动写一遍
btn.addEventListener('click', () => {
  count++;
  span.textContent = count;  // ← 每次状态变化都要手动同步 UI
});
```

**React — 声明式**

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

**并排对比看差异**：

| | 原生 JS | React |
|---|---|---|
| **状态在哪** | `let count` — 普通 JS 变量 | `useState(0)` — React 托管的 state |
| **初始 UI 怎么写** | `span.textContent = count` | `{count}` 写在 JSX 里 |
| **更新 UI 怎么写** | `span.textContent = count` — 再写一遍 | 不需要额外写 — `setCount` 自动触发重渲染 |
| **核心区别** | UI 描述出现了**两次**（初始化 + 更新） | UI 描述只出现了**一次**（JSX 里的 `{count}`） |

**声明式的关键优势**：你是描述「count 和 UI 的关系」——「span 里永远显示 count 的值」。React 负责在任何 count 变化时保持这个关系成立。你不需要写「if count changes, then update span」。

### 2.2 Todo List — 三个操作

**原生 JS — 命令式**

```js
// HTML:
// <input id="todo-input" />
// <button id="add-btn">添加</button>
// <ul id="todo-list"></ul>

const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

addBtn.addEventListener('click', () => {
  // 1. 创建 li
  const li = document.createElement('li');

  // 2. 创建 span（文字）
  const span = document.createElement('span');
  span.textContent = input.value;
  li.appendChild(span);

  // 3. 创建删除按钮
  const delBtn = document.createElement('button');
  delBtn.textContent = '删除';
  delBtn.addEventListener('click', () => {
    list.removeChild(li);  // ← 直接操作 DOM 删除
  });
  li.appendChild(delBtn);

  // 4. 插入 DOM
  list.appendChild(li);

  // 5. 清空输入框
  input.value = '';
});
```

**React — 声明式**

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  function addTodo() {
    setTodos([...todos, { id: Date.now(), text }]);
    setText('');
  }

  function removeTodo(id) {
    setTodos(todos.filter(t => t.id !== id));
  }

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={addTodo}>添加</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**操作对比**：

| 操作 | 原生 JS | React |
|------|---------|-------|
| **添加** | `createElement` + `appendChild` — 4 步 | `setTodos([...todos, newTodo])` — 1 步，列表自动重渲染 |
| **删除** | `removeChild(li)` — 直接删 DOM 节点 | `setTodos(todos.filter(...))` — 删数据，React 自动删 DOM |
| **清空输入** | `input.value = ''` — 手动改 DOM 属性 | `setText('')` — 改 state，input 的 value 自动跟随 |

**React 版本里没有任何 `createElement`、`appendChild`、`removeChild`**。你只操作数据（todos 数组），React 负责把数据映射成 DOM。

### 2.3 搜索过滤 — 数据 + UI 同时变化

**原生 JS — 命令式**

```js
let users = [];                       // 原始数据
let filtered = [];                    // 过滤后的数据

// 获取数据
fetch('/api/users')
  .then(r => r.json())
  .then(data => {
    users = data;
    renderList(users);                // ← 手动渲染
  });

// 搜索
document.getElementById('search').addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase();
  filtered = users.filter(u => u.name.toLowerCase().includes(keyword));
  renderList(filtered);               // ← 手动重新渲染
});

// 渲染函数 — 每次数据变都要手动调用
function renderList(items) {
  const list = document.getElementById('list');
  list.innerHTML = '';                // ← 清空
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    list.appendChild(li);            // ← 重建
  });
}
```

**React — 声明式**

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers);                // ← 只设数据，不调渲染
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <input value={keyword} onChange={e => setKeyword(e.target.value)} />
      <ul>
        {filtered.map(u => <li key={u.id}>{u.name}</li>)}
      </ul>
    </div>
  );
  // ← 没有 renderList 函数。filtered 变了，React 自动重渲染
}
```

**这个例子最明显**：原生 JS 版本里有一个显式的 `renderList` 函数——你必须记得在每次数据变化后调用它。**忘了调 → UI 和数据不同步 → bug**。React 版本没有 `renderList`——数据变，UI 自动同步。

## 三、声明式的三个核心优势

### 优势 1：可预测 — UI 永远和数据一致

```
原生 JS：
  数据变了 ──→ 你记得调 render 了吗？ ──→ 可能同步了，可能没同步
  Bug 常见形态：数据已经是新值，但 UI 显示的还是旧的

React：
  数据变了 ──→ React 自动调 render ──→ 一定同步
  Bug 形态：你 setState 的方式不对（闭包陷阱），但 UI 一定反映了某个 state 值
```

**声明式消除了「忘了更新 UI」这类 bug。** 这可能是声明式最大的工程价值——消灭了一整类人因错误。

### 优势 2：自描述 — 代码说清楚了自己要什么

```jsx
// 声明式：一眼看出 UI 长什么样
<ul>
  {todos.map(todo => (
    <li key={todo.id}>
      <span>{todo.text}</span>
      <button onClick={() => removeTodo(todo.id)}>删除</button>
    </li>
  ))}
</ul>

// VS

// 命令式：UI 的样子藏在 createElement + appendChild 的序列里
// 想看出 UI 结构？你得在脑子里模拟这段代码的执行结果
```

**声明式代码的结构就是 UI 的结构**。代码嵌套 = DOM 嵌套。你不需要在脑子里「运行」代码来推测结果——因为代码本身就是结果的描述。

### 优势 3：易测试 — UI 变成纯数据

```jsx
// 声明式组件测试 = 给 props + state，看 JSX 输出
test('未完成 todo 不打删除线', () => {
  const { container } = render(<TodoItem done={false} text="买菜" />);
  expect(container.querySelector('span')).not.toHaveStyle('text-decoration: line-through');
});

// VS

// 命令式测试 = 要模拟 DOM 环境、mock fetch、验证 DOM 操作序列
// 代码量 x3，而且脆弱（DOM 结构一变测试就挂）
```

## 四、声明式的真实代价

声明式不是没有代价。理解这些代价，你才能做出正确的选择。

### 代价 1：diff 开销

```
命令式：
  "删掉第 3 个 li" → 一步到位

React（声明式）：
  1. setState 触发
  2. 重新执行组件函数 → 生成新 Virtual DOM 树
  3. diff 新旧两棵树
  4. 发现第 3 个 li 不见了
  5. 删掉对应的真实 DOM 节点
```

**React 的声明式比命令式多了一个「计算 diff」的步骤**。大多数场景下这个开销可以忽略（几毫秒），但在高频更新（动画、拖拽、实时图表）场景下，你可能需要手动优化或退回到命令式操作（用 `ref` 直接操作 DOM）。

### 代价 2：学习曲线

```jsx
// 声明式的「魔法」让新手困惑
setTodos([...todos, newTodo])  // 为什么改了数组，列表就更新了？
useEffect(() => {...}, [count]) // 为什么 count 变了，副作用就跑？
React.memo(MyComponent)         // 为什么加个 memo 就跳过渲染了？
```

命令式没有这种困惑——`createElement` 就是创建元素，`removeChild` 就是删除。声明式有一层「框架在帮你做事」的抽象——这层抽象带来了上面三个优势，但也带来了需要理解和信任的概念（state、render、diff、memo）。

### 代价 3：状态分类比操作 DOM 更烧脑

```
命令式的难题： "我该怎么操作 DOM 才能达到这个效果？"
声明式的难题： "这个变化应该归属于哪个 state？这个 state 应该放在哪个组件？"

前者是操作层面的问题（有标准答案），后者是设计层面的问题（有各种答案，要选）
```

---

## 五、React 命令式的逃生口：ref

React 给你留了一个「声明式搞不定时退到命令式」的口子——`ref`。

```jsx
function VideoPlayer({ src }) {
  const videoRef = useRef(null);

  // 声明式：描述 UI
  return <video ref={videoRef} src={src} />;
}

// 命令式：直接操作 DOM — 通过 ref
function play() {
  videoRef.current.play();    // ← 直接调 DOM API
}
function pause() {
  videoRef.current.pause();
}
function seekTo(seconds) {
  videoRef.current.currentTime = seconds;
}
```

**什么时候用 ref 退到命令式**：
- 管理焦点（`input.focus()`）
- 触发动画（`element.animate(...)`）
- 操作 video/audio/canvas（这些 DOM API 本身就是命令式的）
- 集成第三方非 React 库（D3、Leaflet 等直接操作 DOM 的库）
- 读取 DOM 尺寸/位置（`getBoundingClientRect`）

## 六、判断框架：什么时候用哪种方式

| 场景 | 声明式 (React) | 命令式 (原生 DOM) | 原因 |
|------|---------------|-------------------|------|
| **数据驱动的 UI 更新** | ✅ | ❌ | 声明式消灭了「忘了更新 UI」这类 bug |
| **表单交互** | ✅ | ❌ | 受控组件的 value/onChange 模式天然适合 |
| **列表增删改** | ✅ | ❌ | 操作数据数组比操作 DOM 树简单一个数量级 |
| **高频动画（60fps）** | ⚠️ ref 退出 | ✅ | 声明式的 diff 开销在这种场景不可忽略 |
| **一次性 DOM 操作** | ⚠️ ref 即可 | ✅ | `element.focus()` 用声明式反而绕 |
| **集成非 React 库** | ⚠️ ref + useEffect | ✅ | 第三方库不知道 React 的存在，必须命令式交互 |
| **简单静态页面** | 🟰 差不多 | 🟰 差不多 | 没有复杂交互时，两种方式差距不大 |

**默认用声明式（React），只在性能敏感或需要直接操作 DOM 的场景退到命令式（ref）。** 这不是教条——声明式能消除的 bug 比命令式带来的灵活性更多。但当声明式成为瓶颈时，React 给你留了退路。

## 七、两个日常场景的思维转换

### 场景 1：弹窗显示/隐藏

```jsx
// 命令式思维（拿着 React 写 jQuery 风格）
function showModal() {
  document.getElementById('modal').style.display = 'block';
}
function hideModal() {
  document.getElementById('modal').style.display = 'none';
}

// 声明式思维（React 原生方式）
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>打开</button>
      {isOpen && <Modal onClose={() => setIsOpen(false)} />}
    </div>
  );
}
```

**声明式的优势**：弹窗的状态和 UI 是一体的。`isOpen` 是 true → 弹窗显示。`isOpen` 是 false → 弹窗消失。不会有「弹窗的 DOM 还在但被我隐藏了」这种中间状态。

### 场景 2：表单提交

```jsx
// 命令式思维
function handleSubmit() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const error = document.getElementById('error');

  if (!name) {
    error.textContent = '名字不能为空';  // 手动改 DOM
    return;
  }
  error.textContent = '';              // 手动清空

  submit({ name, email });
}

// 声明式思维
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    if (!name) return setError('名字不能为空');
    setError('');
    submit({ name, email });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

**声明式的优势**：`error` 是一个 state，`{error && <p>...</p>}` 描述了它和 UI 的关系。错误信息和它的渲染位置是一起声明的，不会出现「错误信息应该显示但忘记更新 DOM」的情况。

---

## 八、总结：三种代码的层次

React 代码有三层，理解它们的区别是进阶的关键：

```
第三层：声明式 React（你大部分时间写的东西）
  <TodoList items={todos} onDelete={removeTodo} />
  — 描述 UI 和状态的关系，让 React 处理 DOM

第二层：Hooks + 副作用（需要和外部世界交互时）
  useEffect(() => { document.title = `${n} items` }, [n])
  — 声明式不够用时的桥梁

第一层：ref 命令式（需要直接操作 DOM 时）
  inputRef.current.focus()
  — 最底层，绕过 React 直接控制 DOM
```

**写 React 的艺术就是：把代码尽可能推到第三层（声明式），只在必需的场景退到第二层（副作用）或第一层（ref）。** 你的代码越「声明式」，就越可预测、越容易调试、越不需要担心「忘了更新 UI」。
