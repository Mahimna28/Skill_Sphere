"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, TrendingUp, Check, CheckCircle, XCircle, Minus, Rocket, ArrowRight, ChevronDown
} from "lucide-react";
import { RoleInteractiveDemo } from "@/components/landing/RoleInteractiveDemo";
import { CommunityFeedbackSection } from "@/components/home/CommunityFeedback";
import { FeatureCardsAsymmetric } from "@/components/landing/FeaturesStickyScroll";
import { MarqueeBanner } from "@/components/landing/MarqueeBanner";
import { StickyWords } from "@/components/landing/StickyWords";
import { ProcessSteps } from "@/components/landing/ProcessSteps";
import { WordReveal } from "@/components/animations/WordReveal";
import { TiltMockup } from "@/components/animations/TiltMockup";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

function SolutionSection() {
  const containerRef = useRef<HTMLElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !mockupRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.fromTo(mockupRef.current, 
      { y: 50 }, 
      {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-[#F5F1EB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(201,169,110,0.12)] text-[#C9A96E] text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            The Solution
          </div>

          <WordReveal 
            text="An AI tutor, a community, and a path that adapts to you" 
            className="font-heading text-4xl md:text-5xl text-[#1E1B2E] leading-tight mb-6"
            tag="h2"
          />

          <p className="text-[#8E8E93] text-lg leading-relaxed mb-8">
            Skill Sphere combines structured courses, an AI tutor that explains anything 24/7, and a community of learners and mentors — so you never feel stuck or alone again.
          </p>

          <div className="space-y-4">
            {[
              "AI tutor answers questions in seconds, not days",
              "Community keeps you accountable and motivated",
              "Structured paths eliminate 'what do I learn next?'",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[rgba(201,169,110,0.15)] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#C9A96E]" />
                </div>
                <p className="text-[#1E1B2E]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div ref={mockupRef} className="relative">
          <TiltMockup>
            <img src="/images/Dashboards/Student/overview.png" alt="Skill Sphere Student Dashboard" className="w-full h-full object-cover object-top" />
          </TiltMockup>
          <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border border-[rgba(30,27,46,0.06)] z-10 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-heading text-lg text-[#1E1B2E]">94%</p>
                <p className="text-xs text-[#8E8E93]">Completion Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  useGSAP(() => {
    if (!containerRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.fromTo(".benefit-card-left", 
      { opacity: 0, x: -60 }, 
      { opacity: 1, x: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 75%" } }
    );
    gsap.fromTo(".benefit-card-right", 
      { opacity: 0, x: 60 }, 
      { opacity: 1, x: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 75%" } }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-[#1E1B2E] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider">Benefits</span>
          <WordReveal text="The Skill Sphere difference" className="font-heading text-4xl md:text-5xl text-white mt-3" tag="h2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before */}
          <div className="benefit-card-left bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <XCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-white/60 font-medium text-lg">Without Skill Sphere</h3>
            </div>
            <div className="space-y-5">
              {[
                "Bouncing between 10 different websites",
                "Questions unanswered for days",
                "No idea if you're making progress",
                "Learning feels like a chore",
                "Giving up after 2 weeks"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/40">
                  <Minus className="w-5 h-5 flex-shrink-0" />
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="benefit-card-right bg-[rgba(201,169,110,0.08)] border border-[#C9A96E]/20 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5 text-[#C9A96E]" />
              <h3 className="text-[#C9A96E] font-medium text-lg">With Skill Sphere</h3>
            </div>
            <div className="space-y-5">
              {[
                "Everything in one beautiful dashboard",
                "AI answers in seconds, 24/7",
                "Clear progress tracking and skill trees",
                "Gamified — learning feels like leveling up",
                "Community keeps you accountable"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-[#C9A96E] flex-shrink-0" />
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PopularLearningPathsSection() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses/popular?limit=4");
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
        }
      } catch (err) {
        console.error("Failed to fetch popular courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useGSAP(() => {
    if (loading || !containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".course-card");
    if (!cards.length) return;
    
    gsap.fromTo(cards, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );
  }, [loading]);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider">Courses</span>
            <WordReveal text="Popular learning paths" className="font-heading text-4xl md:text-5xl text-[#1E1B2E] mt-3" tag="h2" />
          </div>
          <Link href="/courses">
            <button className="px-6 py-3 rounded-xl border border-[rgba(30,27,46,0.1)] text-[#1E1B2E] font-medium hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.06)] transition-all">
              View All Courses
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="rounded-2xl bg-gray-200 aspect-[4/3] mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="course-card group cursor-pointer">
                <Link href={`/courses/${course.id}`}>
                  <div className="relative rounded-2xl overflow-hidden mb-4 aspect-[4/3] bg-[#F5F1EB] border border-[rgba(30,27,46,0.04)] flex flex-col items-center justify-center">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="text-4xl text-[#C9A96E]/50 font-heading">
                        {course.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B2E]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-[rgba(255,255,255,0.9)] text-[#1E1B2E] text-xs font-medium shadow-sm">
                      {course.subject}
                    </div>
                  </div>
                  <h3 className="font-medium text-[#1E1B2E] mb-1 group-hover:text-[#C9A96E] transition-colors line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-[#8E8E93]">
                    {course._count?.enrollments || 0} students enrolled
                  </p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#F5F1EB] rounded-2xl p-12 text-center border border-[rgba(30,27,46,0.04)]">
            <h3 className="font-heading text-2xl text-[#1E1B2E] mb-3">New courses coming soon</h3>
            <p className="text-[#8E8E93] mb-6">Our instructors are working on exciting new content.</p>
            <Link href="/courses" className="text-[#C9A96E] font-medium hover:underline flex items-center justify-center gap-2">
              Explore all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function FAQSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll(".faq-item");
    gsap.fromTo(items, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider">FAQ</span>
          <WordReveal text="Questions? Answered." className="font-heading text-4xl md:text-5xl text-[#1E1B2E] mt-3" tag="h2" />
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Is the AI tutor really 24/7?",
              a: "Yes! Our AI tutor is powered by advanced LLMs and is available instantly, any time of day. No waiting for human responses."
            },
            {
              q: "Can I switch between courses?",
              a: "Absolutely. Your subscription gives you access to all courses. Learn Python today, switch to Web Dev tomorrow — no extra cost."
            },
            {
              q: "Do I get a certificate?",
              a: "Pro users earn verified certificates upon course completion. These can be shared on LinkedIn or downloaded as PDFs."
            },
            {
              q: "What if I get stuck?",
              a: "Ask the AI tutor instantly, post in the community Q&A, or message a peer. You'll never be stuck for long."
            },
            {
              q: "Is there a free trial for Pro?",
              a: "Yes — 14 days free, no credit card required. Cancel anytime before the trial ends and pay nothing."
            }
          ].map((faq, i) => (
            <div key={i} className="faq-item border border-[rgba(30,27,46,0.08)] rounded-xl overflow-hidden bg-white hover:border-[#C9A96E]/30 transition-colors">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[#F5F1EB] transition-colors outline-none">
                  <span className="font-medium text-lg text-[#1E1B2E]">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-[#F5F1EB] flex items-center justify-center group-open:bg-[#C9A96E] transition-colors shrink-0 ml-4">
                    <ChevronDown className="w-5 h-5 text-[#8E8E93] group-open:text-[#1E1B2E] group-open:rotate-180 transition-all duration-300" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-[#8E8E93] text-lg leading-relaxed">
                  {faq.a}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="relative py-32 md:py-40 bg-[#1E1B2E] overflow-hidden">
      {/* Subtle gold radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(201,169,110,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <WordReveal 
          text="Ready to start learning smarter, not harder?" 
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight mb-8"
          tag="h2"
        />
        <p className="text-lg text-[rgba(255,255,255,0.6)] mb-10 max-w-xl mx-auto">
          Join 50,000+ students already mastering new skills with AI-powered tutoring and a supportive community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#C9A96E] text-[#1E1B2E] rounded-full font-medium text-lg hover:bg-[#b8985d] transition-colors">
              Create Free Account
            </button>
          </Link>
          <Link href="/courses">
            <button className="w-full sm:w-auto px-8 py-4 border border-[rgba(255,255,255,0.2)] text-white rounded-full font-medium text-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              Explore Courses
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  const appleEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center bg-[#1E1B2E] overflow-hidden">
      {/* Ken Burns animated background */}
      <motion.div
        initial={{ scale: 1.0 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0 origin-center"
      >
        <img
          src="/images/hero-workspace.jpg"
          alt="Immersive workspace"
          className="w-full h-full object-cover opacity-40"
          onError={(e) => { e.currentTarget.src = "/images/hero-bg.jpg"; }}
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
              className="bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[17px] rounded-full px-10 py-4 shadow-[0_4px_14px_rgba(201,169,110,0.4)] block"
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
  );
}

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      {/* RootLayout handles the footer margin and relative z-[2] wrapper, so we just return sections */}
      <HeroSection />
      
      {/* 1. The Solution */}
      <SolutionSection />
      
      {/* 2. Marquee Banner */}
      <MarqueeBanner />
      
      {/* 3. Designed for Everyone (RoleInteractiveDemo) */}
      <RoleInteractiveDemo />
      
      {/* 4. Sticky Words */}
      <StickyWords />
      
      {/* 5. Process Steps */}
      <ProcessSteps />
      
      {/* 6. Feature Cards */}
      <FeatureCardsAsymmetric />
      
      {/* 7. Benefits */}
      <BenefitsSection />
      
      {/* 8. Popular Courses */}
      <PopularLearningPathsSection />
      
      {/* 9. Testimonials */}
      <CommunityFeedbackSection />
      
      {/* 10. FAQ */}
      <FAQSection />
      
      {/* 11. CTA */}
      <FinalCTASection />
    </div>
  );
}
