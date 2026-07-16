"use client";

import Link from "next/link";
import { 
  Home, Menu, X, BookOpen, Sparkles, Newspaper, Info, 
  User, LayoutGrid, Settings, LogOut 
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close menus on route change
  // eslint-disable-next-line
  useEffect(() => { 
    setMenuOpen(false); 
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileDropdownOpen(false);
    };
    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [profileDropdownOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch { /* not logged in */ }
    };
    fetchUser();
  }, []);

  // Simple scroll listener for header state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch {
      // ignore
    }
  };

  const dashboardPath = ["superadmin", "institute_admin"].includes(user?.role ?? "")
    ? "/dashboard/admin"
    : `/dashboard/${user?.role}`;

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Features", href: "/features", icon: Sparkles },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Blog", href: "/blog", icon: Newspaper },
    { name: "About", href: "/about", icon: Info },
  ];

  const publicPagesWithHero = ["/", "/features", "/courses", "/blog", "/about", "/pricing", "/faq", "/contact"];
  const isTransparentHeroPage = publicPagesWithHero.includes(pathname ?? "");
  const shouldHaveSolidBackground = scrolled || !isTransparentHeroPage;

  return (
    <header 
      style={{ transitionDuration: "600ms", transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1.0)" }}
      className={cn(
        "fixed top-0 w-full z-50 transition-all",
        shouldHaveSolidBackground 
          ? "bg-[#1E1B2E]/90 backdrop-blur-md py-4 border-b border-white/10 shadow-lg" 
          : "bg-transparent py-6 border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="shrink-0 flex items-center">
          <Link href="/" className="flex items-center group">
            <span className="font-heading font-black text-[20px] tracking-tight text-white transition-transform duration-300 group-hover:scale-105">
              Skill Sphere.
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
          <div className="flex gap-10 font-sans">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.name}>
                  <Link 
                    href={link.href} 
                    className={cn(
                      "relative text-[14px] font-medium transition-colors duration-300 py-1",
                      "after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-[#C9A96E] after:transition-all after:duration-300",
                      isActive 
                        ? "text-[#C9A96E] after:w-full" 
                        : "text-[rgba(255,255,255,0.85)] hover:text-white after:w-0 hover:after:w-full"
                    )}
                  >
                    {link.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href={dashboardPath}>
                  <button className="h-[40px] px-5 rounded-xl bg-[#C9A96E] text-[#1E1B2E] text-[14px] font-medium transition-all hover:scale-105 hover:shadow-[0_4px_16px_rgba(201,169,110,0.3)]">
                    Dashboard
                  </button>
                </Link>
                
                <div className="relative" ref={profileDropdownRef}>
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className={cn(
                      "w-[36px] h-[36px] rounded-full border-2 transition-all duration-300 flex items-center justify-center overflow-hidden",
                      profileDropdownOpen ? "border-[#C9A96E]" : "border-[rgba(255,255,255,0.2)] hover:border-[#C9A96E]"
                    )}
                  >
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[rgba(201,169,110,0.15)] flex items-center justify-center">
                        <span className="font-heading text-[14px] text-[#C9A96E]">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      </div>
                    )}
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-[220px] bg-[rgba(30,27,46,0.95)] backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-[0_12px_40px_rgba(0,0,0,0.3)] flex flex-col z-50 origin-top-right transition-opacity duration-200">
                      {/* User Info Header */}
                      <div className="px-4 py-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[rgba(201,169,110,0.15)] flex items-center justify-center">
                              <span className="font-heading text-[14px] text-[#C9A96E]">
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[14px] font-medium text-white truncate">{user.name || "User"}</span>
                          <span className="text-[12px] text-[#8E8E93] truncate">{user.email}</span>
                        </div>
                      </div>
                      
                      <div className="h-px w-full bg-[rgba(255,255,255,0.08)] my-1" />
                      
                      <Link href="/dashboard/profile" onClick={() => setProfileDropdownOpen(false)}>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors group">
                          <User size={16} className="text-[#8E8E93] group-hover:text-white transition-colors" />
                          <span className="text-[14px] text-[rgba(255,255,255,0.9)] group-hover:text-white transition-colors">My Profile</span>
                        </button>
                      </Link>

                      <Link href={dashboardPath} onClick={() => setProfileDropdownOpen(false)}>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors group">
                          <LayoutGrid size={16} className="text-[#8E8E93] group-hover:text-white transition-colors" />
                          <span className="text-[14px] text-[rgba(255,255,255,0.9)] group-hover:text-white transition-colors">Dashboard</span>
                        </button>
                      </Link>
                      
                      <div className="h-px w-full bg-[rgba(255,255,255,0.08)] my-1" />

                      <Link href="/dashboard/settings" onClick={() => setProfileDropdownOpen(false)}>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors group">
                          <Settings size={16} className="text-[#8E8E93] group-hover:text-white transition-colors" />
                          <span className="text-[14px] text-[rgba(255,255,255,0.9)] group-hover:text-white transition-colors">Settings</span>
                        </button>
                      </Link>

                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-colors group">
                        <LogOut size={16} className="text-[#EF4444]" />
                        <span className="text-[14px] text-[#EF4444]">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="h-[40px] px-5 rounded-xl border border-[rgba(255,255,255,0.5)] text-white text-[14px] font-medium transition-colors hover:bg-white/10">
                    Log in
                  </button>
                </Link>
                <Link href="/register">
                  <button className="h-[40px] px-5 rounded-xl bg-[#C9A96E] text-[#1E1B2E] text-[14px] font-medium transition-all hover:scale-105 hover:shadow-[0_4px_16px_rgba(201,169,110,0.3)]">
                    Join Free
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-2 transition-transform hover:scale-105"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Glassmorphism) */}
      {menuOpen && (
        <div className="md:hidden absolute top-[calc(100%+8px)] left-4 right-4 bg-[rgba(30,27,46,0.95)] backdrop-blur-2xl rounded-2xl border border-white/10 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] z-50 origin-top transition-opacity duration-200">
          <nav className="flex flex-col gap-2 font-sans font-medium text-sm">
            {user && (
              <>
                <div className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.05)] rounded-xl mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[rgba(201,169,110,0.15)] flex items-center justify-center">
                        <span className="font-heading text-[14px] text-[#C9A96E]">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-medium text-white truncate">{user.name || "User"}</span>
                    <span className="text-[12px] text-[#8E8E93] truncate">{user.email}</span>
                  </div>
                </div>
                <div className="h-px bg-[rgba(255,255,255,0.1)] mb-2" />
              </>
            )}

            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-colors relative",
                    isActive 
                      ? "text-[#C9A96E] bg-[rgba(255,255,255,0.05)] border-l-2 border-[#C9A96E]" 
                      : "text-[rgba(255,255,255,0.9)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white border-l-2 border-transparent"
                  )}
                >
                  <Icon size={18} className={isActive ? "text-[#C9A96E]" : "text-[rgba(255,255,255,0.7)]"} /> 
                  {link.name}
                </Link>
              );
            })}
            
            <div className="h-px bg-[rgba(255,255,255,0.1)] my-4" />
            
            {user ? (
              <div className="flex flex-col gap-2">
                <Link href="/dashboard/profile" onClick={() => setMenuOpen(false)}>
                  <button className="w-full h-[44px] rounded-xl border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.9)] text-[14px] font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors flex justify-center items-center gap-2">
                    <User size={16} /> My Profile
                  </button>
                </Link>
                <Link href={dashboardPath} onClick={() => setMenuOpen(false)}>
                  <button className="w-full h-[44px] rounded-xl bg-[#C9A96E] text-[#1E1B2E] text-[14px] font-medium transition-all hover:scale-105 shadow-sm flex justify-center items-center gap-2">
                    <LayoutGrid size={16} /> Dashboard
                  </button>
                </Link>
                <button onClick={handleLogout} className="w-full h-[44px] rounded-xl border border-[rgba(239,68,68,0.3)] text-[#EF4444] text-[14px] font-medium hover:bg-[rgba(239,68,68,0.1)] transition-colors flex justify-center items-center gap-2 mt-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <button className="w-full h-[44px] rounded-xl border border-[#C9A96E] text-[#C9A96E] text-[14px] font-medium hover:bg-[#C9A96E] hover:text-[#1E1B2E] transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <button className="w-full h-[44px] rounded-xl bg-[#C9A96E] text-[#1E1B2E] text-[14px] font-medium transition-all hover:scale-105 shadow-sm">
                    Join Free
                  </button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
