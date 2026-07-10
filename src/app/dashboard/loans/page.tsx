"use client";

import { useState, useEffect } from "react";
import { HandCoins, Plus, CheckCircle2, Clock, FileText } from "lucide-react";

interface LoanApp {
  id: number;
  loanType: string | null;
  amount: string | null;
  purpose: string | null;
  status: string | null;
  createdAt: string;
}

const loanTypes = [
  { type: "Kisan Credit Card (KCC)", maxAmount: "₹3,00,000", interest: "4% p.a.", tenure: "5 years" },
  { type: "Agri Term Loan", maxAmount: "₹10,00,000", interest: "7% p.a.", tenure: "3-7 years" },
  { type: "Farm Equipment Loan", maxAmount: "₹25,00,000", interest: "8.5% p.a.", tenure: "5-10 years" },
  { type: "Crop Production Loan", maxAmount: "₹5,00,000", interest: "5% p.a.", tenure: "1 year" },
];

export default function LoansPage() {
  const [showForm, setShowForm] = useState(false);
  const [applications, setApplications] = useState<LoanApp[]>([]);
  const [form, setForm] = useState({ loanType: "", amount: "", purpose: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/loans").then(r => r.json()).then(d => setApplications(d.applications || [])).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(prev => [data.application, ...prev]);
        setMessage("✅ Loan application submitted! Reference number: LOAN-" + data.application.id);
        setShowForm(false);
        setForm({ loanType: "", amount: "", purpose: "" });
      }
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-soil">Farm Loans</h1>
          <p className="mt-1 text-soil-600">Apply for KCC and other agri-loans at subsidised interest rates.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-leaf px-4 py-2.5 text-sm font-semibold text-paper hover:bg-leaf-600">
          <Plus className="h-4 w-4" /> Apply for Loan
        </button>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-leaf/20 bg-leaf-50 px-4 py-3 text-sm text-leaf-700">
          <CheckCircle2 className="h-5 w-5" /> {message}
        </div>
      )}

      {/* Loan types */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loanTypes.map((lt) => (
          <div key={lt.type} className="rounded-2xl border border-soil/5 bg-white p-5">
            <HandCoins className="h-6 w-6 text-yellow-600" />
            <h3 className="mt-3 font-semibold text-soil">{lt.type}</h3>
            <div className="mt-3 space-y-1 text-sm text-soil-600">
              <p>Max: <span className="font-medium text-soil">{lt.maxAmount}</span></p>
              <p>Interest: <span className="font-medium text-leaf">{lt.interest}</span></p>
              <p>Tenure: {lt.tenure}</p>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="rounded-2xl border border-leaf/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-soil">Loan Application</h2>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Loan Type</label>
              <select value={form.loanType} onChange={(e) => setForm({...form, loanType: e.target.value})}
                className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required>
                <option value="">Select type...</option>
                {loanTypes.map((l) => <option key={l.type} value={l.type}>{l.type}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})}
                placeholder="100000" className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Purpose</label>
              <input type="text" value={form.purpose} onChange={(e) => setForm({...form, purpose: e.target.value})}
                placeholder="Crop production, equipment..." className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required />
            </div>
            <div className="sm:col-span-3">
              <button type="submit" className="rounded-xl bg-leaf px-6 py-2.5 text-sm font-semibold text-paper hover:bg-leaf-600">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Applications */}
      {applications.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-soil">Your Applications</h2>
          <div className="space-y-3">
            {applications.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-soil/5 bg-white p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-soil">{a.loanType}</p>
                    <p className="text-xs text-soil-500">{a.purpose} • ₹{Number(a.amount).toLocaleString()}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  <Clock className="h-3 w-3" /> {a.status || "pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
