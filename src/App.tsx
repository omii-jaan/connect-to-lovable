import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import LiveAnnouncer from "@/components/LiveAnnouncer";
import { announce } from "@/lib/announce";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { MotionProvider, useMotionPreference } from "@/context/MotionContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import AuthCallback from "./pages/AuthCallback.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import PostProject from "./pages/PostProject.tsx";
import Projects from "./pages/Projects.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import ProfilePreview from "./pages/ProfilePreview.tsx";
import BuilderProfile from "./pages/BuilderProfile.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AnimatedPage = ({ children }: { children: React.ReactNode }) => {
  const { reduced } = useMotionPreference();

  if (reduced) return <div>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

/** Announces the destination after every client-side navigation. */
const RouteAnnouncer = () => {
  const location = useLocation();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const heading = document.querySelector("h1")?.textContent?.trim();
      announce(`${heading || document.title || "Page"} loaded.`);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { reduced } = useMotionPreference();

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-3 text-sm text-muted-foreground"
        >
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading Shipyard…</span>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={!reduced}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Index /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage>{user ? <Navigate to="/dashboard" replace /> : <Login />}</AnimatedPage>} />
        <Route path="/auth/callback" element={<AnimatedPage><AuthCallback /></AnimatedPage>} />
        <Route path="/profile-preview" element={<AnimatedPage><ProfilePreview /></AnimatedPage>} />
        <Route path="/builder/:username" element={<AnimatedPage><BuilderProfile /></AnimatedPage>} />
        <Route
          path="/dashboard"
          element={
            <AnimatedPage>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </AnimatedPage>
          }
        />
        <Route path="/post-project" element={<AnimatedPage><PostProject /></AnimatedPage>} />
        <Route path="/projects" element={<AnimatedPage><Projects /></AnimatedPage>} />
        <Route path="/projects/:id" element={<AnimatedPage><ProjectDetail /></AnimatedPage>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ThemeProvider>
          <MotionProvider>
            <LiveAnnouncer />
            <RouteAnnouncer />
            <Sonner />
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </MotionProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
