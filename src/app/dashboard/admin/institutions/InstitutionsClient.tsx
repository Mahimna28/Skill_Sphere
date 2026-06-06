"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, School, Building2, Users, ArrowRight, Loader2, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InstitutionsClient({ initialInstitutions }: { initialInstitutions: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedInst, setSelectedInst] = useState<any>(null);
  const [deptName, setDeptName] = useState("");

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

  const handleCreateDept = async (instId: string) => {
    if (!deptName) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/institutions/${instId}/departments`, {
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
    if (!confirm("Are you sure? All classes in this department will lose their affiliation.")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/institutions/${selectedInst.id}/departments?deptId=${deptId}`, { method: "DELETE" });
      router.refresh();
      setSelectedInst(null); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
             <div className="bg-primary text-white p-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <School size={32} />
             </div>
             Institutions
          </h1>
          <p className="text-muted-foreground font-medium text-lg mt-1">Manage whole schools, colleges, and departments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation & List */}
        <div className="lg:col-span-1 space-y-6">
          {initialInstitutions.length === 0 && (
            <Card className="neo-brutalism bg-white border-4 border-black p-6">
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
          )}

          <div className="space-y-4">
             <h4 className="text-xs font-black uppercase tracking-widest opacity-60">Your Institutions</h4>
             {initialInstitutions.length === 0 && (
               <p className="text-sm font-bold opacity-30 italic">No institutions created yet.</p>
             )}
             {initialInstitutions.map((inst) => (
               <button 
                 key={inst.id}
                 onClick={() => setSelectedInst(inst)}
                 className={`w-full p-4 border-4 border-black text-left transition-all ${selectedInst?.id === inst.id ? 'bg-[#4F7DF3] text-white -translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
               >
                  <div className="flex items-center justify-between">
                     <span className="font-black uppercase truncate">{inst.name}</span>
                     <ArrowRight size={16} />
                  </div>
                  <div className="mt-2 flex gap-3 text-[10px] font-bold uppercase opacity-80">
                     <span className="flex items-center gap-1"><Building2 size={12} /> {inst.departments.length} Depts</span>
                     <span className="flex items-center gap-1"><Users size={12} /> {inst._count.members} Members</span>
                  </div>
               </button>
             ))}
          </div>
        </div>

        {/* Detailed Management */}
        <div className="lg:col-span-2">
          {selectedInst ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
               <div className="neo-brutalism bg-white border-4 border-black overflow-hidden">
                  <div className="p-6 bg-accent border-b-4 border-black flex items-center justify-between">
                     <h3 className="text-2xl font-black uppercase">{selectedInst.name} Hierarchy</h3>
                     <div className="flex gap-2">
                        <Button variant="ghost" className="h-10 w-10 border-2 border-black p-0 bg-white hover:bg-red-50 text-red-600">
                           <Trash2 size={18} />
                        </Button>
                     </div>
                  </div>
                  
                  <div className="p-8 space-y-8">
                     {/* Departments */}
                     <div>
                        <div className="flex items-center justify-between mb-4">
                           <h4 className="font-black uppercase text-sm tracking-widest flex items-center gap-2">
                              <Building2 size={16} /> Departments
                           </h4>
                           <div className="flex gap-2">
                              <Input 
                                placeholder="Dept Name" 
                                className="h-9 border-2 border-black font-bold w-40"
                                value={deptName}
                                onChange={e => setDeptName(e.target.value)}
                              />
                              <Button onClick={() => handleCreateDept(selectedInst.id)} disabled={loading} className="h-9 bg-primary text-white font-black border-2 border-black px-3">
                                 <Plus size={16} />
                              </Button>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {selectedInst.departments.map((dept: any) => (
                              <div key={dept.id} className="p-4 border-4 border-black bg-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                 <p className="font-black uppercase text-lg">{dept.name}</p>
                                 <p className="text-xs font-bold text-muted-foreground mt-1 uppercase">{dept._count.courses} Active Classes</p>
                                 <div className="mt-4 flex gap-2">
                                    <Button variant="outline" className="flex-1 h-8 text-[10px] font-black border-2 border-black uppercase">Manage</Button>
                                    <Button 
                                      onClick={() => handleDeleteDept(dept.id)}
                                      disabled={loading}
                                      variant="outline" 
                                      className="h-8 w-8 p-0 border-2 border-black text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 size={12}/>
                                    </Button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Pending Requests */}
                     <div className="pt-8 border-t-4 border-black border-dashed">
                        <h4 className="font-black uppercase text-sm tracking-widest mb-4 flex items-center gap-2">
                           <Users size={16} /> Pending Join Requests ({selectedInst._count.joinRequests})
                        </h4>
                        <div className="space-y-3">
                           <p className="text-sm font-bold opacity-30 italic">Go to 'Manage Users' to approve requests.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20 bg-muted/20 border-4 border-black border-dashed rounded-3xl">
               <Building2 size={64} className="mb-4" />
               <h3 className="text-3xl font-black uppercase">Select an Institution</h3>
               <p className="font-bold">Choose an institution on the left to manage departments and hierarchy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
