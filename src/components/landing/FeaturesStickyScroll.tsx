"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpen, Users, Trophy, Play, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

// --- DEMO COMPONENTS --- //

const AITutorDemo = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Hi there! What do you want to learn today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handlePromptClick = () => {
    if (messages.length > 1) return;
    setMessages(prev => [...prev, { role: 'user', content: 'Explain React hooks simply.' }]);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'Hooks are special functions that let you "hook into" React features. For example, useState lets you add state to a functional component!' 
      }]);
    }, 1500);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] p-4 flex flex-col font-sans relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#C9A96E]/20 rounded-full blur-[40px] pointer-events-none"></div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative z-10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-r from-[#C9A96E] to-[#D4B988] text-[#1E1B2E] font-medium rounded-tr-sm' : 'bg-white/10 backdrop-blur-md text-white rounded-tl-sm border border-white/10'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl rounded-tl-sm flex gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-pulse delay-75"></span>
              <span className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-pulse delay-150"></span>
              <span className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-pulse delay-300"></span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
        {messages.length === 1 && (
          <button 
            onClick={handlePromptClick}
            className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-between group shadow-sm cursor-pointer relative z-20"
          >
            "Explain React hooks simply."
            <ArrowRight size={16} className="text-[#C9A96E] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </div>
  );
};

const CoursesDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 2));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full h-full bg-white flex flex-col font-sans">
      {/* Video Player Area */}
      <div className="relative w-full h-[55%] bg-[#1E1B2E] overflow-hidden group">
        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" className={`w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-60'}`} alt="Course video" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-[#C9A96E] to-[#D4B988] flex items-center justify-center text-[#1E1B2E] shadow-xl transform transition-transform hover:scale-110 z-20 cursor-pointer border-2 border-white/20"
          >
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-1.5 h-4 bg-[#1E1B2E] rounded-full"></div>
                <div className="w-1.5 h-4 bg-[#1E1B2E] rounded-full"></div>
              </div>
            ) : (
              <Play size={24} className="ml-1" fill="currentColor" />
            )}
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20 z-10">
          <div className="h-full bg-[#C9A96E] transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(201,169,110,0.8)]" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      {/* Course Curriculum Area */}
      <div className="flex-1 p-5 bg-[#F5F1EB] overflow-y-auto custom-scrollbar">
        <h4 className="font-heading font-bold text-[#1E1B2E] text-base mb-3">Module 1: Introduction</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-black/5 shadow-sm transform transition-transform hover:-translate-y-0.5 cursor-pointer">
            <span className="text-sm font-medium flex items-center gap-3 text-[#1E1B2E]">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isPlaying ? 'bg-[#C9A96E]/20 text-[#C9A96E]' : 'bg-gray-100 text-gray-400'}`}>
                {isPlaying ? <div className="w-2 h-2 bg-[#C9A96E] rounded-full animate-pulse"></div> : <Play size={10} fill="currentColor"/>}
              </div>
              1.1 Welcome to the Course
            </span>
            <span className="text-xs font-semibold text-gray-400">2:45</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-black/5 shadow-sm opacity-70">
            <span className="text-sm font-medium flex items-center gap-3 text-gray-600">
              <CheckCircle2 size={16} className="text-green-500"/> 
              1.2 Environment Setup
            </span>
            <span className="text-xs font-semibold text-gray-400">5:12</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommunityDemo = () => {
  const [msgs, setMsgs] = useState([
    { user: 'Sarah T.', msg: 'Has anyone figured out module 4 yet?', time: 'Just now' }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (msgs.length < 2) {
        setMsgs(prev => [...prev, { user: 'Alex M.', msg: 'Yeah, you need to use a reduce function for the second problem!', time: 'Just now' }]);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [msgs]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#F5F1EB] to-white p-5 flex flex-col font-sans relative overflow-hidden">
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-400/10 rounded-full blur-[40px] pointer-events-none"></div>
      
      <div className="font-heading font-bold text-[#1E1B2E] mb-5 pb-3 border-b border-black/5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
        General Chat
      </div>
      <div className="flex-1 space-y-5 relative z-10">
        {msgs.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={i} 
            className="flex gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E1B2E] to-[#3A3456] text-[#C9A96E] flex items-center justify-center text-sm font-bold shrink-0 shadow-md">
              {m.user.charAt(0)}
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-sm text-[#1E1B2E]">{m.user}</span>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{m.time}</span>
              </div>
              <p className="text-sm text-gray-700 bg-white p-3 rounded-xl rounded-tl-sm border border-black/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                {m.msg}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const GamificationDemo = () => {
  const [isUp, setIsUp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsUp(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const users = [
    { rank: 1, name: 'David K.', xp: 12450 },
    { rank: 2, name: 'Elena R.', xp: 11200 },
    { rank: isUp ? 4 : 3, name: 'Michael B.', xp: 9800 },
    { rank: isUp ? 3 : 4, name: 'You', xp: isUp ? 10100 : 9650, isMe: true },
  ].sort((a, b) => a.rank - b.rank);

  return (
    <div className="w-full h-full bg-white p-5 font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-[40px] pointer-events-none"></div>
      
      <h3 className="font-heading font-bold text-[#1E1B2E] text-lg mb-5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
          <Trophy size={18} className="text-yellow-500" />
        </div>
        Global Leaderboard
      </h3>
      <div className="flex-1 space-y-3 relative z-10">
        <AnimatePresence>
          {users.map((u) => (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={u.name}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${u.isMe ? 'bg-gradient-to-r from-[#1E1B2E] to-[#2A2540] text-white border-[#1E1B2E] shadow-xl transform scale-[1.02]' : 'bg-white border-gray-100 text-[#1E1B2E] hover:border-gray-200 shadow-sm'}`}
            >
              <div className="flex items-center gap-4">
                <span className={`font-black text-lg w-6 text-center ${u.rank <= 3 ? (u.isMe ? 'text-[#C9A96E]' : 'text-yellow-500') : (u.isMe ? 'text-white/50' : 'text-gray-300')}`}>
                  {u.rank}
                </span>
                <span className="font-semibold text-sm">{u.name}</span>
              </div>
              <span className={`text-sm font-black tracking-wide ${u.isMe ? 'text-[#C9A96E]' : 'text-gray-400'}`}>
                {u.xp.toLocaleString()} XP
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- STICKY SCROLL COMPONENT --- //

