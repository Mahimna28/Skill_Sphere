"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, ArrowLeft, Loader2, Plus, BookOpen, Video, FileText, Users, X, Upload, File, Pencil, Check, ChevronUp, Link as LinkIcon, Edit3, Globe, Lock, FileCheck, UserPlus, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function getEmbedUrl(url: string) {
  if (!url) return url;
  try {
    if (url.includes("youtube.com/watch")) {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (e) {
    return url;
  }
  return url;
}

export default function ManageCourseClient({ course, studentsProgress = [] }: { course: any, studentsProgress?: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "curriculum" | "students" | "gradebook" | "assignments">("settings");
  
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    subject: course.subject,
    thumbnail: course.thumbnail || "",
    isPublic: course.isPublic ?? true,
  });

  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  
  // Curriculum UX state
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [activeModuleContentType, setActiveModuleContentType] = useState<"video" | "material" | "assignment" | null>(null);
  
  const [newLesson, setNewLesson] = useState({ 
    title: "", 
    content: "", 
    videoSource: "youtube", // 'youtube' | 'upload'
    videoUrl: "",
    fileUrl: "",
    fileType: ""
  });

  const [editingLesson, setEditingLesson] = useState<{ id: string; title: string; content: string; videoUrl: string } | null>(null);
  const [gradeStates, setGradeStates] = useState<{[key: string]: "idle" | "saving" | "saved"}>({});
  
  const [globalAssignmentFileUrl, setGlobalAssignmentFileUrl] = useState("");
  const [uploadingAssignment, setUploadingAssignment] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, thumbnail: data.url }));
      } else {
        alert(data.message || "Upload failed");
      }
    } catch { alert("Upload error."); }
    finally { setThumbnailUploading(false); }
  };

  const handleDeleteCourse = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${course.title}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, { method: "DELETE" });
      if (res.ok) router.push("/dashboard/teacher/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: studentEmail }),
      });
      if (res.ok) {
        setStudentEmail("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    if (!confirm("Unenroll this student?")) return;
    setLoading(true);
    try {
      await fetch(`/api/courses/${course.id}/enroll?enrollmentId=${enrollmentId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRequest = async (requestId: string, action: "approve" | "reject") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/leave-request`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action })
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Failed to ${action} drop request: ${data.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/assignments/${assignmentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Failed to delete assignment: ${data.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async () => {
    if (!newModuleTitle) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "module", title: newModuleTitle }),
      });
      if (res.ok) {
        setNewModuleTitle("");
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Failed to add module: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!newLesson.title) return;
    setLoading(true);
    try {
      const finalVideoUrl = newLesson.videoUrl ? getEmbedUrl(newLesson.videoUrl) : "";
      const res = await fetch(`/api/courses/${course.id}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "lesson", 
          moduleId,
          title: newLesson.title,
          content: newLesson.content,
          videoUrl: finalVideoUrl,
          fileUrl: newLesson.fileUrl,
          fileType: newLesson.fileType
        }),
      });
      if (res.ok) {
        setNewLesson({ title: "", content: "", videoSource: "youtube", videoUrl: "", fileUrl: "", fileType: "" });
        setActiveModuleContentType(null);
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Failed to add content: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isVideo: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        if (isVideo) {
          setNewLesson(prev => ({ ...prev, videoUrl: data.url }));
        } else {
          setNewLesson(prev => ({ ...prev, fileUrl: data.url, fileType: data.type || "document" }));
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (type: "module" | "lesson", targetId: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    setLoading(true);
    try {
      await fetch(`/api/courses/${course.id}/content?type=${type}&targetId=${targetId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!editingLesson) return;
    setLoading(true);
    try {
      const finalUrl = editingLesson.videoUrl ? getEmbedUrl(editingLesson.videoUrl) : "";
      const res = await fetch(`/api/lessons/${editingLesson.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingLesson.title, content: editingLesson.content, videoUrl: finalUrl }),
      });
      if (res.ok) {
        setEditingLesson(null);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: "settings", label: "Settings", icon: Save },
    { id: "curriculum", label: "Curriculum", icon: BookOpen },
    { id: "students", label: "Students", icon: Users },
    { id: "gradebook", label: "Gradebook", icon: FileText },
    { id: "assignments", label: "Assignments", icon: FileText },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F1EB] font-sans text-[#1E1B2E]">
      <div className="w-full pb-20">
        
        {/* Page Header */}
        <div className="pt-10 px-8 flex items-center gap-4 mb-4">
          <Link href="/dashboard/teacher/courses">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[rgba(30,27,46,0.1)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[#1E1B2E] hover:bg-[#1E1B2E] hover:text-white transition-all">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="font-heading text-[28px] md:text-[32px] text-[#1E1B2E] tracking-tight">{course.title}</h1>
            <p className="text-[13px] text-[#8E8E93] mt-1">Manage course content, students, and settings.</p>
          </div>
        </div>
        
        {/* Sticky Tabs */}
        <div className="sticky top-0 z-40 px-8 bg-[#F5F1EB]/80 backdrop-blur-xl border-b border-[rgba(30,27,46,0.06)] pt-2 flex gap-2 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-4 font-bold text-[13px] uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'text-[#1E1B2E]' : 'text-[#8E8E93] hover:text-[#1E1B2E]'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C9A96E] rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="pt-8">
          <AnimatePresence mode="wait">
            {activeTab === "settings" && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col md:flex-row gap-8 px-8"
              >
                {/* LEFT COLUMN */}
                <div className="w-full md:w-2/3 space-y-6">
                  <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(30,27,46,0.04)] border border-white">
                    <form onSubmit={handleUpdate} className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Course Title</label>
                        <input required className="w-full h-12 bg-white border-2 border-transparent border-b-[rgba(30,27,46,0.1)] focus:border-b-[#C9A96E] px-2 text-[16px] font-medium text-[#1E1B2E] focus:outline-none transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Subject</label>
                        <input required className="w-full h-12 bg-white border-2 border-[rgba(30,27,46,0.1)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Description</label>
                        <textarea required className="w-full min-h-[120px] bg-white border-2 border-[rgba(30,27,46,0.1)] rounded-xl p-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y leading-relaxed" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Cover Photo</label>
                        <div className="flex gap-4 items-center">
                          {formData.thumbnail ? (
                            <div className="relative w-[160px] h-[100px] rounded-xl overflow-hidden shadow-inner group">
                              <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                              <button type="button" onClick={() => setFormData(prev => ({...prev, thumbnail: ""}))} className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#DC2626] shadow-sm hover:scale-110 transition-transform">
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <label className="w-full border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl py-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.03)] transition-all bg-[#F5F1EB]/50">
                              {thumbnailUploading ? (
                                <><Loader2 size={24} className="animate-spin text-[#C9A96E] mb-2" /><span className="text-[13px] font-medium text-[#8E8E93]">Uploading...</span></>
                              ) : (
                                <><Upload size={24} className="text-[#8E8E93] mb-2" /><span className="text-[13px] font-medium text-[#8E8E93]">Click to Upload Image</span></>
                              )}
                              <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={thumbnailUploading} />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Visibility</label>
                        <div className="flex gap-4 bg-[rgba(30,27,46,0.02)] p-1.5 rounded-2xl border border-[rgba(30,27,46,0.05)]">
                          <button type="button" onClick={() => setFormData({ ...formData, isPublic: true })} className={`flex-1 flex flex-col items-center p-3 rounded-xl transition-all ${formData.isPublic ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-[rgba(30,27,46,0.05)]" : "text-[#8E8E93] hover:text-[#1E1B2E]"}`}>
                            <Globe size={18} className={`mb-1 ${formData.isPublic ? "text-[#C9A96E]" : ""}`} />
                            <span className={`text-[13px] font-bold ${formData.isPublic ? "text-[#1E1B2E]" : ""}`}>Public</span>
                          </button>
                          <button type="button" onClick={() => setFormData({ ...formData, isPublic: false })} className={`flex-1 flex flex-col items-center p-3 rounded-xl transition-all ${!formData.isPublic ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-[rgba(30,27,46,0.05)]" : "text-[#8E8E93] hover:text-[#1E1B2E]"}`}>
                            <Lock size={18} className={`mb-1 ${!formData.isPublic ? "text-[#1E1B2E]" : ""}`} />
                            <span className={`text-[13px] font-bold ${!formData.isPublic ? "text-[#1E1B2E]" : ""}`}>Private</span>
                          </button>
                        </div>
                      </div>

                      <button type="submit" disabled={loading || thumbnailUploading} className="w-full h-[52px] rounded-xl bg-[#1E1B2E] text-white text-[14px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#2A2540] hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(30,27,46,0.2)] transition-all disabled:opacity-50 disabled:hover:translate-y-0">
                        {loading ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <><Save size={18} /> Save Settings</>}
                      </button>
                    </form>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-full md:w-1/3">
                  <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(30,27,46,0.04)] border border-[#DC2626]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#DC2626]/10 flex items-center justify-center text-[#DC2626]">
                        <Trash2 size={16} />
                      </div>
                      <h3 className="text-[15px] font-bold text-[#DC2626]">Danger Zone</h3>
                    </div>
                    <p className="text-[13px] text-[#8E8E93] leading-relaxed mb-5">
                      Deleting this course is permanent. All modules, lessons, and student progress will be erased.
                    </p>
                    <button onClick={handleDeleteCourse} disabled={loading} className="w-full h-11 rounded-xl border border-[#DC2626] text-[#DC2626] text-[13px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#DC2626] hover:text-white transition-all disabled:opacity-50">
                      Delete Course
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "curriculum" && (
              <motion.div key="curriculum" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-8 space-y-6">
                
                {/* Add Module Input */}
                <div className="bg-white p-4 rounded-[20px] shadow-[0_8px_24px_rgba(30,27,46,0.04)] flex gap-3 items-center border border-[rgba(30,27,46,0.05)]">
                  <div className="w-10 h-10 rounded-full bg-[#C9A96E]/10 flex items-center justify-center shrink-0">
                    <Plus size={20} className="text-[#C9A96E]" />
                  </div>
                  <input placeholder="Name your new module..." className="flex-1 h-12 bg-transparent text-[15px] text-[#1E1B2E] font-medium focus:outline-none placeholder:text-[#8E8E93]/60" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddModule()} />
                  <button onClick={handleAddModule} disabled={loading || !newModuleTitle} className="h-10 px-6 rounded-xl bg-[#1E1B2E] text-white text-[13px] font-bold uppercase tracking-wider hover:bg-[#2A2540] transition-colors disabled:opacity-50 shrink-0">
                    Add Module
                  </button>
                </div>

                <div className="space-y-4">
                  {course.modules.map((module: any, mIdx: number) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: mIdx * 0.05 }}
                      key={module.id} 
                      className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden border border-[rgba(30,27,46,0.05)]"
                    >
                      {/* Module Header */}
                      <div 
                        className="p-5 px-6 flex items-center justify-between cursor-pointer hover:bg-[#F5F1EB]/50 transition-colors"
                        onClick={() => setExpandedModuleId(expandedModuleId === module.id ? null : module.id)}
                      >
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full bg-[#1E1B2E] text-[#C9A96E] font-bold text-[13px] flex items-center justify-center">
                             {mIdx + 1}
                           </div>
                           <h4 className="font-heading text-[20px] text-[#1E1B2E]">{module.title}</h4>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[12px] font-medium text-[#8E8E93] px-3 py-1 rounded-full bg-[rgba(30,27,46,0.03)]">
                             {module.lessons?.length || 0} items
                           </span>
                           <button onClick={(e) => { e.stopPropagation(); handleDeleteItem("module", module.id); }} className="w-8 h-8 flex items-center justify-center rounded-full text-[#8E8E93] hover:text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors">
                             <Trash2 size={16} />
                           </button>
                           <ChevronUp size={20} className={`text-[#8E8E93] transition-transform duration-300 ${expandedModuleId === module.id ? "rotate-180" : ""}`} />
                        </div>
                      </div>

                      {/* Module Body */}
                      <AnimatePresence>
                        {expandedModuleId === module.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="border-t border-[rgba(30,27,46,0.05)] bg-[#F5F1EB]/30"
                          >
                            <div className="p-6 space-y-3">
                               {module.lessons?.map((lesson: any) => (
                                 <div key={lesson.id} className="relative group bg-white border border-[rgba(30,27,46,0.06)] rounded-[16px] p-4 flex items-start gap-4 hover:border-[#C9A96E]/50 hover:shadow-[0_4px_16px_rgba(201,169,110,0.1)] transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-[rgba(201,169,110,0.1)] text-[#C9A96E] flex items-center justify-center shrink-0">
                                      {lesson.fileType === 'assignment' ? <FileCheck size={20} /> : lesson.videoUrl ? <Video size={20} /> : <File size={20} />}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium text-[15px] text-[#1E1B2E] leading-tight">{lesson.title}</h5>
                                      {lesson.fileType === 'assignment' ? (
                                        <p className="text-[12px] text-[#8E8E93] mt-1 line-clamp-1">{lesson.content}</p>
                                      ) : (
                                        <div className="flex gap-2 mt-1.5">
                                          {lesson.videoUrl && <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] bg-[#1E1B2E]/5 px-2 py-0.5 rounded flex items-center gap-1"><Video size={10}/> Video</span>}
                                          {lesson.fileUrl && <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] bg-[#1E1B2E]/5 px-2 py-0.5 rounded flex items-center gap-1"><File size={10}/> Document</span>}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {lesson.fileType !== 'assignment' && (
                                        <button onClick={() => setEditingLesson(editingLesson?.id === lesson.id ? null : { id: lesson.id, title: lesson.title, content: lesson.content || "", videoUrl: lesson.videoUrl || "" })} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8E8E93] hover:bg-[rgba(30,27,46,0.04)] hover:text-[#1E1B2E]"><Pencil size={16} /></button>
                                      )}
                                      <button onClick={() => handleDeleteItem("lesson", lesson.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8E8E93] hover:bg-[#DC2626]/10 hover:text-[#DC2626]"><Trash2 size={16} /></button>
                                    </div>

                                    {/* Inline Edit Form */}
                                    {editingLesson?.id === lesson.id && (
                                      <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-md rounded-[16px] p-4 flex flex-col gap-3 shadow-[0_8px_32px_rgba(30,27,46,0.1)] border border-[#C9A96E]/30">
                                        <div className="flex gap-2">
                                          <input className="flex-1 h-10 bg-transparent border-b border-[rgba(30,27,46,0.1)] focus:border-[#C9A96E] text-[14px] font-medium text-[#1E1B2E] outline-none px-1" value={editingLesson?.title || ""} onChange={e => setEditingLesson(prev => prev ? {...prev, title: e.target.value} : null)} />
                                          <input placeholder="YouTube URL" className="flex-1 h-10 bg-transparent border-b border-[rgba(30,27,46,0.1)] focus:border-[#C9A96E] text-[14px] text-[#1E1B2E] outline-none px-1" value={editingLesson?.videoUrl || ""} onChange={e => setEditingLesson(prev => prev ? {...prev, videoUrl: e.target.value} : null)} />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                          <button onClick={() => setEditingLesson(null)} className="h-8 px-4 rounded-lg text-[12px] font-bold text-[#8E8E93] hover:bg-[rgba(30,27,46,0.05)]">Cancel</button>
                                          <button onClick={handleSaveLesson} className="h-8 px-4 rounded-lg bg-[#C9A96E] text-[#1E1B2E] text-[12px] font-bold uppercase tracking-wider hover:bg-[#D6B87D]">Save</button>
                                        </div>
                                      </div>
                                    )}
                                 </div>
                               ))}

                               {/* Add Content Buttons */}
                               {!activeModuleContentType ? (
                                 <div className="flex flex-wrap gap-3 mt-4">
                                   <button onClick={() => setActiveModuleContentType("video")} className="h-11 px-5 rounded-xl bg-white border border-[rgba(30,27,46,0.1)] hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.05)] text-[#1E1B2E] text-[13px] font-bold flex items-center gap-2 transition-colors">
                                     <Video size={16} className="text-[#C9A96E]" /> Add Video
                                   </button>
                                   <button onClick={() => setActiveModuleContentType("material")} className="h-11 px-5 rounded-xl bg-white border border-[rgba(30,27,46,0.1)] hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.05)] text-[#1E1B2E] text-[13px] font-bold flex items-center gap-2 transition-colors">
                                     <FileText size={16} className="text-[#C9A96E]" /> Add Reading / PDF
                                   </button>
                                   <button onClick={() => setActiveModuleContentType("assignment")} className="h-11 px-5 rounded-xl bg-white border border-[rgba(30,27,46,0.1)] hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.05)] text-[#1E1B2E] text-[13px] font-bold flex items-center gap-2 transition-colors">
                                     <FileCheck size={16} className="text-[#C9A96E]" /> Add Assignment
                                   </button>
                                 </div>
                               ) : (
                                 <div className="bg-white p-6 rounded-[20px] border border-[#C9A96E]/30 shadow-[0_8px_24px_rgba(201,169,110,0.05)] mt-4 relative">
                                   <button onClick={() => setActiveModuleContentType(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#8E8E93] hover:bg-[rgba(30,27,46,0.05)]"><X size={16}/></button>
                                   
                                   <h4 className="text-[14px] font-bold uppercase tracking-widest text-[#1E1B2E] mb-5 flex items-center gap-2">
                                     {activeModuleContentType === 'video' ? <><Video size={16} className="text-[#C9A96E]"/> New Video Lesson</> : activeModuleContentType === 'material' ? <><FileText size={16} className="text-[#C9A96E]"/> New Reading Material</> : <><FileCheck size={16} className="text-[#C9A96E]"/> New Module Assignment</>}
                                   </h4>

                                   <div className="space-y-4">
                                     <input placeholder={activeModuleContentType === 'assignment' ? "Assignment Title" : "Lesson Title"} className="w-full h-12 bg-transparent border-b-2 border-[rgba(30,27,46,0.1)] focus:border-[#C9A96E] text-[15px] font-medium text-[#1E1B2E] outline-none px-2 transition-colors" value={newLesson.title} onChange={e => setNewLesson({...newLesson, title: e.target.value})} />
                                     
                                     {activeModuleContentType === 'video' && (
                                       <div className="space-y-4">
                                         <div className="flex gap-4 mb-2">
                                            <label className={`flex items-center gap-2 text-[13px] font-bold cursor-pointer ${newLesson.videoSource === 'youtube' ? 'text-[#C9A96E]' : 'text-[#8E8E93]'}`}>
                                              <input type="radio" checked={newLesson.videoSource === 'youtube'} onChange={() => setNewLesson({...newLesson, videoSource: 'youtube', videoUrl: ""})} className="hidden" />
                                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${newLesson.videoSource === 'youtube' ? 'border-[#C9A96E]' : 'border-[rgba(30,27,46,0.2)]'}`}>
                                                {newLesson.videoSource === 'youtube' && <div className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                                              </div>
                                              YouTube Link
                                            </label>
                                            <label className={`flex items-center gap-2 text-[13px] font-bold cursor-pointer ${newLesson.videoSource === 'upload' ? 'text-[#C9A96E]' : 'text-[#8E8E93]'}`}>
                                              <input type="radio" checked={newLesson.videoSource === 'upload'} onChange={() => setNewLesson({...newLesson, videoSource: 'upload', videoUrl: ""})} className="hidden" />
                                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${newLesson.videoSource === 'upload' ? 'border-[#C9A96E]' : 'border-[rgba(30,27,46,0.2)]'}`}>
                                                {newLesson.videoSource === 'upload' && <div className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                                              </div>
                                              Upload Video
                                            </label>
                                         </div>

                                         {newLesson.videoSource === 'youtube' ? (
                                            <div className="relative">
                                              <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                                              <input placeholder="Paste YouTube URL here..." className="w-full h-12 bg-[#F5F1EB] rounded-xl pl-10 pr-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-[2px] focus:ring-[#C9A96E]/50" value={newLesson.videoUrl} onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})} />
                                            </div>
                                         ) : (
                                            <div className="relative">
                                              <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                              <div className="h-12 border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl flex items-center justify-center gap-2 bg-[#F5F1EB] text-[#8E8E93] text-[13px] font-medium">
                                                {uploading ? <Loader2 className="animate-spin text-[#C9A96E]" size={18} /> : <Upload size={18} />}
                                                {newLesson.videoUrl ? "Video Uploaded Successfully" : "Click to Upload Video (MP4)"}
                                              </div>
                                            </div>
                                         )}
                                       </div>
                                     )}

                                     {activeModuleContentType === 'material' && (
                                       <div className="relative">
                                          <input type="file" accept=".pdf,.ppt,.pptx" onChange={(e) => handleFileUpload(e, false)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                          <div className="h-12 border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl flex items-center justify-center gap-2 bg-[#F5F1EB] text-[#8E8E93] text-[13px] font-medium">
                                            {uploading ? <Loader2 className="animate-spin text-[#C9A96E]" size={18} /> : <Upload size={18} />}
                                            {newLesson.fileUrl ? "Document Uploaded" : "Click to Upload PDF/PPT"}
                                          </div>
                                       </div>
                                     )}

                                     {activeModuleContentType === 'assignment' && (
                                       <div className="space-y-4">
                                         <input placeholder="Assignment Title" className="w-full h-12 bg-transparent border-b border-[rgba(30,27,46,0.1)] focus:border-[#C9A96E] text-[14px] font-medium text-[#1E1B2E] outline-none px-1" value={newLesson.title} onChange={e => setNewLesson({...newLesson, title: e.target.value})} />
                                         <textarea rows={4} placeholder="Assignment instructions..." className="w-full bg-[#F5F1EB] rounded-xl p-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-[2px] focus:ring-[#C9A96E]/50 resize-none" value={newLesson.content} onChange={e => setNewLesson({...newLesson, content: e.target.value})} />
                                         <div className="relative">
                                           <input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx" onChange={(e) => handleFileUpload(e, false)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploading} />
                                           <div className="h-12 border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl flex items-center justify-center gap-2 bg-[#F5F1EB] text-[#8E8E93] text-[13px] font-medium hover:border-[#C9A96E] transition-colors">
                                             {uploading ? <Loader2 className="animate-spin text-[#C9A96E]" size={18} /> : <Upload size={18} />}
                                             {newLesson.fileUrl ? "Document Uploaded Successfully!" : "Click to Attach PDF/Document (Optional)"}
                                           </div>
                                         </div>
                                       </div>
                                     )}

                                     <div className="flex justify-end pt-2">
                                        <button 
                                          onClick={() => {
                                            if (activeModuleContentType === 'assignment') {
                                              newLesson.fileType = 'assignment';
                                            }
                                            handleAddLesson(module.id);
                                          }} 
                                          disabled={loading || uploading || !newLesson.title} 
                                          className="h-10 px-6 rounded-xl bg-[#1E1B2E] text-white text-[13px] font-bold uppercase tracking-wider hover:bg-[#2A2540] disabled:opacity-50 transition-colors"
                                        >
                                          {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Content"}
                                        </button>
                                     </div>
                                   </div>
                                 </div>
                               )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "students" && (
              <motion.div key="students" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-8 space-y-8">
                 <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] border border-white">
                    <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-6 flex items-center gap-2"><UserPlus size={20} className="text-[#C9A96E]" /> Invite Student</h3>
                    <form onSubmit={handleEnrollStudent} className="flex flex-col md:flex-row gap-4">
                       <input placeholder="Student Email Address" className="flex-1 h-12 bg-[#F5F1EB] rounded-xl px-5 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-[2px] focus:ring-[#C9A96E]/50 transition-shadow" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} required />
                       <button type="submit" disabled={loading} className="h-12 px-8 bg-[#1E1B2E] text-white rounded-xl text-[14px] font-bold uppercase tracking-wider hover:bg-[#2A2540] shadow-md transition-all flex items-center justify-center min-w-[140px]">
                         {loading ? <Loader2 size={18} className="animate-spin" /> : "Enroll Now"}
                       </button>
                    </form>
                 </div>

                 {course.leaveRequests?.length > 0 && (
                   <div className="bg-[#DC2626]/5 rounded-[24px] border border-[#DC2626]/20 p-6">
                      <h3 className="font-heading text-[18px] text-[#DC2626] mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" /> Pending Drop Requests
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {course.leaveRequests.map((req: any) => (
                           <div key={req.id} className="bg-white rounded-[16px] p-4 flex items-center justify-between shadow-sm border border-[#DC2626]/10">
                              <div>
                                 <p className="font-bold text-[#1E1B2E] text-[14px]">{req.user.name}</p>
                                 <p className="text-[12px] text-[#8E8E93]">{req.user.email}</p>
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => handleLeaveRequest(req.id, "reject")} className="w-8 h-8 rounded-full border border-[rgba(30,27,46,0.1)] flex items-center justify-center text-[#8E8E93] hover:text-[#1E1B2E] hover:bg-[rgba(30,27,46,0.05)]"><X size={14}/></button>
                                 <button onClick={() => handleLeaveRequest(req.id, "approve")} className="w-8 h-8 rounded-full bg-[#DC2626] flex items-center justify-center text-white hover:bg-[#B91C1C]"><Check size={14}/></button>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 <div>
                    <h3 className="font-heading text-[24px] text-[#1E1B2E] mb-6">Enrolled Roster ({course.enrollments?.length || 0})</h3>
                    {studentsProgress.length === 0 ? (
                      <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-[rgba(30,27,46,0.1)] rounded-[24px] bg-white/50">
                        <Users size={40} className="text-[#8E8E93]/40 mb-4" />
                        <p className="text-[14px] font-medium text-[#8E8E93]">No students enrolled yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {studentsProgress.map((student: any) => {
                           const enrId = course.enrollments.find((e: any) => e.userId === student.id)?.id;
                           return (
                             <div key={student.id} className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(30,27,46,0.04)] border border-white relative group">
                                <button onClick={() => enrId && handleUnenroll(enrId)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-sm border border-[rgba(30,27,46,0.05)] flex items-center justify-center text-[#8E8E93] hover:text-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X size={14}/>
                                </button>
                                
                                <div className="flex items-center gap-4 mb-5">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] text-[#C9A96E] font-heading text-[18px] flex items-center justify-center shadow-inner">
                                    {student.name.charAt(0)}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-[#1E1B2E] text-[15px]">{student.name}</h4>
                                    <p className="text-[12px] text-[#8E8E93]">{student.email}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                                    <span>Progress</span>
                                    <span className="text-[#1E1B2E]">{student.progress || 0}%</span>
                                  </div>
                                  <div className="h-2 w-full bg-[#F5F1EB] rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }} animate={{ width: `${student.progress || 0}%` }} transition={{ duration: 1, ease: "easeOut" }}
                                      className="h-full bg-gradient-to-r from-[#C9A96E] to-[#E2C48D]" 
                                    />
                                  </div>
                                  <p className="text-[11px] text-[#8E8E93] text-right mt-1">{student.completedLessons || 0} / {student.totalLessons || 0} Lessons</p>
                                </div>
                             </div>
                           )
                         })}
                      </div>
                    )}
                 </div>
              </motion.div>
            )}

            {activeTab === "gradebook" && (
              <motion.div key="gradebook" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-8">
                <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden border border-white">
                  <div className="p-6 bg-[#1E1B2E] text-white flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-[20px]">Master Gradebook</h3>
                      <p className="text-[13px] text-white/60 mt-1 font-sans">Final scores for {course.subject}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <FileText size={20} className="text-[#C9A96E]" />
                    </div>
                  </div>
                  
                  {studentsProgress.length === 0 ? (
                    <div className="py-16 text-center">
                      <p className="text-[14px] font-medium text-[#8E8E93]">No students enrolled yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F5F1EB]/50">
                          <tr>
                            <th className="p-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] border-b border-[rgba(30,27,46,0.05)] w-full">Student</th>
                            <th className="p-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] border-b border-[rgba(30,27,46,0.05)] w-[200px]">Final Score (0-100)</th>
                            <th className="p-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] border-b border-[rgba(30,27,46,0.05)] w-[150px] text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgba(30,27,46,0.04)]">
                            {studentsProgress.map((student: any) => (
                              <tr key={student.id} className="hover:bg-[#F5F1EB]/30 transition-colors">
                                <td className="p-4 px-6">
                                    <p className="font-bold text-[#1E1B2E] text-[14px]">{student.name}</p>
                                    <p className="text-[12px] text-[#8E8E93]">{student.email}</p>
                                </td>
                                <td className="p-4 px-6">
                                    <input 
                                      type="number" min="0" max="100" placeholder="0"
                                      className="h-11 w-24 bg-white border-2 border-[rgba(30,27,46,0.1)] rounded-xl px-3 text-[15px] font-bold text-[#1E1B2E] text-center focus:outline-none focus:border-[#C9A96E] transition-all"
                                      id={`mark-${student.id}`}
                                      onChange={() => setGradeStates(prev => ({...prev, [student.id]: "idle"}))}
                                    />
                                </td>
                                <td className="p-4 px-6 text-right">
                                    <button 
                                      onClick={async () => {
                                        const input = document.getElementById(`mark-${student.id}`) as HTMLInputElement;
                                        if (!input || !input.value) return;
                                        setGradeStates(prev => ({...prev, [student.id]: "saving"}));
                                        try {
                                          const res = await fetch(`/api/marks`, {
                                            method: "POST", headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ studentId: student.id, subject: course.subject, score: parseFloat(input.value) })
                                          });
                                          if (res.ok) {
                                            setGradeStates(prev => ({...prev, [student.id]: "saved"}));
                                            setTimeout(() => setGradeStates(prev => ({...prev, [student.id]: "idle"})), 2000);
                                          }
                                        } catch {
                                          setGradeStates(prev => ({...prev, [student.id]: "idle"}));
                                        }
                                      }}
                                      disabled={gradeStates[student.id] === "saving"} 
                                      className={`h-11 px-5 font-bold text-[12px] uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${gradeStates[student.id] === "saved" ? "bg-green-500 text-white" : "bg-[#1E1B2E] text-white hover:bg-[#2A2540]"}`}
                                    >
                                      {gradeStates[student.id] === "saving" ? <Loader2 size={16} className="animate-spin" /> : gradeStates[student.id] === "saved" ? <><Check size={16} /> Saved</> : "Save"}
                                    </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "assignments" && (
              <motion.div key="assignments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-8 space-y-8">
                <div className="bg-white p-8 rounded-[24px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] border border-white max-w-3xl">
                  <h3 className="font-heading text-[24px] text-[#1E1B2E] mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E1B2E] flex items-center justify-center"><Plus size={18} className="text-[#C9A96E]"/></div>
                    New Global Assignment
                  </h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const title = formData.get("title");
                    let description = formData.get("description") as string;
                    const dueDate = formData.get("dueDate");
                    if (!title || !description || !dueDate) return;
                    
                    if (globalAssignmentFileUrl) {
                      description += `\n\n**Attached Document:** [Download File](${globalAssignmentFileUrl})`;
                    }

                    setLoading(true);
                    try {
                      const res = await fetch(`/api/courses/${course.id}/assignments`, {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title, description, dueDate: new Date(dueDate as string).toISOString() })
                      });
                      if (res.ok) {
                        (e.target as HTMLFormElement).reset();
                        setGlobalAssignmentFileUrl("");
                        router.refresh();
                      } else {
                        const error = await res.json();
                        alert(`Failed to create assignment: ${error.message || 'Unknown error'}`);
                      }
                    } finally {
                      setLoading(false);
                    }
                  }} className="space-y-6 max-w-2xl">
                    <div className="space-y-2">
                      <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Assignment Title</label>
                      <input name="title" className="w-full h-12 bg-[#F5F1EB] border-2 border-transparent rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] transition-all" required />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Instructions</label>
                      <textarea name="description" className="min-h-[120px] w-full bg-[#F5F1EB] border-2 border-transparent rounded-xl p-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] transition-all resize-y leading-relaxed" required />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Attach Document (Optional)</label>
                      <div className="relative">
                        <input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingAssignment(true);
                          try {
                            const fd = new FormData(); fd.append("file", file);
                            const res = await fetch("/api/upload", { method: "POST", body: fd });
                            const data = await res.json();
                            if (res.ok) setGlobalAssignmentFileUrl(data.url);
                          } finally { setUploadingAssignment(false); }
                        }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploadingAssignment} />
                        <div className="h-12 border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl flex items-center justify-center gap-2 bg-[#F5F1EB] text-[#8E8E93] text-[13px] font-medium transition-colors hover:border-[#C9A96E]">
                          {uploadingAssignment ? <Loader2 className="animate-spin text-[#C9A96E]" size={18} /> : <Upload size={18} />}
                          {globalAssignmentFileUrl ? "Document Uploaded Successfully!" : "Click to Upload PDF/Document"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-2">
                        <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Due Date & Time</label>
                        <input name="dueDate" type="datetime-local" className="w-full h-12 bg-[#F5F1EB] border-2 border-transparent rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] transition-all" required />
                      </div>
                      <div className="flex-1 flex items-end">
                        <button type="submit" disabled={loading} className="w-full h-12 bg-[#1E1B2E] text-white rounded-xl text-[14px] font-bold uppercase tracking-wider hover:bg-[#2A2540] shadow-md transition-all flex items-center justify-center">
                          {loading ? <Loader2 size={18} className="animate-spin" /> : "Publish Task"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                
                <div className="space-y-4">
                   <h3 className="font-heading text-[20px] text-[#1E1B2E] px-2">Active Assignments ({course.assignments?.length || 0})</h3>
                   {course.assignments?.map((assignment: any) => (
                      <div key={assignment.id} className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(30,27,46,0.03)] border border-[rgba(30,27,46,0.04)] p-6 hover:shadow-[0_8px_24px_rgba(30,27,46,0.06)] transition-shadow">
                         <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                            <div className="flex-1">
                               <div className="flex items-center gap-3">
                                 <h4 className="font-heading text-[20px] text-[#1E1B2E]">{assignment.title}</h4>
                                 <button 
                                   onClick={() => handleDeleteAssignment(assignment.id)}
                                   disabled={loading}
                                   className="p-1.5 text-[#8E8E93] hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg transition-colors"
                                   title="Delete Assignment"
                                 >
                                   <Trash2 size={16} />
                                 </button>
                               </div>
                               <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#DC2626]/10 text-[#DC2626] rounded-md text-[11px] font-bold uppercase tracking-wider mt-2 mb-4">
                                 <FileText size={12}/> Due: {new Date(assignment.dueDate).toLocaleString()}
                               </div>
                               {(() => {
                                 const match = assignment.description.match(/\*\*Attached Document:\*\* \[Download File\]\((.*?)\)/);
                                 const fileUrl = match ? match[1] : null;
                                 const cleanDescription = match ? assignment.description.replace(match[0], '').trim() : assignment.description;
                                 
                                 return (
                                   <div className="space-y-3">
                                     <p className="text-[14px] text-[#8E8E93] leading-relaxed max-w-3xl">{cleanDescription}</p>
                                     {fileUrl && (
                                       <a href={fileUrl} download className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C9A96E]/10 hover:bg-[#C9A96E]/20 text-[#C9A96E] text-xs font-bold transition-colors w-fit border border-[#C9A96E]/20 mt-2">
                                         <Download size={14} /> Download Attached Document
                                       </a>
                                     )}
                                   </div>
                                 );
                               })()}
                            </div>
                            <div className="shrink-0 flex flex-col items-end gap-3">
                               <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-[rgba(201,169,110,0.05)] border border-[#C9A96E]/20">
                                  <span className="text-[28px] font-heading text-[#C9A96E] leading-none">{assignment.submissions?.length || 0}</span>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8E8E93] mt-1">Submitted</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
