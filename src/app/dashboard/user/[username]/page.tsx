import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BookOpen, Trophy, Shield, Sparkles, MapPin, Target, GraduationCap, Briefcase, Lock, UserPlus, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      institution: true,
      department: true
    }
  });

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center animate-in fade-in">
        <h1 className="text-4xl font-black mb-4">User Not Found</h1>
        <p className="font-bold text-muted-foreground mb-8">The user @{username} does not exist.</p>
        <Link href="/dashboard/chat/direct">
          <Button className="neo-brutalism font-bold">Back to Chat</Button>
        </Link>
      </div>
    );
  }

  const isTeacherOrAdmin = ["teacher", "institute_admin", "superadmin"].includes(user.role);
  const isPrivate = isTeacherOrAdmin ? true : !user.isProfilePublic;

  if (isPrivate) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center animate-in fade-in slide-in-from-bottom-4">
        <div className="w-24 h-24 bg-orange-100 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={40} className="text-orange-500" />
        </div>
        <h1 className="text-4xl font-black uppercase mb-2">Private Profile</h1>
        <p className="font-bold text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          @{user.username}'s profile is private. You must connect with them to send messages.
        </p>
        <Link href="/dashboard/chat/direct">
          <Button className="neo-brutalism font-bold bg-[#4F7DF3] text-white">Back to Chat</Button>
        </Link>
      </div>
    );
  }

  // Parse skills
  let skills: any[] = [];
  try {
    if (user.skills) skills = JSON.parse(user.skills);
  } catch(e) {}

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
      <Link href="/dashboard/chat/direct" className="inline-flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors mb-4">
        <ArrowLeft size={16} /> Back to Messages
      </Link>

      {/* Hero Section */}
      <div className="neo-brutalism bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="h-48 bg-[#F9A8D4] border-b-4 border-black relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://patterns.dev/img/grid.svg')] mix-blend-multiply"></div>
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-black bg-white overflow-hidden shrink-0 flex items-center justify-center text-5xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 relative">
              {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0)}
            </div>
            
            <div className="flex-1 pb-2">
              <h1 className="text-4xl font-black uppercase tracking-tight">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="font-bold text-muted-foreground">@{user.username}</span>
                <span className="px-3 py-1 bg-primary text-white text-xs font-black uppercase rounded-full border-2 border-black">
                  {user.role}
                </span>
                {user.institution && (
                  <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                    <MapPin size={14} /> {user.institution.name}
                  </span>
                )}
              </div>
            </div>
            
            <div className="pb-2 w-full md:w-auto">
              <Link href="/dashboard/chat/direct">
                <Button className="w-full md:w-auto neo-brutalism font-black h-12 bg-[#34D399] text-black">
                  <MessageSquare className="mr-2 h-5 w-5" /> Send Message
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-lg font-medium whitespace-pre-wrap leading-relaxed max-w-2xl">
            {user.bio || "This user hasn't added a bio yet. They are a person of mystery!"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Stats & Goals */}
        <div className="md:col-span-1 space-y-6">
          <div className="neo-brutalism bg-white border-4 border-black p-6 rounded-2xl">
            <h3 className="text-lg font-black uppercase flex items-center gap-2 mb-4">
              <Trophy size={20} className="text-[#F5C84C]" /> Stats
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Points</p>
                <p className="text-2xl font-black">{user.points}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Joined</p>
                <p className="text-xl font-black">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {(user.learningGoal || user.degree) && (
            <div className="neo-brutalism bg-[#4F7DF3] text-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-lg font-black uppercase flex items-center gap-2 mb-4">
                <Target size={20} /> Current Goal
              </h3>
              {user.learningGoal && <p className="font-bold mb-4">{user.learningGoal}</p>}
              {user.degree && (
                <div className="flex items-center gap-2 bg-white/20 p-2 rounded border-2 border-black font-bold text-sm">
                  <GraduationCap size={16} /> {user.degree}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Skills & Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="neo-brutalism bg-white border-4 border-black p-8 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black uppercase flex items-center gap-2 mb-6 border-b-4 border-black inline-block pb-1">
              <Sparkles size={24} className="text-primary" /> Skills & Expertise
            </h3>
            
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {skills.map((skill: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 bg-muted/30 border-2 border-black rounded-xl px-4 py-2">
                    <span className="font-black uppercase text-sm">{skill.name || skill}</span>
                    {skill.level && (
                      <span className="text-xs font-bold bg-[#F5C84C] px-1.5 py-0.5 rounded border border-black">
                        Lvl {skill.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-bold text-muted-foreground italic">No skills added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
