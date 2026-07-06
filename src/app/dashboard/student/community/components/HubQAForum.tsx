"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  HelpCircle,
  PlusCircle,
  Search,
  Tag,
  Filter,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  MessageSquare,
  X,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import QAPage from "../../../qa/page";

const TOPICS = ["All", "General", "Python", "React", "Calculus", "Physics", "AI"];
const SORTS = ["Newest", "Most Answers", "Most Votes", "Unanswered"];

export default function HubQAForum() {
  const prefersReduced = useReducedMotion() ?? false;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [showAskModal, setShowAskModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>(["General"]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successSweep, setSuccessSweep] = useState(false);

  const toggleTag = (t: string) => {
    if (t === "All") return;
    setTags((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setErrorMsg("Please provide both a title and details for your question.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `[${tags.join(", ")}] ${title}`,
          content: body,
        }),
      });
      if (res.ok) {
        setSuccessSweep(true);
        setTimeout(() => {
          setTitle("");
          setBody("");
          setShowAskModal(false);
          setSuccessSweep(false);
          // Trigger reload of questions in wrapped component by dispatching event or letting QAPage fetch
        }, 1200);
      } else {
        setErrorMsg("Failed to submit question. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error submitting question.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 font-sans">
      {/* Top Filter & Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-sm space-y-3.5 shrink-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8E8E93]" />
            <input
              type="text"
              placeholder="Search questions or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 rounded-xl bg-white border border-black/10 text-xs font-bold text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E] cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  Sort: {s}
                </option>
              ))}
            </select>

            {/* Ask Question CTA */}
            <motion.button
              onClick={() => setShowAskModal(true)}
              whileHover={prefersReduced ? {} : { scale: 1.03 }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
              className="h-10 px-4 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-xs flex items-center gap-1.5 shadow-[0_4px_14px_rgba(201,169,110,0.3)] cursor-pointer shrink-0"
            >
              <PlusCircle size={15} />
              <span>Ask Question</span>
            </motion.button>
          </div>
        </div>

        {/* Topic Pill Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] flex items-center gap-1 mr-1 shrink-0">
            <Tag size={13} /> Topics:
          </span>
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedTopic === topic
                  ? "bg-[#1E1B2E] text-[#C9A96E] shadow-xs"
                  : "bg-white/60 hover:bg-white text-[#1E1B2E] border border-black/5"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Wrapped Child Component Layer */}
      <div className="flex-1 min-h-[560px] wrapped-child-page hub-legacy-forum relative overflow-hidden rounded-2xl">
        <QAPage />
      </div>

      {/* Ask Question Modal */}
      <AnimatePresence>
        {showAskModal && (
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
              className="bg-white/95 backdrop-blur-2xl rounded-2xl p-6 md:p-8 max-w-lg w-full border border-white/80 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#1E1B2E]/10 pb-3">
                <h3
                  className="text-lg font-bold text-[#1E1B2E] flex items-center gap-2"
                  style={{ fontFamily: "var(--font-heading, serif)" }}
                >
                  <Sparkles className="text-[#C9A96E]" size={18} />
                  <span>Ask the Community</span>
                </h3>
                <button
                  onClick={() => setShowAskModal(false)}
                  className="text-[#8E8E93] hover:text-[#1E1B2E] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {successSweep ? (
                <div className="py-12 text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-16 h-16 rounded-full bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 size={36} />
                  </motion.div>
                  <h4 className="text-lg font-bold text-[#1E1B2E]">Question Posted Successfully!</h4>
                  <p className="text-xs text-[#8E8E93]">Your question has been broadcast to the forum.</p>
                </div>
              ) : (
                <form onSubmit={handleAskQuestion} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., How do I resolve recursion limit errors in Python?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-black/10 text-sm font-semibold text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1">
                      Topic Tags (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {TOPICS.filter((t) => t !== "All").map((t) => {
                        const sel = tags.includes(t);
                        return (
                          <button
                            type="button"
                            key={t}
                            onClick={() => toggleTag(t)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              sel
                                ? "bg-[#C9A96E] text-[#1E1B2E] shadow-2xs"
                                : "bg-black/5 hover:bg-black/10 text-[#8E8E93]"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1">
                      Question Details (Markdown supported)
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Explain what you have tried, share code snippets, or specify expected behavior..."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E] leading-relaxed resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-xs font-bold text-[#EF4444] flex items-center gap-2">
                      <AlertCircle size={16} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-black/5">
                    <p className="text-[11px] text-[#8E8E93] flex items-center gap-1">
                      <FileText size={13} /> Attachments supported in comments
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAskModal(false)}
                        className="h-10 px-4 rounded-xl font-bold text-xs text-[#8E8E93] hover:bg-black/5 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="h-10 px-6 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] font-bold text-xs text-[#1E1B2E] flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {submitting && <Loader2 className="animate-spin w-3.5 h-3.5" />}
                        <span>Post Question</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
