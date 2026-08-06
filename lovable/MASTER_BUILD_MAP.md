# MASTER_BUILD_MAP — Shipyards (whole build, zoomed out)

**Vision:** "Where AI builders ship." One verified identity for AI builders → discovered → hired → trusted. Built FOR AI builders BY AI builders. Dark, precise, premium (muted-teal accent). **MVP = Layers 1-3. Layers 4-5 deferred** (need a new build plan before active builds).

---

## ✅ LAYER 1 — DISCOVERY & SHOWCASE (12 chunks + pile — COMPLETE)
1. Auth + Onboarding (Firebase email/Google/GitHub, 4-step)
2. Public Builder Profile `/@handle`
3. Projects data model + Profile Projects tab
4. Project creation modal + `/project/:slug` detail
5. Home Feed (For You/Trending, live likes)
6. Comments (1-level replies, deep counts)
7. Leaderboards (tabs, reputation formula)
8. Explore + global search (⌘K)
9. Builder analytics (Recharts)
10. Settings + Notifications (bell, triggers)
11. Messages (split view, realtime)
12. Landing (hero, marquee, 5 layers)
13. Seed data · guest pass · security audit · notifications polish · responsive/a11y QA · checkpoint

## ✅ LAYER 2 — PROJECT MARKETPLACE (7 chunks — COMPLETE)
L2.1 Post wizard + `/marketplace` listing + detail + Apply modal
L2.2 AI Match engine (server-side, 0-100 w/ breakdown)
L2.3 Applications (founder panel, Accept/Reject)
L2.4 Invitations (invite → Accept/Decline)
L2.5 Contracts (My Contracts, Mark as complete)
L2.6 Ratings (5-star both sides, Reviews tab)
L2.7 Polish + checkpoint (notifications audit, security walk, seed)

## ✅ LAYER 3 — COLLABORATION WORKSPACE "THE YARD" (5 chunks — COMPLETE)
L3.1 Yard foundation (workspace auto-create, /workspace, shell, rules)
L3.2 Milestone tracking (milestones[], progress, confirm)
L3.3 Shared channel (realtime Yard chat, unread badges)
L3.4 Deliverables handoff (submit → accept/revision → completion handshake)
L3.5 Polish + checkpoint (notifications, security, guest pass, a11y, seed)

**Scope note:** The Yard is the trust layer for a founder+builder pair — milestone tracking, shared channel, deliverables handoff. No surveillance (no keystrokes/screens/git scraping). Kanban, teams/roles, editor, git integrations = post-MVP.

## ⏳ LAYER 4 — PROFESSIONAL IDENTITY (future)
`name@shipyards.dev` email · public lookup by email · verification badges

## ⏳ LAYER 5 — SMART BREAKDOWN (future)
AI decomposes a project into tasks w/ dependencies · model recommendations · progress story

## Open items
- ⏳ Gate/remove the test user switcher before production (revoke only, or keep gated behind a flag).
- ⏳ Tag Layer 2 checkpoint version + Git-sync in AI Studio.
- ⏳ Layer 3 version tagged + verified for guests + authenticated (guest = public pages, actions auth-gated).
- ⏳ Decide Layers 4-5 scope + write build plan before building them.

## Repo notes
- **Active repo:** `omii-jaan/connect-to-lovable` — Git-sync target, contains full Layers 1-3 app.
- `omii-jaan/05july26-wc` — older new-account workspace clone; app code behind (no Layer 2). Reference only.
- `lovable/` — the authoritative memory package (KNOWLEDGE, SCHEMA, PLANS, PROGRESS). Keep in sync.
- After each version change: `git add -A && git commit -m "<scope>" && git push origin main`.