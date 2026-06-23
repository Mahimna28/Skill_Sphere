# Skill Sphere

An elegant, high-performance, multi-role e-learning platform. Built with Next.js App Router, Prisma, and Framer Motion, it delivers a premium, Apple-inspired user experience for students, teachers, and parents.

![Skill Sphere Hero](public/images/hero-bg.png) 

## 🌟 Core Features

- **Premium UI/UX**: A state-of-the-art dark mode aesthetic utilizing Framer Motion for buttery-smooth micro-animations, glassmorphism, and responsive layouts.
- **Role-Based Architecture**: Dedicated dashboards and permissions for Students, Teachers, and Parents.
- **Comprehensive E-Learning Engine**: 
  - Dynamic public course catalogs with pagination and category filtering.
  - Video player with structured modules and lessons.
  - Progress tracking, enrollment history, and grading systems.
- **Teacher Profiles**: Beautiful, shareable public profiles showcasing an instructor's expertise and published courses.
- **AI Study Tutor**: Integrated OpenAI-powered assistant to help students understand complex topics.
- **Real-Time Collaboration**: Live course chat utilizing Socket.io.
- **Newsletter System**: Integrated subscription capturing and management.
- **Secure Authentication**: Custom JWT-based authentication system supporting both credentials and Google OAuth.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Next.js Server Actions & API Routes, Socket.io (custom server).
- **Database**: Prisma ORM (SQLite for local development, PostgreSQL for production).

## 🚀 Setup Instructions

1. **Install dependencies**
```bash
npm install
```

2. **Database Setup** (SQLite by default for local testing)
```bash
npx prisma db push
```

3. **Environment Variables**
Copy `.env.example` to `.env` and configure your API keys:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-key"
```

4. **Seed the Database** (Optional: adds mock courses and users)
```bash
npm run seed
```

5. **Start the Development Server** (Runs the custom server for Socket.io)
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

This project is optimized for deployment on platforms like Render or Vercel. Ensure your `DATABASE_URL` is set to a PostgreSQL connection string in production environments.

```bash
npm run build
npm start
```
