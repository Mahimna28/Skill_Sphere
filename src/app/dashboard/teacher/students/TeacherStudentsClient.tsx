"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/animations";
import { Search, MessageSquare, Users } from "lucide-react";

interface Enrollment {
  user: { name: string; email: string };
  course: { title: string };
}

export default function TeacherStudentsClient({ enrollments }: { enrollments: Enrollment[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = enrollments.filter(en => 
    en.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    en.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    en.course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#F5F1EB] font-sans pb-20 min-w-0 w-full">
      <div className="w-full mx-auto min-w-0">
        
        {/* PAGE HEADER */}
        <FadeIn>
          <div className="pt-[8px] px-[32px] mb-[20px]">
            <p className="font-sans text-[14px] text-[#8E8E93]">Track progress and communicate with your class.</p>
          </div>
        </FadeIn>

        {/* SEARCH BAR (Right aligned above table) */}
        <FadeIn delay={0.1}>
          <div className="px-[32px] pb-[16px] flex justify-end w-full">
            <div className="relative">
              <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#8E8E93]" size={18} />
              <input 
                type="text"
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-[320px] h-[44px] bg-white border border-[rgba(30,27,46,0.12)] rounded-full pl-[44px] pr-[16px] text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all"
              />
            </div>
          </div>
        </FadeIn>

        {/* STUDENTS TABLE CARD */}
        <SlideUp delay={0.2}>
          <div className="mx-[32px] mb-[32px] bg-white rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden w-auto min-w-0">
            {enrollments.length === 0 ? (
              <div className="p-[50px] flex flex-col items-center justify-center text-center">
                <Users size={40} className="text-[#1E1B2E] opacity-20" />
                <h3 className="font-heading text-[18px] text-[#1E1B2E] mt-[16px]">No students found</h3>
                <p className="font-sans text-[13px] text-[#8E8E93] mt-2">Try adjusting your search</p>
              </div>
            ) : (
              <div className="w-full min-w-0">
                
                {/* CSS GRID HEADER */}
                <div className="grid grid-cols-[35%_20%_15%_30%] w-full bg-[#F5F1EB] items-center border-b border-[rgba(30,27,46,0.05)]">
                  <div className="py-[16px] px-[28px] font-sans text-[11px] uppercase tracking-[0.08em] font-semibold text-[#8E8E93] text-left">Student Name</div>
                  <div className="py-[16px] px-[28px] font-sans text-[11px] uppercase tracking-[0.08em] font-semibold text-[#8E8E93] text-left">Course</div>
                  <div className="py-[16px] px-[28px] font-sans text-[11px] uppercase tracking-[0.08em] font-semibold text-[#8E8E93] text-left">Status</div>
                  <div className="py-[16px] px-[28px] font-sans text-[11px] uppercase tracking-[0.08em] font-semibold text-[#8E8E93] text-right">Actions</div>
                </div>

                {/* CSS GRID ROWS */}
                <div className="w-full flex flex-col min-w-0">
                  {filtered.length === 0 ? (
                    <div className="py-[50px] text-center w-full">
                      <Users size={40} className="text-[#1E1B2E] opacity-20 mx-auto" />
                      <h3 className="font-heading text-[18px] text-[#1E1B2E] mt-[16px]">No students found</h3>
                      <p className="font-sans text-[13px] text-[#8E8E93] mt-2">Try adjusting your search</p>
                    </div>
                  ) : (
                    <StaggerContainer staggerDelay={0.05} className="w-full flex flex-col min-w-0">
                      {filtered.map((en, i) => (
                        <StaggerItem key={i}>
                          <motion.div 
                            whileHover={{ backgroundColor: "rgba(245,241,235,0.8)" }}
                            className="grid grid-cols-[35%_20%_15%_30%] w-full items-center border-b border-[rgba(30,27,46,0.05)] transition-colors duration-150"
                          >
                            <div className="py-[18px] px-[28px] flex items-center overflow-hidden min-w-0">
                              <div className="w-[40px] h-[40px] rounded-full bg-[rgba(201,169,110,0.15)] text-[#C9A96E] font-heading font-bold flex items-center justify-center text-[16px] shrink-0 mr-[14px]">
                                {en.user.name.charAt(0)}
                              </div>
                              <div className="overflow-hidden min-w-0">
                                <div className="font-sans text-[15px] font-medium text-[#1E1B2E] truncate">{en.user.name}</div>
                                <div className="font-sans text-[12px] text-[#8E8E93] mt-[2px] truncate">{en.user.email}</div>
                              </div>
                            </div>
                            
                            <div className="py-[18px] px-[28px] overflow-hidden min-w-0">
                              <div className="font-sans text-[14px] text-[#1E1B2E] truncate">{en.course.title}</div>
                            </div>
                            
                            <div className="py-[18px] px-[28px] flex items-center gap-[8px] overflow-hidden min-w-0">
                              <div className="w-[8px] h-[8px] rounded-full bg-[#C9A96E] shadow-[0_0_6px_rgba(201,169,110,0.3)] shrink-0"></div>
                              <span className="font-sans text-[13px] font-medium text-[#C9A96E] truncate">Active</span>
                            </div>
                            
                            <div className="py-[18px] px-[28px] text-right overflow-hidden min-w-0">
                              <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="h-[36px] px-[18px] rounded-xl border border-[#1E1B2E] text-[#1E1B2E] bg-transparent text-[13px] font-medium inline-flex items-center gap-[6px] hover:bg-[#1E1B2E] hover:text-white transition-all duration-200 shrink-0"
                              >
                                <MessageSquare size={16} /> <span className="hidden lg:inline">Message</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  )}
                </div>
              </div>
            )}
          </div>
        </SlideUp>

      </div>
    </div>
  );
}
