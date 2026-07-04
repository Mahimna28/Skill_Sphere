"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, Mail, Shield, Trophy, Calendar, Save, 
  Camera, Baby, Loader2, Lock, ShieldCheck, 
  BookOpen, Star, TrendingUp, Award, Clock,
  Building2, MapPin, Edit3, GraduationCap,
  Users, BarChart3, LayoutDashboard, X,
  Briefcase, GraduationCap as CertIcon, Activity,
  Target, Zap, Flame, Info, CheckCircle2, Download,
  Unlock, Globe, EyeOff, Pencil, Trash2, Eye
} from "lucide-react";

interface Props {
  user: any;
  roleData: any;
  hasPassword?: boolean;
}

export default function ProfileClient({ user, roleData, hasPassword = true }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
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
        setFormData({ ...formData, password: "", otpCode: "" });
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

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Logic would go here in full implementation
      alert("Account deletion requested.");
    }
  };

  // Helper to parse skills
  const skillsArray = formData.skills ? formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [];

  return (
    <div className="font-sans flex flex-col h-full text-[#1E1B2E] pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
        {/* Profile Header */}
        <div className="bg-white rounded-[16px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] mx-8 mt-6 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group shrink-0">
              <div className="w-[80px] h-[80px] rounded-full overflow-hidden bg-[rgba(201,169,110,0.15)] text-[#C9A96E] flex items-center justify-center font-heading text-[28px]">
                {user.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={user.image} className="w-full h-full object-cover" alt="" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-[#C9A96E] text-[#1E1B2E] p-1.5 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform">
                  <Camera size={14} />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h1 className="font-heading text-[26px] text-[#1E1B2E] capitalize leading-none">{user.name.toLowerCase()}</h1>
                <div className="flex items-center gap-2">
                  <span className="bg-[rgba(201,169,110,0.12)] text-[#C9A96E] text-[11px] px-3 py-1 rounded-full font-medium">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  {user.username && (
                    <span className="bg-[rgba(30,27,46,0.06)] text-[#1E1B2E] text-[11px] px-3 py-1 rounded-full font-medium">
                      @{user.username}
                    </span>
                  )}
                  {user.isProfilePublic ? (
                    <span className="bg-[rgba(201,169,110,0.1)] text-[#C9A96E] text-[11px] px-3 py-1 rounded-full font-medium flex items-center gap-1">
                      <Globe size={10} /> Public
                    </span>
                  ) : (
                    <span className="bg-[rgba(220,38,38,0.1)] text-[#DC2626] text-[11px] px-3 py-1 rounded-full font-medium flex items-center gap-1">
                      <EyeOff size={10} /> Private
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-[13px] text-[#8E8E93]">
                <span className="flex items-center gap-1.5"><Mail size={14} /> {user.email}</span>
                {user.institution && <span className="flex items-center gap-1.5"><Building2 size={14} /> {user.institution.name}</span>}
                <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {new Date(user.createdAt).getFullYear()}</span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className={`h-[40px] px-5 rounded-xl text-[14px] font-medium flex items-center gap-2 transition-all ${isEditing ? "bg-[#1E1B2E] text-white" : "border border-[#1E1B2E] text-[#1E1B2E] hover:bg-[#1E1B2E] hover:text-white"}`}
            >
              {isEditing ? "Cancel Editing" : <><Pencil size={16} /> {user.bio ? "Edit Profile" : "Complete Profile"}</>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Two Columns Layout */}
      <div className="flex flex-col lg:flex-row gap-6 px-8">
        
        {/* Left Column (2/3) */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* About Me */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="bg-white rounded-[16px] p-7 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
          >
            <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-3">About Me</h3>
            <p className="text-[14px] text-[#8E8E93] leading-[1.7]">
              {user.bio || "No bio added yet. Click 'Complete Profile' to introduce yourself!"}
            </p>
            <div className="mt-5">
              <h4 className="text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-3">Skills</h4>
              {skillsArray.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skillsArray.map((skill: string, i: number) => (
                    <span key={i} className="bg-[rgba(201,169,110,0.1)] text-[#C9A96E] text-[12px] px-3 py-1 rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#8E8E93] italic">No skills listed yet.</p>
              )}
            </div>
          </motion.div>

          {/* Role Specific Sections */}
          {user.role === "student" && (
            <>
              {/* Learning Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1.0] }}
                  className="bg-white rounded-[16px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                >
                  <Target className="w-5 h-5 text-[#C9A96E] mb-2.5" />
                  <h4 className="font-heading text-[18px] text-[#1E1B2E] mb-1.5">Learning Goal</h4>
                  <p className={`text-[14px] leading-relaxed ${user.learningGoal ? "text-[#8E8E93]" : "text-[#8E8E93] italic"}`}>
                    {user.learningGoal || "What's your 6-month goal?"}
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
                  className="bg-white rounded-[16px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                >
                  <GraduationCap className="w-5 h-5 text-[#C9A96E] mb-2.5" />
                  <h4 className="font-heading text-[18px] text-[#1E1B2E] mb-1.5">Current Degree</h4>
                  <p className={`text-[14px] leading-relaxed ${user.degree ? "text-[#8E8E93]" : "text-[#8E8E93] italic"}`}>
                    {user.degree ? `${user.degree}${user.specialization ? ` (${user.specialization})` : ""}` : "Not set"}
                  </p>
                </motion.div>
              </div>

              {/* Streaks & Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Flame, value: user.currentStreak || 0, label: "Current Streak" },
                  { icon: TrendingUp, value: user.longestStreak || 0, label: "Best Streak" },
                  { icon: Clock, value: (user.studyHours || 0).toFixed(1), label: "Total Hours" },
                  { icon: BarChart3, value: `${roleData.averageScore || 0}%`, label: "Avg Score" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.25 + (i * 0.05) }}
                    className="bg-white rounded-[16px] p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-center flex flex-col items-center"
                  >
                    <stat.icon className="w-5 h-5 text-[#8E8E93] mb-2.5" />
                    <span className="font-heading text-[24px] text-[#1E1B2E] leading-none mb-1.5">{stat.value}</span>
                    <span className="text-[11px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">{stat.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Certificates */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="bg-white rounded-[16px] p-7 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
              >
                <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-4">My Certificates</h3>
                {user.certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.certificates.map((cert: any, i: number) => (
                      <div key={i} className="p-4 border border-[rgba(30,27,46,0.06)] rounded-xl flex items-center justify-between hover:bg-[#F5F1EB] transition-colors">
                        <div className="flex items-center gap-3">
                           <CheckCircle2 className="w-5 h-5 text-[#C9A96E]" />
                           <div>
                              <p className="font-medium text-[14px] text-[#1E1B2E]">{cert.title}</p>
                              <p className="text-[12px] text-[#8E8E93] mt-0.5">{new Date(cert.issueDate).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <button onClick={() => window.open(`/certificates/${cert.id}`, '_blank')} className="w-8 h-8 flex items-center justify-center text-[#8E8E93] hover:text-[#1E1B2E]">
                           <Download size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[14px] text-[#8E8E93] italic">No certificates earned yet. Finish a course to earn your first!</p>
                )}
              </motion.div>
            </>
          )}

          {/* Teacher and Parent sections preserved with new styling logic... */}
          {user.role === "teacher" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { icon: Briefcase, title: "Expertise", value: user.expertise || "Not set" },
                  { icon: Calendar, title: "Experience", value: `${user.experienceYears || 0} Years` },
                  { icon: GraduationCap, title: "Qualification", value: user.qualification || "Not set" }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + (i * 0.05) }}
                    className="bg-white rounded-[16px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                  >
                    <item.icon className="w-5 h-5 text-[#C9A96E] mb-2.5" />
                    <h4 className="font-heading text-[18px] text-[#1E1B2E] mb-1.5">{item.title}</h4>
                    <p className={`text-[14px] ${item.value !== "Not set" ? "text-[#8E8E93]" : "text-[#8E8E93] italic"}`}>{item.value}</p>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Users, value: roleData.totalStudentsTaught || 0, label: "Taught" },
                  { icon: Star, value: (user.rating || 0).toFixed(1), label: "Rating" },
                  { icon: BookOpen, value: user._count.courses || 0, label: "Courses" },
                  { icon: Clock, value: "120+", label: "Hours" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.25 + (i * 0.05) }}
                    className="bg-white rounded-[16px] p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-center flex flex-col items-center"
                  >
                    <stat.icon className="w-5 h-5 text-[#8E8E93] mb-2.5" />
                    <span className="font-heading text-[24px] text-[#1E1B2E] leading-none mb-1.5">{stat.value}</span>
                    <span className="text-[11px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
        </div>

        {/* Right Column (1/3) - Manage Account Form */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="bg-white rounded-[16px] p-7 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
          >
            <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-6">Manage Account</h3>
            
            <form onSubmit={handleUpdate} className="space-y-0">
              
              <div className="mb-5">
                <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Display Name</label>
                <input disabled={!isEditing} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-[44px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-3.5 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all disabled:bg-[rgba(30,27,46,0.02)] disabled:text-[#8E8E93]" />
              </div>
              
              <div className="mb-5">
                <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Gmail Address</label>
                <input type="email" disabled={!isEditing} value={formData.email} onChange={e => { setFormData({...formData, email: e.target.value}); setOtpSent(false); }} className="w-full h-[44px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-3.5 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all disabled:bg-[rgba(30,27,46,0.02)] disabled:text-[#8E8E93]" />
              </div>
              
              <div className="mb-5">
                <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Unique Username (@)</label>
                <input disabled={!isEditing} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase()})} placeholder="e.g. alex_dev" className="w-full h-[44px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-3.5 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all disabled:bg-[rgba(30,27,46,0.02)] disabled:text-[#8E8E93]" />
              </div>
              
              <div className="mb-5">
                <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Bio / Intro</label>
                <textarea disabled={!isEditing} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Tell the community about yourself..." className="w-full min-h-[100px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-3.5 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all disabled:bg-[rgba(30,27,46,0.02)] disabled:text-[#8E8E93] resize-y" />
              </div>
              
              <div className="mb-5">
                <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Skills (Comma separated)</label>
                <input disabled={!isEditing} value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="Python, React, Machine Learning" className="w-full h-[44px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-3.5 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all disabled:bg-[rgba(30,27,46,0.02)] disabled:text-[#8E8E93]" />
              </div>

              {isEditing && user.role === "student" && (
                <>
                  <div className="mb-5">
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Learning Goal</label>
                    <input value={formData.learningGoal} onChange={e => setFormData({...formData, learningGoal: e.target.value})} className="w-full h-[44px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-3.5 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" />
                  </div>
                  <div className="mb-5">
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Current Degree</label>
                    <select value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} className="w-full h-[44px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-3.5 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all">
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
                </>
              )}

              {isEmailChanged && (
                <div className="mb-5 p-4 bg-[rgba(220,38,38,0.05)] border border-[rgba(220,38,38,0.2)] rounded-xl space-y-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#DC2626] flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Security Required
                  </p>
                  <input type="password" required className="w-full h-[40px] bg-white border border-[rgba(30,27,46,0.12)] rounded-lg px-3 text-[13px]" placeholder="Current Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  {!otpSent ? (
                    <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full h-[40px] rounded-lg bg-[#1E1B2E] text-white text-[13px] font-medium">Verify New Gmail</button>
                  ) : (
                    <input required maxLength={6} className="w-full h-[40px] bg-white border border-[rgba(30,27,46,0.12)] rounded-lg px-3 text-[13px] text-center tracking-[0.5em]" placeholder="OTP" value={formData.otpCode} onChange={e => setFormData({...formData, otpCode: e.target.value})} />
                  )}
                </div>
              )}

              <div className="my-6 border-t border-[rgba(30,27,46,0.06)]" />
              
              <h4 className="text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-4">Security Settings</h4>
              <div className="space-y-4 mb-6">
                <PasswordChangeSection hasPassword={hasPassword} />
                
                {/* Privacy toggle if not editing */}
                {!isEditing && ["student", "parent"].includes(user.role) && (
                  <PrivacyToggle isPublic={formData.isProfilePublic} onToggle={async (val: boolean) => {
                    setFormData({...formData, isProfilePublic: val});
                    try {
                      await fetch("/api/profile/update", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, isProfilePublic: val }) });
                      router.refresh();
                    } catch (err) {}
                  }} />
                )}

                <button type="button" onClick={handleDeleteAccount} className="text-[13px] text-[#DC2626] hover:underline font-medium block">
                  Delete Account
                </button>
              </div>

              {isEditing && (
                <button type="submit" disabled={loading || (isEmailChanged && !otpSent)} className="w-full h-[48px] rounded-xl bg-[#C9A96E] text-[#1E1B2E] text-[14px] font-medium hover:scale-[1.01] transition-transform disabled:opacity-50 flex items-center justify-center">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : "Save Changes"}
                </button>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function PasswordChangeSection({ hasPassword }: { hasPassword: boolean }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error", message: string } | null>(null);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const handlePasswordChange = async (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match" });
      return;
    }
    setLoading(true); setStatus(null);
    try {
      const bodyPayload = hasPassword 
        ? { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword }
        : { newPassword: passwords.newPassword };

      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "Password successfully updated!" });
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          setShow(false);
          window.location.reload();
        }, 1500);
      } else { setStatus({ type: "error", message: data.message }); }
    } catch (err) { setStatus({ type: "error", message: "Failed to update password." }); }
    finally { setLoading(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePasswordChange(e);
    }
  };

  if (!show) {
    return (
      <button type="button" onClick={() => setShow(true)} className="w-full h-[40px] rounded-xl border border-[#1E1B2E] text-[#1E1B2E] text-[14px] font-medium hover:bg-[#1E1B2E] hover:text-white transition-colors">
        {hasPassword ? "Change Password" : "Make Password"}
      </button>
    );
  }

  return (
    <div className="p-4 bg-[rgba(30,27,46,0.02)] border border-[rgba(30,27,46,0.06)] rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#1E1B2E]">
          {hasPassword ? "Update Password" : "Set Password"}
        </h4>
        <button onClick={() => setShow(false)} className="text-[#8E8E93] hover:text-[#1E1B2E]"><X size={14} /></button>
      </div>
      <div className="space-y-3">
        {hasPassword && (
          <div className="relative">
            <input type={showPassword ? "text" : "password"} required className="w-full h-[36px] bg-white border border-[rgba(30,27,46,0.12)] rounded-lg px-3 pr-10 text-[13px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] [&::-ms-reveal]:hidden [&::-ms-clear]:hidden" placeholder="Current Password" value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} onKeyDown={handleKeyDown} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1B2E] opacity-50 hover:opacity-100 hover:text-[#C9A96E] transition-colors">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        )}
        <div className="relative">
          <input type={showPassword ? "text" : "password"} required className="w-full h-[36px] bg-white border border-[rgba(30,27,46,0.12)] rounded-lg px-3 pr-10 text-[13px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] [&::-ms-reveal]:hidden [&::-ms-clear]:hidden" placeholder="New Password (min 8 chars, 1 uppercase, 1 number, 1 special)" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} onKeyDown={handleKeyDown} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1B2E] opacity-50 hover:opacity-100 hover:text-[#C9A96E] transition-colors">
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <div className="relative">
          <input type={showPassword ? "text" : "password"} required className="w-full h-[36px] bg-white border border-[rgba(30,27,46,0.12)] rounded-lg px-3 pr-10 text-[13px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] [&::-ms-reveal]:hidden [&::-ms-clear]:hidden" placeholder="Confirm New Password" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} onKeyDown={handleKeyDown} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1B2E] opacity-50 hover:opacity-100 hover:text-[#C9A96E] transition-colors">
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {status && <p className={`text-[12px] font-medium ${status.type === "success" ? "text-[#C9A96E]" : "text-[#DC2626]"}`}>{status.message}</p>}
        <button type="button" onClick={handlePasswordChange} disabled={loading} className="w-full h-[36px] rounded-lg bg-[#1E1B2E] text-white text-[13px] font-medium hover:bg-[#2A2640] transition-colors disabled:opacity-50 flex items-center justify-center">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
        </button>
      </div>
    </div>
  );
}

function PrivacyToggle({ isPublic, onToggle }: { isPublic: boolean, onToggle: (val: boolean) => void }) {
  return (
    <div className="p-4 bg-[rgba(30,27,46,0.02)] border border-[rgba(30,27,46,0.06)] rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPublic ? <Globe size={16} className="text-[#C9A96E]" /> : <EyeOff size={16} className="text-orange-600" />}
          <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#1E1B2E]">{isPublic ? "Public Profile" : "Private Profile"}</span>
        </div>
        <button 
          onClick={() => onToggle(!isPublic)} 
          className={`relative w-10 h-6 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-2 ${isPublic ? "bg-[#C9A96E]" : "bg-[#E5E5E5]"}`}
        >
          <div className={`absolute top-[2px] w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${isPublic ? "left-[18px]" : "left-[2px]"}`} />
        </button>
      </div>
      <p className="text-[11px] text-[#8E8E93] leading-relaxed">
        {isPublic 
          ? "Anyone can send you direct messages without approval." 
          : "Users must send a chat request that you approve before they can message you."}
      </p>
    </div>
  );
}
