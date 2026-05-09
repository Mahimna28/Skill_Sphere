"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Calendar, Bug, Lightbulb, Heart, Shield } from "lucide-react";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      if (res.ok) setFeedbacks(data.feedbacks);
    } finally {
      setLoading(false);
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "bug": return "bg-red-100 text-red-700 border-red-200";
      case "suggestion": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug": return <Bug size={14} />;
      case "suggestion": return <Lightbulb size={14} />;
      default: return <Heart size={14} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-black text-white p-8 rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
            <Shield className="text-primary" /> User Feedback Vault
          </h1>
          <p className="font-bold opacity-60 mt-1">Review bug reports and suggestions from the community.</p>
        </div>
        <div className="bg-primary/20 px-6 py-3 rounded-2xl border-2 border-primary/40 font-black">
          {feedbacks.length} ENTRIES
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-20 font-black text-2xl opacity-20">Accessing secure feedback logs...</div>
        ) : feedbacks.length === 0 ? (
          <div className="col-span-2 text-center py-20 border-4 border-dashed border-black rounded-[2.5rem]">
            <p className="font-black text-xl opacity-40">No feedback received yet.</p>
          </div>
        ) : (
          feedbacks.map((f) => (
            <Card key={f.id} className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-[2rem] overflow-hidden hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
              <CardHeader className="border-b-2 border-black bg-muted/10 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center font-black text-xs">
                      {f.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase leading-none">{f.user.name}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">{f.user.email}</p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 border-2 border-black rounded-full text-[8px] font-black uppercase flex items-center gap-1.5 ${getTypeStyle(f.type)} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                    {getTypeIcon(f.type)} {f.type}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm font-bold leading-relaxed italic">"{f.content}"</p>
                <div className="flex items-center justify-between pt-4 border-t-2 border-black/5">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground">
                    <Calendar size={12} /> {new Date(f.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded-md uppercase">
                    {f.user.role}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
