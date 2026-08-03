# SHIPYARDS — COMPLETE DESIGN SPECIFICATION
## A Page-by-Page Architectural Blueprint
### Version: 1.0 | Classification: Master Design Document

---

# PART ZERO: DESIGN PHILOSOPHY & SYSTEM

## 0.1 Core Design Ethos

**Shipyards is not a website. It is a professional instrument.**

Every pixel, every transition, every line of text must communicate one thing: *the people who built this understand precision.* We are designing for AI builders — people who notice when a border is 1px instead of 0.5px, people who feel physical discomfort when alignment is off by 4 pixels.

**Anti-Vibe-Coding Manifesto:**
- No purple-blue gradients. No "AI sparkle" icons. No glowing orbs. No glassmorphism for decoration.
- No generic 3D illustrations of robots shaking hands with humans.
- No "magic" wands. No "auto-magically" copy. We respect the user's intelligence.
- No rounded corners on everything (buttons: 6px, cards: 8px, avatars: full).
- No drop shadows in dark mode. Elevation is communicated through surface color and border, not shadow.

**Reference Points (Internalized, Not Copied):**
- **Linear**: Keyboard-first navigation, spatial memory, 150ms transitions, absolute precision.
- **Vercel**: Typographic confidence, generous whitespace that feels expensive, monospace data display.
- **Stripe Dashboard**: Information density that respects expertise, contextual actions, progressive disclosure.
- **Arc Browser**: Sidebar spatial model, command palette as primary navigation.
- **Notion**: Block-based content flexibility, slash commands, collaborative presence.

## 0.2 Color Architecture

**Base Palette (Dark Mode — Default):**

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-base` | `#0A0A0F` | Page background. Deep space. Not pure black (#000) — pure black is harsh. |
| `--bg-surface` | `#141419` | Cards, panels, elevated surfaces. |
| `--bg-surface-hover` | `#1C1C22` | Hover state for cards and rows. |
| `--bg-elevated` | `#1F1F28` | Modals, dropdowns, popovers. |
| `--bg-inset` | `#050508` | Input backgrounds, code blocks, inset areas. |
| `--border-default` | `#27272A` | Standard dividers, card borders. Warm gray, not cold. |
| `--border-subtle` | `#1F1F24` | Very subtle separators, table row dividers. |
| `--border-active` | `#3F3F46` | Active/focused borders. |
| `--text-primary` | `#FAFAFA` | Headings, primary content. Slightly warm white. |
| `--text-secondary` | `#A1A1AA` | Body text, descriptions, labels. |
| `--text-tertiary` | `#52525B` | Timestamps, metadata, disabled states. |
| `--text-muted` | `#3F3F46` | Placeholders, empty state hints. |
| `--accent` | `#14B8A6` | Primary actions, active states, links. Muted teal. Used sparingly. |
| `--accent-hover` | `#2DD4BF` | Hover state for accent elements. |
| `--accent-subtle` | `rgba(20, 184, 166, 0.1)` | Background tint for accent-related areas. |
| `--success` | `#22C55E` | Positive indicators, completed states. |
| `--warning` | `#EAB308` | Caution, pending states. |
| `--error` | `#EF4444` | Errors, destructive actions. |
| `--error-subtle` | `rgba(239, 68, 68, 0.1)` | Error background tint. |

**Light Mode (Secondary — Implemented but Not Default):**
- Background: `#FFFFFF`
- Surface: `#F4F4F5`
- Text Primary: `#18181B`
- Text Secondary: `#52525B`
- Border: `#E4E4E7`
- Accent remains `#14B8A6`

## 0.3 Typography System

**Font Stack:**
- **Sans (UI):** `Geist, Inter, -apple-system, BlinkMacSystemFont, sans-serif`
- **Mono (Data/Code):** `Geist Mono, JetBrains Mono, SF Mono, monospace`
- **Display (Hero/Landing):** `Geist` at tight tracking. No separate display font — consistency is luxury.

**Type Scale (Major Third — 1.250):**

| Token | Size | Line Height | Weight | Tracking | Usage |
|-------|------|-------------|--------|----------|-------|
| `text-hero` | 48px | 1.1 | 700 | -0.03em | Landing page hero only |
| `text-h1` | 40px | 1.15 | 700 | -0.02em | Page titles |
| `text-h2` | 32px | 1.2 | 600 | -0.02em | Section headers |
| `text-h3` | 24px | 1.25 | 600 | -0.01em | Card titles, modal headers |
| `text-h4` | 20px | 1.3 | 600 | -0.01em | Subsection headers |
| `text-h5` | 18px | 1.35 | 500 | 0 | List item titles |
| `text-body` | 16px | 1.6 | 400 | 0 | Body copy |
| `text-body-sm` | 14px | 1.5 | 400 | 0 | Secondary body, descriptions |
| `text-caption` | 13px | 1.4 | 500 | 0 | Labels, metadata, badges |
| `text-caption-sm` | 12px | 1.4 | 500 | 0.01em | Timestamps, fine print |
| `text-mono` | 14px | 1.5 | 400 | 0 | Code, data, metrics |
| `text-mono-sm` | 12px | 1.4 | 400 | 0.02em | Inline code, tags |

**Typography Rules:**
- Maximum line length: 65ch for body text.
- Headings never wrap more than 2 lines. If they do, the content is wrong.
- Mono text is always `font-variant-numeric: tabular-nums` for alignment.
- Links in body text: underline on hover only. Color `--accent`.

## 0.4 Spacing System

**Base Unit: 4px**

| Token | Value | Usage |
|-------|-------|-------|
| `space-0.5` | 2px | Hairline adjustments |
| `space-1` | 4px | Icon padding, tight internal spacing |
| `space-2` | 8px | Button internal padding (vertical), inline elements |
| `space-3` | 12px | Input padding, small gaps |
| `space-4` | 16px | Card internal padding, standard gap |
| `space-5` | 20px | Form section spacing |
| `space-6` | 24px | Modal padding, section gaps |
| `space-8` | 32px | Card external margins, layout gaps |
| `space-10` | 40px | Section breaks |
| `space-12` | 48px | Major section padding |
| `space-16` | 64px | Page section separators |
| `space-20` | 80px | Hero spacing |
| `space-24` | 96px | Landing page major sections |

**Layout Grid:**
- 12-column grid.
- Gutter: 24px (desktop), 16px (tablet), 12px (mobile).
- Max content width: 1280px.
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.

## 0.5 Component Primitives

### Buttons

**Primary Button:**
- Background: `--accent`
- Text: `#0A0A0F` (dark text on teal for maximum contrast)
- Padding: 8px 16px (space-2 x space-4)
- Border-radius: 6px
- Font: 14px, weight 500
- Hover: Background `--accent-hover`, transform `translateY(-0.5px)`
- Active: Background darken 10%, transform `translateY(0)`
- Transition: `all 150ms cubic-bezier(0.4, 0, 0.2, 1)`
- Focus ring: 2px offset, `--accent` at 30% opacity

**Secondary Button:**
- Background: transparent
- Border: 1px solid `--border-default`
- Text: `--text-primary`
- Hover: Background `--bg-surface-hover`, border `--border-active`

**Tertiary Button (Ghost):**
- Background: transparent
- Text: `--text-secondary`
- Hover: Background `--bg-surface-hover`, text `--text-primary`

**Destructive Button:**
- Background: `--error`
- Text: white
- Hover: Lighten 10%

**Icon Button:**
- Size: 32px × 32px
- Border-radius: 6px
- All states same as Tertiary

### Inputs

**Text Input:**
- Background: `--bg-inset`
- Border: 1px solid `--border-default`
- Border-radius: 6px
- Padding: 8px 12px
- Font: 14px
- Placeholder: `--text-muted`
- Focus: Border `--accent`, subtle inner glow `0 0 0 2px rgba(20, 184, 166, 0.15)`
- Error: Border `--error`, background `--error-subtle`

**Textarea:**
- Same as input but min-height: 100px
- Resize: vertical only

**Select/Dropdown:**
- Same styling as input
- Dropdown panel: `--bg-elevated`, border `--border-default`, border-radius 8px
- Item hover: `--bg-surface-hover`
- Item active/selected: `--accent-subtle`, text `--accent`

### Cards

**Standard Card:**
- Background: `--bg-surface`
- Border: 1px solid `--border-default`
- Border-radius: 8px
- Padding: 16px (space-4)
- Hover (if clickable): Border `--border-active`, background `--bg-surface-hover`
- Transition: `all 150ms ease`

**Interactive Card (Project Card, Builder Card):**
- Same as standard
- Hover: `translateY(-1px)`, border `--border-active`
- Cursor: pointer
- Active: `translateY(0)`

**Inset Card (Code blocks, data display):**
- Background: `--bg-inset`
- Border: 1px solid `--border-subtle`
- Border-radius: 6px

### Badges

**Status Badge:**
- Padding: 2px 8px
- Border-radius: 9999px
- Font: 12px, weight 500
- Variants:
  - `default`: bg `--bg-surface-hover`, text `--text-secondary`, border `--border-default`
  - `accent`: bg `--accent-subtle`, text `--accent`, border `rgba(20,184,166,0.2)`
  - `success`: bg `rgba(34,197,94,0.1)`, text `--success`
  - `warning`: bg `rgba(234,179,8,0.1)`, text `--warning`
  - `error`: bg `--error-subtle`, text `--error`

### Avatars

- Sizes: 24px (xs), 32px (sm), 40px (md), 48px (lg), 64px (xl), 96px (2xl)
- Border-radius: 9999px
- Border: 2px solid `--bg-base` (when stacked)
- Fallback: Initials in `--bg-surface-hover`, text `--text-secondary`
- Online indicator: 8px dot, `--success`, positioned bottom-right, 2px white border

### Tooltips

- Background: `--bg-elevated`
- Text: `--text-primary`
- Padding: 6px 10px
- Border-radius: 6px
- Font: 13px
- Shadow: none (dark mode)
- Arrow: 4px
- Delay: 300ms
- Transition: opacity 100ms

### Modals

- Overlay: `rgba(0,0,0,0.6)` with `backdrop-filter: blur(4px)`
- Panel: `--bg-elevated`, border-radius 12px
- Max-width: 560px (standard), 720px (large), 960px (xl)
- Padding: 24px (space-6)
- Header: border-bottom 1px `--border-subtle`, padding-bottom 16px
- Close button: top-right, Icon Button
- Entry animation: `scale(0.97) opacity(0)` → `scale(1) opacity(1)`, 150ms ease-out
- Exit animation: reverse, 100ms

### Toasts

- Position: bottom-right, 24px from edges
- Background: `--bg-elevated`
- Border: 1px solid `--border-default`
- Border-radius: 8px
- Padding: 12px 16px
- Max-width: 400px
- Icon + text + close
- Auto-dismiss: 4000ms
- Progress bar at bottom (thin line, animates width)

## 0.6 Motion & Animation

**Timing Tokens:**
- `duration-fast`: 100ms (micro-interactions, color changes)
- `duration-normal`: 150ms (hover states, opacity)
- `duration-slow`: 250ms (modals, page transitions)
- `duration-slower`: 350ms (complex sequences)

