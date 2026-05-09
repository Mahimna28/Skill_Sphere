"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { School, CheckCircle2, ArrowRight, Loader2, Send, Search, LogOut, ShieldAlert, Building2, BookOpen, Users, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JoinInstitutionClient({ institutions, userInstitutionId, teacherData }: { institutions: any[], userInstitutionId: string | null | undefined, teacherData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [requestedId, setRequestedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveRequested, setLeaveRequested] = useState(false);

  const filteredInstitutions = institutions.filter(inst => 
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoin = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/institutions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ institutionId: id }),
      });
      if (res.ok) {
        setRequestedId(id);
        alert("Join request sent to Institution Admin!");
      } else {
        const d = await res.json();
        alert(d.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure? This will send a request to your Admin. You cannot join a new institution until approved.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/institutions/leave", { method: "POST" });
      if (res.ok) {
        setLeaveRequested(true);
        alert("Leave request sent to Admin!");
      } else {
        const d = await res.json();
        alert(d.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
           <div className="bg-primary text-white p-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <School size={32} />
           </div>
           Institutions Management
        </h1>
        <p className="text-muted-foreground font-medium text-lg mt-1">Directly manage your institutional classes and affiliation.</p>
      </div>

      {userInstitutionId ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              {/* Info Banner */}
              <div className="bg-[#4F7DF3] text-white border-4 border-black p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                <div className="z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Faculty Affiliation</p>
                    <h2 className="text-5xl font-black uppercase tracking-tight">
                      {teacherData?.institution?.name || "RNGPIT"}
                    </h2>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-black uppercase">Verified Member</span>
                      </div>
                      {teacherData?.department && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                           <Building2 size={14} />
                           <span className="text-xs font-black uppercase">{teacherData.department.name}</span>
                        </div>
                      )}
                    </div>
                </div>
                <CheckCircle2 size={100} className="opacity-20 z-10 shrink-0" />
              </div>

              {/* Class Management List */}
              <div className="neo-brutalism bg-white border-4 border-black overflow-hidden">
                 <div className="p-6 bg-muted border-b-4 border-black flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase flex items-center gap-2">
                       <BookOpen size={24} /> Private Classes
                    </h3>
                    <Link href="/dashboard/teacher/courses">
                       <Button className="h-10 bg-[#34D399] text-black border-2 border-black font-black uppercase">
                          <Plus className="mr-2 h-4 w-4" /> New Class
                       </Button>
                    </Link>
                 </div>
                 <div className="p-0">
                    {!teacherData?.courses || teacherData.courses.length === 0 ? (
                      <div className="p-20 text-center opacity-40 italic font-bold">
                         <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
                         <p>You haven't created any private classes yet.</p>
                         <p className="text-xs mt-2">Go to <strong>Manage Courses</strong> → Create a course → Select <strong>"Private Class"</strong> type.</p>
                      </div>
                    ) : (
                      <div className="divide-y-4 divide-black">
                         {teacherData.courses.map((course: any) => (
                           <div key={course.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-primary/10 border-2 border-black rounded-xl flex items-center justify-center text-primary">
                                    <BookOpen size={24} />
                                 </div>
                                 <div>
                                    <h4 className="font-black text-lg uppercase leading-tight">{course.title}</h4>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">{course.subject}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-6">
                                 <div className="flex items-center gap-2 font-black text-xs uppercase opacity-60">
                                    <Users size={14} /> {course._count.enrollments} Students
                                 </div>
                                 <Link href={`/dashboard/teacher/courses/${course.id}`}>
                                    <Button className="neo-brutalism border-2 border-black h-10 px-6 font-black uppercase bg-secondary text-black">
                                       Manage Class
                                    </Button>
                                 </Link>
                              </div>
                           </div>
                         ))}
                      </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Sidebar: Exit & Rules */}
           <div className="lg:col-span-1 space-y-6">
              <Card className="neo-brutalism bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[300px]">
                 <div>
                    <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2 text-red-600">
                       <ShieldAlert size={24} /> Security Protocol
                    </h3>
                    <p className="text-sm font-bold text-muted-foreground leading-relaxed mb-6">
                       As a verified faculty member of **{teacherData?.institution?.name}**, you are restricted from joining other organizations. 
                    </p>
                    <div className="p-4 bg-muted/20 border-2 border-black border-dashed rounded-xl">
                       <p className="text-[10px] font-black uppercase mb-2">Hierarchy Rules</p>
                       <ul className="text-[10px] font-bold space-y-2 opacity-70">
                          <li>• Manage classes within your Dept.</li>
                          <li>• Enroll students via direct Gmail.</li>
                          <li>• Exit requires Admin Approval.</li>
                       </ul>
                    </div>
                 </div>
                 <Button 
                   onClick={handleLeave} 
                   disabled={loading || leaveRequested}
                   variant="destructive" 
                   className="w-full h-14 font-black neo-brutalism border-2 border-black mt-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                 >
                    {loading ? <Loader2 className="animate-spin" /> : (leaveRequested ? "Exit Pending Approval" : <><LogOut size={20} className="mr-2" /> Request to Leave</>)}
                 </Button>
              </Card>
           </div>
        </div>
      ) : (
        <div className="space-y-6">
           <div className="flex gap-3">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                 <Input 
                   placeholder="Search for your school or college..." 
                   className="pl-12 h-12 border-4 border-black font-bold text-lg bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstitutions.map((inst) => (
                <Card key={inst.id} className="neo-brutalism bg-white border-4 border-black overflow-hidden hover:translate-x-1 hover:-translate-y-1 transition-transform">
                   <div className="p-6 border-b-4 border-black bg-muted/20">
                      <h3 className="text-xl font-black uppercase truncate">{inst.name}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{inst._count.members} Verified Members</p>
                   </div>
                   <CardContent className="p-6">
                      <Button 
                        onClick={() => handleJoin(inst.id)} 
                        disabled={loading || requestedId === inst.id}
                        className={`w-full h-12 font-black border-2 border-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all ${requestedId === inst.id ? 'bg-muted' : 'bg-secondary text-black'}`}
                      >
                         {loading ? <Loader2 className="animate-spin" /> : (requestedId === inst.id ? "Awaiting Review" : <><Send size={18} className="mr-2" /> Join as Faculty</>)}
                      </Button>
                   </CardContent>
                </Card>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
