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

  return <CertificateClient certificate={certificate} />;
}
