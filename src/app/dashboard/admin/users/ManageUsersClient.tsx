"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Mail, Check, X, UserPlus, Loader2, Building2, ShieldAlert, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ManageUsersClient({ initialInstitutions }: { initialInstitutions: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedInstId, setSelectedInstId] = useState(initialInstitutions[0]?.id || "");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [targetDeptId, setTargetDeptId] = useState("");
  const [requestDepts, setRequestDepts] = useState<Record<string, string>>({});

  const currentInst = initialInstitutions.find(i => i.id === selectedInstId);

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
    if (!newUserEmail || !selectedInstId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users/add-by-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: newUserEmail, 
          institutionId: selectedInstId,
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
              <div className="bg-primary text-white p-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                 <Users size={32} />
              </div>
              Organization Master
           </h1>
           <p className="text-muted-foreground font-medium text-lg mt-1">Assign departments and manage member transitions.</p>
        </div>
        <div className="flex flex-col gap-2">
           <label className="text-[10px] font-black uppercase opacity-60">Manage Organization</label>
           <select 
             className="h-12 border-4 border-black font-black uppercase px-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none"
             value={selectedInstId}
             onChange={e => setSelectedInstId(e.target.value)}
           >
              {initialInstitutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Join Requests */}
           <div className="neo-brutalism bg-white border-4 border-black overflow-hidden">
              <div className="p-6 bg-[#F5C84C] border-b-4 border-black">
                 <h3 className="text-xl font-black uppercase flex items-center gap-2">
                    <UserPlus size={24} /> New Join Requests
                 </h3>
              </div>
              <div className="p-0">
                 {!currentInst?.joinRequests || currentInst.joinRequests.length === 0 ? (
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
                 {!currentInst?.leaveRequests || currentInst.leaveRequests.length === 0 ? (
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

           {/* Member Table */}
           <div className="neo-brutalism bg-white border-4 border-black overflow-hidden">
              <div className="p-6 bg-muted border-b-4 border-black flex items-center justify-between">
                 <h3 className="text-xl font-black uppercase">Institutional Roster</h3>
                 <span className="bg-white border-2 border-black px-3 py-1 text-xs font-black rounded-lg">{currentInst?.members.length || 0} Members</span>
              </div>
              <div className="p-0">
                 <table className="w-full text-left">
                    <thead className="bg-muted/30 border-b-2 border-black">
                       <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <th className="p-4">Member</th>
                          <th className="p-4">Department</th>
                          <th className="p-4">Role</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black">
                       {currentInst?.members.map((m: any) => (
                         <tr key={m.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-4">
                               <p className="font-black text-sm uppercase">{m.name}</p>
                               <p className="text-[10px] font-bold opacity-60">{m.email}</p>
                            </td>
                            <td className="p-4">
                               <span className="px-3 py-1 bg-accent/20 border-2 border-black rounded-lg text-xs font-black uppercase">
                                  {m.department?.name || "Unassigned"}
                               </span>
                            </td>
                            <td className="p-4">
                               <span className={`px-2 py-1 border-2 border-black rounded text-[10px] font-black uppercase ${m.role === 'teacher' ? 'bg-[#4F7DF3] text-white' : 'bg-[#34D399] text-black'}`}>
                                  {m.role}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Sidebar: Add Member */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="neo-brutalism bg-primary text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                 <UserPlus size={24} /> Direct Enlistment
              </h3>
              <form onSubmit={handleAddByEmail} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-70">User Gmail</label>
                    <Input 
                      type="email"
                      placeholder="teacher@gmail.com"
                      className="h-12 border-2 border-black font-bold bg-white text-black"
                      value={newUserEmail}
                      onChange={e => setNewUserEmail(e.target.value)}
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-70">Target Department</label>
                    <select 
                      className="w-full h-12 border-2 border-black font-bold bg-white text-black px-3"
                      value={targetDeptId}
                      onChange={e => setTargetDeptId(e.target.value)}
                      required
                    >
                       <option value="">Select Department</option>
                       {currentInst?.departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                 </div>
                 <Button type="submit" disabled={loading} className="w-full h-12 font-black neo-brutalism bg-black text-white uppercase mt-2">
                    {loading ? <Loader2 className="animate-spin" /> : "Deploy Member"}
                 </Button>
              </form>
           </Card>

           <div className="p-6 border-4 border-black border-dashed rounded-3xl bg-muted/10 opacity-60">
              <ShieldAlert size={32} className="mb-4 text-primary" />
              <h4 className="font-black uppercase text-xs">Exclusivity Protocol</h4>
              <p className="text-[10px] font-bold mt-2 leading-relaxed">
                 Teachers and Students are locked into one institution. They must submit a formal Leave Request to the Master Panel before joining a different organization.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
