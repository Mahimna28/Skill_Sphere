import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Trophy, BookOpen, Users, Mail, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ParentDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || decoded.role !== "parent") redirect("/login");

  // Fetch parent with real children
  const parent = await prisma.user.findUnique({
    where: { id: decoded.id },
    include: {
      children: {
        include: {
          enrollments: { 
            include: { 
              course: { 
                include: { 
                  modules: { include: { _count: { select: { lessons: true } } } } 
                } 
              } 
            } 
          },
          marks: { orderBy: { createdAt: "desc" } },
          completedLessons: { include: { lesson: { select: { moduleId: true } } } }
        },
      },
    },
  });

  if (!parent) redirect("/login");

  const child = parent.children[0]; // Currently handling one child as per registration logic

  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 border-4 border-black rounded-full flex items-center justify-center text-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-3xl font-black uppercase">No Child Linked</h2>
        <p className="max-w-md font-medium text-muted-foreground">
          It seems your account isn't linked to a student. Please contact support or register again with your child's Gmail.
        </p>
      </div>
    );
  }

  const avgScore = child.marks && child.marks.length > 0
    ? Math.round(child.marks.reduce((s: any, m: any) => s + m.score, 0) / child.marks.length)
    : null;

  // Calculate real attendance/progress
  let totalLessonsAcc = 0;
  let totalCompletionsAcc = 0;
  
  const coursesWithProgress = child.enrollments.map((enr: any) => {
    const totalLessons = enr.course.modules.reduce((sum: number, mod: any) => sum + mod._count.lessons, 0);
    const courseModuleIds = enr.course.modules.map((m: any) => m.id);
    const completedLessons = child.completedLessons ? child.completedLessons.filter((lc: any) => courseModuleIds.includes(lc.lesson.moduleId)).length : 0;
    
    totalLessonsAcc += totalLessons;
    totalCompletionsAcc += completedLessons;
    
    return {
      ...enr.course,
      totalLessons,
      completedLessons,
      progress: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)
    };
  });

  const overallAttendance = totalLessonsAcc === 0 ? 0 : Math.round((totalCompletionsAcc / totalLessonsAcc) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">Parent Portal</h1>
          <p className="text-muted-foreground font-medium text-lg">Monitoring: <span className="text-black font-black">{child.name}</span></p>
        </div>
        <div className="hidden md:flex gap-2">
           <div className="bg-white border-2 border-black px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
              <Mail size={14} /> {child.email}
           </div>
        </div>
      </div>

      {/* Child Overview Banner */}
      <div className="bg-[#4F7DF3] border-4 border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="flex items-center gap-6 z-10">
          <div className="w-20 h-20 rounded-full bg-white border-4 border-black flex items-center justify-center text-black text-3xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
            {child.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
              <GraduationCap size={32} />
              {child.name}
            </h2>
            <p className="font-bold opacity-90 text-lg">Active Student • Skill Sphere Academy</p>
          </div>
        </div>
        {avgScore !== null && (
          <div className="bg-white text-black font-black text-2xl px-8 py-4 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
            {avgScore}% AVG
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#34D399] text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-black uppercase">Courses</CardTitle>
            <BookOpen className="h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black">{child.enrollments.length}</div>
            <p className="text-black/60 font-bold mt-2 uppercase text-xs">Learning Progress</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#F5C84C] text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-black uppercase">Points</CardTitle>
            <Trophy className="h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black">{child.points}</div>
            <p className="text-black/60 font-bold mt-2 uppercase text-xs">Total Achievement</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F9A8D4] text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-black uppercase">Attendance</CardTitle>
            <Users className="h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black">{overallAttendance}%</div>
            <p className="text-black/60 font-bold mt-2 uppercase text-xs">Overall Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Marks */}
        <div className="neo-brutalism bg-white border-4 border-black p-0 overflow-hidden">
          <div className="p-6 border-b-4 border-black bg-muted/30">
            <h3 className="text-2xl font-black uppercase">Recent Academic Performance</h3>
          </div>
          <div className="p-0">
            {child.marks.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground font-bold">No exam results published yet.</div>
            ) : (
              <div className="divide-y-4 divide-black">
                {child.marks.map((m: any, i: number) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div>
                      <h4 className="font-black text-xl uppercase tracking-tight">{m.subject}</h4>
                      <p className="text-sm font-bold text-muted-foreground mt-1">
                        Reported on {new Date(m.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`w-16 h-16 rounded-xl border-4 border-black flex items-center justify-center text-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${m.score >= 90 ? "bg-[#34D399]" : m.score >= 75 ? "bg-[#F5C84C]" : "bg-[#F9A8D4]"}`}>
                      {m.score}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Courses */}
        <div className="neo-brutalism bg-white border-4 border-black p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b-4 border-black bg-muted/30">
            <h3 className="text-2xl font-black uppercase">Ongoing Curriculum</h3>
          </div>
          <div className="p-0 flex-1">
            {coursesWithProgress.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground font-bold">Not enrolled in any subjects.</div>
            ) : (
              <div className="divide-y-4 divide-black">
                {coursesWithProgress.map((course: any, i: number) => (
                  <div key={i} className="p-6 flex flex-col gap-4 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-primary/10 border-4 border-black rounded-2xl flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <BookOpen className="text-primary h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-xl uppercase tracking-tight line-clamp-1">{course.title}</h4>
                        <p className="text-sm font-bold text-muted-foreground mt-1 uppercase">Category: {course.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                       <span className="text-xs font-black w-8">{course.progress}%</span>
                       <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden border-2 border-black">
                          <div className="h-full bg-[#34D399]" style={{ width: `${course.progress}%` }}></div>
                       </div>
                       <span className="text-[10px] font-bold text-muted-foreground w-16 text-right">{course.completedLessons}/{course.totalLessons}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
