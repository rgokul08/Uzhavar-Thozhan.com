"use client";

import { useState } from "react";
import { ShoppingBag, Search, Star, ShoppingCart, Check } from "lucide-react";

const products = [
  { id: 1, name: "DAP Fertiliser (50kg)", category: "Fertiliser", price: 1350, unit: "bag", rating: 4.5, stock: 150, desc: "Di-Ammonium Phosphate 18-46-0. Premium quality for all crops." },
  { id: 2, name: "Urea (45kg)", category: "Fertiliser", price: 267, unit: "bag", rating: 4.3, stock: 500, desc: "46% Nitrogen. Government price-controlled. Essential for vegetative growth." },
  { id: 3, name: "NPK 10-26-26 (50kg)", category: "Fertiliser", price: 1470, unit: "bag", rating: 4.4, stock: 200, desc: "Complex fertiliser for balanced nutrition. Ideal for flowering stage." },
  { id: 4, name: "Chlorpyrifos 20% EC (1L)", category: "Pesticide", price: 350, unit: "bottle", rating: 4.2, stock: 300, desc: "Broad-spectrum insecticide for stem borer, aphids, and termites." },
  { id: 5, name: "Imidacloprid 17.8% SL (250ml)", category: "Pesticide", price: 450, unit: "bottle", rating: 4.6, stock: 180, desc: "Systemic insecticide for sucking pests. Safe for beneficial insects." },
  { id: 6, name: "Carbendazim 50% WP (500g)", category: "Fungicide", price: 280, unit: "pack", rating: 4.1, stock: 250, desc: "Systemic fungicide for blast, sheath blight, and wilt diseases." },
  { id: 7, name: "IR-64 Rice Seeds (10kg)", category: "Seeds", price: 520, unit: "bag", rating: 4.7, stock: 100, desc: "High-yielding variety. Medium duration (120 days). Suitable for irrigated lands." },
  { id: 8, name: "ADT-43 Rice Seeds (10kg)", category: "Seeds", price: 480, unit: "bag", rating: 4.5, stock: 120, desc: "Short duration variety (110 days). Resistant to BPH. High milling quality." },
  { id: 9, name: "Drip Irrigation Kit (1 acre)", category: "Equipment", price: 12500, unit: "kit", rating: 4.8, stock: 25, desc: "Complete drip system with laterals, drippers, filter and fittings." },
  { id: 10, name: "Knapsack Sprayer (16L)", category: "Equipment", price: 1800, unit: "piece", rating: 4.4, stock: 80, desc: "Manual pump sprayer. Brass nozzle. 5-year warranty on pump." },
  { id: 11, name: "Vermicompost (50kg)", category: "Organic", price: 600, unit: "bag", rating: 4.6, stock: 200, desc: "Premium quality vermicompost from earthworm processing. Rich in humic acid." },
  { id: 12, name: "Neem Oil (1L)", category: "Organic", price: 380, unit: "bottle", rating: 4.3, stock: 150, desc: "Cold-pressed neem oil. Natural pest repellent and growth promoter." },
];

const categories = ["All", "Fertiliser", "Pesticide", "Fungicide", "Seeds", "Equipment", "Organic"];

export default function MarketplacePage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [ordered, setOrdered] = useState(false);

  const filtered = products.filter((p) => {
    if (category !== "All" && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function addToCart(id: number) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const prod = products.find((p) => p.id === Number(id));
    return sum + (prod ? prod.price * qty : 0);
  }, 0);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-soil">Input Marketplace</h1>
          <p className="mt-1 text-soil-600">Order pesticides, fertiliser, seeds and tools at fair prices.</p>
        </div>
        {cartCount > 0 && (
          <button onClick={() => { setOrdered(true); setCart({}); }}
            className="flex items-center gap-2 rounded-xl bg-leaf px-5 py-2.5 text-sm font-semibold text-paper hover:bg-leaf-600">
            <ShoppingCart className="h-4 w-4" />
            Cart ({cartCount}) — ₹{cartTotal.toLocaleString()}
          </button>
        )}
      </div>

      {ordered && (
        <div className="flex items-center gap-2 rounded-xl border border-leaf/20 bg-leaf-50 px-4 py-3 text-sm text-leaf-700">
          <Check className="h-5 w-5" /> Order placed successfully! You will receive SMS confirmation shortly.
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soil-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..." className="w-full rounded-xl border border-soil/20 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-leaf focus:outline-none" />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === c ? "bg-leaf text-paper" : "bg-white border border-soil/10 text-soil-600 hover:bg-leaf-50"
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <div key={product.id} className="card-hover rounded-2xl border border-soil/5 bg-white p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-soil-50 px-2 py-0.5 text-xs text-soil-500">{product.category}</span>
            </div>
            <h3 className="font-semibold text-soil">{product.name}</h3>
            <p className="mt-1 text-xs text-soil-500">{product.desc}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-turmeric text-turmeric" />
                <span className="text-sm font-medium text-soil">{product.rating}</span>
              </div>
              <span className="text-xs text-soil-400">•</span>
              <span className="text-xs text-soil-500">{product.stock} in stock</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-soil">₹{product.price.toLocaleString()}</span>
                <span className="text-xs text-soil-400">/{product.unit}</span>
              </div>
              <button onClick={() => addToCart(product.id)}
                className="flex items-center gap-1.5 rounded-lg bg-leaf px-3 py-2 text-xs font-semibold text-paper hover:bg-leaf-600">
                <ShoppingCart className="h-3.5 w-3.5" />
                Add {cart[product.id] ? `(${cart[product.id]})` : ""}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
