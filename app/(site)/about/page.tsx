export const metadata = {
  title: "About",
  description: "About this personal website.",
};

export default function AboutPage() {
  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>About</h1>
        <p>这里会逐步补充个人介绍、经历、兴趣、联系方式和写作动机。</p>
      </header>
      <section className="content-section readable">
        <h2>Why this site exists</h2>
        <p>
          这个网站不是一次性作品集，而是一个持续维护的内容系统。它把日常记录、项目复盘和职业材料放到同一个 Git
          仓库里，让每一次写作都能为长期成长和求职准备留下证据。
        </p>
      </section>
    </div>
  );
}
