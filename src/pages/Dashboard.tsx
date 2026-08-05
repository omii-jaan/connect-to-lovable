import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { profileApi, projectApi, contractApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Profile, Project, Contract, ContractMilestone, HireProject, Invitation } from "@/types";
import { MOCK_HIRE_PROJECTS, MOCK_INVITATIONS } from "@/lib/marketplace-data";
import { legacyToast as toast } from "@/lib/notify";
import { format, formatDistanceToNow } from "date-fns";
import {
  Bell, LayoutDashboard, FolderGit2, FileText, User, Settings, Briefcase,
  LogOut, Plus, ExternalLink, Loader2, ChevronRight, Search, Zap,
  List, Grid3X3, Trash2, Eye, Star, Check, Pencil, Mail, Calendar, Globe, Github,
  X, Save, Loader, Image, ArrowUpCircle, Clock, AlertTriangle, CircleDollarSign, MessageCircle, Sun, Moon, Monitor, Shield,
  Sparkles, BookmarkCheck, X as XIcon, Send, User as UserIcon, BadgeCheck, BarChart3, CheckCheck
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, color: "primary" },
  { id: "ships", label: "Ships", icon: FolderGit2, color: "primary" },
  { id: "projects", label: "Projects", icon: Briefcase, color: "primary" },
  { id: "profile", label: "Profile", icon: User, color: "secondary" },
  { id: "settings", label: "Settings", icon: Settings, color: "muted" },
];

