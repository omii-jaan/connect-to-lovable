import { cn } from "@/lib/utils";

type SectionEyebrowProps = {
  children: React.ReactNode;
  className?: string;
  /** Center the tick + label (for centered section headers). */
  centered?: boolean;
};

/**
 * One eyebrow language for every section header: a single brand tick plus a
 * quiet mono label. Colour lives in the 6px tick, never in the words — that is
 * what keeps a dark page feeling expensive instead of neon.
 */
const SectionEyebrow = ({ children, className, centered = false }: SectionEyebrowProps) => (
  <p
    className={cn(
      "mb-4 flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-content-tertiary",
      centered && "justify-center",
      className,
    )}
  >
    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
    {children}
  </p>
);

export default SectionEyebrow;
