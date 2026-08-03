import { ExternalLink, Star, Code2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useCardGlow } from "@/hooks/useCardGlow";

export interface Builder {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  stack: string[];
  projects: number;
  stars: number;
  badge: string;
  badgeColor: "cyan" | "purple" | "green";
}

const badgeStyles = {
  cyan: {
    badge: "bg-primary/10 text-primary border-primary/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(183,100,50,0.15)] group-hover:border-primary/40",
    stamp: "text-primary",
    spotlight: "hsla(183, 100%, 50%, 0.08)",
  },
  purple: {
    badge: "bg-secondary/10 text-secondary-bright border-secondary/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group-hover:border-secondary/40",
    stamp: "text-secondary-bright",
    spotlight: "hsla(183, 100%, 50%, 0.08)",
  },
  green: {
    badge: "bg-accent/10 text-accent border-accent/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(142,76,55,0.15)] group-hover:border-accent/40",
    stamp: "text-accent",
    spotlight: "hsla(183, 100%, 50%, 0.08)",
  },
};

const BuilderCard = ({ builder }: { builder: Builder }) => {
  const styles = badgeStyles[builder.badgeColor];
  const { ref, handleMouseMove, handleMouseLeave } = useCardGlow();

  const commitActivity = Array.from({ length: 14 }, (_, i) => Math.max(0, Math.floor(Math.sin(i + builder.id) * 3) + 2));
  const lastActive = ["now", "2m ago", "8m ago", "17m ago", "1h ago"][builder.id % 5];

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl p-6 bg-card border border-border-subtle group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 overflow-hidden ${styles.glow}`}
      style={{ "--glow-x": "-9999px", "--glow-y": "-9999px" } as React.CSSProperties}
    >
      {/* Mouse-following glow overlay */}
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[inherit]"
        style={{
          background: `radial-gradient(350px circle at var(--glow-x) var(--glow-y), ${styles.spotlight}, transparent 70%)`,
        }}
      />

      {/* Hologram stamp background */}
      
      {/* Hologram stamp background */}
      <div className={`absolute -right-8 -top-8 w-28 h-28 pointer-events-none opacity-20 ${styles.stamp} transition-transform duration-700 group-hover:rotate-45`}>
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="1.5" />
          <text x="50" y="55" fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor">PORT DOCKED</text>
        </svg>
      </div>

      {/* Header Info */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-full blur-[4px] opacity-40 group-hover:opacity-80 transition-opacity" />
            <img
              src={builder.avatar}
              alt={builder.name}
              className="w-12 h-12 rounded-full border border-foreground/20 object-cover relative z-10 bg-muted"
            />
            {/* Status dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-background z-20 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Link to={`/builder/${builder.handle.replace("@", "")}`} className="font-semibold text-foreground text-sm leading-none hover:text-primary transition-colors">
                {builder.name}
              </Link>
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            </div>
            <Link to={`/builder/${builder.handle.replace("@", "")}`} className="text-muted-foreground text-xs mt-1 hover:text-primary transition-colors block">
              {builder.handle}
            </Link>
          </div>
        </div>
        
        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${styles.badge}`}>
          {builder.badge}
        </span>
      </div>

      {/* Bio */}
      <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2 relative z-10">
        {builder.bio}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
        {builder.stack.map((tech) => (
          <span 
            key={tech} 
            className="px-2.5 py-0.5 text-[10px] rounded-md bg-foreground/5 border border-border-subtle text-foreground font-mono transition-colors group-hover:bg-foreground/10 group-hover:border-border-subtle"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Telemetry */}
      <div className="mb-5 p-2.5 rounded-xl bg-background/20 border border-border-subtle">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">Telemetry</span>
            <span className="text-[8px] font-mono text-accent">{`● ${lastActive}`}</span>
          </div>
          <span className="text-[9px] font-mono text-primary">{`> live`}</span>
        </div>
        <div className="flex gap-1 items-end h-6">
          {commitActivity.map((count, i) => {
            const colors = ["bg-foreground/10", "bg-primary/20", "bg-primary/55", "bg-primary/80", "bg-primary"];
            const bgClass = colors[Math.min(count, colors.length - 1)];
            return (
              <div 
                key={i} 
                className={`w-1.5 rounded-sm transition-all duration-300 ${bgClass} ${count > 2 ? "animate-pulse" : ""}`}
                style={{
                  height: `${(Math.max(1, count) / 5) * 100}%`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "2s",
                }}
                title={`${count * 2} updates`}
              />
            );
          })}
        </div>
      </div>

      {/* Metrics & Bottom Profile Link */}
      <div className="flex items-center justify-between pt-4 border-t border-border-subtle relative z-10">
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-primary" />
            {builder.stars}
          </span>
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-secondary-bright" />
            {builder.projects} shipped
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs text-primary hover:text-foreground font-bold tracking-wide transition-all group-hover:translate-x-0.5">
          Verify Proof <ExternalLink className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    </div>
  );
};

export default BuilderCard;
