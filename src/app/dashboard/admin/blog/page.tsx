import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import BlogUploadClient from "@/components/dashboard/blog/BlogUploadClient";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogUploadPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || (decoded.role !== "superadmin" && decoded.role !== "admin")) {
    redirect("/login");
  }

  try {
    const blogs = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true, image: true, email: true } } }
    });

    const serializedBlogs = blogs.map(blog => ({
      ...blog,
      createdAt: blog.createdAt ? blog.createdAt.toISOString() : null,
      updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : null,
      publishedAt: blog.publishedAt ? blog.publishedAt.toISOString() : null,
    }));

    return (
      <div className="pt-6">
        <BlogUploadClient initialBlogs={serializedBlogs} userRole={decoded.role} />
      </div>
    );
  } catch (error: any) {
    return (
      <div className="pt-6 p-8 text-red-500 font-mono">
        <h1>Server Error</h1>
        <pre>{error.stack || error.message}</pre>
      </div>
    );
  }
}
