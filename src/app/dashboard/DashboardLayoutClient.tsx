"use client";

import React, { useState, useEffect, Suspense, memo } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  initialUserRole: string;
  initialUserName: string;
  initialUserImage: string | null;
}

const MemoizedStudentSidebar = memo(StudentSidebar);

export default function DashboardLayoutClient({ 
  children, 
  initialUserRole, 
  initialUserName, 
  initialUserImage 
}: DashboardLayoutClientProps) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
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
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex flex-col md:flex-row font-sans">
      <MemoizedStudentSidebar
        userName={initialUserName}
        userRole={initialUserRole}
        userImage={initialUserImage}
        unreadCount={unreadCount}
        onLogout={handleLogout}
      />
      <main className="flex-1 flex flex-col md:pl-[260px] min-h-screen overflow-y-auto">
        <DashboardTopBar userRole={initialUserRole} userName={initialUserName} unreadCount={unreadCount} />
        <div className="flex-1 p-4 sm:p-6 md:p-10 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
