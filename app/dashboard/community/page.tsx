"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/PageHeader";

interface Post { id: string; title: string; body: string; category: string; created_at: string; }

export default function CommunityPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState({ title: "", body: "", category: "general" });

  async function load() {
    const { data } = await supabase.from("forum_posts").select("*").order("created_at", { ascending: false });
    setPosts((data as Post[]) ?? []);
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("forum_posts").insert({ farmer_id: user.id, ...form });
    setForm({ title: "", body: "", category: "general" });
    load();
  }

  return (
    <div>
      <PageHeader eyebrow="Community" title="Ask fellow farmers" description="Share what's working in your field, or ask a question — answered by farmers growing the same crop." />

      <form onSubmit={handlePost} className="mb-10 grid gap-3 rounded-2xl border border-soil/10 bg-white/70 p-6">
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
        <textarea required placeholder="What's on your mind?" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
          rows={3} className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
        <button type="submit" className="justify-self-start rounded-lg bg-leaf px-5 py-2.5 text-sm font-semibold text-paper">Post</button>
      </form>

      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="rounded-2xl border border-soil/10 bg-white/70 p-5">
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-soil">
              <MessageCircle className="h-5 w-5 text-leaf" /> {p.title}
            </div>
            <p className="mt-2 text-sm text-soil-700">{p.body}</p>
            <p className="mt-2 font-mono text-xs text-soil-700/60">{new Date(p.created_at).toLocaleDateString("en-IN")}</p>
          </div>
        ))}
        {posts.length === 0 && <p className="text-sm text-soil-700">No discussions yet — be the first to post.</p>}
      </div>
    </div>
  );
}
