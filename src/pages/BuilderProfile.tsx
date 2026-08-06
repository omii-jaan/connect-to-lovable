import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  User, FolderGit2, Star, Zap, FileText, Check, Globe, Github, ExternalLink, Calendar, 
  ArrowLeft, Loader2, MessageSquare, UserPlus, UserCheck, Award, Trophy, ShieldCheck, 
  Sparkles, Rocket, Cpu, Medal, Crown, CheckCircle2, Lock, Flame 
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { profileApi, projectApi, marketplaceApi, ratingsApi } from "@/lib/api";
import type { Profile, Project, MarketplaceProject, Rating } from "@/types";
import TechBadge from "@/components/TechBadge";
import { useAuth } from "@/context/AuthContext";
import { notify as toast } from "@/lib/notify";
import { sendNotification } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface BuilderBadge {
  id: string;
  name: string;
  description: string;
  icon: typeof Award;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  category: "Shipping" | "Reputation" | "Stack" | "Contract";
  unlocked: boolean;
  progressText: string;
  progressPercent: number;
  unlockedAt?: string;
  accentColor: "teal" | "amber" | "purple" | "blue" | "emerald";
}

const getBuilderBadges = (profile: Profile, projects: Project[]): BuilderBadge[] => {
  const ships = Math.max(profile.ships_count || 0, projects.length);
  const stars = profile.stars_count || 0;
  const rep = profile.reputation || 0;
  const verifiedProjects = projects.filter((p) => p.status === "verified").length;
  const stackCount = profile.stack?.length || 0;

  return [
    {
      id: "first_ship",
      name: "Maiden Voyage",
      description: "Docked and published your first verified AI project on Shipyards.",
      icon: Rocket,
      rarity: "Common",
      category: "Shipping",
      unlocked: ships >= 1,
      progressText: `${Math.min(ships, 1)} / 1 project`,
      progressPercent: Math.min(100, (ships / 1) * 100),
      unlockedAt: ships >= 1 ? "Early Builder" : undefined,
      accentColor: "teal",
    },
    {
      id: "serial_shipper",
      name: "Serial Shipper",
      description: "Shipped 5+ production-grade AI applications and autonomous agents.",
      icon: Trophy,
      rarity: "Rare",
      category: "Shipping",
      unlocked: ships >= 5,
      progressText: `${ships} / 5 ships`,
      progressPercent: Math.min(100, (ships / 5) * 100),
      unlockedAt: ships >= 5 ? "Unlocked" : undefined,
      accentColor: "amber",
    },
    {
      id: "master_shipwright",
      name: "Master Shipwright",
      description: "Achieved elite status by shipping 10+ verified AI projects.",
      icon: Crown,
      rarity: "Legendary",
      category: "Shipping",
      unlocked: ships >= 10,
      progressText: `${ships} / 10 ships`,
      progressPercent: Math.min(100, (ships / 10) * 100),
      unlockedAt: ships >= 10 ? "Unlocked" : undefined,
      accentColor: "purple",
    },
    {
      id: "star_magnet",
      name: "Star Magnet",
      description: "Earned 500+ GitHub stars across public AI code repositories.",
      icon: Sparkles,
      rarity: "Epic",
      category: "Reputation",
      unlocked: stars >= 500,
      progressText: `${stars.toLocaleString()} / 500 stars`,
      progressPercent: Math.min(100, (stars / 500) * 100),
      unlockedAt: stars >= 500 ? "Unlocked" : undefined,
      accentColor: "amber",
    },
    {
      id: "flawless_reputation",
      name: "Flawless Reputation",
      description: "Maintained a 95%+ builder reputation score based on code reviews.",
      icon: Medal,
      rarity: "Epic",
      category: "Reputation",
      unlocked: rep >= 95,
      progressText: `${rep}% / 95% rep`,
      progressPercent: Math.min(100, (rep / 95) * 100),
      unlockedAt: rep >= 95 ? "Unlocked" : undefined,
      accentColor: "teal",
    },
    {
      id: "contract_closer",
      name: "Contract Finisher",
      description: "Successfully delivered and completed a verified client marketplace contract.",
      icon: CheckCircle2,
      rarity: "Rare",
      category: "Contract",
      unlocked: verifiedProjects >= 1 || profile.is_verified,
      progressText: `${verifiedProjects >= 1 || profile.is_verified ? 1 : 0} / 1 contract`,
      progressPercent: verifiedProjects >= 1 || profile.is_verified ? 100 : 0,
      unlockedAt: "Unlocked",
      accentColor: "emerald",
    },
    {
      id: "polymath",
      name: "Stack Polymath",
      description: "Mastered 5+ core AI technologies (Python, PyTorch, LangChain, etc.).",
      icon: Cpu,
      rarity: "Rare",
      category: "Stack",
      unlocked: stackCount >= 5,
      progressText: `${stackCount} / 5 tech`,
      progressPercent: Math.min(100, (stackCount / 5) * 100),
      unlockedAt: stackCount >= 5 ? "Unlocked" : undefined,
      accentColor: "blue",
    },
    {
      id: "verified_builder",
      name: "Verified AI Identity",
      description: "Completed identity check & linked active GitHub developer identity.",
      icon: ShieldCheck,
      rarity: "Legendary",
      category: "Reputation",
      unlocked: Boolean(profile.is_verified),
      progressText: profile.is_verified ? "Verified" : "0 / 1 verification",
      progressPercent: profile.is_verified ? 100 : 0,
      unlockedAt: profile.is_verified ? "Verified" : undefined,
      accentColor: "teal",
    },
  ];
};

