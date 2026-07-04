"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, User, Send, PlusCircle, HelpCircle, CheckCircle2, 
  ChevronDown, ChevronUp, Trash2, Search, Sparkles, Tag, ArrowRight, X 
} from "lucide-react";

const easing = [0.25, 0.1, 0.25, 1.0] as const;

const COMMON_TAGS = ["All", "General", "Python", "React", "Calculus", "Physics", "AI"];

export default function QAPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAsk, setShowAsk] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    fetchQuestions();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok) {
        setUserId(data.user.id);
        setUserRole(data.user.role);
      }
    } catch (err) {}
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/qa");
      const data = await res.json();
      if (res.ok) setQuestions(data.questions || []);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        setShowAsk(false);
        fetchQuestions();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswer = async (questionId: string) => {
    if (!answerContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/qa/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: answerContent, questionId }),
      });
      if (res.ok) {
        setAnswerContent("");
        fetchQuestions();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(`/api/qa?id=${questionId}`, { method: "DELETE" });
      if (res.ok) fetchQuestions();
    } catch (err) {}
  };

  // Filtered questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === "All" ||
      q.title.toLowerCase().includes(selectedTag.toLowerCase()) ||
      q.content.toLowerCase().includes(selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  // Framer Motion variants
  const containerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: easing },
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: easing },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto space-y-6 font-sans pb-16"
    >
      {/* Sleek Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1B2E]/10 pb-5">
        <div>
          <h1
            className="text-[28px] sm:text-3xl font-bold text-[#1E1B2E] leading-tight flex items-center gap-2.5"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            <span>Q&A Forum</span>
          </h1>
          <p className="text-[#8E8E93] text-sm font-medium mt-1">
            Ask, answer, and collaborate with peers and instructors
          </p>
        </div>
        <motion.button
          onClick={() => setShowAsk(!showAsk)}
          whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
          aria-label="Ask a question"
          className="h-11 px-6 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(201,169,110,0.3)] hover:shadow-[0_0_18px_rgba(201,169,110,0.6)] transition-all cursor-pointer shrink-0"
        >
          {showAsk ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          <span>{showAsk ? "Close Composer" : "Ask Question"}</span>
        </motion.button>
      </div>

      {/* Composer Modal/Panel */}
      <AnimatePresence>
        {showAsk && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
            className="p-6 md:p-8 rounded-2xl bg-white/80 backdrop-blur-xl border-2 border-[#C9A96E] shadow-[0_12px_40px_rgba(30,27,46,0.08)] space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#1E1B2E]/10 pb-3">
              <h2
                className="text-lg font-bold text-[#1E1B2E] flex items-center gap-2"
                style={{ fontFamily: "var(--font-heading, serif)" }}
              >
                <Sparkles className="w-5 h-5 text-[#C9A96E]" />
                <span>Ask the Community</span>
              </h2>
            </div>
            <form onSubmit={handleAsk} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1.5">
                  Question Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How to solve quadratic equations using derivative rules?"
                  required
                  className="w-full h-11 px-4 rounded-xl bg-white/90 border border-[#1E1B2E]/20 text-[#1E1B2E] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1.5">
                  Detailed Explanation
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide any relevant context, code snippets, or formulas you need help understanding…"
                  required
                  rows={4}
                  className="w-full p-4 rounded-xl bg-white/90 border border-[#1E1B2E]/20 text-[#1E1B2E] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E] transition-all leading-relaxed"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-11 px-8 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Posting…" : "Post Question"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAsk(false)}
                  className="h-11 px-6 rounded-xl bg-[#1E1B2E]/5 hover:bg-[#1E1B2E]/10 text-[#1E1B2E] font-semibold text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Search and Tag Filter Strip */}
      <div className="sticky top-0 z-20 p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgba(30,27,46,0.06)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white/80 border border-[#1E1B2E]/15 rounded-full px-4 py-1.5 flex-1 focus-within:ring-2 focus-within:ring-[#C9A96E]">
          <Search className="w-4 h-4 text-[#8E8E93] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords…"
            className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-[#1E1B2E] placeholder:text-[#8E8E93]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#C9A96E]" /> Topics:
          </span>
          {COMMON_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedTag === tag
                  ? "bg-[#1E1B2E] text-[#C9A96E] shadow-sm"
                  : "bg-white/80 hover:bg-[#1E1B2E]/10 text-[#1E1B2E] border border-[#1E1B2E]/10"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Vertical List */}
      {loading ? (
        <div className="py-20 text-center font-bold text-sm text-[#8E8E93] animate-pulse">
          Loading forum discussions…
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 text-[#8E8E93] space-y-2">
          <HelpCircle className="w-12 h-12 text-[#C9A96E] mx-auto opacity-60" />
          <h3 className="text-lg font-bold text-[#1E1B2E]">No questions found</h3>
          <p className="text-xs max-w-sm mx-auto font-medium">
            No discussions match your current search or topic filter. Be the first to start a discussion!
          </p>
        </div>
      ) : (
        <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-4">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            const initials = q.author?.name
              ? q.author.name
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "U";

            return (
              <motion.div
                key={q.id}
                variants={cardVariants}
                className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(30,27,46,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_32px_rgba(30,27,46,0.1)]"
              >
                {/* Question Row Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="p-5 md:p-6 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/40 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1E1B2E] to-[#2D2844] text-[#C9A96E] flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      {q.author?.image ? (
                        <img src={q.author.image} className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-xs text-[#1E1B2E]">{q.author?.name}</span>
                        <span className="text-[11px] font-semibold text-[#8E8E93]">
                          • {new Date(q.createdAt).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#1E1B2E]/5 text-[#1E1B2E] font-bold text-[10px] uppercase">
                          {q.author?.role || "Student"}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-[#1E1B2E] leading-snug mb-1.5">
                        {q.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#8E8E93] font-medium line-clamp-2 leading-relaxed">
                        {q.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <div className="px-3 py-1.5 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/30 text-[#1E1B2E] text-xs font-bold flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#C9A96E]" />
                      <span>{q._count?.answers || q.answers?.length || 0} Answers</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#1E1B2E]/5 flex items-center justify-center text-[#1E1B2E]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Question Detail & Answers Modal/Area */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      className="border-t border-[#1E1B2E]/10 bg-white/50 p-6 md:p-8 space-y-6"
                    >
                      {/* Full question content box */}
                      <div className="p-5 rounded-xl bg-white border border-[#1E1B2E]/10 shadow-sm relative">
                        <p className="text-sm font-medium text-[#1E1B2E] leading-relaxed whitespace-pre-wrap">
                          {q.content}
                        </p>
                        {(q.authorId === userId || userRole === "superadmin" || userRole === "institute_admin") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(q.id);
                            }}
                            className="absolute top-3 right-3 p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            aria-label="Delete question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Answers List */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                          <span>Community Answers ({q.answers?.length || 0})</span>
                        </h4>

                        {q.answers && q.answers.length > 0 ? (
                          q.answers.map((a: any) => (
                            <div
                              key={a.id}
                              className="p-4 rounded-xl bg-white/80 border border-white border-l-4 border-l-[#C9A96E] shadow-2xs space-y-2"
                            >
                              <div className="flex items-center justify-between text-xs font-bold text-[#8E8E93]">
                                <span className="text-[#1E1B2E]">
                                  {a.author?.name}{" "}
                                  <span className="opacity-60 font-semibold">({a.author?.role})</span>
                                </span>
                                <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm font-medium text-[#1E1B2E] leading-relaxed">
                                {a.content}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs font-medium text-[#8E8E93] italic">
                            No answers yet. Share your knowledge below!
                          </p>
                        )}
                      </div>

                      {/* Answer Composer */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <input
                          type="text"
                          value={answerContent}
                          onChange={(e) => setAnswerContent(e.target.value)}
                          placeholder="Write your answer or explanation…"
                          className="flex-1 h-11 px-4 rounded-xl bg-white border border-[#1E1B2E]/20 text-[#1E1B2E] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                        />
                        <button
                          onClick={() => handleAnswer(q.id)}
                          disabled={submitting || !answerContent.trim()}
                          className="h-11 px-6 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          <Send className="w-4 h-4" />
                          <span>Submit Answer</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
