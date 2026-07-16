"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { StudentDemo } from "./demos/StudentDemo";
import { TeacherDemo } from "./demos/TeacherDemo";
import { ParentDemo } from "./demos/ParentDemo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function DemoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState<"student" | "teacher" | "parent">("student");
  const [prevPhase, setPrevPhase] = useState<"student" | "teacher" | "parent" | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 15%",
        end: "+=300%",
        pin: true,
        scrub: 1,
        snap: {
          snapTo: [0, 0.33, 0.66, 1],
          duration: 0.5,
          ease: "power2.inOut"
        },
        onUpdate: (self) => {
          const p = self.progress;
          let newPhase: typeof activePhase = "student";
          
          if (p < 0.33) newPhase = "student";
          else if (p >= 0.33 && p < 0.66) newPhase = "teacher";
          else if (p >= 0.66) newPhase = "parent";

          setActivePhase((current) => {
            if (current !== newPhase) {
              setPrevPhase(current);
              return newPhase;
            }
            return current;
          });
        }
      });
    });

    return () => mm.revert();
  }, []);

  // Handle Demo entry/exit animations based on phase change
  useEffect(() => {
    if (activePhase === prevPhase) return;
    if (!prevPhase) return; // Skip initial render where prevPhase is null

    const currentClass = ".demo-" + activePhase;
    const previousClass = ".demo-" + prevPhase;

    // Exit animation for previous demo
    gsap.to(previousClass, {
      y: "-100%",
      opacity: 0,
      duration: 0.5,
      ease: "power3.inOut",
      overwrite: true
    });

    // Entry animation for current demo (power3.inOut + settling scale)
    gsap.fromTo(currentClass,
      { y: "100%", opacity: 0, scale: 0.98 },
      { y: "0%", opacity: 1, scale: 1, duration: 0.5, ease: "power3.inOut", overwrite: true, zIndex: 10 }
    );

  }, [activePhase, prevPhase]);

  // Mobile View: Phone Mockups
  const MobilePhoneWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative mx-auto w-[320px] h-[680px] bg-white rounded-[3rem] shadow-2xl border-[8px] border-[#1E1B2E] overflow-hidden shrink-0">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 bg-[#1E1B2E] rounded-b-3xl w-40 mx-auto z-50 flex items-center justify-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
        <div className="w-12 h-1.5 rounded-full bg-gray-500" />
      </div>
      
      {/* Screen Content */}
      <div className="w-full h-full overflow-hidden relative z-0 scale-[0.85] origin-top-left flex" style={{ width: 'calc(100% / 0.85)', height: 'calc(100% / 0.85)' }}>
        {children}
      </div>
    </div>
  );

  const MobileLayout = () => (
    <div className="lg:hidden space-y-32 py-24 bg-[#F5F1EB] relative border-y border-[#1E1B2E]/5 overflow-hidden">
      <div className="flex flex-col items-center justify-center w-full px-4">
        <MobilePhoneWrapper>
          <StudentDemo isMobile />
        </MobilePhoneWrapper>
      </div>

      <div className="flex flex-col items-center justify-center w-full px-4">
        <MobilePhoneWrapper>
          <TeacherDemo isMobile />
        </MobilePhoneWrapper>
      </div>

      <div className="flex flex-col items-center justify-center w-full px-4">
        <MobilePhoneWrapper>
          <ParentDemo isMobile />
        </MobilePhoneWrapper>
      </div>
    </div>
  );

  return (
    <>
      <MobileLayout />
      
      {/* Desktop View: Pinned Scroll Showcase */}
      <div ref={containerRef} className="dashboard-showcase hidden lg:flex h-screen w-full bg-[#F5F1EB] relative overflow-hidden items-center justify-center">
        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(201,169,110,0.05) 0%, transparent 70%)" }} />
        
        {/* Container: 90% width (max 1400px), 70vh height */}
        <div className="w-[90%] max-w-[1400px] h-[70vh] bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(30,27,46,0.15)] border border-[rgba(30,27,46,0.08)] relative overflow-hidden">
          
          <div className="demo-student absolute inset-0 bg-white" style={{ opacity: 1, transform: "translateY(0%)" }}>
            <StudentDemo />
          </div>

          <div className="demo-teacher absolute inset-0 bg-white" style={{ opacity: 0, transform: "translateY(100%)" }}>
            <TeacherDemo />
          </div>

          <div className="demo-parent absolute inset-0 bg-white" style={{ opacity: 0, transform: "translateY(100%)" }}>
            <ParentDemo />
          </div>
          
        </div>

      </div>
    </>
  );
}
