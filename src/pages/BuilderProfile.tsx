import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { User, FolderGit2, Star, Zap, FileText, Check, Globe, Github, ExternalLink, Calendar, ArrowLeft, MapPin, Loader2, MessageSquare, UserPlus, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { profileApi, projectApi } from "@/lib/api";
import type { Profile, Project } from "@/types";
import TechBadge from "@/components/TechBadge";
import { useAuth } from "@/context/AuthContext";
import { notify as toast } from "@/lib/notify";
import { sendNotification } from "@/lib/notifications";
import { Button } from "@/components/ui/button";

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
  const { username } = useParams<{ username: string }>();
  const cleanUsername = username?.replace(/^@/, "") || "";
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "identity">("overview");

  const handleFollow = () => {
    if (!user) {
      toast.error("Sign in to follow builders", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/login"),
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
          onClick: () => navigate("/login"),
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
            setError(true);
          }
        }
      } catch {
        if (cleanUsername === "demo") {
          setProfile(MOCK_DEMO_PROFILE);
          setProjects(MOCK_PROJECTS);
        } else if (cleanUsername === "priya_ships") {
          setProfile(MOCK_PROFILE);
          setProjects(MOCK_PROJECTS);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [cleanUsername]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-sm font-mono text-muted-foreground">{`> loading ${username}...`}</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <User className="w-12 h-12 text-muted-foreground" />
          <p className="text-sm font-mono text-muted-foreground">{`> builder "${username}" not found`}</p>
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

                {/* Follow & Message Buttons */}
                <div className="flex items-center gap-2">
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
            { label: "GitHub Stars", value: profile.stars_count, icon: Star, color: "accent" },
            { label: "Reputation", value: `${profile.reputation}%`, icon: Zap, color: "secondary" },
            { label: "Active Contracts", value: projects.filter(p => p.status === "verified").length, icon: FileText, color: "primary" },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-border-subtle bg-card p-4">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-3 ${
                stat.color === "primary" ? "bg-primary/10 border border-primary/20" :
                stat.color === "accent" ? "bg-accent/10 border border-accent/20" :
                "bg-secondary/10 border border-secondary/20"
              }`}>
                <stat.icon className={`w-3.5 h-3.5 ${
                  stat.color === "primary" ? "text-primary" :
                  stat.color === "accent" ? "text-accent" :
                  "text-secondary"
                }`} />
              </div>
              <p className="font-display font-bold text-2xl text-foreground">{stat.value}</p>
              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
          {(["overview", "projects", "identity"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-mono capitalize transition-all ${
                activeTab === tab
                  ? "bg-primary/10 border border-primary/20 text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              {tab === "projects" ? `Projects (${projects.length})` : tab}
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
    </div>
  );
};

export default BuilderProfile;
