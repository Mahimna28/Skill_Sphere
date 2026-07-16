"use client";

import { motion } from "framer-motion";
import { SharedHeroSection } from "@/components/landing/SharedHeroSection";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  AITutorDemo,
  CourseCardDemo,
  CourseChatDemo,
  QAForumDemo,
  DirectMessagesDemo,
  LeaderboardDemo,
  InstitutionDemo,
  ParentPortalDemo,
  FeedbackDemo,
  BlogDemo
} from "./FeatureDemos";
import { DemoShowcase } from "@/components/features/DemoShowcase";

gsap.registerPlugin(ScrollTrigger, useGSAP);
const features = [
  {
    category: "AI-POWERED",
    heading: "Your Personal AI Tutor, 24/7",
    description: "Stuck on a concept at 2 AM? Our AI Study Tutor explains anything in simple terms, gives examples, quizzes you, and adapts to your learning style.",
    bullets: [
      "Ask anything — from basic definitions to advanced problem solving",
      "Get step-by-step explanations with real examples",
      "Generate custom quizzes based on your weak areas",
      "Save conversations and revisit them anytime"
    ],
    demo: <AITutorDemo />
  },
  {
    category: "COURSE EXPERIENCE",
    heading: "Video & Quizzes in One Place",
    description: "No more context-switching between YouTube and quiz apps. Watch lessons and test your knowledge — all inside Skill Sphere.",
    bullets: [
      "Structured learning paths with clear milestones",
      "Track progress with visual progress bars",
      "Earn certificates upon course completion",
      "Resume exactly where you left off"
    ],
    demo: <CourseCardDemo />
  },
  {
    category: "COLLABORATION",
    heading: "Learn Together, Never Alone",
    description: "Join real-time chat rooms for every course. Discuss concepts, share resources, and collaborate with peers and instructors in dedicated course channels.",
    bullets: [
      "Live chat rooms for every course and private class",
      "See who's online with presence indicators",
      "Share announcements, questions, and resources",
      "\"Live Room\" badge shows active discussions"
    ],
    demo: <CourseChatDemo />
  },
  {
    category: "COMMUNITY",
    heading: "Ask, Answer, Advance",
    description: "Got a question? The community has answers. Post questions, browse discussions, and build knowledge together with peers and teachers.",
    bullets: [
      "Post questions with rich formatting",
      "Filter by All Questions, My Questions, or Unanswered",
      "Expandable answers with user avatars and timestamps",
      "Teachers and peers can both respond"
    ],
    demo: <QAForumDemo />
  },
  {
    category: "COMMUNICATION",
    heading: "Connect Directly with Anyone",
    description: "Message students, teachers, or administrators privately. Search by username, manage contacts, and keep all your conversations organized.",
    bullets: [
      "Search users by @username across the platform",
      "Contact list with online/offline status",
      "Organized tabs for Contacts, Groups, and Requests",
      "Your unique username for easy discovery"
    ],
    demo: <DirectMessagesDemo />
  },
  {
    category: "MOTIVATION",
    heading: "Compete, Streak, Succeed",
    description: "Turn learning into a game. Build study streaks, earn points, climb the global leaderboard, and track your mastery level across all courses.",
    bullets: [
      "Global leaderboard with rank, score, and streak tracking",
      "Study streaks with fire indicators",
      "Progress bars showing mastery percentage",
      "Institution-based filtering for friendly competition"
    ],
    demo: <LeaderboardDemo />
  },
  {
    category: "FOR ORGANIZATIONS",
    heading: "Institutions, Simplified",
    description: "Schools and universities can create private classes, manage departments, enroll students via email, and monitor progress — all from one dashboard.",
    bullets: [
      "Create and manage departments (CSE, IT, etc.)",
      "Private classes with class codes for easy joining",
      "Direct enlistment — add students/teachers by email",
      "Faculty affiliation with verified member badges",
      "Security protocols and hierarchy rules"
    ],
    demo: <InstitutionDemo />
  },
  {
    category: "FOR FAMILIES",
    heading: "Stay Connected to Their Journey",
    description: "Parents can link their child's account, monitor course progress, track attendance, view teacher feedback, and stay informed — all in real time.",
    bullets: [
      "Link multiple children with email verification",
      "Overview dashboard with courses, grades, attendance, and points",
      "Performance trend charts for visual progress tracking",
      "Upcoming deadlines and recent activity timeline",
      "Downloadable progress reports",
      "Teacher feedback section for direct communication"
    ],
    demo: <ParentPortalDemo />
  },
  {
    category: "IMPROVEMENT",
    heading: "Your Voice Shapes the Platform",
    description: "Found a bug? Have an idea? Submit feedback directly to our team. Choose from Bug Report, Suggestion, or Other — we read every submission.",
    bullets: [
      "Three feedback types: Bug Report, Suggestion, Other",
      "Rich text message input",
      "Submissions reviewed by the administration team",
      "Integrated across all user roles"
    ],
    demo: <FeedbackDemo />
  },
  {
    category: "RESOURCES",
    heading: "Curated Insights for Learners",
    description: "Read articles on AI, web development, career tips, and more. Teachers and admins can publish blogs to share knowledge with the community.",
    bullets: [
      "Browse articles by category (AI & ML, Web Dev, Career, etc.)",
      "Featured essays with author info and read time",
      "Teachers can write and publish blogs from their dashboard",
      "Explore core topics with visual category cards"
    ],
    demo: <BlogDemo />
  }
];

