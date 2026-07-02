"use client";

import { Trophy, Crown, ChevronDown } from "lucide-react";

interface Student {
  id: string;
  name: string;
  points: number;
  image?: string | null;
}

export default function LeaderboardClient({ students, currentUserId }: { students: Student[], currentUserId: string }) {
  return (
    <div className="font-sans pb-12 pt-8 max-w-[640px] mx-auto">
      {/* 3. HERO SECTION */}
      <div
        className="flex flex-col items-center text-center pt-10 pb-12"
      >
        <Trophy className="w-12 h-12 text-[#C9A96E] stroke-[1.5]" />
        <h1 className="font-heading text-[32px] text-[#1E1B2E] mt-4">
          Global Leaderboard
        </h1>
        <p className="text-[14px] text-[#8E8E93] mt-2">
          Earn points by completing courses and assignments!
        </p>
      </div>

      {/* 4. RANKINGS CARD */}
      <div
        className="bg-white rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden"
      >
        <div className="px-6 pt-6 pb-4 flex justify-between items-center">
          <h2 className="font-heading text-[20px] text-[#1E1B2E]">Rankings</h2>
          <div className="flex items-center text-[13px] text-[#8E8E93] cursor-pointer hover:text-[#1E1B2E] transition-colors">
            All Time
            <ChevronDown className="w-4 h-4 ml-1" />
          </div>
        </div>
        <div className="h-px w-full bg-[rgba(30,27,46,0.06)]" />

        {students.length === 0 ? (
          <div className="p-[60px] flex flex-col items-center text-center">
            <Trophy className="w-12 h-12 text-[#1E1B2E] opacity-25" />
            <h3 className="font-heading text-[20px] text-[#1E1B2E] mt-4">No rankings yet</h3>
            <p className="text-[14px] text-[#8E8E93] mt-2">Start completing courses to earn points and appear on the leaderboard!</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {students.map((user, index) => {
              const rank = index + 1;
              const isCurrentUser = user.id === currentUserId;

              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between px-6 relative ${
                    rank === 1 ? "py-5" : "py-4"
                  } ${isCurrentUser ? "bg-[rgba(201,169,110,0.06)]" : ""} ${
                    index !== students.length - 1 ? "border-b border-[rgba(30,27,46,0.04)]" : ""
                  }`}
                >
                  {/* Subtle pulse animation for current user row */}
                  {isCurrentUser && (
                    <div
                      className="absolute inset-0 bg-[rgba(201,169,110,0.1)] pointer-events-none"
                    />
                  )}
                  
                  <div className="flex items-center gap-4 z-10">
                    {/* Rank Badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      rank === 1 ? "bg-[rgba(201,169,110,0.15)] text-[#C9A96E] font-bold text-[14px]" :
                      rank === 2 ? "bg-[rgba(142,142,147,0.12)] text-[#8E8E93] font-bold text-[14px]" :
                      rank === 3 ? "bg-[rgba(184,149,106,0.15)] text-[#B8956A] font-bold text-[14px]" :
                      "bg-[rgba(30,27,46,0.06)] text-[#1E1B2E] font-medium text-[14px]"
                    }`}>
                      {rank === 1 ? <Crown className="w-4 h-4 text-[#C9A96E]" /> : rank}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                          src={user.image} 
                          alt={user.name} 
                          className={`object-cover rounded-full ${rank === 1 ? "w-10 h-10 ring-[2px] ring-[rgba(201,169,110,0.3)] ring-offset-2 ring-offset-white" : "w-9 h-9"}`} 
                        />
                      ) : (
                        <div className={`rounded-full bg-[#F5F1EB] flex items-center justify-center font-bold text-[#1E1B2E] ${rank === 1 ? "w-10 h-10 ring-[2px] ring-[rgba(201,169,110,0.3)] ring-offset-2 ring-offset-white" : "w-9 h-9"}`}>
                          {user.name?.charAt(0) || "U"}
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <span className={`text-[#1E1B2E] ${rank === 1 ? "text-[16px] font-medium" : "text-[15px] font-medium"}`}>
                          {user.name}
                        </span>
                        {isCurrentUser && (
                          <span className="ml-2 bg-[rgba(201,169,110,0.12)] text-[#C9A96E] text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wide font-medium">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="flex items-baseline z-10">
                    <span className="font-heading text-[20px] text-[#1E1B2E]">
                      {user.points.toLocaleString()}
                    </span>
                    <span className="text-[12px] text-[#8E8E93] ml-1">pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
