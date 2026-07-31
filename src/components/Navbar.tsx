import { Zap, X, Menu, LogOut, User, FolderGit2, LayoutDashboard, Sun, Moon, Monitor, Bell, Search, ChevronRight, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = ["builders", "projects", "hire", "discover"];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);
  const { user, signOut, loading } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || user?.user_metadata?.user_name || "Builder";
  const userRole = user?.user_metadata?.role || "Builder";

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    setOpen(false);
    navigate("/");
  };

  const cycleTheme = () => {
    const order: Array<"dark" | "light" | "system"> = ["dark", "light", "system"];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const themeIcon = theme === "light" ? <Sun className="w-3.5 h-3.5" /> : theme === "dark" ? <Moon className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key === "Escape") {
        setCmdOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 transition-all duration-300">
      <nav className="px-6 py-3.5 rounded-full border border-foreground/10 bg-card/60 backdrop-blur-xl flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {/* Logo and Live Indicator */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center glow-cyan">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-black text-xl tracking-wider gradient-text-cyan">SHIPYARD</span>
          </Link>
          
          {/* Live Online Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            2,482 Live
          </div>
        </div>

        {/* Desktop Nav links */}
        <div className="hidden md:flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          {[
            { id: "builders", label: "Builders" },
            { id: "projects", label: "Projects" },
            { id: "hire", label: "Hire" },
            { id: "discover", label: "Discover" },
          ].map((link) => (
            <a
              key={link.label}
              href={`#${link.id}`}
              className={`relative px-3 py-2 transition-colors duration-200 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-primary after:rounded-full after:transition-all after:duration-300 ${
                link.id && activeSection === link.id
                  ? "text-primary text-glow-cyan after:w-4/5"
                  : "text-muted-foreground hover:text-primary hover:text-glow-cyan after:w-0 hover:after:w-4/5"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA & Sign In */}
        <div className="hidden md:flex items-center gap-2">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setCmdOpen(true)}
            className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-200"
            title="Search (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={cycleTheme}
            className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-200"
            title={`Theme: ${theme}`}
          >
            {themeIcon}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-200"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary text-[7px] font-bold text-primary-foreground flex items-center justify-center">3</span>
            </button>

            {/* Notifications Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-foreground/10 bg-card/95 backdrop-blur-2xl shadow-2xl py-3 animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-4 pb-2 border-b border-foreground/10">
                  <p className="text-xs font-bold text-foreground">Notifications</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {[
                    { icon: User, text: "New builder matched: Arjun Mehta (98% vibe)", time: "2m ago", color: "text-primary" },
                    { icon: FolderGit2, text: "AI Dashboard Integration milestone approved", time: "1h ago", color: "text-accent" },
                    { icon: Star, text: "Project starred: Multi-Agent Pipeline", time: "3h ago", color: "text-secondary" },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-foreground/5 transition-colors cursor-pointer">
                      <div className={`w-7 h-7 rounded-lg bg-foreground/5 border border-foreground/10 flex items-center justify-center shrink-0 ${n.color}`}>
                        <n.icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-foreground leading-relaxed">{n.text}</p>
                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-foreground/10 px-4 py-2">
                  <button className="text-[10px] font-mono text-primary hover:text-primary/80 transition-colors">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-foreground/10 mx-1" />

          {loading ? (
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata.full_name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {userName}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                    {userRole}
                  </span>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-foreground/10 bg-card/95 backdrop-blur-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="px-4 pb-2 border-b border-foreground/10 mb-1">
                    <p className="text-sm font-semibold text-foreground">{userName}</p>
                    <p className="text-[10px] font-mono text-primary">{`> ${userRole.toLowerCase()} --online`}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-primary/10">
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-primary/10">
                    <FolderGit2 className="w-4 h-4 text-secondary" />
                    My Ships
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-primary/10">
                    <User className="w-4 h-4 text-accent" />
                    Profile
                  </Link>
                  <hr className="border-foreground/10 my-1" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold glow-cyan hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Join as Builder
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button 
          className="md:hidden w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setOpen(!open)}
        >
          <Menu className="w-4 h-4" />
        </button>
      </nav>

      {/* Mobile Terminal Panel */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-300 md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[82vw] max-w-sm bg-card border-l border-foreground/10 shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-3.5 border-b border-foreground/10 bg-[#111622]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-[11px] font-mono text-muted-foreground ml-2.5">~/shipyard</span>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User info */}
          {user && (
            <div className="flex items-center gap-3 px-4 py-3 border-b border-foreground/5 bg-card/[0.02]">
              <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={userName}
                    className="w-9 h-9 rounded-full"
                  />
                ) : (
                  <User className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{userName}</div>
                <div className="text-[10px] font-mono text-primary">{`> ${userRole.toLowerCase()} --online`}</div>
              </div>
            </div>
          )}

          {/* Terminal navigation items */}
          <div className="flex flex-col py-3">
            <div className="px-4 py-1.5 text-[10px] font-mono text-muted-foreground/50"># navigation</div>
            <button
              onClick={() => { setOpen(false); document.getElementById("builders")?.scrollIntoView({ behavior: "smooth" }); }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 transition-colors group"
            >
              <span className="text-muted-foreground font-mono text-xs">{`>`}</span>
              <span className="flex-1">cd builders</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            {[
              { href: "#builders", label: "Builders" },
              { href: "#projects", label: "Projects" },
              { href: "#hire", label: "Hire" },
              { href: "#discover", label: "Discover" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors group ml-7"
              >
                <span className="text-[10px] font-mono">#/</span>
                {link.label}
              </a>
            ))}

            <div className="h-px bg-foreground/5 my-2 mx-4" />

            <div className="px-4 py-1.5 text-[10px] font-mono text-muted-foreground/50"># user</div>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 transition-colors group"
                >
                  <span className="text-muted-foreground font-mono text-xs">{`>`}</span>
                  <span className="flex-1">dashboard --open</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors group"
                >
                  <span className="text-destructive/60 font-mono text-xs">{`>`}</span>
                  <span className="flex-1">signout --force</span>
                  <ChevronRight className="w-3 h-3 text-destructive/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 transition-colors group"
                >
                  <span className="text-muted-foreground font-mono text-xs">{`>`}</span>
                  <span className="flex-1">auth --login</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 transition-colors group"
                >
                  <span className="text-primary font-mono text-xs">{`>`}</span>
                  <span className="flex-1 text-primary">join --as builder</span>
                  <ChevronRight className="w-3 h-3 text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </>
            )}
          </div>

          {/* Bottom status bar */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2.5 border-t border-foreground/5 bg-[#111622] flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground/50">{`[~] $`}</span>
            <span className="text-[10px] font-mono text-muted-foreground/50">
              {theme} mode
            </span>
          </div>
        </div>
      </div>

      {/* Command Palette Modal */}
      {cmdOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]" onClick={() => setCmdOpen(false)}>
          <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg rounded-2xl border border-foreground/10 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-foreground/10">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search builders, projects, commands..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none border-none"
              />
              <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-foreground/10 text-muted-foreground font-mono">ESC</kbd>
            </div>
            <div className="py-2 max-h-64 overflow-y-auto">
              <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Navigate</div>
              <button onClick={() => { setCmdOpen(false); navigate("/dashboard"); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors">
                <LayoutDashboard className="w-4 h-4 text-primary" />
                <span>Dashboard</span>
              </button>
              <button onClick={() => { setCmdOpen(false); navigate("/dashboard"); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors">
                <User className="w-4 h-4 text-secondary" />
                <span>Profile</span>
              </button>
              <button onClick={() => { setCmdOpen(false); navigate("/dashboard"); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors">
                <FolderGit2 className="w-4 h-4 text-accent" />
                <span>My Ships</span>
              </button>
              <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1 border-t border-foreground/5">Pages</div>
              <button onClick={() => { setCmdOpen(false); navigate("/"); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors">
                <Zap className="w-4 h-4 text-primary" />
                <span>Landing</span>
              </button>
              <button onClick={() => { setCmdOpen(false); window.location.href = "#builders"; }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span>Builders</span>
              </button>
              <button onClick={() => { setCmdOpen(false); window.location.href = "#projects"; }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span>Projects</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
