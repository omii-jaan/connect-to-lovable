import { Link } from "react-router-dom";
import BuilderCard, { Builder } from "./BuilderCard";
import { BlurFade } from "@/components/magicui/blur-fade";
import SectionEyebrow from "@/components/SectionEyebrow";

const builders: Builder[] = [
  {
    id: 1,
    name: "Arjun Mehta",
    handle: "@arjun_builds",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun&backgroundColor=b6e3f4",
    bio: "Full-stack AI builder. Shipped 12+ AI products including customer support bots and autonomous agents.",
    stack: ["OpenAI", "LangChain", "Supabase", "Next.js"],
    projects: 12,
    stars: 342,
    badge: "Top Builder",
    badgeColor: "cyan",
  },
  {
    id: 2,
    name: "Priya Sharma",
    handle: "@priya_ships",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=d1d4f9",
    bio: "AI automation wizard. Builds complex multi-agent pipelines and LLM-powered SaaS tools.",
    stack: ["Claude", "LangGraph", "Pinecone", "FastAPI"],
    projects: 9,
    stars: 218,
    badge: "Automation Pro",
    badgeColor: "purple",
  },
  {
    id: 3,
    name: "Marcus Chen",
    handle: "@marcus_vibe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus&backgroundColor=c0aede",
    bio: "Ex-ML engineer turned indie builder. Specializes in RAG pipelines, vector search and AI agents.",
    stack: ["GPT-4o", "Qdrant", "Python", "Vercel AI"],
    projects: 7,
    stars: 187,
    badge: "AI Agent Dev",
    badgeColor: "green",
  },
  {
    id: 4,
    name: "Sofia Reyes",
    handle: "@sofiaAI",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia&backgroundColor=ffd5dc",
    bio: "Building AI wrappers that actually get used. Shipped 3 SaaS tools with paying customers.",
    stack: ["OpenAI", "Stripe", "Supabase", "React"],
    projects: 6,
    stars: 156,
    badge: "SaaS Builder",
    badgeColor: "cyan",
  },
  {
    id: 5,
    name: "Dev Patel",
    handle: "@devpatel_ai",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=devpatel&backgroundColor=b6e3f4",
    bio: "WhatsApp AI bots and voice agents. Building AI that reaches users on platforms they already use.",
    stack: ["Twilio", "Whisper", "GPT-4", "Node.js"],
    projects: 8,
    stars: 203,
    badge: "Voice AI Dev",
    badgeColor: "purple",
  },
  {
    id: 6,
    name: "Yuki Tanaka",
    handle: "@yuki_forge",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuki&backgroundColor=c0aede",
    bio: "Prompt engineer turned full-stack builder. Turned prompts into products people pay for.",
    stack: ["Anthropic", "Deno", "Replicate", "Tailwind"],
    projects: 5,
    stars: 132,
    badge: "Prompt Wizard",
    badgeColor: "green",
  },
];

const FeaturedBuilders = () => {
  return (
    <section id="builders" className="py-16 md:py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <BlurFade delay={0.1} direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <SectionEyebrow>Docked at Shipyard</SectionEyebrow>
              <h2 className="font-display font-bold text-h1 text-foreground">
                Proof over resumes. <br />
                <span className="text-content-tertiary">Real ships, real builders.</span>
              </h2>
            </div>
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 self-start md:self-auto">
              View all builders →
            </Link>
          </div>
        </BlurFade>

        {/* Grid */}
        <BlurFade delay={0.2} direction="up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {builders.map((builder) => (
              <BuilderCard key={builder.id} builder={builder} />
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  );
};

export default FeaturedBuilders;
