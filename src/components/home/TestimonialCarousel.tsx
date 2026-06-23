"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "Skill Sphere transformed my approach to full-stack development. The AI tutor feels like having a personal mentor.",
    author: "Elena Rodriguez",
    course: "Full-Stack Engineering",
  },
  {
    quote: "The collaborative tools inside the courses made learning data science so much more engaging than watching static videos.",
    author: "David Chen",
    course: "Data Science Fundamentals",
  },
  {
    quote: "I landed my first junior role exactly three months after completing the UI/UX track. Highly recommended.",
    author: "Sarah Jenkins",
    course: "UI/UX Design Principles",
  },
  {
    quote: "The personalized curriculum adapted perfectly to my busy schedule. Best investment in my career.",
    author: "Marcus Johnson",
    course: "Advanced React Architecture",
  },
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // For desktop, show 3 at a time. For mobile, 1.
  // We'll manage this via Tailwind CSS classes for simplicity by rendering all and hiding based on viewport and index.

  return (
    <div className="w-full">
      {/* Desktop View (3 visible) */}
      <div className="hidden md:grid grid-cols-3 gap-8">
        {[0, 1, 2].map((offset) => {
          const index = (currentIndex + offset) % testimonials.length;
          const t = testimonials[index];
          return (
            <div key={index} className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col h-full transition-all duration-500 hover:bg-white/10">
              <div className="flex gap-1 mb-6 text-[#C9A96E]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="font-heading italic text-[#F5F1EB] text-xl leading-relaxed mb-8 flex-1">
                <span className="text-[#C9A96E] text-2xl mr-1">&ldquo;</span>
                {t.quote}
                <span className="text-[#C9A96E] text-2xl ml-1">&rdquo;</span>
              </p>
              <div>
                <p className="font-sans font-bold text-white">{t.author}</p>
                <p className="font-sans text-xs text-[#C9A96E] uppercase tracking-wider mt-1">{t.course}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile View (1 visible) */}
      <div className="md:hidden">
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col transition-all duration-500">
          <div className="flex gap-1 mb-6 text-[#C9A96E]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
          <p className="font-heading italic text-[#F5F1EB] text-xl leading-relaxed mb-8">
            <span className="text-[#C9A96E] text-2xl mr-1">&ldquo;</span>
            {testimonials[currentIndex].quote}
            <span className="text-[#C9A96E] text-2xl ml-1">&rdquo;</span>
          </p>
          <div>
            <p className="font-sans font-bold text-white">{testimonials[currentIndex].author}</p>
            <p className="font-sans text-xs text-[#C9A96E] uppercase tracking-wider mt-1">{testimonials[currentIndex].course}</p>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-3 mt-10">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              idx === currentIndex ? "bg-[#C9A96E] w-8" : "bg-white/20 hover:bg-white/40"
            )}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
