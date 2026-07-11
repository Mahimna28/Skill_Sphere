"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Mail, Globe, Link as LinkIcon, ChevronDown, MessageCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

import { useReducedMotion, useIsMobile } from "@/lib/animations";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideUp } from "@/components/animations/SlideUp";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";

const ARTICLE = {
  slug: "future-of-ai-education",
  title: "The Future of AI in Modern Education",
  category: "AI & ML",
  author: {
    name: "Swayam Chaudhari",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    bio: "Founder & CEO at Skill Sphere. Passionate about democratizing education through technology.",
    social: { twitter: "#", linkedin: "#" }
  },
  date: "Oct 24, 2026",
  readTime: "8 min read",
  views: "1.2K",
  comments: 34,
  coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=2000",
  tags: ["Artificial Intelligence", "EdTech", "Future of Work", "Machine Learning"]
};

const RELATED_POSTS = [
  {
    slug: "mastering-react-hooks",
    title: "Mastering React Hooks in 2026",
    category: "Web Dev",
    date: "Oct 20, 2026",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800"
  },
  {
    slug: "design-system-basics",
    title: "Building Scalable Design Systems",
    category: "Design",
    date: "Oct 18, 2026",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800"
  },
  {
    slug: "career-transition-tech",
    title: "How to Transition into Tech Without a CS Degree",
    category: "Career",
    date: "Oct 15, 2026",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
  }
];

