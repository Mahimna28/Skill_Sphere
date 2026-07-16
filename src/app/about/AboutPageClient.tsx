"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TEAM_MEMBERS } from "@/lib/team";

import { useReducedMotion, useIsMobile } from "@/lib/animations";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideUp } from "@/components/animations/SlideUp";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { CountUp } from "@/components/animations/CountUp";
import { SharedHeroSection } from "@/components/landing/SharedHeroSection";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ─── Story Chapters (Supernatural-style named sections) ──────────────────────
const STORY_CHAPTERS = [
  {
    tag: "Why we're here.",
    title: "Learning shouldn't be lonely.",
    body: "We were students who watched countless peers drop out of online courses — not for lack of talent, but for lack of guidance. The \"watch a video and figure it out\" model was broken. So we built Skill Sphere: a platform where every learner has a teacher who actually cares, an AI tutor on standby at 2 AM, and a community that celebrates progress. Because learning, when it's good, is one of the most energizing things a person can do.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "Students collaborating",
    flip: false,
  },
  {
    tag: "How we learn.",
    title: "AI that listens. Teachers who inspire.",
    body: "We believe the future of education isn't a choice between human warmth and machine intelligence — it's both. Our AI Study Tutor answers questions at any hour, adapts to each student's pace, and flags when a learner needs a real teacher to step in. That handoff — from algorithm to human — is where the magic happens. It's not EdTech. It's education, with better tools.",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "AI and learning technology",
    flip: true,
  },
  {
    tag: "Who we serve.",
    title: "Students, teachers, parents, institutions.",
    body: "A single platform, but never a one-size-fits-all experience. Students get personalized courses and a community. Teachers get powerful tools to create, manage, and genuinely connect with their students. Parents get visibility into their child's progress without hovering. Institutions get an entire operational layer — enrollment, analytics, staff management — built in. It took a lot of architectural ambition to get here. We think it was worth it.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "Diverse community of learners",
    flip: false,
  },
  {
    tag: "What's next.",
    title: "We're just getting started.",
    body: "The course catalog grows weekly. The AI gets sharper with every conversation. The community gets richer with every new learner who joins. We have a running list of features that will change how institutions operate and how students experience growth — and we're shipping them fast. If you're a student, a teacher, or a school looking for something better: we built this for you. Pull up a chair.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "Future of education",
    flip: true,
  },
];

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
      {/* 1. HERO */}
      <SharedHeroSection
        title="Building the Future of Learning"
        subtitle="Our Story"
        description="The people, principles, and purpose behind Skill Sphere."
        backgroundImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000"
      />

      {/* 2. FOUNDER'S LETTER */}
      <section className="py-[100px] px-[32px] max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-[64px] items-center">

          {/* Photo */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full lg:w-[42%] shrink-0"
          >
            <div className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(30,27,46,0.15)]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
                alt="Skill Sphere Founders Team"
                fill
                className="object-cover"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-8 left-8 bg-[#1E1B2E]/90 backdrop-blur-md rounded-xl px-5 py-3">
                <p className="font-heading text-[#C9A96E] text-[16px] font-bold">The Team</p>
                <p className="font-sans text-white/70 text-[12px]">Skill Sphere, 2024</p>
              </div>
            </div>
          </motion.div>

          {/* Letter content */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
            className="flex-1"
          >
            <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.12em] font-semibold block mb-6">
              A note from our team
            </span>

            {/* Pull quote */}
            <div className="border-l-[3px] border-[#C9A96E] pl-6 mb-8">
              <p className="font-heading text-[24px] md:text-[28px] text-[#1E1B2E] leading-[1.35] italic">
                &ldquo;We were students who couldn't find a platform that felt like it was actually built for us. So we built it ourselves.&rdquo;
              </p>
            </div>

            <div className="space-y-5 font-sans text-[16px] text-[#8E8E93] leading-[1.8]">
              <p>
                Skill Sphere started with a frustration most students know well: you enroll in a course with genuine excitement, hit a wall two weeks in, and there's nobody there to help. No tutor, no community, no feedback loop. Just you and a video you've already watched three times.
              </p>
              <p>
                We believed that education could be better — more personal, more responsive, more human — without sacrificing structure or scale. We built the AI tutor, the live course chat, the teacher-student connection layer, and the institutional management tools because <span className="text-[#1E1B2E] font-medium">each one was the thing we desperately wished existed</span> when we were on the other side of the screen.
              </p>
              <p>
                This is Skill Sphere. It's not perfect yet. But it's getting better every day, and it's built for you.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1E1B2E] flex items-center justify-center text-[#C9A96E] font-heading font-bold text-[18px] shrink-0">S</div>
              <div>
                <p className="font-heading text-[#1E1B2E] text-[16px] font-bold">The Skill Sphere Team</p>
                <p className="font-sans text-[#8E8E93] text-[13px]">Building since 2024</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. STORY CHAPTERS (Supernatural-style) */}
      <section className="max-w-7xl mx-auto w-full px-[32px] pb-[80px]">
        <FadeIn>
          <div className="text-center mb-[72px]">
            <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.12em] font-semibold block mb-4">Our principles</span>
            <h2 className="font-heading text-[36px] md:text-[42px] text-[#1E1B2E] leading-[1.15]">The things we believe in.</h2>
          </div>
        </FadeIn>

        <div className="flex flex-col gap-[80px] md:gap-[120px]">
          {STORY_CHAPTERS.map((chapter, index) => (
            <motion.div
              key={index}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className={`flex flex-col ${chapter.flip ? "lg:flex-row-reverse" : "lg:flex-row"} gap-[48px] items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-[48%] shrink-0">
                <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden shadow-[0_16px_48px_rgba(30,27,46,0.12)]">
                  <Image
                    src={chapter.image}
                    alt={chapter.imageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Text */}
              <div className={`flex-1 ${chapter.flip ? "lg:pr-8" : "lg:pl-8"}`}>
                {/* Chapter tag */}
                <p className="font-heading text-[#C9A96E] text-[20px] md:text-[22px] italic mb-3">
                  {chapter.tag}
                </p>
                <h3 className="font-heading text-[28px] md:text-[34px] text-[#1E1B2E] leading-[1.2] mb-5">
                  {chapter.title}
                </h3>
                <div className="w-12 h-[3px] bg-[#C9A96E] rounded-full mb-6" />
                <p className="font-sans text-[16px] text-[#8E8E93] leading-[1.8]">
                  {chapter.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
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
              { year: "Mid 2026", title: "Where We Are Now", desc: "Skill Sphere is live, growing, and actively used by students across institutions. The platform is in active development — new features ship regularly, feedback shapes every sprint, and the team is fully committed. We haven't \"arrived\" yet. That's the whole point." }
            ].map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className={`flex w-full ${isEven ? 'md:justify-start' : 'md:justify-end'} relative`}>
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

      {/* 5. BY THE NUMBERS */}
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

      {/* 6. TEAM SECTION */}
      <section className="py-[80px] px-[32px] max-w-6xl mx-auto w-full text-center">
        <FadeIn>
          <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.08em] font-semibold block mb-4">The people</span>
          <h2 className="font-heading text-[36px] text-[#1E1B2E]">Meet the Team</h2>
        </FadeIn>

        <StaggerContainer staggerDelay={getStaggerDelay(0.15)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] mt-[40px]">
          {TEAM_MEMBERS.map((member, i) => (
            <StaggerItem key={i}>
              <Link href={`/about/team/${member.slug}`} className="block h-full group">
              <div className="bg-white rounded-[16px] overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(30,27,46,0.04)] h-full group-hover:-translate-y-1 group-hover:shadow-[0_12px_32px_rgba(30,27,46,0.12)] transition-all duration-300">
                <div className="w-full aspect-square relative overflow-hidden bg-[#1E1B2E]">
                  <Image src={member.img} alt={member.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 ease-out" />
                </div>
                <div className="p-7 flex flex-col flex-1 text-left">
                  <h3 className="font-heading text-[20px] text-[#1E1B2E] leading-none mb-[8px]">{member.name}</h3>
                  <p className="font-sans text-[12px] text-[#C9A96E] uppercase tracking-[0.1em] mb-[16px]">{member.role}</p>
                  <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.6] mb-[24px] flex-grow line-clamp-3">{member.bio}</p>

                  <div className="mt-auto flex items-center justify-between border-t border-[rgba(30,27,46,0.06)] pt-4">
                    <span className="font-sans text-[12px] text-[#C9A96E] font-medium group-hover:underline">View Profile →</span>
                    <div className="flex gap-3">
                      {member.socials.github && member.socials.github !== "#" && (
                        <span onClick={(e) => { e.preventDefault(); window.open(member.socials.github, '_blank'); }} className="text-[#8E8E93] hover:text-[#C9A96E] transition-colors">
                          <GithubIcon className="w-[18px] h-[18px]" />
                        </span>
                      )}
                      {member.socials.linkedin && member.socials.linkedin !== "#" && (
                        <span onClick={(e) => { e.preventDefault(); window.open(member.socials.linkedin, '_blank'); }} className="text-[#8E8E93] hover:text-[#C9A96E] transition-colors">
                          <LinkedinIcon className="w-[18px] h-[18px]" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 7. EDITORIAL CLOSING CTA */}
      <section className="py-[100px] px-[32px]">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto bg-white rounded-[28px] p-[60px] md:p-[80px] shadow-[0_20px_60px_rgba(30,27,46,0.07)] relative overflow-hidden text-center"
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#C9A96E] rounded-full blur-[120px] opacity-10 -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#1E1B2E] rounded-full blur-[100px] opacity-5 -ml-16 -mb-16 pointer-events-none" />

          <div className="relative z-10">
            <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.12em] font-semibold block mb-6">Pull up a chair.</span>

            <h2 className="font-heading text-[36px] md:text-[48px] text-[#1E1B2E] leading-[1.15] mb-6">
              This platform is yours.
            </h2>

            <p className="font-sans text-[17px] text-[#8E8E93] leading-[1.8] max-w-[560px] mx-auto mb-10">
              Whether you're a student chasing your first certification, a teacher sharing expertise you've spent years building, or a school looking for a platform that actually works — you're in the right place. We mean that.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="h-[52px] px-[36px] bg-[#1E1B2E] text-white font-sans text-[16px] font-medium rounded-xl hover:bg-[#C9A96E] hover:text-[#1E1B2E] transition-all duration-300 shadow-md hover:shadow-[0_8px_24px_rgba(201,169,110,0.3)]">
                  Start Learning
                </button>
              </Link>
              <Link href="/courses">
                <button className="h-[52px] px-[36px] bg-transparent border border-[rgba(30,27,46,0.2)] text-[#1E1B2E] font-sans text-[16px] font-medium rounded-xl hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300">
                  Browse Courses
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
