"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, User, Mic } from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface Msg { role: "user" | "assistant"; content: string; }

const languages = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "hi", label: "हिंदी" },
];

const starters = [
  "Which fertilizer suits my black soil cotton field?",
  "Is there a scheme for drip irrigation subsidy?",
  "What's the ideal sowing time for paddy this season?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, language }),
      });
      const data = await res.json();
      if (res.status === 501) {
        setNotConfigured(true);
        setMessages([...next, { role: "assistant", content: data.error }]);
      } else if (data.error) {
        setMessages([...next, { role: "assistant", content: `Sorry — ${data.error}` }]);
      } else {
        setMessages([...next, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "Network error — please try again." }]);
    }
    setLoading(false);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex items-start justify-between">
        <PageHeader eyebrow="AI Assistant" title="Ask anything about your farm" description="Crop advice, schemes, prices, weather, insurance and loans — in your language." />
        <select value={language} onChange={(e) => setLanguage(e.target.value)}
          className="rounded-lg border border-soil/20 px-3 py-2 text-sm dark:border-paper/20 dark:bg-night-card">
          {languages.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>

      {notConfigured && (
        <div className="mb-4 rounded-xl border border-turmeric/30 bg-turmeric-300/20 p-4 text-sm text-soil">
          The assistant needs an <code className="font-mono">OPENAI_API_KEY</code> set in your environment variables to go live.
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-soil/10 bg-white/50 p-5 dark:border-paper/10 dark:bg-night-card/40">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <Bot className="h-10 w-10 text-leaf" />
            <p className="text-sm text-soil-700 dark:text-paper/60">Try asking:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {starters.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border border-leaf/30 bg-leaf-200/30 px-4 py-2 text-xs text-leaf-600">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-leaf text-paper" : "bg-turmeric-300/40 text-turmeric-500"}`}>
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </span>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-leaf text-paper" : "bg-white dark:bg-night-card dark:text-paper"}`}>
              {m.content}
            </div>
          </motion.div>
        ))}
        {loading && <p className="text-xs text-soil-700/60">Thinking…</p>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="mt-4 flex items-center gap-3">
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-soil/15 text-soil-700/60 dark:border-paper/15" title="Voice input (browser SpeechRecognition can be wired here)">
          <Mic className="h-4 w-4" />
        </button>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question…"
          className="flex-1 rounded-full border border-soil/20 px-5 py-3 text-sm outline-none focus:border-leaf dark:border-paper/20 dark:bg-night-card" />
        <button type="submit" className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf text-paper hover:bg-leaf-600">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
