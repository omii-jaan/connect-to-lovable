# Shipyards × AI Studio — Build Package

Everything you need to build Shipyards in **Google AI Studio (Build mode)**, chunk by chunk, without losing context.

> **Track:** AI Studio Build mode (React app) + Firebase backend (Firestore + Auth). If you prefer a SQL/Postgres backend, see `DB_SCHEMA.md` (Supabase) and wire it via the Node server runtime + Secrets — the prompts stay the same.

## Files

| File | Where it goes | Why |
|------|---------------|-----|
| `KNOWLEDGE.md` | AI Studio **Chat → System instructions** (paste) | The persistent brief: product, design tokens, hard rules. Injected into every message. |
| `WORKSPACE.md` | AI Studio **Chat → System instructions** (paste, below KNOWLEDGE) | Coding standards the model must follow. |
| `AGENTS.md` | GitHub repo root (**after** git sync) | Instruction file that Build mode/any agent ALWAYS reads — your long-term memory. |
| `DB_SCHEMA_FIRESTORE.md` | Paste into Build chat when you reach Chunk 3 (data) | Firestore collections + security rules for the Firebase backend. |
| `DB_SCHEMA.md` | (Optional) If you choose Supabase/Postgres instead | SQL schema, RLS, migrations. |
| `START_PROMPT.md` | Build mode → first prompt | Bootstraps the foundation: tokens, layout shell, routing, UI primitives. ✅ already pasted |
| `BUILD_PLAN.md` | Keep open while you build | Chunk-by-chunk Layer 1 sequence with copy-paste prompts (AI Studio notes at top). |

## Setup order (do this exactly once)

1. **aistudio.google.com** → left sidebar → **Build** tab → start a new app → pick **React** (web). ✅ you're here.
2. In AI Studio **Chat** settings (separate tab): paste `KNOWLEDGE.md` then `WORKSPACE.md` into **System instructions**. ✅ done.
3. In **Build** mode chat: paste `START_PROMPT.md` → foundation app is created with live preview. ✅ done.
4. **Verify the foundation** in preview (desktop + mobile; click every route).
5. Enable **Git sync** in Build mode → put `AGENTS.md` at the repo root → keep syncing each chunk.
6. When you reach **Chunk 3** (data), paste `DB_SCHEMA_FIRESTORE.md` into the chat as the schema reference, and let the agent wire **Firebase** (it provisions Firestore + Auth automatically — approve the prompt).
7. Deploy to **Cloud Run** (Starter tier, free, up to 2 apps) when Layer 1 is shippable — or stay on the preview link for now.

## Build discipline (non-negotiable)

- **One chunk per prompt.** Verify in the preview, then move on. Never bundle two chunks.
- After each working chunk, **tag a version** (Build mode → Versions tab) so you can roll back.
- If a fix fails twice, **stop building** — ask the model to explain its plan first, or restore the last version and re-prompt.
- Keep the repo tidy: if the agent merges/renames files it shouldn't, correct it immediately with a precise prompt naming the files.
- Refresh the knowledge in Chat instructions after big structural changes (or rely on `AGENTS.md`, which is always read).

## Cost reality (plan your usage)

- AI Studio **free tier** is very generous: model requests refresh on a timer (~every 5h) with no app hosting bill during development. Build mode preview + Firebase dev usage is free at this scale.
- When you hit free limits: upgrade in AI Studio, or switch heavy model calls to the Gemini API with your own key (server-side secret in Build mode).
- **Cloud Run deploy** is free for small traffic on the Starter tier (2 apps), then pay-as-you-go — trivial for MVP scale.

## Repository files (the actual Shipyards spec)

- `../SHIPYARDS_MASTER_DOCUMENT_COMPLETE.md` — the business master doc (5 big layers, financials, phases).
- `../SHIPYARDS_COMPLETE_DESIGN_SPEC.md` — the 39-page UI blueprint + all API endpoints.
- `../design.md` — an older/alternate design system. **NOTE:** the master spec supersedes it — use `KNOWLEDGE.md` tokens (dark muted teal `#14B8A6`), NOT the cyan/purple glow style.