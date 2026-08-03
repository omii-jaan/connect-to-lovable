import BrandMark from "@/components/BrandMark";
import { cn } from "@/lib/utils";
import { resolveBrand } from "@/lib/brand-domains";

type Size = "xs" | "sm" | "md";

const sizeStyles: Record<Size, { chip: string; logo: number }> = {
  xs: { chip: "px-1.5 py-0.5 text-[9px] gap-1", logo: 11 },
  sm: { chip: "px-2 py-0.5 text-[10px] gap-1.5", logo: 13 },
  md: { chip: "px-2.5 py-1 text-[11px] gap-1.5", logo: 15 },
};

type TechBadgeProps = {
  name: string;
  size?: Size;
  className?: string;
};

/**
 * Canonical stack chip: logo + canonical label. One component so every surface
 * (cards, dialogs, profiles, feed) reads identically.
 */
const TechBadge = ({ name, size = "sm", className }: TechBadgeProps) => {
  const { label } = resolveBrand(name);
  const s = sizeStyles[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border-subtle bg-foreground/5 font-mono leading-none text-foreground transition-colors duration-micro ease-standard hover:border-border-strong",
        s.chip,
        className,
      )}
    >
      <BrandMark name={name} size={s.logo} />
      {label}
    </span>
  );
};

export default TechBadge;
