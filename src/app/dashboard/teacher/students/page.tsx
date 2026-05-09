import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function TeacherStudents() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || decoded.role !== "teacher") redirect("/login");

  // Fetch real enrollments for this teacher's courses
  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: { teacherId: decoded.id }
    },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <div className="bg-secondary text-black p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Users size={32} /></div>
            My Students
          </h1>
          <p className="text-muted-foreground font-medium text-lg">Track progress and communicate with your class.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Input placeholder="Search students..." className="border-2 border-black neo-brutalism-static max-w-xs" />
          <Button className="neo-brutalism font-bold px-6 bg-primary text-white"><Search size={18} /></Button>
        </div>
      </div>

      <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-4 border-black bg-muted/50">
                  <th className="p-4 font-black">Student Name</th>
                  <th className="p-4 font-black hidden md:table-cell">Course</th>
                  <th className="p-4 font-black text-center">Status</th>
                  <th className="p-4 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-muted-foreground font-bold">
                      No students enrolled in your courses yet.
                    </td>
                  </tr>
                ) : (
                  enrollments.map((en, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold">{en.user.name}</div>
                        <div className="text-sm font-medium text-muted-foreground">{en.user.email}</div>
                      </td>
                      <td className="p-4 font-medium hidden md:table-cell">{en.course.title}</td>
                      <td className="p-4 text-center">
                        <span className="text-green-600 flex items-center justify-center gap-1 font-bold">
                          ● Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="outline" className="border-2 border-black font-bold h-9">
                          <MessageSquare className="h-4 w-4 mr-2 hidden lg:block" /> Message
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
