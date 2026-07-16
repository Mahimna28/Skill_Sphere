"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const data = [
  {
    word: "Learn.",
    desc: "Structured courses across AI, programming, and computer science — designed by experts, paced for you.",
    pill: "500+ Lessons",
  },
  {
    word: "Create.",
    desc: "Build real projects, write code in-browser, and earn certificates that actually mean something.",
    pill: "Real Projects",
  },
  {
    word: "Connect.",
    desc: "Join live study groups, chat with peers, and get feedback from mentors who've been there.",
    pill: "Global Community",
  },
  {
    word: "Grow.",
    desc: "Track every milestone, climb the leaderboard, and turn curiosity into career-ready skills.",
    pill: "Gamified Progress",
  },
];

export function StickyWords() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const descRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!sectionRef.current) return;
    
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Use matchMedia to disable pinning on mobile
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Desktop: Sticky scroll pinning with snap
      if (prefersReduced) {
        gsap.set(wordsRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(descRef.current, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${data.length * 100}%`,
          pin: true,
          scrub: 0.8,
          snap: {
            snapTo: (progress) => {
              const step = 1 / data.length;
              return Math.round(progress / step) * step;
            },
            duration: { min: 0.2, max: 0.4 },
            ease: "power2.inOut",
          },
        },
      });

      data.forEach((_, i) => {
        const word = wordsRef.current[i];
        const desc = descRef.current[i];
        if (!word || !desc) return;
        
        if (i > 0) {
          // Dim previous word
          tl.to(wordsRef.current[i - 1], {
            opacity: 0.15,
            scale: 0.9,
            duration: 0.3,
          }, i);
          
          // Fade out previous description
          tl.to(descRef.current[i - 1], {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: "power2.in",
          }, i);
        }
        
        // Highlight current word
        tl.fromTo(word,
          { opacity: 0.15, scale: 0.9, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" },
          i
        );
        
        // Fade in current description
        tl.fromTo(desc,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          i
        );
      });
      
      return () => {
        // Cleanup if necessary
      };
    });

    mm.add("(max-width: 1023px)", () => {
      // Mobile: Simple fade up (no pinning)
      if (prefersReduced) {
        gsap.set(wordsRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(descRef.current, { opacity: 1, y: 0 });
        return;
      }
      
      gsap.set(wordsRef.current, { opacity: 0.15, scale: 0.9, y: 30 });
      gsap.set(descRef.current, { opacity: 0, y: 20 });
      
      data.forEach((_, i) => {
        const word = wordsRef.current[i];
        const desc = descRef.current[i];
        if (!word || !desc) return;
        
        gsap.to([word, desc], {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: word,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        });
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative lg:h-screen py-24 lg:py-0 bg-[#1E1B2E] flex items-center justify-center overflow-hidden"
    >
      <div className="text-center w-full px-4 flex flex-col items-center">
        <p className="text-[#C9A96E] text-sm uppercase tracking-[0.2em] mb-12 font-medium">
          The Skill Sphere Way
        </p>
        
        <div className="flex flex-col items-center gap-16 lg:gap-4 relative w-full lg:pb-[140px]">
          {data.map((item, i) => (
            <div key={i} className="flex flex-col items-center w-full lg:block lg:w-auto">
              <span
                ref={(el) => { wordsRef.current[i] = el; }}
                className="block text-5xl md:text-7xl lg:text-9xl font-serif text-white opacity-[0.15] text-center"
                style={{ willChange: "transform, opacity" }}
              >
                {item.word}
              </span>
              
              <div 
                ref={(el) => { descRef.current[i] = el; }}
                className="flex flex-col items-center mt-6 lg:mt-0 lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:w-full"
                style={{ opacity: 0, willChange: "transform, opacity" }}
              >
                <p className="text-[18px] text-[rgba(255,255,255,0.7)] leading-[1.6] max-w-[480px] text-center font-sans">
                  {item.desc}
                </p>
                <div className="bg-[rgba(201,169,110,0.15)] text-[#C9A96E] rounded-full px-4 py-1.5 text-xs uppercase tracking-wider mt-4 font-sans font-medium">
                  {item.pill}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Subtle gradient overlay at bottom for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F1EB] to-transparent pointer-events-none" />
    </section>
  );
}
