import { toast as sonnerToast } from "sonner";
import { announce } from "./announce";

type Options = Parameters<typeof sonnerToast>[1];

const text = (value: unknown) => (typeof value === "string" ? value : "");

const compose = (message: unknown, options?: Options, prefix = "") => {
  const description = text((options as { description?: unknown } | undefined)?.description);
  return [prefix, text(message), description].filter(Boolean).join(". ");
};

/**
 * Drop-in replacement for sonner's `toast` that also pushes the same copy
 * into the global aria-live region, so screen reader users get the feedback
 * at the moment it appears rather than only if they happen to navigate to it.
 */
export const notify = Object.assign(
  (message: string, options?: Options) => {
    announce(compose(message, options));
    return sonnerToast(message, options);
  },
  {
    success: (message: string, options?: Options) => {
      announce(compose(message, options, "Success"));
      return sonnerToast.success(message, options);
    },
    error: (message: string, options?: Options) => {
      announce(compose(message, options, "Error"), "assertive");
      return sonnerToast.error(message, options);
    },
    warning: (message: string, options?: Options) => {
      announce(compose(message, options, "Warning"), "assertive");
      return sonnerToast.warning(message, options);
    },
    info: (message: string, options?: Options) => {
      announce(compose(message, options, "Note"));
      return sonnerToast.info(message, options);
    },
    loading: (message: string, options?: Options) => {
      announce(compose(message, options, "Loading"));
      return sonnerToast.loading(message, options);
    },
    dismiss: sonnerToast.dismiss,
    promise: sonnerToast.promise,
    custom: sonnerToast.custom,
  },
);
