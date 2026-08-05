import { ShieldCheck, Zap } from "lucide-react";

const TICKER_ITEMS = [
  "Alex Chen shipped 12 AI agents",
  "Sarah hit Top 1% this month",
  "Marcus closed $15k agent contract",
  "Elena docked 8 multi-modal ships",
  "Devin AI benchmarked at 99.4% accuracy",
  "Kaito earned Top Builder badge",
  "Ananya launched Agentic RAG pipeline",
  "David secured $20k fine-tuning gig",
];

export const SocialProofTicker = () => {
  return (
    <section className="border-y border-border bg-card/50 py-3 overflow-hidden select-none" aria-label="Recent activity marquee">
      <div className="max-w-7xl mx-auto px-4 mb-1 text-center">
        <span className="sr-only">Live builder milestones</span>
      </div>
      
      {/* Marquee container with pause on hover & reduced-motion handling */}
      <div className="relative w-full flex overflow-x-hidden group">
        <div
          className="flex shrink-0 gap-6 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center"
          style={{ animationDuration: "35s" }}
        >
          {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border-subtle text-xs font-mono text-muted-foreground whitespace-nowrap"
            >
              <Zap className="w-3 h-3 text-primary shrink-0" />
              <span>{item}</span>
              <ShieldCheck className="w-3 h-3 text-accent shrink-0 ml-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofTicker;
