/**
 * Tiny pub/sub bridge so any module (including non-React code and toast
 * helpers) can push text into the single global aria-live region.
 */
export type Politeness = "polite" | "assertive";

type Listener = (message: string, politeness: Politeness) => void;

const listeners = new Set<Listener>();

export function subscribeToAnnouncements(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function announce(message: string, politeness: Politeness = "polite") {
  if (!message) return;
  listeners.forEach((listener) => listener(message, politeness));
}
