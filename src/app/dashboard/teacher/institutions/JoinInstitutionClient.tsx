"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, Send, Search, LogOut, ShieldAlert, Building2, BookOpen, Users, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JoinInstitutionClient({ institutions, userInstitutionId, teacherData }: { institutions: any[], userInstitutionId: string | null | undefined, teacherData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [requestedId, setRequestedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveRequested, setLeaveRequested] = useState(false);

  const filteredInstitutions = institutions.filter(inst => 
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoin = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/institutions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ institutionId: id }),
      });
      if (res.ok) {
        setRequestedId(id);
        alert("Join request sent to Institution Admin!");
      } else {
        const d = await res.json();
        alert(d.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure? This will send a request to your Admin. You cannot join a new institution until approved.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/institutions/leave", { method: "POST" });
      if (res.ok) {
        setLeaveRequested(true);
        alert("Leave request sent to Admin!");
      } else {
        const d = await res.json();
        alert(d.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F1EB] font-sans pb-20 w-full min-w-0">
      <div className="w-full mx-auto min-w-0">
        
        {/* PAGE HEADER */}
        <FadeIn>
          <div className="pt-[8px] px-[32px] mb-[24px]">
            <p className="font-sans text-[14px] text-[#8E8E93]">Directly manage your institutional classes and affiliation.</p>
          </div>
        </FadeIn>

        {userInstitutionId ? (
          <SlideUp delay={0.1}>
            <div className="flex flex-col lg:flex-row gap-[24px] px-[32px] pb-[32px] w-full min-w-0">
              {/* LEFT COLUMN (2/3) */}
              <div className="lg:w-2/3 flex flex-col gap-[24px] min-w-0">
                
                {/* FACULTY AFFILIATION CARD */}
                <motion.div
                  whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                  className="bg-white rounded-[16px] p-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between w-full"
                >
                <div className="flex flex-col">
                  <span className="font-sans text-[12px] uppercase tracking-[0.08em] text-[#8E8E93] mb-[8px]">Faculty Affiliation</span>
                  <h2 className="font-heading text-[28px] text-[#1E1B2E] capitalize">
                    {teacherData?.institution?.name?.toLowerCase() || "rngpit"}
                  </h2>
                  <div className="mt-[12px] flex items-center gap-[8px]">
                    <div className="bg-[rgba(201,169,110,0.1)] text-[#C9A96E] flex items-center gap-[4px] px-[12px] py-[4px] rounded-full">
                      <CheckCircle2 size={12} />
                      <span className="font-sans text-[11px] font-medium">Verified Member</span>
                    </div>
                    {teacherData?.department && (
                      <div className="bg-[rgba(30,27,46,0.06)] text-[#1E1B2E] flex items-center gap-[4px] px-[12px] py-[4px] rounded-full">
                        <Building2 size={12} />
                        <span className="font-sans text-[11px] font-medium">{teacherData.department.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="w-[48px] h-[48px] rounded-full bg-[rgba(201,169,110,0.08)] flex items-center justify-center shrink-0 ml-[16px]">
                  <Check size={24} className="text-[#C9A96E]" />
                </div>
              </motion.div>

              {/* PRIVATE CLASSES SECTION */}
              <div className="mt-[8px] flex flex-col w-full min-w-0">
                <div className="flex items-center justify-between pb-[16px] border-b border-[rgba(30,27,46,0.06)]">
                  <h3 className="font-heading text-[20px] text-[#1E1B2E] flex items-center gap-[8px]">
                    <BookOpen size={18} className="text-[#1E1B2E]" /> Private Classes
                  </h3>
                  <Link href="/dashboard/teacher/courses">
                    <button className="h-[36px] px-[16px] rounded-xl bg-[#1E1B2E] text-white text-[13px] font-medium flex items-center gap-[6px] hover:scale-[1.02] transition-transform">
                      <Plus size={14} /> New Class
                    </button>
                  </Link>
                </div>

                <div className="mt-[16px] flex flex-col gap-[16px] w-full min-w-0">
                  {!teacherData?.courses || teacherData.courses.length === 0 ? (
                    <div className="p-[40px] text-center flex flex-col items-center justify-center">
                       <BookOpen size={40} className="text-[#1E1B2E] opacity-20 mb-[16px]" />
                       <h3 className="font-heading text-[18px] text-[#1E1B2E]">No private classes</h3>
                       <p className="font-sans text-[13px] text-[#8E8E93] mt-[8px]">Create a new class to manage your institutional students.</p>
                    </div>
                  ) : (
                    <StaggerContainer staggerDelay={0.05} className="mt-[16px] flex flex-col gap-[16px] w-full min-w-0">
                      {teacherData.courses.map((course: any, i: number) => (
                        <StaggerItem key={course.id}>
                          <motion.div 
                            whileHover={{ scale: 1.01 }}
                            className="bg-white rounded-[16px] p-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.05)] flex items-center justify-between w-full border border-[rgba(30,27,46,0.04)]"
                          >
                        <div className="flex items-center gap-[16px] min-w-0">
                          <div className="w-[40px] h-[40px] rounded-full bg-[rgba(201,169,110,0.1)] flex items-center justify-center shrink-0">
                            <BookOpen size={20} className="text-[#C9A96E]" />
                          </div>
                          <div className="flex flex-col min-w-0 overflow-hidden pr-4">
                            <span className="font-sans text-[16px] font-medium text-[#1E1B2E] truncate">{course.title}</span>
                            <span className="font-sans text-[13px] text-[#8E8E93] truncate">{course.subject}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-[24px] shrink-0">
                          <div className="hidden sm:flex items-center gap-[6px] text-[#8E8E93]">
                            <Users size={14} />
                            <span className="font-sans text-[13px]">{course._count.enrollments} Students</span>
                          </div>
                          <Link href={`/dashboard/teacher/courses/${course.id}`}>
                            <button className="h-[36px] px-[16px] rounded-xl border border-[#1E1B2E] text-[#1E1B2E] text-[13px] font-medium hover:bg-[#1E1B2E] hover:text-white transition-colors shrink-0">
                              Manage Class
                            </button>
                          </Link>
                        </div>
                          </motion.div>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (1/3) */}
            <div className="lg:w-1/3 flex flex-col min-w-0">
              <div
                className="bg-white rounded-[16px] p-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.05)] w-full"
              >
                <div className="flex items-center gap-[8px]">
                  <ShieldAlert size={18} className="text-[#DC2626]" />
                  <h3 className="font-sans text-[14px] font-medium text-[#DC2626]">Security Protocol</h3>
                </div>
                
                <p className="font-sans text-[13px] text-[#8E8E93] leading-[1.6] mt-[12px]">
                  As a verified faculty member of <strong className="text-[#1E1B2E] font-medium">{teacherData?.institution?.name}</strong>, you are restricted from joining other organizations.
                </p>

                <div className="mt-[20px]">
                  <p className="font-sans text-[12px] uppercase tracking-[0.08em] text-[#8E8E93] mb-[10px]">Hierarchy Rules</p>
                  <div className="flex flex-col gap-[8px]">
                    <div className="flex items-start gap-[8px]">
                      <div className="w-[6px] h-[6px] rounded-full bg-[#C9A96E] shrink-0 mt-[6px]"></div>
                      <span className="font-sans text-[13px] text-[#8E8E93]">Manage classes within your Dept.</span>
                    </div>
                    <div className="flex items-start gap-[8px]">
                      <div className="w-[6px] h-[6px] rounded-full bg-[#C9A96E] shrink-0 mt-[6px]"></div>
                      <span className="font-sans text-[13px] text-[#8E8E93]">Enroll students via direct Gmail.</span>
                    </div>
                    <div className="flex items-start gap-[8px]">
                      <div className="w-[6px] h-[6px] rounded-full bg-[#C9A96E] shrink-0 mt-[6px]"></div>
                      <span className="font-sans text-[13px] text-[#8E8E93]">Exit requires Admin Approval.</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-[rgba(30,27,46,0.06)] my-[20px]"></div>

                <button 
                  onClick={handleLeave} 
                  disabled={loading || leaveRequested}
                  className="w-full h-[44px] rounded-xl bg-[#DC2626] text-white font-sans text-[14px] font-medium flex items-center justify-center gap-[8px] hover:bg-[#B91C1C] hover:scale-[1.01] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? <Loader2 className="animate-spin w-[16px] h-[16px]" /> : (leaveRequested ? "Exit Pending Approval" : <><LogOut size={16} /> Request to Leave</>)}
                </button>
              </div>
            </div>
            </div>
          </SlideUp>
        ) : (
          /* UN-JOINED STATE: BROWSE INSTITUTIONS */
          <SlideUp delay={0.1}>
            <div className="px-[32px] pb-[32px] flex flex-col gap-[24px]">
              <div className="relative w-full max-w-md">
              <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#8E8E93]" size={18} />
              <Input 
                placeholder="Search for your school or college..." 
                className="w-full h-[44px] bg-white border border-[rgba(30,27,46,0.12)] rounded-full pl-[44px] pr-[16px] text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <StaggerContainer staggerDelay={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
              {filteredInstitutions.map((inst, i) => (
                <StaggerItem key={inst.id}>
                  <motion.div 
                    whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
                    className="bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col border border-[rgba(30,27,46,0.04)] h-full"
                  >
                    <div className="p-[24px] border-b border-[rgba(30,27,46,0.04)] bg-[#F5F1EB]/30">
                    <h3 className="font-heading text-[20px] text-[#1E1B2E] truncate">{inst.name}</h3>
                    <p className="font-sans text-[11px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mt-[4px]">{inst._count.members} Verified Members</p>
                  </div>
                  <div className="p-[24px] mt-auto">
                    <button 
                      onClick={() => handleJoin(inst.id)} 
                      disabled={loading || requestedId === inst.id}
                      className={`w-full h-[40px] rounded-xl font-sans text-[13px] font-medium flex items-center justify-center gap-[8px] transition-all
                        ${requestedId === inst.id 
                          ? 'bg-[rgba(30,27,46,0.06)] text-[#8E8E93]' 
                          : 'bg-[#1E1B2E] text-white hover:bg-[#C9A96E]'
                        } disabled:opacity-60`}
                    >
                      {loading && requestedId === inst.id ? <Loader2 className="animate-spin w-[14px] h-[14px]" /> : null}
                      {requestedId === inst.id ? "Request Pending" : "Request to Join"}
                    </button>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </SlideUp>
        )}
      </div>
    </div>
  );
}
