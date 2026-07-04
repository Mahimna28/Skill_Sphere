"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LogOut, MessageSquare, Sparkles, Trophy, Users, Shield, LayoutDashboard, UserCircle, Menu, X, School, Home, Bell, HelpCircle, Heart, Globe, Settings, ShieldAlert, Search, ChevronDown, PenTool } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const scrollRefStudent = useRef<HTMLDivElement>(null);
  const scrollRefOther = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok) {
          setUserRole(data.user.role);
          setUserData(data.user);
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

  // Reset scroll position on route change
  useEffect(() => {
    if (scrollRefStudent.current) scrollRefStudent.current.scrollTo(0, 0);
    if (scrollRefOther.current) scrollRefOther.current.scrollTo(0, 0);
  }, [pathname]);

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
          { href: "/dashboard/student/ai-tutor", label: "AI Study Tutor", icon: Sparkles },
          { href: "/dashboard/student/institutions", label: "Institutions", icon: School },
          { href: "/dashboard/student/community", label: "Community", icon: Users },
          { href: "/dashboard/student/settings", label: "Settings", icon: Settings },
          { href: "/dashboard/feedback", label: "Give Feedback", icon: Heart },
        ];
      case "teacher":
        return [
          { href: "/dashboard/teacher", label: "Overview", icon: LayoutDashboard },
          { href: "/dashboard/teacher/courses", label: "Manage Courses", icon: BookOpen },
          { href: "/dashboard/teacher/students", label: "My Students", icon: Users },
          { href: "/dashboard/teacher/institutions", label: "Institutions", icon: School },
          { href: "/dashboard/teacher/community", label: "Community", icon: Users },
          { href: "/dashboard/teacher/blog/create", label: "Write Blog", icon: PenTool },
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
          { href: "/dashboard/admin/blog/create", label: "Write Blog", icon: PenTool },
        ];
      case "institute_admin":
        return [
          { href: "/dashboard/teacher", label: "Overview", icon: LayoutDashboard },
          { href: "/dashboard/teacher/courses", label: "Manage Courses", icon: BookOpen },
          { href: "/dashboard/teacher/students", label: "My Students", icon: Users },
          { href: "/dashboard/teacher/institutions", label: "Institutions", icon: School },
          { href: "/dashboard/teacher/community", label: "Community", icon: Users },
          { href: "/dashboard/teacher/blog/create", label: "Write Blog", icon: PenTool },
          { href: "/dashboard/admin/institute", label: "My Institute", icon: Shield },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex flex-col md:flex-row font-sans">
        {/* Mobile Header (Student) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white z-30 shadow-sm">
          <Link href="/" className="flex items-center gap-2">
             <span className="font-heading text-xl font-bold text-[#1E1B2E]">Skill Sphere</span>
          </Link>
          <Button variant="ghost" className="p-1 text-[#1E1B2E]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Premium Student Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 bg-[#1E1B2E] w-[260px] flex flex-col shadow-xl md:shadow-none transition-transform duration-300 md:relative md:translate-x-0
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-6">
            <Link href="/" className="flex items-center">
              <span className="font-heading text-[20px] text-white">Skill Sphere</span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
            {/* Nav Links */}
            <div className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    <div className={`flex items-center px-5 py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? "bg-[rgba(201,169,110,0.08)] border-l-[3px] border-[#C9A96E]" 
                        : "border-l-[3px] border-transparent hover:bg-[rgba(255,255,255,0.05)]"
                    }`}>
                      <Icon className={`w-[18px] h-[18px] mr-3 ${isActive ? "text-[#C9A96E]" : "text-[rgba(255,255,255,0.85)] group-hover:text-white"}`} />
                      <span className={`text-[14px] ${isActive ? "text-[#C9A96E] font-medium" : "text-[rgba(255,255,255,0.85)] group-hover:text-white"}`}>
                        {link.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="h-px bg-[rgba(255,255,255,0.08)] mx-4 my-4" />

            {/* Platform Section */}
            <div className="space-y-1">
               {[
                { href: "/", label: "Home", icon: Home },
                { href: "/courses", label: "All Courses", icon: BookOpen },
                { href: "/features", label: "Features", icon: Sparkles },
               ].map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center px-5 py-3 rounded-xl transition-all duration-200 group border-l-[3px] border-transparent hover:bg-[rgba(255,255,255,0.05)]">
                      <Icon className="w-[18px] h-[18px] mr-3 text-[rgba(255,255,255,0.85)] group-hover:text-white" />
                      <span className="text-[14px] text-[rgba(255,255,255,0.85)] group-hover:text-white">
                        {link.label}
                      </span>
                    </div>
                  </Link>
                )
               })}
            </div>

          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
          {/* Top Bar */}
          <header
            className="h-16 bg-[#F5F1EB] sticky top-0 z-20 flex items-center justify-between px-8"
          >
            <h1 className="font-heading text-[28px] text-[#1E1B2E]">
              {pathname === "/dashboard/student" ? "Overview" : 
               pathname === "/dashboard/chat/direct" ? "Messages" :
               pathname === "/dashboard/profile" ? "My Profile" :
               pathname === "/dashboard/student/settings" ? "Settings" :
               pathname === "/dashboard/notifications" ? "Notifications" :
               pathname === "/dashboard/feedback" ? "Give Feedback" :
               pathname.startsWith("/dashboard/student/courses/") ? "Course Content" :
               links.find(l => l.href === pathname)?.label || "Dashboard"}
            </h1>
            
            <div className="flex items-center gap-6">
               <div className="relative hidden md:block">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-[#8E8E93]" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-[280px] h-10 bg-white rounded-full pl-10 pr-4 text-[14px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  />
               </div>
               
               <Link href="/dashboard/notifications" className="relative cursor-pointer hover:opacity-80 transition-opacity">
                  <Bell className="w-5 h-5 text-[#1E1B2E]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
               </Link>

               <div className="relative">
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    {userData?.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={userData.image} alt="User" className="w-9 h-9 rounded-full object-cover shadow-sm" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#C9A96E] flex items-center justify-center text-[#1E1B2E] font-bold shadow-sm">
                        {userData?.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-[#8E8E93]" />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-2 border border-[rgba(0,0,0,0.04)]"
                      >
                        <div className="px-4 py-2 mb-1 border-b border-[rgba(0,0,0,0.04)]">
                          <p className="text-[13px] font-medium text-[#1E1B2E] truncate">{userData?.name || "User"}</p>
                          <p className="text-[11px] text-[#8E8E93] truncate">{userData?.email}</p>
                        </div>
                        <Link href="/dashboard/profile" onClick={() => setUserDropdownOpen(false)} className="block px-4 py-2 text-[14px] text-[#1E1B2E] hover:bg-[#F5F1EB] transition-colors">
                          My Profile
                        </Link>
                        <Link href={userRole === "student" ? "/dashboard/student/settings" : "/dashboard/settings"} onClick={() => setUserDropdownOpen(false)} className="block px-4 py-2 text-[14px] text-[#1E1B2E] hover:bg-[#F5F1EB] transition-colors">
                          Settings
                        </Link>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <button onClick={() => { setUserDropdownOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2 text-[14px] text-[#DC2626] hover:bg-red-50 transition-colors">
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div 
            ref={scrollRefStudent} 
            className={`flex-1 overflow-y-auto ${pathname === "/dashboard/student/ai-tutor" ? "" : "px-8 pb-8"}`}
          >
            <div className={pathname === "/dashboard/student/ai-tutor" ? "h-full" : "max-w-[1200px] mx-auto"}>
              {children}
            </div>
          </div>
        </main>
      </div>
    );
}
