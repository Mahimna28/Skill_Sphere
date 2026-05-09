"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Plus, Loader2, ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [depts, setDepts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    departmentId: "",
  });

  useEffect(() => {
    fetch("/api/teacher/institution")
      .then(res => res.json())
      .then(data => setDepts(data.departments));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard/teacher/courses");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/teacher/courses">
          <Button variant="ghost" className="font-black border-2 border-black">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Classes
          </Button>
        </Link>
        <h1 className="text-3xl font-black uppercase">Create New Class</h1>
      </div>

      <div className="neo-brutalism bg-white p-8 border-4 border-black">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest">Class Title</label>
            <Input 
              required className="h-12 border-2 border-black font-bold" 
              placeholder="e.g. Advanced Java Programming"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest">Category / Subject</label>
            <Input 
              required className="h-12 border-2 border-black font-bold" 
              placeholder="e.g. Computer Science"
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          {depts.length > 0 && (
            <div className="space-y-2 p-4 bg-accent/10 border-2 border-black border-dashed rounded-xl">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <Building2 size={12} /> Assign to Department
              </label>
              <select 
                className="w-full h-12 border-2 border-black font-bold bg-white px-3"
                value={formData.departmentId}
                onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
              >
                 <option value="">No Department (Personal Class)</option>
                 {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest">Short Description</label>
            <Textarea 
              required className="min-h-[120px] border-2 border-black font-bold" 
              placeholder="What will students learn in this class?"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full h-14 text-lg font-black neo-brutalism bg-primary text-white uppercase" disabled={loading}>
            {loading ? <Loader2 className="mr-2 animate-spin" /> : <><Plus className="mr-2" /> Initialize Class</>}
          </Button>
        </form>
      </div>
    </div>
  );
}
