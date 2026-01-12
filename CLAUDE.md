# CLAUDE.md - Project Context

## Project Overview

Sirdab Marketplace is a commercial real estate catalogue platform for the Saudi Arabian market. Users discover, search, filter, and book commercial properties (warehouses, workshops, storage units, storefronts). Full-stack TypeScript with React frontend and Express backend, using Supabase for authentication and database.

## Tech Stack

- **Runtime**: Node.js (ESM modules)
- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL via Supabase (read-only for ads/properties)
- **ORM**: Drizzle ORM with drizzle-zod
- **Auth**: Supabase Auth (magic link / passwordless)
- **Styling**: Tailwind CSS, shadcn/ui (New York style), Radix UI primitives
- **State**: TanStack React Query v5
- **Forms**: React Hook Form + Zod
- **Routing**: Wouter
- **i18n**: i18next (Arabic default, English supported, RTL layout)
- **Package Manager**: npm

## Key Directories & Files

```
client/src/
├── App.tsx            # Root component, routes, providers
├── main.tsx           # Entry point
├── index.css          # Global styles, CSS variables, theme
├── components/        # UI components (shadcn/ui based)
├── pages/             # Route pages (home, properties, auth, dashboard, etc.)
├── lib/               # Utilities (auth, supabase, queryClient, i18n, theme)
├── hooks/             # Custom hooks (use-toast, use-mobile)
└── locales/           # Translation files (en.json, ar.json)

server/
├── index.ts           # Server entry, Express app setup
├── routes.ts          # API routes under /api
├── storage.ts         # Storage interface (IStorage)
├── db.ts              # Drizzle database connection
├── auth.ts            # Auth middleware
├── vite.ts            # Vite dev server integration
└── static.ts          # Static file serving

shared/
└── schema.ts          # Drizzle schema, Zod schemas, types

attached_assets/       # User-uploaded images/assets (@assets alias)
```

## Common Commands

```bash
npm run dev        # Start dev server (frontend + backend on port 5000)
npm run build      # Production build (Vite + esbuild)
npm run start      # Run production server
npm run check      # TypeScript type check
npm run db:push    # Push Drizzle schema to database
```

## Environment & Setup

### Required Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `VITE_SUPABASE_URL` - Supabase project URL (frontend)
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key (frontend)
- `SESSION_SECRET` - Express session secret
- `SUPABASE_DATABASE_URL` - Supabase database URL

### Dev Server

- Frontend binds to **port 5000** (0.0.0.0:5000)
- Backend API under `/api` prefix
- Vite handles HMR in development

## Code Style & Conventions

### Path Aliases

- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

### Imports

- Use path aliases, not relative paths
- Do NOT explicitly import React (JSX transform handles it)
- Use `import.meta.env.VITE_*` for frontend env vars

### Components

- Use shadcn/ui components from `@/components/ui/`
- Icons from `lucide-react`
- Forms use `useForm` + `zodResolver` from `@hookform/resolvers/zod`
- Use `data-testid` on interactive elements

### Database

- Schema in `shared/schema.ts`
- Use `createInsertSchema` from `drizzle-zod`
- Export insert type via `z.infer<typeof insertSchema>`
- Export select type via `typeof table.$inferSelect`
- Array columns: use `.array()` method (e.g., `text().array()`)

### API

- TanStack Query v5 (object form only): `useQuery({ queryKey: [...] })`
- Hierarchical queryKeys: `['/api/ads', id]` not template strings
- Mutations use `apiRequest` from `@/lib/queryClient`
- Always invalidate cache after mutations

### Translations

- Default language: Arabic (`lng: 'ar'`)
- Translation files: `client/src/locales/{en,ar}.json`
- Use `useTranslation()` hook from `react-i18next`

## Workflow Rules

- Development on Replit with automatic workflow management
- Commits are automatic on task completion
- Do NOT modify: `vite.config.ts`, `server/vite.ts`, `drizzle.config.ts`, `package.json` scripts

## Testing & Quality

- TypeScript strict mode enabled
- Run `npm run check` for type validation
- No formal test suite defined

## Warnings & Gotchas

### Critical

- **Never modify** `vite.config.ts`, `server/vite.ts`, or `drizzle.config.ts`
- **Never edit** `package.json` scripts without explicit permission
- **Port 5000 only** for frontend; backend uses same port via Vite proxy
- **No Docker/containers** - Nix environment, no nested virtualization

### Data Handling

- Properties read from Supabase `ads` table (source of truth)
- Images stored in Supabase Storage: `ads/{userId}/{slug}/images/`
- Support both legacy `imageUrl` (string) and new `images` (array)

### Frontend

- TanStack Query v5 requires object syntax
- `useToast` from `@/hooks/use-toast` (not from shadcn directly)
- `<SelectItem>` requires `value` prop
- Form errors: check `form.formState.errors`

### Styling

- HSL format for CSS variables: `H S% L%` (space-separated, no `hsl()` wrapper)
- Dark mode via `class` strategy on `<html>`
- Use semantic color tokens, not hard-coded colors
- Avoid `display: table`

### UI Patterns

- Use `hover-elevate` and `active-elevate-2` for interactions
- Never add hover/active states to `<Button>` or `<Badge>` (built-in)
- Sidebar uses shadcn Sidebar component from `@/components/ui/sidebar`
- Cards never nested inside Cards

### i18n

- RTL layout for Arabic
- Default fallback is Arabic
- Add new keys to both `en.json` and `ar.json`
