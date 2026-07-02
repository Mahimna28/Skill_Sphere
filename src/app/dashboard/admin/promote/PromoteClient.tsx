"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Shield, Users, ArrowUp, ArrowDown, Loader2, Search, MessageSquare, CheckCircle, XCircle } from "lucide-react";

export default function PromoteClient({ users, initialRequests }: { users: any[], initialRequests: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState(initialRequests);

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

  const handleRequestAction = async (reqId: string, userId: string, action: "approved" | "rejected") => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    setLoading(reqId);
    try {
      const res = await fetch(`/api/admin/promote/requests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reqId, userId, action }),
      });
      if (res.ok) {
        setRequests((prev: any[]) => prev.filter(r => r.id !== reqId));
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
  const teachers = users.filter(u => u.role === "teacher" && (
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      className="flex flex-col bg-[#F5F1EB] min-h-screen w-full font-sans pb-20 overflow-x-hidden min-w-0"
    >
      {/* PAGE HEADER */}
      <div className="pt-[8px] px-[32px] mb-[24px]">
        <p className="font-sans text-[14px] text-[#8E8E93]">Exclusive Super Admin control — only you can manage admin roles.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-[24px] px-[32px] mb-[32px]">
        {/* LEFT COLUMN: INSTITUTE ADMINS */}
        <div
          className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden flex-1 flex flex-col"
        >
          <div className="p-[20px_24px]">
            <div className="flex flex-row items-center gap-[12px]">
              <Shield size={18} className="text-[#C9A96E]" />
              <h3 className="font-heading text-[18px] text-[#1E1B2E] m-0 leading-none">Institute Admins</h3>
              <span className="bg-[rgba(30,27,46,0.06)] text-[#1E1B2E] font-sans text-[12px] px-[10px] py-[4px] rounded-full">
                ({admins.length})
              </span>
            </div>
            <p className="font-sans text-[13px] text-[#8E8E93] mt-[4px]">These users manage their respective institutions.</p>
          </div>
          <div className="h-[1px] w-full bg-[rgba(30,27,46,0.06)]" />
          
          <div className="px-[24px] flex-1">
            {admins.length === 0 ? (
              <div className="py-[40px] text-center font-sans text-[14px] text-[#8E8E93] italic">
                No institute admins yet.
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-[rgba(30,27,46,0.04)]">
                <AnimatePresence>
                  {admins.map((u, i) => (
                    <div 
                      key={u.id}
                      className="py-[16px] flex flex-row items-center gap-[12px]"
                    >
                      <div className="w-[36px] h-[36px] rounded-full bg-[rgba(30,27,46,0.04)] flex items-center justify-center font-sans text-[14px] font-medium text-[#1E1B2E] shrink-0">
                        {getInitials(u.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[14px] font-medium text-[#1E1B2E] truncate">{u.name}</p>
                        <p className="font-sans text-[12px] text-[#8E8E93] truncate">{u.email}</p>
                        {u.institution && (
                          <div className="mt-[4px]">
                            <span className="inline-flex items-center bg-[rgba(201,169,110,0.1)] text-[#C9A96E] font-sans text-[11px] px-[10px] py-[2px] rounded-full truncate max-w-full">
                              {u.institution.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleToggle(u.id, u.role)}
                        disabled={loading === u.id}
                        className="flex items-center h-[32px] px-[14px] rounded-lg text-[#DC2626] font-sans text-[13px] font-medium hover:underline disabled:opacity-50 shrink-0"
                      >
                        {loading === u.id ? <Loader2 className="animate-spin" size={14} /> : <><ArrowDown size={14} className="mr-[6px]" /> Demote</>}
                      </button>
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ELIGIBLE TEACHERS */}
        <div
          className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden flex-1 flex flex-col"
        >
          <div className="p-[20px_24px]">
            <div className="flex flex-row items-center gap-[12px]">
              <Users size={18} className="text-[#C9A96E]" />
              <h3 className="font-heading text-[18px] text-[#1E1B2E] m-0 leading-none">Eligible Teachers</h3>
              <span className="bg-[rgba(30,27,46,0.06)] text-[#1E1B2E] font-sans text-[12px] px-[10px] py-[4px] rounded-full">
                ({teachers.length})
              </span>
            </div>
            <p className="font-sans text-[13px] text-[#8E8E93] mt-[4px]">Search and promote a teacher to give them institute admin powers.</p>
          </div>
          <div className="px-[24px] pb-[16px]">
            <div className="relative w-full">
              <Search size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input 
                type="text"
                placeholder="Search teacher name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[40px] bg-white border border-[rgba(30,27,46,0.12)] rounded-full pl-[40px] pr-[16px] font-sans text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] transition-colors"
              />
            </div>
          </div>
          <div className="h-[1px] w-full bg-[rgba(30,27,46,0.06)]" />
          
          <div className="px-[24px] flex-1">
            {teachers.length === 0 ? (
              <div className="py-[40px] text-center font-sans text-[14px] text-[#8E8E93] italic">
                No teachers found.
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-[rgba(30,27,46,0.04)]">
                <AnimatePresence>
                  {teachers.map((u, i) => (
                    <div 
                      key={u.id}
                      className="py-[16px] flex flex-row justify-between items-center"
                    >
                      <div className="flex-1 min-w-0 pr-[16px]">
                        <p className="font-sans text-[14px] font-medium text-[#1E1B2E] truncate">{u.name}</p>
                        <p className="font-sans text-[12px] text-[#8E8E93] mt-[2px] truncate">{u.email}</p>
                      </div>
                      <button
                        onClick={() => handleToggle(u.id, u.role)}
                        disabled={loading === u.id}
                        className="flex items-center h-[32px] px-[14px] rounded-lg bg-[#C9A96E] text-white font-sans text-[13px] font-medium hover:bg-[#B8956A] hover:scale-[1.02] transition-all disabled:opacity-50 shrink-0"
                      >
                        {loading === u.id ? <Loader2 className="animate-spin" size={14} /> : <><ArrowUp size={14} className="mr-[6px]" /> Promote</>}
                      </button>
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FULL WIDTH: PROMOTION REQUESTS */}
      <div
        className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden mx-[32px] mb-[32px] flex flex-col"
      >
        <div className="p-[20px_24px]">
          <div className="flex flex-row items-center gap-[12px]">
            <MessageSquare size={18} className="text-[#C9A96E]" />
            <h3 className="font-heading text-[18px] text-[#1E1B2E] m-0 leading-none">Promotion Requests</h3>
            <span className="bg-[rgba(30,27,46,0.06)] text-[#1E1B2E] font-sans text-[12px] px-[10px] py-[4px] rounded-full">
              ({requests.length})
            </span>
          </div>
          <p className="font-sans text-[13px] text-[#8E8E93] mt-[4px]">Teachers requesting to become Institute Admins.</p>
        </div>
        <div className="h-[1px] w-full bg-[rgba(30,27,46,0.06)]" />
        
        <div className="px-[24px]">
          {requests.length === 0 ? (
            <div className="py-[40px] text-center font-sans text-[14px] text-[#8E8E93] italic">
              No pending promotion requests.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[rgba(30,27,46,0.04)]">
              <AnimatePresence>
                {requests.map((r: any, i) => (
                  <div 
                    key={r.id}
                    className="py-[16px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[16px]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[14px] font-medium text-[#1E1B2E] truncate">{r.user.name}</p>
                      <p className="font-sans text-[12px] text-[#8E8E93] mt-[2px] truncate mb-[8px]">{r.user.email}</p>
                      <div className="bg-[rgba(245,241,235,0.6)] border-l-2 border-[#C9A96E] px-[12px] py-[8px] rounded-r-lg font-sans text-[13px] text-[#1E1B2E] italic break-words">
                        "{r.reason}"
                      </div>
                    </div>
                    <div className="flex items-center gap-[12px] shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleRequestAction(r.id, r.userId, "rejected")}
                        disabled={loading === r.id}
                        className="flex items-center h-[32px] px-[14px] text-[#DC2626] font-sans text-[13px] font-medium hover:underline transition-all disabled:opacity-50"
                      >
                        {loading === r.id ? <Loader2 className="animate-spin" size={14} /> : <><XCircle size={14} className="mr-[6px]" /> Reject</>}
                      </button>
                      <button
                        onClick={() => handleRequestAction(r.id, r.userId, "approved")}
                        disabled={loading === r.id}
                        className="flex items-center h-[32px] px-[14px] rounded-lg bg-[#1E1B2E] text-white font-sans text-[13px] font-medium hover:bg-[#2A263F] hover:scale-[1.02] transition-all disabled:opacity-50"
                      >
                        {loading === r.id ? <Loader2 className="animate-spin" size={14} /> : <><CheckCircle size={14} className="mr-[6px]" /> Approve</>}
                      </button>
                    </div>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
