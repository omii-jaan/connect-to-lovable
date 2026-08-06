import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Eye, Clock, ChevronRight, Bookmark, BookmarkCheck,
  Sparkles, Filter, ArrowUpDown, X, CircleDollarSign, Briefcase,
  Flame, LayoutGrid, List as ListIcon, Globe, Shield, Loader2, Zap, UserCheck, CheckCircle2, Mail, FileText
} from "lucide-react";
import { MyContracts } from "@/components/MyContracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { notify as toast } from "@/lib/notify";
import { sendNotification } from "@/lib/notifications";
import { marketplaceApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { MOCK_HIRE_PROJECTS, CATEGORIES, BUDGET_RANGES, TIMELINE_OPTIONS, CATEGORY_STYLES } from "@/lib/marketplace-data";
import { formatDistanceToNow } from "date-fns";
import type { HireProject, MarketplaceProject, MatchResult, MarketplaceApplication, Invitation } from "@/types";

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Most Viewed", value: "views" },
  { label: "Highest Budget", value: "budget_desc" },
  { label: "Lowest Budget", value: "budget_asc" },
  { label: "Shortest Timeline", value: "timeline" },
] as const;

// Helper to normalize MarketplaceProject or HireProject to a unified item shape
const normalizeProject = (p: Partial<MarketplaceProject & HireProject>) => {
  return {
    id: p.id || Math.random().toString(),
    slug: p.slug || p.id || "",
    title: p.title || "Untitled Project Scope",
    category: p.category || "Full App / Product",
    description: p.description || "",
    requirements: p.requirements || p.required_skills || [],
    budget_min: p.budgetMin ?? p.budget_min ?? 1000,
    budget_max: p.budgetMax ?? p.budget_max ?? 5000,
    currency: p.currency || "USD",
    timeline_weeks: p.timelineWeeks ?? p.timeline_weeks ?? 4,
    skills: p.skills || p.required_skills || [],
    techStack: p.techStack || p.preferred_tech_stack || [],
    complexity: p.complexity || "medium",
    status: p.status || "open",
    views_count: p.viewsCount ?? p.views_count ?? 12,
    applications_count: p.applicationsCount ?? p.applicants_count ?? 0,
    created_at: p.createdAt || p.created_at || new Date().toISOString(),
    remote: p.remote ?? true,
    ndaRequired: p.ndaRequired ?? false,
    featured: p.featured ?? false,
    matches: p.matches || [],
  };
};

