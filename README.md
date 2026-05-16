# Fintriq

Fintriq is a SaaS-ready finance and transaction management platform with an Express/Prisma backend and a Next.js frontend.

## Local Setup

### Backend
1. Copy `backend/.env.example` to `backend/.env`.
2. Set `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`, and `FRONTEND_URL`.
3. Install dependencies:
   - `cd backend && npm install`
4. Run the backend:
   - `npm run dev`

### Frontend
1. Copy `frontend/.env.example` to `frontend/.env`.
2. Set `NEXT_PUBLIC_API_URL` to the backend base URL, e.g. `http://localhost:5000`.
3. Install dependencies:
   - `cd frontend && npm install`
4. Run the frontend:
   - `npm run dev`

## Production Readiness

### Key improvements
- Secure JWT refresh token handling with rotation and `httpOnly` cookies.
- CSRF-protected logout flows.
- API base URL normalization to avoid `/api/api` collisions.
- Protected frontend routes for dashboard, team, audit, and settings.
- Health check endpoint at `GET /health`.
- GitHub Actions CI with lint, typecheck, tests, and Prisma validation.

## Health Check

Backend health endpoint:
- `GET /health`

## Useful Commands

### Backend
- `npm run lint`
- `npm run build`
- `npm run start`
- `npm run test`

### Frontend
- `npm run lint`
- `npm run build`
- `npm run dev`
- `npm run test`
