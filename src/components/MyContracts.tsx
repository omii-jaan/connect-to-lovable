import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FileText, CheckCircle2, Clock, Calendar, Shield, ExternalLink,
  Loader2, User, Sparkles, Filter, AlertCircle, CircleDollarSign, ArrowUpRight, Star
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { marketplaceApi, ratingsApi } from "@/lib/api";
import type { Contract, Rating } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { notify as toast } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { RatingModal } from "@/components/RatingModal";

interface MyContractsProps {
  currentUserId?: string;
  userRole?: "founder" | "builder" | "admin";
}

export const MyContracts = ({ currentUserId, userRole }: MyContractsProps) => {
  const { user } = useAuth();
  const activeUid = currentUserId || user?.id;

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [completingId, setCompletingId] = useState<string | null>(null);

  // Rating Modal state
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingTargetContract, setRatingTargetContract] = useState<Contract | null>(null);
  const [contractRatings, setContractRatings] = useState<Record<string, { founder?: Rating | null; builder?: Rating | null }>>({});

  const fetchContracts = useCallback(async () => {
    if (!activeUid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await marketplaceApi.getUserContracts(activeUid);
      setContracts(data);

      // Fetch rating statuses for completed contracts
      const completed = data.filter((c) => c.status === "completed");
      const ratingsMap: Record<string, { founder?: Rating | null; builder?: Rating | null }> = {};
      await Promise.all(
        completed.map(async (c) => {
          if (c.id) {
            const r = await ratingsApi.getContractRatings(c.id);
            ratingsMap[c.id] = r;
          }
        })
      );
      setContractRatings(ratingsMap);
    } catch (err) {
      console.warn("Failed to load contracts:", err);
      toast.error("Failed to load contracts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeUid]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleMarkComplete = async (contract: Contract) => {
    if (!contract.id) return;
    const isFounder = activeUid === (contract.founderUid || contract.creatorUid || contract.founder_id);

    if (!isFounder) {
      toast.error("Only the project founder can mark this contract as completed.");
      return;
    }

    if (contract.status === "completed") {
      toast.info("Contract is already marked as completed.");
      return;
    }

    setCompletingId(contract.id);
    try {
      const completedTime = new Date().toISOString();
      // Optimistic update
      setContracts((prev) =>
        prev.map((c) =>
          c.id === contract.id
            ? { ...c, status: "completed", completedAt: completedTime }
            : c
        )
      );

      await marketplaceApi.completeContract(
        contract.id,
        contract.marketplaceProjectId,
        contract.builderUid
      );

      toast.success("Contract marked as completed! Ratings & reviews unlocked.");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to complete contract.");
      // Rollback on error
      fetchContracts();
    } finally {
      setCompletingId(null);
    }
  };

  const openRatingDialog = (contract: Contract) => {
    setRatingTargetContract(contract);
    setRatingModalOpen(true);
  };

  const filteredContracts = contracts.filter((c) => {
    if (filter === "active") return c.status === "active";
    if (filter === "completed") return c.status === "completed";
    return true;
  });

  const activeCount = contracts.filter((c) => c.status === "active").length;
  const completedCount = contracts.filter((c) => c.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            My Contracts & Scope Agreements
          </h2>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">
            Track active work scopes, agreed budget terms, and completion status.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border/50 self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filter === "all"
                ? "bg-card text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({contracts.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filter === "active"
                ? "bg-card text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filter === "completed"
                ? "bg-card text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* State 1: Skeleton Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-border bg-card/60 space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-36 bg-muted rounded" />
                <div className="h-5 w-20 bg-muted rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="space-y-1">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-2 w-16 bg-muted rounded" />
                </div>
              </div>
              <div className="h-9 w-full bg-muted rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredContracts.length === 0 ? (
        /* State 2: Empty State with CTA */
        <div className="p-8 sm:p-12 text-center rounded-xl border border-dashed border-border bg-card/40 space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <FileText className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-display font-semibold text-foreground">
              {filter === "all"
                ? "No contracts found"
                : filter === "active"
                ? "No active contracts"
                : "No completed contracts"}
            </h3>
            <p className="text-xs font-mono text-muted-foreground leading-relaxed">
              {filter === "all"
                ? "Contracts are formed automatically when a founder accepts a builder proposal or when a builder accepts a project invitation."
                : filter === "active"
                ? "You don't have any in-progress contracts at the moment."
                : "You haven't completed any project contracts yet."}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/marketplace">
              <Button size="sm" className="font-mono text-xs gap-1.5 bg-primary text-primary-foreground font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Browse Open Scopes
              </Button>
            </Link>
            <Link to="/post-project">
              <Button size="sm" variant="outline" className="font-mono text-xs gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Post a Project Scope
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* State 3: Content State (Contracts Cards) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContracts.map((contract) => {
            const isFounder = activeUid === (contract.founderUid || contract.creatorUid || contract.founder_id);
            const otherParty = isFounder ? contract.builder : contract.founder;
            const otherPartyRoleLabel = isFounder ? "Builder" : "Founder";
            const projectTitle = contract.project?.title || contract.title || "Project Scope Contract";
            const projectSlug = contract.project?.slug || contract.marketplaceProjectId || contract.projectId;

            const isCompleting = completingId === contract.id;
            const isActive = contract.status === "active";
            const isCompleted = contract.status === "completed";

            // Format budget terms
            const terms = contract.terms;
            const minB = terms?.budgetMin || contract.amount_usd || 0;
            const maxB = terms?.budgetMax || contract.amount_usd || 0;
            const budgetDisplay =
              minB > 0 && maxB > 0 && minB !== maxB
                ? `$${minB.toLocaleString()} - $${maxB.toLocaleString()} ${terms?.currency || 'USD'}`
                : minB > 0
                ? `$${minB.toLocaleString()} ${terms?.currency || 'USD'}`
                : "Agreed Scope Terms";

            const startedDate = contract.startedAt
              ? new Date(contract.startedAt)
              : contract.createdAt
              ? new Date(contract.createdAt)
              : new Date();

            return (
              <div
                key={contract.id}
                className="group relative p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                {/* Top Row: Title & Status Chip */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-muted text-muted-foreground mb-1.5">
                        {isFounder ? "Outbound (Founder)" : "Inbound (Builder)"}
                      </span>
                      <Link
                        to={projectSlug ? `/marketplace/${projectSlug}` : "#"}
                        className="group/title flex items-center gap-1.5 text-sm font-display font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        <span className="truncate">{projectTitle}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/title:opacity-100 transition-opacity text-primary shrink-0" />
                      </Link>
                    </div>

                    {/* Status Badge */}
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Active
                      </span>
                    ) : isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/30 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                        Draft
                      </span>
                    )}
                  </div>

                  {/* Budget & Timeline Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground pt-1">
                    <div className="flex items-center gap-1 text-foreground font-medium">
                      <CircleDollarSign className="w-3.5 h-3.5 text-primary" />
                      <span>{budgetDisplay}</span>
                    </div>
                    <span className="text-border">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>
                        Started {formatDistanceToNow(startedDate, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Other Party Info */}
                <div className="p-3 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                      {otherParty?.avatar_url ? (
                        <img
                          src={otherParty.avatar_url}
                          alt={otherParty.full_name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {otherParty?.full_name || (isFounder ? "Assigned Builder" : "Project Founder")}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground truncate">
                        {otherPartyRoleLabel} • {otherParty?.username ? `@${otherParty.username}` : "Verified Member"}
                      </p>
                    </div>
                  </div>

                  {otherParty?.username && (
                    <Link
                      to={`/builder/${otherParty.username}`}
                      className="text-[11px] font-mono text-primary hover:underline shrink-0"
                    >
                      View Profile
                    </Link>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                  <Link
                    to={projectSlug ? `/marketplace/${projectSlug}` : "/marketplace"}
                    className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Scope Details
                  </Link>

                  <div className="flex items-center gap-2">
                    {/* Founder Completion Action (if active) */}
                    {isFounder && isActive && (
                      <Button
                        size="sm"
                        disabled={isCompleting}
                        onClick={() => handleMarkComplete(contract)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold shadow-sm"
                      >
                        {isCompleting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                            Completing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            Mark as Complete
                          </>
                        )}
                      </Button>
                    )}

                    {!isFounder && isActive && (
                      <div className="text-[11px] font-mono text-muted-foreground italic flex items-center gap-1">
                        <span>Waiting on founder completion</span>
                      </div>
                    )}

                    {/* Completed State Ratings */}
                    {isCompleted && (() => {
                      const myRole = isFounder ? "founder" : "builder";
                      const ratingObj = contractRatings[contract.id]?.[myRole];
                      const hasRated = Boolean(ratingObj || contract.ratingStatus?.[myRole]);

                      if (hasRated) {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {ratingObj?.score ? `${ratingObj.score}★ Rated ✓` : "Rated ✓"}
                          </span>
                        );
                      }

                      return (
                        <Button
                          size="sm"
                          onClick={() => openRatingDialog(contract)}
                          className="text-xs font-mono font-semibold bg-amber-500 hover:bg-amber-400 text-black shadow-sm gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 fill-black" />
                          Rate {otherPartyRoleLabel}
                        </Button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rating Modal */}
      {ratingTargetContract && (
        <RatingModal
          open={ratingModalOpen}
          onOpenChange={setRatingModalOpen}
          contract={ratingTargetContract}
          raterUid={activeUid || ""}
          rateeUid={
            activeUid === (ratingTargetContract.founderUid || ratingTargetContract.creatorUid || ratingTargetContract.founder_id)
              ? (ratingTargetContract.builderUid || ratingTargetContract.builder_id || "")
              : (ratingTargetContract.founderUid || ratingTargetContract.creatorUid || ratingTargetContract.founder_id || "")
          }
          rateeName={
            activeUid === (ratingTargetContract.founderUid || ratingTargetContract.creatorUid || ratingTargetContract.founder_id)
              ? (ratingTargetContract.builder?.full_name || ratingTargetContract.builder?.username || "Builder")
              : (ratingTargetContract.founder?.full_name || ratingTargetContract.founder?.username || "Founder")
          }
          rateeRole={
            activeUid === (ratingTargetContract.founderUid || ratingTargetContract.creatorUid || ratingTargetContract.founder_id)
              ? "builder"
              : "founder"
          }
          role={
            activeUid === (ratingTargetContract.founderUid || ratingTargetContract.creatorUid || ratingTargetContract.founder_id)
              ? "founder"
              : "builder"
          }
          onSuccess={fetchContracts}
        />
      )}
    </div>
  );
};
