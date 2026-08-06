import { useState, useEffect } from "react";
import { Star, Loader2, MessageSquare, CheckCircle2 } from "lucide-react";
import { ratingsApi } from "@/lib/api";
import type { Contract } from "@/types";
import { notify as toast } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract;
  raterUid: string;
  rateeUid: string;
  rateeName: string;
  rateeRole: "builder" | "founder";
  role: "founder" | "builder"; // My role as the rater
  onSuccess?: () => void;
}

const SCORE_LABELS: Record<number, string> = {
  1: "Poor - Significant issues",
  2: "Fair - Needs improvement",
  3: "Good - Delivered as expected",
  4: "Great - Very satisfied",
  5: "Exceptional - Exceeded expectations",
};

export const RatingModal = ({
  open,
  onOpenChange,
  contract,
  raterUid,
  rateeUid,
  rateeName,
  rateeRole,
  role,
  onSuccess,
}: RatingModalProps) => {
  const [score, setScore] = useState<number>(5);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setScore(5);
      setHoverScore(null);
      setComment("");
    }
  }, [open]);

  const activeDisplayScore = hoverScore !== null ? hoverScore : score;

  const handleSubmit = async () => {
    if (!raterUid || !rateeUid || !contract.id) {
      toast.error("Missing contract or user information.");
      return;
    }

    setSubmitting(true);
    try {
      await ratingsApi.submitRating({
        contractId: contract.id,
        raterUid,
        rateeUid,
        score,
        comment,
        role,
      });

      toast.success(`Rating submitted for ${rateeName}! Thank you for your feedback.`);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to submit rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            Rate & Review {rateeName}
          </DialogTitle>
          <DialogDescription className="text-xs font-mono text-muted-foreground">
            Rate your experience with this {rateeRole} for "{contract.title || contract.project?.title || 'Project Scope'}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2 font-mono">
          {/* Rating Stars Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
              Overall Score (1 - 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 p-2 rounded-xl bg-muted/40 border border-border/50"
                role="radiogroup"
                aria-label="Star Rating"
              >
                {[1, 2, 3, 4, 5].map((s) => {
                  const isFilled = s <= activeDisplayScore;
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={score === s}
                      aria-label={`${s} star${s > 1 ? "s" : ""}`}
                      onClick={() => setScore(s)}
                      onMouseEnter={() => setHoverScore(s)}
                      onMouseLeave={() => setHoverScore(null)}
                      className="p-1 rounded-lg hover:bg-background/80 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"
                    >
                      <Star
                        className={`w-6 h-6 transition-all duration-150 ${
                          isFilled
                            ? "text-amber-400 fill-amber-400 scale-110"
                            : "text-muted-foreground/40 hover:text-amber-400/60"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-amber-400 tabular-nums px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                {activeDisplayScore}.0 / 5.0
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground italic h-4">
              {SCORE_LABELS[activeDisplayScore]}
            </p>
          </div>

          {/* Comment Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="rating-comment" className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                Short Review / Comment
              </label>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {comment.length} / 500
              </span>
            </div>
            <textarea
              id="rating-comment"
              rows={4}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share constructive feedback regarding responsiveness, code delivery, and technical execution...`}
              className="w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={submitting}
              onClick={handleSubmit}
              className="text-xs font-mono bg-primary text-primary-foreground font-bold hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Submit Rating
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
