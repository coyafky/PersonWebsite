---
title: "React Learning"
summary: "React 学习笔记合集——从核心概念（组件、状态、单向数据流）到底层机制（Virtual DOM、Fiber、Hooks 原理），再到工程化实践（性能优化、状态管理、测试）的系统化记录。"
date: "2026-07-21"
status: published
topic: react
tags:
  - "React"
  - "JavaScript"
lang: zh
englishSummary: "A structured React learning track covering core concepts (components, state, unidirectional data flow), internals (Virtual DOM, Fiber, Hooks), and engineering practices (performance optimization, state management, testing)."
---

# React Learning

这个主题用于整理我对 React 的系统学习：不满足于「会用」，而是把每个概念追到它的设计动机和实现原理。

## 我想解决的问题

学习 React 的目标不是「会写 JSX」——那是最基本的一层。真正的学习路径分三层：

1. **会用层**：组件怎么写、状态怎么管、props 怎么传、事件怎么绑
2. **理解层**：Virtual DOM 为什么被发明、Fiber 架构解决了什么问题、Hooks 为什么取代了 Class
3. **工程层**：大型应用的状态管理怎么选、性能瓶颈怎么排查、测试策略怎么定

## 学习路径

- **第一阶段：核心概念** — 组件、JSX、props、state、事件处理、条件渲染、列表渲染
- **第二阶段：Hooks 深入** — useState、useEffect、useRef、useMemo、useCallback、自定义 Hooks
- **第三阶段：底层机制** — Virtual DOM diff 算法、Fiber 调和过程、Hooks 的链表存储
- **第四阶段：工程实践** — 状态管理（Context / Zustand）、性能优化（memo / useMemo）、测试（组件测试 / Hook 测试）

## 资源

- [React 官网](https://react.dev/)
- [React 源码](https://github.com/facebook/react)
- [Dan Abramov 的博客](https://overreacted.io/)
- [Josh Comeau 的 React 教程](https://www.joshwcomeau.com/react/)
