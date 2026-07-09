import { createClient } from "@/lib/supabase/server";
import { Users, ShoppingCart, HandCoins, FileWarning, LifeBuoy, Store } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: stats } = await supabase.from("admin_stats").select("*").maybeSingle();

  const cards = [
    { label: "Total farmers", value: stats?.total_farmers ?? 0, icon: Users },
    { label: "Total orders", value: stats?.total_orders ?? 0, icon: ShoppingCart },
    { label: "Pending loans", value: stats?.pending_loans ?? 0, icon: HandCoins },
    { label: "Pending claims", value: stats?.pending_claims ?? 0, icon: FileWarning },
    { label: "Open support tickets", value: stats?.open_tickets ?? 0, icon: LifeBuoy },
    { label: "Active produce listings", value: stats?.active_listings ?? 0, icon: Store },
  ];

  return (
    <div className="min-h-screen bg-paper p-8 dark:bg-night">
      <h1 className="font-display text-2xl font-semibold text-soil dark:text-paper">Admin Overview</h1>
      <p className="mt-1 text-sm text-soil-700 dark:text-paper/60">
        Platform-wide stats, live from Supabase. Grant access via the <code className="font-mono">admin_roles</code> table.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-soil/10 bg-white/70 p-5 dark:border-paper/10 dark:bg-night-card/50">
            <c.icon className="h-5 w-5 text-leaf" />
            <p className="mt-3 font-display text-2xl font-semibold text-soil dark:text-paper">{c.value}</p>
            <p className="text-xs text-soil-700/60 dark:text-paper/50">{c.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-xl text-xs text-soil-700/50 dark:text-paper/40">
        This is a v1 admin overview. User/farmer management, blog CMS editing, role assignment UI,
        and support-ticket triage tables are the natural next additions — the schema
        (<code className="font-mono">admin_roles</code>, <code className="font-mono">audit_logs</code>,
        <code className="font-mono">blogs</code>, <code className="font-mono">support_tickets</code>) is already in place for them.
      </p>
    </div>
  );
}
