import { useState } from "react";
import { cn } from "@/lib/utils";
import { monogram, resolveBrand } from "@/lib/brand-domains";

const LOGO_TOKEN = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY as
  | string
  | undefined;

type BrandMarkProps = {
  /** Raw tech-stack tag, e.g. "Claude API". */
  name: string;
  /** Rendered box size in px. */
  size?: number;
  className?: string;
};

/**
 * A single brand mark. Real logo when the tag maps to a known company,
 * otherwise a quiet typographic monogram — never a fake or mismatched logo.
 * Decorative by contract: the adjacent label carries the accessible name.
 */
const BrandMark = ({ name, size = 14, className }: BrandMarkProps) => {
  const { domain } = resolveBrand(name);
  const [failed, setFailed] = useState(false);

  const showLogo = Boolean(domain) && Boolean(LOGO_TOKEN) && !failed;

  if (!showLogo) {
    return (
      <span
        aria-hidden="true"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-[3px] bg-foreground/8 font-mono font-semibold leading-none text-text-tertiary",
          className,
        )}
      >
        {monogram(name)}
      </span>
    );
  }

  return (
    <img
      src={`https://img.logo.dev/${domain}?token=${LOGO_TOKEN}&size=64&format=png&retina=true&fallback=404`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className={cn("inline-block shrink-0 rounded-[3px] object-contain", className)}
    />
  );
};

export default BrandMark;
