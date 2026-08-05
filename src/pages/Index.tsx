import { useEffect } from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import SocialProofTicker from "@/components/landing/SocialProofTicker";
import ProblemSection from "@/components/landing/ProblemSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CtaBandSection from "@/components/landing/CtaBandSection";
import LandingFooter from "@/components/landing/LandingFooter";

const Index = () => {
  useEffect(() => {
    document.title = "Shipyards — The professional identity platform for AI builders";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Accessibility: Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-card focus:text-foreground focus:border focus:border-border focus:rounded-md text-sm"
      >
        Skip to main content
      </a>

      {/* Section 1: Fixed Nav 64px */}
      <LandingNavbar />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* Section 2: Hero */}
        <LandingHero />

        {/* Section 3: Social proof ticker */}
        <SocialProofTicker />

        {/* Section 4: Problem section */}
        <ProblemSection />

        {/* Section 5: Features (5 layers) */}
        <FeaturesSection />

        {/* Section 6: How it works timeline */}
        <HowItWorksSection />

        {/* Section 7: Final CTA band */}
        <CtaBandSection />
      </main>

      {/* Section 8: Footer */}
      <LandingFooter />
    </div>
  );
};

export default Index;
