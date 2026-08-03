import { useEffect, useState } from "react";
import { subscribeToAnnouncements, type Politeness } from "@/lib/announce";

/**
 * One pair of always-mounted live regions for the whole app. Regions must
 * exist in the DOM *before* text lands in them, otherwise screen readers
 * skip the update — which is why this renders at the app root and only the
 * text content changes.
 */
const LiveAnnouncer = () => {
  const [messages, setMessages] = useState<Record<Politeness, string>>({
    polite: "",
    assertive: "",
  });

  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements((message, politeness) => {
      // Reset first so identical consecutive messages are still announced.
      setMessages((prev) => ({ ...prev, [politeness]: "" }));
      window.setTimeout(() => {
        setMessages((prev) => ({ ...prev, [politeness]: message }));
      }, 60);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {messages.polite}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only">
        {messages.assertive}
      </div>
    </>
  );
};

export default LiveAnnouncer;
