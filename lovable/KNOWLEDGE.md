# KNOWLEDGE — SHIPYARDS (Project Knowledge)

## Product
Shipyards is the global professional identity platform for AI builders ("LinkedIn for AI developers"). One unified place where AI developers showcase shipped projects, get matched to paid work, collaborate, and build verifiable reputation. Built FOR AI builders BY AI builders. Dark, precise, premium. Brand tagline: "where AI builders ship."

## Users & Roles (2 roles in MVP)
- **Builder** — showcases projects, applies/gets invited to work. Has status: Available/Not available. Reputation score 0-2000.
- **Project Creator** — posts paid projects to the marketplace, invites/matches builders, hires. (Recruiters/pricing come post-MVP.)

## The 5 Layers (MVP = Layers 1-3; Layers 4-5 deferred)
1. **Discovery & Showcase.** Public builder profiles at `/@handle` (avatar, bio, skills, reputation score, rank badge, follower grid), project showcase (posting with media/tech/stack/models/metrics), engagement (like/comment/bookmark/share/follow), leaderboards (score formula below), explore, search, analytics.
2. **Project Marketplace.** Creators post projects using a plain-English description, AI requirement parsing; a real matching engine scores builders 0-100 (past similar projects +30, stack match +25, availability +20, budget history +15, style/style +10); personalized invitations; builders browse/apply; creator dashboard; ratings on both sides; contracts.
3. **Collaboration Workspace ("The Yard").** Per-project workspace: Kanban, chat, files, git commit tracking, code review, team roles (Owner/Admin/Builder/Viewer). No invasive surveillance — only git + explicit submissions tracked.
4. **Professional Identity.** `name@shipyards.dev` email, public lookup by email, verification badges. — LATER.
5. **Smart Breakdown.** AI decomposes a project into tasks w/ dependencies, model recommendations, flowchart, progress. — LATER.

## Key routes (from design spec)
`/` landing · `/sign-up` `/login` `/onboarding` · `/feed` · `/@[handle]` · `/project/[slug]` · `/project/new` · `/explore` · `/leaderboards` · `/marketplace` · `/marketplace/post` · `/marketplace/project/[id]` · `/invitations` · `/dashboard` · `/workspace` `/workspace/project/[id]` · `/settings/*` · `/messages` `/notifications` `/saved` `/search` `/analytics`.

## Required behavior
- Auth: Supabase email/password + Google/GitHub. At signup the user picks a role: **Builder / Project Creator / Both**. Onboarding has 4 steps (identity, expertise, connect, goals). Each user gets a public profile reachable at `/@[handle]`; validate handle uniqueness with a debounced availability check. Anonymous users can view public pages but must sign in to create/edit/message.
- Reputation score: `(projects x10) + (followers x2) + (likes x1) + (skillTests x50) + (jobs x100) + (engagement x5)`. Rank bands: Top 1%/5%/10%.
- All engagement (like, comment, follow, bookmark) must persist to DB and be real-time across users.
- Marketplace matching = server-side (Supabase Edge Function or RPC): produce match_score + human-readable reasons; ensure invitation includes "why you were invited" (past similar projects, hours with a model).
- Anonymous/guest: public pages (profile, project, explore, market) DON'T require login. Only creating/editing/messaging require auth.
- RLS ON every table. Users can only edit their own profile/projects; public reads allowed.

## Tech
React + TypeScript + Tailwind. Backend = Lovable Cloud/Supabase (Postgres, Auth, Storage, Realtime, Edge Functions). Lucide icons. No other UI libs unless required (charts: Recharts if needed).

## Design system (HARD RULES — from the design spec)
- **Dark mode is default and primary.** Light mode secondary, never default.
- Token palette (CSS variables): `--bg-base #0A0A0F` · `--bg-surface #141419` · `--bg-surface-hover #1C1C22` · `--bg-elevated #1F1F28` · `--bg-inset #050508` · `--border-default #27272A` · `--border-subtle #1F1F24` · `--border-active #3F3F46` · `--text-primary #FAFAFA` · `--text-secondary #A1A1AA` · `--text-tertiary #52525B` · `--text-muted #3F3F46` · `--accent #14B8A6` · `--accent-hover #2DD4BF` · `--accent-subtle rgba(20,184,166,0.1)` · `--success #22C55E` · `--warning #EAB308` · `--error #EF4444` `--error-subtle rgba(239,68,68,0.1)`.
- Fonts: **Geist** (UI) / **Geist Mono** (data, numbers) / fallback Inter. Use `font-variant-numeric: tabular-nums` on all numeric. Type scale: hero 48px / h1 40 / h2 32 / h3 24 / h4 20 / h5 18 / body 16(1.6) / body-sm 14 / caption 13 / caption-sm 12 / mono 14/12. Max line 65ch.
- Spacing: **4px grid** (tokens spare 2,4,8,12,16,20,24,32,40,48,64,80,96). Radius: buttons 6px, cards 8px, modals 12px, avatars full.
- Motion: 100/150/250/350ms; easing `cubic-bezier(0.4,0,0.2,1)`; no bounce; respect prefers-reduced-motion (instant).
- **ANTI-VIBE-CODING (never do):** no purple/blue gradients, no glow orbs, no glassmorphism for decoration, no drop shadows in dark mode (use surface color/border for elevation), no AI sparkle icons, no generic robot 3D illustrations, no "magic" copy. One exception: hero header gradient text on the landing.
- Buttons: Primary = accent bg + #0A0A0F text; Secondary = border + transparent; Ghost; Destructive = error. Icon button 32px.
- Badges: pill radius full, 12px/500. Avatar sizes 24-96px, fallback = initials on `--bg-surface-hover`.
- Nav: top bar 64px (glass on scroll), left sidebar 240px (collapsible to 64); active nav = `--accent-subtle` bg + 2px accent left border.
- Icons: Lucide, stroke 1.5px, 16/20/24px. No filled icons.
- Modal overlay rgba(0,0,0,0.6) + blur; toasts bottom-right 4s auto.

## Icon choice guidance (Lucide, stroke 1.5px)
Layout (showcase), Briefcase (market), Terminal (workspace), Mail (identity), GitBranch (breakdown), Home, Compass, Trophy, User, Folder, Bookmark, BarChart3, Users, MessageSquare, Settings, Search, Bell, Heart, Share2, CheckSquare, Clock.

## Known pitfalls (things Lovable tends to get wrong — correct these)
- Adding gradients/glow/shadows to dark UI — don't.
- Making light mode default — don't.
- Loading the wrong fonts (default sans-serif or Google-only stack) — use Geist + Geist Mono; numbers always `tabular-nums`.
- Putting "AI sparkle"-style fake icons — keep Lucide only.
- Putting every page in one giant component — keep one component per page, small children.
- Writing to tables without RLS — RLS always.
- Hard-coding hex colors inline instead of the CSS tokens.

## Current status
MVP build in progress via Lovable. Start at Layer 1 build plan. English UI copy only.

## IMPORTANT — Database single source of truth
`DB_SCHEMA.md` in this package is the single source of truth for the schema. A schema change must be propagated to every component that reads the table. Never let components silently drift from real table columns.