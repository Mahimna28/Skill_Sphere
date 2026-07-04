"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.message || "Failed to send message.");
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A96E]/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1E1B2E]/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(30,27,46,0.05)] text-[#1E1B2E] text-[13px] font-semibold tracking-wide uppercase mb-6"
            >
              Get In Touch
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-[48px] md:text-[64px] text-[#1E1B2E] font-bold leading-tight mb-6"
            >
              Let's start a <span className="text-[#C9A96E] italic">conversation</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[18px] text-[rgba(30,27,46,0.6)] max-w-[600px] mx-auto"
            >
              Have a question, feedback, or need support? Fill out the form below and our team will get back to you as soon as possible.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1E1B2E] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden h-full"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A96E]/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              
              <h3 className="font-heading text-[28px] font-bold mb-8 relative z-10">Contact Information</h3>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
                    <Mail className="text-[#C9A96E]" size={24} />
                  </div>
                  <div>
                    <p className="text-[14px] text-[rgba(255,255,255,0.6)] mb-1 uppercase tracking-wider">Email Us</p>
                    <a href="mailto:hello@skillsphere.com" className="text-[16px] hover:text-[#C9A96E] transition-colors">hello@skillsphere.com</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
                    <Phone className="text-[#C9A96E]" size={24} />
                  </div>
                  <div>
                    <p className="text-[14px] text-[rgba(255,255,255,0.6)] mb-1 uppercase tracking-wider">Call Us</p>
                    <a href="tel:+18001234567" className="text-[16px] hover:text-[#C9A96E] transition-colors">+1 (800) 123-4567</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
                    <MapPin className="text-[#C9A96E]" size={24} />
                  </div>
                  <div>
                    <p className="text-[14px] text-[rgba(255,255,255,0.6)] mb-1 uppercase tracking-wider">Headquarters</p>
                    <p className="text-[16px] leading-relaxed">
                      123 Innovation Drive<br />
                      Tech District, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)]"
            >
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="text-green-500 w-10 h-10" />
                  </motion.div>
                  <h3 className="font-heading text-[28px] text-[#1E1B2E] font-bold mb-4">Message Sent!</h3>
                  <p className="text-[rgba(30,27,46,0.6)] mb-8">Thank you for reaching out. Our team will get back to you within 24-48 hours.</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="text-[#C9A96E] hover:text-[#B8956A] font-semibold flex items-center gap-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[14px] font-semibold text-[#1E1B2E]">Your Name</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-12 bg-[#F5F1EB] rounded-xl px-4 text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-semibold text-[#1E1B2E]">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full h-12 bg-[#F5F1EB] rounded-xl px-4 text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[14px] font-semibold text-[#1E1B2E]">Subject</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full h-12 bg-[#F5F1EB] rounded-xl px-4 text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[14px] font-semibold text-[#1E1B2E]">Message</label>
                    <textarea 
                      required 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full h-32 bg-[#F5F1EB] rounded-xl p-4 text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-all resize-none"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  {error && <p className="text-red-500 text-[14px] font-medium">{error}</p>}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 bg-[#1E1B2E] text-white rounded-xl font-semibold hover:bg-[#2A2640] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 group"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <>
                        Send Message 
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
