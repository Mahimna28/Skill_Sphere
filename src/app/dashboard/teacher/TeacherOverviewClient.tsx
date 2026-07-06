"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Users, Plus, Loader2, X, Globe, Lock, ShieldAlert } from "lucide-react";

const SUBJECTS = ["AI & ML", "Python", "Web Dev", "CS Fundamentals", "Databases", "Networking", "Systems", "Security", "Cloud", "Electronics", "Software Eng.", "Java", "Mathematics", "Other"];

interface Props {
  teacher: any;
  initialCourses: any[];
}

export default function TeacherOverviewClient({ teacher, initialCourses }: Props) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ title: "", description: "", subject: "Python", thumbnail: "", isPublic: true });

  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [promotionReason, setPromotionReason] = useState("");
  const [promotionLoading, setPromotionLoading] = useState(false);

  const totalStudents = courses.reduce((sum, c) => sum + (c._count?.enrollments || 0), 0);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
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
        const newCourse = { ...data.course, _count: { enrollments: 0 } };
        setCourses((prev) => [newCourse, ...prev]);
        setForm({ title: "", description: "", subject: "Python", thumbnail: "", isPublic: true });
        setShowForm(false);
        showToast("Course created successfully!", "success");
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

  const handlePromotionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromotionLoading(true);
    try {
      const res = await fetch("/api/teacher/promote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: promotionReason }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowPromotionForm(false);
        setPromotionReason("");
        showToast(data.message, "success");
      } else {
        showToast(data.message || "Failed to submit request", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setPromotionLoading(false);
    }
  };

  return (
    <div className="font-sans pb-12 text-[#1E1B2E]">
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl font-medium text-[14px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-opacity duration-300 ${
            toast.type === "success" ? "bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]" : "bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626]"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Welcome Section */}
      <div className="pt-8 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-heading text-[28px] text-[#1E1B2E] mb-2">
            Welcome, {teacher?.name?.split(" ")[0] || "Teacher"}!
          </h1>
          <p className="text-[14px] text-[#8E8E93]">
            Manage your courses and track student progress.
          </p>
        </div>
        <div className="flex gap-3">
          {teacher?.role === "teacher" && (
            <button 
              onClick={() => setShowPromotionForm(true)}
              className="h-[40px] px-5 rounded-xl border border-[#1E1B2E] text-[#1E1B2E] text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#1E1B2E] hover:text-white transition-colors"
            >
              <ShieldAlert size={16} /> Request Promotion
            </button>
          )}
          <button 
            onClick={() => setShowForm(true)}
            className="h-[40px] px-5 rounded-xl bg-[#C9A96E] text-[#1E1B2E] text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#D6B87D] shadow-[0_4px_16px_rgba(201,169,110,0.2)] transition-all"
          >
            <Plus size={16} /> Create New Course
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {[
          { label: "Active Courses", value: courses.length, subtext: "Published", icon: BookOpen },
          { label: "Total Students", value: totalStudents, subtext: "Across all courses", icon: Users },
        ].map((stat, i) => (
          <div 
            key={i}
            className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] h-full border border-[rgba(30,27,46,0.04)]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-[#8E8E93]" />
            </div>
            <div className="font-heading text-[32px] text-[#1E1B2E] mb-1 leading-tight">{stat.value}</div>
            <div className="text-[13px] text-[#8E8E93]">{stat.subtext}</div>
          </div>
        ))}
      </div>

      {/* Your Courses Section */}
      <div>
        <h2 className="font-heading text-[24px] text-[#1E1B2E] mb-6">Your Courses</h2>
        
        {courses.length === 0 ? (
          <div
            className="bg-white rounded-[16px] py-[60px] px-8 shadow-[0_4px_16px_rgba(0,0,0,0.05)] text-center flex flex-col items-center max-w-[640px] mx-auto border border-black/5"
          >
            <BookOpen size={48} className="text-[#1E1B2E] opacity-25 mb-4" />
            <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-2">No Courses Yet</h3>
            <p className="text-[14px] text-[#8E8E93] max-w-[360px] mb-5">
              Create your first course to start teaching!
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="h-[44px] px-6 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] text-[14px] font-bold transition-all shadow-md"
            >
              Create New Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <div 
                key={course.id}
                className="group bg-white rounded-[16px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)] h-full flex flex-col border border-[rgba(30,27,46,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                <div className="h-40 bg-[rgba(245,241,235,0.6)] relative overflow-hidden flex items-center justify-center shrink-0">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <BookOpen size={32} className="text-[#8E8E93]" />
                  )}
                  <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                    course.isPublic ? "bg-[rgba(201,169,110,0.9)] text-[#1E1B2E]" : "bg-[rgba(30,27,46,0.8)] text-white"
                  }`}>
                    {course.isPublic ? <Globe size={12} /> : <Lock size={12} />}
                    <span className="text-[11px] font-bold uppercase tracking-wider">{course.isPublic ? "Public" : "Private"}</span>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-heading text-[18px] text-[#1E1B2E] mb-1">{course.title}</h3>
                  <div className="flex items-center gap-1.5 text-[13px] text-[#8E8E93] mb-2 font-medium">
                    <Users size={14} /> {course._count?.enrollments || 0} enrolled
                  </div>
                  <p className="text-[13px] text-[#8E8E93] line-clamp-2 leading-relaxed flex-1">
                    {course.description}
                  </p>
                </div>
                
                <div className="px-5 pb-5 flex gap-2.5 shrink-0 mt-auto">
                  <Link href={`/dashboard/teacher/courses/${course.id}`} className="flex-1">
                    <button 
                      className="w-full h-[36px] rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] text-[12px] font-bold uppercase tracking-wider transition-all flex items-center justify-center shadow-sm"
                    >
                      Manage
                    </button>
                  </Link>
                  <Link href={`/dashboard/teacher/courses/${course.id}`} className="flex-1">
                    <button 
                      className="w-full h-[36px] rounded-xl bg-[#F5F1EB] hover:bg-[#EBE5DB] text-[#8E8E93] hover:text-[#1E1B2E] text-[12px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center border border-[rgba(30,27,46,0.1)]"
                    >
                      Students
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[600px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-8 py-6 border-b border-[rgba(30,27,46,0.06)] flex items-center justify-between">
                <h2 className="font-heading text-[20px] text-[#1E1B2E]">Create New Course</h2>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-[rgba(30,27,46,0.04)] flex items-center justify-center text-[#8E8E93] hover:bg-[rgba(30,27,46,0.08)] transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-8">
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2.5">Course Title *</label>
                    <input required placeholder="e.g. Introduction to Python" className="w-full h-11 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2.5">Subject *</label>
                    <select className="w-full h-11 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                      {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2.5">Description *</label>
                    <textarea required rows={4} placeholder="Describe what students will learn..." className="w-full bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-4 text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2.5">Cover Photo <span className="opacity-60">(optional)</span></label>
                    <div className="flex gap-4 items-center">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="w-full h-11 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[rgba(201,169,110,0.1)] file:text-[#C9A96E] hover:file:bg-[rgba(201,169,110,0.2)] focus:outline-none transition-all flex items-center" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setLoading(true);
                          try {
                            const formData = new FormData();
                            formData.append("file", file);
                            const res = await fetch("/api/upload", { method: "POST", body: formData });
                            const data = await res.json();
                            if (res.ok) {
                              setForm({ ...form, thumbnail: data.url });
                              showToast("Image uploaded successfully!", "success");
                            }
                          } catch (err) {
                            showToast("Upload failed", "error");
                          } finally {
                            setLoading(false);
                          }
                        }} 
                      />
                      {form.thumbnail && (
                        <div className="w-11 h-11 rounded-lg border border-[rgba(30,27,46,0.1)] overflow-hidden shrink-0">
                           <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2.5">Course Type *</label>
                    <div className="flex gap-4">
                      <div 
                        onClick={() => setForm({ ...form, isPublic: true })} 
                        className={`flex-1 flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${form.isPublic ? "border-[#C9A96E] bg-[rgba(201,169,110,0.04)]" : "border-[rgba(30,27,46,0.12)] bg-white hover:border-[rgba(30,27,46,0.2)]"}`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${form.isPublic ? "border-[#C9A96E]" : "border-[#8E8E93]"}`}>
                          {form.isPublic && <div className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                        </div>
                        <div>
                          <div className="text-[14px] font-medium text-[#1E1B2E] flex items-center gap-1.5"><Globe size={14} /> Public Course</div>
                          <div className="text-[12px] text-[#8E8E93] mt-1">Visible to everyone on the courses page.</div>
                        </div>
                      </div>
                      <div 
                        onClick={() => setForm({ ...form, isPublic: false })} 
                        className={`flex-1 flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${!form.isPublic ? "border-[#C9A96E] bg-[rgba(201,169,110,0.04)]" : "border-[rgba(30,27,46,0.12)] bg-white hover:border-[rgba(30,27,46,0.2)]"}`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${!form.isPublic ? "border-[#C9A96E]" : "border-[#8E8E93]"}`}>
                          {!form.isPublic && <div className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                        </div>
                        <div>
                          <div className="text-[14px] font-medium text-[#1E1B2E] flex items-center gap-1.5"><Lock size={14} /> Private Class</div>
                          <div className="text-[12px] text-[#8E8E93] mt-1">Hidden. Add students manually.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-[48px] rounded-xl border border-[rgba(30,27,46,0.12)] text-[#1E1B2E] text-[14px] font-medium hover:bg-[rgba(30,27,46,0.04)] transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="flex-1 h-[48px] rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center">
                      {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Publish"}
                    </button>
                  </div>
                </form>
              </div>
          </div>
        </div>
      )}

      {showPromotionForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-8 py-6 border-b border-[rgba(30,27,46,0.06)] flex items-center justify-between">
                <h2 className="font-heading text-[20px] text-[#1E1B2E] flex items-center gap-2"><ShieldAlert size={20} /> Request Promotion</h2>
                <button onClick={() => setShowPromotionForm(false)} className="w-8 h-8 rounded-full bg-[rgba(30,27,46,0.04)] flex items-center justify-center text-[#8E8E93] hover:bg-[rgba(30,27,46,0.08)] transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-8">
                <form onSubmit={handlePromotionRequest} className="space-y-6">
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2.5">Why do you want to become an Institute Admin? *</label>
                    <textarea required rows={4} placeholder="E.g., I want to manage my school's departments and teachers..." className="w-full bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-4 text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y" value={promotionReason} onChange={(e) => setPromotionReason(e.target.value)} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowPromotionForm(false)} className="flex-1 h-[48px] rounded-xl border border-[rgba(30,27,46,0.12)] text-[#1E1B2E] text-[14px] font-medium hover:bg-[rgba(30,27,46,0.04)] transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={promotionLoading} className="flex-1 h-[48px] rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center">
                      {promotionLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Request"}
                    </button>
                  </div>
                </form>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
