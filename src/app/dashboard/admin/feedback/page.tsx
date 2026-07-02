"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Calendar, Bug, Lightbulb, Heart } from "lucide-react";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      if (res.ok) setFeedbacks(data.feedbacks);
    } finally {
      setLoading(false);
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "bug": return "bg-[rgba(220,38,38,0.08)] text-[#DC2626] border border-[rgba(220,38,38,0.15)]";
      case "suggestion": return "bg-[rgba(201,169,110,0.1)] text-[#C9A96E] border border-[rgba(201,169,110,0.2)]";
      default: return "bg-[rgba(201,169,110,0.08)] text-[#C9A96E] border border-[rgba(201,169,110,0.15)]"; // Fallback for positive/other
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug": return <Bug size={12} className="mr-[4px]" />;
      case "suggestion": return <Lightbulb size={12} className="mr-[4px]" />;
      default: return <Heart size={12} className="mr-[4px]" />;
    }
  };

  const getRoleStyle = (role: string) => {
    const lowercaseRole = role.toLowerCase();
    if (lowercaseRole === "teacher") {
      return "bg-[rgba(201,169,110,0.1)] text-[#C9A96E]";
    }
    return "bg-[rgba(30,27,46,0.06)] text-[#1E1B2E]"; // Student or default
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <div
      className="flex flex-col bg-[#F5F1EB] min-h-screen w-full font-sans pb-20 overflow-x-hidden min-w-0"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-[32px] pt-[8px] pb-[24px] gap-[16px]">
        <p className="font-sans text-[14px] text-[#8E8E93]">Review bug reports and suggestions from the community.</p>
        
        {!loading && (
          <div className="flex items-center">
            <span className="bg-[rgba(30,27,46,0.06)] text-[#1E1B2E] font-sans text-[12px] font-medium px-[12px] py-[4px] rounded-full tracking-[0.08em] uppercase">
              {feedbacks.length} ENTRIES
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="px-[32px] pt-[40px] text-center font-sans text-[14px] text-[#8E8E93] animate-pulse">
          Loading feedback logs...
        </div>
      ) : feedbacks.length === 0 ? (
        <div
          className="bg-white rounded-[16px] mx-[32px] p-[60px_24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-center text-center"
        >
          <MessageSquare size={48} className="text-[#1E1B2E] opacity-25 mb-[16px]" />
          <h3 className="font-heading text-[20px] text-[#1E1B2E]">No Feedback Yet</h3>
          <p className="font-sans text-[14px] text-[#8E8E93] mt-[8px]">
            Feedback from users will appear here once submitted.
          </p>
        </div>
      ) : (
        <div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-[24px] px-[32px] pb-[32px]"
        >
          {feedbacks.map((f) => (
            <div 
              key={f.id} 
              variants={itemVariants}
              className="bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="p-[20px_24px] flex flex-row items-center justify-between border-b border-[rgba(30,27,46,0.06)]">
                <div className="flex items-center gap-[12px]">
                  <div className="w-[36px] h-[36px] rounded-full bg-[rgba(30,27,46,0.04)] flex items-center justify-center font-sans text-[14px] font-medium text-[#1E1B2E]">
                    {f.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-sans text-[14px] font-medium text-[#1E1B2E]">{f.user.name}</p>
                    <p className="font-sans text-[12px] text-[#8E8E93]">{f.user.email}</p>
                  </div>
                </div>
                <div className={`flex items-center px-[10px] py-[4px] rounded-full font-sans text-[11px] font-medium ${getTypeStyle(f.type)}`}>
                  {getTypeIcon(f.type)}
                  <span className="capitalize">{f.type}</span>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-[20px_24px] flex-1">
                <p className="font-sans text-[14px] text-[#1E1B2E] leading-[1.6] italic">
                  "{f.content}"
                </p>
              </div>
              
              {/* Card Footer */}
              <div className="p-[16px_24px_20px] flex flex-row items-center justify-between">
                <div className="flex items-center gap-[6px] font-sans text-[12px] text-[#8E8E93]">
                  <Calendar size={14} className="text-[#8E8E93]" /> 
                  {new Date(f.createdAt).toLocaleDateString()}
                </div>
                <div className={`px-[10px] py-[4px] rounded-full font-sans text-[11px] font-medium capitalize ${getRoleStyle(f.user.role)}`}>
                  {f.user.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
