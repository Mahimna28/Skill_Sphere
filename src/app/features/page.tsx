"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles, BookOpen, MessageSquare, Trophy,
  Users, Shield, Zap, Play, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    id: "ai-tutor",
    icon: Sparkles,
    title: "AI Study Tutor",
    tag: "Most Popular",
    desc: "Get 24/7 academic help from our integrated Gemini AI assistant. It can explain complex topics, solve problems, and summarize lessons instantly.",
    videoUrl: "/videos/ai_tutor_video.mp4",
    color: "bg-[#F5C84C]",
    points: ["Context-aware responses", "Interactive problem solving", "Lesson summarization"]
  },
  {
    id: "smart-learning",
    icon: BookOpen,
    title: "Smart Course Player",
    tag: "Interactive",
    desc: "Structured courses with modules and interactive lessons. Track your progress and pick up exactly where you left off with our modern player.",
    videoUrl: "/videos/smart_course_player.mp4",
    color: "bg-[#4F7DF3]",
    points: ["Progress tracking", "HD Video streaming", "Resource downloads"]
  },
  {
    id: "social-learning",
    icon: MessageSquare,
    title: "Course Communities",
    tag: "Collaborative",
    desc: "Dedicated course chat rooms. Collaborate with peers, share resources, and learn together in real-time.",
    videoUrl: "/videos/Course_Communities1.mp4",
    color: "bg-[#34D399]",
    points: ["Real-time group chat", "Peer-to-peer sharing", "Instructor Q&A"]
  },
  {
    id: "gamification",
    icon: Trophy,
    title: "Gamified Progress",
    tag: "Rewarding",
    desc: "Earn points for every course activity. Compete on global leaderboards and showcase your expertise to the community.",
    videoUrl: "/videos/Gamified_Progress.mp4",
    color: "bg-[#4F7DF3]",
    points: ["Global leaderboards", "Achievement badges", "Skill point accumulation"]
  },
  {
    id: "parent-portal",
    icon: Users,
    title: "Parent Portal",
    tag: "Transparent",
    desc: "A dedicated portal for parents to monitor attendance, marks, and academic growth without interrupting the learning flow.",
    videoUrl: "/videos/Parent_Portal.mp4",
    color: "bg-[#34D399]",
    points: ["Attendance reports", "Grade monitoring", "Direct teacher contact"]
  },
  {
    id: "admin-panel",
    icon: Shield,
    title: "Admin Analytics",
    tag: "Control",
    desc: "Complete control over user management, course approvals, and institution-wide analytics for administrators.",
    videoUrl: "/videos/Admin_Analytics.mp4",
    color: "bg-[#F5C84C]",
    points: ["Institutional hierarchy", "Detailed analytics", "Bulk user management"]
  }
];

export default function FeaturesPage() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <div className="inline-block bg-[#F5C84C] px-4 py-1.5 border-4 border-black font-black text-sm uppercase mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          The Future of Learning
        </div>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.85]">
          Powerful <span className="text-[#4F7DF3]">Features</span> <br />
          Built for <span className="underline decoration-[#34D399] decoration-8 underline-offset-8">Success</span>
        </h1>
        <p className="text-xl font-bold text-muted-foreground max-w-2xl mx-auto">
          Explore the tools and integrations that make Skill Sphere the most advanced learning management system today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isEven = index % 2 === 0;

          return (
            <div
              key={feature.id}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Text Content */}
              <div className="flex-1 w-full">
                <div className={`inline-block ${feature.color} border-2 border-black px-3 py-1 font-black text-[10px] uppercase mb-4`}>
                  {feature.tag}
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 border-4 border-black rounded-2xl ${feature.color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
                    <Icon size={32} />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{feature.title}</h2>
                </div>
                <p className="text-xl font-bold text-muted-foreground mb-8 leading-relaxed">
                  {feature.desc}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {feature.points.map((point, i) => (
                    <div key={i} className="flex items-center gap-2 font-black text-sm uppercase">
                      <CheckCircle2 className="text-[#34D399] w-5 h-5 shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              {/* Video/Visual Section */}
              <div className="flex-1 w-full">
                <div className="relative aspect-video bg-white border-4 border-black rounded-[2rem] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden group">
                  {/* Overlay for hover message if not hovered */}
                  {hoveredFeature !== feature.id && (
                    <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center transition-opacity cursor-pointer">
                      <div className="bg-white border-4 border-black p-4 rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                        <Play size={40} className="fill-black ml-1" />
                      </div>
                      <p className="absolute bottom-8 text-white font-black uppercase tracking-widest text-xs">Hover to Preview</p>
                    </div>
                  )}

                  {/* Video Element */}
                  <VideoPlayer src={feature.videoUrl} isPlaying={hoveredFeature === feature.id} />

                  {/* Decorative Elements */}
                  <div className="absolute top-6 right-6 w-12 h-12 border-4 border-black bg-[#F5C84C] rounded-xl z-20 hidden md:block"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-32 bg-[#4F7DF3] border-4 border-black p-12 md:p-20 text-center relative overflow-hidden rounded-[3rem] shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8">
            Ready to Transform <br /> Your Learning?
          </h2>
          <Button size="lg" className="bg-white text-black font-black border-4 border-black h-18 px-12 text-2xl hover:bg-[#F5C84C] transition-colors rounded-2xl">
            GET STARTED FOR FREE
          </Button>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://patterns.dev/img/grid.svg')] opacity-10 pointer-events-none"></div>
      </div>
    </div>
  );
}

function VideoPlayer({ src, isPlaying }: { src: string; isPlaying: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => console.log("Video play interrupted"));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      preload="auto"
      className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all"
    />
  );
}
