"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Edit2, ShieldAlert, Users, Building2, Loader2, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SystemClient({ initialUsers, initialInstitutions }: { initialUsers: any[], initialInstitutions: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "institutions">("users");

  const filteredUsers = initialUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInsts = initialInstitutions.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure? This will permanently delete the user and all their data.")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/system/users/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    if (!confirm(`Change user role to ${newRole}?`)) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/system/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromInst = async (id: string) => {
    if (!confirm("Remove this user from their institution?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/system/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ institutionId: null }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInst = async (id: string) => {
    if (!confirm("Are you sure? This will delete the institution and all its departments.")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/system/institutions/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
           <div className="bg-red-500 text-white p-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ShieldAlert size={32} />
           </div>
           System Control
        </h1>
        <p className="text-muted-foreground font-medium text-lg mt-1">Master management of all platform data.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border-4 border-black neo-brutalism">
        <div className="flex gap-2 w-full md:w-auto">
           <Button 
             variant={activeTab === "users" ? "default" : "outline"}
             onClick={() => setActiveTab("users")}
             className={`font-black uppercase border-2 border-black ${activeTab === "users" ? "bg-primary text-white" : "hover:bg-muted"}`}
           >
              <Users size={16} className="mr-2" /> Users
           </Button>
           <Button 
             variant={activeTab === "institutions" ? "default" : "outline"}
             onClick={() => setActiveTab("institutions")}
             className={`font-black uppercase border-2 border-black ${activeTab === "institutions" ? "bg-primary text-white" : "hover:bg-muted"}`}
           >
              <Building2 size={16} className="mr-2" /> Institutions
           </Button>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder={`Search ${activeTab}...`} 
            className="pl-10 border-2 border-black font-bold h-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="neo-brutalism bg-white border-4 border-black overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === "users" ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/50 border-b-4 border-black text-xs font-black uppercase tracking-widest">
                <tr>
                  <th className="p-4">Name & Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Institution</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="font-black text-sm">{user.name}</div>
                      <div className="font-bold text-xs opacity-60">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <select 
                        disabled={loading}
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className="bg-transparent border-2 border-black rounded px-2 py-1 text-xs font-black uppercase cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="parent">Parent</option>
                        <option value="institute_admin">Institute Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      {user.institution ? (
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-bold bg-accent px-2 py-1 rounded border border-black">{user.institution.name}</span>
                           <Button disabled={loading} onClick={() => handleRemoveFromInst(user.id)} size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                             <UserMinus size={14} />
                           </Button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold opacity-30 italic">None</span>
                      )}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <Button disabled={loading} onClick={() => handleDeleteUser(user.id)} variant="destructive" size="sm" className="font-black uppercase text-[10px] h-8 border-2 border-black">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} className="mr-1" />} Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/50 border-b-4 border-black text-xs font-black uppercase tracking-widest">
                <tr>
                  <th className="p-4">Institution Name</th>
                  <th className="p-4">Admin</th>
                  <th className="p-4">Stats</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {filteredInsts.map((inst) => (
                  <tr key={inst.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-black text-sm uppercase">{inst.name}</td>
                    <td className="p-4">
                      {inst.admin ? (
                        <div>
                          <div className="font-black text-xs">{inst.admin.name}</div>
                          <div className="text-[10px] font-bold opacity-60">{inst.admin.email}</div>
                        </div>
                      ) : (
                        <span className="text-xs font-bold opacity-30 italic">No Admin Assigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-[10px] font-bold uppercase space-y-1">
                         <div>{inst._count.departments} Depts</div>
                         <div>{inst._count.members} Members</div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button disabled={loading} onClick={() => handleDeleteInst(inst.id)} variant="destructive" size="sm" className="font-black uppercase text-[10px] h-8 border-2 border-black">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} className="mr-1" />} Delete
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
  );
}
