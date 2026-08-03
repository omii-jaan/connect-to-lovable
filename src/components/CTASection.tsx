import { ArrowRight, Zap, Terminal, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { BlurFade } from "@/components/magicui/blur-fade";
import SectionEyebrow from "@/components/SectionEyebrow";

const CTASection = () => {
  return (
    <section id="hire" className="py-16 md:py-24 px-6 relative overflow-hidden">
      {/* Glow dividers */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="container max-w-5xl mx-auto relative z-10">
        
        {/* Core Header */}
        <BlurFade delay={0.1} direction="up">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <SectionEyebrow centered>Get started</SectionEyebrow>
            <h2 className="font-display font-bold text-h1 text-foreground mb-4">
              Ready to change how <br />
              <span className="text-content-tertiary">software is built &amp; hired?</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              Whether you are a developer shipping agentic architectures or a founder building the future, we have a port docked for you.
            </p>
          </div>
        </BlurFade>

        {/* Dual Cards Grid */}
        <BlurFade delay={0.2} direction="up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: For Builders */}
          <div className="relative rounded-2xl p-8 md:p-10 border border-border-subtle bg-surface group hover:border-border-strong hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 transition-all duration-300 ease-standard overflow-hidden">
            {/* Visual background icon decoration */}
            <Terminal className="absolute -right-8 -bottom-8 w-44 h-44 text-foreground/[0.03] pointer-events-none group-hover:scale-105 transition-transform duration-500" />
            
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <span className="px-2.5 py-1 rounded-full border border-border-subtle bg-surface-elevated text-[10px] font-medium text-muted-foreground uppercase tracking-[0.18em] mb-6 inline-block">
                  For AI Builders
                </span>
                
                <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-4 tracking-[-0.02em]">
                  Dock your builds. <br />
                  <span className="text-content-tertiary">Earn 100% of your vibe.</span>
                </h3>
                
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Join 2,400+ builders showcasing live code, integrations, and active agents. Get discovered by tech-forward founders looking for speed and quality.
                </p>

                <ul className="space-y-3 mb-8 text-xs text-foreground font-mono">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    No resumes, no cover letters, only live URLs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Automatic semantic indexing of code repos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Keep 100% of contract payments (0% commission)
                  </li>
                </ul>
              </div>

              <Link to="/login" className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold text-xs shadow-elev-md transition-all duration-micro ease-standard hover:shadow-glow-cyan">
                Join the Yard as Builder
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: For Founders */}
          <div className="relative rounded-2xl p-8 md:p-10 border border-border-subtle bg-surface group hover:border-border-strong hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 transition-all duration-300 ease-standard overflow-hidden">
            {/* Visual background icon decoration */}
            <Compass className="absolute -right-8 -bottom-8 w-44 h-44 text-foreground/[0.03] pointer-events-none group-hover:scale-105 transition-transform duration-500" />
            
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <span className="px-2.5 py-1 rounded-full border border-border-subtle bg-surface-elevated text-[10px] font-medium text-muted-foreground uppercase tracking-[0.18em] mb-6 inline-block">
                  For Founders
                </span>
                
                <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-4 tracking-[-0.02em]">
                  Match instantly. <br />
                  <span className="text-muted-foreground">Hire based on code proof.</span>
                </h3>
                
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Search developers by exact API usages or patterns. Review live telemetry graphs of active repositories instead of looking at portfolios.
                </p>

                <ul className="space-y-3 mb-8 text-xs text-foreground font-mono">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Query by exact code snippet imports
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Escrow-protected contract milestone payments
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Vetted telemetry analytics on all developer docks
                  </li>
                </ul>
              </div>

              <a href="/#discover" className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border-strong bg-surface-elevated text-foreground font-semibold text-xs transition-all duration-micro ease-standard hover:bg-muted">
                Search Shipped Projects
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
        </BlurFade>

      </div>
    </section>
  );
};

export default CTASection;
