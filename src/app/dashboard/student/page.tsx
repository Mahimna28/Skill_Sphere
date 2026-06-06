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
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">My Courses</h2>
            <Link href="/dashboard/student/courses">
              <Button variant="outline" className="font-bold border-2 border-black">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {enrollments.length === 0 ? (
            <Card className="neo-brutalism-static p-12 text-center bg-white">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-2xl font-black mb-2">No Courses Yet</h3>
              <p className="text-muted-foreground font-medium mb-6">
                You are not enrolled in any courses. Browse the available courses and start learning!
              </p>
              <Link href="/dashboard/student/courses">
                <Button className="neo-brutalism font-bold">Browse Courses</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {enrollments.slice(0, 4).map((enr) => (
                <Card
                  key={enr.id}
                  className="neo-brutalism bg-white hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer overflow-hidden"
                >
                  <div className="h-28 bg-primary/20 border-b-2 border-black flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary opacity-40" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-black leading-tight">
                      {enr.course.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                      {enr.course.teacher.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/dashboard/student/courses/${enr.course.id}`}>
                      <Button variant="outline" className="w-full border-2 border-black font-bold">
                        Continue
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
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
