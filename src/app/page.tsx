import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Trophy, Users, Shield, ArrowRight, Code, Globe, Share2, Mail, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function LandingPage() {
  const dbCourses = await prisma.course.findMany({
    where: { isPublic: { equals: true } },
    include: { _count: { select: { enrollments: true } }, teacher: { select: { name: true } } },
    take: 9,
    orderBy: { enrollments: { _count: "desc" } }
  });

  const features = [
    {
      icon: Sparkles,
      title: "AI Study Tutor",
      desc: "Get 24/7 academic help from our integrated Gemini AI assistant. It can explain complex topics, solve problems, and summarize lessons instantly.",
      color: "bg-[#F5C84C] text-black"
    },
    {
      icon: BookOpen,
      title: "Smart Learning",
      desc: "Structured courses with modules and interactive lessons. Track your progress and pick up exactly where you left off with our modern player.",
      color: "bg-[#4F7DF3] text-white"
    },
    {
      icon: MessageSquare,
      title: "Social Learning",
      desc: "Dedicated course chat rooms. Collaborate with peers, share resources, and learn together in real-time.",
      color: "bg-[#34D399] text-white"
    },
    {
      icon: Trophy,
      title: "Gamification",
      desc: "Earn +50 points for every course you join. Compete on global leaderboards and showcase your expertise to the community.",
      color: "bg-[#4F7DF3] text-white"
    },
    {
      icon: Users,
      title: "Parent Insights",
      desc: "A dedicated portal for parents to monitor attendance, marks, and academic growth without interrupting the learning flow.",
      color: "bg-[#34D399] text-white"
    },
    {
      icon: Shield,
      title: "Institution Admin",
      desc: "Complete control over user management, course approvals, and institution-wide analytics for administrators.",
      color: "bg-[#F5C84C] text-black"
    },
  ];

  const teamMembers = [
    { name: "Mahimna Mistry", role: "Project Lead", email: "cse.230840131049@gmail.com", color: "bg-[#4F7DF3]", image: "/images/team/mahimna1.jpg" },
    { name: "Dev Patel", role: "Lead Developer", email: "cse.230840131066@gmail.com", color: "bg-[#34D399]", image: "/images/team/dev.png" },
    { name: "Swayam Chaudhari", role: "AI Specialist", email: "cse.230840131015@gmail.com", color: "bg-[#F5C84C]", image: "/images/team/swayam.jpg" },
    { name: "Jal Lad", role: "UI/UX Designer", email: "cse.230840131039@gmail.com", color: "bg-[#4F7DF3]", image: "/images/team/jal.jpeg" },
  ];

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col items-start text-left">
            <div className="inline-block bg-[#F5C84C] px-4 py-1.5 border-4 border-black font-black text-sm uppercase mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Future-Ready Education
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black mb-6 leading-[0.85] tracking-tighter uppercase">
              Skill <br />
              <span className="text-[#4F7DF3] underline decoration-[#F5C84C] decoration-8 underline-offset-8">Sphere</span>
            </h1>
            <p className="text-lg md:text-2xl font-bold max-w-xl mb-10 leading-relaxed">
              Unlock your potential with an AI-powered LMS designed for role-based learning and real-time collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link href="/register">
                <Button size="lg" className="text-xl md:text-2xl px-8 md:px-12 py-8 md:py-10 neo-brutalism font-black bg-[#4F7DF3] h-auto w-full sm:w-auto text-white">
                  START LEARNING <ArrowRight className="ml-3 h-6 w-6 md:h-8 md:w-8" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative aspect-square max-w-sm mx-auto lg:max-w-none w-full">
            <div className="absolute inset-0 bg-[#34D399] border-4 border-black rounded-[3rem] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-3"></div>
            <div className="absolute inset-0 bg-white border-4 border-black rounded-[3rem] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] -rotate-3 overflow-hidden p-12">
              <div className="relative w-full h-full">
                <Image src="/images/hero.png" alt="Hero Logo" fill className="object-contain" priority />
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-44 bg-white border-4 border-black p-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-[-10deg] hidden md:block">
              <p className="font-black text-xs uppercase mb-2">New Course!</p>
              <p className="font-bold text-[10px] text-muted-foreground">Advanced React Architecture</p>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section id="courses" className="bg-[#4F7DF3] border-y-4 border-black py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://patterns.dev/img/grid.svg')] opacity-[0.05] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-10 md:mb-16 gap-6">
              <div className="text-left">
                <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Popular Courses</h3>
                <p className="text-white/80 font-bold text-lg md:text-xl mt-4">Join thousands of students in our top-rated programs.</p>
              </div>
              <Link href="/courses">
                <Button className="bg-white text-black font-black border-4 border-black h-16 px-10 text-xl hover:bg-white/90">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dbCourses.map((c: any, i: number) => {
                const color = ["bg-[#4F7DF3]", "bg-[#34D399]", "bg-[#F5C84C]"][i % 3];
                return (
                  <Link href={`/courses/${c.id}`} key={c.id} className="bg-white border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform group flex flex-col cursor-pointer block">
                    <div className={`w-full h-48 ${color} border-4 border-black rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative`}>
                      {c.thumbnail ? (
                        <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen size={64} className="text-white opacity-40 group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                    <div className="inline-block bg-[#F5C84C] px-2 py-1 border-2 border-black font-black text-[10px] uppercase mb-4 w-max">{c.subject}</div>
                    <h4 className="text-2xl font-black mb-2 flex-1">{c.title}</h4>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-sm font-bold text-muted-foreground">{c._count?.enrollments || 0} active students</p>
                      <p className="text-sm font-bold">by {c.teacher?.name || "Unknown"}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section id="features" className="bg-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24 gap-8">
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">The Advantage</h3>
              <Link href="/features">
                <Button className="bg-[#34D399] text-black font-black border-4 border-black h-14 px-8 text-lg">See All Features <ArrowRight className="ml-2" /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="neo-brutalism bg-white p-10 hover:-translate-y-2 group border-4 border-black">
                    <div className={`w-20 h-20 rounded-3xl border-4 border-black flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-10 transition-transform group-hover:rotate-6 ${f.color}`}>
                      <Icon size={40} />
                    </div>
                    <h4 className="text-4xl font-black mb-4 uppercase tracking-tighter">{f.title}</h4>
                    <p className="text-muted-foreground font-bold text-lg leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="bg-[#f8f9fa] border-t-4 border-black py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-24">
              <div className="inline-block bg-[#F5C84C] px-4 py-1.5 border-4 border-black font-black text-sm uppercase mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                The Brains Behind
              </div>
              <h3 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter">Meet Our <span className="text-[#34D399]">Team</span></h3>
              <p className="text-xl font-bold text-muted-foreground max-w-2xl mx-auto mt-8">
                A dedicated group of educators, engineers, and visionaries working to redefine the future of e-learning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, i) => (
                <div key={i} className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group">
                  <div className={`w-32 h-32 rounded-full border-4 border-black mx-auto mb-8 ${member.color} flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative`}>
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <Users size={64} className="text-black opacity-40 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <div className="text-center">
                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-1">{member.name}</h4>
                    <p className="font-bold text-[#4F7DF3] uppercase text-[10px] tracking-widest mb-4">{member.role}</p>

                    <div className="flex items-center justify-center gap-2 mb-6 font-bold text-[10px] opacity-60">
                      <Mail size={12} className="shrink-0" />
                      <span className="truncate max-w-[150px]">{member.email}</span>
                    </div>

                    <div className="flex justify-center gap-3">
                      <Link href={`mailto:${member.email}`} className="p-2 border-2 border-black rounded-lg hover:bg-[#F5C84C] transition-colors">
                        <Mail size={16} />
                      </Link>
                      <div className="p-2 border-2 border-black rounded-lg hover:bg-[#4F7DF3] hover:text-white transition-colors cursor-pointer">
                        <Share2 size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


