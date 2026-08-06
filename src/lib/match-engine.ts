import type { Profile, MatchResult, MatchBreakdown } from "@/types";

export const SEEDED_BUILDERS: Profile[] = [
  {
    id: "b1",
    username: "alexrivera",
    full_name: "Alex Rivera",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=00f2ff",
    bio: "AI Engineer specializing in chatbots and conversational AI. 5+ years shipping production Claude & GPT-4 agents.",
    stack: ["Claude", "Python", "FastAPI", "Slack API", "PostgreSQL", "LangChain"],
    skills: ["Claude", "Python", "API Integration", "AI Agents", "Slack API"],
    modelsUsed: ["Claude 3.5 Sonnet", "Claude 3 Opus", "Whisper"],
    social_links: { github: "https://github.com/alexrivera" },
    github_username: "alexrivera",
    github_id: null,
    github_access_token: null,
    ships_count: 8,
    stars_count: 420,
    reputation: 94,
    role: "builder",
    availability: "available",
    is_verified: true,
    created_at: "2025-06-01T00:00:00Z",
    updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: "b2",
    username: "priyasharma",
    full_name: "Priya Sharma",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=c0aede",
    bio: "Full-stack AI engineer. Expert in LLM integrations, RAG architectures, and high-performance API backends.",
    stack: ["Python", "FastAPI", "PostgreSQL", "React", "Docker", "PyTorch"],
    skills: ["Python", "PyTorch", "FastAPI", "PostgreSQL", "React", "LangChain"],
    modelsUsed: ["GPT-4o", "Claude 3.5", "Whisper", "Qdrant"],
    social_links: { github: "https://github.com/priyasharma" },
    github_username: "priyasharma",
    github_id: null,
    github_access_token: null,
    ships_count: 8,
    stars_count: 567,
    reputation: 97,
    role: "builder",
    availability: "available",
    is_verified: true,
    created_at: "2025-08-15T00:00:00Z",
    updated_at: "2026-06-20T00:00:00Z",
  },
  {
    id: "b3",
    username: "jordanlee",
    full_name: "Jordan Lee",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan&backgroundColor=ffd700",
    bio: "AI/ML engineer focused on NLP and vector search RAG systems. Architected multi-tenant knowledge bases.",
    stack: ["Python", "PyTorch", "LangChain", "Qdrant", "Vector DB", "OpenAI", "AWS"],
    skills: ["Python", "LangChain", "Vector DB", "OpenAI", "PyTorch", "Qdrant"],
    modelsUsed: ["GPT-4o", "Qdrant", "LangChain", "Llama 3"],
    social_links: { github: "https://github.com/jordanlee" },
    github_username: "jordanlee",
    github_id: null,
    github_access_token: null,
    ships_count: 11,
    stars_count: 890,
    reputation: 97,
    role: "builder",
    availability: "busy",
    is_verified: true,
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2026-07-05T00:00:00Z",
  },
  {
    id: "b4",
    username: "marcusvance",
    full_name: "Marcus Vance",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus&backgroundColor=ff6b6b",
    bio: "Data Infrastructure & Kafka specialist. Built streaming pipelines handling 10k+ events/sec.",
    stack: ["Kafka", "Python", "PostgreSQL", "Docker", "Grafana", "Go", "Kubernetes"],
    skills: ["Kafka", "Python", "PostgreSQL", "Docker", "Grafana", "Data Engineering"],
    modelsUsed: ["DeepSeek", "Prometheus", "Kafka"],
    social_links: { github: "https://github.com/marcusvance" },
    github_username: "marcusvance",
    github_id: null,
    github_access_token: null,
    ships_count: 6,
    stars_count: 310,
    reputation: 92,
    role: "builder",
    availability: "available",
    is_verified: true,
    created_at: "2025-04-10T00:00:00Z",
    updated_at: "2026-07-01T00:00:00Z",
  },
  {
    id: "b5",
    username: "elenarostova",
    full_name: "Elena Rostova",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena&backgroundColor=4ecdc4",
    bio: "Voice AI & Telephony pioneer. Expert in Twilio, Whisper STT, ElevenLabs TTS, and real-time sales bots.",
    stack: ["Twilio", "Whisper", "TTS", "Python", "FastAPI", "ElevenLabs", "Sales Automation"],
    skills: ["Twilio", "Whisper", "TTS", "Python", "FastAPI", "ElevenLabs"],
    modelsUsed: ["Whisper", "ElevenLabs", "GPT-4o"],
    social_links: { github: "https://github.com/elenarostova" },
    github_username: "elenarostova",
    github_id: null,
    github_access_token: null,
    ships_count: 9,
    stars_count: 640,
    reputation: 95,
    role: "builder",
    availability: "available",
    is_verified: true,
    created_at: "2025-05-12T00:00:00Z",
    updated_at: "2026-07-02T00:00:00Z",
  },
  {
    id: "b6",
    username: "devonknox",
    full_name: "Devon Knox",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=devon&backgroundColor=a8e6cf",
    bio: "Cloud FinOps & Infrastructure engineer. Reduced AWS/GCP spend by $100k+ across 20 startup clients.",
    stack: ["AWS", "GCP", "Python", "React", "Cost Optimization", "Terraform", "Docker"],
    skills: ["AWS", "GCP", "Python", "React", "Cost Optimization", "Terraform"],
    modelsUsed: ["Claude 3.5", "GCP FinOps"],
    social_links: { github: "https://github.com/devonknox" },
    github_username: "devonknox",
    github_id: null,
    github_access_token: null,
    ships_count: 7,
    stars_count: 280,
    reputation: 91,
    role: "builder",
    availability: "busy",
    is_verified: false,
    created_at: "2025-09-01T00:00:00Z",
    updated_at: "2026-06-15T00:00:00Z",
  },
  {
    id: "b7",
    username: "sophialin",
    full_name: "Sophia Lin",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia&backgroundColor=d4a5a5",
    bio: "DevTool creator & AI Code Quality specialist. Built automated PR review apps & meeting summarizer bots.",
    stack: ["Python", "GitHub API", "AI/LLM", "Code Review", "Docker", "TypeScript", "React"],
    skills: ["Python", "GitHub API", "AI/LLM", "Code Review", "Docker", "Transcription"],
    modelsUsed: ["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"],
    social_links: { github: "https://github.com/sophialin" },
    github_username: "sophialin",
    github_id: null,
    github_access_token: null,
    ships_count: 10,
    stars_count: 980,
    reputation: 96,
    role: "builder",
    availability: "available",
    is_verified: true,
    created_at: "2025-01-20T00:00:00Z",
    updated_at: "2026-07-10T00:00:00Z",
  },
  {
    id: "b8",
    username: "liamchen",
    full_name: "Liam Chen",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=liam&backgroundColor=96ceb4",
    bio: "Platform engineer specializing in internal developer portals, Kubernetes, service catalogs, and CI/CD.",
    stack: ["React", "Node.js", "Kubernetes", "CI/CD", "Developer Tools", "TypeScript", "Tailwind"],
    skills: ["React", "Node.js", "Kubernetes", "CI/CD", "Developer Tools", "Docker"],
    modelsUsed: ["Gemini 1.5", "Claude 3.5"],
    social_links: { github: "https://github.com/liamchen" },
    github_username: "liamchen",
    github_id: null,
    github_access_token: null,
    ships_count: 5,
    stars_count: 340,
    reputation: 88,
    role: "builder",
    availability: "available",
    is_verified: true,
    created_at: "2025-07-15T00:00:00Z",
    updated_at: "2026-06-28T00:00:00Z",
  },
];

