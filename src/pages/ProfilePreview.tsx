import { User, FolderGit2, FileText, Zap, Star, Check, Pencil, Globe, Github, ExternalLink, Calendar, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import TechBadge from "@/components/TechBadge";

const MOCK_PROFILE = {
  full_name: "Arjun Mehta",
  username: "arjun_builds",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun&backgroundColor=b6e3f4",
  bio: "Full-stack AI builder. Shipped 12+ AI products including customer support bots and autonomous agents. Passionate about turning complex AI workflows into shippable products.",
  role: "builder" as const,
  is_verified: true,
  ships_count: 12,
  stars_count: 342,
  vibe_score: 94,
  created_at: "2024-03-15T00:00:00Z",
  stack: ["OpenAI", "LangChain", "Supabase", "Next.js", "TypeScript", "Python", "Postgres", "Redis"],
  social_links: {
    github: "https://github.com/arjun_builds",
    twitter: "https://twitter.com/arjun_builds",
    linkedin: "https://linkedin.com/in/arjun-b",
    website: "https://arjunbuilds.dev",
  },
  github_username: "arjun_builds",
};

const MOCK_PROJECTS = [
  { id: "1", title: "AI Customer Support Bot", status: "verified" },
  { id: "2", title: "Autonomous CRM Agent", status: "docked" },
  { id: "3", title: "Multi-Agent Pipeline", status: "docked" },
  { id: "4", title: "RAG Knowledge Base", status: "draft" },
];

const ProfilePreview = () => {
  return (
    <div className="min-h-dvh bg-background">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 h-14 border-b border-border-subtle bg-background/80 backdrop-blur-xl flex items-center px-4 z-50">
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
      </header>

      {/* Spacer for fixed top bar */}
      <div className="h-14" />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Header */}
        <div className="rounded-2xl border border-border-subtle bg-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                {MOCK_PROFILE.avatar_url ? (
                  <img src={MOCK_PROFILE.avatar_url} alt={MOCK_PROFILE.full_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-primary-foreground" />
                )}
              </div>
              <button type="button" aria-label="Change profile photo" className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary border-2 border-background flex items-center justify-center hover:bg-primary/80 transition-colors">
                <Pencil className="w-3 h-3 text-primary-foreground" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                  {MOCK_PROFILE.full_name}
                </h1>
                {MOCK_PROFILE.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm font-mono text-muted-foreground mb-2">
                @{MOCK_PROFILE.username}
              </p>
              <p className="text-sm text-muted-foreground mb-4 max-w-xl">
                {MOCK_PROFILE.bio}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                  {MOCK_PROFILE.role}
                </span>
                {MOCK_PROFILE.stack.slice(0, 3).map((tech) => (
                  <TechBadge key={tech} name={tech} size="sm" />
                ))}
                {MOCK_PROFILE.stack.length > 3 && (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    +{MOCK_PROFILE.stack.length - 3} more
                  </span>
                )}
              </div>
            </div>
            <button type="button" className="self-start px-4 py-2 rounded-lg border border-border-subtle bg-foreground/5 text-xs font-bold text-foreground hover:bg-foreground/10 hover:border-foreground/20 transition-all flex items-center gap-2 shrink-0">
              <Pencil className="w-3 h-3" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Ships Docked", value: MOCK_PROFILE.ships_count, icon: FolderGit2, color: "primary" },
            { label: "GitHub Stars", value: MOCK_PROFILE.stars_count, icon: Star, color: "accent" },
            { label: "Vibe Score", value: `${MOCK_PROFILE.vibe_score}%`, icon: Zap, color: "secondary" },
            { label: "Active Contracts", value: 3, icon: FileText, color: "primary" },
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

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Stack + Social */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tech Stack */}
            <div className="rounded-2xl border border-border-subtle bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-foreground">Tech Stack</h2>
                <button type="button" className="text-[10px] font-mono text-primary hover:text-primary transition-colors flex items-center gap-1">
                  <Pencil className="w-3 h-3" aria-hidden="true" /> Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {MOCK_PROFILE.stack.map((tech) => (
                  <TechBadge key={tech} name={tech} size="md" className="rounded-lg px-3 py-1.5 text-xs" />
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-2xl border border-border-subtle bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-foreground">Social Links</h2>
                <button type="button" className="text-[10px] font-mono text-primary hover:text-primary transition-colors flex items-center gap-1">
                  <Pencil className="w-3 h-3" aria-hidden="true" /> Edit
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(MOCK_PROFILE.social_links).map(([platform, url]) => (
                  <a key={platform} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors group">
                    <div className="w-7 h-7 rounded-lg bg-foreground/5 border border-border-subtle flex items-center justify-center shrink-0">
                      {platform.toLowerCase() === "github" ? <Github className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" /> : <Globe className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />}
                    </div>
                    <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground capitalize">{platform}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">{url}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Identity + Recent */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border-subtle bg-card p-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-4">Identity</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                  <p className="text-xs font-mono text-foreground truncate">arjun@shipyard.dev</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Member Since</p>
                  <p className="text-xs font-mono text-foreground">March 2024</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Account Type</p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                    Builder
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">GitHub</p>
                  <div className="flex items-center gap-2">
                    <Github className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-mono text-foreground">{MOCK_PROFILE.github_username}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Ships */}
            <div className="rounded-2xl border border-border-subtle bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-foreground">Recent Ships</h2>
                <button type="button" className="text-[10px] font-mono text-primary hover:text-primary transition-colors">View all</button>
              </div>
              <div className="space-y-3">
                {MOCK_PROJECTS.map((project) => (
                  <div key={project.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                      <FolderGit2 className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{project.title}</p>
                      <p className="text-[10px] font-mono text-muted-foreground capitalize">{project.status}</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePreview;
