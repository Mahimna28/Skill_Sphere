import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];

export async function POST(req: Request) {
  try {
    // 1. Auth Check — teachers and admins only
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded || !["teacher", "superadmin", "institute_admin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Decide folder: images go to thumbnails/, documents go to materials/
    const isImage = IMAGE_TYPES.includes(file.type) || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
    const subDir = isImage ? "thumbnails" : "materials";

    const uploadDir = path.join(process.cwd(), "public", "uploads", subDir);

    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true });

    // Sanitize file name
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const fileName = `${Date.now()}-${safeName}`;
    const uploadPath = path.join(uploadDir, fileName);

    await writeFile(uploadPath, buffer);

    const fileUrl = `/uploads/${subDir}/${fileName}`;

    return NextResponse.json({
      url: fileUrl,
      name: file.name,
      type: isImage ? "image" : (file.name.split(".").pop()?.toLowerCase() ?? "file"),
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Upload failed", error: error.message }, { status: 500 });
  }
}
