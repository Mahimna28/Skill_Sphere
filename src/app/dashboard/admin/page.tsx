import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, BookOpen, ShieldCheck, Activity, Globe } from "lucide-react";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !["superadmin", "institute_admin"].includes(decoded.role)) redirect("/login");

  // Fetch REAL stats
  const [userCount, instCount, courseCount, teacherCount] = await Promise.all([
    prisma.user.count(),
    prisma.institution.count(),
    prisma.course.count(),
    prisma.user.count({ where: { role: "teacher" } })
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { name: true, email: true, role: true, createdAt: true }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight">System Master Panel</h1>
        <p className="text-muted-foreground font-medium text-lg mt-1">Live platform analytics and monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: userCount, icon: Users, color: "bg-[#4F7DF3]" },
          { label: "Institutions", value: instCount, icon: School, color: "bg-[#F9A8D4]" },
          { label: "Active Courses", value: courseCount, icon: BookOpen, color: "bg-[#34D399]" },
          { label: "Faculty", value: teacherCount, icon: ShieldCheck, color: "bg-[#F5C84C]" },
        ].map((stat, i) => (
          <Card key={i} className={`border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${stat.color} text-black rounded-3xl overflow-hidden`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest">{stat.label}</CardTitle>
              <stat.icon className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 neo-brutalism bg-white border-4 border-black overflow-hidden">
           <div className="p-6 bg-muted border-b-4 border-black flex items-center justify-between">
              <h3 className="text-xl font-black uppercase flex items-center gap-2">
                 <Activity size={24} /> Recent Registrations
              </h3>
              <Globe size={24} className="opacity-20 animate-spin-slow" />
           </div>
           <div className="p-0">
              <table className="w-full">
                 <thead className="bg-muted/30 border-b-2 border-black">
                    <tr className="text-[10px] font-black uppercase text-muted-foreground text-left">
                       <th className="p-4">Name</th>
                       <th className="p-4">Email</th>
                       <th className="p-4">Role</th>
                       <th className="p-4 text-right">Joined</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y-2 divide-black">
                    {recentUsers.map((u, i) => (
                      <tr key={i} className="hover:bg-muted/10 transition-colors">
                         <td className="p-4 font-black text-sm">{u.name}</td>
                         <td className="p-4 font-bold text-xs opacity-60">{u.email}</td>
                         <td className="p-4">
                            <span className="px-2 py-0.5 border-2 border-black rounded text-[8px] font-black uppercase bg-accent">
                               {u.role}
                            </span>
                         </td>
                         <td className="p-4 text-right font-bold text-[10px]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="neo-brutalism bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black uppercase mb-4">Master Controls</h3>
              <div className="space-y-4">
                 <div className="p-4 border-2 border-black border-dashed rounded-xl bg-accent/10">
                    <p className="text-[10px] font-black uppercase mb-1">Database Sync</p>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                       <span className="text-xs font-bold">SQLITE-LIVE-SYNC</span>
                    </div>
                 </div>
                 <div className="p-4 border-2 border-black border-dashed rounded-xl bg-muted/10 opacity-50">
                    <p className="text-[10px] font-black uppercase mb-1">Server Status</p>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                       <span className="text-xs font-bold">OPTIMIZED-NEXTJS</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
