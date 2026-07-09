"use client";

import { useEffect, useState } from "react";
import { Star, Video, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/PageHeader";

interface Expert {
  id: string; full_name: string; specialty: string; years_experience: number; languages: string[]; rating: number;
}

export default function ExpertsPage() {
  const supabase = createClient();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [booking, setBooking] = useState<Expert | null>(null);

  useEffect(() => {
    supabase.from("experts").select("*").eq("available", true).then(({ data }) => setExperts((data as Expert[]) ?? []));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function startCall(expert: Expert) {
    const roomCode = `uzhavar-${expert.id.slice(0, 8)}-${Date.now().toString(36)}`;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("consultations").insert({
        farmer_id: user.id, expert_id: expert.id, scheduled_at: new Date().toISOString(),
        room_code: roomCode, topic: expert.specialty, status: "scheduled",
      });
    }
    setActiveRoom(roomCode);
    setBooking(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Plant doctors"
        title="Talk to an expert, face to face"
        description="Free video consultations with agronomists and pest-control specialists — powered by an encrypted, keyless video room."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {experts.map((ex) => (
          <div key={ex.id} className="rounded-2xl border border-soil/10 bg-white/70 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-soil">{ex.full_name}</h3>
              <span className="flex items-center gap-1 text-xs font-medium text-turmeric-500">
                <Star className="h-3.5 w-3.5 fill-turmeric-300" /> {ex.rating}
              </span>
            </div>
            <p className="mt-1 text-sm text-leaf-600">{ex.specialty}</p>
            <p className="mt-2 text-xs text-soil-700/60">{ex.years_experience} yrs experience · {ex.languages?.join(", ")}</p>
            <button
              onClick={() => setBooking(ex)}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leaf py-2.5 text-sm font-semibold text-paper hover:bg-leaf-600"
            >
              <Video className="h-4 w-4" /> Start video consultation
            </button>
          </div>
        ))}
      </div>

      {booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-soil/60 px-6" onClick={() => setBooking(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-soil">Connect with {booking.full_name}?</h3>
            <p className="mt-2 text-sm text-soil-700">A private video room opens instantly — no app install needed.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setBooking(null)} className="flex-1 rounded-lg border border-soil/20 py-2.5 text-sm font-medium">Cancel</button>
              <button onClick={() => startCall(booking)} className="flex-1 rounded-lg bg-leaf py-2.5 text-sm font-semibold text-paper">Join now</button>
            </div>
          </div>
        </div>
      )}

      {activeRoom && (
        <div className="fixed inset-0 z-50 bg-soil">
          <button
            onClick={() => setActiveRoom(null)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-soil"
            aria-label="End call"
          >
            <X className="h-5 w-5" />
          </button>
          <iframe
            src={`https://meet.jit.si/${activeRoom}#config.prejoinPageEnabled=true`}
            allow="camera; microphone; fullscreen; display-capture"
            className="h-full w-full border-0"
          />
        </div>
      )}
    </div>
  );
}
