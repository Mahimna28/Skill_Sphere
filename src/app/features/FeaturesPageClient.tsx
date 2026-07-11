"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { ChevronDown, Sparkles, BookOpen, Users, Trophy, MessageSquare, BarChart, UserPlus, Search, PlayCircle, Award, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

import { useReducedMotion, useIsMobile } from "@/lib/animations";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideUp } from "@/components/animations/SlideUp";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";

const FEATURES = [
  { icon: Sparkles, title: "AI Study Tutor", desc: "Get instant, personalized help from our AI tutor. Available 24/7 for any subject, any question.", img: "/images/Dashboards/Student/AI_Study_Tutor.png" },
  { icon: BookOpen, title: "Expert-Led Course Studio", desc: "Learn from industry professionals with curated courses designed for real-world application.", img: "/images/Dashboards/Teacher_InstituteAdmin/CourseStudio.png" },
  { icon: Users, title: "Community Learning", desc: "Join discussions, ask questions, and collaborate with peers in course-specific chat rooms.", img: "/images/Dashboards/Student/Course_Chat.png" },
  { icon: Trophy, title: "Gamified Progress", desc: "Earn points, climb the leaderboard, and stay motivated with achievement tracking.", img: "/images/Dashboards/Student/Leaderboard.png" },
];

