"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What crops should I grow in black soil?",
  "How to control stem borer in rice?",
  "Explain PM-KISAN scheme eligibility",
  "Best organic fertilizers for tomato",
  "When to apply urea for wheat?",
  "How to get Kisan Credit Card?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "வணக்கம்! 🌾 I'm your AI Farming Assistant. Ask me anything about crops, soil, pests, government schemes, or farming practices. I can help in English, Tamil, and Hindi.\n\nTry asking:\n• What crops suit my soil type?\n• How to prevent leaf curl in chilli?\n• Which government schemes can I apply for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process your request. Please try again." },
      ]);
    }
    setLoading(false);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-soil">
          <Sparkles className="h-6 w-6 text-purple-500" />
          AI Farming Assistant
        </h1>
        <p className="mt-1 text-soil-600">Ask crop, disease, scheme or price questions — answered instantly.</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-soil/5 bg-white p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-leaf text-paper"
                    : "bg-soil-50 text-soil-700"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf text-paper">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-soil-50 px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-soil-400" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-soil-400" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-soil-400" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="rounded-full border border-soil/10 bg-white px-3 py-1.5 text-xs text-soil-600 transition-colors hover:border-leaf/30 hover:bg-leaf-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about crops, soil, pests, schemes..."
          className="flex-1 rounded-xl border border-soil/20 bg-white px-4 py-3 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20"
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf text-paper transition-colors hover:bg-leaf-600 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
