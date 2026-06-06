"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, School, Building2, Users, Loader2, Trash2, CheckCircle, XCircle, UserPlus, LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InstituteClient({ initialInstitutions }: { initialInstitutions: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [deptName, setDeptName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [targetDeptId, setTargetDeptId] = useState("");
  const [requestDepts, setRequestDepts] = useState<Record<string, string>>({});

  const currentInst = initialInstitutions[0];

  const handleCreateInst = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setName("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDept = async () => {
    if (!deptName || !currentInst) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/institutions/${currentInst.id}/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: deptName }),
      });
      if (res.ok) {
        setDeptName("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDept = async (deptId: string) => {
    if (!currentInst) return;
    if (!confirm("Are you sure? All classes in this department will lose their affiliation.")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/institutions/${currentInst.id}/departments?deptId=${deptId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: "approve" | "reject") => {
    setLoading(true);
    try {
      const deptId = requestDepts[requestId];
      await fetch(`/api/admin/users/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, departmentId: deptId }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveAction = async (requestId: string, action: "approve" | "reject") => {
    setLoading(true);
    try {
      await fetch(`/api/admin/users/leave/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleAddByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !currentInst) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users/add-by-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: newUserEmail, 
          institutionId: currentInst.id,
          departmentId: targetDeptId 
        }),
      });
      if (res.ok) {
        setNewUserEmail("");
        setTargetDeptId("");
        router.refresh();
        alert("User added to institution & department!");
      } else {
        const d = await res.json();
        alert(d.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentInst) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
             <div className="bg-primary text-white p-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <School size={32} />
             </div>
             Welcome to Your Organization
          </h1>
          <p className="text-muted-foreground font-medium text-lg mt-1">Register your institution to get started.</p>
        </div>
        <Card className="neo-brutalism bg-white border-4 border-black p-6 max-w-lg">
          <h3 className="text-xl font-black uppercase mb-4">Register New Institution</h3>
          <form onSubmit={handleCreateInst} className="space-y-4">
             <Input 
               placeholder="Institution Name (e.g. Oxford)" 
               className="border-2 border-black font-bold h-12"
               value={name}
               onChange={e => setName(e.target.value)}
               required
             />
             <Button type="submit" disabled={loading} className="w-full h-12 font-black neo-brutalism bg-secondary text-black uppercase">
                {loading ? <Loader2 className="animate-spin" /> : <Plus className="mr-2" />} Create Institution
             </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
              <div className="bg-[#4F7DF3] text-white p-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                 <School size={32} />
              </div>
              {currentInst.name}
           </h1>
           <p className="text-muted-foreground font-medium text-lg mt-1">Manage your departments, members, and requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Departments */}
           <div className="neo-brutalism bg-white border-4 border-black overflow-hidden">
              <div className="p-6 bg-accent border-b-4 border-black flex items-center justify-between">
                 <h3 className="text-xl font-black uppercase flex items-center gap-2">
                    <Building2 size={24} /> Departments
                 </h3>
                 <div className="flex gap-2">
                    <Input 
                      placeholder="New Dept Name" 
                      className="h-9 border-2 border-black font-bold w-40 bg-white"
                      value={deptName}
                      onChange={e => setDeptName(e.target.value)}
                    />
                    <Button onClick={handleCreateDept} disabled={loading} className="h-9 bg-primary text-white font-black border-2 border-black px-3">
                       <Plus size={16} />
                    </Button>
                 </div>
              </div>
              
              <div className="p-6">
                 {currentInst.departments.length === 0 ? (
                   <p className="text-sm font-bold opacity-30 italic text-center py-4">No departments created yet.</p>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentInst.departments.map((dept: any) => (
                         <div key={dept.id} className="p-4 border-4 border-black bg-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                            <div>
                               <p className="font-black uppercase text-lg">{dept.name}</p>
                               <p className="text-xs font-bold text-muted-foreground mt-1 uppercase">{dept._count?.courses || 0} Active Classes</p>
                            </div>
                            <div className="mt-4 flex gap-2">
                               <Button 
                                 onClick={() => handleDeleteDept(dept.id)}
                                 disabled={loading}
                                 variant="outline" 
                                 className="h-8 w-full border-2 border-black text-red-600 hover:bg-red-50 font-black text-xs uppercase"
                               >
                                 <Trash2 size={12} className="mr-2"/> Delete
                               </Button>
                            </div>
                         </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>

           {/* Join Requests */}
           <div className="neo-brutalism bg-white border-4 border-black overflow-hidden">
              <div className="p-6 bg-[#F5C84C] border-b-4 border-black">
                 <h3 className="text-xl font-black uppercase flex items-center gap-2">
                    <UserPlus size={24} /> New Join Requests
                 </h3>
              </div>
              <div className="p-0">
                 {!currentInst.joinRequests || currentInst.joinRequests.length === 0 ? (
                   <div className="p-12 text-center opacity-30 italic font-bold">No pending join requests.</div>
                 ) : (
                   <div className="divide-y-4 divide-black">
                      {currentInst.joinRequests.map((req: any) => (
                        <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center text-lg font-black uppercase shrink-0">
                                 {req.user.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-black text-lg uppercase leading-tight">{req.user.name}</p>
                                 <p className="text-sm font-bold text-muted-foreground">{req.user.email} • <span className="text-primary uppercase">{req.user.role}</span></p>
                              </div>
                           </div>
                           <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                              <select 
                                className="h-10 border-2 border-black font-bold uppercase text-[10px] px-2 bg-white"
                                value={requestDepts[req.id] || ""}
                                onChange={e => setRequestDepts({...requestDepts, [req.id]: e.target.value})}
                              >
                                 <option value="">Select Dept</option>
                                 {currentInst.departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                              </select>
                              <Button onClick={() => handleAction(req.id, "approve")} disabled={loading} className="bg-[#34D399] text-black border-2 border-black font-black h-10 px-4">
                                 Approve
                              </Button>
                              <Button onClick={() => handleAction(req.id, "reject")} disabled={loading} className="bg-red-500 text-white border-2 border-black font-black h-10 px-4">
                                 <X size={18} />
                              </Button>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>

           {/* Leave Requests */}
           <div className="neo-brutalism bg-white border-4 border-black overflow-hidden">
              <div className="p-6 bg-red-100 border-b-4 border-black text-red-600">
                 <h3 className="text-xl font-black uppercase flex items-center gap-2">
                    <LogOut size={24} /> Exit/Leave Requests
                 </h3>
              </div>
              <div className="p-0">
                 {!currentInst.leaveRequests || currentInst.leaveRequests.length === 0 ? (
                   <div className="p-12 text-center opacity-30 italic font-bold text-red-600/50">No pending leave requests.</div>
                 ) : (
                   <div className="divide-y-4 divide-black">
                      {currentInst.leaveRequests.map((req: any) => (
                        <div key={req.id} className="p-6 flex items-center justify-between hover:bg-red-50/50 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full border-2 border-red-600 bg-white flex items-center justify-center text-lg font-black uppercase text-red-600 shrink-0">
                                 {req.user.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-black text-lg uppercase leading-tight text-red-600">{req.user.name}</p>
                                 <p className="text-sm font-bold opacity-60">{req.user.email} requests to LEAVE</p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <Button onClick={() => handleLeaveAction(req.id, "approve")} disabled={loading} className="bg-red-600 text-white border-2 border-black font-black h-10 px-4">
                                 Approve Exit
                              </Button>
                              <Button onClick={() => handleLeaveAction(req.id, "reject")} disabled={loading} className="bg-white text-black border-2 border-black font-black h-10 px-4">
                                 Deny
                              </Button>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
           {/* Member Table */}
           <div className="neo-brutalism bg-white border-4 border-black overflow-hidden">
              <div className="p-4 bg-muted border-b-4 border-black flex items-center justify-between">
                 <h3 className="text-lg font-black uppercase">Roster</h3>
                 <span className="bg-white border-2 border-black px-2 py-1 text-[10px] font-black rounded-lg">{currentInst.members.length} Members</span>
              </div>
              <div className="p-0 max-h-[400px] overflow-y-auto">
                 <table className="w-full text-left">
                    <thead className="bg-muted/30 border-b-2 border-black sticky top-0">
                       <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <th className="p-3">User</th>
                          <th className="p-3">Dept</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black">
                       {currentInst.members.map((m: any) => (
                         <tr key={m.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-3">
                               <p className="font-black text-xs uppercase truncate max-w-[120px]">{m.name}</p>
                               <p className="text-[10px] font-bold opacity-60 truncate max-w-[120px]">{m.email}</p>
                               <span className={`inline-block mt-1 px-1.5 py-0.5 border-2 border-black rounded text-[8px] font-black uppercase ${m.role === 'teacher' ? 'bg-[#4F7DF3] text-white' : 'bg-[#34D399] text-black'}`}>
                                  {m.role}
                               </span>
                            </td>
                            <td className="p-3">
                               <span className="px-2 py-1 bg-accent/20 border-2 border-black rounded-md text-[10px] font-black uppercase truncate max-w-[80px] inline-block">
                                  {m.department?.name || "None"}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Add Member Form */}
           <Card className="neo-brutalism bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
                 <UserPlus size={20} /> Direct Enlistment
              </h3>
              <form onSubmit={handleAddByEmail} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-70">User Email</label>
                    <Input 
                      type="email"
                      placeholder="teacher@gmail.com"
                      className="h-10 border-2 border-white font-bold bg-white/10 text-white placeholder:text-white/50"
                      value={newUserEmail}
                      onChange={e => setNewUserEmail(e.target.value)}
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-70">Department</label>
                    <select 
                      className="w-full h-10 border-2 border-white font-bold bg-white text-black px-3"
                      value={targetDeptId}
                      onChange={e => setTargetDeptId(e.target.value)}
                      required
                    >
                       <option value="">Select Department</option>
                       {currentInst.departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                 </div>
                 <Button type="submit" disabled={loading} className="w-full h-10 font-black neo-brutalism bg-[#F5C84C] text-black uppercase mt-2 hover:bg-[#e0b745]">
                    {loading ? <Loader2 className="animate-spin" /> : "Deploy Member"}
                 </Button>
              </form>
           </Card>
        </div>
      </div>
    </div>
  );
}
