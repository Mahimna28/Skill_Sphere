"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Save, Trash2, ArrowLeft, Loader2, Plus, BookOpen, Video, FileText, Users, Mail, UserPlus, X, Upload, File } from "lucide-react";
import Link from "next/link";

export default function ManageCourseClient({ course }: { course: any }) {
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
  const [studentEmail, setStudentEmail] = useState("");

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
                <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-black neo-brutalism bg-[#34D399] text-black uppercase">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} Save Changes
                </Button>
              </form>
            </Card>
          </div>
          <div className="neo-brutalism bg-white p-6 border-4 border-black self-start">
             <h3 className="font-black uppercase mb-4 text-red-600">Danger Zone</h3>
             <Button variant="destructive" className="w-full font-black border-2 border-black">Delete Course</Button>
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
                <div className="p-4 space-y-4">
                   {module.lessons.map((lesson: any) => (
                     <div key={lesson.id} className="flex items-center justify-between p-3 bg-muted/20 border-2 border-black rounded-lg">
                        <div className="flex items-center gap-3 text-sm font-bold">
                           {lesson.videoUrl ? <Video size={16} /> : lesson.fileUrl ? <File size={16} className="text-primary" /> : <FileText size={16} />} 
                           {lesson.title}
                           {lesson.fileType && <span className="text-[10px] bg-accent px-1.5 rounded-md uppercase">{lesson.fileType}</span>}
                        </div>
                        <Button variant="ghost" onClick={() => handleDeleteItem("lesson", lesson.id)} className="h-7 w-7 p-0 text-red-600"><Trash2 size={14}/></Button>
                     </div>
                   ))}
                   <div className="p-4 bg-muted/10 border-2 border-black border-dashed rounded-xl space-y-4">
                      <Input placeholder="Lesson Title" className="border-2 border-black font-bold" value={newLesson.moduleId === module.id ? newLesson.title : ""} onChange={e => setNewLesson({...newLesson, moduleId: module.id, title: e.target.value})} />
                      <Input placeholder="Video Link (YouTube/Vimeo)" className="border-2 border-black font-bold" value={newLesson.moduleId === module.id ? newLesson.videoUrl : ""} onChange={e => setNewLesson({...newLesson, moduleId: module.id, videoUrl: e.target.value})} />
                      
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase opacity-60">Academic Material (PDF/PPT)</label>
                         <div className="flex gap-2">
                            <div className="relative flex-1">
                               <Input 
                                 type="file" 
                                 accept=".pdf,.ppt,.pptx" 
                                 className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                 onChange={(e) => handleFileUpload(e, module.id)}
                                 disabled={uploading}
                               />
                               <div className="h-10 border-2 border-black border-dashed rounded-lg flex items-center justify-center gap-2 bg-white font-bold text-xs">
                                  {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                                  {newLesson.moduleId === module.id && newLesson.fileUrl ? "File Ready" : "Choose PDF/PPT"}
                               </div>
                            </div>
                            {newLesson.moduleId === module.id && newLesson.fileUrl && (
                              <Button 
                                variant="ghost" 
                                className="h-10 border-2 border-black bg-green-100 text-green-700"
                                onClick={() => setNewLesson({...newLesson, fileUrl: "", fileType: ""})}
                              >
                                <X size={14} />
                              </Button>
                            )}
                         </div>
                         {newLesson.moduleId === module.id && newLesson.fileUrl && (
                           <p className="text-[9px] font-black text-green-600 uppercase">✓ Material Attached</p>
                         )}
                      </div>

                      <Textarea placeholder="Lesson Notes / Content" className="border-2 border-black font-bold h-24" value={newLesson.moduleId === module.id ? newLesson.content : ""} onChange={e => setNewLesson({...newLesson, moduleId: module.id, content: e.target.value})} />
                      <Button onClick={() => handleAddLesson(module.id)} disabled={loading || uploading || !newLesson.title} className="w-full bg-[#34D399] text-black font-black border-2 border-black">Add Lesson</Button>
                   </div>
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
                    {course.enrollments.length === 0 ? (
                      <div className="p-12 text-center opacity-30 font-bold italic">No students enrolled in this class.</div>
                    ) : (
                      <table className="w-full text-left">
                         <tbody className="divide-y-2 divide-black">
                            {course.enrollments.map((enr: any) => (
                              <tr key={enr.id} className="hover:bg-muted/10 transition-colors">
                                 <td className="p-4">
                                    <p className="font-black text-sm uppercase">{enr.user.name}</p>
                                    <p className="text-[10px] font-bold opacity-60">{enr.user.email}</p>
                                 </td>
                                 <td className="p-4 text-right">
                                    <Button variant="ghost" onClick={() => handleUnenroll(enr.id)} className="h-8 w-8 p-0 text-red-600 border-2 border-black hover:bg-red-50">
                                       <X size={14} />
                                    </Button>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                    )}
                 </div>
              </Card>
           </div>
        </div>
      )}
    </div>
  );
}
