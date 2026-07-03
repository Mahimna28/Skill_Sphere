"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MessageSquare,
  Users,
  UserPlus,
  Search,
  Plus,
  Sparkles,
  CheckCircle2,
  Lock,
  X,
  Loader2,
  AtSign,
} from "lucide-react";
import MessagesPage from "../../../chat/direct/page";

export default function HubMessages() {
  const prefersReduced = useReducedMotion() ?? false;
  const [showQuickConnect, setShowQuickConnect] = useState(false);
  const [quickQuery, setQuickQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [sentNotice, setSentNotice] = useState(false);

  // Wire composer focus keyboard shortcut '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        const composerInput = document.querySelector<HTMLInputElement>(".wrapped-child-page input[placeholder*='Type a message'], .wrapped-child-page input[type='text']");
        if (composerInput) {
          composerInput.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleQuickSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/users/search?username=${quickQuery}`);
      const data = await res.json();
      if (res.ok) setResults(data.users || []);
    } catch (err) {} finally {
      setSearching(false);
    }
  };

  const sendDirectRequest = async (userId: string) => {
    try {
      await fetch("/api/chat/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      });
      setSentNotice(true);
      setTimeout(() => setSentNotice(false), 2500);
    } catch (err) {}
  };

  return (
    <div className="flex flex-col h-full space-y-4 font-sans">
      {/* Top Enhancement & Status Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E1B2E] text-[#C9A96E] flex items-center justify-center font-bold text-sm shadow-2xs">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1E1B2E]">Direct Messaging & Study Groups</h3>
            <p className="text-xs text-[#8E8E93] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span>Real-time encrypted communication active · Keyboard shortcut: Press <kbd className="bg-black/5 px-1 rounded font-mono font-bold">/</kbd> to focus composer</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <motion.button
            onClick={() => setShowQuickConnect(true)}
            whileHover={prefersReduced ? {} : { scale: 1.03 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            className="h-9 px-4 rounded-xl bg-[#1E1B2E] text-[#C9A96E] font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <UserPlus size={14} />
            <span>Quick Connect</span>
          </motion.button>
        </div>
      </div>

      {sentNotice && (
        <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 p-3 rounded-xl flex items-center gap-2 text-xs font-bold text-[#22C55E]">
          <CheckCircle2 size={16} />
          <span>Connection request sent successfully!</span>
        </div>
      )}

      {/* Wrapped Child Component Layer */}
      <div className="flex-1 min-h-[560px] wrapped-child-page hub-legacy-messages relative overflow-hidden rounded-2xl">
        <MessagesPage />
      </div>

      {/* Quick Connect Modal */}
      <AnimatePresence>
        {showQuickConnect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={prefersReduced ? {} : { scale: 0.95, y: 15 }}
              animate={prefersReduced ? {} : { scale: 1, y: 0 }}
              exit={prefersReduced ? {} : { scale: 0.95, y: 15 }}
              className="bg-white/95 backdrop-blur-2xl rounded-2xl p-6 max-w-md w-full border border-white/80 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#1E1B2E]/10 pb-3">
                <h3 className="text-base font-bold text-[#1E1B2E] flex items-center gap-2">
                  <UserPlus size={16} className="text-[#C9A96E]" />
                  <span>Find & Connect with Peers</span>
                </h3>
                <button onClick={() => setShowQuickConnect(false)} className="text-[#8E8E93] hover:text-[#1E1B2E] cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleQuickSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <AtSign className="absolute left-3 top-3 h-4 w-4 text-[#8E8E93]" />
                  <input
                    type="text"
                    placeholder="Search username e.g. alex_99..."
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-black/10 text-xs font-semibold text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searching}
                  className="h-10 px-4 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  {searching ? <Loader2 className="animate-spin w-4 h-4" /> : "Search"}
                </button>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto pt-2">
                {results.length === 0 && !searching && (
                  <p className="text-xs text-center text-[#8E8E93] py-6">Enter a username to search.</p>
                )}
                {results.map((u: any) => (
                  <div key={u.id} className="p-3 rounded-xl bg-black/5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#1E1B2E] truncate">{u.name}</p>
                      <p className="text-[10px] text-[#8E8E93]">@{u.username} · {u.role}</p>
                    </div>
                    <button
                      onClick={() => sendDirectRequest(u.id)}
                      className="h-8 px-3 rounded-lg bg-[#1E1B2E] text-[#C9A96E] font-bold text-[11px] cursor-pointer"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2 border-t border-black/5">
                <button
                  onClick={() => setShowQuickConnect(false)}
                  className="h-9 px-4 rounded-xl bg-black/5 hover:bg-black/10 text-[#1E1B2E] font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