**Easing Tokens:**
- `ease-default`: `cubic-bezier(0.4, 0, 0.2, 1)` — standard UI
- `ease-in`: `cubic-bezier(0.4, 0, 1, 1)` — exit animations
- `ease-out`: `cubic-bezier(0, 0, 0.2, 1)` — enter animations
- `ease-spring`: Not used. No bounce. Ever.

**Animation Rules:**
- No animation on page load for content below fold. Lazy load with intersection observer.
- Skeleton screens for initial data load (shimmer: linear gradient animation, 1.5s loop).
- Stagger for lists: 20ms delay between items, max 300ms total.
- Respect `prefers-reduced-motion`: all animations become instant.

## 0.7 Iconography

**Library:** Lucide React (consistent stroke width, clean geometry).
**Rules:**
- Stroke width: 1.5px (default), 2px (emphasis)
- Size: 16px (inline), 20px (buttons), 24px (empty states)
- Color: inherits text color
- No filled icons unless absolutely necessary (rare)

## 0.8 Z-Index Architecture

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Base | 0 | Page content |
| Sticky | 10 | Sticky headers |
| Dropdown | 20 | Select menus, autocomplete |
| Tooltip | 30 | Tooltips |
| Overlay | 40 | Backdrops |
| Modal | 50 | Dialogs |
| Toast | 60 | Notifications |
| Command Palette | 70 | Global search overlay |

---

# PART ONE: GLOBAL SYSTEM PAGES

---

## PAGE 1: LANDING PAGE (Marketing)
**Route:** `/`
**Phase:** Pre-launch & Always-On
**Purpose:** Convert visitors to waitlist signups (pre-launch) or registered users (post-launch). Establish brand credibility.
**User Story:** *"I heard about Shipyards. I need to understand what it is and why it's different in 10 seconds."

### Layout Architecture
- **Nav:** Fixed top, height 64px, glass effect on scroll (`backdrop-filter: blur(12px)`, background `rgba(10,10,15,0.8)`)
- **Hero:** Full viewport height (100vh), centered content, max-width 800px
- **Social Proof:** Full-width band, `--bg-surface`
- **Features:** 3-column grid (desktop), stacked (mobile)
- **How It Works:** Vertical timeline, left-aligned
- **Final CTA:** Full-width, `--accent-subtle` background
- **Footer:** 4-column grid, `--bg-surface` background

### Section 1: Navigation
- **Left:** Logo (wordmark "Shipyards" in `text-h4`, weight 700) + small ship icon (20px, `--accent`)
- **Center (desktop only):** Links: Builders, Projects, Pricing, Blog
  - Font: 14px, weight 500, `--text-secondary`
  - Hover: `--text-primary`
  - Active page: `--text-primary` with 2px `--accent` underline
- **Right:** 
  - "Sign In" (Tertiary button)
  - "Get Started" (Primary button)
- **Mobile:** Hamburger menu → full-screen overlay

### Section 2: Hero
- **Eyebrow:** Badge: "Now in Public Beta" (accent variant)
- **Headline:** "The professional identity platform for AI builders"
  - Font: `text-hero`, weight 700, centered
  - Gradient text (subtle): `linear-gradient(180deg, #FAFAFA 0%, #A1A1AA 100%)` — only here, nowhere else
- **Subheadline:** "Showcase shipped projects. Get matched to real work. Build verified reputation — all in one place."
  - Font: `text-body`, `--text-secondary`, max-width 560px, centered
  - Margin-top: 24px
- **CTA Group:**
  - Primary: "Create your profile" (large variant, padding 12px 24px)
  - Secondary: "View example profile →" (links to `/@[demo-user]`)
  - Margin-top: 32px
- **Social Proof Line:** "Trusted by builders from OpenAI, Anthropic, Google, and 500+ startups"
  - Font: `text-caption`, `--text-tertiary`
  - Company logos: monochrome, 24px height, opacity 0.5
- **Hero Visual:** 
  - NOT a 3D illustration.
  - A **screenshot composition** of the actual platform UI (dark mode), slightly angled (perspective: 1000px, rotateX: 5deg), floating with subtle shadow.
  - Shows: Profile page with projects, reputation score, skill tags.
  - Below: A second screenshot peeking from behind (workspace view).
  - This proves the product exists and looks premium.

### Section 3: Social Proof / Ticker
- **Background:** `--bg-surface`
- **Content:** Infinite horizontal scroll of builder avatars + names + one-line achievements
  - "Alex Chen shipped 12 AI agents"
  - "Sarah Kim hit Top 1% this month"
  - "Marcus built a $50k project through Shipyards"
- **Animation:** CSS marquee, 30s linear infinite, pause on hover
- **Padding:** 24px vertical

### Section 4: The Problem (Why Shipyards)
- **Headline:** "Your work is everywhere. Your reputation is nowhere."
- **Layout:** 2-column grid
  - Left: Text content
  - Right: Visual comparison
    - "Before Shipyards": 5 scattered icons (GitHub, Twitter, LinkedIn, Discord, YouTube) with dotted lines, messy.
    - "After Shipyards": One clean profile card.
    - Style: Minimal line art, monochrome + `--accent` only.

### Section 5: Features (The 5 Layers Preview)
- **Headline:** "One platform. Five layers."
- **Layout:** 3-column grid (desktop), 1-column (mobile)
- **Cards:**
  1. **Showcase** (Icon: Layout) — "Unified project portfolio with verified metrics"
  2. **Marketplace** (Icon: Briefcase) — "AI-powered matching to real projects"
  3. **Workspace** (Icon: Terminal) — "Collaborate and track work automatically"
  4. **Identity** (Icon: Mail) — "@shipyards.dev email for instant credibility"
  5. **Breakdown** (Icon: GitBranch) — "Smart architecture visualization"
- **Card Design:** Standard Card, icon (24px, `--accent`) at top, title (`text-h5`), description (`text-body-sm`, `--text-secondary`)

### Section 6: How It Works
- **Headline:** "From builder to hired in three steps"
- **Layout:** Vertical timeline, left-aligned line (1px, `--border-default`)
- **Steps:**
  1. **Ship** — "Build and post your AI projects. Auto-import from GitHub."
  2. **Match** — "Our engine finds projects that fit your exact skills."
  3. **Earn** — "Collaborate in The Yard. Get paid. Build reputation."
- **Each step:** Number (large, `--text-muted`), title, description, small screenshot

### Section 7: Final CTA
- **Background:** `--accent-subtle` with subtle radial gradient from center
- **Headline:** "Ready to ship?"
- **Subheadline:** "Join 2,000+ builders who've already claimed their profile."
- **Input Group:** Email input + "Get Started" button (inline, max-width 480px)
- **Fine print:** "Free forever. No credit card required."

### Section 8: Footer
- **Layout:** 4 columns
  - Col 1: Logo + tagline "Where AI builders ship." + social icons (GitHub, Twitter, LinkedIn)
  - Col 2: Product (Features, Pricing, Changelog, Roadmap)
  - Col 3: Resources (Blog, Documentation, Community, Support)
  - Col 4: Company (About, Careers, Privacy, Terms)
- **Bottom bar:** "© 2026 Shipyards. All rights reserved." + "Built by builders, for builders."

### Data Architecture
- No auth required
- Static content + dynamic builder count (API: `GET /api/v1/stats/public` → `{builderCount, projectCount, matchCount}`)
- Email capture: `POST /api/v1/waitlist` → `{email, source: "landing_hero"}`

### States
- **Loading:** Skeleton for stats numbers
- **Success (email):** Input transforms to "You're on the list! Check your email." with check icon
- **Error:** Inline validation, red border + message

---

## PAGE 2: AUTHENTICATION FLOW
**Routes:** `/sign-up`, `/login`, `/onboarding`
**Phase:** Phase 1 (Week 1)
**Purpose:** Frictionless account creation with progressive profiling.

### Page 2A: Sign Up
**Layout:** Split screen (desktop), full-screen (mobile)
- **Left (50%):** Dark background, platform screenshot / abstract grid pattern (very subtle, opacity 0.03), testimonial quote
- **Right (50%):** Form area, max-width 400px, centered vertically

**Form Fields:**
1. **Email** (text input, auto-focus)
2. **Password** (password input with visibility toggle)
3. **Confirm Password** (conditional, shown if password entered)
4. **I am a:** Segmented control (Builder / Project Creator / Both)
   - Style: Pill buttons, active has `--accent` bg
5. **Terms checkbox:** "I agree to the Terms of Service and Privacy Policy" (links open in new tab)

**Submit:** "Create Account" (Primary, full width)
**Alt:** "Already have an account? Sign in" (link)
**Social Auth:** "Or continue with" → GitHub button (icon + "GitHub"), Google button
  - Style: Secondary button, full width, icon left-aligned

**Validation:**
- Real-time email format check
- Password strength indicator (4 bars, color-coded: red → yellow → teal)
- Minimum 8 characters, 1 number, 1 symbol

**Transitions:**
- On submit: Button enters loading state (spinner, disabled)
- On success: Auto-redirect to `/onboarding`
- On error: Toast notification + field-level error

### Page 2B: Login
- Same layout as Sign Up
- Fields: Email, Password, "Remember me" checkbox, "Forgot password?" link
- Submit: "Sign In"
- Social auth same as above

### Page 2C: Onboarding (Progressive)
**Route:** `/onboarding` (protected, redirect if not authenticated)
**Purpose:** Collect minimum viable profile data without overwhelming.
**Design:** Full-screen, step-based progress indicator at top (4 steps, horizontal line with dots)

**Step 1: Identity**
- Display name (required)
- Username/handle (required, `@username`, real-time availability check with debounce 300ms)
- Profile photo upload (optional, drag-drop zone, 2MB max, preview with circular crop)
- "Skip for now" (tertiary, bottom right)

**Step 2: Expertise**
- "What do you build with?" (multi-select chips)
  - Options: Claude, GPT-4, Kimi, Llama, Stable Diffusion, Midjourney, LangChain, AutoGPT, etc.
  - Style: Toggle chips (select = `--accent-subtle`, border `--accent`)
- "Primary skills" (tag input, comma-separated, autocomplete from skill database)
- "Experience level" (slider: Beginner → Intermediate → Advanced → Expert)
  - Custom styled range input: track `--border-default`, fill `--accent`, thumb 16px white circle

**Step 3: Connect (Optional)**
- "Link your existing work" (subheadline)
- GitHub username (input, auto-import toggle)
- Twitter handle (input)
- Personal website (input)
- "Why?" tooltip: "We auto-import your public projects to jumpstart your profile."

**Step 4: Goals**
- "What are you looking for?" (checkboxes)
  - Freelance projects
  - Full-time roles
  - Collaborators
  - Just showcasing work
- "Availability" (select: Immediately, 2 weeks, 1 month, Not available)

