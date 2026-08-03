import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Send, Sparkles, X, Plus, Loader2, Eye, EyeOff,
  Zap, Check, CircleDollarSign, Clock, Target, BarChart3, Briefcase,
  ChevronRight, AlertCircle, CheckCircle, ChevronDown, Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { AIParsedRequirements } from "@/types";
import { CATEGORIES } from "@/lib/marketplace-data";

const SCOPE_OPTIONS = ["small", "medium", "large"] as const;
const COMPLEXITY_OPTIONS = ["low", "medium", "high"] as const;
const STEPS = ["Basics", "Budget & Scope", "Skills & Success", "Review"];

const PostProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [timelineWeeks, setTimelineWeeks] = useState("");
  const [category, setCategory] = useState("");
  const [scope, setScope] = useState<string>("medium");
  const [complexity, setComplexity] = useState<string>("medium");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [successCriteria, setSuccessCriteria] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<AIParsedRequirements | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const addSkill = () => { const s = skillInput.trim(); if (s && !skills.includes(s)) setSkills([...skills, s]); setSkillInput(""); };
  const removeSkill = (s: string) => setSkills(skills.filter((x) => x !== s));
  const addTech = () => { const t = techInput.trim(); if (t && !techStack.includes(t)) setTechStack([...techStack, t]); setTechInput(""); };
  const removeTech = (t: string) => setTechStack(techStack.filter((x) => x !== t));

  const handleAiParse = async () => {
    if (!description.trim()) { toast.error("Write a project description first"); return; }
    setParsing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setParsed({
      core_requirement: description.length > 100 ? description.split(".")[0] + "." : "AI-powered solution with API integrations",
      integrations: ["Slack", "Intercom"],
      tech_stack: ["Claude API", "Python", "PostgreSQL"],
      complexity: description.length > 300 ? "high" : "medium",
      ideal_builder_type: "Full-stack AI engineer",
    });
    setParsing(false);
    toast.success("AI parsed your requirements!", { duration: 3000 });
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) { toast.error("Title and description are required"); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Project published successfully!", { duration: 4000 });
    setSubmitting(false);
    navigate("/projects");
  };

  const canProceed = (s: number) => {
    if (s === 0) return title.trim() && description.trim();
    if (s === 1) return budgetMin && budgetMax && timelineWeeks && category;
    if (s === 2) return true;
    return true;
  };

  const nextStep = () => { if (canProceed(step)) setStep(Math.min(step + 1, 3)); else toast.error("Please fill in all required fields"); };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none h-48" />

        <div className="max-w-4xl mx-auto px-4 py-8 relative">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/projects" className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">Post a Project</h1>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">Get matched with the perfect builder</p>
            </div>
          </div>

          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1">
                <button
                  type="button"
                  aria-current={i === step ? "step" : undefined}
                  aria-disabled={i > step}
                  onClick={() => i <= step && setStep(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                    i === step ? "bg-primary/10 text-primary border border-primary/20" :
                    i < step ? "text-accent/60" :
                    "text-muted-foreground/30 cursor-default"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    i === step ? "bg-primary text-primary-foreground" :
                    i < step ? "bg-accent/20 text-accent" :
                    "bg-muted text-muted-foreground/40"
                  }`}>
                    {i < step ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${i < step ? "bg-accent/30" : "bg-border/30"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                    <Card className="border-border-subtle bg-card shadow-elev-sm p-6">
                      <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" /> Basic Information
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Project Title <span className="text-destructive">*</span></label>
                          <Input
                            placeholder="e.g. AI Customer Support Chatbot"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-background/80 border-border/50 focus:border-primary/40 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                            Description <span className="text-destructive">*</span>
                            <button
                              onClick={handleAiParse}
                              disabled={parsing}
                              className="ml-2 inline-flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors font-mono"
                            >
                              {parsing ? (
                                <><Loader2 className="w-3 h-3 animate-spin" /> Parsing...</>
                              ) : (
                                <><Sparkles className="w-3 h-3" /> Parse with AI</>
                              )}
                            </button>
                          </label>
                          <Textarea
                            placeholder="Describe what you need built in detail. What's the goal? Who's it for? What problems does it solve?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[180px] bg-background/80 border-border/50 focus:border-primary/40 transition-colors"
                          />
                          <p className="text-[9px] font-mono text-muted-foreground/40 mt-1.5 text-right">{description.length} chars</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                    <Card className="border-border-subtle bg-card shadow-elev-sm p-6">
                      <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <CircleDollarSign className="w-4 h-4 text-accent" /> Budget & Timeline
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Budget Min ($) <span className="text-destructive">*</span></label>
                          <Input type="number" placeholder="5000" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} className="bg-background/80 border-border/50" />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Budget Max ($) <span className="text-destructive">*</span></label>
                          <Input type="number" placeholder="12000" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} className="bg-background/80 border-border/50" />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Timeline (weeks) <span className="text-destructive">*</span></label>
                          <Input type="number" placeholder="4" value={timelineWeeks} onChange={(e) => setTimelineWeeks(e.target.value)} className="bg-background/80 border-border/50" />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Category <span className="text-destructive">*</span></label>
                          <select value={category} onChange={(e) => setCategory(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-border/50 bg-background/80 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                            <option value="">Select category</option>
                            {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Scope</label>
                          <div className="flex gap-2">
                            {SCOPE_OPTIONS.map((s) => (
                              <button key={s} onClick={() => setScope(s)}
                                className={`flex-1 py-2 rounded-lg text-xs font-mono border transition-all ${
                                  scope === s ? "border-primary/30 bg-primary/10 text-primary" : "border-border/50 bg-background/80 text-muted-foreground hover:border-border"
                                }`}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Complexity</label>
                          <div className="flex gap-2">
                            {COMPLEXITY_OPTIONS.map((c) => (
                              <button key={c} onClick={() => setComplexity(c)}
                                className={`flex-1 py-2 rounded-lg text-xs font-mono border transition-all ${
                                  complexity === c ? "border-primary/30 bg-primary/10 text-primary" : "border-border/50 bg-background/80 text-muted-foreground hover:border-border"
                                }`}>
                                {c.charAt(0).toUpperCase() + c.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                    <Card className="border-border-subtle bg-card shadow-elev-sm p-6">
                      <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4 text-secondary" /> Skills & Success Criteria
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Required Skills</label>
                          <div className="flex items-center gap-2 mb-2">
                            <Input placeholder="e.g. Python" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                              className="bg-background/80 border-border/50" />
                            <Button variant="outline" size="icon" onClick={addSkill} aria-label="Add skill" className="shrink-0 min-h-11 min-w-11"><Plus className="w-4 h-4" aria-hidden="true" /></Button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {skills.map((s) => (
                              <Badge key={s} variant="secondary" className="flex items-center gap-1 text-[10px] font-mono bg-background/80 border border-border/30">
                                {s}
                                <button type="button" onClick={() => removeSkill(s)} aria-label={`Remove skill ${s}`} className="hover:text-destructive transition-colors"><X className="w-3 h-3" aria-hidden="true" /></button>
                              </Badge>
                            ))}
                            {skills.length === 0 && <span className="text-[10px] font-mono text-muted-foreground/40">Add skills to improve matching</span>}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Preferred Tech Stack</label>
                          <div className="flex items-center gap-2 mb-2">
                            <Input placeholder="e.g. FastAPI" value={techInput} onChange={(e) => setTechInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                              className="bg-background/80 border-border/50" />
                            <Button variant="outline" size="icon" onClick={addTech} aria-label="Add technology" className="shrink-0 min-h-11 min-w-11"><Plus className="w-4 h-4" aria-hidden="true" /></Button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {techStack.map((t) => (
                              <Badge key={t} variant="outline" className="flex items-center gap-1 text-[10px] font-mono border-primary/30 bg-primary/[0.04] text-primary/90">
                                {t}
                                <button type="button" onClick={() => removeTech(t)} aria-label={`Remove technology ${t}`} className="hover:text-destructive transition-colors"><X className="w-3 h-3" aria-hidden="true" /></button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Success Criteria</label>
                          <Textarea placeholder="How will you measure success? What are the must-have deliverables?"
                            value={successCriteria} onChange={(e) => setSuccessCriteria(e.target.value)}
                            className="min-h-[100px] bg-background/80 border-border/50" />
                        </div>
                      </div>
                    </Card>

                    <Card className="border-border-subtle bg-card shadow-elev-sm p-6">
                      <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-muted-foreground" /> Visibility
                      </h2>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setVisibility("public")}
                          className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                            visibility === "public" ? "border-primary/30 bg-primary/10 text-primary" : "border-border/50 bg-background/80 text-muted-foreground hover:border-primary/20"
                          }`}>
                          <Eye className="w-4 h-4" />
                          <div className="text-left">
                            <p className="text-sm font-medium">Public</p>
                            <p className="text-[9px] font-mono text-muted-foreground/60">Visible to all builders</p>
                          </div>
                        </button>
                        <button onClick={() => setVisibility("private")}
                          className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                            visibility === "private" ? "border-primary/30 bg-primary/10 text-primary" : "border-border/50 bg-background/80 text-muted-foreground hover:border-primary/20"
                          }`}>
                          <EyeOff className="w-4 h-4" />
                          <div className="text-left">
                            <p className="text-sm font-medium">Private</p>
                            <p className="text-[9px] font-mono text-muted-foreground/60">Invite-only</p>
                          </div>
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                    <Card className="border-border-subtle bg-card shadow-elev-sm p-6">
                      <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-accent" /> Review & Publish
                      </h2>
                      <div className="space-y-3">
                        {[
                          { label: "Title", value: title },
                          { label: "Description", value: description.length > 100 ? description.slice(0, 100) + "..." : description },
                          { label: "Budget", value: budgetMin && budgetMax ? `$${parseInt(budgetMin).toLocaleString()} – $${parseInt(budgetMax).toLocaleString()}` : "—" },
                          { label: "Timeline", value: timelineWeeks ? `${timelineWeeks} weeks` : "—" },
                          { label: "Category", value: category || "—" },
                          { label: "Skills", value: skills.length ? skills.join(", ") : "—" },
                          { label: "Visibility", value: visibility },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                            <span className="text-[10px] font-mono text-muted-foreground/60">{item.label}</span>
                            <span className="text-xs text-foreground/80 text-right max-w-[60%] truncate">{item.value || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {parsed && (
                      <Card className="border-primary/30 bg-gradient-to-br from-primary/[0.04] to-primary/[0.01] p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <h2 className="text-sm font-semibold text-primary">AI Requirements</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="col-span-2">
                            <p className="text-[9px] font-mono text-muted-foreground/60">Core</p>
                            <p className="text-foreground/90 mt-0.5">{parsed.core_requirement}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono text-muted-foreground/60">Integrations</p>
                            <p className="text-foreground/90 mt-0.5">{parsed.integrations.join(", ")}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono text-muted-foreground/60">Ideal Builder</p>
                            <p className="text-foreground/90 mt-0.5">{parsed.ideal_builder_type}</p>
                          </div>
                        </div>
                      </Card>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        className="flex-1 bg-gradient-primary text-primary-foreground font-bold text-xs glow-cyan hover:brightness-110 transition-all h-10"
                        disabled={submitting}
                        onClick={handleSubmit}
                      >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {submitting ? "Publishing..." : "Publish Project"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setStep(0)} className="text-xs">
                        Edit
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {step < 3 && (
                <div className="flex items-center justify-between mt-6">
                  <Button variant="ghost" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="text-xs">
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                  </Button>
                  <Button size="sm" onClick={nextStep} className="text-xs">
                    Continue <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-8 space-y-4">
                <Card className="border-border-subtle bg-card shadow-elev-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground">Live Preview</h2>
                  </div>
                  <AnimatePresence mode="wait">
                    {title ? (
                      <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        <h3 className="font-display font-bold text-lg text-foreground">{title}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 flex-wrap">
                          {budgetMin && budgetMax && <span className="flex items-center gap-1"><CircleDollarSign className="w-3 h-3 text-accent" /> ${parseInt(budgetMin).toLocaleString()} – ${parseInt(budgetMax).toLocaleString()}</span>}
                          {timelineWeeks && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timelineWeeks} weeks</span>}
                          {category && <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {category}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-4">{description || "No description yet"}</p>
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {skills.slice(0, 4).map((s) => <Badge key={s} variant="secondary" className="text-[9px] font-mono">{s}</Badge>)}
                            {skills.length > 4 && <span className="text-[9px] font-mono text-muted-foreground/40">+{skills.length - 4}</span>}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-border/30 text-[9px] font-mono text-muted-foreground/40">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 0 views</span>
                          <span>{visibility === "public" ? "Public" : "Private"}</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 text-center">
                        <div className="w-10 h-10 rounded-xl bg-muted border border-border/30 flex items-center justify-center mx-auto mb-3">
                          <EyeOff className="w-4 h-4 text-muted-foreground/40" />
                        </div>
                        <p className="text-xs text-muted-foreground/60">Fill in the form to see a live preview</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                <Card className="border-border-subtle bg-card shadow-elev-sm p-5">
                  <h2 className="text-xs font-semibold text-foreground mb-3">Tips</h2>
                  <ul className="space-y-2">
                    {[
                      { icon: Sparkles, text: "Use AI Parse for better matching" },
                      { icon: CircleDollarSign, text: "Realistic budgets get 3x responses" },
                      { icon: Target, text: "Clear success criteria = smooth delivery" },
                      { icon: BarChart3, text: "Tag skills to improve AI matching" },
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-[10px] font-mono text-muted-foreground/70">
                        <tip.icon className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                        {tip.text}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProject;
