import Link from "next/link";
import type { HomeProof } from "@/lib/home-page";
import { Icons0ArrowUpRight } from "@/components/icons0";

export function HomeProofCard({ proof }: { proof: HomeProof }) {
  return (
    <Link className="home-proof-card" href={proof.href}>
      <div className="home-proof-card-topline">
        <span>{proof.eyebrow}</span>
        <span className="home-proof-card-live">● PUBLISHED PROOF</span>
      </div>
      <div className="home-proof-card-title-row">
        <div>
          <h2>{proof.title}</h2>
          <p>{proof.summary}</p>
        </div>
        <span className="home-proof-card-arrow" aria-hidden="true">
          <Icons0ArrowUpRight />
        </span>
      </div>
      <div className="home-proof-card-status">{proof.status}</div>
      <dl className="home-proof-card-steps">
        {proof.steps.map((step) => (
          <div key={step.label}>
            <dt>{step.label}</dt>
            <dd>{step.value}</dd>
          </div>
        ))}
      </dl>
      <span className="home-proof-card-link">查看完整证据 →</span>
    </Link>
  );
}
