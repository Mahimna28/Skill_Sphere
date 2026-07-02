"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Search, Loader2, ArrowLeft, Trash2, Lock, UserPlus, CheckCheck, X, Clock, AtSign, Users, Plus, MoreHorizontal } from "lucide-react";

export default function MessagesPage() {
  const [myUsername, setMyUsername] = useState<string|null>(undefined as any);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [chatStatus, setChatStatus] = useState<"allowed"|"request_needed"|"pending"|null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"contacts"|"groups"|"requests">("contacts");
  const [groups, setGroups] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [activeGroup, setActiveGroup] = useState<any>(null);
  const [groupMessages, setGroupMessages] = useState<any[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { checkUsername(); fetchContacts(); fetchRequests(); fetchGroups(); fetchSuggestions(); }, []);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchQuery.trim()) handleSearch();
      else setSearchResults([]);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => { if (otherUser && chatStatus === "allowed") { fetchMessages(); const i = setInterval(fetchMessages, 3000); return () => clearInterval(i); } }, [otherUser, chatStatus]);
  useEffect(() => { if (activeGroup) { fetchGroupMessages(); const i = setInterval(fetchGroupMessages, 3000); return () => clearInterval(i); } }, [activeGroup]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages, groupMessages]);

  const checkUsername = async () => { try { const r = await fetch("/api/username/set"); const d = await r.json(); setMyUsername(d.username); } catch(e) { setMyUsername(null); } };
  const fetchContacts = async () => { try { const r = await fetch("/api/chat/contacts"); const d = await r.json(); if (r.ok) setContacts(d.contacts); } catch(e) {} };
  const fetchRequests = async () => { try { const r = await fetch("/api/chat/request"); const d = await r.json(); if (r.ok) setPendingRequests(d.received); } catch(e) {} };
  const fetchGroups = async () => { try { const r = await fetch("/api/chat/group"); const d = await r.json(); if (r.ok) { setGroups(d.groups); setPendingInvites(d.pendingInvites); } } catch(e) {} };
  const fetchSuggestions = async () => { try { const r = await fetch("/api/users/suggested"); const d = await r.json(); if (r.ok) setSuggestedUsers(d.users || []); } catch(e) {} };
  const fetchMessages = async () => { if (!otherUser) return; try { const r = await fetch(`/api/chat/direct?otherId=${otherUser.id}`); const d = await r.json(); if (r.ok) setMessages(d.messages); } catch(e) {} };
  const fetchGroupMessages = async () => { if (!activeGroup) return; try { const r = await fetch(`/api/chat/group/${activeGroup.id}`); const d = await r.json(); if (r.ok) setGroupMessages(d.messages); } catch(e) {} };

  const handleSetUsername = async (e: React.FormEvent) => {
    e.preventDefault(); setUsernameLoading(true); setUsernameError("");
    try {
      const r = await fetch("/api/username/set", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: newUsername.toLowerCase() }) });
      const d = await r.json();
      if (r.ok) { setMyUsername(d.username); } else { setUsernameError(d.message); }
    } catch(e) { setUsernameError("Failed"); } finally { setUsernameLoading(false); }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setSearching(true); setError("");
    try { const r = await fetch(`/api/users/search?username=${searchQuery}`); const d = await r.json(); if (r.ok) setSearchResults(d.users || []); else setError(d.message); }
    catch(e) { setError("Search failed"); } finally { setSearching(false); }
  };

  const closeDropdown = () => { setShowDropdown(false); };

  const handleUserClick = async (user: any) => {
    closeDropdown();
    setSearchQuery("");
    setSearchResults([]);
    setOtherUser(user); setActiveGroup(null); setMessages([]);
    if (user.isProfilePublic) { setChatStatus("allowed"); } else {
      const r = await fetch(`/api/chat/direct?otherId=${user.id}`); const d = await r.json();
      if (r.ok && d.messages.length > 0) { setChatStatus("allowed"); setMessages(d.messages); } else {
        const rr = await fetch("/api/chat/request"); const rd = await rr.json();
        const sent = rd.sent?.find((x:any) => x.receiverId === user.id || x.receiver?.id === user.id);
        setChatStatus(sent ? "pending" : "request_needed");
      }
    }
  };

  const handleViewProfile = (username: string) => {
    closeDropdown();
    window.location.href = `/dashboard/user/${username}`;
  };

  const openGroupChat = (group: any) => { setActiveGroup(group); setOtherUser(null); setChatStatus(null); setGroupMessages([]); };

  const sendChatRequest = async () => { if (!otherUser) return; setLoading(true); try { const r = await fetch("/api/chat/request", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ receiverId: otherUser.id }) }); const d = await r.json(); if (r.ok || d.status==="pending") setChatStatus("pending"); else if (d.status==="accepted") setChatStatus("allowed"); } catch(e){} finally { setLoading(false); } };
  const respondToRequest = async (id: string, action: string) => { await fetch("/api/chat/request/respond", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ requestId: id, action }) }); fetchRequests(); fetchContacts(); };
  const respondToGroupInvite = async (groupId: string, action: string) => { await fetch("/api/chat/group/respond", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ groupId, action }) }); fetchGroups(); };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); if (!input.trim() || !otherUser) return; const text = input; setInput("");
    try { const r = await fetch("/api/chat/direct", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ receiverId: otherUser.id, text }) }); if (r.ok) fetchMessages(); else { const d = await r.json(); setError(d.message); } } catch(e) {}
  };

  const sendGroupMessage = async (e: React.FormEvent) => {
    e.preventDefault(); if (!input.trim() || !activeGroup) return; const text = input; setInput("");
    try { await fetch(`/api/chat/group/${activeGroup.id}`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ text }) }); fetchGroupMessages(); } catch(e) {}
  };

  const deleteConversation = async () => { if (!otherUser || !confirm("Delete all messages?")) return; setLoading(true); try { const r = await fetch(`/api/chat/direct?otherId=${otherUser.id}`, { method: "DELETE" }); if (r.ok) { setMessages([]); setOtherUser(null); setChatStatus(null); fetchContacts(); } } catch(e){} finally { setLoading(false); } };

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault(); if (!groupName.trim()) return; setLoading(true);
    const usernames = groupMembers.split(",").map((s: string) => s.trim()).filter(Boolean);
    try { const r = await fetch("/api/chat/group", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ name: groupName, memberUsernames: usernames }) }); if (r.ok) { setShowCreateGroup(false); setGroupName(""); setGroupMembers(""); fetchGroups(); } } catch(e){} finally { setLoading(false); }
  };

  const displayList = searchQuery.trim() ? searchResults : suggestedUsers;
  const dropdownLabel = searchQuery.trim() ? "Search Results" : "Suggested Users";

  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return d.toLocaleDateString();
  };

  const formatMessageTime = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // USERNAME SETUP GATE
  if (myUsername === undefined) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-[#C9A96E]" size={32} /></div>;
  if (myUsername === null) {
    return (
      <div className="max-w-md mx-auto mt-20 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white rounded-[16px] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-center">
          <div className="w-16 h-16 mx-auto bg-[rgba(201,169,110,0.1)] rounded-full flex items-center justify-center mb-6">
            <AtSign size={32} className="text-[#C9A96E]" />
          </div>
          <h2 className="font-heading text-[24px] text-[#1E1B2E] mb-2">Choose Username</h2>
          <p className="text-[14px] text-[#8E8E93] mb-6 leading-relaxed">Pick a unique username to start messaging. This is how others will find you.</p>
          <form onSubmit={handleSetUsername} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-[14px] text-[#8E8E93] font-medium">@</span>
              <input 
                className="w-full h-[48px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl pl-9 pr-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" 
                placeholder="your_username" 
                value={newUsername} 
                onChange={e => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} 
                maxLength={20} 
              />
            </div>
            <p className="text-[11px] text-[#8E8E93]">3-20 characters. Lowercase, numbers, underscores only.</p>
            {usernameError && <p className="text-[12px] font-medium text-[#DC2626]">{usernameError}</p>}
            <button type="submit" disabled={usernameLoading || newUsername.length < 3} className="w-full h-[48px] rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium hover:bg-[#2A2640] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              {usernameLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Set Username"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans h-[calc(100vh-64px)] overflow-hidden flex flex-col pt-6 pb-8 px-2 md:px-0">
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Left Panel - Sidebar */}
        <div
          className="w-full md:w-[340px] flex-shrink-0 bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden"
        >
          {/* Search Section */}
          <div className="pt-5 px-5 pb-4">
            <h2 className="text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2.5">
              Find User
            </h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <AtSign className="absolute left-4 top-[13px] h-3.5 w-3.5 text-[#8E8E93]" />
                <input
                  ref={inputRef}
                  placeholder="Search users..."
                  className="w-full h-[40px] bg-white border border-[rgba(30,27,46,0.12)] rounded-full pl-[34px] pr-4 text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                />
              </div>
              <button 
                type="submit" 
                disabled={searching} 
                className="w-[40px] h-[40px] rounded-full bg-[#1E1B2E] text-white flex items-center justify-center shrink-0 hover:bg-[#C9A96E] hover:text-[#1E1B2E] transition-colors disabled:opacity-50"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </form>

            {/* Inline Dropdown */}
            {showDropdown && (
              <div ref={dropdownRef} className="mt-2 bg-white border border-[rgba(30,27,46,0.08)] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] max-h-72 overflow-y-auto relative z-10 custom-scrollbar">
                <div className="flex items-center justify-between px-3 py-2 border-b border-[rgba(30,27,46,0.06)] sticky top-0 bg-white">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#8E8E93]">{dropdownLabel}</p>
                  <button type="button" onMouseDown={e => { e.preventDefault(); closeDropdown(); }} className="text-[#8E8E93] hover:text-[#1E1B2E] transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {searching && <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 animate-spin text-[#C9A96E]" /></div>}
                {!searching && !searchQuery.trim() && suggestedUsers.length === 0 && <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 animate-spin text-[#8E8E93]" /></div>}
                {!searching && searchQuery.trim() && searchResults.length === 0 && <p className="text-[13px] text-center p-4 text-[#8E8E93]">No users found.</p>}

                {!searching && displayList.map((u: any, i: number) => (
                  <div key={u?.id || u?.username || i} className="border-b border-[rgba(30,27,46,0.04)] last:border-0 p-3">
                    <div className="flex items-center gap-3 mb-3">
                      {u?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={u.image} className="w-9 h-9 rounded-full object-cover shrink-0" alt="" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#1E1B2E] text-white flex items-center justify-center font-medium text-[13px] shrink-0">
                          {u?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-[#1E1B2E] truncate leading-tight">{u?.name || "Unknown"}</p>
                        <p className="text-[12px] text-[#8E8E93] truncate mt-0.5">@{u?.username} • {u?.role?.charAt(0).toUpperCase() + u?.role?.slice(1)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); handleViewProfile(u?.username); }}
                        className="flex-1 h-[32px] text-[12px] font-medium border border-[rgba(30,27,46,0.12)] rounded-lg text-[#1E1B2E] hover:bg-[#F5F1EB] transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        type="button"
                        onMouseDown={e => { e.preventDefault(); handleUserClick(u); }}
                        className="flex-1 h-[32px] text-[12px] font-medium rounded-lg bg-[#1E1B2E] text-white hover:bg-[#2A2640] transition-colors flex items-center justify-center gap-1.5"
                      >
                        {u?.isProfilePublic ? <><MessageSquare className="w-3.5 h-3.5" /> Chat</> : <><UserPlus className="w-3.5 h-3.5" /> Connect</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-[rgba(30,27,46,0.06)] mx-5" />

          {/* Tabs */}
          <div className="flex px-5 pt-2">
            {(["contacts","groups","requests"] as const).map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`flex-1 py-3 text-[13px] font-medium capitalize text-center transition-colors relative ${
                  activeTab === tab ? "text-[#1E1B2E]" : "text-[#8E8E93] hover:text-[#1E1B2E]"
                }`}
              >
                {tab}
                {tab === "requests" && (pendingRequests.length + pendingInvites.length > 0) && (
                  <span className="absolute top-2 right-2 bg-[#DC2626] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {pendingRequests.length + pendingInvites.length}
                  </span>
                )}
                {activeTab === tab && (
                  <div layoutId="chat-tab-border" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A96E]" />
                )}
              </button>
            ))}
          </div>

          <div className="h-px bg-[rgba(30,27,46,0.06)]" />

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
            {activeTab === "contacts" && (
              contacts.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-[14px] text-[#8E8E93] italic">No conversations yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {contacts.map((c: any, index: number) => {
                    const isActive = otherUser?.id === c.id;
                    const unreadCount = 0; // Assuming no unread count from API right now, but UI supports it
                    return (
                      <button 
                        key={c.id}
                        onClick={() => handleUserClick(c)} 
                        className={`w-full p-3 text-left rounded-xl transition-all flex items-center gap-3 relative ${
                          isActive ? "bg-[rgba(201,169,110,0.08)]" : "hover:bg-[rgba(30,27,46,0.03)]"
                        }`}
                      >
                        {isActive && <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#C9A96E] rounded-r-full" />}
                        <div className="w-10 h-10 rounded-full bg-[rgba(201,169,110,0.15)] text-[#C9A96E] flex items-center justify-center font-medium text-[14px] shrink-0 overflow-hidden">
                          {c.image ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.image} className="w-full h-full object-cover" alt="" /> : c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex justify-between items-center mb-0.5">
                            <p className="font-medium text-[14px] text-[#1E1B2E] truncate">{c.name}</p>
                            <p className="text-[11px] text-[#8E8E93] shrink-0 ml-2">Active</p>
                          </div>
                          <p className="text-[12px] text-[#8E8E93] truncate">@{c.username || "---"}</p>
                        </div>
                        {unreadCount > 0 && (
                          <div className="absolute right-3 w-5 h-5 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">
                            {unreadCount}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )
            )}

            {activeTab === "groups" && (
              <div className="flex flex-col gap-1">
                <div className="px-2 py-2">
                  <button 
                    onClick={() => setShowCreateGroup(!showCreateGroup)} 
                    className="w-full h-[36px] text-[13px] font-medium border border-[rgba(30,27,46,0.12)] rounded-lg text-[#1E1B2E] hover:bg-[#F5F1EB] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> New Group
                  </button>
                </div>
                
                <AnimatePresence>
                  {showCreateGroup && (
                    <form
                      onSubmit={createGroup} 
                      className="px-2 pb-3 overflow-hidden space-y-2 border-b border-[rgba(30,27,46,0.06)] mb-2"
                    >
                      <input className="w-full h-[36px] bg-white border border-[rgba(30,27,46,0.12)] rounded-lg px-3 text-[13px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E]" placeholder="Group name" value={groupName} onChange={e => setGroupName(e.target.value)} maxLength={30} />
                      <input className="w-full h-[36px] bg-white border border-[rgba(30,27,46,0.12)] rounded-lg px-3 text-[13px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E]" placeholder="@user1, @user2" value={groupMembers} onChange={e => setGroupMembers(e.target.value)} />
                      <button type="submit" disabled={loading || !groupName.trim()} className="w-full h-[36px] bg-[#1E1B2E] text-white rounded-lg text-[13px] font-medium hover:bg-[#2A2640] transition-colors disabled:opacity-50">Create Group</button>
                    </form>
                  )}
                </AnimatePresence>

                {groups.length === 0 && !showCreateGroup ? (
                  <div className="p-6 text-center"><p className="text-[14px] text-[#8E8E93] italic">No groups yet</p></div>
                ) : (
                  groups.map((g: any, index: number) => (
                    <button 
                      key={g.id}
                      onClick={() => openGroupChat(g)} 
                      className={`w-full p-3 text-left rounded-xl transition-all flex items-center gap-3 relative ${
                        activeGroup?.id === g.id ? "bg-[rgba(201,169,110,0.08)]" : "hover:bg-[rgba(30,27,46,0.03)]"
                      }`}
                    >
                      {activeGroup?.id === g.id && <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#C9A96E] rounded-r-full" />}
                      <div className="w-10 h-10 rounded-full bg-[#1E1B2E] text-white flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-medium text-[14px] text-[#1E1B2E] truncate">{g.name}</p>
                        <p className="text-[12px] text-[#8E8E93] truncate mt-0.5">{g.memberCount} members</p>
                      </div>
                    </button>
                  ))
                )}

                {pendingInvites.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[rgba(30,27,46,0.06)] px-2">
                    <p className="text-[11px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-3">Pending Invites</p>
                    {pendingInvites.map((inv: any) => (
                      <div key={inv.id} className="p-3 bg-white border border-[rgba(30,27,46,0.08)] rounded-xl mb-2 shadow-sm space-y-3">
                        <div>
                          <p className="text-[14px] font-medium text-[#1E1B2E]">{inv.group.name}</p>
                          <p className="text-[12px] text-[#8E8E93] mt-0.5">From @{inv.group.createdBy.username}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => respondToGroupInvite(inv.groupId, "accept")} className="flex-1 h-[32px] text-[12px] font-medium bg-[rgba(201,169,110,0.12)] text-[#C9A96E] rounded-lg hover:bg-[rgba(201,169,110,0.2)] transition-colors">Join</button>
                          <button onClick={() => respondToGroupInvite(inv.groupId, "reject")} className="flex-1 h-[32px] text-[12px] font-medium bg-[#F5F1EB] text-[#1E1B2E] rounded-lg hover:bg-[#EAE5DF] transition-colors">Decline</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "requests" && (
              pendingRequests.length === 0 ? (
                <div className="p-6 text-center"><p className="text-[14px] text-[#8E8E93] italic">No pending requests</p></div>
              ) : (
                <div className="flex flex-col gap-2 px-2">
                  {pendingRequests.map((req: any) => (
                    <div key={req.id} className="p-3 bg-white border border-[rgba(30,27,46,0.08)] rounded-xl shadow-sm space-y-3">
                      <div className="flex items-center gap-3">
                        {req.sender.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={req.sender.image} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[rgba(201,169,110,0.15)] text-[#C9A96E] flex items-center justify-center font-medium text-[14px] shrink-0">
                            {req.sender.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[14px] text-[#1E1B2E] truncate">{req.sender.name}</p>
                          <p className="text-[12px] text-[#8E8E93] truncate mt-0.5">{req.sender.role?.charAt(0).toUpperCase() + req.sender.role?.slice(1)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => respondToRequest(req.id, "accept")} className="flex-1 h-[32px] text-[12px] font-medium bg-[rgba(201,169,110,0.12)] text-[#C9A96E] rounded-lg hover:bg-[rgba(201,169,110,0.2)] transition-colors flex items-center justify-center gap-1.5"><CheckCheck className="w-3.5 h-3.5" /> Accept</button>
                        <button onClick={() => respondToRequest(req.id, "reject")} className="flex-1 h-[32px] text-[12px] font-medium bg-[rgba(220,38,38,0.1)] text-[#DC2626] rounded-lg hover:bg-[rgba(220,38,38,0.15)] transition-colors flex items-center justify-center gap-1.5"><X className="w-3.5 h-3.5" /> Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Right Panel - Chat Area */}
        <div
          className="flex-1 bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden min-w-0"
        >
          {!otherUser && !activeGroup ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="w-12 h-12 text-[#1E1B2E] opacity-20 mb-4" />
              <h3 className="font-heading text-[24px] text-[#1E1B2E] mb-1.5">Messages</h3>
              <p className="text-[14px] text-[#8E8E93] max-w-[320px] mx-auto leading-relaxed">
                Search by @username or select a contact to start chatting.
              </p>
              <p className="text-[12px] text-[#8E8E93] mt-4">
                Your username: <span className="text-[#1E1B2E] font-medium">@{myUsername}</span>
              </p>
            </div>
          ) : chatStatus === "request_needed" && otherUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 bg-[rgba(201,169,110,0.1)] rounded-full flex items-center justify-center mb-5">
                <Lock className="w-6 h-6 text-[#C9A96E]" />
              </div>
              <h3 className="font-heading text-[22px] text-[#1E1B2E] mb-2">Private Account</h3>
              <p className="text-[14px] text-[#8E8E93] max-w-[340px] mx-auto leading-relaxed mb-6">
                <span className="font-medium text-[#1E1B2E]">{otherUser.name}</span> has a private profile. Send a request to connect.
              </p>
              <button onClick={sendChatRequest} disabled={loading} className="h-[44px] px-8 rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium hover:bg-[#2A2640] transition-colors disabled:opacity-50 flex items-center justify-center">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />} Send Request
              </button>
            </div>
          ) : chatStatus === "pending" && otherUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 bg-[rgba(201,169,110,0.1)] rounded-full flex items-center justify-center mb-5">
                <Clock className="w-6 h-6 text-[#C9A96E] animate-pulse" />
              </div>
              <h3 className="font-heading text-[22px] text-[#1E1B2E] mb-2">Request Pending</h3>
              <p className="text-[14px] text-[#8E8E93] max-w-[320px] mx-auto leading-relaxed">
                Waiting for <span className="font-medium text-[#1E1B2E]">{otherUser.name}</span> to accept your request.
              </p>
            </div>
          ) : (
            <>
              {/* Active Chat Header */}
              <div className="px-6 py-4 border-b border-[rgba(30,27,46,0.06)] flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  {activeGroup ? (
                    <div className="w-10 h-10 rounded-full bg-[#1E1B2E] text-white flex items-center justify-center text-[14px] shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                  ) : (
                    otherUser?.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={otherUser.image} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[rgba(201,169,110,0.15)] text-[#C9A96E] flex items-center justify-center font-medium text-[14px] shrink-0">
                        {otherUser?.name?.charAt(0).toUpperCase()}
                      </div>
                    )
                  )}
                  <div className="flex flex-col">
                    <span className="font-heading text-[18px] text-[#1E1B2E] leading-tight">
                      {activeGroup ? activeGroup.name : otherUser?.name}
                    </span>
                    <span className="text-[12px] text-[#8E8E93] mt-0.5">
                      {activeGroup ? `${activeGroup.memberCount} members` : "Online"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {otherUser && (
                    <button onClick={deleteConversation} disabled={loading} className="text-[#8E8E93] hover:text-[#DC2626] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F1EB]">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => { setOtherUser(null); setActiveGroup(null); setChatStatus(null); }} className="text-[#8E8E93] hover:text-[#1E1B2E] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F1EB]">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 py-5 bg-[rgba(245,241,235,0.4)] flex flex-col gap-4 custom-scrollbar relative">
                {(activeGroup ? groupMessages : messages).length === 0 ? (
                  <div className="m-auto text-center">
                    <p className="text-[14px] text-[#8E8E93] italic">No messages yet. Say hello! 👋</p>
                  </div>
                ) : (
                  (activeGroup ? groupMessages : messages).map((msg: any, i: number) => {
                    const isMineDM = !activeGroup && msg.receiverId === otherUser?.id;
                    const isMineGroup = activeGroup && msg.sender?.username === myUsername; // Simplified group check
                    const isMine = isMineDM || isMineGroup;

                    return (
                      <div 
                        key={i}
                        className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                      >
                        {activeGroup && !isMine && msg.sender && (
                          <span className="text-[11px] text-[#8E8E93] mb-1 ml-1">{msg.sender.name}</span>
                        )}
                        <div className="flex items-end gap-2 max-w-[70%]">
                          {!isMine && !activeGroup && (
                            otherUser?.image ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={otherUser.image} className="w-7 h-7 rounded-full object-cover shrink-0 mb-1" alt="" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-[rgba(201,169,110,0.15)] text-[#C9A96E] flex items-center justify-center font-medium text-[11px] shrink-0 mb-1">
                                {otherUser?.name?.charAt(0).toUpperCase()}
                              </div>
                            )
                          )}
                          <div
                            className={`px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                              isMine
                                ? "bg-[#1E1B2E] text-white rounded-[16px] rounded-tr-[4px]"
                                : "bg-white text-[#1E1B2E] border border-[rgba(30,27,46,0.06)] rounded-[16px] rounded-tl-[4px]"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                        <span className={`text-[11px] text-[#8E8E93] mt-1.5 ${isMine ? "mr-1" : "ml-1"}`}>
                          {formatMessageTime(msg.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} className="h-1 shrink-0" />
              </div>

              {/* Input Area */}
              <div className="px-6 py-4 pb-5 border-t border-[rgba(30,27,46,0.06)] bg-white shrink-0">
                <form onSubmit={activeGroup ? sendGroupMessage : sendMessage} className="flex items-center gap-3">
                  <input 
                    placeholder="Type a message..." 
                    className="flex-1 h-[44px] bg-white border border-[rgba(30,27,46,0.12)] rounded-full px-5 text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                  />
                  <button 
                    type="submit" 
                    disabled={!input.trim()} 
                    className="w-[44px] h-[44px] rounded-full bg-[#C9A96E] text-[#1E1B2E] flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:bg-[#E5E5E5] disabled:text-[#8E8E93] disabled:hover:scale-100"
                  >
                    <Send className="w-[18px] h-[18px] ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
