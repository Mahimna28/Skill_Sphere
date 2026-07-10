import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import CommunityHubClient from "@/app/dashboard/student/community/CommunityHubClient";
import { Loader2 } from "lucide-react";

export default async function CommunityHubPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  let enrollments: any[] = [];
  let user: any = null;

  if (decoded?.id) {
    user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        children: {
          include: {
            enrollments: {
              include: { course: { select: { id: true, title: true, subject: true } } },
            },
          },
        },
      },
    });

    if (user?.role === "parent") {
      enrollments = user.children?.flatMap((child: any) => child.enrollments) || [];
    } else {
      enrollments = await prisma.enrollment.findMany({
        where: { userId: decoded.id },
        include: { course: { select: { id: true, title: true, subject: true } } },
        orderBy: { enrolledAt: "asc" },
      });
    }
  }

  const currentUser = {
    id: user?.id || "",
    name: user?.name || "User",
    role: user?.role || "",
  };

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="animate-spin text-[#C9A96E]" size={36} />
        </div>
      }
    >
      <CommunityHubClient enrollments={enrollments} currentUser={currentUser} />
    </Suspense>
  );
}
