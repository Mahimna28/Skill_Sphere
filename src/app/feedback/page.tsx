"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2, MessageSquareHeart } from "lucide-react";
import Link from "next/link";

export default function PublicFeedbackPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    content: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // We leverage the contact API to store public feedback
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Public User",
          email: formData.email,
          subject: "Public Feedback",
          message: formData.content
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        setFormData({ email: "", content: "" });
      } else {
        setError(data.message || "Failed to submit feedback.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] font-sans">
      
      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A96E]/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1E1B2E]/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-[700px] mx-auto">
          <div className="text-center mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(201,169,110,0.1)] text-[#C9A96E] text-[13px] font-semibold tracking-wide uppercase mb-6"
            >
              <MessageSquareHeart size={16} />
              Feedback
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-[40px] md:text-[56px] text-[#1E1B2E] font-bold leading-tight mb-4"
            >
              We value your <span className="text-[#C9A96E] italic">feedback</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[18px] text-[rgba(30,27,46,0.6)]"
            >
              Help us make Skill Sphere better for everyone. Tell us what you love or what we can improve.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)]"
          >
            {success ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="text-green-500 w-10 h-10" />
                </motion.div>
                <h3 className="font-heading text-[28px] text-[#1E1B2E] font-bold mb-4">Thank You!</h3>
                <p className="text-[rgba(30,27,46,0.6)] mb-8">Your feedback has been submitted successfully. We truly appreciate your input!</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="text-[#C9A96E] hover:text-[#B8956A] font-semibold"
                >
                  Submit more feedback
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-[#1E1B2E]">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-14 bg-[#F5F1EB] rounded-xl px-5 text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-[#1E1B2E]">Your Feedback <span className="text-red-500">*</span></label>
                  <textarea 
                    required 
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full h-40 bg-[#F5F1EB] rounded-xl p-5 text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  ></textarea>
                </div>

                {error && <p className="text-red-500 text-[14px] font-medium">{error}</p>}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 bg-[#C9A96E] text-white rounded-xl font-semibold hover:bg-[#B8956A] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-[0_4px_14px_rgba(201,169,110,0.4)]"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      Submit Feedback 
                      <Send size={18} />
                    </>
                  )}
                </button>
                
                <p className="text-center text-[13px] text-[#8E8E93] mt-4">
                  Already have an account? <Link href="/login" className="text-[#C9A96E] hover:underline">Log in</Link>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </main>

    </div>
  );
}
