# Skill Sphere

A modern multi-role e-learning platform built with Next.js App Router, Prisma, PostgreSQL, and Socket.io.

## Setup Instructions

1. Install dependencies
```bash
npm install
```

2. Database Setup (SQLite by default for local testing)
```bash
npx prisma db push
```

3. Environment Variables
Copy `.env.example` to `.env` and add your `OPENAI_API_KEY`.

4. Start the server (runs Custom Server for Socket.io)
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Features
- Neo-brutalism UI with Shadcn
- Split-screen Login with Demo buttons
- Real-time Course Chat using Socket.io
- AI Study Tutor using OpenAI
- Prisma ORM
