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
  const [activeTab, setActiveTab] = useState<"settings" | "curriculum" | "students">("settings");
  
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
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/teacher/courses">
            <Button variant="ghost" className="h-10 w-10 p-0 border-2 border-black rounded-xl">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight">{course.title}</h1>
        </div>
        <div className="flex bg-white border-4 border-black p-1 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
               className={`px-4 py-2 rounded-lg font-black text-xs uppercase flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'hover:bg-muted'}`}
             >
               <tab.icon size={14} /> {tab.label}
             </button>
           ))}
        </div>
      </div>

      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="neo-brutalism bg-white p-8 border-4 border-black">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest">Class Title</label>
                  <Input required className="h-12 border-2 border-black font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest">Subject</label>
                  <Input required className="h-12 border-2 border-black font-bold" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest">Description</label>
                  <Textarea required className="min-h-[150px] border-2 border-black font-bold" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                {/* Thumbnail Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14} /> Course Cover Photo</label>
                  <div className="flex gap-3 items-center">
                    {formData.thumbnail && (
                      <div className="relative shrink-0">
                        <img src={formData.thumbnail} alt="Thumbnail" className="w-20 h-16 object-cover border-2 border-black rounded-lg" />
                        <button type="button" onClick={() => setFormData(prev => ({...prev, thumbnail: ""}))} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full border-2 border-black flex items-center justify-center">
                          <X size={10} />
                        </button>
                      </div>
                    )}
                    <label className="flex-1 h-12 border-2 border-black border-dashed rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-muted/30 transition-colors font-bold text-sm">
                      {thumbnailUploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : <><Upload size={14} /> {formData.thumbnail ? "Change Photo" : "Upload Photo"}</>}
                      <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={thumbnailUploading} />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest">Course Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border-2 border-black rounded-xl hover:bg-muted transition-colors flex-1">
                      <input type="radio" name="courseType" checked={formData.isPublic} onChange={() => setFormData({ ...formData, isPublic: true })} className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-black">Public Course</span>
                        <span className="text-xs text-muted-foreground font-medium">Visible to everyone</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 border-2 border-black rounded-xl hover:bg-muted transition-colors flex-1">
                      <input type="radio" name="courseType" checked={!formData.isPublic} onChange={() => setFormData({ ...formData, isPublic: false })} className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-black">Private Class</span>
                        <span className="text-xs text-muted-foreground font-medium">Hidden from public page</span>
                      </div>
                    </label>
                  </div>
                </div>
                <Button type="submit" disabled={loading || thumbnailUploading} className="w-full h-14 text-lg font-black neo-brutalism bg-[#34D399] text-black uppercase">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} Save Changes
                </Button>
              </form>
            </Card>
          </div>
          <div className="neo-brutalism bg-white p-6 border-4 border-black self-start space-y-4">
             <h3 className="font-black uppercase text-red-600 flex items-center gap-2"><Trash2 size={16}/> Danger Zone</h3>
             <p className="text-xs font-bold text-muted-foreground">Deleting this course is permanent and cannot be undone. All modules, lessons and enrollments will be removed.</p>
             <Button variant="destructive" onClick={handleDeleteCourse} disabled={loading} className="w-full font-black border-2 border-black">
               {loading ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Trash2 size={14} className="mr-2" />} Delete Course
             </Button>
          </div>
        </div>
      )}

      {activeTab === "curriculum" && (
        <div className="space-y-8">
          <div className="neo-brutalism bg-white p-6 border-4 border-black flex gap-4">
            <Input placeholder="New Module Title..." className="flex-1 border-2 border-black font-bold h-12" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} />
            <Button onClick={handleAddModule} disabled={loading} className="neo-brutalism bg-[#4F7DF3] text-white font-black h-12">
              <Plus className="mr-2" /> Add Module
            </Button>
          </div>
          <div className="space-y-6">
            {course.modules.map((module: any) => (
              <Card key={module.id} className="neo-brutalism bg-white border-4 border-black overflow-hidden">
                <div className="p-4 bg-accent border-b-4 border-black flex items-center justify-between">
                   <h4 className="text-lg font-black uppercase">{module.title}</h4>
                   <Button variant="ghost" onClick={() => handleDeleteItem("module", module.id)} className="h-8 w-8 p-0 text-red-600 border-2 border-black"><Trash2 size={16} /></Button>
                </div>
                <div className="p-4 space-y-3">
                   {module.lessons.map((lesson: any) => (
                     <div key={lesson.id}>
                       {/* Lesson row */}
                       <div className="flex items-center justify-between p-3 bg-muted/20 border-2 border-black rounded-lg">
                          <div className="flex items-center gap-3 text-sm font-bold">
                             {lesson.videoUrl ? <Video size={16} /> : lesson.fileUrl ? <File size={16} className="text-primary" /> : <FileText size={16} />}
                             {lesson.title}
                             {lesson.fileType && <span className="text-[10px] bg-accent px-1.5 rounded-md uppercase">{lesson.fileType}</span>}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" onClick={() => setEditingLesson(editingLesson?.id === lesson.id ? null : { id: lesson.id, title: lesson.title, content: lesson.content || "", videoUrl: lesson.videoUrl || "" })} className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50">
                              <Pencil size={14} />
                            </Button>
                            <Button variant="ghost" onClick={() => handleDeleteItem("lesson", lesson.id)} className="h-7 w-7 p-0 text-red-600 hover:bg-red-50">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                       </div>
                       {/* Inline edit form */}
                       {editingLesson?.id === lesson.id && (
                         <div className="mt-2 p-4 bg-blue-50 border-2 border-blue-300 rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-200">
                           <p className="text-xs font-black uppercase tracking-widest text-blue-700">✏️ Editing: {lesson.title}</p>
                           <Input placeholder="Lesson Title" className="border-2 border-black font-bold" value={editingLesson.title} onChange={e => setEditingLesson({...editingLesson, title: e.target.value})} />
                           <Input placeholder="Video URL (YouTube/Vimeo embed)" className="border-2 border-black font-bold" value={editingLesson.videoUrl} onChange={e => setEditingLesson({...editingLesson, videoUrl: e.target.value})} />
                           <Textarea placeholder="Lesson Notes / Content" className="border-2 border-black font-bold h-20" value={editingLesson.content} onChange={e => setEditingLesson({...editingLesson, content: e.target.value})} />
                           <div className="flex gap-2">
                             <Button onClick={handleSaveLesson} disabled={loading} className="flex-1 h-10 bg-[#34D399] text-black font-black border-2 border-black">
                               {loading ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Check size={14} className="mr-2" />} Save Changes
                             </Button>
                             <Button variant="outline" onClick={() => setEditingLesson(null)} className="h-10 border-2 border-black font-bold"><X size={14} /></Button>
                           </div>
                         </div>
                       )}
                     </div>
                   ))}
                   {/* Add Lesson toggle button */}
                   <button
                     type="button"
                     onClick={() => setExpandedModuleId(expandedModuleId === module.id ? null : module.id)}
                     className="w-full mt-2 flex items-center justify-center gap-2 p-3 border-2 border-black border-dashed rounded-xl font-black text-xs uppercase hover:bg-[#34D399]/10 transition-colors"
                   >
                     {expandedModuleId === module.id ? <><ChevronUp size={14} /> Hide Form</> : <><Plus size={14} /> Add Lesson</>}
                   </button>
                   {/* Collapsible Add Lesson form */}
                   {expandedModuleId === module.id && (
                     <div className="p-4 bg-muted/10 border-2 border-black border-dashed rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <Input placeholder="Lesson Title" className="border-2 border-black font-bold" value={newLesson.moduleId === module.id ? newLesson.title : ""} onChange={e => setNewLesson({...newLesson, moduleId: module.id, title: e.target.value})} />
                        <Input placeholder="Video Link (YouTube/Vimeo)" className="border-2 border-black font-bold" value={newLesson.moduleId === module.id ? newLesson.videoUrl : ""} onChange={e => setNewLesson({...newLesson, moduleId: module.id, videoUrl: e.target.value})} />
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase opacity-60">Academic Material (PDF/PPT)</label>
                           <div className="flex gap-2">
                              <div className="relative flex-1">
                                 <Input type="file" accept=".pdf,.ppt,.pptx" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => handleFileUpload(e, module.id)} disabled={uploading} />
                                 <div className="h-10 border-2 border-black border-dashed rounded-lg flex items-center justify-center gap-2 bg-white font-bold text-xs">
                                    {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                                    {newLesson.moduleId === module.id && newLesson.fileUrl ? "File Ready" : "Choose PDF/PPT"}
                                 </div>
                              </div>
                              {newLesson.moduleId === module.id && newLesson.fileUrl && (
                                <Button variant="ghost" className="h-10 border-2 border-black bg-green-100 text-green-700" onClick={() => setNewLesson({...newLesson, fileUrl: "", fileType: ""})}>
                                  <X size={14} />
                                </Button>
                              )}
                           </div>
                        </div>
                        <Textarea placeholder="Lesson Notes / Content" className="border-2 border-black font-bold h-24" value={newLesson.moduleId === module.id ? newLesson.content : ""} onChange={e => setNewLesson({...newLesson, moduleId: module.id, content: e.target.value})} />
                        <Button onClick={() => handleAddLesson(module.id)} disabled={loading || uploading || !newLesson.title} className="w-full bg-[#34D399] text-black font-black border-2 border-black">Add Lesson</Button>
                     </div>
                   )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "students" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1">
              <Card className="neo-brutalism bg-[#F5C84C] p-6 border-4 border-black">
                 <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2"><UserPlus size={24} /> Enroll Student</h3>
                 <form onSubmit={handleEnrollStudent} className="space-y-4">
                    <Input placeholder="Student Gmail" className="h-12 border-2 border-black font-bold bg-white" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} required />
                    <Button type="submit" disabled={loading} className="w-full h-12 bg-black text-white font-black neo-brutalism uppercase">Enroll Now</Button>
                 </form>
              </Card>
           </div>
           <div className="lg:col-span-2 space-y-8">
              {course.leaveRequests?.length > 0 && (
                <Card className="neo-brutalism bg-orange-50 border-4 border-black overflow-hidden">
                   <div className="p-4 bg-orange-200 border-b-4 border-black">
                      <h3 className="text-xl font-black uppercase text-orange-900">Pending Leave Requests ({course.leaveRequests.length})</h3>
                   </div>
                   <div className="p-0">
                      <table className="w-full text-left">
                         <tbody className="divide-y-2 divide-black">
                            {course.leaveRequests.map((req: any) => (
                              <tr key={req.id} className="hover:bg-orange-100 transition-colors">
                                 <td className="p-4">
                                    <p className="font-black text-sm uppercase">{req.user.name}</p>
                                    <p className="text-[10px] font-bold opacity-60">{req.user.email}</p>
                                 </td>
                                 <td className="p-4 text-right flex justify-end gap-2">
                                    <Button onClick={() => handleLeaveRequest(req.id, "approve")} disabled={loading} className="h-8 font-black text-xs neo-brutalism bg-[#34D399] text-black">
                                       Approve
                                    </Button>
                                    <Button variant="outline" onClick={() => handleLeaveRequest(req.id, "reject")} disabled={loading} className="h-8 font-black text-xs border-2 border-black hover:bg-red-50 text-red-600">
                                       Reject
                                    </Button>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </Card>
              )}

              <Card className="neo-brutalism bg-white border-4 border-black overflow-hidden">
                 <div className="p-4 bg-muted border-b-4 border-black">
                    <h3 className="text-xl font-black uppercase">Enrolled Students ({course.enrollments.length})</h3>
                 </div>
                 <div className="p-0">
                    {studentsProgress.length === 0 ? (
                      <div className="p-12 text-center opacity-30 font-bold italic">No students enrolled in this class.</div>
                    ) : (
                      <table className="w-full text-left">
                         <tbody className="divide-y-2 divide-black">
                            {studentsProgress.map((student: any) => {
                              const enrId = course.enrollments.find((e: any) => e.userId === student.id)?.id;
                              return (
                              <tr key={student.id} className="hover:bg-muted/10 transition-colors">
                                 <td className="p-4 w-1/3">
                                    <p className="font-black text-sm uppercase">{student.name}</p>
                                    <p className="text-[10px] font-bold opacity-60">{student.email}</p>
                                 </td>
                                 <td className="p-4 w-1/2">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden border border-black">
                                        <div 
                                          className="h-full bg-[#34D399]" 
                                          style={{ width: `${student.progress || 0}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-black uppercase w-12 text-right">{student.progress || 0}%</span>
                                    </div>
                                    <p className="text-[9px] font-bold opacity-60 mt-0.5">{student.completedLessons || 0} / {student.totalLessons || 0} Lessons</p>
                                 </td>
                                 <td className="p-4 text-right">
                                    <Button variant="ghost" onClick={() => enrId && handleUnenroll(enrId)} className="h-8 w-8 p-0 text-red-600 border-2 border-black hover:bg-red-50">
                                       <X size={14} />
                                    </Button>
                                 </td>
                              </tr>
                            )})}
                         </tbody>
                      </table>
                    )}
                 </div>
              </Card>
           </div>
        </div>
      )}
      {activeTab === "gradebook" && (
        <Card className="neo-brutalism bg-white border-4 border-black overflow-hidden">
          <div className="p-4 bg-muted border-b-4 border-black">
            <h3 className="text-xl font-black uppercase">Student Gradebook</h3>
            <p className="text-xs font-bold text-muted-foreground">Enter final marks for {course.subject}</p>
          </div>
          <div className="p-4">
            {studentsProgress.length === 0 ? (
              <div className="p-12 text-center opacity-30 font-bold italic">No students enrolled.</div>
            ) : (
              <table className="w-full text-left">
                 <thead>
                   <tr className="border-b-2 border-black">
                     <th className="p-2 font-black uppercase">Student</th>
                     <th className="p-2 font-black uppercase w-32">Score (%)</th>
                     <th className="p-2 font-black uppercase w-24">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y border-black">
                    {studentsProgress.map((student: any) => (
                      <tr key={student.id} className="hover:bg-muted/10">
                         <td className="p-2">
                            <p className="font-black text-sm uppercase">{student.name}</p>
                         </td>
                         <td className="p-2">
                            <Input 
                              type="number" 
                              min="0" max="100" 
                              placeholder="0-100"
                              className="border-2 border-black font-bold h-10 w-full"
                              id={`mark-${student.id}`}
                            />
                         </td>
                         <td className="p-2">
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
                              className="w-full h-10 bg-[#34D399] text-black font-black border-2 border-black"
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
        </Card>
      )}

      {activeTab === "assignments" && (
        <div className="space-y-6">
          <Card className="neo-brutalism bg-[#F5C84C] p-6 border-4 border-black">
            <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2"><Plus size={24} /> New Assignment</h3>
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
              <Input name="title" placeholder="Assignment Title" className="h-12 border-2 border-black font-bold bg-white" required />
              <Textarea name="description" placeholder="Instructions..." className="border-2 border-black font-bold bg-white" required />
              <div className="flex gap-4">
                <Input name="dueDate" type="datetime-local" className="flex-1 h-12 border-2 border-black font-bold bg-white" required />
                <Button type="submit" disabled={loading} className="w-1/3 h-12 bg-black text-white font-black neo-brutalism uppercase">Create</Button>
              </div>
            </form>
          </Card>
          
          <div className="space-y-4">
             {course.assignments?.map((assignment: any) => (
                <Card key={assignment.id} className="neo-brutalism bg-white border-4 border-black p-4">
                   <div className="flex justify-between items-start">
                      <div>
                         <h4 className="text-lg font-black uppercase">{assignment.title}</h4>
                         <p className="text-xs font-bold opacity-70 mb-2">Due: {new Date(assignment.dueDate).toLocaleString()}</p>
                         <p className="text-sm font-medium">{assignment.description}</p>
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-black bg-muted px-2 py-1 rounded border-2 border-black">
                            {assignment.submissions?.length || 0} Submissions
                         </span>
                      </div>
                   </div>
                </Card>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
