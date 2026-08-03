import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Search, Eye, Clock, ChevronRight, Bookmark, BookmarkCheck,
  Sparkles, Filter, ArrowUpDown, X, CircleDollarSign, Briefcase,
  Flame, LayoutGrid, List as ListIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { notify as toast } from "@/lib/notify";
import { MOCK_HIRE_PROJECTS, CATEGORIES, BUDGET_RANGES, TIMELINE_OPTIONS } from "@/lib/marketplace-data";
import { formatDistanceToNow } from "date-fns";
import type { HireProject } from "@/types";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Most Popular", value: "views" },
  { label: "Highest Budget", value: "budget_desc" },
  { label: "Lowest Budget", value: "budget_asc" },
  { label: "Most Interest", value: "interest" },
  { label: "Soonest Deadline", value: "timeline" },
] as const;

const Projects = () => {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<(typeof BUDGET_RANGES)[number]>(BUDGET_RANGES[0]);
  const [timelineMax, setTimelineMax] = useState<(typeof TIMELINE_OPTIONS)[number]>(TIMELINE_OPTIONS[0]);
  const [sortBy, setSortBy] = useState("newest");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSaved = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast("Removed from saved"); }
      else { next.add(id); toast("Project saved!"); }
      return next;
    });
  };

  const filtered = useMemo(() => {
    let result = [...MOCK_HIRE_PROJECTS].filter((p) => p.status === "open");
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.required_skills.some((s) => s.toLowerCase().includes(q)) ||
          p.preferred_tech_stack.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (budgetRange.max !== Infinity) {
      result = result.filter((p) => p.budget_min <= budgetRange.max && p.budget_max >= budgetRange.min);
    }
    if (timelineMax.weeks > 0) {
      result = result.filter((p) => p.timeline_weeks <= timelineMax.weeks);
    }
    switch (sortBy) {
      case "newest": result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case "views": result.sort((a, b) => b.views_count - a.views_count); break;
      case "budget_desc": result.sort((a, b) => b.budget_max - a.budget_max); break;
      case "budget_asc": result.sort((a, b) => a.budget_min - b.budget_min); break;
      case "interest": result.sort((a, b) => b.interest_count - a.interest_count); break;
      case "timeline": result.sort((a, b) => a.timeline_weeks - b.timeline_weeks); break;
    }
    return result;
  }, [search, selectedCategories, budgetRange, timelineMax, sortBy]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setBudgetRange(BUDGET_RANGES[0]);
    setTimelineMax(TIMELINE_OPTIONS[0]);
    setSearch("");
  };
  const hasFilters = selectedCategories.length > 0 || budgetRange.max !== Infinity || timelineMax.weeks > 0 || search.trim();

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none h-96" />
        <main id="main" className="max-w-7xl mx-auto px-4 py-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-primary">/marketplace</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
              </div>
              <h1 id="main-heading" className="font-display font-bold text-4xl text-foreground">
                Discover <span className="gradient-text-cyan">Projects</span>
              </h1>
              <p className="text-sm font-mono text-muted-foreground mt-1">
                <span className="text-primary font-bold">{MOCK_HIRE_PROJECTS.filter(p => p.status === "open").length}</span> open projects · <span className="text-accent font-bold">1,247</span> active builders
              </p>
            </div>
            <Link to="/post-project">
              <Button className="bg-gradient-primary text-primary-foreground font-bold text-xs glow-cyan hover:brightness-110 transition-all h-9 px-5">
                <Plus className="w-4 h-4" />
                Post a Project
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, skills, tech stack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/50 border-border/50 text-sm h-9 focus:bg-muted/80 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center h-9 px-3 rounded-lg bg-muted/50 border border-border/50 text-xs font-mono text-muted-foreground">
                <CircleDollarSign className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <select
                  aria-label="Filter by budget"
                  value={budgetRange.label}
                  onChange={(e) => setBudgetRange(BUDGET_RANGES.find((b) => b.label === e.target.value) || BUDGET_RANGES[0])}
                  className="bg-transparent border-none outline-none text-xs font-mono text-muted-foreground cursor-pointer py-1"
                >
                  {BUDGET_RANGES.map((b) => (
                    <option key={b.label} value={b.label}>{b.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center h-9 px-3 rounded-lg bg-muted/50 border border-border/50 text-xs font-mono text-muted-foreground">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <select
                  aria-label="Filter by timeline"
                  value={timelineMax.label}
                  onChange={(e) => setTimelineMax(TIMELINE_OPTIONS.find((t) => t.label === e.target.value) || TIMELINE_OPTIONS[0])}
                  className="bg-transparent border-none outline-none text-xs font-mono text-muted-foreground cursor-pointer py-1"
                >
                  {TIMELINE_OPTIONS.map((t) => (
                    <option key={t.label} value={t.label}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center h-9 px-3 rounded-lg bg-muted/50 border border-border/50 text-xs font-mono text-muted-foreground">
                <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <select
                  aria-label="Sort projects"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-mono text-muted-foreground cursor-pointer py-1"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1 border-l border-border/30 pl-2 ml-1">
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${view === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-muted-foreground"}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${view === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-muted-foreground"}`}
                >
                  <ListIcon className="w-3.5 h-3.5" />
                </button>
              </div>
              {hasFilters && (
                <button type="button" onClick={clearFilters} aria-label="Clear all filters" className="flex items-center gap-1 h-7 px-2 rounded text-[10px] font-mono text-destructive hover:bg-destructive/10 transition-colors">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-6">
            <button
              type="button"
              aria-expanded={showFilters}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono border transition-all ${
                showFilters ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted/50 border-border/50 text-muted-foreground hover:border-primary/20"
              }`}
            >
              <Filter className="w-3 h-3" />
              Filters
              {selectedCategories.length > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-primary text-[8px] font-bold text-primary-foreground flex items-center justify-center">{selectedCategories.length}</span>
              )}
            </button>
            {CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat);
              const style = CATEGORY_STYLES[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-mono border transition-all ${
                    active
                      ? `${style?.border || "border-primary/30"} ${style?.bg || "bg-primary/10"} ${style?.text || "text-primary"}`
                      : "bg-muted/50 border-border/50 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                  }`}
                >
                  {active && <span className={`inline-block w-1.5 h-1.5 rounded-full ${style?.dot || "bg-primary"} mr-1.5`} />}
                  {cat}
                </button>
              );
            })}
          </div>

          <h2 className="sr-only">Open projects</h2>
          <AnimatePresence>
            {view === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {filtered.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} saved={saved.has(project.id)} onToggleSave={() => toggleSaved(project.id)} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filtered.map((project, i) => (
                  <ProjectListItem key={project.id} project={project} index={i} saved={saved.has(project.id)} onToggleSave={() => toggleSaved(project.id)} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-muted border border-border/50 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-display font-bold text-lg text-foreground mb-1">No matches found</p>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
              <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs">Clear all filters</Button>
            </motion.div>
          )}

          <div className="mt-12 pt-8 border-t border-border/30 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span>Showing {filtered.length} of {MOCK_HIRE_PROJECTS.filter(p => p.status === "open").length} open projects</span>
            <span>Updated in real-time</span>
          </div>
        </main>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, index, saved, onToggleSave }: { project: HireProject; index: number; saved: boolean; onToggleSave: () => void }) => {
  const style = CATEGORY_STYLES[project.category] || CATEGORY_STYLES["AI Agents"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
      layout
    >
      <Link to={`/projects/${project.id}`}>
        <Card className="group relative border-border-subtle bg-card shadow-elev-sm hover:bg-muted/80 hover:border-primary/30 hover:shadow-[0_0_30px_-5px] hover:shadow-primary/10 transition-all duration-300 p-5 h-full flex flex-col overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="flex items-start justify-between mb-3 relative z-10">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                  </span>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${style?.dot || "bg-primary"} opacity-60`} />
                  <span className={`text-[10px] font-mono ${style?.text || "text-primary"}`}>
                    {project.category}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label={saved ? `Remove ${project.title} from saved projects` : `Save ${project.title}`}
              aria-pressed={saved}
              onClick={(e) => { e.preventDefault(); onToggleSave(); }}
              className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                saved
                  ? "text-primary bg-primary/10 border border-primary/20"
                  : "text-muted-foreground hover:text-muted-foreground hover:bg-card/[0.04] border border-transparent"
              }`}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1 relative z-10">
            {project.description}
          </p>

          <div className="flex items-center gap-1.5 mb-4 flex-wrap relative z-10">
            {project.required_skills.slice(0, 3).map((skill) => (
              <TechBadge key={skill} name={skill} size="xs" />
            ))}

            {project.required_skills.length > 3 && (
              <span className="text-[9px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border/20">
                +{project.required_skills.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3.5 border-t border-border/30 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <CircleDollarSign className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-bold text-foreground">${project.budget_min.toLocaleString()}</span>
                <span className="text-[10px] text-muted-foreground">– ${project.budget_max.toLocaleString()}</span>
              </div>
              <div className="w-px h-4 bg-border/40" />
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-mono text-muted-foreground">{project.timeline_weeks}w</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 relative z-10">
            <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{project.views_count}</span>
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" />{project.interest_count}</span>
            </div>
            <motion.div
              className="flex items-center gap-1 text-[10px] font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={false}
            >
              View Details <ChevronRight className="w-3 h-3" />
            </motion.div>
          </div>

          {project.interest_count >= 5 && (
            <div className="absolute top-3 right-12">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[8px] font-mono text-accent">
                <Flame className="w-2.5 h-2.5" /> Popular
              </div>
            </div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
};

const CATEGORY_STYLES: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  "AI Agents":               { border: "border-primary/25", bg: "bg-primary/[0.07]", text: "text-primary", dot: "bg-primary" },
  "Data Engineering":        { border: "border-border-strong", bg: "bg-surface-elevated", text: "text-text-secondary", dot: "bg-text-tertiary" },
  "DevOps & Infrastructure": { border: "border-accent/25", bg: "bg-accent/[0.07]", text: "text-accent", dot: "bg-accent" },
  "Developer Tools":         { border: "border-border-strong", bg: "bg-surface-elevated", text: "text-text-secondary", dot: "bg-text-tertiary" },
  "Automation":              { border: "border-primary/25", bg: "bg-primary/[0.07]", text: "text-primary", dot: "bg-primary" },
  "Web Development":         { border: "border-accent/25", bg: "bg-accent/[0.07]", text: "text-accent", dot: "bg-accent" },
};

const ProjectListItem = ({ project, index, saved, onToggleSave }: { project: HireProject; index: number; saved: boolean; onToggleSave: () => void }) => {
  const style = CATEGORY_STYLES[project.category] || CATEGORY_STYLES["AI Agents"];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      layout
    >
      <Link to={`/projects/${project.id}`}>
        <div className="group flex items-center gap-4 px-4 py-3.5 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/60 hover:border-border/60 hover:shadow-[0_0_20px_-8px] hover:shadow-primary/5 transition-all duration-200">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4 text-primary" />
          </div>

          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center">
            <div className="md:col-span-2 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">{project.description}</p>
            </div>

            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {project.required_skills.slice(0, 2).map((s) => (
                <span key={s} className="text-[9px] font-mono text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full border border-border/30">{s}</span>
              ))}
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3">
              <div className="flex items-center gap-1.5">
                <CircleDollarSign className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-bold text-foreground">${project.budget_min.toLocaleString()}</span>
              </div>
              <div className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${style?.border || "border-primary/30"} ${style?.bg || "bg-primary/10"} ${style?.text || "text-primary"}`}>
                {project.category}
              </div>
              <button
                type="button"
                aria-label={saved ? `Remove ${project.title} from saved projects` : `Save ${project.title}`}
                aria-pressed={saved}
                onClick={(e) => { e.preventDefault(); onToggleSave(); }}
                className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                  saved ? "text-primary" : "text-muted-foreground hover:text-muted-foreground"
                }`}
              >
                {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Projects;
