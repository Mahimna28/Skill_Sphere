"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Users, Plus, Loader2, X, Globe, Code } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SUBJECTS = ["AI & ML", "Python", "Web Dev", "CS Fundamentals", "Databases", "Networking", "Systems", "Security", "Cloud", "Electronics", "Software Eng.", "Java", "Mathematics", "Other"];

export default function GlobalCoursesClient({ superadmin, initialCourses }: { superadmin: any, initialCourses: any[] }) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ title: "", description: "", subject: "Python", thumbnail: "", isPublic: true, details: "" });

  const totalStudents = courses.reduce((sum: number, c: any) => sum + (c._count?.enrollments || 0), 0);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingCourseId ? `/api/courses/${editingCourseId}` : "/api/courses";
      const method = editingCourseId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        showToast(editingCourseId ? "✅ Course Updated Successfully" : "✅ Course Created Successfully", "success");
        setShowForm(false);
        setEditingCourseId(null);
        setForm({ title: "", description: "", subject: "Python", thumbnail: "", isPublic: true, details: "" });
        router.refresh();
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast(data.message || "Failed to save course", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (course: any) => {
    setForm({
      title: course.title,
      description: course.description || "",
      subject: course.subject || "Python",
      thumbnail: course.thumbnail || "",
      isPublic: course.isPublic ?? true,
      details: course.details || ""
    });
    setEditingCourseId(course.id);
    setShowForm(true);
  };

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }
  };

  return (
    <div
      className="flex flex-col bg-[#F5F1EB] min-h-screen w-full font-sans pb-20 overflow-x-hidden min-w-0"
    >
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] font-sans font-medium text-[14px] z-50 animate-in slide-in-from-top-2 ${toast.type === "success" ? "bg-[#C9A96E] text-white" : "bg-[#DC2626] text-white"}`}>
          {toast.message}
        </div>
      )}

      {/* Course Creation Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-[rgba(30,27,46,0.6)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="w-full max-w-2xl bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col"
          >
            <div className="px-[24px] py-[20px] border-b border-[rgba(30,27,46,0.08)] flex items-center justify-between">
              <h2 className="font-heading text-[22px] text-[#1E1B2E]">{editingCourseId ? "Edit Global Course" : "Deploy Global Course"}</h2>
              <button onClick={() => { setShowForm(false); setEditingCourseId(null); }} className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[#8E8E93] hover:bg-[rgba(30,27,46,0.04)] hover:text-[#1E1B2E] transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-[24px] overflow-y-auto max-h-[75vh]">
              <form onSubmit={handleCreateCourse} className="flex flex-col gap-[20px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                  <div className="flex flex-col gap-[8px]">
                    <Label className="font-sans text-[13px] font-medium text-[#1E1B2E]">Course Title *</Label>
                    <input required placeholder="e.g. Advanced Networking" className="w-full h-[44px] px-[16px] rounded-xl border border-[rgba(30,27,46,0.12)] font-sans text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <Label className="font-sans text-[13px] font-medium text-[#1E1B2E]">Subject / Category *</Label>
                    <select required className="w-full h-[44px] px-[16px] rounded-xl border border-[rgba(30,27,46,0.12)] font-sans text-[14px] text-[#1E1B2E] bg-white focus:outline-none focus:border-[#C9A96E] focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <Label className="font-sans text-[13px] font-medium text-[#1E1B2E]">Description *</Label>
                  <textarea required rows={3} placeholder="Describe what students will learn..." className="w-full px-[16px] py-[12px] rounded-xl border border-[rgba(30,27,46,0.12)] font-sans text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <Label className="font-sans text-[13px] font-medium text-[#1E1B2E]">Cover Photo <span className="text-[#8E8E93] font-normal">(optional)</span></Label>
                  <div className="flex gap-[12px] items-center">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="flex-1 h-[44px] px-[16px] py-[10px] rounded-xl border border-[rgba(30,27,46,0.12)] font-sans text-[13px] text-[#1E1B2E] cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[12px] file:font-medium file:bg-[rgba(201,169,110,0.1)] file:text-[#C9A96E] hover:file:bg-[rgba(201,169,110,0.2)]" 
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
                    />
                    {form.thumbnail && (
                      <div className="h-[44px] w-[44px] rounded-lg border border-[rgba(30,27,46,0.12)] overflow-hidden shrink-0">
                         <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <Label className="font-sans text-[13px] font-medium text-[#1E1B2E]">Course Details <span className="text-[#8E8E93] font-normal">(Detailed Description)</span></Label>
                  <textarea rows={5} placeholder="Write a comprehensive description..." className="w-full px-[16px] py-[12px] rounded-xl border border-[rgba(30,27,46,0.12)] font-sans text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all resize-y" value={(form as any).details || ""} onChange={(e) => setForm({ ...form, details: e.target.value } as any)} />
                </div>
                <div className="flex gap-[12px] pt-[12px]">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-[44px] rounded-xl border border-[#1E1B2E] text-[#1E1B2E] font-sans text-[14px] font-medium hover:bg-[rgba(30,27,46,0.04)] transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 h-[44px] rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-sans text-[14px] font-medium hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(201,169,110,0.3)] transition-all flex items-center justify-center">
                    {loading ? <><Loader2 className="mr-[8px] h-[16px] w-[16px] animate-spin" /> Saving...</> : (editingCourseId ? "Update Global Course" : "Publish Global Course")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-[32px] pt-[8px] pb-[24px] gap-[16px]">
        <p className="font-sans text-[14px] text-[#8E8E93]">Platform-wide courses managed by the Superadmin.</p>
        
        <div className="flex flex-row gap-[12px]">
          {!courses.some((c: any) => c.title === "CS50: Introduction to Computer Science") && (
            <button 
              onClick={async () => {
                if (confirm("Are you sure you want to instantly deploy 10 Free CS Courses?")) {
                  setLoading(true);
                  try {
                    const res = await fetch("/api/admin/seed-courses", { method: "POST" });
                    const data = await res.json();
                    if (res.ok) {
                      showToast(data.message, "success");
                      setTimeout(() => window.location.reload(), 1500);
                    } else {
                      showToast(data.message, "error");
                    }
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              disabled={loading}
              className="flex items-center h-[40px] px-[18px] rounded-xl border border-[#1E1B2E] text-[#1E1B2E] font-sans text-[13px] font-medium hover:bg-[#1E1B2E] hover:text-white transition-colors disabled:opacity-50"
            >
              <Code size={14} className="mr-[6px]" /> Seed Free CS Courses
            </button>
          )}
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center h-[40px] px-[18px] rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-sans text-[13px] font-medium hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(201,169,110,0.3)] transition-all"
          >
            <Plus size={14} className="mr-[6px]" /> Deploy New Course
          </button>
        </div>
      </div>

      {/* STATS CARDS ROW */}
      <div 
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-[24px] px-[32px] pb-[24px]"
      >
        <div variants={itemVariants} className="bg-white rounded-[16px] p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col">
          <div className="flex items-center justify-between mb-[16px]">
            <span className="font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">Global Courses</span>
            <Globe size={20} className="text-[#8E8E93]" />
          </div>
          <div className="font-heading text-[32px] text-[#1E1B2E] leading-none mb-[8px]">{courses.length}</div>
          <div className="font-sans text-[13px] text-[#8E8E93]">Platform-wide</div>
        </div>
        
        <div variants={itemVariants} className="bg-white rounded-[16px] p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col">
          <div className="flex items-center justify-between mb-[16px]">
            <span className="font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">Total Global Students</span>
            <Users size={20} className="text-[#8E8E93]" />
          </div>
          <div className="font-heading text-[32px] text-[#1E1B2E] leading-none mb-[8px]">{totalStudents}</div>
          <div className="font-sans text-[13px] text-[#8E8E93]">Enrolled across all</div>
        </div>
      </div>

      {/* ACTIVE GLOBAL COURSES SECTION */}
      <div>
        <h2 className="font-heading text-[20px] text-[#1E1B2E] px-[32px] pt-[24px] pb-[16px] flex items-center gap-[8px]">
          <BookOpen size={18} className="text-[#1E1B2E]" /> Active Global Courses
        </h2>
        
        {courses.length === 0 ? (
          <div
            className="bg-white rounded-[16px] mx-[32px] mb-[32px] p-[80px_24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-center text-center"
          >
            <Globe size={48} className="text-[#1E1B2E] opacity-25 mb-[20px]" />
            <h3 className="font-heading text-[20px] text-[#1E1B2E]">No Global Courses Yet</h3>
            <p className="font-sans text-[14px] text-[#8E8E93] max-w-[400px] mt-[8px] leading-[1.6]">
              Create your first public course to make it available to all students platform-wide.
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-[24px] h-[44px] px-[24px] rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-sans text-[14px] font-medium hover:scale-[1.02] transition-transform"
            >
              Deploy Course Now
            </button>
          </div>
        ) : (
          <div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] px-[32px] pb-[32px]"
          >
            {courses.map((course) => (
              <div 
                key={course.id} 
                variants={itemVariants}
                className="bg-white rounded-[16px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                <div className="w-full aspect-[16/9] relative overflow-hidden shrink-0">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[rgba(245,241,235,0.6)] flex items-center justify-center">
                      <Globe size={32} className="text-[#8E8E93]" />
                    </div>
                  )}
                </div>
                
                <div className="p-[20px] flex flex-col flex-1">
                  <h3 className="font-heading text-[18px] text-[#1E1B2E] line-clamp-2 leading-snug" title={course.title}>
                    {course.title}
                  </h3>
                  
                  <div className="mt-[12px] flex items-center">
                    <span className="inline-flex items-center bg-[rgba(201,169,110,0.1)] text-[#C9A96E] px-[10px] py-[4px] rounded-full font-sans text-[11px] font-medium tracking-wide">
                      {course.subject}
                    </span>
                  </div>
                  
                  <div className="mt-[6px] font-sans text-[13px] text-[#8E8E93] flex items-center gap-[6px]">
                    <Users size={14} /> {course._count?.enrollments || 0} students enrolled
                  </div>
                  
                  <p className="mt-[6px] font-sans text-[13px] text-[#8E8E93] line-clamp-2 leading-[1.5]">
                    {course.description}
                  </p>
                </div>
                
                <div className="px-[20px] pb-[20px] flex flex-row gap-[10px] mt-auto">
                  <button 
                    onClick={() => handleEditClick(course)}
                    className="flex-1 h-[36px] rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-sans text-[13px] font-medium transition-colors hover:brightness-105"
                  >
                    Edit
                  </button>
                  <Link href={`/dashboard/teacher/courses/${course.id}`} className="flex-1">
                    <button className="w-full h-[36px] rounded-xl border border-[#1E1B2E] text-[#1E1B2E] font-sans text-[13px] font-medium hover:bg-[#1E1B2E] hover:text-white transition-colors">
                      Manage
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
