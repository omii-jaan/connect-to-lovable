# DB_SCHEMA — Shipyards Supabase (MVP: Layers 1-3)

Single source of truth for the Postgres schema. Follow these exact table/column names so prompts match real columns. Every table must get **RLS enabled + policies** in the same prompt that creates it.

## Conventions
- `id uuid primary key default gen_random_uuid()` on every table.
- `created_at timestamptz default now()` on every table.
- Foreign keys reference `profiles.id` for all user-owned rows unless noted.
- Relations: many-to-many via join tables (snake_case plural).
- Counts (likes_count, followers_count, comments_count) stored as int columns, maintained by the like/follow insert AND delete.

## LAYER 1 — Discovery & Showcase

### profiles
- `id uuid` (PK = auth.users.id)
- `handle text unique not null` (e.g. `alex` → url `/@alex`)
- `display_name text not null`
- `avatar_url text`
- `bio text check (length <= 600)`
- `role text check in ('builder','creator','both')`
- `location text`, `website text`, `joined_at date`
- `skills text[]`, `models_used text[]`, `experience_level text`
- `availability text check in ('available','busy','not_available')`
- `reputation_score int default 0`, `rank_percentile numeric`
- `premium boolean default false`

### projects
- `id`, `slug text unique not null`
- `owner_id uuid → profiles.id`
- `title text not null` (<=100), `description text not null` (markdown)
- `category text` (AI Agents, Automation, Data Analysis, NLP, Computer Vision, Other)
- `media jsonb` (array `[{type,url}]`), `thumbnail_url text`
- `tech_stack text[]`, `models_used text[]`, `metrics jsonb`
- `github_url text`, `demo_url text`, `docs_url text`
- `difficulty text` (Beginner|Intermediate|Advanced|Expert)
- `time_to_build text`, `cost_estimate numeric`
- `visibility text` default `'public'` in ('public','unlisted','draft')
- `likes_count int default 0`, `comments_count int default 0`, `shares_count int default 0`

### `project_likes`
- `user_id→profiles`, `project_id→projects`, `created_at` ; unique(user_id, project_id)

### `project_comments`
- `id`, `project_id→projects`, `user_id→profiles`, `parent_id→project_comments` (nullable, 1 level nesting), `content text`, `created_at`, `edited_at`

### `project_bookmarks`
- `user_id`, `project_id`, `created_at` ; unique(user_id, project_id)

### follows
- `follower_id→profiles`, `followee_id→profiles`, `created_at` ; unique(follower_id, followee_id)

### `notifications`
- `id`, `user_id` (recipient), `actor_id→profiles` nullable, `type` (like|comment|follow|invite|milestone|system), `link text` (route), `payload jsonb`, `read boolean default false`, `created_at`

### `waitlist`
- `id`, `email text unique`, `source text`, `created_at` (no auth)

## LAYER 2 — Marketplace

### `marketplace_projects`
- `id`, `slug text unique`
- `creator_id → profiles.id`
- `title`, `description text` (long), `requirements jsonb` (parsed: key needs, suggested stack, complexity, ideal profile)
- `budget_type text` (Fixed|Hourly|Range), `budget_min numeric`, `budget_max numeric`, `currency text` default 'USD'
- `timeline_start date`, `timeline_end date`
- `skills text[]`, `tech_stack text[]`, `complexity text`, `team_size text`
- `location text`, `remote boolean default true`, `nda boolean default false`
- `status text` default 'open' in ('open','in_progress','completed','closed')
- `visibility text` in ('public','invite_only','private')
- `featured boolean default false`
- `views_count int default 0`

### `marketplace_applications`
- `id`, `marketplace_project_id→marketplace_projects`, `builder_id→profiles`
- `cover_letter text`, `proposed_budget numeric`, `estimated_timeline text`, `relevant_project_ids text[]`
- `status text` default 'applied' in ('applied','accepted','declined','withdrawn')
- unique(marketplace_id, builder_id)

### `invitations`
- `id`, `project_id→marketplace_projects`, `builder_id→profiles`, `sender_id→profiles`
- `message text`, `match_score int`, `reason jsonb` (array of {text,icon})
- `status text` default in ('pending','accepted','declined','expired')
- `sent_at`, `responded_at`, `expires_at`

### `contracts`
- `id`, `project_id→marketplace_projects`, `builder_id→profiles`, `creator_id→profiles`
- `status text` ('draft','sent','accepted','active','completed','disputed')
- `terms jsonb` (scope, deliverables, revisions, termination), `milestones jsonb`, `payment jsonb`
- `signed_by_builder boolean`, `signed_by_creator boolean`

### `ratings`
- `id`, `project_id→marketplace_projects` (or contract_id), `rater_id→profiles`, `ratee_id→profiles`
- `score smallint 1-5`, `comment text`, `role text` ('client'|'builder'), `created_at`

## LAYER 3 — Collaboration Workspace

### `workspaces`
- `id`, `contract_id→contracts`, `name text`, `status text` in ('active','completed')
- `project_id` nullable → projects, `created_at`

### `workspace_members`
- `workspace_id`, `user_id→profiles`, `role text` in ('owner','admin','builder','viewer')
- unique(workspace_id, user_id)

### workspace_tasks (kanban)
- `id`, `workspace_id→workspaces`, `assignee_id→profiles` nullable
- `title`, `description text`, `column text` in ('backlog','in_progress','review','done')
- `priority` in ('low','medium','high','critical'), `due_date date`, `sort_order int`, `completed_at`

### `task_comments`
- `id`, `task_id→workspace_tasks`, `user_id→profiles`, `content text`, `created_at`

### `workspace_messages`
- `id`, `workspace_id`, `sender_id→profiles`, `content text`, `thread_id` nullable, `created_at`
- (realtime subscribed)

### `workspace_files`
- `id`, `workspace_id`, `uploader_id→profiles`, `name`, `url`, `size bytes int`, `mime_type text`, `created_at`

### `workspace_commits`
- `id`, `workspace_id`, `sha text`, `message text`, `author text`, `url text`, `created_at`
- (server-side import via GitHub webhook; frontend reads only)

## Enums & formula
Rank bands: Top1% / Top5% / Top10% / null. Reputation =
`projects x10 + followers x2 + likes x1 + skillTests x50 + jobsCompleted x100 + engagement x5`.
Match score = past similar projects (+30) + tech-stack match (+25) + availability (+20) + budget history (+15) + model/style fit (+10) → clamp 0-100.

## Storage buckets
- `avatars/` (profile images, 2MB), `projects/` (media, 50MB), `workspace-files/` (private, signed URLs if needed).

## RLS defaults
- content read: `enable rls; policy for select using (project is public)` on showcase+marketplace rows.
- mutations: `using (auth.uid() = owner_id/creator_id)`.
- follows/likes/comments: insert when authenticated; read when public.
- invitations/applications/contracts/workspaces: only involved parties (creator/builder/member).