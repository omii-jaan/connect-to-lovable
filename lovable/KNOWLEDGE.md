# KNOWLEDGE — SHIPYARDS (Project Knowledge)

## Product
Shipyards is the global professional identity platform for AI builders ("LinkedIn for AI developers"). One unified place where AI developers showcase shipped projects, get matched to paid work, collaborate, and build verifiable reputation. Built FOR AI builders BY AI builders. Dark, precise, premium. Brand tagline: "where AI builders ship."

## Users & Roles (2 roles in MVP)
- **Builder** — showcases projects, applies/gets invited to work. Has status: Available/Not available. Reputation score 0-2000. Invited builders are AI developers doing the work.
- **Project Creator (Founder)** — posts paid projects to the marketplace, invites/matches builders, hires. (Recruiters, enterprise pricing come post-MVP.)

## The 5 Layers (MVP = Layers 1-3; Layers 4-5 deferred)
1. **Discovery & Showcase.** Public builder profiles at `/@handle` (avatar, bio, skills, reputation score, rank badge, follower grid), project showcase (posting with media/tech/stack/models/metrics), engagement (like/comment/bookmark/share/follow), leaderboards, explore, search, analytics.
2. **Project Marketplace.** Creators (founders) post paid projects; a server-side matching engine scores builders 0-100 (past similar projects +30, stack +25, availability +20, budget history +15, style +10); personalized invitations; builders browse/apply; founder dashboard; ratings on both sides; contracts. **COMPLETE.**
3. **Collaboration Workspace ("The Yard").** Per-project trust layer between a founder and builder: milestone tracking on the contract, a shared project channel (chat bound to the project), and a deliverables handoff log. NO invasive surveillance — no keystroke/screenshot tracking, only honest, explicit submissions tracked. NEXT.
4. **Professional Identity.** `name@shipyards.dev` email, public lookup by email, verification badges. — LATER.
5. **Smart Breakdown.** AI decomposes a project into tasks w/ depencies, model recommendations, flowchart, progress build. — LATER.

## Key routes
`/` landing · `/sign-up` `/login` `/onboarding` · `/feed` · `/@[handle]` · `/project/[slug]` · `/project/new` · `/explore` · `/leaderboards` · `/marketplace` · `/marketplace/post` · `/marketplace/project/[id]` · `/invitations` · `/dashboard` · `/workspace` `/workspace/project/[id]` · `/settings/*` · `/messages` `/notifications` `/saved` `/search` `/analytics`.

## Required behavior
- Auth: Firebase email/password + Google/GitHub. At signup the user picks a role: **Builder / Project Creator / Both**. Onboarding has 4 steps (identity, expertise, connect, goals). Each user gets a public profile reachable at `/@[handle]`; validate handle uniqueness with a debounced availability check. Anonymous users can view public pages but must sign in order to create/edit/message.
- Reputation score: `(projects x10) + (followers x2) + (likes x1) + (skillTests x50) + (jobs x100) + (engagement x5)`. Rank bands: Top 1%/5%/10%.
- All engagement (like, comment, follow, bookmark) must persist to DB and be real-time across users.
- Marketplace matching = server-side (Node function in the AI Studio backend `server.ts`): produce match_score + breakdown. Invitation includes "the reason why you were invited" (past similar projects, hour levels).
- Anonymous/guest: public pages (profile, project, explore, market) DON'T require login. Only creating/editing/messaging require auth.

## Tech
React + TypeScript + Tailwind (Vite). Backend = **Firebase** — Firestore (NoSQL), Firebase Auth, Firebase Security Rules, Firebase Storage (media). Server-side logic (matching engine) lives in the AI Studio Node backend (`server.ts`, served at `/api/*`). Lucide icons. Charts: Recharts if needed. No other UI libs unless necessary.

## Design system (HARD RULES — from the design spec)
- **Dark mode is default and primary.** Light mode secondary, never default.
- Token palette (CSS variables): `--bg-base #0A0A0F` · `--bg-surface #141419` · `--bg-surface-hover #1C1C22` · `--bg-elevated #1F1F28` · `--bg-inset #050508` · `--border-default #27272A` · `--border-subtle #1F1F24` · `--border-active #3F3F46` · `--text-primary #FAFAFA` · `--text-secondary #A1A1AA` · `--text-tertiary #52525B` · `--text-muted #3F3F46` · `--accent #14B8A6` · `--accent-hover #2DD4BF` · `--accent-subtle rgba(20,184,166,0.1)` · `--success #22C55E` · `--warning #EAB308` · `--error #EF4444` `--error-subtle rgba(239,68,68,0.1)`.
- Fonts: **Geist** (UI) / **Geist Mono** (data, numbers) / fallback Inter. Use `font-variant-numeric: tabular-nums` on all numeric. Type scale: hero 48px / h1 40 / h2 32 / h3 24 / h4 20 / h5 18 / body 16(1.6) / body-sm 14 / caption 13 / caption-s 12 / mono 14/12. Max line 65ch.
- Spacing: **4px grid** (tokens 2,4,8,12,16,20,24,32,40,48,64,80,96). Radius: buttons 6px, cards 8px, modals 12px, canvases full.
- Motion: 100/150/250/350ms; easing `cubic-bezier(0.4,0,0.2,1)`; no bounce; respect `prefers-reduced-motion` (instant).
- **ANTI-VIBE (never do):** no purple/blue gradients, no glow orbs, no glassmorphism for decoration, no drop shadows in dark mode (use surface color/border for elevation), no AI sparkle icons, no generic robot visual, no "magic" copy. One exception: hero header gradient text on the landing.
- Buttons: Primary = accent bg + #0A0A0F text; Secondary = border + transparent; Ghost; Destructive = error. Icon button 32px.
- Badges: pill radius full, 12px/500. Avatar sizes 24-96px; fallback = initials.
- Nav: top bar 64px (glass scroll), left sidebar 240px (collapsible to 64); active nav = `--accent-subtle` bg + 2px accent left border.
- Icons: Lucide, stroke 1.5px, 16/20/24px. No filled icons.
- Modal overlay rgba(0,0,0,0.6) + blur; toasts bottom-right 4s auto.

## Icon choice guidance (Lucide, stroke 1.5px)
Activity (workspace), Briefcase (market), Terminal (workspace), Mail (identity), GitBranch (breakdown), Home, Compass, Trophy, User, Folder, Bookmark, BarChart3, Users, MessageSquare, Settings, Search, Bell, Heart, Share2, CheckSquare, Clock.

## Known pitfalls (things AI Studio tends to get wrong — correct these)
- Adding gradients/glow/shadows to dark UI — don't.
- Making light mode default — don't.
- Loading wrong fonts — use Geist + Geist Mono; numbers always tabular-nums.
- Putting "AI sparkle"-style fake icons — keep Lucide only.
- Putting every page in one giant component — one component per page, small children.
- Writing to Firestore without security rules — rules always.
- Hard-coding hex colors inline instead of using the CSS tokens.
- Using `lb`/`lb` label or `frame` — just copy should be and direct.

## Current status
- Layer 1 (Discovery & Showcase) ✅ COMPLETE — 12 chunks + pile, verified.
- Layer 2 (Project Marketplace) ✅ COMPLETE — 7 chunks: post → project → apply/invite → contract → rating, verified.
- **Next up: Layer 3 (Collaboration Workspace)** — trust layer for the founder+builder pair. Build plan in progress. Do not build Layers 4-5 until the plan reaches them.
- English UI copy only.

## IMPORTANT — Database single source of truth
`DB_SCHEMA_FIRESTORE.md` (or `DB_SCHEMA.md` for the old Postgres track) is the single source of truth for the schema. A schema change must be propagated to every component that reads tables/collections. Never let components silently drift from real columns.