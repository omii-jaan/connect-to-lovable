# BUILD_PLAN — Shipyards Layer 1 (one chunk per prompt)

How to use: work top to bottom. Each chunk is ONE message you paste into the **AI Studio Build mode** chat. After each chunk: verify in the preview (desktop + mobile), fix issues with one small targeted prompt, tag a version (Versions tab), then continue. Never merge two chunks into one prompt.

Frontend-first strategy: most chunks build UI with realistic sample data first, then "wire to data" as a small follow-up.

> **AI Studio notes**
> - Backend = **Firebase** (Firestore + Auth), provisioned automatically when you approve the integration. When a chunk mentions "Supabase/DB tables/RLS", use `DB_SCHEMA_FIRESTORE.md` (collections + security rules) instead.
> - Approve Firebase setup when the agent offers it; security rules = your RLS replacement.
> - After each chunk, **Git-sync** the project so `AGENTS.md` keeps the model grounded.
> - If the preview looks off, use **annotation mode**: highlight the element and describe the fix.

Legend: `[UI]` visual only · `[DATA]` adds Firestore/Auth · `[AUTH]` needs sign-in.

---

## CHUNK 1 — Auth + Onboarding [UI][AUTH]
```text
Add authentication to SHIPYARDS now. Set up Firebase Authentication (approve the integration) with email/password + "Continue with Google" and "Continue with GitHub" buttons.

Pages:
1) /sign-up: split-screen layout (left: dark panel with subtle grid pattern + testimonial quote; right: form). Fields: email, password (with strength bar: min 8 chars, 1 number, 1 symbol), "I am a:" segmented control (Builder / Project Creator / Both), terms checkbox. Submit = Create Account. Link to /login.
2) /login: same layout. Email, password, remember me, forgot password link. Submit = Sign In.
3) /onboarding (4 steps, progress dots on top):
   - Step 1 Identity: display name, handle input with availability check (debounced 300ms, shows check/x — check the handles collection for uniqueness), avatar upload (drag-drop, 2MB max, circular crop preview).
   - Step 2 Expertise: multi-select chips for models (Claude, GPT-4, GPT-4o, Gemini, Llama, Stability, Groq, etc.), primary skills as tag input, experience level as slider (Beginner->Expert).
   - Step 3 Connect: GitHub username, X/Twitter handle, personal website (all optional).
   - Step 4 Goals: checkboxes (Freelance projects, Full-time roles, Collaborators, Just showcasing), availability select (Immediately / 2 weeks / 1 month / Not available). Finish -> redirect to /feed with a welcome toast.
Create a profiles document after signup (uid = auth uid; handle auto from email username if free, editable in Step 1). Protect /onboarding and all app routes: unauthenticated users are redirected to /login. Style exactly per the design tokens shared in the system instructions.
```

## CHUNK 2 — Builder Profile (public) [UI]
```text
Build the PUBLIC BUILDER PROFILE page at route /@:handle. Use the existing /@me placeholder - replace it.

Header section (bg-surface, padding 48):
- Avatar 96px, name (text-h2 bold), handle (@handle, text-secondary).
- Badge row: "Verified" (accent), "Top 5%" (warning/trophy), "Available for work" (green dot) — driven by profile fields.
- Bio: max 3 lines, secondary text. Meta row with MapPin, Link, Calendar icons (location, website, joined date).
- Stats row (4 columns, mono tabular): Projects | Reputation | Followers | Following.
- Buttons: "Follow" (primary toggle), "Message" (secondary), "More" dropdown (Share, Copy link, Report).
- Social links icons row (GitHub, X, YouTube, LinkedIn, Website).
Tabs below (sticky): Overview | Projects | Skills | Activity | Reviews.
For now build ONLY the header + tab nav + Overview tab with sample data (static, displayed from a mock profile). Projects/Skills/Activity/Reviews tabs show an empty-state message ("Coming in a later step").
Layout: max-width 1280px centered. Mobile: stacked, stats 2x2.
```

## CHUNK 3 — Projects data model + Profile Projects tab [DATA]
```text
Now create the projects data model in Firestore (approve Firebase if not yet connected), exactly per the Firestore schema I pasted earlier (DB_SCHEMA_FIRESTORE.md): collections projects, projectLikes, projectBookmarks with the documented fields, security rules (read: public documents; write: auth user equals ownerUid), and a handles collection for unique handles.

Then on the Profile page, replace the static grid on the ''Projects'' tab with a real grid reading the projects collection filtered by owner handle + visibility=public. Each card: 16:9 thumbnail, title, 2-line clamp description, tech stack badges (max 5), likes/date footer. Show empty state "No projects yet - Ship your first one" with a Create project button if viewing your own profile. Seed 2 sample projects with realistic AI-builder content.
```

