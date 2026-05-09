"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  // Helper to parse skills
  const skillsArray = formData.skills ? formData.skills.split(",").map((s: string) => s.trim()) : [];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white flex items-center justify-center">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl md:text-5xl font-black text-primary">{user.name.charAt(0)}</span>
              )}
            </div>
            {isEditing && (
              <div className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-xl border-2 border-white shadow-lg cursor-pointer">
                <Camera size={16} />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{user.name}</h1>
              <div className="px-3 py-1 bg-primary text-white text-[10px] font-black border-2 border-black rounded-full uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {user.role}
              </div>
              <div className="px-3 py-1 bg-black text-white text-[10px] font-black border-2 border-black rounded-full uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                @{user.username || "no_username"}
              </div>
              {user.isProfilePublic ? (
                <div className="px-2.5 py-1 bg-green-100 text-green-700 text-[8px] font-black border-2 border-black rounded-full uppercase flex items-center gap-1">
                  <Globe size={10} /> Public
                </div>
              ) : (
                <div className="px-2.5 py-1 bg-orange-100 text-orange-700 text-[8px] font-black border-2 border-black rounded-full uppercase flex items-center gap-1">
                  <EyeOff size={10} /> Private
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-bold text-sm">
              <span className="flex items-center gap-1.5 font-black text-black/70"><Mail size={16} /> {user.email}</span>
              {user.institution && (
                <span className="flex items-center gap-1.5 font-black text-black/70"><Building2 size={16} /> {user.institution.name}</span>
              )}
              <span className="flex items-center gap-1.5 font-black text-black/70"><Calendar size={16} /> Joined {new Date(user.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="neo-brutalism bg-[#F5C84C] text-black font-black h-14 px-8 text-lg">
              <Edit3 className="mr-2" /> Complete Profile
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(false)} variant="outline" className="h-14 px-8 font-black border-4 border-black text-lg">
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Role-Specific Identity & Stats */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Bio & Skills (Common) */}
          <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
               <Info className="text-primary" /> About Me
            </h3>
            <p className="text-lg font-bold text-muted-foreground leading-relaxed mb-8">
              {user.bio || "No bio added yet. Click 'Complete Profile' to introduce yourself!"}
            </p>
            <div className="flex flex-wrap gap-3">
              {skillsArray.length > 0 ? skillsArray.map((skill: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-secondary/20 border-2 border-black rounded-xl font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                   {skill}
                </span>
              )) : (
                <p className="text-xs font-bold opacity-40">No skills listed yet.</p>
              )}
            </div>
          </div>

          {/* Role Specific Sections */}
          {user.role === "student" && (
            <div className="space-y-10">
              {/* Learning Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#4F7DF3] text-white p-8 border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 mb-4">
                    <Target size={24} className="text-[#F5C84C]" />
                    <h4 className="text-xl font-black uppercase">Learning Goal</h4>
                  </div>
                  <p className="font-bold text-lg leading-tight">
                    {user.learningGoal || "What's your 6-month goal?"}
                  </p>
                </div>
                <div className="bg-[#34D399] text-black p-8 border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap size={24} />
                    <h4 className="text-xl font-black uppercase">Current Degree</h4>
                  </div>
                  <p className="font-bold text-lg leading-tight">
                    {user.degree || "Not set"} {user.specialization ? `(${user.specialization})` : ""}
                  </p>
                </div>
              </div>

              {/* Streaks & Time */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                    <Flame className="text-orange-500 mb-2" />
                    <span className="text-2xl font-black">{user.currentStreak}</span>
                    <span className="text-[10px] font-black uppercase opacity-60">Current Streak</span>
                 </div>
                 <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                    <TrendingUp className="text-green-500 mb-2" />
                    <span className="text-2xl font-black">{user.longestStreak}</span>
                    <span className="text-[10px] font-black uppercase opacity-60">Best Streak</span>
                 </div>
                 <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                    <Clock className="text-blue-500 mb-2" />
                    <span className="text-2xl font-black">{user.studyHours.toFixed(1)}</span>
                    <span className="text-[10px] font-black uppercase opacity-60">Total Hours</span>
                 </div>
                 <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                    <BarChart3 className="text-primary mb-2" />
                    <span className="text-2xl font-black">{roleData.averageScore || 0}%</span>
                    <span className="text-[10px] font-black uppercase opacity-60">Avg Score</span>
                 </div>
              </div>

              {/* Certificates */}
              <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">My Certificates</h3>
                  <CertIcon className="text-muted-foreground" />
                </div>
                {user.certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.certificates.map((cert: any, i: number) => (
                      <div key={i} className="p-4 border-2 border-black rounded-xl flex items-center justify-between group hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-3">
                           <CheckCircle2 className="text-green-500" />
                           <div>
                              <p className="font-black text-sm uppercase">{cert.title}</p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(cert.issueDate).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <Button size="icon" variant="ghost" className="border-2 border-black hover:bg-black hover:text-white transition-all">
                           <Download size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-10 font-bold opacity-30 italic">Finish a course to earn your first certificate!</p>
                )}
              </div>
            </div>
          )}

          {user.role === "teacher" && (
            <div className="space-y-10">
              {/* Professional Identity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#4F7DF3] text-white p-8 border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase size={20} />
                    <h4 className="text-sm font-black uppercase">Expertise</h4>
                  </div>
                  <p className="font-bold text-lg leading-tight">{user.expertise || "Not set"}</p>
                </div>
                <div className="bg-[#34D399] text-black p-8 border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar size={20} />
                    <h4 className="text-sm font-black uppercase">Experience</h4>
                  </div>
                  <p className="font-bold text-lg leading-tight">{user.experienceYears || 0} Years</p>
                </div>
                <div className="bg-[#F5C84C] text-black p-8 border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap size={20} />
                    <h4 className="text-sm font-black uppercase">Qualification</h4>
                  </div>
                  <p className="font-bold text-lg leading-tight truncate">{user.qualification || "Not set"}</p>
                </div>
              </div>

              {/* Teaching Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                    <Users className="text-primary mb-2" />
                    <span className="text-2xl font-black">{roleData.totalStudentsTaught}</span>
                    <span className="text-[10px] font-black uppercase opacity-60">Taught</span>
                 </div>
                 <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                    <Star className="text-yellow-500 mb-2" />
                    <span className="text-2xl font-black">{user.rating.toFixed(1)}</span>
                    <span className="text-[10px] font-black uppercase opacity-60">Rating</span>
                 </div>
                 <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                    <BookOpen className="text-green-500 mb-2" />
                    <span className="text-2xl font-black">{user._count.courses}</span>
                    <span className="text-[10px] font-black uppercase opacity-60">Courses</span>
                 </div>
                 <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                    <Clock className="text-blue-500 mb-2" />
                    <span className="text-2xl font-black">120+</span>
                    <span className="text-[10px] font-black uppercase opacity-60">Hours</span>
                 </div>
              </div>
            </div>
          )}

          {user.role === "parent" && (
            <div className="space-y-10">
               <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                 <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                   <Edit3 className="text-primary" /> Parenting Notes
                 </h3>
                 <p className="text-lg font-bold text-muted-foreground leading-relaxed italic">
                   "{user.parentNotes || "No personal notes for child tracking yet."}"
                 </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {roleData.childrenDetails?.map((child: any, i: number) => (
                   <div key={i} className="bg-white border-4 border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-secondary border-2 border-black rounded-full flex items-center justify-center font-black">
                          {child.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xl font-black uppercase leading-none mb-1">{child.name}</h4>
                          <div className="flex gap-2">
                             <span className="text-[10px] font-black bg-green-100 px-2 rounded-full border border-black">↑ Improving</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                         <div className="p-3 bg-muted/20 border-2 border-black rounded-xl text-center">
                            <p className="text-[10px] font-black uppercase opacity-60">Enrolled</p>
                            <p className="text-xl font-black">{child._count.enrollments}</p>
                         </div>
                         <div className="p-3 bg-muted/20 border-2 border-black rounded-xl text-center">
                            <p className="text-[10px] font-black uppercase opacity-60">Avg Score</p>
                            <p className="text-xl font-black">82%</p>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <p className="text-[10px] font-black uppercase opacity-60">Last Activity:</p>
                         <div className="p-3 bg-black text-white rounded-xl text-xs font-bold flex justify-between">
                            <span>Python Basics</span>
                            <span>2h ago</span>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Activity Timeline (Common) */}
          <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
               <Activity className="text-primary" /> Activity Feed
            </h3>
            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="relative">
                     <div className="w-10 h-10 bg-[#34D399] border-2 border-black rounded-full flex items-center justify-center z-10 relative">
                        <CheckCircle2 size={20} />
                     </div>
                     <div className="absolute top-10 left-1/2 -translate-x-1/2 w-1 h-12 bg-black/10"></div>
                  </div>
                  <div>
                     <p className="font-black text-sm uppercase">Last Login Session</p>
                     <p className="text-xs font-bold text-muted-foreground uppercase">{new Date(user.lastActiveAt).toLocaleString()}</p>
                  </div>
               </div>
               <div className="flex gap-4 opacity-50">
                  <div className="relative">
                     <div className="w-10 h-10 bg-primary/20 border-2 border-black rounded-full flex items-center justify-center">
                        <Calendar size={20} />
                     </div>
                  </div>
                  <div>
                     <p className="font-black text-sm uppercase">Account Created</p>
                     <p className="text-xs font-bold text-muted-foreground uppercase">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* Right Column: Settings & Account Management */}
        <div className="lg:col-span-4 space-y-10">
          
          <div className={`bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${isEditing ? 'ring-8 ring-primary/20 transition-all' : ''}`}>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
              {isEditing ? <Edit3 size={24} className="text-primary" /> : <Shield size={24} className="text-muted-foreground" />} 
              Manage Account
            </h3>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Display Name</label>
                  <Input 
                    disabled={!isEditing}
                    className="h-12 border-2 border-black font-bold disabled:bg-muted/20 disabled:opacity-100"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gmail Address</label>
                  <Input 
                    type="email"
                    disabled={!isEditing}
                    className="h-12 border-2 border-black font-bold disabled:bg-muted/20 disabled:opacity-100"
                    value={formData.email}
                    onChange={e => {
                      setFormData({...formData, email: e.target.value});
                      setOtpSent(false);
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unique Username (@)</label>
                  <Input 
                    disabled={!isEditing}
                    className="h-12 border-2 border-black font-bold disabled:bg-muted/20 disabled:opacity-100"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase()})}
                    placeholder="e.g. alex_dev"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bio / Intro</label>
                  <textarea 
                    disabled={!isEditing}
                    className="w-full p-3 border-2 border-black rounded-xl font-bold text-sm min-h-[100px] disabled:bg-muted/20 disabled:opacity-100 resize-none"
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell the community about yourself..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Skills (Comma separated)</label>
                  <Input 
                    disabled={!isEditing}
                    className="h-12 border-2 border-black font-bold disabled:bg-muted/20"
                    value={formData.skills}
                    onChange={e => setFormData({...formData, skills: e.target.value})}
                    placeholder="Python, React, Machine Learning"
                  />
                </div>
              </div>

              {/* Role Specific Fields in Edit Mode */}
              {isEditing && (
                <div className="space-y-4 pt-4 border-t-2 border-black border-dashed">
                  {user.role === "student" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">6-Month Learning Goal</label>
                        <Input 
                          className="h-12 border-2 border-black font-bold"
                          value={formData.learningGoal}
                          onChange={e => setFormData({...formData, learningGoal: e.target.value})}
                          placeholder="Become AI Engineer"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Current Pursuing Degree</label>
                        <select 
                          className="w-full h-12 border-2 border-black rounded-xl px-3 font-bold bg-white"
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
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Specialization / Branch</label>
                        <select 
                          className="w-full h-12 border-2 border-black rounded-xl px-3 font-bold bg-white"
                          value={formData.specialization}
                          onChange={e => setFormData({...formData, specialization: e.target.value})}
                        >
                          <option value="">Select Specialization</option>
                          {/* Engineering */}
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
                          {/* Science */}
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
                          {/* Commerce/Business */}
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
                          {/* Computer Apps */}
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
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Primary Expertise</label>
                        <Input 
                          className="h-12 border-2 border-black font-bold"
                          value={formData.expertise}
                          onChange={e => setFormData({...formData, expertise: e.target.value})}
                          placeholder="Web Dev, AI, Data Science"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Years of Experience</label>
                        <Input 
                          type="number"
                          className="h-12 border-2 border-black font-bold"
                          value={formData.experienceYears}
                          onChange={e => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Top Qualification</label>
                        <Input 
                          className="h-12 border-2 border-black font-bold"
                          value={formData.qualification}
                          onChange={e => setFormData({...formData, qualification: e.target.value})}
                          placeholder="PhD in CS, M.Tech, etc."
                        />
                      </div>
                    </>
                  )}

                  {user.role === "parent" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary">Parenting Notes</label>
                      <textarea 
                        className="w-full p-3 border-2 border-black rounded-xl font-bold text-sm min-h-[100px] resize-none"
                        value={formData.parentNotes}
                        onChange={e => setFormData({...formData, parentNotes: e.target.value})}
                        placeholder="Notes on child progress..."
                      />
                    </div>
                  )}

                  {isEmailChanged && (
                    <div className="p-5 bg-red-50 border-4 border-black border-dashed rounded-2xl space-y-4">
                      <p className="text-[10px] font-black uppercase text-red-600 flex items-center gap-1.5">
                        <ShieldCheck size={14} /> Security Required
                      </p>
                      <Input 
                        type="password" required
                        className="h-11 border-2 border-black font-bold bg-white"
                        placeholder="Current Password"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                      />
                      {!otpSent ? (
                        <Button type="button" onClick={handleSendOtp} disabled={loading} className="w-full bg-primary text-white font-black border-2 border-black">
                          Verify New Gmail
                        </Button>
                      ) : (
                        <Input 
                          required maxLength={6}
                          className="h-11 border-2 border-black font-bold bg-white text-center tracking-[0.5em]"
                          placeholder="OTP"
                          value={formData.otpCode}
                          onChange={e => setFormData({...formData, otpCode: e.target.value})}
                        />
                      )}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading || (isEmailChanged && !otpSent)}
                    className="w-full h-14 text-lg font-black neo-brutalism bg-[#34D399] text-black"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />}
                    Save Everything
                  </Button>
                </div>
              )}

              {!isEditing && (
                <div className="space-y-4">
                  <div className="pt-4 border-t-2 border-black border-dashed">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Security Settings</h4>
                    <PasswordChangeSection />
                  </div>

                  <div className="pt-4 border-t-2 border-black border-dashed">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Privacy</h4>
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
                      <div className="p-4 border-2 border-black rounded-2xl bg-orange-50 space-y-2">
                        <div className="flex items-center gap-2">
                          <Lock size={16} className="text-orange-600" />
                          <span className="text-xs font-black uppercase text-orange-700">Always Private</span>
                        </div>
                        <p className="text-[8px] font-bold text-orange-600/70 leading-relaxed">
                          As a {user.role}, your profile is permanently private. Users must send a chat request before messaging you.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-muted/20 border-2 border-black border-dashed rounded-2xl">
                    <p className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Account Overview</p>
                    <ul className="text-xs font-bold space-y-2">
                      <li className="flex items-center gap-2">• ID: <span className="text-[10px] font-mono">{user.id.slice(0, 10)}...</span></li>
                      <li className="flex items-center gap-2">• Role: {user.role.toUpperCase()}</li>
                      <li className="flex items-center gap-2">• Last Login: {new Date(user.lastActiveAt).toLocaleDateString()}</li>
                    </ul>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep your PasswordChangeSection from previous version
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
        setStatus({ type: "success", message: "Success!" });
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setShow(false), 2000);
      } else { setStatus({ type: "error", message: data.message }); }
    } catch (err) { setStatus({ type: "error", message: "Failed" }); }
    finally { setLoading(false); }
  };

  if (!show) {
    return (
      <Button 
        onClick={() => setShow(true)} variant="outline" 
        className="w-full h-11 border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
      >
        <Lock size={14} className="mr-2" /> Change Password
      </Button>
    );
  }

  return (
    <div className="p-5 bg-muted/20 border-2 border-black rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Security Update</h4>
        <button onClick={() => setShow(false)}><X size={16} /></button>
      </div>
      <form onSubmit={handlePasswordChange} className="space-y-3">
        <Input type="password" required className="h-9 border-2 border-black font-bold" placeholder="Old Password" value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} />
        <Input type="password" required className="h-9 border-2 border-black font-bold" placeholder="New Password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
        <Input type="password" required className="h-9 border-2 border-black font-bold" placeholder="Confirm" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} />
        {status && <p className={`text-[10px] font-black uppercase ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>{status.message}</p>}
        <Button type="submit" disabled={loading} className="w-full bg-black text-white font-black border-2 border-black h-9 uppercase text-xs">
          {loading ? "..." : "Update"}
        </Button>
      </form>
    </div>
  );
}

function PrivacyToggle({ isPublic, onToggle }: { isPublic: boolean, onToggle: (val: boolean) => void }) {
  return (
    <div className="p-4 border-2 border-black rounded-2xl bg-muted/10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPublic ? <Globe size={16} className="text-green-600" /> : <EyeOff size={16} className="text-orange-600" />}
          <span className="text-xs font-black uppercase">{isPublic ? "Public Profile" : "Private Profile"}</span>
        </div>
        <button
          onClick={() => onToggle(!isPublic)}
          className={`relative w-12 h-7 rounded-full border-2 border-black transition-colors ${isPublic ? "bg-green-400" : "bg-orange-400"}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white border-2 border-black rounded-full transition-transform ${isPublic ? "left-5" : "left-0.5"}`} />
        </button>
      </div>
      <p className="text-[8px] font-bold text-muted-foreground leading-relaxed">
        {isPublic 
          ? "Anyone can send you direct messages without approval." 
          : "Users must send a chat request that you approve before they can message you."}
      </p>
    </div>
  );
}
