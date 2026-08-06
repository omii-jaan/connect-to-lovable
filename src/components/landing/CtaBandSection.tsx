import { useState, FormEvent } from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { submitToWaitlist } from "@/lib/waitlist";
import { notify as toast } from "@/lib/notify";

export const CtaBandSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const res = await submitToWaitlist(email);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      setEmail("");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <section className="relative py-20 bg-background border-b border-border px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background canvas dots */}
      <div className="absolute inset-0 pointer-events-none bg-canvas-dots opacity-20" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px 250px 0px" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/10 blur-3xl pointer-events-none rounded-full" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-medium text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Early Access</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
            Ready to ship?
          </h2>

          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            Join 2,500+ AI engineers and builders claiming their identity and landing direct contracts on Shipyards.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5 pt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email..."
              required
              disabled={loading}
              className="flex-1 h-11 px-4 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-11 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Start shipping</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] font-mono text-muted-foreground pt-1">
            Free forever for individual builders. No credit card required.
          </p>

        </motion.div>
      </div>
    </section>
  );
};

export default CtaBandSection;
