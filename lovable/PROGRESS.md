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
- ✅ **Chunk 2 — Public Builder Profile** (`/@:handle`): header (avatar 96, badges Verified/Top5%/Available, bio 3-line, meta icons, 4-col tabular stats, Follow toggle + toast, Message, More dropdown, socials), sticky tabs (Overview/Projects/Skills/Activity/Reviews), Overview with mock content, other tabs = empty states, routes `/@:handle`, `/@me`, `/builder/:username` compat.
- ✅ **Chunk 3 — Projects data model + Profile Projects tab** [DATA]: Firestore provisioned + security rules deployed (projects, projectLikes, projectBookmarks, handles, profiles, follows — public read, owner write); `src/lib/firebase.ts` + `src/lib/projects.ts` helpers; 3 seeded sample projects; real Projects tab grid (16:9 thumb, category, title, 2-line clamp, max 5 stack badges, like button, GitHub/Demo links); empty state "No projects yet — Ship your first one" + Create button on own profile.
- ✅ **Chunk 4 — Project creation flow (modal) + public project detail page** [UI][DB]: `ProjectCreateModal.tsx` (9 sections: title 100ch counter, category grid, markdown-hint description, media 10 max + thumbnail star, stack tags + model chips, metrics rows, validated links, difficulty/time/cost, visibility + Draft/Publish gate); `/project/:slug` detail (dark-overlay hero, transactional like w/ likesCount, bookmark, share/copy, views, 65/35 layout, markdown render, metrics grid, sidebar builder card + stats); profile cards linked + Create button opens modal.
- ✅ **Chunk 5 — Home feed (For You / Trending)** [UI][DB]: 65/35 layout; Home header + tabs; composer (auth) → ProjectCreateModal, signup CTA (guest); feed cards (avatar 40, kebab Follow/Bookmark/Copy, title → /project/:slug, line-clamp-3, media grids 1/2/3+, stack+model badges, mono metrics, live heart, share dropdown, bookmark); right rail (profile mini card Top 15% bar, Trending #1-5, Builders to Follow w/ transactional follows); onSnapshot on projects + follows; security rules for counter-only updates.
- ✅ **Chunk 6 — Comments on projects** [DB][UI]: `projectComments` + `commentLikes` rules deployed (owner-only delete, public read); `src/lib/comments.ts` (onSnapshot, optimistic cache, latest-first, comment likes, atomic commentsCount); `ProjectDiscussion.tsx` (composer Ctrl+Enter, 1-level replies, 32px avatars, author badge, relative time, heart likes, owner-only delete, 3 view states); deep counts in detail meta bar, sidebar, feed cards → `/project/:slug#comments`.
- ✅ **Chunk 7 — Leaderboards** [UI]: h1 + subtitle, tabs (All Time/This Week/This Month/Categories), category chips filter, sticky table (flat gold/silver/bronze rank badges, 32px avatars — 48px + tinted bg top 3, mono reputation accent for top 10, metric pills, trend arrows), reputation formula (projects x10 + followers x2 + likes x1 + skillTests x50 + jobs x100 + engagement x5), 50/page pagination, skeleton + empty state with clear-filters CTA, Navbar + mobile menu + ⌘K integration.
- ✅ **Chunk 8 — Explore + global search** [UI]: 240px sidebar (category checkboxes, stack pills, models multiselect, difficulty, sort: Most Liked/Newest/Most Viewed/Most Commented), active chips + count + Clear All + mobile drawer, Grid/List toggle, optimistic hearts, 3 view states, global search in ⌘K palette (builders by name/handle, projects by title/category/slug, prefix queries on searchKey, keyboard nav).
- ✅ **Chunk 9 — Builder analytics (own profile)** [UI]: /analytics header + 7/30/90d pills, 4 stat cards (Total Views incl. profile viewsCount, Likes Received + comments tally, Followers, Invitation Rate 0% w/ Layer 2 coming-soon badge), Recharts area chart (subtle accent fill — chart-idiom exception to no-gradients) + horizontal engagement bar, performance table (thumb, title, category, views, likes, comments, est. CTR, row nav → /project/:slug), 3 view states, responsive + tabular.
- ✅ **Chunk 10 — Settings + Notifications + profile edit** [UI][DB]: /settings (200px sidebar → mobile pills; Profile: all fields, 400ms debounced handle check vs handles collection, atomic batch rename; Account: email/UID/tier; Notifications prefs persisted to profiles.notificationPrefs; Security: updatePassword + validation, mock 2FA, sessions list; Billing: Layer 2 placeholder); /notifications feed (type icons, relative time, actor avatars, unread dots, optimistic read + deep links, mark-all-read batch, All/Unread tabs); TopBar bell (onSnapshot unread count, animated badge, dropdown preview); triggers inserted on like/comment/follow.
- ✅ **Chunk 11 — /messages inbox** [UI][DB]: `src/lib/messages.ts` (findOrCreateConversation, onSnapshot threads + lists, unreadBy updates, createNotification on new message); /messages split view (conversation sidebar: avatar/name/handle/relative time/preview/unread badges + search filter; thread: header w/ role badge + profile link, sender/receiver bubbles, autoscroll, attachment URL input, emoji row, Enter send); mobile back-toggle stack; skeleton/empty/welcome-thread states; profile Message button (auth + self checks → find-or-create → /messages?conversation=ID); Navbar dropdown + route.
- ✅ **Chunk 12 — Landing page (marketing)** [UI]: 64px fixed nav (logo/wordmark, center links, Sign In + Get Started), full-height hero (Public Beta badge, 48px headline w/ hero-gradient exception, 560px subheadline, Create your profile + View example profile → /@:demo, trusted-by caption), CSS marquee (30s, pause on hover, static w/ reduced-motion), problem section before/after, 5-layer features grid, Ship/Match/Earn timeline, accent-subtle CTA band → waitlist collection, 4-col footer; demo profile seeded.
- ✅ **Landing polish follow-up**: real product visual (app preview panel from actual components in browser chrome) replaces sketch diagram; SEO title/meta, OG + Twitter card tags, og-image.png (1200x630 flat dark + accent mark), canonical, no-CLS hero.
- ✅ **Pile 13 — Seed data**: 8 builder profiles + 12 projects, varied categories, realistic AI stacks, counts spread over 90 days, searchKey set, seed guard (session + marker, no reseed every load).
- ⏳ **Pile 14 — Public/guest sanity pass**: ✅ done — landing/waitlist ok, profiles show auth-aware sign-in CTAs w/ preserved redirects, project detail readable + guest prompts, explore/leaderboards accessible, feed read-only + signup CTA, protected routes redirect w/ return state.
- ✅ **Cleanup pass**: "Vibe Score" → "Reputation" everywhere; removed Express Interest, match rankings, AI-parsed scope breakdowns, Match Engine remnants (except landing sandbox), MOCK_CONTRACTS + Contracts tab, DiscoverFeed; /projects/:id → /project/:slug canonical + legacy redirect; lint + build 0 errors.
- ⏳ **Pile 15 — Security rules review**
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
