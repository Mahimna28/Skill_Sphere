import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data
  await prisma.message.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.marks.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const hash = (pw: string) => bcrypt.hash(pw, 10);

  // Create users
  const admin = await prisma.user.create({
    data: { name: "Admin User", email: "admin@demo.com", password: await hash("password123"), role: "admin" },
  });

  const teacher = await prisma.user.create({
    data: { name: "Dr. Sarah Khan", email: "teacher@demo.com", password: await hash("password123"), role: "teacher" },
  });

  const student = await prisma.user.create({
    data: { name: "Alex Johnson", email: "student@demo.com", password: await hash("password123"), role: "student", points: 1250 },
  });

  const parent = await prisma.user.create({
    data: { name: "Mr. Johnson", email: "parent@demo.com", password: await hash("password123"), role: "parent" },
  });

  console.log("✅ Users created");

  // Create courses — all public engineering courses
  const coursesData = [
    {
      title: "AI & Machine Learning",
      description: "Dive into Artificial Intelligence and Machine Learning. Learn neural networks, supervised/unsupervised learning, and build real-world AI models using Python and TensorFlow.",
      subject: "AI & ML",
      thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Python Programming",
      description: "Master Python from the ground up. Covers variables, data structures, OOP, file handling, APIs and much more. Perfect for beginners and intermediate programmers.",
      subject: "Python",
      thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Full Stack Web Development",
      description: "Build modern, responsive web apps from scratch. Learn HTML, CSS, JavaScript, React, Node.js, and deploy full-stack applications to the cloud.",
      subject: "Web Dev",
      thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Data Structures & Algorithms",
      description: "The cornerstone of computer science. Master arrays, linked lists, trees, graphs, sorting, and searching algorithms. Ace your coding interviews and competitive programming.",
      subject: "Computer Science",
      thumbnail: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Database Engineering",
      description: "Design, build, and optimize relational databases. Learn SQL, normalization, indexing, transactions, and work with PostgreSQL, MySQL, and SQLite in real projects.",
      subject: "Databases",
      thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Computer Networks",
      description: "Understand how the internet works. Cover OSI model, TCP/IP, DNS, HTTP/HTTPS, subnetting, routing protocols, and network security fundamentals.",
      subject: "Networking",
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Operating Systems",
      description: "Explore the internals of modern operating systems. Learn process management, memory management, file systems, scheduling, and concurrency with Linux-based examples.",
      subject: "Systems",
      thumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Cybersecurity Fundamentals",
      description: "Learn to protect systems from threats. Covers cryptography, ethical hacking, penetration testing, firewalls, OWASP top 10, and incident response strategies.",
      subject: "Security",
      thumbnail: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Cloud Computing with AWS",
      description: "Master cloud infrastructure on AWS. Learn EC2, S3, RDS, Lambda, IAM, and build scalable, highly available architectures using the AWS ecosystem.",
      subject: "Cloud",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Digital Electronics & Logic Design",
      description: "Understand digital circuits from the ground up. Learn Boolean algebra, logic gates, combinational and sequential circuits, flip-flops, counters, and FPGA basics.",
      subject: "Electronics",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Software Engineering & SDLC",
      description: "Understand how professional software is built. Learn Agile, Scrum, requirement engineering, software design patterns, testing strategies, and project management.",
      subject: "Software Eng.",
      thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
    },
    {
      title: "Object-Oriented Programming (Java)",
      description: "Master OOP principles with Java. Learn classes, inheritance, polymorphism, encapsulation, abstraction, design patterns, and build industry-standard applications.",
      subject: "Java",
      thumbnail: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&auto=format&fit=crop&q=60",
    },
  ];

  const createdCourses = [];
  for (const c of coursesData) {
    const course = await prisma.course.create({
      data: { ...c, teacherId: teacher.id, isPublic: true },
    });
    createdCourses.push(course);
  }

  console.log("✅ Courses created:", createdCourses.length);

  // Enroll demo student in first 3 courses
  await prisma.enrollment.createMany({
    data: [
      { userId: student.id, courseId: createdCourses[0].id },
      { userId: student.id, courseId: createdCourses[1].id },
      { userId: student.id, courseId: createdCourses[2].id },
    ],
  });

  // Add marks for the student
  await prisma.marks.createMany({
    data: [
      { studentId: student.id, subject: createdCourses[0].title, score: 88 },
      { studentId: student.id, subject: createdCourses[1].title, score: 95 },
      { studentId: student.id, subject: createdCourses[2].title, score: 92 },
    ],
  });

  console.log("✅ Enrollments and marks created");
  console.log("\n🎉 Seed complete! Demo login credentials:");
  console.log("  Student  → student@demo.com / password123");
  console.log("  Teacher  → teacher@demo.com / password123");
  console.log("  Parent   → parent@demo.com  / password123");
  console.log("  Admin    → admin@demo.com   / password123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
