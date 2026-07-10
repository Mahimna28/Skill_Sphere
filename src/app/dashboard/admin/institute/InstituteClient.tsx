"use client";

import { useState } from "react";
import { Plus, School, Building2, Users, Loader2, Trash2, CheckCircle, XCircle, UserPlus, LogOut, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
          <h1 className="font-heading text-4xl text-[#1E1B2E] tracking-tight flex items-center gap-3">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] flex items-center justify-center shadow-lg">
                <School size={24} className="text-[#C9A96E]" />
             </div>
             Welcome to Your Organization
          </h1>
          <p className="text-[#8E8E93] font-medium text-lg mt-2">Register your institution to get started.</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(30,27,46,0.05)] rounded-[24px] p-8 max-w-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="font-heading text-2xl text-[#1E1B2E] mb-6 relative z-10">Register New Institution</h3>
          <form onSubmit={handleCreateInst} className="space-y-5 relative z-10">
             <input 
               placeholder="Institution Name (e.g. Oxford)" 
               className="w-full h-14 bg-[#F5F1EB] rounded-xl px-5 text-[15px] font-medium text-[#1E1B2E] focus:outline-none focus:ring-[2px] focus:ring-[#C9A96E]/50 transition-shadow"
               value={name}
               onChange={e => setName(e.target.value)}
               required
             />
             <button type="submit" disabled={loading} className="w-full h-14 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm uppercase tracking-wider shadow-[0_4px_14px_rgba(201,169,110,0.25)] transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} Create Institution
             </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="font-heading text-4xl text-[#1E1B2E] flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] flex items-center justify-center shadow-lg">
                 <School size={28} className="text-[#C9A96E]" />
              </div>
              {currentInst.name}
           </h1>
           <p className="text-[#8E8E93] font-medium text-lg mt-2">Manage your departments, members, and requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           
           {/* Departments */}
           <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(30,27,46,0.05)] rounded-[24px] overflow-hidden relative">
              <div className="p-6 bg-white/50 border-b border-[rgba(30,27,46,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                 <h3 className="font-heading text-xl text-[#1E1B2E] flex items-center gap-2">
                    <Building2 size={22} className="text-[#C9A96E]" /> Departments
                 </h3>
                 <div className="flex gap-3">
                    <input 
                      placeholder="New Dept Name" 
                      className="h-10 border border-[rgba(30,27,46,0.1)] rounded-xl px-4 font-medium text-[14px] w-48 bg-[#F5F1EB] focus:outline-none focus:border-[#C9A96E] transition-colors"
                      value={deptName}
                      onChange={e => setDeptName(e.target.value)}
                    />
                    <button onClick={handleCreateDept} disabled={loading} className="h-10 w-10 rounded-xl bg-[#1E1B2E] text-white hover:bg-[#2A2540] shadow-md transition-colors flex items-center justify-center shrink-0">
                       <Plus size={18} />
                    </button>
                 </div>
              </div>
              
              <div className="p-6 relative z-10">
                 {currentInst.departments.length === 0 ? (
                   <p className="text-sm font-medium text-[#8E8E93] text-center py-8">No departments created yet.</p>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentInst.departments.map((dept: any) => (
                         <div key={dept.id} className="p-5 border border-[rgba(30,27,46,0.05)] bg-white rounded-[20px] shadow-[0_4px_16px_rgba(30,27,46,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                               <p className="font-bold text-[#1E1B2E] text-lg">{dept.name}</p>
                               <p className="text-xs font-bold text-[#C9A96E] mt-1 uppercase tracking-wider">{dept._count?.courses || 0} Active Classes</p>
                            </div>
                            <div className="mt-5">
                               <button 
                                 onClick={() => handleDeleteDept(dept.id)}
                                 disabled={loading}
                                 className="h-9 w-full rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center"
                               >
                                 <Trash2 size={14} className="mr-2"/> Delete Dept
                               </button>
                            </div>
                         </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>

           {/* Join Requests */}
           <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(30,27,46,0.05)] rounded-[24px] overflow-hidden relative">
              <div className="p-6 bg-[#F5C84C]/10 border-b border-[#F5C84C]/20 relative z-10">
                 <h3 className="font-heading text-xl text-[#B98C22] flex items-center gap-2">
                    <UserPlus size={22} /> New Join Requests
                 </h3>
              </div>
              <div className="p-0 relative z-10">
                 {!currentInst.joinRequests || currentInst.joinRequests.length === 0 ? (
                   <div className="p-12 text-center text-[#8E8E93] font-medium text-sm">No pending join requests.</div>
                 ) : (
                   <div className="divide-y divide-[rgba(30,27,46,0.04)]">
                      {currentInst.joinRequests.map((req: any) => (
                        <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F5F1EB]/50 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] flex items-center justify-center text-lg font-heading text-[#C9A96E] shrink-0">
                                 {req.user.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-[#1E1B2E] text-base">{req.user.name}</p>
                                 <p className="text-sm text-[#8E8E93] font-medium">{req.user.email} • <span className="text-[#C9A96E] uppercase font-bold text-[10px] tracking-wider">{req.user.role}</span></p>
                              </div>
                           </div>
                           <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                              <select 
                                className="h-10 border border-[rgba(30,27,46,0.1)] rounded-xl px-3 font-medium text-[13px] bg-[#F5F1EB] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E]"
                                value={requestDepts[req.id] || ""}
                                onChange={e => setRequestDepts({...requestDepts, [req.id]: e.target.value})}
                              >
                                 <option value="">Select Dept</option>
                                 {currentInst.departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                              </select>
                              <button onClick={() => handleAction(req.id, "approve")} disabled={loading} className="h-10 w-10 rounded-xl bg-[#22C55E]/10 text-[#16A34A] hover:bg-[#22C55E]/20 transition-colors flex items-center justify-center" title="Approve">
                                 <Check size={18} />
                              </button>
                              <button onClick={() => handleAction(req.id, "reject")} disabled={loading} className="h-10 w-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center" title="Reject">
                                 <X size={18} />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>

           {/* Leave Requests */}
           <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(30,27,46,0.05)] rounded-[24px] overflow-hidden relative">
              <div className="p-6 bg-red-500/5 border-b border-red-500/10 text-red-600 relative z-10">
                 <h3 className="font-heading text-xl flex items-center gap-2">
                    <LogOut size={22} /> Exit/Leave Requests
                 </h3>
              </div>
              <div className="p-0 relative z-10">
                 {!currentInst.leaveRequests || currentInst.leaveRequests.length === 0 ? (
                   <div className="p-12 text-center text-[#8E8E93] font-medium text-sm">No pending leave requests.</div>
                 ) : (
                   <div className="divide-y divide-[rgba(30,27,46,0.04)]">
                      {currentInst.leaveRequests.map((req: any) => (
                        <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-red-50/50 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-lg font-heading text-red-500 shrink-0">
                                 {req.user.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-[#1E1B2E] text-base">{req.user.name}</p>
                                 <p className="text-[13px] font-medium text-[#8E8E93]">{req.user.email} requests to <strong className="text-red-500">LEAVE</strong></p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <button onClick={() => handleLeaveAction(req.id, "approve")} disabled={loading} className="h-10 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[11px] uppercase tracking-wider transition-colors">
                                 Approve Exit
                              </button>
                              <button onClick={() => handleLeaveAction(req.id, "reject")} disabled={loading} className="h-10 px-4 rounded-xl bg-[#F5F1EB] hover:bg-[#EAE5DC] text-[#1E1B2E] font-bold text-[11px] uppercase tracking-wider transition-colors">
                                 Deny
                              </button>
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
           
           {/* Add Member Form */}
           <div className="bg-[#1E1B2E] rounded-[24px] p-6 shadow-xl relative overflow-hidden border border-[#2D2844]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A96E]/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="font-heading text-xl text-white mb-6 flex items-center gap-2 relative z-10">
                 <UserPlus size={20} className="text-[#C9A96E]"/> Direct Enlistment
              </h3>
              <form onSubmit={handleAddByEmail} className="space-y-4 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">User Email</label>
                    <input 
                      type="email"
                      placeholder="teacher@gmail.com"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A96E]"
                      value={newUserEmail}
                      onChange={e => setNewUserEmail(e.target.value)}
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Department</label>
                    <select 
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-[14px] text-white focus:outline-none focus:border-[#C9A96E]"
                      value={targetDeptId}
                      onChange={e => setTargetDeptId(e.target.value)}
                      required
                    >
                       <option value="" className="bg-[#1E1B2E]">Select Department</option>
                       {currentInst.departments.map((d: any) => <option key={d.id} value={d.id} className="bg-[#1E1B2E]">{d.name}</option>)}
                    </select>
                 </div>
                 <button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm uppercase tracking-wider shadow-[0_4px_14px_rgba(201,169,110,0.25)] transition-all flex items-center justify-center gap-2 mt-2">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : "Deploy Member"}
                 </button>
              </form>
           </div>

           {/* Member Table */}
           <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(30,27,46,0.05)] rounded-[24px] overflow-hidden relative">
              <div className="p-5 bg-[#F5F1EB]/50 border-b border-[rgba(30,27,46,0.05)] flex items-center justify-between relative z-10">
                 <h3 className="font-heading text-lg text-[#1E1B2E]">Roster</h3>
                 <span className="bg-white shadow-sm border border-[rgba(30,27,46,0.05)] px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-lg text-[#8E8E93]">{currentInst.members.length} Members</span>
              </div>
              <div className="p-0 max-h-[400px] overflow-y-auto relative z-10">
                 <table className="w-full text-left">
                    <thead className="bg-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-[rgba(30,27,46,0.05)]">
                       <tr className="text-[10px] font-bold uppercase tracking-widest text-[#8E8E93]">
                          <th className="p-4 w-full">User</th>
                          <th className="p-4 text-right">Dept</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(30,27,46,0.04)]">
                       {currentInst.members.map((m: any) => (
                         <tr key={m.id} className="hover:bg-[#F5F1EB]/30 transition-colors">
                            <td className="p-4">
                               <p className="font-bold text-[13px] text-[#1E1B2E] truncate max-w-[140px]">{m.name}</p>
                               <p className="text-[11px] font-medium text-[#8E8E93] truncate max-w-[140px] mt-0.5">{m.email}</p>
                               <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${m.role === 'teacher' ? 'bg-[rgba(201,169,110,0.15)] text-[#C9A96E]' : 'bg-[rgba(34,197,94,0.15)] text-[#16A34A]'}`}>
                                  {m.role}
                               </span>
                            </td>
                            <td className="p-4 text-right align-top">
                               <span className="px-2.5 py-1 bg-[#F5F1EB] rounded-md text-[10px] font-bold text-[#8E8E93] uppercase truncate max-w-[90px] inline-block">
                                  {m.department?.name || "None"}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
