# 🚀 Job Portal Web

A professional job search and recruitment portal website, built on a **MERN Stack** architecture combining the latest front-end technologies.

## 🛠 Technologies Used

### Framework (Frontend - `/frontend`)
- **[Next.js 16.1.6](https://nextjs.org/)**: React framework optimized for SEO using SSR (Server-Side Rendering) technology. Supports ultra-fast compilation with **Turbopack** mechanism.

- **[React 19](https://react.dev/)**: Core library for managing dynamic state.

- **[Tailwind CSS v4](https://tailwindcss.com/)**: Flexible interface design platform, enabling fast and consistent UI deployment, especially on Detail and Job List pages.

### Data Server (Backend - `/backend`)
- **[Node.js](https://nodejs.org/en/) & [Express.js](https://expressjs.com/)**: Operates and directs RESTful API flow.

- **[MongoDB](https://www.mongodb.com/)** combined with **Mongoose**: Manages JSON-formatted databases (Jobs, CVs, Accounts).

- **TypeScript**: Strictly enforces data types, minimizing typing errors during API calls.

- **JWT (JSON Web Token)**: Grants permissions and batches access (separates user and company permissions).

- **[Cloudinary](https://cloudinary.com/)**: Directly stores cover image, logo, and CV (PDF) files in the cloud environment.

---

## 📂 Project Architecture
The project is clearly divided into two independent halves for easy deployment using a hybrid Monorepo configuration:

* **`/frontend`**: The interface for end-user applications and company interactions. (Easiest deployment via **Vercel**).

* **`/backend`**: The server providing data, API controlling all logic surrounding search and filtering. (Easiest deployment via **Render**).

---

## ⚙️ Local Development Guide

### 1. Backend (Starting the API Server)
You need to set up environment variables in the `.env` file (Port, MongoDB connection string, Cloudinary API Key...). Navigate to the directory and launch:
```bash
cd backend
npm install
npm start
```
### 2. Frontend (Start the Job Portal Interface)
Open a new Terminal window, configure the `NEXT_PUBLIC_API_URL` path to point to the root of the backend (e.g., `http://localhost:5000`) via the `.env.local` file.

Then type:
```bash
cd frontend
yarn install # Or use npm install
yarn dev # The default portal will run at localhost:3000
```
