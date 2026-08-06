import { useRef } from "react";
import { CheckCircle2, ShieldCheck, XCircle, FolderGit2, Star, Trophy, ArrowRight, Lock, Zap, ExternalLink, Heart, MessageSquare } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionPreference } from "@/context/MotionContext";

export const ProblemSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.2"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-5, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1.0]);
  const translateY = useTransform(scrollYProgress, [0, 1], [35, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.4, 0.9, 1]);

  return (
    <section ref={sectionRef} className="relative py-20 bg-background border-b border-border overflow-hidden" id="problem">
      {/* Background canvas dots */}
      <div className="absolute inset-0 pointer-events-none bg-canvas-dots opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Problem Copy */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px 250px 0px" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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
                  <span>shipyards.dev/@alex-rivera</span>
                </div>

                {/* Top-right Status */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">Verified Builder</span>
                </div>
              </div>

              {/* Browser Body / Real Product Preview */}
              <div className="p-4 sm:p-6 bg-background space-y-4 text-left">
                
                {/* 1. Mini Builder Profile Header */}
                <div className="p-4 rounded-lg bg-card border border-border-subtle space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    
                    {/* 96px Avatar */}
                    <div className="w-20 h-20 sm:w-20 sm:h-20 rounded-xl border-2 border-primary/30 bg-primary/10 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=alex-rivera&backgroundColor=00f2ff"
                        alt="Alex Rivera"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Builder Info */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-lg text-foreground truncate">
                          Alex Rivera
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-bold text-primary">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Builder
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-mono font-semibold text-accent">
                          Top 1% Agent Architect
                        </span>
                      </div>

                      <p className="font-mono text-xs text-muted-foreground">
                        @alex-rivera · Autonomous AI Systems • LangGraph • vLLM • Fine-Tuning
                      </p>
                    </div>
                  </div>

                  {/* Stat Cells */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-border-subtle">
                    <div className="p-2 rounded-md bg-background/80 border border-border-subtle text-center">
                      <div className="flex items-center justify-center gap-1 text-xs font-mono font-bold text-foreground">
                        <Trophy className="w-3.5 h-3.5 text-accent" />
                        <span>2,480</span>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Reputation</p>
                    </div>

                    <div className="p-2 rounded-md bg-background/80 border border-border-subtle text-center">
                      <div className="flex items-center justify-center gap-1 text-xs font-mono font-bold text-foreground">
                        <FolderGit2 className="w-3.5 h-3.5 text-primary" />
                        <span>34</span>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Docks</p>
                    </div>

                    <div className="p-2 rounded-md bg-background/80 border border-border-subtle text-center">
                      <div className="flex items-center justify-center gap-1 text-xs font-mono font-bold text-foreground">
                        <Star className="w-3.5 h-3.5 text-secondary" />
                        <span>2.8k</span>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Stars</p>
                    </div>

                    <div className="p-2 rounded-md bg-background/80 border border-border-subtle text-center">
                      <div className="flex items-center justify-center gap-1 text-xs font-mono font-bold text-foreground">
                        <Zap className="w-3.5 h-3.5 text-accent" />
                        <span>98.6%</span>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">Eval Score</p>
                    </div>
                  </div>
                </div>

                {/* 2. Featured Projects */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-card border border-border-subtle space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-accent/10 text-accent border border-accent/20">
                            Live API
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                            Eval Score: 98.6%
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-sm text-foreground truncate">
                          vLLM-Function-Caller
                        </h4>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-background border border-border-subtle text-[10px] font-mono text-accent shrink-0">
                        <ExternalLink className="w-3 h-3" />
                        Demo
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Sub-50ms latency function call router tuned on Qwen2.5-72B for parallel agentic workflows.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-card border border-border-subtle space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                            Open Source
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-sm text-foreground truncate">
                          LangGraph-Coder-Agent
                        </h4>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-background border border-border-subtle text-[10px] font-mono text-primary shrink-0">
                        <Star className="w-3 h-3 text-accent" />
                        1,420 Stars
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Multi-agent pair programmer with automatic lint error correction loops & human-in-the-loop gates.
                    </p>
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
