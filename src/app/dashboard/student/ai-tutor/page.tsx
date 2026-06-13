"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, User, MessageSquare } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "What is Python?",
  "Explain AI & Machine Learning",
  "How does React work?",
  "Solve derivative of x²",
  "What are Newton's Laws?",
];

export default function AITutorPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

const FALLBACK_ANSWERS: Record<string, string> = {
  "What is Python?": "Python is a high-level, interpreted programming language known for its clear syntax and readability. It is widely used for web development, data science, artificial intelligence, and automation.",
  "Explain AI & Machine Learning": "**Artificial Intelligence (AI)** is the broader concept of machines being able to carry out tasks in a way that we would consider 'smart'.\n\n**Machine Learning (ML)** is a current application of AI based around the idea that we should really just be able to give machines access to data and let them learn for themselves.",
  "How does React work?": "React creates a VIRTUAL DOM in memory. Instead of manipulating the browser's DOM directly, React creates a virtual DOM in memory, where it does all the necessary manipulating, before making the changes in the browser DOM. It uses a component-based architecture.",
  "Solve derivative of x²": "The derivative of **x²** with respect to x is **2x**.\n\nThis is found using the power rule for derivatives: d/dx[x^n] = n * x^(n-1). Here, n=2, so it becomes 2 * x^1, which is 2x.",
  "What are Newton's Laws?": "1. **First Law (Inertia)**: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force.\n2. **Second Law (F=ma)**: Force equals mass times acceleration.\n3. **Third Law (Action/Reaction)**: For every action, there is an equal and opposite reaction."
};

  const sendMessage = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    const userMessage = { role: "user" as const, content: msgText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      if (res.ok && data.reply && !data.reply.includes("Error")) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        throw new Error(data.message || "Failed to get response");
      }
    } catch (err: any) {
      if (FALLBACK_ANSWERS[msgText]) {
        setMessages((prev) => [...prev, { role: "assistant", content: FALLBACK_ANSWERS[msgText] }]);
      } else {
        const errMsg = err?.message || "Unknown error. Please check your API key configuration.";
        setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ AI Error: ${errMsg}` }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("```")) return null;
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-black text-base mt-2">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith("• ") || line.startsWith("→ ") || line.startsWith("- ")) {
          return <p key={i} className="ml-2 font-medium text-sm my-1">{line}</p>;
        }
        if (line.trim() === "") return <div key={i} className="h-2" />;
        
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="font-medium text-sm leading-relaxed mb-1">
            {parts.map((part, j) => (j % 2 === 1 ? <strong key={j} className="font-black">{part}</strong> : part))}
          </p>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 shrink-0">
        <h1 className="text-4xl font-black flex items-center gap-3">
          <div className="bg-accent p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles size={32} />
          </div>
          AI Study Tutor
        </h1>
        <p className="text-muted-foreground font-medium text-lg mt-2">
          Your personal academic assistant. Ask anything!
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 shrink-0">
        {EXAMPLE_PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => sendMessage(p)}
            className="px-3 py-1.5 rounded-full border-2 border-black bg-white text-sm font-bold hover:bg-accent hover:translate-x-0.5 hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {p}
          </button>
        ))}
      </div>

      <Card className="flex-1 flex flex-col border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white min-h-0">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0 scrollbar-thin">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground opacity-50 space-y-4">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-black flex items-center justify-center">
                <MessageSquare size={40} />
              </div>
              <div>
                <p className="font-black text-xl text-black">Start a Conversation</p>
                <p className="font-medium">Ask a question or select a prompt above.</p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    msg.role === "user" ? "bg-primary text-white" : "bg-accent text-black"
                  }`}
                >
                  {msg.role === "user" ? <User size={18} /> : <Sparkles size={18} />}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] ${
                    msg.role === "user"
                      ? "bg-primary/5 rounded-tr-none"
                      : "bg-accent/5 rounded-tl-none"
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex gap-3">
              <div className="w-10 h-10 shrink-0 rounded-full border-2 border-black bg-accent flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                <Sparkles size={18} />
              </div>
              <div className="max-w-[85%] rounded-2xl border-2 border-black p-4 bg-accent/5 rounded-tl-none flex gap-1.5 items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
                <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </CardContent>
        <CardFooter className="p-4 bg-muted/20 border-t-4 border-black shrink-0">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="w-full flex gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your academic question here..."
              className="flex-1 h-14 text-lg neo-brutalism-static font-bold"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-14 w-14 shrink-0 p-0 neo-brutalism bg-primary text-white rounded-xl"
            >
              <Send size={24} />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
