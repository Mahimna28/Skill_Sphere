"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { useRef } from "react";

const appleEase = [0.4, 0, 0.2, 1];

function ParallaxImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Parallax effect (0.6x speed visually)
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[16px] shadow-[0_8px_32px_rgba(30,27,46,0.1)] ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0 scale-[1.3]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  );
}

export function FeaturesPageClient() {
  const logos = [
    { name: "Canvas", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Canvas_logo_wordmark.svg/512px-Canvas_logo_wordmark.svg.png" },
    { name: "Notion", src: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" },
    { name: "Google Workspace", src: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Workspace_Logo.svg" },
    { name: "Slack", src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" },
    { name: "Zoom", src: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Zoom_Logo.svg" },
  ];

  return (
    <div className="flex flex-col bg-[#F5F1EB] overflow-hidden">
      {/* 1. PAGE HEADER */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#1E1B2E] overflow-hidden">
        {/* Background Image */}
        <motion.div 
          initial={{ scale: 1.0 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 z-0 origin-center"
        >
          <Image 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2850" 
            alt="Features background" 
            fill 
            className="object-cover opacity-30"
            priority
          />
        </motion.div>
        {/* Subtle dark gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B2E]/80 via-[#2A2640]/80 to-[#1E1B2E]/80 z-0" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="mb-6"
          >
            <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E]">
              Capabilities
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
            className="font-heading font-bold text-[36px] md:text-[64px] text-white leading-[0.95] mb-8 max-w-[700px]"
          >
            Everything you need to master what matters.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
            className="font-sans text-[18px] leading-[1.5] text-[#F5F1EB] max-w-[560px]"
          >
            A complete ecosystem designed not just for consuming information, but for deep, lasting comprehension.
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-[#C9A96E] to-transparent"
          />
        </div>
      </section>

      {/* 2. FEATURE 1: PERSONALISED COURSES */}
      <section className="py-[160px] bg-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-[100px]">
            {/* Image Left */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: appleEase }}
              className="w-full lg:w-[45%]"
            >
              <ParallaxImage src="/images/feature-1.jpg" alt="Adaptive Learning Path" className="w-full aspect-square" />
            </motion.div>
            
            {/* Content Right */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: appleEase }}
              className="w-full lg:w-[55%]"
            >
              <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E] mb-6 block">
                Personalised Courses
              </span>
              <h2 className="font-heading text-[32px] md:text-[40px] text-[#1E1B2E] mb-6 leading-tight">
                Curriculum that adapts to your pace.
              </h2>
              <p className="font-sans text-[17px] text-[#8E8E93] leading-[1.7] max-w-[480px] mb-10">
                Our adaptive learning engine constantly evaluates your understanding, automatically adjusting the difficulty and providing supplementary materials when you need them. Never feel left behind or held back.
              </p>
              <ul className="space-y-4">
                {[
                  "Dynamic difficulty adjustment",
                  "Personalised reading recommendations",
                  "Spaced repetition built-in",
                  "Visual progress mapping"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#C9A96E]" />
                    <span className="font-sans text-[16px] text-[#8E8E93]">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE 2: AI STUDY TUTOR */}
      <section className="py-[160px] bg-[#1E1B2E]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-[100px]">
            {/* Content Left */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: appleEase }}
              className="w-full lg:w-[55%]"
            >
              <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E] mb-6 block">
                AI Study Tutor
              </span>
              <h2 className="font-heading text-[32px] md:text-[40px] text-white mb-6 leading-tight">
                Socratic guidance, available 24/7.
              </h2>
              <p className="font-sans text-[17px] text-[#F5F1EB] leading-[1.7] max-w-[480px] mb-10 opacity-90">
                Meet an AI tutor that doesn't just give you the answers. It asks probing questions, identifies the root of your confusion, and guides you to the "aha!" moment organically.
              </p>
              <ul className="space-y-4">
                {[
                  "Instant feedback on assignments",
                  "Conversational problem solving",
                  "Context-aware explanations",
                  "Patient, judgment-free learning"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#C9A96E]" />
                    <span className="font-sans text-[16px] text-[#F5F1EB] opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Image Right */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: appleEase }}
              className="w-full lg:w-[45%]"
            >
              <ParallaxImage src="/images/feature-2.jpg" alt="AI Chat Interface" className="w-full aspect-[4/5]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. FEATURE 3: REAL-TIME COLLABORATION */}
      <section className="py-[160px] bg-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-[100px]">
            {/* Image Left */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: appleEase }}
              className="w-full lg:w-[45%]"
            >
              <ParallaxImage src="/images/feature-3.jpg" alt="Study Group Session" className="w-full aspect-square" />
            </motion.div>
            
            {/* Content Right */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: appleEase }}
              className="w-full lg:w-[55%]"
            >
              <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E] mb-6 block">
                Real-Time Collaboration
              </span>
              <h2 className="font-heading text-[32px] md:text-[40px] text-[#1E1B2E] mb-6 leading-tight">
                Learn together, even when apart.
              </h2>
              <p className="font-sans text-[17px] text-[#8E8E93] leading-[1.7] max-w-[480px] mb-10">
                Education is inherently social. Our platform features integrated video study rooms, real-time shared whiteboards, and threaded discussions that make online learning feel less isolated.
              </p>
              <ul className="space-y-4">
                {[
                  "Live audio/video study groups",
                  "Shared interactive whiteboards",
                  "Peer-to-peer code review",
                  "Instructor office hours"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#C9A96E]" />
                    <span className="font-sans text-[16px] text-[#8E8E93]">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. FEATURE 4: RECOGNISED ACHIEVEMENT */}
      <section className="py-[160px] bg-[#1E1B2E]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-[100px]">
            {/* Content Left */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: appleEase }}
              className="w-full lg:w-[55%]"
            >
              <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E] mb-6 block">
                Recognised Achievement
              </span>
              <h2 className="font-heading text-[32px] md:text-[40px] text-white mb-6 leading-tight">
                Certifications that hold real weight.
              </h2>
              <p className="font-sans text-[17px] text-[#F5F1EB] leading-[1.7] max-w-[480px] mb-10 opacity-90">
                Turn your hard work into verifiable credentials. Our partnerships with top institutions mean your Skill Sphere certificates are recognised by employers worldwide.
              </p>
              <ul className="space-y-4">
                {[
                  "Blockchain-verified certificates",
                  "Detailed competency transcripts",
                  "Direct LinkedIn integration",
                  "Alumni network access"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#C9A96E]" />
                    <span className="font-sans text-[16px] text-[#F5F1EB] opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Image Right */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: appleEase }}
              className="w-full lg:w-[45%]"
            >
              <ParallaxImage src="/images/feature-4.jpg" alt="Student Certificate Preview" className="w-full aspect-[4/5]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-[200px] bg-[#1E1B2E] text-center border-t border-[#C9A96E]/20">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <h2 className="font-heading font-black text-[48px] text-white mb-6">
              Experience the difference.
            </h2>
            <p className="font-sans text-[18px] text-[#F5F1EB]/80 mb-12 font-light">
              Join thousands of learners elevating their skills with Skill Sphere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-full sm:w-auto bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[17px] rounded-full px-10 py-4 shadow-[0_4px_14px_rgba(201,169,110,0.4)]"
                >
                  Get Started Free
                </motion.button>
              </Link>
              <Link href="/pricing">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-full sm:w-auto bg-transparent border border-white text-white font-sans font-medium text-[17px] rounded-full px-10 py-4"
                >
                  View Pricing
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
