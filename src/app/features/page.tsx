"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, CheckCircle, XCircle, Play, Trophy } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Reusable Feature Section component
type FeatureSectionProps = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imagePosition?: "left" | "right";
  features: string[];
  stats?: { value: string; label: string }[];
};

function FeatureSection({ 
  title, 
  subtitle, 
  description, 
  image, 
  imagePosition = "right",
  features,
  stats
}: FeatureSectionProps) {
  return (
    <section className="py-24 bg-[#F5F1EB] overflow-hidden">
      <div className={`max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}>
        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: imagePosition === "right" ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
          className={imagePosition === "left" ? "lg:order-2" : "lg:order-1"}
        >
          <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider mb-3 block">
            {subtitle}
          </span>
          <h2 className="font-heading text-4xl text-[#1E1B2E] mb-4">{title}</h2>
          <p className="text-[#8E8E93] text-lg leading-relaxed mb-8">{description}</p>
          
          {/* Feature bullets */}
          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[rgba(201,169,110,0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[#C9A96E]" />
                </div>
                <p className="text-[#1E1B2E]">{feature}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          {stats && (
            <div className="flex gap-8 mt-8 pt-8 border-t border-[rgba(30,27,46,0.08)]">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="font-heading text-3xl text-[#C9A96E]">{stat.value}</p>
                  <p className="text-sm text-[#8E8E93]">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: imagePosition === "right" ? 40 : -40, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
          className={`relative ${imagePosition === "left" ? "lg:order-1" : "lg:order-2"}`}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.12)] bg-white border border-[rgba(30,27,46,0.04)] aspect-[4/3] flex items-center justify-center">
            {/* Fallback box if image missing */}
            <img src={image} alt={title} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <div className="absolute inset-0 flex items-center justify-center -z-10 bg-[rgba(30,27,46,0.02)]">
               <span className="text-[#8E8E93] font-medium">{title} Preview</span>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-2xl bg-[#C9A96E]/10" />
        </motion.div>
      </div>
    </section>
  );
}

// Subcomponents for sections
function HeroSection() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#1E1B2E] pt-20">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#C9A96E]/20 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800) 
            }}
            animate={{ 
              y: [null, -30, 30],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 4 + Math.random() * 4, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-0">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(201,169,110,0.15)] text-[#C9A96E] text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Powerful Learning Tools
          </div>
          
          <h1 className="font-heading text-5xl md:text-6xl text-white leading-tight mb-6">
            Everything you need to<br />
            <span className="text-[#C9A96E]">master any skill</span>
          </h1>
          
          <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
            From AI-powered tutoring to gamified progress tracking, Skill Sphere gives you every tool to learn faster, smarter, and together.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-medium"
            >
              Get Started Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Right: Animated Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotateY: -10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-white/10 bg-[#2A2640] aspect-[4/3] flex items-center justify-center">
            <img 
              src="/images/dashboard-preview.jpg" 
              alt="Skill Sphere Dashboard"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            {/* Floating UI elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-8 right-8 bg-white rounded-xl p-3 shadow-lg z-10"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#1E1B2E]">+150 Points</p>
                  <p className="text-[10px] text-[#8E8E93]">Streak maintained!</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PreviewSection({ activePreview, setActivePreview }: { activePreview: string, setActivePreview: (s: string) => void }) {
  return (
    <section className="py-24 bg-[#1E1B2E]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl text-white mb-4">See It In Action</h2>
          <p className="text-white/60 text-lg">A glimpse of what your dashboard could look like</p>
        </motion.div>

        {/* Interactive Tabs */}
        <div className="flex justify-center flex-wrap gap-3 mb-10">
          {["Overview", "My Courses", "AI Tutor", "Community"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePreview(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activePreview === tab
                  ? "bg-[#C9A96E] text-[#1E1B2E]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Preview Window */}
        <motion.div
          layout
          className="relative rounded-2xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-white/10 bg-white"
        >
          {/* Browser chrome */}
          <div className="bg-[#F5F1EB] px-4 py-3 flex items-center gap-2 border-b border-[rgba(30,27,46,0.06)]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white rounded-lg px-3 py-1 text-xs text-[#8E8E93] text-center max-w-sm mx-auto">
                skillsphere.com/dashboard
              </div>
            </div>
          </div>
          
          {/* Dashboard content based on active tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePreview}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6"
            >
              <div className="w-full rounded-xl bg-[rgba(30,27,46,0.03)] aspect-[16/9] overflow-hidden flex items-center justify-center border border-[rgba(30,27,46,0.04)]">
                <img 
                  src={`/images/preview-${activePreview.toLowerCase().replace(" ", "-")}.jpg`}
                  alt={`${activePreview} Preview`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <span className="absolute text-[#8E8E93] font-medium">{activePreview} Preview</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="py-24 bg-[#F5F1EB]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl text-[#1E1B2E] mb-4">Why Skill Sphere?</h2>
          <p className="text-[#8E8E93] text-lg">See how we compare to traditional learning platforms</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-0 rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
          {/* Header Row */}
          <div className="bg-[#1E1B2E] p-6 text-white font-medium flex items-center">Feature</div>
          <div className="bg-[#1E1B2E] p-6 text-[#C9A96E] font-heading text-xl font-bold text-center">Skill Sphere</div>
          <div className="bg-[#1E1B2E] p-6 text-white/60 font-medium text-center">Others</div>

          {/* Comparison Rows */}
          {[
            { feature: "AI Personal Tutor", us: true, them: false },
            { feature: "Interactive Coding", us: true, them: "Limited" },
            { feature: "Community Learning", us: true, them: false },
            { feature: "Gamification", us: true, them: "Basic" },
            { feature: "Progress Tracking", us: "Advanced", them: "Basic" },
            { feature: "Free Tier", us: true, them: "Trial only" },
          ].map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`col-span-3 grid grid-cols-3 ${
                i % 2 === 0 ? "bg-white" : "bg-[#FAF8F5]"
              }`}
            >
              <div className="p-5 text-[#1E1B2E] font-medium flex items-center">{row.feature}</div>
              <div className="p-5 flex items-center justify-center text-center">
                {row.us === true ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </motion.div>
                ) : (
                  <span className="text-[#1E1B2E] font-medium">{row.us}</span>
                )}
              </div>
              <div className="p-5 flex items-center justify-center text-center">
                {row.them === false ? (
                  <XCircle className="w-6 h-6 text-red-400" />
                ) : (
                  <span className="text-[#8E8E93]">{row.them}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl text-[#1E1B2E] mb-6">
            Watch how <span className="text-[#C9A96E]">Jal learned Python</span> in 30 days
          </h2>
          <p className="text-[#8E8E93] text-lg leading-relaxed mb-8">
            Follow Jal's journey from complete beginner to building his first web app. See how Skill Sphere's structured path, AI tutor, and community support made it possible.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[rgba(30,27,46,0.1)] bg-[#F5F1EB]" />
              ))}
            </div>
            <p className="text-sm text-[#8E8E93]">
              <span className="text-[#1E1B2E] font-medium">12,000+</span> students started this week
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Video thumbnail with play button */}
          <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.15)] bg-[#F5F1EB] aspect-[16/9] flex items-center justify-center border border-[rgba(30,27,46,0.04)]">
            <img src="/images/student-journey.jpg" alt="Student Journey" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <span className="absolute text-[#8E8E93] font-medium">Video Preview</span>
            <div className="absolute inset-0 bg-[#1E1B2E]/30 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-[#C9A96E] flex items-center justify-center shadow-lg"
              >
                <Play className="w-8 h-8 text-[#1E1B2E] ml-1" />
              </motion.button>
            </div>
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-[#1E1B2E]/80 text-white text-sm backdrop-blur-sm">
            2:34
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TechStackSection() {
  return (
    <section className="py-20 bg-[#F5F1EB]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-3xl text-[#1E1B2E] mb-12"
        >
          Powered by Modern Technology
        </motion.h2>
        
        <div className="flex justify-center items-center gap-12 flex-wrap">
          {[
            { name: "Next.js", icon: "N" },
            { name: "React", icon: "R" },
            { name: "TypeScript", icon: "TS" },
            { name: "Prisma", icon: "P" },
            { name: "PostgreSQL", icon: "DB" },
            { name: "OpenAI", icon: "AI" },
          ].map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center p-3 text-xl font-bold text-[#1E1B2E] border border-[rgba(30,27,46,0.04)]">
                {/* Fallback to text initials if images are missing */}
                {tech.icon}
              </div>
              <span className="text-sm text-[#8E8E93]">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-[#1E1B2E] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#C9A96E] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C9A96E] rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        <h2 className="font-heading text-4xl text-white mb-6">
          Ready to start your learning journey?
        </h2>
        <p className="text-white/60 text-lg mb-10">
          Join 50,000+ students already learning on Skill Sphere. It's free to get started.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-medium text-lg"
          >
            Create Free Account
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-xl border border-white/20 text-white font-medium text-lg hover:bg-white/10 transition-colors"
          >
            Explore Courses
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

export default function FeaturesPage() {
  const [activePreview, setActivePreview] = useState("Overview");

  const aiTutorData = {
    subtitle: "AI-Powered",
    title: "Your Personal AI Tutor, 24/7",
    description: "Stuck on a concept at 2 AM? Our AI Study Tutor explains anything in simple terms, gives examples, quizzes you, and adapts to your learning style.",
    image: "/images/ai-tutor-preview.jpg",
    imagePosition: "right" as const,
    features: [
      "Ask anything — from basic definitions to advanced problem solving",
      "Get step-by-step explanations with real examples",
      "Generate custom quizzes based on your weak areas",
      "Save conversations and revisit them anytime"
    ],
    stats: [
      { value: "10K+", label: "Questions Answered" },
      { value: "4.9★", label: "Student Rating" }
    ]
  };

  const coursesData = {
    subtitle: "Immersive Learning",
    title: "Video, Code & Quizzes in One Place",
    description: "No more switching between YouTube, IDEs, and quiz apps. Watch lessons, write code, and test your knowledge — all inside Skill Sphere.",
    image: "/images/course-preview.jpg",
    imagePosition: "left" as const,
    features: [
      "HD video lessons with interactive transcripts",
      "Built-in code editor for hands-on practice",
      "Auto-graded quizzes with instant feedback",
      "Progress tracking with visual skill trees"
    ],
    stats: [
      { value: "500+", label: "Video Lessons" },
      { value: "50+", label: "Interactive Labs" }
    ]
  };

  const communityData = {
    subtitle: "Learn Together",
    title: "A Community That Actually Helps",
    description: "Join course-specific chats, ask questions in the forum, or message peers directly. Learning alone is hard — do it together.",
    image: "/images/community-preview.jpg",
    imagePosition: "right" as const,
    features: [
      "Course chat rooms with real-time messaging",
      "Q&A forum with upvoting and verified answers",
      "Direct messaging with instructors and peers",
      "Study groups for collaborative learning"
    ],
    stats: [
      { value: "2.5K", label: "Daily Messages" },
      { value: "98%", label: "Questions Answered" }
    ]
  };

  const gamificationData = {
    subtitle: "Stay Motivated",
    title: "Points, Streaks & Leaderboards",
    description: "Turn learning into a game. Earn points for completing lessons, maintain daily streaks, and compete on global leaderboards.",
    image: "/images/gamification-preview.jpg",
    imagePosition: "left" as const,
    features: [
      "Daily streaks with push notifications",
      "Achievement badges for milestones",
      "Global and course-specific leaderboards",
      "Redeem points for certificates and rewards"
    ],
    stats: [
      { value: "15K", label: "Active Streaks" },
      { value: "120", label: "Achievement Badges" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      <Header />
      
      <main>
        <HeroSection />
        <FeatureSection {...aiTutorData} />
        <FeatureSection {...coursesData} />
        <FeatureSection {...communityData} />
        <FeatureSection {...gamificationData} />
        <PreviewSection activePreview={activePreview} setActivePreview={setActivePreview} />
        <ComparisonSection />
        <StorySection />
        <TechStackSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
