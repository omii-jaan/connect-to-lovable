import { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft, Eye, Clock, Bookmark, BookmarkCheck, Send,
  CircleDollarSign, BarChart3, Target, Share2, AlertTriangle,
  Mail, Briefcase, ChevronRight, ArrowUpRight, CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { notify as toast } from "@/lib/notify";
import { sendNotification } from "@/lib/notifications";
import { MOCK_HIRE_PROJECTS } from "@/lib/marketplace-data";
import { formatDistanceToNow } from "date-fns";

const ProjectDetail = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const projectParam = slug || id;
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Array<{ id: string; author: string; avatar: string; text: string; time: string }>>([
    {
      id: "c1",
      author: "Demo Builder",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demobuilder&backgroundColor=00f2ff",
      text: "Great scope! We built a similar vector pipeline with Qdrant recently.",
      time: "1 day ago",
    },
    {
      id: "c2",
      author: "Priya Sharma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=c0aede",
      text: "Is the budget flexible if we deliver ahead of schedule?",
      time: "2 days ago",
    },
  ]);

  const project = MOCK_HIRE_PROJECTS.find(
    (p) => p.id === projectParam || p.title.toLowerCase().replace(/\s+/g, "-") === projectParam
  );

  const handleGuestAuthPrompt = (actionName: string) => {
    toast.error(`Sign in to ${actionName}`, {
      action: {
        label: "Sign In",
        onClick: () => navigate("/login", { state: { from: location } }),
      },
    });
  };

  const handleSave = () => {
    if (!user) {
      handleGuestAuthPrompt("bookmark projects");
      return;
    }
    const nextSaved = !saved;
    setSaved(nextSaved);
    toast(nextSaved ? "Project saved!" : "Removed from saved", { duration: 2000 });

    if (nextSaved && project) {
      const recipientUid = project.creator?.username === "priya_ships" ? "user_b" : (project.creator?.id || "user_b");
      sendNotification({
        recipientUid,
        actorUid: user.id,
        actorName: user.user_metadata?.full_name || "Alex Rivera",
        actorAvatar: user.user_metadata?.avatar_url || "",
        type: "like",
        targetId: project.id,
        title: `${user.user_metadata?.full_name || "A builder"} saved "${project.title}"`,
        text: "Project saved/liked",
        link: `/project/${project.slug || project.id}`,
      });
    }
  };

  const handleMessageCreator = () => {
    if (!user) {
      handleGuestAuthPrompt("message the project creator");
      return;
    }
    navigate(`/messages?user=${project?.creator?.username || "creator"}`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      handleGuestAuthPrompt("post comments");
      return;
    }
    const commentContent = commentText.trim();
    setComments((prev) => [
      ...prev,
      {
        id: "c_" + Date.now(),
        author: user.user_metadata?.full_name || "You",
        avatar: user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        text: commentContent,
        time: "Just now",
      },
    ]);
    setCommentText("");
    toast.success("Comment posted!");

    if (project) {
      const recipientUid = project.creator?.username === "priya_ships" ? "user_b" : (project.creator?.id || "user_b");
      sendNotification({
        recipientUid,
        actorUid: user.id,
        actorName: user.user_metadata?.full_name || "Alex Rivera",
        actorAvatar: user.user_metadata?.avatar_url || "",
        type: "comment",
        targetId: project.id,
        title: `${user.user_metadata?.full_name || "A builder"} commented on "${project.title}"`,
        text: commentContent,
        link: `/project/${project.slug || project.id}`,
      });
    }
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

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-muted border border-border/50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground mb-2">Project not found</h2>
          <p className="text-sm text-muted-foreground mb-6">This project doesn't exist or has been removed</p>
          <Link to="/projects"><Button variant="outline" size="sm">Browse Projects</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none h-64" />

        <div className="max-w-5xl mx-auto px-4 py-8 relative">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/projects" className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Link to="/projects" className="hover:text-foreground transition-colors">projects</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground truncate max-w-[200px]">{project.title}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-border-subtle bg-card shadow-elev-sm p-6 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/[0.03] to-transparent pointer-events-none rounded-full -translate-y-1/2 translate-x-1/2" />

                  <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                        <Briefcase className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h1 className="font-display font-bold text-2xl text-foreground">{project.title}</h1>
                        <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border border-accent/30 bg-accent/10 text-accent`}>
                            ● {project.status.toUpperCase()}
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            Posted {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {project.views_count} views
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        aria-label={copied ? "Link copied to clipboard" : "Copy link to this project"}
                        onClick={handleShare}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card/[0.04] bg-muted border border-border/50 transition-all"
                      >
                        {copied ? <CheckCheck className="w-4 h-4 text-accent" /> : <Share2 className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        aria-label={saved ? "Remove from saved projects" : "Save this project"}
                        aria-pressed={saved}
                        onClick={handleSave}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          saved
                            ? "text-primary bg-primary/10 border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/[0.04] bg-muted border border-border/50"
                        }`}
                      >
                        {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 relative z-10">{project.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 relative z-10">
                    {[
                      { label: "Budget", value: `$${project.budget_min.toLocaleString()} – $${project.budget_max.toLocaleString()}`, icon: CircleDollarSign, color: "accent" },
                      { label: "Timeline", value: `${project.timeline_weeks} weeks`, icon: Clock, color: "primary" },
                      { label: "Scope", value: project.scope.charAt(0).toUpperCase() + project.scope.slice(1), icon: Target, color: "secondary" },
                      { label: "Complexity", value: project.complexity.charAt(0).toUpperCase() + project.complexity.slice(1), icon: BarChart3, color: "primary" },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="rounded-xl bg-background/80 border border-border/40 p-3.5 hover:border-border/60 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-5 h-5 rounded flex items-center justify-center ${
                            stat.color === "accent" ? "bg-accent/10" : stat.color === "secondary" ? "bg-secondary/10" : "bg-primary/10"
                          }`}>
                            <stat.icon className={`w-3 h-3 ${
                              stat.color === "accent" ? "text-accent" : stat.color === "secondary" ? "text-secondary" : "text-primary"
                            }`} />
                          </div>
                          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.required_skills.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px] font-mono bg-background/80 border border-border/30 text-muted-foreground hover:border-primary/30 hover:text-primary transition-all cursor-default">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Preferred Tech Stack</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.preferred_tech_stack.map((t) => (
                          <Badge key={t} variant="outline" className="text-[10px] font-mono border-primary/30 bg-primary/[0.04] text-primary">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Success Criteria</p>
                      <div className="text-sm text-foreground bg-background/80 rounded-xl border border-border/40 p-4 leading-relaxed">
                        {project.success_criteria}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Comments Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="border-border-subtle bg-card shadow-elev-sm p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center justify-between">
                    <span>Discussion & Comments ({comments.length})</span>
                    {!user && <span className="text-[10px] font-mono text-muted-foreground">Sign in to join discussion</span>}
                  </h3>

                  <form onSubmit={handleAddComment} className="space-y-2">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={user ? "Ask a question or leave feedback..." : "Sign in to leave a comment..."}
                      className="w-full h-20 p-3 rounded-lg bg-muted/40 border border-border/50 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 font-mono"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm" className="text-xs font-mono gap-1">
                        <Send className="w-3 h-3" /> Post Comment
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-3 pt-2 border-t border-border/40">
                    {comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
                        <img src={c.avatar} alt="" className="w-7 h-7 rounded-full border border-border" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-foreground">{c.author}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">{c.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <Card className="border-border-subtle bg-card shadow-elev-sm p-5 sticky top-8">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                      {project.creator?.avatar_url ? (
                        <img src={project.creator.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link to={`/builder/${project.creator?.username}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block">
                        {project.creator?.full_name || "Unknown"}
                      </Link>
                      <p className="text-[10px] font-mono text-muted-foreground">Project Creator</p>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0" />
                  </div>

                  <div className="space-y-3 mb-5">
                    <Button
                      variant="outline"
                      className="w-full text-xs h-9"
                      onClick={handleMessageCreator}
                    >
                      <Mail className="w-3.5 h-3.5" /> Message Creator
                    </Button>
                  </div>

                  <div className="pt-3 border-t border-border/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground">Category</span>
                      <div className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-primary/[0.07] border border-cyan-500/20 text-primary">
                        {project.category}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground">Status</span>
                      <span className="text-accent font-semibold capitalize">{project.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground">Visibility</span>
                      <span className="text-foreground capitalize">{project.visibility}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground">Created</span>
                      <span className="text-foreground">{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
