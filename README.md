# School Portal – Full Stack Application

This is my first full-stack project, built to understand how frontend and backend systems work together in a real-world application.

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL + Prisma
- Authentication: JWT

## Features
- User authentication (login & register)
- Admin dashboard
- Student dashboard
- Timetable management
- API-based communication between frontend and backend

## What I Learned
- Connecting a React frontend to a backend API
- Handling authentication and protected routes
- Structuring a full-stack project
- Working with REST APIs
- Managing state across the application

## Status
This project is still in development and is being actively improved as I continue learning backend development.

## Why This Project
I built this project to move beyond frontend-only development and gain hands-on experience with full-stack workflows.

## Monorepo Structure

Full-stack school portal with a React + Vite frontend and a Node.js + Express + Prisma backend.

## Project Structure

- `frontend/` React app (Vite, TypeScript, Tailwind)
- `backend/` API server (Express, TypeScript, Prisma, PostgreSQL)

## Prerequisites

- Node.js (recommended: latest LTS)
- npm
- PostgreSQL database

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
JWT_ACCESS_SECRET=your-secret
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL_DAYS=30
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173
PORT=4000
NODE_ENV=development
```

Notes:
- `JWT_ACCESS_TTL`, `JWT_REFRESH_TTL_DAYS`, `BCRYPT_SALT_ROUNDS`, `CORS_ORIGIN`, and `PORT` have defaults in code.
- `DATABASE_URL` and `JWT_ACCESS_SECRET` are required.

## Install Dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Database Setup (Backend)

From `backend/`:

```bash
npx prisma migrate dev
```

Optional seed:

```bash
npx prisma db seed
```

## Run Locally

Terminal 1 (backend):
```bash
cd backend
npm run dev
```

Terminal 2 (frontend):
```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:4000`

## Build

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Git Notes

- Uploads are ignored by default: `backend/uploads/`
