import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import CertificateClient from "./CertificateClient";

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const certificateId = resolvedParams.id;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded) redirect("/login");

  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: {
      user: { select: { name: true, email: true } }
    }
  });

  if (!certificate) notFound();

  // Only the user who earned the certificate can view it (for privacy)
  if (certificate.userId !== decoded.id) {
    redirect("/dashboard/student");
  }

  // Extract course title from certificate title
  const courseTitle = certificate.title.replace("Certificate of Completion: ", "");

  // Fetch the related course to get level, instructor, duration, etc.
  const course = await prisma.course.findFirst({
    where: { title: courseTitle },
    include: {
      teacher: { select: { name: true } }
    }
  });

  return <CertificateClient certificate={certificate} course={course} />;
}
