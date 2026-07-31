# SHIPYARD — Complete Website Design Specification (Master File)

> This document contains every visual, structural, interaction, and content detail needed to recreate the Shipyard website pixel-perfect in any website builder.

---

## 1. PROJECT IDENTITY

- **Name:** SHIPYARD
- **Tagline:** "Where AI builders dock & ship"
- **Purpose:** A global ecosystem where developer vibes become live products. Builders showcase AI-assisted repositories, verify performance metrics, and match with founders paying $10k+ for proven builders. No resumes. Only code.
- **Target Audience:** AI builders/developers and tech founders
- **Color Mode:** Dark (default), Light, System toggle available

---

## 2. FONTS

- **Body Font:** Space Grotesk (weights: 300, 400, 500, 600, 700) — used for all body text, UI elements, monospace-styled terminal text
- **Display/Heading Font:** Syne (weights: 400, 600, 700, 800) — used for h1, h2, h3, brand name, section titles
- **Monospace elements:** Use font-mono for terminal text, code snippets, status labels, technical UI elements
- **Font Stack:** `'Space Grotesk', sans-serif` for body; `'Syne', sans-serif` for headings
- **Anti-aliasing:** `-webkit-font-smoothing: antialiased`

---

## 3. COLOR SYSTEM (HSL Values)

### Dark Mode (Default — `:root`)
| Token | HSL Value | Hex Approx | Usage |
|---|---|---|---|
| `--background` | `222 25% 5%` | `#0a0e1a` | Page background |
| `--foreground` | `210 20% 94%` | `#e8eaf0` | Main text |
| `--card` | `222 22% 8%` | `#111622` | Card backgrounds |
| `--card-foreground` | `210 20% 94%` | `#e8eaf0` | Card text |
| `--primary` | `183 100% 50%` | `#00e5ff` | Electric Cyan — main brand |
| `--primary-foreground` | `222 25% 5%` | `#0a0e1a` | Text on primary |
| `--secondary` | `270 60% 62%` | `#9b5de5` | Neon Purple |
| `--secondary-foreground` | `210 20% 94%` | `#e8eaf0` | Text on secondary |
| `--accent` | `142 76% 55%` | `#34d399` | Neon Green |
| `--accent-foreground` | `222 25% 5%` | `#0a0e1a` | Text on accent |
| `--muted` | `222 18% 13%` | `#1c2234` | Muted backgrounds |
| `--muted-foreground` | `215 15% 55%` | `#7a8196` | Secondary text |
| `--destructive` | `0 84% 60%` | `#ef4444` | Errors, delete actions |
| `--border` | `222 18% 15%` | `#232a3e` | Borders |
| `--input` | `222 18% 13%` | `#1c2234` | Input backgrounds |
| `--ring` | `183 100% 50%` | `#00e5ff` | Focus rings |
| `--radius` | `0.75rem` (12px) | — | Base border radius |

### Light Mode (`.light`)
| Token | HSL Value |
|---|---|
| `--background` | `210 20% 96%` |
| `--foreground` | `222 25% 10%` |
| `--card` | `0 0% 100%` |
| `--primary` | `183 100% 40%` |
| `--secondary` | `270 60% 50%` |
| `--accent` | `142 60% 40%` |
| `--muted` | `210 15% 90%` |
| `--border` | `210 15% 85%` |

### Custom Glow Tokens
| Token | Dark Mode Value |
|---|---|
| `--glow-cyan` | `0 0 30px hsl(183 100% 50% / 0.4)` |
| `--glow-purple` | `0 0 30px hsl(270 60% 62% / 0.4)` |
| `--glow-green` | `0 0 30px hsl(142 76% 55% / 0.4)` |

### Custom Gradient Tokens
| Token | Value |
|---|---|
| `--gradient-hero` | `linear-gradient(135deg, hsl(222 25% 5%) 0%, hsl(240 20% 7%) 50%, hsl(222 25% 5%) 100%)` |
| `--gradient-card` | `linear-gradient(145deg, hsl(222 22% 9%), hsl(222 22% 7%))` |
| `--gradient-primary` | `linear-gradient(135deg, hsl(183 100% 50%), hsl(200 100% 60%))` |
| `--gradient-secondary` | `linear-gradient(135deg, hsl(270 60% 62%), hsl(290 70% 55%))` |
| `--gradient-shine` | `linear-gradient(135deg, hsl(183 100% 50% / 0.1), hsl(270 60% 62% / 0.1))` |

### Sidebar Tokens
| Token | Dark | Light |
|---|---|---|
| `--sidebar-background` | `222 22% 7%` | `0 0% 100%` |
| `--sidebar-foreground` | `210 20% 80%` | `222 25% 10%` |
| `--sidebar-primary` | `183 100% 50%` | `183 100% 40%` |
| `--sidebar-accent` | `222 18% 13%` | `210 15% 90%` |
| `--sidebar-border` | `222 18% 15%` | `210 15% 85%` |

---

## 4. CSS UTILITY CLASSES

### Neon Glow Classes
```css
.glow-cyan      { box-shadow: 0 0 30px hsl(183 100% 50% / 0.4); }
.glow-purple    { box-shadow: 0 0 30px hsl(270 60% 62% / 0.4); }
.glow-green     { box-shadow: 0 0 30px hsl(142 76% 55% / 0.4); }
```

