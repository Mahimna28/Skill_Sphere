"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, User, ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";

// Global motion easing
const easing = [0.25, 0.1, 0.25, 1.0] as const;

const EXAMPLE_PROMPTS = [
  "What is Python?",
  "Explain AI & Machine Learning",
  "How does React work?",
  "Solve derivative of x²",
  "What are Newton's Laws?",
];

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  feedback?: "up" | "down" | null;
}

const FALLBACK_ANSWERS: Record<string, string> = {
  "What is Python?":
    "Python is a high-level, interpreted programming language known for its clear syntax and readability. It is widely used for web development, data science, artificial intelligence, and automation.",
  "Explain AI & Machine Learning":
    "**Artificial Intelligence (AI)** is the broader concept of machines being able to carry out tasks in a way that we would consider 'smart'.\n\n**Machine Learning (ML)** is a current application of AI based around the idea that we should really just be able to give machines access to data and let them learn for themselves.",
  "How does React work?":
    "React creates a VIRTUAL DOM in memory. Instead of manipulating the browser's DOM directly, React creates a virtual DOM in memory, where it does all the necessary manipulating, before making the changes in the browser DOM. It uses a component-based architecture.",
  "Solve derivative of x²":
    "The derivative of **x²** with respect to x is **2x**.\n\nThis is found using the power rule for derivatives: d/dx[x^n] = n * x^(n-1). Here, n=2, so it becomes 2 * x^1, which is 2x.",
  "What are Newton's Laws?":
    "1. **First Law (Inertia)**: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force.\n2. **Second Law (F=ma)**: Force equals mass times acceleration.\n3. **Third Law (Action/Reaction)**: For every action, there is an equal and opposite reaction.",
};

