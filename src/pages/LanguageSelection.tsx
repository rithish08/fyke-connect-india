
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import OnboardingSlides from '@/components/OnboardingSlides';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Globe } from "lucide-react";
import { useLocalization } from '@/contexts/LocalizationContext';

const languageList = [
  { code: 'en', name: 'English', native: 'English', color: 'bg-blue-500', icon: "🇬🇧" },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', color: 'bg-amber-400', icon: "🇮🇳" },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', color: 'bg-pink-400', icon: "🇮🇳" },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', color: 'bg-green-500', icon: "🇮🇳" },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', color: 'bg-purple-500', icon: "🇮🇳" },
  { code: 'mr', name: 'Marathi', native: 'मराठी', color: 'bg-red-500', icon: "🇮🇳" },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', color: 'bg-indigo-500', icon: "🇮🇳" },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', color: 'bg-teal-400', icon: "🇮🇳" }
];

const LanguageSelection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { setLanguage, t } = useLocalization();
  const navigate = useNavigate();

  const handleContinue = () => {
    setLanguage(selectedLanguage);
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-lg mx-auto space-y-7">
        {/* Brand + Welcome */}
        <div className="flex flex-col items-center gap-4">
          <span className="flex rounded-full bg-gray-900 text-white w-14 h-14 justify-center items-center text-2xl font-bold shadow border-2 border-gray-100">fyke</span>
          <span className="mt-4 mb-1 text-3xl font-bold text-gray-900">{t('lang.title', 'Choose Your Language')}</span>
          <span className="mb-1 text-base text-gray-500">{t('lang.subtitle', 'Select your preferred language')}</span>
        </div>
        {/* Modern Language card selection */}
        <div className="grid grid-cols-2 gap-4">
          {languageList.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`group transition-all duration-150 rounded-xl flex flex-col items-center p-5 shadow hover:shadow-lg border-2 ${
                selectedLanguage === lang.code
                  ? "border-gray-700 bg-gray-50 scale-105"
                  : "border-gray-100 bg-white hover:border-gray-300"
              }`}
            >
              <span className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 ${lang.color} text-white shadow-lg`}>
                {lang.icon}
              </span>
              <span className="text-xl font-bold text-gray-900">{lang.native}</span>
              <span className="text-xs text-gray-400 mt-1">{lang.name}</span>
              {selectedLanguage === lang.code && (
                <span className="mt-2 text-xs text-green-600 font-medium">✔ Selected</span>
              )}
            </button>
          ))}
        </div>
        <Button
          onClick={handleContinue}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-2xl shadow-lg mt-2 text-lg"
        >
          {t('common.continue', 'Continue')}
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelection;
