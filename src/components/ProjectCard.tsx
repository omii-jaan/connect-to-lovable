import { useState } from "react";
import { ExternalLink, Rocket, Eye, X, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useCardGlow } from "@/hooks/useCardGlow";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export interface Project {
  id: number;
  title: string;
  description: string;
  builder: string;
  builderHandle: string;
  builderAvatar: string;
  category: string;
  categoryColor: "cyan" | "purple" | "green" | "orange";
  stack: string[];
  views: number;
  liveLink: string;
  featured?: boolean;
}

const categoryStyles = {
  cyan: "bg-primary/10 text-primary border-primary/20",
  purple: "bg-secondary/10 text-secondary-bright border-secondary/20",
  green: "bg-accent/10 text-accent border-accent/20",
  orange: "bg-accent/[0.08] text-accent border-accent/20",
};

const spotlightColors: Record<string, string> = {
  cyan: "hsl(178 29% 50% / 0.06)",
  purple: "hsl(178 29% 50% / 0.06)",
  green: "hsl(178 29% 50% / 0.06)",
  orange: "hsl(178 29% 50% / 0.06)",
};

const ProjectCard = ({ project }: { project: Project }) => {
  const { ref, handleMouseMove, handleMouseLeave } = useCardGlow();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setOpen(true)}
        className={`relative card-shine rounded-2xl p-5 group cursor-pointer transition-all duration-300 hover:-translate-y-1 overflow-hidden ${project.featured ? "border-primary/25 glow-cyan" : ""}`}
        style={{ "--glow-x": "-9999px", "--glow-y": "-9999px" } as React.CSSProperties}
      >
        <div
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[inherit]"
          style={{
            background: `radial-gradient(350px circle at var(--glow-x) var(--glow-y), ${spotlightColors[project.categoryColor] || spotlightColors.cyan}, transparent 70%)`,
          }}
        />

        {project.featured && (
          <div className="absolute -top-2.5 left-4">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-gradient-primary text-primary-foreground">
              ✦ Featured
            </span>
          </div>
        )}

        <div className="flex items-start justify-between mb-3 mt-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-shine flex items-center justify-center border border-border">
              <Rocket className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{project.title}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <img src={project.builderAvatar} alt={project.builder} className="w-4 h-4 rounded-full" />
                <Link to={`/builder/${project.builderHandle}`} onClick={(e) => e.stopPropagation()} className="text-xs text-muted-foreground hover:text-primary transition-colors">{project.builder}</Link>
              </div>
            </div>
          </div>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${categoryStyles[project.categoryColor]}`}>
            {project.category}
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map((tech) => (
            <span key={tech} className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground font-mono">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Eye className="w-3.5 h-3.5" aria-hidden="true" /> {project.views.toLocaleString()} views
          </span>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`View details for ${project.title} by ${project.builder}`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="flex min-h-11 items-center gap-1 rounded-md px-1 text-xs text-primary hover:underline"
          >
            View Details <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg border-border bg-card p-0 gap-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-shine flex items-center justify-center border border-border">
                  <Rocket className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold text-foreground text-left">{project.title}</DialogTitle>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <img src={project.builderAvatar} alt={project.builder} className="w-4 h-4 rounded-full" />
                    <Link to={`/builder/${project.builderHandle}`} onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      {project.builder}
                    </Link>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={`Close ${project.title} details`}
                className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${categoryStyles[project.categoryColor]}`}>
                {project.category}
              </span>
              {project.featured && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-primary text-primary-foreground">
                  ✦ Featured
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.description}</p>

            <div className="mb-4">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 text-[11px] rounded-md bg-muted text-foreground font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="w-3.5 h-3.5" /> {project.views.toLocaleString()} views
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 border-t border-border bg-muted/30">
            <Link to="/login" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-bold text-xs glow-cyan hover:brightness-110 transition-all">
              <Mail className="w-3.5 h-3.5" />
              Contact Builder
            </Link>
            <a href={project.liveLink !== "#" ? project.liveLink : undefined} onClick={(e) => { if (project.liveLink === "#") { e.preventDefault(); toast({ title: "Demo coming soon", description: "The live demo link will be available once the builder publishes it.", duration: 4000 }); }}} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-xs font-bold hover:bg-muted transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
