"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Plus, Loader2, X, Globe, Lock, Users, Save, Upload } from "lucide-react";

const SUBJECTS = ["AI & ML", "Python", "Web Dev", "Mathematics", "Physics", "History", "Literature", "Other"];

interface Props {
  courses: any[];
}

export default function TeacherCoursesClient({ courses: initialCourses }: Props) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ title: "", description: "", subject: "Python", thumbnail: "", isPublic: true });

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

  return (
    <div className="flex flex-col h-full bg-[#F5F1EB] font-sans text-[#1E1B2E]">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl font-medium shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-3 transition-opacity duration-300 ${toast.type === "success" ? "bg-[#1E1B2E] text-white" : "bg-[#DC2626] text-white"}`}
        >
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-[1200px] mx-auto pb-20">
        
        {/* PAGE HEADER */}
        <div className="pt-8 px-8">
          <h1 className="font-heading text-[28px] text-[#1E1B2E] mb-2">Manage Courses</h1>
          <p className="font-sans text-[14px] text-[#8E8E93]">Create and manage your course catalogue.</p>
        </div>

        {/* ACTION BAR */}
        <div className="flex justify-end items-center py-6 px-8">
          <button 
            onClick={() => setShowForm(true)}
            className="h-10 px-5 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] text-[14px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(201,169,110,0.2)] transition-all"
          >
            <Plus size={16} /> Create New Course
          </button>
        </div>

        {/* COURSES GRID / EMPTY STATE */}
        <div className="px-8 pb-8">
          {courses.length === 0 ? (
            <div className="w-full bg-white rounded-[16px] p-[60px] flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-center border border-black/5">
              <BookOpen size={48} className="text-[#1E1B2E] opacity-25" />
              <h3 className="font-heading text-[20px] text-[#1E1B2E] mt-[16px]">No Courses Yet</h3>
              <p className="font-sans text-[14px] text-[#8E8E93] mt-2 max-w-[360px]">Create your first course to start building your catalogue.</p>
              <button 
                onClick={() => setShowForm(true)}
                className="mt-6 h-[44px] px-6 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] text-[14px] font-bold shadow-md transition-all"
              >
                Create New Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  className="group bg-white rounded-[16px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)] flex flex-col h-full border border-[rgba(30,27,46,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300"
                >
                  <div className="relative aspect-video w-full bg-[rgba(245,241,235,0.6)] flex items-center justify-center overflow-hidden shrink-0">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <BookOpen size={40} className="text-[#8E8E93] opacity-40" />
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(201,169,110,0.9)] text-[#1E1B2E] font-sans text-[11px] font-bold uppercase tracking-wide">
                      {course.subject}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-heading text-[18px] text-[#1E1B2E] line-clamp-1">{course.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[#8E8E93] text-[13px] font-medium font-sans">
                      <Users size={14} />
                      <span>{course._count?.enrollments ?? 0} students enrolled</span>
                    </div>
                    <p className="font-sans text-[13px] text-[#8E8E93] line-clamp-2 mt-2 leading-[1.5] flex-1">
                      {course.description}
                    </p>
                  </div>

                  <div className="px-5 pb-5 flex items-center gap-2.5 shrink-0 mt-auto">
                    <Link href={`/dashboard/teacher/courses/${course.id}`} className="flex-1">
                      <button 
                        className="w-full h-[36px] bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all shadow-sm"
                      >
                        Edit
                      </button>
                    </Link>
                    <Link href={`/dashboard/teacher/courses/${course.id}`} className="flex-1">
                      <button 
                        className="w-full h-[36px] bg-[#F5F1EB] hover:bg-[#EBE5DB] border border-[rgba(30,27,46,0.1)] text-[#8E8E93] hover:text-[#1E1B2E] rounded-xl text-[12px] font-bold uppercase tracking-wider transition-colors"
                      >
                        View Students
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREATE COURSE MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-[24px] border-b border-[rgba(30,27,46,0.08)]">
                <h2 className="font-heading text-[24px] text-[#1E1B2E]">Create New Course</h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(30,27,46,0.04)] text-[#8E8E93] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-[32px]">
                <form onSubmit={handleCreate} className="space-y-[24px]">
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Course Title *</label>
                    <input
                      required
                      placeholder="e.g. Introduction to Python"
                      className="w-full h-12 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Subject *</label>
                    <select
                      className="w-full h-12 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all appearance-none"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    >
                      {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Description *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe what students will learn in this course..."
                      className="w-full bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-3 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Cover Photo</label>
                    <div className="flex gap-4 items-center">
                      {form.thumbnail ? (
                        <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm">
                           <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                           <button type="button" onClick={() => setForm({...form, thumbnail: ""})} className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-600 shadow-md">
                             <X size={12} />
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
                          <div className="h-12 border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl flex items-center justify-center gap-2 hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.03)] transition-all text-[#8E8E93] text-[14px]">
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : <><Upload size={16} /> Select Image</>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Course Type *</label>
                    <div className="flex gap-3">
                      <div onClick={() => setForm({ ...form, isPublic: true })} className={`flex-1 flex items-center p-3 rounded-xl border cursor-pointer transition-all ${form.isPublic ? "border-[#C9A96E] bg-[rgba(201,169,110,0.06)]" : "border-[rgba(30,27,46,0.12)] bg-white hover:border-[rgba(30,27,46,0.2)]"}`}>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mr-3 ${form.isPublic ? "border-[#C9A96E]" : "border-[rgba(30,27,46,0.12)]"}`}>
                          {form.isPublic && <div className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-[#1E1B2E]">Public</div>
                        </div>
                      </div>
                      <div onClick={() => setForm({ ...form, isPublic: false })} className={`flex-1 flex items-center p-3 rounded-xl border cursor-pointer transition-all ${!form.isPublic ? "border-[#C9A96E] bg-[rgba(201,169,110,0.06)]" : "border-[rgba(30,27,46,0.12)] bg-white hover:border-[rgba(30,27,46,0.2)]"}`}>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mr-3 ${!form.isPublic ? "border-[#C9A96E]" : "border-[rgba(30,27,46,0.12)]"}`}>
                          {!form.isPublic && <div className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-[#1E1B2E]">Private</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-12 rounded-xl border border-[rgba(30,27,46,0.12)] text-[#1E1B2E] text-[14px] font-medium hover:bg-[rgba(30,27,46,0.04)] transition-all">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="flex-1 h-12 rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(30,27,46,0.2)] transition-all disabled:opacity-50">
                      {loading ? <><Loader2 className="animate-spin" size={16} /> Publishing...</> : "Publish Course"}
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
