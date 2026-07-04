"use client";

import { BookOpen, School, CheckCircle2, Lock } from "lucide-react";

interface PrivateClass {
  id: string;
  title: string;
  subject: string;
  thumbnail: string | null;
  isPublic: boolean;
  teacher: { name: string };
  _count: { enrollments: number };
}

interface Props {
  userInstitutionId: string | null | undefined;
  institutionName: string | null | undefined;
  privateClasses: PrivateClass[];
}

export default function JoinInstitutionClient({ userInstitutionId, institutionName, privateClasses }: Props) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <School size={32} />
          </div>
          My Institution
        </h1>
        <p className="text-muted-foreground font-medium text-lg mt-1">
          Your school affiliation and private classes assigned by your teacher.
        </p>
      </div>

      {/* Institution Affiliation */}
      {userInstitutionId ? (
        <div className="bg-[#34D399] border-4 border-black p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Your Active Affiliation</p>
            <h2 className="text-4xl font-black uppercase tracking-tight">{institutionName || "Academic Institution"}</h2>
          </div>
          <CheckCircle2 size={64} className="opacity-20" />
        </div>
      ) : (
        <div className="py-12 text-center border-4 border-dashed border-black rounded-3xl bg-white/50">
          <School size={48} className="mx-auto mb-4 opacity-20" />
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No Institution Assigned</h3>
          <p className="text-muted-foreground font-bold max-w-md mx-auto">
            You have not been added to any institution yet. Your teacher or school administrator must add you first.
          </p>
        </div>
      )}

      {/* Private Classes Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#4F7DF3] text-white p-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Lock size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">My Private Classes</h2>
            <p className="text-sm font-bold text-muted-foreground">Classes assigned to you by your teacher</p>
          </div>
        </div>

        {privateClasses.length === 0 ? (
          <div className="py-16 text-center border-4 border-dashed border-black rounded-3xl bg-white/50">
            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">No Classes Yet</h3>
            <p className="text-muted-foreground font-bold max-w-sm mx-auto">
              Your teacher hasn't added you to any private class yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privateClasses.map((cls) => {
              const colors = ["bg-[#4F7DF3]", "bg-[#34D399]", "bg-[#F5C84C]"];
              const color = colors[cls.title.length % colors.length];
              return (
                <div key={cls.id} className="bg-white border-4 border-black rounded-[1.5rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:-translate-y-1 transition-transform group flex flex-col">
                  <div className={`h-40 ${color} border-b-4 border-black flex items-center justify-center relative overflow-hidden`}>
                    {cls.thumbnail ? (
                      <img src={cls.thumbnail} alt={cls.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen size={48} className="text-white opacity-40 group-hover:scale-110 transition-transform" />
                    )}
                    <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock size={10} /> Private Class
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="inline-block bg-[#F5C84C] border-2 border-black text-[10px] font-black uppercase px-2 py-0.5 rounded mb-3 w-max">
                      {cls.subject}
                    </div>
                    <h3 className="text-lg font-black leading-tight mb-1 flex-1">{cls.title}</h3>
                    <p className="text-xs font-bold text-muted-foreground mt-2">
                      by {cls.teacher.name} · {cls._count.enrollments} students
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
