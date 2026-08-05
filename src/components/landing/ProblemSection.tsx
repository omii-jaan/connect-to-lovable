import { useRef } from "react";
import { CheckCircle2, ShieldCheck, XCircle, FolderGit2, Star, Trophy, ArrowRight, Lock, Zap, ExternalLink, Heart, MessageSquare } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMotionPreference } from "@/context/MotionContext";

export const ProblemSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-8, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.0]);
  const translateY = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.3, 0.8, 1]);

  return (
    <section ref={sectionRef} className="relative py-20 bg-background border-b border-border overflow-hidden" id="problem">
      {/* Background canvas dots */}
      <div className="absolute inset-0 pointer-events-none bg-canvas-dots opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Problem Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-xs font-mono text-destructive">
              <XCircle className="w-3.5 h-3.5" />
              <span>The Fragmented Identity Problem</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight leading-tight">
              Your work is everywhere. Your reputation is nowhere.
            </h2>

            <p className="text-muted-foreground text-base leading-relaxed">
              As an AI builder, your best work lives across GitHub repositories, Hugging Face spaces, Vercel demo URLs, X build logs, and Discord threads.
            </p>

            <p className="text-muted-foreground text-base leading-relaxed">
              Traditional resumes can’t represent fine-tuned LLM performance, agent architecture, or live latency benchmarks. Founders hiring AI talent are tired of guessing.
            </p>

            <div className="pt-2 flex items-center gap-3 text-sm font-mono text-primary">
              <span>Shipyards unifies all your live proof into one verified identity.</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </div>
          </motion.div>

          {/* Right Column: Real Product Visual App Preview with 3D Perspective Scroll */}
          <div className="lg:col-span-7 [perspective:1200px]">
            <motion.div
              style={
                reduced
                  ? {}
                  : {
                      rotateX,
                      rotateY,
                      scale,
                      translateY,
                      opacity,
                      transformStyle: "preserve-3d",
                    }
              }
              className="rounded-xl border border-border bg-card overflow-hidden shadow-2xl hover:border-primary/40 transition-colors"
            >
              
              {/* Browser Header Bar */}
              <div className="bg-surface px-4 py-2.5 border-b border-border flex items-center justify-between">
                {/* Dots top-left */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-neutral-800 border border-border-subtle" />
                  <div className="w-3 h-3 rounded-full bg-neutral-800 border border-border-subtle" />
                  <div className="w-3 h-3 rounded-full bg-neutral-800 border border-border-subtle" />
                </div>

                {/* Mock Address Bar */}
                <div className="px-3 py-1 rounded bg-background border border-border-subtle text-[11px] font-mono text-muted-foreground flex items-center gap-1.5 max-w-xs mx-auto truncate">
                  <Lock className="w-3 h-3 text-accent shrink-0" />
                  <span>shipyards.dev/@demo</span>
                </div>

                {/* Top-right Status */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">Verified Identity</span>
                </div>
              </div>

              {/* Browser Body / Real Product Preview */}
              <div className="p-4 sm:p-6 bg-background space-y-4 text-left">
                
                {/* 1. Mini Builder Profile Header */}
                <div className="p-4 rounded-lg bg-card border border-border-subtle space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    
                    {/* 96px Avatar */}
                    <div className="w-24 h-24 sm:w-24 sm:h-24 rounded-xl border-2 border-primary/30 bg-primary/10 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=demobuilder&backgroundColor=00f2ff"
                        alt="Demo Builder"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Builder Info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-lg text-foreground truncate">
                          Demo Builder
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-bold text-primary">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-mono font-semibold text-accent">
                          Top 1%
                        </span>
                      </div>

                      <p className="font-mono text-xs text-muted-foreground">
                        @demo · AI Systems Architect
                      </p>

                      <p className="text-xs text-muted-foreground line-clamp-1">
                        Building autonomous agent pipelines, fine-tuned RAG systems, and custom LLM tools.
                      </p>
                    </div>
                  </div>

                  {/* 4 Stat Cells */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-border-subtle">
                    <div className="p-2.5 rounded-md bg-background/80 border border-border-subtle text-center">
                      <div className="flex items-center justify-center gap-1 text-xs font-mono font-bold text-foreground">
                        <Trophy className="w-3.5 h-3.5 text-accent" />
                        <span>1,940</span>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Reputation</p>
                    </div>

                    <div className="p-2.5 rounded-md bg-background/80 border border-border-subtle text-center">
                      <div className="flex items-center justify-center gap-1 text-xs font-mono font-bold text-foreground">
                        <FolderGit2 className="w-3.5 h-3.5 text-primary" />
                        <span>12</span>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Ships</p>
                    </div>

                    <div className="p-2.5 rounded-md bg-background/80 border border-border-subtle text-center">
                      <div className="flex items-center justify-center gap-1 text-xs font-mono font-bold text-foreground">
                        <Star className="w-3.5 h-3.5 text-secondary" />
                        <span>1,240</span>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Stars</p>
                    </div>

                    <div className="p-2.5 rounded-md bg-background/80 border border-border-subtle text-center">
                      <div className="flex items-center justify-center gap-1 text-xs font-mono font-bold text-foreground">
                        <Zap className="w-3.5 h-3.5 text-accent" />
                        <span>99%</span>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Stack Match</p>
                    </div>
                  </div>
                </div>

                {/* 2. One Feed-Style Project Card */}
                <div className="p-4 rounded-lg bg-card border border-border-subtle space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                          Agents & RAG
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          Shipped 3d ago
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-base text-foreground truncate">
                        Agentic Workflow Orchestrator
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-background border border-border-subtle text-[11px] font-mono text-accent">
                        <ExternalLink className="w-3 h-3" />
                        Live Demo
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Autonomous multi-agent task planner & executor with fine-tuned tool-calling routines and real-time streaming feedback loops.
                  </p>

                  {/* Tech Stack Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["Python", "LangChain", "Claude 3.5", "FastAPI"].map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-background border border-border-subtle text-[10px] font-mono text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer Metrics */}
                  <div className="pt-2.5 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-foreground">
                        <Star className="w-3.5 h-3.5 text-accent" />
                        <span>428</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-primary" />
                        <span>184</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>24</span>
                      </span>
                    </div>

                    <span className="text-[10px] text-accent font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Code Verified
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