const Dashboard = ({ defaultTab = "overview" }: { defaultTab?: string }) => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newStackTag, setNewStackTag] = useState("");
  const [newLinkPlatform, setNewLinkPlatform] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [editForm, setEditForm] = useState<{
    full_name: string;
    username: string;
    bio: string;
    stack: string[];
    social_links: Record<string, string>;
  }>({ full_name: "", username: "", bio: "", stack: [], social_links: {} });
  const { theme, setTheme } = useTheme();
  const [notifPrefs, setNotifPrefs] = useState({ email: true, inApp: true, marketing: false });
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const startEditing = () => {
    setEditForm({
      full_name: profile?.full_name || user?.user_metadata?.full_name || "",
      username: profile?.username || user?.user_metadata?.user_name || "",
      bio: profile?.bio || "",
      stack: profile?.stack ? [...profile.stack] : [],
      social_links: profile?.social_links ? { ...profile.social_links } : {},
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setNewStackTag("");
    setNewLinkPlatform("");
    setNewLinkUrl("");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await profileApi.update({
        username: editForm.username,
        full_name: editForm.full_name,
        bio: editForm.bio,
        stack: editForm.stack,
        social_links: editForm.social_links,
      });
      setProfile(updated);
      setIsEditing(false);
      toast({ title: "Profile saved", description: "Your profile has been updated successfully", duration: 4000 });
    } catch (err) {
      toast({ title: "Save failed", description: "Could not update profile. Please try again.", variant: "destructive", duration: 5000 });
    } finally {
      setSaving(false);
    }
  };

  const addStackTag = () => {
    const tag = newStackTag.trim();
    if (tag && !editForm.stack.includes(tag)) {
      setEditForm((prev) => ({ ...prev, stack: [...prev.stack, tag] }));
    }
    setNewStackTag("");
  };

  const removeStackTag = (tag: string) => {
    setEditForm((prev) => ({ ...prev, stack: prev.stack.filter((t) => t !== tag) }));
  };

  const addSocialLink = () => {
    const platform = newLinkPlatform.trim().toLowerCase();
    const url = newLinkUrl.trim();
    if (platform && url) {
      setEditForm((prev) => ({ ...prev, social_links: { ...prev.social_links, [platform]: url } }));
    }
    setNewLinkPlatform("");
    setNewLinkUrl("");
  };

  const removeSocialLink = (platform: string) => {
    setEditForm((prev) => {
      const links = { ...prev.social_links };
      delete links[platform];
      return { ...prev, social_links: links };
    });
  };

  const updateFormField = (field: string, value: string | string[]) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || user?.user_metadata?.user_name || "Builder";
  const userRole = user?.user_metadata?.role || "Builder";

  const [stats, setStats] = useState({
    shipsCount: 0,
    activeContracts: 0,
    reputation: 0,
    earnings: 0,
  });

  const [shipView, setShipView] = useState<"grid" | "list">("grid");
  const [shipSearch, setShipSearch] = useState("");
  const [shipStatus, setShipStatus] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const activityFeed = [
    { time: "2m ago", event: "> project.dock()", detail: "AI Chatbot deployed to production", status: "success" },
    { time: "1h ago", event: "> contract.signed()", detail: "New milestone agreement with TechCorp", status: "success" },
    { time: "3h ago", event: "> profile.update()", detail: "Stack updated: added Rust, Solidity", status: "info" },
    { time: "1d ago", event: "> payment.received()", detail: "$2,400 — Milestone #3 completed", status: "success" },
    { time: "2d ago", event: "> review.submitted()", detail: "5-star review from Alice Chen", status: "accent" },
  ];

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;

      try {
        const [profileData, projectsData] = await Promise.all([
          profileApi.getCurrent(),
          projectApi.getAll({ builder_id: user.id, limit: 10 }),
        ]);

        setProfile(profileData);
        setProjects(projectsData || []);
        setStats({
          shipsCount: projectsData?.length || 0,
          activeContracts: 0,
          reputation: profileData?.reputation || 0,
          earnings: 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs font-mono text-muted-foreground">{`> connecting to bridge...`}</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* ---- Sidebar ---- */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-border/50 bg-muted shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border/50">
          <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-base tracking-wider gradient-text-cyan">SHIPYARD</span>
        </div>

        {/* User card */}
        <div className="px-4 py-3.5 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt={userName} className="w-8 h-8 rounded-full" />
              ) : (
                <User className="w-3.5 h-3.5 text-primary-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
              <p className="text-[10px] font-mono text-primary">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/[0.04] border border-transparent"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? `text-primary` : "text-muted-foreground"}`} />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto w-1 h-4 rounded-full bg-primary" />}
              </button>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 pb-4">
          <button
            onClick={() => { signOut(); navigate("/"); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all border border-transparent"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Bottom status */}
        <div className="px-4 py-2.5 border-t border-border/50 flex items-center justify-between">
          <span className="text-[9px] font-mono text-muted-foreground">{`[bridge] $`}</span>
          <span className="text-[9px] font-mono text-accent">{`● live`}</span>
        </div>
      </aside>

      {/* ---- Main Area ---- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ---- Top Bar ---- */}
        <header className="h-14 border-b border-border-subtle bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground hidden sm:block">{`[~] $`}</span>
            <span className="text-xs font-mono text-primary">{`./${activeTab}`}</span>
            <span className="inline-block w-1.5 h-4 bg-primary/60 animate-pulse hidden sm:block" />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search dashboard"
              className="w-9 h-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary text-[7px] font-bold text-primary-foreground flex items-center justify-center">3</span>
            </button>
            <div className="w-px h-5 bg-foreground/10 mx-1" />
            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt={userName} className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-3.5 h-3.5 text-primary-foreground" />
                )}
              </div>
              <span className="text-xs font-semibold text-foreground hidden sm:block">{userName}</span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-muted/80 border-b border-border-subtle overflow-x-auto no-scrollbar shrink-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all min-h-[36px] ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
                    : "text-muted-foreground hover:text-foreground bg-card/40 border border-transparent"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* ---- Content ---- */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
          {/* Overview tab */}
          {activeTab === "overview" && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                    Welcome back,{" "}
                    <span className="gradient-text-cyan">{userName}</span>
                  </h1>
                  <p className="text-xs font-mono text-muted-foreground mt-1">{`> bridge.status · all systems nominal`}</p>
                </div>
                <Link
                  to="/dashboard/projects/new"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-bold text-xs glow-cyan hover:brightness-110 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Dock New Ship
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Ships Docked", value: stats.shipsCount, icon: FolderGit2, color: "primary", sparkline: [2, 3, 1, 4, 3, 5, stats.shipsCount] },
                  { label: "Active Contracts", value: stats.activeContracts, icon: FileText, color: "accent", sparkline: [0, 1, 0, 2, 1, 1, stats.activeContracts] },
                  { label: "Reputation", value: `${stats.reputation}%`, icon: Zap, color: "secondary", sparkline: [70, 75, 72, 80, 78, 85, stats.reputation] },
                  { label: "Earnings", value: `$${stats.earnings.toLocaleString()}`, icon: LayoutDashboard, color: "primary", sparkline: [0, 400, 200, 800, 600, 1200, stats.earnings] },
                ].map((stat, i) => (
                    <div key={i} className="rounded-xl border border-border/50 bg-muted p-4 hover:border-primary/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
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
                      <span className="text-[9px] font-mono uppercase text-muted-foreground">Live</span>
                    </div>
                    <p className="font-display font-bold text-2xl text-foreground">{stat.value}</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{stat.label}</p>
                    {/* Simple sparkline */}
                    <div className="flex items-end gap-[2px] mt-2 h-6">
                      {stat.sparkline.map((v, j) => (
                        <div
                          key={j}
                          className="w-full rounded-[1px]"
                          style={{
                            height: `${Math.max((v / Math.max(...stat.sparkline, 1)) * 100, 8)}%`,
                            backgroundColor: `hsl(${i === 0 ? "183, 100%, 50%" : i === 1 ? "142, 76%, 55%" : i === 2 ? "270, 60%, 62%" : "183, 100%, 50%"})`,
                            opacity: 0.4 + (j / stat.sparkline.length) * 0.4,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity feed + Ships */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity */}
                <div className="lg:col-span-1 rounded-xl border border-border/50 bg-muted overflow-hidden">
                  <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                    <span className="text-xs font-mono text-foreground font-semibold">Activity</span>
                    <span className="text-[9px] font-mono text-muted-foreground">tail -f</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {activityFeed.map((item, i) => (
                      <div key={i} className="px-4 py-2.5 hover:bg-card/[0.02] transition-colors">
                        <div className="flex items-start gap-2">
                          <div className="flex flex-col items-center gap-0.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "success" ? "bg-accent" :
                              item.status === "info" ? "bg-primary" :
                              "bg-secondary"
                            }`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-[11px] font-mono ${
                              item.status === "success" ? "text-accent" : item.status === "info" ? "text-primary" : "text-secondary"
                            }`}>
                              {item.event}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
                            <p className="text-[9px] font-mono text-muted-foreground mt-0.5">{item.time}</p>
                          </div>
                          <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ships */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-mono font-semibold text-foreground">{`> ls ./ships`}</h2>
                    <Link to="/dashboard/projects" className="text-[10px] font-mono text-primary hover:text-foreground transition-colors">
                      view all →
                    </Link>
                  </div>

                  {projects.length === 0 ? (
                    <div className="rounded-xl border border-border/50 bg-muted p-8 text-center">
                      <FolderGit2 className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm font-semibold text-foreground mb-1">No ships docked yet</p>
                      <p className="text-xs text-muted-foreground mb-4">Connect your repo and launch your first ship.</p>
                      <Link
                        to="/dashboard/projects/new"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-bold text-xs glow-cyan hover:brightness-110 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        Dock Your First Ship
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {projects.slice(0, 4).map((project) => (
                        <Link
                          key={project.id}
                          to={`/dashboard/projects/${project.id}`}
                          className="group rounded-xl border border-border/50 bg-muted p-4 hover:border-primary/20 transition-all"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                              <FolderGit2 className="w-4 h-4 text-primary" />
                            </div>
                            <span className={`px-2 py-0.5 text-[10px] font-mono rounded-md ${
                              project.status === "verified"
                                ? "bg-accent/10 text-accent border border-accent/20"
                                : project.status === "docked"
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "bg-muted text-muted-foreground border border-border"
                            }`}>
                              {project.status}
                            </span>
                          </div>
                          <h3 className="font-display font-bold text-sm text-foreground mb-0.5 group-hover:text-primary transition-colors truncate">
                            {project.title}
                          </h3>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mb-2">
                            {project.description || "No description"}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {project.stack?.slice(0, 3).map((tech: string) => (
                              <span key={tech} className="px-1.5 py-0.5 text-[9px] rounded bg-muted/50 text-muted-foreground font-mono">
                                {tech}
                              </span>
                            ))}
                            {project.stack && project.stack.length > 3 && (
                              <span className="px-1.5 py-0.5 text-[9px] rounded bg-muted/50 text-muted-foreground font-mono">
                                +{project.stack.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                            <span className="text-[9px] font-mono text-muted-foreground">
                              {format(new Date(project.created_at), "MMM d")}
                            </span>
                            {project.live_url && (
                              <ExternalLink className="w-3 h-3 text-primary" />
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { to: "/dashboard/projects/new", label: "Dock New Ship", desc: "Connect repo, verify, go live", icon: Plus, color: "primary" },
                  { to: "/dashboard/profile", label: "Builder Profile", desc: "Update stack, bio, availability", icon: Settings, color: "secondary" },
                  { to: "/dashboard/contracts", label: "Active Contracts", desc: "Review milestones, get paid", icon: FileText, color: "accent" },
                ].map((item, i) => (
                  <Link
                    key={i}
                    to={item.to}
                    className="group rounded-xl border border-border/50 bg-muted p-4 hover:border-primary/20 transition-all flex items-center gap-3"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                      item.color === "primary" ? "bg-primary/10 border border-primary/20" :
                      item.color === "secondary" ? "bg-secondary/10 border border-secondary/20" :
                      "bg-accent/10 border border-accent/20"
                    }`}>
                      <item.icon className={`w-4 h-4 ${
                        item.color === "primary" ? "text-primary" :
                        item.color === "secondary" ? "text-secondary" :
                        "text-accent"
                      }`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ships tab */}
          {activeTab === "ships" && (
            <div className="max-w-6xl mx-auto space-y-4">
              {/* Header + actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">{`> ls ./ships`}</h2>
                  <p className="text-xs font-mono text-muted-foreground">{`${projects.length} ships docked`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => setShipView("grid")}
                      className={`p-2 ${shipView === "grid" ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground hover:text-foreground"} transition-colors`}
                    >
                      <Grid3X3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setShipView("list")}
                      className={`p-2 ${shipView === "list" ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground hover:text-foreground"} transition-colors`}
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Link
                    to="/dashboard/projects/new"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-bold text-xs glow-cyan hover:brightness-110 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    Dock Ship
                  </Link>
                </div>
              </div>

              {/* Search + filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={shipSearch}
                    onChange={(e) => setShipSearch(e.target.value)}
                    placeholder="Search ships..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-all font-mono"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "docked", "verified", "draft"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setShipStatus(s)}
                      className={`px-3 py-2 rounded-lg text-[10px] font-mono font-semibold border transition-all ${
                        shipStatus === s
                          ? "bg-primary/15 text-primary border-primary/30"
                          : "bg-muted text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {s === "all" ? "All" : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ships content */}
              {projects.length === 0 ? (
                <div className="rounded-xl border border-border/50 bg-muted p-12 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <FolderGit2 className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-mono text-foreground mb-1">{`> ls ./ships`}</p>
                  <p className="text-[11px] font-mono text-muted-foreground mb-2">{`# no ships found`}</p>
                  <p className="text-xs text-muted-foreground mb-5">Dock your first ship to get started.</p>
                  <Link
                    to="/dashboard/projects/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-bold text-xs glow-cyan hover:brightness-110 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    dock new_ship --help
                  </Link>
                </div>
              ) : shipView === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {projects
                    .filter((p) => shipStatus === "all" || p.status === shipStatus)
                    .filter((p) => !shipSearch || p.title.toLowerCase().includes(shipSearch.toLowerCase()))
                    .map((project) => (
                      <div key={project.id} className="group rounded-xl border border-border/50 bg-muted p-4 hover:border-primary/20 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <FolderGit2 className="w-4 h-4 text-primary" />
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-mono rounded-md border ${
                            project.status === "verified"
                              ? "bg-accent/10 text-accent border-accent/20"
                              : project.status === "docked"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-sm text-foreground mb-0.5 truncate group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mb-2">
                          {project.description || "No description"}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.stack?.slice(0, 3).map((tech: string) => (
                            <span key={tech} className="px-1.5 py-0.5 text-[9px] rounded bg-muted/50 text-muted-foreground font-mono">{tech}</span>
                          ))}
                          {project.stack?.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[9px] rounded bg-muted/50 text-muted-foreground font-mono">+{project.stack.length - 3}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground">
                              <Star className="w-2.5 h-2.5" />
                              {project.views_count || 0}
                            </span>
                            <span className="text-[9px] font-mono text-muted-foreground">
                              {format(new Date(project.created_at), "MMM d")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {project.live_url && (
                              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-1 rounded text-muted-foreground hover:text-primary transition-colors">
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            <button
                              onClick={async () => {
                                if (confirm(`Delete "${project.title}"?`)) {
                                  setDeleting(project.id);
                                  try {
                                    await projectApi.delete(project.id);
                                    setProjects((prev) => prev.filter((p) => p.id !== project.id));
                                  } catch (err) {
                                    console.error(err);
                                  }
                                  setDeleting(null);
                                }
                              }}
                              disabled={deleting === project.id}
                              className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                            >
                              {deleting === project.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border/50 bg-muted overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border/50 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold hidden sm:table-cell">Stack</th>
                        <th className="px-4 py-3 font-semibold hidden md:table-cell">Views</th>
                        <th className="px-4 py-3 font-semibold hidden md:table-cell">Docked</th>
                        <th className="px-4 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects
                        .filter((p) => shipStatus === "all" || p.status === shipStatus)
                        .filter((p) => !shipSearch || p.title.toLowerCase().includes(shipSearch.toLowerCase()))
                        .map((project) => (
                          <tr key={project.id} className="border-b border-border/50 last:border-b-0 hover:bg-card/[0.02] transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <FolderGit2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span className="text-xs font-semibold text-foreground">{project.title}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 text-[9px] font-mono rounded-md border ${
                                project.status === "verified"
                                  ? "bg-accent/10 text-accent border-accent/20"
                                  : project.status === "docked"
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <div className="flex gap-1">
                                {project.stack?.slice(0, 2).map((tech: string) => (
                                  <span key={tech} className="px-1.5 py-0.5 text-[9px] rounded bg-muted/50 text-muted-foreground font-mono">{tech}</span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-xs font-mono text-muted-foreground">
                              {project.views_count || 0}
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-xs font-mono text-muted-foreground">
                              {format(new Date(project.created_at), "MMM d")}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {project.live_url && (
                                  <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-muted-foreground hover:text-primary transition-colors">
                                    <Eye className="w-3 h-3" />
                                  </a>
                                )}
                                <button
                                  onClick={async () => {
                                    if (confirm(`Delete "${project.title}"?`)) {
                                      setDeleting(project.id);
                                      try {
                                        await projectApi.delete(project.id);
                                        setProjects((prev) => prev.filter((p) => p.id !== project.id));
                                      } catch (err) {
                                        console.error(err);
                                      }
                                      setDeleting(null);
                                    }
                                  }}
                                  disabled={deleting === project.id}
                                  className="p-1.5 rounded text-muted-foreground hover:text-destructive transition-colors"
                                >
                                  {deleting === project.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeTab === "profile" && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Profile Header */}
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                      {profile?.avatar_url || user?.user_metadata?.avatar_url ? (
                        <label className="w-full h-full cursor-pointer">
                          <img src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={profile?.full_name || userName} className="w-full h-full object-cover" />
                          {isEditing && <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity"><Image className="w-6 h-6 text-foreground" /></div>}
                        </label>
                      ) : (
                        <User className="w-8 h-8 text-primary-foreground" />
                      )}
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary border-2 border-background flex items-center justify-center hover:bg-primary/80 transition-colors">
                        <Pencil className="w-3 h-3 text-primary-foreground" />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={editForm.full_name}
                          onChange={(e) => updateFormField("full_name", e.target.value)}
                          placeholder="Display name"
                          className="w-full bg-transparent border-b border-border focus:border-primary outline-none font-display font-bold text-2xl md:text-3xl text-foreground pb-1 mb-2"
                        />
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => updateFormField("username", e.target.value)}
                          placeholder="username"
                          className="w-full bg-transparent border-b border-border focus:border-primary outline-none text-sm font-mono text-muted-foreground pb-1 mb-2"
                        />
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => updateFormField("bio", e.target.value)}
                          placeholder="Tell builders and founders about yourself..."
                          rows={3}
                          className="w-full bg-transparent border border-border focus:border-primary outline-none rounded-lg text-sm text-foreground p-2 mb-4 resize-none"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                            {profile?.role || userRole}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                            {profile?.full_name || userName}
                          </h1>
                          {profile?.is_verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                              <Check className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-mono text-muted-foreground mb-2">
                          @{profile?.username || user?.user_metadata?.user_name || "builder"}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4 max-w-xl">
                          {profile?.bio || "No bio yet. Dock your first project to get started."}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                            {profile?.role || userRole}
                          </span>
                          {profile?.stack?.slice(0, 3).map((tech) => (
                            <span key={tech} className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-muted/50 border border-border text-muted-foreground">
                              {tech}
                            </span>
                          ))}
                          {(profile?.stack?.length || 0) > 3 && (
                            <span className="text-[10px] font-mono text-muted-foreground">
                              +{profile!.stack.length - 3} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {!isEditing && (
                    <button onClick={startEditing} className="self-start px-4 py-2 rounded-lg border border-border bg-muted/50 text-xs font-bold text-foreground hover:bg-foreground/10 hover:border-foreground/20 transition-all flex items-center gap-2 shrink-0">
                      <Pencil className="w-3 h-3" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Ships Docked", value: profile?.ships_count || 0, icon: FolderGit2, color: "primary" },
                  { label: "GitHub Stars", value: profile?.stars_count || 0, icon: Star, color: "accent" },
                  { label: "Reputation", value: `${profile?.reputation || 0}%`, icon: Zap, color: "secondary" },
                  { label: "Active Contracts", value: stats.activeContracts, icon: FileText, color: "primary" },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl border border-border/50 bg-card p-4">
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
                  <div className="rounded-2xl border border-border/50 bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-lg text-foreground">Tech Stack</h3>
                      {!isEditing && (
                        <button onClick={startEditing} className="text-[10px] font-mono text-primary hover:text-primary transition-colors flex items-center gap-1">
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {editForm.stack.map((tech) => (
                            <span key={tech} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg bg-muted/50 border border-border text-foreground">
                              {tech}
                              <button onClick={() => removeStackTag(tech)} className="hover:text-destructive transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newStackTag}
                            onChange={(e) => setNewStackTag(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addStackTag(); } }}
                            placeholder="Add a technology..."
                            className="flex-1 bg-transparent border border-border focus:border-primary outline-none rounded-lg text-xs font-mono text-foreground px-3 py-1.5"
                          />
                          <button onClick={addStackTag} disabled={!newStackTag.trim()} className="px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/30 text-primary font-bold text-[10px] hover:bg-primary/30 transition-all disabled:opacity-30 flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                      </>
                    ) : (
                      profile?.stack && profile.stack.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.stack.map((tech) => (
                            <span key={tech} className="px-3 py-1.5 text-xs font-mono rounded-lg bg-muted/50 border border-border text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors">
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground font-mono">{`> stack.empty — add technologies you work with`}</p>
                      )
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="rounded-2xl border border-border/50 bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-lg text-foreground">Social Links</h3>
                      {!isEditing && (
                        <button onClick={startEditing} className="text-[10px] font-mono text-primary hover:text-primary transition-colors flex items-center gap-1">
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <>
                        <div className="space-y-2 mb-3">
                          {Object.entries(editForm.social_links).map(([platform, url]) => (
                            <div key={platform} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/[0.02] border border-border/50">
                              <div className="w-7 h-7 rounded-lg bg-muted/50 border border-border flex items-center justify-center shrink-0">
                                {platform.toLowerCase() === "github" ? <Github className="w-3.5 h-3.5 text-muted-foreground" /> : <Globe className="w-3.5 h-3.5 text-muted-foreground" />}
                              </div>
                              <span className="text-xs font-mono text-muted-foreground capitalize w-20 shrink-0">{platform}</span>
                              <span className="flex-1 text-[10px] font-mono text-foreground truncate">{url}</span>
                              <button onClick={() => removeSocialLink(platform)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newLinkPlatform}
                            onChange={(e) => setNewLinkPlatform(e.target.value)}
                            placeholder="Platform (github, twitter...)"
                            className="w-28 bg-transparent border border-border focus:border-primary outline-none rounded-lg text-xs font-mono text-foreground px-3 py-1.5"
                          />
                          <input
                            type="text"
                            value={newLinkUrl}
                            onChange={(e) => setNewLinkUrl(e.target.value)}
                            placeholder="https://..."
                            className="flex-1 bg-transparent border border-border focus:border-primary outline-none rounded-lg text-xs font-mono text-foreground px-3 py-1.5"
                          />
                          <button onClick={addSocialLink} disabled={!newLinkPlatform.trim() || !newLinkUrl.trim()} className="px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/30 text-primary font-bold text-[10px] hover:bg-primary/30 transition-all disabled:opacity-30 flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                      </>
                    ) : (
                      profile?.social_links && Object.keys(profile.social_links).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(profile.social_links).map(([platform, url]) => (
                            <a key={platform} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors group">
                              <div className="w-7 h-7 rounded-lg bg-muted/50 border border-border flex items-center justify-center shrink-0">
                                {platform.toLowerCase() === "github" ? <Github className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" /> :
                                 platform.toLowerCase() === "twitter" || platform.toLowerCase() === "x" ? <Globe className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" /> :
                                 <Globe className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />}
                              </div>
                              <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground capitalize">{platform}</span>
                              <span className="ml-auto text-[10px] text-muted-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">{url}</span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground font-mono">{`> links.empty — connect your GitHub, Twitter, and more`}</p>
                      )
                    )}
                  </div>
                </div>

                {/* Right: Identity */}
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border/50 bg-card p-6">
                    <h3 className="font-display font-bold text-lg text-foreground mb-4">Identity</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                        <p className="text-xs font-mono text-foreground truncate">{user?.email || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Member Since</p>
                        <p className="text-xs font-mono text-foreground">
                          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Account Type</p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                          {profile?.role || userRole}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">GitHub</p>
                        <div className="flex items-center gap-2">
                          <Github className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs font-mono text-foreground">{profile?.github_username || "Not connected"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Projects */}
                  <div className="rounded-2xl border border-border/50 bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-lg text-foreground">Recent Ships</h3>
                      <button onClick={() => setActiveTab("ships")} className="text-[10px] font-mono text-primary hover:text-primary transition-colors">
                        View all
                      </button>
                    </div>
                    {projects.length > 0 ? (
                      <div className="space-y-3">
                        {projects.slice(0, 4).map((project) => (
                          <div key={project.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                              <FolderGit2 className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-foreground truncate">{project.title}</p>
                              <p className="text-[10px] font-mono text-muted-foreground">{project.status}</p>
                            </div>
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground font-mono">{`> projects.empty — dock your first ship`}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Save/Cancel bar */}
              {isEditing && (
                <div className="sticky bottom-0 flex items-center justify-end gap-3 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 rounded-b-2xl">
                  <button onClick={cancelEditing} disabled={saving} className="px-4 py-2 rounded-lg border border-border bg-muted/50 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all disabled:opacity-50">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-bold text-xs glow-cyan hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2">
                    {saving ? <Loader className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}
          {activeTab === "projects" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-primary">/marketplace</span>
                    <span className="w-1 h-1 rounded-full bg-primary/60 animate-pulse" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-foreground">Marketplace Projects</h2>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">Browse, post, and manage hiring projects</p>
                </div>
                <Link to="/post-project">
                  <Button className="bg-gradient-primary text-primary-foreground font-bold text-xs glow-cyan hover:brightness-110 transition-all h-9">
                    <Plus className="w-4 h-4" />
                    Post a Project
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-border-subtle bg-card shadow-elev-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" /> Open Projects
                    </h3>
                    <Badge variant="secondary" className="text-[9px] font-mono">{MOCK_HIRE_PROJECTS.filter(p => p.status === "open").length} available</Badge>
                  </div>
                  <div className="space-y-1.5">
                    {MOCK_HIRE_PROJECTS.filter(p => p.status === "open").slice(0, 5).map((project, i) => (
                      <motion.div key={project.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                        <Link to={`/project/${project.slug || project.id}`} className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-card/[0.04] hover:border hover:border-border/50 transition-all border border-transparent">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                            <Briefcase className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">{project.title}</p>
                            <p className="text-[9px] font-mono text-muted-foreground">
                              ${project.budget_min.toLocaleString()} – ${project.budget_max.toLocaleString()} · {project.timeline_weeks}w · {project.category}
                            </p>
                          </div>
                          <div className="hidden sm:flex items-center gap-2">
                            <div className="flex items-center gap-1 text-[9px] font-mono text-primary bg-primary/[0.04] rounded-full px-2 py-0.5 border border-primary/10">
                              <Sparkles className="w-2.5 h-2.5" /> {project.interest_count}
                            </div>
                            <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  <Link to="/projects" className="block mt-3 text-center text-[10px] font-mono text-primary hover:text-primary transition-colors py-1.5 rounded-lg hover:bg-card/[0.02]">
                    Browse all projects →
                  </Link>
                </div>

                <div className="rounded-xl border border-border-subtle bg-card shadow-elev-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" /> Your Invitations
                    </h3>
                    <Badge variant="secondary" className="text-[9px] font-mono">{MOCK_INVITATIONS.length} received</Badge>
                  </div>
                  <div className="space-y-2">
                    {MOCK_INVITATIONS.map((inv, i) => (
                      <InvitationCard key={inv.id} inv={inv} index={i} />
                    ))}
                    {MOCK_INVITATIONS.length === 0 && (
                      <p className="text-xs text-muted-foreground font-mono text-center py-6">{`> inbox.empty — no invitations yet`}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border-subtle bg-card shadow-elev-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Matching Preferences
                  </h3>
                  <button className="text-[10px] font-mono text-primary hover:text-primary transition-colors">Edit</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Ideal Projects", value: "AI Agents, Automation" },
                    { label: "Budget Range", value: "$5k – $15k" },
                    { label: "Availability", value: "Immediate" },
                    { label: "Collaboration", value: "Solo or Team" },
                  ].map((pref) => (
                    <div key={pref.label} className="rounded-xl bg-background/80 border border-border/40 p-3.5 hover:border-border/60 transition-colors">
                      <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">{pref.label}</p>
                      <p className="text-xs font-semibold text-foreground">{pref.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border-subtle bg-card shadow-elev-sm p-5">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-accent" /> Quick Stats
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Projects Viewed", value: "142", change: "+12%", positive: true },
                    { label: "Interest Sent", value: "8", change: "+3", positive: true },
                    { label: "Invitations Received", value: "3", change: "+1", positive: true },
                    { label: "Match Rate", value: "94%", change: "+2%", positive: true },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-background/80 border border-border/40 p-3.5">
                      <p className="text-[9px] font-mono text-muted-foreground">{stat.label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-lg font-bold text-foreground">{stat.value}</p>
                        <span className={`text-[10px] font-mono ${stat.positive ? "text-accent" : "text-destructive"}`}>{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === "settings" && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Settings</h2>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display font-bold text-foreground mb-1">Notifications</h3>
                <p className="text-xs text-muted-foreground font-mono mb-4">Control what updates you receive</p>
                <div className="space-y-3">
                  {[
                    { key: "email", label: "Email notifications", desc: "Get email alerts for messages, contract updates, and reviews" },
                    { key: "inApp", label: "In-app notifications", desc: "Show notification badges and alerts inside the dashboard" },
                    { key: "marketing", label: "Marketing & updates", desc: "Product updates, feature announcements, and tips" },
                  ].map((n) => (
                    <div key={n.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-foreground">{n.label}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{n.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifPrefs((p) => ({ ...p, [n.key]: !(p as Record<string, boolean>)[n.key] }))}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          (notifPrefs as Record<string, boolean>)[n.key] ? "bg-cyan-500" : "bg-muted"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-card transition-transform ${
                          (notifPrefs as Record<string, boolean>)[n.key] ? "translate-x-5" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display font-bold text-foreground mb-1">Appearance</h3>
                <p className="text-xs text-muted-foreground font-mono mb-4">Customize your dashboard theme</p>
                <div className="flex gap-3">
                  {[
                    { mode: "dark" as const, icon: Moon, label: "Dark" },
                    { mode: "light" as const, icon: Sun, label: "Light" },
                    { mode: "system" as const, icon: Monitor, label: "System" },
                  ].map((t) => (
                    <button
                      key={t.mode}
                      onClick={() => setTheme(t.mode)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-mono transition-colors ${
                        theme === t.mode
                          ? "bg-primary/[0.07] border-primary/25 text-primary"
                          : "bg-transparent border-border/40 text-muted-foreground hover:border-border"
                      }`}
                    >
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display font-bold text-foreground mb-1">Account</h3>
                <p className="text-xs text-muted-foreground font-mono mb-4">Your account information</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <p className="text-sm text-foreground">Email</p>
                    <p className="text-xs font-mono text-muted-foreground">{user?.email || "—"}</p>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <p className="text-sm text-foreground">Member since</p>
                    <p className="text-xs font-mono text-muted-foreground">
                      {profile?.created_at ? format(new Date(profile.created_at), "MMMM yyyy") : "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">Sign out</span>
                      <span className="text-[10px] font-mono text-muted-foreground">end current session</span>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-border/40 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                <h3 className="font-display font-bold text-red-400 mb-1">Danger Zone</h3>
                <p className="text-xs text-muted-foreground font-mono mb-4">Irreversible actions</p>
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Deleting your account removes all your data including projects, contracts, and profile. This cannot be undone.
                  </p>
                  {deleteConfirm !== "CONFIRM" ? (
                    <button
                      onClick={() => setDeleteConfirm("CONFIRM")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Account
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-mono text-red-400/80">Type CONFIRM to delete your account:</p>
                      <div className="flex gap-2">
                        <input
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          placeholder="type CONFIRM..."
                          className="flex-1 bg-transparent border border-border/40 rounded-lg px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/40"
                        />
                        <button className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-40">
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm("")}
                          className="px-3 py-1.5 text-xs font-mono rounded-lg text-muted-foreground border border-border/40 hover:text-foreground transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const InvitationCard = ({ inv, index }: { inv: Invitation; index: number }) => {
  const [responded, setResponded] = useState<Invitation["status"]>(inv.status);
  const [responding, setResponding] = useState(false);

  const handleRespond = async (action: "accepted" | "declined") => {
    setResponding(true);
    await new Promise((r) => setTimeout(r, 600));
    setResponded(action);
    setResponding(false);
    toast({
      title: action === "accepted" ? "Invitation Accepted!" : "Invitation Declined",
      description: action === "accepted" ? "You can now discuss project details." : "The creator will be notified.",
      duration: 4000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="group px-3.5 py-3 rounded-xl bg-background/60 border border-border/40 hover:border-border/60 hover:bg-background/80 transition-all">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
            {inv.creator?.avatar_url ? (
              <img src={inv.creator.avatar_url} alt="" className="w-9 h-9 rounded-full" />
            ) : (
              <UserIcon className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <p className="text-xs font-semibold text-foreground">{inv.project?.title || "Project"}</p>
              <div className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold border shrink-0 ${
                responded === "pending" ? "bg-amber-500/10 text-accent border-amber-500/20" :
                responded === "accepted" ? "bg-accent/10 text-accent border-accent/20" :
                "bg-muted text-muted-foreground border-border/40"
              }`}>
                {responded === "accepted" ? "✓ Accepted" : responded === "declined" ? "✕ Declined" : "● Pending"}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
              "{inv.personalized_message}"
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[9px] font-mono text-muted-foreground">
                From {inv.creator?.full_name} · {formatDistanceToNow(new Date(inv.sent_at), { addSuffix: true })}
              </span>
            </div>
            {responded === "pending" && (
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={() => handleRespond("accepted")}
                  disabled={responding}
                  className="px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 text-[9px] font-mono text-accent hover:bg-accent/20 transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  {responding ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCheck className="w-3 h-3" />}
                  Accept
                </button>
                <button
                  onClick={() => handleRespond("declined")}
                  disabled={responding}
                  className="px-3 py-1 rounded-lg bg-muted border border-border/50 text-[9px] font-mono text-muted-foreground hover:text-foreground hover:bg-card/[0.04] transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <XIcon className="w-3 h-3" /> Decline
                </button>
                <Link to={`/project/${inv.project_id}`} className="ml-auto text-[9px] font-mono text-primary hover:text-primary transition-colors">
                  Details →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;