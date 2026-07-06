"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Save, Trash2, ArrowLeft, Loader2, Plus, BookOpen, Video, FileText, Users, Mail, UserPlus, X, Upload, File, Pencil, Check, ChevronDown, ChevronUp, ImageIcon } from "lucide-react";
import Link from "next/link";

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
  const [newLesson, setNewLesson] = useState({ 
    moduleId: "", 
    title: "", 
    content: "", 
    videoUrl: "",
    fileUrl: "",
    fileType: ""
  });
  const [uploading, setUploading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  // Curriculum UX state
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ id: string; title: string; content: string; videoUrl: string } | null>(null);

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
        alert("Settings updated!");
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
    if (!confirm(`Are you sure you want to permanently delete "${course.title}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/teacher/courses");
      } else {
        const d = await res.json();
        alert(d.message || "Failed to delete course.");
      }
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
        alert("Student enrolled!");
      } else {
        const d = await res.json();
        alert(d.message);
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
        alert(data.message || "Failed to process request");
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
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!newLesson.title) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "lesson", ...newLesson, moduleId }),
      });
      if (res.ok) {
        setNewLesson({ moduleId: "", title: "", content: "", videoUrl: "", fileUrl: "", fileType: "" });
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, moduleId: string) => {
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
        setNewLesson(prev => ({ 
          ...prev, 
          moduleId, 
          fileUrl: data.url, 
          fileType: data.type 
        }));
        alert("File uploaded successfully!");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      alert("An error occurred during upload.");
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
      const res = await fetch(`/api/lessons/${editingLesson.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingLesson.title, content: editingLesson.content, videoUrl: editingLesson.videoUrl }),
      });
      if (res.ok) {
        setEditingLesson(null);
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.message || "Failed to update lesson.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F1EB] font-sans text-[#1E1B2E]">
      <div className="w-full max-w-[1000px] mx-auto pb-20">
        
        {/* Page Header + Tabs */}
        <div className="pt-8 px-8 flex items-center gap-4">
          <Link href="/dashboard/teacher/courses">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[rgba(30,27,46,0.1)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[#1E1B2E] hover:bg-[rgba(30,27,46,0.04)] hover:scale-105 transition-all">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <h1 className="font-heading text-[28px] text-[#1E1B2E] tracking-tight">{course.title}</h1>
        </div>
        
        <div className="pt-6 px-8 flex gap-2 overflow-x-auto scrollbar-none border-b border-[rgba(30,27,46,0.06)]">
          {[
            { id: "settings", label: "Settings", icon: Save },
            { id: "curriculum", label: "Curriculum", icon: BookOpen },
            { id: "students", label: "Students", icon: Users },
            { id: "gradebook", label: "Gradebook", icon: FileText },
            { id: "assignments", label: "Assignments", icon: FileText },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-t-xl font-bold text-[13px] uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-[#1E1B2E] shadow-[0_-4px_16px_rgba(0,0,0,0.04)] border-t-2 border-t-[#C9A96E]' 
                  : 'text-[#8E8E93] hover:text-[#1E1B2E] hover:bg-[rgba(30,27,46,0.03)]'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "settings" && (
          <div className="flex flex-col md:flex-row gap-6 p-[32px]">
            {/* LEFT COLUMN */}
            <div className="w-full md:w-2/3">
              <div className="bg-white rounded-[16px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <form onSubmit={handleUpdate}>
                  <div className="mb-6">
                    <label className="block text-[12px]  tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Class Title</label>
                    <input required className="w-full h-12 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="mb-6">
                    <label className="block text-[12px]  tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Subject</label>
                    <input required className="w-full h-12 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                  </div>
                  <div className="mb-6">
                    <label className="block text-[12px]  tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Description</label>
                    <textarea required className="w-full min-h-[120px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-3 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  
                  {/* Thumbnail Upload */}
                  <div className="mb-6">
                    <label className="block text-[12px]  tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Course Cover Photo</label>
                    {formData.thumbnail ? (
                      <div className="relative w-full max-w-[240px] rounded-xl overflow-hidden shadow-sm">
                        <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-auto object-cover" />
                        <button type="button" onClick={() => setFormData(prev => ({...prev, thumbnail: ""}))} className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-red-600 shadow-md hover:scale-105 transition-transform">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-full border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl py-10 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.03)] transition-all">
                        {thumbnailUploading ? (
                          <><Loader2 size={24} className="animate-spin text-[#8E8E93] mb-2" /><span className="text-[14px] text-[#8E8E93]">Uploading...</span></>
                        ) : (
                          <><Upload size={24} className="text-[#8E8E93] mb-2" /><span className="text-[14px] text-[#8E8E93]">Upload Photo</span></>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={thumbnailUploading} />
                      </label>
                    )}
                  </div>

                  {/* Course Type */}
                  <div className="mb-6">
                    <label className="block text-[12px]  tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Course Type</label>
                    <div className="flex gap-3">
                      <div onClick={() => setFormData({ ...formData, isPublic: true })} className={`flex-1 flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.isPublic ? "border-[#C9A96E] bg-[rgba(201,169,110,0.06)]" : "border-[rgba(30,27,46,0.12)] bg-white hover:border-[rgba(30,27,46,0.2)]"}`}>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mr-3 ${formData.isPublic ? "border-[#C9A96E]" : "border-[rgba(30,27,46,0.12)]"}`}>
                          {formData.isPublic && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" />}
                        </div>
                        <div>
                          <div className="text-[14px] font-medium text-[#1E1B2E]">Public Course</div>
                          <div className="text-[12px] text-[#8E8E93]">Visible to everyone</div>
                        </div>
                      </div>
                      <div onClick={() => setFormData({ ...formData, isPublic: false })} className={`flex-1 flex items-center p-4 rounded-xl border cursor-pointer transition-all ${!formData.isPublic ? "border-[#C9A96E] bg-[rgba(201,169,110,0.06)]" : "border-[rgba(30,27,46,0.12)] bg-white hover:border-[rgba(30,27,46,0.2)]"}`}>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mr-3 ${!formData.isPublic ? "border-[#C9A96E]" : "border-[rgba(30,27,46,0.12)]"}`}>
                          {!formData.isPublic && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" />}
                        </div>
                        <div>
                          <div className="text-[14px] font-medium text-[#1E1B2E]">Private Class</div>
                          <div className="text-[12px] text-[#8E8E93]">Hidden from public page</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading || thumbnailUploading} className="mt-2 w-full h-12 rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(30,27,46,0.2)] transition-all disabled:opacity-50">
                    {loading ? <><Loader2 className="animate-spin" size={16} /> Saving...</> : <><Save size={16} /> Save Changes</>}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full md:w-1/3">
              <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 size={18} className="text-[#DC2626]" />
                  <h3 className="text-[14px] font-medium text-[#DC2626]">Danger Zone</h3>
                </div>
                <p className="text-[13px] text-[#8E8E93] leading-[1.6]">
                  Deleting this course is permanent and cannot be undone. All modules, lessons and enrollments will be removed.
                </p>
                <button onClick={handleDeleteCourse} disabled={loading} className="mt-4 w-full h-10 rounded-xl bg-[#DC2626] text-white text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#B91C1C] hover:scale-[1.01] transition-all disabled:opacity-50">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete Course
                </button>
              </div>
            </div>
          </div>
        )}

      {activeTab === "curriculum" && (
        <div className="space-y-6 p-8">
          <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex gap-4 items-center">
            <Input placeholder="New Module Title..." className="flex-1 h-12 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} />
            <Button onClick={handleAddModule} disabled={loading} className="h-12 px-6 rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(30,27,46,0.2)] transition-all flex items-center gap-2">
              <Plus size={16} /> Add Module
            </Button>
          </div>
          <div className="space-y-6">
            {course.modules.map((module: any) => (
              <div key={module.id} className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-[rgba(30,27,46,0.04)]">
                <div className="p-5 bg-[rgba(30,27,46,0.02)] border-b border-[rgba(30,27,46,0.06)] flex items-center justify-between">
                   <h4 className="font-heading text-[18px] text-[#1E1B2E]">{module.title}</h4>
                   <Button variant="ghost" onClick={() => handleDeleteItem("module", module.id)} className="h-8 w-8 p-0 text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg transition-colors"><Trash2 size={16} /></Button>
                </div>
                <div className="p-5 space-y-3">
                   {module.lessons.map((lesson: any) => (
                     <div key={lesson.id}>
                       {/* Lesson row */}
                       <div className="flex items-center justify-between p-3.5 bg-white border border-[rgba(30,27,46,0.08)] rounded-xl hover:border-[rgba(201,169,110,0.4)] transition-colors group">
                          <div className="flex items-center gap-3 text-[14px] font-medium text-[#1E1B2E]">
                             <div className="w-8 h-8 rounded-lg bg-[rgba(201,169,110,0.1)] text-[#C9A96E] flex items-center justify-center shrink-0">
                               {lesson.videoUrl ? <Video size={16} /> : lesson.fileUrl ? <File size={16} /> : <FileText size={16} />}
                             </div>
                             {lesson.title}
                             {lesson.fileType && <span className="text-[10px] bg-[rgba(30,27,46,0.06)] text-[#8E8E93] px-2 py-0.5 rounded-md uppercase font-bold tracking-wider">{lesson.fileType}</span>}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" onClick={() => setEditingLesson(editingLesson?.id === lesson.id ? null : { id: lesson.id, title: lesson.title, content: lesson.content || "", videoUrl: lesson.videoUrl || "" })} className="h-8 w-8 p-0 text-[#1E1B2E] hover:bg-[rgba(30,27,46,0.06)] rounded-lg">
                              <Pencil size={14} />
                            </Button>
                            <Button variant="ghost" onClick={() => handleDeleteItem("lesson", lesson.id)} className="h-8 w-8 p-0 text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                       </div>
                       {/* Inline edit form */}
                       {editingLesson?.id === lesson.id && (
                         <div className="mt-2 p-5 bg-white border border-[#C9A96E]/30 shadow-[0_4px_20px_rgba(201,169,110,0.08)] rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                           <p className="text-[11px] font-bold uppercase tracking-widest text-[#C9A96E] flex items-center gap-2">
                             <Pencil size={12} /> Editing: {lesson.title}
                           </p>
                           <Input placeholder="Lesson Title" className="h-11 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={editingLesson?.title || ""} onChange={e => setEditingLesson(prev => prev ? {...prev, title: e.target.value} : null)} />
                           <Input placeholder="Video URL (YouTube/Vimeo embed)" className="h-11 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={editingLesson?.videoUrl || ""} onChange={e => setEditingLesson(prev => prev ? {...prev, videoUrl: e.target.value} : null)} />
                           <Textarea placeholder="Lesson Notes / Content" className="min-h-[100px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-3 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y" value={editingLesson?.content || ""} onChange={e => setEditingLesson(prev => prev ? {...prev, content: e.target.value} : null)} />
                           <div className="flex gap-2 pt-2">
                             <Button onClick={handleSaveLesson} disabled={loading} className="flex-1 h-11 bg-[#1E1B2E] hover:scale-[1.01] text-white font-medium rounded-xl transition-all">
                               {loading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />} Save Changes
                             </Button>
                             <Button variant="outline" onClick={() => setEditingLesson(null)} className="h-11 px-6 border border-[rgba(30,27,46,0.12)] hover:bg-[rgba(30,27,46,0.04)] rounded-xl font-medium"><X size={16} /></Button>
                           </div>
                         </div>
                       )}
                     </div>
                   ))}
                   {/* Add Lesson toggle button */}
                   <button
                     type="button"
                     onClick={() => setExpandedModuleId(expandedModuleId === module.id ? null : module.id)}
                     className="w-full mt-2 h-12 flex items-center justify-center gap-2 border-2 border-dashed border-[rgba(30,27,46,0.12)] rounded-xl font-bold text-[#8E8E93] text-[13px] uppercase tracking-wider hover:border-[#C9A96E] hover:text-[#C9A96E] hover:bg-[rgba(201,169,110,0.03)] transition-all"
                   >
                     {expandedModuleId === module.id ? <><ChevronUp size={16} /> Cancel</> : <><Plus size={16} /> Add Lesson</>}
                   </button>
                   {/* Collapsible Add Lesson form */}
                   {expandedModuleId === module.id && (
                     <div className="mt-3 p-5 bg-[rgba(30,27,46,0.02)] border border-[rgba(30,27,46,0.08)] rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <Input placeholder="Lesson Title" className="h-11 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={newLesson.moduleId === module.id ? newLesson.title : ""} onChange={e => setNewLesson({...newLesson, moduleId: module.id, title: e.target.value})} />
                        <Input placeholder="Video Link (YouTube/Vimeo)" className="h-11 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={newLesson.moduleId === module.id ? newLesson.videoUrl : ""} onChange={e => setNewLesson({...newLesson, moduleId: module.id, videoUrl: e.target.value})} />
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">Academic Material (PDF/PPT)</label>
                           <div className="flex gap-2">
                              <div className="relative flex-1">
                                 <Input type="file" accept=".pdf,.ppt,.pptx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => handleFileUpload(e, module.id)} disabled={uploading} />
                                 <div className="h-11 border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl flex items-center justify-center gap-2 bg-white text-[#8E8E93] font-medium text-[13px] hover:border-[#C9A96E] transition-colors">
                                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                                    {newLesson.moduleId === module.id && newLesson.fileUrl ? "File Uploaded Successfully" : "Click to Upload PDF/PPT"}
                                 </div>
                              </div>
                              {newLesson.moduleId === module.id && newLesson.fileUrl && (
                                <Button variant="ghost" className="h-11 w-11 p-0 border border-[rgba(30,27,46,0.12)] rounded-xl bg-white text-[#DC2626] hover:bg-[#DC2626]/10" onClick={() => setNewLesson({...newLesson, fileUrl: "", fileType: ""})}>
                                  <Trash2 size={16} />
                                </Button>
                              )}
                           </div>
                        </div>
                        <Textarea placeholder="Lesson Notes / Content" className="min-h-[100px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-3 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y" value={newLesson.moduleId === module.id ? newLesson.content : ""} onChange={e => setNewLesson({...newLesson, moduleId: module.id, content: e.target.value})} />
                        <Button onClick={() => handleAddLesson(module.id)} disabled={loading || uploading || !newLesson.title} className="w-full h-11 bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold uppercase tracking-wider rounded-xl transition-all shadow-md">Add Lesson</Button>
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "students" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
           <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                 <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-6 flex items-center gap-2"><UserPlus size={20} className="text-[#C9A96E]" /> Enroll Student</h3>
                 <form onSubmit={handleEnrollStudent} className="space-y-4">
                    <Input placeholder="Student Email Address" className="h-12 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} required />
                    <Button type="submit" disabled={loading} className="w-full h-12 bg-[#1E1B2E] text-white rounded-xl text-[14px] font-bold uppercase tracking-wider hover:scale-[1.02] shadow-md transition-all">Enroll Now</Button>
                 </form>
              </div>
           </div>
           <div className="lg:col-span-2 space-y-6">
              {course.leaveRequests?.length > 0 && (
                <div className="bg-white rounded-[16px] border border-[#DC2626]/20 shadow-[0_4px_20px_rgba(220,38,38,0.08)] overflow-hidden">
                   <div className="p-4 bg-[#DC2626]/5 border-b border-[#DC2626]/10 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                      <h3 className="font-heading text-[18px] text-[#DC2626]">Pending Drop Requests ({course.leaveRequests.length})</h3>
                   </div>
                   <div className="p-0">
                      <table className="w-full text-left">
                         <tbody className="divide-y divide-[rgba(30,27,46,0.06)]">
                            {course.leaveRequests.map((req: any) => (
                              <tr key={req.id} className="hover:bg-[rgba(30,27,46,0.02)] transition-colors">
                                 <td className="p-4">
                                    <p className="font-medium text-[#1E1B2E] text-[14px]">{req.user.name}</p>
                                    <p className="text-[12px] text-[#8E8E93] mt-0.5">{req.user.email}</p>
                                 </td>
                                 <td className="p-4 text-right flex justify-end gap-2">
                                    <Button onClick={() => handleLeaveRequest(req.id, "approve")} disabled={loading} className="h-9 px-4 font-bold text-[11px] uppercase tracking-wider bg-[#DC2626] text-white rounded-xl hover:bg-[#B91C1C]">
                                       Approve Drop
                                    </Button>
                                    <Button variant="outline" onClick={() => handleLeaveRequest(req.id, "reject")} disabled={loading} className="h-9 px-4 font-bold text-[11px] uppercase tracking-wider border border-[rgba(30,27,46,0.12)] text-[#1E1B2E] rounded-xl hover:bg-[rgba(30,27,46,0.04)]">
                                       Reject
                                    </Button>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
              )}

              <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-[rgba(30,27,46,0.04)]">
                 <div className="p-5 bg-[rgba(30,27,46,0.02)] border-b border-[rgba(30,27,46,0.06)]">
                    <h3 className="font-heading text-[18px] text-[#1E1B2E]">Enrolled Students ({course.enrollments.length})</h3>
                 </div>
                 <div className="p-0">
                    {studentsProgress.length === 0 ? (
                      <div className="p-16 text-center">
                        <Users size={32} className="mx-auto text-[#8E8E93] opacity-50 mb-3" />
                        <p className="text-[14px] text-[#8E8E93]">No students enrolled in this class yet.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left">
                         <tbody className="divide-y divide-[rgba(30,27,46,0.06)]">
                            {studentsProgress.map((student: any) => {
                              const enrId = course.enrollments.find((e: any) => e.userId === student.id)?.id;
                              return (
                              <tr key={student.id} className="hover:bg-[rgba(30,27,46,0.02)] transition-colors">
                                 <td className="p-5 w-1/3">
                                    <p className="font-medium text-[#1E1B2E] text-[14px]">{student.name}</p>
                                    <p className="text-[12px] text-[#8E8E93] mt-0.5">{student.email}</p>
                                 </td>
                                 <td className="p-5 w-1/2">
                                    <div className="flex items-center gap-3">
                                      <div className="flex-1 h-1.5 bg-[rgba(30,27,46,0.06)] rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-[#C9A96E]" 
                                          style={{ width: `${student.progress || 0}%` }}
                                        />
                                      </div>
                                      <span className="text-[12px] font-bold text-[#1E1B2E] w-10 text-right">{student.progress || 0}%</span>
                                    </div>
                                    <p className="text-[11px] text-[#8E8E93] mt-1.5">{student.completedLessons || 0} / {student.totalLessons || 0} Lessons Completed</p>
                                 </td>
                                 <td className="p-5 text-right">
                                    <Button variant="ghost" onClick={() => enrId && handleUnenroll(enrId)} className="h-9 w-9 p-0 text-[#DC2626] border border-transparent rounded-xl hover:bg-[#DC2626]/10">
                                       <X size={16} />
                                    </Button>
                                 </td>
                              </tr>
                            )})}
                         </tbody>
                      </table>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
      
      {activeTab === "gradebook" && (
        <div className="p-8">
          <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-[rgba(30,27,46,0.04)]">
            <div className="p-5 bg-[rgba(30,27,46,0.02)] border-b border-[rgba(30,27,46,0.06)]">
              <h3 className="font-heading text-[18px] text-[#1E1B2E]">Student Gradebook</h3>
              <p className="text-[13px] text-[#8E8E93] mt-1">Enter final marks for {course.subject}</p>
            </div>
            <div className="p-0">
              {studentsProgress.length === 0 ? (
                <div className="p-16 text-center">
                  <FileText size={32} className="mx-auto text-[#8E8E93] opacity-50 mb-3" />
                  <p className="text-[14px] text-[#8E8E93]">No students enrolled yet.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-white border-b border-[rgba(30,27,46,0.08)]">
                    <tr>
                      <th className="p-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">Student</th>
                      <th className="p-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] w-32">Score (%)</th>
                      <th className="p-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] w-32 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(30,27,46,0.06)] bg-white">
                      {studentsProgress.map((student: any) => (
                        <tr key={student.id} className="hover:bg-[rgba(30,27,46,0.02)] transition-colors">
                          <td className="p-4 px-6">
                              <p className="font-medium text-[#1E1B2E] text-[14px]">{student.name}</p>
                              <p className="text-[12px] text-[#8E8E93]">{student.email}</p>
                          </td>
                          <td className="p-4 px-6">
                              <input 
                                type="number" 
                                min="0" max="100" 
                                placeholder="0-100"
                                className="h-10 w-full bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-3 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] transition-all font-medium"
                                id={`mark-${student.id}`}
                              />
                          </td>
                          <td className="p-4 px-6 text-right">
                              <Button 
                                onClick={async () => {
                                  const input = document.getElementById(`mark-${student.id}`) as HTMLInputElement;
                                  if (!input || !input.value) return;
                                  setLoading(true);
                                  try {
                                    const res = await fetch(`/api/marks`, {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ studentId: student.id, subject: course.subject, score: parseFloat(input.value) })
                                    });
                                    if (res.ok) alert("Mark saved!");
                                  } finally {
                                    setLoading(false);
                                  }
                                }}
                                disabled={loading} 
                                className="w-full h-10 bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-[12px] uppercase tracking-wider rounded-xl shadow-md transition-all"
                              >
                                Save
                              </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="space-y-6 p-8">
          <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)]">
            <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-6 flex items-center gap-2"><Plus size={20} className="text-[#C9A96E]"/> New Assignment</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const title = formData.get("title");
              const description = formData.get("description");
              const dueDate = formData.get("dueDate");
              if (!title || !description || !dueDate) return;
              setLoading(true);
              try {
                const res = await fetch(`/api/courses/${course.id}/assignments`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ title, description, dueDate: new Date(dueDate as string).toISOString() })
                });
                if (res.ok) {
                  alert("Assignment created!");
                  router.refresh();
                }
              } finally {
                setLoading(false);
              }
            }} className="space-y-4">
              <Input name="title" placeholder="Assignment Title" className="h-12 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" required />
              <Textarea name="description" placeholder="Instructions..." className="min-h-[100px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y" required />
              <div className="flex flex-col md:flex-row gap-4">
                <Input name="dueDate" type="datetime-local" className="flex-1 h-12 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E]" required />
                <Button type="submit" disabled={loading} className="w-full md:w-48 h-12 bg-[#1E1B2E] text-white rounded-xl text-[14px] font-bold uppercase tracking-wider hover:scale-[1.02] shadow-md transition-all">Create Task</Button>
              </div>
            </form>
          </div>
          
          <div className="space-y-4">
             {course.assignments?.map((assignment: any) => (
                <div key={assignment.id} className="bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)] p-6">
                   <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                      <div>
                         <h4 className="font-heading text-[18px] text-[#1E1B2E]">{assignment.title}</h4>
                         <p className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-wider mt-1 mb-3 flex items-center gap-1.5"><FileText size={12}/> Due: {new Date(assignment.dueDate).toLocaleString()}</p>
                         <p className="text-[14px] text-[#1E1B2E] leading-relaxed">{assignment.description}</p>
                      </div>
                      <div className="shrink-0">
                         <span className="inline-flex items-center justify-center px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#C9A96E] bg-[rgba(201,169,110,0.1)] rounded-lg">
                            {assignment.submissions?.length || 0} Submissions
                         </span>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
