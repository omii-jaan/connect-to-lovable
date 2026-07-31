import { useState, useEffect } from "react";
import { Cpu, UserCheck, ShieldCheck, Star, Code2, ArrowRight, Activity, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { BlurFade } from "@/components/magicui/blur-fade";

interface MatchedBuilder {
  name: string;
  avatar: string;
  handle: string;
  vibeScore: number;
  specialty: string;
  recentShip: string;
  stars: number;
  projects: number;
  skills: string[];
}

const MATCHER_PRESETS: Record<string, MatchedBuilder> = {
  "ai-saas": {
    name: "Arjun Mehta",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun&backgroundColor=b6e3f4",
    handle: "@arjun_builds",
    vibeScore: 98,
    specialty: "AI SaaS Architect",
    recentShip: "Autonomous CRM Agent with Stripe API",
    stars: 342,
    projects: 12,
    skills: ["OpenAI", "LangChain", "Next.js", "Postgres"],
  },
  "voice-agent": {
    name: "Dev Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=devpatel&backgroundColor=b6e3f4",
    handle: "@devpatel_ai",
    vibeScore: 95,
    specialty: "Voice AI & WhatsApp Integrations",
    recentShip: "AI Dialing Assistant (Twilio + Whisper)",
    stars: 203,
    projects: 8,
    skills: ["Twilio", "Whisper", "GPT-4", "Node.js"],
  },
  "defi-web3": {
    name: "Priya Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=d1d4f9",
    handle: "@priya_ships",
    vibeScore: 97,
    specialty: "Stateful Agent Architect",
    recentShip: "Cross-chain Agent Router (LangGraph)",
    stars: 218,
    projects: 9,
    skills: ["Claude", "LangGraph", "FastAPI", "Pinecone"],
  },
};

const DiscoverFeed = () => {
  const [selectedRole, setSelectedRole] = useState<string>("ai-saas");
  const [matchingState, setMatchingState] = useState<"idle" | "scanning" | "matched">("matched");
  const [matchedBuilder, setMatchedBuilder] = useState<MatchedBuilder>(MATCHER_PRESETS["ai-saas"]);
  const [scanProgress, setScanProgress] = useState<number>(100);

  const startMatching = (roleId: string) => {
    setSelectedRole(roleId);
    setMatchingState("scanning");
    setScanProgress(0);
    
    // Simulate scanner increment
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setMatchedBuilder(MATCHER_PRESETS[roleId]);
          setMatchingState("matched");
          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  return (
    <section id="discover" className="py-24 px-6 relative overflow-hidden bg-background/20">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[radial-gradient(circle_at_center,hsl(270_60%_62%_/_0.03),transparent_70%)] pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative z-10">
        
        {/* Title Block */}
        <BlurFade delay={0.1} direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-secondary text-sm font-semibold uppercase tracking-widest mb-3">AI Matching Core</p>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4">
              Meet the Match Engine
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Skip the recruiter spam. Type what you need, let our semantic parser evaluate thousands of live repositories, and view developers with verified proof of work.
            </p>
          </div>
        </BlurFade>

        {/* Dashboard Grid */}
        <BlurFade delay={0.2} direction="up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Match Controls (4 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-foreground/5 bg-card/40 p-6 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Cpu className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider font-mono">Semantic Queries</span>
              </div>

              <h3 className="font-display font-bold text-xl text-foreground mb-4">
                Who are you looking to hire?
              </h3>
              
              <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                Select a preset role query below to see how our engine parses commit histories, package imports, and shipped demos.
              </p>

              <div className="space-y-3">
                {[
                  { id: "ai-saas", label: "AI SaaS Builder", prompt: "Agent workflow + Stripe dashboard", count: "12 candidates" },
                  { id: "voice-agent", label: "Voice AI Engineer", prompt: "Whisper audio processing + Twilio voice", count: "4 candidates" },
                  { id: "defi-web3", label: "Agent Pipeline Arch", prompt: "LangGraph state management + Vector index", count: "7 candidates" },
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => startMatching(role.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                      selectedRole === role.id
                        ? "bg-primary/5 border-primary/30 shadow-[0_0_15px_rgba(183,100,50,0.1)]"
                        : "bg-card/[0.02] border-foreground/5 hover:bg-card/[0.04] hover:border-foreground/10"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-foreground">{role.label}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{role.count}</span>
                    </div>
                    <p className="text-[10px] font-mono text-primary/75">{role.prompt}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-foreground/5">
              <Link to="/login" className="w-full py-3.5 rounded-full bg-gradient-primary text-primary-foreground font-bold text-xs glow-cyan transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                Launch Custom Match Request
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Middle Column: The Connector Wire (2 cols, desktop only) */}
          <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center">
            <div className="w-full relative flex items-center justify-center">
              {/* Horizontal matching cable */}
              <svg className="w-full h-8" viewBox="0 0 100 20" fill="none">
                <path d="M0 10 H100" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeLinecap="round" />
                <path 
                  d="M0 10 H100" 
                  stroke="url(#wire-gradient)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  className={matchingState === "scanning" ? "wire-pulse" : ""}
                />
                <defs>
                  <linearGradient id="wire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(270 60% 62%)" />
                    <stop offset="50%" stopColor="hsl(183 100% 50%)" />
                    <stop offset="100%" stopColor="hsl(142 76% 55%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute w-8 h-8 rounded-full bg-card border border-foreground/10 flex items-center justify-center glow-cyan">
                <Activity className={`w-3.5 h-3.5 text-primary ${matchingState === "scanning" ? "animate-pulse" : ""}`} />
              </div>
            </div>
          </div>

          {/* Right Column: Match Preview Area (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center relative min-h-[350px]">
            {matchingState === "scanning" ? (
              // Scanner view
              <div className="w-full h-full flex flex-col justify-center items-center rounded-3xl border border-foreground/5 bg-card/20 backdrop-blur-md p-8 relative overflow-hidden">
                {/* Simulated radar scan line */}
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-bounce opacity-70"
                  style={{ top: `${scanProgress}%` }}
                />
                <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center animate-spin mb-4">
                  <Zap className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <p className="text-xs font-mono text-foreground tracking-widest uppercase mb-1">Scanning Git History...</p>
                <div className="w-40 bg-foreground/5 h-1.5 rounded-full overflow-hidden border border-foreground/5">
                  <div className="bg-primary h-full transition-all duration-100" style={{ width: `${scanProgress}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground font-mono mt-3 uppercase">Matching telemetry score: {scanProgress}%</p>
              </div>
            ) : (
              // Matched builder display
              <div className="w-full h-full rounded-3xl border border-primary/20 bg-gradient-to-br from-card to-card/65 p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between animate-in fade-in zoom-in-95 duration-300">
                <div>
                  {/* Match Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent uppercase tracking-wider">
                      <UserCheck className="w-3.5 h-3.5" />
                      MATCH FOUND
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Vibe Score:</span>
                      <span className="ml-1.5 font-mono text-sm font-bold text-primary">{matchedBuilder.vibeScore}%</span>
                    </div>
                  </div>

                  {/* Profile section */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <img 
                      src={matchedBuilder.avatar} 
                      alt={matchedBuilder.name} 
                      className="w-14 h-14 rounded-full border border-foreground/20 bg-muted"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-display font-bold text-lg text-foreground">{matchedBuilder.name}</span>
                        <ShieldCheck className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">{matchedBuilder.handle}</p>
                    </div>
                  </div>

                  {/* Specialty and stats */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Developer Specialty</p>
                      <p className="text-sm font-semibold text-foreground/90">{matchedBuilder.specialty}</p>
                    </div>

                    <div>
                      <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Verified Shipped Product</p>
                      <p className="text-xs text-primary font-medium font-mono">{matchedBuilder.recentShip}</p>
                    </div>

                    <div>
                      <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">Stack Match</p>
                      <div className="flex flex-wrap gap-1">
                        {matchedBuilder.skills.map((skill) => (
                          <span key={skill} className="px-2 py-0.5 text-[9px] font-mono rounded bg-foreground/5 border border-foreground/5 text-foreground/80">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom stats and action */}
                <div className="pt-4 border-t border-foreground/5 flex items-center justify-between">
                  <div className="flex gap-4 text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-primary" /> {matchedBuilder.stars}</span>
                    <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-secondary" /> {matchedBuilder.projects} shipped</span>
                  </div>
                  <Link to="/login" className="px-4 py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 text-foreground font-bold text-xs transition-all active:scale-95 inline-block">
                    Open Contract
                  </Link>
                </div>
              </div>
            )}
          </div>
          
        </div>
        </BlurFade>
      </div>
    </section>
  );
};

export default DiscoverFeed;
