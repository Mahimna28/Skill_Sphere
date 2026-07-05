"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Student User");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok && data.user) {
          setUserRole(data.user.role);
          if (data.user.name) setUserName(data.user.name);
          if (data.user.image) setUserImage(data.user.image);
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
        if (res.ok) setUnreadCount(data.unreadCount || 0);
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

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex flex-col md:flex-row font-sans">
      <Suspense fallback={null}>
        <StudentSidebar
          userName={userName}
          userRole={userRole || "student"}
          userImage={userImage}
          unreadCount={unreadCount}
          onLogout={handleLogout}
        />
      </Suspense>
      <main className="flex-1 flex flex-col md:pl-[260px] min-h-screen overflow-y-auto">
        <DashboardTopBar userRole={userRole || "student"} userName={userName} unreadCount={unreadCount} />
        <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