const STEPS = [
  { num: "01", icon: UserPlus, title: "Sign Up", desc: "Create your free account in seconds." },
  { num: "02", icon: Search, title: "Explore", desc: "Browse courses and find your path." },
  { num: "03", icon: PlayCircle, title: "Learn", desc: "Watch lessons, complete quizzes, build projects." },
  { num: "04", icon: Award, title: "Achieve", desc: "Earn certificates and track your progress." }
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
    <div className="flex flex-col bg-[#F5F1EB] min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-32 px-4 overflow-hidden bg-[#1E1B2E]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[rgba(30,27,46,0.8)] z-10" />
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
      <section className="py-[80px] px-[32px] bg-white">
        <div className="max-w-[1000px] mx-auto w-full">
          <div className="text-center mb-[48px]">
            <FadeIn>
              <h2 className="font-heading text-[32px] text-[#1E1B2E]">How It Works</h2>
              <p className="font-sans text-[16px] text-[#8E8E93] mt-[8px]">Start learning in four simple steps.</p>
            </FadeIn>
          </div>

          <StaggerContainer staggerDelay={getStaggerDelay(0.15)} className="relative flex flex-col md:flex-row items-center md:items-start justify-center gap-8 lg:gap-16">
            <motion.div 
              initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="hidden md:block absolute top-6 left-[12%] right-[12%] h-[2px] bg-[#C9A96E]/30 origin-left" 
            />
            
            {STEPS.map((step, idx) => (
              <StaggerItem key={idx} className="relative flex flex-col items-center text-center w-[220px]">
                {/* Icon */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-[rgba(201,169,110,0.12)] flex items-center justify-center mb-6">
                  <step.icon className="w-5 h-5 text-[#C9A96E]" />
                </div>
                
                {/* Number watermark */}
                <span className="font-heading text-[56px] font-bold text-[#1E1B2E]/15 leading-none select-none">
                  {step.num}
                </span>
                
                {/* Title */}
                <h3 className="mt-2 text-base font-medium text-[#1E1B2E]">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="mt-2 text-sm text-[#8E8E93] max-w-[200px] leading-relaxed text-center">
                  {step.desc}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 4. INTERACTIVE DEMO SECTION */}
      <section className="py-[80px] px-[32px] bg-[#F5F1EB]">
        <div className="max-w-[1000px] mx-auto w-full">
          <div className="text-center mb-[48px]">
            <FadeIn>
              <h2 className="font-heading text-[32px] text-[#1E1B2E]">See It In Action</h2>
            </FadeIn>
          </div>

          <StaggerContainer staggerDelay={getStaggerDelay(0.2)} className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            
            {/* Left Card: AI Tutor Demo */}
            <StaggerItem>
              <SlideUp y={20} className="h-full">
                <div className="bg-white rounded-2xl p-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] h-full flex flex-col">
                  <div className="flex items-center gap-[8px] pb-[16px] border-b border-[rgba(30,27,46,0.06)]">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#22C55E]" />
                    <span className="font-sans text-[14px] font-bold text-[#1E1B2E]">AI Tutor <span className="font-normal text-[#8E8E93]">Online</span></span>
                  </div>

                  <div className="flex flex-col gap-[16px] mt-[24px] flex-1 justify-end">
                    <div className="self-end bg-[#1E1B2E] text-white rounded-2xl rounded-tr-sm px-[16px] py-[12px] max-w-[85%] font-sans text-[14px]">
                      Can you explain how React hooks work? I'm having trouble with useEffect.
                    </div>
                    <div className="self-start bg-white border border-[rgba(30,27,46,0.08)] text-[#1E1B2E] rounded-2xl rounded-tl-sm px-[16px] py-[12px] max-w-[85%] font-sans text-[14px] shadow-sm">
                      Of course! Think of <code>useEffect</code> as a way to synchronize your component with an external system. Let's break down the dependency array first...
                    </div>
                    <div className="self-start bg-white border border-[rgba(30,27,46,0.08)] rounded-2xl rounded-tl-sm px-[16px] py-[12px] shadow-sm flex gap-1">
                      <div className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-pulse delay-75" />
                      <div className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-pulse delay-150" />
                      <div className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-pulse delay-300" />
                    </div>
                  </div>
                </div>
              </SlideUp>
            </StaggerItem>

            {/* Right Card: Dashboard Preview */}
            <StaggerItem>
              <SlideUp y={20} delay={0.2} className="h-full">
                <div className="bg-white rounded-2xl p-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] h-full flex flex-col justify-between">
                  <div>
                    <h4 className="font-sans text-[16px] font-bold text-[#1E1B2E] mb-[16px]">Your Dashboard Overview</h4>
                    <div className="grid grid-cols-3 gap-[12px] mb-[32px]">
                      <div className="bg-[#F5F1EB] rounded-lg p-[12px] text-center">
                        <span className="block font-heading text-[24px] text-[#1E1B2E]">4</span>
                        <span className="block font-sans text-[11px] text-[#8E8E93] uppercase">Courses</span>
                      </div>
                      <div className="bg-[#F5F1EB] rounded-lg p-[12px] text-center">
                        <span className="block font-heading text-[24px] text-[#1E1B2E]">850</span>
                        <span className="block font-sans text-[11px] text-[#8E8E93] uppercase">Points</span>
                      </div>
                      <div className="bg-[#F5F1EB] rounded-lg p-[12px] text-center">
                        <span className="block font-heading text-[24px] text-[#1E1B2E]">12</span>
                        <span className="block font-sans text-[11px] text-[#8E8E93] uppercase">Streak</span>
                      </div>
                    </div>
                    
                    <div className="mb-[8px] flex justify-between font-sans text-[13px] font-medium text-[#1E1B2E]">
                      <span>Advanced Web Dev</span>
                      <span className="text-[#C9A96E]">65%</span>
                    </div>
                    <div className="w-full bg-[rgba(30,27,46,0.06)] rounded-full h-[8px] mb-[12px] overflow-hidden">
                      <div className="bg-[#C9A96E] h-full rounded-full w-[65%]" />
                    </div>
                    <p className="font-sans text-[13px] text-[#8E8E93] mb-[32px]">Next up: State Management with Redux Toolkit</p>
                  </div>

                  <button className="w-full h-[44px] bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium rounded-xl hover:scale-[1.02] transition-transform shadow-md">
                    Continue Learning
                  </button>
                </div>
              </SlideUp>
            </StaggerItem>

          </StaggerContainer>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-[80px] px-[32px] bg-white">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="text-center mb-[48px]">
            <FadeIn>
              <h2 className="font-heading text-[32px] text-[#1E1B2E]">Loved by Students</h2>
            </FadeIn>
          </div>

          <StaggerContainer staggerDelay={getStaggerDelay(0.15)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
            {TESTIMONIALS.map((t, idx) => (
              <StaggerItem key={idx}>
                <div className="bg-white rounded-2xl p-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:-translate-y-[4px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 h-full flex flex-col border border-[rgba(30,27,46,0.03)]">
                  <Quote size={24} className="text-[#C9A96E] opacity-30" />
                  <p className="font-sans text-[16px] text-[#1E1B2E] italic leading-[1.7] mt-[12px] flex-1">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-[12px] mt-[20px]">
                    <div className="w-[40px] h-[40px] relative rounded-full overflow-hidden bg-[#F5F1EB]">
                      <Image src={t.avatar} alt={t.author} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-sans text-[14px] text-[#1E1B2E] font-medium leading-tight">{t.author}</h4>
                      <p className="font-sans text-[13px] text-[#8E8E93]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="px-[32px] pb-[80px] bg-white">
        <div className="bg-[#1E1B2E] rounded-2xl p-[80px_32px] text-center max-w-[1200px] mx-auto w-full shadow-2xl">
          <FadeIn delay={0.2}>
            <h2 className="font-heading text-[36px] text-white">Ready to Transform Your Learning?</h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="font-sans text-[16px] text-[rgba(255,255,255,0.7)] mt-[12px] mb-[32px]">
              Join thousands of students already learning with Skill Sphere.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px]">
              <Link href="/register">
                <button className="w-full sm:w-auto h-[52px] px-[28px] bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium rounded-xl hover:scale-[1.02] transition-transform">
                  Get Started Free
                </button>
              </Link>
              <Link href="/courses">
                <button className="w-full sm:w-auto h-[52px] px-[28px] bg-transparent border border-white text-white font-sans font-medium rounded-xl hover:bg-white hover:text-[#1E1B2E] transition-colors">
                  View Courses
                </button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}

function StickyScrollSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-[120px] px-[32px] bg-[#F5F1EB] relative">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-[80px]">
          <FadeIn>
            <h2 className="font-heading text-[32px] md:text-[48px] text-[#1E1B2E]">Why Skill Sphere Stands Out</h2>
            <p className="font-sans text-[16px] md:text-[18px] text-[#8E8E93] mt-[12px]">Powerful tools designed to accelerate your learning journey.</p>
          </FadeIn>
        </div>

        <div className="flex flex-col md:flex-row gap-12 relative items-start">
          {/* Left side: Scrolling Text */}
          <div className="w-full md:w-1/2 flex flex-col pb-[30vh]">
            {FEATURES.map((feature, idx) => (
              <FeatureTextBlock 
                key={idx} 
                feature={feature} 
                index={idx} 
                setActiveIndex={setActiveIndex}
                isActive={activeIndex === idx} 
              />
            ))}
          </div>

          {/* Right side: Sticky Image */}
          <div className="hidden md:block w-1/2 sticky top-[30vh]">
            <div className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.15)] bg-white border border-[rgba(30,27,46,0.04)] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  src={FEATURES[activeIndex].img}
                  alt={FEATURES[activeIndex].title}
                  className="w-full h-full object-cover object-top absolute inset-0"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureTextBlock({ feature, index, setActiveIndex, isActive }: { feature: any, index: number, setActiveIndex: (idx: number) => void, isActive: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index);
    }
  }, [isInView, index, setActiveIndex]);

  return (
    <div ref={ref} className={`transition-all duration-500 ${isActive ? "opacity-100 scale-100" : "opacity-30 scale-95"} flex flex-col justify-center min-h-[60vh]`}>
      <div className="w-[64px] h-[64px] rounded-2xl bg-[rgba(201,169,110,0.1)] flex items-center justify-center mb-[24px]">
        <feature.icon size={32} className="text-[#C9A96E]" />
      </div>
      <h3 className="font-heading text-[32px] text-[#1E1B2E] mb-4">{feature.title}</h3>
      <p className="font-sans text-[18px] text-[#8E8E93] leading-[1.7] mb-6">
        {feature.desc}
      </p>
      {/* Mobile-only image */}
      <div className="md:hidden w-full aspect-video rounded-xl overflow-hidden shadow-lg mt-6 relative">
        <img src={feature.img} alt={feature.title} className="w-full h-full object-cover object-top" />
      </div>
    </div>
  );
}

