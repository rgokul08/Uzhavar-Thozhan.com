"use client";

import { useEffect, useState } from "react";
import { Tractor } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/PageHeader";

interface Equip { id: string; name: string; type: string; rate_per_day: number; available: boolean; }

export default function EquipmentPage() {
  const supabase = createClient();
  const [equipment, setEquipment] = useState<Equip[]>([]);
  const [booking, setBooking] = useState<Equip | null>(null);
  const [dates, setDates] = useState({ start_date: "", end_date: "", delivery_address: "" });
  const [toast, setToast] = useState("");

  useEffect(() => {
    supabase.from("equipment").select("*").eq("available", true).then(({ data }) => setEquipment((data as Equip[]) ?? []));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function confirmBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!booking) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const days = Math.max(1, (new Date(dates.end_date).getTime() - new Date(dates.start_date).getTime()) / 86400000 + 1);
    await supabase.from("equipment_bookings").insert({
      farmer_id: user.id, equipment_id: booking.id,
      start_date: dates.start_date, end_date: dates.end_date,
      delivery_address: dates.delivery_address,
      total_cost: Math.round(days * booking.rate_per_day),
    });
    setToast(`${booking.name} booked for ${days} day(s).`);
    setBooking(null);
    setDates({ start_date: "", end_date: "", delivery_address: "" });
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div>
      <PageHeader eyebrow="Machinery" title="Book tractors, drones & robots by the day" description="Advance-book equipment for your field, delivered to your location." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {equipment.map((eq) => (
          <div key={eq.id} className="rounded-2xl border border-soil/10 bg-white/70 p-5">
            <Tractor className="h-6 w-6 text-leaf" />
            <h3 className="mt-3 font-display text-lg font-semibold text-soil">{eq.name}</h3>
            <p className="mt-1 text-xs capitalize text-soil-700/60">{eq.type.replace("_", " ")}</p>
            <p className="mt-3 font-mono text-lg font-semibold text-leaf-600">₹{eq.rate_per_day.toLocaleString("en-IN")} <span className="text-xs text-soil-700/60">/ day</span></p>
            <button onClick={() => setBooking(eq)} className="mt-4 w-full rounded-lg bg-leaf py-2 text-sm font-semibold text-paper hover:bg-leaf-600">
              Book now
            </button>
          </div>
        ))}
      </div>

      {booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-soil/60 px-6" onClick={() => setBooking(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={confirmBooking} className="w-full max-w-sm space-y-3 rounded-2xl bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-soil">Book {booking.name}</h3>
            <input required type="date" value={dates.start_date} onChange={(e) => setDates({ ...dates, start_date: e.target.value })}
              className="w-full rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
            <input required type="date" value={dates.end_date} onChange={(e) => setDates({ ...dates, end_date: e.target.value })}
              className="w-full rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
            <input required placeholder="Delivery address" value={dates.delivery_address}
              onChange={(e) => setDates({ ...dates, delivery_address: e.target.value })}
              className="w-full rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setBooking(null)} className="flex-1 rounded-lg border border-soil/20 py-2.5 text-sm font-medium">Cancel</button>
              <button type="submit" className="flex-1 rounded-lg bg-leaf py-2.5 text-sm font-semibold text-paper">Confirm booking</button>
            </div>
          </form>
        </div>
      )}

      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-soil px-5 py-2.5 text-sm text-paper shadow-lg">{toast}</div>}
    </div>
  );
}
