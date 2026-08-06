import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Send, Sparkles, X, Plus, Loader2, Eye, EyeOff,
  Zap, Check, CircleDollarSign, Clock, Target, Briefcase,
  ChevronRight, CheckCircle, Shield, Globe, Users, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { notify as toast } from "@/lib/notify";
import { marketplaceApi } from "@/lib/api";
import { CATEGORIES } from "@/lib/marketplace-data";
import type { AIParsedRequirements } from "@/types";

const ALL_CATEGORIES = ["Full App / Product", ...CATEGORIES];
const BUDGET_TYPES = ["Fixed", "Hourly", "Range"] as const;
const COMPLEXITY_OPTIONS = ["low", "medium", "high", "critical"] as const;
const TEAM_SIZE_OPTIONS = ["1 Builder", "2-3 Builders", "4+ Team"] as const;
const STEPS = ["Basics & Requirements", "Budget & Timeline", "Skills & Scope", "Review & Publish"];

const PostProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  
  // Requirements list
  const [reqInput, setReqInput] = useState("");
  const [requirements, setRequirements] = useState<string[]>([
    "Must deliver clean, documented TypeScript codebase",
    "Include automated integration tests & setup guide"
  ]);

  // Budget & Timeline
  const [budgetType, setBudgetType] = useState<"Fixed" | "Hourly" | "Range">("Fixed");
  const [budgetMin, setBudgetMin] = useState("5000");
  const [budgetMax, setBudgetMax] = useState("12000");
  const [currency] = useState("USD");
  const [timelineWeeks, setTimelineWeeks] = useState("4");
  
  // Skills & Tags
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(["TypeScript", "React", "AI Integration"]);
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>(["Claude API", "Tailwind CSS", "Firebase"]);
  
  // Complexity & Scope
  const [complexity, setComplexity] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [teamSize, setTeamSize] = useState<string>("1 Builder");
  const [remote, setRemote] = useState(true);
  const [ndaRequired, setNdaRequired] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "invite-only">("public");
  const [featured, setFeatured] = useState(false);

  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<AIParsedRequirements | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const addReq = () => {
    const r = reqInput.trim();
    if (r && !requirements.includes(r)) setRequirements([...requirements, r]);
    setReqInput("");
  };
  const removeReq = (r: string) => setRequirements(requirements.filter((x) => x !== r));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  };
  const removeSkill = (s: string) => setSkills(skills.filter((x) => x !== s));

  const addTech = () => {
    const t = techInput.trim();
    if (t && !techStack.includes(t)) setTechStack([...techStack, t]);
    setTechInput("");
  };
  const removeTech = (t: string) => setTechStack(techStack.filter((x) => x !== t));

  const handleAiParse = async () => {
    if (!description.trim()) {
      toast.error("Write a project description first");
      return;
    }
    setParsing(true);
    await new Promise((r) => setTimeout(r, 1200));
    const newRequirements = [
      "AI-powered core workflow with <100ms response time",
      "Production-ready backend API with structured logging",
      "Responsive React client interface matching high-density dark UI"
    ];
    setRequirements((prev) => Array.from(new Set([...prev, ...newRequirements])));
    setParsed({
      core_requirement: description.split(".")[0] || "AI-powered application system",
      integrations: ["Claude API", "Firebase Auth", "Firestore"],
      tech_stack: ["TypeScript", "React", "Tailwind CSS"],
      complexity: description.length > 250 ? "high" : "medium",
      ideal_builder_type: "Full-stack AI developer with React expertise",
    });
    setParsing(false);
    toast.success("AI parsed requirements and updated scope items!");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setSubmitting(true);
    try {
      const created = await marketplaceApi.create({
        title: title.trim(),
        category,
        description: description.trim(),
        requirements,
        budgetType,
        budgetMin: Number(budgetMin) || 0,
        budgetMax: Number(budgetMax) || Number(budgetMin) || 0,
        currency,
        timelineWeeks: Number(timelineWeeks) || 1,
        skills,
        techStack,
        complexity,
        teamSize,
        remote,
        ndaRequired,
        visibility,
        featured,
      });

      toast.success("Project published to Marketplace!");
      navigate(`/marketplace/${created.slug}`);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to publish project scope");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = (s: number) => {
    if (s === 0) return title.trim() && description.trim();
    if (s === 1) return budgetMin && timelineWeeks && category;
    if (s === 2) return true;
    return true;
  };

  const nextStep = () => {
    if (canProceed(step)) {
      setStep(Math.min(step + 1, 3));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/marketplace"
              aria-label="Back to marketplace"
              className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-2xl tracking-tight text-foreground">
                Post a Project Scope
              </h1>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                Define deliverables, budget, and requirements for verified builders
              </p>
            </div>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 min-w-[140px]">
              <button
                type="button"
                aria-current={i === step ? "step" : undefined}
                onClick={() => i <= step && setStep(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all w-full ${
                  i === step
                    ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
                    : i < step
                    ? "text-primary/80 font-medium"
                    : "text-muted-foreground cursor-default"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold tabular-nums ${
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                <span className="truncate">{label}</span>
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <Card className="border-border bg-card p-6 rounded-xl shadow-sm space-y-4">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" /> Project Essentials
                    </h2>
                    
                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                        Project Title <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="e.g. Autonomous AI Customer Support Agent"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-background border-border text-xs focus-visible:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                        Category <span className="text-destructive">*</span>
                      </label>
                      <select
                        aria-label="Project Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {ALL_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-mono text-muted-foreground">
                          Description (Markdown) <span className="text-destructive">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleAiParse}
                          disabled={parsing}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline"
                        >
                          {parsing ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" /> Parsing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3" /> Parse with AI
                            </>
                          )}
                        </button>
                      </div>
                      <Textarea
                        placeholder="Provide a thorough overview of what you want built, architecture goals, target audience, and key deliverables..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[160px] bg-background border-border text-xs focus-visible:ring-primary font-mono"
                      />
                      <p className="text-[10px] font-mono text-muted-foreground mt-1 text-right tabular-nums">
                        {description.length} chars
                      </p>
                    </div>

                    {/* Requirements List */}
                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                        Key Requirements List
                      </label>
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          placeholder="e.g. Must support OAuth2 login and webhooks"
                          value={reqInput}
                          onChange={(e) => setReqInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addReq())}
                          className="bg-background border-border text-xs"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addReq}
                          className="shrink-0 text-xs font-mono"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-1.5">
                        {requirements.map((req, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50 text-xs text-foreground"
                          >
                            <span className="flex items-center gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                              {req}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeReq(req)}
                              className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <Card className="border-border bg-card p-6 rounded-xl shadow-sm space-y-4">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <CircleDollarSign className="w-4 h-4 text-primary" /> Budget & Timeline Terms
                    </h2>

                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                        Budget Type
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {BUDGET_TYPES.map((bt) => (
                          <button
                            key={bt}
                            type="button"
                            onClick={() => setBudgetType(bt)}
                            className={`py-2 rounded-lg text-xs font-mono border transition-all ${
                              budgetType === bt
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border bg-background text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {bt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                          Budget Min ({currency}) <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="number"
                          placeholder="5000"
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(e.target.value)}
                          className="bg-background border-border text-xs tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                          Budget Max ({currency})
                        </label>
                        <Input
                          type="number"
                          placeholder="12000"
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(e.target.value)}
                          className="bg-background border-border text-xs tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                          Estimated Timeline (weeks) <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="number"
                          placeholder="4"
                          value={timelineWeeks}
                          onChange={(e) => setTimelineWeeks(e.target.value)}
                          className="bg-background border-border text-xs tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                          Team Structure
                        </label>
                        <select
                          aria-label="Team Structure"
                          value={teamSize}
                          onChange={(e) => setTeamSize(e.target.value)}
                          className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:ring-primary"
                        >
                          {TEAM_SIZE_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setRemote(!remote)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          remote
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        <Globe className="w-4 h-4 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">Remote Work</p>
                          <p className="text-[10px] font-mono text-muted-foreground">
                            {remote ? "100% Remote Allowed" : "On-site / Hybrid"}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNdaRequired(!ndaRequired)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          ndaRequired
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        <Shield className="w-4 h-4 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">NDA Required</p>
                          <p className="text-[10px] font-mono text-muted-foreground">
                            {ndaRequired ? "Standard IP / NDA signed" : "Open scope"}
                          </p>
                        </div>
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <Card className="border-border bg-card p-6 rounded-xl shadow-sm space-y-4">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" /> Required Skills & Stack
                    </h2>

                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                        Required Skills
                      </label>
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          placeholder="e.g. Python"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                          className="bg-background border-border text-xs"
                        />
                        <Button variant="outline" size="sm" onClick={addSkill} className="shrink-0 text-xs">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="flex items-center gap-1 text-[11px] font-mono bg-muted border border-border"
                          >
                            {s}
                            <button type="button" onClick={() => removeSkill(s)}>
                              <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                        Preferred Tech Stack
                      </label>
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          placeholder="e.g. FastAPI"
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                          className="bg-background border-border text-xs"
                        />
                        <Button variant="outline" size="sm" onClick={addTech} className="shrink-0 text-xs">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {techStack.map((t) => (
                          <Badge
                            key={t}
                            variant="outline"
                            className="flex items-center gap-1 text-[11px] font-mono border-primary/30 text-primary bg-primary/5"
                          >
                            {t}
                            <button type="button" onClick={() => removeTech(t)}>
                              <X className="w-3 h-3 hover:text-destructive" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                        Complexity Tier
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {COMPLEXITY_OPTIONS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setComplexity(c)}
                            className={`py-2 rounded-lg text-xs font-mono capitalize border transition-all ${
                              complexity === c
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border bg-background text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Visibility & Featured */}
                    <div className="pt-2 border-t border-border space-y-3">
                      <div>
                        <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                          Listing Visibility
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setVisibility("public")}
                            className={`p-3 rounded-xl border text-left text-xs transition-all ${
                              visibility === "public"
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border bg-background text-muted-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" /> Public Marketplace
                            </div>
                            <p className="text-[10px] font-mono text-muted-foreground mt-1">
                              Visible to all verified builders
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setVisibility("invite-only")}
                            className={`p-3 rounded-xl border text-left text-xs transition-all ${
                              visibility === "invite-only"
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border bg-background text-muted-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <EyeOff className="w-4 h-4" /> Invite-Only
                            </div>
                            <p className="text-[10px] font-mono text-muted-foreground mt-1">
                              Only visible to invited builders
                            </p>
                          </button>
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-xs font-mono text-foreground cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span>Feature this project scope on the Marketplace header</span>
                      </label>
                    </div>
                  </Card>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <Card className="border-border bg-card p-6 rounded-xl shadow-sm space-y-4">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" /> Review Project Scope
                    </h2>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span className="font-mono text-muted-foreground">Title</span>
                        <span className="font-semibold text-foreground text-right">{title}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span className="font-mono text-muted-foreground">Category</span>
                        <span className="font-semibold text-primary">{category}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span className="font-mono text-muted-foreground">Budget</span>
                        <span className="font-mono font-bold tabular-nums text-foreground">
                          ${Number(budgetMin).toLocaleString()} – ${Number(budgetMax).toLocaleString()} {currency} ({budgetType})
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span className="font-mono text-muted-foreground">Timeline</span>
                        <span className="font-mono tabular-nums text-foreground">{timelineWeeks} weeks</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span className="font-mono text-muted-foreground">Required Skills</span>
                        <span className="font-mono text-foreground">{skills.join(", ") || "—"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span className="font-mono text-muted-foreground">Toggles</span>
                        <span className="font-mono text-foreground">
                          {remote ? "Remote" : "Onsite"} · {ndaRequired ? "NDA Required" : "No NDA"}
                        </span>
                      </div>
                    </div>

                    {parsed && (
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-primary">
                          <Sparkles className="w-4 h-4" /> AI Requirement Summary
                        </div>
                        <p className="text-muted-foreground">{parsed.core_requirement}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-4">
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 bg-primary text-primary-foreground font-semibold text-xs h-10 rounded-lg"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Publishing...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-1.5" /> Publish to Marketplace
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStep(0)}
                        className="text-xs"
                      >
                        Edit Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {step < 3 && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="text-xs font-mono"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Previous
                </Button>
                <Button size="sm" onClick={nextStep} className="text-xs font-mono bg-primary text-primary-foreground">
                  Continue <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Live Scope Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-4">
              <Card className="border-border bg-card p-5 rounded-xl shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Zap className="w-4 h-4 text-primary" />
                  <h2 className="text-xs font-semibold text-foreground">Marketplace Card Preview</h2>
                </div>

                {title ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                        {category}
                      </Badge>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">{visibility}</span>
                    </div>

                    <h3 className="font-display font-bold text-base text-foreground leading-snug">
                      {title}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {description || "No description provided yet."}
                    </p>

                    <div className="flex items-center gap-3 pt-2 text-xs font-mono tabular-nums text-foreground">
                      <span className="flex items-center gap-1 font-bold text-primary">
                        <CircleDollarSign className="w-3.5 h-3.5" />
                        ${Number(budgetMin).toLocaleString()} – ${Number(budgetMax).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" /> {timelineWeeks}w
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {skills.slice(0, 4).map((s) => (
                        <Badge key={s} variant="secondary" className="text-[9px] font-mono">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs font-mono text-muted-foreground">
                    Start typing to preview your project card
                  </div>
                )}
              </Card>

              <Card className="border-border bg-card p-4 rounded-xl shadow-sm space-y-2">
                <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" /> Founder Playbook
                </h3>
                <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>Detailed markdown specs receive 4x more qualified proposals.</li>
                  <li>Explicit budget ranges establish clear expectations upfront.</li>
                  <li>NDA requirements are automatically attached to contract invitations.</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default PostProject;