const features = [
  {
    id: "ai-tutor",
    title: "AI Study Tutor",
    description: "Ask anything, get instant explanations. Available 24/7 for every course and topic.",
    icon: Sparkles,
    demo: AITutorDemo,
    bgColor: "bg-[#1E1B2E]",
    textColor: "text-white",
    descColor: "text-white/60",
  },
  {
    id: "interactive-courses",
    title: "Interactive Courses",
    description: "Video, code, quizzes — all in one place without switching apps.",
    icon: BookOpen,
    demo: CoursesDemo,
    bgColor: "bg-[#1E1B2E]",
    textColor: "text-white",
    descColor: "text-white/60",
  },
  {
    id: "community",
    title: "Community",
    description: "Learn together. Join study groups, ask questions, and get peer feedback.",
    icon: Users,
    demo: CommunityDemo,
    bgColor: "bg-[#1E1B2E]",
    textColor: "text-white",
    descColor: "text-white/60",
  },
  {
    id: "gamification",
    title: "Gamification",
    description: "Turn learning into a game. Earn points, maintain streaks, and top the leaderboard.",
    icon: Trophy,
    demo: GamificationDemo,
    bgColor: "bg-[#1E1B2E]",
    textColor: "text-white",
    descColor: "text-white/60",
  }
];

