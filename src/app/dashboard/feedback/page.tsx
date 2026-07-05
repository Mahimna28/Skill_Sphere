"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, Lightbulb, Heart, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function FeedbackPage() {
  const [content, setContent] = useState("");
  const [type, setType] = useState("bug"); // Default or selected type
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type }),
      });
      if (res.ok) {
        setSubmitted(true);
        setContent("");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Something went wrong while submitting your feedback.");
      }
    } catch (err) {
      setError("Network error: Unable to submit feedback at this time.");
    } finally {
      setLoading(false);
    }
  };

  const feedbackTypes = [
    { id: "bug", label: "Bug Report", icon: Bug },
    { id: "suggestion", label: "Suggestion", icon: Lightbulb },
    { id: "other", label: "Other", icon: Heart },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="font-sans pb-16"
    >
      {/* Subtitle below top bar (Top bar has the "Give Feedback" title) */}
      <div className="pt-2 px-4 sm:px-8 max-w-[640px] mx-auto text-center sm:text-left">
        <p className="font-sans text-sm text-[#8E8E93]">
          Found a bug? Have a suggestion? Let our team know!
        </p>
      </div>

      {/* Feedback Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[rgba(30,27,46,0.06)] max-w-[640px] mx-auto mt-5 mb-8"
      >
        {/* Card Header */}
        <div className="mb-6">
          <h2 className="font-heading text-xl font-bold text-[#1E1B2E]">
            Feedback Form
          </h2>
          <div className="h-px bg-[rgba(30,27,46,0.06)] mt-4" />
        </div>

        {/* Success Banner */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] rounded-xl p-6 text-center space-y-3 my-4"
            >
              <div className="flex items-center justify-center gap-2.5 text-[#22C55E]">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="font-sans text-sm font-medium">
                  Thank you! Your feedback has been submitted.
                </span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="font-sans text-[13px] text-[#C9A96E] hover:underline font-medium cursor-pointer"
                >
                  Submit another
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Error Banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)] rounded-xl p-4 flex items-center justify-between gap-3 text-[#DC2626]"
                >
                  <div className="flex items-center gap-2.5 text-sm font-sans">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white px-3 py-1 rounded-lg text-[13px] font-medium transition-colors shrink-0 cursor-pointer"
                  >
                    Try again
                  </button>
                </motion.div>
              )}

              {/* Feedback Type Selection */}
              <div>
                <label className="block font-sans text-xs uppercase tracking-[0.08em] text-[#8E8E93] font-semibold mb-3">
                  Feedback Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {feedbackTypes.map((item, idx) => {
                    const Icon = item.icon;
                    const isSelected = type === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => setType(item.id)}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.06 }}
                        className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-2 border-[#C9A96E] bg-[rgba(201,169,110,0.06)] text-[#1E1B2E]"
                            : "border-[rgba(30,27,46,0.1)] bg-white hover:border-[rgba(30,27,46,0.2)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[#1E1B2E]"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 transition-colors ${
                            isSelected ? "text-[#C9A96E]" : "text-[#8E8E93]"
                          }`}
                        />
                        <span className="font-sans text-[13px] font-medium mt-2.5">
                          {item.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block font-sans text-xs uppercase tracking-[0.08em] text-[#8E8E93] font-semibold mt-6 mb-2.5">
                  Your Message
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  required
                  className="w-full bg-white border border-[rgba(30,27,46,0.12)] rounded-xl min-h-[160px] p-4 font-sans text-sm text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-3 focus:ring-[rgba(201,169,110,0.15)] transition-all leading-[1.6] resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="w-full h-12 rounded-xl bg-[#1E1B2E] text-white font-sans text-sm font-medium transition-all hover:scale-[1.01] hover:shadow-md active:scale-[0.99] disabled:bg-[#E5E5E5] disabled:text-[#8E8E93] disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