export function computeProjectMatches(project: Record<string, unknown>, candidateBuilders: Profile[]): MatchResult[] {
  // Filter for available/busy builders (exclude not_available)
  const eligible = candidateBuilders.filter(
    (b) => b.availability !== "not_available" && b.role !== "founder"
  );

  const projCategory = String(project.category || "").toLowerCase();
  const rawSkills = (Array.isArray(project.skills) ? project.skills : Array.isArray(project.required_skills) ? project.required_skills : []) as string[];
  const rawStack = (Array.isArray(project.techStack) ? project.techStack : Array.isArray(project.preferred_tech_stack) ? project.preferred_tech_stack : []) as string[];
  const projSkills: string[] = rawSkills.map((s) => String(s).toLowerCase());
  const projStack: string[] = rawStack.map((s) => String(s).toLowerCase());
  const allProjRequirements = Array.from(new Set([...projSkills, ...projStack]));

  const matches: MatchResult[] = eligible.map((builder) => {
    const builderStack = (builder.stack || []).map((s) => s.toLowerCase());
    const builderSkills = (builder.skills || []).map((s) => s.toLowerCase());
    const allBuilderTech = Array.from(new Set([...builderStack, ...builderSkills]));

    // 1) Past Similar Projects (+30 max)
    let pastSimilar = 0;
    const isCategoryMatch =
      builder.bio?.toLowerCase().includes(projCategory) ||
      allBuilderTech.some((tech) => projCategory.includes(tech) || tech.includes(projCategory));
    
    if (isCategoryMatch) pastSimilar += 12;

    // Check shipped projects / bio keyword match
    const keywordMatches = allProjRequirements.filter((req) =>
      builder.bio?.toLowerCase().includes(req) || allBuilderTech.includes(req)
    );
    pastSimilar += Math.min(18, keywordMatches.length * 6);
    pastSimilar = Math.min(30, Math.max(8, pastSimilar));

    // 2) Tech Stack Match (+25 max)
    const matchingTech = allProjRequirements.filter((req) =>
      allBuilderTech.some((bTech) => bTech.includes(req) || req.includes(bTech))
    );
    let stackScore = 0;
    if (allProjRequirements.length > 0) {
      const ratio = matchingTech.length / allProjRequirements.length;
      stackScore = Math.min(25, Math.round(ratio * 20 + matchingTech.length * 2.5));
    }
    if (matchingTech.length > 0) stackScore = Math.max(12, stackScore);

    // 3) Availability (+20 max)
    let availabilityScore = 0;
    if (builder.availability === "available" || !builder.availability) {
      availabilityScore = 20;
    } else if (builder.availability === "busy") {
      availabilityScore = 10;
    }

    // 4) Budget History (+15 max)
    let budgetScore = 12;
    const projectMaxBudget = project.budgetMax || project.budget_max || 10000;
    if (projectMaxBudget > 20000 && (builder.ships_count >= 8 || builder.reputation >= 92)) {
      budgetScore = 15;
    } else if (projectMaxBudget <= 10000) {
      budgetScore = 15;
    } else if (builder.reputation >= 88) {
      budgetScore = 14;
    }

    // 5) Model/Style Fit (+10 max)
    let styleScore = 5;
    const builderModels = (builder.modelsUsed || []).map((m) => m.toLowerCase());
    const modelMatches = builderModels.filter((m) =>
      allProjRequirements.some((req) => req.includes(m) || m.includes(req))
    );
    if (modelMatches.length >= 2) styleScore = 10;
    else if (modelMatches.length === 1) styleScore = 8;
    else if (builder.reputation >= 95) styleScore = 9;
    else styleScore = 7;

    const totalScore = Math.min(
      100,
      Math.max(0, pastSimilar + stackScore + availabilityScore + budgetScore + styleScore)
    );

    const breakdown: MatchBreakdown = {
      pastSimilar,
      stack: stackScore,
      availability: availabilityScore,
      budget: budgetScore,
      style: styleScore,
    };

    // Generate readable reasons
    const reasons: string[] = [];
    if (matchingTech.length > 0) {
      reasons.push(`${matchingTech.length} tech stack match: ${matchingTech.slice(0, 3).join(", ")}`);
    } else {
      reasons.push("Strong core engineering overlap");
    }

    if (builder.ships_count > 0) {
      reasons.push(`Shipped ${builder.ships_count} verified projects (${builder.reputation}% reputation)`);
    }

    if (builder.availability === "available" || !builder.availability) {
      reasons.push("100% available for immediate start");
    } else {
      reasons.push("Available part-time (currently busy)");
    }

    if (isCategoryMatch) {
      reasons.push(`Domain expertise in ${project.category || "AI Systems"}`);
    }

    return {
      builderUid: builder.id,
      score: totalScore,
      breakdown,
      reasons,
      builder,
    };
  });

  // Sort descending by score
  return matches.sort((a, b) => b.score - a.score);
}