const Projects = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dbProjects, setDbProjects] = useState<ReturnType<typeof normalizeProject>[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<(typeof BUDGET_RANGES)[number]>(BUDGET_RANGES[0]);
  const [timelineMax, setTimelineMax] = useState<(typeof TIMELINE_OPTIONS)[number]>(TIMELINE_OPTIONS[0]);
  const [sortBy, setSortBy] = useState("newest");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"all" | "matched" | "applications" | "invites" | "contracts">("all");

  // User Applications state
  const [myApplications, setMyApplications] = useState<MarketplaceApplication[]>([]);
  const [loadingMyApps, setLoadingMyApps] = useState(false);

  // User Invitations state
  const [myInvitations, setMyInvitations] = useState<Invitation[]>([]);
  const [loadingMyInvs, setLoadingMyInvs] = useState(false);
  const [updatingInvId, setUpdatingInvId] = useState<string | null>(null);

  // AI Matched project scores for logged in user
  const [userMatchScores, setUserMatchScores] = useState<Record<string, { score: number; reason: string }>>({});

  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      setLoading(true);
      try {
        const firestoreDocs = await marketplaceApi.getAll();
        if (isMounted) {
          const normalizedDb = firestoreDocs.map((d) => normalizeProject(d as unknown as Partial<MarketplaceProject>));
          const normalizedMock = MOCK_HIRE_PROJECTS.map((m) => normalizeProject(m as unknown as Partial<HireProject>));
          const combined = [...normalizedDb, ...normalizedMock];
          setDbProjects(combined);

          // Calculate AI Matches for active user across open projects
          const currentUid = user?.id || "user_a";
          const matchMap: Record<string, { score: number; reason: string }> = {};

          for (const proj of combined.slice(0, 8)) {
            try {
              const resMatches: MatchResult[] = await marketplaceApi.computeMatches(proj.id, proj);
              const myMatch = resMatches.find((m) => m.builderUid === currentUid) || resMatches[0];
              if (myMatch) {
                matchMap[proj.id] = {
                  score: myMatch.score,
                  reason: myMatch.reasons[0] || "Matching tech stack and experience",
                };
              }
            } catch (e) {
              // ignore error
            }
          }
          if (isMounted) setUserMatchScores(matchMap);
        }
      } catch (err) {
        console.warn("Failed to load projects from Firestore, falling back:", err);
        if (isMounted) {
          setDbProjects(MOCK_HIRE_PROJECTS.map((m) => normalizeProject(m as unknown as Partial<HireProject>)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProjects();
    return () => { isMounted = false; };
  }, [user]);

  const loadMyInvs = async () => {
    if (!user?.id) return;
    setLoadingMyInvs(true);
    try {
      const invs = await marketplaceApi.getUserInvitations(user.id);
      setMyInvitations(invs as unknown as Invitation[]);
    } catch (e) {
      console.warn("Failed to load user invitations:", e);
    } finally {
      setLoadingMyInvs(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      setLoadingMyApps(true);
      marketplaceApi.getUserApplications(user.id)
        .then((apps) => {
          if (isMounted) setMyApplications(apps as unknown as MarketplaceApplication[]);
        })
        .catch((e) => console.warn("Failed to load user applications:", e))
        .finally(() => {
          if (isMounted) setLoadingMyApps(false);
        });

      loadMyInvs();
    }
    return () => { isMounted = false; };
  }, [user, activeTab]);

  const handleAcceptInvite = async (inv: Invitation) => {
    const proj = inv.project as MarketplaceProject;
    const founderUid = inv.founderUid || inv.creatorUid || inv.senderUid || inv.founder?.id;

    setUpdatingInvId(inv.id);
    try {
      await marketplaceApi.updateInvitationStatus(inv.id, "accepted", {
        projectId: inv.marketplaceProjectId || inv.projectId,
        founderUid,
        message: inv.message || inv.personalized_message,
        projectTitle: proj?.title,
        budgetMax: proj?.budgetMax || proj?.budget_max || 0,
      });

      setMyInvitations((prev) =>
        prev.map((item) => (item.id === inv.id ? { ...item, status: "accepted" } : item))
      );

      if (founderUid) {
        sendNotification({
          recipientUid: founderUid,
          actorUid: user?.id || "",
          actorName: user?.user_metadata?.full_name || "Builder",
          actorAvatar: user?.user_metadata?.avatar_url || "",
          type: "system",
          targetId: inv.marketplaceProjectId || inv.projectId || "",
          title: `Invitation ACCEPTED for "${proj?.title || 'Project'}"`,
          text: `Builder ${user?.user_metadata?.full_name || 'Builder'} accepted your direct scope invitation. A draft contract has been created.`,
          link: `/marketplace/${proj?.slug || inv.marketplaceProjectId || inv.projectId}`,
        });
      }

      toast.success("Invitation accepted! Draft contract created.");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to accept invitation");
    } finally {
      setUpdatingInvId(null);
    }
  };

  const handleDeclineInvite = async (inv: Invitation) => {
    const proj = inv.project as MarketplaceProject;
    const founderUid = inv.founderUid || inv.creatorUid || inv.senderUid || inv.founder?.id;

    setUpdatingInvId(inv.id);
    try {
      await marketplaceApi.updateInvitationStatus(inv.id, "declined");

      setMyInvitations((prev) =>
        prev.map((item) => (item.id === inv.id ? { ...item, status: "declined" } : item))
      );

      if (founderUid) {
        sendNotification({
          recipientUid: founderUid,
          actorUid: user?.id || "",
          actorName: user?.user_metadata?.full_name || "Builder",
          actorAvatar: user?.user_metadata?.avatar_url || "",
          type: "system",
          targetId: inv.marketplaceProjectId || inv.projectId || "",
          title: `Invitation Declined for "${proj?.title || 'Project'}"`,
          text: `Builder ${user?.user_metadata?.full_name || 'Builder'} declined the invitation.`,
          link: `/marketplace/${proj?.slug || inv.marketplaceProjectId || inv.projectId}`,
        });
      }

      toast("Invitation declined.");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to decline invitation");
    } finally {
      setUpdatingInvId(null);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSaved = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast("Removed from saved");
      } else {
        next.add(id);
        toast("Project saved!");
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    let result = [...dbProjects].filter((p) => p.status === "open");

    if (activeTab === "matched") {
      result = result.filter((p) => (userMatchScores[p.id]?.score || 0) >= 60);
      result.sort((a, b) => (userMatchScores[b.id]?.score || 0) - (userMatchScores[a.id]?.score || 0));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q)) ||
          p.techStack.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (budgetRange.max !== Infinity) {
      result = result.filter((p) => p.budget_min <= budgetRange.max && p.budget_max >= budgetRange.min);
    }
    if (timelineMax.weeks > 0) {
      result = result.filter((p) => p.timeline_weeks <= timelineMax.weeks);
    }

    if (activeTab !== "matched") {
      switch (sortBy) {
        case "newest":
          result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case "views":
          result.sort((a, b) => b.views_count - a.views_count);
          break;
        case "budget_desc":
          result.sort((a, b) => b.budget_max - a.budget_max);
          break;
        case "budget_asc":
          result.sort((a, b) => a.budget_min - b.budget_min);
          break;
        case "timeline":
          result.sort((a, b) => a.timeline_weeks - b.timeline_weeks);
          break;
      }
    }
    return result;
  }, [dbProjects, search, selectedCategories, budgetRange, timelineMax, sortBy, activeTab, userMatchScores]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setBudgetRange(BUDGET_RANGES[0]);
    setTimelineMax(TIMELINE_OPTIONS[0]);
    setSearch("");
  };

  const hasFilters =
    selectedCategories.length > 0 || budgetRange.max !== Infinity || timelineMax.weeks > 0 || search.trim() !== "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main id="main" className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-semibold text-primary tracking-wide">
                /marketplace
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <h1 id="main-heading" className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground">
              Marketplace Contracts & Scopes
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-1 max-w-[65ch]">
              Browse open scopes, paid milestone contracts, and engineering gigs from verified founders.
            </p>
          </div>

          <Link to="/post-project">
            <Button className="bg-primary text-primary-foreground font-semibold text-xs transition-all h-9 px-4 rounded-lg shadow-sm hover:bg-primary/90 shrink-0">
              <Plus className="w-4 h-4 mr-1.5" />
              Post a Project Scope
            </Button>
          </Link>
        </div>

        {/* Tab Navigation: All Scopes vs Projects for You vs My Applications */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              activeTab === "all"
                ? "bg-primary/10 border border-primary/30 text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            All Open Scopes ({dbProjects.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("matched")}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === "matched"
                ? "bg-primary/10 border border-primary/30 text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Projects for You (AI Matched)
            <span className="px-1.5 py-0.2 rounded bg-primary text-primary-foreground text-[9px] font-bold">
              {Object.keys(userMatchScores).length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === "applications"
                ? "bg-primary/10 border border-primary/30 text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-primary" />
            My Applications
            {myApplications.length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-primary/20 text-primary text-[9px] font-bold">
                {myApplications.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("invites")}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === "invites"
                ? "bg-primary/10 border border-primary/30 text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-primary" />
            My Invites
            {myInvitations.filter(inv => inv.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold animate-pulse">
                {myInvitations.filter(inv => inv.status === 'pending').length} New
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contracts")}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === "contracts"
                ? "bg-primary/10 border border-primary/30 text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-primary" />
            My Contracts
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, skills, or tech stack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border text-xs h-9 focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center h-9 px-3 rounded-md bg-card border border-border text-xs font-mono text-muted-foreground">
              <CircleDollarSign className="w-3.5 h-3.5 mr-1.5 text-primary" />
              <select
                aria-label="Filter by budget"
                value={budgetRange.label}
                onChange={(e) =>
                  setBudgetRange(BUDGET_RANGES.find((b) => b.label === e.target.value) || BUDGET_RANGES[0])
                }
                className="bg-transparent border-none outline-none text-xs font-mono text-foreground cursor-pointer"
              >
                {BUDGET_RANGES.map((b) => (
                  <option key={b.label} value={b.label}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center h-9 px-3 rounded-md bg-card border border-border text-xs font-mono text-muted-foreground">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-primary" />
              <select
                aria-label="Filter by timeline"
                value={timelineMax.label}
                onChange={(e) =>
                  setTimelineMax(TIMELINE_OPTIONS.find((t) => t.label === e.target.value) || TIMELINE_OPTIONS[0])
                }
                className="bg-transparent border-none outline-none text-xs font-mono text-foreground cursor-pointer"
              >
                {TIMELINE_OPTIONS.map((t) => (
                  <option key={t.label} value={t.label}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center h-9 px-3 rounded-md bg-card border border-border text-xs font-mono text-muted-foreground">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-primary" />
              <select
                aria-label="Sort projects"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-mono text-foreground cursor-pointer"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 border-l border-border pl-2 ml-1">
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setView("grid")}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                  view === "grid" ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="List view"
                onClick={() => setView("list")}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                  view === "list" ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground"
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 h-8 px-2.5 rounded-md text-xs font-mono text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {["Full App / Product", ...CATEGORIES].map((cat) => {
            const active = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${
                  active
                    ? "bg-primary/20 border-primary text-primary font-semibold"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Content States */}
        {activeTab === "applications" ? (
          loadingMyApps ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-border bg-card p-5 rounded-xl space-y-3 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                  <div className="h-10 bg-muted rounded w-full" />
                </Card>
              ))}
            </div>
          ) : myApplications.length === 0 ? (
            <Card className="border-border bg-card p-12 text-center rounded-xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto text-muted-foreground">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-foreground">
                  No Proposals Submitted Yet
                </h3>
                <p className="text-xs font-mono text-muted-foreground max-w-md mx-auto">
                  Browse open project scopes on the marketplace and submit your pitch, rate, and timeline to founders.
                </p>
              </div>
              <Button onClick={() => setActiveTab("all")} size="sm" className="text-xs font-mono bg-primary text-primary-foreground">
                Browse Open Scopes
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {myApplications.map((app) => {
                const targetSlug = app.project?.slug || app.projectId || app.marketplaceProjectId;
                const isAccepted = app.status === "accepted";
                const isRejected = app.status === "rejected";
                const isPending = app.status === "pending";

                return (
                  <Card
                    key={app.id}
                    className={`p-5 rounded-xl border transition-all space-y-3 ${
                      isAccepted
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : isRejected
                        ? "border-destructive/30 bg-card opacity-75"
                        : "border-border/80 bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {app.project?.category && (
                            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                              {app.project.category}
                            </Badge>
                          )}
                          <span className="text-[10px] font-mono text-muted-foreground">
                            Submitted {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <Link
                          to={`/marketplace/${targetSlug}`}
                          className="font-display font-bold text-base text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          {app.project?.title || "Project Scope"}
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </div>

                      <div>
                        {isAccepted && (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-mono font-bold gap-1 px-2.5 py-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Proposal Accepted
                          </Badge>
                        )}
                        {isRejected && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-[10px] font-mono font-bold px-2.5 py-1">
                            Not Selected
                          </Badge>
                        )}
                        {isPending && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] font-mono font-bold px-2.5 py-1">
                            Pending Founder Review
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-background/80 border border-border/50 text-xs font-mono space-y-1.5">
                      <p className="text-muted-foreground font-semibold text-[11px] uppercase">Your Pitch / Proposal:</p>
                      <p className="text-foreground whitespace-pre-line">{app.pitch}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-border/40 text-xs font-mono">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase block">Your Proposed Rate</span>
                          <span className="font-bold text-primary tabular-nums">${app.proposedRate?.toLocaleString()} USD</span>
                        </div>
                        <div className="h-6 w-px bg-border/60" />
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase block">Your Proposed Timeline</span>
                          <span className="font-bold text-foreground tabular-nums">{app.proposedTimelineWeeks} Weeks</span>
                        </div>
                      </div>

                      <Link to={`/marketplace/${targetSlug}`}>
                        <Button size="sm" variant="outline" className="text-xs font-mono gap-1 h-8">
                          View Full Scope
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )
        ) : activeTab === "invites" ? (
          loadingMyInvs ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-border bg-card p-5 rounded-xl space-y-3 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-6 bg-muted rounded w-20" />
                  </div>
                  <div className="h-6 bg-muted rounded w-1/2" />
                  <div className="h-12 bg-muted rounded w-full" />
                </Card>
              ))}
            </div>
          ) : myInvitations.length === 0 ? (
            <Card className="border-border bg-card p-12 text-center rounded-xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto text-muted-foreground">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-foreground">
                  No Scope Invitations Received Yet
                </h3>
                <p className="text-xs font-mono text-muted-foreground max-w-md mx-auto">
                  When founders search for AI builders with your tech stack, direct project invitations will appear here for your review.
                </p>
              </div>
              <Button onClick={() => setActiveTab("all")} size="sm" className="text-xs font-mono bg-primary text-primary-foreground">
                Browse Open Scopes
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {myInvitations.map((inv) => {
                const proj = inv.project as MarketplaceProject;
                const founder = inv.founder;
                const targetProjId = inv.marketplaceProjectId || inv.projectId || "";
                const targetSlug = proj?.slug || targetProjId;
                const isPending = inv.status === "pending";
                const isAccepted = inv.status === "accepted";
                const isDeclined = inv.status === "declined";
                const isUpdating = updatingInvId === inv.id;

                const hasApplied = myApplications.some(
                  (a) => (a.projectId === targetProjId || a.marketplaceProjectId === targetProjId)
                );

                return (
                  <Card
                    key={inv.id}
                    className={`p-5 rounded-xl border transition-all space-y-3.5 ${
                      isAccepted
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : isDeclined
                        ? "border-border/50 bg-card opacity-70"
                        : "border-primary/40 bg-card shadow-sm hover:border-primary/60"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={founder?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${inv.founderUid || inv.creatorUid || 'founder'}`}
                          alt={founder?.full_name || "Founder"}
                          className="w-10 h-10 rounded-full object-cover bg-muted border border-border shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs font-mono text-foreground">
                              {founder?.full_name || "Founder / Client"}
                            </span>
                            {founder?.username && (
                              <span className="text-[10px] font-mono text-muted-foreground">
                                @{founder.username}
                              </span>
                            )}
                            <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary uppercase">
                              Direct Invitation
                            </Badge>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                            Received {inv.createdAt ? formatDistanceToNow(new Date(inv.createdAt), { addSuffix: true }) : "recently"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        {hasApplied && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] font-mono">
                            Already Applied
                          </Badge>
                        )}

                        {isAccepted && (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-mono font-bold gap-1 px-2.5 py-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted & Draft Contract Created
                          </Badge>
                        )}
                        {isDeclined && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-[10px] font-mono font-bold px-2.5 py-1">
                            Declined
                          </Badge>
                        )}
                        {isPending && (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-mono font-bold animate-pulse px-2.5 py-1">
                            Pending Response
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Link
                        to={`/marketplace/${targetSlug}`}
                        className="font-display font-bold text-base text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                      >
                        {proj?.title || "Marketplace Project Scope"}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      {proj?.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 font-mono">
                          {proj.description}
                        </p>
                      )}
                    </div>

                    {(inv.message || inv.personalized_message) && (
                      <div className="p-3 rounded-lg bg-background/90 border border-border/60 text-xs font-mono space-y-1">
                        <span className="text-primary font-bold text-[10px] uppercase block tracking-wider">
                          Personal Message from Founder:
                        </span>
                        <p className="text-foreground italic">"{inv.message || inv.personalized_message}"</p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/40 text-xs font-mono">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase block">Budget Max</span>
                          <span className="font-bold text-primary tabular-nums">
                            ${(proj?.budgetMax || proj?.budget_max || 0).toLocaleString()} USD
                          </span>
                        </div>
                        <div className="h-6 w-px bg-border/60" />
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase block">Timeline</span>
                          <span className="font-bold text-foreground tabular-nums">
                            {proj?.timelineWeeks || proj?.timeline_weeks || 4} Weeks
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link to={`/marketplace/${targetSlug}`}>
                          <Button size="sm" variant="outline" className="text-xs font-mono h-8">
                            View Scope
                          </Button>
                        </Link>

                        {isPending && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isUpdating}
                              onClick={() => handleDeclineInvite(inv)}
                              className="text-xs font-mono h-8 border-destructive/30 text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-destructive"
                            >
                              {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Decline"}
                            </Button>
                            <Button
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => handleAcceptInvite(inv)}
                              className="text-xs font-mono h-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-1 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-400"
                            >
                              {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              Accept Invitation
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )
        ) : activeTab === "contracts" ? (
          <MyContracts currentUserId={user?.id} />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-border bg-card p-5 rounded-xl space-y-3 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-12 bg-muted rounded w-full" />
                <div className="flex gap-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <Card className="border-border bg-card p-12 text-center rounded-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto text-muted-foreground">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-foreground">
                No matching project scopes found
              </h3>
              <p className="text-xs font-mono text-muted-foreground max-w-md mx-auto">
                No projects matched your current search filters. Try clearing your filters or post a new scope as a founder.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs font-mono">
                Clear Filters
              </Button>
              <Link to="/post-project">
                <Button size="sm" className="text-xs font-mono bg-primary text-primary-foreground">
                  Post a Project
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Grid / List View */
          <AnimatePresence mode="wait">
            {view === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {filtered.map((p, idx) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    index={idx}
                    saved={saved.has(p.id)}
                    matchScore={userMatchScores[p.id]?.score}
                    onToggleSave={() => toggleSaved(p.id)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filtered.map((p, idx) => (
                  <ProjectListItem
                    key={p.id}
                    project={p}
                    index={idx}
                    saved={saved.has(p.id)}
                    matchScore={userMatchScores[p.id]?.score}
                    onToggleSave={() => toggleSaved(p.id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div className="pt-6 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>
            Showing <strong className="text-foreground tabular-nums">{filtered.length}</strong> open scope listings
          </span>
          <span>Verified Marketplace</span>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

const ProjectCard = ({
  project,
  index,
  saved,
  matchScore,
  onToggleSave,
}: {
  project: ReturnType<typeof normalizeProject>;
  index: number;
  saved: boolean;
  matchScore?: number;
  onToggleSave: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
    >
      <Link to={`/marketplace/${project.slug}`}>
        <Card className="group border-border bg-card hover:border-primary/40 hover:shadow-md transition-all p-5 rounded-xl flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono border ${
                    CATEGORY_STYLES[project.category] || "bg-primary/10 text-primary border-primary/30"
                  }`}
                >
                  {project.category}
                </Badge>
                {matchScore !== undefined && matchScore >= 60 && (
                  <Badge className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 gap-1 px-1.5 py-0.5">
                    <Zap className="w-3 h-3 text-emerald-400" /> {matchScore}% Match
                  </Badge>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleSave();
                }}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>

            <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {project.title}
            </h3>

            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1 pt-1">
              {project.skills.slice(0, 4).map((s) => (
                <Badge key={s} variant="secondary" className="text-[10px] font-mono bg-muted">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono tabular-nums">
            <div className="flex items-center gap-1 font-bold text-primary">
              <CircleDollarSign className="w-3.5 h-3.5" />
              ${project.budget_min.toLocaleString()} – ${project.budget_max.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {project.timeline_weeks}w
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

const ProjectListItem = ({
  project,
  index,
  saved,
  matchScore,
  onToggleSave,
}: {
  project: ReturnType<typeof normalizeProject>;
  index: number;
  saved: boolean;
  matchScore?: number;
  onToggleSave: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
    >
      <Link to={`/marketplace/${project.slug}`}>
        <Card className="group border-border bg-card hover:border-primary/40 transition-all p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-[10px] font-mono border ${
                  CATEGORY_STYLES[project.category] || "bg-primary/10 text-primary border-primary/30"
                }`}
              >
                {project.category}
              </Badge>
              {matchScore !== undefined && matchScore >= 60 && (
                <Badge className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 gap-1 px-1.5 py-0.5">
                  <Zap className="w-3 h-3 text-emerald-400" /> {matchScore}% Match
                </Badge>
              )}
              <span className="text-[10px] font-mono text-muted-foreground">
                {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
              </span>
            </div>
            <h3 className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
          </div>

          <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
            <div className="text-right font-mono">
              <div className="text-xs font-bold text-primary tabular-nums">
                ${project.budget_min.toLocaleString()} – ${project.budget_max.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted-foreground">{project.timeline_weeks} weeks</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default Projects;
