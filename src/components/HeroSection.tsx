import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import { ArrowRight, Sparkles, Users, Rocket, Terminal, RefreshCw, Send } from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { WordRotate } from "@/components/magicui/word-rotate";
import HeroOrb from "@/components/HeroOrb";
import { useTilt } from "@/hooks/useTilt";
import { toast } from "@/hooks/use-toast";


const LOG_REPLIES: Record<string, string[]> = {
  default: [
    "Analyzing request...",
    "Initializing project scaffold...",
    "Installed dependencies: react, tailwindcss, framer-motion",
    "Generated components/App.tsx, components/Hero.tsx",
    "Vite dev server running on http://localhost:5173",
  ],
  swap: [
    "Initializing environment...",
    "Installed tailwindcss, postcss, autoprefixer",
    "Created components/SwapInterface.tsx",
    "Applying neon gradients and backdrop-blur formulas...",
    "Vite dev server running on http://localhost:5173",
  ],
  chat: [
    "Setting up system prompts...",
    "Connected to Claude-3.5-Sonnet API",
    "Constructed virtual stream layout...",
    "Rendered scrollable history viewport",
    "Vite dev server running on http://localhost:5173",
  ],
  dashboard: [
    "Importing charting libraries...",
    "Configured grid alignment layout",
    "Parsed mock database telemetry...",
    "Preloaded trendlines...",
    "Vite dev server running on http://localhost:5173",
  ],
};

function inferReply(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  if (lower.includes("swap") || lower.includes("defi") || lower.includes("crypto")) return LOG_REPLIES.swap;
  if (lower.includes("chat") || lower.includes("agent") || lower.includes("ai") || lower.includes("bot")) return LOG_REPLIES.chat;
  if (lower.includes("dashboard") || lower.includes("analytics") || lower.includes("metrics") || lower.includes("saas")) return LOG_REPLIES.dashboard;
  const defaultLogs = [...LOG_REPLIES.default];
  defaultLogs.splice(1, 0, `Detected keywords: ${lower.split(" ").slice(0, 3).join(", ")}...`);
  return defaultLogs;
}

const PRESETS = [
  { id: "defi", label: "DeFi Swap", prompt: "Create a modern, glassmorphic crypto swap interface with neon glows." },
  { id: "ai-agent", label: "AI Chat Agent", prompt: "Design a dark-mode conversational AI assistant screen with active indicators." },
  { id: "creator", label: "Creator Dashboard", prompt: "Create a SaaS metrics dashboard featuring revenue stats and trends." },
];

const stats = [
  { label: "AI Builders Docked", value: 2400, suffix: "+", icon: Users },
  { label: "Projects Shipped", value: 8900, suffix: "+", icon: Rocket },
  { label: "Tools in the Yard", value: 1200, suffix: "+", icon: Sparkles },
];

