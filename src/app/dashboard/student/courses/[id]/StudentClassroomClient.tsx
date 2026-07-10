"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BookOpen, Users, Rss, FileText, MessageSquare, Send, Check, Loader2, Download, CheckCheck, Upload, AlertCircle, X, Clock, Star, Award
} from "lucide-react";

type Tab = "stream" | "classwork" | "calendar" | "people";

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

export default function StudentClassroomClient({ course, studentId }: { course: any, studentId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("stream");
  const [loading, setLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Reply state
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // Submission state
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [submissionFile, setSubmissionFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizTimeLeft, setQuizTimeLeft] = useState<number | null>(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  const postReply = async (questionId: string) => {
    const text = replyText[questionId];
    if (!text?.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/classes/${course.id}/questions/${questionId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text })
      });
      setReplyText(prev => ({ ...prev, [questionId]: "" }));
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setQuizAnswers({});
    if (quiz.timeLimitMinutes) {
      setQuizTimeLeft(quiz.timeLimitMinutes * 60);
    } else {
      setQuizTimeLeft(null);
    }
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    setQuizSubmitting(true);
    try {
      await fetch(`/api/classes/${course.id}/quizzes/${activeQuiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: quizAnswers })
      });
      setActiveQuiz(null);
      setQuizAnswers({});
      router.refresh();
    } finally {
      setQuizSubmitting(false);
    }
  };

  useEffect(() => {
    if (quizTimeLeft === null || quizTimeLeft <= 0 || !activeQuiz) return;
    const timer = setInterval(() => {
      setQuizTimeLeft(prev => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev! - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizTimeLeft, activeQuiz]);

  const filterBySubject = (items: any[]) =>
    selectedSubjectId ? items.filter((i: any) => i.subjectId === selectedSubjectId) : items;

  const allAssignments = course.assignments || [];
  const allTopics = course.topics || [];
  const allQuestions = course.questions || [];
  const allAnnouncements = course.announcements || [];
  const allQuizzes = course.quizzes || [];

  const assignments = filterBySubject(allAssignments);
  const topics = selectedSubjectId
    ? allTopics.filter((t: any) => t.subjectId === selectedSubjectId)
    : allTopics;

  // Build unified stream
  const stream = [
    ...filterBySubject(allAnnouncements).map((a: any) => ({ ...a, _type: "announcement" })),
    ...filterBySubject(allAssignments).map((a: any) => ({ ...a, _type: "assignment" })),
    ...filterBySubject(course.materials || []).map((m: any) => ({ ...m, _type: "material" })),
    ...filterBySubject(allQuestions).map((q: any) => ({ ...q, _type: "question" })),
    ...filterBySubject(allQuizzes).map((q: any) => ({ ...q, _type: "quiz" })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setSubmissionFile(data.url);
    } finally {
      setUploading(false);
    }
  };

  const submitAssignment = async () => {
    if (!selectedAssignment) return;
    setSubmitting(true);
    try {
      await fetch(`/api/assignments/${selectedAssignment.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: submissionContent, fileUrl: submissionFile })
      });
      setSelectedAssignment(null);
      setSubmissionContent("");
      setSubmissionFile("");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const students = course.enrollments?.map((e: any) => e.user) || [];

  const TABS = [
    { id: "stream", label: "Stream", icon: Rss },
    { id: "classwork", label: "Classwork", icon: BookOpen },
    { id: "calendar", label: "Calendar", icon: Clock },
    { id: "people", label: "People", icon: Users },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F1EB] font-sans text-[#1E1B2E]">
      {/* Header */}
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] text-white px-8 py-6 mx-4 mt-4 rounded-[24px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-[#C9A96E] mb-1">{course.subject}</p>
            <h1 className="font-heading text-[32px] leading-tight">{course.title}</h1>
            {course.section && <p className="text-white/60 text-sm mt-1">Section: {course.section}</p>}
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-[18px] mb-2 border border-white/20">
              {course.teacher?.name?.[0]?.toUpperCase()}
            </div>
            <p className="text-[13px] text-white/60">{course.teacher?.name}</p>
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
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 p-8">
        <AnimatePresence mode="wait">

          {/* ═══════════════════════════════ STREAM TAB ═══════════════════════════════ */}
          {activeTab === "stream" && (
            <motion.div key="stream" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-6">

              {stream.length === 0 && (
                <div className="text-center py-16 text-[#8E8E93]">
                  <Rss size={40} className="mx-auto opacity-20 mb-3" />
                  <p className="font-medium">No posts from your teacher yet.</p>
                </div>
              )}

              {stream.map((item: any) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden cursor-pointer"
                  onClick={() => {
                    if (item._type === "assignment") {
                      setSelectedAssignment(item);
                      setSubmissionContent(item.submissions?.[0]?.content || "");
                      setSubmissionFile(item.submissions?.[0]?.fileUrl || "");
                    } else if (item._type === "quiz") {
                      startQuiz(item);
                    }
                  }}
                >
                  {/* Type indicator */}
                  <div className={`px-6 py-3 flex items-center gap-2 border-b border-[rgba(30,27,46,0.04)] ${
                    item._type === "assignment" ? "bg-[rgba(201,169,110,0.06)]" :
                    item._type === "quiz" ? "bg-purple-50" :
                    item._type === "question" ? "bg-[rgba(37,99,235,0.04)]" :
                    item._type === "material" ? "bg-[rgba(22,163,74,0.04)]" : "bg-white"
                  }`}>
                    {item._type === "assignment" && <><BookOpen size={14} className="text-[#C9A96E]" /><span className="text-[11px] font-bold text-[#C9A96E] uppercase tracking-wider">Assignment</span></>}
                    {item._type === "quiz" && <><Award size={14} className="text-purple-600" /><span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Quiz</span></>}
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
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-4 text-[12px] text-[#8E8E93]">
                          <span className="flex items-center gap-1"><Clock size={12} /> Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Star size={12} /> {item.points} pts</span>
                        </div>
                        <StatusBadge status={item.submissions?.[0]?.status || (new Date(item.dueDate) < new Date() ? "missing" : "assigned")} />
                      </div>
                    )}
                    {item.content && <p className="text-[14px] text-[#8E8E93] mt-2 leading-relaxed">{item.content}</p>}
                    {item.description && <p className="text-[14px] text-[#8E8E93] mt-2 leading-relaxed">{item.description}</p>}
                    {item.fileUrl && (
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="mt-3 inline-flex items-center gap-2 text-[12px] text-[#C9A96E] font-medium hover:underline">
                        <Download size={14} /> View Attached File
                      </a>
                    )}

                    {/* Question Replies */}
                    {item._type === "question" && (
                      <div className="mt-4 space-y-3" onClick={e => e.stopPropagation()}>
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
                          <button onClick={() => postReply(item.id)} disabled={loading} className="w-9 h-9 bg-[#1E1B2E] rounded-xl flex items-center justify-center disabled:opacity-40">
                            {loading ? <Loader2 size={12} className="text-white animate-spin" /> : <Send size={14} className="text-white" />}
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

              {/* Uncategorized assignments */}
              {assignments.filter((a: any) => !a.topicId).length > 0 && (
                <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[rgba(30,27,46,0.05)]">
                    <h3 className="font-semibold text-[14px] text-[#8E8E93] uppercase tracking-wider">No Topic</h3>
                  </div>
                  {assignments.filter((a: any) => !a.topicId).map((a: any) => (
                    <AssignmentRow key={a.id} assignment={a} onClick={() => {
                      setSelectedAssignment(a);
                      setSubmissionContent(a.submissions?.[0]?.content || "");
                      setSubmissionFile(a.submissions?.[0]?.fileUrl || "");
                    }} />
                  ))}
                </div>
              )}

              {topics.map((topic: any) => (
                <div key={topic.id} className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[rgba(30,27,46,0.05)]">
                    <h3 className="font-bold text-[16px] text-[#1E1B2E]">{topic.title}</h3>
                  </div>

                  {topic.assignments?.map((a: any) => (
                    <AssignmentRow key={a.id} assignment={a} onClick={() => {
                      setSelectedAssignment(a);
                      setSubmissionContent(a.submissions?.[0]?.content || "");
                      setSubmissionFile(a.submissions?.[0]?.fileUrl || "");
                    }} />
                  ))}
                  {topic.quizzes?.map((q: any) => (
                    <QuizRow key={q.id} quiz={q} onClick={() => startQuiz(q)} />
                  ))}
                  {topic.materials?.map((m: any) => (
                    <MaterialRow key={m.id} material={m} />
                  ))}
                  {(topic.assignments?.length || 0) + (topic.quizzes?.length || 0) + (topic.materials?.length || 0) === 0 && (
                    <p className="px-6 py-4 text-[13px] text-[#8E8E93]">No items in this topic.</p>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* ═══════════════════════════════ CALENDAR TAB ═══════════════════════════════ */}
          {activeTab === "calendar" && (
            <motion.div key="calendar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(30,27,46,0.05)]">
                  <h3 className="font-bold text-[18px] text-[#1E1B2E]">Class Calendar</h3>
                  <p className="text-[13px] text-[#8E8E93] mt-0.5">Upcoming events, quizzes, and assignments</p>
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

          {/* ═══════════════════════════════ PEOPLE TAB ═══════════════════════════════ */}
          {activeTab === "people" && (
            <motion.div key="people" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-6">

              {/* Teachers */}
              <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(30,27,46,0.05)]">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93]">Teachers</h3>
                </div>
                <div className="divide-y divide-[rgba(30,27,46,0.04)]">
                  {/* Primary Teacher */}
                  <div className="px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] flex items-center justify-center text-white font-bold text-[18px] shrink-0">
                      {course.teacher?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[16px] text-[#1E1B2E]">{course.teacher?.name || "Teacher"}</p>
                      <p className="text-[13px] text-[#8E8E93]">{course.teacher?.email} • Primary Teacher</p>
                    </div>
                  </div>
                  {/* Co-Teachers */}
                  {course.coTeachers?.map((teacher: any) => (
                    <div key={teacher.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#F5F1EB]/30 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-[#F5F1EB] flex items-center justify-center text-[#1E1B2E] font-bold text-[18px] shrink-0">
                        {teacher.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-[16px] text-[#1E1B2E]">{teacher.name}</p>
                        <p className="text-[13px] text-[#8E8E93]">{teacher.email} • Co-Teacher</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Classmates */}
              <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,27,46,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgba(30,27,46,0.05)] flex items-center justify-between">
                  <h3 className="font-bold text-[16px] text-[#1E1B2E]">Classmates</h3>
                  <span className="bg-[#F5F1EB] px-3 py-1 rounded-lg text-[12px] font-bold text-[#8E8E93]">{students.length} students</span>
                </div>
                {students.length === 0 ? (
                  <div className="p-8 text-center text-[#8E8E93]">
                    <Users size={32} className="mx-auto opacity-20 mb-2" />
                    <p>No other students yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[rgba(30,27,46,0.04)]">
                    {students.map((student: any) => (
                      <div key={student.id} className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F5F1EB] flex items-center justify-center text-[14px] font-bold text-[#1E1B2E] shrink-0">
                          {student.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[14px] text-[#1E1B2E]">{student.name}</p>
                          {student.id === studentId && <span className="text-[11px] text-[#8E8E93]">You</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Assignment Drawer */}
      <AnimatePresence>
        {selectedAssignment && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setSelectedAssignment(null)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[rgba(30,27,46,0.06)] flex items-center justify-between shrink-0 bg-[#F5F1EB]/50">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93]">Assignment Details</p>
                  <h3 className="font-heading text-[20px] text-[#1E1B2E] mt-0.5 pr-8">{selectedAssignment.title}</h3>
                </div>
                <button onClick={() => setSelectedAssignment(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-[#8E8E93] hover:text-[#1E1B2E] transition-colors shrink-0">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Details */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] font-bold text-[#C9A96E] bg-[rgba(201,169,110,0.1)] px-3 py-1 rounded-full uppercase tracking-wider">{selectedAssignment.points} Points</span>
                    <span className="text-[12px] text-[#8E8E93] font-medium flex items-center gap-1"><Clock size={12} /> Due {new Date(selectedAssignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[14px] text-[#1E1B2E] leading-relaxed whitespace-pre-wrap">{selectedAssignment.description}</p>
                  {selectedAssignment.fileUrl && (
                    <a href={selectedAssignment.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-2 p-3 bg-[#F5F1EB] rounded-xl text-[13px] text-[#1E1B2E] font-medium hover:bg-[#EBE5DA] transition-colors w-fit border border-[rgba(30,27,46,0.05)]">
                      <Download size={14} className="text-[#C9A96E]" /> Download Brief
                    </a>
                  )}
                </div>

                <div className="w-full h-px bg-[rgba(30,27,46,0.06)]" />

                {/* Submission Area */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-[16px] text-[#1E1B2E]">Your Work</h4>
                    <StatusBadge status={selectedAssignment.submissions?.[0]?.status || (new Date(selectedAssignment.dueDate) < new Date() ? "missing" : "assigned")} />
                  </div>

                  {selectedAssignment.submissions?.[0]?.status === "graded" ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-[rgba(22,163,74,0.05)] rounded-xl border border-green-500/10">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-green-600 mb-1">Grade</p>
                        <p className="font-bold text-[24px] text-[#1E1B2E]">{selectedAssignment.submissions[0].grade} <span className="text-[14px] text-[#8E8E93] font-medium">/ {selectedAssignment.points}</span></p>
                      </div>
                      {selectedAssignment.submissions[0].feedback && (
                        <div className="p-4 bg-[#F5F1EB] rounded-xl">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-1">Teacher Feedback</p>
                          <p className="text-[14px] text-[#1E1B2E]">{selectedAssignment.submissions[0].feedback}</p>
                        </div>
                      )}
                      <div className="p-4 bg-[#F5F1EB] rounded-xl opacity-70">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-1">Your Submission</p>
                        <p className="text-[14px] text-[#1E1B2E]">{selectedAssignment.submissions[0].content}</p>
                        {selectedAssignment.submissions[0].fileUrl && <a href={selectedAssignment.submissions[0].fileUrl} target="_blank" className="text-[#C9A96E] text-[12px] hover:underline mt-1 inline-block">Attached File</a>}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        placeholder="Write your answer or add notes here..."
                        className="w-full min-h-[120px] bg-[#F5F1EB] rounded-xl p-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 resize-none border border-transparent focus:border-[#C9A96E]/20"
                        value={submissionContent}
                        onChange={e => setSubmissionContent(e.target.value)}
                      />
                      
                      <div className="relative">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} disabled={uploading} />
                        <div className="h-[52px] border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl flex items-center justify-center gap-2 bg-white text-[#8E8E93] text-[13px] font-medium hover:border-[#C9A96E] transition-colors">
                          {uploading ? <Loader2 size={16} className="animate-spin text-[#C9A96E]" /> : <Upload size={16} />}
                          {submissionFile ? "File attached ✓" : "Upload File"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedAssignment.submissions?.[0]?.status !== "graded" && (
                <div className="p-6 border-t border-[rgba(30,27,46,0.06)] shrink-0 bg-white">
                  <button
                    onClick={submitAssignment}
                    disabled={submitting || (!submissionContent && !submissionFile)}
                    className="w-full h-[52px] bg-[#1E1B2E] hover:bg-[#C9A96E] text-white hover:text-[#1E1B2E] rounded-xl font-bold uppercase tracking-wider text-[13px] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> {selectedAssignment.submissions?.[0] ? "Resubmit" : "Turn In"}</>}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quiz Drawer */}
      <AnimatePresence>
        {activeQuiz && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#F5F1EB] z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[rgba(30,27,46,0.06)] bg-white flex items-center justify-between shrink-0">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-purple-600">Quiz</p>
                  <h3 className="font-heading text-[24px] text-[#1E1B2E] mt-0.5">{activeQuiz.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  {quizTimeLeft !== null && (
                    <div className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold flex items-center gap-2">
                      <Clock size={16} />
                      {Math.floor(quizTimeLeft / 60)}:{(quizTimeLeft % 60).toString().padStart(2, "0")}
                    </div>
                  )}
                  {activeQuiz.submissions?.[0] ? (
                    <button onClick={() => setActiveQuiz(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#8E8E93]">
                      <X size={20} />
                    </button>
                  ) : (
                    <button onClick={() => setActiveQuiz(null)} className="text-[13px] font-bold text-[#8E8E93] hover:text-[#1E1B2E]">Cancel</button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {activeQuiz.description && (
                  <p className="text-[15px] text-[#1E1B2E] bg-white p-6 rounded-2xl shadow-sm">{activeQuiz.description}</p>
                )}

                {activeQuiz.submissions?.[0] ? (
                  <div className="bg-white p-8 rounded-2xl text-center space-y-4">
                    <CheckCheck size={48} className="mx-auto text-green-500" />
                    <h4 className="text-[20px] font-bold text-[#1E1B2E]">Quiz Submitted</h4>
                    <p className="text-[#8E8E93]">Your answers have been recorded.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activeQuiz.questions?.map((q: any, i: number) => (
                      <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-[16px] font-bold text-[#1E1B2E]"><span className="text-[#C9A96E] mr-2">{i + 1}.</span>{q.questionText}</h4>
                          <span className="text-[12px] font-bold text-[#8E8E93] bg-[#F5F1EB] px-2 py-1 rounded-md">{q.points} pts</span>
                        </div>
                        <div className="space-y-3">
                          {q.options.map((opt: string, oi: number) => (
                            <label key={oi} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${quizAnswers[q.id] === opt ? "border-[#C9A96E] bg-[rgba(201,169,110,0.05)]" : "border-[rgba(30,27,46,0.05)] hover:border-[rgba(30,27,46,0.1)]"}`}>
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                value={opt}
                                checked={quizAnswers[q.id] === opt}
                                onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                className="w-4 h-4 accent-[#C9A96E]"
                              />
                              <span className="text-[14px] text-[#1E1B2E]">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!activeQuiz.submissions?.[0] && (
                <div className="p-6 bg-white border-t border-[rgba(30,27,46,0.06)] shrink-0">
                  <button
                    onClick={submitQuiz}
                    disabled={quizSubmitting || Object.keys(quizAnswers).length < activeQuiz.questions?.length}
                    className="w-full h-14 bg-[#1E1B2E] hover:bg-[#C9A96E] text-white hover:text-[#1E1B2E] rounded-xl font-bold uppercase tracking-wider text-[14px] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {quizSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Submit Quiz"}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AssignmentRow({ assignment, onClick }: { assignment: any; onClick: () => void }) {
  const isPastDue = new Date(assignment.dueDate) < new Date();
  const subStatus = assignment.submissions?.[0]?.status;
  const status = subStatus || (isPastDue ? "missing" : "assigned");

  return (
    <div onClick={onClick} className="px-6 py-4 flex items-center justify-between hover:bg-[#F5F1EB]/50 transition-colors border-b border-[rgba(30,27,46,0.04)] last:border-0 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${status === "graded" ? "bg-green-100" : "bg-[rgba(201,169,110,0.1)]"}`}>
          <BookOpen size={16} className={status === "graded" ? "text-green-600" : "text-[#C9A96E]"} />
        </div>
        <div>
          <p className="font-bold text-[15px] text-[#1E1B2E] mb-0.5">{assignment.title}</p>
          <p className="text-[12px] text-[#8E8E93] font-medium">
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}

function MaterialRow({ material }: { material: any }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-[#F5F1EB]/30 transition-colors border-b border-[rgba(30,27,46,0.04)] last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[rgba(22,163,74,0.1)] flex items-center justify-center shrink-0">
          <FileText size={16} className="text-green-600" />
        </div>
        <div>
          <p className="font-bold text-[15px] text-[#1E1B2E] mb-0.5">{material.title}</p>
          <div className="flex items-center gap-3">
            {material.fileUrl && (
              <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#C9A96E] font-medium hover:underline flex items-center gap-1">
                <Download size={12} /> View File
              </a>
            )}
            {material.linkUrl && (
              <a href={material.linkUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] text-blue-500 font-medium hover:underline">
                Open Link →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizRow({ quiz, onClick }: { quiz: any; onClick: () => void }) {
  const isPastDue = quiz.dueDate && new Date(quiz.dueDate) < new Date();
  const subStatus = quiz.submissions?.[0]?.id ? "turned_in" : null;
  const status = subStatus || (isPastDue ? "missing" : "assigned");

  return (
    <div onClick={onClick} className="px-6 py-4 flex items-center justify-between hover:bg-[#F5F1EB]/50 transition-colors border-b border-[rgba(30,27,46,0.04)] last:border-0 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${status === "turned_in" ? "bg-green-100" : "bg-purple-100"}`}>
          <BookOpen size={16} className={status === "turned_in" ? "text-green-600" : "text-purple-600"} />
        </div>
        <div>
          <p className="font-bold text-[15px] text-[#1E1B2E] mb-0.5">{quiz.title}</p>
          <p className="text-[12px] text-[#8E8E93] font-medium">
            {quiz.dueDate ? `Due: ${new Date(quiz.dueDate).toLocaleDateString()}` : "No due date"}
          </p>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}
