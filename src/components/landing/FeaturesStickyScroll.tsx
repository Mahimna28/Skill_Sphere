"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sparkles, BookOpen, Users, Trophy, Play, CheckCircle2, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

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
    <div className="w-full h-full bg-[#1E1B2E] p-6 flex flex-col font-sans relative overflow-hidden rounded-2xl shadow-xl border border-white/10">
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#C9A96E]/20 rounded-full blur-[40px] pointer-events-none"></div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative z-10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] shadow-sm ${msg.role === 'user' ? 'bg-[#C9A96E] text-[#1E1B2E] font-medium rounded-tr-sm' : 'bg-white/10 backdrop-blur-md text-white rounded-tl-sm border border-white/10'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl rounded-tl-sm flex gap-1.5 shadow-sm">
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
            className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-between group shadow-sm cursor-pointer relative z-20"
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
    <div className="w-full h-full bg-white flex flex-col font-sans rounded-2xl overflow-hidden shadow-2xl border border-black/5">
      <div className="relative w-full h-[60%] bg-[#1E1B2E] overflow-hidden group">
        <div className={`w-full h-full bg-[#2A2540] transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-60'}`} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-[#C9A96E] flex items-center justify-center text-[#1E1B2E] shadow-xl transform transition-transform hover:scale-110 z-20 cursor-pointer"
          >
            {isPlaying ? (
              <div className="flex gap-1.5">
                <div className="w-1.5 h-5 bg-[#1E1B2E] rounded-full"></div>
                <div className="w-1.5 h-5 bg-[#1E1B2E] rounded-full"></div>
              </div>
            ) : (
              <Play size={28} className="ml-1" fill="currentColor" />
            )}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20 z-10">
          <div className="h-full bg-[#C9A96E] transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(201,169,110,0.8)]" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      <div className="flex-1 p-6 bg-[#F5F1EB] overflow-y-auto">
        <h4 className="font-heading font-bold text-[#1E1B2E] text-lg mb-4">Module 1: Introduction</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-black/5 shadow-sm transform transition-transform hover:-translate-y-1 cursor-pointer">
            <span className="text-sm font-medium flex items-center gap-3 text-[#1E1B2E]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? 'bg-[#C9A96E]/20 text-[#C9A96E]' : 'bg-gray-100 text-gray-400'}`}>
                {isPlaying ? <div className="w-2.5 h-2.5 bg-[#C9A96E] rounded-full animate-pulse"></div> : <Play size={12} fill="currentColor"/>}
              </div>
              1.1 Welcome to the Course
            </span>
            <span className="text-xs font-semibold text-gray-400">2:45</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-black/5 shadow-sm opacity-70">
            <span className="text-sm font-medium flex items-center gap-3 text-gray-600">
              <CheckCircle2 size={20} className="text-green-500"/> 
              1.2 Environment Setup
            </span>
            <span className="text-xs font-semibold text-gray-400">5:12</span>
          </div>
        </div>
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
    { rank: 1, name: 'Student A', xp: 12450 },
    { rank: 2, name: 'Student B', xp: 11200 },
    { rank: isUp ? 4 : 3, name: 'Student C', xp: 9800 },
    { rank: isUp ? 3 : 4, name: 'User', xp: isUp ? 10100 : 9650, isMe: true },
  ].sort((a, b) => a.rank - b.rank);

  return (
    <div className="w-full h-full bg-white p-6 md:p-8 font-sans flex flex-col relative overflow-hidden rounded-2xl shadow-xl border border-black/5">
      <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-[50px] pointer-events-none"></div>
      
      <h3 className="font-heading font-bold text-[#1E1B2E] text-2xl mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
          <Trophy size={22} className="text-yellow-500" />
        </div>
        Global Leaderboard
      </h3>
      <div className="flex-1 space-y-4 relative z-10">
        <AnimatePresence>
          {users.map((u) => (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={u.name}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${u.isMe ? 'bg-[#1E1B2E] text-white border-[#1E1B2E] shadow-xl transform scale-[1.02]' : 'bg-white border-gray-100 text-[#1E1B2E] hover:border-gray-200 shadow-sm'}`}
            >
              <div className="flex items-center gap-5">
                <span className={`font-black text-xl w-8 text-center ${u.rank <= 3 ? (u.isMe ? 'text-[#C9A96E]' : 'text-yellow-500') : (u.isMe ? 'text-white/50' : 'text-gray-300')}`}>
                  {u.rank}
                </span>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${u.isMe ? 'bg-[#C9A96E] text-[#1E1B2E]' : 'bg-[#F5F1EB] text-[#1E1B2E]'}`}>
                    {u.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-base">{u.name}</span>
                </div>
              </div>
              <span className={`text-base font-black tracking-wide ${u.isMe ? 'text-[#C9A96E]' : 'text-gray-400'}`}>
                {u.xp.toLocaleString()} XP
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT --- //

export function FeatureCardsAsymmetric() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = containerRef.current.querySelectorAll(".feature-card");
    
    if (prefersReduced) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    cards.forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-[#F5F1EB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-24 md:gap-32">
        
        {/* Card 1: AI Study Tutor (Full-width, split 50/50) */}
        <div className="feature-card flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 order-2 lg:order-1">
            <div className="w-16 h-16 bg-[#1E1B2E] rounded-2xl flex items-center justify-center mb-8 shadow-lg">
              <Sparkles className="w-8 h-8 text-[#C9A96E]" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1E1B2E] leading-tight mb-6">
              AI Study Tutor
            </h2>
            <p className="text-lg text-[#6B6B6B] leading-relaxed mb-8 max-w-xl">
              Ask anything, get instant explanations. Our AI tutor is available 24/7 for every course and topic, adapting to your unique learning pace.
            </p>
          </div>
          <div className="flex-1 w-full order-1 lg:order-2 h-[400px] lg:h-[500px]">
            <AITutorDemo />
          </div>
        </div>

        {/* Card 2: Interactive Courses (Offset) */}
        <div className="feature-card relative lg:h-[600px] flex flex-col lg:block">
          <div className="w-full lg:w-[65%] h-[400px] lg:h-full lg:absolute right-0 top-0 mb-8 lg:mb-0">
            <CoursesDemo />
          </div>
          <div className="w-full lg:w-[45%] lg:absolute left-0 top-1/2 lg:-translate-y-1/2 bg-white rounded-3xl p-10 md:p-14 shadow-2xl z-10 border border-black/5">
            <div className="w-16 h-16 bg-[rgba(201,169,110,0.1)] rounded-2xl flex items-center justify-center mb-8">
              <BookOpen className="w-8 h-8 text-[#C9A96E]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E1B2E] mb-6">
              Interactive Courses
            </h2>
            <p className="text-lg text-[#6B6B6B] leading-relaxed">
              Ditch the boring lectures. Learn by doing with interactive environments, real-time feedback, and bite-sized modules designed for retention.
            </p>
          </div>
        </div>

        {/* Card 3: Community (Full-width dark navy) */}
        <div className="feature-card w-full bg-[#1E1B2E] rounded-[2.5rem] p-10 md:p-20 text-center flex flex-col items-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A96E]/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9A96E]/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-10 mx-auto backdrop-blur-md">
              <Users className="w-10 h-10 text-[#C9A96E]" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8">
              Learn Together
            </h2>
            <p className="text-xl text-[rgba(255,255,255,0.7)] leading-relaxed mb-12">
              Join a global community of learners. Collaborate on projects, share knowledge, and build your network in a supportive, gamified environment.
            </p>
            <div className="w-full max-w-2xl mx-auto h-[300px] rounded-2xl overflow-hidden shadow-2xl">
              <CommunityDemo />
            </div>
          </div>
        </div>

        {/* Card 4: Gamification (Text left 40%, Mockup right 60%) */}
        <div className="feature-card flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-[40%]">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-md border border-black/5">
              <Trophy className="w-8 h-8 text-[#1E1B2E]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1E1B2E] mb-6">
              Gamified Progress
            </h2>
            <p className="text-lg text-[#6B6B6B] leading-relaxed mb-8">
              Turn learning into an adventure. Earn experience points, unlock achievements, maintain your streak, and climb the global leaderboard.
            </p>
          </div>
          <div className="lg:w-[60%] w-full h-[450px]">
            <GamificationDemo />
          </div>
        </div>

      </div>
    </section>
  );
}

// Ensure we don't break existing imports if they look for FeaturesStickyScroll
export const FeaturesStickyScroll = FeatureCardsAsymmetric;

// Basic community demo for Card 3 since it was abstracted above
const CommunityDemo = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#F5F1EB] to-white p-6 flex flex-col font-sans relative text-left">
      <div className="font-heading font-bold text-[#1E1B2E] mb-6 pb-4 border-b border-black/10 flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
        General Discussion
      </div>
      <div className="flex-1 space-y-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-[#1E1B2E] text-[#C9A96E] flex items-center justify-center text-sm font-bold shrink-0">
            U
          </div>
          <div>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-bold text-[#1E1B2E]">User</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">2 hrs ago</span>
            </div>
            <p className="text-sm text-gray-700 bg-white p-4 rounded-xl rounded-tl-sm border border-black/5 shadow-sm">
              Has anyone figured out the final project for Module 4?
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-[#C9A96E] text-[#1E1B2E] flex items-center justify-center text-sm font-bold shrink-0">
            M
          </div>
          <div>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-bold text-[#1E1B2E]">Mentor</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Just now</span>
            </div>
            <p className="text-sm text-gray-700 bg-white p-4 rounded-xl rounded-tl-sm border border-black/5 shadow-sm">
              Yes! I'd recommend reviewing the section on dynamic programming first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