const HeroSection = () => {
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [promptText, setPromptText] = useState(PRESETS[0].prompt);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "running" | "done">("done");
  const inputRef = useRef<HTMLInputElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { ref: tiltRef, style: tiltStyle, handlers: tiltHandlers } = useTilt<HTMLDivElement>({ max: 5 });



  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  const runSimulation = useCallback((prompt: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPromptText(prompt);
    setVisibleLogs([]);
    setState("running");

    const logs = inferReply(prompt);
    let idx = 0;
    const simMs = Math.max(600, logs.length * 280);

    toast({ title: "Simulation started", description: `Building: ${prompt.slice(0, 60)}${prompt.length > 60 ? "..." : ""}`, duration: 3000 });

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (!logs || idx >= logs.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setState("done");
          toast({ title: "Build complete", description: "Project scaffold generated successfully", duration: 4000 });
          return;
        }
        const line = logs[idx];
        if (line != null) {
          setVisibleLogs((prev) => [...prev, line]);
        }
        idx++;
      }, simMs / logs.length);
    }, 400);
  }, []);

  useEffect(() => {
    runSimulation(PRESETS[0].prompt);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [runSimulation]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = customPrompt.trim();
    if (!trimmed) return;
    runSimulation(trimmed);
    setCustomPrompt("");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 px-6 bg-canvas-dots">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.03]"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_70%_50%_at_50%_-10%,hsl(var(--brand-400)/0.05),transparent_60%)] pointer-events-none" />

      <div className="absolute top-1/4 left-5 w-40 h-40 bg-primary/[0.03] rounded-full blur-[90px]" />
      <div className="absolute bottom-1/4 right-5 w-60 h-60 bg-secondary/[0.03] rounded-full blur-[110px]" />

      <div className="relative z-10 container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-subtle bg-surface-elevated/60 text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.18em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              The Next Gen Port for Vibe Coding
            </div>

            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.035em] text-foreground mb-6 flex flex-wrap items-baseline gap-x-3">
              Build.
              <WordRotate
                words={["Dock.", "Deploy.", "Launch.", "Ship."]}
                duration={3000}
                className="gradient-text-cyan font-bold"
                motionProps={{
                  initial: { opacity: 0, y: -24 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: 24 },
                  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                }}
              />
              Ship.
              <span className="text-muted-foreground">Get Paid.</span>
            </h1>

            <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-8 leading-relaxed">
              Welcome to the global ecosystem where developer vibes become live products.
              Dock your AI-assisted repositories, verify performance metrics, and match
              with founders paying $10k+ for proven builders. No resumes. Only code.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-12">
              <a href="/projects" className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold shadow-elev-md hover:brightness-110 transition-all duration-micro ease-standard">
                Browse Projects →
              </a>
              <a href="/#discover" className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-border-strong bg-surface text-foreground font-semibold text-sm shadow-elev-sm hover:bg-muted transition-all duration-micro ease-standard">
                Hire Vibe Builders
              </a>

            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border-subtle w-full">
              {stats.map(({ label, value, suffix }) => (
                <div key={label} className="flex flex-col">
                  <span className="font-display font-bold text-xl md:text-2xl text-foreground flex items-baseline gap-1">
                    <NumberTicker value={value} className="text-xl md:text-2xl" />
                    <span className="text-xl md:text-2xl text-primary">{suffix}</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.16em] mt-1.5">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Terminal */}
          <div className="lg:col-span-6 w-full flex flex-col">
            <div className="relative w-full rounded-2xl border border-foreground/15 bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-surface-elevated/40 border-b border-border-subtle">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">~/sandbox — bash</span>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-[0.16em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Live
                </div>
              </div>

              {/* Preset Tabs */}
              <div className="flex border-b border-foreground/15 bg-card/[0.01]">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => { setActivePreset(preset); runSimulation(preset.prompt); }}
                    className={`flex-1 py-2 text-[11px] font-bold tracking-wider border-r border-foreground/15 last:border-r-0 transition-colors ${
                      activePreset.id === preset.id
                        ? "bg-primary/10 text-primary border-b border-b-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/[0.02]"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Terminal Body */}
              <div className="p-4 min-h-[240px] bg-background/30 font-mono text-[11px] flex flex-col">
                {/* Prompt display */}
                <div className="flex items-start gap-1.5 mb-3">
                  <Terminal className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[9px] text-foreground/40 block font-semibold uppercase tracking-wider mb-0.5 font-sans">Prompt:</span>
                    {state === "running" && visibleLogs.length === 0 ? (
                      <span className="border-r-2 border-primary animate-pulse text-primary">{promptText}</span>
                    ) : (
                      <span className="text-primary">{promptText}</span>
                    )}
                  </div>
                </div>

                {/* Logs */}
                <div ref={logContainerRef} className="flex-1 space-y-1 max-h-[160px] overflow-y-auto">
                  {visibleLogs.map((log, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-foreground/20 shrink-0 w-4 text-right select-none">{i + 1}</span>
                      <span className={log?.includes?.("Vite") || log?.includes?.("http://localhost") ? "text-accent font-bold" : "text-foreground/70"}>
                        {log}
                      </span>
                    </div>
                  ))}
                  {state === "running" && visibleLogs.length > 0 && (
                    <div className="flex gap-1 items-center pl-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.1s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.3s]" />
                    </div>
                  )}
                  <div ref={logEndRef} />
                </div>

                {/* Input area */}
                <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-foreground/10 flex gap-2">
                  <span className="text-primary text-xs mt-2 shrink-0">
                    {`$`}
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Type any build prompt..."
                    disabled={state === "running"}
                    className="flex-1 bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground/40 font-mono disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={state === "running" || !customPrompt.trim()}
                    className="px-2.5 py-1.5 rounded-lg bg-primary/20 border border-primary/30 text-primary font-bold text-[10px] hover:bg-primary/30 transition-all disabled:opacity-30 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    Run
                  </button>
                  <button
                    type="button"
                    onClick={() => runSimulation(activePreset.prompt)}
                    className="px-2 py-1.5 rounded-lg bg-foreground/5 border border-foreground/10 text-muted-foreground hover:text-foreground transition-all text-[10px]"
                    title="Reset"
                  >
                    <RefreshCw className={`w-3 h-3 ${state === "running" ? "animate-spin" : ""}`} />
                  </button>
                </form>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;