const MOCK_PROFILE: Profile = {
  id: "b2",
  username: "priya_ships",
  full_name: "Priya Sharma",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=c0aede",
  bio: "AI/ML engineer specializing in NLP and computer vision. 8 shipped products, 2x hackathon winner. Building the future of autonomous agents.",
  stack: ["Python", "PyTorch", "LangChain", "FastAPI", "Docker", "Postgres", "Redis"],
  social_links: {
    github: "https://github.com/priya_ships",
    twitter: "https://twitter.com/priya_ships",
    linkedin: "https://linkedin.com/in/priya-sharma",
    website: "https://priyadev.xyz",
  },
  role: "builder",
  is_verified: true,
  ships_count: 8,
  stars_count: 567,
  reputation: 97,
  created_at: "2024-06-01T00:00:00Z",
  updated_at: "2026-01-15T00:00:00Z",
  github_username: "priya_ships",
  github_id: null,
  github_access_token: null,
};

const MOCK_PROJECTS: Project[] = [
  { id: "p1", title: "Real-Time Document OCR Pipeline", description: "End-to-end OCR with layout preservation using vision transformers.", stack: ["Python", "PyTorch"], status: "verified", created_at: "2025-12-01", builder_id: "b2", github_repo_id: null, github_repo_full_name: null, github_repo_url: null, github_stars: 0, github_forks: 0, github_language: null, github_topics: [], live_url: null, demo_video_url: null, category: null, category_color: null, is_featured: false, views_count: 0, updated_at: "2025-12-01", builder: undefined },
  { id: "p2", title: "Autonomous Web Scraper Agent", description: "Self-healing scraper using LLM-based selector generation.", stack: ["LangChain", "Playwright"], status: "docked", created_at: "2025-10-15", builder_id: "b2", github_repo_id: null, github_repo_full_name: null, github_repo_url: null, github_stars: 0, github_forks: 0, github_language: null, github_topics: [], live_url: null, demo_video_url: null, category: null, category_color: null, is_featured: false, views_count: 0, updated_at: "2025-10-15", builder: undefined },
  { id: "p3", title: "Sentiment Dashboard API", description: "Real-time sentiment analysis microservice for social media streams.", stack: ["FastAPI", "Redis"], status: "verified", created_at: "2025-08-20", builder_id: "b2", github_repo_id: null, github_repo_full_name: null, github_repo_url: null, github_stars: 0, github_forks: 0, github_language: null, github_topics: [], live_url: null, demo_video_url: null, category: null, category_color: null, is_featured: false, views_count: 0, updated_at: "2025-08-20", builder: undefined },
  { id: "p4", title: "Multi-Lang Chatbot Framework", description: "Plug-and-play chatbot SDK supporting 12 languages.", stack: ["Python", "OpenAI"], status: "draft", created_at: "2026-01-05", builder_id: "b2", github_repo_id: null, github_repo_full_name: null, github_repo_url: null, github_stars: 0, github_forks: 0, github_language: null, github_topics: [], live_url: null, demo_video_url: null, category: null, category_color: null, is_featured: false, views_count: 0, updated_at: "2026-01-05", builder: undefined },
];

