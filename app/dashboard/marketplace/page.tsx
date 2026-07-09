"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/PageHeader";

interface Product {
  id: string; name: string; category: string; description: string; price: number; unit: string; stock: number;
}

const categories = ["all", "pesticide", "fertilizer", "seed", "medicine", "tool"];

export default function MarketplacePage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    supabase.from("products").select("*").order("category").then(({ data }) => setProducts((data as Product[]) ?? []));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function order(p: Product) {
    const quantity = qty[p.id] || 1;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("orders").insert({
      farmer_id: user.id, product_id: p.id, quantity, total_price: quantity * p.price,
    });
    setToast(`Order placed: ${quantity} ${p.unit} of ${p.name}`);
    setTimeout(() => setToast(""), 3000);
  }

  const shown = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <div>
      <PageHeader eyebrow="Marketplace" title="Buy pesticides, seeds & farm inputs" description="Certified products, delivered to your village." />

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${filter === c ? "bg-leaf text-paper" : "bg-white/70 border border-soil/10 text-soil-700"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <div key={p.id} className="rounded-2xl border border-soil/10 bg-white/70 p-5">
            <span className="rounded-full bg-turmeric-300/30 px-2.5 py-0.5 text-[11px] font-medium capitalize text-turmeric-500">{p.category}</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-soil">{p.name}</h3>
            <p className="mt-1 text-sm text-soil-700">{p.description}</p>
            <p className="mt-3 font-mono text-lg font-semibold text-leaf-600">₹{p.price} <span className="text-xs text-soil-700/60">/ {p.unit}</span></p>
            <div className="mt-4 flex items-center gap-3">
              <input type="number" min={1} defaultValue={1}
                onChange={(e) => setQty({ ...qty, [p.id]: Number(e.target.value) })}
                className="w-16 rounded-lg border border-soil/20 px-2 py-2 text-sm" />
              <button onClick={() => order(p)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-leaf py-2 text-sm font-semibold text-paper hover:bg-leaf-600">
                <ShoppingCart className="h-4 w-4" /> Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-soil px-5 py-2.5 text-sm text-paper shadow-lg">{toast}</div>}
    </div>
  );
}
