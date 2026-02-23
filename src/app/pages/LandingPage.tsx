import { LandingNavbar }        from "../components/landing/LandingNavbar";
import { HeroSection }           from "../components/landing/HeroSection";
import { ProblemSection }        from "../components/landing/ProblemSection";
import { SolutionSection }       from "../components/landing/SolutionSection";
import { QualityPillarsSection } from "../components/landing/QualityPillarsSection";
import { ForMinersSection }      from "../components/landing/ForMinersSection";
import { ForValidatorsSection }  from "../components/landing/ForValidatorsSection";
import { TrustSection }          from "../components/landing/TrustSection";
import { RoadmapSection }        from "../components/landing/RoadmapSection";
import { CTASection }            from "../components/landing/CTASection";
import { FooterSection }         from "../components/landing/FooterSection";

export function LandingPage() {
  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        scrollBehavior: "smooth",
      }}
    >
      <LandingNavbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <QualityPillarsSection />
      <ForMinersSection />
      <ForValidatorsSection />
      <TrustSection />
      <RoadmapSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
