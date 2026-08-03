import { useState } from "react";
import { Upload, Search, Handshake, ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import SectionEyebrow from "@/components/SectionEyebrow";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Dock your builds",
    description:
      "Upload your deployed AI products to Shipyard — live links, stack, demos, and proof of traction. Your profile is your port of record.",
    color: "cyan" as const,
    flowLabel: "Repository connected & verified",
  },
  {
    icon: Search,
    step: "02",
    title: "Get discovered",
    description:
      "Founders and companies search by skill, stack (OpenAI, LangChain, Supabase…), and project type. Real ships speak louder than any resume.",
    color: "purple" as const,
    flowLabel: "Semantic match parsed",
  },
  {
    icon: Handshake,
    step: "03",
    title: "Get hired & paid",
    description:
      "Connect directly with founders who need exactly what you've built. No middlemen, no vague JDs — pure builder-to-founder contracts.",
    color: "green" as const,
    flowLabel: "Smart contract generated",
  },
];

const colorMap = {
  cyan: {
    icon: "text-primary bg-primary/10 border-primary/20",
    step: "text-primary",
    glow: "shadow-[0_0_20px_rgba(183,100,50,0.15)] border-primary/40",
    glowText: "text-primary",
  },
  purple: {
    icon: "text-secondary bg-secondary/10 border-secondary/20",
    step: "text-secondary",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)] border-secondary/40",
    glowText: "text-secondary",
  },
  green: {
    icon: "text-accent bg-accent/10 border-accent/20",
    step: "text-accent",
    glow: "shadow-[0_0_20px_rgba(142,76,55,0.15)] border-accent/40",
    glowText: "text-accent",
  },
};

const HowItWorks = () => {
  // Always holds one active step — hovering (or focusing) another switches it,
  // leaving the cards keeps the last one held instead of emptying the panel.
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);

  return (
    <section id="how-it-works" className="py-16 md:py-24 px-6 relative">
      {/* Grid background lines */}
      <div className="absolute inset-0 bg-canvas-dots opacity-40 pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <BlurFade delay={0.1} direction="up">
          <div className="text-center mb-14">
            <SectionEyebrow centered>Shipyard assembly line</SectionEyebrow>
            <h2 className="font-display font-bold text-h1 text-foreground">
              Three steps to go from <br />
              <span className="text-content-tertiary">builder to hired.</span>
            </h2>
          </div>
        </BlurFade>

        {/* Steps Grid */}
        <BlurFade delay={0.2} direction="up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-start">
          {steps.map((step, i) => {
            const colors = colorMap[step.color];
            const Icon = step.icon;
            const isHovered = hoveredIdx === i;

            return (
              <div 
                key={step.step} 
                className="relative"
                onMouseEnter={() => setHoveredIdx(i)}
                onFocusCapture={() => setHoveredIdx(i)}
              >

                {/* Connecting SVG wires on desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-[44px] left-[75%] right-[-15%] h-6 z-0 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 100 20" fill="none">
                      <path d="M0 10 C30 10, 70 10, 100 10" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="4 4" />
                      <path 
                        d="M0 10 C30 10, 70 10, 100 10" 
                        stroke="url(#wire-gradient-how)" 
                        strokeWidth="2" 
                        className={isHovered ? "wire-pulse" : ""}
                      />
                      <defs>
                        <linearGradient id="wire-gradient-how" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(183 100% 50%)" />
                          <stop offset="50%" stopColor="hsl(270 60% 62%)" />
                          <stop offset="100%" stopColor="hsl(142 76% 55%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}

                {/* Card Container */}
                <button
                  type="button"
                  aria-pressed={isHovered}
                  onClick={() => setHoveredIdx(i)}
                  className={`w-full text-left relative rounded-3xl p-8 bg-gradient-to-br from-card/90 to-card/30 border transition-all duration-300 ${
                    isHovered 
                      ? `${colors.glow} bg-card/60 -translate-y-1.5`
                      : "border-border-subtle bg-card/30"
                  }`}
                >

                  {/* Step & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 transition-transform ${isHovered ? "scale-110" : ""} ${colors.icon}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`font-display font-bold text-4xl opacity-15 font-mono ${colors.step}`}>
                      {step.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className={`font-display font-bold text-xl text-foreground mb-3 transition-colors ${isHovered ? colors.glowText : ""}`}>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 min-h-[72px]">
                    {step.description}
                  </p>

                  {/* Live Visual status bar on card */}
                  <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Status:</span>
                    <span className={`text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 ${isHovered ? colors.glowText : "text-muted-foreground"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isHovered ? "bg-accent animate-pulse" : "bg-foreground/10"}`} />
                      {step.flowLabel}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Big visual illustration box matching active step */}
        <div className="mt-16 p-8 rounded-3xl border border-border-subtle bg-card relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none rounded-3xl" />
          
          <div className="max-w-md relative z-10">
            <h4 className="font-display font-bold text-lg text-foreground mb-2 uppercase tracking-wide">
              {hoveredIdx === 0 && "Step 1: The Code Docking Engine"}
              {hoveredIdx === 1 && "Step 2: The Semantic Parser"}
              {hoveredIdx === 2 && "Step 3: Direct Escrow Hiring"}
            </h4>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {hoveredIdx === 0 && "Connect your GitHub or Vercel URLs. Our system runs sandbox checks to index dependencies and functionality directly into your profile stamp."}
              {hoveredIdx === 1 && "No tags or resumes needed. Our search indexes actual code blocks. If a founder searches 'Stripe integration', your profile rises if you have shipped live code containing it."}
              {hoveredIdx === 2 && "Founders initiate direct contracts based on active code proofs. Escrow handles security, payment is released upon milestone commits."}
            </p>
          </div>

          <div className="relative z-10 flex gap-4 shrink-0 font-mono text-[10px] bg-background/40 border border-border-subtle rounded-2xl p-4 w-full md:w-auto overflow-x-auto">
            {hoveredIdx === 0 && (
              <div className="space-y-1 text-primary">
                <p>➜ git clone git@github.com:builder/agent.git</p>
                <p className="text-foreground">➜ Analyzing imports: [openai, langchain]</p>
                <p className="text-foreground">➜ Shipped to: <span className="underline">shipyard.dock/agent-xyz</span></p>
                <p className="text-accent font-bold">✔ DOCKED SUCCESSFUL</p>
              </div>
            )}
            {hoveredIdx === 1 && (
              <div className="space-y-1 text-secondary">
                <p>➜ founder_query: "Vector db chat assistant"</p>
                <p className="text-foreground">➜ Scanning repository semantic maps...</p>
                <p className="text-foreground">➜ Matched: <span className="underline">@arjun_builds (98% match)</span></p>
                <p className="text-accent font-bold">➜ Matching complete.</p>
              </div>
            )}
            {hoveredIdx === 2 && (
              <div className="space-y-1 text-accent">
                <p>➜ escrow_agreement: "Create bot dashboard"</p>
                <p className="text-foreground">➜ Escrow status: [funded, locked]</p>
                <p className="text-foreground">➜ Contract key: 0x8a927d...8b99</p>
                <p className="text-foreground font-bold">➜ Ready to code.</p>
              </div>
            )}
          </div>
        </div>
        </BlurFade>

      </div>
    </section>
  );
};

export default HowItWorks;
