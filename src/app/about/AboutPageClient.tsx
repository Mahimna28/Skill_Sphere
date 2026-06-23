"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Shield, Zap, Globe, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const appleEase = [0.4, 0, 0.2, 1];

const TEAM_MEMBERS = [
  {
    name: "Mahimna Mistry",
    role: "Project Lead",
    bio: "Former educator turned product strategist. Obsessed with building systems that actually help students learn, not just pass tests.",
    image: "/images/team/mahimna1.jpg",
    email: "cse.230840131049@gmail.com",
    github: "https://github.com/Mahimna28",
    linkedin: "https://www.linkedin.com/in/mahimna-mistry-8a7aa1327/"
  },
  {
    name: "Dev Patel",
    role: "Lead Developer",
    bio: "Full-stack engineer with a passion for clean code and cleaner UX. Believes the best technology is the kind you don't notice.",
    image: "/images/team/dev.png",
    email: "cse.230840131066@gmail.com",
    github: "https://github.com/Dev-Patel1610", // ADD GITHUB LINK HERE
    linkedin: "www.linkedin.com/in/dev-patel-a41853344" // ADD LINKEDIN LINK HERE
  },
  {
    name: "Swayam Chaudhari",
    role: "AI Specialist",
    bio: "Machine learning researcher focused on natural language understanding. Builds the brain behind our Socratic AI tutor.",
    image: "/images/team/swayam.jpg",
    email: "cse.230840131015@gmail.com",
    github: "https://github.com/SwamPy-bot",
    linkedin: "https://www.linkedin.com/in/swayam-chaudhari-b85b66347?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  {
    name: "Jal Lad",
    role: "UI/UX Designer",
    bio: "Design thinker who believes beauty and function are inseparable. Crafts every pixel to reduce cognitive load and increase delight.",
    image: "/images/team/jal.jpeg",
    email: "cse.230840131039@gmail.com",
    github: "https://github.com/Jallad-19?tab=stars",
    linkedin: "#" // ADD LINKEDIN LINK HERE
  }
];

const MILESTONES = [
  { year: "2024", title: "The Idea", desc: "For our GTU DE subject project, we decided on the idea and built the frontend." },
  { year: "2025", title: "Building the Engine", desc: "Developed the backend infrastructure to power the platform." },
  { year: "2026", title: "Launch & Deploy", desc: "Successfully deployed the complete project to production." }
];

const VALUES = [
  { icon: Heart, title: "Empathy First", desc: "We design for the frustrated student at 2 AM, not just the expert." },
  { icon: Shield, title: "Academic Integrity", desc: "Our AI is built to guide and teach, never to simply do the work for you." },
  { icon: Zap, title: "Continuous Iteration", desc: "We update our curriculum and platform weekly based on real student data." },
  { icon: Globe, title: "Accessible Excellence", desc: "World-class education should not be bound by geography or background." }
];

