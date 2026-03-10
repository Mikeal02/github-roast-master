import { HeroStats } from './landing/HeroStats';
import { FeatureShowcase } from './landing/FeatureShowcase';
import { HowItWorks } from './landing/HowItWorks';
import { DualModes } from './landing/DualModes';
import { Testimonials } from './landing/Testimonials';
import { TechStack } from './landing/TechStack';
import { CTASection } from './landing/CTASection';

interface LandingPageProps {
  isRecruiterMode: boolean;
  onTryIt: () => void;
}

export function LandingPage({ isRecruiterMode, onTryIt }: LandingPageProps) {
  return (
    <div className="space-y-28 mt-16">
      <HeroStats />
      <FeatureShowcase />
      <HowItWorks />
      <DualModes />
      <Testimonials />
      <TechStack />
      <CTASection isRecruiterMode={isRecruiterMode} onTryIt={onTryIt} />
    </div>
  );
}
