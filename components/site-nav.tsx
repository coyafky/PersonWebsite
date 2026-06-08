import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/blog", label: "Blog" },
  { href: "/weekly", label: "Weekly" },
  { href: "/projects", label: "Projects" },
  { href: "/career", label: "Career" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Personal Website home">
        <Image src="/site-mark.svg" alt="" width={34} height={34} priority />
        <span>Personal Website</span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
