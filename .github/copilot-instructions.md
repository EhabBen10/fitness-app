## Purpose
Make small, focused code changes that match the project's Next.js (App Router) scaffold and TypeScript setup. Prefer edits that follow the existing conventions in `app/`, `public/`, and global styles.

## Quick facts (do not assume anything else)
- Framework: Next.js (app directory) — see `app/layout.tsx`, `app/page.tsx`.
- Frontend: React 19 with TypeScript (see `package.json`, `tsconfig.json`).
- Styling: Tailwind + PostCSS (`postcss.config.mjs`, `app/globals.css`).
- Fonts: `next/font/google` (Geist/Geist_Mono used in `app/layout.tsx`).
- Static assets: `public/` (images used via `next/image` in `app/page.tsx`).
- Scripts: `npm run dev` (dev), `npm run build` (build), `npm run start` (start), `npm run lint` (eslint) — see `package.json`.

## Architecture & conventions to follow
- App Router: This project uses the `app/` directory. Components inside `app/` are Server Components by default; add a top line `"use client"` to files that need client-side behavior (state, effects, browser-only APIs).
- Root layout: `app/layout.tsx` is the global layout. Place app-wide providers, fonts, and metadata here.
- Pages: start at `app/page.tsx`. Add nested folders under `app/` for routes (e.g. `app/profile/page.tsx`).
- Global styles: `app/globals.css` — keep global Tailwind utilities and CSS variables there.
- Static assets: use `/public` and reference via `/filename` or `next/image` with `src="/…"` as in `app/page.tsx`.
- Path alias: `tsconfig.json` maps `@/*` -> `./*`. Use `import X from '@/components/X'` when appropriate.

## Developer workflows (commands & expectations)
- Start development server: `npm run dev` — app serves at http://localhost:3000.
- Build for production: `npm run build` then `npm run start`.
- Lint: `npm run lint` (the `lint` script calls `eslint`). If ESLint needs inline fixes, run with appropriate flags (not present in scripts).
- Install: use `npm install` (project uses npm by default but any package manager is fine).

## Patterns & examples (copy/paste friendly)
- Client component header (use when you need useState/useEffect):

  "use client"
  import React, { useState } from 'react'

  export default function MyClientComp(){
    const [v,setV] = useState(0)
    return <div>{v}</div>
  }

- Server component (default): files without `"use client"` should avoid browser-only APIs and side effects.
- Route example: create `app/dashboard/page.tsx` to add `/dashboard` route.

## Integration & deployment notes
- Project was scaffolded with Create Next App — it's intended for deployment on Vercel. Keep server-specific secrets/config out of the repo.
- Tailwind/PostCSS are present; if you add new Tailwind utilities, update `app/globals.css` when needed.

## Files to reference when making changes
- `app/layout.tsx` — root layout, fonts, and metadata
- `app/page.tsx` — example homepage
- `app/globals.css` — global styles and tailwind base
- `package.json` — scripts and versions (Next 16, React 19)
- `tsconfig.json` — path alias `@/*`

## What to avoid / common pitfalls
- Do not assume components under `app/` are client-side; add `"use client"` explicitly for client behavior.
- Avoid changing global layout structure (providers/fonts) without confirming with maintainers — small, isolated changes are preferred.
- There are no tests detected in the repo; do not add large test infra without discussing scope.

## If you need more context
- Look at `app/layout.tsx` and `app/page.tsx` for concrete examples of fonts, global styles, and image usage.
- Ask the repo owner for preferred Node version or CI details if you plan to change build or dependency versions.

---
If anything here is unclear or you'd like more examples (component templates, API route examples, or a small unit-test scaffold), tell me which area to expand. 
