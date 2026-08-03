# PROGRESS — Shipyards Build Tracker

Status legend: ✅ done · 🔧 in progress · ⏳ pending

## Decisions (locked)
- Platform: **Google AI Studio** (Build mode), React + TypeScript + Tailwind, Vite.
- Backend: **Firebase** — Firestore + Firebase Auth + security rules (`DB_SCHEMA_FIRESTORE.md` is the active schema). Supabase/SQL path shelved.
- Old GitHub repo (`omii-jaan/connect-to-lovable`, Supabase app) = **design reference only**, not the working codebase.
- Build discipline: one chunk per prompt, verify desktop + mobile, tag version, Git-sync after each chunk.

## Setup (done)
- ✅ KNOWLEDGE.md + WORKSPACE.md pasted into AI Studio Chat → System instructions.
- ✅ START_PROMPT foundation built in Build mode (shell, tokens, placeholder pages), live preview verified.
- ⏳ AGENTS.md — NOT yet pushed anywhere (see note below).

## Layer 1 chunks (BUILD_PLAN.md)
- ✅ **Chunk 1 — Auth + Onboarding**: Firebase Auth (email/password, Google, GitHub), /sign-up, /login, 4-step /onboarding, profiles document = auth uid, handles collection, protected routes.
- ⏳ **Chunk 2 — Public Builder Profile** (`/@:handle`): header (avatar, badges, stats, Follow/Message/More), sticky tabs, Overview tab with mock profile. Projects/Skills/Activity/Reviews = "Coming in a later step" empty states. **Prompt given, NOT yet built in AI Studio.**
- ⏳ **Chunk 3 — Projects data model + Profile Projects tab** [DATA]: Firestore collections `projects`, `projectLikes`, `projectBookmarks` + security rules; real Projects tab grid on profile; seed 2 sample projects.
- ⏳ Chunk 4 — Project creation modal + public project detail page.
- ⏳ Chunk 5 — Home feed (For You / Trending, composer, live likes/follows).
- ⏳ Chunk 6 — Comments on projects.
- ⏳ Chunk 7 — Leaderboards.
- ⏳ Chunk 8 — Explore + global search.
- ⏳ Chunk 9 — Builder analytics.
- ⏳ Chunk 10 — Settings + Notifications + profile edit.
- ⏳ Chunk 11 — /messages inbox.
- ⏳ Chunk 12 — Landing page (marketing).
- ⏳ The Pile: seed data, guest sanity pass, security rules review, notifications polish, QA pass, Layer 1 shippable checkpoint.

## Open items
- **AGENTS.md** (repo root, local copy at `F:\1a - LovShipyardStack\AGENTS.md`): created but never pushed. Needs a Firestore-track update before pushing (still says "Supabase").
- `.env` with Supabase keys was committed in the old repo — reference repo only, but flag it.
- Update KNOWLEDGE.md/AGENTS.md if routes or schema change.
