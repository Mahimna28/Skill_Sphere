import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !["superadmin", "admin", "institute_admin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const superadminId = decoded.id;

    // Define the 10 courses
    const globalCourses = [
      {
        title: "CS50: Introduction to Computer Science",
        subject: "CS Fundamentals",
        description: "Harvard University's introduction to the intellectual enterprises of computer science and the art of programming.",
        thumbnail: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/8mAITcNt710",
      },
      {
        title: "Python for Beginners Full Course",
        subject: "Python",
        description: "Learn Python from scratch with this comprehensive crash course covering variables, loops, and functions.",
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc",
      },
      {
        title: "Machine Learning for Everybody",
        subject: "AI & ML",
        description: "An accessible introduction to Machine Learning, data science, and neural networks.",
        thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/i_LwzRmA_08",
      },
      {
        title: "Full Stack Web Development Bootcamp",
        subject: "Web Dev",
        description: "Master HTML, CSS, JavaScript, React, and Node.js in this complete web development bootcamp.",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/nu_pCVPKzTk",
      },
      {
        title: "Data Structures and Algorithms in Java",
        subject: "Java",
        description: "Master essential computer science concepts using Java. Covers Big O, Trees, Graphs, and HashMaps.",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/CBYHwZcbD-s",
      },
      {
        title: "Database Management Systems (SQL)",
        subject: "Databases",
        description: "Learn relational database design, normalization, and advanced SQL querying.",
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
      },
      {
        title: "Computer Networking Crash Course",
        subject: "Networking",
        description: "Understand the Internet, OSI Model, IP addressing, subnetting, and routers.",
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/qiQR5rTSshw",
      },
      {
        title: "Cyber Security Full Course",
        subject: "Security",
        description: "Beginner-friendly introduction to ethical hacking, cryptography, and network defense.",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/U_P23SqJaDc",
      },
      {
        title: "Cloud Computing Crash Course",
        subject: "Cloud",
        description: "Learn the fundamentals of Cloud Computing, AWS, serverless architecture, and deployment.",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/2LaAJq1lB1Q",
      },
      {
        title: "Operating Systems Fundamentals",
        subject: "Systems",
        description: "Deep dive into OS kernels, process management, memory allocation, and concurrency.",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/vBURTt97EkA",
      }
    ];

    let createdCount = 0;

    for (const c of globalCourses) {
      // Check if course already exists to avoid duplicates
      const existing = await prisma.course.findFirst({
        where: { title: c.title, teacherId: superadminId }
      });

      if (!existing) {
        const newCourse = await prisma.course.create({
          data: {
            title: c.title,
            subject: c.subject,
            description: c.description,
            thumbnail: c.thumbnail,
            isPublic: true,
            teacherId: superadminId,
            modules: {
              create: [
                {
                  title: "Course Content",
                  order: 1,
                  lessons: {
                    create: [
                      {
                         title: "Full Course Video",
                         videoUrl: c.videoUrl,
                         content: c.description,
                         order: 1
                      }
                    ]
                  }
                }
              ]
            }
          }
        });
        createdCount++;
      }
    }

    return NextResponse.json({ message: `Successfully seeded ${createdCount} global courses!` });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
