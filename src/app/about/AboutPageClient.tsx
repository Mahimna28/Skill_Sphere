"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Target, Eye, Star, Heart, Shield, Zap, Code, Link2, MessageCircle, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { TEAM_MEMBERS } from "@/lib/team";

import { useReducedMotion, useIsMobile } from "@/lib/animations";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideUp } from "@/components/animations/SlideUp";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { CountUp } from "@/components/animations/CountUp";
import { ParallaxWrapper } from "@/components/animations/ParallaxWrapper";

export default function AboutPageClient() {
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();

  const getStaggerDelay = (desktopDelay: number) => isMobile ? desktopDelay * 0.5 : desktopDelay;

  const [stats, setStats] = useState([
    { target: 2024, suffix: "", label: "FOUNDED" },
    { target: 12500, suffix: "+", label: "STUDENTS" },
    { target: 45, suffix: "+", label: "COUNTRIES" },
    { target: 12, suffix: "+", label: "TEAM" }
  ]);

  useEffect(() => {
    fetch("/api/stats/public")
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          setStats([
            { target: 2024, suffix: "", label: "FOUNDED" },
            { target: data.stats.users || 0, suffix: "+", label: "STUDENTS" },
            { target: data.stats.institutions || 0, suffix: "+", label: "INSTITUTIONS" },
            { target: data.stats.courses || 0, suffix: "+", label: "COURSES" }
          ]);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col overflow-hidden font-sans bg-[#F5F1EB]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-32 px-4 overflow-hidden bg-[#1E1B2E]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[rgba(30,27,46,0.75)] z-10" />
          <Image src="/images/hero-workspace.jpg" alt="About Hero" fill className="object-cover" priority />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
          <FadeIn delay={0.1}>
            <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.08em] font-semibold mb-4 block">
              OUR STORY
            </span>
          </FadeIn>

          <FadeIn delay={0.2} direction="up">
            <h1 className="font-heading text-[36px] md:text-[48px] text-white leading-[1.15] max-w-[600px] mb-6">
              Empowering learners worldwide
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="font-sans text-[16px] md:text-[18px] text-[rgba(255,255,255,0.75)] max-w-[600px] leading-[1.6]">
              Skill Sphere was built to bridge the gap between traditional education and the skills that actually matter in today's world.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. WHY SKILL SPHERE */}
      <section className="py-[80px] px-[32px] max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-[48px] items-center">
          <div className="flex-1 text-center lg:text-left">
            <SlideUp y={30}>
              <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.08em] font-semibold block mb-4">
                Why we exist
              </span>
              <h2 className="font-heading text-[32px] text-[#1E1B2E] leading-[1.2] mb-5">
                Education should be accessible, engaging, and effective.
              </h2>
              <p className="font-sans text-[16px] text-[#8E8E93] leading-[1.7] max-w-[480px] mx-auto lg:mx-0">
                We believe that learning shouldn't be a solitary, frustrating experience. By combining AI-driven personalization with a vibrant community, we've created a platform where students actually want to learn.
              </p>
              <Link href="/courses" className="inline-block mt-[24px]">
                <button className="h-[44px] px-[20px] bg-transparent border border-[#1E1B2E] text-[#1E1B2E] font-sans text-[15px] font-medium rounded-xl hover:bg-[#1E1B2E] hover:text-white transition-colors">
                  Explore Courses
                </button>
              </Link>
            </SlideUp>
          </div>

          <div className="flex-1 w-full relative aspect-[4/3]">
            {isMobile ? (
              <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
                <Image src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=1000" alt="Students learning" fill className="object-cover" />
              </div>
            ) : (
              <ParallaxWrapper speed={0.5} className="w-full h-full relative rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
                <Image src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=1000" alt="Students learning" fill className="object-cover" />
              </ParallaxWrapper>
            )}
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION CARDS */}
      <section className="px-[32px] pb-[80px] max-w-6xl mx-auto w-full">
        <StaggerContainer staggerDelay={getStaggerDelay(0.2)} className="flex flex-col md:flex-row gap-[24px]">
          <StaggerItem className="flex-1">
            <div className="bg-white rounded-2xl p-[40px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] h-full">
              <Target size={32} className="text-[#C9A96E] mb-[20px]" />
              <h3 className="font-heading text-[24px] text-[#1E1B2E] mt-[16px]">Our Mission</h3>
              <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.7] mt-[12px]">
                To democratize education by providing accessible, high-quality learning experiences that prepare students for real-world success.
              </p>
            </div>
          </StaggerItem>
          
          <StaggerItem className="flex-1">
            <div className="bg-white rounded-2xl p-[40px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] h-full">
              <Eye size={32} className="text-[#C9A96E] mb-[20px]" />
              <h3 className="font-heading text-[24px] text-[#1E1B2E] mt-[16px]">Our Vision</h3>
              <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.7] mt-[12px]">
                A world where anyone, anywhere can learn the skills they need to thrive in the digital economy.
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 4. TIMELINE SECTION */}
      <section className="py-[80px] px-[32px] max-w-5xl mx-auto w-full relative">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.08em] font-semibold block mb-4">OUR JOURNEY</span>
            <h2 className="font-heading text-[32px] text-[#1E1B2E]">The story so far</h2>
          </FadeIn>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 left-[24px] md:left-1/2 md:-translate-x-1/2 w-[2px]">
            <motion.div 
              initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.2, ease: [0.075, 0.82, 0.165, 1] }}
              style={{ originY: 0 }}
              className="w-full h-full bg-[rgba(201,169,110,0.3)]"
            />
          </div>

          <div className="relative z-10 flex flex-col gap-12">
            {[
              { year: "2024", title: "The Spark", desc: "The idea for Skill Sphere was born from a simple observation: millions of students start online courses, but most quit within weeks. Not because they lack ability, but because they lack guidance, community, and real-time support. We set out to build the platform we wished existed." },
              { year: "Early 2025", title: "First Prototype", desc: "We built the initial MVP with Next.js, Prisma, and PostgreSQL. The core learning loop — courses, enrollment, progress tracking — took shape. Teachers could create courses, students could enroll, and the foundation was set." },
              { year: "Mid 2025", title: "AI & Real-Time Chat", desc: "The OpenAI-powered AI Study Tutor launched, giving students 24/7 help. Real-time Course Chat followed, connecting learners in the same course. The multi-role system (Student, Teacher, Admin) was implemented, enabling institutional use." },
              { year: "Late 2025", title: "Institutions & Parents", desc: "Institution management arrived — schools could onboard, teachers could create private classes, and parents could monitor their child's progress. The platform became a complete ecosystem for structured learning." },
              { year: "Early 2026", title: "Platform Scale", desc: "Super Admin dashboard, global courses, feedback system, and analytics gave administrators full control. The UI was redesigned to a premium Apple-inspired aesthetic — cream, navy, and gold — reflecting the quality of the learning experience." },
              { year: "Mid 2026", title: "Community Growth", desc: "Today, Skill Sphere serves thousands of students across institutions. With enhanced gamification, mobile responsiveness, and an ever-growing course catalog, we're just getting started. The mission remains: no learner left behind." }
            ].map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className={`flex w-full ${isEven ? 'md:justify-start' : 'md:justify-end'} relative`}>
                  
                  {/* Content Container */}
                  <motion.div 
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: isMobile ? 0 : (isEven ? -40 : 40), y: isMobile ? 30 : 0 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0], delay: 0.1 }}
                    className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-12'} pl-[60px] md:pl-0`}
                  >
                    <div className="bg-transparent max-w-[500px] text-left w-full">
                      <span className="font-heading text-[24px] text-[#C9A96E]">{item.year}</span>
                      <h3 className="font-heading text-[20px] text-[#1E1B2E] mt-1 mb-2">{item.title}</h3>
                      <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.7] max-w-[500px]">{item.desc}</p>
                    </div>
                  </motion.div>

                  {/* Dot */}
                  <div className="absolute left-[24px] md:left-1/2 top-4 -translate-x-1/2">
                    <motion.div 
                      initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-[12px] h-[12px] bg-[#C9A96E] rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TEAM SECTION */}
      <section className="py-[80px] px-[32px] max-w-6xl mx-auto w-full text-center">
        <FadeIn>
          <h2 className="font-heading text-[36px] text-[#1E1B2E]">Meet the Team</h2>
        </FadeIn>

        <StaggerContainer staggerDelay={getStaggerDelay(0.15)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] mt-[40px]">
          {TEAM_MEMBERS.map((member, i) => (
            <StaggerItem key={i}>
              <div className="bg-white rounded-[16px] overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(30,27,46,0.04)] h-full group hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(30,27,46,0.12)] transition-all duration-300">
                <div className="w-full aspect-square relative overflow-hidden bg-[#1E1B2E]">
                  <Image src={member.img} alt={member.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out" />
                </div>
                <div className="p-7 flex flex-col flex-1 text-left">
                  <h3 className="font-heading text-[20px] text-[#1E1B2E] leading-none mb-[8px]">{member.name}</h3>
                  <p className="font-sans text-[12px] text-[#C9A96E] uppercase tracking-[0.1em] mb-[16px]">{member.role}</p>
                  <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.6] mb-[24px] flex-grow line-clamp-3">{member.bio}</p>
                  
                  <div className="mt-auto flex flex-col gap-4">
                    {member.socials.email && (
                      <div className="flex items-center gap-2 text-[#8E8E93] font-sans text-[13px]">
                        <Mail size={14} />
                        <a href={`mailto:${member.socials.email}`} className="hover:text-[#C9A96E] transition-colors truncate">{member.socials.email}</a>
                      </div>
                    )}
                    <div className="flex items-center gap-3 border-t border-[rgba(30,27,46,0.06)] pt-4">
                      {member.socials.github && member.socials.github !== "#" && (
                        <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-[#8E8E93] hover:text-[#C9A96E] transition-colors">
                          <Code size={18} />
                        </a>
                      )}
                      {member.socials.linkedin && member.socials.linkedin !== "#" && (
                        <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#8E8E93] hover:text-[#C9A96E] transition-colors">
                          <Link2 size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 6. VALUES SECTION */}
      <section className="px-[32px] pb-[80px] max-w-6xl mx-auto w-full text-center">
        <FadeIn>
          <h2 className="font-heading text-[32px] text-[#1E1B2E]">Our Values</h2>
        </FadeIn>

        <StaggerContainer staggerDelay={getStaggerDelay(0.12)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] mt-[40px]">
          {[
            { icon: Star, title: "Excellence", desc: "We strive for the highest quality in everything we create." },
            { icon: Heart, title: "Passion", desc: "Learning should be engaging, inspiring, and fun." },
            { icon: Shield, title: "Integrity", desc: "Trust and transparency are at the core of our platform." },
            { icon: Zap, title: "Innovation", desc: "We constantly evolve to bring you the best tools." }
          ].map((val, i) => (
            <StaggerItem key={i}>
              <div className="bg-white rounded-2xl p-[32px] text-left shadow-[0_4px_20px_rgba(0,0,0,0.05)] h-full">
                <val.icon size={28} className="text-[#C9A96E] mb-[16px]" />
                <h3 className="font-heading text-[18px] text-[#1E1B2E]">{val.title}</h3>
                <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.6] mt-[8px]">{val.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 7. BY THE NUMBERS */}
      <section className="px-[32px] pb-[80px] max-w-7xl mx-auto w-full">
        <div className="bg-[#1E1B2E] rounded-2xl p-[60px]">
          <StaggerContainer staggerDelay={getStaggerDelay(0.15)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px] text-center">
            {stats.map((stat, i) => (
              <StaggerItem key={i} className="flex flex-col items-center">
                <CountUp target={stat.target} suffix={stat.suffix} className="font-heading text-[48px] text-[#C9A96E]" />
                <span className="font-sans text-[14px] text-white/70 uppercase tracking-[0.08em] mt-[8px]">{stat.label}</span>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 8. JOIN MISSION CTA */}
      <section className="py-[80px] px-[32px] text-center">
        <SlideUp y={30} className="max-w-2xl mx-auto">
          <h2 className="font-heading text-[32px] text-[#1E1B2E]">Join our mission</h2>
          <p className="font-sans text-[16px] text-[#8E8E93] mt-[12px] mb-[24px]">
            Be part of the future of education.
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
