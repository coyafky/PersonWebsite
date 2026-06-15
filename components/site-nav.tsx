import Image from "next/image";
import Link from "next/link";
import {
  Icons0Blog,
  Icons0Calendar,
  Icons0Portfolio,
  Icons0Profile,
  Icons0Document,
  Icons0Radar,
} from "@/components/icons0";

const navItems = [
  { href: "/blog", icon: Icons0Blog, label: "Blog" },
  { href: "/ai-tracker", icon: Icons0Radar, label: "AI Tracker" },
  { href: "/weekly", icon: Icons0Calendar, label: "Weekly" },
  { href: "/projects", icon: Icons0Portfolio, label: "Projects" },
  { href: "/career", icon: Icons0Document, label: "Career" },
  { href: "/about", icon: Icons0Profile, label: "About" },
];

export function SiteNav() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Personal Website home">
        <Image src="/site-mark.svg" alt="" width={34} height={34} priority />
        <span>Personal Website</span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link href={href} key={href}>
            <Icon className="nav-icon" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
