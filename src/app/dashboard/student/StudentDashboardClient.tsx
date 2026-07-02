"use client";

import Link from "next/link";
import { Trophy, BookOpen, Star, Sparkles } from "lucide-react";

export default function StudentDashboardClient({ user, enrollments, marks, certificates }: any) {
  return (
    <div className="font-sans pb-12">
      {/* 3. WELCOME SECTION */}
      <div
        className="pt-8 pb-8"
      >
        <h1 className="font-heading text-[28px] text-[#1E1B2E] mb-2">
          Welcome back, {user?.name?.split(" ")[0] || "Student"}!
        </h1>
        <p className="text-[14px] text-[#8E8E93]">
          Ready to level up your skills today?
        </p>
      </div>

      {/* 4. STATS CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Points */}
        <div
          className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[12px] uppercase tracking-[0.08em] text-[#8E8E93] font-semibold">Total Points</span>
            <Trophy className="w-5 h-5 text-[#8E8E93]" />
          </div>
          <div className="font-heading text-[32px] text-[#1E1B2E] mb-1 leading-tight">
            {user?.points ?? 0}
          </div>
          <div className="text-[13px] text-[#8E8E93]">Keep earning!</div>
        </div>

        {/* Enrolled Courses */}
        <div
          className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[12px] uppercase tracking-[0.08em] text-[#8E8E93] font-semibold">Enrolled Courses</span>
            <BookOpen className="w-5 h-5 text-[#8E8E93]" />
          </div>
          <div className="font-heading text-[32px] text-[#1E1B2E] mb-1 leading-tight">
            {enrollments.length}
          </div>
          <div className="text-[13px] text-[#8E8E93]">
            {enrollments.length === 0 ? "Browse and enroll now" : "In progress"}
          </div>
        </div>

        {/* Avg. Score */}
        <div
          className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[12px] uppercase tracking-[0.08em] text-[#8E8E93] font-semibold">Avg. Score</span>
            <Star className="w-5 h-5 text-[#8E8E93]" />
          </div>
          <div className="font-heading text-[32px] text-[#1E1B2E] mb-1 leading-tight">
            {marks.length > 0
              ? Math.round(marks.reduce((s: any, m: any) => s + m.score, 0) / marks.length) + "%"
              : "--"}
          </div>
          <div className="text-[13px] text-[#8E8E93]">Across all subjects</div>
        </div>
      </div>

      {/* 5. TWO-COLUMN LAYOUT BELOW STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: My Courses */}
        <div
          className="lg:col-span-2 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-[24px] text-[#1E1B2E]">My Courses</h2>
            <Link href="/courses" className="text-[14px] text-[#C9A96E] hover:underline font-medium">
              Browse Courses →
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-[16px] p-[60px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center text-center">
              <BookOpen className="w-[48px] h-[48px] text-[#1E1B2E] opacity-30" />
              <h3 className="font-heading text-[20px] text-[#1E1B2E] mt-4 mb-3">No Courses Yet</h3>
              <p className="text-[14px] text-[#8E8E93] max-w-[400px] leading-relaxed mb-6 mx-auto">
                You haven't enrolled in any courses yet. Discover our premium curriculum and start your journey today.
              </p>
              <Link href="/courses">
                <button className="h-[44px] px-6 bg-[#1E1B2E] text-white rounded-xl text-[14px] font-medium hover:scale-[1.02] transition-transform">
                  Explore Courses
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {enrollments.slice(0, 4).map((enr: any) => (
                <div
                  key={enr.id}
                  className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col"
                >
                  <div className="relative w-full h-[140px] rounded-[12px] overflow-hidden mb-4 bg-[#F5F1EB]">
                    {enr.course.thumbnail ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={enr.course.thumbnail} alt={enr.course.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-[#1E1B2E] opacity-20" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading text-[18px] text-[#1E1B2E] leading-snug mb-1 line-clamp-2">
                    {enr.course.title}
                  </h3>
                  <p className="text-[13px] text-[#8E8E93] mb-5">
                    {enr.course.teacher.name}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-[12px] font-medium text-[#1E1B2E] mb-2">
                      <span>Progress</span>
                      <span>{enr.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F5F1EB] rounded-full overflow-hidden mb-5">
                      <div 
                        className="h-full bg-[#C9A96E] rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${enr.progress}%` }} 
                      />
                    </div>
                    <Link href={`/dashboard/student/courses/${enr.course.id}`} className="block">
                      <button className="w-full h-[40px] bg-[#C9A96E] text-[#1E1B2E] rounded-lg font-medium text-[14px] flex items-center justify-center transition-transform hover:scale-[1.02]">
                        Continue Learning
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: AI Tutor & Others */}
        <div className="space-y-6 pt-12 lg:pt-0 lg:mt-11">
          <div
            className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-[#C9A96E]" />
              <h3 className="font-heading text-[18px] text-[#1E1B2E]">AI Study Tutor</h3>
            </div>
            <p className="text-[13px] text-[#8E8E93] leading-[1.6] mb-6">
              Stuck on a problem? The AI Tutor knows Python, AI&ML, Web Dev, and more — available 24/7!
            </p>
            <Link href="/dashboard/student/ai-tutor" className="block w-full">
              <button className="w-full h-[44px] bg-[#C9A96E] text-[#1E1B2E] rounded-xl text-[14px] font-medium hover:scale-[1.02] transition-transform">
                Chat with AI
              </button>
            </Link>
          </div>

          <div
          >
            {certificates.length > 0 && (
              <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-6">
                <h3 className="font-heading text-[18px] text-[#1E1B2E] mb-4">Recent Certificates</h3>
                <div className="space-y-4">
                  {certificates.slice(0, 3).map((cert: any, i: number) => (
                    <div key={i} className="flex justify-between items-center pb-4 border-b border-[rgba(0,0,0,0.04)] last:border-0 last:pb-0">
                      <span className="text-[14px] text-[#1E1B2E] font-medium truncate pr-2">{cert.title}</span>
                      <span className="text-[12px] text-[#8E8E93]">
                        {new Date(cert.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {marks.length > 0 && (
              <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <h3 className="font-heading text-[18px] text-[#1E1B2E] mb-4">Recent Scores</h3>
                <div className="space-y-4">
                  {marks.slice(0, 5).map((m: any, i: number) => (
                    <div key={i} className="flex justify-between items-center pb-4 border-b border-[rgba(0,0,0,0.04)] last:border-0 last:pb-0">
                      <span className="text-[14px] text-[#1E1B2E] font-medium truncate pr-2">{m.subject}</span>
                      <span className={`text-[14px] font-bold ${m.score >= 90 ? "text-[#C9A96E]" : m.score >= 75 ? "text-[#C9A96E]" : "text-[#1E1B2E]"}`}>
                        {m.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
