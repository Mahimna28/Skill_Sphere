import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare } from "lucide-react";
import StudentChatClient from "./StudentChatClient";

export default async function StudentChatPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  let enrollments: any[] = [];
  let user: any = null;

  if (decoded?.id) {
    user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { id: true, name: true } });
    enrollments = await prisma.enrollment.findMany({
      where: { userId: decoded.id },
      include: { course: { select: { id: true, title: true, subject: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <MessageSquare size={32} />
          </div>
          Course Chat
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Discuss course material in real-time with your peers.
        </p>
      </div>

      {enrollments.length === 0 ? (
        /* Not enrolled in any courses — show empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center border-4 border-dashed border-gray-300 rounded-2xl bg-white">
          <div className="w-20 h-20 bg-muted border-4 border-black rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-black mb-3">No Course Chats Yet</h2>
          <p className="text-muted-foreground font-medium text-lg max-w-md mb-8">
            You need to join a course first before you can chat with other students and your teacher.
          </p>
          <Link href="/dashboard/student/courses">
            <Button className="neo-brutalism font-bold text-lg px-8 h-12">
              <BookOpen className="mr-2 h-5 w-5" />
              Browse &amp; Enroll in Courses
            </Button>
          </Link>
        </div>
      ) : (
        /* Has courses — show real chat UI */
        <StudentChatClient
          enrollments={enrollments}
          currentUser={{ id: user?.id || "", name: user?.name || "Student" }}
        />
      )}
    </div>
  );
}
