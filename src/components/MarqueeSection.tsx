import { Marquee } from "@/components/magicui/marquee";
import { BlurFade } from "@/components/magicui/blur-fade";

const tools = [
  "OpenAI",
  "Supabase",
  "Vercel",
  "Stripe",
  "LangChain",
  "Anthropic",
  "Pinecone",
  "Next.js",
  "Claude",
  "Node.js",
];

const MarqueeSection = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <BlurFade delay={0.1} direction="up">
          <div className="text-center mb-10">
            <p className="text-text-tertiary text-[10px] font-medium uppercase tracking-[0.28em]">
              Trusted by builders using
            </p>
          </div>
        </BlurFade>
        <BlurFade delay={0.2} direction="up">
          <div className="relative">
            <Marquee pauseOnHover repeat={3} className="[--duration:44s]">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="mx-8 text-lg font-display font-semibold tracking-[-0.02em] text-text-tertiary transition-colors duration-micro ease-standard hover:text-foreground"
                >
                  {tool}
                </span>
              ))}
            </Marquee>
            {/* Edge fades keep the strip from ending abruptly */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
          </div>
        </BlurFade>
      </div>
    </section>
  );
};

export default MarqueeSection;

