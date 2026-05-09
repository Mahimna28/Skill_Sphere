"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Heart, Bug, Lightbulb, CheckCircle2 } from "lucide-react";

export default function FeedbackPage() {
  const [content, setContent] = useState("");
  const [type, setType] = useState("suggestion");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type }),
      });
      if (res.ok) {
        setSubmitted(true);
        setContent("");
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 border-4 border-black rounded-full flex items-center justify-center mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CheckCircle2 className="text-green-600" size={48} />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter">Thank You!</h2>
        <p className="text-xl font-bold text-muted-foreground">Your feedback has been sent to the administrators. We appreciate your help in making Skill Sphere better.</p>
        <Button onClick={() => setSubmitted(false)} className="neo-brutalism bg-primary text-white font-black px-10 h-14">Send More Feedback</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-black uppercase tracking-tighter flex items-center justify-center gap-4">
          <MessageSquare className="text-primary" size={48} /> Help Us Improve
        </h1>
        <p className="text-xl font-bold text-muted-foreground">Found a bug? Have a suggestion? Let our team know!</p>
      </div>

      <Card className="border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-primary/5 border-b-4 border-black p-8">
          <CardTitle className="font-black uppercase tracking-tight text-2xl">Feedback Form</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => setType("bug")}
              className={`p-6 border-4 border-black rounded-2xl flex flex-col items-center gap-3 transition-all ${type === "bug" ? "bg-red-100 shadow-none translate-x-1 translate-y-1" : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"}`}
            >
              <Bug className={type === "bug" ? "text-red-600" : "text-muted-foreground"} />
              <span className="font-black uppercase text-xs">Bug Report</span>
            </button>
            <button 
              onClick={() => setType("suggestion")}
              className={`p-6 border-4 border-black rounded-2xl flex flex-col items-center gap-3 transition-all ${type === "suggestion" ? "bg-blue-100 shadow-none translate-x-1 translate-y-1" : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"}`}
            >
              <Lightbulb className={type === "suggestion" ? "text-blue-600" : "text-muted-foreground"} />
              <span className="font-black uppercase text-xs">Suggestion</span>
            </button>
            <button 
              onClick={() => setType("other")}
              className={`p-6 border-4 border-black rounded-2xl flex flex-col items-center gap-3 transition-all ${type === "other" ? "bg-accent/20 shadow-none translate-x-1 translate-y-1" : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"}`}
            >
              <Heart className={type === "other" ? "text-primary" : "text-muted-foreground"} />
              <span className="font-black uppercase text-xs">Other</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest opacity-60">Your Message</label>
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Tell us what's on your mind..."
              className="w-full h-48 p-4 border-4 border-black rounded-2xl font-bold text-lg resize-none"
              required
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={loading || !content.trim()} 
            className="w-full h-16 text-xl font-black neo-brutalism bg-primary text-white"
          >
            {loading ? "Sending..." : <><Send className="mr-3" /> Submit Feedback</>}
          </Button>
        </CardContent>
      </Card>

      <div className="bg-accent/10 border-4 border-black border-dashed rounded-[2rem] p-8 text-center">
        <p className="font-bold text-sm text-muted-foreground">
          Note: Your feedback will be reviewed by our administration team. For urgent technical support, please use the direct chat system.
        </p>
      </div>
    </div>
  );
}