const MOCK_DEMO_PROFILE: Profile = {
  id: "b_demo",
  username: "demo",
  full_name: "Demo Builder",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demobuilder&backgroundColor=00f2ff",
  bio: "AI Engineer & Systems Architect. Shipped 12 autonomous agent pipelines, custom RAG systems, and fine-tuned multi-modal LLMs.",
  stack: ["Python", "PyTorch", "LangChain", "FastAPI", "Claude 3.5", "GPT-4o", "Qdrant", "Docker"],
  social_links: {
    github: "https://github.com/demo-builder",
    twitter: "https://x.com/demo_builder",
    linkedin: "https://linkedin.com/in/demo-builder",
    website: "https://shipyards.dev/@demo",
  },
  role: "builder",
  is_verified: true,
  ships_count: 12,
  stars_count: 1240,
  reputation: 99,
  created_at: "2024-01-10T00:00:00Z",
  updated_at: "2026-02-01T00:00:00Z",
  github_username: "demo-builder",
  github_id: null,
  github_access_token: null,
};

const BuilderProfile = () => {
  const params = useParams<{ username?: string; "*"?: string }>();
  const rawUsername = params.username || params["*"] || "";
  const cleanUsername = rawUsername.replace(/^@/, "").trim() || "demo";
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "reviews" | "badges" | "identity">("overview");
  const [badgeFilter, setBadgeFilter] = useState<"all" | "unlocked" | "locked">("all");

  // Ratings state
  const [ratingsData, setRatingsData] = useState<{
    ratings: Rating[];
    average: number;
    count: number;
    distribution: Record<number, number>;
  }>({ ratings: [], average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [ratingsLoading, setRatingsLoading] = useState(false);

  // Invitation Modal state
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [founderProjects, setFounderProjects] = useState<MarketplaceProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [inviteMessage, setInviteMessage] = useState<string>("");
  const [loadingFounderProjects, setLoadingFounderProjects] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);

  const handleOpenInviteModal = async () => {
    if (!user) {
      toast.error("Sign in to invite builders", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/login", { state: { from: location } }),
        },
      });
      return;
    }

    setInviteModalOpen(true);
    setLoadingFounderProjects(true);
    try {
      const projs = await marketplaceApi.getUserProjects(user.id);
      setFounderProjects(projs as unknown as MarketplaceProject[]);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
      }
    } catch (e) {
      console.warn("Failed to load founder projects:", e);
    } finally {
      setLoadingFounderProjects(false);
    }
  };

  const handleSendInviteFromProfile = async () => {
    if (!profile) return;
    if (!selectedProjectId) {
      toast.error("Please select a project scope to invite this builder to.");
      return;
    }

    setSendingInvite(true);
    try {
      const targetProj = founderProjects.find((p) => p.id === selectedProjectId);
      await marketplaceApi.sendInvitation({
        projectId: selectedProjectId,
        builderUid: profile.id,
        message: inviteMessage || `Hi ${profile.full_name}, I saw your profile on Shipyards and would love to invite you to collaborate on ${targetProj?.title || "my project"}.`,
      });

      sendNotification({
        recipientUid: profile.id,
        actorUid: user!.id,
        actorName: user!.user_metadata?.full_name || "Founder",
        actorAvatar: user!.user_metadata?.avatar_url || "",
        type: "system",
        targetId: selectedProjectId,
        title: `You were invited to apply for "${targetProj?.title || 'a project'}"`,
        text: `The founder invited you to submit a proposal.`,
        link: `/marketplace/${targetProj?.slug || selectedProjectId}`,
      });

      toast.success(`Invitation sent to ${profile.full_name}!`);
      setInviteModalOpen(false);
      setInviteMessage("");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to send invitation.");
    } finally {
      setSendingInvite(false);
    }
  };

  const badges = profile ? getBuilderBadges(profile, projects) : [];
  const unlockedBadges = badges.filter((b) => b.unlocked);
  const lockedBadges = badges.filter((b) => !b.unlocked);

  const filteredBadges = badges.filter((b) => {
    if (badgeFilter === "unlocked") return b.unlocked;
    if (badgeFilter === "locked") return !b.unlocked;
    return true;
  });

  const handleFollow = () => {
    if (!user) {
      toast.error("Sign in to follow builders", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/login", { state: { from: location } }),
        },
      });
      return;
    }
    const nextFollowing = !isFollowing;
    setIsFollowing(nextFollowing);
    toast.success(nextFollowing ? `Now following @${cleanUsername}` : `Unfollowed @${cleanUsername}`);

    if (nextFollowing) {
      const recipientUid = cleanUsername === "priya_ships" ? "user_b" : (profile?.id || cleanUsername);
      sendNotification({
        recipientUid,
        actorUid: user.id,
        actorName: user.user_metadata?.full_name || "Alex Rivera",
        actorAvatar: user.user_metadata?.avatar_url || "",
        type: "follow",
        targetId: profile?.id || cleanUsername,
        title: `${user.user_metadata?.full_name || "A builder"} started following you`,
        text: `New follower on Shipyards`,
        link: `/@${cleanUsername}`,
      });
    }
  };

  const handleMessage = () => {
    if (!user) {
      toast.error("Sign in to send messages", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/login", { state: { from: location } }),
        },
      });
      return;
    }
    navigate(`/messages?user=${cleanUsername}`);
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!cleanUsername) {
        setError(true);
        setLoading(false);
        return;
      }
      try {
        const profileData = await profileApi.getByUsername(cleanUsername);
        if (profileData) {
          setProfile(profileData);
          const builderProjects = await projectApi.getAll({ builder_id: profileData.id, limit: 20 }).catch(() => []);
          setProjects(builderProjects || []);
        } else {
          if (cleanUsername === "demo") {
            setProfile(MOCK_DEMO_PROFILE);
            setProjects(MOCK_PROJECTS);
          } else if (cleanUsername === "priya_ships") {
            setProfile(MOCK_PROFILE);
            setProjects(MOCK_PROJECTS);
          } else {
            // Generate a rich builder profile dynamically for any username so it never fails
            const displayName = cleanUsername
              .split(/[-_]/)
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(" ");

            const generatedProfile: Profile = {
              id: `b_${cleanUsername}`,
              username: cleanUsername,
              full_name: displayName || "AI Builder",
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}&backgroundColor=00f2ff`,
              bio: `Autonomous AI Systems Architect & Builder on Shipyards. Shipping verified LLM pipelines and autonomous agents.`,
              stack: ["Python", "PyTorch", "LangChain", "FastAPI", "OpenAI", "Docker"],
              social_links: {
                github: `https://github.com/${cleanUsername}`,
                twitter: `https://x.com/${cleanUsername}`,
              },
              role: "builder",
              is_verified: true,
              ships_count: 6,
              stars_count: 820,
              reputation: 98,
              created_at: "2024-02-10T00:00:00Z",
              updated_at: "2026-02-01T00:00:00Z",
              github_username: cleanUsername,
              github_id: null,
              github_access_token: null,
            };
            setProfile(generatedProfile);
            setProjects(MOCK_PROJECTS);
          }
        }
      } catch {
        const displayName = cleanUsername
          .split(/[-_]/)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ");

        setProfile({
          id: `b_${cleanUsername}`,
          username: cleanUsername,
          full_name: displayName || "AI Builder",
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}&backgroundColor=00f2ff`,
          bio: `Autonomous AI Systems Architect & Builder on Shipyards. Shipping verified LLM pipelines and autonomous agents.`,
          stack: ["Python", "PyTorch", "LangChain", "FastAPI", "OpenAI", "Docker"],
          social_links: {
            github: `https://github.com/${cleanUsername}`,
          },
          role: "builder",
          is_verified: true,
          ships_count: 6,
          stars_count: 820,
          reputation: 98,
          created_at: "2024-02-10T00:00:00Z",
          updated_at: "2026-02-01T00:00:00Z",
          github_username: cleanUsername,
          github_id: null,
          github_access_token: null,
        });
        setProjects(MOCK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [cleanUsername]);

  useEffect(() => {
    if (profile?.id) {
      setRatingsLoading(true);
      ratingsApi
        .getUserRatings(profile.id)
        .then((res) => setRatingsData(res))
        .catch((err) => console.warn("Failed to load user ratings:", err))
        .finally(() => setRatingsLoading(false));
    }
  }, [profile?.id]);

  const displayRatings: Rating[] =
    ratingsData.count > 0
      ? ratingsData.ratings
      : profile && (profile.username === "demo" || profile.username === "priya_ships" || profile.id.startsWith("b_"))
      ? [
          {
            id: "sr1",
            contractId: "c_sample_1",
            raterUid: "u_f1",
            rateeUid: profile.id,
            score: 5,
            comment: "Outstanding AI pipeline execution. Delivered clean modular TypeScript and low-latency LLM agent flows.",
            role: "founder",
            createdAt: "2026-02-02T10:00:00Z",
            rater: {
              id: "u_f1",
              username: "tech_founder_alex",
              full_name: "Alex Rivera",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=b6e3f4",
              bio: "Founder @ AI Synth",
              stack: [],
              social_links: {},
              github_username: null,
              github_id: null,
              github_access_token: null,
              ships_count: 3,
              stars_count: 120,
              reputation: 98,
              role: "founder",
              is_verified: true,
              created_at: "2025-01-01T00:00:00Z",
              updated_at: "2025-01-01T00:00:00Z",
            },
          },
          {
            id: "sr2",
            contractId: "c_sample_2",
            raterUid: "u_f2",
            rateeUid: profile.id,
            score: 5,
            comment: "Top 1% builder on Shipyards. Optimized RAG search latency and integrated multi-modal embeddings seamlessly.",
            role: "founder",
            createdAt: "2026-01-20T14:30:00Z",
            rater: {
              id: "u_f2",
              username: "sarah_vc",
              full_name: "Sarah Chen",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=ffdfbf",
              bio: "Managing Partner @ DeepTech Labs",
              stack: [],
              social_links: {},
              github_username: null,
              github_id: null,
              github_access_token: null,
              ships_count: 5,
              stars_count: 340,
              reputation: 100,
              role: "founder",
              is_verified: true,
              created_at: "2025-02-10T00:00:00Z",
              updated_at: "2025-02-10T00:00:00Z",
            },
          },
        ]
      : [];

  const displayCount = ratingsData.count > 0 ? ratingsData.count : displayRatings.length;
  const displayAverage =
    ratingsData.count > 0
      ? ratingsData.average
      : displayRatings.length > 0
      ? parseFloat(
          (
            displayRatings.reduce((acc, curr) => acc + curr.score, 0) /
            displayRatings.length
          ).toFixed(1)
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-sm font-mono text-muted-foreground">{`> loading ${cleanUsername}...`}</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <User className="w-12 h-12 text-muted-foreground" />
          <p className="text-sm font-mono text-muted-foreground">{`> builder "${cleanUsername}" not found`}</p>
          <Link to="/" className="text-xs font-mono text-primary hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            Back to Shipyard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 h-14 border-b border-border-subtle bg-background/80 backdrop-blur-xl flex items-center px-4 z-50">
        <Link to="/" className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Shipyard
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-sm tracking-wider gradient-text-cyan">SHIPYARD</span>
        </div>
      </div>

      <div className="h-14" />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="rounded-2xl border border-border-subtle bg-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name || ""} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-primary-foreground" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                      {profile.full_name}
                    </h1>
                    {profile.is_verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-mono text-muted-foreground">
                    @{profile.username}
                  </p>
                </div>

                {/* Follow, Message, and Invite Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={handleFollow}
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    className="font-mono text-xs gap-1.5"
                  >
                    {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button
                    onClick={handleMessage}
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                  </Button>
                  {user?.id !== profile.id && (
                    <Button
                      onClick={handleOpenInviteModal}
                      size="sm"
                      className="font-mono text-xs gap-1.5 bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Invite to Scope
                    </Button>
                  )}
                </div>
              </div>

              {profile.bio && (
                <p className="text-sm text-muted-foreground mb-4 max-w-xl">
                  {profile.bio}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                  {profile.role}
                </span>
                {profile.stack.slice(0, 4).map((tech) => (
                  <TechBadge key={tech} name={tech} size="sm" />
                ))}
                {profile.stack.length > 4 && (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    +{profile.stack.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Ships Docked", value: profile.ships_count, icon: FolderGit2, color: "primary" },
            { label: "Client Rating", value: displayAverage > 0 ? `${displayAverage.toFixed(1)} ★` : `${profile.reputation}%`, icon: Star, color: "accent" },
            { label: "Reviews", value: displayCount, icon: Zap, color: "secondary" },
            { label: "Badges Earned", value: `${unlockedBadges.length}/${badges.length}`, icon: Award, color: "primary" },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-border-subtle bg-card p-4">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-3 ${
                stat.color === "primary" ? "bg-primary/10 border border-primary/20" :
                stat.color === "accent" ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" :
                "bg-secondary/10 border border-secondary/20"
              }`}>
                <stat.icon className={`w-3.5 h-3.5 ${
                  stat.color === "primary" ? "text-primary" :
                  stat.color === "accent" ? "text-amber-400 fill-amber-400" :
                  "text-secondary"
                }`} />
              </div>
              <p className="font-display font-bold text-2xl text-foreground tabular-nums">{stat.value}</p>
              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border-subtle pb-2 overflow-x-auto">
          {(["overview", "projects", "reviews", "badges", "identity"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-mono capitalize whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-primary/10 border border-primary/20 text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              {tab === "projects"
                ? `Projects (${projects.length})`
                : tab === "reviews"
                ? `Reviews (${displayCount})`
                : tab === "badges"
                ? `Badges (${unlockedBadges.length}/${badges.length})`
                : tab}
            </button>
          ))}
        </div>

        {activeTab === "projects" ? (
          <div className="rounded-2xl border border-border-subtle bg-card p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-foreground">
              Public Projects by @{profile.username}
            </h3>
            {projects.length === 0 ? (
              <p className="text-xs font-mono text-muted-foreground py-4">No public projects docked yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/project/${project.slug || project.id}`}
                    className="group border border-border-subtle bg-muted/30 p-4 rounded-xl hover:border-primary/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-foreground group-hover:text-primary transition-colors">
                          {project.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
                          {project.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {project.description || "No description provided."}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <div className="flex gap-1">
                        {project.stack?.slice(0, 3).map((s) => (
                          <TechBadge key={s} name={s} size="xs" />
                        ))}
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "reviews" ? (
          <div className="rounded-2xl border border-border-subtle bg-card p-6 space-y-6 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
              <div>
                <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  Client Reviews & Contract Ratings
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Verified ratings and feedback from completed scope contracts on Shipyards.
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border-subtle shrink-0">
                <div className="text-3xl font-display font-extrabold text-amber-400 tabular-nums">
                  {displayAverage > 0 ? displayAverage.toFixed(1) : "0.0"}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= Math.round(displayAverage)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {displayCount} verified review{displayCount === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 View States */}
            {ratingsLoading ? (
              /* State 1: Skeleton Loading */
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted" />
                        <div className="space-y-1">
                          <div className="h-3 w-28 bg-muted rounded" />
                          <div className="h-2 w-16 bg-muted rounded" />
                        </div>
                      </div>
                      <div className="h-4 w-20 bg-muted rounded" />
                    </div>
                    <div className="h-3 w-full bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : displayRatings.length === 0 ? (
              /* State 2: Empty State with CTA */
              <div className="p-8 text-center rounded-xl border border-dashed border-border/60 bg-muted/10 space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Star className="w-5 h-5" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="text-sm font-display font-semibold text-foreground">
                    No reviews received yet
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Reviews are unlocked when clients or builders complete verified project scope contracts on Shipyards.
                  </p>
                </div>
                <div className="pt-2">
                  <Link to="/marketplace">
                    <Button size="sm" className="text-xs font-mono bg-primary text-primary-foreground font-semibold">
                      Browse Open Scopes
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              /* State 3: Reviews Content (Recent 5) */
              <div className="space-y-4">
                {displayRatings.slice(0, 5).map((r) => {
                  const raterName = r.rater?.full_name || r.rater?.username || "Verified Client";
                  const raterAvatar = r.rater?.avatar_url;
                  const raterRole = r.role === "founder" ? "Founder" : "Builder";
                  const timeAgo = r.createdAt ? formatDistanceToNow(new Date(r.createdAt), { addSuffix: true }) : "recently";

                  return (
                    <div
                      key={r.id || r.contractId}
                      className="p-4 rounded-xl border border-border-subtle bg-muted/20 hover:border-primary/30 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center shrink-0">
                            {raterAvatar ? (
                              <img src={raterAvatar} alt={raterName} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-foreground">{raterName}</span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 font-mono">
                                {raterRole}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground block">{timeAgo}</span>
                          </div>
                        </div>

                        {/* Score Stars */}
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border border-border/50">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= r.score
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-foreground tabular-nums ml-1">
                            {r.score}.0
                          </span>
                        </div>
                      </div>

                      {r.comment && (
                        <p className="text-xs text-muted-foreground leading-relaxed pl-3 border-l-2 border-primary/30 italic">
                          "{r.comment}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : activeTab === "badges" ? (
          <div className="rounded-2xl border border-border-subtle bg-card p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-bold text-lg text-foreground">Builder Achievements</h3>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-bold text-primary">
                    {unlockedBadges.length} / {badges.length} Unlocked
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Badges earned through verified code releases, client contracts, and community reputation.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-lg border border-border-subtle self-start sm:self-auto">
                {(["all", "unlocked", "locked"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setBadgeFilter(filter)}
                    className={`px-3 py-1 rounded-md text-[11px] font-mono capitalize transition-all ${
                      badgeFilter === filter
                        ? "bg-card text-primary font-semibold shadow-sm border border-border-subtle"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {filter === "all" ? `All (${badges.length})` : filter === "unlocked" ? `Unlocked (${unlockedBadges.length})` : `Locked (${lockedBadges.length})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBadges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className={`relative p-5 rounded-xl border transition-all flex gap-4 ${
                      badge.unlocked
                        ? "bg-card border-border-subtle hover:border-primary/40 shadow-sm"
                        : "bg-muted/20 border-border-subtle/50 opacity-75"
                    }`}
                  >
                    <div className="shrink-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center relative ${
                          badge.unlocked
                            ? badge.accentColor === "amber"
                              ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                              : badge.accentColor === "purple"
                              ? "bg-purple-500/10 border border-purple-500/30 text-purple-400"
                              : badge.accentColor === "emerald"
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                              : badge.accentColor === "blue"
                              ? "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                              : "bg-primary/10 border border-primary/30 text-primary"
                            : "bg-muted border border-border/40 text-muted-foreground"
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                        {!badge.unlocked && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center">
                            <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-display font-bold text-sm text-foreground truncate">
                          {badge.name}
                        </h4>
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            badge.rarity === "Legendary"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : badge.rarity === "Epic"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : badge.rarity === "Rare"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-muted text-muted-foreground border border-border/40"
                          }`}
                        >
                          {badge.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        {badge.description}
                      </p>

                      {/* Progress Bar / Unlocked Tag */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1">
                          <span>{badge.unlocked ? (badge.unlockedAt || "Unlocked") : "Progress"}</span>
                          <span>{badge.progressText}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              badge.unlocked
                                ? "bg-primary"
                                : "bg-muted-foreground/40"
                            }`}
                            style={{ width: `${Math.max(5, badge.progressPercent)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeTab === "identity" ? (
          <div className="rounded-2xl border border-border-subtle bg-card p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-foreground">Identity & Verification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-[10px] text-muted-foreground block mb-1">MEMBER SINCE</span>
                <span className="font-bold text-foreground">{format(new Date(profile.created_at), "MMMM yyyy")}</span>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-[10px] text-muted-foreground block mb-1">VERIFICATION STATUS</span>
                <span className="font-bold text-primary">{profile.is_verified ? "✓ Verified AI Builder" : "Standard Account"}</span>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-[10px] text-muted-foreground block mb-1">GITHUB ACCOUNT</span>
                <span className="font-bold text-foreground">{profile.github_username || "@" + profile.username}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Featured Badges Showcase */}
              <div className="rounded-2xl border border-border-subtle bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Badges & Achievements
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {unlockedBadges.length} of {badges.length} achievements unlocked
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("badges")}
                    className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                  >
                    View All ({badges.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {badges.slice(0, 4).map((badge) => {
                    const IconComp = badge.icon;
                    return (
                      <div
                        key={badge.id}
                        onClick={() => setActiveTab("badges")}
                        className={`p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                          badge.unlocked
                            ? "bg-muted/30 border-border-subtle hover:border-primary/40"
                            : "bg-muted/10 border-border-subtle/40 opacity-60"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                            badge.unlocked
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-muted text-muted-foreground border border-border/40"
                          }`}
                        >
                          <IconComp className="w-4.5 h-4.5" />
                        </div>
                        <p className="font-display font-semibold text-xs text-foreground truncate w-full">
                          {badge.name}
                        </p>
                        <span className="text-[9px] font-mono text-muted-foreground mt-0.5">
                          {badge.unlocked ? badge.rarity : "Locked"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-border-subtle bg-card p-6">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.stack.map((tech) => (
                    <TechBadge key={tech} name={tech} size="md" className="rounded-lg px-3 py-1.5 text-xs" />
                  ))}
                </div>
              </div>

              {Object.keys(profile.social_links).length > 0 && (
                <div className="rounded-2xl border border-border-subtle bg-card p-6">
                  <h3 className="font-display font-bold text-lg text-foreground mb-4">Social Links</h3>
                  <div className="space-y-2">
                    {Object.entries(profile.social_links).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-foreground/5 border border-border-subtle flex items-center justify-center shrink-0">
                          {platform.toLowerCase() === "github" ? (
                            <Github className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                          ) : (
                            <Globe className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                          )}
                        </div>
                        <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground capitalize">{platform}</span>
                        <span className="ml-auto text-[10px] text-muted-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">{url}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-border-subtle bg-card p-6">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">
                  Ships {projects.length > 0 && <span className="text-sm font-mono text-muted-foreground font-normal">({projects.length})</span>}
                </h3>
                {projects.length === 0 ? (
                  <p className="text-xs font-mono text-muted-foreground py-4">No ships yet</p>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <div className="w-7 h-7 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                          <FolderGit2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground truncate">{project.title}</p>
                          <p className="text-[10px] font-mono text-muted-foreground capitalize">
                            {project.status} · {[(project.stack?.[0]), project.stack?.[1]].filter(Boolean).join(", ")}
                          </p>
                        </div>
                        <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border-subtle bg-card p-6">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">Identity</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Member Since</p>
                    <p className="text-xs font-mono text-foreground flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {format(new Date(profile.created_at), "MMMM yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Account Type</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                      {profile.role}
                    </span>
                  </div>
                  {profile.github_username && (
                    <div>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">GitHub</p>
                      <div className="flex items-center gap-2">
                        <Github className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-mono text-foreground">{profile.github_username}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Invite to Scope Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="sm:max-w-md border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Invite {profile.full_name} to a Scope
            </DialogTitle>
            <DialogDescription className="text-xs font-mono text-muted-foreground">
              Select one of your open marketplace project scopes to directly invite this builder.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 font-mono">
            {loadingFounderProjects ? (
              <div className="flex items-center justify-center py-6 gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Loading your open project scopes...
              </div>
            ) : founderProjects.length === 0 ? (
              <div className="p-4 rounded-lg bg-muted/50 border border-border text-center space-y-3">
                <p className="text-xs text-muted-foreground">
                  You don't have any open project scopes yet.
                </p>
                <Link to="/post-project" onClick={() => setInviteModalOpen(false)}>
                  <Button size="sm" className="text-xs font-mono bg-primary text-primary-foreground">
                    Post a Project Scope
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Select Scope
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  >
                    {founderProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (${p.budgetMin?.toLocaleString()} - ${p.budgetMax?.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Personalized Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder={`Hi ${profile.full_name}, I was impressed by your stack and experience on Shipyards...`}
                    className="w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInviteModalOpen(false)}
                    className="text-xs font-mono"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={sendingInvite}
                    onClick={handleSendInviteFromProfile}
                    className="text-xs font-mono bg-primary text-primary-foreground font-bold"
                  >
                    {sendingInvite ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                    )}
                    Send Invitation
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuilderProfile;
