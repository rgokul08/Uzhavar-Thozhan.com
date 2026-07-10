"use client";

import { useState } from "react";
import { Tractor, Calendar, CheckCircle2, Clock, IndianRupee } from "lucide-react";

const equipmentList = [
  { id: 1, name: "Tractor (45 HP)", type: "Tractor", dailyRate: 1500, desc: "Mahindra 475 DI with rotavator attachment. Ideal for ploughing 2-5 acres/day.", available: true },
  { id: 2, name: "Drone Sprayer", type: "Drone", dailyRate: 2500, desc: "DJI Agras T30 — covers 10 acres/hour. Precise pesticide application with 50% chemical saving.", available: true },
  { id: 3, name: "Combined Harvester", type: "Harvester", dailyRate: 5000, desc: "Claas Crop Tiger 30. Perfect for rice, wheat. Harvests 8-10 acres/day.", available: true },
  { id: 4, name: "Seed Drill Machine", type: "Planter", dailyRate: 800, desc: "9-row seed drill for precise sowing. Saves 20% seed compared to manual broadcasting.", available: true },
  { id: 5, name: "Power Tiller", type: "Tiller", dailyRate: 600, desc: "VST Shakti 130 DI. Suitable for small holdings and inter-cultivation.", available: true },
  { id: 6, name: "Laser Land Leveller", type: "Leveller", dailyRate: 3000, desc: "Precision land levelling for uniform irrigation. Saves 25% water.", available: false },
  { id: 7, name: "Transplanting Robot", type: "Robot", dailyRate: 4000, desc: "Automated rice transplanter. Plants 1 acre/hour with perfect spacing.", available: true },
  { id: 8, name: "Mulch Layer", type: "Tool", dailyRate: 700, desc: "Plastic mulch laying machine. 1 acre in 2 hours. Reduces weed growth by 90%.", available: true },
];

export default function EquipmentPage() {
  const [bookingForm, setBookingForm] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("1");
  const [message, setMessage] = useState("");

  function handleBook(equipId: number) {
    const equip = equipmentList.find((e) => e.id === equipId);
    if (!equip) return;
    setMessage(`✅ ${equip.name} booked for ${duration} day(s) starting ${date}. Total: ₹${(equip.dailyRate * parseInt(duration)).toLocaleString()}. Confirmation SMS sent.`);
    setBookingForm(null);
    setDate("");
    setDuration("1");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-soil">Book Farm Equipment</h1>
        <p className="mt-1 text-soil-600">Reserve tractors, drones, harvesters and more at daily rates.</p>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-leaf/20 bg-leaf-50 px-4 py-3 text-sm text-leaf-700">
          <CheckCircle2 className="h-5 w-5" /> {message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {equipmentList.map((equip) => (
          <div key={equip.id} className="card-hover rounded-2xl border border-soil/5 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <Tractor className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-soil-50 px-2 py-0.5 text-xs text-soil-500">{equip.type}</span>
              </div>
              {equip.available ? (
                <span className="flex items-center gap-1 text-xs font-medium text-leaf">
                  <div className="h-1.5 w-1.5 rounded-full bg-leaf" /> Available
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium text-soil-400">
                  <Clock className="h-3 w-3" /> Booked
                </span>
              )}
            </div>
            <h3 className="mt-3 font-semibold text-soil">{equip.name}</h3>
            <p className="mt-1 text-xs text-soil-500">{equip.desc}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-0.5 text-lg font-bold text-soil">
                <IndianRupee className="h-4 w-4" />{equip.dailyRate.toLocaleString()}
                <span className="text-xs font-normal text-soil-400">/day</span>
              </span>
              {equip.available && (
                <button onClick={() => setBookingForm(bookingForm === equip.id ? null : equip.id)}
                  className="rounded-lg bg-leaf px-3 py-2 text-xs font-semibold text-paper hover:bg-leaf-600">
                  <Calendar className="inline h-3.5 w-3.5" /> Book
                </button>
              )}
            </div>

            {bookingForm === equip.id && (
              <div className="mt-4 rounded-lg border border-leaf/20 bg-leaf-50 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    className="rounded-lg border border-soil/20 px-3 py-2 text-xs focus:border-leaf focus:outline-none" required />
                  <select value={duration} onChange={(e) => setDuration(e.target.value)}
                    className="rounded-lg border border-soil/20 px-3 py-2 text-xs focus:border-leaf focus:outline-none">
                    {[1,2,3,5,7].map(d => <option key={d} value={d}>{d} day{d > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <button onClick={() => handleBook(equip.id)} disabled={!date}
                  className="mt-2 w-full rounded-lg bg-leaf py-2 text-xs font-semibold text-paper hover:bg-leaf-600 disabled:opacity-50">
                  Confirm Booking — ₹{(equip.dailyRate * parseInt(duration)).toLocaleString()}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
