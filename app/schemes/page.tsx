import { Landmark } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SchemesPage() {
  let schemes: Awaited<ReturnType<typeof prisma.govtScheme.findMany>> = [];
  try {
    schemes = await prisma.govtScheme.findMany({ orderBy: { title: "asc" } });
  } catch {
    // DB not connected yet during scaffolding — page still renders.
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Feature 03</p>
      <h1 className="font-display text-3xl font-semibold mb-2">Government schemes &amp; subsidies</h1>
      <p className="text-ink/70 mb-8">
        Central and state schemes — subsidies, direct benefit transfers, and law changes
        that affect what you can claim this season.
      </p>

      {schemes.length === 0 && (
        <p className="text-ink/70">
          No schemes loaded yet. Populate the <code>GovtScheme</code> table (see Prisma schema)
          or connect a state agriculture department feed.
        </p>
      )}

      <div className="grid gap-4">
        {schemes.map((s) => (
          <div key={s.id} className="card">
            <div className="flex items-start gap-3">
              <Landmark className="text-paddy shrink-0" />
              <div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-ink/70 mt-1">{s.description}</p>
                {s.benefitAmount && <p className="text-sm mt-1 font-mono">Benefit: {s.benefitAmount}</p>}
                <p className="text-xs text-ink/60 mt-1">Eligibility: {s.eligibility}</p>
                {s.applyUrl && (
                  <a href={s.applyUrl} className="text-sm text-paddy font-semibold mt-2 inline-block" target="_blank" rel="noreferrer">
                    Apply →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
