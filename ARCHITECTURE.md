# Fintriq Architecture Overview

## Stack

- Backend: Express 5, TypeScript, Prisma ORM, PostgreSQL
- Frontend: Next.js 14, TypeScript, React 18
- Auth: JWT access tokens + refresh tokens in `httpOnly` cookies
- API client: Axios with normalized `NEXT_PUBLIC_API_URL`

## Backend Structure

- `backend/src/app.ts` — app initialization, middleware, security, routes
- `backend/src/modules/*` — feature modules with controller/service/repository patterns
- `backend/src/utils/logger.ts` — centralized Winston logger
- `backend/prisma/schema.prisma` — data model and indexes

## Frontend Structure

- `frontend/src/app` — Next.js app routes and layouts
- `frontend/src/components` — reusable UI components
- `frontend/src/hooks` — data access hooks for auth, dashboard, org, transactions
- `frontend/src/lib/api.ts` — Axios instance with safe base URL normalization

## Security and Production Hardening

- CSRF header validation for logout and state-changing endpoints
- Route protection middleware using Next.js `middleware.ts`
- Strict refresh token rotation and invalidation
- Health endpoint for uptime checks
- Environment examples for both backend and frontend
- CI pipeline with linting, type checking, test execution, and Prisma validation

## Deployment Notes

- Ensure `NEXT_PUBLIC_API_URL` points at the backend origin, not the internal API path.
- Backend must expose `GET /health` for readiness checks.
- Keep `JWT_SECRET` and `JWT_REFRESH_SECRET` secure and distinct.
