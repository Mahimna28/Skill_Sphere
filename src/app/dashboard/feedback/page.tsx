"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, Bug, Lightbulb, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function FeedbackPage() {
  const [content, setContent] = useState("");
  const [type, setType] = useState("suggestion");
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
        setError("Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans flex flex-col h-full text-[#1E1B2E]">
      <div className="pt-2 px-8 pb-8">
        
        {/* Page Header (Subtitle only, Title is in Top Bar) */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[14px] text-[#8E8E93] text-center mb-8"
        >
          Found a bug? Have a suggestion? Let our team know!
        </motion.p>

        {/* Feedback Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="bg-white rounded-[16px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] max-w-[640px] mx-auto"
        >
          <div className="mb-6">
            <h2 className="font-heading text-[20px] text-[#1E1B2E] mb-6">Feedback Form</h2>
            <div className="h-px w-full bg-[rgba(30,27,46,0.06)]" />
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.2)] rounded-xl p-5 text-center flex flex-col items-center"
              >
                <CheckCircle2 className="w-5 h-5 text-[#C9A96E] mb-2" />
                <p className="text-[14px] text-[#C9A96E] mb-3">Thank you! Your feedback has been submitted.</p>
                <button onClick={() => setSubmitted(false)} className="text-[13px] text-[#C9A96E] hover:underline font-medium">
                  Submit another
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                
                {/* Feedback Type Selection */}
                <div>
                  <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-3">Feedback Type</label>
                  <div className="flex gap-3">
                    {[
                      { id: "bug", label: "Bug Report", icon: Bug },
                      { id: "suggestion", label: "Suggestion", icon: Lightbulb },
                      { id: "other", label: "Other", icon: Heart },
                    ].map((opt, i) => (
                      <motion.button
                        key={opt.id}
                        type="button"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setType(opt.id)}
                        className={`flex-1 flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                          type === opt.id 
                            ? "bg-[rgba(201,169,110,0.06)] border-[#C9A96E] border-2" 
                            : "bg-white border-[rgba(30,27,46,0.1)] hover:border-[rgba(30,27,46,0.2)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                        }`}
                        style={{ padding: type === opt.id ? "19px" : "20px" }} // compensate for 2px border
                      >
                        <opt.icon className={`w-6 h-6 mb-2.5 ${type === opt.id ? "text-[#C9A96E]" : "text-[#8E8E93]"}`} />
                        <span className={`text-[13px] font-medium ${type === opt.id ? "text-[#1E1B2E]" : "text-[#1E1B2E]"}`}>{opt.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2.5">Your Message</label>
                  <textarea 
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Tell us what's on your mind..."
                    className="w-full min-h-[160px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-4 text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y leading-[1.6]"
                    required
                  />
                </div>

                {/* Error State */}
                {error && (
                  <div className="bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)] rounded-xl p-4 flex flex-col items-center text-center">
                    <AlertCircle className="w-5 h-5 text-[#DC2626] mb-2" />
                    <p className="text-[14px] text-[#DC2626] mb-3">{error}</p>
                    <button type="button" onClick={() => setError(null)} className="h-[32px] px-4 rounded-lg border border-[#DC2626] text-[#DC2626] text-[13px] hover:bg-[rgba(220,38,38,0.1)] transition-colors">
                      Try again
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading || !content.trim()} 
                  className="w-full h-[48px] rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium transition-colors disabled:opacity-100 disabled:bg-[#E5E5E5] disabled:text-[#8E8E93] disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin text-white" /> Submitting...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> Submit Feedback</>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center px-4">
            <p className="text-[12px] text-[#8E8E93] leading-relaxed">
              Note: Your feedback will be reviewed by our administration team. For urgent technical support, please use the direct chat system.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