**Completion:**
- "Welcome to Shipyards, [name]!"
- CTA: "View your profile" (Primary) + "Explore projects" (Secondary)
- Confetti animation (subtle, 2s, canvas-based, not GIF)

### Data Architecture
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/oauth/github`
- `PUT /api/v1/onboarding/profile` (step 1)
- `PUT /api/v1/onboarding/skills` (step 2)
- `PUT /api/v1/onboarding/connections` (step 3)
- `PUT /api/v1/onboarding/goals` (step 4)
- State managed via React Context + localStorage backup (recover if browser closes)

---

## PAGE 3: APPLICATION SHELL (Navigation Systems)
**Routes:** All authenticated routes
**Phase:** Phase 1 (Week 1)
**Purpose:** Persistent navigation, command palette, global search.

### Layout Structure
```
+------------------------------------------+
|  Top Bar (64px)                          |
+----------+-------------------------------+
| Sidebar  | Main Content Area             |
| (240px)  | (flex: 1)                     |
|          |                               |
|          |                               |
+----------+-------------------------------+
```

### Top Bar
- **Height:** 64px
- **Background:** `--bg-base` with `backdrop-filter: blur(12px)` when scrolled
- **Border-bottom:** 1px solid `--border-subtle` (appears after scroll)
- **Left:**
  - Hamburger (mobile only, 32px icon button)
  - Logo mark (ship icon, 24px, `--accent`) + "Shipyards" wordmark
- **Center:** Global Search Bar
  - Width: 480px (desktop), 100% (mobile)
  - Height: 40px
  - Background: `--bg-surface`
  - Border: 1px solid `--border-default`
  - Border-radius: 8px
  - Placeholder: "Search builders, projects, or skills..."
  - Left icon: Search (16px, `--text-tertiary`)
  - Right: Keyboard shortcut hint "⌘K" (badge style, `--bg-inset`, `--text-tertiary`)
  - Focus: Opens Command Palette (Page 3B)
- **Right:**
  - Notification bell (Icon Button, badge with count if >0)
  - "Post Project" button (Primary, small) — only visible if user is Project Creator
  - User avatar (40px, dropdown trigger)
    - Dropdown: My Profile, Dashboard, Settings, Workspace, Sign Out
    - Divider between Workspace and Sign Out

### Sidebar (Desktop Only, Collapsible)
- **Width:** 240px (expanded), 64px (collapsed, icons only)
- **Background:** `--bg-base`
- **Border-right:** 1px solid `--border-subtle`
- **Padding:** 16px 12px
- **Sections:**

**Primary Navigation:**
- Home (Icon: Home) → `/feed`
- Explore (Icon: Compass) → `/explore`
- Marketplace (Icon: Briefcase) → `/marketplace`
- Leaderboards (Icon: Trophy) → `/leaderboards`
- Workspace (Icon: Terminal) → `/workspace` (only if active projects)

**Personal:**
- My Profile (Icon: User) → `/@[handle]`
- My Projects (Icon: Folder) → `/@[handle]/projects`
- Saved (Icon: Bookmark) → `/saved`
- Analytics (Icon: BarChart3) → `/analytics`

**Discovery:**
- Following (Icon: Users) → `/following`
- Messages (Icon: MessageSquare) → `/messages` (with unread count)

**Each nav item:**
- Height: 36px
- Padding: 8px 12px
- Border-radius: 6px
- Font: 14px, weight 500
- Icon: 18px, margin-right 12px
- Default: `--text-secondary`
- Hover: `--text-primary`, bg `--bg-surface-hover`
- Active: `--text-primary`, bg `--accent-subtle`, left border 2px `--accent` (inset)

**Bottom section:**
- "Upgrade to Pro" card (if free user)
  - Background: subtle gradient (not purple — dark teal to black)
  - Text: "Unlock premium features"
  - Button: "Upgrade" (small primary)

### Command Palette (Global Search)
**Trigger:** ⌘K / Ctrl+K
**Overlay:** Full screen, `--bg-base` at 80% opacity, `backdrop-filter: blur(8px)`
**Panel:** Centered, max-width 640px, max-height 480px, `--bg-elevated`, border-radius 12px
**Structure:**
- Input at top (sticky): Large (18px), no border, `--bg-elevated`, placeholder "Type a command or search..."
- Sections below (scrollable):
  - **Recent:** Last 5 visited pages
  - **Navigate:** Pages (Go to Profile, Go to Marketplace, etc.)
  - **Actions:** "Create Project", "Post to Marketplace", "Open Workspace"
  - **Search Results:** Builders, Projects, Skills (real-time as you type)
- **Each item:** Icon (20px) + Title + Subtitle (context) + Keyboard shortcut (if applicable)
- **Active item:** `--bg-surface-hover`, left border 2px `--accent`
- **Empty state:** "No results found. Try a different search."

### Data Architecture
- `GET /api/v1/search/global?q={query}&limit=10`
- `GET /api/v1/notifications/unread`
- `GET /api/v1/user/me` (for avatar, role)
- WebSocket: `ws://.../notifications` (real-time count updates)

---

# PART TWO: LAYER 1 — DISCOVERY & SHOWCASE

---

## PAGE 4: HOME FEED (Main Dashboard)
**Route:** `/feed`
**Phase:** Phase 1 (Weeks 3-4)
**Purpose:** Primary destination for authenticated builders. Personalized content discovery.
**User Story:** *"I want to see what the community is shipping and find inspiration."

### Layout
- **Left column (main):** 65% width, feed content
- **Right column (sidebar):** 35% width, max 360px, sticky widgets
- **Gap:** 32px
- **Mobile:** Single column, right sidebar becomes bottom section

### Left Column: Feed

**Feed Header:**
- Title: "Home" (`text-h3`)
- Subtitle: "Projects from builders you follow and recommendations" (`text-body-sm`, `--text-secondary`)
- Tabs: "For You" | "Following" | "Trending"
  - Style: Horizontal tabs, active has `--accent` underline (2px), font 14px weight 500
  - Transition: underline slides (150ms)

**Composer Card (Top of Feed):**
- Only visible if user has builder role
- Card: Standard Card, padding 16px
- Content:
  - Avatar (40px) + Input placeholder "What did you ship today?"
  - Input triggers modal (Page 4B: Quick Post)
  - Bottom row: Action buttons (icon + label)
    - "Project" (Folder icon)
    - "Update" (Pen icon)
    - "Media" (Image icon)
  - "Post" button (Primary, small, disabled until content entered)

**Feed Items:**
Each item is a **Project Card** (see Page 5 for detail view, this is the feed variant).

**Feed Project Card:**
- **Header:**
  - Avatar (40px) + Builder name (`text-body`, weight 600) + handle (`text-caption`, `--text-tertiary`)
  - Timestamp (`text-caption-sm`, `--text-tertiary`)
  - "..." menu (Icon Button, dropdown: Follow, Bookmark, Report, Copy link)
- **Content:**
  - Project title (`text-h5`, clickable → Project Detail)
  - Description: 3 lines max, truncated with "...more" link
  - Media: Grid (1 image = full width, 2 = 50/50, 3+ = masonry-like grid, max 4 visible + "+N" overlay)
  - Tags: Tech stack badges (e.g., "Claude", "Python", "FastAPI")
- **Metrics Bar:**
  - Row of data: 542 likes | 48 comments | 120 shares
  - Font: `text-caption`, `--text-tertiary`
  - Icons: 14px, aligned with text baseline
- **Actions:**
  - Like (Heart icon, toggle, fills `--error` when active)
  - Comment (MessageCircle icon)
  - Share (Share2 icon, dropdown: Copy link, Twitter, LinkedIn)
  - Bookmark (Bookmark icon, toggle)
- **Hover:** Card border `--border-active`

**Loading State:**
- 3 skeleton cards
- Each skeleton: avatar circle + 3 lines of text + rectangle for image
- Shimmer animation: `background: linear-gradient(90deg, --bg-surface 25%, --bg-surface-hover 50%, --bg-surface 75%)`, background-size 200%, animate position.

**Empty State (Following tab, no follows):**
- Icon: Users (48px, `--text-muted`)
- Title: "Your feed is quiet"
- Subtitle: "Follow builders to see their latest projects here."
- CTA: "Explore builders" (Secondary button)

### Right Column: Sidebar Widgets

**Widget 1: Trending (Sticky)**
- Title: "Trending This Week" (`text-h5`)
- List: 5 items
  - Number (1-5, `text-caption`, `--text-tertiary`, width 24px)
  - Project name (`text-body-sm`, weight 500, truncated)
  - Builder handle (`text-caption-sm`, `--text-tertiary`)
  - Engagement count (`text-caption-sm`, `--text-tertiary`)
- "View all" link at bottom (`text-caption`, `--accent`)

**Widget 2: Suggested Builders**
- Title: "Builders to follow"
- List: 3 builders
  - Avatar (40px) + Name + Handle + "Follow" button (small, secondary)
- "Show more" link

**Widget 3: Your Stats (if builder)**
- Title: "Your Profile"
- Mini stat row: Projects | Followers | Reputation
- Numbers in `text-mono`, `--text-primary`
- Labels in `text-caption-sm`, `--text-tertiary`
- Progress bar: "Top 15% this month" with thin bar (fill `--accent`)

### Data Architecture
- `GET /api/v1/feed?type=for_you|following|trending&cursor={cursor}` (cursor-based pagination)
- `POST /api/v1/projects/{id}/like`
- `POST /api/v1/projects/{id}/bookmark`
- `GET /api/v1/trending?period=week`
- `GET /api/v1/suggestions/builders`

### Interactions
- **Pull to refresh** (mobile): Swipe down, spinner appears, reload feed
- **Infinite scroll:** Trigger at 200px from bottom, show loading spinner (small, centered)
- **Like animation:** Heart scales 1 → 1.2 → 1 (150ms), fills with `--error`
- **New post:** Appears at top with subtle highlight flash (background `--accent-subtle` fades over 2s)

---

## PAGE 5: BUILDER PROFILE PAGE (Public)
**Route:** `/@[handle]`
**Phase:** Phase 1 (Weeks 1-2)
**Purpose:** The core identity layer. This is what recruiters see. This is what gets shared.
**User Story:** *"I want to understand who this builder is, what they've built, and whether they're right for my project in 30 seconds."

### Layout
- **Header Section:** Full width, `--bg-surface` background, padding 48px 0
- **Tab Navigation:** Sticky below header, `--bg-base` with blur
- **Content:** Tab-specific content below

### Section 1: Profile Header
**Background:** Subtle gradient from `--bg-surface` to `--bg-base` (top to bottom)
**Content (max-width 1280px, centered):**

**Top Row:**
- **Avatar:** 96px (2xl), border 3px solid `--bg-base`, shadow (subtle, only here: `0 0 0 1px --border-default, 0 4px 12px rgba(0,0,0,0.3)`)
- **Name:** `text-h2`, weight 700
- **Handle:** `text-body`, `--text-secondary` (`@alex`)
- **Badge Row:**
  - "Verified" badge (checkmark icon, `--accent` variant) — if identity verified
  - "Top 3%" badge (trophy icon, gold/yellow variant) — if ranked
  - "Available" badge (green dot, "Available for work") — if status is available
  - "@shipyards.dev" badge (mail icon, clickable, copies email) — if Layer 4 active

