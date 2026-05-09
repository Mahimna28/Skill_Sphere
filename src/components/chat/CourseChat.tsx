"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Send, MessageSquare } from "lucide-react";

let socket: Socket;

export default function CourseChat({ courseId, currentUser }: { courseId: string, currentUser: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Connect to Socket.IO server
    socket = io();

    socket.emit("join_course", courseId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [courseId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msgData = {
      courseId,
      text: input,
      senderId: currentUser?.id || "guest",
      senderName: currentUser?.name || "Student",
      createdAt: new Date().toISOString()
    };

    socket.emit("send_message", msgData);
    
    // In a real app, you would also save to the database here via API
    try {
       await fetch("/api/chat", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(msgData)
       });
    } catch(err) { console.error("Failed to save to db"); }

    setInput("");
  };

  return (
    <Card className="flex flex-col h-[600px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b-2 border-black bg-white">
        <CardTitle className="flex items-center gap-2 text-xl font-black">
          <MessageSquare /> Live Discussion
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground font-medium">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex flex-col max-w-[80%] ${msg.senderId === currentUser?.id ? 'self-end items-end ml-auto' : 'self-start items-start'}`}>
              <span className="text-xs font-bold text-muted-foreground mb-1">{msg.senderName}</span>
              <div className={`p-3 rounded-xl border-2 border-black font-medium ${msg.senderId === currentUser?.id ? 'bg-primary text-white rounded-br-none' : 'bg-white rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter className="p-4 border-t-2 border-black bg-white">
        <form onSubmit={sendMessage} className="flex w-full gap-2">
          <Input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 border-2 border-black"
          />
          <Button type="submit" className="neo-brutalism bg-primary text-white font-bold h-10 px-4">
            <Send size={18} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
