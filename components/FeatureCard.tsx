import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export default function FeatureCard({
  icon: Icon,
  index,
  title,
  description,
  href
}: {
  icon: LucideIcon;
  index: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="card flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <Icon className="text-paddy" size={28} />
        <span className="eyebrow">{index}</span>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="text-sm text-ink/70">{description}</p>
    </Link>
  );
}
