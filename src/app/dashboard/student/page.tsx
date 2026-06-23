import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, BookOpen, Star, Sparkles, ArrowRight } from "lucide-react";

export default async function StudentDashboard() {
  // Get user from cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  let enrollments: any[] = [];
  let marks: any[] = [];
  let certificates: any[] = [];
  let user: any = null;

  if (decoded?.id) {
    user = await prisma.user.findUnique({ where: { id: decoded.id } });
    enrollments = await prisma.enrollment.findMany({
      where: { userId: decoded.id },
      include: { course: { include: { teacher: { select: { name: true } } } } },
    });
    marks = await prisma.marks.findMany({ where: { studentId: decoded.id } });
    certificates = await prisma.certificate.findMany({ where: { userId: decoded.id }, orderBy: { issueDate: "desc" } });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-black mb-2">
          Welcome back, {user?.name?.split(" ")[0] || "Student"}! 🚀
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Ready to level up your skills today?
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground neo-brutalism-static">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Total Points</CardTitle>
            <Trophy className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black">{user?.points ?? 0}</div>
            <p className="text-primary-foreground/80 font-medium mt-2">Keep earning!</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary text-secondary-foreground neo-brutalism-static">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Enrolled Courses</CardTitle>
            <BookOpen className="h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black">{enrollments.length}</div>
            <p className="text-secondary-foreground/80 font-medium mt-2">
              {enrollments.length === 0 ? "Browse and enroll now" : "In progress"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-accent text-accent-foreground neo-brutalism-static">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Avg. Score</CardTitle>
            <Star className="h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black">
              {marks.length > 0
                ? Math.round(marks.reduce((s, m) => s + m.score, 0) / marks.length)
                : "--"}
              {marks.length > 0 ? "%" : ""}
            </div>
            <p className="text-accent-foreground/80 font-medium mt-2">
              Across all subjects
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-[28px] font-bold text-[#1E1B2E]">My Courses</h2>
            <Link href="/courses">
              <span className="font-sans text-[14px] font-medium text-[#C9A96E] hover:text-[#1E1B2E] transition-colors cursor-pointer">
                Browse Courses →
              </span>
            </Link>
          </div>
          {enrollments.length === 0 ? (
            <div className="bg-white rounded-[24px] p-12 text-center shadow-[0_4px_24px_rgba(30,27,46,0.04)] border border-[rgba(30,27,46,0.04)]">
              <div className="w-20 h-20 bg-[#F5F1EB] rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-[#C9A96E]" />
              </div>
              <h3 className="font-heading text-[24px] text-[#1E1B2E] mb-3">No Courses Yet</h3>
              <p className="font-sans text-[15px] text-[#8E8E93] max-w-md mx-auto mb-8 leading-relaxed">
                You haven't enrolled in any courses yet. Discover our premium curriculum and start your journey today.
              </p>
              <Link href="/courses">
                <button className="bg-[#1E1B2E] text-white px-8 py-3.5 rounded-xl font-sans text-[15px] font-medium hover:bg-[#C9A96E] hover:text-[#1E1B2E] transition-all shadow-md">
                  Explore Courses
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {enrollments.slice(0, 4).map((enr) => (
                <div
                  key={enr.id}
                  className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(30,27,46,0.04)] hover:shadow-[0_12px_40px_rgba(30,27,46,0.08)] border border-[rgba(30,27,46,0.04)] transition-all duration-300 group flex flex-col"
                >
                  <div className="relative w-full h-[140px] rounded-[16px] overflow-hidden mb-5 bg-[#F5F1EB]">
                    {enr.course.thumbnail ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={enr.course.thumbnail} alt={enr.course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[rgba(201,169,110,0.1)]">
                        <BookOpen className="w-10 h-10 text-[#C9A96E] opacity-50" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading text-[18px] text-[#1E1B2E] leading-[1.2] mb-1 line-clamp-2">
                    {enr.course.title}
                  </h3>
                  <p className="font-sans text-[13px] text-[#8E8E93] mb-5">
                    {enr.course.teacher.name}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between font-sans text-[12px] font-medium text-[#1E1B2E] mb-2">
                      <span>Progress</span>
                      <span>{enr.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#F5F1EB] rounded-full overflow-hidden mb-5">
                      <div 
                        className="h-full bg-[#C9A96E] rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${enr.progress}%` }} 
                      />
                    </div>
                    <Link href={`/dashboard/student/courses/${enr.course.id}`} className="block">
                      <button className="w-full h-[44px] bg-[#C9A96E] text-[#1E1B2E] rounded-xl font-sans font-medium text-[14px] flex items-center justify-center transition-transform hover:scale-[1.02] shadow-[0_4px_14px_rgba(201,169,110,0.15)]">
                        Continue Learning
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Tutor CTA */}
        <div className="space-y-6">
          <Card className="bg-[#F9A8D4] neo-brutalism-static">
            <CardHeader>
              <CardTitle className="text-2xl font-black flex items-center gap-2">
                <Sparkles /> AI Study Tutor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-6">
                Stuck on a problem? The AI Tutor knows Python, AI&ML, Web Dev, and more — available 24/7!
              </p>
              <Link href="/dashboard/student/ai-tutor" className="w-full">
                <Button className="w-full font-bold neo-brutalism bg-white text-black hover:bg-gray-100">
                  Chat with AI
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Certificates */}
          {certificates.length > 0 && (
            <Card className="neo-brutalism-static bg-white mb-6">
              <CardHeader className="border-b-2 border-black bg-[#F5C84C]">
                <CardTitle className="font-black flex items-center gap-2">
                  <Star size={20} /> My Certificates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {certificates.map((cert, i) => (
                  <div key={i} className="p-4 border-b border-gray-100 last:border-0 flex justify-between items-center bg-[#F5C84C]/10">
                    <span className="font-bold text-sm truncate pr-2" title={cert.title}>{cert.title}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded border-2 border-black bg-white">
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Marks */}
          {marks.length > 0 && (
            <Card className="neo-brutalism-static bg-white">
              <CardHeader className="border-b-2 border-black">
                <CardTitle className="font-black">Recent Scores</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {marks.map((m, i) => (
                  <div key={i} className="p-4 border-b border-gray-100 last:border-0 flex justify-between items-center">
                    <span className="font-bold text-sm truncate pr-2">{m.subject}</span>
                    <span className={`text-lg font-black px-2 py-0.5 rounded border-2 border-black ${m.score >= 90 ? "bg-secondary" : m.score >= 75 ? "bg-accent" : "bg-[#F9A8D4]"}`}>
                      {m.score}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