### Text Glow Classes
```css
.text-glow-cyan    { text-shadow: 0 0 20px hsl(183 100% 50% / 0.7); }
.text-glow-purple  { text-shadow: 0 0 20px hsl(270 60% 62% / 0.7); }
```

### Gradient Text Classes
```css
.gradient-text-cyan {
  background: linear-gradient(135deg, hsl(183 100% 50%), hsl(200 100% 60%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gradient-text-purple {
  background: linear-gradient(135deg, hsl(270 60% 62%), hsl(290 70% 55%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Card Shine
```css
.card-shine {
  background: var(--gradient-card);
  border: 1px solid hsl(183 100% 50% / 0.1);
}
.card-shine:hover {
  border-color: hsl(183 100% 50% / 0.3);
  box-shadow: var(--glow-cyan);
}
```

### Noise Overlay
```css
.noise-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,...fractalNoise...");
  pointer-events: none;
  opacity: 0.4;
  border-radius: inherit;
}
```

### Canvas Dots Background
```css
.bg-canvas-dots {
  background-image: radial-gradient(circle, hsl(183 100% 50% / 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### Animations
```css
.animate-float       { animation: float 4s ease-in-out infinite; }
.animate-pulse-glow  { animation: pulse-glow 2s ease-in-out infinite; }
.wire-pulse          { stroke-dasharray: 8, 4; animation: wire-dash 1.5s linear infinite; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 15px hsl(183 100% 50% / 0.3); }
  50%      { box-shadow: 0 0 40px hsl(183 100% 50% / 0.6); }
}
@keyframes wire-dash {
  to { stroke-dashoffset: -24; }
}
@keyframes cursor-path-1 {
  0%   { transform: translate(200px, 150px); }
  25%  { transform: translate(450px, 320px); }
  50%  { transform: translate(700px, 180px); }
  75%  { transform: translate(320px, 420px); }
  100% { transform: translate(150px, 250px); }
}
@keyframes cursor-path-2 {
  0%   { transform: translate(800px, 450px); }
  30%  { transform: translate(500px, 200px); }
  60%  { transform: translate(250px, 380px); }
  80%  { transform: translate(620px, 150px); }
  100% { transform: translate(750px, 420px); }
}
```

### Tailwind Extended Keyframes
```js
marquee:         { from: { transform: "translateX(0)" }, to: { transform: "translateX(calc(-100% - var(--gap)))" } }
"marquee-vertical": { from: { transform: "translateY(0)" }, to: { transform: "translateY(calc(-100% - var(--gap)))" } }
shimmer:         { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } }
"fade-in-up":    { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } }
```

---

## 5. TAILWIND CONFIG EXTENSIONS

### Container
- Center: true
- Padding: 2rem
- Max screens 2xl: 1400px

### Border Radius
- lg: var(--radius) = 0.75rem
- md: calc(var(--radius) - 2px)
- sm: calc(var(--radius) - 4px)

### Extended Colors (Tailwind)
```
border: hsl(var(--border))
input: hsl(var(--input))
ring: hsl(var(--ring))
background: hsl(var(--background))
foreground: hsl(var(--foreground))
primary: { DEFAULT: hsl(var(--primary)), foreground: hsl(var(--primary-foreground)) }
secondary: { DEFAULT: hsl(var(--secondary)), foreground: hsl(var(--secondary-foreground)) }
destructive: { DEFAULT: hsl(var(--destructive)), foreground: hsl(var(--destructive-foreground)) }
muted: { DEFAULT: hsl(var(--muted)), foreground: hsl(var(--muted-foreground)) }
accent: { DEFAULT: hsl(var(--accent)), foreground: hsl(var(--accent-foreground)) }
popover: { DEFAULT: hsl(var(--popover)), foreground: hsl(var(--popover-foreground)) }
card: { DEFAULT: hsl(var(--card)), foreground: hsl(var(--card-foreground)) }
neon: { cyan: hsl(183 100% 50%), purple: hsl(270 60% 62%), green: hsl(142 76% 55%) }
```

### Extended Background Images
```
gradient-primary:   linear-gradient(135deg, hsl(183 100% 50%), hsl(200 100% 60%))
gradient-secondary: linear-gradient(135deg, hsl(270 60% 62%), hsl(290 70% 55%))
gradient-card:      linear-gradient(145deg, hsl(222 22% 9%), hsl(222 22% 7%))
gradient-shine:     linear-gradient(135deg, hsl(183 100% 50% / 0.08), hsl(270 60% 62% / 0.08))
```

### Extended Font Families
```
sans: ["Space Grotesk", "sans-serif"]
display: ["Syne", "sans-serif"]
```

---

## 6. GLOBAL STYLES

- All elements get `@apply border-border`
- Body gets `@apply bg-background text-foreground` + Space Grotesk font + antialiased
- h1, h2, h3 use Syne font

---

## 7. PAGES AND ROUTES

| Route | Page Component | Auth Required | Description |
|---|---|---|---|
| `/` | Index | No | Landing/home page |
| `/login` | Login | No (redirects if logged in) | Auth terminal-style login |
| `/auth/callback` | AuthCallback | No | OAuth callback handler |
| `/dashboard` | Dashboard | Yes | Builder dashboard |
| `/projects` | Projects | No | Project marketplace listing |
| `/projects/:id` | ProjectDetail | No | Individual project detail |
| `/post-project` | PostProject | No | Multi-step project posting form |
| `/builder/:username` | BuilderProfile | No | Public builder profile |
| `/profile-preview` | ProfilePreview | No | Profile preview page |
| `*` | NotFound | No | 404 page |

### Route Transitions
- All pages wrapped in `AnimatePresence mode="wait"` with `motion.div`
- Transition: `initial={{ opacity: 0, y: 12 }}` → `animate={{ opacity: 1, y: 0 }}` → `exit={{ opacity: 0, y: -12 }}`
- Duration: 0.25s, easeOut

---

## 8. LANDING PAGE STRUCTURE (Index.tsx)

The landing page is a single long-scroll page with these sections in order:

### 8.1 Navbar (Fixed, Floating)
- **Position:** Fixed top, centered horizontally
- **Positioning:** `top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50`
- **Style:** Rounded-full, `border border-white/10 bg-card/60 backdrop-blur-xl`
- **Shadow:** `shadow-[0_8px_32px_rgba(0,0,0,0.5)]`
- **Layout:** Flex row, justify-between, items-center, px-6 py-3.5

**Left section:**
- Logo: Zap icon in a circle (`w-8 h-8 rounded-full bg-gradient-primary glow-cyan`) + "SHIPYARD" text (Syne font, font-black, text-xl, gradient-text-cyan)
- Live Badge (hidden on mobile): Green pulsing dot + "2,482 Live" text

**Center section (desktop only):**
- Nav links: Builders, Projects, Hire, Discover
- Style: text-sm font-semibold text-muted-foreground
- Active state: text-primary with text-glow-cyan, underline bar (after pseudo-element, h-[2px], bg-primary, w-4/5)
- Hover: text-primary with text-glow-cyan, bar slides to w-4/5

**Right section (desktop only):**
- Search button (w-8 h-8 rounded-full, bg-white/5, border-white/10)
- Theme toggle button (same style, cycles dark→light→system)
- Notifications bell with red badge "3" (w-3.5 h-3.5 rounded-full bg-primary)
- Vertical divider: w-px h-6 bg-white/10
- User avatar + name + role badge (if logged in)
- Or "Sign In" text link + "Join as Builder" CTA button (rounded-full bg-gradient-primary)

**Mobile menu:**
- Hamburger button (w-8 h-8 rounded-full bg-white/5)
- Slides in from right: 82vw max-w-sm, bg-card, border-l border-white/10
- Terminal-style with title bar (red/yellow/green dots + "~/shipyard" text)
- Terminal nav items: `> cd builders`, `#/ Builders`, `#/ Projects`, etc.
- Bottom status bar: `[~] $` + theme mode

**Command Palette (Cmd+K):**
- Modal overlay with blur backdrop
- Search input at top
- Navigate section: Dashboard, Profile, My Ships
- Pages section: Landing, Builders, Projects

### 8.2 HeroSection
- **Full viewport height** with `min-h-screen`
- **Background:** bg-canvas-dots (dotted grid pattern), hero-bg image at 3% opacity
- **Overlay:** gradient from background/50 via background/20 to background
- **Top glow:** radial gradient from primary/8 centered at top
- **Floating blobs:** primary/5 blob top-left, secondary/5 blob bottom-right

**Left Column (lg:col-span-6):**
- Badge pill: `border-primary/20 bg-primary/5 text-primary`, sparkle icon, "The Next Gen Port for Vibe Coding"
- H1: "Build. [rotating word]. Ship. Get Paid."
  - Rotating words: "Dock.", "Deploy.", "Launch.", "Ship." (3s interval)
  - Rotating word style: gradient-text-cyan text-glow-cyan
  - "Get Paid." in gradient-text-purple text-glow-purple
  - Font: Syne, font-black, text-5xl sm:text-6xl lg:text-7xl, leading-[1.05]
- Subtitle paragraph: text-muted-foreground, max-w-xl
- CTA buttons:
  - "Browse Projects →" — bg-white/10 text-white rounded-full
  - "Hire Vibe Builders" — border border-white/10 bg-white/5 rounded-full
- Stats row (3 items in grid):
  - "2,400+ AI Builders Docked" (Users icon)
  - "8,900+ Projects Shipped" (Rocket icon)
  - "1,200+ Tools in the Yard" (Sparkles icon)
  - Values use NumberTicker animation (counts up from 0)
  - Style: gradient-text-cyan, font-display font-black text-xl md:text-2xl

**Right Column (lg:col-span-6) — Interactive Terminal:**
- Rounded-2xl, border-white/15, bg-card/40, backdrop-blur-2xl, shadow-2xl
- **Terminal header:** 3 colored dots (red #ff5f56, yellow #ffbd2e, green #27c93f), "~/sandbox — bash", pulsing green "Live" indicator
- **Preset tabs:** "DeFi Swap", "AI Chat Agent", "Creator Dashboard"
  - Active: bg-primary/10 text-primary border-b-primary
  - Hover: text-white bg-white/[0.02]
- **Terminal body:** bg-black/30, font-mono text-[11px]
  - Prompt display with Terminal icon
  - Log lines appear one by one (simulated build output)
  - Line numbers on left
  - Final line "Vite dev server running" in accent color
  - Bouncing dots while running
- **Input area:** `$` prompt + text input + Run button + Reset button
  - Run: bg-primary/20 border-primary/30 text-primary

### 8.3 MarqueeSection
- Section with py-16 px-6
- Header: "Trusted by builders using" (text-xs uppercase tracking-widest text-muted-foreground)
- Infinite scrolling marquee (30s duration, repeat 3x, pause on hover)
- Tool badges (rounded-full, border-white/10, bg-white/[0.02]):
  - OpenAI (emerald→cyan gradient)
  - Supabase (amber→orange gradient)
  - Vercel (zinc gradient)
  - Stripe (indigo→purple gradient)
  - LangChain (green→teal gradient)
  - Anthropic (yellow→amber gradient)
  - Pinecone (sky→blue gradient)
  - Next.js (zinc gradient)
  - Claude (orange→red gradient)
  - Node.js (lime→green gradient)
- Each badge text uses gradient-to-r with brand colors + bg-clip-text text-transparent
- Wrapped in BlurFade animation (delay 0.1, then 0.2)

### 8.4 FeaturedBuilders
- Section id="builders", py-24 px-6
- Header:
  - Label: "Docked at Shipyard" (text-primary text-sm uppercase tracking-widest)
  - Title: "Proof over resumes. Real ships, real builders." (Syne font-bold text-3xl md:text-4xl)
  - "Real ships, real builders." in gradient-text-cyan
  - Link: "View all builders →" (text-sm text-muted-foreground hover:text-primary)
- Grid: 1 col mobile, 2 cols md, 3 cols lg, gap-4

**Builder Card (6 cards):**
- Rounded-3xl p-6, bg-gradient-to-br from-card/80 to-card/40, border-white/5
- Hover: -translate-y-1.5, border glows with color
- Mouse-following radial glow overlay (350px circle at cursor position)
- Hologram stamp background (SVG circle with "PORT DOCKED" text, rotated on hover)
- **Header:** Avatar (w-12 h-12 rounded-full, with gradient blur behind it) + green status dot + Name + ShieldCheck icon + Handle + Badge pill
- **Bio:** text-sm text-muted-foreground, line-clamp-2
- **Tech stack:** Pill tags (px-2.5 py-0.5, bg-white/5, border-white/5, text-[10px] font-mono)
- **Telemetry section:** Dark panel with commit activity bars (14 bars, varying heights and colors based on activity)
- **Footer:** Star count + Projects shipped count + "Verify Proof →" link

### 8.5 HowItWorks
- Section id="hire", py-28 px-6
- Background: bg-canvas-dots at 40% opacity
- Header: "Shipyard Assembly Line" (accent color), "Three steps to go from builder to hired." (gradient-text-cyan)

**3 Step Cards (grid-cols-1 md:cols-3):**
- Each card: rounded-3xl p-8, bg-gradient-to-br from-card/90 to-card/30
- Hover: colored glow shadow, border color brightens, -translate-y-1.5
- **Card 1 (Cyan):** Upload icon, step "01", "Dock your builds"
- **Card 2 (Purple):** Search icon, step "02", "Get discovered"
- **Card 3 (Green):** Handshake icon, step "03", "Get hired & paid"
- Each has a status bar at bottom with flow label
- Connecting SVG wires between cards (dashed gradient lines)
- Wire animation: stroke-dasharray 8,4 with wire-pulse on hover

**Big Visual Box:**
- Full width, rounded-3xl, border-white/5, bg-white/[0.01], backdrop-blur-xl
- Shows contextual content based on which step is hovered
- Terminal-style code output on right side (font-mono text-[10px])

### 8.6 FeaturedProjects
- Section id="projects", py-24 px-6
- Background: radial gradient purple at center (270 60% 62% / 0.05)
- Header: "Live Builds" (secondary color), "Products that ship. Not side-projects." (gradient-text-purple)

**Project Card (6 cards):**
- Card-shine style (rounded-2xl p-5)
- Mouse-following glow (same as Builder Card)
- **Header:** Rocket icon in gradient-shine box + Title + Builder avatar + name + Category badge
- **Description:** text-sm text-muted-foreground, line-clamp-2
- **Stack tags:** px-2 py-0.5 text-xs font-mono bg-muted
- **Footer:** Eye icon + view count + "View Details →" link
- Featured card: border-primary/25 glow-cyan, "✦ Featured" badge (gradient-primary bg)
- Click opens Dialog modal with full details

### 8.7 DiscoverFeed
- Section id="discover", py-24 px-6, bg-black/20
- Background: radial gradient purple at center
- Header: "AI Matching Core" (secondary), "Meet the Match Engine"

**Dashboard Grid (12 cols):**
- **Left (5 cols):** Match Controls panel
  - Semantic Queries panel with Cpu icon
  - 3 preset role buttons: "AI SaaS Builder", "Voice AI Engineer", "Agent Pipeline Arch"
  - Active: bg-primary/5 border-primary/30 with glow shadow
  - "Launch Custom Match Request" CTA button (rounded-full bg-gradient-primary)

- **Middle (2 cols):** Connector wire (desktop only)
  - SVG horizontal cable with gradient (purple→cyan→green)
  - Pulsing Activity icon in center circle
  - Wire-pulse animation when scanning

- **Right (5 cols):** Match Preview Area
  - **Scanning state:** Spinner, progress bar, "Scanning Git History..." text
  - **Matched state:** Full builder profile card with:
    - "MATCH FOUND" badge (accent color)
    - Vibe Score percentage (gradient-cyan text-glow-cyan)
    - Avatar, name, verified checkmark
    - Developer Specialty
    - Verified Shipped Product
    - Stack Match tags
    - Stars + Projects shipped count
    - "Open Contract" button

### 8.8 CTASection
- Section py-28 px-6
- Horizontal glow divider line at top
- Header: "Ready to change how software is built & hired?" (gradient-text-cyan)

**Two Cards (grid-cols-1 md:cols-2):**

**Card 1 — For AI Builders:**
- Rounded-3xl p-8 md:p-10
- Border-primary/20, bg-gradient-to-br from-primary/5 via-card/80 to-card/40
- Hover: shadow with primary glow, -translate-y-1
- Large Terminal icon in background (text-primary/5, 144px)
- Badge: "For AI Builders" (primary color)
- Title: "Dock your builds. Earn 100% of your vibe." (gradient-text-cyan)
- Bullet list with primary dots (font-mono text-xs)
- CTA: "Join the Yard as Builder" (rounded-full bg-gradient-primary glow-cyan)

**Card 2 — For Founders:**
- Border-secondary/20, bg-gradient-to-br from-secondary/5
- Large Compass icon in background (text-secondary/5)
- Badge: "For Founders" (secondary color)
- Title: "Match instantly. Hire based on code proof." (gradient-text-purple)
- Bullet list with secondary dots
- CTA: "Search Shipped Projects" (rounded-full bg-gradient-secondary glow-purple)

### 8.9 SiteFooter
- border-t border-border, py-12 px-6
- **Left:** Logo (w-7 h-7 rounded-lg bg-gradient-primary + Zap icon) + "Shipyard" (gradient-text-cyan) + tagline
- **Center:** Links — Builders, Projects, Hire, Discord, Twitter (hover:text-primary)
- **Right:** "© 2026 Shipyard. Built with AI."

---

## 9. LOGIN PAGE

- Full viewport, centered, bg-background
- **Background:** Grid lines (rgba(255,255,255,0.02)), radial cyan glow at top, blurred blobs

**Brand Section:**
- Logo (w-10 h-10 rounded-full bg-gradient-primary glow-cyan) + "SHIPYARD" (text-2xl gradient-text-cyan)
- Badge: "Auth Terminal · Secure Dock" (primary color, animate-pulse-glow)
- Title: "Dock back into the yard" (gradient-text-cyan)

**Terminal Auth Card:**
- Rounded-3xl, border-white/10, bg-muted/95, backdrop-blur-2xl, shadow
- Terminal title bar: 3 dots + "auth.session — bash" + green "Online" indicator
- Log area: Terminal output lines (primary for commands, muted for info, destructive for errors)
- OAuth buttons: "github.auth()" and "google.auth()" in terminal style (bg-black/40, border-white/10)
- Divider: gradient line with "or" text
- Email/password form with terminal-style labels (`$ email`, `$ password`)
- Submit button: `> auth.login()` (bg-gradient-primary glow-cyan)
- Status footer: `[~] $` + status text + cursor blink + "tls · 256"

---

## 10. DASHBOARD PAGE

### Layout
- Sidebar (hidden on mobile, visible lg:) + Main content area
- **Sidebar:** w-56, bg-muted, border-r border-border/50
  - Brand header (w-7 h-7 logo + SHIPYARD text)
  - User card (avatar + name + role)
  - Nav items: Overview, Ships, Projects, Contracts, Profile, Settings
  - Active: bg-primary/10 text-primary border-primary/20 with primary indicator bar
  - Sign Out button at bottom
  - Status bar: "[bridge] $ ... ● live"

### Top Bar
- h-14, bg-muted/80, backdrop-blur-xl
- Left: Terminal prompt `[~] $ ./activeTab` with cursor
- Right: Search, Bell (with badge "3"), divider, User avatar + name

### Overview Tab
- Welcome header with gradient-text-cyan username
- Stats grid (4 cards): Ships Docked, Active Contracts, Vibe Score, Earnings
  - Each with icon, value, sparkline mini-chart (7 bars)
- Activity feed (left col): Terminal-style event log with colored dots
- Ships grid (right col): Project cards with status badges
- Quick actions (3 cards): Dock New Ship, Builder Profile, Active Contracts

### Ships Tab
- Grid/List view toggle
- Search input + status filters (all, docked, verified, draft)
- Grid view: Cards with status badge, title, description, stack tags, actions
- List view: Table with columns for Name, Status, Stack, Views, Docked, Actions

### Contracts Tab
- Filter tabs: all, active, pending, completed, disputed
- Contract cards with status badges, milestone progress bars
- Action buttons based on status (Accept, Decline, Submit Work, Message)

### Profile Tab
- Avatar (w-20 h-20) with edit overlay
- Editable fields: name, username, bio
- Stats: Ships Docked, GitHub Stars, Vibe Score, Active Contracts
- Tech Stack (editable tag list)
- Social Links (editable)
- Identity section (email, member since, account type, GitHub)
- Recent Ships list
- Sticky save/cancel bar when editing

### Settings Tab
- Notification preferences (toggle switches)
- Appearance (Dark/Light/System buttons)
- Account info (email, member since, sign out)
- Danger Zone (delete account with confirmation)

---

## 11. PROJECTS MARKETPLACE PAGE

- Header with breadcrumb `/marketplace`
- Title: "Discover Projects" with gradient-text-cyan
- Stats: open projects count + active builders count

### Filters
- Search input (pl-9 with Search icon)
- Budget range dropdown
- Timeline dropdown
- Sort dropdown (Newest, Most Popular, Highest Budget, etc.)
- Grid/List view toggle
- Category filter pills (AI Agents, Data Engineering, DevOps, Developer Tools, Automation, Web Development)
- Each category has unique color scheme (cyan, emerald, purple, amber, pink, blue)

### Project Cards
- Rounded border, bg-muted/60, backdrop-blur-sm
- Hover: bg-muted/80, border-primary/30, glow shadow
- Briefcase icon in gradient box
- Title, time ago, category dot
- Description (line-clamp-2)
- Required skills badges
- Budget range + timeline
- Views + interest count
- "Popular" badge (flame icon, amber) if interest >= 5

### Project List View
- Horizontal row layout
- Same data but compact single-line format

---

## 12. PROJECT DETAIL PAGE

- Breadcrumb navigation
- Back button (w-8 h-8 rounded-lg)

### Main Content (2/3 width)
- Project header card (Briefcase icon, title, status badge, posted time, views)
- Share + Save buttons
- Description
- Stats grid: Budget, Timeline, Scope, Complexity
- Required Skills + Preferred Tech Stack badges
- Success Criteria box
- AI Parsed Requirements card (primary border, sparkle icon)
- AI Builder Matches list with match scores, invite buttons

### Sidebar (1/3 width)
- Creator card (avatar, name, "Project Creator" label)
- "Express Interest" CTA (gradient-primary glow-cyan)
- "Message Creator" button (disabled)
- Project metadata (category, status, visibility, created, interest)
- "Why Post on Shipyard?" tips card

---

## 13. POST PROJECT PAGE (Multi-Step Form)

- Back button + title
- 4-step progress indicator: Basics → Budget & Scope → Skills & Success → Review
  - Active: bg-primary/10 text-primary with numbered circle
  - Completed: bg-accent/20 text-accent with checkmark
  - Future: text-muted-foreground/30

### Step 0: Basics
- Project Title input
- Description textarea with "Parse with AI" button (sparkle icon)
- Character count

### Step 1: Budget & Timeline
- Budget Min/Max inputs
- Timeline (weeks) input
- Category dropdown
- Scope selector (small/medium/large toggle buttons)
- Complexity selector (low/medium/high toggle buttons)

### Step 2: Skills & Success
- Required Skills input with add/remove tags
- Preferred Tech Stack input with add/remove tags
- Success Criteria textarea
- Visibility toggle (Public/Private)

### Step 3: Review
- Summary of all fields
- AI Requirements card (if parsed)
- "Publish Project" button (gradient-primary glow-cyan)

### Right Sidebar
- Live Preview card (shows project as it's being built)
- Tips card

---

## 14. BUILDER PROFILE PAGE

- Top bar with "Back to Shipyard" link
- Profile header: Avatar (w-20 h-20), name, verified badge, handle, bio, role badge, stack tags
- Stats grid: Ships Docked, GitHub Stars, Vibe Score, Active Contracts
- Tech Stack section (tag list)
- Social Links section (GitHub, Twitter, etc. with external link icons)
- Ships list
- Identity sidebar (member since, account type, GitHub)

---

## 15. 404 PAGE

- Centered, bg-muted
- "404" (text-4xl font-bold)
- "Oops! Page not found" (text-xl text-muted-foreground)
- "Return to Home" link (text-primary underline)

---

## 16. REUSABLE COMPONENTS

### BuilderCard
- Props: id, name, handle, avatar, bio, stack[], projects, stars, badge, badgeColor (cyan|purple|green)
- Badge colors map to: bg-primary/10 text-primary, bg-secondary/10 text-secondary, bg-accent/10 text-accent
- Mouse-following glow via useCardGlow hook
- Hologram stamp SVG background
- Telemetry bars (commit activity visualization)

### ProjectCard
- Props: id, title, description, builder, builderHandle, builderAvatar, category, categoryColor, stack[], views, liveLink, featured
- Opens Dialog modal on click
- Category colors: cyan, purple, green, orange

### Dialog Modal
- Overlay: bg-black/80
- Content: max-w-lg, rounded-lg, bg-background
- Close button (X icon, absolute right-4 top-4)
- Footer with action buttons

### Button Variants
- default: bg-primary text-primary-foreground
- destructive: bg-destructive text-destructive-foreground
- outline: border border-input bg-background
- secondary: bg-secondary text-secondary-foreground
- ghost: hover:bg-accent
- link: text-primary underline

### Badge Variants
- default: bg-primary text-primary-foreground
- secondary: bg-secondary text-secondary-foreground
- destructive: bg-destructive
- outline: text-foreground

---

## 17. MAGIC UI COMPONENTS

### BlurFade
- Scroll-triggered animation (uses useInView from motion)
- Initial: opacity 0, blur(6px), offset y by 6px
- Animate: opacity 1, blur(0px), y: 0
- Duration: 0.4s, easeOut
- Configurable direction: up, down, left, right

### NumberTicker
- Animated number counter using spring physics
- Starts from 0, springs to target value
- Uses Intl.NumberFormat for locale formatting
- Spring config: damping 60, stiffness 100

### WordRotate
- Cycles through array of words
- AnimatePresence with mode="wait"
- Each word: initial opacity 0 y -50 → animate opacity 1 y 0 → exit opacity 0 y 50
- Duration between words: configurable (default 2500ms)

### Marquee
- Infinite horizontal scroll
- Configurable: reverse, pauseOnHover, vertical, repeat count
- CSS animation: marquee var(--duration) linear infinite
- Pause on hover via group-hover:[animation-play-state:paused]

---

## 18. HOOKS

### useCardGlow
- Returns: ref, handleMouseMove, handleMouseLeave
- Tracks mouse position relative to card
- Sets CSS custom properties --glow-x and --glow-y
- On leave, resets to -9999px (off-screen)

### useTheme
- Returns: theme (dark|light|system), resolvedTheme, setTheme
- Persists to localStorage key "shipyard-theme"
- Applies class to document.documentElement

### useAuth
- Returns: user, session, loading, signInWithGithub, signInWithGoogle, signOut
- Supabase OAuth with redirect to /auth/callback

---

## 19. DATA STRUCTURES

### Builder Profile
```typescript
{
  id, username, full_name, avatar_url, bio,
  stack: string[],
  social_links: Record<string, string>,
  github_username, ships_count, stars_count,
  vibe_score: number,
  role: 'builder' | 'founder' | 'admin',
  is_verified: boolean,
  created_at, updated_at
}
```

### Project
```typescript
{
  id, builder_id, title, description,
  github_repo_url, live_url, demo_video_url,
  category, category_color: 'cyan'|'purple'|'green'|'orange',
  stack: string[],
  status: 'draft'|'docked'|'verified'|'archived',
  is_featured, views_count,
  created_at, updated_at
}
```

### HireProject
```typescript
{
  id, creator_id, title, description,
  ai_parsed_requirements: {
    core_requirement, integrations, tech_stack,
    complexity, ideal_builder_type
  },
  budget_min, budget_max, budget_currency,
  timeline_weeks, category, scope, complexity,
  required_skills, preferred_tech_stack,
  success_criteria,
  status: 'draft'|'open'|'in_review'|'matched'|'closed'|'cancelled',
  visibility: 'public'|'private',
  views_count, interest_count
}
```

### Contract
```typescript
{
  id, project_id, builder_id, founder_id,
  title, description,
  status: 'pending'|'active'|'completed'|'cancelled'|'disputed',
  amount_usd, currency,
  payment_status: 'unpaid'|'escrowed'|'released'|'refunded',
  milestones: ContractMilestone[],
  started_at, completed_at, deadline
}
```

### ContractMilestone
```typescript
{
  id, title, description, amount_usd,
  status: 'pending'|'in_progress'|'submitted'|'approved'|'paid',
  due_date, completed_at
}
```

---

## 20. MOCK DATA

### Featured Builders (6)
1. Arjun Mehta (@arjun_builds) — Full-stack AI, 12 projects, 342 stars, "Top Builder" badge
2. Priya Sharma (@priya_ships) — AI automation, 9 projects, 218 stars, "Automation Pro"
3. Marcus Chen (@marcus_vibe) — ML/RAG, 7 projects, 187 stars, "AI Agent Dev"
4. Sofia Reyes (@sofiaAI) — AI SaaS, 6 projects, 156 stars, "SaaS Builder"
5. Dev Patel (@devpatel_ai) — Voice AI, 8 projects, 203 stars, "Voice AI Dev"
6. Yuki Tanaka (@yuki_forge) — Prompt engineering, 5 projects, 132 stars, "Prompt Wizard"

### Featured Projects (6)
1. AI Email Reply Agent (Arjun) — AI Agent, cyan, OpenAI/Zapier/Gmail
2. LLM Customer Support SaaS (Priya) — AI SaaS, purple, Claude/LangChain/Pinecone/Stripe
3. WhatsApp AI Assistant (Dev) — AI Automation, green, GPT-4/Twilio/Node.js
4. RAG Knowledge Base Tool (Marcus) — AI Tool, orange, GPT-4o/Qdrant/FastAPI
5. AI Content Generator SaaS (Sofia) — AI SaaS, purple, OpenAI/Supabase/Stripe/React
6. Prompt-to-App Builder (Yuki) — Dev Tool, cyan, Claude/Deno/Replicate

### Marketplace Projects (8)
1. AI Customer Support Chatbot — $5k-$12k, 4 weeks, AI Agents
2. Real-Time Data Pipeline with Kafka — $10k-$25k, 8 weeks, Data Engineering
3. RAG Knowledge Base System — $6k-$15k, 6 weeks, AI Agents
4. Voice AI Agent for Cold Outreach — $15k-$30k, 8 weeks, AI Agents
5. Cloud Cost Optimization Dashboard — $8k-$18k, 6 weeks, DevOps
6. Automated Meeting Summarizer Bot — $4k-$8k, 3 weeks, Automation
7. Internal Developer Portal — $20k-$40k, 12 weeks, DevOps
8. AI Code Review Assistant — $7k-$14k, 5 weeks, Developer Tools

---

## 21. SUPABASE CONFIG

- Tables: profiles, projects, contracts
- Auth: GitHub OAuth, Google OAuth
- Storage: avatars bucket
- RPC: increment_project_views

---

## 22. KEYBOARD SHORTCUTS

- `Cmd/Ctrl + K` — Open command palette
- `Escape` — Close command palette / notifications

---

## 23. RESPONSIVE BREAKPOINTS

- Mobile: default (< 768px)
- sm: 640px
- md: 768px (tablet)
- lg: 1024px (desktop)
- xl: 1280px
- 2xl: 1400px (max container width)

---

## 24. SHADOW SYSTEM

- Cards: `shadow-sm` (default), `shadow-2xl` (elevated)
- Navbar: `shadow-[0_8px_32px_rgba(0,0,0,0.5)]`
- Terminal: `shadow-2xl`
- Glow shadows on hover: `shadow-[0_0_30px_rgba(183,100,50,0.15)]` (cyan), similar for purple/green

---

## 25. TRANSITION SYSTEM

- Global transition: `transition-all duration-300`
- Hover lift: `hover:-translate-y-1.5`
- Scale on active: `active:scale-[0.98]`
- Scale on hover: `hover:scale-[1.02]`
- Brightness on hover CTA: `hover:brightness-110`
- Color transitions: `transition-colors duration-200`

---

## 26. ICON LIBRARY

- **Primary:** Lucide React (lucide-react)
- **Icons used:** Zap, Sparkles, Users, Rocket, Terminal, RefreshCw, Send, ArrowRight, Search, Bell, Sun, Moon, Monitor, Menu, X, LogOut, User, FolderGit2, LayoutDashboard, ChevronRight, Star, Code2, ShieldCheck, ExternalLink, Upload, Handshake, Cpu, UserCheck, Activity, Eye, Clock, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Loader2, CircleDollarSign, BarChart3, Target, Share2, AlertTriangle, BadgeCheck, Globe, Mail, Briefcase, Flame, LayoutGrid, List, Plus, Save, Image, ArrowUpCircle, AlertCircle, CheckCircle, Copy, CheckCheck, ArrowLeft, Calendar, MapPin, FileText, Settings, MessageCircle, Trash2, Pencil

---

## 27. ANIMATION PATTERNS

- **Page transitions:** Fade + slide up/down (y: 12px → 0)
- **Section reveal:** BlurFade (blur 6px + fade + slide from direction)
- **Card hover:** Translate Y -1.5, border glow, radial cursor glow
- **Number counting:** Spring physics (damping 60, stiffness 100)
- **Word rotation:** Slide up/down with AnimatePresence
- **Marquee:** Infinite horizontal scroll
- **Terminal typing:** Character-by-character at 25ms intervals
- **Progress bars:** CSS transition width
- **Status dots:** Ping animation (animate-ping)
- **Loading spinners:** animate-spin on Loader2
- **Wire pulse:** stroke-dashoffset animation

---

## 28. SPACING AND LAYOUT

- **Section padding:** py-24 to py-28, px-6
- **Container max-width:** max-w-6xl (1152px) for most sections, max-w-5xl for detail pages
- **Card padding:** p-5 to p-8 depending on context
- **Gap between cards:** gap-4 to gap-8
- **Grid gaps:** gap-3 to gap-6
- **Border radius:** rounded-full (pills), rounded-2xl to rounded-3xl (cards), rounded-lg (buttons/inputs)

---

## 29. TEXT SIZES

- Page titles: text-3xl md:text-4xl to text-5xl (Syne font-black)
- Section headers: text-2xl to text-3xl (Syne font-bold)
- Card titles: text-sm font-semibold to text-lg font-bold
- Body text: text-sm to text-base
- Small labels: text-[10px] to text-[11px] font-mono uppercase tracking-wider
- Status text: text-[9px] to text-[10px] font-mono
- Terminal text: text-[11px] font-mono

---

## 30. ICON SIZES

- Nav/inline icons: w-3.5 h-3.5 to w-4 h-4
- Card icons: w-4 h-4 to w-5 h-5
- Section icons: w-5 h-5 to w-6 h-6
- Large decorative: w-44 h-44 (at 5% opacity)
- Status dots: w-1.5 h-1.5 to w-2 h-2
- Avatars: w-7 h-7 (small), w-9 h-9 (medium), w-12 h-12 (card), w-20 h-20 (profile)

---

*End of Shipyard Master Design Specification*