**Bio:**
- Max 3 lines, `text-body`, `--text-secondary`
- "Show more" if exceeds

**Meta Row (horizontal, gap 24px):**
- Location (MapPin icon)
- Website (Link icon, clickable)
- Joined date (Calendar icon)
- Email (Mail icon, only if public)

**Stats Row (4-column grid, max-width 600px):**
| Metric | Value | Label |
|--------|-------|-------|
| Projects | 12 | `text-mono`, 24px | Projects shipped |
| Reputation | 1,850 | `text-mono`, 24px | Reputation score |
| Followers | 1,200 | `text-mono`, 24px | Followers |
| Following | 340 | `text-mono`, 24px | Following |

**Action Buttons (below stats):**
- "Follow" / "Following" (Primary if not following, Secondary if following)
- "Message" (Secondary, only if following or public messages enabled)
- "Hire" (Accent variant, only visible to Project Creators — opens invitation modal)
- "More" (Icon Button, dropdown: Share profile, Copy link, Report)

**Social Links:**
- Row of icon buttons: GitHub, Twitter, YouTube, LinkedIn, Personal Website
- Style: 32px icon buttons, `--text-tertiary`, hover `--text-primary`

### Section 2: Tab Navigation
**Sticky when scrolled past header**
- Tabs: Overview | Projects | Skills | Activity | Reviews
- Style: Horizontal, centered, border-bottom 1px `--border-subtle`
- Active: `--text-primary`, border-bottom 2px `--accent`
- Font: 14px, weight 500
- Transition: 150ms ease

### Section 3: Overview Tab (Default)
**Layout:** 2-column (65/35)

**Left: Featured Projects**
- Grid: 2 columns (desktop), 1 column (mobile)
- Cards: Project preview cards (smaller than feed cards)
  - Thumbnail (16:9 aspect ratio, border-radius 6px, object-fit cover)
  - Title (`text-body`, weight 600)
  - Likes count (`text-caption`, `--text-tertiary`)
- "View all projects" link → redirects to Projects tab

**Right: Skills & Expertise**
- **Skills Cloud:**
  - Tags in varying sizes based on proficiency
  - Style: Standard badges, some with progress dots (●●●○○)
- **Tech Stack:**
  - Icons + names in a grid (4 columns)
  - Each: Tool icon (20px) + name (`text-caption-sm`)
- **Availability:**
  - Status card: "Available for freelance" (green dot) + "Typically responds in 2 hours"
  - Preferred budget range: "$3k - $15k"
  - Preferred project types: Tags

### Section 4: Projects Tab
- **Filter bar:** Category dropdown | Sort (Popular, Recent, Most liked) | Search within projects
- **Grid:** 3 columns (desktop), 2 (tablet), 1 (mobile)
- **Project Cards (Grid variant):**
  - Thumbnail (16:9)
  - Title
  - Short description (2 lines)
  - Tech stack icons (max 5, +N if more)
  - Footer: Likes + Comments + Date
- **Empty state:** "No projects yet" + CTA to create (if owner)

### Section 5: Skills Tab
- **Verified Skills:** Skills with checkmark (from completed projects or tests)
- **Self-Reported Skills:** Skills added manually
- **Skill Detail Card (on click):**
  - Modal showing: Projects using this skill, endorsements, test scores

### Section 6: Activity Tab
- Timeline of actions: Project shipped, Comment made, Milestone reached, Job completed
- Style: Vertical line (left), dots for events, cards for content

### Section 7: Reviews Tab
- **Summary:** Average rating (large number), star breakdown (5-bar chart)
- **Review Cards:**
  - Reviewer avatar + name
  - Project name (linked)
  - Rating (stars)
  - Comment
  - Date
  - "Verified project" badge

### Data Architecture
- `GET /api/v1/profiles/{handle}`
- `GET /api/v1/profiles/{handle}/projects?filter=&sort=`
- `GET /api/v1/profiles/{handle}/skills`
- `GET /api/v1/profiles/{handle}/activity`
- `GET /api/v1/profiles/{handle}/reviews`
- `POST /api/v1/profiles/{handle}/follow`

### Owner View Differences
- "Edit Profile" button (Primary) replaces "Follow"
- Analytics tab added (views, profile clicks, invitation rate)
- Draft projects visible
- "Boost profile" CTA (Pro feature)

---

## PAGE 6: PROJECT DETAIL PAGE (Public)
**Route:** `/project/[project-slug]`
**Phase:** Phase 1 (Weeks 2-3)
**Purpose:** Deep dive into a shipped project. The proof of work.
**User Story:** *"I want to see exactly what was built, how it was built, and whether this builder can replicate it for me."

### Layout
- **Hero:** Full-width project media (video/GIF/image), max-height 60vh, dark gradient overlay at bottom
- **Content:** Max-width 960px, centered, negative margin-top (-80px) to overlap hero

### Section 1: Project Hero
- **Media:** Full bleed, object-fit cover
- **Overlay (bottom):** Gradient from transparent to `--bg-base`
- **Title:** `text-h1`, positioned over gradient, padding 48px
- **Builder row:** Avatar (48px) + Name + "·" + Date + "·" + Category badge

### Section 2: Project Meta Bar (Sticky)
- **Height:** 56px
- **Background:** `--bg-base` with blur when sticky
- **Border-bottom:** 1px `--border-subtle`
- **Content:**
  - Left: Project title (truncated, `text-body`, weight 600)
  - Center: Like | Comment | Share counts (icon + number)
  - Right: Bookmark + "Hire builder" (Primary, small, only for Project Creators)

### Section 3: Main Content
**Left (65%):**
- **Description:** Rich text rendering (Markdown support)
  - Headers, lists, code blocks (syntax highlighted), images, links
  - Code blocks: `--bg-inset`, border `--border-subtle`, rounded 6px, copy button top-right
- **Tech Stack:** Horizontal list of tech badges with icons
- **Models Used:** Specific AI model badges (Claude, GPT-4, etc.)
- **Metrics:** Key-value pairs in a grid (2 columns)
  - "Time to build: 2 weeks"
  - "Cost: $500"
  - "Accuracy: 80%"
  - "Cost reduction: 60%"
  - Style: Label (`text-caption`, `--text-tertiary`) + Value (`text-mono`, `--text-primary`)
- **Links:** GitHub repo, Live demo, Documentation
  - Style: Cards with icon + title + URL, hover `--bg-surface-hover`
- **Demo/Media Gallery:** If multiple media files, carousel with thumbnails

**Right (35%):**
- **Builder Card:** Mini profile card (avatar 64px, name, handle, reputation, "View profile" link)
- **Project Stats:**
  - Likes, views, comments, shares (vertical list with icons)
- **Similar Projects:** 3 cards, thumbnail + title
- **Tags:** All tags as clickable links

### Section 4: Comments
- **Header:** "Discussion" + count
- **Composer:** Avatar + textarea + "Post" button
- **Comment Thread:**
  - Nested (2 levels max)
  - Avatar (32px) + Name + Time
  - Comment text
  - Actions: Reply, Like, More
  - Upvote/downvote (for technical comments)
- **Sort:** Top | Newest

### Data Architecture
- `GET /api/v1/projects/{slug}`
- `GET /api/v1/projects/{slug}/comments?sort=`
- `POST /api/v1/projects/{slug}/comments`
- `POST /api/v1/projects/{slug}/like`

---

## PAGE 7: PROJECT CREATION / EDIT FLOW
**Route:** `/project/new`, `/project/[slug]/edit`
**Phase:** Phase 1 (Weeks 2-3)
**Purpose:** Allow builders to showcase their work with rich context.
**User Story:** *"I just shipped something. I want to document it properly so recruiters understand what I did."

### Layout
- **Header:** Sticky, title "New Project" + Save draft / Publish buttons
- **Form:** Max-width 800px, centered, single column

### Form Sections

**1. Title**
- Input, placeholder "What did you build?"
- Character count: 0/100

**2. Category**
- Select from: AI Agents, Automation, Data Analysis, NLP, Computer Vision, etc.
- Visual: Icon + name cards, single select, 3-column grid

**3. Description**
- Rich text editor (block-based, Notion-style)
- Blocks: Paragraph, Heading, Code block, Image, Video, Divider, Quote
- Slash command menu (`/`) for block insertion
- Toolbar: Bold, Italic, Link, Code, Heading, List
- Placeholder: "Describe what you built, the problem it solves, and how it works..."

**4. Media**
- Upload zone: Drag & drop or click
- Supports: Images (JPG, PNG, GIF, WebP), Video (MP4, WebM), GIF
- Max 10 files, 50MB each
- Thumbnails with reorder (drag handle), delete (X icon)
- Primary media selector (star icon on thumbnail)

**5. Tech Stack**
- Tag input with autocomplete
- Suggestions based on category
- Each tag: icon (if available) + name + X to remove

**6. AI Models Used**
- Multi-select chips: Claude, GPT-4, Kimi, etc.
- "Other" free text input

**7. Metrics (Optional)**
- Key-value inputs (add/remove rows)
  - Key: "Accuracy", "Cost Reduction", "Time Saved"
  - Value: "80%", "$500/month", "20 hours/week"

