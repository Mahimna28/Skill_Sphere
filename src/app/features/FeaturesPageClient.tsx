"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { ChevronDown, MessageSquare, BarChart, UserPlus, Search, PlayCircle, Award, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

import { useReducedMotion, useIsMobile } from "@/lib/animations";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideUp } from "@/components/animations/SlideUp";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";



const STEPS = [
  { num: "01", icon: UserPlus, title: "Sign Up", desc: "Create your free account in seconds." },
  { num: "02", icon: Search, title: "Explore", desc: "Browse courses and find your path." },
  { num: "03", icon: PlayCircle, title: "Learn", desc: "Watch lessons, complete quizzes, build projects." },
  { num: "04", icon: Award, title: "Achieve", desc: "Earn certificates and track your progress." }
];

const FEATURE_CARDS = [
  { num: "01", title: "AI Study Tutor", desc: "Get instant, personalized help from your own AI tutor, available 24/7 for any subject.", img: "/images/Dashboards/Student/AI_Study_Tutor.png" },
  { num: "02", title: "Course Studio", desc: "Learn from industry professionals with curated courses designed for real-world application.", img: "/images/Dashboards/Teacher_InstituteAdmin/CourseStudio.png" },
  { num: "03", title: "Community Chat", desc: "Join discussions, ask questions, and collaborate with peers in course-specific chat rooms.", img: "/images/Dashboards/Student/Course_Chat.png" },
  { num: "04", title: "Gamified Progress", desc: "Earn points, climb the leaderboard, and stay motivated with achievement tracking.", img: "/images/Dashboards/Student/Leaderboard.png" },
];

const STATS = [
  { value: "10K+", label: "Students learning" },
  { value: "200+", label: "Courses available" },
  { value: "98%", label: "Student satisfaction" },
];

const TESTIMONIALS = [
  { 
    quote: "Skill Sphere's AI tutor helped me understand Python when I was stuck at 2 AM. It's like having a personal tutor available 24/7.", 
    author: "Alex Chen", 
    role: "Computer Science Student",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
  },
  { 
    quote: "The gamification keeps me motivated. I check my streak every day and it pushes me to keep learning.", 
    author: "Maria Garcia", 
    role: "Data Science Student",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
  },
  { 
    quote: "The community chat is amazing. I've made friends and study buddies from all over the world.", 
    author: "James Wilson", 
    role: "Web Development Student",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop"
  }
];