export default function AITutorPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const formatCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendMessage = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: msgText,
      timestamp: formatCurrentTime(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (res.ok && data.reply && !data.reply.includes("Error")) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: data.reply,
            timestamp: formatCurrentTime(),
            feedback: null,
          },
        ]);
      } else {
        throw new Error(data.message || "Failed to get response");
      }
    } catch (err: any) {
      if (FALLBACK_ANSWERS[msgText]) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: FALLBACK_ANSWERS[msgText],
            timestamp: formatCurrentTime(),
            feedback: null,
          },
        ]);
      } else {
        const errMsg = err?.message || "Unknown error. Please check your API key configuration.";
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: `⚠️ AI Error: ${errMsg}`,
            timestamp: formatCurrentTime(),
            feedback: null,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (id: string, type: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: m.feedback === type ? null : type } : m))
    );
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderContent = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("```")) return null;
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-extrabold text-base text-[#1E1B2E] mt-3 mb-1">
              {line.slice(2, -2)}
            </p>
          );
        }
        if (line.startsWith("• ") || line.startsWith("→ ") || line.startsWith("- ")) {
          return (
            <p key={i} className="ml-3 font-medium text-sm text-[#1E1B2E] my-1 leading-relaxed">
              {line}
            </p>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-2" />;

        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="font-medium text-sm text-[#1E1B2E] leading-relaxed mb-1.5">
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-extrabold text-[#1E1B2E]">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })
      .filter(Boolean);
  };

  // Page container animation: fadeInUp + scale from 0.95 -> 1, 0.4s
  const containerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: easing },
    },
  };

  // Conversation bubbles spring bounce
  const bubbleVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: shouldReduceMotion
        ? { duration: 0.1 }
        : { type: "spring", stiffness: 320, damping: 26 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-130px)] min-h-[640px] flex flex-col font-sans pb-6"
    >
      {/* Sleek Page Header */}
      <div className="border-b border-[#1E1B2E]/10 pb-5 shrink-0">
        <h1
          className="text-[28px] sm:text-3xl font-extrabold text-[#1E1B2E] leading-tight tracking-tight flex items-center gap-2.5"
          style={{ fontFamily: "var(--font-heading, serif)" }}
        >
          <span>AI Study Tutor</span>
        </h1>
        <p className="text-[#8E8E93] text-sm font-medium mt-1">
          Ask questions and get instant help
        </p>
      </div>

      {/* Full-height Frosted Glass Tutor Container */}
      <div className="relative flex-1 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(30,27,46,0.06)] flex flex-col overflow-hidden min-h-0">
        {/* Ambient interior lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1E1B2E]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Prompt suggestions strip */}
        <div className="p-4 border-b border-[#1E1B2E]/10 bg-white/40 flex items-center gap-2 overflow-x-auto scrollbar-thin shrink-0 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8E8E93] shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" /> Prompts:
          </span>
          {EXAMPLE_PROMPTS.map((p, i) => (
            <motion.button
              key={i}
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              onClick={() => sendMessage(p)}
              disabled={loading}
              className="px-3.5 py-1 rounded-full bg-white/80 border border-white/90 text-xs font-bold text-[#1E1B2E] shadow-2xs hover:border-[#C9A96E]/60 hover:bg-[#C9A96E]/15 transition-all cursor-pointer shrink-0"
            >
              {p}
            </motion.button>
          ))}
        </div>

        {/* Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#1E1B2E]/10 relative z-10 min-h-0">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center my-auto py-12 text-[#8E8E93]">
              <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center mb-4 text-[#C9A96E]">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3
                className="text-xl font-bold text-[#1E1B2E] mb-1"
                style={{ fontFamily: "var(--font-heading, serif)" }}
              >
                Welcome to Your AI Tutor
              </h3>
              <p className="text-xs font-medium max-w-sm text-[#8E8E93]">
                Ask for step-by-step math breakdowns, programming explanations, or conceptual summaries.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                const isLatestAI = !isUser && idx === messages.length - 1;

                return (
                  <motion.div
                    key={msg.id || idx}
                    variants={bubbleVariants as any}
                    initial="hidden"
                    animate="visible"
                    className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
                      isUser ? "self-end items-end ml-auto" : "self-start items-start"
                    }`}
                  >
                    {/* Sender Label */}
                    <span className="text-xs font-medium text-[#8E8E93] mb-1 px-1 flex items-center gap-1.5">
                      {isUser ? (
                        <>
                          <span>You</span>
                          <User className="w-3 h-3 text-[#1E1B2E]" />
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-[#C9A96E]" />
                          <span>AI Study Tutor</span>
                        </>
                      )}
                    </span>

                    {/* Bubble with Liquid Ripple Shimmer on Hover */}
                    <motion.div
                      whileHover={
                        shouldReduceMotion
                          ? {}
                          : {
                              scale: 1.01,
                              transition: { duration: 0.2, ease: easing },
                            }
                      }
                      className={`relative overflow-hidden p-4 rounded-xl shadow-[0_4px_14px_rgba(30,27,46,0.05)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(30,27,46,0.08)] ${
                        isUser
                          ? "bg-gradient-to-r from-[#1E1B2E] to-[#2D2844] text-white rounded-br-xs border border-[#1E1B2E]"
                          : `bg-white/85 backdrop-blur-md text-[#1E1B2E] rounded-bl-xs border border-white/80 border-l-4 border-l-[#C9A96E] ${
                              isLatestAI ? "ring-2 ring-[#C9A96E]/30" : ""
                            }`
                      }`}
                    >
                      {/* Active AI response pulsing gold glow highlight */}
                      {!isUser && isLatestAI && (
                        <motion.div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none rounded-xl border border-[#C9A96E]/40"
                          animate={{ opacity: [0.3, 0.8, 0.3] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}

                      {/* Liquid Ripple Shimmer Sweep on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                        whileHover={{ translateX: "100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />

                      <div className="relative z-10 leading-relaxed break-words text-sm">
                        {isUser ? <p className="font-medium">{msg.content}</p> : renderContent(msg.content)}
                      </div>
                    </motion.div>

                    {/* Timestamp & Feedback Buttons aligned beneath bubble */}
                    <div className="flex items-center gap-3 mt-1.5 px-1">
                      <span className="text-[11px] text-[#8E8E93] font-medium">{msg.timestamp}</span>

                      {!isUser && (
                        <div className="flex items-center gap-1 ml-1">
                          <button
                            onClick={() => handleFeedback(msg.id, "up")}
                            aria-label="Helpful response"
                            className={`p-1 rounded-md transition-colors cursor-pointer ${
                              msg.feedback === "up"
                                ? "bg-[#22C55E]/15 text-[#22C55E]"
                                : "text-[#8E8E93] hover:text-[#1E1B2E] hover:bg-[#1E1B2E]/5"
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, "down")}
                            aria-label="Unhelpful response"
                            className={`p-1 rounded-md transition-colors cursor-pointer ${
                              msg.feedback === "down"
                                ? "bg-red-500/15 text-red-600"
                                : "text-[#8E8E93] hover:text-[#1E1B2E] hover:bg-[#1E1B2E]/5"
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            aria-label="Copy response"
                            className="p-1 rounded-md text-[#8E8E93] hover:text-[#1E1B2E] hover:bg-[#1E1B2E]/5 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {/* Loading Indicator */}
          {loading && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col self-start max-w-[75%]"
            >
              <span className="text-xs font-medium text-[#8E8E93] mb-1 px-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#C9A96E]" />
                <span>AI Study Tutor</span>
              </span>
              <div className="p-4 rounded-xl bg-white/85 backdrop-blur-md border border-white/80 border-l-4 border-l-[#C9A96E] shadow-[0_4px_14px_rgba(30,27,46,0.05)] flex items-center gap-2">
                <span className="text-xs font-bold text-[#8E8E93]">Thinking</span>
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Bottom Input Box Area (fadeInUp delay 0.3s) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: easing }}
          className="p-4 bg-white/40 border-t border-[#1E1B2E]/10 shrink-0 relative z-10"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-3"
          >
            {/* Frosted glass pill input bar */}
            <div className="flex-1 flex items-center bg-white/80 backdrop-blur-xl border border-white/80 rounded-full shadow-[0_4px_20px_rgba(30,27,46,0.06)] px-5 py-1.5 focus-within:ring-2 focus-within:ring-[#C9A96E]/50 focus-within:border-[#C9A96E] transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                disabled={loading}
                className="w-full bg-transparent border-none focus:outline-none font-sans text-sm text-[#1E1B2E] placeholder:text-[#8E8E93] py-2 disabled:opacity-50"
              />
            </div>

            {/* Premium Gold Send Button */}
            <motion.button
              type="submit"
              disabled={loading || !input.trim()}
              whileHover={shouldReduceMotion || loading || !input.trim() ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion || loading || !input.trim() ? {} : { scale: 0.97 }}
              aria-label="Send question to AI tutor"
              className={`h-11 px-5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shrink-0 shadow-sm ${
                input.trim() && !loading
                  ? "bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] shadow-[0_4px_14px_rgba(201,169,110,0.3)] hover:shadow-[0_0_18px_rgba(201,169,110,0.6)]"
                  : "bg-[#1E1B2E]/10 text-[#8E8E93] cursor-not-allowed opacity-60"
              }`}
            >
              <span>Send</span>
              <Send className="w-4 h-4 shrink-0" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
