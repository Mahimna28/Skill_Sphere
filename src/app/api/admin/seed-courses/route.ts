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
        details: "This is CS50x, Harvard University's introduction to the intellectual enterprises of computer science and the art of programming for majors and non-majors alike, with or without prior programming experience. An entry-level course taught by David J. Malan, CS50x teaches students how to think algorithmically and solve problems efficiently. Topics include abstraction, algorithms, data structures, encapsulation, resource management, security, software engineering, and web development. Languages include C, Python, SQL, and JavaScript plus CSS and HTML.",
        thumbnail: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/8mAITcNt710",
      },
      {
        title: "Python for Beginners Full Course",
        subject: "Python",
        description: "Learn Python from scratch with this comprehensive crash course covering variables, loops, and functions.",
        details: "Python is one of the most popular programming languages in the world, and it's perfect for beginners! In this comprehensive crash course, you will learn all the fundamental concepts of Python programming from scratch. We will cover variables, data types, string manipulation, math operators, user input, conditional statements, loops, functions, lists, dictionaries, error handling, and more. By the end of this course, you'll be writing real Python scripts!",
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc",
      },
      {
        title: "Machine Learning for Everybody",
        subject: "AI & ML",
        description: "An accessible introduction to Machine Learning, data science, and neural networks.",
        details: "Machine Learning is transforming the world. This course provides a gentle but comprehensive introduction to Machine Learning. You will learn the core concepts behind AI, supervised and unsupervised learning, regression, classification, clustering, and neural networks. No heavy calculus required! We focus on intuitive understanding and practical applications using Python libraries like Scikit-Learn and TensorFlow.",
        thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/i_LwzRmA_08",
      },
      {
        title: "Full Stack Web Development Bootcamp",
        subject: "Web Dev",
        description: "Master HTML, CSS, JavaScript, React, and Node.js in this complete web development bootcamp.",
        details: "Become a Full Stack Web Developer! This massive bootcamp covers everything you need to build modern, responsive, and dynamic web applications. We start with the building blocks: HTML5 semantic tags, CSS3 styling, flexbox, and grid. Then we dive into modern JavaScript (ES6+), DOM manipulation, and asynchronous programming. Finally, we cover the wildly popular React framework for the frontend and Node.js/Express for the backend.",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/nu_pCVPKzTk",
      },
      {
        title: "Data Structures and Algorithms in Java",
        subject: "Java",
        description: "Master essential computer science concepts using Java. Covers Big O, Trees, Graphs, and HashMaps.",
        details: "Data Structures and Algorithms (DSA) are the foundation of computer science and technical interviews. In this course, implemented entirely in Java, you will master algorithmic thinking. We cover Big-O notation, Arrays, Linked Lists, Stacks, Queues, Hash Tables, Trees (Binary Search Trees, AVL Trees), Heaps, and Graphs. You will also learn essential algorithms like sorting (Merge Sort, Quick Sort), searching, and graph traversal (BFS/DFS).",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/CBYHwZcbD-s",
      },
      {
        title: "Database Management Systems (SQL)",
        subject: "Databases",
        description: "Learn relational database design, normalization, and advanced SQL querying.",
        details: "Data is the new oil, and databases are how we store it. This course teaches you everything about Relational Database Management Systems (RDBMS). You will learn how to design robust database schemas using Entity-Relationship Diagrams (ERDs) and Normalization techniques (1NF, 2NF, 3NF, BCNF). Then, you will master SQL (Structured Query Language) to create tables, insert data, and write complex JOINs, subqueries, and window functions.",
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
      },
      {
        title: "Computer Networking Crash Course",
        subject: "Networking",
        description: "Understand the Internet, OSI Model, IP addressing, subnetting, and routers.",
        details: "Ever wondered how the Internet actually works? This course demystifies Computer Networking. We break down the OSI and TCP/IP models layer by layer. You will learn about physical media, MAC addresses, switches, IP addressing (IPv4 and IPv6), subnetting, routing protocols, TCP vs UDP, DNS, and HTTP. Essential knowledge for IT professionals, sysadmins, and software engineers alike.",
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/qiQR5rTSshw",
      },
      {
        title: "Cyber Security Full Course",
        subject: "Security",
        description: "Beginner-friendly introduction to ethical hacking, cryptography, and network defense.",
        details: "Protecting systems is more important than ever. This Cyber Security course introduces you to the world of Information Security and Ethical Hacking. Topics covered include common attack vectors (phishing, malware, DDoS), the CIA triad, cryptography (symmetric vs asymmetric, hashing), network defense (firewalls, IDS/IPS), web vulnerabilities (SQL injection, XSS), and basic penetration testing methodologies.",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/U_P23SqJaDc",
      },
      {
        title: "Cloud Computing Crash Course",
        subject: "Cloud",
        description: "Learn the fundamentals of Cloud Computing, AWS, serverless architecture, and deployment.",
        details: "The cloud is where modern applications live. This course provides a solid foundation in Cloud Computing concepts (IaaS, PaaS, SaaS) and deployment models. We focus heavily on Amazon Web Services (AWS), the industry leader. You will learn how to provision EC2 virtual machines, store files in S3, set up managed databases with RDS, and explore modern serverless computing using AWS Lambda.",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://www.youtube.com/embed/2LaAJq1lB1Q",
      },
      {
        title: "Operating Systems Fundamentals",
        subject: "Systems",
        description: "Deep dive into OS kernels, process management, memory allocation, and concurrency.",
        details: "Operating Systems act as the crucial bridge between hardware and software. In this advanced course, you will look under the hood of modern operating systems like Linux and Windows. We cover system calls, process management and scheduling algorithms, threads, concurrency and synchronization (mutexes, semaphores), memory management (paging, virtual memory), and file systems.",
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
            details: c.details,
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
