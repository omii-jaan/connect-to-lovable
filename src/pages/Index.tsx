import Navbar from "@/components/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import HeroSection from "@/components/HeroSection";
import LiveActivityStrip from "@/components/LiveActivityStrip";
import MarqueeSection from "@/components/MarqueeSection";
import FeaturedBuilders from "@/components/FeaturedBuilders";
import FeaturedProjects from "@/components/FeaturedProjects";
import HowItWorks from "@/components/HowItWorks";
import DiscoverFeed from "@/components/DiscoverFeed";
import CTASection from "@/components/CTASection";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-border focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:text-foreground"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main">

        <ErrorBoundary><HeroSection /></ErrorBoundary>
        <ErrorBoundary><LiveActivityStrip /></ErrorBoundary>
        <MarqueeSection />
        <FeaturedBuilders />
        <HowItWorks />
        <FeaturedProjects />
        <DiscoverFeed />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  );
};


export default Index;
