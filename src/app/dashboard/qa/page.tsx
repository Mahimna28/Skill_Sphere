"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Send, PlusCircle, HelpCircle, CheckCircle2, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QAPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAsk, setShowAsk] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok) {
        setUserId(data.user.id);
        setUserRole(data.user.role);
      }
    } catch (err) {}
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/qa");
      const data = await res.json();
      if (res.ok) setQuestions(data.questions);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        setShowAsk(false);
        fetchQuestions();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswer = async (questionId: string) => {
    if (!answerContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/qa/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: answerContent, questionId }),
      });
      if (res.ok) {
        setAnswerContent("");
        fetchQuestions();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(`/api/qa?id=${questionId}`, { method: "DELETE" });
      if (res.ok) fetchQuestions();
    } catch (err) {}
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
            <HelpCircle className="text-primary" size={36} /> Community Q&A
          </h1>
          <p className="text-muted-foreground font-bold text-lg mt-1">Ask questions and share knowledge with peers and teachers.</p>
        </div>
        <Button onClick={() => setShowAsk(!showAsk)} className="neo-brutalism bg-primary text-white font-black h-12 px-6">
          <PlusCircle className="mr-2" /> Ask Question
        </Button>
      </div>

      {showAsk && (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-primary/5 border-b-4 border-black">
            <CardTitle className="font-black uppercase tracking-tight text-xl">Ask the Community</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest opacity-60">Question Title</label>
              <Input 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)}
                placeholder="What is your question about?" 
                className="h-12 border-2 border-black font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest opacity-60">Details</label>
              <textarea 
                value={newContent} 
                onChange={e => setNewContent(e.target.value)}
                placeholder="Describe your problem in detail..." 
                className="w-full h-32 p-3 border-2 border-black rounded-xl font-bold text-sm"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleAsk} disabled={submitting} className="neo-brutalism bg-primary text-white font-black px-8">
                {submitting ? "Posting..." : "Post Question"}
              </Button>
              <Button onClick={() => setShowAsk(false)} variant="outline" className="border-2 border-black font-black">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20 font-black text-2xl opacity-20 animate-pulse">Loading community wisdom...</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 border-4 border-dashed border-black rounded-[2.5rem]">
            <p className="font-black text-xl opacity-40">No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          questions.map((q) => (
            <Card key={q.id} className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[2rem] overflow-hidden group">
              <CardContent className="p-0">
                <div 
                  className="p-6 md:p-8 cursor-pointer hover:bg-muted/5 transition-colors"
                  onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border-2 border-black rounded-full bg-accent flex items-center justify-center font-black">
                        {q.author.image ? <img src={q.author.image} className="w-full h-full rounded-full object-cover" /> : q.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase leading-none">{q.author.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">
                          @{q.author.username || "user"} • {q.author.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="px-3 py-1 bg-secondary/20 border-2 border-black rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                         <MessageSquare size={12} /> {q._count.answers} Answers
                       </div>
                       {expandedId === q.id ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-3 leading-tight">{q.title}</h3>
                  <p className="text-muted-foreground font-medium text-sm line-clamp-2">{q.content}</p>
                </div>

                {expandedId === q.id && (
                  <div className="border-t-4 border-black bg-primary/5 p-6 md:p-8 space-y-6">
                    <div className="bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                       <p className="text-sm font-bold leading-relaxed">{q.content}</p>
                       <p className="text-[10px] font-black mt-4 opacity-40 uppercase">Posted on {new Date(q.createdAt).toLocaleDateString()}</p>
                       
                       {(q.authorId === userId || userRole === "admin") && (
                         <Button 
                           onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }}
                           variant="ghost" 
                           className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-2 h-auto rounded-lg"
                         >
                           <Trash2 size={18} />
                         </Button>
                       )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" /> Answers
                      </h4>
                      {q.answers.map((a: any) => (
                        <div key={a.id} className="flex gap-3">
                           <div className="w-8 h-8 border-2 border-black rounded-full bg-white flex items-center justify-center font-black text-xs shrink-0">
                             {a.author.name.charAt(0)}
                           </div>
                           <div className="bg-white border-2 border-black p-4 rounded-xl flex-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-[10px] font-black uppercase">{a.author.name} <span className="opacity-40 font-bold ml-2">({a.author.role})</span></p>
                                <p className="text-[9px] font-bold opacity-40">{new Date(a.createdAt).toLocaleDateString()}</p>
                              </div>
                              <p className="text-sm font-medium">{a.content}</p>
                           </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                       <Input 
                         value={answerContent}
                         onChange={e => setAnswerContent(e.target.value)}
                         placeholder="Write your answer..." 
                         className="flex-1 border-2 border-black font-bold h-12"
                       />
                       <Button onClick={() => handleAnswer(q.id)} disabled={submitting || !answerContent.trim()} className="neo-brutalism bg-primary text-white font-black px-6">
                         <Send size={18} className="mr-2" /> Answer
                       </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
