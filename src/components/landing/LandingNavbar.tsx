import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Anchor, Menu, X, ArrowRight, LayoutDashboard, Plus, User } from "lucide-react";
import MotionToggle from "@/components/MotionToggle";
import { useAuth } from "@/context/AuthContext";

export const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

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
          <Link
            to="/leaderboards"
            className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 py-0.5 ${
              isActive("/leaderboards") || isActive("/builders")
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Builders
          </Link>
          <Link
            to="/projects"
            className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 py-0.5 ${
              isActive("/projects")
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Projects
          </Link>
          <Link
            to="/feed"
            className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 py-0.5 ${
              isActive("/feed")
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Live Feed
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 py-0.5 ${
                isActive("/dashboard")
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          <MotionToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/post-project"
                className="px-3 py-1.5 text-xs font-mono font-medium border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-md flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Post Project
              </Link>
              <Link
                to="/dashboard"
                className="px-3.5 py-1.5 text-sm font-medium bg-card border border-border text-foreground hover:bg-muted transition-colors rounded-md flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-primary" />
                <span>Dashboard</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
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
          )}
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
            <Link
              to="/leaderboards"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-foreground py-2 border-b border-border-subtle flex items-center justify-between"
            >
              <span>Builders</span>
            </Link>
            <Link
              to="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-foreground py-2 border-b border-border-subtle flex items-center justify-between"
            >
              <span>Projects</span>
            </Link>
            <Link
              to="/feed"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-foreground py-2 border-b border-border-subtle flex items-center justify-between"
            >
              <span>Live Feed</span>
            </Link>
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-foreground py-2 border-b border-border-subtle"
              >
                Dashboard
              </Link>
            )}
          </nav>
          <div className="pt-2 flex flex-col gap-2.5">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-md flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
