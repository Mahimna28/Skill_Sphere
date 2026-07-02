"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Users, Building2, Loader2, UserMinus } from "lucide-react";
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
    <div
      className="flex flex-col bg-[#F5F1EB] min-h-screen w-full font-sans pb-20 overflow-x-hidden min-w-0"
    >
      
      {/* PAGE HEADER */}
      <div className="pt-[8px] px-[32px] mb-[20px]">
        <p className="font-sans text-[14px] text-[#8E8E93]">Master management of all platform data.</p>
      </div>

      {/* TAB NAVIGATION + SEARCH BAR */}
      <div
        className="bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.05)] mx-[32px] mb-[32px] p-[20px_24px] flex flex-col md:flex-row justify-between items-center gap-[16px] w-[calc(100%-64px)]"
      >
        <div className="flex flex-row gap-[8px] w-full md:w-auto">
          <button 
            onClick={() => setActiveTab("users")}
            className={`flex items-center h-[36px] px-[16px] rounded-lg font-sans text-[13px] font-medium transition-colors duration-200 ${
              activeTab === "users" 
                ? "bg-[#1E1B2E] text-white" 
                : "bg-white border border-[rgba(30,27,46,0.12)] text-[#1E1B2E] hover:bg-[rgba(30,27,46,0.03)]"
            }`}
          >
            <Users size={14} className="mr-[6px]" /> Users
          </button>
          <button 
            onClick={() => setActiveTab("institutions")}
            className={`flex items-center h-[36px] px-[16px] rounded-lg font-sans text-[13px] font-medium transition-colors duration-200 ${
              activeTab === "institutions" 
                ? "bg-[#1E1B2E] text-white" 
                : "bg-white border border-[rgba(30,27,46,0.12)] text-[#1E1B2E] hover:bg-[rgba(30,27,46,0.03)]"
            }`}
          >
            <Building2 size={14} className="mr-[6px]" /> Institutions
          </button>
        </div>

        <div className="relative w-full md:w-[280px]">
          <Search size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#8E8E93]" />
          <input 
            type="text"
            placeholder={`Search ${activeTab}...`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] bg-white border border-[rgba(30,27,46,0.12)] rounded-full pl-[40px] pr-[16px] font-sans text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all duration-200"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div
        className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] mx-[32px] mb-[32px] overflow-hidden w-[calc(100%-64px)] flex flex-col"
      >
        <div className="w-full overflow-x-auto min-w-0">
          {activeTab === "users" ? (
            <table className="w-full text-left table-fixed border-collapse min-w-0">
              <colgroup>
                <col className="w-[35%]" />
                <col className="w-[20%]" />
                <col className="w-[25%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead className="bg-[rgba(245,241,235,0.6)]">
                <tr>
                  <th className="py-[16px] px-[24px] font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] overflow-hidden text-ellipsis">Name & Email</th>
                  <th className="py-[16px] px-[24px] font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] overflow-hidden text-ellipsis">Role</th>
                  <th className="py-[16px] px-[24px] font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] overflow-hidden text-ellipsis">Institution</th>
                  <th className="py-[16px] px-[24px] font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] text-right overflow-hidden text-ellipsis">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user, i) => (
                    <tr 
                      key={user.id}
                      className="border-b border-[rgba(30,27,46,0.04)] hover:bg-[rgba(245,241,235,0.4)] transition-colors duration-150 last:border-b-0"
                    >
                      <td className="py-[16px] px-[24px] overflow-hidden text-ellipsis">
                        <div className="font-sans text-[15px] font-medium text-[#1E1B2E] truncate">{user.name}</div>
                        <div className="font-sans text-[12px] text-[#8E8E93] mt-[2px] truncate">{user.email}</div>
                      </td>
                      <td className="py-[16px] px-[24px] overflow-hidden text-ellipsis">
                        <select 
                          disabled={loading}
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          className="bg-white border border-[rgba(30,27,46,0.12)] rounded-lg h-[36px] px-[12px] font-sans text-[13px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] cursor-pointer transition-colors"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="parent">Parent</option>
                          <option value="institute_admin">Institute Admin</option>
                          <option value="superadmin">Superadmin</option>
                        </select>
                      </td>
                      <td className="py-[16px] px-[24px] overflow-hidden text-ellipsis">
                        {user.institution ? (
                          <div className="flex items-center gap-[8px]">
                             <span className="inline-flex items-center bg-[rgba(201,169,110,0.1)] text-[#C9A96E] px-[10px] py-[4px] rounded-full font-sans text-[12px]">
                                <Building2 size={12} className="mr-[4px]" /> {user.institution.name}
                             </span>
                             <button 
                               disabled={loading} 
                               onClick={() => handleRemoveFromInst(user.id)} 
                               className="text-[#8E8E93] hover:text-[#DC2626] transition-colors p-1"
                               title="Remove from Institution"
                             >
                               <UserMinus size={14} />
                             </button>
                          </div>
                        ) : (
                          <span className="font-sans text-[13px] text-[#8E8E93] italic">None</span>
                        )}
                      </td>
                      <td className="py-[16px] px-[24px] text-right overflow-hidden text-ellipsis">
                        <div className="flex justify-end">
                          <button 
                            disabled={loading} 
                            onClick={() => handleDeleteUser(user.id)} 
                            className="flex items-center gap-[6px] text-[#DC2626] font-sans text-[13px] font-medium hover:underline disabled:opacity-50"
                          >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left table-fixed border-collapse min-w-0">
              <colgroup>
                <col className="w-[35%]" />
                <col className="w-[25%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead className="bg-[rgba(245,241,235,0.6)]">
                <tr>
                  <th className="py-[16px] px-[24px] font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] overflow-hidden text-ellipsis">Institution Name</th>
                  <th className="py-[16px] px-[24px] font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] overflow-hidden text-ellipsis">Type / Admin</th>
                  <th className="py-[16px] px-[24px] font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] overflow-hidden text-ellipsis">Members</th>
                  <th className="py-[16px] px-[24px] font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] text-right overflow-hidden text-ellipsis">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredInsts.map((inst, i) => (
                    <tr 
                      key={inst.id}
                      className="border-b border-[rgba(30,27,46,0.04)] hover:bg-[rgba(245,241,235,0.4)] transition-colors duration-150 last:border-b-0"
                    >
                      <td className="py-[16px] px-[24px] overflow-hidden text-ellipsis">
                         <span className="inline-flex items-center bg-[rgba(201,169,110,0.1)] text-[#C9A96E] px-[12px] py-[4px] rounded-full font-sans text-[12px] font-medium tracking-wide truncate">
                            <Building2 size={12} className="mr-[6px] shrink-0" /> <span className="truncate">{inst.name}</span>
                         </span>
                      </td>
                      <td className="py-[16px] px-[24px] overflow-hidden text-ellipsis">
                        {inst.admin ? (
                          <div className="overflow-hidden">
                            <div className="font-sans text-[14px] font-medium text-[#1E1B2E] truncate">{inst.admin.name}</div>
                            <div className="font-sans text-[12px] text-[#8E8E93] mt-[2px] truncate">{inst.admin.email}</div>
                          </div>
                        ) : (
                          <span className="font-sans text-[13px] text-[#8E8E93] italic">No Admin Assigned</span>
                        )}
                      </td>
                      <td className="py-[16px] px-[24px] overflow-hidden text-ellipsis">
                        <div className="font-sans text-[13px] text-[#1E1B2E] space-y-[4px]">
                           <div>{inst._count.departments} Depts</div>
                           <div>{inst._count.members} Members</div>
                        </div>
                      </td>
                      <td className="py-[16px] px-[24px] text-right overflow-hidden text-ellipsis">
                        <div className="flex justify-end">
                          <button 
                            disabled={loading} 
                            onClick={() => handleDeleteInst(inst.id)} 
                            className="flex items-center justify-center w-[36px] h-[36px] rounded-full border border-[rgba(220,38,38,0.2)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.08)] transition-colors disabled:opacity-50"
                          >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
