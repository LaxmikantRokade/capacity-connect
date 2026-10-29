# CAPACITY CONNECT

> **Smart India Hackathon 2026 — Problem Statement ID: SIH26075**  
> **Domain:** Digital Capacity Building, Competency Development & Organizational Learning Management Portal

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Node.js / Express](https://img.shields.io/badge/Backend-Express%204.21-green.svg)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-1b222d.svg)](https://www.prisma.io/)
[![Database](https://img.shields.io/badge/Database-SQLite%20%2F%20PostgreSQL-blue.svg)](https://sqlite.org/)
[![Test Suite](https://img.shields.io/badge/Tests-Vitest%20%26%20Testing%20Library-yellow.svg)](https://vitest.dev/)

---

## 📌 Executive Summary & SIH26075 Alignment

**Capacity Connect** is a centralized, enterprise-grade Digital Capacity Building and Learning Management Portal engineered for large public sector departments, autonomous administrative institutes, and corporate enterprises. 

In adherence to the **National Programme for Civil Services Capacity Building (Mission Karmayogi)** and national **CERT-In cyber incident guidelines**, Capacity Connect bridges the divide between static role specifications and dynamic skill benchmarks through:
1. **Role-Based Competency Matrix:** Clear separation between self-reported proficiencies and supervisor-verified competency scores across a 5-tier proficiency taxonomy.
2. **Modular Curriculum Delivery:** Video streaming, rich technical documentation, and checkpoint quizzes with progress calculation.
3. **Automated Assessment & Credential Engine:** Instant evaluation, threshold enforcement, and tamper-evident digital certificates with unique SHA-256 verification hashes.
4. **Synchronous Training Management:** Session scheduling, modality filtering (Online, In-Person, Hybrid), real-time seat capacity reservation, and attendance rosters.
5. **Organizational Knowledge Repository:** Standard Operating Procedures (SOPs), compliance guides, and technical blueprints with tagging and bookmarking.
6. **CapacityBot AI Assistant:** A deterministic local knowledge assistant answering questions regarding national directives, India Stack (DPI), and recommending learning pathways to close competency gaps.

---

## 🏗️ System Architecture

Capacity Connect uses a modular client-server architecture:

```
CapacityConnect/
├── client/                     # Frontend Application (React 18 + TypeScript + Vite)
│   ├── public/                 # Static assets & SPA rewrite rules (_redirects)
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, Layout, CapacityBotModal, Footer
│   │   ├── context/            # AuthContext (JWT, local session, demo roles)
│   │   ├── data/               # Structured seed datasets & mock fallback store
│   │   ├── pages/              # 13 Core module views & workflows
│   │   ├── services/           # Configurable API client (VITE_API_URL + fallback)
│   │   ├── test/               # Vitest & React Testing Library test specs
│   │   └── types/              # Domain TypeScript interfaces
│   ├── index.html
│   ├── tailwind.config.js      # Navy/Indigo base with teal accents
│   └── vite.config.ts          # Proxy target + preview configuration
├── server/                     # Backend API Service (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma       # SQLite schema (Development & persistent disk)
│   │   ├── schema.postgresql.prisma # PostgreSQL schema (Cloud production)
│   │   ├── dev.db              # Local SQLite development database
│   │   └── seed.ts             # Comprehensive database seed script
│   ├── src/
│   │   ├── middleware/         # JWT verification & requireRole() RBAC guards
│   │   ├── routes/             # Modular routers (auth, courses, skills, etc.)
│   │   ├── index.ts            # Express server (HOST 0.0.0.0, dynamic PORT)
│   │   └── index.test.ts       # Supertest API integration tests (/health check)
│   └── tsconfig.json
├── docs/                       # Architecture & compliance blueprints
├── render.yaml                 # Render Infrastructure-as-Code Blueprint
├── .env.example                # Sample environment configurations
├── .gitignore                  # Security & build exclusions
└── package.json                # Root workspace orchestration
```

---

## 👥 Core User Roles & Pre-Seeded Demo Accounts

The application provides pre-configured demo credentials across the 4 core stakeholder personas. You can also switch between them instantly in the UI via the **Quick Demo Switcher** in the top navigation bar.

| Role | Name | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Learner / Employee** | Rahul Sharma | `rahul.sharma@gov.in` | `Learner@123` | Enrolls in courses, tracks progress, takes assessments, self-rates skills, earns certificates, reserves workshop seats. |
| **Trainer / Instructor** | Priya Nair | `priya.nair@trainer.in` | `Trainer@123` | Verifies learner skills, schedules live workshops, monitors participant capacity, publishes knowledge guides. |
| **Organization Manager** | Anita Deshmukh | `anita.deshmukh@dept.in` | `Manager@123` | Reviews team skill deficit radar, assigns mandatory courses to employees/divisions, monitors department completion rates. |
| **System Administrator** | Vikram Malhotra | `admin@capacityconnect.in` | `Admin@123` | Full access to user roster, system health audits, platform-wide metrics, and CSV audit roster exports. |

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22.x recommended)
- **npm**: v9.0.0 or higher

### 1. Installation
Clone or navigate to the repository directory and install all workspace dependencies:
```bash
npm install
```

### 2. Environment Setup
Copy the example environment files:
```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3. Database Initialization & Seeding (SQLite)
```bash
# Push Prisma schema to SQLite
npm run db:push

# Seed database with realistic Indian governance & security datasets
npm run db:seed
```

### 4. Running Locally
Run both client and server concurrently:
```bash
npm run dev
```
- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5001](http://localhost:5001) (Health check: `/health` or `/api/health`)

---

## 🌐 Production Deployment Guide (GitHub + Render)

This project is prepared for deployment using **GitHub** and **Render** with a decoupled architecture:
1. **Frontend:** Render Static Site (React 18 + Vite SPA)
2. **Backend:** Render Web Service (Node.js + Express + Prisma)
3. **Database:** Render Managed PostgreSQL (or Render Persistent Disk for SQLite)

```
┌─────────────────────────────────┐       HTTPS / REST API       ┌─────────────────────────────────┐
│     Render Static Site          │ ───────────────────────────> │     Render Web Service          │
│     capacityconnect.onrender.com│                              │ capacityconnect-api.onrender.com│
└─────────────────────────────────┘                              └─────────────────────────────────┘
                 │                                                                │
      SPA Rewrite: /* -> /index.html                                     Prisma ORM (PostgreSQL)
                                                                                  │
                                                                                  ▼
                                                                 ┌─────────────────────────────────┐
                                                                 │     Render PostgreSQL DB        │
                                                                 │     capacity_connect (Managed)  │
                                                                 └─────────────────────────────────┘
```

---

### Step 1: Push Repository to GitHub
Create a new GitHub repository and push the workspace:
```bash
git init
git add .
git commit -m "feat: complete CapacityConnect SIH26075 project with deployment configuration"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/CapacityConnect.git
git push -u origin main
```

---

### Step 2: Deploy Backend Web Service (Render)

1. Log into your [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your **GitHub** repository (`CapacityConnect`).
3. Configure the Web Service settings:
   - **Name:** `capacityconnect-api`
   - **Region:** `Oregon (US West)` or `Singapore`
   - **Branch:** `main`
   - **Root Directory:** *(leave blank — defaults to repository root)*
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm install && npm run build:server && npm run --prefix server prisma:push && npm run --prefix server seed
     ```
     *(Note: If connecting to Render PostgreSQL, replace `prisma:push` with `npm run --prefix server prisma:pg:push`)*
   - **Start Command:**
     ```bash
     npm run --prefix server start
     ```
   - **Plan:** `Free`
4. Expand **Advanced** and set the **Health Check Path** to:
   ```
   /api/health
   ```
5. In the **Environment Variables** section, add the following variables:

| Key | Example Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enforces production optimizations |
| `HOST` | `0.0.0.0` | Binds to all network interfaces |
| `PORT` | `10000` | Render assigns this dynamically; Express respects `process.env.PORT` |
| `CLIENT_URL` | `https://capacityconnect.onrender.com` | URL of your deployed frontend (update after Step 3) |
| `DATABASE_URL` | `file:./dev.db` *(or PostgreSQL connection string)* | See Database Persistence section below |
| `JWT_SECRET` | *(Click "Generate" in Render or use a strong 32-char random string)* | Used for cryptographic token signing |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |

6. Click **Create Web Service**. Wait for the deployment to finish.
7. Note down your backend URL: e.g., `https://capacityconnect-api.onrender.com`.

---

### Step 3: Deploy Frontend Static Site (Render)

1. In the Render Dashboard, click **New +** → **Static Site**.
2. Select your `CapacityConnect` repository.
3. Configure the Static Site settings:
   - **Name:** `capacityconnect` (or `capacityconnect-web`)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank)*
   - **Build Command:**
     ```bash
     npm install && npm run build:client
     ```
   - **Publish Directory:**
     ```
     client/dist
     ```
4. In the **Redirects / Rewrites** tab:
   Render detects `client/public/_redirects` automatically, or you can add the rule manually:
   - **Type:** `Rewrite`
   - **Source:** `/*`
   - **Destination:** `/index.html`
   *(This ensures direct browser refreshes on routes like `/courses` or `/dashboard` load properly without 404s).*
5. In **Environment Variables**, add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://capacityconnect-api.onrender.com` | Replace with your actual backend URL from Step 2 |

6. Click **Create Static Site**.
7. Once deployed, copy your static site URL (e.g. `https://capacityconnect.onrender.com`) and ensure it matches the `CLIENT_URL` environment variable in your Backend Web Service (Step 2).

---

### Step 4: Database Persistence in Production

> [!IMPORTANT]
> **Ephemeral Disk Notice:** On Render Free Web Services, the filesystem is ephemeral and resets on restart or inactivity. To ensure user accounts, enrollments, and quiz results persist indefinitely, use one of the two options below:

#### Option A: Managed PostgreSQL (Recommended for Production)
1. On Render, click **New +** → **PostgreSQL**.
2. Name it `capacityconnect-db`, choose the `Free` plan, and create the database.
3. Copy the **Internal Database URL** (e.g., `postgresql://capacity_user:pass@dpg-...-a/capacity_connect`).
4. In your `capacityconnect-api` Web Service environment variables:
   - Set `DATABASE_URL` to the copied PostgreSQL connection string.
   - Update your backend **Build Command** to use the PostgreSQL schema:
     ```bash
     npm install && npm run build:server && npm run db:pg:push && npm run db:pg:seed
     ```
5. Trigger manual deploy. Prisma will automatically generate tables and seed initial data into PostgreSQL.

#### Option B: Render Persistent Disk (SQLite)
1. In `capacityconnect-api` Web Service, go to **Disks** → **Add Disk**.
2. Mount Path: `/var/data`, Size: `1 GB`.
3. Set `DATABASE_URL="file:/var/data/dev.db"`.
4. The SQLite database will now persist across container restarts.

---

### 5. Automated Blueprint (Alternative: 1-Click Infrastructure as Code)

This repository includes a pre-configured [`render.yaml`](file:///Users/apple/Documents/Projects/CapacityConnect/render.yaml) file. You can deploy the complete stack using Render Blueprints:
1. In Render Dashboard, click **Blueprints** → **New Blueprint Instance**.
2. Select your `CapacityConnect` repository.
3. Render will read `render.yaml` and configure both the backend web service and frontend static site automatically.

---

## 🧪 Testing & Verification Results

All tests and production builds have been executed and verified in this workspace:

```bash
# 1. Backend Integration Tests (Supertest + Vitest)
npm run test:server
✓ src/index.test.ts (6 tests passed)
  - GET /health
  - GET /api/health
  - GET /api/courses
  - GET /api/skills
  - GET /api/certificates/verify/:certNumber
  - GET /api/nonexistent (404 check)

# 2. Frontend Component Tests (React Testing Library + Vitest)
npm run test:client
✓ src/test/App.test.tsx (2 tests passed)

# 3. Production Builds
npm run build:server
✓ server: tsc compiled cleanly to dist/

npm run build:client
✓ client: tsc && vite build (2,402 modules transformed, built in 5.42s)
✓ _redirects copied to client/dist/_redirects
```

---

## 📄 License & Attribution
Developed for **Smart India Hackathon 2026** (Problem Statement ID: **SIH26075**).  
Licensed under the MIT License.
