import { Marquee } from "@/components/magicui/marquee";
import { BlurFade } from "@/components/magicui/blur-fade";

const tools = [
  { name: "OpenAI", gradient: "from-emerald-400 to-cyan-400" },
  { name: "Supabase", gradient: "from-amber-400 to-orange-400" },
  { name: "Vercel", gradient: "from-zinc-100 to-zinc-300" },
  { name: "Stripe", gradient: "from-indigo-400 to-purple-400" },
  { name: "LangChain", gradient: "from-green-400 to-teal-400" },
  { name: "Anthropic", gradient: "from-yellow-400 to-amber-400" },
  { name: "Pinecone", gradient: "from-sky-400 to-blue-400" },
  { name: "Next.js", gradient: "from-zinc-100 to-zinc-300" },
  { name: "Claude", gradient: "from-orange-400 to-red-400" },
  { name: "Node.js", gradient: "from-lime-400 to-green-400" },
];

const MarqueeSection = () => {
  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <BlurFade delay={0.1} direction="up">
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
              Trusted by builders using
            </p>
          </div>
        </BlurFade>
        <BlurFade delay={0.2} direction="up">
          <Marquee pauseOnHover repeat={3} className="[--duration:30s]">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="mx-4 px-5 py-2.5 rounded-full border border-border-subtle bg-card text-sm font-bold"
            >
              <span className={`bg-gradient-to-r ${tool.gradient} bg-clip-text text-transparent`}>
                {tool.name}
              </span>
            </div>
          ))}
        </Marquee>
        </BlurFade>
      </div>
    </section>
  );
};

export default MarqueeSection;
