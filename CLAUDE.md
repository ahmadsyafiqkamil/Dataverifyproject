# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Frontend
npm run dev       # Start Vite dev server (port 5173)
npm run build     # Production build (vite build)

# Backend
cd backend && python3 -m uvicorn app.main:app --reload --port 8000
cd backend && python3 -m pytest tests/ -v
```

## Architecture Overview

**DataVerify Subnet** is a Vite + React frontend with a FastAPI backend for a blockchain-based synthetic data marketplace (Bittensor integration).

### Backend (FastAPI)

The `backend/` directory contains a FastAPI application serving mock data that mirrors all frontend interfaces.

- **Entry point**: `backend/app/main.py` — FastAPI factory with CORS
- **Routers**: `backend/app/routers/` — buyer, miner, validator, network, auth
- **Models**: `backend/app/models/` — Pydantic models matching TS interfaces (camelCase JSON)
- **Mock data**: `backend/app/mock/` — JSON fixtures transcribed from frontend hardcoded data
- **Service**: `backend/app/services/mock_data.py` — in-memory filtering/sorting/pagination
- **Tests**: `backend/tests/` — 29 tests using httpx.AsyncClient

All API responses use `{"success": bool, "data": T, "error": str | null, "meta": {...}}` envelope.

### Three User Portals

| Portal | Route Prefix | Theme Color | Purpose |
|--------|-------------|-------------|---------|
| Buyer/Consumer | `/` | Cyan (`#38bdf8`) | Browse and purchase datasets |
| Miner | `/miner` | Amber (`#f59e0b`) | Submit datasets, track earnings |
| Validator | `/validator` | Purple (`#a855f7`) | Review submissions, consensus scoring |

Each portal has its own layout wrapper (`RootLayout`, `MinerLayout`, `ValidatorLayout`) with a distinct sidebar, color scheme, and portal-specific nav.

### Routing

Routes are defined in `src/app/routes.tsx` using React Router v7 `createBrowserRouter`. The pattern is:
- Standalone routes (no layout): `/landing`
- Layout-wrapped routes with nested children: `/`, `/miner`, `/validator`

### Data Layer

Frontend currently uses hardcoded data in `src/app/data/marketplaceDatasets.ts` (12 dataset objects). The FastAPI backend at `backend/` serves the same data via REST endpoints, ready for frontend wiring in Phase 2.

### State Management

Local `useState` only — no Redux, Zustand, or Context. Each page manages its own UI state.

### Component Organization

```
src/app/
├── routes.tsx              # All route definitions
├── pages/                  # One file per page (19 pages)
├── layouts/                # RootLayout, MinerLayout, ValidatorLayout
├── components/
│   ├── ui/                 # 50+ shadcn/ui primitives (source of truth for UI)
│   ├── landing/            # 13 landing page sections
│   ├── marketplace/        # MarketplaceCard, FilterSidebar
│   ├── miner/
│   │   └── submit/         # 4-step form wizard (Step1–Step4 + FormPrimitives)
│   └── figma/              # ImageWithFallback
└── data/
    └── marketplaceDatasets.ts
```

### Path Alias

`@` resolves to `./src` (configured in `vite.config.ts`).

### Design System

- **Dark theme only** — base background `#0f172a`
- Domain color coding: Healthcare=Cyan, Finance=Emerald, Autonomous=Orange, NLP=Purple, CV=Pink
- Visual style: glassmorphism, ambient dot-grid backgrounds, glowing accents, gradient text
- Icons: Lucide React (primary), Material UI Icons (secondary)
- shadcn/ui components are in `src/app/components/ui/` — extend from there

### Miner Submit Wizard

The multi-step dataset submission flow lives in `src/app/components/miner/submit/`:
- `Step1DatasetInfo`, `Step2TechnicalSpecs`, `Step3PrivacySettings`, `Step4Review`
- Shared form fields in `FormPrimitives.tsx`
- Shared types in a `types.ts` file within that directory

### Quality Metrics

Datasets have 5 quality dimensions: Statistical Fidelity, Privacy Score, Bias Score, Utility, Realism. These are displayed with color coding and percentage values throughout the UI.
