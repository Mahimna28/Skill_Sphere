import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Crown } from "lucide-react";

export default async function StudentLeaderboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  const students = await prisma.user.findMany({
    where: { role: "student" },
    orderBy: { points: "desc" },
    select: { id: true, name: true, points: true },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <div className="inline-block bg-accent p-4 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
          <Trophy size={48} className="text-white fill-white" />
        </div>
        <h1 className="text-4xl font-black mb-2">Global Leaderboard</h1>
        <p className="text-muted-foreground font-medium text-lg">
          Earn points by completing courses and assignments!
        </p>
      </div>

      <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden">
        <CardHeader className="border-b-4 border-black bg-primary text-white p-6">
          <CardTitle className="text-2xl font-black flex justify-between items-center">
            <span>Rankings</span>
            <span className="text-sm font-bold bg-white text-black px-3 py-1 rounded-full border-2 border-black">
              All Time
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {students.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground font-medium">
              No students yet. Be the first to earn points!
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {students.map((user, index) => {
                const rank = index + 1;
                const isCurrentUser = decoded?.id === user.id;
                return (
                  <div
                    key={user.id}
                    className={`p-4 md:p-6 flex items-center justify-between transition-colors ${isCurrentUser ? "bg-accent/30" : "hover:bg-muted/30"}`}
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 border-black font-black text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          rank === 1 ? "bg-[#F5C84C]" : rank === 2 ? "bg-gray-300" : rank === 3 ? "bg-[#ca8a04] text-white" : "bg-white"
                        }`}
                      >
                        {rank === 1 ? <Crown size={22} /> : rank}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          {user.name}
                          {isCurrentUser && (
                            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded border border-black">
                              You
                            </span>
                          )}
                        </h4>
                      </div>
                    </div>
                    <div className="font-black text-xl flex items-center gap-2">
                      {user.points.toLocaleString()}{" "}
                      <span className="text-sm text-muted-foreground hidden sm:inline">pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
