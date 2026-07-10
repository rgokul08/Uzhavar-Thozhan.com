"use client";

import { useState } from "react";
import { ShieldCheck, Plus, FileCheck2, AlertCircle, CheckCircle2 } from "lucide-react";

const samplePolicies = [
  { id: 1, cropName: "Rice (Ponni)", policyNumber: "PMFBY-TN-2025-001", sumInsured: "200000", premium: "4000", status: "active", startDate: "2025-06-01", endDate: "2025-12-31" },
  { id: 2, cropName: "Cotton", policyNumber: "PMFBY-TN-2025-002", sumInsured: "150000", premium: "3000", status: "active", startDate: "2025-06-01", endDate: "2025-12-31" },
];

export default function InsurancePage() {
  const [showNewPolicy, setShowNewPolicy] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [policies] = useState(samplePolicies);
  const [form, setForm] = useState({ cropName: "", sumInsured: "", season: "Kharif" });
  const [claimForm, setClaimForm] = useState({ policyId: "", reason: "", description: "" });
  const [message, setMessage] = useState("");

  function handleNewPolicy(e: React.FormEvent) {
    e.preventDefault();
    setMessage("✅ Insurance application submitted successfully! Policy will be activated within 24 hours.");
    setShowNewPolicy(false);
    setForm({ cropName: "", sumInsured: "", season: "Kharif" });
  }

  function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    setMessage("✅ Insurance claim filed successfully! Claim ID: CLM-2025-" + Math.floor(Math.random() * 10000));
    setShowClaim(false);
    setClaimForm({ policyId: "", reason: "", description: "" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-soil">Crop Insurance</h1>
          <p className="mt-1 text-soil-600">Buy, track and claim crop insurance under PMFBY and private schemes.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowNewPolicy(!showNewPolicy)}
            className="flex items-center gap-2 rounded-xl bg-leaf px-4 py-2.5 text-sm font-semibold text-paper hover:bg-leaf-600">
            <Plus className="h-4 w-4" /> Buy Policy
          </button>
          <button onClick={() => setShowClaim(!showClaim)}
            className="flex items-center gap-2 rounded-xl border border-clay/30 px-4 py-2.5 text-sm font-semibold text-clay hover:bg-red-50">
            <FileCheck2 className="h-4 w-4" /> File Claim
          </button>
        </div>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-leaf/20 bg-leaf-50 px-4 py-3 text-sm text-leaf-700">
          <CheckCircle2 className="h-5 w-5" />
          {message}
        </div>
      )}

      {/* New Policy Form */}
      {showNewPolicy && (
        <div className="rounded-2xl border border-leaf/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-soil">Apply for Crop Insurance</h2>
          <form onSubmit={handleNewPolicy} className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Crop Name</label>
              <input type="text" value={form.cropName} onChange={(e) => setForm({...form, cropName: e.target.value})}
                placeholder="e.g. Rice" className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Sum Insured (₹)</label>
              <input type="number" value={form.sumInsured} onChange={(e) => setForm({...form, sumInsured: e.target.value})}
                placeholder="200000" className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Season</label>
              <select value={form.season} onChange={(e) => setForm({...form, season: e.target.value})}
                className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none">
                <option>Kharif</option><option>Rabi</option><option>Zaid</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <button type="submit" className="rounded-xl bg-leaf px-6 py-2.5 text-sm font-semibold text-paper hover:bg-leaf-600">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Claim Form */}
      {showClaim && (
        <div className="rounded-2xl border border-clay/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-soil">File Insurance Claim</h2>
          <form onSubmit={handleClaim} className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Select Policy</label>
              <select value={claimForm.policyId} onChange={(e) => setClaimForm({...claimForm, policyId: e.target.value})}
                className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required>
                <option value="">Choose policy...</option>
                {policies.map((p) => <option key={p.id} value={p.id}>{p.policyNumber} — {p.cropName}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Reason</label>
              <select value={claimForm.reason} onChange={(e) => setClaimForm({...claimForm, reason: e.target.value})}
                className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required>
                <option value="">Select reason...</option>
                <option>Flood</option><option>Drought</option><option>Pest Attack</option><option>Hailstorm</option><option>Fire</option><option>Other Natural Calamity</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Description</label>
              <textarea value={claimForm.description} onChange={(e) => setClaimForm({...claimForm, description: e.target.value})}
                rows={3} className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required />
            </div>
            <button type="submit" className="rounded-xl bg-clay px-6 py-2.5 text-sm font-semibold text-paper hover:bg-red-700">
              Submit Claim
            </button>
          </form>
        </div>
      )}

      {/* Active Policies */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-soil">Active Policies</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {policies.map((p) => (
            <div key={p.id} className="card-hover rounded-2xl border border-soil/5 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-soil">{p.cropName}</h3>
                    <p className="text-xs text-soil-500">{p.policyNumber}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-leaf-100 px-3 py-1 text-xs font-medium text-leaf-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-dot" />
                  Active
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-soil-500">Sum Insured</p>
                  <p className="font-semibold text-soil">₹{Number(p.sumInsured).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-soil-500">Premium Paid</p>
                  <p className="font-semibold text-soil">₹{Number(p.premium).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-soil-500">Start Date</p>
                  <p className="font-semibold text-soil">{p.startDate}</p>
                </div>
                <div>
                  <p className="text-soil-500">End Date</p>
                  <p className="font-semibold text-soil">{p.endDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
