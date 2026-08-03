# DB_SCHEMA_FIRESTORE — Shipyards on Google AI Studio (Firebase)

Use this instead of `DB_SCHEMA.md` when your AI Studio app runs on the **native Firebase backend** (Firestore + Firebase Auth). Firestore is a NoSQL document store: no SQL joins, no RLS — security rules instead. Collections below mirror the original SQL schema 1:1 so nothing in the spec is lost.

## Conventions
- Every document: `id` (auto), `createdAt` (server timestamp).
- User id = Firebase Auth uid. Store `uid` on every user-created doc.
- Counts (likesCount, commentsCount, followersCount) are stored ON the document and updated with atomic increments (increment()).
- Lists like `skills`, `techStack`, `modelsUsed` = array fields (queryable with array-contains).

## COLLECTIONS — Layer 1

### `profiles` (doc id = uid)
`handle` (unique — enforce by storing `handles/{handle}` doc), `displayName`, `avatarUrl`, `bio`, `role` ('builder'|'creator'|'both'), `location`, `website`, `joinedAt`, `skills[]`, `modelsUsed[]`, `experienceLevel`, `availability` ('available'|'busy'|'not_available'), `reputationScore`, `followersCount`, `followingCount`

### `handles` (helper collection for uniqueness)
`handle` (doc id) → `{ uid, createdAt }` — write via transaction with profiles create/rename.

### `projects` (doc id = auto)
`slug`, `ownerUid`, `title`, `description` (markdown), `category`, `media[]` ({type,url}), `thumbnailUrl`, `techStack[]`, `modelsUsed[]`, `metrics[]` ({label,value}), `githubUrl`, `demoUrl`, `difficulty`, `timeToBuild`, `costEstimate`, `visibility` ('public'|'unlisted'|'draft'), `likesCount`, `commentsCount`, `sharesCount`, `createdAt`

### `projectLikes` (like: one doc per like, id = `${projectId}_${uid}`)
`projectId`, `uid`, `createdAt` — write deletes doc, decrements likesCount (transaction).

### `projectComments`
`projectId`, `uid`, `parentId` (null = top-level, else reply — 1 level), `content`, `createdAt`, `editedAt` — write increments project.commentsCount; delete decrements.

### `projectBookmarks`
`uid`, `projectId`, `createdAt`

### `follows` (id = `${followerUid}_${followeeUid}`)
`followerUid`, `followeeUid`, `createdAt` — transaction updates both profiles' counts.

### `notifications`
`uid` (recipient), `actorUid`, `type` ('like'|'comment'|'follow'|'invite'|'milestone'|'system'), `link` (route), `payload{}`, `read` (bool), `createdAt`

### `waitlist`
`email`, `source`, `createdAt` (no auth — allow create rule)

## COLLECTIONS — Layer 2 (Marketplace)

### `marketplaceProjects`
`slug`, `creatorUid`, `title`, `description`, `requirements{}` (parsed by Gemini: keyNeeds[], suggestedStack[], complexity, idealProfile), `budgetType` ('Fixed'|'Hourly'|'Range'), `budgetMin`, `budgetMax`, `currency`, `timelineStart`, `timelineEnd`, `skills[]`, `techStack[]`, `complexity`, `teamSize`, `remote`, `nda`, `status` ('open'|'in_progress'|'completed'|'closed'), `visibility`, `featured`, `viewsCount`, `createdAt`

### `applications`
`projectId`, `builderUid`, `coverLetter`, `proposedBudget`, `estimatedTimeline`, `relevantProjectIds[]`, `status` ('applied'|'accepted'|'declined'|'withdrawn'), `createdAt`

### `invitations`
`projectId`, `builderUid`, `senderUid`, `message`, `matchScore`, `reasons[]` ({text,icon}), `status` ('pending'|'accepted'|'declined'|'expired'), `sentAt`, `respondedAt`, `expiresAt`

### `contracts`
`projectId`, `builderUid`, `creatorUid`, `status` ('draft'|'sent'|'accepted'|'active'|'completed'|'disputed'), `terms{}` (scope, deliverables[], revisions, termination), `milestones[]`, `payment{}`, `signedByBuilder`, `signedByCreator`

### `ratings`
`projectId`, `raterUid`, `rateeUid`, `score` (1-5), `comment`, `role` ('client'|'builder'), `createdAt`

## COLLECTIONS — Layer 3 (Workspace)

### `workspaces` — `contractId`, `name`, `status` ('active'|'completed'), `memberUids[]`
### `workspaceMembers` — `workspaceId`, `uid`, `role` ('owner'|'admin'|'builder'|'viewer')
### `workspaceTasks` — `workspaceId`, `assigneeUid`, `title`, `description`, `column` ('backlog'|'in_progress'|'review'|'done'), `priority` ('low'|'medium'|'high'|'critical'), `dueDate`, `sortOrder`, `completedAt`
### `taskComments` — `taskId`, `uid`, `content`, `createdAt`
### `workspaceMessages` — `workspaceId`, `senderUid`, `content`, `threadId` (null = general), `createdAt` (use onSnapshot for realtime)
### `workspaceFiles` — `workspaceId`, `uploaderUid`, `name`, `url`, `size`, `mimeType`, `createdAt`
### `workspaceCommits` — `workspaceId`, `sha`, `message`, `author`, `url`, `createdAt` (server-imported, read-only)

## Security Rules (replaces RLS)
- `profiles`, `projects`, `marketplaceProjects` (public docs): `read: true`, `write: auth != null && request.auth.uid == uid/ownerUid`.
- `handles`: create only, checked against existing.
- `projectLikes`/`projectBookmarks`/`follows`/`notifications`: `write: auth != null`, `read: true` (or owner-only for notifications).
- `applications`/`invitations`/`contracts`: read = involved parties (projectId owner, builderUid, senderUid), write = involved.
- `workspace*`: read/write = member of workspace (check memberUids or workspaceMembers).
- `waitlist`: `create: true`; read/write: false.

## Realtime (Layer 1 needs)
Subscribe via `onSnapshot` on: `projects` (feed), `projectComments` (per project), `notifications` (per user), `workspaceMessages` (per workspace), `projectLikes` (count refresh).

## Matching formula (unchanged from spec)
matchScore = past similar projects +30, tech-stack match +25, availability +20, budget history +15, model/style fit +10 → clamp 0-100. Compute in a **server-side Node runtime function** (or Gemini call), never in browser.