import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import { ExternalLink } from "lucide-react";

const categoryColor: Record<string, string> = {
  subsidy: "bg-leaf-200/50 text-leaf-600",
  loan: "bg-turmeric-300/40 text-turmeric-500",
  insurance: "bg-sky-200/60 text-sky",
  law: "bg-clay/10 text-clay",
};

export default async function SchemesPage() {
  const supabase = await createClient();
  const { data: schemes } = await supabase.from("government_schemes").select("*").order("title");

  return (
    <div>
      <PageHeader
        eyebrow="Government support"
        title="Schemes, subsidies and laws for farmers"
        description="Central government programmes that give money, machinery subsidy, insurance and legal protection to farmers."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {(schemes ?? []).map((s) => (
          <div key={s.id} className="rounded-2xl border border-soil/10 bg-white/70 p-6">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-soil">{s.title}</h3>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${categoryColor[s.category] ?? ""}`}>
                {s.category}
              </span>
            </div>
            <p className="mt-1 text-xs text-soil-700/60">{s.authority}</p>
            <p className="mt-3 text-sm leading-relaxed text-soil-700">{s.description}</p>
            <p className="mt-3 font-mono text-sm font-medium text-leaf-600">{s.benefit_amount}</p>
            <p className="mt-2 text-xs text-soil-700/70"><strong>Eligibility:</strong> {s.eligibility}</p>
            {s.official_link && (
              <a href={s.official_link} target="_blank" rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-leaf-600 underline underline-offset-4">
                Official portal <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
