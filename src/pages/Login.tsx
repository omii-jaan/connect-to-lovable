import { FormEvent, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Github, Lock, Mail, Terminal, Zap } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const TYPING_SPEED = 25;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("awaiting credentials");
  const [errorMsg, setErrorMsg] = useState("");
  const [logLines, setLogLines] = useState<string[]>([
    "> session.init()",
    "> tls.handshake() · OK",
    "> awaiting authentication...",
  ]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const { signInWithGithub, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logLines]);

  const addLog = (line: string) => {
    setLogLines((prev) => [...prev, line]);
  };

  const simulateTyping = async (text: string, cb: () => void) => {
    const chars = text.split("");
    let current = "";
    for (const c of chars) {
      await new Promise((r) => setTimeout(r, TYPING_SPEED));
      current += c;
      setStatusText(current);
    }
    cb();
  };

  const simulateProgress = async (duration: number) => {
    const steps = 20;
    const interval = duration / steps;
    for (let i = 1; i <= steps; i++) {
      await new Promise((r) => setTimeout(r, interval));
      setProgress(Math.min(Math.round((i / steps) * 100), 100));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("✗ ERROR: email and password required");
      addLog("✗ ERROR: email and password required");
      return;
    }

    setLoading(true);
    setProgress(0);
    addLog(`> auth.email("${email}")`);
    await simulateTyping("validating credentials...", () => {});
    addLog("# validating credentials...");
    await simulateProgress(900);
    setLoading(false);
    addLog("✗ ERROR: email/password auth not implemented");
    toast.error("Use GitHub or Google for now.");
    setStatusText("auth failed");
  };

  const handleGithub = async () => {
    setLoading(true);
    setProgress(0);
    addLog("> github.auth()");
    await simulateTyping("redirecting to GitHub...", () => {});
    addLog("# redirecting to GitHub...");
    await simulateProgress(600);
    setStatusText("docking via GitHub");
    await signInWithGithub();
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setProgress(0);
    addLog("> google.auth()");
    await simulateTyping("redirecting to Google...", () => {});
    addLog("# redirecting to Google...");
    await simulateProgress(600);
    setStatusText("docking via Google");
    await signInWithGoogle();
    setLoading(false);
  };

  const progressBar =
    loading && progress > 0
      ? `[${"█".repeat(Math.floor(progress / 5))}${"░".repeat(20 - Math.floor(progress / 5))}]`
      : "";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-16 bg-background">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />
      {/* Radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[520px] bg-[radial-gradient(circle_at_50%_0%,hsl(183_100%_50%_/_0.12),transparent_55%)] pointer-events-none" />
      <div className="absolute top-1/3 -left-12 w-56 h-56 bg-primary/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-12 w-72 h-72 bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2.5 group mb-5">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center glow-cyan group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl tracking-wider gradient-text-cyan">
              SHIPYARD
            </span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest mb-4 animate-pulse-glow">
            <Terminal className="w-3.5 h-3.5" />
            Auth Terminal · Secure Dock
          </div>

          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground text-center leading-tight">
            Dock back into{" "}
            <span className="gradient-text-cyan text-glow-cyan">the yard</span>
          </h1>
        </div>

        {/* Terminal auth card */}
        <div className="relative rounded-3xl border border-foreground/10 bg-muted/95 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.45)] overflow-hidden">
          {/* Terminal title bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-foreground/10 bg-card">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">auth.session — bash</span>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-accent">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              Online
            </div>
          </div>

          {/* Terminal log area */}
          <div ref={logContainerRef} className="px-5 pt-4 pb-2 bg-muted max-h-28 overflow-y-auto border-b border-foreground/5">
            {logLines.map((line, i) => (
              <p
                key={i}
                className={`text-[11px] font-mono leading-5 ${
                  line.startsWith("✗") || line.startsWith("ERROR")
                    ? "text-destructive"
                    : line.startsWith(">")
                    ? "text-primary"
                    : line.startsWith("#")
                    ? "text-muted-foreground/60"
                    : "text-muted-foreground"
                }`}
              >
                {line}
              </p>
            ))}
            <div ref={logEndRef} />
          </div>

          <div className="p-5 sm:p-6">
            {/* Loading progress bar */}
            {loading && progress > 0 && (
              <div className="mb-4 font-mono text-[11px] text-muted-foreground">
                <span className="text-primary">&gt;</span> docking session...{" "}
                <span className="text-primary">{progressBar}</span>{" "}
                <span className="text-muted-foreground">{progress}%</span>
              </div>
            )}

            {/* Inline error */}
            {errorMsg && (
              <div className="mb-4 font-mono text-[11px] text-destructive flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <span>{errorMsg}</span>
              </div>
            )}

            {/* OAuth as terminal commands */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={handleGithub}
                disabled={loading}
                className="group relative flex items-center gap-2.5 px-4 py-3 rounded-xl bg-background/40 border border-foreground/10 text-left font-mono text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/[0.04] transition-all disabled:opacity-50"
              >
                <Github className="w-4 h-4 shrink-0" />
                <span className="flex flex-col">
                  <span className="text-[10px] text-primary/70 font-semibold">{`>`}</span>
                  <span>github.auth()</span>
                </span>
              </button>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="group relative flex items-center gap-2.5 px-4 py-3 rounded-xl bg-background/40 border border-foreground/10 text-left font-mono text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/[0.04] transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="flex flex-col">
                  <span className="text-[10px] text-primary/70 font-semibold">{`>`}</span>
                  <span>google.auth()</span>
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-[10px] font-mono text-muted-foreground/60">or</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="text-[10px] font-mono text-muted-foreground block mb-1.5">
                  <span className="text-primary">{`$`}</span> email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="builder@shipyard.dev"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-background/40 border border-foreground/10 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-[10px] font-mono text-muted-foreground">
                    <span className="text-primary">{`$`}</span> password
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.message("Password reset docking soon.")}
                    className="text-[10px] font-mono text-muted-foreground/60 hover:text-primary transition-colors"
                  >
                    reset?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-background/40 border border-foreground/10 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors text-[10px] font-mono"
                  >
                    {showPassword ? "hide" : "show"}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none pt-0.5">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="sr-only peer"
                />
                <span className="w-3.5 h-3.5 rounded border border-foreground/15 bg-foreground/5 peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-all shrink-0">
                  {remember && (
                    <svg className="w-2 h-2 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">--keep-session</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full mt-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm glow-cyan hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:pointer-events-none font-mono"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    docking...
                  </>
                ) : (
                  <>{`> auth.login()`}</>
                )}
              </button>
            </form>

            {/* Status footer */}
            <div className="mt-4 pt-4 border-t border-foreground/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground/60">{`[~] $`}</span>
                <span className="text-[10px] font-mono text-muted-foreground/60">{statusText}</span>
                <span className="inline-block w-1.5 h-4 bg-primary/80 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/40">tls · 256</span>
            </div>
          </div>
        </div>

        {/* Bottom links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-[12px] font-mono text-muted-foreground">
            <span className="text-muted-foreground/50">{`>`}</span> new here?{" "}
            <Link to="/#hire" className="text-primary hover:text-foreground transition-colors">
              join --as builder
            </Link>
          </p>
          <Link
            to="/"
            className="inline-flex text-[11px] font-mono text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <span className="text-muted-foreground/40">←</span> cd ..
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
