import { Zap, Github, Twitter, Linkedin, MessageCircle, ArrowUpRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const columns: { title: string; links: { label: string; to: string; external?: boolean }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Browse builders", to: "/#builders" },
      { label: "Browse projects", to: "/projects" },
      { label: "Post a project", to: "/post-project" },
      { label: "Discover feed", to: "/#discover" },
    ],
  },
  {
    title: "For builders",
    links: [
      { label: "Create profile", to: "/login" },
      { label: "Profile preview", to: "/profile-preview" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "How it works", to: "/#how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/#about" },
      { label: "Changelog", to: "/#changelog" },
      { label: "Careers", to: "/#careers" },
      { label: "Contact", to: "mailto:hello@shipyard.dev", external: true },
    ],
  },
];

const socials = [
  { label: "GitHub", href: "https://github.com/shipyard", icon: Github },
  { label: "Twitter", href: "https://twitter.com/shipyard", icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com/company/shipyard", icon: Linkedin },
  { label: "Discord", href: "https://discord.gg/shipyard", icon: MessageCircle },
];

const SiteFooter = () => {
  return (
    <footer className="relative border-t border-border-subtle bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-gradient-cta" aria-hidden="true" />

      <div className="container relative max-w-6xl mx-auto px-6 pt-16 pb-8">
        {/* Top: brand + newsletter */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-elev-sm">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl gradient-text-cyan">Shipyard</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The marketplace where AI builders dock, ship and get paid. Verified profiles,
              escrow-backed contracts, and proof of work that speaks for itself.
            </p>

            <form
              className="mt-6 flex w-full max-w-sm items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="you@studio.com"
                  className="h-10 pl-9 bg-card border-border-subtle"
                />
              </div>
              <Button type="submit" size="sm" className="h-10 bg-gradient-primary text-primary-foreground">
                Subscribe
              </Button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
              Weekly ship log. No noise, unsubscribe anytime.
            </p>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="lg:col-span-7 grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.to}
                          className="group inline-flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-primary"
                        >
                          {link.label}
                          <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        </a>
                      ) : (
                        <Link
                          to={link.to}
                          className="text-sm text-foreground/80 transition-colors hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-border-subtle" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-3 text-xs text-muted-foreground md:flex-row md:gap-5">
            <p>© {new Date().getFullYear()} Shipyard. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link to="/#privacy" className="transition-colors hover:text-primary">Privacy</Link>
              <Link to="/#terms" className="transition-colors hover:text-primary">Terms</Link>
              <Link to="/#security" className="transition-colors hover:text-primary">Security</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-70 animate-breathing" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              All systems operational
            </span>

            <ul className="flex items-center gap-1">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-card text-muted-foreground transition-all hover:border-primary/30 hover:text-primary hover:-translate-y-0.5"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
