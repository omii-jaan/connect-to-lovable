import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, UserCheck, Sparkles, CheckCircle2, ShieldCheck, Terminal, Cpu, Activity, ExternalLink, GitBranch, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMotionPreference } from "@/context/MotionContext";

export const LandingHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { reduced } = useMotionPreference();

  const { scrollYProgress, scrollY } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax scroll transforms
  const bgY = useTransform(scrollY, [0, 800], [0, 160]);
  const bgOpacity = useTransform(scrollY, [0, 500], [0.6, 0.1]);
  
  // 3D Perspective Card scroll transforms
  const cardRotateX = useTransform(scrollYProgress, [0, 0.7], [22, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 0.7], [0.88, 1.02]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.15], [0.7, 1]);

  // Parallax floating badges on opposite axes
  const leftBadgeY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const leftBadgeRotate = useTransform(scrollYProgress, [0, 1], [-5, 4]);
  
  const rightBadgeY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const rightBadgeRotate = useTransform(scrollYProgress, [0, 1], [5, -3]);

  return (
    <section ref={sectionRef} className="relative min-h-[calc(100vh-64px)] pt-20 pb-24 flex flex-col items-center justify-center bg-background px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Scrolling Background Grid with Parallax */}
      <motion.div
        aria-hidden="true"
        style={{ y: reduced ? 0 : bgY, opacity: bgOpacity }}
        className="absolute inset-0 pointer-events-none bg-canvas-dots bg-[length:32px_32px]"
      />

      {/* Ambient Top Light Radial Beam */}
      <motion.div
        aria-hidden="true"
        style={{ y: reduced ? 0 : bgY }}
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-primary/10 blur-[130px] rounded-full pointer-events-none"
      />

      <div className="max-w-5xl mx-auto text-center space-y-8 z-10 w-full">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-medium text-primary shadow-[0_0_12px_rgba(20,184,166,0.2)]"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <span>Now in Public Beta</span>
          <Sparkles className="w-3 h-3 text-primary" />
        </motion.div>

        {/* Headline h1 - White to grey subtle gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] max-w-4xl mx-auto"
        >
          <span className="bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            The professional identity platform for AI builders
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-[620px] mx-auto font-normal leading-relaxed"
        >
          Dock your deployed AI products, showcase verified code & benchmark results, and land direct contracts with founders. No resumes — only live proof.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Link
            to="/sign-up"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Create your profile
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/@demo"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-border bg-card hover:bg-card/80 text-foreground font-medium text-sm transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-muted-foreground" />
            View example profile
          </Link>
        </motion.div>

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-4 max-w-2xl mx-auto"
        >
          <p className="font-mono text-xs text-neutral-400 uppercase tracking-wider">
            Trusted by builders from OpenAI, Anthropic, Google and 500+ startups
          </p>
        </motion.div>

        {/* ------------------------------------------------------------- */}
        {/* PARALLAX HERO IMAGE & SHOWCASE CARD CONTAINER                 */}
        {/* ------------------------------------------------------------- */}
        <div className="relative pt-10 sm:pt-14 [perspective:1200px] w-full max-w-5xl mx-auto">
          
          {/* Parallax Floating Badge 1 - Left */}
          <motion.div
            style={reduced ? {} : { y: leftBadgeY, rotate: leftBadgeRotate }}
            className="hidden lg:flex absolute -left-8 top-28 z-30 items-center gap-3 p-3.5 rounded-xl border border-primary/30 bg-card/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] max-w-xs text-left pointer-events-none"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-foreground">
                <span>99.4% Eval Benchmark</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-[11px] text-muted-foreground">vLLM • Cloud Run Deployed</p>
            </div>
          </motion.div>

          {/* Parallax Floating Badge 2 - Right */}
          <motion.div
            style={reduced ? {} : { y: rightBadgeY, rotate: rightBadgeRotate }}
            className="hidden lg:flex absolute -right-8 top-36 z-30 items-center gap-3 p-3.5 rounded-xl border border-accent/30 bg-card/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] max-w-xs text-left pointer-events-none"
          >
            <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-foreground">
                <span>42ms Latency Live</span>
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              </div>
              <p className="text-[11px] text-muted-foreground">1,240 GitHub Stars • Verified</p>
            </div>
          </motion.div>

          {/* Main 3D Parallax Tilt Preview Frame */}
          <motion.div
            style={
              reduced
                ? {}
                : {
                    rotateX: cardRotateX,
                    scale: cardScale,
                    y: cardY,
                    opacity: cardOpacity,
                    transformStyle: "preserve-3d",
                  }
            }
            className="rounded-2xl border border-border bg-card/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden text-left hover:border-primary/40 transition-colors"
          >
            {/* Header bar of mock UI */}
            <div className="bg-surface px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">shipyards.dev/@alex-rivera</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 font-mono text-[11px] text-primary">
                  <ShieldCheck className="w-3 h-3" /> Verified Builder
                </span>
              </div>
            </div>

            {/* Mock Profile Visual Content */}
            <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-card via-card to-background">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-2 border-primary/40 bg-surface flex items-center justify-center font-bold text-lg text-primary shadow-inner">
                    AR
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-lg text-foreground">Alex Rivera</h3>
                      <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-xs">Top 1% Agent Architect</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Autonomous AI Systems • LangGraph • vLLM • Fine-Tuning</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center w-full sm:w-auto">
                  <div className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-mono text-foreground flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-primary" />
                    <span>34 Docks</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-mono text-foreground flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>2.8k Stars</span>
                  </div>
                </div>
              </div>

              {/* Sample Doped Product Dock Grid inside Hero Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dock Item 1 */}
                <div className="p-4 rounded-xl border border-border bg-surface/50 space-y-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-primary" />
                      <span className="font-mono text-xs font-bold text-foreground">vLLM-Function-Caller</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[10px]">
                      Live API
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Sub-50ms latency function call router tuned on Qwen2.5-72B for parallel agentic workflows.
                  </p>
                  <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-neutral-400 border-t border-border-subtle">
                    <span>Eval Score: 98.6%</span>
                    <span className="text-primary flex items-center gap-1">Demo <ExternalLink className="w-3 h-3" /></span>
                  </div>
                </div>

                {/* Dock Item 2 */}
                <div className="p-4 rounded-xl border border-border bg-surface/50 space-y-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-accent" />
                      <span className="font-mono text-xs font-bold text-foreground">LangGraph-Coder-Agent</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[10px]">
                      Open Source
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Multi-agent pair programmer with automatic lint error correction loops & human-in-the-loop gates.
                  </p>
                  <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-neutral-400 border-t border-border-subtle">
                    <span>1,420 Stars</span>
                    <span className="text-primary flex items-center gap-1">Repo <ExternalLink className="w-3 h-3" /></span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default LandingHero;

