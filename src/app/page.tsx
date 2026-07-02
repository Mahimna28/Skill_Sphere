"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, AlertCircle, Frown, MessageSquareOff, TrendingDown, TrendingUp,
  Check, CheckCircle, XCircle, Minus, Compass, Brain, Rocket,
  Star, ArrowRight, BookOpen, Users, Trophy, ChevronDown, Play
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function ProblemSection() {
  return (
    <section className="relative py-32 bg-[#1E1B2E] overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(201,169,110,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-8"
          >
            <AlertCircle className="w-4 h-4" />
            The Problem
          </motion.div>

          <h2 className="font-heading text-5xl md:text-6xl text-white leading-tight mb-8">
            73% of online learners<br />
            <span className="text-[#C9A96E]">quit within 30 days</span>
          </h2>

          <p className="text-white/60 text-xl leading-relaxed mb-12">
            Not because they're not smart. Because they're alone, overwhelmed, and have no one to ask when stuck. YouTube tutorials don't answer back. Textbooks don't adapt to you.
          </p>

          {/* Pain Point Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: Frown, 
                title: "No Guidance", 
                desc: "Staring at a screen with no idea what to do next" 
              },
              { 
                icon: MessageSquareOff, 
                title: "No Support", 
                desc: "Questions go unanswered for days, if ever" 
              },
              { 
                icon: TrendingDown, 
                title: "No Progress", 
                desc: "Start strong, lose motivation, give up" 
              },
            ].map((pain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left"
              >
                <pain.icon className="w-8 h-8 text-red-400 mb-4" />
                <h3 className="text-white font-medium text-lg mb-2">{pain.title}</h3>
                <p className="text-white/50 text-sm">{pain.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section className="py-32 bg-[#F5F1EB] relative overflow-hidden">
      {/* Decorative element */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-20 w-64 h-64 border border-[#C9A96E]/20 rounded-full hidden lg:block"
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(201,169,110,0.12)] text-[#C9A96E] text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            The Solution
          </div>

          <h2 className="font-heading text-5xl text-[#1E1B2E] leading-tight mb-6">
            An AI tutor, a<br className="hidden md:block" />
            community, and a<br className="hidden md:block" />
            <span className="text-[#C9A96E]">path that adapts to you</span>
          </h2>

          <p className="text-[#8E8E93] text-lg leading-relaxed mb-8">
            Skill Sphere combines structured courses, an AI tutor that explains anything 24/7, and a community of learners and mentors — so you never feel stuck or alone again.
          </p>

          <div className="space-y-4">
            {[
              "AI tutor answers questions in seconds, not days",
              "Community keeps you accountable and motivated",
              "Structured paths eliminate 'what do I learn next?'",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[rgba(201,169,110,0.15)] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#C9A96E]" />
                </div>
                <p className="text-[#1E1B2E]">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.15)] bg-white aspect-[4/3] border border-[rgba(30,27,46,0.04)] flex items-center justify-center">
            <img src="/images/solution-dashboard.jpg" alt="Skill Sphere Dashboard" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <span className="absolute text-[#8E8E93] font-medium">Dashboard Preview</span>
          </div>
          {/* Floating stat card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border border-[rgba(30,27,46,0.06)] z-10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-heading text-lg text-[#1E1B2E]">94%</p>
                <p className="text-xs text-[#8E8E93]">Completion Rate</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesBentoSection() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider">Features</span>
          <h2 className="font-heading text-4xl text-[#1E1B2E] mt-3 mb-4">One platform, infinite possibilities</h2>
          <p className="text-[#8E8E93] text-lg max-w-2xl mx-auto">
            From AI tutoring to gamified progress tracking, every tool you need is here.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          {/* Large Feature: AI Tutor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 bg-[#1E1B2E] rounded-2xl p-8 relative overflow-hidden group cursor-pointer min-h-[300px]"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[rgba(201,169,110,0.15)] flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-[#C9A96E]" />
              </div>
              <h3 className="font-heading text-2xl text-white mb-3">AI Study Tutor</h3>
              <p className="text-white/60 mb-6 max-w-sm">
                Ask anything, get instant explanations. Available 24/7 for every course and topic.
              </p>
              <div className="flex items-center gap-2 text-[#C9A96E] text-sm font-medium group-hover:gap-3 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <img 
              src="/images/ai-tutor-preview.jpg" 
              alt="AI Tutor"
              className="absolute bottom-0 right-0 w-3/4 opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </motion.div>

          {/* Medium Feature: Interactive Courses */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="col-span-1 md:col-span-2 bg-[#F5F1EB] rounded-2xl p-6 relative overflow-hidden group cursor-pointer min-h-[250px]"
          >
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[rgba(201,169,110,0.15)] flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="font-heading text-xl text-[#1E1B2E] mb-2">Interactive Courses</h3>
                <p className="text-[#8E8E93] text-sm">Video, code, quizzes — all in one place.</p>
              </div>
              <div className="w-full sm:w-32 aspect-video sm:aspect-square bg-[rgba(30,27,46,0.05)] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden relative">
                <img src="/images/course-mini.jpg" alt="Courses" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            </div>
          </motion.div>

          {/* Small Feature: Community */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="bg-white border border-[rgba(30,27,46,0.08)] rounded-2xl p-6 hover:border-[#C9A96E]/30 transition-colors cursor-pointer min-h-[200px]"
          >
            <Users className="w-6 h-6 text-[#C9A96E] mb-4" />
            <h3 className="font-medium text-[#1E1B2E] mb-1">Community</h3>
            <p className="text-[#8E8E93] text-sm">Learn together, never alone.</p>
          </motion.div>

          {/* Small Feature: Gamification */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="bg-white border border-[rgba(30,27,46,0.08)] rounded-2xl p-6 hover:border-[#C9A96E]/30 transition-colors cursor-pointer min-h-[200px]"
          >
            <Trophy className="w-6 h-6 text-[#C9A96E] mb-4" />
            <h3 className="font-medium text-[#1E1B2E] mb-1">Gamification</h3>
            <p className="text-[#8E8E93] text-sm">Points, streaks, leaderboards.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-32 bg-[#F5F1EB]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider">How It Works</span>
          <h2 className="font-heading text-4xl text-[#1E1B2E] mt-3">Three steps to mastery</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="absolute top-16 left-[20%] right-[20%] h-0.5 bg-[rgba(201,169,110,0.2)] hidden md:block" />

          {[
            {
              step: "01",
              title: "Choose Your Path",
              desc: "Pick from curated learning paths or create your own. AI suggests what to learn next based on your goals.",
              icon: Compass,
              color: "bg-blue-50 text-blue-600"
            },
            {
              step: "02",
              title: "Learn With AI",
              desc: "Watch lessons, write code, take quizzes. Stuck? Ask the AI tutor anytime — it knows every course inside out.",
              icon: Brain,
              color: "bg-[rgba(201,169,110,0.12)] text-[#C9A96E]"
            },
            {
              step: "03",
              title: "Build & Share",
              desc: "Complete projects, earn certificates, and showcase your skills. Join the community to collaborate and grow.",
              icon: Rocket,
              color: "bg-green-50 text-green-600"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.2, type: "spring" }}
                className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-6 relative z-10`}
              >
                <item.icon className="w-8 h-8" />
              </motion.div>
              
              <span className="font-heading text-6xl text-[#1E1B2E]/5 absolute top-0 left-1/2 -translate-x-1/2">
                {item.step}
              </span>
              
              <h3 className="font-heading text-2xl text-[#1E1B2E] mb-3">{item.title}</h3>
              <p className="text-[#8E8E93] leading-relaxed max-w-sm mx-auto">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="py-32 bg-[#1E1B2E]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider">Benefits</span>
          <h2 className="font-heading text-4xl text-white mt-3">The Skill Sphere difference</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <XCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-white/60 font-medium">Without Skill Sphere</h3>
            </div>
            <div className="space-y-4">
              {[
                "Bouncing between 10 different websites",
                "Questions unanswered for days",
                "No idea if you're making progress",
                "Learning feels like a chore",
                "Giving up after 2 weeks"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-white/40"
                >
                  <Minus className="w-4 h-4 flex-shrink-0" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[rgba(201,169,110,0.08)] border border-[#C9A96E]/20 rounded-2xl p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5 text-[#C9A96E]" />
              <h3 className="text-[#C9A96E] font-medium">With Skill Sphere</h3>
            </div>
            <div className="space-y-4">
              {[
                "Everything in one beautiful dashboard",
                "AI answers in seconds, 24/7",
                "Clear progress tracking and skill trees",
                "Gamified — learning feels like leveling up",
                "Community keeps you accountable"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 text-white"
                >
                  <Check className="w-4 h-4 text-[#C9A96E] flex-shrink-0" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SuccessStoriesSection() {
  return (
    <section className="py-32 bg-[#F5F1EB]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider">Success Stories</span>
          <h2 className="font-heading text-4xl text-[#1E1B2E] mt-3">From zero to hired</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Jal Patel",
              role: "Frontend Developer @ Google",
              before: "Complete beginner, no coding experience",
              after: "Built 5 projects, hired in 6 months",
              image: "/testimonials/jal.jpg",
              stat: "6 months"
            },
            {
              name: "Sarah Chen",
              role: "Data Scientist @ Netflix",
              before: "Struggled with self-paced courses",
              after: "Mastered Python & ML with AI tutor help",
              image: "/testimonials/sarah.jpg",
              stat: "4 months"
            },
            {
              name: "Mike Ross",
              role: "Full Stack Developer",
              before: "Gave up on 3 other platforms",
              after: "Completed 12 courses, 94% avg score",
              image: "/testimonials/mike.jpg",
              stat: "8 months"
            }
          ].map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[rgba(30,27,46,0.04)]"
            >
              <div className="h-48 bg-gradient-to-br from-[#1E1B2E] to-[#2d2a3d] relative p-6 flex flex-col justify-end">
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#C9A96E] text-[#1E1B2E] text-xs font-bold shadow-sm">
                  {story.stat}
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-white bg-white/20 flex items-center justify-center overflow-hidden">
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl text-[#1E1B2E] mb-1">{story.name}</h3>
                <p className="text-[#C9A96E] text-sm mb-4 font-medium">{story.role}</p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded mt-0.5">Before</span>
                    <p className="text-sm text-[#8E8E93]">{story.before}</p>
                  </div>
                  <div className="w-full h-px bg-[rgba(30,27,46,0.06)]" />
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded mt-0.5">After</span>
                    <p className="text-sm text-[#1E1B2E] font-medium">{story.after}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoursesPreviewSection() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider">Courses</span>
            <h2 className="font-heading text-4xl text-[#1E1B2E] mt-3">Popular learning paths</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-xl border border-[rgba(30,27,46,0.1)] text-[#1E1B2E] font-medium hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.06)] transition-all"
          >
            View All Courses
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Python Programming", students: "12.5K", lessons: 24, image: "/courses/python.jpg", color: "from-blue-500/20 to-blue-600/20" },
            { title: "AI & Machine Learning", students: "8.2K", lessons: 32, image: "/courses/ai.jpg", color: "from-purple-500/20 to-purple-600/20" },
            { title: "Web Development", students: "15K", lessons: 28, image: "/courses/web.jpg", color: "from-green-500/20 to-green-600/20" },
            { title: "Data Science", students: "6.8K", lessons: 20, image: "/courses/data.jpg", color: "from-orange-500/20 to-orange-600/20" },
          ].map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden mb-4 aspect-[4/3] bg-[rgba(30,27,46,0.03)] border border-[rgba(30,27,46,0.04)]">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => (e.currentTarget.style.display = 'none')} />
                <div className={`absolute inset-0 bg-gradient-to-t ${course.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-[rgba(30,27,46,0.7)] text-white text-xs backdrop-blur-sm">
                  {course.lessons} lessons
                </div>
              </div>
              <h3 className="font-medium text-[#1E1B2E] mb-1 group-hover:text-[#C9A96E] transition-colors">{course.title}</h3>
              <p className="text-sm text-[#8E8E93]">{course.students} students enrolled</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-32 bg-[#1E1B2E]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider">Testimonials</span>
          <h2 className="font-heading text-4xl text-white mt-3">Loved by learners worldwide</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "The AI tutor is a game-changer. I went from struggling with Python basics to building my first app in 3 months.",
              author: "Alex Chen",
              role: "Computer Science Student",
              rating: 5
            },
            {
              quote: "Finally, a platform that understands I'm a human, not a robot. The community kept me going when I wanted to quit.",
              author: "Maria Garcia",
              role: "Career Switcher",
              rating: 5
            },
            {
              quote: "I've tried Coursera, Udemy, YouTube — Skill Sphere is the only one where I actually finished the course.",
              author: "James Wilson",
              role: "Self-Taught Developer",
              rating: 5
            }
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#C9A96E] fill-[#C9A96E]" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A96E]/20 flex items-center justify-center">
                  <span className="text-[#C9A96E] font-medium">{t.author[0]}</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{t.author}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-32 bg-[#F5F1EB]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider">Pricing</span>
          <h2 className="font-heading text-4xl text-[#1E1B2E] mt-3 mb-4">Start free, upgrade when ready</h2>
          <p className="text-[#8E8E93]">No credit card required to start.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {[
            {
              name: "Free",
              price: "$0",
              period: "forever",
              description: "Perfect for trying out",
              features: [
                "Access to 5 free courses",
                "AI Tutor (10 messages/day)",
                "Community access",
                "Basic progress tracking"
              ],
              cta: "Get Started",
              highlighted: false
            },
            {
              name: "Pro",
              price: "$12",
              period: "/month",
              description: "For serious learners",
              features: [
                "Unlimited course access",
                "Unlimited AI Tutor",
                "Priority community support",
                "Certificates & skill trees",
                "Downloadable resources",
                "Offline mobile access"
              ],
              cta: "Start Pro Trial",
              highlighted: true
            },
            {
              name: "Team",
              price: "$39",
              period: "/user/month",
              description: "For institutions",
              features: [
                "Everything in Pro",
                "Admin dashboard",
                "Progress reports",
                "Custom learning paths",
                "SSO & API access",
                "Dedicated support"
              ],
              cta: "Contact Sales",
              highlighted: false
            }
          ].map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: plan.highlighted ? -10 : -6 }}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-[#1E1B2E] text-white shadow-[0_16px_40px_rgba(0,0,0,0.2)] md:scale-105 relative z-10"
                  : "bg-white border border-[rgba(30,27,46,0.08)]"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C9A96E] text-[#1E1B2E] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <h3 className={`font-heading text-xl mb-2 ${plan.highlighted ? "text-white" : "text-[#1E1B2E]"}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`font-heading text-4xl ${plan.highlighted ? "text-[#C9A96E]" : "text-[#1E1B2E]"}`}>
                  {plan.price}
                </span>
                <span className={plan.highlighted ? "text-white/60" : "text-[#8E8E93]"}>{plan.period}</span>
              </div>
              <p className={`text-sm mb-6 ${plan.highlighted ? "text-white/60" : "text-[#8E8E93]"}`}>
                {plan.description}
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 rounded-xl font-medium mb-8 transition-colors ${
                  plan.highlighted
                    ? "bg-[#C9A96E] text-[#1E1B2E] hover:bg-[#b59863]"
                    : "bg-[#1E1B2E] text-white hover:bg-[#2d2a3d]"
                }`}
              >
                {plan.cta}
              </motion.button>

              <div className="space-y-3">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Check className={`w-4 h-4 ${plan.highlighted ? "text-[#C9A96E]" : "text-green-500"}`} />
                    <span className={`text-sm ${plan.highlighted ? "text-white/80" : "text-[#1E1B2E]"}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider">FAQ</span>
          <h2 className="font-heading text-4xl text-[#1E1B2E] mt-3">Questions? Answered.</h2>
        </motion.div>

        <div className="space-y-4">
          {[
            {
              q: "Is the AI tutor really 24/7?",
              a: "Yes! Our AI tutor is powered by GPT-4o-mini and is available instantly, any time of day. No waiting for human responses."
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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border border-[rgba(30,27,46,0.08)] rounded-xl overflow-hidden bg-white hover:border-[#C9A96E]/30 transition-colors"
            >
              <details className="group">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-[#F5F1EB] transition-colors outline-none">
                  <span className="font-medium text-[#1E1B2E]">{faq.q}</span>
                  <motion.div
                    className="w-6 h-6 rounded-full bg-[#F5F1EB] flex items-center justify-center group-open:bg-[#C9A96E] transition-colors"
                  >
                    <ChevronDown className="w-4 h-4 text-[#8E8E93] group-open:text-[#1E1B2E] group-open:rotate-180 transition-all duration-300" />
                  </motion.div>
                </summary>
                <div className="px-5 pb-5 text-[#8E8E93] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="py-32 bg-[#1E1B2E] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 rounded-2xl bg-[rgba(201,169,110,0.15)] flex items-center justify-center mx-auto mb-8 border border-[#C9A96E]/20"
        >
          <Rocket className="w-10 h-10 text-[#C9A96E]" />
        </motion.div>

        <h2 className="font-heading text-5xl text-white mb-6">
          Ready to start learning<br />
          <span className="text-[#C9A96E]">smarter, not harder?</span>
        </h2>
        
        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
          Join 50,000+ students already mastering new skills with AI-powered tutoring and a supportive community.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-medium text-lg"
          >
            Create Free Account
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-xl border border-white/20 text-white font-medium text-lg hover:bg-white/10 transition-colors"
          >
            Explore Courses
          </motion.button>
        </div>

        <p className="text-white/30 text-sm mt-6">No credit card required. Start learning in 30 seconds.</p>
      </motion.div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 bg-[#1E1B2E]">
        <img 
          src="/images/hero-bg.jpg" 
          alt="Students learning" 
          className="w-full h-full object-cover opacity-60" 
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-[#1E1B2E]/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B2E] via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 backdrop-blur-md">
            <Star className="w-4 h-4 text-[#C9A96E] fill-[#C9A96E]" />
            Trusted by 500+ students
          </div>

          {/* Heading */}
          <h1 className="font-heading text-5xl md:text-6xl text-white leading-[1.1] mb-6">
            Unlock Your Potential<br />
            with Skill Sphere
          </h1>

          {/* Subheading */}
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
            Master in-demand skills with AI-powered tutoring, expert-led courses, and a thriving learning community.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-16">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-medium text-lg"
            >
              Explore Courses
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl border border-white text-white font-medium text-lg hover:bg-white/10 transition-colors"
            >
              Try AI Tutor
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 md:gap-12">
            <div>
              <p className="font-heading text-3xl text-[#C9A96E] mb-1">500+</p>
              <p className="text-white/60 text-sm">Students</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <p className="font-heading text-3xl text-[#C9A96E] mb-1">50+</p>
              <p className="text-white/60 text-sm">Courses</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <p className="font-heading text-3xl text-[#C9A96E] mb-1">24/7</p>
              <p className="text-white/60 text-sm">AI Support</p>
            </div>
          </div>
        </motion.div>

        {/* Floating Cards (Right Side) */}
        <div className="relative h-[500px] hidden lg:block">
          {/* Back Card: AI Tutor */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 0 }}
            animate={{ opacity: 1, x: 0, rotate: 6 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-10 right-0 w-[350px] bg-white rounded-2xl p-5 shadow-2xl origin-bottom-right"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#C9A96E]" />
              <span className="font-heading text-[#1E1B2E] font-medium text-lg">AI Study Tutor</span>
            </div>
            <div className="space-y-3">
              <div className="bg-[#1E1B2E] text-white p-3 rounded-xl rounded-tr-sm text-sm">
                How does photosynthesis work?
              </div>
              <div className="bg-[rgba(201,169,110,0.1)] text-[#1E1B2E] p-3 rounded-xl rounded-tl-sm text-sm">
                Photosynthesis is the process by which plants use sunlight...
              </div>
            </div>
          </motion.div>

          {/* Front Card: Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute top-32 right-32 w-[380px] bg-white rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-10"
          >
            <div className="bg-[#1E1B2E] w-full h-[200px] rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1E1B2E] to-[#2d2a3d]" />
              <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center z-10 backdrop-blur-sm bg-white/10 cursor-pointer hover:scale-105 transition-transform">
                <Play className="w-6 h-6 text-white ml-1" fill="white" />
              </div>
            </div>
            <h3 className="font-heading text-[#1E1B2E] text-lg font-medium mb-3">Python Programming</h3>
            <div className="w-full h-1.5 bg-[#F5F1EB] rounded-full overflow-hidden">
              <div className="w-[65%] h-full bg-[#C9A96E]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      <Header />
      
      <main>
        {/* 0. Hero */}
        <HeroSection />

        {/* 1. Problem */}
        <ProblemSection />
        
        {/* 2. Solution */}
        <SolutionSection />
        
        {/* 3. Features (Bento Grid) */}
        <FeaturesBentoSection />
        
        {/* 4. How It Works */}
        <HowItWorksSection />
        
        {/* 5. Benefits (Before/After) */}
        <BenefitsSection />
        
        {/* 6. Student Success Stories */}
        <SuccessStoriesSection />
        
        {/* 7. Courses Preview */}
        <CoursesPreviewSection />
        
        {/* 8. Testimonials */}
        <TestimonialsSection />
        
        {/* 9. Pricing */}
        <PricingSection />
        
        {/* 10. FAQ */}
        <FAQSection />
        
        {/* 11. Final CTA */}
        <FinalCTASection />
      </main>
      
      <Footer />
    </div>
  );
}
