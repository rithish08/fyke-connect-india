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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Welcome */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-white shadow flex items-center justify-center mx-auto border border-gray-100">
            <span className="text-3xl font-bold text-gray-800">F</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Fyke</h1>
            <p className="text-gray-600 text-base">India's Premier Blue-Collar Job Marketplace</p>
            <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>50,000+ jobs • 2 lakh+ workers</span>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <Card className="p-8 shadow border-gray-100 bg-white/90 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Choose Your Language
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                  selectedLanguage === lang.code
                    ? 'border-gray-700 bg-gray-100 shadow-lg ring-2 ring-gray-400'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{lang.flag}</div>
                <div className="text-xl font-bold text-gray-900 mb-1">{lang.native}</div>
                <div className="text-sm text-gray-500">{lang.name}</div>
              </button>
            ))}
          </div>

          <Button
            onClick={handleContinue}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-2xl shadow transition-all duration-200 text-lg"
          >
            Continue
          </Button>
        </Card>
        
        <div className="text-center text-xs text-gray-400">
          Choose your preferred language to personalize your experience
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
