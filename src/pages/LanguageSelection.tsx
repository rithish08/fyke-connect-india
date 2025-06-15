
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/contexts/LocalizationContext';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' }
];

const LanguageSelection = () => {
  const { currentLanguage, setLanguage } = useLocalization();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const navigate = useNavigate();

  const handleContinue = () => {
    setLanguage(selectedLanguage);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-md mx-auto w-full space-y-8">
          {/* Logo & Title */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <span className="text-3xl font-bold text-white">F</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Language</h1>
              <p className="text-gray-600">Select your preferred language to continue</p>
            </div>
          </div>

          {/* Language Options */}
          <div className="space-y-3">
            {languages.map((language) => (
              <ModernCard
                key={language.code}
                variant={selectedLanguage === language.code ? 'active' : 'selection'}
                className={`cursor-pointer p-4 transition-all duration-200 ${
                  selectedLanguage === language.code ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
                onClick={() => setSelectedLanguage(language.code)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl shadow-sm">
                      {language.flag}
                    </div>
                    <span className="font-semibold text-gray-900 text-lg">{language.name}</span>
                  </div>
                  {selectedLanguage === language.code && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </ModernCard>
            ))}
          </div>

          {/* Continue Button */}
          <div className="pt-4">
            <Button
              onClick={handleContinue}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
