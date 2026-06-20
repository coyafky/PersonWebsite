import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell narrow" style={{ textAlign: "center", paddingTop: "120px" }}>
      <h1 style={{ fontSize: "72px", margin: "0 0 16px", color: "var(--muted)" }}>404</h1>
      <p style={{ fontSize: "18px", marginBottom: "32px", color: "var(--muted)" }}>
        This page doesn&apos;t exist or has been moved.
      </p>
      <Link className="button primary" href="/">
        Back to Home
      </Link>
    </div>
  );
}
