"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Target, Eye, Star, Heart, Shield, Zap } from "lucide-react";

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
                <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop" alt="Students learning" fill className="object-cover" />
              </div>
            ) : (
              <ParallaxWrapper speed={0.5} className="w-full h-full relative rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
                <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop" alt="Students learning" fill className="object-cover" />
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
              className="w-full h-full bg-[#C9A96E]"
            />
          </div>

          <div className="relative z-10 flex flex-col gap-12">
            {[
              { year: "2023", title: "Founded", desc: "Skill Sphere started as a small project to help students learn programming." },
              { year: "2024", title: "First 1,000 Students", desc: "Reached our first milestone with students from 15 countries." },
              { year: "2025", title: "AI Tutor Launch", desc: "Introduced AI-powered tutoring to provide 24/7 personalized help." },
              { year: "2026", title: "Global Expansion", desc: "Now serving students across 45+ countries with 200+ courses." }
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
                    <div className="bg-white rounded-xl p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] max-w-[360px] text-left w-full">
                      <span className="font-sans text-[12px] text-[#C9A96E] uppercase font-semibold">{item.year}</span>
                      <h3 className="font-heading text-[20px] text-[#1E1B2E] mt-2 mb-2">{item.title}</h3>
                      <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.6]">{item.desc}</p>
                    </div>
                  </motion.div>

                  {/* Dot */}
                  <div className="absolute left-[24px] md:left-1/2 top-8 -translate-x-1/2">
                    <motion.div 
                      initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-[12px] h-[12px] bg-[#C9A96E] rounded-full shadow-[0_0_0_4px_rgba(201,169,110,0.2)]"
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

        <StaggerContainer staggerDelay={getStaggerDelay(0.15)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mt-[40px]">
          {[
            { name: "Swayam Chaudhari", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
            { name: "Mahimna Mistry", role: "Head of Product", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
            { name: "Jal Patel", role: "Lead Designer", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" },
            { name: "Priya S.", role: "Lead Engineer", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" }
          ].map((member, i) => (
            <StaggerItem key={i}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] group transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                <div className="w-full aspect-square relative overflow-hidden bg-[#1E1B2E]">
                  <Image src={member.img} alt={member.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-[18px] text-[#1E1B2E] pt-[16px] px-[20px] pb-[4px]">{member.name}</h3>
                  <p className="font-sans text-[13px] text-[#8E8E93] px-[20px] pb-[20px]">{member.role}</p>
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
            {[
              { target: 2024, suffix: "", label: "FOUNDED" },
              { target: 12500, suffix: "+", label: "STUDENTS" },
              { target: 45, suffix: "+", label: "COUNTRIES" },
              { target: 12, suffix: "+", label: "TEAM" }
            ].map((stat, i) => (
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
