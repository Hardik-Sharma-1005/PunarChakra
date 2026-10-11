import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Recycle } from "lucide-react";

export function AppBrand({
  href = "/",
  inverse = false,
}: {
  href?: string;
  inverse?: boolean;
}) {
  return (
    <Link href={href} className={`app-brand${inverse ? " app-brand--inverse" : ""}`}>
      <span className="app-brand-mark" aria-hidden="true">
        <Recycle size={21} strokeWidth={2.2} />
      </span>
      <span className="app-brand-copy">
        <strong>PunarChakra</strong>
        <span>Recovery, connected</span>
      </span>
    </Link>
  );
}

export function AppMetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "green",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone?: "green" | "orange" | "sage";
}) {
  return (
    <article className="app-metric-card">
      <span className={`app-metric-icon app-metric-icon--${tone}`} aria-hidden="true">
        <Icon size={21} strokeWidth={2} />
      </span>
      <div className="app-metric-copy">
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}
