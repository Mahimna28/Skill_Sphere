"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const totalStudents = courses.reduce((sum, c) => sum + c._count.enrollments, 0);

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
        showToast("✅ " + data.message, "success");
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-top-4 duration-300 ${toast.type === "success" ? "bg-[#34D399] text-black" : "bg-[#ef4444] text-white"}`}>
          {toast.message}
        </div>
      )}

      {/* Create Course Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <Card className="w-full max-w-xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b-4 border-black flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-2xl font-black">Create New Course</CardTitle>
              <button onClick={() => setShowForm(false)} className="w-9 h-9 border-2 border-black rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                <X size={18} />
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-black text-base">Course Title *</Label>
                  <Input required placeholder="e.g. Introduction to Python" className="neo-brutalism-static h-11" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-base">Subject *</Label>
                  <select className="flex h-11 w-full rounded-xl border-2 border-black bg-background px-3 py-2 font-medium text-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-primary" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-base">Description *</Label>
                  <textarea required rows={4} placeholder="Describe what students will learn..." className="flex w-full rounded-xl border-2 border-black bg-background px-3 py-2 font-medium text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-primary resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-base">Cover Photo <span className="font-normal text-muted-foreground">(optional)</span></Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="file" 
                      accept="image/*"
                      className="neo-brutalism-static h-11 flex-1 cursor-pointer" 
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
                      <div className="h-11 w-11 rounded border-2 border-black overflow-hidden shrink-0">
                         <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-bold text-muted-foreground mt-1">Select an image file from your device.</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-base">Course Type *</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border-2 border-black rounded-xl hover:bg-muted transition-colors flex-1">
                      <input type="radio" name="courseType" checked={form.isPublic} onChange={() => setForm({ ...form, isPublic: true })} className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-black flex items-center gap-1"><Globe size={12} /> Public Course</span>
                        <span className="text-xs text-muted-foreground font-medium">Visible to everyone on the courses page.</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 border-2 border-black rounded-xl hover:bg-muted transition-colors flex-1">
                      <input type="radio" name="courseType" checked={!form.isPublic} onChange={() => setForm({ ...form, isPublic: false })} className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-black flex items-center gap-1"><Lock size={12} /> Private Class</span>
                        <span className="text-xs text-muted-foreground font-medium">Hidden. Add students manually.</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1 border-2 border-black font-bold h-12" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 neo-brutalism font-bold h-12 text-lg" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating...</> : "Publish"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2">Welcome, {teacher?.name?.split(" ")[0] || "Teacher"}! 🎓</h1>
          <p className="text-muted-foreground font-medium text-lg">Manage your courses and track student progress.</p>
        </div>
        <div className="flex gap-2">
          {teacher?.role === "teacher" && (
            <Button variant="outline" className="font-bold text-lg h-12 px-6 border-2 border-black hover:bg-[#F5C84C] hover:text-black transition-colors" onClick={() => setShowPromotionForm(true)}>
              <ShieldAlert className="mr-2 h-5 w-5" /> Request Promotion
            </Button>
          )}
          <Button className="neo-brutalism font-bold text-lg h-12 px-6" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-5 w-5" /> Create New Course
          </Button>
        </div>
      </div>

      {/* Promotion Request Modal */}
      {showPromotionForm && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b-4 border-black flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-2xl font-black flex items-center gap-2"><ShieldAlert size={24} /> Request Promotion</CardTitle>
              <button onClick={() => setShowPromotionForm(false)} className="w-9 h-9 border-2 border-black rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                <X size={18} />
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePromotionRequest} className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-black text-base">Why do you want to become an Institute Admin? *</Label>
                  <textarea required rows={4} placeholder="E.g., I want to manage my school's departments and teachers..." className="flex w-full rounded-xl border-2 border-black bg-background px-3 py-2 font-medium text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-primary resize-none" value={promotionReason} onChange={(e) => setPromotionReason(e.target.value)} />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1 border-2 border-black font-bold h-12" onClick={() => setShowPromotionForm(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 neo-brutalism bg-[#F5C84C] text-black font-bold h-12 text-lg hover:bg-[#e0b745]" disabled={promotionLoading}>
                    {promotionLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</> : "Submit Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#4F7DF3] text-white neo-brutalism-static">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Active Courses</CardTitle>
            <BookOpen className="h-6 w-6 text-[#F5C84C]" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black">{courses.length}</div>
            <p className="text-white/80 font-medium mt-2">{courses.length === 0 ? "Create your first course" : "Published"}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#34D399] text-black neo-brutalism-static">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Total Students</CardTitle>
            <Users className="h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black">{totalStudents}</div>
            <p className="text-black/80 font-medium mt-2">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses */}
      <div>
        <h2 className="text-2xl font-black mb-4">Your Courses</h2>
        {courses.length === 0 ? (
          <Card className="neo-brutalism-static p-16 text-center bg-white">
            <BookOpen className="h-20 w-20 mx-auto text-muted-foreground/20 mb-4" />
            <h3 className="text-2xl font-black mb-2">No Courses Yet</h3>
            <p className="text-muted-foreground font-medium mb-6">Start creating your first course to teach students on Skill Sphere.</p>
            <Button className="neo-brutalism font-bold" onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create First Course
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="neo-brutalism bg-white flex flex-col overflow-hidden hover:translate-x-1 hover:-translate-y-1 transition-transform">
                <div className="h-36 bg-primary/10 border-b-2 border-black flex items-center justify-center relative overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="h-12 w-12 text-primary opacity-30" />
                  )}
                  <div className={`absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded border-2 border-black flex items-center gap-1 ${course.isPublic ? "bg-[#34D399] text-black" : "bg-black text-white"}`}>
                    {course.isPublic ? <><Globe size={9} /> Public</> : <><Lock size={9} /> Private</>}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-black">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                    <Users className="h-3 w-3" /> {course._count.enrollments} enrolled
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium line-clamp-2">{course.description}</p>
                </CardContent>
                <div className="p-4 border-t-2 border-black bg-muted/30 flex gap-2">
                  <Link href={`/dashboard/teacher/courses/${course.id}`} className="flex-1">
                    <Button className="w-full neo-brutalism font-bold" variant="default">Manage</Button>
                  </Link>
                  <Link href={`/dashboard/teacher/courses/${course.id}`} className="flex-1">
                    <Button className="w-full font-bold border-2 border-black" variant="outline">View Students</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
