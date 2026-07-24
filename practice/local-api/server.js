/**
 * 手搓 API 服务器 — 不到 60 行的 Node.js HTTP API
 *
 * 练习目标：
 *   1. 理解 http.createServer 的「请求-响应」机制
 *   2. 理解路由 = req.method + req.url
 *   3. 理解 JSON 序列化 / 反序列化
 *   4. 理解 CORS 为什么需要
 *   5. 理解 POST 请求的 body 是怎么传过来的
 *
 * 启动:  node server.js
 * 测试:  curl http://localhost:3001/api/articles
 *        或打开浏览器访问 http://localhost:3001/api/articles
 *        或用 test.html 里的 fetch 调用
 */

import http from 'node:http'

// ── 数据（模拟数据库） ──────────────────
const articles = [
  { id: 1, title: 'Hello World', content: '这是第一篇内容' },
  { id: 2, title: 'API从0-1', content: '从调接口到自己设计接口' },
  { id: 3, title: '手搓API实践', content: '理解 http.createServer 的每个细节' },
]
let nextId = 4

// ── 服务器 ──────────────────────────────
const server = http.createServer((req, res) => {

  // ★ CORS — 不加这行浏览器会拦截跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // 浏览器会在 POST 前发一个 OPTIONS 预检请求 — 直接返回 OK
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  // ────────── GET /api/articles — 获取列表 ──────────
  if (req.method === 'GET' && req.url === '/api/articles') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(articles))
    return
  }

  // ────────── GET /api/articles/:id — 获取详情 ──────────
  if (req.method === 'GET' && req.url?.startsWith('/api/articles/')) {
    const id = Number(req.url.split('/').pop())
    const article = articles.find(a => a.id === id)

    if (article) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(article))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: `文章 ${id} 不存在` }))
    }
    return
  }

  // ────────── POST /api/articles — 创建新文章 ──────────
  if (req.method === 'POST' && req.url === '/api/articles') {
    // ★ POST 请求的 body 是流式传输的 — 需要手动拼接
    let body = ''
    req.on('data', chunk => {
      body += chunk  // 每次收到一块数据，拼到 body 上
    })
    req.on('end', () => {
      // 数据收完了，可以用了
      try {
        const { title, content } = JSON.parse(body)  // ★ JSON 反序列化
        if (!title || !content) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'title 和 content 是必填的' }))
          return
        }
        const article = { id: nextId++, title, content }
        articles.push(article)
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(article))
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'JSON 格式有误' }))
      }
    })
    return
  }

  // ────────── 404 — 没有匹配的路由 ──────────
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: '接口不存在' }))
})

// ── 启动 ────────────────────────────────
server.listen(3001, () => {
  console.log('API 服务器已启动 → http://localhost:3001')
  console.log('试试: curl http://localhost:3001/api/articles')
})
