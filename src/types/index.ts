export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  stack: string[];
  social_links: Record<string, string>;
  github_username: string | null;
  github_id: number | null;
  github_access_token: string | null;
  ships_count: number;
  stars_count: number;
  reputation: number;
  role: 'builder' | 'founder' | 'admin';
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

export interface Contract {
  id: string;
  project_id: string | null;
  builder_id: string;
  founder_id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed';
  amount_usd: number | null;
  currency: string;
  payment_status: 'unpaid' | 'escrowed' | 'released' | 'refunded';
  escrow_transaction_id: string | null;
  milestones: ContractMilestone[];
  started_at: string | null;
  completed_at: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
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
  project_id: string;
  project?: HireProject;
  creator_id: string;
  creator?: Profile;
  builder_id: string;
  builder?: Profile;
  personalized_message: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sent_at: string;
  responded_at: string | null;
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