## CHUNK 4 — Project creation flow (modal) [UI][DB]
```text
Hook into the profile page: clicking "Add project" / "Create project" opens a MODAL (ProjectCreateModal.tsx) with sections:
1) Title (max 100 chars)
2) Category grid (select cards with lucide icon: AI Agents, Automation, Data Analysis, NLP, Computer Vision, Other)
3) Description (textarea with basic markdown hints)
4) Media upload (drag-drop, previews, max 10 files, first = thumbnail star)
5) Tech stack tag input + AI models used chips
6) Metrics: add rows (label + value), e.g. Accuracy 95%
7) Links: GitHub repo (validate looks like github.com URL), live demo, docs
8) Difficulty segmented (Beginner..Expert), time to build (value+unit), cost number.
9) Visibility toggle: Public / Unlisted / Draft.
Save as Draft (secondary) / Publish (primary, disabled until title+description+category set).
On publish: insert into projects (slug auto from title, ensure unique) and close modal.
Replace the placeholder detail page: build the actual PUBLIC PROJECT DETAIL page at /project/:slug showing hero media with gradient overlay + title over it, project title h1, builder row (avatar, name, date, category badge), meta bar with share/like/bookmark counts, main content columns (65/35): description rendered as markdown, tech stack badges, models badge, metrics grid (mono labels), links cards; right column: builder mini-card, project stats (likes, views, comments, shares), tags list. Like button toggles insert/delete in project_likes and updates likes_count. Use the seeded sample projects to verify.
```

## CHUNK 5 — Home Feed (main dashboard) [UI][DB]
```text
Replace the FeedPage placeholder with the real HOME FEED:
Left column (65%): header "Home" + tabs: For You | Trending. Composer card (avatar + input "What did you ship today?" + row: Project / Update / Media) — clicking opens the existing project modal. Then feed = cards from projects (public, newest first + a "recommended mix"): each card = avatar(40) + name + (@) time + kebab menu (Follow, Bookmark, Copy link), title (click to /project/:slug), description 3-line clamp, media grid (1 image full, 2 half/half, 3+ masonry), stack badges, metrics row (likes/comments/shares mono), action row (like Heart toggles like live, comment, share dropdown = copy link/twitter/widget, bookmark).
Right column (sticky, 35%): Trending This Week card (5 items: number+project+engagement), "Builders to follow" card (3 builders with Follow buttons), "Your Profile" mini card (projects/followers/reputation stats + progress bar Top 15%). Only authenticated builder sees the composer.
Wire the follows: Follow button on suggested builders writes to the follows collection and increments counts (transaction); Like buttons mirror the project detail behavior.
Use Firestore collections + security rules per the pasted schema. Subscribe with onSnapshot so likes/follows update live.
```

## CHUNK 6 — Comments on projects [DB][UI]
```text
Add COMMENTS to the project detail page (section 4, "Discussion"): composer (avatar + textarea + Post), list of comments nested 1 level (avatar 32, name, time, content, actions Reply/Like/More), sort by Latest. Implement comment insert/delete (own only) updating project_comments + projects.comments_count. Deep count badge on the comments button in both the feed card and detail meta bar. Set up Supabase realtime on project_comments so new comments appear instantly without refresh.
```

## CHUNK 7 — Leaderboards [UI]
```text
Build the Leaderboards page: header h1 "Leaderboards" + subtitle. Tabs: All Time / This Week / This Month / Categories.
Table (full width, sticky header row bg-surface): columns Rank (1-3 get gold/silver/bronze badge), Builder (avatar 32 + name @handle), Reputation (mono, accent if top 10), Projects Shipped, Total Likes, Streak, weekly Trend (up/down arrow + %). Source from profiles + aggregates over projects + project_likes. Beautiful for top 3 rows (48 avatars, subtle tinted bg).
Categories tab: chips list (AI Agents, Automation, Data Analysis, NLP, Computer Vision), selecting filters table to builders whose projects.category matches. Paginate 50/page.
```

## CHUNK 8 — Explore + global search [UI]
```text
Build the EXPLORE page: left filter sidebar (240px: Categories checkbox tree, Tech stack multiselect, AI Models, Difficulty range, sort select) + main grid of project cards (3-col masonry using the existing project card from feed but cleaner = without author header). Active filter chips above the grid + result count. View toggle Grid / List.
Also wire the TOP BAR global search: typing in the TopBar SearchBox opens a results dropdown listing matching builders (name/handle) and projects (title) from the global Supabase search (use ilike queries against profiles.handle/display_name and projects.title, limit 10 each for now).
```

