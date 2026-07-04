"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { containerVariant, listItemVariant, messageVariant, composerVariant } from "./motionVariants";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Search, Loader2, ArrowLeft, Trash2, Lock, UserPlus, CheckCheck, X, Clock, AtSign, Users, Plus, Sparkles, UserX } from "lucide-react";

export default function MessagesPage() {
  // Existing data hooks, socket subscriptions, and state preserved exactly
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
  
  const prefersReduced = useReducedMotion();
  const threadRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
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

  // Track whether user is at bottom of thread
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    function onScroll() {
      const threshold = 80;
      const atBottom = el!.scrollHeight - el!.scrollTop - el!.clientHeight < threshold;
      isAtBottomRef.current = atBottom;
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [otherUser, activeGroup]);

  // When new messages arrive, append and scroll only if user is at bottom
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    if (isAtBottomRef.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: prefersReduced ? "auto" : "smooth" });
    }
  }, [messages.length, groupMessages.length, prefersReduced]);

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

  // USERNAME SETUP GATE (Preserved exactly with enhanced liquid glass styling)
  if (myUsername === undefined) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-[#C9A96E]" size={36} />
      </div>
    );
  }

  if (myUsername === null) {
    return (
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, scale: 0.95, y: 20 }}
        animate={prefersReduced ? false : { opacity: 1, scale: 1, y: 0 }}
        className="max-w-md mx-auto mt-20 p-6 font-sans"
      >
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 mx-auto bg-[#1E1B2E] text-[#C9A96E] rounded-2xl flex items-center justify-center mb-6 shadow-md">
            <AtSign size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1B2E] mb-2" style={{ fontFamily: "var(--font-heading, serif)" }}>
            Choose Username
          </h2>
          <p className="font-medium text-[#8E8E93] text-xs mb-6 leading-relaxed">
            Pick a unique username to start messaging. This is how peers and instructors will connect with you.
          </p>
          <form onSubmit={handleSetUsername} className="space-y-4">
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-[#8E8E93] font-bold">@</span>
              <Input
                className="pl-9 h-11 rounded-xl bg-white/90 border border-[#1E1B2E]/20 text-[#1E1B2E] font-bold text-sm focus-visible:ring-2 focus-visible:ring-yellow-300"
                placeholder="your_username"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                maxLength={20}
              />
            </div>
            <p className="text-[10px] font-medium text-[#8E8E93]">3-20 characters. Lowercase, numbers, underscores only.</p>
            {usernameError && <p className="text-xs font-bold text-[#EF4444]">{usernameError}</p>}
            <motion.button
              type="submit"
              disabled={usernameLoading || newUsername.length < 3}
              whileHover={prefersReduced ? {} : { scale: 1.02 }}
              whileTap={prefersReduced ? {} : { scale: 0.98 }}
              className="w-full h-11 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm flex items-center justify-center shadow-[0_4px_14px_rgba(201,169,110,0.3)] focus-visible:ring-2 focus-visible:ring-yellow-300 cursor-pointer disabled:opacity-50"
            >
              {usernameLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Set Username"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.main
      className="p-6 md:p-8 w-full max-w-screen-xl mx-auto h-[calc(100vh-100px)] flex flex-col overflow-hidden font-sans"
      initial={prefersReduced ? false : "hidden"}
      animate={prefersReduced ? false : "show"}
      variants={containerVariant}
      aria-labelledby="messages-heading"
    >
      <header className="mb-6 shrink-0">
        <h1 id="messages-heading" className="text-[28px] sm:text-3xl font-bold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>
          Messages
        </h1>
        <p className="text-sm font-medium text-[#8E8E93] mt-1">
          Direct messaging and collaborative study groups
        </p>
      </header>

      <section className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-md border border-white/80 p-4 md:p-6 flex-1 flex flex-col md:flex-row gap-6 overflow-hidden min-h-0">
        {/* Left Column: Conversation List */}
        <aside className="w-full md:w-80 shrink-0 flex flex-col min-h-0 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 overflow-hidden shadow-2xs">
          {/* Search Bar */}
          <div className="p-4 border-b border-[#1E1B2E]/10 shrink-0">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-[#8E8E93]" />
                <Input
                  ref={inputRef}
                  placeholder="Find user (@)..."
                  className="pl-9 h-10 rounded-xl bg-white/90 border border-[#1E1B2E]/15 text-xs font-medium text-[#1E1B2E] focus-visible:ring-2 focus-visible:ring-yellow-300"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                />
              </div>
              <motion.button
                type="submit"
                disabled={searching}
                whileTap={prefersReduced ? {} : { scale: 0.95 }}
                className="h-10 w-10 rounded-xl bg-[#1E1B2E] text-[#C9A96E] flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-yellow-300 cursor-pointer"
              >
                {searching ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
              </motion.button>
            </form>

            {/* Inline Dropdown */}
            {showDropdown && (
              <div ref={dropdownRef} className="mt-2 bg-white/95 backdrop-blur-xl border border-white/80 rounded-xl shadow-lg max-h-64 overflow-y-auto z-20">
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E1B2E]/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">{dropdownLabel}</span>
                  <button type="button" onMouseDown={e => { e.preventDefault(); closeDropdown(); }} className="text-[#8E8E93] hover:text-[#1E1B2E]">
                    <X size={14} />
                  </button>
                </div>

                {searching && <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[#C9A96E]" size={18} /></div>}
                {!searching && !searchQuery.trim() && suggestedUsers.length === 0 && <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[#8E8E93]" size={16} /></div>}
                {!searching && searchQuery.trim() && searchResults.length === 0 && <p className="text-xs font-medium text-center p-4 text-[#8E8E93]">No users found.</p>}

                {!searching && displayList.map((u: any, i: number) => (
                  <div key={u?.id || u?.username || i} className="border-b border-[#1E1B2E]/5 last:border-0 p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#1E1B2E] text-[#C9A96E] flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                        {u?.image ? <img src={u.image} className="w-full h-full object-cover" alt="" /> : (u?.name?.charAt(0) || "?")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-[#1E1B2E] truncate">{u?.name || "Unknown"}</p>
                        <p className="text-[10px] font-medium text-[#8E8E93] truncate">@{u?.username} · {u?.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onMouseDown={e => { e.preventDefault(); handleViewProfile(u?.username); }} className="flex-1 h-7 text-[10px] font-bold border border-[#1E1B2E]/15 rounded-lg bg-white/80 hover:bg-white text-[#1E1B2E] cursor-pointer">
                        Profile
                      </button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); handleUserClick(u); }} className="flex-1 h-7 text-[10px] font-bold rounded-lg bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] flex items-center justify-center gap-1 cursor-pointer shadow-2xs">
                        {u?.isProfilePublic ? <><MessageSquare size={11} /> Chat</> : <><UserPlus size={11} /> Connect</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#1E1B2E]/10 shrink-0 bg-white/40">
            {(["contacts", "groups", "requests"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider text-center transition-all relative focus-visible:ring-2 focus-visible:ring-yellow-300 cursor-pointer ${activeTab === tab ? "text-[#1E1B2E] border-b-2 border-[#C9A96E] bg-white/60" : "text-[#8E8E93] hover:text-[#1E1B2E]"}`}
              >
                {tab}
                {tab === "requests" && (pendingRequests.length + pendingInvites.length > 0) && (
                  <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#EF4444] text-white">
                    {pendingRequests.length + pendingInvites.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content List (Internal Scroll) */}
          <div className="flex-1 overflow-y-auto min-h-0 min-w-0 pr-1 space-y-2 p-3 scrollbar-thin" style={{ WebkitOverflowScrolling: "touch" }} role="list" aria-label="Conversation list">
            <AnimatePresence initial={false}>
              {activeTab === "contacts" && (
                contacts.length === 0 ? (
                  <div className="p-8 text-center text-[#8E8E93] text-xs font-medium">No active conversations yet</div>
                ) : (
                  contacts.map((c: any, idx: number) => (
                    <motion.button
                      key={c.id}
                      custom={idx}
                      initial={prefersReduced ? { opacity: 1, x: 0 } : "hidden"}
                      animate={prefersReduced ? { opacity: 1, x: 0 } : "show"}
                      exit={{ opacity: 0, x: 20 }}
                      variants={listItemVariant}
                      whileHover={prefersReduced ? {} : { scale: 1.01 }}
                      onClick={() => handleUserClick(c)}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 cursor-pointer ${otherUser?.id === c.id ? "bg-[#C9A96E]/15 border border-[#C9A96E]/40 gold-glow ring-1 ring-[#C9A96E]" : "bg-white/50 hover:bg-white/80 border border-transparent"}`}
                      aria-current={otherUser?.id === c.id}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#1E1B2E] text-[#C9A96E] flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden shadow-2xs">
                        {c.image ? <img src={c.image} className="w-full h-full object-cover" alt="" /> : c.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-[#1E1B2E] truncate">{c.name}</p>
                        <p className="text-[10px] font-medium text-[#8E8E93] truncate">@{c.username || "user"}</p>
                      </div>
                    </motion.button>
                  ))
                )
              )}

              {activeTab === "groups" && (
                <div className="space-y-2">
                  <button onClick={() => setShowCreateGroup(!showCreateGroup)} className="w-full h-9 rounded-xl bg-[#1E1B2E] text-[#C9A96E] text-xs font-bold flex items-center justify-center gap-1 shadow-2xs focus-visible:ring-2 focus-visible:ring-yellow-300 cursor-pointer">
                    <Plus size={14} /> New Group
                  </button>

                  {showCreateGroup && (
                    <form onSubmit={createGroup} className="p-3 bg-white/80 rounded-xl border border-[#1E1B2E]/10 space-y-2">
                      <Input className="h-8 rounded-lg text-xs" placeholder="Group title" value={groupName} onChange={e => setGroupName(e.target.value)} maxLength={30} />
                      <Input className="h-8 rounded-lg text-xs" placeholder="Members: @alice, @bob" value={groupMembers} onChange={e => setGroupMembers(e.target.value)} />
                      <button type="submit" disabled={loading || !groupName.trim()} className="w-full h-8 rounded-lg bg-[#C9A96E] text-[#1E1B2E] text-xs font-bold cursor-pointer">Create</button>
                    </form>
                  )}

                  {groups.map((g: any, idx: number) => (
                    <motion.button
                      key={g.id}
                      custom={idx}
                      initial={prefersReduced ? { opacity: 1, x: 0 } : "hidden"}
                      animate={prefersReduced ? { opacity: 1, x: 0 } : "show"}
                      variants={listItemVariant}
                      whileHover={prefersReduced ? {} : { scale: 1.01 }}
                      onClick={() => openGroupChat(g)}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${activeGroup?.id === g.id ? "bg-[#C9A96E]/15 border border-[#C9A96E]/40 gold-glow ring-1 ring-[#C9A96E]" : "bg-white/50 hover:bg-white/80"}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#1E1B2E] text-[#C9A96E] flex items-center justify-center text-xs font-bold shrink-0">
                        <Users size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-[#1E1B2E] truncate">{g.name}</p>
                        <p className="text-[10px] font-medium text-[#8E8E93]">{g.memberCount} members</p>
                      </div>
                    </motion.button>
                  ))}

                  {pendingInvites.map((inv: any) => (
                    <div key={inv.id} className="p-3 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/30 space-y-2">
                      <p className="text-xs font-bold text-[#1E1B2E]">{inv.group.name}</p>
                      <p className="text-[10px] text-[#8E8E93]">Invite from @{inv.group.createdBy.username}</p>
                      <div className="flex gap-2">
                        <button onClick={() => respondToGroupInvite(inv.groupId, "accept")} className="flex-1 h-7 rounded-lg bg-[#22C55E] text-white text-[10px] font-bold cursor-pointer">Join</button>
                        <button onClick={() => respondToGroupInvite(inv.groupId, "reject")} className="flex-1 h-7 rounded-lg bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-bold cursor-pointer">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "requests" && (
                pendingRequests.length === 0 ? (
                  <div className="p-8 text-center text-[#8E8E93] text-xs font-medium">No pending requests</div>
                ) : (
                  pendingRequests.map((req: any) => (
                    <div key={req.id} className="p-3.5 rounded-xl bg-white/70 border border-white/80 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1E1B2E] text-[#C9A96E] flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                          {req.sender.image ? <img src={req.sender.image} className="w-full h-full object-cover" alt="" /> : req.sender.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-[#1E1B2E] truncate">{req.sender.name}</p>
                          <p className="text-[10px] text-[#8E8E93] capitalize">{req.sender.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => respondToRequest(req.id, "accept")} className="flex-1 h-8 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-2xs">
                          <CheckCheck size={14} /> Accept
                        </button>
                        <button onClick={() => respondToRequest(req.id, "reject")} className="flex-1 h-8 rounded-lg bg-transparent hover:bg-[#EF4444]/10 text-[#8E8E93] hover:text-[#EF4444] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer">
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Right Column: Conversation Thread */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 overflow-hidden shadow-2xs">
          {!otherUser && !activeGroup ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#8E8E93]">
              <div className="w-16 h-16 rounded-2xl bg-[#1E1B2E]/5 border border-[#1E1B2E]/10 flex items-center justify-center mb-4 text-[#C9A96E]">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>Select a Conversation</h3>
              <p className="text-xs font-medium max-w-xs mt-1">Pick a peer, instructor, or study group from the list on the left to start collaborating.</p>
            </div>
          ) : chatStatus === "request_needed" && otherUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/15 border border-[#C9A96E]/40 flex items-center justify-center mb-4 text-[#C9A96E]">
                <Lock size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B2E] mb-1">Private Account</h3>
              <p className="text-xs font-medium text-[#8E8E93] max-w-sm mb-6"><strong>{otherUser.name}</strong> requires a connection request before direct messaging.</p>
              <motion.button onClick={sendChatRequest} disabled={loading} whileTap={prefersReduced ? {} : { scale: 0.97 }} className="h-11 px-6 rounded-xl bg-[#1E1B2E] text-[#C9A96E] font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer">
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <UserPlus className="w-4 h-4" />} Send Request
              </motion.button>
            </div>
          ) : chatStatus === "pending" && otherUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/15 border border-[#C9A96E]/40 flex items-center justify-center mb-4 text-[#C9A96E]">
                <Clock size={32} className="animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-[#1E1B2E] mb-1">Request Pending</h3>
              <p className="text-xs font-medium text-[#8E8E93] max-w-sm">Waiting for <strong>{otherUser.name}</strong> to accept your connection request.</p>
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-[#1E1B2E]/10 bg-white/60 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  {activeGroup ? (
                    <div className="w-10 h-10 rounded-xl bg-[#1E1B2E] text-[#C9A96E] flex items-center justify-center text-sm font-bold shadow-2xs"><Users size={18} /></div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1E1B2E] text-[#C9A96E] flex items-center justify-center text-sm font-bold overflow-hidden shadow-2xs">
                      {otherUser?.image ? <img src={otherUser.image} className="w-full h-full object-cover" alt="" /> : otherUser?.name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-sm text-[#1E1B2E]">{activeGroup ? activeGroup.name : otherUser?.name}</h3>
                    <p className="text-[11px] font-medium text-[#8E8E93]">
                      {activeGroup ? `${activeGroup.memberCount} group participants` : `@${otherUser?.username || "user"} · Connected`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {otherUser && (
                    <button type="button" onClick={deleteConversation} disabled={loading} className="h-9 w-9 rounded-xl bg-transparent hover:bg-[#EF4444]/10 text-[#8E8E93] hover:text-[#EF4444] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-yellow-300 cursor-pointer" aria-label="Clear chat history">
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button type="button" onClick={() => { setOtherUser(null); setActiveGroup(null); setChatStatus(null); }} className="h-9 w-9 rounded-xl bg-transparent hover:bg-[#1E1B2E]/5 text-[#1E1B2E] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-yellow-300 cursor-pointer" aria-label="Close conversation">
                    <ArrowLeft size={18} />
                  </button>
                </div>
              </div>

              {/* Message Thread Area */}
              <div ref={threadRef} className="flex-1 overflow-y-auto min-h-0 min-w-0 p-4 md:p-6 space-y-3.5 scrollbar-thin" aria-live="polite" role="log" style={{ WebkitOverflowScrolling: "touch" }}>
                {(activeGroup ? groupMessages : messages).length === 0 ? (
                  <div className="text-center py-16 text-[#8E8E93] space-y-1">
                    <Sparkles className="w-6 h-6 text-[#C9A96E] mx-auto opacity-60 mb-2" />
                    <p className="text-xs font-bold text-[#1E1B2E]">Start the conversation!</p>
                    <p className="text-[11px] font-medium">Send a friendly greeting or study question below.</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {(activeGroup ? groupMessages : messages).map((msg: any, i: number) => {
                      const isMineDM = !activeGroup && msg.receiverId === otherUser?.id;
                      if (activeGroup) {
                        return (
                          <motion.div key={i || msg.id} initial={prefersReduced ? { opacity: 1, y: 0 } : "hidden"} animate={prefersReduced ? { opacity: 1, y: 0 } : "show"} variants={messageVariant} className="flex flex-col items-start max-w-[80%]">
                            {msg.sender && <span className="text-[10px] font-bold text-[#8E8E93] mb-1 ml-1">{msg.sender.name}</span>}
                            <div className="px-4 py-2.5 rounded-2xl rounded-tl-none bg-white/80 backdrop-blur-md border border-white/80 shadow-sm text-sm font-medium text-[#1E1B2E]">
                              {msg.text}
                            </div>
                          </motion.div>
                        );
                      }
                      return (
                        <motion.div key={i || msg.id} initial={prefersReduced ? { opacity: 1, y: 0 } : "hidden"} animate={prefersReduced ? { opacity: 1, y: 0 } : "show"} variants={messageVariant} className={`flex ${isMineDM ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${isMineDM ? "bg-[#C9A96E]/20 border border-[#C9A96E]/40 text-[#1E1B2E] rounded-tr-none" : "bg-white/80 backdrop-blur-md border border-white/80 text-[#1E1B2E] rounded-tl-none"}`}>
                            {msg.text}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* Composer */}
              <motion.div initial={prefersReduced ? { opacity: 1 } : "hidden"} animate={prefersReduced ? { opacity: 1 } : "show"} variants={composerVariant} className="p-3 md:p-4 border-t border-[#1E1B2E]/10 bg-white/60 backdrop-blur-xl shrink-0">
                <form onSubmit={activeGroup ? sendGroupMessage : sendMessage} className="flex items-center gap-2.5">
                  <Input
                    placeholder="Type a message..."
                    className="flex-1 h-11 rounded-full bg-white/90 border border-[#1E1B2E]/15 px-5 text-sm font-medium text-[#1E1B2E] focus-visible:ring-2 focus-visible:ring-yellow-300 shadow-2xs"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim()}
                    whileTap={prefersReduced ? {} : { scale: 0.96 }}
                    className="h-11 px-5 rounded-full bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(201,169,110,0.3)] focus-visible:ring-2 focus-visible:ring-yellow-300 cursor-pointer disabled:opacity-50"
                  >
                    <span>Send</span>
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </motion.main>
  );
}
