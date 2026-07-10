import React from "react";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayoutClient from "./DashboardLayoutClient";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) {
    redirect("/login");
  }

  const decoded: any = verifyToken(token);
  if (!decoded || !decoded.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, name: true, role: true, image: true }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayoutClient 
      initialUserRole={user.role || "student"} 
      initialUserName={user.name || "User"} 
      initialUserImage={user.image}
    >
      {children}
    </DashboardLayoutClient>
  );
}