## CHUNK 9 — Builder analytics (own profile) [UI]
```text
When logged in and viewing OWN profile, add an "Analytics" entry different from the manual page: right now just build the /analytics dashboard from its placeholder: header "Your Analytics" + date range pills (7d/30d/90d). Stat cards (4): Profile views, Total likes, New followers, Invitation rate. Simple charts using Recharts: views over time (area), your top projects by engagement (horizontal bar). Data from profile + project like counts (aggregate). One table: project | views | likes | comments | click-through.
```

## CHUNK 10 — Settings + Notifications + profile edit [UI][DB]
```text
SETTINGS page (sidebar left 200px: Account, Profile, Notifications, Security, Billing): 
- Profile: edit name, handle (availability check), bio, location, website, avatar, role, availability.
- Notifications: toggle which notification types go to email vs in-app.
- Security: change password, enable 2FA toggle (mock), active sessions list.
/notifications page: feed of notification rows (type icons + message + time + unread indicator) seeded by the existing likes/follows/comments, mark-all-read now real: insert a notification row when someone likes/follows/comments, with Supabase realtime re-enabling the bell badge live.
```

## CHUNK 11 — /messages inbox [UI][DB]
```text
Build MESSAGES: split view (/messages): left conversation list (avatar, name, last message preview, timestamp, unread dot) + search; right conversation thread (header, scrollable messages, bubbles aligned by sender, input + attach + emoji + send). Real storage: conversations created between two users when none exist yet; messages table in Supabase, realtime subscriptions per thread marking messages read.
Add a "Message" button on the profile page (if authenticated) that opens the thread.
```

## CHUNK 12 — Landing page (marketing) [UI]
```text
Build the public LANDING page at / (used by visitors, no auth and no database). Sections:
1) Fixed nav 64px: logo center-links (Builders, Projects, Pricing, Blog), right: Sign In + Get Started.
2) Hero, full height: eyebrow badge "Now in Public Beta" (accent), headline h1 48px "The professional identity platform for AI builders" (white->grey subtle gradient text - ONLY exception to no-gradients), subheadline (secondary, 560px), CTA primary "Create your profile" + secondary "View example profile" linking to /@:demo, caption line "Trusted by builders from OpenAI, Anthropic, Google and 500+ startups" with monochrome logo text.
3) Social proof ticker: infinite horizontal marquee (CSS, 30s, pause on hover) of "Alex Chen shipped 12 AI agents", "Sarah hit Top 1% this month", etc.
4) Problem section 2-col: headline "Your work is everywhere. Your reputation is nowhere." + simple before/after diagram (scattered icons vs one card).
5) Features: 3-col grid of the five layers (Showcase, Marketplace, Workspace, Identity, Breakdown) each with lucide icon + title + description.
6) How it works: vertical timeline: Ship / Match / Earn.
7) Final CTA band (accent-subtle panel): "Ready to ship?" + email input + Start button (stores to waitlist table).
8) Footer 4 columns + bottom bar. Thematically linked.
All static, fully responsive, SEO title/meta set.
```

---

## THE PILE (do NEXT, still Layer 1)
13. Seed sample data better: 6-8 builders + 12 projects with realistic AI stack (Claude, GPT-4, embeddings, RAG, LangChain, FastAPI, Python), varied categories, sample like counts.
14. Public/guest sanity pass: as logged-out, visit /, /@handle, /project/slug, /explore, /leaderboards — everything readable, sign-in gates work.
15. RLS + security review: Walk through every table with Lovable in Plan mode "check row level security"; ask to add policies for public-select on content tables and owner-write everywhere missing.
16. Notifications polish: in-app "liked"/"followed"/"commented" bell with unread count (realtime), mark-all-read.
17. Analytics detail + a Top Builders This Week daily recompute via edge function (pg_cron or edge) — or defer to Phase Evolution.
18. Responsive + keyboard + reduced-motion QA pass; mobile-first fixes.
19. Version book verified for unauthenticated AND authenticated. This is the Layer 1 shippable checkpoint.

## Icon key (all lucide, stroke 1.5)
Home, Compass, Briefcase, Trophy, Terminal, Bookmark, BarChart3, MessageSquare, Bell.

## Reminder
After each chunk, work in Plan Mode for anything > 1 screen. When Lovable collapses something (e.g. merges two files it shouldn't), correct it immediately with a precise prompt naming the files. Keep project Knowledge current by copying any new table or route changes into memory.