"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  Users,
  Star,
  Brain,
  PlayCircle,
  Quote
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useReducedMotion, useIsMobile } from "@/lib/animations";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideUp } from "@/components/animations/SlideUp";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { CountUp } from "@/components/animations/CountUp";
import { ParallaxWrapper } from "@/components/animations/ParallaxWrapper";

export default function LandingPageClient() {
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

  // Adjust stagger delay for mobile
  const getStaggerDelay = (desktopDelay: number) => isMobile ? desktopDelay * 0.5 : desktopDelay;


  const appleEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

  return (
    <div className="flex flex-col overflow-hidden font-sans bg-[#F5F1EB]">
      {/* 1. HERO SECTION - CINEMATIC */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center bg-[#1E1B2E] overflow-hidden">
        {/* Ken Burns animated background */}
        <motion.div
          initial={{ scale: 1.0 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 z-0 origin-center"
        >
          <Image
            src="/images/hero-workspace.jpg"
            alt="Immersive workspace"
            fill
            className="object-cover opacity-40"
            priority
          />
        </motion.div>

        {/* Centered content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          {/* Eyebrow label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="mb-8"
          >
            <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E]">
              AI-Powered Learning
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
            className="font-heading font-bold text-[42px] md:text-[72px] lg:text-[96px] text-white leading-[0.95] mb-8 max-w-[1000px]"
          >
            Education, crafted for how you think.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: appleEase }}
            className="font-sans text-[17px] md:text-[20px] leading-[1.5] text-[#F5F1EB] mb-12 max-w-[560px]"
          >
            Unlock your potential with a premium learning platform designed for role-based education and real-time collaboration.
          </motion.p>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0, ease: appleEase }}
          >
            <Link href="/courses">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 6px 24px rgba(201,169,110,0.55)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[17px] rounded-full px-10 py-4 shadow-[0_4px_14px_rgba(201,169,110,0.4)]"
              >
                Explore Courses
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator line */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-[#C9A96E] to-transparent"
          />
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="bg-white py-[100px] px-4">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn direction="up">
            <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.08em] font-semibold">WHY SKILL SPHERE</span>
          </FadeIn>
          <FadeIn delay={0.1} direction="up">
            <h2 className="font-heading text-[36px] text-[#1E1B2E] mt-4">Everything you need to excel</h2>
          </FadeIn>
          
          <StaggerContainer staggerDelay={getStaggerDelay(0.15)} className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mt-[40px]">
            {[
              { icon: Sparkles, title: "AI Tutor", desc: "Get personalized explanations and feedback from our advanced AI." },
              { icon: BookOpen, title: "Expert Courses", desc: "Learn from industry experts with structured, high-quality curriculum." },
              { icon: Users, title: "Community", desc: "Connect with peers, join study groups, and learn together." }
            ].map((feat, i) => (
              <StaggerItem key={i}>
                <div className="bg-white rounded-2xl p-[32px] text-left shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all duration-300 group h-full">
                  <feat.icon size={40} className="text-[#C9A96E] mb-[20px] group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-heading text-[20px] text-[#1E1B2E] mt-[16px]">{feat.title}</h3>
                  <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.6] mt-[8px]">{feat.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="bg-[#F5F1EB] py-[100px] px-4">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn direction="up">
            <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.08em] font-semibold">HOW IT WORKS</span>
          </FadeIn>
          <FadeIn delay={0.1} direction="up">
            <h2 className="font-heading text-[32px] text-[#1E1B2E] mt-4 mb-[60px]">Start learning in 4 simple steps</h2>
          </FadeIn>

          <StaggerContainer staggerDelay={getStaggerDelay(0.2)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[32px] items-start relative mt-[60px]">
            <div className="hidden lg:block absolute top-[40px] left-0 right-0 h-[1px] bg-[#C9A96E]/30 z-0" />
            {[
              { num: "01", title: "Sign Up", desc: "Create your free account in seconds" },
              { num: "02", title: "Choose Your Path", desc: "Browse courses across multiple disciplines" },
              { num: "03", title: "Start Learning", desc: "Access video lessons, quizzes, and projects" },
              { num: "04", title: "Earn & Grow", desc: "Track progress and unlock achievements" }
            ].map((step, i) => (
              <StaggerItem key={i} className="flex flex-col items-center text-center relative z-10 px-4 bg-[#F5F1EB]">
                <span className="font-heading text-[64px] font-bold text-[#1E1B2E]/15 leading-none">{step.num}</span>
                <h3 className="font-sans text-[18px] font-medium text-[#1E1B2E] mt-[16px]">{step.title}</h3>
                <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.6] mt-2 max-w-[240px]">{step.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 4. STATS SECTION */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
        <FadeIn direction="up">
          <div className="bg-[#1E1B2E] rounded-2xl my-[60px] p-[60px]">
            <StaggerContainer staggerDelay={getStaggerDelay(0.15)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px] text-center">
              {[
                { target: 12500, suffix: "+", label: "STUDENTS" },
                { target: 200, suffix: "+", label: "COURSES" },
                { target: 45, suffix: "+", label: "COUNTRIES" },
                { target: 98, suffix: "%", label: "SATISFACTION" }
              ].map((stat, i) => (
                <StaggerItem key={i} className="flex flex-col items-center">
                  <CountUp target={stat.target} suffix={stat.suffix} className="font-heading text-[48px] text-[#C9A96E]" />
                  <span className="font-sans text-[14px] text-white/70 uppercase tracking-[0.08em] mt-[8px]">{stat.label}</span>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeIn>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="bg-white py-[100px] px-4">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn direction="up">
            <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.08em] font-semibold">TESTIMONIALS</span>
          </FadeIn>
          <FadeIn delay={0.1} direction="up">
            <h2 className="font-heading text-[32px] text-[#1E1B2E] mt-4 mb-[60px]">What our students say</h2>
          </FadeIn>

          <StaggerContainer staggerDelay={getStaggerDelay(0.15)} className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            {[
              { q: "The AI tutor helped me understand calculus in a way my teacher couldn't. It never got impatient with my questions.", name: "Priya S.", role: "Engineering Student", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
              { q: "I love the streaks and points. It sounds silly, but maintaining my 14-day streak is the only reason I study on weekends.", name: "David L.", role: "Computer Science Major", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
              { q: "Being able to chat with classmates right inside the course page completely changed how we collaborate on group projects.", name: "Sarah M.", role: "High School Junior", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }
            ].map((t, i) => (
              <StaggerItem key={i}>
                <div className="bg-white rounded-2xl p-[28px] text-left shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)] flex flex-col justify-between h-full">
                  <div>
                    <Quote size={24} className="text-[#C9A96E] opacity-30 mb-4" />
                    <p className="font-sans text-[16px] text-[#1E1B2E] italic leading-[1.7] mb-6">"{t.q}"</p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-[rgba(30,27,46,0.06)]">
                    <div className="w-10 h-10 rounded-full bg-[rgba(201,169,110,0.2)] overflow-hidden relative">
                      {/* Note: Fallback images from unsplash since local ones might not exist */}
                      <Image src={t.img} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-sans text-[14px] font-medium text-[#1E1B2E]">{t.name}</div>
                      <div className="font-sans text-[13px] text-[#8E8E93]">{t.role}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="bg-[#F5F1EB] py-[80px] px-[32px] text-center">
        <SlideUp y={40} className="max-w-2xl mx-auto">
          <h2 className="font-heading text-[32px] text-[#1E1B2E] mb-4">Ready to start learning?</h2>
          <p className="font-sans text-[16px] text-[#8E8E93] mb-8">
            Join thousands of students already advancing their careers.
          </p>
          <FadeIn delay={0.2} direction="up">
            <Link href="/register">
              <button className="h-[52px] px-[32px] bg-[#C9A96E] text-[#1E1B2E] font-sans text-[16px] font-medium rounded-xl hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(201,169,110,0.3)] transition-all">
                Get Started
              </button>
            </Link>
          </FadeIn>
        </SlideUp>
      </section>

    </div>
  );
}
