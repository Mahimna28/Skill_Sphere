"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Send, MessageSquare } from "lucide-react";

let socket: Socket;

interface Props {
  enrollments: { course: { id: string; title: string; subject: string } }[];
  currentUser: { id: string; name: string };
}

export default function StudentChatClient({ enrollments, currentUser }: Props) {
  const [activeCourse, setActiveCourse] = useState(enrollments[0]?.course || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket = io();
    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    if (!activeCourse) return;
    socket.emit("join_course", activeCourse.id);
    
    // Fetch chat history
    fetch(`/api/chat/messages?courseId=${activeCourse.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch messages", err);
        setMessages([]);
      });

    socket.off("receive_message");
    socket.on("receive_message", (data) => {
      if (data.courseId === activeCourse.id) {
        setMessages((prev) => [...prev, data]);
      }
    });
  }, [activeCourse]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeCourse) return;
    
    const textToSend = input;
    setInput(""); // Optimistically clear input

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: activeCourse.id, text: textToSend }),
      });
      
      const data = await res.json();
      if (res.ok && data.savedMessage) {
        socket.emit("send_message", data.savedMessage);
      } else {
        console.error("Failed to save message", data);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="md:col-span-1 border-4 border-black rounded-xl p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-black text-lg mb-4 border-b-2 border-black pb-2">My Course Rooms</h3>
        <div className="space-y-2">
          {enrollments.map((enr) => (
            <button
              key={enr.course.id}
              onClick={() => setActiveCourse(enr.course)}
              className={`w-full text-left p-3 rounded-lg border-2 border-black font-bold cursor-pointer transition-all hover:translate-x-1 ${
                activeCourse?.id === enr.course.id
                  ? "bg-primary text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white hover:bg-muted"
              }`}
            >
              <div className="text-sm font-black truncate">{enr.course.title}</div>
              <div className="text-xs opacity-70 mt-0.5">{enr.course.subject}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="md:col-span-3">
        <Card className="flex flex-col h-[600px] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <CardHeader className="border-b-2 border-black bg-white shrink-0">
            <CardTitle className="flex items-center gap-2 text-xl font-black">
              <MessageSquare className="text-primary" />
              {activeCourse?.title || "Select a course"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-3 opacity-20" />
                <p className="font-bold text-lg">No messages yet</p>
                <p className="font-medium text-sm">Start the conversation for <span className="font-black text-black">{activeCourse?.title}</span>!</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[80%] ${msg.senderId === currentUser.id ? "self-end items-end ml-auto" : "self-start items-start"}`}
                >
                  <span className="text-xs font-bold text-muted-foreground mb-1">{msg.senderName}</span>
                  <div
                    className={`p-3 rounded-xl border-2 border-black font-medium text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                      msg.senderId === currentUser.id
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </CardContent>
          <CardFooter className="p-4 border-t-2 border-black bg-white shrink-0">
            <form onSubmit={sendMessage} className="flex w-full gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border-2 border-black"
              />
              <Button type="submit" className="neo-brutalism bg-primary text-white font-bold h-10 px-4">
                <Send size={18} />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
