# Sirdab Marketplace

Commercial real estate catalog platform for the Saudi Arabian market. Discover, search, filter, and book commercial properties including warehouses, workshops, storage units, and storefronts.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Supabase Auth (magic link / passwordless)
- **i18n**: Arabic (default) and English with RTL support

## Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)
- PostgreSQL client (`psql`) for database operations

## Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd marketplace-v03
npm install
```

### 2. Set Up Local Database

Add these to your `~/.zshrc` or `~/.bashrc`:

```bash
# Environment variables
export SUPABASE_SIRDAB_DB="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
export SIRDAB_MARKETPLACE_DB_DUMP="$HOME/Developer/sirdab/marketplace-v03/.data/production.dump"

# Dump production data
function dump_marketplace_production() {
    pg_dump -d "$SUPABASE_SIRDAB_DB" -v -Fc -f "$SIRDAB_MARKETPLACE_DB_DUMP"
}

# Initialize local database
function init_marketplace_db() {
    docker volume create sirdab-marketplace-db-data
    docker run -d --name sirdab-marketplace-db \
        --shm-size=2g \
        -e POSTGRES_USER=admin \
        -e POSTGRES_PASSWORD=admin \
        -p 5432:5432 \
        -v sirdab-marketplace-db-data:/var/lib/postgresql/data \
        postgres:16 \
        -c shared_buffers=256MB \
        -c work_mem=8MB \
        -c maintenance_work_mem=128MB \
        -c max_connections=100
    sleep 2
    if ! PGPASSWORD=admin psql -U admin -p 5432 -h localhost -lqt | cut -d \| -f 1 | grep -qw sirdab_marketplace_development; then
        PGPASSWORD=admin psql -U admin -p 5432 -h localhost -c "CREATE DATABASE sirdab_marketplace_test;" -c "CREATE DATABASE sirdab_marketplace_development;"
        PGPASSWORD=admin pg_restore -v --host=localhost --port=5432 --username=admin --no-owner --no-privileges --no-comments -d sirdab_marketplace_development "$SIRDAB_MARKETPLACE_DB_DUMP"
    fi
}

# Helper aliases
alias marketplace_db_start="docker start sirdab-marketplace-db"
alias marketplace_db_stop="docker stop sirdab-marketplace-db"
alias marketplace_db_shell="PGPASSWORD=admin psql -U admin -p 5432 -h localhost -d sirdab_marketplace_development"
alias marketplace_db_nuke="docker stop sirdab-marketplace-db; docker rm sirdab-marketplace-db; docker volume rm sirdab-marketplace-db-data"
```

Then run:

```bash
source ~/.zshrc
dump_marketplace_production  # Export from Supabase
init_marketplace_db          # Create local DB and restore
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
VITE_DATABASE_URL="postgresql://admin:admin@localhost:5432/sirdab_marketplace_development"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run start` | Run production server |
| `npm run check` | TypeScript type check |
| `npm run db:push` | Push Drizzle schema to database |

## Project Structure

```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn/ui)
│   ├── pages/           # Route pages
│   ├── lib/             # Utilities
│   ├── hooks/           # Custom hooks
│   └── locales/         # i18n translations (en.json, ar.json)
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   ├── auth.ts          # Supabase auth middleware
│   └── db.ts            # Drizzle connection
├── shared/              # Shared code
│   └── schema.ts        # Drizzle schema & types
└── .data/               # Local database dumps (gitignored)
```

## API Endpoints

### Public

- `GET /api/properties` - List properties (with filters)
- `GET /api/properties/:id` - Get property details
- `GET /api/public/ads/:id` - Get published ad
- `GET /api/public/ads/region/:country/:city` - List ads by city
- `GET /api/cities` - List active cities
- `GET /api/categories` - List property categories

### Authenticated

- `GET /api/my-ads` - List user's ads
- `POST /api/ads` - Create ad
- `PATCH /api/ads/:id` - Update ad
- `GET /api/ads/:id` - Get user's ad

### Visits & Bookings

- `GET/POST /api/visits` - Manage property visits
- `GET/POST /api/bookings` - Manage bookings
- `GET/POST/DELETE /api/saved/:userId` - Saved properties

## Deployment

### Build

```bash
npm run build
```

This creates:
- `dist/public/` - Static frontend assets
- `dist/index.cjs` - Bundled server

### Run Production

```bash
NODE_ENV=production node dist/index.cjs
```

### Environment Variables (Production)

```env
VITE_DATABASE_URL="postgresql://..."
VITE_SUPABASE_URL="https://..."
VITE_SUPABASE_ANON_KEY="..."
PORT=3000
NODE_ENV=production
```

## License

MIT
