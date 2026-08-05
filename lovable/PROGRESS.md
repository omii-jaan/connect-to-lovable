# PROGRESS — Shipyards Build Tracker

Status legend: ✅ done · ⏳ pending · 🔧 in progress

## Decisions (locked)
- Platform: **Google AI Studio** (Build mode), React + TypeScript + Tailwind, Vite.
- Backend: **Firebase** — Firestore + Firebase Auth + security rules (`DB_SCHEMA_FIRESTORE.md` is the active schema). Supabase/SQL path shelved.
- Old GitHub repo (`omii-jaan/connect-to-lovable`, Supabase app) = **design reference only**, not the working codebase.
- Build discipline: one chunk per prompt, verify desktop + mobile, tag version, Git-sync after each chunk.

## Setup (done)
- ✅ KNOWLEDGE.md + WORKSPACE.md pasted into AI Studio Chat → System instructions.
- ✅ START_PROMPT foundation built in Build mode (shell, tokens, placeholder pages), live preview verified.
- ✅ AGENTS.md (Firestore track) + full `lovable/` package pushed to GitHub.

## Layer 1 — chunks (all ✅)
1. ✅ Auth + Onboarding — Firebase Auth (email/password, Google, GitHub), /sign-up, /login, 4-step /onboarding, profiles = auth uid, handles collection, protected routes.
2. ✅ Public Builder Profile (/@:handle) — header, badges, stats, Follow/Message/More, sticky tabs, Overview mock, routes /@:handle, /@me, /builder/:username.
3. ✅ Projects data model — Firestore + rules (public read, owner write), firebase.ts/projects.ts helpers, seeded samples, real Projects tab grid, empty state + Create button.
4. ✅ Project creation modal + /project/:slug detail — 9-section modal, transactional like, bookmark, share, 65/35 layout, markdown render, sidebar builder card.
5. ✅ Home feed — 65/35, For You/Trending, composer → modal, feed cards w/ live hearts, right rail (profile mini card, trending, builders to follow), onSnapshot.
6. ✅ Comments — projectComments + commentLikes rules, comments.ts (onSnapshot, optimistic, latest-first), ProjectDiscussion (1-level replies, likes, owner delete, 3 states), deep counts.
7. ✅ Leaderboards — tabs + categories, sticky table, flat medals, reputation formula, 50/page, skeleton + empty states, ⌘K integration.
8. ✅ Explore + global search — 240px filter sidebar, chips + count + Clear All, mobile drawer, Grid/List, ⌘K palette search (searchKey prefix queries).
9. ✅ Analytics — 7/30/90d pills, 4 stat cards (invitation rate = Layer 2 badge), Recharts area + bar, performance table, 3 states.
10. ✅ Settings + Notifications — 5 tabs, handle rename batch, prefs persisted, Security (password/2FA mock/sessions), bell w/ unread + mark-all-read, triggers wired.
11. ✅ Messages — conversations/messages, find-or-create, split view, unreadBy, mobile back-toggle, profile Message button.
12. ✅ Landing — nav, hero (gradient exception), marquee, problem, 5 layers, timeline, waitlist band, footer; demo profile.
13. ✅ Landing polish — real app-preview sandbox (interactive tabs), NumberTicker, staggered motion, OG/Twitter cards, og-image.png, canonical.

## Layer 1 — the Pile
- ✅ 13. Seed data — 8 builders + 12 projects, varied categories, 90-day spread, searchKey, guarded seeding.
- ✅ 14. Guest sanity pass — auth-aware CTAs w/ redirect state, protected routes redirect w/ return.
- ✅ Cleanup pass — "Vibe Score"→"Reputation", Layer 2 remnants removed, /projects/:id → /project/:slug, MOCK_CONTRACTS removed.
- ✅ 15. Security rules review — full audit vs DB_SCHEMA_FIRESTORE.md, deployed, lint w/ firebase rules plugin 0 errors.
- ✅ 16. Notifications polish — no self-notifications, deterministic dedupe ids, live badge, click-to-read.
- ✅ 18. Responsive + a11y QA sweep — mobile nav strip, overflow tables, touch targets, Escape/focus, ARIA, reduced-motion; build + lint clean.
- ⏳ **17. Analytics detail / Top Builders recompute — deferred** (needs server function; schedule for Layer 2).
- ⏳ **19. Layer 1 shippable checkpoint** — final guest + authenticated test (incl. WCAG AA contrast + console-errors check), tag version, Git-sync.

## Open items
- 🔧 Remove `reputationScore` from non-owner writable counters in firestore.rules (prompt given, awaiting confirmation).
- ⏳ Gate/remove the test user switcher before production.
- ⏳ Re-run contrast (WCAG AA) + console-errors verification at the checkpoint.

## Next up
- **Layer 2 — Project Marketplace** planning (build plan + schema already drafted in DB_SCHEMA_FIRESTORE.md).
