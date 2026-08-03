import { Link } from "react-router-dom";
import ProjectCard, { Project } from "./ProjectCard";
import { BlurFade } from "@/components/magicui/blur-fade";

const projects: Project[] = [
  {
    id: 1,
    title: "AI Email Reply Agent",
    description: "GPT-powered agent that reads your inbox context and drafts smart replies in your writing style. Handles 50+ emails/day autonomously.",
    builder: "Arjun Mehta",
    builderHandle: "arjun_builds",
    builderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun&backgroundColor=b6e3f4",
    category: "AI Agent",
    categoryColor: "cyan",
    stack: ["OpenAI", "Zapier", "Gmail API"],
    views: 4820,
    liveLink: "#",
    featured: true,
  },
  {
    id: 2,
    title: "LLM Customer Support SaaS",
    description: "Multi-tenant support bot that ingests company docs and handles tier-1 tickets. Currently serving 200+ companies.",
    builder: "Priya Sharma",
    builderHandle: "priya_ships",
    builderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=d1d4f9",
    category: "AI SaaS",
    categoryColor: "purple",
    stack: ["Claude", "LangChain", "Pinecone", "Stripe"],
    views: 3210,
    liveLink: "#",
    featured: false,
  },
  {
    id: 3,
    title: "WhatsApp AI Assistant",
    description: "Personal AI assistant on WhatsApp — reminders, research, content drafting. 1,400 active users in 3 weeks.",
    builder: "Dev Patel",
    builderHandle: "devpatel_ai",
    builderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=devpatel&backgroundColor=b6e3f4",
    category: "AI Automation",
    categoryColor: "green",
    stack: ["GPT-4", "Twilio", "Node.js"],
    views: 6100,
    liveLink: "#",
    featured: false,
  },
  {
    id: 4,
    title: "RAG Knowledge Base Tool",
    description: "Upload PDFs, docs, Notion pages. Ask anything. Built with a custom vector retrieval pipeline for accuracy.",
    builder: "Marcus Chen",
    builderHandle: "marcus_vibe",
    builderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus&backgroundColor=c0aede",
    category: "AI Tool",
    categoryColor: "orange",
    stack: ["GPT-4o", "Qdrant", "FastAPI"],
    views: 2890,
    liveLink: "#",
    featured: false,
  },
  {
    id: 5,
    title: "AI Content Generator SaaS",
    description: "Generates SEO blogs, social posts, and ad copy trained on top-performing content. $800 MRR in 6 weeks.",
    builder: "Sofia Reyes",
    builderHandle: "sofiaAI",
    builderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia&backgroundColor=ffd5dc",
    category: "AI SaaS",
    categoryColor: "purple",
    stack: ["OpenAI", "Supabase", "Stripe", "React"],
    views: 5430,
    liveLink: "#",
    featured: false,
  },
  {
    id: 6,
    title: "Prompt-to-App Builder",
    description: "Describe an app in plain English, get a full working React prototype deployed in 60 seconds. Vibe coding at scale.",
    builder: "Yuki Tanaka",
    builderHandle: "yuki_forge",
    builderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuki&backgroundColor=c0aede",
    category: "Dev Tool",
    categoryColor: "cyan",
    stack: ["Claude", "Deno", "Replicate"],
    views: 8900,
    liveLink: "#",
    featured: false,
  },
];

const FeaturedProjects = () => {
  return (
    <section id="projects" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,hsl(270_60%_62%_/_0.05),transparent)]" />
      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <BlurFade delay={0.1} direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-secondary-bright text-sm font-semibold uppercase tracking-widest mb-2">Live Builds</p>
              <h2 className="font-display font-bold text-h1 text-foreground">
                Products that ship. <br />
                <span className="text-muted-foreground">Not side-projects.</span>
              </h2>
            </div>
            <Link to="/projects" className="text-sm font-medium text-muted-foreground hover:text-secondary-bright transition-colors flex items-center gap-1 self-start md:self-auto">
              Browse all projects →
            </Link>
          </div>
        </BlurFade>

        {/* Grid */}
        <BlurFade delay={0.2} direction="up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  );
};

export default FeaturedProjects;
