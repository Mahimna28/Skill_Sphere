import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import BlogUploadClient from "@/components/dashboard/blog/BlogUploadClient";
import { prisma } from "@/lib/prisma";

export default async function TeacherBlogUploadPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !["teacher", "institute_admin"].includes(decoded.role)) {
    redirect("/login");
  }

  const blogs = await prisma.post.findMany({
    where: { authorId: decoded.id },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true, image: true, email: true } } }
  });

  const serializedBlogs = blogs.map(blog => ({
    ...blog,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
    publishedAt: blog.publishedAt.toISOString(),
  }));

  return (
    <div className="pt-6">
      <BlogUploadClient initialBlogs={serializedBlogs} userRole={decoded.role} />
    </div>
  );
}