const FeatureCard = ({ 
  feature, 
  index, 
  progress, 
  total 
}: { 
  feature: typeof features[0], 
  index: number, 
  progress: any,
  total: number 
}) => {
  const range = [index / total, (index + 1) / total];
  
  const targetScale = 1 - ((total - index) * 0.04);
  const scale = useTransform(progress, [range[0], range[1]], [1, targetScale]);
  // Prevent dullness by keeping opacity at 1 instead of fading out against the light background
  const opacity = 1;
  const y = useTransform(progress, [range[0], range[1]], [0, -30]);

  const isLast = index === total - 1;

  return (
    <div className="sticky top-0 h-screen w-full flex items-center justify-center px-4">
      <motion.div
        style={{
          scale: isLast ? 1 : scale,
          opacity: isLast ? 1 : opacity,
          y: isLast ? 0 : y,
          top: `calc(15vh + ${index * 20}px)` 
        }}
        className={`w-full max-w-5xl h-[60vh] md:h-[65vh] ${feature.bgColor} rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white/10 overflow-hidden flex flex-col md:flex-row relative origin-top`}
      >
        {/* Text Content */}
        <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center relative z-20">
          <div className="w-12 h-12 rounded-xl bg-[rgba(201,169,110,0.15)] flex items-center justify-center mb-6 shadow-sm border border-[rgba(201,169,110,0.1)]">
            <feature.icon className="w-6 h-6 text-[#C9A96E]" />
          </div>
          <h3 className={`font-heading text-3xl md:text-4xl font-bold ${feature.textColor} mb-4`}>
            {feature.title}
          </h3>
          <p className={`text-base md:text-lg ${feature.descColor} mb-8 max-w-md leading-relaxed`}>
            {feature.description}
          </p>
          <Link href="/features" className="flex items-center gap-2 text-[#C9A96E] font-medium group transition-all w-fit">
            Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Interactive Demo Container */}
        <div className="w-full md:w-[55%] h-full bg-black/[0.04] relative overflow-hidden flex items-center justify-center p-4 md:p-10">
          {/* subtle pattern behind demo */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="w-full h-full max-h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 relative group z-10 ring-1 ring-black/5">
            <feature.demo />
            
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[9px] uppercase tracking-widest px-3 py-1 rounded-full font-bold border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Interactive Demo
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function FeaturesStickyScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="relative w-full">
      {/* 
        Apply the tall height ONLY on medium screens and up, 
        so mobile doesn't get thousands of pixels of empty space 
      */}
      <div 
        ref={containerRef} 
        className="relative w-full md:h-[400vh]"
      >
        
        {/* Decorative Background for the entire section (Outside part) */}
        <div className="absolute inset-0 bg-[#F5F1EB] pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[5%] left-[5%] w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[#4F7DF3]/10 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        {/* Desktop Sticky Scroll */}
        <div className="hidden md:block relative z-10">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.id}
              feature={feature}
              index={index}
              progress={scrollYProgress}
              total={features.length}
            />
          ))}
        </div>

        {/* Mobile Fallback: Normal Stack */}
        <div className="md:hidden flex flex-col gap-8 px-4 py-16 relative z-10">
          <div className="text-center mb-4">
            <span className="text-[#C9A96E] text-xs font-bold uppercase tracking-widest">Features</span>
            <h2 className="font-heading text-3xl font-bold text-[#1E1B2E] mt-2">Everything you need</h2>
          </div>
          {features.map((feature, i) => (
            <div key={i} className={`w-full h-[580px] ${feature.bgColor} rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col relative border border-black/5`}>
              <div className="p-6 pb-4 relative z-20">
                <feature.icon className="w-8 h-8 text-[#C9A96E] mb-4" />
                <h3 className={`font-heading text-2xl font-bold ${feature.textColor} mb-2`}>{feature.title}</h3>
                <p className={`${feature.descColor} mb-4 text-sm`}>{feature.description}</p>
              </div>
              <div className="flex-1 p-4 pt-0 bg-black/[0.03] overflow-hidden relative z-10 flex flex-col justify-end">
                <div className="w-full h-[90%] rounded-xl overflow-hidden shadow-2xl border border-black/10">
                  <feature.demo />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
