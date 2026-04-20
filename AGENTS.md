## Project Overview

SvelteKit e-commerce store deployed to Cloudflare Workers with Neon Postgres, Better Auth, and Dodo Payments.

## Stack & Architecture

- **Framework**: SvelteKit (Svelte 5 with runes mode)
- **Adapter**: `@sveltejs/adapter-cloudflare` (Cloudflare Workers)
- **Database**: Neon Postgres via Drizzle ORM
- **Auth**: Better Auth with magic link (Resend) + Google OAuth
- **Payments**: Dodo Payments checkout
- **Styling**: Tailwind CSS v4 + shadcn-svelte components
- **Package Manager**: pnpm

## Critical Commands

```sh
pnpm run dev              # Start dev server (Vite)
pnpm run build            # Build (runs `wrangler types --check` first)
pnpm run check            # Typecheck (syncs SvelteKit types first)
pnpm run lint             # Prettier check
pnpm run format           # Prettier write

pnpm run db:push          # Push schema changes to database
pnpm run db:generate      # Generate Drizzle migrations
pnpm run db:migrate       # Run migrations
pnpm run db:studio        # Open Drizzle Studio

pnpm run gen              # Generate/update Cloudflare worker types
```

## Command Order (Required)

1. `pnpm run gen` — Regenerate Cloudflare types if `worker-configuration.d.ts` is stale
2. `pnpm run check` — Typecheck (auto-runs `svelte-kit sync`)
3. `pnpm run lint` — Formatting check before commits

## Environment Setup

Requires `.env` with these variables (see `.env.example`):

- `DATABASE_URL` — Neon Postgres connection string
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_API_KEY`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — OAuth credentials
- `RESEND_API_KEY` — Magic link email sending
- `DODO_PAYMENTS_*` — Payment gateway config

**Drizzle config** (`drizzle.config.ts`) requires `DATABASE_URL` or it throws.

## Key Entrypoints

- `src/hooks.server.ts` — Better Auth session handling (runs on every request)
- `src/lib/server/auth.ts` — Better Auth configuration
- `src/lib/server/db/schema.ts` — Drizzle schema (user, session, account, verification, product, order)
- `src/lib/stores/cart.svelte.ts` — Cart state (Svelte 5 runes store)
- `src/routes/api/auth/[...all]/+server.ts` — Auth API endpoint
- `src/routes/api/checkout/+server.ts` — Checkout creation
- `src/routes/api/webhook/+server.ts` — Dodo Payments webhook handler

## Svelte MCP Tools (Available)

- `list-sections` — Discover Svelte docs sections (use first)
- `get-documentation` — Fetch full docs for specific sections
- `svelte-autofixer` — Analyze Svelte code for issues (use before sending code)
- `playground-link` — Generate Svelte Playground link (only on request)

## Gotchas

- **Cloudflare types**: Run `pnpm run gen` if TypeScript complains about `env` or worker bindings
- **Svelte 5 runes**: All components use runes mode; avoid legacy Svelte patterns
- **Better Auth cookies**: Uses `sveltekitCookies` plugin—sessions managed via `hooks.server.ts`
- **Drizzle migrations**: Use `db:generate` then `db:migrate` for production; `db:push` for development only
