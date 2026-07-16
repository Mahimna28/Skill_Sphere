"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface WordRevealProps {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "p";
  delay?: number;
}

export function WordReveal({ text, className = "", tag: Tag = "h2", delay = 0 }: WordRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    // Check for reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    const words = containerRef.current.querySelectorAll(".word");
    
    if (prefersReduced) {
      gsap.set(words, { opacity: 1, y: 0, rotateX: 0 });
      return;
    }
    
    gsap.fromTo(words,
      { opacity: 0, y: 40, rotateX: -20 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: containerRef });

  const words = text.split(" ");

  return (
    <div ref={containerRef} style={{ perspective: "1000px" }}>
      <Tag className={className}>
        {words.map((word, i) => (
          <span
            key={i}
            className="word inline-block mr-[0.25em]"
            style={{ opacity: 0 }}
          >
            {word}
          </span>
        ))}
      </Tag>
    </div>
  );
}
