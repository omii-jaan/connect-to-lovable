import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Anchor, Menu, X, ArrowRight } from "lucide-react";
import MotionToggle from "@/components/MotionToggle";

export const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/90 backdrop-blur-md z-50 transition-colors">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand mark */}
        <Link
          to="/"
          className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
          aria-label="Shipyards Home"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Anchor className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            Shipyards
          </span>
        </Link>

        {/* Center: Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          <a
            href="#builders"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 py-0.5"
          >
            Builders
          </a>
          <Link
            to="/projects"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 py-0.5"
          >
            Projects
          </Link>
          <a
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 py-0.5"
          >
            Pricing
          </a>
          <a
            href="#blog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 py-0.5"
          >
            Blog
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          <MotionToggle />
          <Link
            to="/login"
            className="px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          >
            Sign In
          </Link>
          <Link
            to="/sign-up"
            className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md shadow-sm flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            <a
              href="#builders"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-foreground py-2 border-b border-border-subtle"
            >
              Builders
            </a>
            <Link
              to="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-foreground py-2 border-b border-border-subtle"
            >
              Projects
            </Link>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-foreground py-2 border-b border-border-subtle"
            >
              Pricing
            </a>
            <a
              href="#blog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-foreground py-2"
            >
              Blog
            </a>
          </nav>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-medium border border-border rounded-md text-foreground"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-md flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
