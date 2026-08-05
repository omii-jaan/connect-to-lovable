import { Layout, Briefcase, Terminal, Mail, GitBranch } from "lucide-react";
import { motion } from "motion/react";

const LAYERS = [
  {
    layer: "Layer 1",
    title: "Showcase & Discovery",
    icon: Layout,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
    description: "Public builder profiles, rich project cards with metrics, stack tags, live demos, and algorithmic leaderboards.",
  },
  {
    layer: "Layer 2",
    title: "Project Marketplace",
    icon: Briefcase,
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/20",
    description: "Match directly with founders posting paid AI projects based on verified stack match and past shipped code.",
  },
  {
    layer: "Layer 3",
    title: "Collaboration Workspace",
    icon: Terminal,
    color: "text-secondary",
    bgColor: "bg-secondary/10 border-secondary/20",
    description: "The Yard: per-project kanban, code review, file drops, and real git commit tracking without invasive monitoring.",
  },
  {
    layer: "Layer 4",
    title: "Professional Identity",
    icon: Mail,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
    description: "Claim your custom handle and @shipyards.dev email identity backed by cryptographic proof of authorship.",
  },
  {
    layer: "Layer 5",
    title: "Smart Breakdown",
    icon: GitBranch,
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/20",
    description: "Decompose complex client briefs into milestones, model recommendations, cost estimates, and dependency graphs.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="relative py-20 bg-background border-b border-border overflow-hidden" id="features">
      {/* Subtle dots background */}
      <div className="absolute inset-0 pointer-events-none bg-canvas-dots opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <p className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
            Architecture of Shipyards
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
            Five layers built specifically for AI developers
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            From proof of work to paid client execution, Shipyards provides end-to-end infrastructure for modern AI engineers.
          </p>
        </motion.div>

        {/* 3-column Grid for the 5 Layers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LAYERS.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="rounded-xl border border-border-subtle bg-card p-6 space-y-4 hover:border-primary/30 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {layer.layer}
                    </span>
                    <div className={`w-8 h-8 rounded-lg border ${layer.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${layer.color}`} />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-xl text-foreground">
                    {layer.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {layer.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
