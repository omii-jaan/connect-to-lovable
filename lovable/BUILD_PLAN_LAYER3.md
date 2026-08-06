# BUILD_PLAN_LAYER3 — Shipyards Layer 3: Collaboration Workspace ("The Yard")

Scope: the **trust layer for the founder+builder pair**. When a contract goes active, both parties get a shared Yard for that project: milestone tracking, a shared project channel, and a deliverables handoff log. No surveillance — no keystroke/screenshot tracking, no git scraping, no timers. Only honest, explicit submissions tracked. Cut for post-MVP: Kanban boards, team roles/teams, code editor, git/Claude integrations, docs area.

Same rules as Layers 1-2: ONE chunk per message in AI Studio Build mode. After each chunk: verify in preview (desktop + mobile), fix with a small targeted prompt, tag a version, Git-sync. Collections + security rules per `lovable/DB_SCHEMA_FIRESTORE.md` (Layer 3 section). Append the QUALITY BAR to every prompt (3 view states, optimistic UI + toasts, a11y, responsive, tokens only, no gradients/glows).

Roles: **Founder** = project creator (client). **Builder** = the AI developer on the contract. Both parties = "members" of the Yard.

Routes: `/workspace` (my Yards list) · `/workspace/:contractId` (the Yard). Contract = contracts doc from Layer 2.

---

## CHUNK L3.1 — Yard foundation: workspace creation + shell [DB][UI]
When a contract becomes **active** (accepted), create the Yard automatically: `workspaces` doc {contractId, projectId, creatorUid, builderUid, status 'active', createdAt, updatedAt}. Backfill for any active contracts without a workspace (idempotent, guarded).
1) `src/lib/workspace.ts` — helpers: getWorkspaceByContract, listMyWorkspaces (via query on creatorUid/builderUid arrays), createWorkspaceIfMissing (transactional, no duplicates).
2) `/workspace` page — "My Yards": two lists (As founder / As builder), contract cards (project title, other party, status, progress ring from milestones if any, member avatars), empty state ("No active projects yet — when a contract starts, your Yard opens here"), link to each Yard.
3) `/workspace/:contractId` — Yard shell: header (project title + other party + status chip + progress %), three tabs: **Milestones** | **Channel** | **Deliverables** (placeholders until L3.2-3.4). Access check: only the two contract parties.
4) Rules: `workspaces` read/write = creatorUid or builderUid. Deploy rules.
Sidebar: add Workspace (/workspace) nav item (icon: Activity or Terminal). Guest pass: login-gated, redirect to /login with return.

## CHUNK L3.2 — Milestone tracking [DB][UI]
Milestones live ON the contract: `contracts.milestones[]` = [{id, title, description, dueDate, status 'pending'|'in_progress'|'done', completedAt}]. Backfill: active contracts get a default milestone ("Project kickoff") if milestones is empty.
1) Milestones tab: list of milestone cards (title, description, due chip, status), progress bar (done/total) + % at top; founder can add/edit/remove milestones (before they're 'done' — locked once done); builder can mark status pending → in_progress → done ("Request completion"). Founder **confirms** completion (done → confirmed): only confirmed milestones count toward progress.
2) Notifications wired: milestone added, marked in_progress, completion requested, confirmed — with deep link to /workspace/:contractId.
3) Rules: contracts write restricted to either party (already), milestones field updates allowed for both (founder edits structure, builder flips status). Deploy.
4) Empty + loading + error states; optimistic updates + toasts.

## CHUNK L3.3 — Shared channel (the Yard chat) [DB][UI]
Realtime project-bound chat, separate from /messages.
1) `workspaceMessages` {workspaceId, senderUid, content, createdAt, readBy[]} — onSnapshot subscription, newest-last, grouped by day, sender chips (Founder/Builder role color via accent), sticky composer (enter to send, shift+enter newline), optimistic send, scroll-to-bottom button.
2) Unread badge on the Channel tab + Workspace nav item; messages push a notification only if the other party is offline (skip if they were online within last minute — keep it simple: notify always except self; dedupe deterministic id).
3) Rules: read/write = member of the workspace (creatorUid/builderUid from workspaces doc). Deploy. Cleanup subscription on unmount.

## CHUNK L3.4 — Deliverables handoff [DB][UI]
Explicit submission log — the builder's proof of work, founder's acceptance.
1) `workspaceDeliverables` {workspaceId, submitterUid, title, description, links[] (URLs), status 'submitted'|'accepted'|'revision_requested', revisionNote, submittedAt, reviewedAt}.
2) Deliverables tab: builder → "Submit deliverable" (title, description, 1-3 links); list of submission cards with status chips; founder → **Accept** (→ notification + contract completes when ALL milestones confirmed AND last deliverable accepted: contract status 'completed', post status 'completed', ratings unlock per L2.6) or **Request revision** (with note → notification, builder resubmits).
3) Wire the completion handshake: final milestone confirmed + all deliverables accepted → contract 'completed' + notification to both + ratings unlocked (reuse L2.6 flow).
4) Rules: read/write = workspace member; submitter writes, founder reviews. Deploy.

## CHUNK L3.5 — Yard polish + checkpoint [ALL]
1) Notifications audit: milestone events, channel messages, deliverable submit/accept/revision, contract completed — all fire, no self-notifications, dedupe ids, deep links correct.
2) Security walk: workspaces, workspaceMessages, workspaceDeliverables against DB_SCHEMA_FIRESTORE.md; deploy rules; lint.
3) Guest pass: /workspace + Yard fully auth-gated with redirect.
4) Responsive + a11y QA sweep (same checklist as Layer 1 pile 18): mobile tabs, touch targets, keyboard nav, contrast, reduced-motion.
5) Seed: for @demo — 1 active contract with 2 milestones (1 confirmed, 1 in progress), 3 channel messages, 1 submitted deliverable; 1 completed contract with accepted deliverables (ratings already exist from L2.7).
6) Final checkpoint: guest + authenticated passes, console clean, tag version, Git-sync.

---

## APPENDIX — QUALITY BAR (append to every chunk prompt)

End this prompt with:

```text
QUALITY BAR — all of the following must hold:
- 3 view states everywhere: loading (skeleton), empty (helpful message + CTA), data.
- Optimistic UI updates + success/error toasts for every mutation (sonner).
- Error state with retry for any Firestore read that can fail.
- Keyboard navigable (focus rings, Escape closes modals, Enter submits forms).
- ARIA labels on icon-only buttons; semantic HTML.
- Responsive: mobile-first, works ≥360px width, no horizontal overflow, touch targets ≥40px.
- Design tokens only (CSS variables); NO gradients, glows, glass, or drop shadows in dark UI.
- Lucide icons stroke 1.5px, no emoji in the UI, numeric data uses tabular-nums.
- No unused imports, no console.log, TypeScript strict, no `any`.
- One component per file, small components, no code comments.
- Firestore rules updated + deployed for any new/changed collections in this chunk.
- No fake/mock data except the explicit seed step — real collections, real auth.
```

