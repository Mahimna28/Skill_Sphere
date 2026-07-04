"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import Link from "next/link";

interface FeedbackUser {
  name: string;
  role: string;
  image?: string;
}

interface Feedback {
  id: string;
  content: string;
  type: string;
  user: FeedbackUser;
  createdAt: string;
}

export function CommunityFeedbackSection() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("/api/feedback/public");
        if (res.ok) {
          const data = await res.json();
          if (data.feedback && data.feedback.length > 0) {
            setFeedbacks(data.feedback);
          } else {
            setFeedbacks([]);
          }
        } else {
          setFeedbacks([]);
        }
      } catch (err) {
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, []);

  const feedbackLink = "/login";

  return (
    <motion.section 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="bg-[#1E1B2E] py-[80px]"
    >
      <div className="text-center">
        <span className="text-[#C9A96E] font-inter text-[12px] uppercase tracking-[0.08em] font-medium block mb-3">
          FEEDBACK
        </span>
        <h2 className="font-playfair text-[32px] text-white">
          What our learners say
        </h2>
        <p className="font-inter text-[14px] text-[rgba(255,255,255,0.6)] mt-2">
          Real feedback from real students using Skill Sphere.
        </p>
      </div>

      {!loading && feedbacks.length > 0 && (
        <StaggerContainer
          staggerDelay={0.08}
          className="max-w-[1200px] mx-auto px-[32px] pt-[40px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]"
        >
          {feedbacks.map((item) => (
            <StaggerItem key={item.id} className="h-full">
              <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-[28px] h-full flex flex-col hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
                
                <p className="font-inter text-[15px] text-white leading-[1.6] italic flex-grow">
                  "{item.content}"
                </p>
                
                <div className="w-full h-px bg-[rgba(255,255,255,0.08)] my-[20px]" />
                
                <div className="flex items-center gap-[12px]">
                  {item.user.image ? (
                    <img src={item.user.image} alt={item.user.name} className="w-[36px] h-[36px] rounded-full object-cover border border-[#C9A96E]/20" />
                  ) : (
                    <div className="w-[36px] h-[36px] rounded-full bg-[rgba(201,169,110,0.2)] flex flex-shrink-0 items-center justify-center">
                      <span className="font-playfair text-[14px] text-[#C9A96E]">
                        {item.user.name ? item.user.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-inter text-[14px] text-white font-medium truncate">
                      {item.user.name || "Anonymous User"}
                    </span>
                    <span className="inline-block px-[10px] py-[4px] mt-1 bg-[rgba(201,169,110,0.15)] text-[#C9A96E] font-inter text-[11px] rounded-full w-max">
                      {item.user.role ? item.user.role.charAt(0).toUpperCase() + item.user.role.slice(1).replace('_', ' ') : "Student"}
                    </span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {!loading && feedbacks.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="max-w-[600px] mx-auto px-[32px] pt-[40px] text-center"
        >
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-10">
            <h3 className="font-playfair text-[20px] text-white mb-2">Be the first to share your experience!</h3>
            <p className="font-inter text-[14px] text-[#8E8E93] mb-8">
              Join thousands of learners and let us know how Skill Sphere helped you.
            </p>
            <Link href={feedbackLink}>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[rgba(201,169,110,0.15)] border border-[#C9A96E]/30 text-[#C9A96E] font-inter text-[14px] font-medium px-6 py-3 rounded-lg hover:bg-[rgba(201,169,110,0.25)] transition-colors"
              >
                Give Feedback
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="max-w-[1200px] mx-auto px-[32px] pt-[40px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[250px] bg-[rgba(255,255,255,0.02)] rounded-[16px] animate-pulse" />
          ))}
        </div>
      )}
    </motion.section>
  );
}
