
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AnimatedWrapper from '@/components/AnimatedWrapper';

interface OnboardingSlide {
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  successStory: string;
}

const slides: OnboardingSlide[] = [
  {
    title: "Connect & Earn",
    subtitle: "Find work instantly",
    icon: "🤝",
    description: "Match with employers in your area and start earning within hours",
    successStory: "Raj found 5 jobs this week"
  },
  {
    title: "Verified & Safe",
    subtitle: "Trust guaranteed",
    icon: "🛡️",
    description: "All profiles are verified for your safety and security",
    successStory: "98% positive experiences"
  },
  {
    title: "Fair Payments",
    subtitle: "Get paid fairly",
    icon: "💰",
    description: "Transparent pricing and quick payments for all your work",
    successStory: "Average ₹15K monthly earnings"
  }
];

interface OnboardingSlidesProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingSlides = ({ onComplete, onSkip }: OnboardingSlidesProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
          <Button variant="ghost" onClick={onSkip} className="text-gray-500">
            Skip
          </Button>
        </div>

        {/* Slide Content */}
        <AnimatedWrapper variant="scale" delay={100}>
          <Card className="p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">{currentSlideData.icon}</span>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
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
        <div className="flex justify-center space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <Button
          onClick={nextSlide}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 text-lg"
        >
          {currentSlide < slides.length - 1 ? 'Continue' : 'Get Started'}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingSlides;
