# WORKSPACE KNOWLEDGE — Global Engineering Standards

These rules apply to every project built in this workspace. They are always in context. Follow them strictly.

## Code quality
- **TypeScript strict.** Never use `any`. Define types/interfaces for all data shapes; derive them from the database schema where possible.
- **One component per file.** Files in `src/components/` mirror pages (e.g. `ProjectCard.tsx`, `ProfileHeader.tsx`). Pages live in their own folder/file. Keep components small (<200 lines); split children.
- **Naming conventions:**
  - React components & files: `PascalCase.tsx`
  - Hooks: `useXxx` (e.g. `useAuth`, `useProjects`)
  - Utilities & lib files: `camelCase.ts`
  - Database tables/columns: `snake_case`; tables plural.
  - CSS classes: Tailwind utilities only; custom classes with `prefix-` if absolutely needed.
- **No dead code.** Remove unused imports, variables, files. Run a cleanup pass at the end of each session.
- **No console.log in production code.** Use a small `lib/logger` wrapper if logging is needed.
- **Comments:** minimal; only when a decision is non-obvious. Do not add decorative comments.

## Styling
- **Tailwind CSS only**, combined with the design tokens as CSS custom properties (defined once in `src/index.css` / theme file).
- NEVER invent new colors, radii, fonts, or shadows beyond the token set. Refer to project knowledge for tokens.
- No inline `style={{ }}` for colors/layout except dynamic values (e.g. progress width).
- Icons: Lucide only (`lucide-react`), stroke 1.5px. No emoji in UI.
- Responsive-first: mobile base, then `sm`/`md`/`lg` breakpoints (640/768/1024/1280). Test in the preview device toggle before marking a chunk done.
- Motion: use the token durations (100/150/250/350ms) and `cubic-bezier(0.4,0,0.2,1)`. Honor `prefers-reduced-motion`.

## Data & backend
- Backend = **Firebase** (Firestore + Firebase Auth + Firebase Storage + security rules). Never assume Postgres/Supabase; the Firestore track is the only active track.
- **Security rules enabled on every collection.** When a collection is created, write its rules in the same prompt. Default: public read for content collections; writes restricted to the authenticated owner (creator/participant). Deploy rules after every schema change.
- Use the Firebase SDK (`firebase/app`, `firebase/firestore`, `firebase/auth`, `firebase/storage`). No raw REST calls in components. Complex queries/transforms go in `src/lib/` helpers.
- Server-side logic that needs secrets or cross-user computation (AI calls, matching, emails, payments) goes in the **AI Studio Node backend** (`server.ts`, exposed as `/api/*`). Keep secrets server-side, never in frontend code.
- Real-time: use Firestore `onSnapshot` subscriptions for chat, notifications, feeds, live counts. Clean up subscriptions on unmount (avoid leaks).
- Follow the schema in project knowledge / `DB_SCHEMA_FIRESTORE.md`. When a schema change is needed, describe it in chat and let the build run the change with approval; update the schema doc in the same change.
- Seeding: sample data should be realistic and flagged as sample (a `is_sample` flag) so it can be wiped later.
- Firebase integration must be approved/kept when the AI Studio agent offers it; the Firebase project id is `light-coral-nds98`.

## Process (how to work with this workspace)
- One change per prompt. Verify in preview; bookmark working versions.
- When asked to fix a bug: reproduce, identify the specific component/line, fix only that, don't refactor unrelated code.
- When a task is ambiguous, ask clarifying questions in Plan mode before editing.
- Preserve what exists: never rewrite working code "for cleanliness" unless explicitly asked.
- Keep routes/imports stable: if renaming a component, update ALL imports in the same change.
- Accessibility: visible focus rings, aria-labels on icon buttons, semantic HTML, keyboard navigable, 4.5:1 contrast.
- Performance: lazy-load heavy components (charts, editors), paginate lists, memoize expensive renders, keep bundle lean.
- Google AI Studio Build mode: this workspace runs in Build mode with an attached GitHub repo. After each chunk: verify desktop + mobile in the preview, fix small issues with targeted prompts, then tag a version and Git-sync.

## Design guardrails (workspace-wide)
- Dark mode first. No glow/gradient/shadow effects for decoration. No glassmorphism except specified (top bar). No rounded corners over 12px except avatars/badges.
- Copy: professional, precise, developer-friendly. No "vibe" marketing speak in the app UI.

## QUALITY BAR (mandatory for every chunk)
Every build chunk MUST satisfy all of the following, without exception. This is a hard checklist, not a suggestion:
- 3 view states everywhere: loading (skeleton), empty (helpful message + CTA), data.
- Optimistic UI updates + success/error toasts for every mutation (sonner).
- Error state with retry for any Firestore read that can fail.
- Keyboard navigable (focus rings, Escape closes modals, Enter submits forms).
- ARIA labels on icon-only buttons; semantic HTML.
- Responsive: mobile-first, works ≥ 320px width, no horizontal overflow, touch targets ≥ 40px.
- Design tokens only (CSS variables); NO gradients, glows, glass, or drop shadows in dark UI.
- Lucide icons stroke 1.5px; no emoji in the UI; numeric data uses tabular-nums.
- No unused imports, no console.log, TypeScript strict, no `any`.
- One component per file; small components; no code comments.
- Firestore security rules updated + deployed for any new/changed collections in the same chunk.
- No fake/mock data except the explicit seed step — real collections, real auth.