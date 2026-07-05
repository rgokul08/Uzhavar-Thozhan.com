"use client";

import { useEffect, useState } from "react";
import { ShoppingBasket } from "lucide-react";

const categories = ["seed", "pesticide", "fertilizer", "medicine", "other"];

export default function InputsStorePage() {
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch(`/api/seeds${category ? `?category=${category}` : ""}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []));
  }, [category]);

  function addToCart(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Features 09 &amp; 13</p>
      <h1 className="font-display text-3xl font-semibold mb-2">Seeds, pesticides &amp; other inputs</h1>
      <p className="text-ink/70 mb-6">Certified seeds and crop-protection products, delivered to your village.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => setCategory("")} className={`px-3 py-1 rounded text-sm border ${category === "" ? "bg-paddy text-husk" : "border-black/20"}`}>All</button>
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1 rounded text-sm border capitalize ${category === c ? "bg-paddy text-husk" : "border-black/20"}`}>
            {c}
          </button>
        ))}
        <span className="ml-auto font-mono text-sm self-center">Cart: {cartCount}</span>
      </div>

      {products.length === 0 && (
        <p className="text-ink/70">No products loaded yet. Populate the <code>Product</code> table.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => (
          <div key={p.id} className="card">
            <ShoppingBasket className="text-paddy mb-2" />
            <h3 className="font-display text-base font-semibold">{p.name}</h3>
            <p className="text-xs text-clay-dark capitalize">{p.category}{p.brand ? ` · ${p.brand}` : ""}</p>
            <p className="font-mono mt-2">₹{p.price} / {p.unit}</p>
            <button onClick={() => addToCart(p.id)} className="mt-3 w-full bg-turmeric text-ink text-sm font-semibold rounded px-4 py-2">
              Add to cart
            </button>
          </div>
        ))}
      </div>
      {/* TODO: checkout flow -> creates Order + OrderItems, then charges
          via Razorpay using RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET */}
    </div>
  );
}
