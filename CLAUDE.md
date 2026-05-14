# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MERN stack job portal web application (Vietnamese market). Monorepo with independent frontend and backend. Job seekers can browse/apply to jobs; companies can post jobs and manage CV submissions.

## Commands

### Frontend (`/frontend`)
```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint
```

### Backend (`/backend`)
```bash
npm run start    # Dev server with nodemon (localhost:5000)
npm run build    # Compile TypeScript → dist/
npm run prod     # Run compiled production build
```

## Environment Variables

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_TINYMCE=<tinymce_api_key>
```

**Backend** (`backend/.env`):
```
DATABASE=<mongodb_atlas_connection_string>
SECRET_KEY=<jwt_secret>
NODE_ENV=development
CLOUDINARY_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
CLIENT_URL=http://localhost:3000
```

## Architecture

### Stack
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
- **Backend**: Express 5 + TypeScript + MongoDB (Mongoose) + JWT (HttpOnly cookies)
- **Storage**: Cloudinary for images and PDF CVs
- **Forms**: Just Validate (client-side), Joi (server-side)
- **Rich text**: TinyMCE for job description editing
- **File upload**: FilePond + Multer + Cloudinary

### Dual Account System
Two completely separate account types with separate models, routes, controllers, and middleware:
- `AccountUser` — job seekers (`/user/*` routes, `verifyUser` middleware)
- `AccountCompany` — employers (`/company/*` routes, `verifyCompany` middleware)

Both authenticate via JWT stored in HttpOnly cookies. The frontend `useAuth` hook calls `GET /auth/check` on every route change to get the current session.

### Frontend Route Protection
`frontend/src/middleware.ts` (Next.js middleware) protects:
- `/user-manage/*` — requires `AccountUser` session
- `/company-manage/*` — requires `AccountCompany` session

### API Communication
All fetch calls include `credentials: "include"` to send cookies cross-origin. Backend CORS is configured with `credentials: true` and `origin: CLIENT_URL`.

### Backend Request Flow
```
Route → Auth Middleware (JWT verify) → Controller → Model → Response
```
Protected routes attach the decoded account to `req.account` (via `AccountRequest` interface in `interfaces/request.interface.ts`).

### File Upload Flow
Multer middleware → `cloudinary.helper.ts` → `it_jobs_uploads/` folder on Cloudinary. Supported types: jpg, jpeg, png, pdf.

### API Response Format
All endpoints return `{ code, message, data }`.

### Key Data Relationships
- `Job` has `companyId` (ref: `AccountCompany`)
- `CV` has `userId` (ref: `AccountUser`) and `jobId` (ref: `Job`)
- CV statuses: `initial` | `approved` | `rejected`

### Backend Folder Conventions
| Folder | Purpose |
|---|---|
| `controllers/` | Business logic per domain |
| `routes/` | Express routers, aggregated in `index.route.ts` |
| `models/` | Mongoose schemas |
| `middlewares/` | JWT auth middleware |
| `validates/` | Joi request schemas |
| `helpers/` | Cloudinary storage config |
| `interfaces/` | TypeScript interfaces (e.g., `AccountRequest`) |
