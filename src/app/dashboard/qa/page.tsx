"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, User, Send, Plus, HelpCircle, CheckCircle2, ChevronDown, Trash2, X, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QAPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "my" | "unanswered">("all");
  const [loading, setLoading] = useState(true);
  const [showAsk, setShowAsk] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

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
      if (res.ok) setQuestions(data.questions);
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
      if (res.ok) {
        if (expandedId === questionId) setExpandedId(null);
        fetchQuestions();
      }
    } catch (err) {}
  };

  const filteredQuestions = questions.filter(q => {
    if (filter === "my") return q.authorId === userId;
    if (filter === "unanswered") return (q._count?.answers || 0) === 0;
    return true;
  });

  const getRelativeTime = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="font-sans pb-12 flex flex-col h-full text-[#1E1B2E]">
      <div
      >
        {/* Page Header & Subtitle */}
        <div className="pt-8 px-8">
          <p className="text-[14px] text-[#8E8E93]">
            Ask questions and share knowledge with peers and teachers.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-row justify-between items-center px-8 py-5 mt-2">
          {/* Filters */}
          <div className="flex items-center gap-6 relative">
            {(["all", "my", "unanswered"] as const).map((f) => {
              const labels = { all: "All Questions", my: "My Questions", unanswered: "Unanswered" };
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[13px] font-medium transition-colors relative pb-1 ${
                    isActive ? "text-[#1E1B2E]" : "text-[#8E8E93] hover:text-[#1E1B2E]"
                  }`}
                >
                  {labels[f]}
                  {isActive && (
                    <motion.div
                      layoutId="qa-filter-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A96E]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowAsk(true)}
            className="flex items-center h-[40px] px-5 rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium hover:scale-[1.02] hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Ask Question
          </button>
        </div>

        {/* Questions List */}
        <div className="px-8 pb-8 pt-2">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-4 border-[#C9A96E] border-t-transparent animate-spin" />
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div
              className="bg-white rounded-[16px] py-[60px] px-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center text-center mx-auto"
            >
              <HelpCircle className="w-12 h-12 text-[#1E1B2E] opacity-25 mb-4" />
              <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-2">No Questions Yet</h3>
              <p className="text-[14px] text-[#8E8E93] max-w-[400px] mx-auto leading-[1.6]">
                Be the first to ask a question and start the discussion!
              </p>
              <button
                onClick={() => setShowAsk(true)}
                className="mt-5 h-[44px] px-6 rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium hover:scale-[1.02] hover:shadow-md transition-all"
              >
                Ask Question
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredQuestions.map((q, index) => {
                const isExpanded = expandedId === q.id;
                const answerCount = q._count?.answers || 0;
                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-[16px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)] flex flex-col"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {q.author.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={q.author.image} alt={q.author.name} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[rgba(201,169,110,0.15)] text-[#C9A96E] flex items-center justify-center font-medium text-[14px]">
                            {q.author.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[14px] text-[#1E1B2E] font-medium leading-tight">{q.author.name}</span>
                          <span className="text-[12px] text-[#8E8E93] mt-0.5">
                            @{q.author.username || "user"} • {q.author.role.charAt(0).toUpperCase() + q.author.role.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[12px] text-[#8E8E93]">
                          {getRelativeTime(q.createdAt)}
                        </span>
                        {(q.authorId === userId || userRole === "superadmin" || userRole === "institute_admin") && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }}
                            className="text-[#8E8E93] hover:text-[#DC2626] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question Body */}
                    <div className="mt-3 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : q.id)}>
                      <h3 className="font-heading text-[20px] text-[#1E1B2E]">{q.title}</h3>
                      <p className={`text-[14px] text-[#8E8E93] mt-1.5 leading-[1.6] ${!isExpanded ? "line-clamp-2" : ""}`}>
                        {q.content}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div 
                      className="mt-4 flex items-center justify-between cursor-pointer group"
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    >
                      <div className="inline-flex items-center bg-[rgba(201,169,110,0.1)] text-[#C9A96E] text-[12px] px-3 py-1 rounded-full font-medium transition-colors group-hover:bg-[rgba(201,169,110,0.15)]">
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        {answerCount === 1 ? "1 Answer" : `${answerCount} Answers`}
                      </div>
                      <ChevronDown className={`w-[18px] h-[18px] text-[#8E8E93] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>

                    {/* Expanded Answer Thread */}
                    <AnimatePresence>
                      {isExpanded && (
                        <div
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[rgba(30,27,46,0.06)] mt-4 pt-4 space-y-4">
                            {q.answers.map((a: any) => (
                              <div key={a.id} className="flex gap-3">
                                {a.author.image ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={a.author.image} alt={a.author.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-[#1E1B2E] text-white flex items-center justify-center font-medium text-[12px] shrink-0">
                                    {a.author.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="flex-1 flex flex-col">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[12px] text-[#8E8E93] font-medium">
                                      {a.author.name} • {a.author.role.charAt(0).toUpperCase() + a.author.role.slice(1)}
                                    </span>
                                    <span className="text-[11px] text-[#8E8E93]">
                                      {getRelativeTime(a.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-[14px] text-[#1E1B2E] mt-1 leading-[1.6]">
                                    {a.content}
                                  </p>
                                  <div className="mt-1.5">
                                    <button className="flex items-center gap-1.5 text-[11px] font-medium text-[#8E8E93] hover:text-[#C9A96E] transition-colors group">
                                      <ThumbsUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" /> 
                                      Helpful
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Add Answer */}
                            <div className="pt-2">
                              <textarea
                                value={answerContent}
                                onChange={e => setAnswerContent(e.target.value)}
                                placeholder="Write your answer..."
                                className="w-full min-h-[80px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-3 text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y"
                              />
                              <div className="flex justify-end mt-2.5">
                                <button
                                  onClick={() => handleAnswer(q.id)}
                                  disabled={submitting || !answerContent.trim()}
                                  className="h-[36px] px-5 rounded-xl bg-[#1E1B2E] text-white text-[13px] font-medium hover:bg-[#2A2640] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {submitting ? "Posting..." : "Post Answer"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Ask Question Modal */}
      <AnimatePresence>
        {showAsk && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-[rgba(30,27,46,0.5)] backdrop-blur-sm"
              onClick={() => setShowAsk(false)}
            />
            <div
              className="relative w-full max-w-[560px] bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(30,27,46,0.06)]">
                <h2 className="font-heading text-[22px] text-[#1E1B2E]">Ask a Question</h2>
                <button 
                  onClick={() => setShowAsk(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-[#8E8E93] hover:text-[#1E1B2E] hover:bg-[#F5F1EB] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAsk} className="p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">
                    Question Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="E.g., How do React hooks work under the hood?"
                    className="h-[48px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">
                    Describe your question
                  </label>
                  <textarea
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    placeholder="Provide enough details so others can help you..."
                    className="min-h-[120px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-4 text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y"
                  />
                </div>
                <div className="mt-2">
                  <button
                    type="submit"
                    disabled={submitting || !newTitle.trim() || !newContent.trim()}
                    className="w-full h-[48px] rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium hover:bg-[#2A2640] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      "Post Question"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
