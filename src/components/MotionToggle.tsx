import { Gauge, Sparkles, Waves } from "lucide-react";
import { useMotionPreference, type MotionPreference } from "@/context/MotionContext";
import { announce } from "@/lib/announce";

const COPY: Record<MotionPreference, { label: string; icon: JSX.Element }> = {
  system: { label: "Motion: follows system setting", icon: <Gauge className="w-3.5 h-3.5" aria-hidden="true" /> },
  reduced: { label: "Motion: reduced", icon: <Waves className="w-3.5 h-3.5" aria-hidden="true" /> },
  full: { label: "Motion: full", icon: <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> },
};

const MotionToggle = ({ className = "" }: { className?: string }) => {
  const { preference, cyclePreference } = useMotionPreference();
  const current = COPY[preference];

  return (
    <button
      type="button"
      onClick={() => {
        cyclePreference();
        announce(`${current.label}. Changing motion preference.`);
      }}
      aria-label={`${current.label}. Activate to change.`}
      title={current.label}
      className={`min-h-11 min-w-11 md:w-8 md:h-8 md:min-h-0 md:min-w-0 rounded-full bg-foreground/5 border border-border-subtle flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors duration-200 ${className}`}
    >
      {current.icon}
    </button>
  );
};

export default MotionToggle;
