# AGENTS.md — Shipyards (AI Agent Instructions)

This file guides any AI agent (Google AI Studio, Cursor, Claude Code, opencode, etc.) working in this repository.

## Project
Shipyards — the professional identity platform for AI builders ("LinkedIn for AI developers"). React + TypeScript + Tailwind (Vite), built in **Google AI Studio Build mode**, backend on **Firebase** (Firestore, Firebase Auth, security rules). Dark mode, muted-teal accent (#14B8A6) design. MVP covers Layers 1-3: **Discovery & Showcase**, **Project Marketplace**, **Collaboration Workspace**. Layer 1 is the active build.

## Always follow
1. Read `lovable/KNOWLEDGE.md`, `lovable/WORKSPACE.md`, `lovable/BUILD_PLAN.md`, and `lovable/PROGRESS.md` in this repo before making changes — they are the project memory and global standards.
2. Use the design tokens as CSS variables (defined in the theme: `--bg-base`, `--accent`, etc.). Never invent colors/fonts/shadows. No gradients, glows, glass, or drop shadows in dark UI unless the design spec explicitly says so.
3. Backend = **Firebase**: Firestore collections + Firebase Auth + security rules per `lovable/DB_SCHEMA_FIRESTORE.md`. Every collection needs security rules (public read where needed; writes restricted to the authenticated owner). Approve Firebase integration when offered.
4. Secrets never go in frontend code — use Firebase secret management / backend env.
5. Components: one per file, PascalCase, small. Pages in page folders. Keep existing imports/routes stable; when renaming, update all references in the same change.
6. Icons: Lucide (`lucide-react`), stroke 1.5px. No emoji in the UI.
7. Numeric data uses `tabular-nums`; body text max 65ch lines.

## Build status & order
The build is executed chunk by chunk, one component per prompt, per `lovable/BUILD_PLAN.md` (Chunk 1 Auth + Onboarding ✅, Chunk 2 Builder Profile ✅, Chunk 3 = projects data model, then 4-12). Track progress in `lovable/PROGRESS.md`. Do not implement unreleased later layers (4: email identity, 5: smart breakdown) until the build plan reaches them.
- **Layer 1 (Discovery & Showcase) ✅ COMPLETE** — 12 chunks + pile, verified.
- **Layer 2 (Project Marketplace) ✅ COMPLETE** — 7 chunks (post → AI match → apply → invite → contract → rating → checkpoint), plan in `lovable/BUILD_PLAN_LAYER2.md`.
- **Layer 3 (Collaboration Workspace) — next** — plan from `lovable/BUILD_PLAN_LAYER3.md` once written.

## Repository layout
- **Canonical repo: `omii-jaan/05july26-wc`** — the live AI Studio workspace and Git-sync target. All builds and memory updates land there.
- `omii-jaan/connect-to-lovable` is now **archived/stale** — contains the older Firestore export with Supabase remnants; reference only, do not push to it.
- `lovable/` — the build package (knowledge, schema, plan, progress). Keep it authoritative and up to date.
- Root documents `SHIPYARDS_*.md` — the original specs. They are reference; the files in `lovable/` are the working truth.
- `src/` — application code.
- The old Supabase app in this repo's history is **reference only** — do not reuse its backend code; Firestore is the active backend.

## Workflow rules
- Before large work, propose a plan instead of editing immediately.
- After finishing a change, verify it renders in the preview (desktop + mobile), fix with small targeted prompts or annotation mode, then tag a version and Git-sync.
- Never tag/deploy a version that wasn't tested for unauthenticated visitors (public pages) and authenticated flows.
- Do not remove sample data seeding until the product is ready for real data.
- Keep `lovable/KNOWLEDGE.md`, `lovable/PROGRESS.md`, and this doc synchronized with the schema.

## Definition of done
- Feature works end to end (UI + data + auth where relevant + security rules).
- Runs clean: no lint/type errors, no console errors, no unused imports.
- Responsive on mobile/desktop, keyboard navigable, reduced-motion respected.
- Version tagged / committed with a concise message.
