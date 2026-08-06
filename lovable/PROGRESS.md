# PROGRESS — Shipyards Build Tracker

Status legend: ✅ done · ⏳ pending · 🔧 in progress

## Decisions (locked)
- Platform: **Google AI Studio** (Build mode), React + TypeScript + Tailwind, Vite.
- Backend: **Firebase** — Firestore + Firebase Auth + security rules (`DB_SCHEMA_FIRESTORE.md` is the active schema). Supabase/SQL path shelved.
- Active GitHub repo: **`omii-jaan/connect-to-lovable`** — current Git-sync target and AI Studio clone source. `omii-jaan/05july26-wc` is the older new-account workspace (app code behind, reference only).
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
- ✅ **19. Layer 1 shippable checkpoint** — guest + authenticated passes both green (contrast AA + console clean), ready to tag + Git-sync.

## Layer 1 — ✅ COMPLETE (all 12 chunks + pile; verified end to end)

## Layer 2 — Project Marketplace (all chunks ✅, built in new-account workspace `omii-jaan/05july26-wc`)
- ✅ L2.1 Marketplace post + listing + detail — /post-project wizard (multi-step, framer-motion), marketplaceProjects collection w/ unique slug + view increments, /marketplace listing (filters: category/budget/skills/remote, sort: Newest/Budget/Timeline, grid/list toggle, search, skeleton + empty state), /marketplace/:slug detail (deliverables, skills, tech stack, meta bar, Apply modal w/ pitch + proposed rate/timeline, optimistic + notifications). Founder can't apply to own post; guests browse, Apply prompts sign-in.
- ✅ L2.2 AI Match engine (server-side) — server function computes matchScore per formula (pastSimilar +30, stack +25, availability +20, budget +15, style +10 → clamp 0-100) with breakdown; stored on post (matches[] or marketplaceMatches); owner "Top Builder Matches" panel w/ breakdown bars + Invite button (stub → L2.4); builder "Projects for you"; seeded builders matchable.
- ✅ L2.3 Applications — proposal modal → applications doc (pitch, links[], proposedRate, timeline, status), duplicate-application prevention, founder Applicants panel (mini-cards + match score badge + Accept/Reject), Accept → contracts draft + post 'matched' + notification, Reject → notification, builder "My Applications" board w/ status chips; rules: read = applicant or owner, write = applicant; deployed.
- ✅ L2.4 Invitations — founder Invite (from matches + profile) → invitations doc + notification, duplicate prevention, builder "My Invites" (Accept/Decline → contracts draft + post matched/in_progress + notifications), hidden if already applied; rules: read = invitee or founder, founder create, invitee update; deployed.
- ✅ L2.5 Contracts — contracts doc schema (terms, status active/completed, ratingStatus), drafts from L2.3/L2.4 upgraded, "My Contracts" (founder outbound / builder inbound cards + status + actions), founder "Mark as complete" → post completed + unlocks ratings, notifications on create/complete; rules: either party; deployed.
- ✅ L2.6 Ratings — 5-star + comment on completed contracts, one per role via doc id contractId_role, rating average + recent 5 on builder profile Reviews tab (replaces placeholder), founder rating chip on posts, notifications on rating received; rules: contract party create once, public read; deployed.
- ✅ L2.7 Polish + checkpoint — notifications audit (all fire, no self, dedupe, deep links), security walk of all 6 new collections vs DB_SCHEMA_FIRESTORE.md + deploy, guest pass (browse logged-out, actions gated w/ redirect), responsive + a11y sweep, seed: 2-3 founder posts + 1 completed contract w/ ratings for @demo, final checkpoint green.

## Layer 2 — ✅ COMPLETE (all 7 chunks; marketplace end to end: post → match → apply/invite → contract → rating)

## Open items
- ✅ reputationScore removed from non-owner writable counters; firestore.rules deployed to new project (light-coral-nds98).
- ✅ Supabase fully removed (supabase.ts + all imports; waitlist/api on Firebase).
- ✅ Account migration: new Google account, project imported from GitHub repo, Firebase provisioned (light-coral-nds98), rules deployed, smoke test passed.
- ✅ Layer 1 checkpoint version tagged + Git-synced in AI Studio.
- ✅ Pile 17 (Analytics detail / Top Builders recompute) — resolved by L2.2 server-side match engine.
- ✅ Full workspace state (Layer 2 + polish) synced to GitHub (`connect-to-lovable`, commit a987b52), verified build, AI Studio re-cloned from it.
- ✅ Re-pasted refreshed KNOWLEDGE.md + WORKSPACE.md (Firebase track, QUALITY BAR) into AI Studio system instructions.
- ⏳ Gate/remove the test user switcher before production.
- ⏳ Tag the Layer 2 + Layer 3 checkpoint versions + Git-sync in AI Studio.

## Layer 3 — Collaboration Workspace ("The Yard") (all chunks ✅)
- ✅ L3.1 Yard foundation — workspaces doc auto-created on active contract (transactional, idempotent backfill), `src/lib/workspace.ts` helpers (getWorkspaceByContract, listMyWorkspaces, createWorkspaceIfMissing), /workspace "My Yards" (founder/builder lists, progress rings, empty state), /workspace/:contractId shell (header + progress %, Milestones | Channel | Deliverables tabs), access = contract parties only, rules deployed, sidebar nav item.
- ✅ L3.2 Milestone tracking — `contracts.milestones[]` {id, title, description, dueDate, status pending|in_progress|done, completedAt}, "Project kickoff" backfill, progress bar (confirmed/total + %), founder add/edit/remove (locked once done), builder request completion, founder confirm (only confirmed counts), notifications (added/in_progress/requested/confirmed) + deep links, rules deployed.
- ✅ L3.3 Shared channel — `workspaceMessages` {workspaceId, senderUid, content, createdAt, readBy[]}, onSnapshot realtime, day groups, role-colored sender chips, sticky composer (Enter send / Shift+Enter newline), optimistic send, auto-scroll, unread badges (tab + nav item), notifications (no self, dedupe, deep links), rules deployed.
- ✅ L3.4 Deliverables handoff — `workspaceDeliverables` {submitterUid, title, description, links[], status submitted|accepted|revision_requested, revisionNote, submittedAt, reviewedAt}, submit modal (1-3 links), status chips, founder Accept / Request revision (note + resubmit), completion handshake (all milestones confirmed + all deliverables accepted → contract completed + post completed + ratings unlock per L2.6), rules deployed.
- ✅ L3.5 Polish + checkpoint — notifications audit (all fire, no self, dedupe, deep links), security walk (workspaces/workspaceMessages/workspaceDeliverables = members only, deployed, lint clean), guest pass (auth-gated w/ return), responsive + a11y sweep, seed (@demo: 1 active contract w/ 2 milestones + 3 messages + 1 deliverable; 1 completed contract w/ accepted deliverables + L2.7 ratings), final checkpoint green, version tagged + Git-synced.

## Layer 3 — ✅ COMPLETE (all 5 chunks; MVP Layers 1-3 done end to end: showcase → match → contract → collaborate → deliver)

## Next up
- **MVP complete (Layers 1-3).** Before any Layer 4/5 work: production hardening — gate/remove test user switcher, final guest + authenticated pass on the tagged version, decide Layers 4-5 scope (email identity, smart breakdown) with a new build plan.
