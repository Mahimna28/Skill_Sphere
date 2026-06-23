"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Sparkles, Users, Award, ArrowRight, ChevronDown, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { StatsBar } from "./StatsBar";

// ---------------------------------------------------------
// Easing
// ---------------------------------------------------------
const appleEase = [0.4, 0, 0.2, 1];

// ---------------------------------------------------------
// Testimonials (Client Component embedded for simplicity)
// ---------------------------------------------------------
const testimonials = [
  {
    quote: "Skill Sphere transformed my approach to full-stack development. The AI tutor feels like having a personal mentor.",
    author: "Elena Rodriguez",
    course: "Full-Stack Engineering",
  },
  {
    quote: "The collaborative tools inside the courses made learning data science so much more engaging than watching static videos.",
    author: "David Chen",
    course: "Data Science Fundamentals",
  },
  {
    quote: "I landed my first junior role exactly three months after completing the UI/UX track. Highly recommended.",
    author: "Sarah Jenkins",
    course: "UI/UX Design Principles",
  },
];

function TestimonialTheater() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <div 
      className="relative max-w-4xl mx-auto mt-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setTimeout(() => setIsHovered(false), 3000); // Resume 3s after leave
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[240px] font-heading font-black text-[#C9A96E] opacity-5 select-none pointer-events-none leading-none mt-[-40px]">
        &ldquo;
      </div>
      
      <div className="min-h-[280px] flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: appleEase }}
            className="text-center"
          >
            <p className="font-heading italic text-[#F5F1EB] text-2xl md:text-3xl leading-relaxed max-w-[640px] mx-auto mb-10">
              "{testimonials[index].quote}"
            </p>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-[#C9A96E] p-0.5 mb-4 overflow-hidden bg-white/10">
                <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center text-[#C9A96E]">
                  <Users size={24} />
                </div>
              </div>
              <p className="font-sans font-medium text-white mb-1">{testimonials[index].author}</p>
              <p className="font-sans text-xs text-[#C9A96E] uppercase tracking-[0.1em] mb-3">{testimonials[index].course}</p>
              <div className="flex gap-1 text-[#C9A96E]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-3 mt-12">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors duration-300",
              i === index ? "bg-[#C9A96E]" : "bg-white/20 hover:bg-white/40"
            )}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Main Page Client
// ---------------------------------------------------------
export function LandingPageClient({ dbCourses, stats }: { dbCourses: any[], stats: { userCount: number, courseCount: number, institutionCount: number, completionCount: number } }) {
  const { scrollY } = useScroll();
  
  // Parallax for Story section
  const storyRef = useRef(null);
  const { scrollYProgress: storyScroll } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"]
  });
  const storyY = useTransform(storyScroll, [0, 1], ["-10%", "10%"]);

  const features = [
    {
      icon: BookOpen,
      title: "Personalised Courses",
      desc: "Structured paths with modules and interactive lessons that adapt perfectly to your unique pace and busy schedule.",
    },
    {
      icon: Sparkles,
      title: "AI Study Tutor",
      desc: "Get 24/7 academic help from our integrated AI assistant to explain complex topics and summarize lessons instantly.",
    },
    {
      icon: Users,
      title: "Real-Time Collaboration",
      desc: "Dedicated course chat rooms. Collaborate with peers, share resources, and learn together in real-time.",
    },
    {
      icon: Award,
      title: "Recognised Achievement",
      desc: "Earn certificates for every course you master. Compete on global leaderboards and showcase your expertise.",
    },
  ];

  return (
    <div className="flex flex-col bg-[#F5F1EB] overflow-hidden">
      
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center bg-[#1E1B2E] overflow-hidden">
        {/* Ken Burns Image Background */}
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
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
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

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
            className="font-heading font-bold text-[40px] md:text-[72px] lg:text-[96px] text-white leading-[0.95] mb-8 max-w-[1000px]"
          >
            Education, crafted for how you think.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: appleEase }}
            className="font-sans text-[17px] md:text-[20px] leading-[1.5] text-[#F5F1EB] mb-12 max-w-[560px]"
          >
            Unlock your potential with a premium learning platform designed for role-based education and real-time collaboration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: appleEase }}
          >
            <Link href="/courses">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[17px] rounded-full px-8 py-4 shadow-[0_4px_14px_rgba(201,169,110,0.4)] hover:shadow-[0_6px_20px_rgba(201,169,110,0.6)]"
              >
                Explore Courses
              </motion.button>
            </Link>
          </motion.div>
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

      {/* 2. FLOATING FEATURES */}
      <section className="py-[160px] bg-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: appleEase }}
            className="text-center mb-[100px]"
          >
            <h2 className="font-sans text-[12px] uppercase tracking-[0.2em] text-[#C9A96E] mb-6">
              Why Skill Sphere
            </h2>
            <h3 className="font-heading text-[36px] md:text-[48px] text-[#1E1B2E] max-w-[700px] mx-auto leading-tight">
              Learning that adapts to you.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: appleEase }}
                >
                  <motion.div 
                    whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(30,27,46,0.12)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white rounded-[16px] p-10 flex flex-col items-center text-center h-full shadow-[0_4px_24px_rgba(30,27,46,0.08)] group"
                  >
                    <motion.div 
                      className="w-14 h-14 rounded-full bg-[#C9A96E] flex items-center justify-center mb-8 text-[#1E1B2E]"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon size={24} />
                    </motion.div>
                    <h4 className="font-heading text-[24px] text-[#1E1B2E] mb-4">
                      {f.title}
                    </h4>
                    <p className="font-sans text-[16px] text-[#8E8E93] leading-[1.5] max-w-[280px] mb-8 flex-1">
                      {f.desc}
                    </p>
                    <Link href="/features" className="inline-flex items-center text-[#C9A96E] font-sans text-[15px] font-medium transition-colors hover:text-[#1E1B2E]">
                      Learn more <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>



      {/* 4. STATS BAR */}
      <StatsBar statsData={stats} />

      {/* 5. OUR STORY (ASYMMETRIC EDITORIAL) */}
      <section ref={storyRef} className="bg-[#F5F1EB] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[800px]">
          {/* Parallax Image Left */}
          <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto relative overflow-hidden">
            <motion.div 
              style={{ y: storyY }}
              className="absolute inset-0 scale-[1.2]"
            >
              <Image 
                src="/images/story-students.jpg" 
                alt="Students collaborating" 
                fill 
                className="object-cover"
              />
            </motion.div>
          </div>
          
          {/* Content Right */}
          <div className="w-full lg:w-1/2 flex items-center p-8 md:p-[120px]">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: appleEase }}
            >
              <h2 className="font-sans text-[12px] uppercase tracking-[0.2em] text-[#C9A96E] mb-6">
                Our Story
              </h2>
              <h3 className="font-heading text-[36px] md:text-[40px] text-[#1E1B2E] mb-8 leading-[1.1]">
                Built by educators, shaped by students.
              </h3>
              <div className="font-sans text-[17px] text-[#8E8E93] leading-[1.7] max-w-[480px] space-y-6 mb-12">
                <p>
                  We founded Skill Sphere with a simple belief: the tools we use to learn should be as smart, intuitive, and beautiful as the best tools we use to work.
                </p>
                <p>
                  By seamlessly integrating AI study assistants, real-time communication, and role-based insights, we've crafted an environment where students don't just consume information—they actively engage with it.
                </p>
              </div>
              <Link href="/about" className="group inline-flex items-center text-[#C9A96E] font-sans text-[16px] font-medium relative overflow-hidden pb-1">
                Discover our approach 
                <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C9A96E] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 apple-ease" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED COURSES (PRODUCT SHOWCASE) */}
      <section className="py-[160px] bg-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: appleEase }}
            className="mb-[80px]"
          >
            <h2 className="font-sans text-[12px] uppercase tracking-[0.2em] text-[#C9A96E] mb-6">
              Featured
            </h2>
            <h3 className="font-heading text-[36px] md:text-[42px] text-[#1E1B2E]">
              Start with our most popular.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dbCourses.map((c: any, i: number) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.2, ease: appleEase }}
              >
                <Link href={`/courses/${c.id}`} className="block h-full group">
                  <motion.div 
                    whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(30,27,46,0.12)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white rounded-[16px] overflow-hidden h-full flex flex-col shadow-[0_8px_32px_rgba(30,27,46,0.1)]"
                  >
                    {/* Image Top */}
                    <div className="w-full aspect-[16/9] relative overflow-hidden bg-[#1E1B2E]">
                      {c.thumbnail ? (
                        <Image 
                          src={c.thumbnail} 
                          alt={c.title} 
                          fill 
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-30 transition-transform duration-700 ease-out group-hover:scale-105">
                          <BookOpen size={48} className="text-white" />
                        </div>
                      )}
                    </div>
                    {/* Content Bottom */}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="mb-4">
                        <span className="inline-block bg-[#F5F1EB] text-[#C9A96E] px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-medium">
                          {c.subject}
                        </span>
                      </div>
                      <h4 className="font-heading text-[22px] text-[#1E1B2E] mb-3 leading-snug">
                        {c.title}
                      </h4>
                      <p className="font-sans text-[15px] text-[#8E8E93] line-clamp-2 mb-6">
                        by {c.teacher?.name || "Expert Instructor"}
                      </p>
                      <div className="mt-auto text-[#C9A96E] font-sans text-[14px] font-medium flex items-center transition-colors group-hover:text-[#1E1B2E]">
                        View Course <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-[200px] bg-[#1E1B2E]">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="text-center mb-[80px]"
          >
            <h2 className="font-heading text-[48px] text-white mb-6">
              Start your journey today.
            </h2>
            <p className="font-sans text-[16px] text-[#F5F1EB] mb-10 font-light opacity-90">
              Join our community of educators and learners receiving our weekly insights.
            </p>
          </motion.div>

          <form className="max-w-2xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-8">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
                className="flex-1 relative"
              >
                <input 
                  type="text" 
                  placeholder="Name" 
                  className="w-full bg-transparent border-0 border-b border-white/30 px-0 py-3 text-white placeholder-white/50 focus:ring-0 focus:outline-none focus:border-[#C9A96E] transition-colors duration-300 font-sans text-[16px]"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: appleEase }}
                className="flex-1 relative"
              >
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full bg-transparent border-0 border-b border-white/30 px-0 py-3 text-white placeholder-white/50 focus:ring-0 focus:outline-none focus:border-[#C9A96E] transition-colors duration-300 font-sans text-[16px]"
                />
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
            >
              <textarea 
                placeholder="Message" 
                rows={1}
                className="w-full bg-transparent border-0 border-b border-white/30 px-0 py-3 text-white placeholder-white/50 focus:ring-0 focus:outline-none focus:border-[#C9A96E] transition-colors duration-300 font-sans text-[16px] resize-none"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
              className="mt-8 flex flex-col items-center gap-6"
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                type="button"
                className="bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[17px] rounded-full px-10 py-4 w-full md:w-auto hover:bg-[#b0935d] transition-colors"
              >
                Send Message
              </motion.button>
              
              <Link href="/register" className="text-white/70 hover:text-white font-sans text-[15px] transition-colors">
                Or get started free &rarr;
              </Link>
            </motion.div>
          </form>
        </div>
      </section>

    </div>
  );
}