export default function FeaturesPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const mm = gsap.matchMedia();

    // ════════════════════════════════════════════════════════════════════
    // DESKTOP ONLY: 4 distinct animation groups
    // ════════════════════════════════════════════════════════════════════
    mm.add("(min-width: 1024px)", () => {
      const allCards = gsap.utils.toArray<HTMLElement>(".feature-card");

      // ── Hero fades out as first card arrives ──────────────────────────
      if (heroWrapRef.current && allCards.length > 0) {
        gsap.to(heroWrapRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: allCards[0], start: "top 70%", end: "top top", scrub: true },
        });
      }

      // Apply increasing zIndex to ALL cards so subsequent cards scroll over previous ones
      allCards.forEach((card, i) => {
        gsap.set(card, { zIndex: 10 + i * 10 });
      });

      // ── GROUP 1 (cards 0-2): THE STACK ───────────────────────────────
      // Cards pin and layer on top of each other with growing shadows
      const stackCards = allCards.filter((_, i) => i <= 2);
      stackCards.forEach((card, i) => {

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          end: `+=${window.innerHeight}`,
          pin: true,
          pinSpacing: false,
        });

        if (i > 0) {
          gsap.fromTo(card,
            { boxShadow: "0 -40px 80px rgba(30,27,46,0.0)" },
            {
              boxShadow: "0 -20px 60px rgba(30,27,46,0.22)",
              scrollTrigger: {
                trigger: stackCards[i - 1],
                start: "top top",
                end: `+=${window.innerHeight}`,
                scrub: 1,
              },
            }
          );
        }

        // Parallax on demo
        const demo = card.querySelector<HTMLElement>(".feature-demo-block");
        if (demo) {
          gsap.to(demo, {
            y: -55, ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1.2 },
          });
        }

        // Content reveals: fade up stagger
        const trig = { trigger: card, start: "top 85%", toggleActions: "play none none none" };
        const label = card.querySelector<HTMLElement>(".reveal-label");
        const heading = card.querySelector<HTMLElement>(".reveal-heading");
        const desc = card.querySelector<HTMLElement>(".reveal-desc");
        const bullets = card.querySelectorAll<HTMLElement>(".reveal-bullet");
        const demoWrap = card.querySelector<HTMLElement>(".reveal-demo");
        const isLeft = [0,2,4,6,8].includes(i);

        if (label) gsap.from(label, { opacity: 0, y: 15, duration: 0.6, ease: "power2.out", scrollTrigger: trig });
        if (heading) gsap.from(heading, { opacity: 0, y: 25, duration: 0.6, delay: 0.1, ease: "power2.out", scrollTrigger: trig });
        if (desc) gsap.from(desc, { opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: "power2.out", scrollTrigger: trig });
        if (bullets.length) gsap.from(bullets, { opacity: 0, y: 15, duration: 0.5, stagger: 0.08, delay: 0.3, ease: "power2.out", scrollTrigger: trig });
        if (demoWrap) gsap.from(demoWrap, { opacity: 0, x: isLeft ? -40 : 40, duration: 0.7, delay: 0.15, ease: "power2.out", scrollTrigger: trig });
      });

      // ── GROUP 2 (cards 3-4): HEAVY PARALLAX SLIDE ────────────────────
      // No pinning — demo blasts in from the side with strong parallax
      const parallaxCards = allCards.filter((_, i) => i >= 3 && i <= 4);
      parallaxCards.forEach((card, localIdx) => {
        const globalIdx = localIdx + 3;
        const isLeft = globalIdx % 2 === 0;
        const demo = card.querySelector<HTMLElement>(".feature-demo-block");
        const demoWrap = card.querySelector<HTMLElement>(".reveal-demo");
        const label = card.querySelector<HTMLElement>(".reveal-label");
        const heading = card.querySelector<HTMLElement>(".reveal-heading");
        const desc = card.querySelector<HTMLElement>(".reveal-desc");
        const bullets = card.querySelectorAll<HTMLElement>(".reveal-bullet");

        // Heavy side-entry for demo mockup
        if (demoWrap) {
          gsap.from(demoWrap, {
            opacity: 0,
            x: isLeft ? -120 : 120,
            duration: 1.0,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none none" },
          });
        }

        // Demo scrubbed parallax (opposite direction to group 1)
        if (demo) {
          gsap.to(demo, {
            y: 60, ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1.5 },
          });
        }

        // Text: characters cascade in from opposite side
        const textTrig = { trigger: card, start: "top 80%", toggleActions: "play none none none" };
        if (label) gsap.from(label, { opacity: 0, x: isLeft ? 30 : -30, duration: 0.5, ease: "power3.out", scrollTrigger: textTrig });
        if (heading) gsap.from(heading, { opacity: 0, x: isLeft ? 40 : -40, duration: 0.6, delay: 0.1, ease: "power3.out", scrollTrigger: textTrig });
        if (desc) gsap.from(desc, { opacity: 0, x: isLeft ? 30 : -30, duration: 0.6, delay: 0.2, ease: "power3.out", scrollTrigger: textTrig });
        if (bullets.length) gsap.from(bullets, { opacity: 0, x: isLeft ? 20 : -20, duration: 0.5, stagger: 0.07, delay: 0.3, ease: "power3.out", scrollTrigger: textTrig });
      });

      // ── GROUP 3 (cards 5-6): SCALE + BLUR SCRUB ──────────────────────
      // Sections start scaled-down and blurred, scrub clears them into focus
      const scaleCards = allCards.filter((_, i) => i >= 5 && i <= 6);
      scaleCards.forEach((card, localIdx) => {
        const globalIdx = localIdx + 5;
        const isLeft = globalIdx % 2 === 0;
        const demo = card.querySelector<HTMLElement>(".feature-demo-block");
        const demoWrap = card.querySelector<HTMLElement>(".reveal-demo");
        const label = card.querySelector<HTMLElement>(".reveal-label");
        const heading = card.querySelector<HTMLElement>(".reveal-heading");
        const desc = card.querySelector<HTMLElement>(".reveal-desc");
        const bullets = card.querySelectorAll<HTMLElement>(".reveal-bullet");

        // Whole card: scale + blur scrubbed as it enters viewport
        gsap.fromTo(card,
          { scale: 0.92, filter: "blur(8px)" },
          {
            scale: 1, filter: "blur(0px)",
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 90%", end: "top 30%", scrub: 1 },
          }
        );

        // Demo rotates slightly into place
        if (demoWrap) {
          gsap.fromTo(demoWrap,
            { opacity: 0, rotate: isLeft ? -4 : 4, scale: 0.9 },
            {
              opacity: 1, rotate: 0, scale: 1, duration: 0.9, ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 75%", toggleActions: "play none none none" },
            }
          );
        }

        // Demo parallax — moves at a slower rate
        if (demo) {
          gsap.to(demo, {
            y: -40, ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.8 },
          });
        }

        // Text: fade + scale from below
        const textTrig = { trigger: card, start: "top 70%", toggleActions: "play none none none" };
        if (label) gsap.from(label, { opacity: 0, scale: 0.9, duration: 0.5, ease: "back.out(1.5)", scrollTrigger: textTrig });
        if (heading) gsap.from(heading, { opacity: 0, scale: 0.95, y: 20, duration: 0.7, delay: 0.1, ease: "back.out(1.2)", scrollTrigger: textTrig });
        if (desc) gsap.from(desc, { opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: "power2.out", scrollTrigger: textTrig });
        if (bullets.length) gsap.from(bullets, { opacity: 0, y: 12, scale: 0.96, duration: 0.4, stagger: 0.07, delay: 0.3, ease: "power2.out", scrollTrigger: textTrig });
      });

      // ── GROUP 4 (cards 7-9): 3D FOLD / HINGE REVEAL ──────────────────
      // Sections fold down into view using 3D perspective rotation on X-axis
      const foldCards = allCards.filter((_, i) => i >= 7);
      foldCards.forEach((card, localIdx) => {
        const globalIdx = localIdx + 7;
        const isLeft = globalIdx % 2 === 0;
        const demo = card.querySelector<HTMLElement>(".feature-demo-block");
        const demoWrap = card.querySelector<HTMLElement>(".reveal-demo");
        const label = card.querySelector<HTMLElement>(".reveal-label");
        const heading = card.querySelector<HTMLElement>(".reveal-heading");
        const desc = card.querySelector<HTMLElement>(".reveal-desc");
        const bullets = card.querySelectorAll<HTMLElement>(".reveal-bullet");

        // Set perspective on the card for 3D effect
        gsap.set(card, { perspective: 1200 });

        // Entire card hinges down from the top
        gsap.fromTo(card,
          { rotationX: -18, opacity: 0, transformOrigin: "top center" },
          {
            rotationX: 0, opacity: 1,
            duration: 1.0, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
          }
        );

        // Demo folds in from top with a slight Y-axis twist
        if (demoWrap) {
          gsap.fromTo(demoWrap,
            { opacity: 0, rotationY: isLeft ? -12 : 12, rotationX: -8, scale: 0.93, transformOrigin: "center center" },
            {
              opacity: 1, rotationY: 0, rotationX: 0, scale: 1, duration: 1.0, ease: "power3.out", delay: 0.2,
              scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
            }
          );
        }

        // Demo parallax: slow upward drift
        if (demo) {
          gsap.to(demo, {
            y: -35, ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1 },
          });
        }

        // Text: letters fall down from above
        const textTrig = { trigger: card, start: "top 80%", toggleActions: "play none none none" };
        if (label) gsap.from(label, { opacity: 0, y: -15, duration: 0.5, ease: "power2.out", scrollTrigger: textTrig });
        if (heading) gsap.from(heading, { opacity: 0, y: -25, duration: 0.6, delay: 0.1, ease: "power2.out", scrollTrigger: textTrig });
        if (desc) gsap.from(desc, { opacity: 0, y: -20, duration: 0.6, delay: 0.2, ease: "power2.out", scrollTrigger: textTrig });
        if (bullets.length) gsap.from(bullets, { opacity: 0, y: -12, duration: 0.4, stagger: 0.07, delay: 0.3, ease: "power2.out", scrollTrigger: textTrig });
      });

      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    });

    // ── ALL SCREENS: Reveal for Unified Platform section ────────────────
    gsap.utils.toArray<HTMLElement>(".reveal-platform").forEach((el) => {
      gsap.from(el, {
        opacity: 0, y: 30, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      });
    });

    return () => mm.revert();
  }, { scope: mainRef });

  return (
    <div ref={mainRef} className="min-h-screen bg-[#F5F1EB]">
      <main>
        {/* HERO SECTION */}
        <div ref={heroWrapRef} style={{ willChange: "opacity" }}>
          <SharedHeroSection
            title="Discover What's Possible"
            subtitle="Platform Capabilities"
            description="From AI-powered tutoring to gamified progress tracking, Skill Sphere gives you every tool to learn faster, smarter, and together."
            backgroundImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2000"
          />
        </div>

        {/* ALTERNATING FEATURE SECTIONS */}
        <div className="flex flex-col">
          {features.map((feature, index) => {
            const isImageLeft = index % 2 === 0;
            // Group 1 (0-2) needs 100vh for the pin-stacking to work correctly
            const minH = index <= 2 ? "100vh" : "auto";
            return (
              <section
                key={index}
                className="feature-card py-[80px] bg-[#F5F1EB] overflow-hidden"
                style={{ minHeight: minH }}
              >
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  
                  {/* TEXT CONTENT */}
                  <div
                    className={`${isImageLeft ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <span className="reveal-label text-[#C9A96E] text-[12px] font-sans font-medium uppercase tracking-[0.08em] mb-3 block">
                      {feature.category}
                    </span>
                    <h2 className="reveal-heading font-heading text-[36px] text-[#1E1B2E] mb-4 leading-tight">
                      {feature.heading}
                    </h2>
                    <p className="reveal-desc text-[#8E8E93] font-sans text-[16px] leading-[1.7] mb-8">
                      {feature.description}
                    </p>
                    
                    <div className="space-y-4">
                      {feature.bullets.map((bullet, i) => (
                        <div
                          key={i}
                          className="reveal-bullet flex items-start gap-3"
                        >
                          <div className="w-5 h-5 rounded-full bg-[rgba(201,169,110,0.15)] flex items-center justify-center flex-shrink-0 mt-1">
                            <Check className="w-3 h-3 text-[#C9A96E]" />
                          </div>
                          <p className="text-[#1E1B2E] font-sans text-[15px]">{bullet}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* INTERACTIVE DEMO */}
                  <div
                    className={`reveal-demo relative ${isImageLeft ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <div className="feature-demo-block relative rounded-2xl bg-white shadow-[0_32px_64px_rgba(30,27,46,0.08)] border border-[rgba(30,27,46,0.06)] aspect-[4/3] flex flex-col group overflow-hidden">
                      {/* Browser Chrome */}
                      <div className="bg-[#FAFAFA] px-4 py-2.5 flex items-center gap-2 border-b border-[rgba(30,27,46,0.06)] z-20 shrink-0">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                        </div>
                      </div>
                      
                      {/* Demo Container */}
                      <div className="flex-1 bg-[#F5F1EB] overflow-hidden relative">
                        {feature.demo}
                      </div>
                    </div>
                    {/* Decorative element */}
                    <div className={`absolute -z-10 -bottom-6 ${isImageLeft ? '-left-6' : '-right-6'} w-full h-full rounded-2xl bg-[#C9A96E]/10`} />
                  </div>

                </div>
              </section>
            );
          })}
        </div>

        {/* UNIFIED PLATFORM ECOSYSTEM */}
        <UnifiedPlatformSection />

        {/* DEMO SHOWCASE (GSAP PINNED) */}
        <DemoShowcase />

        {/* CTA SECTION */}
        <section className="py-[120px] bg-[#1E1B2E] text-center px-6">
          <div className="max-w-3xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-[36px] text-white mb-4"
            >
              Ready to start learning smarter?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-sans text-[16px] text-[rgba(255,255,255,0.7)] mb-10"
            >
              Join thousands of students, teachers, and institutions on Skill Sphere.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/register" className="w-full sm:w-auto px-8 py-3 bg-[#C9A96E] text-[#1E1B2E] font-sans font-semibold rounded-full hover:bg-[#b5955a] transition-colors flex items-center justify-center gap-2">
                Create Free Account <ArrowRight size={18} />
              </Link>
              <Link href="/courses" className="w-full sm:w-auto px-8 py-3 bg-transparent border border-white text-white font-sans font-medium rounded-full hover:bg-white/10 transition-colors">
                Explore Courses
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

function UnifiedPlatformSection() {
  return (
    <section className="bg-white relative flex items-center justify-center overflow-hidden py-32 lg:py-48">
      <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        
        {/* TEXT SIDE */}
        <div className="reveal-platform flex flex-col justify-center">
          <span className="text-[#C9A96E] text-[12px] font-sans font-medium uppercase tracking-[0.08em] mb-3">Ecosystem</span>
          <h2 className="font-heading text-4xl lg:text-5xl text-[#1E1B2E] mb-6 leading-tight">A Unified Platform</h2>
          <p className="text-[#8E8E93] text-lg max-w-md">Skill Sphere brings everyone together. Students learn, teachers guide, and parents support — all within one cohesive environment.</p>
        </div>

        {/* VISUAL SIDE */}
        <div className="reveal-platform flex items-center justify-center">
          <div className="w-full max-w-md aspect-square relative flex items-center justify-center">
            {/* Outer Ring */}
            <div className="absolute inset-0 border border-[rgba(30,27,46,0.1)] rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-8 border border-[rgba(30,27,46,0.05)] rounded-full animate-[spin_40s_linear_infinite_reverse]" />
            
            {/* Center Logo */}
            <div className="w-24 h-24 bg-[#1E1B2E] rounded-full flex items-center justify-center z-10 shadow-2xl">
              <span className="text-[#C9A96E] font-heading font-bold text-2xl">S</span>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-[10%] left-[20%] bg-white shadow-lg p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">S</div>
                <span className="text-xs font-medium text-[#1E1B2E]">Student</span>
              </div>
              <div className="absolute bottom-[20%] left-[10%] bg-white shadow-lg p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs font-bold">T</div>
                <span className="text-xs font-medium text-[#1E1B2E]">Teacher</span>
              </div>
              <div className="absolute top-[30%] right-[10%] bg-white shadow-lg p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xs font-bold">P</div>
                <span className="text-xs font-medium text-[#1E1B2E]">Parent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
