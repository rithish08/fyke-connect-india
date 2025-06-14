
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocalization } from '@/contexts/LocalizationContext';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import OnboardingSlides from '@/components/OnboardingSlides';

const languages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' }
];

const LanguageSelection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { setLanguage } = useLocalization();
  const navigate = useNavigate();

  const handleContinue = () => {
    setLanguage(selectedLanguage);
    
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('fyke_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    } else {
      navigate('/role-selection');
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('fyke_onboarding_seen', 'true');
    navigate('/role-selection');
  };

  const handleSkipOnboarding = () => {
    localStorage.setItem('fyke_onboarding_seen', 'true');
    navigate('/role-selection');
  };

  if (showOnboarding) {
    return (
      <OnboardingSlides 
        onComplete={handleOnboardingComplete}
        onSkip={handleSkipOnboarding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Welcome */}
        <AnimatedWrapper variant="scale" delay={100}>
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-white text-3xl font-bold">F</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to Fyke</h1>
              <p className="text-gray-600 text-lg">India's Premier Blue-Collar Job Marketplace</p>
              <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>50,000+ jobs • 2 lakh+ workers</span>
              </div>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Language Selection */}
        <AnimatedWrapper variant="slide" direction="up" delay={300}>
          <Card className="p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Choose Your Language
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {languages.map((lang, index) => (
                <AnimatedWrapper key={lang.code} variant="scale" delay={400 + index * 50}>
                  <button
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center hover:scale-105 group ${
                      selectedLanguage === lang.code
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105 ring-4 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`text-2xl mb-2 group-hover:scale-110 transition-transform ${
                      selectedLanguage === lang.code ? 'animate-bounce' : ''
                    }`}>
                      {lang.flag}
                    </div>
                    <div className="text-xl font-bold text-gray-900 mb-1">{lang.native}</div>
                    <div className="text-sm text-gray-600">{lang.name}</div>
                  </button>
                </AnimatedWrapper>
              ))}
            </div>

            <AnimatedWrapper variant="slide" direction="up" delay={800}>
              <Button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 text-lg"
              >
                Continue
              </Button>
            </AnimatedWrapper>
          </Card>
        </AnimatedWrapper>

        <AnimatedWrapper variant="fade" delay={1000}>
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-500">
              Choose your preferred language to personalize your experience
            </div>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <span className="flex items-center space-x-1">
                <span>🔒</span>
                <span>Secure</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>⚡</span>
                <span>Fast</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🎯</span>
                <span>Accurate</span>
              </span>
            </div>
          </div>
        </AnimatedWrapper>
      </div>
    </div>
  );
};

export default LanguageSelection;
