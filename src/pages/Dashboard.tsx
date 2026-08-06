import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { profileApi, projectApi, marketplaceApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { Profile, Project, MarketplaceProject, MarketplaceApplication } from "@/types";
import { subscribeToNotifications, type NotificationItem } from "@/lib/notifications";
import { toast } from "@/lib/notify";
import { MyContracts } from "@/components/MyContracts";
import { format, formatDistanceToNow } from "date-fns";
import {
  Bell, LayoutDashboard, FolderGit2, FileText, User, Settings, Briefcase,
  LogOut, Plus, ExternalLink, Loader2, ChevronRight, Search, Zap,
  List, Grid3X3, Trash2, Eye, Star, Check, Pencil, Calendar, Globe, Github,
  X, Save, Loader, Image, Clock, CircleDollarSign,
  Sun, Moon, Monitor, Shield, Copy, CheckCircle2,
  Sparkles, Activity, TrendingUp, Share2, Command, Terminal, BadgeCheck
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, badge: null },
  { id: "ships", label: "Ships", icon: FolderGit2, badge: "Live" },
  { id: "projects", label: "Projects", icon: Briefcase, badge: "Market" },
  { id: "contracts", label: "Contracts", icon: FileText, badge: "Scopes" },
  { id: "profile", label: "Profile", icon: User, badge: null },
  { id: "settings", label: "Settings", icon: Settings, badge: null },
];

