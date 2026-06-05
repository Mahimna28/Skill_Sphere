"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield, Users, ArrowUp, ArrowDown, Loader2, Crown } from "lucide-react";

export default function PromoteClient({ users }: { users: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "institute_admin" ? "teacher" : "institute_admin";
    const action = newRole === "institute_admin" ? "PROMOTE" : "DEMOTE";
    if (!confirm(`${action} this user to ${newRole}?`)) return;

    setLoading(userId);
    try {
      const res = await fetch("/api/admin/promote", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.message);
      }
    } finally {
      setLoading(null);
    }
  };

  const admins = users.filter(u => u.role === "institute_admin");
  const teachers = users.filter(u => u.role === "teacher");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
           <div className="bg-red-500 text-white p-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Crown size={32} />
           </div>
           Promote Institute Admins
        </h1>
        <p className="text-muted-foreground font-medium text-lg mt-1">
          Exclusive Super Admin control — only you can manage admin roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Institute Admins */}
        <div className="neo-brutalism bg-white border-4 border-black overflow-hidden">
          <div className="p-6 bg-[#F5C84C] border-b-4 border-black">
            <h3 className="text-xl font-black uppercase flex items-center gap-2">
              <Shield size={24} /> Institute Admins ({admins.length})
            </h3>
            <p className="text-xs font-bold mt-1 opacity-70">These users manage their respective institutions.</p>
          </div>
          <div className="p-0">
            {admins.length === 0 ? (
              <div className="p-12 text-center opacity-30 italic font-bold">No institute admins yet.</div>
            ) : (
              <div className="divide-y-2 divide-black">
                {admins.map((u) => (
                  <div key={u.id} className="p-5 flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div>
                      <p className="font-black uppercase">{u.name}</p>
                      <p className="text-xs font-bold opacity-60">{u.email}</p>
                      {u.institution && (
                        <p className="text-[10px] font-black mt-1 text-primary uppercase">{u.institution.name}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleToggle(u.id, u.role)}
                      disabled={loading === u.id}
                      className="bg-red-100 text-red-700 border-2 border-red-600 font-black text-xs h-9 px-3 hover:bg-red-200"
                    >
                      {loading === u.id ? <Loader2 className="animate-spin" size={14} /> : <><ArrowDown size={14} className="mr-1" /> Demote</>}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Eligible Teachers */}
        <div className="neo-brutalism bg-white border-4 border-black overflow-hidden">
          <div className="p-6 bg-muted border-b-4 border-black">
            <h3 className="text-xl font-black uppercase flex items-center gap-2">
              <Users size={24} /> Eligible Teachers ({teachers.length})
            </h3>
            <p className="text-xs font-bold mt-1 opacity-70">Promote a teacher to give them institute admin powers.</p>
          </div>
          <div className="p-0">
            {teachers.length === 0 ? (
              <div className="p-12 text-center opacity-30 italic font-bold">No teachers available to promote.</div>
            ) : (
              <div className="divide-y-2 divide-black">
                {teachers.map((u) => (
                  <div key={u.id} className="p-5 flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div>
                      <p className="font-black uppercase">{u.name}</p>
                      <p className="text-xs font-bold opacity-60">{u.email}</p>
                    </div>
                    <Button
                      onClick={() => handleToggle(u.id, u.role)}
                      disabled={loading === u.id}
                      className="bg-[#34D399] text-black border-2 border-black font-black text-xs h-9 px-3"
                    >
                      {loading === u.id ? <Loader2 className="animate-spin" size={14} /> : <><ArrowUp size={14} className="mr-1" /> Promote</>}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
