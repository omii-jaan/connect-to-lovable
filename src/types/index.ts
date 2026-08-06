export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  stack: string[];
  skills?: string[];
  modelsUsed?: string[];
  social_links: Record<string, string>;
  github_username: string | null;
  github_id: number | null;
  github_access_token: string | null;
  ships_count: number;
  stars_count: number;
  reputation: number;
  role: 'builder' | 'founder' | 'admin';
  availability?: 'available' | 'busy' | 'not_available';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  builder_id: string;
  title: string;
  description: string | null;
  github_repo_id: number | null;
  github_repo_full_name: string | null;
  github_repo_url: string | null;
  github_stars: number;
  github_forks: number;
  github_language: string | null;
  github_topics: string[];
  live_url: string | null;
  demo_video_url: string | null;
  category: string | null;
  category_color: 'cyan' | 'purple' | 'green' | 'orange' | null;
  stack: string[];
  status: 'draft' | 'docked' | 'verified' | 'archived';
  is_featured: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  builder?: Profile;
}

export interface ContractTerms {
  budgetType: "Fixed" | "Hourly" | "Range" | string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
}

export interface ContractRatingStatus {
  founder: boolean;
  builder: boolean;
}

export interface Contract {
  id: string;
  marketplaceProjectId?: string;
  project_id?: string | null;
  projectId?: string;
  founderUid?: string;
  founder_id?: string;
  creatorUid?: string;
  builderUid?: string;
  builder_id?: string;
  title?: string;
  description?: string | null;
  terms?: ContractTerms;
  status: 'draft' | 'active' | 'completed' | 'cancelled' | 'disputed' | 'pending';
  startedAt?: string | null;
  started_at?: string | null;
  completedAt?: string | null;
  completed_at?: string | null;
  ratingStatus?: ContractRatingStatus;
  amount_usd?: number | null;
  currency?: string;
  payment_status?: 'unpaid' | 'escrowed' | 'released' | 'refunded';
  milestones?: ContractMilestone[];
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;

  // Enriched fields
  project?: MarketplaceProject;
  founder?: Profile;
  builder?: Profile;
}

export interface ContractMilestone {
  id: string;
  title: string;
  description: string;
  amount_usd: number;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'paid';
  due_date: string | null;
  completed_at: string | null;
}

export interface AIParsedRequirements {
  core_requirement: string;
  integrations: string[];
  tech_stack: string[];
  complexity: 'low' | 'medium' | 'high';
  ideal_builder_type: string;
}

export interface MatchBreakdown {
  pastSimilar: number; // 0..30
  stack: number;       // 0..25
  availability: number;// 0..20
  budget: number;      // 0..15
  style: number;       // 0..10
}

export interface MatchResult {
  builderUid: string;
  score: number;
  breakdown: MatchBreakdown;
  reasons: string[];
  builder?: Profile;
}

export interface MarketplaceProject {
  id: string;
  slug: string;
  creatorUid: string;
  title: string;
  category: string;
  description: string;
  requirements: string[];
  budgetType: "Fixed" | "Hourly" | "Range";
  budgetMin: number;
  budgetMax: number;
  currency: string;
  timelineStart?: string;
  timelineEnd?: string;
  timelineWeeks: number;
  skills: string[];
  techStack: string[];
  complexity: "low" | "medium" | "high" | "critical";
  teamSize: string;
  remote: boolean;
  ndaRequired: boolean;
  visibility: "public" | "invite-only";
  featured: boolean;
  status: "open" | "in_review" | "matched" | "closed" | "cancelled";
  viewsCount: number;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
  creator?: Profile;
  matches?: MatchResult[];
}

export interface MarketplaceApplication {
  id: string;
  projectId: string;
  marketplaceProjectId?: string;
  builderUid: string;
  pitch: string;
  links?: string[];
  proposedRate: number;
  proposedTimelineWeeks: number;
  status: "pending" | "shortlisted" | "accepted" | "rejected";
  createdAt: string;
  updatedAt?: string;
  builder?: Profile;
  project?: MarketplaceProject;
}

export interface HireProject {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  ai_parsed_requirements: AIParsedRequirements | null;
  budget_min: number;
  budget_max: number;
  budget_currency: string;
  timeline_weeks: number;
  category: string;
  scope: 'small' | 'medium' | 'large';
  complexity: 'low' | 'medium' | 'high';
  required_skills: string[];
  preferred_tech_stack: string[];
  success_criteria: string;
  status: 'draft' | 'open' | 'in_review' | 'matched' | 'closed' | 'cancelled';
  visibility: 'public' | 'private';
  views_count: number;
  interest_count: number;
  created_at: string;
  updated_at: string;
  creator?: Profile;
  slug?: string;
  creatorUid?: string;
  requirements?: string[];
  budgetType?: "Fixed" | "Hourly" | "Range";
  budgetMin?: number;
  budgetMax?: number;
  timelineWeeks?: number;
  skills?: string[];
  techStack?: string[];
  remote?: boolean;
  ndaRequired?: boolean;
  teamSize?: string;
  featured?: boolean;
  applicationsCount?: number;
}

export interface BuilderMatch {
  id: string;
  project_id: string;
  builder_id: string;
  builder?: Profile;
  match_score: number;
  match_reasons: string[];
  skills_match: string[];
  experience_match: string;
  invited: boolean;
  invitation_sent_at: string | null;
  invitation_response: 'pending' | 'accepted' | 'declined' | null;
}

export interface Invitation {
  id: string;
  project_id?: string;
  projectId?: string;
  marketplaceProjectId?: string;
  project?: MarketplaceProject | HireProject;
  creator_id?: string;
  creatorUid?: string;
  founderUid?: string;
  senderUid?: string;
  creator?: Profile;
  founder?: Profile;
  builder_id?: string;
  builderUid?: string;
  builder?: Profile;
  personalized_message?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sent_at?: string;
  createdAt?: string;
  updatedAt?: string;
  responded_at?: string | null;
}

export interface ProjectFeedback {
  id: string;
  project_id: string;
  from_id: string;
  to_id: string;
  rating: number;
  feedback: string;
  created_at: string;
}

export interface Rating {
  id?: string;
  contractId: string;
  raterUid: string;
  rateeUid: string;
  score: number;
  comment: string;
  role: 'founder' | 'builder';
  createdAt: string;
  rater?: Profile;
  ratee?: Profile;
}