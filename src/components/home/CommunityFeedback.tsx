"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const testimonials = [
  {
    quote: "Skill Sphere completely changed how I study. The AI tutor explains concepts in ways my professors never could.",
    name: "User",
    role: "Student",
    size: "large", // spans 2 cols
  },
  {
    quote: "As a teacher, I can finally track every student's progress in one place. The grading tools save me hours every week.",
    name: "User",
    role: "Teacher",
    size: "normal",
  },
  {
    quote: "I love being able to see my child's progress in real time. The parent dashboard gives me peace of mind.",
    name: "User",
    role: "Parent",
    size: "normal",
  },
];

export function CommunityFeedbackSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = containerRef.current.querySelectorAll(".testimonial-card");
    
    if (prefersReduced) {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.fromTo(cards,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-[#F5F1EB] py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#C9A96E] text-sm uppercase tracking-[0.2em] font-medium block mb-4">
            COMMUNITY
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1E1B2E]">
            What our learners say
          </h2>
        </div>

        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => {
            const isLarge = t.size === "large";
            
            // Determine colors based on role
            let avatarBg = "bg-[#C9A96E]/20 text-[#C9A96E]";
            if (t.role === "Teacher") avatarBg = "bg-purple-500/10 text-purple-600";
            if (t.role === "Parent") avatarBg = "bg-blue-500/10 text-blue-600";
            if (isLarge) avatarBg = "bg-white/10 text-white";

            return (
              <div 
                key={i} 
                className={`testimonial-card flex flex-col rounded-3xl p-8 md:p-12 shadow-sm border border-black/5 ${
                  isLarge 
                    ? "md:col-span-2 bg-[#1E1B2E] shadow-xl text-white" 
                    : "bg-white text-[#1E1B2E] hover:shadow-lg transition-shadow duration-300"
                }`}
              >
                <div className="flex-1 flex items-center mb-10">
                  <p className={`font-serif leading-relaxed ${isLarge ? "text-2xl md:text-3xl lg:text-4xl text-[#C9A96E]" : "text-lg md:text-xl text-[#1E1B2E]"}`}>
                    "{t.quote}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${avatarBg}`}>
                    U
                  </div>
                  <div>
                    <h4 className={`font-bold ${isLarge ? "text-white" : "text-[#1E1B2E]"}`}>
                      {t.name}
                    </h4>
                    <p className={`text-sm ${isLarge ? "text-white/60" : "text-[#6B6B6B]"}`}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
