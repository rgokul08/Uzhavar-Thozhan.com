"use client";

import { useState } from "react";
import { Video, Star, Clock, CheckCircle2, Calendar } from "lucide-react";

const experts = [
  { id: 1, name: "Dr. Kavitha Raman", specialization: "Plant Pathology", experience: "15 years", rating: 4.9, languages: "Tamil, English", availability: "Mon-Fri, 9AM-5PM", fee: 200 },
  { id: 2, name: "Prof. Senthil Kumar", specialization: "Soil Science", experience: "20 years", rating: 4.8, languages: "Tamil, Hindi, English", availability: "Mon-Sat, 10AM-4PM", fee: 300 },
  { id: 3, name: "Dr. Lakshmi Narayanan", specialization: "Entomology (Pest Control)", experience: "12 years", rating: 4.7, languages: "Tamil, English", availability: "Tue-Sat, 9AM-3PM", fee: 250 },
  { id: 4, name: "Dr. Arun Prakash", specialization: "Agronomy", experience: "18 years", rating: 4.9, languages: "Tamil, Telugu, English", availability: "Mon-Fri, 10AM-6PM", fee: 350 },
  { id: 5, name: "Dr. Meena Sundaram", specialization: "Horticulture", experience: "10 years", rating: 4.6, languages: "Tamil, English", availability: "Wed-Sun, 9AM-1PM", fee: 200 },
  { id: 6, name: "Dr. Ramesh Babu", specialization: "Veterinary Science", experience: "14 years", rating: 4.8, languages: "Tamil, Kannada, English", availability: "Mon-Sat, 8AM-2PM", fee: 300 },
];

export default function ExpertsPage() {
  const [message, setMessage] = useState("");
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");

  function handleBook(expertId: number) {
    const expert = experts.find((e) => e.id === expertId);
    if (!expert || !date) return;
    setMessage(`✅ Video consultation booked with ${expert.name} on ${date} at ${time}. You will receive a meeting link via SMS.`);
    setBookingId(null);
    setDate("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-soil">Talk to Plant Doctors</h1>
        <p className="mt-1 text-soil-600">Book live video consultations with agronomists, soil and pest-control experts.</p>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-leaf/20 bg-leaf-50 px-4 py-3 text-sm text-leaf-700">
          <CheckCircle2 className="h-5 w-5" /> {message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {experts.map((expert) => (
          <div key={expert.id} className="card-hover rounded-2xl border border-soil/5 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-lg font-bold">
                {expert.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
              </div>
              <div>
                <h3 className="font-semibold text-soil">{expert.name}</h3>
                <p className="text-xs text-leaf-600">{expert.specialization}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-soil-600">
              <div className="flex items-center gap-2">
                <Star className="h-3.5 w-3.5 fill-turmeric text-turmeric" />
                <span>{expert.rating}/5</span>
                <span className="text-soil-400">•</span>
                <span>{expert.experience}</span>
              </div>
              <p>🗣️ {expert.languages}</p>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-soil-400" />
                <span>{expert.availability}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-soil">₹{expert.fee}<span className="text-xs font-normal text-soil-400">/session</span></span>
              <button onClick={() => setBookingId(bookingId === expert.id ? null : expert.id)}
                className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700">
                <Video className="h-3.5 w-3.5" /> Book
              </button>
            </div>

            {bookingId === expert.id && (
              <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    className="rounded-lg border border-soil/20 px-3 py-2 text-xs focus:outline-none" required />
                  <select value={time} onChange={(e) => setTime(e.target.value)}
                    className="rounded-lg border border-soil/20 px-3 py-2 text-xs focus:outline-none">
                    {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"].map(t =>
                      <option key={t} value={t}>{t}</option>
                    )}
                  </select>
                </div>
                <button onClick={() => handleBook(expert.id)} disabled={!date}
                  className="mt-2 w-full rounded-lg bg-violet-600 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
                  <Calendar className="mr-1 inline h-3.5 w-3.5" /> Confirm — ₹{expert.fee}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
