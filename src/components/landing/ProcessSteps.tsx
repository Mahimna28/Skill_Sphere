"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Compass, Brain, Rocket } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const steps = [
  {
    number: "01",
    title: "Choose Your Path",
    description: "Pick from curated learning paths or create your own. AI suggests what to learn next based on your goals.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Learn With AI",
    description: "Watch lessons, write code, take quizzes. Stuck? Ask the AI tutor anytime — it knows every course inside out.",
    icon: Brain,
  },
  {
    number: "03",
    title: "Build & Share",
    description: "Complete projects, earn certificates, and showcase your skills. Join the community to collaborate and grow.",
    icon: Rocket,
  },
];

export function ProcessSteps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!sectionRef.current || !lineRef.current) return;
    
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Draw the connecting line
    const pathLength = lineRef.current.getTotalLength();
    
    if (prefersReduced) {
      gsap.set(lineRef.current, { strokeDasharray: pathLength, strokeDashoffset: 0 });
      gsap.set(cardsRef.current, { opacity: 1, y: 0 });
      return;
    }
    
    gsap.set(lineRef.current, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    gsap.to(lineRef.current, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        end: "bottom 80%",
        scrub: 1,
      },
    });

    // Stagger cards in
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          delay: i * 0.15,
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 bg-[#F5F1EB] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-[#C9A96E] text-sm uppercase tracking-[0.2em] mb-4 font-medium">
            How It Works
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1E1B2E]">
            Three steps to mastery
          </h2>
        </div>

        {/* Steps grid with connecting line */}
        <div className="relative">
          {/* SVG Connecting Line — Desktop only */}
          <svg
            className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 hidden md:block"
            preserveAspectRatio="none"
          >
            <path
              ref={lineRef}
              d="M 100 8 Q 400 8 500 8 T 900 8"
              fill="none"
              stroke="#C9A96E"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="relative bg-white rounded-2xl p-8 shadow-sm border border-[rgba(30,27,46,0.06)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Step number badge */}
                <div className="absolute -top-4 left-8 bg-[#1E1B2E] text-[#C9A96E] text-sm font-bold px-4 py-1 rounded-full">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-[rgba(201,169,110,0.1)] flex items-center justify-center mb-6 mt-2">
                  <step.icon className="w-7 h-7 text-[#C9A96E]" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-serif text-[#1E1B2E] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#6B6B6B] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
