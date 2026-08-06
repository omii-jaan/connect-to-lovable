import { Link } from "react-router-dom";
import { Anchor, Github, Twitter, MessageSquare } from "lucide-react";

export const LandingFooter = () => {
  return (
    <footer className="bg-card border-t border-border py-12 text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Anchor className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-display font-bold text-base tracking-tight text-foreground">
                Shipyards
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs text-muted-foreground">
              The professional identity platform for AI builders. Dock your products, prove your capability, land real work.
            </p>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
              Platform
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/leaderboards" className="hover:text-foreground transition-colors">Builders Leaderboard</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-foreground transition-colors">Project Marketplace</Link>
              </li>
              <li>
                <Link to="/feed" className="hover:text-foreground transition-colors">Live Activity Feed</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-foreground transition-colors">Builder Workspace</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Actions */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
              Actions
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/post-project" className="hover:text-foreground transition-colors">Post a Paid Project</Link>
              </li>
              <li>
                <Link to="/sign-up" className="hover:text-foreground transition-colors">Claim Builder Profile</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-foreground transition-colors">Sign In to Shipyards</Link>
              </li>
              <li>
                <Link to="/@demo" className="hover:text-foreground transition-colors">View Demo Profile</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
              Company
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">About Shipyards</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms" className="hover:text-foreground transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors">Contact Support</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p>© 2026 Shipyards Inc. Built for AI builders.</p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md"
              aria-label="Shipyards on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md"
              aria-label="Shipyards on X"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md"
              aria-label="Shipyards Discord Community"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;
