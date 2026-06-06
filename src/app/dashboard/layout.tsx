"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LogOut, MessageSquare, Sparkles, Trophy, Users, Shield, LayoutDashboard, UserCircle, Menu, X, School, Home, Bell, HelpCircle, Heart, Globe, Settings, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok) {
          setUserRole(data.user.role);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user role");
      }
    };
    fetchUser();
    // Fetch notification count
    const fetchNotifCount = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (res.ok) setUnreadCount(data.unreadCount);
      } catch (err) {}
    };
    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 10000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const getLinks = () => {
    if (!userRole) return [];
    
    switch (userRole) {
      case "student":
        return [
          { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
          { href: "/dashboard/student/courses", label: "My Courses", icon: BookOpen },
          { href: "/dashboard/student/leaderboard", label: "Leaderboard", icon: Trophy },
          { href: "/dashboard/student/chat", label: "Course Chat", icon: MessageSquare },
          { href: "/dashboard/student/ai-tutor", label: "AI Study Tutor", icon: Sparkles },
          { href: "/dashboard/student/institutions", label: "Institutions", icon: School },
          { href: "/dashboard/qa", label: "Q&A Forum", icon: HelpCircle },
        ];
      case "teacher":
        return [
          { href: "/dashboard/teacher", label: "Overview", icon: LayoutDashboard },
          { href: "/dashboard/teacher/courses", label: "Manage Courses", icon: BookOpen },
          { href: "/dashboard/teacher/students", label: "My Students", icon: Users },
          { href: "/dashboard/teacher/institutions", label: "Institutions", icon: School },
          { href: "/dashboard/qa", label: "Q&A Forum", icon: HelpCircle },
        ];
      case "parent":
        return [
          { href: "/dashboard/parent", label: "Overview", icon: LayoutDashboard },
        ];
      case "superadmin":
        return [
          { href: "/dashboard/admin", label: "Master Panel", icon: LayoutDashboard },
          { href: "/dashboard/admin/system", label: "System Control", icon: Settings },
          { href: "/dashboard/admin/courses", label: "Global Courses", icon: BookOpen },
          { href: "/dashboard/admin/feedback", label: "Review Feedback", icon: Heart },
          { href: "/dashboard/admin/promote", label: "Promote Admins", icon: ShieldAlert },
        ];
      case "institute_admin":
        return [
          { href: "/dashboard/teacher", label: "Teacher Dashboard", icon: BookOpen },
          { href: "/dashboard/admin/institute", label: "My Institute", icon: Shield },
          { href: "/dashboard/admin/feedback", label: "Review Feedback", icon: Heart },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b-4 border-black z-30">
        <Link href="/" className="flex items-center gap-2">
           <div className="w-8 h-8 relative border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Image src="/images/new-skill-sphere-logo.png" alt="Logo" fill className="object-contain" />
           </div>
           <span className="font-black text-sm uppercase">Skill Sphere</span>
        </Link>
        <Button variant="ghost" className="p-1 border-2 border-black" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
           {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 bg-white md:relative md:flex md:w-56 md:flex-col border-r-4 border-black h-screen transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b-4 border-black bg-white">
          <div className="flex justify-center mt-2">
            <div className={`inline-block px-2 py-0.5 text-[8px] font-black border-2 border-black rounded uppercase ${
              userRole === "superadmin" ? "bg-red-500 text-white" :
              userRole === "institute_admin" ? "bg-[#F5C84C] text-black" :
              "bg-[#F5C84C] text-black"
            }`}>
              {userRole === "superadmin" ? "⚡ Super Admin" :
               userRole === "institute_admin" ? "🏛 Institute Admin" :
               `${userRole} Portal`}
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={isActive ? "default" : "ghost"} 
                  className={`w-full justify-start font-black text-xs h-10 ${isActive ? "neo-brutalism bg-[#4F7DF3] text-white" : "hover:bg-accent/20 border-2 border-transparent hover:border-black"}`}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}

          <div className="pt-2 border-t-2 border-black border-dashed mt-2">
             <Link href="/dashboard/chat/direct" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={pathname === "/dashboard/chat/direct" ? "default" : "ghost"} 
                  className={`w-full justify-start font-black text-xs h-10 ${pathname === "/dashboard/chat/direct" ? "neo-brutalism bg-[#F9A8D4] text-black" : "hover:bg-accent/20 border-2 border-transparent hover:border-black"}`}
                >
                  <MessageSquare className="mr-3 h-4 w-4" />
                  Messages
                </Button>
             </Link>
          </div>
          
          <div className="pt-2 border-t-2 border-black border-dashed mt-2">
             <Link href="/dashboard/profile" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={pathname === "/dashboard/profile" ? "default" : "ghost"} 
                  className={`w-full justify-start font-black text-xs h-10 ${pathname === "/dashboard/profile" ? "neo-brutalism bg-[#34D399] text-white" : "hover:bg-accent/20 border-2 border-transparent hover:border-black"}`}
                >
                  <UserCircle className="mr-3 h-4 w-4" />
                  My Profile
                </Button>
             </Link>
          </div>
          <div className="pt-2 border-t-2 border-black border-dashed mt-2">
             <Link href="/dashboard/feedback" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                   variant={pathname === "/dashboard/feedback" ? "default" : "ghost"} 
                   className={`w-full justify-start font-black text-xs h-10 ${pathname === "/dashboard/feedback" ? "neo-brutalism bg-orange-100 text-orange-700" : "hover:bg-accent/20 border-2 border-transparent hover:border-black"}`}
                >
                   <Heart className="mr-3 h-4 w-4" />
                   Give Feedback
                </Button>
             </Link>
          </div>

          <div className="pt-2 border-t-2 border-black border-dashed mt-2">
             <Link href="/dashboard/notifications" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={pathname === "/dashboard/notifications" ? "default" : "ghost"} 
                  className={`w-full justify-start font-black text-xs h-10 relative ${pathname === "/dashboard/notifications" ? "neo-brutalism bg-[#F5C84C] text-black" : "hover:bg-accent/20 border-2 border-transparent hover:border-black"}`}
                >
                  <Bell className="mr-3 h-4 w-4" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="absolute right-3 bg-red-500 text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-black">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
             </Link>
          </div>

          <div className="pt-4 mt-4 mb-2 px-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Platform
          </div>
          
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
             <Button variant="ghost" className="w-full justify-start font-black text-xs h-10 hover:bg-accent/20 border-2 border-transparent hover:border-black">
               <Home className="mr-3 h-4 w-4" />
               Home
             </Button>
          </Link>
          <Link href="/courses" onClick={() => setMobileMenuOpen(false)}>
             <Button variant="ghost" className="w-full justify-start font-black text-xs h-10 hover:bg-accent/20 border-2 border-transparent hover:border-black">
               <BookOpen className="mr-3 h-4 w-4" />
               All Courses
             </Button>
          </Link>
          <Link href="/features" onClick={() => setMobileMenuOpen(false)}>
             <Button variant="ghost" className="w-full justify-start font-black text-xs h-10 hover:bg-accent/20 border-2 border-transparent hover:border-black">
               <Sparkles className="mr-3 h-4 w-4" />
               Features
             </Button>
          </Link>
        </nav>
        
        <div className="p-4 border-t-4 border-black">
          <Button variant="ghost" className="w-full justify-start font-black text-xs text-red-600 hover:bg-red-50 border-2 border-transparent hover:border-black h-10" onClick={handleLogout}>
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-[#f8f9fa] h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://patterns.dev/img/grid.svg')] opacity-[0.03] pointer-events-none z-0"></div>
        


        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </div>
  );
}
