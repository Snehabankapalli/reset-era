# Architecture

## Stack
- Frontend: Next.js 15, React 19, Tailwind CSS
- Backend: FastAPI, SQLAlchemy 2.0, Pydantic v2
- Database: PostgreSQL 16 + pgvector
- AI: Claude Sonnet 4.6 (Anthropic SDK)
- Auth: Supabase Auth (planned)
- Infra: Docker Compose (dev), Vercel + Railway (prod)

## Monorepo layout
- apps/web: Next.js product + marketing
- apps/api: FastAPI backend
- packages/schemas: shared Zod types
- packages/prompts: versioned LLM prompts
- packages/ui: shared React components
- infra/: database + docker config

## Data flow
1. User submits brain dump via POST /v1/dumps
2. API parses input, creates BrainDump record
3. Intake service extracts tasks via Claude
4. Planning service scores and selects Brutal 3
5. Frontend renders plan with first steps
6. User actions (done/delay/block) update task status
7. Nightly job freezes stale tasks
