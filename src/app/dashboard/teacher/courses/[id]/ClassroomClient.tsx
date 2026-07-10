"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BookOpen, Users, BarChart3, Rss, Plus, Trash2, FileText,
  MessageSquare, Send, Check, Loader2, Download, Copy, CheckCheck,
  ChevronDown, ChevronRight, Upload, Star, Clock, X, AlertCircle, Award
} from "lucide-react";

type Tab = "stream" | "classwork" | "people" | "grades" | "calendar";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  assigned: { label: "Assigned", color: "#8E8E93", bg: "rgba(142,142,147,0.1)" },
  turned_in: { label: "Turned In", color: "#2563EB", bg: "rgba(37,99,235,0.1)" },
  graded: { label: "Graded", color: "#16A34A", bg: "rgba(22,163,74,0.1)" },
  missing: { label: "Missing", color: "#DC2626", bg: "rgba(220,38,38,0.1)" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.assigned;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

export default function ClassroomClient({ course, isPrimaryTeacher, currentUserId }: { course: any, isPrimaryTeacher?: boolean, currentUserId?: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("stream");
  const [loading, setLoading] = useState(false);

  // Stream state
  const [announcement, setAnnouncement] = useState("");
  const [question, setQuestion] = useState("");
  const [postType, setPostType] = useState<"announcement" | "question">("announcement");

  // Classwork state
  const [showNewTopicInput, setShowNewTopicInput] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [showAssignmentForm, setShowAssignmentForm] = useState<string | null>(null); // topicId or "none"
  const [showMaterialForm, setShowMaterialForm] = useState<string | null>(null);
  const [showQuizForm, setShowQuizForm] = useState<string | null>(null);
  const [assignmentForm, setAssignmentForm] = useState({ title: "", description: "", dueDate: "", points: 100, fileUrl: "" });
  const [materialForm, setMaterialForm] = useState({ title: "", description: "", fileUrl: "", linkUrl: "" });
  const [quizForm, setQuizForm] = useState({ title: "", description: "", dueDate: "", timeLimitMinutes: "", questions: [] as any[] });
  const [uploadingFile, setUploadingFile] = useState(false);

  // People state
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteCoTeacher, setShowInviteCoTeacher] = useState(false);

  // Calendar state
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", description: "", startTime: "", endTime: "", location: "" });

  // Grades state
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [gradingLoading, setGradingLoading] = useState(false);

  // Reply state
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // Subject state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [showNewSubjectForm, setShowNewSubjectForm] = useState(false);
  const [subjectForm, setSubjectForm] = useState({ name: "", description: "", color: "#C9A96E" });
  const [editingSubject, setEditingSubject] = useState<any>(null);

  const postToStream = async () => {
    if (!announcement.trim() && !question.trim()) return;
    setLoading(true);
    try {
      if (postType === "announcement") {
        await fetch(`/api/courses/${course.id}/announcements`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Announcement", content: announcement, subjectId: selectedSubjectId })
        });
        setAnnouncement("");
      } else {
        await fetch(`/api/classes/${course.id}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, subjectId: selectedSubjectId })
        });
        setQuestion("");
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async () => {
    if (!newTopicTitle.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/classes/${course.id}/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTopicTitle, subjectId: selectedSubjectId })
      });
      setNewTopicTitle("");
      setShowNewTopicInput(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const deleteTopic = async (topicId: string) => {
    if (!confirm("Delete this topic and all its content?")) return;
    await fetch(`/api/classes/${course.id}/topics/${topicId}`, { method: "DELETE" });
    router.refresh();
  };

  const createAssignment = async (topicId?: string) => {
    if (!assignmentForm.title || !assignmentForm.description || !assignmentForm.dueDate) {
      alert("Please fill in all required fields."); return;
    }
    setLoading(true);
    try {
      await fetch(`/api/courses/${course.id}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...assignmentForm, topicId: topicId || null, subjectId: selectedSubjectId })
      });
      setAssignmentForm({ title: "", description: "", dueDate: "", points: 100, fileUrl: "" });
      setShowAssignmentForm(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const createMaterial = async (topicId?: string) => {
    if (!materialForm.title) { alert("Title is required."); return; }
    setLoading(true);
    try {
      await fetch(`/api/classes/${course.id}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...materialForm, topicId: topicId || null, subjectId: selectedSubjectId })
      });
      setMaterialForm({ title: "", description: "", fileUrl: "", linkUrl: "" });
      setShowMaterialForm(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const removeStudent = async (studentId: string, name: string) => {
    if (!confirm(`Remove ${name} from this class?`)) return;
    await fetch(`/api/classes/${course.id}/people`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId })
    });
    router.refresh();
  };

  const returnGrade = async () => {
    if (!selectedSubmission || gradeInput === "") return;
    setGradingLoading(true);
    try {
      await fetch(`/api/classes/${course.id}/assignments/${selectedSubmission.assignmentId}/return`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedSubmission.studentId,
          grade: parseFloat(gradeInput),
          feedback: feedbackInput
        })
      });
      setSelectedSubmission(null);
      setGradeInput("");
      setFeedbackInput("");
      router.refresh();
    } finally {
      setGradingLoading(false);
    }
  };

  const postReply = async (questionId: string) => {
    const text = replyText[questionId];
    if (!text?.trim()) return;
    await fetch(`/api/classes/${course.id}/questions/${questionId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text })
    });
    setReplyText(prev => ({ ...prev, [questionId]: "" }));
    router.refresh();
  };

  const uploadFile = async (file: File, onDone: (url: string) => void) => {
    setUploadingFile(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) onDone(data.url);
    } finally {
      setUploadingFile(false);
    }
  };

  const createQuiz = async (topicId?: string) => {
    if (!quizForm.title.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/classes/${course.id}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...quizForm, topicId: topicId || null, subjectId: selectedSubjectId })
      });
      setQuizForm({ title: "", description: "", dueDate: "", timeLimitMinutes: "", questions: [] });
      setShowQuizForm(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async () => {
    if (!subjectForm.name.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/classes/${course.id}/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectForm)
      });
      setSubjectForm({ name: "", description: "", color: "#C9A96E" });
      setShowNewSubjectForm(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (subjectId: string) => {
    if (!confirm("Delete this subject? Its content will be kept but unassigned.")) return;
    await fetch(`/api/classes/${course.id}/subjects/${subjectId}`, { method: "DELETE" });
    if (selectedSubjectId === subjectId) setSelectedSubjectId(null);
    router.refresh();
  };

  const createEvent = async () => {
    if (!eventForm.title.trim() || !eventForm.startTime || !eventForm.endTime) return;
    setLoading(true);
    try {
      await fetch(`/api/classes/${course.id}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm)
      });
      setEventForm({ title: "", description: "", startTime: "", endTime: "", location: "" });
      setShowEventForm(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const inviteCoTeacher = async () => {
    if (!inviteEmail.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/classes/${course.id}/co-teachers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail })
      });
      setInviteEmail("");
      setShowInviteCoTeacher(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const removeCoTeacher = async (userId: string) => {
    if (!confirm("Remove this co-teacher?")) return;
    await fetch(`/api/classes/${course.id}/co-teachers/${userId}`, { method: "DELETE" });
    router.refresh();
  };

  const students = course.enrollments?.map((e: any) => e.user) || [];
  const allAssignments = course.assignments || [];
  const allTopics = course.topics || [];
  const allQuestions = course.questions || [];
  const allAnnouncements = course.announcements || [];

  // Filter by selected subject
  const filterBySubject = (items: any[]) =>
    selectedSubjectId ? items.filter((i: any) => i.subjectId === selectedSubjectId) : items;

  const assignments = filterBySubject(allAssignments);
  const topics = selectedSubjectId
    ? allTopics.filter((t: any) => t.subjectId === selectedSubjectId)
    : allTopics;

  // Build unified stream (filtered)
  const stream = [
    ...filterBySubject(allAnnouncements).map((a: any) => ({ ...a, _type: "announcement" })),
    ...filterBySubject(allAssignments).map((a: any) => ({ ...a, _type: "assignment" })),
    ...filterBySubject(course.materials || []).map((m: any) => ({ ...m, _type: "material" })),
    ...filterBySubject(allQuestions).map((q: any) => ({ ...q, _type: "question" })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const TABS = [
    { id: "stream", label: "Stream", icon: Rss },
    { id: "classwork", label: "Classwork", icon: BookOpen },
    { id: "calendar", label: "Calendar", icon: Clock },
    { id: "people", label: "People", icon: Users },
    { id: "grades", label: "Grades", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F1EB] font-sans text-[#1E1B2E]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] text-white px-8 py-6 mx-4 mt-4 rounded-[24px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-[#C9A96E] mb-1">{course.subject}</p>
            <h1 className="font-heading text-[32px] leading-tight">{course.title}</h1>
            {course.section && <p className="text-white/60 text-sm mt-1">Section: {course.section}</p>}
          </div>
          <div className="text-right">
            <p className="text-[11px] text-white/50 mb-1">Class Code</p>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl" title={course.classCode ? "Select to copy" : ""}>
              <span className="font-mono text-[20px] font-bold text-[#C9A96E] tracking-widest select-all cursor-text">{course.classCode || "NO CODE"}</span>
            </div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex gap-1 mt-6 bg-white/5 rounded-xl p-1 w-fit">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#C9A96E] text-[#1E1B2E] shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>
        {/* Subjects Filter Bar */}
        {(course.subjects?.length > 0) && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <button
              onClick={() => setSelectedSubjectId(null)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all border ${
                selectedSubjectId === null
                  ? "bg-white text-[#1E1B2E] border-white shadow-sm"
                  : "bg-transparent text-white/60 border-white/20 hover:border-white/40"
              }`}
            >
              All Subjects
            </button>
            {(course.subjects || []).map((sub: any) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all border ${
                  selectedSubjectId === sub.id
                    ? "bg-white text-[#1E1B2E] border-white shadow-sm"
                    : "bg-transparent text-white/60 border-white/20 hover:border-white/40"
                }`}
                style={selectedSubjectId === sub.id ? { borderColor: sub.color, color: sub.color, background: `${sub.color}22` } : {}}
              >
                <span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ background: sub.color }} />
                {sub.name}
              </button>
            ))}
            <button
              onClick={() => setShowNewSubjectForm(true)}
              className="px-3 py-1.5 rounded-full text-[12px] font-bold text-white/50 hover:text-white border border-dashed border-white/30 hover:border-white/60 transition-all flex items-center gap-1"
            >
              <Plus size={12} /> Add Subject
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 p-8">
        <AnimatePresence mode="wait">

          {/* ═══════════════════════════════ STREAM TAB ═══════════════════════════════ */}
          {activeTab === "stream" && (
            <motion.div key="stream" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-6">

              {/* Post Box */}
              <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.05)] p-6">
                <div className="flex gap-2 mb-4">
                  {["announcement", "question"].map(pt => (
                    <button
                      key={pt}
                      onClick={() => setPostType(pt as any)}
                      className={`px-4 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-all ${
                        postType === pt ? "bg-[#1E1B2E] text-white" : "bg-[#F5F1EB] text-[#8E8E93] hover:text-[#1E1B2E]"
                      }`}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder={postType === "announcement" ? "Share something with your class..." : "Ask a discussion question..."}
                  className="w-full min-h-[80px] bg-[#F5F1EB] rounded-xl p-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 resize-none"
                  value={postType === "announcement" ? announcement : question}
                  onChange={e => postType === "announcement" ? setAnnouncement(e.target.value) : setQuestion(e.target.value)}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={postToStream}
                    disabled={loading || (postType === "announcement" ? !announcement.trim() : !question.trim())}
                    className="h-10 px-6 bg-[#1E1B2E] hover:bg-[#C9A96E] text-white hover:text-[#1E1B2E] rounded-xl text-[13px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-40"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    Post
                  </button>
                </div>
              </div>

              {/* Stream Feed */}
              {stream.length === 0 && (
                <div className="text-center py-16 text-[#8E8E93]">
                  <Rss size={40} className="mx-auto opacity-20 mb-3" />
                  <p className="font-medium">Nothing posted yet. Be the first to post!</p>
                </div>
              )}

              {stream.map((item: any) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden"
                >
                  {/* Type indicator */}
                  <div className={`px-6 py-3 flex items-center gap-2 border-b border-[rgba(30,27,46,0.04)] ${
                    item._type === "assignment" ? "bg-[rgba(201,169,110,0.06)]" :
                    item._type === "question" ? "bg-[rgba(37,99,235,0.04)]" :
                    item._type === "material" ? "bg-[rgba(22,163,74,0.04)]" : "bg-white"
                  }`}>
                    {item._type === "assignment" && <><BookOpen size={14} className="text-[#C9A96E]" /><span className="text-[11px] font-bold text-[#C9A96E] uppercase tracking-wider">Assignment</span></>}
                    {item._type === "question" && <><MessageSquare size={14} className="text-blue-500" /><span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">Question</span></>}
                    {item._type === "material" && <><FileText size={14} className="text-green-600" /><span className="text-[11px] font-bold text-green-600 uppercase tracking-wider">Material</span></>}
                    {item._type === "announcement" && <><Rss size={14} className="text-[#1E1B2E]" /><span className="text-[11px] font-bold text-[#1E1B2E] uppercase tracking-wider">Announcement</span></>}
                    <span className="ml-auto text-[11px] text-[#8E8E93]">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-[16px] text-[#1E1B2E] mb-1">
                      {item.title || item.question || "Untitled"}
                    </h3>
                    {item._type === "assignment" && (
                      <div className="flex items-center gap-4 text-[12px] text-[#8E8E93] mt-2">
                        <span className="flex items-center gap-1"><Clock size={12} /> Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Star size={12} /> {item.points} pts</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {item.submissions?.length || 0} submitted</span>
                      </div>
                    )}
                    {item.content && <p className="text-[14px] text-[#8E8E93] mt-2 leading-relaxed">{item.content}</p>}
                    {item.description && <p className="text-[14px] text-[#8E8E93] mt-2 leading-relaxed">{item.description}</p>}
                    {item.fileUrl && (
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-[12px] text-[#C9A96E] font-medium hover:underline">
                        <Download size={14} /> View Attached File
                      </a>
                    )}

                    {/* Question Replies */}
                    {item._type === "question" && (
                      <div className="mt-4 space-y-3">
                        {item.replies?.map((r: any) => (
                          <div key={r.id} className="flex gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#F5F1EB] flex items-center justify-center text-[11px] font-bold text-[#1E1B2E] shrink-0">
                              {r.author?.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 bg-[#F5F1EB] rounded-xl px-4 py-2">
                              <span className="text-[12px] font-bold text-[#1E1B2E]">{r.author?.name}</span>
                              <p className="text-[13px] text-[#8E8E93] mt-0.5">{r.content}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2 mt-2">
                          <input
                            placeholder="Add a reply..."
                            className="flex-1 h-9 bg-[#F5F1EB] rounded-xl px-4 text-[13px] text-[#1E1B2E] focus:outline-none"
                            value={replyText[item.id] || ""}
                            onChange={e => setReplyText(prev => ({ ...prev, [item.id]: e.target.value }))}
                            onKeyDown={e => e.key === "Enter" && postReply(item.id)}
                          />
                          <button onClick={() => postReply(item.id)} className="w-9 h-9 bg-[#1E1B2E] rounded-xl flex items-center justify-center">
                            <Send size={14} className="text-white" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ═══════════════════════════════ CLASSWORK TAB ═══════════════════════════════ */}
          {activeTab === "classwork" && (
            <motion.div key="classwork" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-6">

              {/* Create buttons bar */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { setShowNewTopicInput(true); }}
                  className="h-10 px-5 bg-[#1E1B2E] text-white rounded-xl text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#2A2540] transition-all"
                >
                  <Plus size={14} /> Add Topic
                </button>
                <button
                  onClick={() => setShowAssignmentForm("none")}
                  className="h-10 px-5 bg-[#C9A96E] text-[#1E1B2E] rounded-xl text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#D6B87D] transition-all"
                >
                  <BookOpen size={14} /> + Assignment
                </button>
                <button
                  onClick={() => setShowQuizForm("none")}
                  className="h-10 px-5 bg-purple-100 text-purple-700 rounded-xl text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-purple-200 transition-all"
                >
                  <Award size={14} /> + Quiz
                </button>
                <button
                  onClick={() => setShowMaterialForm("none")}
                  className="h-10 px-5 bg-white border border-[rgba(30,27,46,0.1)] text-[#1E1B2E] rounded-xl text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 hover:shadow-md transition-all"
                >
                  <FileText size={14} /> + Material
                </button>
              </div>

              {/* New Topic Input */}
              {showNewTopicInput && (
                <div className="bg-white rounded-[16px] p-5 flex gap-3 shadow-sm">
                  <input
                    autoFocus
                    placeholder="Topic title (e.g. Unit 1: Introduction)"
                    className="flex-1 h-11 bg-[#F5F1EB] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40"
                    value={newTopicTitle}
                    onChange={e => setNewTopicTitle(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && createTopic()}
                  />
                  <button onClick={createTopic} disabled={loading} className="h-11 px-5 bg-[#1E1B2E] text-white rounded-xl text-[13px] font-bold">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : "Create"}
                  </button>
                  <button onClick={() => setShowNewTopicInput(false)} className="h-11 px-4 bg-[#F5F1EB] text-[#8E8E93] rounded-xl">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Assignment / Material forms (uncategorized) */}
              {showAssignmentForm === "none" && <AssignmentForm form={assignmentForm} setForm={setAssignmentForm} topics={topics} onSubmit={() => createAssignment()} onCancel={() => setShowAssignmentForm(null)} loading={loading} uploading={uploadingFile} onUpload={uploadFile} />}
              {showMaterialForm === "none" && <MaterialForm form={materialForm} setForm={setMaterialForm} onSubmit={() => createMaterial()} onCancel={() => setShowMaterialForm(null)} loading={loading} uploading={uploadingFile} onUpload={uploadFile} />}
              {showQuizForm === "none" && <QuizForm form={quizForm} setForm={setQuizForm} onSubmit={() => createQuiz()} onCancel={() => setShowQuizForm(null)} loading={loading} />}

              {/* Topics */}
              {topics.length === 0 && assignments.length === 0 && (
                <div className="text-center py-16 text-[#8E8E93]">
                  <BookOpen size={40} className="mx-auto opacity-20 mb-3" />
                  <p className="font-medium">No classwork yet. Add topics and assignments to get started.</p>
                </div>
              )}

              {/* Uncategorized assignments */}
              {assignments.filter((a: any) => !a.topicId).length > 0 && (
                <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[rgba(30,27,46,0.05)]">
                    <h3 className="font-semibold text-[14px] text-[#8E8E93] uppercase tracking-wider">No Topic</h3>
                  </div>
                  {assignments.filter((a: any) => !a.topicId).map((a: any) => <AssignmentRow key={a.id} assignment={a} />)}
                </div>
              )}

              {topics.map((topic: any) => (
                <div key={topic.id} className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden">
                  <div
                    className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-[#F5F1EB]/50 transition-colors border-b border-[rgba(30,27,46,0.05)]"
                    onClick={() => setExpandedTopics(prev => ({ ...prev, [topic.id]: !prev[topic.id] }))}
                  >
                    <div className="flex items-center gap-2">
                      {expandedTopics[topic.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <h3 className="font-bold text-[16px] text-[#1E1B2E]">{topic.title}</h3>
                      <span className="text-[12px] text-[#8E8E93]">
                        {(topic.assignments?.length || 0) + (topic.materials?.length || 0)} items
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); setShowAssignmentForm(topic.id); }}
                        className="h-8 px-3 bg-[#F5F1EB] hover:bg-[#C9A96E]/10 text-[#1E1B2E] rounded-lg text-[11px] font-bold flex items-center gap-1"
                      >
                        <Plus size={12} /> Assignment
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setShowQuizForm(topic.id); }}
                        className="h-8 px-3 bg-[#F5F1EB] hover:bg-[#C9A96E]/10 text-[#1E1B2E] rounded-lg text-[11px] font-bold flex items-center gap-1"
                      >
                        <Award size={12} /> Quiz
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setShowMaterialForm(topic.id); }}
                        className="h-8 px-3 bg-[#F5F1EB] hover:bg-[#C9A96E]/10 text-[#1E1B2E] rounded-lg text-[11px] font-bold flex items-center gap-1"
                      >
                        <FileText size={12} /> Material
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); deleteTopic(topic.id); }}
                        className="h-8 w-8 bg-[#FEF2F2] hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {expandedTopics[topic.id] !== false && (
                    <>
                      {showAssignmentForm === topic.id && <div className="p-5 border-b border-[rgba(30,27,46,0.04)]"><AssignmentForm form={assignmentForm} setForm={setAssignmentForm} topics={topics} onSubmit={() => createAssignment(topic.id)} onCancel={() => setShowAssignmentForm(null)} loading={loading} uploading={uploadingFile} onUpload={uploadFile} /></div>}
                      {showMaterialForm === topic.id && <div className="p-5 border-b border-[rgba(30,27,46,0.04)]"><MaterialForm form={materialForm} setForm={setMaterialForm} onSubmit={() => createMaterial(topic.id)} onCancel={() => setShowMaterialForm(null)} loading={loading} uploading={uploadingFile} onUpload={uploadFile} /></div>}
                      {showQuizForm === topic.id && <div className="p-5 border-b border-[rgba(30,27,46,0.04)]"><QuizForm form={quizForm} setForm={setQuizForm} onSubmit={() => createQuiz(topic.id)} onCancel={() => setShowQuizForm(null)} loading={loading} /></div>}
                      {topic.assignments?.map((a: any) => <AssignmentRow key={a.id} assignment={a} />)}
                      {topic.quizzes?.map((q: any) => <QuizRow key={q.id} quiz={q} courseId={course.id} onDelete={() => router.refresh()} />)}
                      {topic.materials?.map((m: any) => <MaterialRow key={m.id} material={m} courseId={course.id} onDelete={() => router.refresh()} />)}
                      {(topic.assignments?.length || 0) + (topic.materials?.length || 0) + (topic.quizzes?.length || 0) === 0 && showAssignmentForm !== topic.id && showMaterialForm !== topic.id && showQuizForm !== topic.id && (
                        <p className="px-6 py-4 text-[13px] text-[#8E8E93]">No items in this topic yet.</p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* ═══════════════════════════════ PEOPLE TAB ═══════════════════════════════ */}
          {activeTab === "people" && (
            <motion.div key="people" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-6">

              {/* Teacher */}
              <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] p-6">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-4">Teacher</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] flex items-center justify-center text-[#C9A96E] font-bold text-[18px] shrink-0 border-2 border-[#C9A96E]/20">
                    {course.teacher?.name?.[0]?.toUpperCase() || "T"}
                  </div>
                  <div>
                    <p className="font-bold text-[16px] text-[#1E1B2E]">{course.teacher?.name || "Teacher"}</p>
                    <p className="text-[13px] text-[#8E8E93]">{course.teacher?.email}</p>
                    <p className="text-[11px] text-[#C9A96E] font-semibold uppercase tracking-wider mt-0.5">Primary Teacher</p>
                  </div>
                </div>
              </div>

              {/* Class Code */}
              <div className="bg-[#1E1B2E] rounded-[20px] p-6 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A96E]/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-1">Class Join Code</p>
                  <div className="mt-1" title={course.classCode ? "Select to copy" : ""}>
                    <span className="font-mono text-[28px] font-bold text-[#C9A96E] tracking-widest select-all cursor-text">{course.classCode || "NO CODE"}</span>
                  </div>
                  <p className="text-[12px] text-white/40 mt-1">Students enter this code to join instantly</p>
                </div>
              </div>

              {/* Teachers */}
              <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(30,27,46,0.05)] flex items-center justify-between">
                  <h3 className="font-bold text-[16px] text-[#1E1B2E]">Teachers</h3>
                  {isPrimaryTeacher && (
                    <button
                      onClick={() => setShowInviteCoTeacher(true)}
                      className="px-4 py-2 bg-[#1E1B2E] text-white rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-[#2D2844] transition-all"
                    >
                      <Users size={16} /> Invite Co-Teacher
                    </button>
                  )}
                </div>
                <div className="divide-y divide-[rgba(30,27,46,0.04)]">
                  {/* Primary Teacher */}
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1E1B2E] flex items-center justify-center text-[14px] font-bold text-[#C9A96E] shrink-0">
                        {course.teacher?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[14px] text-[#1E1B2E]">{course.teacher?.name}</p>
                        <p className="text-[12px] text-[#8E8E93]">{course.teacher?.email} • Primary Teacher</p>
                      </div>
                    </div>
                  </div>
                  {/* Co-teachers */}
                  {course.coTeachers?.map((teacher: any) => (
                    <div key={teacher.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#F5F1EB]/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F5F1EB] flex items-center justify-center text-[14px] font-bold text-[#1E1B2E] shrink-0">
                          {teacher.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[14px] text-[#1E1B2E]">{teacher.name}</p>
                          <p className="text-[12px] text-[#8E8E93]">{teacher.email} • Co-Teacher</p>
                        </div>
                      </div>
                      {(isPrimaryTeacher || currentUserId === teacher.id) && (
                        <button
                          onClick={() => removeCoTeacher(teacher.id)}
                          className="h-8 px-3 bg-[#FEF2F2] hover:bg-red-100 text-red-500 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Students */}
              <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(30,27,46,0.05)] flex items-center justify-between">
                  <h3 className="font-bold text-[16px] text-[#1E1B2E]">Students</h3>
                  <span className="bg-[#F5F1EB] px-3 py-1 rounded-lg text-[12px] font-bold text-[#8E8E93]">{students.length} enrolled</span>
                </div>
                {students.length === 0 ? (
                  <div className="p-8 text-center text-[#8E8E93]">
                    <Users size={32} className="mx-auto opacity-20 mb-2" />
                    <p>No students yet. Share the class code!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[rgba(30,27,46,0.04)]">
                    {students.map((student: any) => (
                      <div key={student.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#F5F1EB]/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F5F1EB] flex items-center justify-center text-[14px] font-bold text-[#1E1B2E] shrink-0">
                            {student.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[14px] text-[#1E1B2E]">{student.name}</p>
                            <p className="text-[12px] text-[#8E8E93]">{student.email}</p>
                          </div>
                          {student.department?.name && (
                            <span className="px-2.5 py-0.5 bg-[rgba(201,169,110,0.1)] text-[#C9A96E] rounded-full text-[10px] font-bold uppercase">
                              {student.department.name}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeStudent(student.id, student.name)}
                          className="h-8 px-3 bg-[#FEF2F2] hover:bg-red-100 text-red-500 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════ CALENDAR TAB ═══════════════════════════════ */}
          {activeTab === "calendar" && (
            <motion.div key="calendar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(30,27,46,0.05)] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[18px] text-[#1E1B2E]">Class Calendar</h3>
                    <p className="text-[13px] text-[#8E8E93] mt-0.5">Upcoming events, quizzes, and assignments</p>
                  </div>
                  <button
                    onClick={() => setShowEventForm(true)}
                    className="px-4 py-2 bg-[#1E1B2E] text-white rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-[#2D2844] transition-all"
                  >
                    <Plus size={16} /> New Event
                  </button>
                </div>
                
                <div className="p-6">
                  {course.events?.length === 0 && assignments.filter((a: any) => a.dueDate).length === 0 ? (
                    <div className="text-center text-[#8E8E93] py-8">
                      <Clock size={40} className="mx-auto opacity-20 mb-3" />
                      <p>No upcoming events or deadlines.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {course.events?.map((evt: any) => (
                        <div key={evt.id} className="p-4 rounded-xl border border-[rgba(30,27,46,0.05)] bg-[#F5F1EB]/30 flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                            <Star size={20} className="text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[15px] text-[#1E1B2E]">{evt.title}</h4>
                            <p className="text-[13px] text-[#8E8E93] mt-1">
                              {new Date(evt.startTime).toLocaleString()} - {new Date(evt.endTime).toLocaleTimeString()}
                            </p>
                            {evt.location && <p className="text-[12px] text-[#C9A96E] font-medium mt-1">📍 {evt.location}</p>}
                          </div>
                        </div>
                      ))}
                      {assignments.filter((a: any) => a.dueDate).map((a: any) => (
                        <div key={`a-${a.id}`} className="p-4 rounded-xl border border-[rgba(30,27,46,0.05)] bg-red-50 flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                            <AlertCircle size={20} className="text-red-500" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[15px] text-red-900">Due: {a.title}</h4>
                            <p className="text-[13px] text-red-700/70 mt-1">
                              {new Date(a.dueDate).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════ GRADES TAB ═══════════════════════════════ */}
          {activeTab === "grades" && (
            <motion.div key="grades" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(30,27,46,0.05)] bg-[#F5F1EB]/50">
                  <h3 className="font-bold text-[18px] text-[#1E1B2E]">Gradebook</h3>
                  <p className="text-[13px] text-[#8E8E93] mt-0.5">Click any cell to view submission and grade it</p>
                </div>

                {assignments.length === 0 || students.length === 0 ? (
                  <div className="p-12 text-center text-[#8E8E93]">
                    <BarChart3 size={40} className="mx-auto opacity-20 mb-3" />
                    <p>Grades will appear here once you have students and assignments.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white border-b border-[rgba(30,27,46,0.05)]">
                          <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] sticky left-0 bg-white w-48">Student</th>
                          {assignments.map((a: any) => (
                            <th key={a.id} className="p-4 text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] min-w-[160px] border-l border-[rgba(30,27,46,0.04)]">
                              <div className="truncate max-w-[150px]">{a.title}</div>
                              <div className="text-[10px] text-[#C9A96E] font-normal mt-0.5 normal-case tracking-normal">/ {a.points} pts</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgba(30,27,46,0.04)]">
                        {students.map((student: any) => (
                          <tr key={student.id} className="hover:bg-[#F5F1EB]/30 transition-colors">
                            <td className="p-4 font-semibold text-[13px] text-[#1E1B2E] sticky left-0 bg-white border-r border-[rgba(30,27,46,0.04)]">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#F5F1EB] flex items-center justify-center text-[11px] font-bold shrink-0">
                                  {student.name?.[0]?.toUpperCase()}
                                </div>
                                <span className="truncate max-w-[120px]">{student.name}</span>
                              </div>
                            </td>
                            {assignments.map((assignment: any) => {
                              const sub = assignment.submissions?.find((s: any) => s.studentId === student.id);
                              const isPastDue = new Date(assignment.dueDate) < new Date();
                              const status = sub?.status || (isPastDue ? "missing" : "assigned");

                              return (
                                <td
                                  key={assignment.id}
                                  className="p-4 border-l border-[rgba(30,27,46,0.04)] cursor-pointer hover:bg-[#C9A96E]/5 transition-colors"
                                  onClick={() => {
                                    setSelectedSubmission({ ...sub, assignmentId: assignment.id, studentId: student.id, studentName: student.name, assignmentTitle: assignment.title, maxPoints: assignment.points });
                                    setGradeInput(sub?.grade?.toString() || "");
                                    setFeedbackInput(sub?.feedback || "");
                                  }}
                                >
                                  {status === "graded" ? (
                                    <div className="flex items-center gap-1">
                                      <Award size={14} className="text-green-500 shrink-0" />
                                      <span className="font-bold text-[13px] text-green-600">{sub.grade}</span>
                                      <span className="text-[11px] text-[#8E8E93]">/ {assignment.points}</span>
                                    </div>
                                  ) : (
                                    <StatusBadge status={status} />
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grading Drawer */}
      <AnimatePresence>
        {selectedSubmission && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setSelectedSubmission(null)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[rgba(30,27,46,0.06)] flex items-center justify-between shrink-0">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93]">Grading</p>
                  <h3 className="font-heading text-[20px] text-[#1E1B2E] mt-0.5">{selectedSubmission.studentName}</h3>
                  <p className="text-[13px] text-[#8E8E93]">{selectedSubmission.assignmentTitle}</p>
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F1EB] text-[#8E8E93] hover:text-[#1E1B2E] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Submission */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-2">Submission</p>
                  {!selectedSubmission.fileUrl && !selectedSubmission.content ? (
                    <div className="flex items-center gap-2 p-4 bg-[#FEF2F2] rounded-xl text-red-500">
                      <AlertCircle size={16} /> <span className="text-[13px] font-medium">No submission yet</span>
                    </div>
                  ) : (
                    <div className="bg-[#F5F1EB] rounded-xl p-4 space-y-3">
                      {selectedSubmission.content && (
                        <p className="text-[14px] text-[#1E1B2E] leading-relaxed">{selectedSubmission.content}</p>
                      )}
                      {selectedSubmission.fileUrl && (
                        <a href={selectedSubmission.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[13px] text-[#C9A96E] font-medium hover:underline">
                          <Download size={14} /> Download Submitted File
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Grade Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-2">
                    Grade (out of {selectedSubmission.maxPoints})
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={selectedSubmission.maxPoints}
                    placeholder={`0 – ${selectedSubmission.maxPoints}`}
                    className="w-full h-12 bg-[#F5F1EB] rounded-xl px-4 text-[16px] font-bold text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40"
                    value={gradeInput}
                    onChange={e => setGradeInput(e.target.value)}
                  />
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-2">
                    Private Feedback
                  </label>
                  <textarea
                    placeholder="Leave a private comment for the student..."
                    className="w-full min-h-[120px] bg-[#F5F1EB] rounded-xl p-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 resize-none"
                    value={feedbackInput}
                    onChange={e => setFeedbackInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-6 border-t border-[rgba(30,27,46,0.06)] shrink-0">
                <button
                  onClick={returnGrade}
                  disabled={gradingLoading || gradeInput === ""}
                  className="w-full h-12 bg-[#1E1B2E] hover:bg-[#C9A96E] text-white hover:text-[#1E1B2E] rounded-xl font-bold uppercase tracking-wider text-[13px] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {gradingLoading ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Return Grade</>}
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* Invite Co-Teacher Modal */}
        {showInviteCoTeacher && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setShowInviteCoTeacher(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl z-50 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-[rgba(30,27,46,0.06)]">
                <h3 className="font-bold text-[18px] text-[#1E1B2E]">Invite Co-Teacher</h3>
                <p className="text-[13px] text-[#8E8E93] mt-1">They will have full access to manage this class.</p>
              </div>
              <div className="p-6 space-y-4">
                <input
                  type="email"
                  placeholder="Teacher's Email Address"
                  className="w-full h-12 bg-[#F5F1EB] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") inviteCoTeacher(); }}
                />
              </div>
              <div className="p-6 bg-[#F5F1EB]/50 border-t border-[rgba(30,27,46,0.06)] flex justify-end gap-3">
                <button onClick={() => setShowInviteCoTeacher(false)} className="px-5 py-2 text-[#8E8E93] font-bold text-[13px] hover:text-[#1E1B2E]">Cancel</button>
                <button onClick={inviteCoTeacher} disabled={loading || !inviteEmail} className="px-6 py-2 bg-[#1E1B2E] text-white rounded-xl font-bold text-[13px] disabled:opacity-50">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Invite"}
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* New Event Modal */}
        {showEventForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setShowEventForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl z-50 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-[rgba(30,27,46,0.06)]">
                <h3 className="font-bold text-[18px] text-[#1E1B2E] flex items-center gap-2"><Clock size={18} className="text-[#C9A96E]"/> New Calendar Event</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-1">Event Title *</label>
                  <input placeholder="e.g., Guest Lecture" className="w-full h-11 bg-[#F5F1EB] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-1">Start Time *</label>
                    <input type="datetime-local" className="w-full h-11 bg-[#F5F1EB] rounded-xl px-4 text-[13px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={eventForm.startTime} onChange={e => setEventForm({ ...eventForm, startTime: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-1">End Time *</label>
                    <input type="datetime-local" className="w-full h-11 bg-[#F5F1EB] rounded-xl px-4 text-[13px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={eventForm.endTime} onChange={e => setEventForm({ ...eventForm, endTime: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-1">Location / Link</label>
                  <input placeholder="e.g., Room 101 or Zoom Link" className="w-full h-11 bg-[#F5F1EB] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-1">Description</label>
                  <textarea placeholder="Optional description..." className="w-full min-h-[60px] bg-[#F5F1EB] rounded-xl p-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 resize-none" value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} />
                </div>
              </div>
              <div className="p-6 bg-[#F5F1EB]/50 border-t border-[rgba(30,27,46,0.06)] flex justify-end gap-3">
                <button onClick={() => setShowEventForm(false)} className="px-5 py-2 text-[#8E8E93] font-bold text-[13px] hover:text-[#1E1B2E]">Cancel</button>
                <button onClick={createEvent} disabled={loading || !eventForm.title || !eventForm.startTime || !eventForm.endTime} className="px-6 py-2 bg-[#1E1B2E] text-white rounded-xl font-bold text-[13px] disabled:opacity-50">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Create"}
                </button>
              </div>
            </motion.div>
          </>
        )}
        {/* New Subject Modal */}
        {showNewSubjectForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setShowNewSubjectForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl z-50 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-[rgba(30,27,46,0.06)]">
                <h3 className="font-bold text-[18px] text-[#1E1B2E]">Create New Subject</h3>
                <p className="text-[13px] text-[#8E8E93] mt-1">A subject is a sub-section of your class with its own stream, classwork, and calendar.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-1">Subject Name *</label>
                  <input placeholder="e.g., Mathematics, Physics, English" className="w-full h-11 bg-[#F5F1EB] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={subjectForm.name} onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-1">Description (optional)</label>
                  <input placeholder="Brief description..." className="w-full h-11 bg-[#F5F1EB] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={subjectForm.description} onChange={e => setSubjectForm({ ...subjectForm, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-2">Color</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {["#C9A96E", "#2563EB", "#16A34A", "#DC2626", "#9333EA", "#EA580C", "#0891B2"].map(c => (
                      <button
                        key={c}
                        onClick={() => setSubjectForm({ ...subjectForm, color: c })}
                        className="w-8 h-8 rounded-full border-2 transition-all"
                        style={{ background: c, borderColor: subjectForm.color === c ? "#1E1B2E" : "transparent" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-[#F5F1EB]/50 border-t border-[rgba(30,27,46,0.06)] flex justify-end gap-3">
                <button onClick={() => setShowNewSubjectForm(false)} className="px-5 py-2 text-[#8E8E93] font-bold text-[13px] hover:text-[#1E1B2E]">Cancel</button>
                <button onClick={createSubject} disabled={loading || !subjectForm.name.trim()} className="px-6 py-2 bg-[#1E1B2E] text-white rounded-xl font-bold text-[13px] disabled:opacity-50 flex items-center gap-2">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create Subject
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AssignmentRow({ assignment }: { assignment: any }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-[#F5F1EB]/30 transition-colors border-b border-[rgba(30,27,46,0.04)] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[rgba(201,169,110,0.1)] flex items-center justify-center shrink-0">
          <BookOpen size={14} className="text-[#C9A96E]" />
        </div>
        <div>
          <p className="font-semibold text-[14px] text-[#1E1B2E]">{assignment.title}</p>
          <p className="text-[12px] text-[#8E8E93]">
            Due: {new Date(assignment.dueDate).toLocaleDateString()} · {assignment.points} pts · {assignment.submissions?.length || 0} submitted
          </p>
        </div>
      </div>
    </div>
  );
}

function QuizRow({ quiz, courseId, onDelete }: { quiz: any; courseId: string; onDelete: () => void }) {
  const handleDelete = async () => {
    if (!confirm("Delete this quiz?")) return;
    await fetch(`/api/classes/${courseId}/quizzes/${quiz.id}`, { method: "DELETE" });
    onDelete();
  };

  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-[#F5F1EB]/30 transition-colors border-b border-[rgba(30,27,46,0.04)] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
          <Award size={14} className="text-purple-600" />
        </div>
        <div>
          <p className="font-semibold text-[14px] text-[#1E1B2E]">{quiz.title}</p>
          <p className="text-[12px] text-[#8E8E93]">
            {quiz.dueDate && `Due: ${new Date(quiz.dueDate).toLocaleDateString()} · `} {quiz.submissions?.length || 0} submissions
          </p>
        </div>
      </div>
      <button onClick={handleDelete} className="h-8 w-8 bg-[#FEF2F2] hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-all">
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function MaterialRow({ material, courseId, onDelete }: { material: any; courseId: string; onDelete: () => void }) {
  const handleDelete = async () => {
    if (!confirm("Delete this material?")) return;
    await fetch(`/api/classes/${courseId}/materials/${material.id}`, { method: "DELETE" });
    onDelete();
  };

  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-[#F5F1EB]/30 transition-colors border-b border-[rgba(30,27,46,0.04)] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[rgba(22,163,74,0.1)] flex items-center justify-center shrink-0">
          <FileText size={14} className="text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-[14px] text-[#1E1B2E]">{material.title}</p>
          {material.fileUrl && (
            <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#C9A96E] hover:underline flex items-center gap-1">
              <Download size={11} /> Download file
            </a>
          )}
          {material.linkUrl && (
            <a href={material.linkUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] text-blue-500 hover:underline">
              Open link →
            </a>
          )}
        </div>
      </div>
      <button onClick={handleDelete} className="h-8 w-8 bg-[#FEF2F2] hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-all">
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function AssignmentForm({ form, setForm, topics, onSubmit, onCancel, loading, uploading, onUpload }: any) {
  return (
    <div className="bg-[#F5F1EB] rounded-[16px] p-5 space-y-4">
      <h4 className="font-bold text-[14px] text-[#1E1B2E] flex items-center gap-2"><BookOpen size={16} className="text-[#C9A96E]" /> New Assignment</h4>
      <input placeholder="Title *" required className="w-full h-11 bg-white rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <textarea placeholder="Instructions *" required className="w-full min-h-[80px] bg-white rounded-xl p-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 resize-y" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase text-[#8E8E93] mb-1">Due Date *</label>
          <input type="datetime-local" className="w-full h-11 bg-white rounded-xl px-4 text-[13px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-[#8E8E93] mb-1">Points</label>
          <input type="number" className="w-full h-11 bg-white rounded-xl px-4 text-[13px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={form.points} onChange={e => setForm({ ...form, points: parseInt(e.target.value) || 100 })} />
        </div>
      </div>
      <div className="relative">
        <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f, (url: string) => setForm({ ...form, fileUrl: url })); }} disabled={uploading} />
        <div className="h-11 border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl flex items-center justify-center gap-2 bg-white text-[#8E8E93] text-[13px] font-medium hover:border-[#C9A96E] transition-colors">
          {uploading ? <Loader2 size={16} className="animate-spin text-[#C9A96E]" /> : <Upload size={16} />}
          {form.fileUrl ? "Brief attached ✓" : "Attach Brief (Optional)"}
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <button onClick={onCancel} className="h-10 px-4 bg-white text-[#8E8E93] rounded-xl text-[13px] font-medium hover:text-[#1E1B2E] transition-colors"><X size={14} /></button>
        <button onClick={onSubmit} disabled={loading} className="h-10 px-6 bg-[#1E1B2E] text-white rounded-xl text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-40">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Create
        </button>
      </div>
    </div>
  );
}

function MaterialForm({ form, setForm, onSubmit, onCancel, loading, uploading, onUpload }: any) {
  return (
    <div className="bg-[#F5F1EB] rounded-[16px] p-5 space-y-4">
      <h4 className="font-bold text-[14px] text-[#1E1B2E] flex items-center gap-2"><FileText size={16} className="text-green-600" /> New Material</h4>
      <input placeholder="Title *" required className="w-full h-11 bg-white rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <textarea placeholder="Description (optional)" className="w-full min-h-[60px] bg-white rounded-xl p-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Or paste a URL link..." className="w-full h-11 bg-white rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={form.linkUrl} onChange={e => setForm({ ...form, linkUrl: e.target.value })} />
      <div className="relative">
        <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4" className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f, (url: string) => setForm({ ...form, fileUrl: url })); }} disabled={uploading} />
        <div className="h-11 border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl flex items-center justify-center gap-2 bg-white text-[#8E8E93] text-[13px] font-medium hover:border-[#C9A96E] transition-colors">
          {uploading ? <Loader2 size={16} className="animate-spin text-[#C9A96E]" /> : <Upload size={16} />}
          {form.fileUrl ? "File attached ✓" : "Upload File (Optional)"}
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <button onClick={onCancel} className="h-10 px-4 bg-white text-[#8E8E93] rounded-xl text-[13px] font-medium hover:text-[#1E1B2E] transition-colors"><X size={14} /></button>
        <button onClick={onSubmit} disabled={loading} className="h-10 px-6 bg-[#1E1B2E] text-white rounded-xl text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-40">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Post
        </button>
      </div>
    </div>
  );
}

function QuizForm({ form, setForm, onSubmit, onCancel, loading }: any) {
  const addQuestion = () => {
    setForm({ ...form, questions: [...form.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "", points: 1 }] });
  };
  const updateQuestion = (i: number, field: string, val: any) => {
    const q = [...form.questions];
    q[i][field] = val;
    setForm({ ...form, questions: q });
  };
  const updateOption = (qi: number, oi: number, val: string) => {
    const q = [...form.questions];
    q[qi].options[oi] = val;
    setForm({ ...form, questions: q });
  };

  return (
    <div className="bg-[#F5F1EB] rounded-[16px] p-5 space-y-4">
      <h4 className="font-bold text-[14px] text-[#1E1B2E] flex items-center gap-2"><Award size={16} className="text-[#C9A96E]" /> New Quiz</h4>
      <input placeholder="Quiz Title *" required className="w-full h-11 bg-white rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <textarea placeholder="Instructions (optional)" className="w-full min-h-[60px] bg-white rounded-xl p-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase text-[#8E8E93] mb-1">Due Date</label>
          <input type="datetime-local" className="w-full h-11 bg-white rounded-xl px-4 text-[13px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-[#8E8E93] mb-1">Time Limit (mins)</label>
          <input type="number" placeholder="Optional" className="w-full h-11 bg-white rounded-xl px-4 text-[13px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={form.timeLimitMinutes} onChange={e => setForm({ ...form, timeLimitMinutes: e.target.value })} />
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-[rgba(30,27,46,0.1)]">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-bold text-[13px] text-[#1E1B2E]">Questions</h5>
          <button onClick={addQuestion} className="px-3 py-1.5 bg-white text-[#1E1B2E] rounded-lg text-[11px] font-bold hover:bg-[#C9A96E] hover:text-white transition-all">+ Add Question</button>
        </div>
        
        {form.questions.map((q: any, i: number) => (
          <div key={i} className="mb-4 bg-white p-4 rounded-xl space-y-3 shadow-[0_2px_10px_rgba(30,27,46,0.02)]">
            <div className="flex gap-2">
              <input placeholder={`Question ${i + 1}`} className="flex-1 h-10 bg-[#F5F1EB] rounded-lg px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={q.questionText} onChange={e => updateQuestion(i, "questionText", e.target.value)} />
              <input type="number" placeholder="Pts" className="w-16 h-10 bg-[#F5F1EB] rounded-lg px-2 text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40" value={q.points} onChange={e => updateQuestion(i, "points", parseInt(e.target.value) || 1)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt: string, oi: number) => (
                <div key={oi} className="flex items-center gap-2">
                  <input type="radio" name={`correct-${i}`} checked={q.correctAnswer === opt && opt !== ""} onChange={() => updateQuestion(i, "correctAnswer", opt)} className="w-4 h-4 accent-[#C9A96E]" />
                  <input placeholder={`Option ${oi + 1}`} className="w-full h-9 bg-[#F5F1EB]/50 rounded-lg px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#C9A96E]/40" value={opt} onChange={e => updateOption(i, oi, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <button onClick={onCancel} className="h-10 px-4 bg-white text-[#8E8E93] rounded-xl text-[13px] font-medium hover:text-[#1E1B2E] transition-colors"><X size={14} /></button>
        <button onClick={onSubmit} disabled={loading || form.questions.length === 0} className="h-10 px-6 bg-[#1E1B2E] text-white rounded-xl text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-40">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Create Quiz
        </button>
      </div>
    </div>
  );
}