export default function AboutPageClient() {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F1EB] overflow-hidden">

      {/* 1. FOUNDER'S LETTER */}
      <section className="pt-[210px] pb-[100px] bg-[#1E1B2E]">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E] mb-6 block">
              Our Story
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: appleEase }}
            className="font-heading font-bold text-[28px] md:text-[48px] text-white leading-[0.95] mb-6"
          >
            Built by educators, shaped by students.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
            className="font-sans text-[18px] text-[#F5F1EB] leading-[1.6] opacity-90"
          >
            We are on a mission to bring the warmth, patience, and rigour of a dedicated tutor to anyone with an internet connection.
          </motion.p>
        </div>
      </section>

      {/* 2. MANIFESTO SECTION */}
      <section className="py-[80px] bg-[#1E1B2E] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: appleEase }}
            className="text-center"
          >
            <h2 className="font-heading italic text-[24px] md:text-[28px] text-[#F5F1EB] leading-[1.4] max-w-[700px] mb-8">
              "Education shouldn't just be about broadcasting information. It should be a dialogue that respects the pace and curiosity of the learner."
            </h2>
            <p className="font-sans text-[14px] text-[#C9A96E] uppercase tracking-wider">
              — The Skill Sphere Founding Team
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. ORIGIN STORY */}
      <section className="py-[160px] bg-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-[60px] lg:gap-[100px]">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: appleEase }}
              className="w-full lg:w-1/2"
            >
              <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E] mb-6 block">
                The Beginning
              </span>
              <h2 className="font-heading text-[28px] text-[#1E1B2E] leading-[1.2] mb-8">
                For decades, online education meant watching a video and taking a multiple choice test.
              </h2>
              <div className="space-y-6">
                <p className="font-sans text-[17px] text-[#8E8E93] leading-[1.7]">
                  We knew there had to be a better way — a way to leverage modern technology to recreate the intimate, responsive environment of a 1-on-1 tutorial. Skill Sphere was founded by a small team of frustrated educators looking for a better way to teach online.
                </p>
                <p className="font-sans text-[17px] text-[#8E8E93] leading-[1.7]">
                  Today, thousands of students, teachers, and institutions trust Skill Sphere to make education more personal, more connected, and more human.
                </p>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
              className="w-full lg:w-1/2 relative h-[400px] lg:h-[600px] rounded-[16px] overflow-hidden shadow-[0_8px_32px_rgba(30,27,46,0.08)]"
            >
              <motion.div style={{ y: yParallax }} className="absolute inset-0 -top-[100px] -bottom-[100px]">
                <Image
                  src="/images/about-origin.jpg"
                  alt="Students collaborating"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. TIMELINE */}
      <section className="py-[120px] bg-[#F5F1EB] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-24">
            <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E] mb-4 block">
              Our Journey
            </span>
            <h2 className="font-heading text-[36px] text-[#1E1B2E]">
              How we got here.
            </h2>
          </div>

          <div className="relative">
            {/* Desktop Horizontal Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: appleEase }}
              className="hidden md:block absolute top-[18px] left-0 right-0 h-[1px] bg-[rgba(30,27,46,0.08)] origin-left"
            />
            {/* Mobile Vertical Line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: appleEase }}
              className="md:hidden absolute left-[5.5px] top-0 bottom-0 w-[1px] bg-[rgba(30,27,46,0.08)] origin-top"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
              {MILESTONES.map((milestone, i) => (
                <div key={i} className="flex md:flex-col gap-6 md:gap-0">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.2 + 0.3, type: "spring" }}
                    className="flex flex-col items-center shrink-0 md:mb-6"
                  >
                    <div className="font-heading text-[24px] text-[#1E1B2E] leading-none mb-3 hidden md:block">
                      {milestone.year}
                    </div>
                    <div className="w-3 h-3 rounded-full bg-[#C9A96E] ring-4 ring-[#F5F1EB] md:mb-0 mb-auto mt-1 md:mt-0" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.2 + 0.5, ease: appleEase }}
                    className="flex flex-col md:items-center text-left md:text-center mt-[-4px] md:mt-0"
                  >
                    <div className="font-heading text-[24px] text-[#1E1B2E] leading-none mb-2 md:hidden">
                      {milestone.year}
                    </div>
                    <h3 className="font-sans text-[16px] text-[#1E1B2E] font-bold mb-2">
                      {milestone.title}
                    </h3>
                    <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.6] max-w-[200px]">
                      {milestone.desc}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE TEAM */}
      <section className="py-[160px] bg-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-[80px]">
            <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E] mb-4 block">
              The Brains Behind
            </span>
            <h2 className="font-heading text-[42px] text-[#1E1B2E] mb-6">
              Meet the team.
            </h2>
            <p className="font-sans text-[16px] text-[#8E8E93] max-w-[500px] mx-auto leading-[1.6]">
              A collective of academics, engineers, and designers dedicated to the future of learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: appleEase }}
              >
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(30,27,46,0.08)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white rounded-[16px] overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(30,27,46,0.04)] group"
                >
                  <div className="w-full aspect-square relative overflow-hidden bg-[#1E1B2E]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                    />
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="font-heading text-[20px] text-[#1E1B2E] leading-none">
                      {member.name}
                    </h3>
                    <span className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#C9A96E] mt-2 block">
                      {member.role}
                    </span>
                    <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.6] mt-4 mb-6 line-clamp-3">
                      {member.bio}
                    </p>

                    <div className="mt-auto flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-[#8E8E93] font-sans text-[13px]">
                        <Mail size={14} />
                        <a href={`mailto:${member.email}`} className="hover:text-[#C9A96E] transition-colors">{member.email}</a>
                      </div>
                      <div className="flex items-center gap-3 border-t border-[rgba(30,27,46,0.06)] pt-4">
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#8E8E93] hover:text-[#C9A96E] transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                        </a>
                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-[#8E8E93] hover:text-[#C9A96E] transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CORE VALUES */}
      <section className="py-[160px] bg-[#1E1B2E]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-[80px]">
            <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E] mb-4 block">
              What Drives Us
            </span>
            <h2 className="font-heading text-[36px] text-white">
              Our values.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: appleEase }}
                  className="flex flex-col items-center text-center p-6"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 + 0.2, type: "spring" }}
                  >
                    <Icon size={48} className="text-[#C9A96E] mb-4" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="font-heading text-[20px] text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="font-sans text-[15px] text-[#F5F1EB] leading-[1.6] opacity-90 max-w-[280px]">
                    {value.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-[160px] bg-[#F5F1EB] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <h2 className="font-heading font-bold text-[36px] text-[#1E1B2E] mb-4">
              Join us in redefining education.
            </h2>
            <p className="font-sans text-[16px] text-[#8E8E93] mb-10 leading-[1.6]">
              We're always looking for passionate educators, engineers, and designers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[16px] rounded-full px-10 py-4 shadow-[0_4px_14px_rgba(201,169,110,0.2)]"
              >
                View Open Roles
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: "#1E1B2E", color: "#FFFFFF" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-transparent border border-[#1E1B2E] text-[#1E1B2E] font-sans font-medium text-[16px] rounded-full px-10 py-4 transition-colors"
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
