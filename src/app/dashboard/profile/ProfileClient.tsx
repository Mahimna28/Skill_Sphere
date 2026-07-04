"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { containerVariant, microVariant } from "./motionVariants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, Mail, Shield, Trophy, Calendar, Save, 
  Camera, Baby, Loader2, Lock, ShieldCheck, 
  BookOpen, Star, TrendingUp, Award, Clock,
  Building2, MapPin, Edit3, GraduationCap,
  Users, BarChart3, LayoutDashboard, X,
  Briefcase, GraduationCap as CertIcon, Activity,
  Target, Zap, Flame, Info, CheckCircle2, Download,
  Unlock, Globe, EyeOff
} from "lucide-react";

export default function ProfileClient({ user, roleData }: { user: any, roleData: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const shouldReduceMotion = useReducedMotion() ?? false;
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    image: user.image || "",
    bio: user.bio || "",
    skills: user.skills || "",
    childEmail: user.children?.[0]?.email || "",
    learningGoal: user.learningGoal || "",
    degree: user.degree || "B.Tech",
    specialization: user.specialization || "",
    expertise: user.expertise || "",
    experienceYears: user.experienceYears || 0,
    qualification: user.qualification || "",
    parentNotes: user.parentNotes || "",
    isProfilePublic: user.isProfilePublic ?? true,
    username: user.username || "",
    password: "",
    otpCode: "",
  });

  const isEmailChanged = formData.email !== user.email;

  const handleSendOtp = async () => {
    if (!formData.email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      if (res.ok) {
        setOtpSent(true);
        alert("Verification code sent to " + formData.email);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setIsEditing(false);
        setOtpSent(false);
        setSaveSuccess(true);
        setFormData({ ...formData, password: "", otpCode: "" });
        setTimeout(() => setSaveSuccess(false), 3500);
        router.refresh();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse skills
  const skillsArray = formData.skills ? formData.skills.split(",").map((s: string) => s.trim()) : [];

  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? false : "show"}
      variants={containerVariant}
      className="max-w-7xl mx-auto space-y-10 font-sans pb-20 px-4 overflow-hidden"
    >
      {/* Save Success Micro-Animation Toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            role="status"
            aria-live="polite"
            className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#22C55E]/90 backdrop-blur-xl text-white font-bold text-sm shadow-[0_12px_30px_rgba(34,197,94,0.3)] flex items-center gap-3 border border-white/20"
          >
            <div className="w-7 h-7 rounded-full bg-white text-[#22C55E] flex items-center justify-center font-black">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>Profile settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1E1B2E]/10 pb-6">
        <div className="flex items-center gap-6">
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            className="relative group cursor-pointer shrink-0"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-white/80 backdrop-blur-xl border-2 border-[#C9A96E] overflow-hidden shadow-[0_12px_35px_rgba(30,27,46,0.08)] flex items-center justify-center relative">
              {/* Shimmer Overlay */}
              <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl md:text-5xl font-bold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>
                  {user.name.charAt(0)}
                </span>
              )}
            </div>
            {isEditing && (
              <div className="absolute -bottom-2 -right-2 bg-[#1E1B2E] text-[#C9A96E] p-2.5 rounded-xl border-2 border-white shadow-md">
                <Camera size={16} />
              </div>
            )}
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
        <div className="flex gap-3 shrink-0">
          {!isEditing ? (
            <motion.button
              type="button"
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              onClick={() => setIsEditing(true)}
              className="h-12 px-6 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(201,169,110,0.3)] hover:shadow-[0_0_18px_rgba(201,169,110,0.6)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </motion.button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="h-12 px-6 rounded-xl bg-[#1E1B2E]/10 hover:bg-[#1E1B2E]/15 text-[#1E1B2E] font-bold text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bio, Skills & Timeline */}
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
              {user.bio || "No bio added yet. Click 'Edit Profile' to introduce yourself!"}
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

          {/* Activity Timeline */}
          <motion.div
            variants={microVariant}
            initial="hidden"
            animate="show"
            className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(30,27,46,0.05)]"
          >
            <h3 className="text-xl font-bold text-[#1E1B2E] mb-6 flex items-center gap-2" style={{ fontFamily: "var(--font-heading, serif)" }}>
               <Activity className="text-[#C9A96E] w-5 h-5" /> Activity Feed
            </h3>
            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="relative">
                     <div className="w-9 h-9 bg-[#22C55E]/15 border border-[#22C55E]/30 rounded-full flex items-center justify-center text-[#22C55E] z-10 relative">
                        <CheckCircle2 size={18} />
                     </div>
                     <div className="absolute top-9 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-[#1E1B2E]/10" />
                  </div>
                  <div>
                     <p className="font-bold text-xs uppercase text-[#1E1B2E]">Last Login Session</p>
                     <p className="text-xs font-medium text-[#8E8E93]">{new Date(user.lastActiveAt).toLocaleString()}</p>
                  </div>
               </div>
               {user.enrollments && user.enrollments.length > 0 && (
                 <div className="flex gap-4">
                    <div className="relative">
                       <div className="w-9 h-9 bg-[#1E1B2E] text-[#C9A96E] rounded-full flex items-center justify-center z-10 relative shadow-2xs">
                          <BookOpen size={18} />
                       </div>
                       <div className="absolute top-9 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-[#1E1B2E]/10" />
                    </div>
                    <div>
                       <p className="font-bold text-xs uppercase text-[#1E1B2E]">Enrolled in Course</p>
                       <p className="text-xs font-medium text-[#8E8E93]">{user.enrollments[0].course?.title || "A new course"}</p>
                    </div>
                 </div>
               )}
               <div className="flex gap-4 opacity-70">
                  <div className="relative">
                     <div className="w-9 h-9 bg-[#C9A96E]/20 border border-[#C9A96E]/40 rounded-full flex items-center justify-center text-[#1E1B2E]">
                        <Calendar size={18} />
                     </div>
                  </div>
                  <div>
                     <p className="font-bold text-xs uppercase text-[#1E1B2E]">Account Created</p>
                     <p className="text-xs font-medium text-[#8E8E93]">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Settings & Account Management */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            variants={microVariant}
            initial="hidden"
            animate="show"
            className={`bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(30,27,46,0.05)] ${
              isEditing ? "ring-2 ring-[#C9A96E] transition-all" : ""
            }`}
          >
            <h3 className="text-lg font-bold text-[#1E1B2E] mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-heading, serif)" }}>
              {isEditing ? <Edit3 size={20} className="text-[#C9A96E]" /> : <Shield size={20} className="text-[#8E8E93]" />} 
              Manage Account
            </h3>
            
            <form onSubmit={handleUpdate} className="space-y-5">
              {/* Basic Info */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1">Display Name</label>
                  <Input 
                    disabled={!isEditing}
                    className="h-11 rounded-xl bg-white/90 border border-[#1E1B2E]/20 text-[#1E1B2E] font-medium text-sm focus-visible:ring-2 focus-visible:ring-[#C9A96E] disabled:opacity-80"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1">Gmail Address</label>
                  <Input 
                    type="email"
                    disabled={!isEditing}
                    className="h-11 rounded-xl bg-white/90 border border-[#1E1B2E]/20 text-[#1E1B2E] font-medium text-sm focus-visible:ring-2 focus-visible:ring-[#C9A96E] disabled:opacity-80"
                    value={formData.email}
                    onChange={e => {
                      setFormData({...formData, email: e.target.value});
                      setOtpSent(false);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1">Unique Username (@)</label>
                  <Input 
                    disabled={!isEditing}
                    className="h-11 rounded-xl bg-white/90 border border-[#1E1B2E]/20 text-[#1E1B2E] font-medium text-sm focus-visible:ring-2 focus-visible:ring-[#C9A96E] disabled:opacity-80"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase()})}
                    placeholder="e.g. alex_dev"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1">Bio / Intro</label>
                  <textarea 
                    disabled={!isEditing}
                    className="w-full p-3 border border-[#1E1B2E]/20 rounded-xl font-medium text-sm min-h-[90px] disabled:opacity-80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#C9A96E] resize-none"
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell the community about yourself..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1">Skills (Comma separated)</label>
                  <Input 
                    disabled={!isEditing}
                    className="h-11 rounded-xl bg-white/90 border border-[#1E1B2E]/20 text-[#1E1B2E] font-medium text-sm focus-visible:ring-2 focus-visible:ring-[#C9A96E] disabled:opacity-80"
                    value={formData.skills}
                    onChange={e => setFormData({...formData, skills: e.target.value})}
                    placeholder="Python, React, Machine Learning"
                  />
                </div>
              </div>

              {/* Role Specific Fields in Edit Mode */}
              {isEditing && (
                <div className="space-y-4 pt-4 border-t border-[#1E1B2E]/10">
                  {user.role === "student" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#C9A96E] mb-1">6-Month Learning Goal</label>
                        <Input 
                          className="h-11 rounded-xl bg-white/90 border border-[#1E1B2E]/20 font-medium text-sm"
                          value={formData.learningGoal}
                          onChange={e => setFormData({...formData, learningGoal: e.target.value})}
                          placeholder="Become AI Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#C9A96E] mb-1">Current Degree</label>
                        <select 
                          className="w-full h-11 border border-[#1E1B2E]/20 rounded-xl px-3 font-medium text-sm bg-white"
                          value={formData.degree}
                          onChange={e => setFormData({...formData, degree: e.target.value})}
                        >
                          <option value="">Select Degree</option>
                          <option>High School</option>
                          <option>Diploma</option>
                          <option>B.Tech</option>
                          <option>B.Sc</option>
                          <option>B.A</option>
                          <option>B.Com</option>
                          <option>BCA</option>
                          <option>B.Ed</option>
                          <option>M.Tech</option>
                          <option>M.Sc</option>
                          <option>M.A</option>
                          <option>MBA</option>
                          <option>MCA</option>
                          <option>PhD</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#C9A96E] mb-1">Specialization / Branch</label>
                        <select 
                          className="w-full h-11 border border-[#1E1B2E]/20 rounded-xl px-3 font-medium text-sm bg-white"
                          value={formData.specialization}
                          onChange={e => setFormData({...formData, specialization: e.target.value})}
                        >
                          <option value="">Select Specialization</option>
                          {["B.Tech", "M.Tech", "Diploma"].includes(formData.degree) && (
                            <>
                              <option>Computer Science (CSE)</option>
                              <option>Mechanical (ME)</option>
                              <option>Civil (CE)</option>
                              <option>Electrical (EE)</option>
                              <option>Electronics (ECE)</option>
                              <option>Chemical</option>
                              <option>Information Technology (IT)</option>
                            </>
                          )}
                          {["B.Sc", "M.Sc", "PhD"].includes(formData.degree) && (
                            <>
                              <option>Physics</option>
                              <option>Chemistry</option>
                              <option>Mathematics</option>
                              <option>Biology</option>
                              <option>Computer Science</option>
                              <option>Biotechnology</option>
                            </>
                          )}
                          {["B.Com", "MBA", "M.A", "B.A"].includes(formData.degree) && (
                            <>
                              <option>Finance</option>
                              <option>Marketing</option>
                              <option>Economics</option>
                              <option>Business Analytics</option>
                              <option>Human Resources</option>
                              <option>Accounting</option>
                            </>
                          )}
                          {["BCA", "MCA"].includes(formData.degree) && (
                            <>
                              <option>Software Development</option>
                              <option>Data Science</option>
                              <option>Cyber Security</option>
                              <option>Cloud Computing</option>
                              <option>AI & ML</option>
                            </>
                          )}
                          <option>General / Other</option>
                        </select>
                      </div>
                    </>
                  )}

                  {user.role === "teacher" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#C9A96E] mb-1">Primary Expertise</label>
                        <Input 
                          className="h-11 rounded-xl bg-white/90 border border-[#1E1B2E]/20 font-medium text-sm"
                          value={formData.expertise}
                          onChange={e => setFormData({...formData, expertise: e.target.value})}
                          placeholder="Web Dev, AI, Data Science"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#C9A96E] mb-1">Years of Experience</label>
                        <Input 
                          type="number"
                          className="h-11 rounded-xl bg-white/90 border border-[#1E1B2E]/20 font-medium text-sm"
                          value={formData.experienceYears}
                          onChange={e => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#C9A96E] mb-1">Top Qualification</label>
                        <Input 
                          className="h-11 rounded-xl bg-white/90 border border-[#1E1B2E]/20 font-medium text-sm"
                          value={formData.qualification}
                          onChange={e => setFormData({...formData, qualification: e.target.value})}
                          placeholder="PhD in CS, M.Tech, etc."
                        />
                      </div>
                    </>
                  )}

                  {user.role === "parent" && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#C9A96E] mb-1">Parenting Notes</label>
                      <textarea 
                        className="w-full p-3 border border-[#1E1B2E]/20 rounded-xl font-medium text-sm min-h-[90px] resize-none"
                        value={formData.parentNotes}
                        onChange={e => setFormData({...formData, parentNotes: e.target.value})}
                        placeholder="Notes on child progress..."
                      />
                    </div>
                  )}

                  {isEmailChanged && (
                    <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl space-y-3">
                      <p className="text-xs font-bold uppercase text-[#EF4444] flex items-center gap-1.5">
                        <ShieldCheck size={14} /> Security Required
                      </p>
                      <Input 
                        type="password" required
                        className="h-10 rounded-lg bg-white border border-[#1E1B2E]/20 text-sm font-medium"
                        placeholder="Current Password"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                      />
                      {!otpSent ? (
                        <Button type="button" onClick={handleSendOtp} disabled={loading} className="w-full bg-[#1E1B2E] text-white font-bold h-10 rounded-lg">
                          Verify New Gmail
                        </Button>
                      ) : (
                        <Input 
                          required maxLength={6}
                          className="h-10 rounded-lg bg-white border border-[#1E1B2E]/20 font-bold text-center tracking-[0.4em]"
                          placeholder="OTP"
                          value={formData.otpCode}
                          onChange={e => setFormData({...formData, otpCode: e.target.value})}
                        />
                      )}
                    </div>
                  )}

                  <motion.button 
                    type="submit" 
                    disabled={loading || (isEmailChanged && !otpSent)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-12 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    <span>Save Changes</span>
                  </motion.button>
                </div>
              )}

              {!isEditing && (
                <div className="space-y-4">
                  <div className="pt-4 border-t border-[#1E1B2E]/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-3">Security Settings</h4>
                    <PasswordChangeSection />
                  </div>

                  <div className="pt-4 border-t border-[#1E1B2E]/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-3">Privacy</h4>
                    {["student", "parent"].includes(user.role) ? (
                      <PrivacyToggle isPublic={formData.isProfilePublic} onToggle={async (val: boolean) => {
                        setFormData({...formData, isProfilePublic: val});
                        try {
                          await fetch("/api/profile/update", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ...formData, isProfilePublic: val }),
                          });
                          router.refresh();
                        } catch (err) { console.error(err); }
                      }} />
                    ) : (
                      <div className="p-4 border border-[#F97316]/30 rounded-xl bg-[#F97316]/10 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Lock size={16} className="text-[#F97316]" />
                          <span className="text-xs font-bold uppercase text-[#F97316]">Always Private</span>
                        </div>
                        <p className="text-xs font-medium text-[#1E1B2E]/70 leading-relaxed">
                          As a {user.role}, your profile is permanently private. Users must send a chat request before messaging you.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function PasswordChangeSection() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error", message: string } | null>(null);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match" });
      return;
    }
    setLoading(true); setStatus(null);
    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "Password updated successfully!" });
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setShow(false), 2000);
      } else { setStatus({ type: "error", message: data.message }); }
    } catch (err) { setStatus({ type: "error", message: "Failed to change password" }); }
    finally { setLoading(false); }
  };

  if (!show) {
    return (
      <button 
        type="button"
        onClick={() => setShow(true)}
        className="w-full h-11 rounded-xl border border-[#1E1B2E]/20 bg-white/80 hover:bg-white text-[#1E1B2E] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
      >
        <Lock size={14} />
        <span>Change Password</span>
      </button>
    );
  }

  return (
    <div className="p-4 bg-white/80 border border-[#1E1B2E]/15 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B2E]">Update Password</h4>
        <button type="button" onClick={() => setShow(false)} className="text-[#8E8E93] hover:text-[#1E1B2E]"><X size={16} /></button>
      </div>
      <form onSubmit={handlePasswordChange} className="space-y-2.5">
        <Input type="password" required className="h-10 rounded-lg bg-white border border-[#1E1B2E]/20 text-sm font-medium" placeholder="Old Password" value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} />
        <Input type="password" required className="h-10 rounded-lg bg-white border border-[#1E1B2E]/20 text-sm font-medium" placeholder="New Password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
        <Input type="password" required className="h-10 rounded-lg bg-white border border-[#1E1B2E]/20 text-sm font-medium" placeholder="Confirm New Password" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} />
        {status && <p className={`text-xs font-bold ${status.type === "success" ? "text-[#22C55E]" : "text-[#EF4444]"}`}>{status.message}</p>}
        <button type="submit" disabled={loading} className="w-full h-10 rounded-lg bg-[#1E1B2E] text-white font-bold text-xs cursor-pointer disabled:opacity-50">
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}

function PrivacyToggle({ isPublic, onToggle }: { isPublic: boolean, onToggle: (val: boolean) => void }) {
  return (
    <div className="p-4 border border-[#1E1B2E]/15 rounded-xl bg-white/80 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPublic ? <Globe size={16} className="text-[#22C55E]" /> : <EyeOff size={16} className="text-[#F97316]" />}
          <span className="text-xs font-bold uppercase text-[#1E1B2E]">{isPublic ? "Public Profile" : "Private Profile"}</span>
        </div>
        <button
          type="button"
          onClick={() => onToggle(!isPublic)}
          className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${isPublic ? "bg-[#22C55E]" : "bg-[#8E8E93]"}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isPublic ? "left-6.5" : "left-0.5"}`} />
        </button>
      </div>
      <p className="text-xs font-medium text-[#8E8E93] leading-relaxed">
        {isPublic 
          ? "Anyone can send you direct messages without approval." 
          : "Users must send a chat request that you approve before they can message you."}
      </p>
    </div>
  );
}
