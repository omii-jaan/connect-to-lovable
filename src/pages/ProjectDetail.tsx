import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Zap, Eye, Clock, Bookmark, BookmarkCheck, Sparkles, Send,
  ChevronDown, ChevronUp, User, Check, X as XIcon, Loader2,
  CircleDollarSign, BarChart3, Target, Share2, AlertTriangle, BadgeCheck,
  Globe, Mail, Briefcase, ChevronRight, Flame, ArrowUpRight, Copy, CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { notify as toast } from "@/lib/notify";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MOCK_HIRE_PROJECTS, MOCK_MATCHES } from "@/lib/marketplace-data";
import { formatDistanceToNow } from "date-fns";
import type { HireProject, BuilderMatch } from "@/types";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [interested, setInterested] = useState(false);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [interestDialog, setInterestDialog] = useState(false);
  const [inviteDialog, setInviteDialog] = useState<BuilderMatch | null>(null);
  const [copied, setCopied] = useState(false);
  const [invitedSet, setInvitedSet] = useState<Set<string>>(new Set());

  const project = MOCK_HIRE_PROJECTS.find((p) => p.id === id);
  const matches = id ? MOCK_MATCHES[id] || [] : [];

  const handleSave = () => {
    setSaved(!saved);
    toast(saved ? "Removed from saved" : "Project saved!", { duration: 2000 });
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

  const handleInterestConfirm = () => {
    setInterested(true);
    setInterestDialog(false);
    toast.success("Interest expressed! The project creator will review your profile.");
  };

  const handleInvite = async (match: BuilderMatch) => {
    setInvitingId(match.id);
    await new Promise((r) => setTimeout(r, 800));
    setInvitedSet((prev) => new Set(prev).add(match.id));
    setInvitingId(null);
    setInviteDialog(null);
    toast.success(`Invitation sent to ${match.builder?.full_name || "builder"}!`);
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

  const topMatches = showAllMatches ? matches : matches.slice(0, 3);

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

              {project.ai_parsed_requirements && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="border-primary/30 bg-gradient-to-br from-primary/[0.04] to-primary/[0.01] p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/[0.06] to-transparent pointer-events-none rounded-full" />
                    <div className="flex items-center gap-2.5 mb-5 relative z-10">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-primary">AI Parsed Requirements</h2>
                        <p className="text-[9px] font-mono text-primary">Automatically extracted from description</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                      <div className="col-span-2">
                        <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">Core Requirement</p>
                        <p className="text-sm text-foreground bg-background/60 rounded-lg border border-border/30 px-3.5 py-2.5">{project.ai_parsed_requirements.core_requirement}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">Integrations</p>
                        <div className="flex flex-wrap gap-1">
                          {project.ai_parsed_requirements.integrations.map((i) => (
                            <Badge key={i} variant="outline" className="text-[9px] font-mono border-border/40">{i}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">Ideal Builder</p>
                        <p className="text-sm text-foreground">{project.ai_parsed_requirements.ideal_builder_type}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              <AnimatePresence>
                {matches.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-border-subtle bg-card shadow-elev-sm p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-sm font-semibold text-foreground">AI Builder Matches</h2>
                            <p className="text-[9px] font-mono text-muted-foreground">Top candidates ranked by relevance</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-mono">{matches.length} builders</Badge>
                      </div>

                      <div className="space-y-3">
                        {topMatches.map((match, i) => (
                          <motion.div
                            key={match.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.3 }}
                            layout
                          >
                            <div className="group relative rounded-xl border border-border/40 bg-background/80 hover:border-primary/20 hover:shadow-[0_0_20px_-8px] hover:shadow-primary/10 transition-all duration-200 p-4">
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />

                              <div className="flex items-start gap-4 relative z-10">
                                <div className="relative shrink-0">
                                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                                    {match.builder?.avatar_url ? (
                                      <img src={match.builder.avatar_url} alt="" className="w-11 h-11 rounded-full" />
                                    ) : (
                                      <User className="w-5 h-5 text-primary" />
                                    )}
                                  </div>
                                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-background ${
                                    match.match_score >= 90 ? "bg-accent text-accent-foreground" :
                                    match.match_score >= 80 ? "bg-primary text-primary-foreground" :
                                    "bg-muted text-muted-foreground"
                                  }`}>
                                    {match.match_score}%
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Link to={`/builder/${match.builder?.username}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate">
                                        {match.builder?.full_name || "Unknown Builder"}
                                      </Link>
                                      {match.builder?.is_verified && <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
                                      <span className="text-[10px] font-mono text-muted-foreground">@{match.builder?.username}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <Button
                                        size="sm"
                                        variant={invitedSet.has(match.id) ? "secondary" : "default"}
                                        disabled={invitedSet.has(match.id) || invitingId === match.id}
                                        onClick={() => setInviteDialog(match)}
                                        className="text-[10px] h-7 px-3"
                                      >
                                        {invitingId === match.id ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : invitedSet.has(match.id) ? (
                                          <><Check className="w-3 h-3 mr-1" /> Invited</>
                                        ) : (
                                          "Invite"
                                        )}
                                      </Button>
                                    </div>
                                  </div>

                                  <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">{match.builder?.bio}</p>

                                  <div className="flex items-center gap-3 mb-2 text-[10px] font-mono text-muted-foreground">
                                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{match.builder?.ships_count} ships</span>
                                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{match.builder?.vibe_score}% vibe</span>
                                    <span className="flex items-center gap-1"><Star />{match.builder?.stars_count} stars</span>
                                  </div>

                                  <div className="space-y-1 mb-2">
                                    {match.match_reasons.map((reason, ri) => (
                                      <motion.p
                                        key={ri}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + ri * 0.05 }}
                                        className="text-[10px] text-muted-foreground flex items-start gap-1.5"
                                      >
                                        <Check className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                                        {reason}
                                      </motion.p>
                                    ))}
                                  </div>

                                  <div className="flex flex-wrap gap-1">
                                    {match.skills_match.map((s) => (
                                      <Badge key={s} variant="outline" className="text-[8px] font-mono border-accent/20 bg-accent/[0.03] text-accent px-1.5 py-0">
                                        {s}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {matches.length > 3 && (
                        <button
                          onClick={() => setShowAllMatches(!showAllMatches)}
                          className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-mono text-muted-foreground hover:text-foreground hover:bg-card/[0.02] transition-all border border-transparent hover:border-border/30"
                        >
                          {showAllMatches ? (
                            <><ChevronUp className="w-3 h-3" /> Show Less</>
                          ) : (
                            <><ChevronDown className="w-3 h-3" /> View All {matches.length} Matches</>
                          )}
                        </button>
                      )}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <Card className="border-border-subtle bg-card shadow-elev-sm p-5 sticky top-8">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                      {project.creator?.avatar_url ? (
                        <img src={project.creator.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
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
                      className="w-full bg-gradient-primary text-primary-foreground font-bold text-xs glow-cyan hover:brightness-110 transition-all h-9"
                      onClick={interested ? undefined : () => setInterestDialog(true)}
                      variant={interested ? "secondary" : "default"}
                    >
                      {interested ? (
                        <><Check className="w-3.5 h-3.5" /> Interest Expressed</>
                      ) : (
                        <><Sparkles className="w-3.5 h-3.5" /> Express Interest</>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full text-xs h-9" disabled>
                      <Mail className="w-3.5 h-3.5" /> Message Creator
                    </Button>
                  </div>

                  <div className="pt-3 border-t border-border/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground">Category</span>
                      <div className={`px-2 py-0.5 rounded-full text-[9px] font-mono bg-primary/[0.07] border border-cyan-500/20 text-primary`}>
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
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground">Interest</span>
                      <span className="text-foreground flex items-center gap-1"><Sparkles className="w-3 h-3 text-primary" />{project.interest_count}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="border-border-subtle bg-card shadow-elev-sm p-5">
                  <h3 className="text-xs font-semibold text-foreground mb-3">Why Post on Shipyard?</h3>
                  <ul className="space-y-2">
                    {[
                      "AI matches the best builders for your project",
                      "1,200+ vetted builders available",
                      "Built-in escrow & milestone payments",
                      "Dispute resolution included",
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-[10px] font-mono text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={interestDialog}
        onOpenChange={setInterestDialog}
        title="Express Interest"
        desc={
          <div className="space-y-2">
            <p>You're about to express interest in <strong className="text-foreground">{project.title}</strong>.</p>
            <p className="text-muted-foreground">The project creator will see your profile and may reach out. You can also browse similar projects.</p>
          </div>
        }
        confirmText="Confirm Interest"
        handleConfirm={handleInterestConfirm}
      />

      <ConfirmDialog
        open={!!inviteDialog}
        onOpenChange={(open) => !open && setInviteDialog(null)}
        title="Invite Builder"
        desc={
          inviteDialog ? (
            <div className="space-y-2">
              <p>Send an invitation to <strong className="text-foreground">{inviteDialog.builder?.full_name}</strong> for <strong className="text-foreground">{project.title}</strong>.</p>
              <div className="rounded-lg bg-muted border border-border/50 p-3 text-xs text-muted-foreground">
                <p className="font-mono text-[10px] text-muted-foreground mb-1">Match score: {inviteDialog.match_score}%</p>
                <p className="text-muted-foreground">{inviteDialog.match_reasons[0]}</p>
              </div>
            </div>
          ) : null
        }
        confirmText="Send Invitation"
        handleConfirm={() => inviteDialog && handleInvite(inviteDialog)}
        isLoading={!!invitingId}
      />
    </div>
  );
};

const Star = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default ProjectDetail;
