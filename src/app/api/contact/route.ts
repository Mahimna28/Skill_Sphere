import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      }
    });

    return NextResponse.json({ message: "Message sent successfully", data: contactMessage });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
