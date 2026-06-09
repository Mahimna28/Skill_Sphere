"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Search, Loader2, ArrowLeft, Trash2, Lock, Unlock, UserPlus, CheckCheck, X, Clock, AtSign, Users, Plus } from "lucide-react";

export default function MessagesPage() {
  const [myUsername, setMyUsername] = useState<string|null>(undefined as any);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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

  useEffect(() => { checkUsername(); fetchContacts(); fetchRequests(); fetchGroups(); fetchSuggestions(); }, []);
  
  useEffect(() => {
    const t = setTimeout(() => { if (searchQuery) handleSearch(); else setSearchResults([]); }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);
  useEffect(() => { if (otherUser && chatStatus === "allowed") { fetchMessages(); const i = setInterval(fetchMessages, 3000); return () => clearInterval(i); } }, [otherUser, chatStatus]);
  useEffect(() => { if (activeGroup) { fetchGroupMessages(); const i = setInterval(fetchGroupMessages, 3000); return () => clearInterval(i); } }, [activeGroup]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, groupMessages]);

  const checkUsername = async () => { try { const r = await fetch("/api/username/set"); const d = await r.json(); setMyUsername(d.username); } catch(e) { setMyUsername(null); } };
  const fetchContacts = async () => { try { const r = await fetch("/api/chat/contacts"); const d = await r.json(); if (r.ok) setContacts(d.contacts); } catch(e) {} };
  const fetchRequests = async () => { try { const r = await fetch("/api/chat/request"); const d = await r.json(); if (r.ok) setPendingRequests(d.received); } catch(e) {} };
  const fetchGroups = async () => { try { const r = await fetch("/api/chat/group"); const d = await r.json(); if (r.ok) { setGroups(d.groups); setPendingInvites(d.pendingInvites); } } catch(e) {} };
  const fetchSuggestions = async () => { try { const r = await fetch("/api/users/suggested"); const d = await r.json(); if (r.ok) setSuggestedUsers(d.users); } catch(e) {} };
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
    setSearching(true); setError(""); setSearchResults([]);
    try { const r = await fetch(`/api/users/search?username=${searchQuery}`); const d = await r.json(); if (r.ok) setSearchResults(d.users); else setError(d.message); }
    catch(e) { setError("Search failed"); } finally { setSearching(false); }
  };

  const openChat = async (user: any) => {
    setOtherUser(user); setActiveGroup(null); setSearchResults([]); setSearchQuery(""); setMessages([]);
    if (user.isProfilePublic) { setChatStatus("allowed"); } else {
      const r = await fetch(`/api/chat/direct?otherId=${user.id}`); const d = await r.json();
      if (r.ok && d.messages.length > 0) { setChatStatus("allowed"); setMessages(d.messages); } else {
        const rr = await fetch("/api/chat/request"); const rd = await rr.json();
        const sent = rd.sent?.find((x:any) => x.receiverId === user.id || x.receiver?.id === user.id);
        setChatStatus(sent ? "pending" : "request_needed");
      }
    }
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

  // USERNAME SETUP GATE
  if (myUsername === undefined) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="animate-spin" size={32} /></div>;
  if (myUsername === null) {
    return (
      <div className="max-w-md mx-auto mt-20 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white border-4 border-black rounded-[2.5rem] p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
          <div className="w-20 h-20 mx-auto bg-primary/10 border-4 border-black rounded-full flex items-center justify-center mb-6"><AtSign size={40} className="text-primary" /></div>
          <h2 className="text-3xl font-black uppercase mb-2">Choose Username</h2>
          <p className="font-bold text-muted-foreground text-sm mb-6">Pick a unique username to start messaging. This is how others will find you.</p>
          <form onSubmit={handleSetUsername} className="space-y-4">
            <div className="relative"><span className="absolute left-3 top-3 text-muted-foreground font-black">@</span><Input className="pl-8 h-12 border-2 border-black font-bold" placeholder="your_username" value={newUsername} onChange={e => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} maxLength={20} /></div>
            <p className="text-[8px] font-bold text-muted-foreground">3-20 characters. Lowercase, numbers, underscores only.</p>
            {usernameError && <p className="text-xs font-bold text-red-600">{usernameError}</p>}
            <Button type="submit" disabled={usernameLoading || newUsername.length < 3} className="w-full h-12 neo-brutalism bg-primary text-white font-black text-lg">
              {usernameLoading ? <Loader2 className="animate-spin" /> : "Set Username"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-4 shrink-0 overflow-hidden">
        <div className="neo-brutalism bg-white p-5 border-4 border-black">
          <h2 className="text-sm font-black uppercase tracking-tight mb-3 flex items-center gap-2"><Search size={16} /> Find User</h2>
          <form onSubmit={handleSearch} className="flex gap-2 relative">
            <div className="relative flex-1"><AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." className="pl-9 border-2 border-black font-bold h-10 text-xs" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} /></div>
            <Button type="submit" disabled={searching} className="h-10 w-10 p-0 neo-brutalism bg-primary text-white">{searching ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}</Button>
            
            {/* Dropdown Suggestions */}
            {isSearchFocused && (
              <div className="absolute top-12 left-0 right-0 z-50 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-80 overflow-y-auto p-2">
                 <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 px-2">{searchQuery ? "Search Results" : "Suggested Users"}</p>
                 {searchQuery && searchResults.length === 0 && !searching && <p className="text-xs font-bold text-center p-4">No users found.</p>}
                 {searching && <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}
                 {(!searchQuery ? suggestedUsers : searchResults).map((u: any) => (
                    <div key={u.id} className="p-2 hover:bg-muted/30 rounded-lg flex flex-col gap-2 border-b-2 border-black/10 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-black overflow-hidden shrink-0">{u.image ? <img src={u.image} className="w-full h-full object-cover" /> : u.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-xs uppercase truncate">{u.name}</p>
                          <p className="text-[8px] font-bold text-muted-foreground truncate">@{u.username} · {u.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/user/${u.username}`} target="_blank" className="flex-1">
                          <Button type="button" variant="outline" className="w-full h-7 text-[10px] font-black border-2 border-black">View Profile</Button>
                        </Link>
                        <Button type="button" onClick={() => openChat(u)} className="flex-1 h-7 text-[10px] font-black neo-brutalism bg-primary text-white">
                          {u.isProfilePublic ? <><MessageSquare size={12} className="mr-1" /> Chat</> : <><UserPlus size={12} className="mr-1" /> Connect</>}
                        </Button>
                      </div>
                    </div>
                 ))}
              </div>
            )}
          </form>
          {error && <p className="text-[10px] font-bold text-red-600 mt-2">{error}</p>}
        </div>

        {/* Tabs */}
        <div className="neo-brutalism bg-white border-4 border-black flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex border-b-4 border-black shrink-0">
            {(["contacts","groups","requests"] as const).map((tab: "contacts" | "groups" | "requests") => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 p-2.5 text-[9px] font-black uppercase text-center transition-colors border-r-2 last:border-r-0 border-black relative ${activeTab === tab ? (tab==="requests"?"bg-[#F5C84C] text-black":"bg-primary text-white") : "hover:bg-muted/20"}`}>
                {tab}{tab === "requests" && (pendingRequests.length + pendingInvites.length > 0) && <span className="absolute top-0.5 right-1 bg-red-500 text-white text-[7px] font-black w-4 h-4 rounded-full flex items-center justify-center">{pendingRequests.length + pendingInvites.length}</span>}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeTab === "contacts" && (contacts.length === 0 ? <div className="p-6 text-center"><p className="text-xs font-bold text-muted-foreground italic">No conversations yet</p></div> : <div className="divide-y-2 divide-black">{contacts.map((c: any) => (
              <button key={c.id} onClick={() => openChat(c)} className={`w-full p-4 text-left hover:bg-accent/10 transition-colors flex items-center gap-3 ${otherUser?.id === c.id ? "bg-primary/10" : ""}`}>
                <div className="w-10 h-10 rounded-full bg-muted border-2 border-black flex items-center justify-center text-xs font-black shrink-0 overflow-hidden">{c.image ? <img src={c.image} className="w-full h-full object-cover" /> : c.name.charAt(0)}</div>
                <div className="flex-1 min-w-0"><p className="font-black text-xs uppercase truncate">{c.name}</p><p className="text-[8px] text-muted-foreground font-bold">@{c.username || "---"}</p></div>
              </button>
            ))}</div>)}

            {activeTab === "groups" && (<div>
              <div className="p-3 border-b-2 border-black"><Button onClick={() => setShowCreateGroup(!showCreateGroup)} className="w-full h-8 text-[10px] font-black neo-brutalism bg-[#34D399] text-black"><Plus size={12} className="mr-1" /> New Group</Button></div>
              {showCreateGroup && <form onSubmit={createGroup} className="p-3 border-b-2 border-black space-y-2 bg-muted/10">
                <Input className="h-8 border-2 border-black font-bold text-xs" placeholder="Group name" value={groupName} onChange={e => setGroupName(e.target.value)} maxLength={30} />
                <Input className="h-8 border-2 border-black font-bold text-xs" placeholder="@user1, @user2" value={groupMembers} onChange={e => setGroupMembers(e.target.value)} />
                <Button type="submit" disabled={loading || !groupName.trim()} className="w-full h-8 text-[10px] font-black bg-primary text-white border-2 border-black">Create</Button>
              </form>}
              {groups.length === 0 && !showCreateGroup ? <div className="p-6 text-center"><p className="text-xs font-bold text-muted-foreground italic">No groups yet</p></div> : <div className="divide-y-2 divide-black">{groups.map((g: any) => (
                <button key={g.id} onClick={() => openGroupChat(g)} className={`w-full p-4 text-left hover:bg-accent/10 flex items-center gap-3 ${activeGroup?.id === g.id ? "bg-primary/10" : ""}`}>
                  <div className="w-10 h-10 rounded-xl bg-[#4F7DF3] border-2 border-black flex items-center justify-center text-white text-xs font-black"><Users size={16} /></div>
                  <div className="flex-1 min-w-0"><p className="font-black text-xs uppercase truncate">{g.name}</p><p className="text-[8px] text-muted-foreground font-bold">{g.memberCount} members</p></div>
                </button>
              ))}</div>}
              {pendingInvites.length > 0 && <div className="border-t-2 border-black"><p className="text-[8px] font-black uppercase p-2 bg-[#F5C84C]/20">Pending Invites</p>{pendingInvites.map((inv: any) => (
                <div key={inv.id} className="p-3 border-b border-black/10 space-y-2">
                  <p className="text-xs font-black uppercase">{inv.group.name}</p>
                  <p className="text-[8px] text-muted-foreground">From @{inv.group.createdBy.username}</p>
                  <div className="flex gap-2"><Button onClick={() => respondToGroupInvite(inv.groupId, "accept")} className="flex-1 h-7 text-[9px] font-black bg-[#34D399] text-black border border-black">Join</Button><Button onClick={() => respondToGroupInvite(inv.groupId, "reject")} variant="destructive" className="flex-1 h-7 text-[9px] font-black border border-black">Decline</Button></div>
                </div>
              ))}</div>}
            </div>)}

            {activeTab === "requests" && (pendingRequests.length === 0 ? <div className="p-6 text-center"><p className="text-xs font-bold text-muted-foreground italic">No pending requests</p></div> : <div className="divide-y-2 divide-black">{pendingRequests.map((req: any) => (
              <div key={req.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#F5C84C] border-2 border-black flex items-center justify-center text-xs font-black overflow-hidden">{req.sender.image ? <img src={req.sender.image} className="w-full h-full object-cover" /> : req.sender.name.charAt(0)}</div><div><p className="font-black text-xs uppercase">{req.sender.name}</p><p className="text-[8px] font-bold text-muted-foreground">{req.sender.role}</p></div></div>
                <div className="flex gap-2"><Button onClick={() => respondToRequest(req.id, "accept")} className="flex-1 h-8 text-[10px] font-black bg-[#34D399] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><CheckCheck size={12} className="mr-1" /> Accept</Button><Button onClick={() => respondToRequest(req.id, "reject")} variant="destructive" className="flex-1 h-8 text-[10px] font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><X size={12} className="mr-1" /> Reject</Button></div>
              </div>
            ))}</div>)}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col bg-white overflow-hidden min-h-0">
        {!otherUser && !activeGroup ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-40">
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-black flex items-center justify-center mb-6"><MessageSquare size={40} /></div>
            <h3 className="text-2xl font-black uppercase">Messages</h3>
            <p className="font-bold max-w-xs mt-2">Search by @username or select a contact to start chatting.</p>
            <p className="text-[10px] font-bold mt-4 text-muted-foreground">Your username: <span className="text-primary">@{myUsername}</span></p>
          </div>
        ) : chatStatus === "request_needed" && otherUser ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 bg-orange-100 rounded-full border-4 border-black flex items-center justify-center mb-6"><Lock size={40} className="text-orange-500" /></div>
            <h3 className="text-2xl font-black uppercase mb-2">Private Account</h3>
            <p className="font-bold text-muted-foreground max-w-sm mb-6"><strong>{otherUser.name}</strong> has a private profile. Send a request to connect.</p>
            <Button onClick={sendChatRequest} disabled={loading} className="neo-brutalism bg-[#4F7DF3] text-white font-black h-14 px-10 text-lg">{loading ? <Loader2 className="animate-spin mr-2" /> : <UserPlus className="mr-2" />} Send Request</Button>
          </div>
        ) : chatStatus === "pending" && otherUser ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 bg-yellow-100 rounded-full border-4 border-black flex items-center justify-center mb-6"><Clock size={40} className="text-yellow-600 animate-pulse" /></div>
            <h3 className="text-2xl font-black uppercase mb-2">Request Pending</h3>
            <p className="font-bold text-muted-foreground max-w-sm">Waiting for <strong>{otherUser.name}</strong> to accept your request.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b-4 border-black bg-muted/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {activeGroup ? <div className="w-8 h-8 rounded-xl bg-[#4F7DF3] text-white border-2 border-black flex items-center justify-center text-xs font-black"><Users size={14} /></div> : <div className="w-8 h-8 rounded-full bg-primary text-white border-2 border-black flex items-center justify-center text-xs font-black overflow-hidden">{otherUser?.image ? <img src={otherUser.image} className="w-full h-full object-cover" /> : otherUser?.name?.charAt(0)}</div>}
                <div><span className="font-black uppercase text-sm">{activeGroup ? activeGroup.name : otherUser?.name}</span>{!activeGroup && otherUser?.username && <p className="text-[8px] font-bold text-muted-foreground">@{otherUser.username}</p>}{activeGroup && <p className="text-[8px] font-bold text-muted-foreground">{activeGroup.memberCount} members</p>}</div>
              </div>
              <div className="flex items-center gap-2">
                {otherUser && <Button variant="destructive" size="icon" onClick={deleteConversation} disabled={loading} className="h-8 w-8 border-2 border-black"><Trash2 size={14} /></Button>}
                <Button variant="ghost" onClick={() => { setOtherUser(null); setActiveGroup(null); setChatStatus(null); }} className="h-8 w-8 p-0 border-2 border-black"><ArrowLeft size={16} /></Button>
              </div>
            </div>
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 scrollbar-thin bg-[#f8f9fa]">
              {(activeGroup ? groupMessages : messages).length === 0 ? <div className="text-center py-20"><p className="font-bold text-muted-foreground italic text-sm">No messages yet. Say hello! 👋</p></div> : (activeGroup ? groupMessages : messages).map((msg: any, i: number) => {
                const isMine = activeGroup ? msg.senderId !== undefined && msg.sender?.id === undefined : msg.receiverId === otherUser?.id;
                const isMineDM = !activeGroup && msg.receiverId === otherUser?.id;
                const isMineGroup = activeGroup && msg.senderId && !msg.sender;
                // For group messages the sender info is included
                if (activeGroup) {
                  const fromMe = msg.sender && otherUser === null;
                  return (
                    <div key={i} className="flex flex-col">
                      {msg.sender && <p className="text-[8px] font-black uppercase text-muted-foreground mb-1 ml-1">{msg.sender.name}</p>}
                      <div className={`max-w-[75%] px-4 py-2 border-2 border-black rounded-2xl font-medium text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white text-black rounded-tl-none`}>{msg.text}</div>
                    </div>
                  );
                }
                return (
                  <div key={i} className={`flex ${isMineDM ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2 border-2 border-black rounded-2xl font-medium text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isMineDM ? "bg-primary text-white rounded-tr-none" : "bg-white text-black rounded-tl-none"}`}>{msg.text}</div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </CardContent>
            <CardFooter className="p-4 border-t-4 border-black shrink-0">
              <form onSubmit={activeGroup ? sendGroupMessage : sendMessage} className="w-full flex gap-3">
                <Input placeholder="Type a message..." className="flex-1 h-12 border-2 border-black font-bold" value={input} onChange={e => setInput(e.target.value)} />
                <Button type="submit" disabled={!input.trim()} className="h-12 w-12 p-0 neo-brutalism bg-secondary text-black"><Send size={20} /></Button>
              </form>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
