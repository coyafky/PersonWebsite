import Link from "next/link";

export function SectionFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-identity">
        <Link href="/" className="brand">
          COYA / 冯科雅
        </Link>
        <p>
          企业 AI 应用与营销工作流。
          <br />
          从业务问题开始，留下真实的实践记录。
        </p>
        <a href="mailto:coya20020824@gmail.com">coya20020824@gmail.com ↗</a>
      </div>
      <nav className="footer-navigation" aria-label="页脚导航">
        <div>
          <h2>了解我的工作</h2>
          <Link href="/projects">项目案例</Link>
          <Link href="/about">关于与经历</Link>
          <Link href="/gallery">视觉作品</Link>
          <Link href="/skills">AI 工作流实践</Link>
        </div>
        <div>
          <h2>记录与探索</h2>
          <Link href="/blog">文章</Link>
          <Link href="/notes">学习笔记</Link>
          <Link href="/tools">工具</Link>
          <Link href="/timeline">时间线</Link>
        </div>
        <div>
          <h2>保持联系</h2>
          <a
            href="https://github.com/coyafky/PersonWebsite"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
          <a href="/rss.xml" rel="alternate" type="application/rss+xml">
            RSS 订阅 ↗
          </a>
        </div>
      </nav>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Coya Feng</span>
        <span>以实践积累，让工作有迹可循。</span>
      </div>
    </footer>
  );
}
