import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { useLocalization } from '@/contexts/LocalizationContext';

interface OnboardingSlide {
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  successStory: string;
}

const OnboardingSlides = ({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) => {
  const { t } = useLocalization();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: OnboardingSlide[] = [
    {
      title: t('onboarding.connectEarn', 'Connect & Earn'),
      subtitle: t('onboarding.findWork', 'Find work instantly'),
      icon: '🤝',
      description: t('onboarding.matchEmployers', 'Match with employers in your area and start earning within hours'),
      successStory: t('onboarding.rajSuccess', 'Raj found 5 jobs this week')
    },
    {
      title: t('onboarding.verifiedSafe', 'Verified & Safe'),
      subtitle: t('onboarding.trustGuaranteed', 'Trust guaranteed'),
      icon: '🛡️',
      description: t('onboarding.verifiedProfiles', 'All profiles are verified for your safety and security'),
      successStory: t('onboarding.positiveExperiences', '98% positive experiences')
    },
    {
      title: t('onboarding.fairPayments', 'Fair Payments'),
      subtitle: t('onboarding.getPaidFairly', 'Get paid fairly'),
      icon: '💰',
      description: t('onboarding.transparentPayments', 'Transparent pricing and quick payments for all your work'),
      successStory: t('onboarding.avgEarnings', 'Average ₹15K monthly earnings')
    }
  ];

  useEffect(() => {
    // Announce slide change for screen readers
    if (window && 'speechSynthesis' in window) {
      // Optionally, announce via speech synthesis or ARIA live region
    }
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Skip Button */}
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onSkip} className="text-gray-500" aria-label={t('onboarding.skip', 'Skip')}>
            {t('onboarding.skip', 'Skip')}
          </Button>
        </div>

        {/* Slide Content */}
        <AnimatedWrapper variant="scale" delay={100}>
          <Card className="p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl" aria-hidden="true">{currentSlideData.icon}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2" tabIndex={0} aria-live="polite">
                  {currentSlideData.title}
                </h2>
                <p className="text-lg text-blue-600 font-semibold mb-4">
                  {currentSlideData.subtitle}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {currentSlideData.description}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-green-700 font-medium text-sm">
                  ✨ {currentSlideData.successStory}
                </p>
              </div>
            </div>
          </Card>
        </AnimatedWrapper>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2" aria-label={t('onboarding.progress', 'Slide progress')}>
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              aria-current={index === currentSlide ? 'step' : undefined}
            />
          ))}
        </div>

        {/* Navigation */}
        <Button
          onClick={nextSlide}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 text-lg"
          aria-label={currentSlide < slides.length - 1 ? t('onboarding.continue', 'Continue') : t('onboarding.getStarted', 'Get Started')}
        >
          {currentSlide < slides.length - 1 ? t('onboarding.continue', 'Continue') : t('onboarding.getStarted', 'Get Started')}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingSlides;