export default function FeaturesPageClient() {
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();

  const getStaggerDelay = (desktopDelay: number) => isMobile ? desktopDelay * 0.5 : desktopDelay;

  return (
    <div className="flex flex-col bg-[#0D0B14] min-h-screen text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-32 px-4 overflow-hidden bg-[#1E1B2E]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[rgba(30,27,46,0.85)] z-10" />
          <Image src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000" alt="Features Hero" fill className="object-cover" priority />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
          <FadeIn delay={0.1}>
            <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.08em] font-semibold mb-4 block">
              FEATURES
            </span>
          </FadeIn>

          <FadeIn delay={0.2} direction="up">
            <h1 className="font-heading text-[36px] md:text-[52px] text-white leading-[1.15] max-w-[700px] mb-6 mx-auto">
              Everything You Need to Succeed
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="font-sans text-[16px] md:text-[18px] text-[rgba(255,255,255,0.75)] max-w-[560px] mx-auto leading-[1.6]">
              A complete learning ecosystem designed for the modern student.
            </p>
          </FadeIn>

          {!shouldReduceMotion && (
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-[48px] text-white/50"
            >
              <ChevronDown size={24} />
            </motion.div>
          )}
        </div>
      </section>

      {/* 2. STICKY SCROLL PARALLAX FEATURES */}
      <StickyScrollSection />

      {/* 3. HOW IT WORKS */}
      <section className="py-[80px] px-[32px] bg-[#0A0810] border-t border-white/5">
        <div className="max-w-[1000px] mx-auto w-full">
          <div className="text-center mb-[48px]">
            <FadeIn>
              <h2 className="font-heading text-[32px] text-white">How It Works</h2>
              <p className="font-sans text-[16px] text-white/50 mt-[8px]">Start learning in four simple steps.</p>
            </FadeIn>
          </div>

          <StaggerContainer staggerDelay={getStaggerDelay(0.15)} className="relative flex flex-col md:flex-row items-center md:items-start justify-center gap-8 lg:gap-16">
            <motion.div 
              initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="hidden md:block absolute top-6 left-[12%] right-[12%] h-[2px] bg-[#C9A96E]/20 origin-left" 
            />
            
            {STEPS.map((step, idx) => (
              <StaggerItem key={idx} className="relative flex flex-col items-center text-center w-[220px]">
                {/* Icon */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-[rgba(201,169,110,0.12)] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(201,169,110,0.1)]">
                  <step.icon className="w-5 h-5 text-[#C9A96E]" />
                </div>
                
                {/* Number watermark */}
                <span className="font-heading text-[56px] font-bold text-white/10 leading-none select-none">
                  {step.num}
                </span>
                
                {/* Title */}
                <h3 className="mt-2 text-base font-medium text-white">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="mt-2 text-sm text-white/50 max-w-[200px] leading-relaxed text-center">
                  {step.desc}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 3. NUMBERED FEATURE CARDS */}
      <section className="py-[120px] px-[32px] bg-[#0A0810] relative">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-[64px]">
          <div className="mb-[32px]">
            <FadeIn>
              <h2 className="font-heading text-[14px] text-white/50 tracking-widest uppercase mb-4">Our Products</h2>
            </FadeIn>
          </div>
          {FEATURE_CARDS.map((card, idx) => (
            <SlideUp key={idx} y={40} delay={0.1}>
              <div className="bg-[#1E1B2E] rounded-[32px] border border-white/10 p-[40px] md:p-[64px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                {/* Header Row */}
                <div className="flex justify-between items-center pb-[32px] border-b border-white/10 mb-[40px]">
                  <span className="font-heading text-[24px] text-white/30">{card.num}</span>
                  <h3 className="font-heading text-[32px] md:text-[48px] text-white">{card.title}</h3>
                  <div className="w-[40px] h-[40px] rounded-full border border-white/20 flex items-center justify-center text-[#C9A96E]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                </div>

                {/* Body Row */}
                <div className="flex flex-col md:flex-row gap-[48px] items-center">
                  <div className="w-full md:w-1/3">
                    <p className="font-sans text-[18px] md:text-[20px] text-white/70 leading-[1.6]">
                      {card.desc}
                    </p>
                  </div>
                  <div className="w-full md:w-2/3">
                    <div className="w-full aspect-[16/10] relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-[#0A0810]">
                      <Image src={card.img} alt={card.title} fill className="object-cover object-top" />
                    </div>
                  </div>
                </div>
              </div>
            </SlideUp>
          ))}
        </div>
      </section>

      {/* 4. STATS STRIP */}
      <section className="py-[80px] px-[32px] bg-[#0A0810] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-[40px] divide-y md:divide-y-0 md:divide-x divide-white/10">
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center pt-[40px] md:pt-0">
              <FadeIn delay={idx * 0.1}>
                <h4 className="font-heading text-[64px] md:text-[80px] text-white leading-none mb-[16px] text-center">{stat.value}</h4>
                <p className="font-sans text-[16px] text-white/50 text-center">{stat.label}</p>
              </FadeIn>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <TestimonialSlider />

      {/* 6. CTA SECTION */}
      <section className="px-[32px] pb-[80px] bg-[#0A0810]">
        <div className="bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] rounded-2xl p-[80px_32px] text-center max-w-[1200px] mx-auto w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#C9A96E]/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            <FadeIn delay={0.2}>
              <h2 className="font-heading text-[36px] text-white">Ready to Transform Your Learning?</h2>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="font-sans text-[16px] text-white/70 mt-[12px] mb-[32px]">
                Join thousands of students already learning with Skill Sphere.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px]">
                <Link href="/register">
                  <button className="w-full sm:w-auto h-[52px] px-[28px] bg-gradient-to-r from-[#C9A96E] to-[#D4B988] text-[#1E1B2E] font-sans font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(201,169,110,0.3)]">
                    Get Started Free
                  </button>
                </Link>
                <Link href="/courses">
                  <button className="w-full sm:w-auto h-[52px] px-[28px] bg-transparent border border-white/20 text-white font-sans font-medium rounded-xl hover:bg-white/10 transition-colors">
                    View Courses
                  </button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

    </div>
  );
}

function StickyScrollSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const ACTIONS = [
    { word: "Adapts", desc: "Get instant, personalized help from our AI tutor. Available 24/7 for any subject, any question." },
    { word: "Connects", desc: "Join discussions, ask questions, and collaborate with peers in course-specific chat rooms." },
    { word: "Rewards", desc: "Earn points, climb the leaderboard, and stay motivated with achievement tracking." },
    { word: "Empowers", desc: "Learn from industry professionals with curated courses designed for real-world application." },
  ];

  return (
    <section className="bg-[#0A0810] relative text-white py-[10vh]">
      <div className="max-w-[1200px] mx-auto w-full px-[32px] flex flex-col md:flex-row relative">
        {/* Left Sticky Side */}
        <div className="w-full md:w-[45%] md:sticky md:top-0 h-auto md:h-screen flex items-center pt-20 md:pt-0 z-10 pointer-events-none">
          <h2 className="font-heading text-[56px] sm:text-[72px] lg:text-[100px] leading-[1.1] text-white tracking-tight">
            Learning<br />that
          </h2>
        </div>

        {/* Right Scrolling Side */}
        <div className="w-full md:w-[55%] flex flex-col pb-[30vh] pt-[10vh] md:pt-[40vh]">
          {ACTIONS.map((action, idx) => (
            <ActionTextBlock 
              key={idx} 
              action={action} 
              index={idx} 
              setActiveIndex={setActiveIndex}
              isActive={activeIndex === idx} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSlider() {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleNext = () => setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  const handlePrev = () => setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  const current = TESTIMONIALS[activeIdx];
  const sentences = current.quote.split('.').filter(Boolean);
  const highlight = sentences.pop() + ".";
  const rest = sentences.join('. ') + (sentences.length ? "." : "");

  return (
    <section className="bg-[#0A0810] border-t border-white/5 relative flex flex-col md:flex-row min-h-[80vh]">
      {/* Left Image Side */}
      <div className="w-full md:w-[40%] relative min-h-[50vh] md:min-h-full bg-[#1E1B2E]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            src={current.avatar}
            alt={current.author}
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0A0810] via-[#0A0810]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-[32px] md:p-[64px] z-10 w-full flex flex-col items-start gap-0">
          <div className="bg-white p-[16px_24px] inline-block">
            <h4 className="font-sans text-[18px] text-[#1E1B2E] font-medium">{current.author}</h4>
          </div>
          <div className="bg-[#C9A96E] p-[12px_24px] inline-block">
             <p className="font-sans text-[14px] text-[#1E1B2E] font-bold">{current.role}</p>
          </div>
        </div>
      </div>

      {/* Right Text Side */}
      <div className="w-full md:w-[60%] flex flex-col pt-[64px] md:pt-[120px] px-[32px] md:px-[80px] pb-[64px] relative">
        <div className="md:absolute top-[80px] left-[80px] font-sans text-white/50 text-[14px] tracking-widest uppercase mb-12 md:mb-0">
          Featured Testimonials
        </div>
        
        <div className="flex-1 flex flex-col justify-center max-w-[800px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-sans text-[32px] md:text-[48px] lg:text-[56px] text-white leading-[1.2] mb-[40px] tracking-tight">
                "{rest} <span className="text-[#C9A96E]">{highlight}</span>"
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Nav / Stats */}
        <div className="flex justify-between items-end mt-[64px] border-t border-white/10 pt-[32px]">
          <div className="text-white/50 font-sans text-[16px] tracking-widest">
            0{activeIdx + 1} <span className="mx-2">/</span> 0{TESTIMONIALS.length}
          </div>
          <div className="flex -mb-[32px] -mr-[32px] md:-mr-[80px] md:-mb-[64px]">
            <button onClick={handlePrev} className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-t border-l border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button onClick={handleNext} className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-t border-l border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionTextBlock({ action, index, setActiveIndex, isActive }: { action: any, index: number, setActiveIndex: (idx: number) => void, isActive: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index);
    }
  }, [isInView, index, setActiveIndex]);

  return (
    <div ref={ref} className="min-h-[40vh] md:min-h-[60vh] flex flex-col justify-center py-10">
      <motion.h3 
        className="font-heading text-[56px] sm:text-[72px] lg:text-[100px] leading-[1.1] tracking-tight transition-colors duration-500"
        animate={{ color: isActive ? "#C9A96E" : "rgba(255, 255, 255, 0.15)" }}
      >
        {action.word}
      </motion.h3>
      <motion.div
        initial={false}
        animate={{ 
          opacity: isActive ? 1 : 0, 
          height: isActive ? "auto" : 0,
          marginTop: isActive ? 24 : 0
        }}
        className="overflow-hidden max-w-[400px]"
      >
        <p className="font-sans text-[18px] text-white/60 leading-[1.6]">
          {action.desc}
        </p>
      </motion.div>
    </div>
  );
}
