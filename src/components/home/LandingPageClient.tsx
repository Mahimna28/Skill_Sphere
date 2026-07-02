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

  return (
    <div className="flex flex-col overflow-hidden font-sans bg-[#F5F1EB]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-32 px-4 overflow-hidden bg-[#1E1B2E]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[rgba(30,27,46,0.75)] z-10" />
          <Image src="/images/hero-workspace.jpg" alt="Hero Background" fill className="object-cover" priority />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2">
            <FadeIn delay={0.1} direction="up">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
                <Star size={14} className="fill-[#C9A96E] text-[#C9A96E]" />
                <span className="font-sans text-[12px] text-white">Trusted by 500+ students</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} direction="up">
              <h1 className="font-heading text-[36px] md:text-[52px] text-white leading-[1.15] max-w-[640px] mb-6">
                Unlock Your Potential with Skill Sphere
              </h1>
            </FadeIn>

            <FadeIn delay={0.3} direction="up">
              <p className="font-sans text-[18px] text-[rgba(255,255,255,0.75)] max-w-[560px] leading-[1.6]">
                Master in-demand skills with AI-powered tutoring, expert-led courses, and a thriving learning community.
              </p>
            </FadeIn>

            <FadeIn delay={0.4} direction="up">
              <div className="flex flex-row gap-4 mt-8">
                <motion.button
                  onClick={() => router.push('/courses')}
                  className="h-[52px] px-7 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-medium text-base hover:scale-[1.02] transition-transform"
                >
                  Explore Courses
                </motion.button>
                <motion.button
                  onClick={() => router.push('/dashboard/student/ai-tutor')}
                  className="h-[52px] px-7 rounded-xl border-2 border-white text-white font-medium text-base hover:bg-white/10 transition-colors"
                >
                  Try AI Tutor
                </motion.button>
              </div>
            </FadeIn>

            <StaggerContainer staggerDelay={getStaggerDelay(0.15)} delayChildren={0.5} className="flex flex-row gap-8 md:gap-12 mt-12">
              {[
                { target: 500, suffix: "+", label: "Students" },
                { target: 50, suffix: "+", label: "Courses" },
                { target: 24, suffix: "/7", label: "AI Support" }
              ].map((stat, i) => (
                <StaggerItem key={i} className="flex flex-col items-center lg:items-start">
                  <CountUp target={stat.target} suffix={stat.suffix} className="font-heading text-[32px] text-[#C9A96E]" />
                  <span className="font-sans text-[14px] text-[rgba(255,255,255,0.6)] mt-1">{stat.label}</span>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Floating Preview Cards (Desktop Only) */}
          {!isMobile && (
            <div className="hidden lg:block w-1/2 relative h-[500px]">
              <ParallaxWrapper speed={0.3} className="absolute inset-0">
                <motion.div 
                  onClick={() => router.push('/dashboard/student/ai-tutor')}
                  whileHover={{ scale: 1.02 }}
                  animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-[10%] top-[20%] z-10 w-[280px] bg-white rounded-2xl overflow-hidden -rotate-6 shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] text-left cursor-pointer"
                >
                  <div className="h-1 w-full bg-[#C9A96E]" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4 border-b border-[rgba(30,27,46,0.06)] pb-2">
                      <Brain size={16} className="text-[#C9A96E]" />
                      <span className="font-heading font-medium text-[15px] text-[#1E1B2E]">AI Study Tutor</span>
                    </div>
                    <div className="flex flex-col gap-3 font-sans text-[13px]">
                      <div className="bg-[#1E1B2E] text-white p-3 rounded-xl rounded-tr-sm self-end max-w-[85%]">
                        How does photosynthesis work?
                      </div>
                      <div className="bg-[#F5F1EB] text-[#1E1B2E] p-3 rounded-xl rounded-tl-sm self-start max-w-[90%]">
                        Photosynthesis is the process where plants convert light...
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  onClick={() => router.push('/courses/python-programming')}
                  whileHover={{ scale: 1.02 }}
                  animate={shouldReduceMotion ? {} : { y: [0, -14, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute right-[30%] top-[40%] z-20 w-[320px] bg-white rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.35)] text-left cursor-pointer"
                >
                  <div className="aspect-video relative rounded-lg overflow-hidden mb-3">
                    <Image 
                      src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400" 
                      alt="Python Programming" 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-heading text-lg text-[#1E1B2E]">Python Programming</h4>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 mb-2">
                    <div className="w-2/3 h-full bg-[#C9A96E] rounded-full" />
                  </div>
                </motion.div>
              </ParallaxWrapper>
            </div>
          )}

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
