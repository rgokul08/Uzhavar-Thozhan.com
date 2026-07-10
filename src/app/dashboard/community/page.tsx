"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Heart, MessageCircle, CheckCircle2 } from "lucide-react";

interface Post {
  id: number;
  title: string | null;
  content: string | null;
  category: string | null;
  likes: number | null;
  createdAt: string;
}

const categories = ["All", "Question", "Tip", "Success Story", "Market Info", "Weather Alert"];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ title: "", content: "", category: "Question" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/community").then(r => r.json()).then(d => setPosts(d.posts || [])).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => [data.post, ...prev]);
        setMessage("✅ Post published to the community!");
        setShowForm(false);
        setForm({ title: "", content: "", category: "Question" });
      }
    } catch { /* ignore */ }
  }

  const filtered = filter === "All" ? posts : posts.filter(p => p.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-soil">Farmer Community</h1>
          <p className="mt-1 text-soil-600">Ask questions, share tips, and learn from farmers nearby.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-leaf px-4 py-2.5 text-sm font-semibold text-paper hover:bg-leaf-600">
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-leaf/20 bg-leaf-50 px-4 py-3 text-sm text-leaf-700">
          <CheckCircle2 className="h-5 w-5" /> {message}
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-leaf/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-soil">Share with the Community</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-soil-700">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="Your question or tip..." className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-soil-700">Category</label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none">
                  {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Content</label>
              <textarea value={form.content} onChange={(e) => setForm({...form, content: e.target.value})}
                rows={4} placeholder="Share your experience, question, or advice..."
                className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required />
            </div>
            <button type="submit" className="rounded-xl bg-leaf px-6 py-2.5 text-sm font-semibold text-paper hover:bg-leaf-600">
              Publish Post
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === c ? "bg-leaf text-paper" : "bg-white border border-soil/10 text-soil-600 hover:bg-leaf-50"
            }`}>
            {c}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.map((post) => (
          <div key={post.id} className="card-hover rounded-2xl border border-soil/5 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                {post.category && (
                  <span className="mb-2 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {post.category}
                  </span>
                )}
                <h3 className="text-lg font-semibold text-soil">{post.title}</h3>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-soil-600">{post.content}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-soil-400">
              <button className="flex items-center gap-1 hover:text-clay">
                <Heart className="h-4 w-4" /> {post.likes || 0}
              </button>
              <button className="flex items-center gap-1 hover:text-leaf">
                <MessageCircle className="h-4 w-4" /> Reply
              </button>
              <span className="text-xs">
                {new Date(post.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-soil/10 bg-white p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-soil-300" />
            <p className="mt-4 text-soil-500">No posts yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );
}
