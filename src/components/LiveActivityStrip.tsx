import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, GitCommitHorizontal, Rocket, Users } from "lucide-react";

type Metric = {
  id: string;
  label: string;
  base: number;
  drift: number;
  prefix?: string;
  icon: typeof Activity;
};

const METRICS: Metric[] = [
  { id: "online", label: "Builders online", base: 312, drift: 3, icon: Users },
  { id: "commits", label: "Commits / hour", base: 1476, drift: 9, icon: GitCommitHorizontal },
  { id: "deploys", label: "Deploys today", base: 268, drift: 1, icon: Rocket },
  { id: "escrow", label: "In escrow", base: 184300, drift: 420, prefix: "$", icon: Activity },
];

const EVENTS = [
  "@nova shipped a realtime dashboard",
  "@kai matched with a founder — $12k scope",
  "@lumen pushed 34 commits to shipyard-ui",
  "@ravi passed performance verification",
  "@mira opened a project: AI voice agent",
  "@dex deployed v2.4 to production",
];

function formatValue(metric: Metric, value: number) {
  const rounded = Math.round(value);
  return `${metric.prefix ?? ""}${Intl.NumberFormat("en-US").format(rounded)}`;
}

/**
 * Live-feeling telemetry strip: values drift on a slow interval and a single
 * event line rotates. Motion pauses entirely under prefers-reduced-motion.
 */
const LiveActivityStrip = () => {
  const [values, setValues] = useState(() => METRICS.map((m) => m.base));
  const [pulsed, setPulsed] = useState<number | null>(null);
  const [eventIndex, setEventIndex] = useState(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current) return;

    const tick = window.setInterval(() => {
      const idx = Math.floor(Math.random() * METRICS.length);
      setValues((prev) =>
        prev.map((value, i) => {
          if (i !== idx) return value;
          const metric = METRICS[i];
          const delta = Math.random() * metric.drift * (Math.random() > 0.25 ? 1 : -1);
          return Math.max(metric.base * 0.9, value + delta);
        }),
      );
      setPulsed(idx);
      window.setTimeout(() => setPulsed(null), 700);
    }, 2600);

    const rotate = window.setInterval(() => {
      setEventIndex((i) => (i + 1) % EVENTS.length);
    }, 4200);

    return () => {
      window.clearInterval(tick);
      window.clearInterval(rotate);
    };
  }, []);

  const event = useMemo(() => EVENTS[eventIndex], [eventIndex]);

  return (
    <section aria-label="Live marketplace activity" className="px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="rounded-2xl border border-border-subtle bg-surface/60 backdrop-blur-xl shadow-elev-sm overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-border-subtle">
            {METRICS.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div key={metric.id} className="px-5 py-4 flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    <Icon className="w-3 h-3" aria-hidden />
                    {metric.label}
                  </span>
                  <span
                    className={`font-display font-bold text-lg md:text-xl tabular-nums transition-colors duration-500 ease-standard ${
                      pulsed === i ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {formatValue(metric, values[i])}
                  </span>
                </div>
              );
            })}

            <div className="col-span-2 lg:col-span-1 px-5 py-4 flex flex-col gap-1.5 justify-center">
              <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-accent/60 animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-accent" />
                </span>
                Live feed
              </span>
              <span
                key={event}
                className="text-xs text-muted-foreground truncate animate-fade-in"
                aria-live="polite"
              >
                {event}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveActivityStrip;
