"use client";

import { Users, School, BookOpen, ShieldCheck, Activity, Globe } from "lucide-react";

export default function AdminOverviewClient({ 
  userCount, instCount, courseCount, teacherCount, recentUsers 
}: { 
  userCount: number; instCount: number; courseCount: number; teacherCount: number; recentUsers: any[] 
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch(role.toLowerCase()) {
      case 'teacher':
        return "bg-[rgba(201,169,110,0.12)] text-[#C9A96E]";
      case 'student':
        return "bg-[rgba(30,27,46,0.06)] text-[#1E1B2E]";
      case 'parent':
        return "bg-[rgba(245,158,11,0.1)] text-[#F59E0B]";
      case 'superadmin':
        return "bg-[rgba(30,27,46,0.1)] text-[#1E1B2E] border border-[rgba(30,27,46,0.15)]";
      default:
        return "bg-[rgba(30,27,46,0.06)] text-[#1E1B2E]";
    }
  };

  return (
    <div className="flex flex-col bg-[#F5F1EB] min-h-screen w-full font-sans pb-20 overflow-x-hidden min-w-0">
      
      {/* PAGE HEADER */}
      <div className="pt-[8px] px-[32px] mb-[24px]">
        <p className="font-sans text-[14px] text-[#8E8E93]">Live platform analytics and monitoring.</p>
      </div>

      <div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col w-full min-w-0"
      >
        {/* STATS CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] px-[32px] pb-[24px] w-full">
          {[
            { label: "Total Users", value: userCount, icon: Users, sub: "Platform-wide" },
            { label: "Institutions", value: instCount, icon: School, sub: "Onboarded" },
            { label: "Active Courses", value: courseCount, icon: BookOpen, sub: "Published globally" },
            { label: "Faculty", value: teacherCount, icon: ShieldCheck, sub: "Verified teachers" },
          ].map((stat, i) => (
            <div 
              key={i} 
              variants={itemVariants}
              className="bg-white rounded-[16px] p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col w-full"
            >
              <div className="flex items-center justify-between mb-[16px]">
                <span className="font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">
                  {stat.label}
                </span>
                <stat.icon size={20} className="text-[#8E8E93]" />
              </div>
              <div className="font-heading text-[32px] text-[#1E1B2E] leading-none mb-[8px]">
                {stat.value}
              </div>
              <div className="font-sans text-[13px] text-[#8E8E93]">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-[24px] px-[32px] w-full min-w-0">
          
          {/* RECENT REGISTRATIONS (2/3) */}
          <div
            className="lg:w-2/3 bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden w-full min-w-0 flex flex-col"
          >
            <div className="px-[24px] py-[20px] flex items-center justify-between border-b border-[rgba(30,27,46,0.04)]">
              <h3 className="font-heading text-[18px] text-[#1E1B2E] flex items-center gap-[8px]">
                <Activity size={18} className="text-[#1E1B2E]" /> Recent Registrations
              </h3>
              <Globe size={16} className="text-[#8E8E93]" />
            </div>
            
            <div className="w-full overflow-x-auto min-w-0">
              <table className="w-full text-left whitespace-nowrap min-w-0">
                <thead className="bg-[rgba(245,241,235,0.6)]">
                  <tr>
                    <th className="py-[14px] px-[24px] font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">Name</th>
                    <th className="py-[14px] px-[24px] font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">Email</th>
                    <th className="py-[14px] px-[24px] font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">Role</th>
                    <th className="py-[14px] px-[24px] font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] text-right">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u: any, i: number) => (
                    <tr key={i} className="border-b border-[rgba(30,27,46,0.04)] hover:bg-[rgba(245,241,235,0.4)] transition-colors duration-150 last:border-b-0">
                      <td className="py-[16px] px-[24px] font-sans text-[14px] font-medium text-[#1E1B2E]">{u.name}</td>
                      <td className="py-[16px] px-[24px] font-sans text-[13px] text-[#8E8E93]">{u.email}</td>
                      <td className="py-[16px] px-[24px]">
                        <span className={`inline-flex items-center font-sans text-[11px] px-[10px] py-[4px] rounded-full uppercase font-medium tracking-wider ${getRoleBadgeStyle(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-[16px] px-[24px] font-sans text-[13px] text-[#8E8E93] text-right">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MASTER CONTROLS (1/3) */}
          <div
            className="lg:w-1/3 bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.05)] p-[24px] w-full min-w-0 flex flex-col"
          >
            <h3 className="font-heading text-[18px] text-[#1E1B2E] mb-[20px]">Master Controls</h3>
            
            <div className="flex flex-col gap-[12px]">
              
              {/* DATABASE SYNC */}
              <div className="bg-white border border-[rgba(30,27,46,0.08)] rounded-xl p-[16px] flex items-center gap-[12px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#C9A96E] shadow-[0_0_8px_rgba(201,169,110,0.4)] shrink-0"></div>
                <div className="flex flex-col">
                  <span className="font-sans text-[12px] uppercase tracking-[0.08em] text-[#8E8E93]">DATABASE SYNC</span>
                  <span className="font-sans text-[13px] font-medium text-[#1E1B2E] mt-[2px]">SQLITE-LIVE-SYNC</span>
                </div>
              </div>

              {/* SERVER STATUS */}
              <div className="bg-white border border-[rgba(30,27,46,0.08)] rounded-xl p-[16px] flex items-center gap-[12px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#8E8E93] shrink-0"></div>
                <div className="flex flex-col">
                  <span className="font-sans text-[12px] uppercase tracking-[0.08em] text-[#8E8E93]">SERVER STATUS</span>
                  <span className="font-sans text-[13px] font-medium text-[#1E1B2E] mt-[2px]">OPTIMIZED-NEXTJS</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
