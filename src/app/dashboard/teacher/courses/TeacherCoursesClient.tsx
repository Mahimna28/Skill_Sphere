"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Plus, Loader2, X, Globe, Lock, Users, Sparkles, Upload, GraduationCap, Copy, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SUBJECTS = ["AI & ML", "Python", "Web Dev", "Mathematics", "Physics", "History", "Literature", "Other"];

interface Props {
  courses: any[];
  classes: any[];
}

export default function TeacherCoursesClient({ courses: initialCourses, classes: initialClasses }: Props) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [classes, setClasses] = useState(initialClasses);
  const [activeTab, setActiveTab] = useState<"courses" | "classes">("courses");
  const [showForm, setShowForm] = useState(false);
  const [showClassForm, setShowClassForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ title: "", description: "", subject: "Python", thumbnail: "", isPublic: true });
  const [classForm, setClassForm] = useState({ title: "", description: "", subject: "Python", section: "", room: "" });
  const [codeCopied, setCodeCopied] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(code);
    setTimeout(() => setCodeCopied(null), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setCourses((prev) => [data.course || data, ...prev]);
        setForm({ title: "", description: "", subject: "Python", thumbnail: "", isPublic: true });
        setShowForm(false);
        showToast("✅ Course created successfully!", "success");
        router.refresh();
      } else {
        showToast(data.message || "Failed to create course", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...classForm, isPublic: false }),
      });
      const data = await res.json();
      if (res.ok) {
        setClasses(prev => [data.course || data, ...prev]);
        setClassForm({ title: "", description: "", subject: "Python", section: "", room: "" });
        setShowClassForm(false);
        showToast("✅ Class created! Share the code with students.", "success");
        router.refresh();
      } else {
        showToast(data.message || "Failed to create class", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F1EB] font-sans text-[#1E1B2E]">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-xl font-medium shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex items-center gap-3 transition-colors ${toast.type === "success" ? "bg-[#1E1B2E] text-white" : "bg-[#DC2626] text-white"}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[1200px] mx-auto pb-20">
        
        {/* PAGE HEADER */}
        <div className="pt-12 px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading text-[32px] md:text-[40px] text-[#1E1B2E] leading-tight tracking-tight mb-2">Course Studio</h1>
            <p className="font-sans text-[15px] text-[#8E8E93] max-w-md">Manage your public courses and private institutional classes.</p>
          </div>
          <div className="flex gap-3">
            {activeTab === "courses" ? (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#C9A96E] to-[#E2C48D] hover:to-[#D6B87D] text-[#1E1B2E] text-[14px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(201,169,110,0.3)] transition-all shrink-0"
              >
                <Plus size={18} /> New Course
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowClassForm(true)}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#1E1B2E] to-[#2D2844] text-white text-[14px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(30,27,46,0.3)] transition-all shrink-0"
              >
                <Plus size={18} /> New Class
              </motion.button>
            )}
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="mt-8 px-8 flex gap-2">
          <button
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-all ${
              activeTab === "courses" ? "bg-[#1E1B2E] text-white shadow-sm" : "bg-white text-[#8E8E93] hover:text-[#1E1B2E]"
            }`}
          >
            <Globe size={14} /> Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab("classes")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-all ${
              activeTab === "classes" ? "bg-[#1E1B2E] text-white shadow-sm" : "bg-white text-[#8E8E93] hover:text-[#1E1B2E]"
            }`}
          >
            <GraduationCap size={14} /> My Classes ({classes.length})
          </button>
        </div>

        {/* COURSES/CLASSES GRID / EMPTY STATE */}
        <div className="mt-12 px-8">
          {(activeTab === "courses" ? courses : classes).length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-[32px] p-[80px] flex flex-col items-center justify-center shadow-[0_12px_40px_rgba(30,27,46,0.04)] border border-white/60 text-center"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1E1B2E]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 w-24 h-24 mb-8 rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-center justify-center">
                <Sparkles size={40} className="text-[#C9A96E]" />
              </div>
              <h3 className="relative z-10 font-heading text-[28px] text-[#1E1B2E] mb-4">
                {activeTab === "courses" ? "Your Studio is Empty" : "No Classes Yet"}
              </h3>
              <p className="relative z-10 font-sans text-[15px] text-[#8E8E93] max-w-[400px] mb-8 leading-relaxed">
                {activeTab === "courses" 
                  ? "Start crafting your first premium learning experience. Share your expertise with the world."
                  : "Create a private class to manage your students, assignments, and grades."}
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => activeTab === "courses" ? setShowForm(true) : setShowClassForm(true)}
                className="relative z-10 h-[48px] px-8 rounded-xl bg-[#1E1B2E] hover:bg-[#2A2540] text-white text-[14px] font-bold uppercase tracking-wider shadow-[0_8px_24px_rgba(30,27,46,0.2)] transition-all flex items-center gap-2"
              >
                <Plus size={18} /> {activeTab === "courses" ? "Create First Course" : "Create First Class"}
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(activeTab === "courses" ? courses : classes).map((course, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={course.id}
                  className="group relative bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(30,27,46,0.04)] flex flex-col h-full border border-white hover:shadow-[0_20px_40px_rgba(30,27,46,0.08)] hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative aspect-[16/10] w-full bg-[#1E1B2E] overflow-hidden shrink-0">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1E1B2E] to-[#2D2844]">
                        <BookOpen size={48} className="text-[#C9A96E]/30 mb-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A96E]/40">No Cover</span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#1E1B2E] font-sans text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {course.isPublic ? <Globe size={12} className="text-[#C9A96E]" /> : <Lock size={12} className="text-[#8E8E93]" />}
                      {course.isPublic ? "Public" : "Draft"}
                    </div>

                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1B2E]/80 backdrop-blur-md text-white font-sans text-[11px] font-medium tracking-wide border border-white/10">
                      {course.subject}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col relative z-10 bg-white">
                    <h3 className="font-heading text-[20px] text-[#1E1B2E] line-clamp-2 leading-tight group-hover:text-[#C9A96E] transition-colors">{course.title}</h3>
                    
                    <div className="flex items-center gap-4 mt-4 text-[#8E8E93] text-[13px] font-medium font-sans">
                      <div className="flex items-center gap-1.5">
                        <Users size={16} className="text-[#C9A96E]" />
                        <span>{course._count?.enrollments ?? 0} Students</span>
                      </div>
                    </div>
                    
                    <p className="font-sans text-[14px] text-[#8E8E93] line-clamp-2 mt-4 leading-relaxed flex-1">
                      {course.description}
                    </p>
                    {activeTab === "classes" && course.classCode && (
                      <div className="mt-4 p-3 bg-[#F5F1EB] rounded-xl flex items-center justify-between border border-[rgba(30,27,46,0.05)]">
                        <span className="text-[12px] font-bold uppercase tracking-wider text-[#8E8E93]">Code</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[14px] font-bold text-[#C9A96E]">{course.classCode}</span>
                          <button onClick={(e) => { e.preventDefault(); copyCode(course.classCode); }} className="text-[#8E8E93] hover:text-[#1E1B2E]">
                            {codeCopied === course.classCode ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-6 pb-6 pt-2 bg-white flex items-center gap-3 shrink-0">
                    <Link href={`/dashboard/teacher/courses/${course.id}`} className="flex-1">
                      <button 
                        className="w-full h-[44px] bg-[#1E1B2E] hover:bg-[#C9A96E] text-white hover:text-[#1E1B2E] rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        Manage Studio
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#1E1B2E]/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh]"
            >
                {/* Left Panel - Visual */}
                <div className="hidden md:flex md:w-[40%] bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] relative overflow-hidden flex-col justify-between p-12">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A96E]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-[#C9A96E] rounded-2xl flex items-center justify-center mb-8 shadow-[0_8px_32px_rgba(201,169,110,0.3)]">
                      <Sparkles size={24} className="text-[#1E1B2E]" />
                    </div>
                    <h2 className="font-heading text-[40px] text-white leading-tight mb-4">Craft Your Masterpiece</h2>
                    <p className="font-sans text-[16px] text-white/60 leading-relaxed">
                      Define the core details of your new course. You can always enhance the curriculum and settings later in the studio.
                    </p>
                  </div>

                  <div className="relative z-10 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><BookOpen size={18} className="text-[#C9A96E]" /></div>
                      <div>
                        <div className="text-[14px] font-bold text-white tracking-wide">Pro Tip</div>
                        <div className="text-[12px] text-white/50">Keep titles concise and engaging.</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Form */}
                <div className="w-full md:w-[60%] flex flex-col h-full bg-[#F5F1EB]">
                  <div className="flex items-center justify-between p-6 border-b border-[rgba(30,27,46,0.06)] bg-white/50 backdrop-blur-sm shrink-0">
                    <h2 className="font-heading text-[24px] text-[#1E1B2E] md:hidden">Create Course</h2>
                    <div className="hidden md:block"></div>
                    <button 
                      onClick={() => setShowForm(false)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-[rgba(30,27,46,0.04)] text-[#8E8E93] hover:text-[#1E1B2E] transition-colors shadow-sm"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                    <form onSubmit={handleCreate} className="space-y-8 max-w-lg mx-auto">
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Course Title <span className="text-[#DC2626]">*</span></label>
                        <input
                          required
                          placeholder="e.g. Advanced Machine Learning"
                          className="w-full h-[52px] bg-white border-2 border-transparent rounded-xl px-5 text-[15px] font-medium text-[#1E1B2E] shadow-sm focus:outline-none focus:border-[#C9A96E] focus:ring-[4px] focus:ring-[rgba(201,169,110,0.1)] transition-all placeholder:text-[#8E8E93]/50 placeholder:font-normal"
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Subject Area <span className="text-[#DC2626]">*</span></label>
                        <div className="relative">
                          <select
                            className="w-full h-[52px] bg-white border-2 border-transparent rounded-xl px-5 text-[15px] font-medium text-[#1E1B2E] shadow-sm focus:outline-none focus:border-[#C9A96E] focus:ring-[4px] focus:ring-[rgba(201,169,110,0.1)] transition-all appearance-none cursor-pointer"
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          >
                            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8E8E93]">
                            ▼
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Short Description <span className="text-[#DC2626]">*</span></label>
                        <textarea
                          required
                          rows={4}
                          placeholder="What will students accomplish by the end of this course?"
                          className="w-full bg-white border-2 border-transparent rounded-xl p-5 text-[15px] font-medium text-[#1E1B2E] shadow-sm focus:outline-none focus:border-[#C9A96E] focus:ring-[4px] focus:ring-[rgba(201,169,110,0.1)] transition-all resize-none placeholder:text-[#8E8E93]/50 placeholder:font-normal leading-relaxed"
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Cover Photo</label>
                        <div className="flex gap-4 items-center bg-white p-2 pl-4 rounded-2xl shadow-sm border border-white">
                          {form.thumbnail ? (
                            <div className="relative w-[120px] h-[80px] rounded-xl overflow-hidden shrink-0 shadow-inner group">
                               <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                               <button type="button" onClick={() => setForm({...form, thumbnail: ""})} className="absolute top-1 right-1 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#DC2626] shadow-sm hover:scale-110 transition-transform">
                                 <X size={14} />
                               </button>
                            </div>
                          ) : (
                            <div className="relative flex-1">
                              <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setLoading(true);
                                  try {
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    const res = await fetch("/api/upload", {
                                      method: "POST",
                                      body: formData
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                      setForm({ ...form, thumbnail: data.url });
                                      showToast("Image uploaded successfully!", "success");
                                    } else {
                                      showToast(data.message || "Upload failed", "error");
                                    }
                                  } catch (err) {
                                    showToast("Upload failed", "error");
                                  } finally {
                                    setLoading(false);
                                  }
                                }} 
                                disabled={loading}
                              />
                              <div className="h-[80px] border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl flex items-center justify-center gap-2 hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.03)] transition-colors text-[#8E8E93] text-[14px] font-medium bg-[#F5F1EB]">
                                {loading ? <><Loader2 size={18} className="animate-spin text-[#C9A96E]" /> Uploading...</> : <><Upload size={18} /> Browse Files</>}
                              </div>
                            </div>
                          )}
                          <div className="hidden sm:block flex-1 pl-2">
                            <p className="text-[12px] text-[#8E8E93] leading-relaxed">
                              Upload a 16:9 high-res image. Max size 5MB.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Visibility <span className="text-[#DC2626]">*</span></label>
                        <div className="flex gap-4">
                          <label className={`flex-1 relative flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all border-2 ${form.isPublic ? "bg-[rgba(201,169,110,0.05)] border-[#C9A96E]" : "bg-white border-transparent hover:border-[rgba(30,27,46,0.1)] shadow-sm"}`}>
                            <input type="radio" name="visibility" className="hidden" checked={form.isPublic} onChange={() => setForm({...form, isPublic: true})} />
                            <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${form.isPublic ? "border-[#C9A96E]" : "border-[rgba(30,27,46,0.2)]"}`}>
                              {form.isPublic && <motion.div layoutId="radio" className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" />}
                            </div>
                            <div>
                              <div className="text-[15px] font-bold text-[#1E1B2E]">Public</div>
                              <div className="text-[13px] text-[#8E8E93] mt-1 leading-snug">Visible to all students in the marketplace.</div>
                            </div>
                          </label>
                          <label className={`flex-1 relative flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all border-2 ${!form.isPublic ? "bg-[rgba(30,27,46,0.03)] border-[#1E1B2E]" : "bg-white border-transparent hover:border-[rgba(30,27,46,0.1)] shadow-sm"}`}>
                            <input type="radio" name="visibility" className="hidden" checked={!form.isPublic} onChange={() => setForm({...form, isPublic: false})} />
                            <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${!form.isPublic ? "border-[#1E1B2E]" : "border-[rgba(30,27,46,0.2)]"}`}>
                              {!form.isPublic && <motion.div layoutId="radio" className="w-2.5 h-2.5 rounded-full bg-[#1E1B2E]" />}
                            </div>
                            <div>
                              <div className="text-[15px] font-bold text-[#1E1B2E]">Private</div>
                              <div className="text-[13px] text-[#8E8E93] mt-1 leading-snug">Hidden from directory. Invite only.</div>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-[rgba(30,27,46,0.06)] flex gap-4">
                        <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-[56px] rounded-xl bg-white text-[#1E1B2E] text-[15px] font-bold tracking-wide hover:bg-[rgba(30,27,46,0.04)] transition-colors border border-[rgba(30,27,46,0.1)] shadow-sm">
                          Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-[2] h-[56px] rounded-xl bg-[#1E1B2E] text-white text-[15px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] shadow-[0_8px_24px_rgba(30,27,46,0.2)] transition-all disabled:opacity-50 disabled:hover:scale-100">
                          {loading ? <><Loader2 className="animate-spin" size={20} /> Initializing Studio...</> : "Initialize Studio"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClassForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#1E1B2E]/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-full max-h-[85vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[rgba(30,27,46,0.06)] bg-white/50 backdrop-blur-sm shrink-0">
                  <h2 className="font-heading text-[24px] text-[#1E1B2E]">Create Class</h2>
                  <button 
                    onClick={() => setShowClassForm(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-[rgba(30,27,46,0.04)] text-[#8E8E93] hover:text-[#1E1B2E] transition-colors shadow-sm"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                  <form onSubmit={handleCreateClass} className="space-y-6">
                    
                    <div className="space-y-2">
                      <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Class Name <span className="text-[#DC2626]">*</span></label>
                      <input
                        required
                        placeholder="e.g. Physics 101"
                        className="w-full h-[52px] bg-[#F5F1EB] rounded-xl px-5 text-[15px] font-medium text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40"
                        value={classForm.title}
                        onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Section</label>
                      <input
                        placeholder="e.g. Batch A"
                        className="w-full h-[52px] bg-[#F5F1EB] rounded-xl px-5 text-[15px] font-medium text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40"
                        value={classForm.section}
                        onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Subject <span className="text-[#DC2626]">*</span></label>
                      <select
                        className="w-full h-[52px] bg-[#F5F1EB] rounded-xl px-5 text-[15px] font-medium text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 appearance-none cursor-pointer"
                        value={classForm.subject}
                        onChange={(e) => setClassForm({ ...classForm, subject: e.target.value })}
                      >
                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Room</label>
                      <input
                        placeholder="e.g. Online"
                        className="w-full h-[52px] bg-[#F5F1EB] rounded-xl px-5 text-[15px] font-medium text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40"
                        value={classForm.room}
                        onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                      />
                    </div>
                    
                    <div className="pt-4 flex gap-4">
                      <button type="button" onClick={() => setShowClassForm(false)} className="flex-1 h-[56px] rounded-xl bg-white text-[#1E1B2E] text-[15px] font-bold hover:bg-[#F5F1EB] transition-colors border border-[rgba(30,27,46,0.1)]">
                        Cancel
                      </button>
                      <button type="submit" disabled={loading} className="flex-[2] h-[56px] rounded-xl bg-[#1E1B2E] text-white text-[15px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#C9A96E] hover:text-[#1E1B2E] transition-all disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Class"}
                      </button>
                    </div>
                  </form>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
