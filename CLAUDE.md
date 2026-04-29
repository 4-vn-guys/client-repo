# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 3001
npm run build      # Production build
npm run lint       # ESLint with auto-fix
npm run format     # Prettier format
npm run analyze    # Bundle analysis
```

No test runner is configured in this project.

## Architecture

**CourtConnect** — a sports court booking platform (football, badminton, pickleball) built with Next.js 16 App Router, TypeScript, Tailwind CSS 4, Zustand, and TanStack React Query.

### Feature-Sliced Design (FSD)

The project strictly follows FSD with unidirectional imports only:

```
app → widgets → features → entities → shared
```

Each layer is forbidden from importing from a higher layer. Each slice exports its public API through an `index.ts` barrel file. Directories:

- `app/` — Next.js routes (thin wrappers that import from `src/pages/`)
- `src/pages/` — Full page compositions
- `src/widgets/` — Composite UI components assembled from features/entities
- `src/features/` — User-facing functionality (auth, booking-calendar, owner flows, search)
- `src/entities/` — Domain models: `booking`, `court`, `venue`, `user`, `sport` — each has `api/`, `model/`, `ui/` subdirs
- `src/shared/` — Framework-agnostic utilities, base UI, providers, store, types, i18n config

### Routing

Route groups in `app/`:
- `(home)` — public home page
- `(simple-header)` — auth pages (login, register, forgot-password)
- `owner/` — protected owner dashboard; dynamic route `[venueId]/timeline`

`app/` pages are minimal: they import and re-export the real page component from `src/pages/`.

### State & Data Fetching

- **Auth state**: Zustand store at `src/shared/store/auth-store.ts`, persisted to localStorage. Fields: `user`, `accessToken`, `refreshToken`, `isAuthenticated`, `isLoading`.
- **Server state**: TanStack React Query with 60-second default `staleTime`. Query hooks live in `src/features/*/model/use-*.ts`.
- **HTTP**: Centralized Axios instance at `src/shared/lib/axios.ts`. It auto-attaches `Bearer` token from auth store and redirects to `/login` on 401. Base URL from `NEXT_PUBLIC_API_URL`.

### Key Conventions

- **API normalisation**: Booking status values from the API are PascalCase (`Pending`, `Confirmed`); the app normalises them to lowercase. Colour configs per status live in `src/shared/config/booking-status.ts`.
- **Forms**: TanStack React Form + Zod. Schemas are co-located in the feature's `model/` directory via hooks like `useAuthSchemas()`.
- **i18n**: `next-intl` — components call `useTranslations('PageName')` and keys follow `PageName.fieldName` convention.
- **Styling**: Tailwind CSS 4; Prettier auto-sorts classes via `prettier-plugin-tailwindcss`. Print width 80, single quotes, 2-space indent.
- **Performance targets**: LCP < 2.5 s, INP < 200 ms, CLS < 0.1. Use `next/image` with explicit dimensions, debounce handlers, and `startTransition` for non-urgent updates. Detailed rules in `.cursor/rules/performance.mdc`.
