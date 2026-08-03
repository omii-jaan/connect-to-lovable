# START PROMPT — Paste this FIRST into Lovable

Create a new **blank project** named `Shipyards`, open its chat, and paste the text below as your first message. It sets up the foundation: design tokens, layout shell, routing skeleton, and UI primitives. Auth and database come in the next chunk.

> Do not paste any other file yet. Just this one prompt.

---

Copy from here:

```text
Build the FOUNDATION for SHIPYARDS, a professional identity platform for AI builders (profiles, project showcase, marketplace and collaboration will be added in later steps).

FOUNDATION TO BUILD NOW:

1) Theme and design tokens first, in src/index.css:
- Tokens (exact values): --bg-base:#0A0A0F; --bg-surface:#141419; --bg-surface-hover:#1C1C22; --bg-elevated:#1F1F28; --bg-inset:#050508; --border-default:#27272A; --border-subtle:#1F1F24; --border-active:#3F3F46; --text-primary:#FAFAFA; --text-secondary:#A1A1AA; --text-tertiary:#52525B; --text-muted:#3F3F46; --accent:#14B8A6; --accent-hover:#2DD4BF; --accent-subtle:rgba(20,184,166,0.1); --success:#22C55E; --warning:#EAB308; --error:#EF4444; --error-subtle:rgba(239,68,68,0.1).
- Dark mode is the ONLY mode (html bg var(--bg-base), text var(--text-primary)).
- Fonts: Geist + Geist Mono with Inter fallback. Numbers use tabular-nums.
- Radii: buttons 6px, cards 8px, modals 12px, avatars full. Spacing on a 4px scale.
- NO gradients, glows, glass, or drop shadows. Use surface color + borders for elevation.

2) LAYOUT SHELL components:
- TopBar.tsx: fixed 64px bar. Left: ship icon (lucide, accent) + "Shipyards" wordmark. Center: search bar (hint "Search builders, projects, or skills...", kbd hint ⌘K). Right: bell icon, avatar.
- Sidebar.tsx: 240px on desktop, collapsible to 64px. Primary: Home /feed, Explore /explore, Marketplace /marketplace, Leaderboards /leaderboards, Workspace /workspace. Personal: My Profile /@me, Saved /saved, Analytics /analytics. Active item = accent-subtle bg + 2px accent left border.
- AppShell.tsx: TopBar + Sidebar + main content area, renders routes inside it.
- Router: react-router-dom with routes: /feed, /explore, /marketplace, /leaderboards, /workspace, /saved, /analytics, /settings, and /@:handle, each rendering its own placeholder page.

3) PLACEHOLDER PAGES: one small component per page (FeedPage.tsx, ExplorePage.tsx, MarketplacePage.tsx, LeaderboardsPage.tsx, WorkspacePage.tsx, SavedPage.tsx, AnalyticsPage.tsx, SettingsPage.tsx, ProfilePage.tsx). Each shows only a title + short muted description. No fake lists or content yet.

4) UI PRIMITIVES in src/components/ui/: Button.tsx (variants: primary, secondary, ghost, destructive, icon), Badge.tsx (pill; variants default/accent/success/warning/error), Card.tsx (bg-surface, 1px border-default, radius 8px). Export all from an index.ts.

CONSTRAINTS:
- TypeScript strict, no "any".
- No auth and no database yet. This chunk is purely visual shell + routing.
- lucide-react icons, stroke 1.5px, 16/20/24px. No emoji.
- One component per file. Small components. No comments in code.
- Do not build profile, projects, feed, marketplace or any feature content yet - wait for the next instruction.
```

---

**After it builds:** check the preview — switch to mobile view, click through the routes. If anything drifts from the tokens (e.g. colors, shadows), send a small correction prompt naming the exact component. When you're happy, press **Publish** and bookmark the version.

Then move to `BUILD_PLAN.md` → **Chunk 1**.