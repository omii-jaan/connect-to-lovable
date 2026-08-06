import { useRef } from "react";
import { FolderGit2, Zap, DollarSign } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionPreference } from "@/context/MotionContext";

const STEPS = [
  {
    num: "01",
    title: "Ship",
    badge: "Proof of Work",
    icon: FolderGit2,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
    glowColor: "rgba(20,184,166,0.5)",
    description: "Dock your deployed AI products, GitHub repos, fine-tuned models, and benchmarks in minutes with rich metadata and architecture specs.",
  },
  {
    num: "02",
    title: "Match",
    badge: "Automated Engine",
    icon: Zap,
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/20",
    glowColor: "rgba(0,242,255,0.5)",
    description: "Get matched automatically to founders and engineering leads looking for your specific AI stack expertise and past project patterns.",
  },
  {
    num: "03",
    title: "Earn",
    badge: "Verified Contracts",
    icon: DollarSign,
    color: "text-secondary",
    bgColor: "bg-secondary/10 border-secondary/20",
    glowColor: "rgba(168,85,247,0.5)",
    description: "Execute milestone contracts in secure workspace yards, build verifiable on-chain/on-platform reputation, and earn competitive rates.",
  },
];

export const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const beamHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative py-20 bg-background border-b border-border overflow-hidden" id="how-it-works">
      {/* Background canvas dots */}
      <div className="absolute inset-0 pointer-events-none bg-canvas-dots opacity-20" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 250px 0px" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-center max-w-xl mx-auto space-y-3"
        >
          <p className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
            Simple Workflow
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
            How Shipyards works
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Three simple steps from code commit to funded contract.
          </p>
        </motion.div>

        {/* Vertical Timeline Container */}
        <div ref={containerRef} className="relative space-y-12">
          
          {/* Base Track Line */}
          <div className="absolute inset-y-0 left-6 sm:left-1/2 -ml-px w-0.5 bg-border-subtle pointer-events-none" />

          {/* Animated Scroll-Driven Glowing Beam Down Track */}
          {!reduced && (
            <motion.div
              style={{ height: beamHeight }}
              className="absolute top-0 left-6 sm:left-1/2 -ml-px w-0.5 bg-gradient-to-b from-primary via-accent to-secondary shadow-[0_0_12px_#14B8A6] pointer-events-none z-0"
            />
          )}

          {/* Traveling Pulse Particle Beam */}
          {!reduced && (
            <div className="absolute inset-y-0 left-6 sm:left-1/2 -ml-[3px] w-1.5 overflow-hidden pointer-events-none z-0">
              <motion.div
                animate={{ y: ["-100%", "300%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                className="w-full h-32 bg-gradient-to-b from-transparent via-primary to-transparent rounded-full blur-[1px] shadow-[0_0_16px_#14B8A6]"
              />
            </div>
          )}

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px 250px 0px" }}
                transition={{ duration: 0.2, delay: idx * 0.03, ease: "easeOut" }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
              >
                
                {/* Glowing SVG Icon Node */}
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-primary/40 bg-card shadow-[0_0_18px_rgba(20,184,166,0.3)] shrink-0 z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] group-hover:border-primary transition-all duration-300">
                  {/* Outer animated ping ring */}
                  {!reduced && (
                    <span className="absolute inset-0 rounded-full border border-primary/40 animate-ping opacity-25 pointer-events-none" />
                  )}
                  {/* Inner glowing pulse aura */}
                  <div className={`absolute inset-0 rounded-full ${step.bgColor} opacity-70 blur-xs pointer-events-none`} />
                  
                  {/* SVG Icon with glow filter */}
                  <Icon className={`w-5 h-5 ${step.color} relative z-10 drop-shadow-[0_0_8px_rgba(20,184,166,0.8)] group-hover:scale-110 transition-transform duration-300`} />
                </div>

                {/* Content Box */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-xl border border-border-subtle bg-card p-6 space-y-3 hover:border-primary/40 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-muted-foreground uppercase tracking-wider">
                      Step {step.num}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${step.bgColor} ${step.color}`}>
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
