# Sirdab Marketplace 2.0

## Overview

Sirdab Marketplace is a commercial real estate catalogue platform focused on the Saudi Arabian market. The platform enables users to discover, search, and book commercial properties including warehouses, workshops, storage units, and storefronts. The core value proposition is providing a unified, searchable online catalogue with verified listings, transparent pricing, and streamlined booking/visit scheduling.

The project is built as a full-stack TypeScript application with a React frontend and Express backend, currently using in-memory storage with seed data for MVP demonstration.

## Current Status
- MVP complete with real property listings from Supabase database
- Core user journeys implemented: browse, filter, view details, schedule visits, create bookings
- Supabase authentication integrated (login, register, logout)
- Protected dashboard routes requiring authentication
- Dark/light theme support
- Bilingual support (English/Arabic) with RTL layout
- Responsive design for mobile and desktop

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared/ for shared)

Key pages:
- Home: Hero section, category showcase, featured properties, value proposition
- Properties: Filterable/searchable property catalogue with grid view
- Property Detail: Full property information with visit scheduling and booking forms
- Dashboard: User visits, bookings, and saved properties management

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful JSON API under /api prefix
- **Database**: Supabase PostgreSQL (read-only for properties via ads table)
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod integration for type-safe schemas

API endpoints handle:
- Property read and search/filter operations (GET only - Supabase is source of truth)
- Visit scheduling
- Booking management
- Saved properties (favorites)

### Authentication
- **Supabase Auth**: Client-side authentication via @supabase/supabase-js
- **Auth Context**: React context providing user state, signIn, signUp, signOut methods
- **Protected Routes**: Dashboard routes require authentication, redirect to /auth with returnUrl
- **Session Persistence**: Supabase handles session tokens and refresh automatically

Key auth files:
- `client/src/lib/supabase.ts`: Supabase client initialization
- `client/src/lib/auth.tsx`: AuthProvider context and useAuth hook
- `client/src/pages/auth.tsx`: Login/register page with useForm + Zod validation
- `client/src/components/ProtectedRoute.tsx`: Route guard component

### Data Models
Core entities defined in shared/schema.ts:
- **Users**: Authentication with username/password
- **Properties**: Commercial listings with category, location, pricing, verification status
- **Visits**: Scheduled property viewings
- **Bookings**: Property reservations with date ranges
- **SavedProperties**: User favorites/wishlist

Property categories: warehouse, workshop, storage, storefront-long, storefront-short

### Build System
- Development: tsx for TypeScript execution with Vite dev server
- Production: Custom build script using esbuild for server bundling, Vite for client
- Database migrations: Drizzle Kit with push command

### Design System
- Typography: Inter font family (Google Fonts)
- Color scheme: HSL-based CSS variables supporting light/dark themes
- Spacing: Tailwind's 2/4/6/8/12/16/20 unit scale
- Components: shadcn/ui with Radix primitives

## External Dependencies

### Database
- **PostgreSQL**: Primary database via DATABASE_URL environment variable
- **Drizzle ORM**: Database queries and schema management
- **connect-pg-simple**: Session storage (available but not currently implemented)

### UI Component Libraries
- **Radix UI**: Headless primitives for accessible components (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-styled component variants
- **Embla Carousel**: Property image carousels
- **Lucide React**: Icon library

### Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Runtime schema validation
- **drizzle-zod**: Database schema to Zod type generation

### Date Handling
- **date-fns**: Date formatting and manipulation for bookings/visits

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator