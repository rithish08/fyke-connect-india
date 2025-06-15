
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { Check } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', native: 'English', icon: "🇬🇧" },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', icon: "🇮🇳" },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', icon: "🇮🇳" },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', icon: "🇮🇳" },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', icon: "🇮🇳" },
  { code: 'mr', name: 'Marathi', native: 'मराठी', icon: "🇮🇳" }
];

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useAuth();
  const { language, setLanguage, t } = useLocalization();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  useEffect(() => {
    // If user is authenticated and has completed setup, redirect to home
    if (isAuthenticated && userProfile) {
      if (userProfile.role && userProfile.profile_complete) {
        navigate('/home');
      } else if (userProfile.role && !userProfile.profile_complete) {
        navigate('/profile-setup');
      } else if (!userProfile.role) {
        navigate('/role-selection');
      }
    }
  }, [isAuthenticated, userProfile, navigate]);

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    setLanguage(langCode);
  };

  const handleContinue = () => {
    if (isAuthenticated) {
      if (userProfile?.role) {
        navigate('/home');
      } else {
        navigate('/role-selection');
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <AnimatedWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🌍</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('language.choose', 'Choose Your Language')}
              </h1>
              <p className="text-gray-600 text-sm">
                {t('language.subtitle', 'Select your preferred language to continue')}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                    selectedLanguage === lang.code
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{lang.icon}</span>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">{lang.native}</div>
                        <div className="text-sm text-gray-500">{lang.name}</div>
                      </div>
                    </div>
                    {selectedLanguage === lang.code && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={handleContinue}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              {t('common.continue', 'Continue')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AnimatedWrapper>
  );
};

export default LanguageSelection;