export default function BlogPostClient() {
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const articleRef = useRef<HTMLDivElement>(null);
  const [activeHeading, setActiveHeading] = useState("");
  const [tocOpen, setTocOpen] = useState(false);

  const getStaggerDelay = (desktopDelay: number) => isMobile ? desktopDelay * 0.5 : desktopDelay;

  // 1. READING PROGRESS BAR
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Highlight active TOC item
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    const headings = document.querySelectorAll("h2[id]");
    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#F5F1EB] min-h-screen pb-[80px]">
      
      {/* Progress Bar */}
      {!shouldReduceMotion && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-[#C9A96E] origin-left z-50"
          style={{ scaleX }}
        />
      )}

      {/* 2. HERO AREA */}
      <section className="relative w-full aspect-[21/9] min-h-[400px] max-h-[700px] rounded-b-2xl overflow-hidden bg-[#1E1B2E]">
        <Image src={ARTICLE.coverImage} alt={ARTICLE.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(30,27,46,0.8)] via-[rgba(30,27,46,0.4)] to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-[40px] max-w-7xl mx-auto">
          <FadeIn delay={0.2}>
            <span className="inline-flex items-center px-[12px] py-[4px] rounded-full text-[12px] font-sans font-medium bg-[rgba(201,169,110,0.2)] text-[#C9A96E] mb-[12px]">
              {ARTICLE.category}
            </span>
            <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-[1.2] max-w-[700px]">
              {ARTICLE.title}
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-row flex-wrap gap-[16px] items-center mt-[16px]">
              <div className="flex items-center gap-[8px]">
                <div className="w-[36px] h-[36px] relative rounded-full overflow-hidden bg-white/10">
                  <Image src={ARTICLE.author.avatar} alt={ARTICLE.author.name} fill className="object-cover" />
                </div>
                <span className="font-sans text-[14px] text-white">By {ARTICLE.author.name}</span>
              </div>
              <span className="text-white/30 hidden sm:inline">•</span>
              <span className="font-sans text-[13px] text-[rgba(255,255,255,0.7)]">{ARTICLE.date}</span>
              <span className="text-white/30 hidden sm:inline">•</span>
              <span className="font-sans text-[13px] text-[rgba(255,255,255,0.7)]">{ARTICLE.readTime}</span>
              <span className="text-white/30 hidden sm:inline">•</span>
              <div className="flex items-center gap-[4px] font-sans text-[13px] text-[rgba(255,255,255,0.7)]">
                <Eye size={14} /> {ARTICLE.views}
              </div>
              <div className="flex items-center gap-[4px] font-sans text-[13px] text-[rgba(255,255,255,0.7)]">
                <MessageCircle size={14} /> {ARTICLE.comments}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* MAIN CONTENT WRAPPER */}
      <div className="max-w-[1200px] mx-auto px-[20px] md:px-[32px] relative flex flex-col lg:flex-row gap-[40px]">
        
        {/* 3. TABLE OF CONTENTS (Sticky Sidebar) */}
        <aside className={cn(
          "lg:w-[280px] shrink-0 mt-[40px] lg:mt-[100px]",
          "lg:sticky lg:top-[100px] lg:self-start lg:block z-10",
          !isMobile ? "block" : ""
        )}>
          {isMobile ? (
            <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.05)] overflow-hidden">
              <button 
                onClick={() => setTocOpen(!tocOpen)}
                className="w-full flex items-center justify-between p-[16px] font-sans font-medium text-[14px] text-[#1E1B2E]"
              >
                Table of Contents
                <ChevronDown size={16} className={cn("transition-transform", tocOpen && "rotate-180")} />
              </button>
              {tocOpen && (
                <div className="px-[16px] pb-[16px] flex flex-col gap-[12px]">
                  <a href="#introduction" onClick={() => setTocOpen(false)} className={cn("font-sans text-[13px] transition-colors", activeHeading === "introduction" ? "text-[#C9A96E]" : "text-[#8E8E93]")}>Introduction</a>
                  <a href="#the-rise-of-ai" onClick={() => setTocOpen(false)} className={cn("font-sans text-[13px] transition-colors", activeHeading === "the-rise-of-ai" ? "text-[#C9A96E]" : "text-[#8E8E93]")}>The Rise of AI</a>
                  <a href="#adaptive-learning" onClick={() => setTocOpen(false)} className={cn("font-sans text-[13px] transition-colors", activeHeading === "adaptive-learning" ? "text-[#C9A96E]" : "text-[#8E8E93]")}>Adaptive Learning</a>
                  <a href="#conclusion" onClick={() => setTocOpen(false)} className={cn("font-sans text-[13px] transition-colors", activeHeading === "conclusion" ? "text-[#C9A96E]" : "text-[#8E8E93]")}>Conclusion</a>
                </div>
              )}
            </div>
          ) : (
            <SlideUp y={20} delay={0.4}>
              <h4 className="font-sans text-[14px] text-[#1E1B2E] font-bold uppercase tracking-wider mb-[16px]">Contents</h4>
              <nav className="flex flex-col border-l border-[rgba(30,27,46,0.1)]">
                {[
                  { id: "introduction", label: "Introduction" },
                  { id: "the-rise-of-ai", label: "The Rise of AI in EdTech" },
                  { id: "adaptive-learning", label: "What is Adaptive Learning?" },
                  { id: "conclusion", label: "Conclusion & Future Outlook" }
                ].map((item) => (
                  <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    className={cn(
                      "font-sans text-[13px] py-[8px] pl-[16px] border-l-[2px] -ml-[1px] transition-colors hover:text-[#C9A96E]",
                      activeHeading === item.id 
                        ? "text-[#C9A96E] border-[#C9A96E]" 
                        : "text-[#8E8E93] border-transparent"
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </SlideUp>
          )}
        </aside>

        {/* ARTICLE BODY */}
        <div className="flex-1 max-w-[720px] mx-auto pt-[60px]" ref={articleRef}>
          <FadeIn delay={0.2}>
            
            <h2 id="introduction" className="font-heading text-[28px] text-[#1E1B2E] mt-[48px] mb-[20px] pt-8">
              Introduction
            </h2>
            <p className="font-sans text-[16px] text-[#8E8E93] leading-[1.8] mb-[16px]">
              Artificial Intelligence is no longer just a buzzword restricted to tech circles. From generating realistic images to writing sophisticated code, AI has permeated nearly every industry. But perhaps one of the most exciting frontiers for AI is <strong className="text-[#1E1B2E] font-semibold">education</strong>.
            </p>

            <blockquote className="border-l-[4px] border-[#C9A96E] bg-[rgba(201,169,110,0.06)] p-[20px_24px] font-sans text-[16px] italic text-[#1E1B2E] my-[32px] rounded-r-lg">
              "The beautiful thing about learning is that nobody can take it away from you. With AI, we can ensure everyone has access to that learning."
            </blockquote>

            <h2 id="the-rise-of-ai" className="font-heading text-[28px] text-[#1E1B2E] mt-[48px] mb-[20px] pt-8">
              The Rise of AI in EdTech
            </h2>
            <p className="font-sans text-[16px] text-[#8E8E93] leading-[1.8] mb-[16px]">
              Over the last decade, we've seen a massive shift towards online learning. However, traditional online courses often suffer from high dropout rates because they lack personalization. AI is changing this by introducing <a href="#" className="text-[#C9A96E] hover:underline">intelligent tutoring systems</a> that can analyze a student's performance in real-time.
            </p>

            <h3 className="font-heading text-[22px] text-[#1E1B2E] mt-[36px] mb-[16px]">
              Key Benefits
            </h3>
            <ul className="list-disc pl-[24px] font-sans text-[16px] text-[#8E8E93] leading-[1.8] mb-[16px] flex flex-col gap-[8px]">
              <li>24/7 Availability for answering questions and providing guidance.</li>
              <li>Personalized learning paths that adapt to the student's pace.</li>
              <li>Instant feedback on assignments and coding exercises.</li>
            </ul>

            <div className="w-full relative aspect-[16/9] mt-[32px] mb-[8px] rounded-xl overflow-hidden bg-[#1E1B2E]">
              <Image src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=450&fit=crop" alt="Students learning together" fill className="object-cover" />
            </div>
            <p className="font-sans text-[13px] text-[#8E8E93] italic text-center mt-[8px] mb-[32px]">
              Students collaborating in a modern, AI-enhanced learning environment.
            </p>

            <h2 id="adaptive-learning" className="font-heading text-[28px] text-[#1E1B2E] mt-[48px] mb-[20px] pt-8">
              What is Adaptive Learning?
            </h2>
            <p className="font-sans text-[16px] text-[#8E8E93] leading-[1.8] mb-[16px]">
              Adaptive learning is an educational method which uses computer algorithms as well as artificial intelligence to orchestrate the interaction with the learner and deliver customized resources and learning activities.
            </p>

            <div className="bg-[#1E1B2E] rounded-xl p-[20px] overflow-x-auto my-[32px]">
              <pre className="font-mono text-[13px] text-white/90">
                <code>{`// Example of a simple learning path algorithm
function getNextLesson(studentProfile) {
  if (studentProfile.score < 70) {
    return generateReviewMaterials(studentProfile.weaknesses);
  }
  
  return fetchNextModule(studentProfile.currentLevel);
}`}</code>
              </pre>
            </div>

            <h2 id="conclusion" className="font-heading text-[28px] text-[#1E1B2E] mt-[48px] mb-[20px] pt-8">
              Conclusion & Future Outlook
            </h2>
            <p className="font-sans text-[16px] text-[#8E8E93] leading-[1.8] mb-[16px]">
              The integration of AI in education is still in its early stages. As natural language processing models become more sophisticated, we can expect AI tutors to become indistinguishable from human mentors, providing empathetic, highly accurate, and tailored support to learners across the globe.
            </p>

            {/* 4. TAGS */}
            <div className="flex flex-row flex-wrap gap-[8px] mt-[40px] pt-[24px] border-t border-[rgba(30,27,46,0.1)]">
              {ARTICLE.tags.map((tag) => (
                <span key={tag} className="bg-[rgba(201,169,110,0.1)] text-[#C9A96E] font-sans text-[12px] px-[14px] py-[6px] rounded-full hover:bg-[rgba(201,169,110,0.2)] transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>

            {/* 5. AUTHOR BOX */}
            <SlideUp y={20}>
              <div className="bg-white rounded-xl p-[24px] mt-[40px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-row gap-[16px] items-center">
                <div className="w-[56px] h-[56px] relative rounded-full overflow-hidden shrink-0 bg-[#1E1B2E]">
                  <Image src={ARTICLE.author.avatar} alt={ARTICLE.author.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="font-heading text-[18px] text-[#1E1B2E]">{ARTICLE.author.name}</h4>
                  <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.6] mt-[4px]">
                    {ARTICLE.author.bio}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-[8px] shrink-0 ml-auto">
                  <a href={ARTICLE.author.social.twitter} className="w-[32px] h-[32px] rounded-full bg-[rgba(30,27,46,0.04)] flex items-center justify-center text-[#8E8E93] hover:text-[#C9A96E] hover:bg-[rgba(201,169,110,0.1)] transition-colors">
                    <Globe size={14} />
                  </a>
                  <a href={ARTICLE.author.social.linkedin} className="w-[32px] h-[32px] rounded-full bg-[rgba(30,27,46,0.04)] flex items-center justify-center text-[#8E8E93] hover:text-[#C9A96E] hover:bg-[rgba(201,169,110,0.1)] transition-colors">
                    <Mail size={14} />
                  </a>
                  <button className="w-[32px] h-[32px] rounded-full bg-[rgba(30,27,46,0.04)] flex items-center justify-center text-[#8E8E93] hover:text-[#C9A96E] hover:bg-[rgba(201,169,110,0.1)] transition-colors">
                    <LinkIcon size={14} />
                  </button>
                </div>
              </div>
            </SlideUp>

          </FadeIn>
        </div>
      </div>

      {/* 6. RELATED ARTICLES */}
      <section className="px-[32px] py-[60px] max-w-[1200px] mx-auto w-full mt-[20px]">
        <FadeIn>
          <h2 className="font-heading text-[24px] text-[#1E1B2E] mb-[24px]">You may also like</h2>
        </FadeIn>
        
        <StaggerContainer staggerDelay={getStaggerDelay(0.15)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {RELATED_POSTS.map((post) => (
            <StaggerItem key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="block h-full group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)] h-full flex flex-col hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all duration-300">
                  <div className="w-full aspect-[16/10] relative overflow-hidden bg-[#1E1B2E]">
                    <motion.div
                      className="w-full h-full relative"
                      whileHover={!isMobile && !shouldReduceMotion ? { scale: 1.05 } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <Image src={post.image} alt={post.title} fill className="object-cover" />
                    </motion.div>
                  </div>
                  <div className="p-[20px] flex flex-col flex-1">
                    <h3 className="font-heading text-[16px] text-[#1E1B2E] line-clamp-2 group-hover:text-[#C9A96E] transition-colors">
                      {post.title}
                    </h3>
                    <div className="mt-auto pt-[12px] flex items-center justify-between">
                      <span className="font-sans text-[12px] text-[#C9A96E] uppercase font-medium">{post.category}</span>
                      <span className="font-sans text-[12px] text-[#8E8E93]">{post.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 7. CTA BANNER */}
      <section className="px-[32px] pb-[60px] max-w-[800px] mx-auto w-full">
        <SlideUp y={30}>
          <div className="bg-[#1E1B2E] rounded-2xl p-[48px] text-center shadow-xl">
            <h2 className="font-heading text-[24px] text-white">Enjoyed this article?</h2>
            <p className="font-sans text-[15px] text-[rgba(255,255,255,0.7)] mt-[8px]">
              Keep learning with our courses and AI tutor.
            </p>
            
            <div className="mt-[24px] flex flex-col sm:flex-row items-center justify-center gap-[12px]">
              <Link href="/courses">
                <button className="w-full sm:w-auto h-[44px] px-[24px] bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium rounded-xl hover:scale-[1.02] transition-transform">
                  Explore Courses
                </button>
              </Link>
              <Link href="/dashboard/student">
                <button className="w-full sm:w-auto h-[44px] px-[24px] bg-transparent border border-white/20 text-white font-sans font-medium rounded-xl hover:bg-white/10 transition-colors">
                  Ask AI Tutor
                </button>
              </Link>
              <Link href="/blog">
                <button className="w-full sm:w-auto h-[44px] px-[24px] bg-transparent border border-white/20 text-white font-sans font-medium rounded-xl hover:bg-white/10 transition-colors">
                  Join Community
                </button>
              </Link>
            </div>
          </div>
        </SlideUp>
      </section>

    </div>
  );
}
