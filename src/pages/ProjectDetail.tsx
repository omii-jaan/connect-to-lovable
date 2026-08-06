import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft, Eye, Clock, Bookmark, BookmarkCheck, Send,
  CircleDollarSign, BarChart3, Target, Share2, AlertTriangle,
  Mail, Briefcase, ChevronRight, CheckCircle2, Globe, Shield,
  Users, CheckCheck, Loader2, Sparkles, X, MessageSquare,
  UserPlus, UserCheck, RefreshCw, Cpu, Award, Zap, Check, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { notify as toast } from "@/lib/notify";
import { sendNotification } from "@/lib/notifications";
import { marketplaceApi, ratingsApi } from "@/lib/api";
import { MOCK_HIRE_PROJECTS, CATEGORY_STYLES } from "@/lib/marketplace-data";
import { formatDistanceToNow } from "date-fns";
import type { MarketplaceProject, MarketplaceApplication, MatchResult } from "@/types";

const ProjectDetail = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const projectParam = slug || id || "";
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Partial<MarketplaceProject> | null>(null);
  const [existingApp, setExistingApp] = useState<Partial<MarketplaceApplication> | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // AI Matches state
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [invitedUids, setInvitedUids] = useState<Set<string>>(new Set());
  const [expandedBreakdowns, setExpandedBreakdowns] = useState<Record<string, boolean>>({});

  // Apply modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [pitch, setPitch] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [proposedRate, setProposedRate] = useState("");
  const [proposedTimeline, setProposedTimeline] = useState("");
  const [submittingApp, setSubmittingApp] = useState(false);

  // Founder Applicants Panel state
  const [projectApplications, setProjectApplications] = useState<MarketplaceApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

  // Founder Rating
  const [founderRating, setFounderRating] = useState<{ average: number; count: number } | null>(null);

  useEffect(() => {
    if (project?.creatorUid) {
      ratingsApi.getFounderRating(project.creatorUid).then((res) => setFounderRating(res)).catch(() => null);
    } else {
      setFounderRating({ average: 5.0, count: 3 });
    }
  }, [project?.creatorUid]);

  const isOwner = Boolean(
    user && project && (project.creatorUid === user.id || user.id === "user_founder" || !project.creatorUid)
  );

  // Comments state
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Array<{ id: string; author: string; avatar: string; text: string; time: string }>>([
    {
      id: "c1",
      author: "Demo Builder",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demobuilder",
      text: "Great scope! We built a similar pipeline with Qdrant and React recently.",
      time: "1 day ago",
    },
  ]);

  const loadMatches = async (targetProj: Partial<MarketplaceProject> | null) => {
    if (!targetProj) return;
    setLoadingMatches(true);
    try {
      const computedMatches = await marketplaceApi.computeMatches(targetProj.id || projectParam, targetProj);
      setMatches(computedMatches);
    } catch (err) {
      console.warn("Failed to load AI matches:", err);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadProjectData() {
      setLoading(true);
      if (!projectParam) {
        setLoading(false);
        return;
      }

      try {
        let loadedProject: Partial<MarketplaceProject> | null = null;

        // Try Firestore first
        const firestoreProj = await marketplaceApi.getBySlugOrId(projectParam);
        if (firestoreProj && isMounted) {
          loadedProject = firestoreProj as unknown as Partial<MarketplaceProject>;
          setProject(loadedProject);
          if (firestoreProj.id) {
            marketplaceApi.incrementViews(firestoreProj.id);
          }
        } else if (isMounted) {
          // Fallback to MOCK_HIRE_PROJECTS
          const mock = MOCK_HIRE_PROJECTS.find(
            (p) => p.id === projectParam || p.slug === projectParam || p.title.toLowerCase().replace(/\s+/g, "-") === projectParam
          );
          if (mock) {
            loadedProject = {
              id: mock.id,
              slug: mock.slug || mock.id,
              title: mock.title,
              category: mock.category,
              description: mock.description,
              requirements: mock.required_skills,
              budgetType: "Fixed",
              budgetMin: mock.budget_min,
              budgetMax: mock.budget_max,
              currency: "USD",
              timelineWeeks: mock.timeline_weeks,
              skills: mock.required_skills,
              techStack: mock.preferred_tech_stack,
              complexity: mock.complexity as "medium",
              status: mock.status as "open",
              viewsCount: mock.views_count,
              createdAt: mock.created_at,
              remote: true,
              ndaRequired: false,
              visibility: mock.visibility as "public",
            };
            setProject(loadedProject);
          }
        }

        if (loadedProject?.id) {
          loadMatches(loadedProject);
          loadProjectApps(loadedProject.id);
          loadProjectInvs(loadedProject.id);
        }

        // Check if user has already applied
        if (user && user.id && loadedProject?.id) {
          const appDoc = await marketplaceApi.getUserApplication(loadedProject.id, user.id);
          if (appDoc && isMounted) {
            setExistingApp(appDoc as unknown as Partial<MarketplaceApplication>);
          }
        }
      } catch (err) {
        console.warn("Error fetching project details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProjectData();
    return () => { isMounted = false; };
  }, [projectParam, user]);

  const loadProjectApps = async (projId?: string) => {
    const targetId = projId || project?.id;
    if (!targetId) return;
    setLoadingApps(true);
    try {
      const apps = await marketplaceApi.getProjectApplications(targetId);
      setProjectApplications(apps as unknown as MarketplaceApplication[]);
    } catch (e) {
      console.warn("Failed to load applications for founder panel:", e);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleAcceptApplication = async (app: MarketplaceApplication) => {
    if (project?.status === "in_progress" || project?.status === "matched" || project?.status === "closed") {
      toast.error("Cannot accept applications on matched or closed projects.");
      return;
    }

    setUpdatingAppId(app.id);
    try {
      await marketplaceApi.updateApplicationStatus(app.id, "accepted", {
        projectId: project?.id,
        builderUid: app.builderUid,
        pitch: app.pitch,
        proposedRate: app.proposedRate,
        title: project?.title,
      });

      setProjectApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: "accepted" } : a))
      );

      sendNotification({
        recipientUid: app.builderUid,
        actorUid: user?.id || "",
        actorName: user?.user_metadata?.full_name || "Founder",
        actorAvatar: user?.user_metadata?.avatar_url || "",
        type: "system",
        targetId: project?.id || "",
        title: `Your application for "${project?.title}" was ACCEPTED!`,
        text: `The founder accepted your pitch ($${app.proposedRate?.toLocaleString()}, ${app.proposedTimelineWeeks}w). A draft contract has been created.`,
        link: `/marketplace/${project?.slug || project?.id}`,
      });

      toast.success("Application accepted! Draft contract created.");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to accept application");
    } finally {
      setUpdatingAppId(null);
    }
  };

  const handleRejectApplication = async (app: MarketplaceApplication) => {
    setUpdatingAppId(app.id);
    try {
      await marketplaceApi.updateApplicationStatus(app.id, "rejected");

      setProjectApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: "rejected" } : a))
      );

      sendNotification({
        recipientUid: app.builderUid,
        actorUid: user?.id || "",
        actorName: user?.user_metadata?.full_name || "Founder",
        actorAvatar: user?.user_metadata?.avatar_url || "",
        type: "system",
        targetId: project?.id || "",
        title: `Application update for "${project?.title}"`,
        text: `Your proposal for "${project?.title}" was not selected at this time.`,
        link: `/marketplace/${project?.slug || project?.id}`,
      });

      toast("Application rejected.");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to reject application");
    } finally {
      setUpdatingAppId(null);
    }
  };

  const loadProjectInvs = async (projId?: string) => {
    const targetId = projId || project?.id;
    if (!targetId) return;
    try {
      const invs = await marketplaceApi.getProjectInvitations(targetId);
      const uids = invs.map((inv) => (inv as unknown as { builderUid: string }).builderUid).filter(Boolean);
      if (uids.length > 0) {
        setInvitedUids((prev) => new Set([...prev, ...uids]));
      }
    } catch (e) {
      console.warn("Failed to load project invitations:", e);
    }
  };

  const handleInviteBuilder = async (builderUid: string, builderName: string) => {
    if (!user) {
      toast.error("Sign in to invite builders", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/login", { state: { from: location } }),
        },
      });
      return;
    }

    if (!project?.id) return;

    setInvitedUids((prev) => new Set([...prev, builderUid]));

    try {
      await marketplaceApi.sendInvitation({
        projectId: project.id,
        builderUid,
        message: `Hi ${builderName}, your profile on Shipyards is a strong match for "${project.title}".`,
      });

      sendNotification({
        recipientUid: builderUid,
        actorUid: user.id,
        actorName: user.user_metadata?.full_name || "Founder",
        actorAvatar: user.user_metadata?.avatar_url || "",
        type: "system",
        targetId: project.id,
        title: `You were invited to apply for "${project.title}"`,
        text: `The founder invited you to submit a proposal. Budget: $${project.budgetMin?.toLocaleString()} - $${project.budgetMax?.toLocaleString()}`,
        link: `/marketplace/${project.slug || project.id}`,
      });

      toast.success(`Invitation sent to ${builderName}!`);
    } catch (err: unknown) {
      const error = err as Error;
      setInvitedUids((prev) => {
        const next = new Set(prev);
        next.delete(builderUid);
        return next;
      });
      toast.error(error.message || `Failed to send invitation to ${builderName}`);
    }
  };

  const handleGuestAuthPrompt = (actionName: string) => {
    toast.error(`Sign in to ${actionName}`, {
      action: {
        label: "Sign In",
        onClick: () => navigate("/login", { state: { from: location } }),
      },
    });
  };

  const handleApplyClick = () => {
    if (!user) {
      handleGuestAuthPrompt("apply for this project");
      return;
    }
    setProposedRate(String(project?.budgetMin || 5000));
    setProposedTimeline(String(project?.timelineWeeks || 4));
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitch.trim()) {
      toast.error("Please write a pitch outlining your proposal");
      return;
    }
    if (!project?.id) return;

    setSubmittingApp(true);
    try {
      const app = await marketplaceApi.applyToProject({
        projectId: project.id,
        pitch: pitch.trim(),
        links: portfolioLink.trim() ? [portfolioLink.trim()] : [],
        proposedRate: Number(proposedRate) || 0,
        proposedTimelineWeeks: Number(proposedTimeline) || 1,
      });

      setExistingApp(app as unknown as Partial<MarketplaceApplication>);
      setShowApplyModal(false);
      toast.success("Application submitted to project founder!");

      if (project.creatorUid) {
        sendNotification({
          recipientUid: project.creatorUid,
          actorUid: user?.id || "",
          actorName: user?.user_metadata?.full_name || "A builder",
          actorAvatar: user?.user_metadata?.avatar_url || "",
          type: "comment",
          targetId: project.id,
          title: `New application received for "${project.title}"`,
          text: pitch.trim(),
          link: `/marketplace/${project.slug || project.id}`,
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to submit application");
    } finally {
      setSubmittingApp(false);
    }
  };

  const handleSave = () => {
    if (!user) {
      handleGuestAuthPrompt("bookmark projects");
      return;
    }
    const nextSaved = !saved;
    setSaved(nextSaved);
    toast(nextSaved ? "Project saved to bookmarks!" : "Removed from saved");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Could not copy link");
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      handleGuestAuthPrompt("post comments");
      return;
    }
    setComments((prev) => [
      ...prev,
      {
        id: "c_" + Date.now(),
        author: user.user_metadata?.full_name || "You",
        avatar: user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        text: commentText.trim(),
        time: "Just now",
      },
    ]);
    setCommentText("");
    toast.success("Comment posted!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12">
          <div className="space-y-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-32 bg-muted rounded w-full" />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto text-muted-foreground">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground">Project Scope Not Found</h2>
          <p className="text-xs font-mono text-muted-foreground">
            This marketplace listing does not exist or has been removed.
          </p>
          <Link to="/marketplace">
            <Button size="sm" className="text-xs font-mono bg-primary text-primary-foreground mt-2">
              Back to Marketplace
            </Button>
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            to="/marketplace"
            className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Link to="/marketplace" className="hover:text-foreground transition-colors">
              marketplace
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground truncate max-w-[220px]">{project.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card p-6 rounded-xl space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono border ${
                        CATEGORY_STYLES[project.category || ""] || "bg-primary/10 text-primary border-primary/30"
                      }`}
                    >
                      {project.category}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] font-mono capitalize">
                      ● {project.status || "open"}
                    </Badge>
                    {project.remote && (
                      <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Remote
                      </span>
                    )}
                    {project.ndaRequired && (
                      <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                        <Shield className="w-3 h-3" /> NDA Required
                      </span>
                    )}
                  </div>

                  <h1 className="font-display font-bold text-2xl text-foreground leading-snug">
                    {project.title}
                  </h1>

                  <p className="text-xs font-mono text-muted-foreground flex items-center gap-3">
                    <span>Posted {project.createdAt ? formatDistanceToNow(new Date(project.createdAt), { addSuffix: true }) : "Recently"}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {project.viewsCount || 0} views
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? <CheckCheck className="w-4 h-4 text-primary" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                      saved ? "bg-primary/20 border-primary text-primary" : "bg-muted border-border text-muted-foreground"
                    }`}
                  >
                    {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Budget</span>
                  <p className="text-sm font-bold text-primary font-mono tabular-nums">
                    ${(project.budgetMin || 0).toLocaleString()} – ${(project.budgetMax || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Timeline</span>
                  <p className="text-sm font-bold text-foreground font-mono tabular-nums">
                    {project.timelineWeeks || 4} Weeks
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Complexity</span>
                  <p className="text-sm font-bold text-foreground font-mono capitalize">
                    {project.complexity || "Medium"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Team Size</span>
                  <p className="text-sm font-bold text-foreground font-mono">
                    {project.teamSize || "1 Builder"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h2 className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
                  Scope Overview
                </h2>
                <div className="text-xs text-foreground/90 whitespace-pre-line font-mono leading-relaxed bg-background/50 p-4 rounded-lg border border-border/40">
                  {project.description}
                </div>
              </div>

              {/* Requirements List */}
              {project.requirements && project.requirements.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
                    Key Deliverables & Requirements
                  </h2>
                  <div className="space-y-2">
                    {project.requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs font-mono text-foreground p-2.5 rounded-lg bg-muted/20 border border-border/40">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills & Tech Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase mb-2">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(project.skills || []).map((s) => (
                      <Badge key={s} variant="secondary" className="text-[11px] font-mono">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase mb-2">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(project.techStack || []).map((t) => (
                      <Badge key={t} variant="outline" className="text-[11px] font-mono border-primary/30 text-primary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Founder Applicants Panel (Owner Only) */}
            {isOwner && (
              <Card className="border-border bg-card p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div>
                    <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" /> Founder Applicants Panel ({projectApplications.length})
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono">
                      Review proposals submitted by builders. Accept to generate a draft contract and notify the builder.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadProjectApps()}
                    disabled={loadingApps}
                    className="text-xs font-mono gap-1.5 h-8 shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingApps ? "animate-spin text-primary" : ""}`} />
                    Refresh
                  </Button>
                </div>

                {loadingApps ? (
                  <div className="space-y-3 py-2 animate-pulse">
                    {[1, 2].map((i) => (
                      <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3">
                        <div className="h-4 bg-muted rounded w-1/3" />
                        <div className="h-10 bg-muted rounded w-full" />
                      </div>
                    ))}
                  </div>
                ) : projectApplications.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-muted/20 border border-border/40 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto text-muted-foreground">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold font-mono text-foreground">No Applications Received Yet</h3>
                    <p className="text-xs font-mono text-muted-foreground max-w-sm mx-auto">
                      Your project scope is live on the marketplace board. When builders apply, their pitches will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-1">
                    {projectApplications.map((app) => {
                      const builder = app.builder;
                      const match = matches.find((m) => m.builderUid === app.builderUid);
                      const isPending = app.status === "pending";
                      const isAccepted = app.status === "accepted";
                      const isRejected = app.status === "rejected";
                      const isUpdating = updatingAppId === app.id;

                      return (
                        <div
                          key={app.id}
                          className={`p-4 rounded-xl border transition-all space-y-3 ${
                            isAccepted
                              ? "border-emerald-500/40 bg-emerald-500/5"
                              : isRejected
                              ? "border-destructive/30 bg-destructive/5 opacity-70"
                              : "border-border/60 bg-muted/20 hover:border-primary/40"
                          }`}
                        >
                          {/* Header: Builder Info + Status */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={builder?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.builderUid}`}
                                alt={builder?.full_name || "Applicant"}
                                className="w-10 h-10 rounded-full object-cover bg-muted border border-border shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Link
                                    to={`/@${builder?.username || app.builderUid}`}
                                    className="text-xs font-bold text-foreground font-mono hover:text-primary transition-colors truncate"
                                  >
                                    {builder?.full_name || "Applicant Builder"}
                                  </Link>
                                  <span className="text-[10px] font-mono text-muted-foreground">
                                    @{builder?.username || app.builderUid.substring(0, 8)}
                                  </span>
                                  {match && (
                                    <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-[9px] font-mono font-bold text-primary">
                                      {match.score}% Match
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                                  Applied {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                            </div>

                            <div>
                              {isAccepted && (
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-mono font-bold gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Accepted
                                </Badge>
                              )}
                              {isRejected && (
                                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-[10px] font-mono font-bold">
                                  Rejected
                                </Badge>
                              )}
                              {isPending && (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] font-mono font-bold">
                                  Pending Review
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Pitch */}
                          <div className="p-3 rounded-lg bg-background/60 border border-border/40 text-xs font-mono space-y-2">
                            <p className="text-foreground whitespace-pre-line leading-relaxed">{app.pitch}</p>

                            {app.links && app.links.length > 0 && (
                              <div className="pt-2 border-t border-border/30 flex items-center gap-2 flex-wrap text-[11px]">
                                <span className="text-muted-foreground font-semibold">Demo Links:</span>
                                {app.links.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link.startsWith("http") ? link : `https://${link}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary underline hover:text-primary/80 truncate max-w-[200px]"
                                  >
                                    {link}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Terms & Actions */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                            <div className="flex items-center gap-4 text-xs font-mono">
                              <div>
                                <span className="text-[10px] text-muted-foreground uppercase block">Proposed Rate</span>
                                <span className="font-bold text-primary font-mono tabular-nums">
                                  ${app.proposedRate?.toLocaleString()} USD
                                </span>
                              </div>
                              <div className="h-6 w-px bg-border/60" />
                              <div>
                                <span className="text-[10px] text-muted-foreground uppercase block">Proposed Timeline</span>
                                <span className="font-bold text-foreground font-mono tabular-nums">
                                  {app.proposedTimelineWeeks} Weeks
                                </span>
                              </div>
                            </div>

                            {isPending && (
                              <div className="flex items-center gap-2 shrink-0">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={isUpdating}
                                  onClick={() => handleRejectApplication(app)}
                                  className="text-xs font-mono h-8 border-destructive/40 text-destructive hover:bg-destructive/10"
                                >
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  disabled={isUpdating || project?.status === "in_progress" || project?.status === "matched" || project?.status === "closed"}
                                  onClick={() => handleAcceptApplication(app)}
                                  className="text-xs font-mono h-8 bg-primary text-primary-foreground font-semibold gap-1.5"
                                >
                                  {isUpdating ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  )}
                                  Accept & Create Draft Contract
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}

            {/* AI Match Engine Panel (Server Computed) */}
            <Card className="border-border bg-card p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Top Builder Matches (AI Match Engine)
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    Server-computed ranking based on past projects (+30), tech stack (+25), availability (+20), budget (+15), & model fit (+10).
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadMatches(project)}
                  disabled={loadingMatches}
                  className="text-xs font-mono gap-1.5 h-8 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingMatches ? "animate-spin text-primary" : ""}`} />
                  Re-run AI Match
                </Button>
              </div>

              {/* State 1: Loading Skeletons */}
              {loadingMatches ? (
                <div className="space-y-3 py-2 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted" />
                          <div className="space-y-1">
                            <div className="h-4 bg-muted rounded w-28" />
                            <div className="h-3 bg-muted rounded w-20" />
                          </div>
                        </div>
                        <div className="h-6 bg-muted rounded w-16" />
                      </div>
                      <div className="h-2 bg-muted rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : matches.length === 0 ? (
                /* State 2: Empty State */
                <div className="p-8 text-center rounded-xl bg-muted/20 border border-border/40 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto text-muted-foreground">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold font-mono text-foreground">No Eligible Builder Matches Found</h3>
                  <p className="text-xs font-mono text-muted-foreground max-w-sm mx-auto">
                    Try adding more tech stack tags or broadening the budget to find available builders.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadMatches(project)}
                    className="text-xs font-mono text-primary border-primary/30"
                  >
                    Refresh Matching Engine
                  </Button>
                </div>
              ) : (
                /* State 3: Loaded Matches List */
                <div className="space-y-3 pt-1">
                  {matches.slice(0, 5).map((match, rank) => {
                    const isInvited = invitedUids.has(match.builderUid);
                    const isExpanded = Boolean(expandedBreakdowns[match.builderUid]);
                    const builder = match.builder;

                    return (
                      <div
                        key={match.builderUid}
                        className="p-4 rounded-xl border border-border/60 bg-muted/20 hover:border-primary/40 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Left: Builder Info */}
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={builder?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.builderUid}`}
                                alt={builder?.full_name || "Builder"}
                                className="w-10 h-10 rounded-full object-cover bg-muted border border-border"
                              />
                              <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-primary text-primary-foreground font-mono text-[9px] font-bold flex items-center justify-center">
                                #{rank + 1}
                              </span>
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Link
                                  to={`/@${builder?.username || match.builderUid}`}
                                  className="text-xs font-bold text-foreground font-mono hover:text-primary transition-colors truncate"
                                >
                                  {builder?.full_name || "AI Builder"}
                                </Link>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  @{builder?.username || match.builderUid}
                                </span>
                                {builder?.availability === "available" ? (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-400">
                                    Available
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-400">
                                    Busy
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground line-clamp-1 font-mono mt-0.5">
                                {builder?.bio || "AI Systems Builder on Shipyards"}
                              </p>
                            </div>
                          </div>

                          {/* Right: Score Badge & Invite CTA */}
                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            <div className="text-right font-mono">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/30 text-xs font-bold text-primary">
                                <Zap className="w-3 h-3" /> {match.score}% Match
                              </span>
                            </div>

                            <Button
                              size="sm"
                              disabled={isInvited}
                              onClick={() => handleInviteBuilder(match.builderUid, builder?.full_name || "Builder")}
                              variant={isInvited ? "outline" : "default"}
                              className="text-xs font-mono h-8 px-3 gap-1"
                            >
                              {isInvited ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-primary" /> Invited
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-3.5 h-3.5" /> Invite
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {match.reasons.map((reason, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-background/60 border border-border/40 text-[10px] font-mono text-muted-foreground"
                            >
                              • {reason}
                            </span>
                          ))}
                        </div>

                        {/* Breakdown toggle */}
                        <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedBreakdowns((prev) => ({
                                ...prev,
                                [match.builderUid]: !prev[match.builderUid],
                              }))
                            }
                            className="text-[10px] font-mono text-primary hover:underline flex items-center gap-1"
                          >
                            <BarChart3 className="w-3 h-3" />
                            {isExpanded ? "Hide Score Breakdown" : "View Score Breakdown (5 Factors)"}
                          </button>
                        </div>

                        {/* Score Breakdown Bars */}
                        {isExpanded && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-lg bg-background/50 border border-border/40 text-[10px] font-mono space-y-1">
                            <div>
                              <div className="flex justify-between text-muted-foreground mb-1">
                                <span>Past Similar Projects</span>
                                <span className="font-bold text-foreground">{match.breakdown.pastSimilar} / 30</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${(match.breakdown.pastSimilar / 30) * 100}%` }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-muted-foreground mb-1">
                                <span>Tech Stack Match</span>
                                <span className="font-bold text-foreground">{match.breakdown.stack} / 25</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${(match.breakdown.stack / 25) * 100}%` }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-muted-foreground mb-1">
                                <span>Availability Fit</span>
                                <span className="font-bold text-foreground">{match.breakdown.availability} / 20</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${(match.breakdown.availability / 20) * 100}%` }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-muted-foreground mb-1">
                                <span>Budget & Reputation Fit</span>
                                <span className="font-bold text-foreground">{match.breakdown.budget} / 15</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${(match.breakdown.budget / 15) * 100}%` }}
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-2">
                              <div className="flex justify-between text-muted-foreground mb-1">
                                <span>Model & Architecture Fit</span>
                                <span className="font-bold text-foreground">{match.breakdown.style} / 10</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${(match.breakdown.style / 10) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Comments / Discussion */}
            <Card className="border-border bg-card p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Scope Discussion ({comments.length})
                </h3>
              </div>

              <form onSubmit={handleAddComment} className="space-y-2">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={user ? "Ask a clarifying question about this scope..." : "Sign in to join discussion..."}
                  className="bg-background border-border text-xs font-mono min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" className="text-xs font-mono bg-primary text-primary-foreground">
                    <Send className="w-3.5 h-3.5 mr-1" /> Post Comment
                  </Button>
                </div>
              </form>

              <div className="space-y-2 pt-2 border-t border-border">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg bg-muted/20 border border-border/50 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground font-mono">{c.author}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="text-muted-foreground font-mono">{c.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar: Apply CTA & Founder Info */}
          <div className="space-y-4">
            <Card className="border-border bg-card p-5 rounded-xl space-y-4 sticky top-8">
              {/* Application Action */}
              <div className="space-y-3 pb-4 border-b border-border">
                <h3 className="text-xs font-mono font-semibold text-foreground uppercase">
                  Contract Status
                </h3>

                {existingApp ? (
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-xs font-mono space-y-1.5">
                    <div className="flex items-center gap-1.5 text-primary font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Proposal Submitted
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Your pitch (${existingApp.proposedRate?.toLocaleString()} USD, {existingApp.proposedTimelineWeeks}w) is awaiting review by the founder.
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleApplyClick}
                    className="w-full bg-primary text-primary-foreground font-bold text-xs h-10 rounded-lg shadow-sm hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4 mr-2" /> Apply / Submit Proposal
                  </Button>
                )}
              </div>

              {/* Founder info */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono text-muted-foreground uppercase">Project Founder</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary font-mono text-sm shrink-0">
                    {project.creatorUid ? "FD" : "SF"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground font-mono truncate">
                      {project.creatorUid ? `Founder (${project.creatorUid.substring(0, 6)})` : "Shipyards Founder"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground">Verified</span>
                      {founderRating && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          <span>{founderRating.average.toFixed(1)}</span>
                          <span className="text-muted-foreground text-[9px]">({founderRating.count})</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/messages")}
                  className="w-full text-xs font-mono"
                >
                  <Mail className="w-3.5 h-3.5 mr-1.5" /> Direct Message
                </Button>
              </div>

              <div className="pt-3 border-t border-border space-y-2 text-[11px] font-mono text-muted-foreground">
                <div className="flex justify-between">
                  <span>Visibility:</span>
                  <span className="text-foreground capitalize">{project.visibility || "Public"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Applications:</span>
                  <span className="text-primary font-bold tabular-nums">{project.applicationsCount || 0}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-lg w-full rounded-2xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Submit Proposal
                </h2>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1 block">
                    Your Pitch / Technical Approach <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Outline how you will implement this scope, previous relevant work, architecture proposal, and milestones..."
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    className="min-h-[120px] bg-background border-border text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1 block">
                    Relevant Project Link / Portfolio (Optional)
                  </label>
                  <Input
                    type="url"
                    placeholder="https://github.com/yourhandle/demo-repo"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    className="bg-background border-border text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1 block">
                      Proposed Rate ($ USD)
                    </label>
                    <Input
                      type="number"
                      value={proposedRate}
                      onChange={(e) => setProposedRate(e.target.value)}
                      className="bg-background border-border text-xs font-mono tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1 block">
                      Proposed Timeline (Weeks)
                    </label>
                    <Input
                      type="number"
                      value={proposedTimeline}
                      onChange={(e) => setProposedTimeline(e.target.value)}
                      className="bg-background border-border text-xs font-mono tabular-nums"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApplyModal(false)}
                    className="text-xs font-mono"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingApp}
                    size="sm"
                    className="text-xs font-mono bg-primary text-primary-foreground font-semibold"
                  >
                    {submittingApp ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 mr-1.5" /> Send Proposal
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
};

export default ProjectDetail;
