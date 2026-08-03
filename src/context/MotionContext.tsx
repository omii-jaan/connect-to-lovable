import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type MotionPreference = "system" | "full" | "reduced";

interface MotionContextValue {
  /** The user's stored choice. */
  preference: MotionPreference;
  /** What is actually applied right now, after resolving "system". */
  reduced: boolean;
  setPreference: (preference: MotionPreference) => void;
  /** Cycles system → reduced → full → system. */
  cyclePreference: () => void;
}

const STORAGE_KEY = "shipyard-motion";
const MotionCtx = createContext<MotionContextValue | undefined>(undefined);

const ORDER: MotionPreference[] = ["system", "reduced", "full"];

export function MotionProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<MotionPreference>("system");
  const [systemReduced, setSystemReduced] = useState(false);

  // Hydrate the stored preference once.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as MotionPreference | null;
    if (stored && ORDER.includes(stored)) setPreferenceState(stored);
  }, []);

  // Track the OS-level setting so "system" stays honest.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSystemReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const reduced = preference === "system" ? systemReduced : preference === "reduced";

  // A single attribute on <html> drives every motion rule in the stylesheet.
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
    localStorage.setItem(STORAGE_KEY, preference);
  }, [reduced, preference]);

  const value = useMemo<MotionContextValue>(
    () => ({
      preference,
      reduced,
      setPreference: setPreferenceState,
      cyclePreference: () =>
        setPreferenceState((current) => ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]),
    }),
    [preference, reduced],
  );

  return <MotionCtx.Provider value={value}>{children}</MotionCtx.Provider>;
}

export function useMotionPreference() {
  const context = useContext(MotionCtx);
  if (!context) throw new Error("useMotionPreference must be used within a MotionProvider");
  return context;
}
