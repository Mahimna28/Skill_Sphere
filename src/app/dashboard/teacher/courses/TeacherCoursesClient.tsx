"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, Loader2, X, Globe, Lock } from "lucide-react";

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
        setCourses((prev) => [data, ...prev]);
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
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-top-4 duration-300 ${toast.type === "success" ? "bg-secondary text-black" : "bg-[#ef4444] text-white"}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <BookOpen size={32} />
            </div>
            Manage Courses
          </h1>
          <p className="text-muted-foreground font-medium text-lg">Create and manage your course catalogue.</p>
        </div>
        <Button className="neo-brutalism font-bold text-lg h-12 px-6 bg-accent text-black hover:bg-[#eab308]" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-5 w-5" /> Create New Course
        </Button>
      </div>

      {/* Create Course Form Modal */}
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
                  <Input
                    required
                    placeholder="e.g. Introduction to Python"
                    className="neo-brutalism-static h-11"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-base">Subject *</Label>
                  <select
                    className="flex h-11 w-full rounded-xl border-2 border-black bg-background px-3 py-2 font-medium text-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-primary"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  >
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-base">Description *</Label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe what students will learn in this course..."
                    className="flex w-full rounded-xl border-2 border-black bg-background px-3 py-2 font-medium text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-base">Thumbnail URL <span className="font-normal text-muted-foreground">(optional)</span></Label>
                  <Input
                    placeholder="https://images.unsplash.com/..."
                    className="neo-brutalism-static h-11"
                    value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-base">Course Type *</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border-2 border-black rounded-xl hover:bg-muted transition-colors flex-1">
                      <input type="radio" name="courseType" checked={form.isPublic} onChange={() => setForm({ ...form, isPublic: true })} className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-black">Public Course</span>
                        <span className="text-xs text-muted-foreground font-medium">Visible to everyone on the main courses page.</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 border-2 border-black rounded-xl hover:bg-muted transition-colors flex-1">
                      <input type="radio" name="courseType" checked={!form.isPublic} onChange={() => setForm({ ...form, isPublic: false })} className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-black">Private Class</span>
                        <span className="text-xs text-muted-foreground font-medium">Hidden. Students must be added by you manually.</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1 border-2 border-black font-bold h-12" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 neo-brutalism font-bold h-12 text-lg" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating...</> : "Publish"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Course Grid */}
      {courses.length === 0 ? (
        <Card className="neo-brutalism-static p-16 text-center bg-white">
          <BookOpen className="h-20 w-20 mx-auto text-muted-foreground/20 mb-4" />
          <h3 className="text-2xl font-black mb-2">No Courses Yet</h3>
          <p className="text-muted-foreground font-medium mb-6">Create your first course to start teaching students on Skill Sphere.</p>
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
                  <BookOpen className="h-12 w-12 text-primary opacity-20" />
                )}
                <div className="absolute top-2 left-2 bg-accent border-2 border-black text-black text-xs font-black px-2 py-0.5 rounded">
                  {course.subject}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-black">{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground font-medium">{course._count?.enrollments ?? 0} students enrolled</p>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground font-medium line-clamp-2">{course.description}</p>
              </CardContent>
              <div className="p-4 border-t-2 border-black bg-muted/30 flex gap-2">
                <Link href={`/dashboard/teacher/courses/${course.id}`} className="flex-1">
                  <Button className="w-full neo-brutalism font-bold" variant="default">Edit</Button>
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
  );
}