export const Dashboard = ({ defaultTab = "overview" }: { defaultTab?: string }) => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Core Data States
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userMarketplaceProjects, setUserMarketplaceProjects] = useState<MarketplaceProject[]>([]);
  const [userApplications, setUserApplications] = useState<MarketplaceApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Command Palette & Modals
  const [cmdKOpen, setCmdKOpen] = useState(false);
  const [cmdKSearch, setCmdKSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Profile Edit State
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

  // Settings State
  const [notifPrefs, setNotifPrefs] = useState({ email: true, inApp: true, marketing: false });
  const [deleteConfirm, setDeleteConfirm] = useState("");

  // Ships Filter State
  const [shipView, setShipView] = useState<"grid" | "list">("grid");
  const [shipSearch, setShipSearch] = useState("");
  const [shipStatus, setShipStatus] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Real-time Activity
  const [activity, setActivity] = useState<NotificationItem[]>([]);
  const [activityFilter, setActivityFilter] = useState<"all" | "contract" | "follow" | "system">("all");

  // Stats
  const [stats, setStats] = useState({
    shipsCount: 0,
    activeContracts: 0,
    completedContracts: 0,
    reputation: 0,
    totalContractValue: 0,
    totalViews: 0,
  });

  // Calculate greeting time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.user_metadata?.full_name || profile?.full_name || user?.user_metadata?.user_name || "Builder";
  const firstName = userName.split(" ")[0];
  const userRole = profile?.role || user?.user_metadata?.role || "Builder";

  // Keyboard shortcut for Cmd+K / Ctrl+K Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdKOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCmdKOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Real-time notifications listener
  useEffect(() => {
    if (!user?.id) return;
    const unsubscribe = subscribeToNotifications(user.id, (list) => setActivity(list));
    return () => unsubscribe();
  }, [user?.id]);

  // Primary data loader
  const loadDashboard = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const [profileData, projectsData, userContractsData, marketplaceData] = await Promise.all([
        profileApi.getCurrent(user.id),
        projectApi.getAll({ builder_id: user.id, limit: 20 }),
        marketplaceApi.getUserContracts(user.id).catch(() => []),
        marketplaceApi.getAllProjects().catch(() => []),
      ]);

      setProfile(profileData);
      setProjects(projectsData || []);

      // Filter marketplace projects posted by user
      const userProjects = (marketplaceData || []).filter(
        (p) => p.founderUid === user.id || p.author_id === user.id
      );
      setUserMarketplaceProjects(userProjects);

      // User Applications
      try {
        const apps = await marketplaceApi.getUserApplications();
        setUserApplications(apps);
      } catch (err) {
        // non-blocking
      }

      // Compute statistics
      const activeContracts = userContractsData.filter((c) => c.status === "active").length;
      const completedContracts = userContractsData.filter((c) => c.status === "completed").length;
      const totalContractValue = userContractsData.reduce((acc, c) => acc + (c.terms?.budgetMax || c.amount_usd || 0), 0);
      const totalViews = (projectsData || []).reduce((acc, p) => acc + (p.views_count || 0), 0);

      setStats({
        shipsCount: projectsData?.length || 0,
        activeContracts,
        completedContracts,
        reputation: profileData?.reputation || 94,
        totalContractValue,
        totalViews,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast({ title: "Sync error", description: "Could not refresh dashboard metrics", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Profile editing handlers
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

  const handleSaveProfile = async () => {
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
      toast({ title: "Profile updated", description: "Your identity details are now live across Shipyards." });
    } catch (err) {
      toast({ title: "Save failed", description: "Failed to update profile. Please check parameters.", variant: "destructive" });
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

  const copyIdentityLink = () => {
    const handle = profile?.username || user?.user_metadata?.user_name;
    const url = handle ? `${window.location.origin}/builder/${handle}` : window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast({ title: "Identity link copied!", description: url });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const activityTime = (item: NotificationItem) => {
    const raw = item.createdAt;
    if (raw && typeof raw === "object" && "toDate" in raw && typeof (raw as { toDate: unknown }).toDate === "function") {
      return formatDistanceToNow((raw as { toDate: () => Date }).toDate(), { addSuffix: true });
    }
    if (raw && typeof raw === "object" && "seconds" in raw) {
      return formatDistanceToNow(new Date((raw as { seconds: number }).seconds * 1000), { addSuffix: true });
    }
    return "just now";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="relative flex flex-col items-center gap-4 p-8 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md shadow-2xl max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-foreground tracking-wide">Syncing Control Plane</h3>
            <p className="text-xs font-mono text-muted-foreground">{`> initializing secure bridge session...`}</p>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full w-2/3 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const filteredActivity = activity.filter((item) => {
    if (activityFilter === "all") return true;
    if (activityFilter === "contract") return item.type === "contract";
    if (activityFilter === "follow") return item.type === "follow";
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row antialiased selection:bg-primary/20 selection:text-primary">
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR NAVIGATION (Desktop) */}
      {/* ------------------------------------------------------------- */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border/50 bg-card/60 backdrop-blur-xl shrink-0 z-20">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-primary/20" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-wide text-foreground group-hover:text-primary transition-colors">
                SHIPYARDS
              </span>
              <span className="block text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
                BuilderOS v2.4
              </span>
            </div>
          </Link>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE
          </span>
        </div>

        {/* Builder Identity Card */}
        <div className="p-4 mx-3 my-3 rounded-xl border border-border/50 bg-muted/40 hover:border-primary/30 transition-all group">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                {profile?.avatar_url || user.user_metadata?.avatar_url ? (
                  <img
                    src={profile?.avatar_url || user.user_metadata.avatar_url}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {userName}
                </p>
                {profile?.is_verified && <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
              </div>
              <p className="text-[11px] font-mono text-muted-foreground truncate">
                @{profile?.username || user?.user_metadata?.user_name || "builder"}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span>Reputation</span>
            <span className="font-bold text-primary">{stats.reputation}% Score</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30 font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground border border-border/60"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Quick Launch CTA */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-display font-semibold text-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Launch Work Scope</span>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
            Post hiring scopes or dock repos for automatic AI matches.
          </p>
          <div className="pt-1 flex items-center gap-2">
            <Link to="/post-project" className="flex-1">
              <Button size="sm" className="w-full text-[10px] font-mono font-semibold h-7 bg-primary text-primary-foreground">
                <Plus className="w-3 h-3 mr-1" /> Scope
              </Button>
            </Link>
            <Link to="/dashboard/projects/new" className="flex-1">
              <Button size="sm" variant="outline" className="w-full text-[10px] font-mono h-7">
                <FolderGit2 className="w-3 h-3 mr-1" /> Dock
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <button
            onClick={() => {
              signOut();
              navigate("/");
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[11px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
          <span className="text-[10px] font-mono text-muted-foreground/60">ID: {user.id.slice(0, 6)}</span>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER AREA */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50">
        {/* Top Header Control Bar */}
        <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          {/* Breadcrumb & Path */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline-block">shipyards://</span>
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">{activeTab}</span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border/50">
              <Terminal className="w-3 h-3 text-primary" />
              main branch
            </span>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2.5">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setCmdKOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/60 border border-border/60 hover:border-primary/40 text-xs text-muted-foreground hover:text-foreground transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono">Search or jump...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-card border border-border text-muted-foreground">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>

            {/* Identity Share */}
            <button
              onClick={copyIdentityLink}
              title="Share Proof of Work Profile"
              className="p-2 rounded-xl bg-muted/60 border border-border/60 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all relative"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((prev) => !prev)}
                className="p-2 rounded-xl bg-muted/60 border border-border/60 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all relative"
              >
                <Bell className="w-4 h-4" />
                {activity.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center border-2 border-card">
                    {activity.length > 9 ? "9+" : activity.length}
                  </span>
                )}
              </button>

              {/* Notification Popover Drawer */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl p-4 space-y-3 z-50 font-mono"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">Activity Stream</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{activity.length} alerts</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1 divide-y divide-border/30">
                      {activity.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-6 text-center">No unread notifications</p>
                      ) : (
                        activity.slice(0, 8).map((item) => (
                          <Link
                            key={item.id}
                            to={item.link || "#"}
                            onClick={() => setNotifOpen(false)}
                            className="block pt-2 hover:bg-muted/30 p-2 rounded-lg transition-colors"
                          >
                            <p className="text-xs font-semibold text-foreground">{item.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{item.text}</p>
                            <span className="text-[9px] text-primary mt-1 block">{activityTime(item)}</span>
                          </Link>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-5 bg-border mx-1 hidden sm:block" />

            {/* Mobile Profile Trigger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center"
              >
                {profile?.avatar_url || user.user_metadata?.avatar_url ? (
                  <img src={profile?.avatar_url || user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-primary" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Strip */}
        <div className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 bg-card/60 border-b border-border/50 overflow-x-auto no-scrollbar shrink-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
                    : "text-muted-foreground hover:text-foreground bg-muted/40"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Workspace Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* ============================================================ */}
          {/* TAB 1: OVERVIEW */}
          {/* ============================================================ */}
          {activeTab === "overview" && (
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Executive Hero Banner */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-card via-card/90 to-primary/5 p-6 md:p-8 shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary">
                      <Zap className="w-3.5 h-3.5" />
                      {getGreeting()}, {firstName}
                    </div>
                    <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight">
                      Builder Command Center
                    </h1>
                    <p className="text-xs sm:text-sm font-mono text-muted-foreground leading-relaxed">
                      Your identity engine is fully synchronized. Track shipped code, manage open marketplace scopes, and execute contracts effortlessly.
                    </p>
                  </div>

                  {/* Action Cluster */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <Link to="/post-project">
                      <Button className="font-mono text-xs font-semibold gap-2 bg-primary text-primary-foreground shadow-md hover:brightness-110">
                        <Plus className="w-4 h-4" />
                        Post Scope
                      </Button>
                    </Link>
                    <Link to="/dashboard/projects/new">
                      <Button variant="outline" className="font-mono text-xs gap-2 border-border/80 hover:bg-muted">
                        <FolderGit2 className="w-4 h-4 text-primary" />
                        Dock Ship
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Subtle Decorative Ambient Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
              </div>

              {/* World-Class 4-KPI Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="p-5 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-all duration-200 space-y-3 group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Docked Ships</span>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-3xl text-foreground tabular-nums">
                      {stats.shipsCount}
                    </div>
                    <p className="text-xs font-mono text-emerald-400 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> +{stats.shipsCount > 0 ? "100" : "0"}% growth this month
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/40 text-[10px] font-mono text-muted-foreground flex justify-between">
                    <span>Total Views</span>
                    <span className="font-bold text-foreground">{stats.totalViews} impressions</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-5 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-all duration-200 space-y-3 group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Active Scopes</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-3xl text-foreground tabular-nums">
                      {stats.activeContracts}
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                      {stats.completedContracts} completed scopes
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/40 text-[10px] font-mono text-muted-foreground flex justify-between">
                    <span>Scope Volume</span>
                    <span className="font-bold text-emerald-400">${stats.totalContractValue.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-5 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-all duration-200 space-y-3 group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Builder Reputation</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-3xl text-foreground tabular-nums">
                      {stats.reputation}%
                    </div>
                    <p className="text-xs font-mono text-amber-400 flex items-center gap-1 mt-1">
                      <BadgeCheck className="w-3 h-3" /> Top 5% Verified Builder
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/40 text-[10px] font-mono text-muted-foreground flex justify-between">
                    <span>Build Streak</span>
                    <span className="font-bold text-foreground">14 Days Active</span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="p-5 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-all duration-200 space-y-3 group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Identity Match Score</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-3xl text-foreground tabular-nums">
                      98<span className="text-sm font-normal text-muted-foreground">/100</span>
                    </div>
                    <p className="text-xs font-mono text-purple-400 mt-1">
                      High founder demand
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/40 text-[10px] font-mono text-muted-foreground flex justify-between">
                    <span>Stack Tags</span>
                    <span className="font-bold text-foreground">{(profile?.stack || []).length} Verified</span>
                  </div>
                </div>
              </div>

              {/* Developer Contribution & Build Streak Heatmap */}
              <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/50">
                  <div>
                    <h3 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Build Output Matrix & Proof of Work Streak
                    </h3>
                    <p className="text-xs font-mono text-muted-foreground">
                      38 recorded shipyard operations in the last 90 days.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <span className="w-3 h-3 rounded-[2px] bg-muted" />
                      <span className="w-3 h-3 rounded-[2px] bg-primary/30" />
                      <span className="w-3 h-3 rounded-[2px] bg-primary/60" />
                      <span className="w-3 h-3 rounded-[2px] bg-primary" />
                    </div>
                    <span>More</span>
                  </div>
                </div>

                {/* Heatmap Matrix Simulation */}
                <div className="overflow-x-auto no-scrollbar pt-2">
                  <div className="flex gap-1.5 min-w-[650px]">
                    {Array.from({ length: 16 }).map((_, col) => (
                      <div key={col} className="flex-1 flex flex-col gap-1.5">
                        {Array.from({ length: 7 }).map((_, row) => {
                          const level = (col * 7 + row) % 5;
                          return (
                            <div
                              key={row}
                              title={`Day ${col * 7 + row + 1}: ${level * 2} ops`}
                              className={`h-3.5 rounded-[2px] transition-all hover:scale-110 cursor-pointer ${
                                level === 0
                                  ? "bg-muted/60"
                                  : level === 1
                                  ? "bg-primary/20 border border-primary/30"
                                  : level === 2
                                  ? "bg-primary/50"
                                  : level === 3
                                  ? "bg-primary/80"
                                  : "bg-primary shadow-sm"
                              }`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2-Column Split: Recent Ships vs Live Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Docked Ships */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-display font-bold text-foreground flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-primary" />
                        Docked Ships
                      </h3>
                      <p className="text-xs font-mono text-muted-foreground">Verified repositories and showcase builds</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("ships")}
                      className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                    >
                      View all ({projects.length}) <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card/40 space-y-3">
                      <FolderGit2 className="w-10 h-10 text-muted-foreground mx-auto" />
                      <p className="text-sm font-display font-semibold text-foreground">No ships docked yet</p>
                      <p className="text-xs font-mono text-muted-foreground max-w-sm mx-auto">
                        Connect your GitHub repository or add a project URL to dock your first ship.
                      </p>
                      <Link to="/dashboard/projects/new">
                        <Button size="sm" className="font-mono text-xs gap-1.5 bg-primary text-primary-foreground">
                          <Plus className="w-3.5 h-3.5" /> Dock First Ship
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projects.slice(0, 4).map((project) => (
                        <div
                          key={project.id}
                          className="group p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-all space-y-3 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                                {project.status || "docked"}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {format(new Date(project.created_at || Date.now()), "MMM d")}
                              </span>
                            </div>
                            <h4 className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {project.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {project.description || "No description provided."}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {project.stack?.slice(0, 2).map((tech) => (
                                <span key={tech} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-muted text-muted-foreground">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            {project.live_url && (
                              <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Real-Time Event Stream */}
                <div className="p-5 rounded-2xl border border-border bg-card space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-border/50">
                      <div>
                        <h3 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
                          <Activity className="w-4 h-4 text-primary" />
                          Live Event Feed
                        </h3>
                        <p className="text-[10px] font-mono text-muted-foreground">Real-time platform logs</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setActivityFilter("all")}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold transition-colors ${
                            activityFilter === "all" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setActivityFilter("contract")}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold transition-colors ${
                            activityFilter === "contract" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Contracts
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                      {filteredActivity.length === 0 ? (
                        <div className="text-center py-12 space-y-2">
                          <Clock className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                          <p className="text-xs font-mono text-muted-foreground">No recent activity logged</p>
                        </div>
                      ) : (
                        filteredActivity.slice(0, 6).map((item) => (
                          <Link
                            key={item.id}
                            to={item.link || "#"}
                            className="block p-3 rounded-xl bg-muted/40 border border-border/40 hover:border-primary/30 transition-all group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {item.title}
                              </p>
                              <span className="text-[9px] font-mono text-muted-foreground shrink-0">{activityTime(item)}</span>
                            </div>
                            <p className="text-[11px] font-mono text-muted-foreground mt-1 line-clamp-2">{item.text}</p>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/40 text-center">
                    <button
                      onClick={() => setActiveTab("settings")}
                      className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    >
                      Configure Notification Rules <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: SHIPS */}
          {/* ============================================================ */}
          {activeTab === "ships" && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-primary" />
                    Docked Ships Directory
                  </h2>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    Manage your verified build showcase and connected GitHub repositories.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex rounded-lg border border-border p-0.5 bg-muted/50">
                    <button
                      onClick={() => setShipView("grid")}
                      className={`p-1.5 rounded text-xs transition-all ${
                        shipView === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShipView("list")}
                      className={`p-1.5 rounded text-xs transition-all ${
                        shipView === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <Link to="/dashboard/projects/new">
                    <Button size="sm" className="font-mono text-xs gap-1.5 bg-primary text-primary-foreground font-semibold">
                      <Plus className="w-3.5 h-3.5" />
                      Dock New Ship
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={shipSearch}
                    onChange={(e) => setShipSearch(e.target.value)}
                    placeholder="Filter ships by title or technology stack..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-all font-mono"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "docked", "verified", "draft"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setShipStatus(status)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono capitalize border transition-all ${
                        shipStatus === status
                          ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                          : "bg-card border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ships Cards */}
              {projects.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-4">
                  <FolderGit2 className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-base font-display font-semibold text-foreground">No ships in repository</h3>
                    <p className="text-xs font-mono text-muted-foreground max-w-md mx-auto">
                      Dock your project code to showcase verified builds to founders and collaborators.
                    </p>
                  </div>
                  <Link to="/dashboard/projects/new">
                    <Button size="sm" className="font-mono text-xs gap-1.5 bg-primary text-primary-foreground">
                      <Plus className="w-3.5 h-3.5" /> Dock First Ship
                    </Button>
                  </Link>
                </div>
              ) : shipView === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects
                    .filter((p) => shipStatus === "all" || p.status === shipStatus)
                    .filter(
                      (p) =>
                        !shipSearch ||
                        p.title.toLowerCase().includes(shipSearch.toLowerCase()) ||
                        p.stack?.some((s) => s.toLowerCase().includes(shipSearch.toLowerCase()))
                    )
                    .map((project) => (
                      <div
                        key={project.id}
                        className="group p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                              {project.status || "docked"}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {format(new Date(project.created_at || Date.now()), "MMM d, yyyy")}
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {project.description || "No description provided."}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {project.stack?.map((tech) => (
                              <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-primary" />
                              {project.views_count || 0}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {project.live_url && (
                              <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                                  setDeleting(project.id);
                                  try {
                                    await projectApi.delete(project.id);
                                    setProjects((prev) => prev.filter((p) => p.id !== project.id));
                                    toast({ title: "Ship deleted", description: "Project removed from your profile." });
                                  } catch (err) {
                                    toast({ title: "Delete failed", variant: "destructive" });
                                  } finally {
                                    setDeleting(null);
                                  }
                                }
                              }}
                              disabled={deleting === project.id}
                              className="p-1.5 rounded-lg bg-muted hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              {deleting === project.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                /* List View */
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="divide-y divide-border/40 font-mono text-xs">
                    {projects
                      .filter((p) => shipStatus === "all" || p.status === shipStatus)
                      .filter((p) => !shipSearch || p.title.toLowerCase().includes(shipSearch.toLowerCase()))
                      .map((project) => (
                        <div key={project.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <FolderGit2 className="w-4 h-4 text-primary shrink-0" />
                              <h4 className="font-bold text-foreground truncate">{project.title}</h4>
                              <span className="px-2 py-0.5 rounded text-[9px] bg-primary/10 text-primary border border-primary/20">
                                {project.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{project.description}</p>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 text-muted-foreground">
                            <span>{project.views_count || 0} views</span>
                            {project.live_url && (
                              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: PROJECTS / MARKETPLACE */}
          {/* ============================================================ */}
          {activeTab === "projects" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Marketplace & Hiring Scopes
                  </h2>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    Browse active client scopes, posted projects, and applications.
                  </p>
                </div>

                <Link to="/post-project">
                  <Button size="sm" className="font-mono text-xs gap-1.5 bg-primary text-primary-foreground font-semibold">
                    <Plus className="w-3.5 h-3.5" />
                    Post New Scope
                  </Button>
                </Link>
              </div>

              {/* Grid of User Posted Projects & Submitted Applications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section 1: My Posted Scopes */}
                <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/50">
                    <h3 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Posted Scopes ({userMarketplaceProjects.length})
                    </h3>
                    <Link to="/marketplace" className="text-xs font-mono text-primary hover:underline">
                      View Marketplace
                    </Link>
                  </div>

                  {userMarketplaceProjects.length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                      <p className="text-xs font-mono text-muted-foreground">You haven't posted any hiring scopes yet.</p>
                      <Link to="/post-project">
                        <Button size="sm" variant="outline" className="font-mono text-xs mt-2">
                          Post First Scope
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userMarketplaceProjects.map((p) => (
                        <Link
                          key={p.id}
                          to={`/marketplace/${p.slug || p.id}`}
                          className="block p-3.5 rounded-xl bg-muted/40 border border-border/50 hover:border-primary/40 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-foreground truncate">{p.title}</h4>
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              ${p.budgetMin?.toLocaleString()} - ${p.budgetMax?.toLocaleString()} USD
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-1">{p.description}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 2: Submitted Applications */}
                <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/50">
                    <h3 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      My Applications ({userApplications.length})
                    </h3>
                  </div>

                  {userApplications.length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                      <p className="text-xs font-mono text-muted-foreground">You haven't applied to any client scopes yet.</p>
                      <Link to="/marketplace">
                        <Button size="sm" variant="outline" className="font-mono text-xs mt-2">
                          Explore Scopes
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userApplications.map((app) => (
                        <div key={app.id} className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">Proposed: ${app.proposedRate?.toLocaleString()} USD</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold capitalize ${
                              app.status === "accepted" ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-muted-foreground line-clamp-2">{app.pitch}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: CONTRACTS */}
          {/* ============================================================ */}
          {activeTab === "contracts" && (
            <div className="max-w-7xl mx-auto">
              <MyContracts currentUserId={user?.id} userRole={profile?.role || "builder"} />
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: PROFILE */}
          {/* ============================================================ */}
          {activeTab === "profile" && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Profile Card Header */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center overflow-hidden shrink-0">
                        {profile?.avatar_url || user.user_metadata?.avatar_url ? (
                          <img
                            src={profile?.avatar_url || user.user_metadata.avatar_url}
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-primary" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-display font-bold text-foreground">{userName}</h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                          {userRole}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">
                        @{profile?.username || user?.user_metadata?.user_name || "builder"}
                      </p>
                      <p className="text-xs text-muted-foreground max-w-xl pt-1">
                        {profile?.bio || "No bio added yet. Edit profile to write a summary."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    {!isEditing ? (
                      <Button onClick={startEditing} size="sm" variant="outline" className="font-mono text-xs gap-1.5">
                        <Pencil className="w-3.5 h-3.5" /> Edit Identity
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button onClick={cancelEditing} size="sm" variant="ghost" className="font-mono text-xs">
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile} disabled={saving} size="sm" className="font-mono text-xs gap-1.5 bg-primary text-primary-foreground">
                          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Form */}
                {isEditing && (
                  <div className="pt-6 border-t border-border/50 space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-muted-foreground">Full Display Name</label>
                        <input
                          type="text"
                          value={editForm.full_name}
                          onChange={(e) => setEditForm((p) => ({ ...p, full_name: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-muted-foreground">Username Handle</label>
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => setEditForm((p) => ({ ...p, username: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-muted-foreground">Bio / Elevator Pitch</label>
                      <textarea
                        rows={3}
                        value={editForm.bio}
                        onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none focus:border-primary resize-none"
                      />
                    </div>

                    {/* Stack Tag Builder */}
                    <div className="space-y-2">
                      <label className="text-muted-foreground">Verified Tech Stack</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editForm.stack.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs">
                            {tag}
                            <button onClick={() => removeStackTag(tag)} className="hover:text-destructive">
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
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addStackTag())}
                          placeholder="Add technology (e.g. Next.js, PyTorch)..."
                          className="flex-1 px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none focus:border-primary"
                        />
                        <Button type="button" onClick={addStackTag} size="sm" variant="outline" className="font-mono text-xs">
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tech Stack Display */}
                {!isEditing && (
                  <div className="pt-4 border-t border-border/40 space-y-2">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Verified Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {(profile?.stack || ["React", "TypeScript", "Tailwind CSS", "Firebase"]).map((tech) => (
                        <span key={tech} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-muted/60 text-foreground border border-border/50">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6: SETTINGS */}
          {/* ============================================================ */}
          {activeTab === "settings" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <h3 className="text-base font-display font-bold text-foreground">Notification Preferences</h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-border/40">
                    <div>
                      <p className="font-semibold text-foreground">Email Contract Alerts</p>
                      <p className="text-muted-foreground">Receive email updates on proposals and completions.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifPrefs.email}
                      onChange={(e) => setNotifPrefs((p) => ({ ...p, email: e.target.checked }))}
                      className="accent-primary w-4 h-4"
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold text-foreground">In-App Live Activity</p>
                      <p className="text-muted-foreground">Push notifications for new match invites.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifPrefs.inApp}
                      onChange={(e) => setNotifPrefs((p) => ({ ...p, inApp: e.target.checked }))}
                      className="accent-primary w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <h3 className="text-base font-display font-bold text-foreground">Appearance Theme</h3>
                <div className="flex gap-3">
                  {[
                    { mode: "dark" as const, icon: Moon, label: "Dark Mode" },
                    { mode: "light" as const, icon: Sun, label: "Light Mode" },
                    { mode: "system" as const, icon: Monitor, label: "System Default" },
                  ].map((item) => (
                    <button
                      key={item.mode}
                      onClick={() => setTheme(item.mode)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono transition-all ${
                        theme === item.mode
                          ? "bg-primary/10 border-primary/40 text-primary font-bold shadow-sm"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Security & Identity */}
              <div className="p-6 rounded-2xl border border-border bg-card space-y-3 font-mono text-xs">
                <h3 className="text-base font-display font-bold text-foreground">System Identity</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong className="text-foreground">Email:</strong> {user.email}</p>
                  <p><strong className="text-foreground">Firebase UID:</strong> {user.id}</p>
                  <p><strong className="text-foreground">Authentication:</strong> Verified Firebase Auth Session</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* COMMAND PALETTE OVERLAY (⌘K) */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {cmdKOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden font-mono text-xs"
            >
              <div className="p-4 border-b border-border/50 flex items-center gap-3">
                <Search className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={cmdKSearch}
                  onChange={(e) => setCmdKSearch(e.target.value)}
                  placeholder="Type a command or search tabs..."
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                />
                <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-muted border border-border text-muted-foreground">
                  ESC
                </kbd>
              </div>

              <div className="p-2 max-h-80 overflow-y-auto space-y-1">
                <p className="px-3 py-1 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Navigation Commands</p>
                {NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(cmdKSearch.toLowerCase())).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setCmdKOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>Jump to {item.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                ))}

                <p className="px-3 py-1 text-[10px] text-muted-foreground uppercase tracking-wider font-bold pt-2">Quick Actions</p>
                <button
                  onClick={() => {
                    navigate("/post-project");
                    setCmdKOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left"
                >
                  <Plus className="w-4 h-4" />
                  Post a New Marketplace Scope
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard/projects/new");
                    setCmdKOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left"
                >
                  <FolderGit2 className="w-4 h-4" />
                  Dock a New Repository Ship
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
