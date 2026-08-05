# BUILD_PLAN_LAYER2 — Shipyards Layer 2: Project Marketplace (one chunk per prompt)

Same rules as Layer 1: ONE chunk per message in AI Studio Build mode. After each chunk: verify in preview (desktop + mobile), fix with a small targeted prompt, tag a version, Git-sync. Firestore collections + security rules per `lovable/DB_SCHEMA_FIRESTORE.md` (Layer 2 collections already secured in the rules audit). Append the QUALITY BAR to every prompt (states, optimistic UI, a11y, responsive, tokens).

Roles: **Founder** = someone posting paid work. **Builder** = the AI developer applying/invited.

---

## CHUNK L2.1 — Marketplace post + listing + detail [UI][DB]
Build the founder flow to post work and the public marketplace to browse it.
1) Post page/modal "Post a project": title, category (reuse project categories + "Full App / Product"), description (markdown), requirements (key needs list), budget (type: Fixed / Hourly / Range + min + max + currency), timeline start/end, skills multiselect, techStack tags, complexity (Low..Critical), teamSize, remote toggle, NDA toggle, visibility (Public / Invite-only), featured checkbox (mock). Publish → insert into marketplaceProjects (slug unique from title) with status='open', creatorUid = auth uid.
2) /marketplace listing: grid of open projects (budget chip, category, skills, timeline), filters (category, budget range, skills, remote), sort (Newest / Budget / Timeline). Cards link to detail.
3) /marketplace/:slug detail: full requirements, budget + timeline meta bar, creator row, skills/stack badges, "Apply" button (auth-gated; founders can't apply to own post), "Invite builders" button (owner only — builds in L2.4).
Guest pass: guests can read everything; Apply prompts sign-in.

## CHUNK L2.2 — AI Match engine (server-side) [DATA]
The matching engine — compute in a server-side Node function (never in browser), per the spec formula: past similar projects +30, tech-stack match +25, availability +20, budget history +15, model/style fit +10 → clamp 0-100.
1) Server function (AI Studio Node backend / Cloud Function): takes marketplaceProjectId, fetches all eligible builders (profiles with availability != not_available), computes matchScore per builder with a component breakdown {pastSimilar, stack, availability, budget, style}, stores top matches on the post doc (marketplaceProjects.matches[] = {builderUid, score, breakdown}) or in a marketplaceMatches collection.
2) On the post detail page (owner view only), show "Top Builder Matches": ranked list with score + breakdown bars + "Invite" button (writes to invitations, L2.4).
3) On builder side: "Projects for you" section on /marketplace — posts where my matchScore is computed (fetch my score from the post's matches array if present).
Seed: make the 8 seeded builders matchable (availability set, projects for pastSimilar).

## CHUNK L2.3 — Applications [DB][UI]
Builder applies: "Apply" modal on post detail — pitch (max 500 chars), relevant project links, proposed rate (optional). Creates applications doc {marketplaceProjectId, builderUid, pitch, links[], proposedRate, status 'pending', createdAt}. Founder sees "Applicants" panel on their post (owner only): list with builder mini-card + my match score (from L2.2 matches) + Accept / Reject. Accept → status 'accepted' + notification to builder + create contracts draft (L2.5). Reject → status 'rejected' + notification. Builder sees their applications (status list) on a "My Applications" section in /marketplace. Rules: applications read = applicant or post owner; write = applicant.

## CHUNK L2.4 — Invitations [DB][UI]
Founder invites from matches or any profile: "Invite" → invitations doc {marketplaceProjectId, founderUid, builderUid, message (optional), status 'pending', createdAt} + notification to builder. Builder: sees invite in /notifications (link to post) + a "My Invites" section; Accept / Decline. Accept → applications-like path: contract draft created (L2.5), post status moves toward in_progress, notification to founder. Rules: invitations read = invitee or founder; write = founder create, invitee update.

## CHUNK L2.5 — Contracts [DB][UI]
On accept (from application OR invitation): create contracts doc {marketplaceProjectId, founderUid, builderUid, terms {budgetType, budgetMin, budgetMax, currency}, status 'active', startedAt, completedAt (null), milestones[] (optional stub), ratingStatus {founder: bool, builder: bool}}. Post status → 'in_progress'.
UI: "My Contracts" page for both roles (founder sees outbound, builder sees inbound): contract cards (post title, other party, budget, status, actions). Founder action: "Mark as complete" → status 'completed', post status 'completed', unlock ratings (L2.6). Rules: read/write = either party.

## CHUNK L2.6 — Ratings [DB][UI]
After completed: both parties rate 1-5 + short comment, role ('founder'|'builder') on ratings doc {contractId, raterUid, rateeUid, score, comment, role, createdAt}. Show: rating averages on builder profiles (new "Reviews" tab content — replace the "Coming in a later step" empty state on the Reviews tab) and founder rating on their marketplace posts. Count ratings into the Reviews tab list (recent 5 + average). Rules: create = contract party once (enforce one per role via doc id contractId_role), read public. Wire notifications on rating received.

## CHUNK L2.7 — Layer 2 polish + checkpoint [ALL]
1) Notifications audit: apply received, invite received, accept/reject, contract updates, rating received — all fire, no self-notifications, dedupe pattern.
2) Security review: walk marketplaceProjects, applications, invitations, contracts, ratings, marketplaceMatches against DB_SCHEMA_FIRESTORE.md; deploy rules.
3) Guest pass: marketplace browseable logged-out; all actions auth-gated with redirect.
4) Responsive + a11y QA sweep of all new pages (same checklist as Layer 1 pile 18).
5) Seed polish: 2-3 founder accounts with open posts, 1 completed contract with ratings for the demo builder.
6) Final checkpoint: guest + authenticated passes, console clean, tag version, Git-sync.
```