**8. Links**
- GitHub URL (validates it's a real repo)
- Live Demo URL
- Documentation URL

**9. Difficulty & Time**
- Difficulty: Segmented control (Beginner | Intermediate | Advanced | Expert)
- Time to build: Number input + unit select (hours | days | weeks | months)
- Cost: Number input + currency

**10. Visibility**
- Toggle: Public / Unlisted / Draft
- Tooltip: "Public: Visible to everyone. Unlisted: Only accessible via link. Draft: Only you can see."

**Actions:**
- "Save Draft" (Secondary)
- "Preview" (Tertiary, opens in new tab)
- "Publish" (Primary, disabled until title + description + category filled)

### Data Architecture
- `POST /api/v1/projects` (create)
- `PUT /api/v1/projects/{id}` (update)
- `POST /api/v1/upload/media` (multipart, returns CDN URL)
- `GET /api/v1/projects/{id}/preview` (draft preview)

---

## PAGE 8: LEADERBOARDS
**Route:** `/leaderboards`
**Phase:** Phase 1 (Weeks 5-8)
**Purpose:** Gamification and discovery of top talent.
**User Story:** *"Who are the best AI builders right now?"

### Layout
- **Header:** "Leaderboards" (`text-h1`) + subtitle
- **Tabs:** Global | This Week | This Month | Categories (AI Agents, Automation, etc.)
- **Table:** Full-width, sortable columns

### Table Design
- **Header row:** `--bg-surface`, sticky top, border-bottom 1px `--border-default`
- **Columns:**
  - Rank (1, 2, 3 get special gold/silver/bronze badges)
  - Builder (avatar 32px + name + handle)
  - Reputation Score (mono font, `--accent` if top 10)
  - Projects Shipped
  - Total Likes
  - Streak (fire icon + days)
  - Trend (up/down arrow + percentage)
- **Row height:** 64px
- **Row hover:** `--bg-surface-hover`
- **Row click:** Navigates to profile
- **Pagination:** 50 per page, cursor-based

**Top 3 Highlight:**
- First 3 rows are larger (80px height)
- Avatars: 48px
- Background: subtle gradient (gold/silver/bronze tint at 5% opacity)
- Crown icon on #1

### Data Architecture
- `GET /api/v1/leaderboards?period=week|month|all&category=&cursor=`

---

## PAGE 9: EXPLORE / DISCOVERY PAGE
**Route:** `/explore`
**Phase:** Phase 1 (Weeks 3-4)
**Purpose:** Browse all content. Serendipity engine.
**User Story:** *"I want to discover interesting projects and builders I don't follow yet."

### Layout
- **Filter Sidebar (left, 240px, collapsible):**
  - Categories (checkbox tree)
  - Tech stack (searchable multi-select)
  - AI Models (checkboxes)
  - Difficulty (range)
  - Time range (date picker)
  - Sort by: Trending | Newest | Most liked | Most discussed
- **Main area:** Masonry grid or standard grid of Project Cards
- **Top bar:** Result count + active filters (removable chips) + view toggle (Grid/List)

### Grid View
- 3-column masonry (desktop), 2 (tablet), 1 (mobile)
- Cards: Same as feed cards but without the builder header (cleaner, focus on work)
- Hover: Overlay with quick actions (Like, Save, View)

### List View
- Table-like rows: Thumbnail (120px) + Title + Builder + Likes + Date

### Data Architecture
- `GET /api/v1/explore?filters...&sort=&cursor=`



---

# PART THREE: LAYER 2 — PROJECT MARKETPLACE

---

## PAGE 10: MARKETPLACE BROWSE
**Route:** `/marketplace`
**Phase:** Phase 2 (Weeks 5-12)
**Purpose:** Primary discovery surface for available projects.
**User Story:** *"I want to find paid AI projects that match my skills."

### Layout
- **Header:** "Project Marketplace" (`text-h1`) + subtitle "Verified projects looking for AI builders"
- **Search bar:** Full-width, large (height 48px), placeholder "Search by skill, budget, or project type..."
- **Filter bar:** Horizontal scroll (mobile), flex wrap (desktop)
  - Budget range: Slider (min-max, $500 - $50k+)
  - Timeline: Chips ("< 1 week", "1-4 weeks", "1-3 months", "3+ months")
  - Skills: Multi-select dropdown
  - Complexity: Segmented (Beginner | Intermediate | Advanced)
  - Remote/Onsite: Toggle
- **Results:**
  - Count: "47 projects match your filters"
  - Sort: Relevance | Newest | Budget (high/low)
  - View: Grid / List

### Project Listing Card (Marketplace variant)
- **Status badge:** "Open", "In progress", "Completed" (top-right)
- **Title:** `text-h4`, weight 600
- **Description:** 4 lines max
- **Meta row:**
  - Budget: `$5,000 - $8,000` (`text-mono`, `--accent`)
  - Timeline: "4 weeks"
  - Proposals: "12 proposals submitted"
- **Skills required:** Row of badges
- **Poster:** Avatar (32px) + Company name + Verification badge
- **Footer:**
  - "View details" (Secondary, small)
  - "Express interest" (Primary, small) — if builder
  - "Edit" — if owner

### Empty State
- "No projects match your filters"
- "Try adjusting your budget range or removing some skill filters"
- CTA: "Get notified when matching projects are posted" (email input)

### Data Architecture
- `GET /api/v1/marketplace/projects?filters...`
- `POST /api/v1/marketplace/projects/{id}/interest`

---

## PAGE 11: PROJECT POSTING FLOW
**Route:** `/marketplace/post`
**Phase:** Phase 2 (Weeks 5-7)
**Purpose:** Allow project creators to post work with AI-assisted requirement parsing.
**User Story:** *"I need an AI agent built. I want to describe it in plain English and have the system figure out the rest."

### Layout
- **Multi-step wizard:** Progress indicator at top (4 steps)
- **Max-width:** 720px, centered
- **Auto-save:** Every 30 seconds, "Draft saved" toast

### Step 1: Describe Your Project
- **Headline:** "What do you need built?"
- **Textarea:** Large (min-height 200px), placeholder "Describe your project in detail. What problem does it solve? Who are the users? What does success look like?"
- **AI Assist button:** "Analyze with AI" (Accent variant, sparkles icon — only acceptable AI icon)
  - On click: Loading state "Analyzing requirements..."
  - Output: Parsed requirements card appears below
    - "Key needs: [bullet list]"
    - "Suggested tech stack: [badges]"
    - "Complexity estimate: Intermediate"
    - "Ideal builder profile: [summary]"
- **Attachment:** "Add files" (RFPs, designs, data samples)

### Step 2: Scope & Budget
- **Budget:**
  - Type: Fixed | Hourly | Range
  - Input: Currency selector + amount
  - "Budget helper": "Based on similar projects, most builders expect $X-$Y"
- **Timeline:**
  - Start date (date picker)
  - Duration (number + unit)
  - Deadline (calculated automatically)
- **Deliverables:** Checklist builder (add items)
- **Milestones:** Optional, define payment milestones

### Step 3: Requirements
- **Skills required:** Tag input (AI suggests based on Step 1)
- **Tech stack preference:** Multi-select
- **Experience level:** Segmented control
- **Team size:** "Solo builder" | "Small team (2-3)" | "Doesn't matter"
- **Location/Timezone:** Select with map (optional)
- **NDA required:** Toggle

### Step 4: Review & Publish
- **Summary card:** All details formatted nicely
- **AI Match Preview:** "Based on your requirements, we estimate 23 matching builders"
- **Visibility:** Public | Invite-only | Private link
- **Boost options:** "Feature this project" (paid, $100)
- **Actions:**
  - "Save as draft" (Secondary)
  - "Post project" (Primary, large)

### Post-Publish
- Success modal: "Project posted!"
- "View project" | "Invite builders" (goes to matching results)

### Data Architecture
- `POST /api/v1/marketplace/projects` (step 1-4 aggregated)
- `POST /api/v1/ai/parse-requirements` (returns parsed data)
- `GET /api/v1/marketplace/estimate-match?requirements=`

---

## PAGE 12: PROJECT DETAIL (Marketplace View)
**Route:** `/marketplace/project/[id]`
**Phase:** Phase 2 (Weeks 5-7)
**Purpose:** Full project brief for builders evaluating work.
**User Story:** *"Should I apply to this project? Is the scope clear? Is the client legitimate?"

### Layout
- **Header:** Project title + status badge
- **2-column (65/35)**

**Left Column:**
- **Description:** Rich text (same renderer as project showcase)
- **Requirements:** Structured list (parsed from AI)
- **Deliverables:** Checklist
- **Milestones:** Timeline visualization
- **Skills required:** Badges
- **About the client:** Company card (name, logo, projects posted, hire rate, reviews)

**Right Column (Sticky):**
- **Budget card:**
  - Large amount (`text-h2`, `--accent`)
  - Type (Fixed/Hourly)
  - "Posted X days ago"
- **Timeline card:** Start date → Deadline, progress bar if active
- **Match score:** If viewing as builder, "You match 87%" with breakdown
  - Circular progress (SVG, 48px), color `--accent`
  - Breakdown: Skills 30/30, Experience 25/25, Availability 20/20, Budget 12/15
- **Actions:**
  - "Apply now" (Primary, full width) → opens application modal
  - "Save for later" (Secondary, full width)
  - "Share" (Tertiary)
- **Similar projects:** 2-3 links

**Application Modal:**
- Cover letter textarea
- Proposed budget (if range)
- Estimated timeline
- Relevant projects (select from your portfolio)
- Questions for client (optional)
- Submit button

### Data Architecture
- `GET /api/v1/marketplace/projects/{id}`
- `POST /api/v1/marketplace/projects/{id}/apply`
- `GET /api/v1/marketplace/projects/{id}/match-score`

---

## PAGE 13: MATCHING RESULTS / BUILDER RECOMMENDATIONS
**Route:** `/marketplace/project/[id]/matches`
**Phase:** Phase 2 (Weeks 8-10)
**Purpose:** AI-powered builder recommendations for a specific project.
**User Story:** *"Show me the best builders for this project, ranked by fit."

### Layout
- **Header:** "Recommended Builders" + Project name (truncated)
- **AI Summary Card:** Full width, `--accent-subtle` background
  - "We analyzed 1,247 builders and found 23 strong matches"
  - "Top match score: 94%"
  - "Estimated response time: 4 hours"
- **Filter bar:** Availability | Budget history | Experience | Rating
- **Results:** Vertical list of Builder Match Cards

### Builder Match Card
- **Layout:** Horizontal card, full width, height ~120px
- **Left:** Avatar (64px) + Rank badge (1, 2, 3...)
- **Center:**
  - Name + handle + verification badges
  - "Match score: 94%" — large, `--accent`
  - Match reasons (bullet list):
    - "Built 3 similar customer support bots"
    - "1,200+ hours with Claude"
    - "Available immediately"
    - "Budget history aligns ($5k-$10k range)"
  - Relevant projects: 2 thumbnail links
- **Right:**
  - "Invite" (Primary)
  - "View profile" (Secondary)
  - "Save" (Icon)
- **Hover:** `--bg-surface-hover`, border `--border-active`

### Empty State
- "No matching builders found"
- "Try relaxing your requirements or wait for new builders to join"

### Data Architecture
- `GET /api/v1/marketplace/projects/{id}/matches`
- `POST /api/v1/marketplace/projects/{id}/invite` (bulk or individual)

---

## PAGE 14: INVITATION MANAGEMENT (Builder View)
**Route:** `/invitations`
**Phase:** Phase 2 (Weeks 10-11)
**Purpose:** Builders manage incoming project invitations.
**User Story:** *"What projects have I been invited to? Which ones should I accept?"

### Layout
- **Header:** "Invitations" (`text-h1`)
- **Tabs:** Pending | Accepted | Declined | Expired
- **List:** Full-width cards

### Invitation Card
- **Layout:** Standard Card, horizontal
- **Left:** Project poster avatar (48px)
- **Center:**
  - Project title (`text-h5`)
  - Poster name + company
  - Budget + Timeline
  - "Why you were invited:" AI-generated text (2 lines)
  - Match score badge
- **Right:**
  - "Accept" (Primary)
  - "Decline" (Secondary)
  - "View project" (Tertiary)
  - "Counter offer" (if enabled)
- **Footer:** Sent date, expires in X days

### Data Architecture
- `GET /api/v1/invitations?status=`
- `POST /api/v1/invitations/{id}/accept`
- `POST /api/v1/invitations/{id}/decline`

---

## PAGE 15: INVITATION MANAGEMENT (Creator View)
**Route:** `/marketplace/project/[id]/invitations`
**Phase:** Phase 2 (Weeks 10-11)
**Purpose:** Project creators track and manage sent invitations.
**User Story:** *"Who did I invite? Who responded? Do I need to invite more people?"

### Layout
- **Header:** Project name + "Invitations" + "Send more" button
- **Stats row:** Sent | Opened | Accepted | Declined | No response (each with count and mini bar)
- **Table:**
  - Builder (avatar + name)
  - Match score
  - Sent date
  - Status (Pending / Opened / Accepted / Declined)
  - Response time
  - Actions: Resend, Withdraw, Message

### Data Architecture
- `GET /api/v1/marketplace/projects/{id}/invitations`
- `POST /api/v1/invitations/{id}/resend`
- `POST /api/v1/invitations/{id}/withdraw`

---

## PAGE 16: CONTRACT / AGREEMENT PAGE
**Route:** `/contract/[contract-id]`
**Phase:** Phase 2 (Weeks 12-13)
**Purpose:** Formalize the working agreement between builder and creator.
**User Story:** *"I want to see exactly what was agreed upon before starting work."

### Layout
- **Header:** Contract title + status badge (Draft / Active / Completed / Disputed)
- **2-column (60/40)**

**Left: Contract Terms**
- **Parties:** Builder card + Creator card
- **Project scope:** Rich text (editable if draft)
- **Deliverables:** Checklist with due dates
- **Milestones:** Timeline with payment amounts
- **Payment terms:** Amount, method, schedule
- **Revisions policy:** Number of revisions included
- **Termination clause:** Text
- **Signatures:** Digital signature area (if finalized)

**Right: Activity & Actions**
- **Status timeline:** Draft → Sent → Accepted → Active → Completed
- **Actions:**
  - "Edit terms" (if draft)
  - "Send for approval" (Primary)
  - "Accept contract" (Primary, if receiving)
  - "Request changes" (Secondary)
  - "Download PDF" (Tertiary)
- **Chat:** Mini message thread for contract negotiation

### Data Architecture
- `GET /api/v1/contracts/{id}`
- `PUT /api/v1/contracts/{id}`
- `POST /api/v1/contracts/{id}/sign`
- `POST /api/v1/contracts/{id}/negotiate`

---

## PAGE 17: CREATOR DASHBOARD (Analytics)
**Route:** `/dashboard`
**Phase:** Phase 2 (Weeks 12-13)
**Purpose:** Project creators view analytics and manage their postings.
**User Story:** *"How are my projects performing? Am I getting good applicants?"

### Layout
- **Header:** "Dashboard" (`text-h1`) + date range selector
- **Stats cards (4-column):**
  - Active projects
  - Total applications
  - Avg match score
  - Hire rate
- **Charts:**
  - Applications over time (line chart)
  - Match quality distribution (bar chart)
  - Top performing projects (ranked list)
- **Recent activity:** Table of recent applications with quick actions

### Data Architecture
- `GET /api/v1/dashboard/creator`
- `GET /api/v1/dashboard/creator/stats`

---

## PAGE 18: BUILDER JOB PREFERENCES
**Route:** `/settings/job-preferences`
**Phase:** Phase 2 (Weeks 12-13)
**Purpose:** Builders configure what projects they want to be matched to.
**User Story:** *"Only show me projects that fit my criteria."

### Layout
- **Form sections:**
  - **Availability:** Toggle + calendar
  - **Preferred budget range:** Dual slider
  - **Preferred project types:** Multi-select
  - **Skills to match on:** Tags (auto from profile, editable)
  - **Tech stack preferences:** Multi-select
  - **Model preferences:** Claude, GPT-4, etc.
  - **Location/Timezone:** Select
  - **Notification preferences:** Email, in-app, Slack

### Data Architecture
- `GET /api/v1/settings/job-preferences`
- `PUT /api/v1/settings/job-preferences`

---

# PART FOUR: LAYER 3 — COLLABORATION WORKSPACE ("THE YARD")

---

## PAGE 19: WORKSPACE HOME / PROJECT DASHBOARD
**Route:** `/workspace`
**Phase:** Phase 3 (Weeks 14-16)
**Purpose:** Central hub for all active collaborations.
**User Story:** *"What projects am I currently working on? What's the status of each?"

### Layout
- **Header:** "Workspace" (`text-h1`) + "New project" button
- **Project grid:** 3-column cards

### Workspace Project Card
- **Status indicator:** Colored dot (green = active, yellow = pending, blue = completed)
- **Project name:** `text-h4`
- **Client/Team:** Avatar row (stacked, max 4)
- **Progress bar:** Percentage complete
- **Next milestone:** "Code review due in 2 days"
- **Recent activity:** Last action timestamp
- **Quick actions:** Open workspace, Message, View contract

### Empty State
- "No active projects"
- "Browse the marketplace to find your first project"

### Data Architecture
- `GET /api/v1/workspace/projects`

---

## PAGE 20: PROJECT WORKSPACE (The Yard)
**Route:** `/workspace/project/[id]`
**Phase:** Phase 3 (Weeks 14-16)
**Purpose:** The actual collaboration environment.
**User Story:** *"I need to work on this project, communicate with the team, and track progress."

### Layout (Complex, Multi-Panel)
```
+----------------------------------------------------------+
|  Project Header (Name, Status, Team, Actions)            |
+----------+-----------------------------------------------+
| Sidebar  | Main Content Area                             |
| (200px)  | (Tab-based: Tasks | Code | Chat | Files)      |
|          |                                               |
+----------+-----------------------------------------------+
```

### Project Header
- **Left:** Project name + status badge + progress percentage
- **Center:** Team avatars (stacked) + "+3 more" tooltip
- **Right:** "Mark complete" | "Message team" | "Settings"

### Sidebar Navigation
- **Overview** (Icon: Layout)
- **Tasks** (Icon: CheckSquare) — with count badge
- **Code** (Icon: GitBranch) — with commit count
- **Chat** (Icon: MessageSquare) — with unread count
- **Files** (Icon: Folder) — with file count
- **Timeline** (Icon: Clock)
- **Settings** (Icon: Settings)

### Tab 1: Tasks (Kanban Board)
- **Columns:** Backlog | In Progress | Review | Done
- **Cards:** Task name, assignee avatar, due date, priority badge
- **Drag & drop:** Between columns
- **Add task:** "+" button at bottom of each column
- **Task detail:** Click opens side panel (not modal) from right

### Tab 2: Code
- **Git integration:**
  - Branch list
  - Recent commits (auto-imported from GitHub)
  - Commit graph (contribution-style)
  - Files changed
- **Code review:** Inline comments on diffs
- **Stats:** Lines added/removed, commit frequency

### Tab 3: Chat
- **Thread-based:** General + per-task threads
- **Message bubbles:** Left (others), Right (me)
- **Input:** Textarea with markdown support, file attach, emoji
- **Presence indicators:** Typing dots, online status

### Tab 4: Files
- **Grid/List toggle**
- **Upload zone:** Drag & drop
- **File cards:** Icon + name + size + uploader + date
- **Preview:** Images inline, others download

### Data Architecture
- `GET /api/v1/workspace/projects/{id}`
- `GET /api/v1/workspace/projects/{id}/tasks`
- `GET /api/v1/workspace/projects/{id}/commits`
- `GET /api/v1/workspace/projects/{id}/messages`
- `GET /api/v1/workspace/projects/{id}/files`
- WebSocket: Real-time updates for all tabs

---

## PAGE 21: TASK DETAIL (Side Panel)
**Route:** `/workspace/project/[id]?task=[task-id]` (side panel overlay)
**Phase:** Phase 3 (Weeks 14-16)
**Purpose:** Detailed task view without leaving context.

### Layout (Right side panel, 480px width, slides in)
- **Header:** Task name (editable inline) + Close (X)
- **Status:** Dropdown (Backlog → In Progress → Review → Done)
- **Assignee:** Avatar selector (team members)
- **Due date:** Date picker
- **Priority:** Badge selector (Low | Medium | High | Critical)
- **Description:** Rich text editor
- **Subtasks:** Checklist (add/remove)
- **Attachments:** File list
- **Activity:** Log of changes (who moved what when)
- **Comments:** Thread at bottom

### Data Architecture
- `GET /api/v1/workspace/tasks/{id}`
- `PUT /api/v1/workspace/tasks/{id}`
- `POST /api/v1/workspace/tasks/{id}/comments`

---

## PAGE 22: CODE REVIEW INTERFACE
**Route:** `/workspace/project/[id]/code-review/[commit-id]`
**Phase:** Phase 3 (Weeks 14-16)
**Purpose:** Review code changes with inline comments.

### Layout
- **Header:** Commit message + author + date
- **Diff view:** Side-by-side or unified
- **Line numbers:** Mono font, `--text-tertiary`
- **Syntax highlighting:** Full support
- **Inline comments:** Click line number → comment thread appears below line
- **Approval:** "Approve" | "Request changes" | "Comment"

### Data Architecture
- `GET /api/v1/workspace/projects/{id}/commits/{commitId}`
- `POST /api/v1/workspace/commits/{commitId}/comments`
- `POST /api/v1/workspace/commits/{commitId}/approve`

---

## PAGE 23: TEAM MANAGEMENT
**Route:** `/workspace/project/[id]/team`
**Phase:** Phase 3 (Weeks 14-16)
**Purpose:** Manage team members and roles.

### Layout
- **Member list:** Table with avatar, name, role, permissions
- **Roles:** Owner, Admin, Builder, Viewer
- **Actions:** Change role, Remove, Invite new
- **Invite modal:** Email input + role selector + message

### Data Architecture
- `GET /api/v1/workspace/projects/{id}/team`
- `POST /api/v1/workspace/projects/{id}/invite`
- `PUT /api/v1/workspace/projects/{id}/team/{userId}`

---

# PART FIVE: LAYER 4 — PROFESSIONAL IDENTITY

---

## PAGE 24: EMAIL SETUP & MANAGEMENT
**Route:** `/settings/email`
**Phase:** Phase 4 (Weeks 17-24)
**Purpose:** Configure and manage @shipyards.dev email.
**User Story:** *"Set up my professional email and configure forwarding."

### Layout
- **Header:** "Professional Email" (`text-h1`)
- **Status card:**
  - "Your email: alex@shipyards.dev" (large, `text-h2`, mono font)
  - Status badge: "Active" | "Pending verification" | "Inactive"
  - "Copy email" button
  - "Test email" button (sends test to personal inbox)
- **Configuration:**
  - **Forwarding:** Toggle + personal email input
  - **Send from Shipyards:** Web-based compose (simple)
  - **IMAP/POP3:** Credentials display (for external clients)
  - **Signature:** Textarea for default signature
- **Usage stats:** Emails sent, received, storage used

### Data Architecture
- `GET /api/v1/email/status`
- `POST /api/v1/email/setup`
- `PUT /api/v1/email/settings`

---

## PAGE 25: PUBLIC DIRECTORY / LOOKUP
**Route:** `/lookup`
**Phase:** Phase 4 (Weeks 17-24)
**Purpose:** Allow anyone to look up a Shipyards builder by email.
**User Story:** *"Someone emailed me from @shipyards.dev. Who are they?"

### Layout
- **Header:** "Builder Lookup" (`text-h1`)
- **Search:** Large input, placeholder "Enter @shipyards.dev email..."
- **Result card (if found):**
  - Avatar (96px)
  - Name + handle
  - Reputation score
  - Top 3 projects
  - "View full profile" link
- **Not found:** "No builder found with that email. Make sure it's a @shipyards.dev address."

### Data Architecture
- `GET /api/v1/lookup?email={email}`

---

## PAGE 26: VERIFICATION CENTER
**Route:** `/settings/verification`
**Phase:** Phase 4 (Weeks 17-24)
**Purpose:** Builders verify identity and skills.
**User Story:** *"I want to verify my identity to get the verified badge."

### Layout
- **Header:** "Verification Center" (`text-h1`)
- **Progress:** "3 of 5 verifications complete" with progress bar
- **Verification cards (vertical list):**
  1. **Email verification** — Status: Complete (green check)
  2. **Identity verification** — Upload ID / LinkedIn OAuth — Status: Pending
  3. **GitHub verification** — OAuth connect — Status: Complete
  4. **Skill test: Claude** — Link to test — Status: Not started
  5. **Skill test: Python** — Link to test — Status: Not started
- **Each card:** Icon + Title + Description + Status badge + Action button

### Data Architecture
- `GET /api/v1/verification/status`
- `POST /api/v1/verification/identity`
- `POST /api/v1/verification/github`

---

# PART SIX: LAYER 5 — SMART PROJECT BREAKDOWN

---

## PAGE 27: PROJECT DECOMPOSITION INPUT
**Route:** `/breakdown/new`
**Phase:** Phase 5 (Weeks 25-32)
**Purpose:** Enter a project description and get AI-powered task breakdown.
**User Story:** *"I have a complex AI project. Help me break it down into manageable tasks."

### Layout
- **Header:** "Smart Breakdown" (`text-h1`)
- **Input area:**
  - Large textarea (min-height 240px)
  - Placeholder: "Describe your AI project. What should it do? What are the inputs and outputs? Any specific models or tools you want to use?"
  - "Analyze" button (Primary, large, full width below input)
- **Options (collapsible):**
  - "Preferred models:" Multi-select
  - "Complexity preference:" Simple breakdown | Detailed | Expert-level
  - "Team size:" Solo | 2-3 | 4+

### Loading State
- "Analyzing your project..."
- Animated dots
- "This may take 10-20 seconds"
- Progress steps: Parsing → Decomposing → Optimizing → Generating flowchart

### Data Architecture
- `POST /api/v1/breakdown/analyze`
- Returns: Task tree, dependencies, model recommendations, cost estimates

---

## PAGE 28: FLOWCHART / ARCHITECTURE VIEW
**Route:** `/breakdown/[breakdown-id]`
**Phase:** Phase 5 (Weeks 25-32)
**Purpose:** Visualize the project architecture and task dependencies.
**User Story:** *"Show me how all the pieces of this project fit together."

### Layout
- **Header:** Project name + "Architecture" + Export button (PNG/SVG)
- **Main area:** Interactive flowchart canvas
- **Sidebar (right, 320px):** Task details when selected

### Flowchart Design
- **Canvas:** `--bg-base`, grid background (subtle dots, 20px spacing, `--border-subtle` at 30% opacity)
- **Nodes:**
  - Shape: Rounded rectangle (border-radius 8px)
  - Background: `--bg-surface`
  - Border: 1px `--border-default`
  - Header: Task name (`text-body`, weight 600)
  - Subheader: Assigned model (Claude, GPT-3.5, etc.) as badge
  - Body: Brief description (2 lines)
  - Footer: Estimated time + cost
  - Status indicator (if progress tracked): Left border 3px (gray = todo, blue = in progress, green = done)
- **Edges:** Curved bezier lines, 1px `--border-default`, arrowheads
- **Edge labels:** "depends on", "feeds into", "parallel with"
- **Colors by model:**
  - Claude: Teal tint border
  - GPT-4: Blue tint border  
  - GPT-3.5: Lighter blue
  - Custom code: Gray
  - API integration: Purple (subtle, not vibe-coded)

### Interactions
- **Pan:** Click and drag canvas
- **Zoom:** Mouse wheel or +/- buttons
- **Click node:** Right sidebar opens with task details
- **Double-click node:** Edit task (if owner)
- **Drag node:** Reposition (auto-saves layout)
- **Hover node:** Highlight connected edges and nodes

### Right Sidebar (Task Detail)
- **Task name:** Editable
- **Description:** Rich text
- **Assigned model:** Dropdown
- **Estimated cost:** Number input
- **Estimated time:** Number input
- **Dependencies:** List of linked tasks
- **Status:** Todo | In Progress | Done
- **Assigned to:** Avatar selector (if team)
- **Notes:** Textarea

### Data Architecture
- `GET /api/v1/breakdown/{id}`
- `PUT /api/v1/breakdown/{id}/tasks/{taskId}`
- `PUT /api/v1/breakdown/{id}/layout` (node positions)

---

## PAGE 29: TASK EXECUTION VIEW
**Route:** `/breakdown/[breakdown-id]/execute`
**Phase:** Phase 5 (Weeks 25-32)
**Purpose:** Step-by-step task execution with context preservation.
**User Story:** *"I'm building Task 3. Show me what I need from Task 1 and 2, and what Task 4 needs from me."

### Layout
- **Header:** Task name + progress breadcrumb (Task 3 of 7)
- **3-column layout:**
  - **Left (25%):** Context panel
    - "Inputs from previous tasks"
    - Links to outputs from Task 1, Task 2
    - Key decisions made earlier
  - **Center (50%):** Work area
    - Task description
    - Code editor (if coding task) — Monaco/CodeMirror, dark theme matching our palette
    - Notes area
    - "Mark complete" button
  - **Right (25%):** Next steps panel
    - "What Task 4 needs from you"
    - Interface definitions
    - Data schemas

### Data Architecture
- `GET /api/v1/breakdown/{id}/execute?task={taskId}`
- `POST /api/v1/breakdown/{id}/tasks/{taskId}/complete`

---

## PAGE 30: PROGRESS TRACKER
**Route:** `/breakdown/[breakdown-id]/progress`
**Phase:** Phase 5 (Weeks 25-32)
**Purpose:** Track overall project completion and timeline.
**User Story:** *"How far along is this project? Are we on track?"

### Layout
- **Header:** Project name + overall percentage
- **Progress visualization:**
  - Large circular progress (SVG, 120px), center shows "68%"
  - Breakdown by category: Engineering | Integration | Testing | Documentation
- **Timeline:** Gantt-style chart
  - Horizontal bars for each task
  - Actual vs estimated time
  - Milestone markers
- **Cost tracker:**
  - Estimated vs actual API spend
  - Bar chart by model (Claude: $45, GPT-3.5: $12, etc.)
- **Team activity:** Recent commits, task completions, messages

### Data Architecture
- `GET /api/v1/breakdown/{id}/progress`
- `GET /api/v1/breakdown/{id}/costs`

---

# PART SEVEN: UTILITY & SYSTEM PAGES

---

## PAGE 31: SETTINGS (Account)
**Route:** `/settings`
**Phase:** Phase 1 (Week 1)
**Purpose:** Manage account settings.

### Layout
- **Sidebar (left, 200px):** Account | Profile | Notifications | Billing | Security | Integrations | Job Preferences | Email
- **Main area:** Form sections

### Sections
- **Profile:** Name, username, bio, location, website, avatar
- **Notifications:** Email preferences (digest, immediate, none) for: Project invites, Messages, Comments, Milestones, Marketing
- **Security:** Password change, 2FA toggle, Sessions list
- **Integrations:** GitHub, Twitter, LinkedIn, Slack, Claude Code
- **Billing:** Subscription status, payment method, invoices

### Data Architecture
- `GET /api/v1/settings`
- `PUT /api/v1/settings`

---

## PAGE 32: NOTIFICATIONS CENTER
**Route:** `/notifications`
**Phase:** Phase 1 (Week 1)
**Purpose:** Centralized notification history.

### Layout
- **Header:** "Notifications" + "Mark all read" + Settings link
- **Filter tabs:** All | Mentions | Invitations | System
- **List:** Vertical cards
  - Avatar (if from user) + Icon (if system)
  - Message text (rich, e.g., "**Alex Chen** invited you to **Customer Support Bot**")
  - Timestamp
  - "Unread" indicator (left border 2px `--accent`)
  - Actions: View, Dismiss
- **Infinite scroll**

### Data Architecture
- `GET /api/v1/notifications`
- `POST /api/v1/notifications/read`
- `DELETE /api/v1/notifications/{id}`

---

## PAGE 33: MESSAGES (Inbox)
**Route:** `/messages`
**Phase:** Phase 1 (Week 1)
**Purpose:** Direct messaging between builders and creators.

### Layout (Split view)
- **Left (320px):** Conversation list
  - Avatar + Name + Last message preview + Timestamp + Unread count
  - Search conversations
- **Right (flex):** Active conversation
  - Header: Avatar + Name + Status + Actions
  - Message history (scrollable, bottom-aligned)
  - Input area: Textarea + Attach + Emoji + Send

### Data Architecture
- `GET /api/v1/conversations`
- `GET /api/v1/conversations/{id}/messages`
- `POST /api/v1/conversations/{id}/messages`
- WebSocket: Real-time message delivery

---

## PAGE 34: ANALYTICS (Builder)
**Route:** `/analytics`
**Phase:** Phase 1 (Weeks 5-8)
**Purpose:** Builders view their profile and project performance.

### Layout
- **Header:** "Your Analytics" (`text-h1`) + date range
- **Stats row (4 cards):**
  - Profile views
  - Project likes
  - Follower growth
  - Invitation rate
- **Charts:**
  - Views over time (area chart)
  - Top projects by engagement (horizontal bar)
  - Traffic sources (donut chart)
  - Skill demand (what skills are getting you noticed)
- **Table:** Individual project stats (views, likes, comments, click-through rate)

### Data Architecture
- `GET /api/v1/analytics/overview`
- `GET /api/v1/analytics/projects`

---

## PAGE 35: SAVED / BOOKMARKS
**Route:** `/saved`
**Phase:** Phase 1 (Weeks 3-4)
**Purpose:** View saved projects and builders.

### Layout
- **Tabs:** Saved Projects | Saved Builders | Saved Marketplace Projects
- **Grid/List:** Same components as Explore and Marketplace
- **Organize:** Folders (create, rename, delete), drag to folder

### Data Architecture
- `GET /api/v1/saved`
- `POST /api/v1/saved/folders`

---

## PAGE 36: SEARCH RESULTS PAGE
**Route:** `/search?q=...`
**Phase:** Phase 1 (Weeks 3-4)
**Purpose:** Dedicated search results page.

### Layout
- **Header:** Search input (pre-filled with query) + result count
- **Filter tabs:** All | Builders | Projects | Marketplace | Skills
- **Results:** Context-appropriate cards for each type
- **Empty state:** "No results for 'query'" + suggestions

### Data Architecture
- `GET /api/v1/search?q=...&type=`

---

## PAGE 37: PRICING / UPGRADE
**Route:** `/pricing`
**Phase:** Phase 2 (Weeks 5-12)
**Purpose:** Show subscription tiers.

### Layout
- **Header:** "Upgrade your Shipyards experience" (`text-h1`)
- **Toggle:** Monthly / Yearly (save 20%)
- **3-column cards:**
  1. **Free** — Current plan highlight
  2. **Pro** ($10/month) — Featured (center, slightly elevated)
  3. **Team** ($50/month) — For agencies
- **Each card:** Plan name, price, feature list (checkmarks), CTA button
- **FAQ:** Accordion below

### Data Architecture
- `GET /api/v1/pricing`
- `POST /api/v1/billing/subscribe`

---

## PAGE 38: ADMIN / MODERATION DASHBOARD
**Route:** `/admin`
**Phase:** Phase 2+ (Internal)
**Purpose:** Platform moderation and management.

### Layout
- **Sidebar:** Overview | Users | Projects | Marketplace | Reports | Settings
- **Stats cards:** Daily active users, New signups, Projects posted, Reports open
- **Tables:** Users (with ban/suspend actions), Projects (with feature/remove), Reports (with resolve/escalate)

### Data Architecture
- `GET /api/v1/admin/stats`
- `GET /api/v1/admin/users`
- `POST /api/v1/admin/users/{id}/suspend`

---

# PART EIGHT: DESIGN TOKENS & ASSETS

---

## 8.1 Animation Specifications

**Page Transitions:**
- Route change: Content fades out (100ms), new content fades in (150ms) with `translateY(4px)` → `translateY(0)`
- No loading spinners between routes — instant transition with skeleton if data loading

**Micro-interactions:**
- Button hover: `translateY(-0.5px)` + background color change, 150ms
- Card hover: `translateY(-1px)` + border color change, 150ms
- Input focus: Border color + box-shadow glow, 150ms
- Toggle switch: 200ms, `cubic-bezier(0.4, 0, 0.2, 1)`, background slides
- Checkbox: Checkmark draws in (SVG stroke-dashoffset), 200ms
- Modal: Scale 0.97 → 1 + opacity, 150ms ease-out
- Toast: Slide up from bottom + fade, 250ms ease-out
- Dropdown: Fade + slight translateY(-4px → 0), 100ms
- Tab underline: Slide horizontally, 150ms
- Skeleton: Shimmer `background-position` animation, 1.5s infinite linear

**Scroll Behaviors:**
- Smooth scroll globally: `scroll-behavior: smooth`
- Sticky headers: `position: sticky`, no jump, shadow appears on scroll (`box-shadow` transition)
- Back to top: Appears after 500px scroll, fade in 150ms

## 8.2 Responsive Behavior Matrix

| Page | Desktop (1280px+) | Tablet (768-1279px) | Mobile (<768px) |
|------|-------------------|---------------------|-----------------|
| Landing | Full layout | 2-col grids → 1-col | Stacked, hamburger nav |
| Feed | 65/35 two-col | Single col, sidebar bottom | Single col, no sidebar |
| Profile | Full tabs + 2-col overview | Tabs scrollable | Tabs dropdown, stacked |
| Marketplace | 2-col with sticky sidebar | Sidebar collapsible | Filters bottom sheet |
| Workspace | 3-panel layout | 2-panel, sidebar collapsible | Single panel, bottom nav |
| Flowchart | Canvas + sidebar | Canvas full, sidebar modal | Canvas only, detail modal |

## 8.3 Accessibility Requirements

- **Color contrast:** All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- **Focus indicators:** Visible focus rings on all interactive elements (2px offset, `--accent`)
- **Keyboard navigation:** All features accessible via keyboard. Tab order logical. Escape closes modals/dropdowns.
- **Screen readers:** Semantic HTML, ARIA labels on icon buttons, live regions for notifications.
- **Motion:** `prefers-reduced-motion` disables all animations.
- **Text sizing:** Supports 200% browser zoom without horizontal scroll.
- **Alt text:** All images have descriptive alt text. Decorative images have empty alt.

## 8.4 Image & Asset Guidelines

**Avatars:**
- Format: WebP with JPG fallback
- Sizes: 96px, 64px, 48px, 40px, 32px (srcset)
- Lazy loaded below fold

**Project Thumbnails:**
- Aspect ratio: 16:9
- Format: WebP
- Max width: 800px (display), 1600px (lightbox)
- Loading: Blur-up placeholder (tiny base64)

**Icons:**
- Source: Lucide React (tree-shakeable)
- Stroke width: 1.5px
- No custom icons unless absolutely necessary

**Screenshots (Marketing):**
- Must be actual UI screenshots, not mockups
- Dark mode only for consistency
- Slight perspective allowed (max 5deg rotateX)

---

# PART NINE: STATE MACHINES & USER FLOWS

---

## 9.1 Authentication Flow
```
Landing → Sign Up → Onboarding (4 steps) → Feed
       → Log In → Feed (if onboarding complete)
                → Onboarding (if incomplete)
```

## 9.2 Project Creation Flow
```
Feed/Profile → "New Project" → Creation Form (10 sections) → Preview → Publish → Project Detail
```

## 9.3 Marketplace Matching Flow
```
Creator: Post Project → AI Parse → Review → Publish → View Matches → Invite Builders → Contract → Workspace
Builder: Browse → Apply / Get Invited → Accept → Contract → Workspace
```

## 9.4 Workspace Flow
```
Contract Signed → Workspace Created → Tasks Assigned → Code Commits (auto-tracked) → Reviews → Completion → Review/Rating
```

## 9.5 Breakdown Flow
```
New Project Idea → Decomposition Input → AI Analysis → Flowchart Generated → Execute Tasks → Track Progress → Complete
```

---

# PART TEN: PERFORMANCE & IMPLEMENTATION NOTES

---

## 10.1 Performance Budget

- **First Contentful Paint (FCP):** < 1.2s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **First Input Delay (FID):** < 100ms
- **Bundle size (initial):** < 200KB gzipped (JS)
- **API response time (p95):** < 200ms

## 10.2 Loading Strategies

- **Route-level:** Code splitting by route (React.lazy + Suspense)
- **Component-level:** Heavy components (charts, editor, flowchart) loaded on demand
- **Data:** React Query / SWR with stale-while-revalidate
- **Images:** Next.js Image component with blur placeholder
- **Fonts:** `font-display: swap`, preload Geist and Geist Mono

## 10.3 Error Boundaries

- **App-level:** Fallback to "Something went wrong" page with reload button
- **Route-level:** Section error states (try again)
- **Component-level:** Graceful degradation (e.g., chart fails → show table)

## 10.4 Offline Support

- **PWA:** Service worker for caching static assets
- **Offline page:** "You're offline. Some features are unavailable."
- **Queue:** Form submissions queued and sent when back online

---

# APPENDIX: COMPLETE PAGE INVENTORY

| # | Page Name | Route | Layer | Phase | Auth Required |
|---|-----------|-------|-------|-------|---------------|
| 1 | Landing | `/` | Marketing | Pre-launch | No |
| 2 | Sign Up | `/sign-up` | Auth | Phase 1 | No |
| 3 | Login | `/login` | Auth | Phase 1 | No |
| 4 | Onboarding | `/onboarding` | Auth | Phase 1 | Yes |
| 5 | Home Feed | `/feed` | Layer 1 | Phase 1 | Yes |
| 6 | Builder Profile | `/@[handle]` | Layer 1 | Phase 1 | No |
| 7 | Project Detail | `/project/[slug]` | Layer 1 | Phase 1 | No |
| 8 | Project Create/Edit | `/project/new`, `/project/[slug]/edit` | Layer 1 | Phase 1 | Yes |
| 9 | Leaderboards | `/leaderboards` | Layer 1 | Phase 1 | No |
| 10 | Explore | `/explore` | Layer 1 | Phase 1 | No |
| 11 | Marketplace Browse | `/marketplace` | Layer 2 | Phase 2 | No |
| 12 | Project Post | `/marketplace/post` | Layer 2 | Phase 2 | Yes |
| 13 | Marketplace Project Detail | `/marketplace/project/[id]` | Layer 2 | Phase 2 | No |
| 14 | Matching Results | `/marketplace/project/[id]/matches` | Layer 2 | Phase 2 | Yes |
| 15 | Invitations (Builder) | `/invitations` | Layer 2 | Phase 2 | Yes |
| 16 | Invitations (Creator) | `/marketplace/project/[id]/invitations` | Layer 2 | Phase 2 | Yes |
| 17 | Contract | `/contract/[id]` | Layer 2 | Phase 2 | Yes |
| 18 | Creator Dashboard | `/dashboard` | Layer 2 | Phase 2 | Yes |
| 19 | Job Preferences | `/settings/job-preferences` | Layer 2 | Phase 2 | Yes |
| 20 | Workspace Home | `/workspace` | Layer 3 | Phase 3 | Yes |
| 21 | Project Workspace | `/workspace/project/[id]` | Layer 3 | Phase 3 | Yes |
| 22 | Task Detail | `/workspace/project/[id]?task=[id]` | Layer 3 | Phase 3 | Yes |
| 23 | Code Review | `/workspace/project/[id]/code-review/[commit]` | Layer 3 | Phase 3 | Yes |
| 24 | Team Management | `/workspace/project/[id]/team` | Layer 3 | Phase 3 | Yes |
| 25 | Email Setup | `/settings/email` | Layer 4 | Phase 4 | Yes |
| 26 | Public Lookup | `/lookup` | Layer 4 | Phase 4 | No |
| 27 | Verification Center | `/settings/verification` | Layer 4 | Phase 4 | Yes |
| 28 | Breakdown Input | `/breakdown/new` | Layer 5 | Phase 5 | Yes |
| 29 | Flowchart View | `/breakdown/[id]` | Layer 5 | Phase 5 | Yes |
| 30 | Task Execution | `/breakdown/[id]/execute` | Layer 5 | Phase 5 | Yes |
| 31 | Progress Tracker | `/breakdown/[id]/progress` | Layer 5 | Phase 5 | Yes |
| 32 | Settings | `/settings` | System | Phase 1 | Yes |
| 33 | Notifications | `/notifications` | System | Phase 1 | Yes |
| 34 | Messages | `/messages` | System | Phase 1 | Yes |
| 35 | Analytics | `/analytics` | System | Phase 1 | Yes |
| 36 | Saved | `/saved` | System | Phase 1 | Yes |
| 37 | Search Results | `/search` | System | Phase 1 | No |
| 38 | Pricing | `/pricing` | System | Phase 2 | No |
| 39 | Admin Dashboard | `/admin` | System | Phase 2+ | Yes (Admin) |

---

**END OF DESIGN SPECIFICATION**
**Total Pages Defined: 39**
**Total Components Referenced: 40+**
**Total API Endpoints Referenced: 60+**
