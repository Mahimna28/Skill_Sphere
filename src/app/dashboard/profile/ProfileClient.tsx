"use client";

import React, { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { containerVariant, microVariant } from "./motionVariants";
import { 
  Mail, Trophy, Calendar, 
  Baby, BookOpen, Star, TrendingUp, Award, Clock,
  Building2, MapPin, GraduationCap,
  Users, BarChart3, LayoutDashboard,
  Briefcase, GraduationCap as CertIcon, Activity,
  Target, Zap, Flame, Info, CheckCircle2,
  Globe, EyeOff, Shield, Plus, X, Search, Filter
} from "lucide-react";

export default function ProfileClient({ user, roleData }: { user: any, roleData: any }) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const skillsArray = user.skills ? user.skills.split(",").map((s: string) => s.trim()) : [];

  const [profileActivities, setProfileActivities] = useState([
    {
      id: "login",
      type: "system",
      title: "Last Login Session",
      desc: new Date(user.lastActiveAt || Date.now()).toLocaleString(),
      icon: CheckCircle2,
      color: "bg-[#22C55E]/15 border-[#22C55E]/30 text-[#22C55E]",
    },
    ...(user.enrollments && user.enrollments.length > 0
      ? [
          {
            id: "enrolled",
            type: "learning",
            title: "Enrolled in Course",
            desc: user.enrollments[0].course?.title || "Active Learning Path",
            icon: BookOpen,
            color: "bg-[#1E1B2E] text-[#C9A96E]",
          },
        ]
      : []),
    ...(roleData?.recentActivity
      ? roleData.recentActivity.slice(0, 3).map((act: any, i: number) => ({
          id: `role-act-${i}`,
          type: "learning",
          title: act.course?.title ? `Studying: ${act.course.title}` : "Course Activity",
          desc: `Progress: ${act.progress || 0}%`,
          icon: TrendingUp,
          color: "bg-[#C9A96E]/20 text-[#1E1B2E]",
        }))
      : []),
    {
      id: "created",
      type: "system",
      title: "Account Created",
      desc: new Date(user.createdAt || Date.now()).toLocaleDateString(),
      icon: Calendar,
      color: "bg-[#C9A96E]/20 border-[#C9A96E]/40 text-[#1E1B2E]",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "system" | "learning" | "custom">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteDesc, setNewNoteDesc] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const handleAddProfileActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    const newAct = {
      id: `custom-${Date.now()}`,
      type: "custom",
      title: newNoteTitle,
      desc: newNoteDesc || "Personal timeline log",
      icon: Star,
      color: "bg-[#C9A96E] text-[#1E1B2E]",
    };
    setProfileActivities([newAct, ...profileActivities]);
    setNewNoteTitle("");
    setNewNoteDesc("");
    setShowAddModal(false);
  };

  const filteredActivities = profileActivities.filter(
    (act) => filter === "all" || act.type === filter
  );

  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? false : "show"}
      variants={containerVariant}
      className="max-w-7xl mx-auto space-y-10 font-sans pb-20 px-4 overflow-hidden"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1E1B2E]/10 pb-8">
        <div className="flex items-center gap-6">
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            className="relative group shrink-0"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-white/80 backdrop-blur-xl border-2 border-[#C9A96E] overflow-hidden shadow-[0_12px_35px_rgba(30,27,46,0.08)] flex items-center justify-center relative">
              <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl md:text-5xl font-bold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>
                  {user.name.charAt(0)}
                </span>
              )}
            </div>
          </motion.div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1E1B2E] tracking-tight" style={{ fontFamily: "var(--font-heading, serif)" }}>
                {user.name}
              </h1>
              <div className="px-3 py-1 bg-[#1E1B2E] text-[#C9A96E] text-xs font-bold rounded-full uppercase tracking-wider shadow-2xs">
                {user.role}
              </div>
              <div className="px-3 py-1 bg-[#1E1B2E]/10 text-[#1E1B2E] text-xs font-bold rounded-full">
                @{user.username || "no_username"}
              </div>
              {user.isProfilePublic ? (
                <div className="px-2.5 py-1 bg-[#22C55E]/15 text-[#22C55E] text-[11px] font-bold rounded-full uppercase flex items-center gap-1 border border-[#22C55E]/30">
                  <Globe size={12} /> Public
                </div>
              ) : (
                <div className="px-2.5 py-1 bg-[#F97316]/15 text-[#F97316] text-[11px] font-bold rounded-full uppercase flex items-center gap-1 border border-[#F97316]/30">
                  <EyeOff size={12} /> Private
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[#8E8E93] font-medium text-sm">
              <span className="flex items-center gap-1.5 text-[#1E1B2E]"><Mail size={16} className="text-[#C9A96E]" /> {user.email}</span>
              {user.institution && (
                <span className="flex items-center gap-1.5 text-[#1E1B2E]"><Building2 size={16} className="text-[#C9A96E]" /> {user.institution.name}</span>
              )}
              <span className="flex items-center gap-1.5 text-[#1E1B2E]"><Calendar size={16} className="text-[#C9A96E]" /> Joined {new Date(user.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Redesigned Balanced Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bio, Skills & Role Details (8 Columns) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Bio & Skills */}
          <motion.div
            variants={microVariant}
            initial="hidden"
            animate="show"
            className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(30,27,46,0.05)]"
          >
            <h3 className="text-xl font-bold text-[#1E1B2E] mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading, serif)" }}>
              <Info className="text-[#C9A96E] w-5 h-5" /> About Me
            </h3>
            <p className="text-sm font-medium text-[#1E1B2E]/80 leading-relaxed mb-6">
              {user.bio || "No bio added yet. Visit Settings to introduce yourself!"}
            </p>
            <div className="flex flex-wrap gap-2">
              {skillsArray.length > 0 ? skillsArray.map((skill: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-full bg-[#1E1B2E]/5 border border-[#1E1B2E]/10 text-[#1E1B2E] font-bold text-xs">
                   {skill}
                </span>
              )) : (
                <p className="text-xs font-medium text-[#8E8E93]">No skills listed yet.</p>
              )}
            </div>
          </motion.div>

          {/* Role Specific Sections */}
          {user.role === "student" && (
            <motion.div variants={microVariant} initial="hidden" animate="show" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-tr from-[#1E1B2E] to-[#2D2844] text-white p-6 rounded-2xl border border-white/10 shadow-md">
                  <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-wider">Target Goal</span>
                  <p className="text-xl font-bold mt-1 mb-2" style={{ fontFamily: "var(--font-heading, serif)" }}>
                    {user.learningGoal || "Not specified yet"}
                  </p>
                  <span className="text-xs text-white/60 font-medium">6-Month Academic Roadmap</span>
                </div>
                <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-6 rounded-2xl shadow-2xs">
                  <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Current Degree Program</span>
                  <p className="text-xl font-bold text-[#1E1B2E] mt-1 mb-2" style={{ fontFamily: "var(--font-heading, serif)" }}>
                    {user.degree || "B.Tech"}
                  </p>
                  <span className="text-xs font-semibold text-[#1E1B2E]">Specialization: {user.specialization || "General"}</span>
                </div>
              </div>
            </motion.div>
          )}

          {user.role === "teacher" && (
            <motion.div variants={microVariant} initial="hidden" animate="show" className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 md:p-8 shadow-2xs space-y-4">
              <h3 className="text-xl font-bold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>Teaching Portfolio</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/80 border border-[#1E1B2E]/10">
                  <span className="text-xs font-bold text-[#8E8E93]">Expertise</span>
                  <p className="font-bold text-sm text-[#1E1B2E] mt-1">{user.expertise || "General"}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/80 border border-[#1E1B2E]/10">
                  <span className="text-xs font-bold text-[#8E8E93]">Experience</span>
                  <p className="font-bold text-sm text-[#1E1B2E] mt-1">{user.experienceYears || 0} Years</p>
                </div>
                <div className="p-4 rounded-xl bg-white/80 border border-[#1E1B2E]/10">
                  <span className="text-xs font-bold text-[#8E8E93]">Qualification</span>
                  <p className="font-bold text-sm text-[#1E1B2E] mt-1">{user.qualification || "Postgrad"}</p>
                </div>
              </div>
            </motion.div>
          )}

          {user.role === "parent" && user.parentNotes && (
            <motion.div variants={microVariant} initial="hidden" animate="show" className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 md:p-8 shadow-2xs space-y-3">
              <h3 className="text-xl font-bold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>Parenting Notes</h3>
              <p className="text-sm text-[#1E1B2E]/80 leading-relaxed">{user.parentNotes}</p>
            </motion.div>
          )}
        </div>

        {/* Right Column: Activity Feed & Account Highlights (4 Columns) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Activity Timeline */}
          <motion.div
            variants={microVariant}
            initial="hidden"
            animate="show"
            className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(30,27,46,0.05)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#1E1B2E] flex items-center gap-2" style={{ fontFamily: "var(--font-heading, serif)" }}>
                 <Activity className="text-[#C9A96E] w-5 h-5" /> Activity Feed
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-2.5 py-1 rounded-xl bg-[#1E1B2E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#1E1B2E] font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Plus size={12} /> Add Note
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-[#1E1B2E]/10 no-scrollbar">
              {[
                { id: "all", label: "All" },
                { id: "system", label: "System" },
                { id: "learning", label: "Learning" },
                { id: "custom", label: "Notes" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                    filter === tab.id
                      ? "bg-[rgba(201,169,110,0.2)] text-[#1E1B2E] border border-[#C9A96E]"
                      : "bg-gray-50 text-[#8E8E93] hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-5">
               {filteredActivities.length === 0 ? (
                 <div className="py-6 text-center text-xs font-bold text-[#8E8E93]">
                   No events in this category.
                 </div>
               ) : (
                 filteredActivities.map((act, index) => {
                   const Icon = act.icon || Activity;
                   const isLast = index === filteredActivities.length - 1;
                   return (
                     <div
                       key={act.id}
                       onClick={() => setSelectedEvent(act)}
                       className="flex gap-3.5 group cursor-pointer p-1.5 rounded-xl hover:bg-[#F5F1EB]/60 transition-colors"
                       title="Click to view timeline event details"
                     >
                       <div className="relative shrink-0">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative text-xs shadow-2xs group-hover:scale-110 transition-transform ${act.color || "bg-gray-100 text-[#1E1B2E]"}`}>
                           <Icon size={16} />
                         </div>
                         {!isLast && (
                           <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-[#1E1B2E]/10" />
                         )}
                       </div>
                       <div className="min-w-0 flex-1">
                         <div className="flex items-center justify-between">
                           <p className="font-bold text-xs uppercase text-[#1E1B2E] group-hover:text-[#C9A96E] transition-colors truncate">
                             {act.title}
                           </p>
                           <span className="text-[10px] font-bold text-[#C9A96E] opacity-0 group-hover:opacity-100 transition-opacity">
                             View →
                           </span>
                         </div>
                         <p className="text-xs font-medium text-[#8E8E93] mt-0.5 leading-snug">{act.desc}</p>
                       </div>
                     </div>
                   );
                 })
               )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Timeline Note Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#1E1B2E]/10 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1E1B2E]/10 mb-6">
                <h3 className="text-xl font-bold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>
                  Add Timeline Note
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-[#8E8E93] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddProfileActivity} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E1B2E] uppercase mb-1.5">Event / Note Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Completed First Month"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="w-full bg-[#F5F1EB]/60 border border-[#1E1B2E]/15 rounded-xl p-3 text-sm font-medium text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1E1B2E] uppercase mb-1.5">Description / Date</label>
                  <input
                    type="text"
                    placeholder="e.g., Successfully finished 5 modules"
                    value={newNoteDesc}
                    onChange={(e) => setNewNoteDesc(e.target.value)}
                    className="w-full bg-[#F5F1EB]/60 border border-[#1E1B2E]/15 rounded-xl p-3 text-sm font-medium text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E]"
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#8E8E93] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-extrabold text-sm hover:bg-[#b89758] transition-all shadow-sm cursor-pointer"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Timeline Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#1E1B2E]/10 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1E1B2E]/10 mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${selectedEvent.color}`}>
                    {selectedEvent.icon ? React.createElement(selectedEvent.icon, { size: 18 }) : <Activity size={18} />}
                  </div>
                  <h3 className="text-xl font-bold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>
                    Event Details
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 rounded-full hover:bg-gray-100 text-[#8E8E93] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-2xl bg-[#F5F1EB] border border-[#1E1B2E]/5">
                  <p className="text-xs font-bold text-[#8E8E93] uppercase">Event Title</p>
                  <p className="text-lg font-extrabold text-[#1E1B2E] mt-0.5">{selectedEvent.title}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5F1EB] border border-[#1E1B2E]/5">
                  <p className="text-xs font-bold text-[#8E8E93] uppercase">Details / Timestamp</p>
                  <p className="text-sm font-bold text-[#1E1B2E] mt-0.5">{selectedEvent.desc}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5F1EB] border border-[#1E1B2E]/5 flex justify-between items-center">
                  <span className="text-xs font-bold text-[#8E8E93] uppercase">Category</span>
                  <span className="px-3 py-1 rounded-full bg-[#1E1B2E] text-[#C9A96E] text-xs font-bold uppercase">
                    {selectedEvent.type}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1E1B2E] text-white font-bold text-sm hover:bg-[#C9A96E] hover:text-[#1E1B2E] transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
