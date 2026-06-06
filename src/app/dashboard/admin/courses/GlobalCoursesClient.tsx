"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Users, Plus, Loader2, X, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SUBJECTS = ["AI & ML", "Python", "Web Dev", "CS Fundamentals", "Databases", "Networking", "Systems", "Security", "Cloud", "Electronics", "Software Eng.", "Java", "Mathematics", "Other"];

export default function GlobalCoursesClient({ superadmin, initialCourses }: { superadmin: any, initialCourses: any[] }) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ title: "", description: "", subject: "Python", thumbnail: "", isPublic: true });

  const totalStudents = courses.reduce((sum, c) => sum + c._count.enrollments, 0);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
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
        setCourses([{ ...data.course, _count: { enrollments: 0 } }, ...courses]);
        setShowForm(false);
        setForm({ title: "", description: "", subject: "Python", thumbnail: "", isPublic: true });
        showToast("✅ Course Created Successfully", "success");
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-xl border-4 border-black font-black z-50 animate-in slide-in-from-top-2 ${toast.type === "success" ? "bg-[#34D399] text-black" : "bg-red-500 text-white"}`}>
          {toast.message}
        </div>
      )}

      {/* Course Creation Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <CardHeader className="bg-[#4F7DF3] text-white border-b-4 border-black flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-2xl font-black">Deploy Global Course</CardTitle>
              <button onClick={() => setShowForm(false)} className="w-9 h-9 border-2 border-black bg-white text-black rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                <X size={18} />
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreateCourse} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="font-black text-base">Course Title *</Label>
                    <Input required placeholder="e.g. Advanced Networking" className="neo-brutalism-static h-11" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-base">Subject / Category *</Label>
                    <select required className="flex w-full h-11 rounded-xl border-2 border-black bg-background px-3 py-2 font-medium text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-primary" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-base">Description *</Label>
                  <textarea required rows={4} placeholder="Describe what students will learn..." className="flex w-full rounded-xl border-2 border-black bg-background px-3 py-2 font-medium text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-primary resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-base">Thumbnail URL <span className="font-normal text-muted-foreground">(optional)</span></Label>
                  <Input placeholder="https://images.unsplash.com/..." className="neo-brutalism-static h-11" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1 border-2 border-black font-bold h-12" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 neo-brutalism font-bold h-12 text-lg" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Deploying...</> : "Publish Global Course"}
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
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
             <div className="bg-[#4F7DF3] text-white p-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Globe size={32} />
             </div>
             Global Courses
          </h1>
          <p className="text-muted-foreground font-medium text-lg">Platform-wide courses managed by the Superadmin.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            className="neo-brutalism bg-[#F9A8D4] text-black font-black text-sm md:text-lg h-12 px-6" 
            onClick={async () => {
              if (confirm("Are you sure you want to instantly deploy 10 Free CS Courses?")) {
                setLoading(true);
                try {
                  const res = await fetch("/api/admin/seed-courses", { method: "POST" });
                  const data = await res.json();
                  if (res.ok) {
                    showToast(data.message, "success");
                    router.refresh();
                  } else {
                    showToast(data.message, "error");
                  }
                } finally {
                  setLoading(false);
                }
              }
            }}
            disabled={loading}
          >
            <BookOpen className="mr-2 h-5 w-5" /> Seed Free CS Courses
          </Button>
          <Button className="neo-brutalism font-bold text-sm md:text-lg h-12 px-6" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-5 w-5" /> Deploy New Course
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="neo-brutalism bg-[#34D399] border-4 border-black rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-widest opacity-80 mb-1">Global Courses</p>
                <p className="text-5xl font-black">{courses.length}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-4 border-black">
                <BookOpen size={28} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="neo-brutalism bg-[#F5C84C] border-4 border-black rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-widest opacity-80 mb-1">Total Global Students</p>
                <p className="text-5xl font-black">{totalStudents}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-4 border-black">
                <Users size={28} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course List */}
      <div>
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
          <BookOpen size={24} /> Active Global Courses
        </h2>
        
        {courses.length === 0 ? (
          <div className="neo-brutalism bg-white border-4 border-black border-dashed rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-black">
              <BookOpen size={32} className="opacity-50" />
            </div>
            <h3 className="text-xl font-black uppercase mb-2">No Global Courses Yet</h3>
            <p className="text-muted-foreground font-bold max-w-md mx-auto mb-6">Create your first public course to make it available to all students platform-wide.</p>
            <Button className="neo-brutalism font-bold" onClick={() => setShowForm(true)}>
              Deploy Course Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="neo-brutalism bg-white border-4 border-black rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="h-40 bg-muted border-b-4 border-black relative overflow-hidden group">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F9A8D4]">
                      <BookOpen size={48} className="opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white border-2 border-black rounded-lg px-2 py-1 text-[10px] font-black uppercase">
                    {course.subject}
                  </div>
                </div>
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-xl font-black uppercase line-clamp-1 mb-1" title={course.title}>{course.title}</h3>
                    <p className="text-xs font-bold text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-black/10">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-primary">
                      <Users size={14} /> {course._count.enrollments} Students
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/dashboard/teacher/courses/${course.id}`} className="flex-1">
                      <Button className="w-full neo-brutalism font-bold text-xs">Manage Lessons</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
