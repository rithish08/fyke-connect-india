
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Globe, ArrowRight } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { language, setLanguage, getSupportedLanguages, t } = useLocalization();
  const { announceMessage } = useAccessibility();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  
  const supportedLanguages = getSupportedLanguages();

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    const selectedLang = supportedLanguages.find(lang => lang.code === langCode);
    if (selectedLang) {
      announceMessage(`Selected ${selectedLang.nativeName}`);
    }
  };

  const handleContinue = () => {
    setLanguage(selectedLanguage);
    announceMessage(t('language.continuing', 'Continuing with selected language'));
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('language.select', 'Select Your Language')}
              </h1>
              <p className="text-gray-600 text-sm">
                {t('language.subtitle', 'Choose your preferred language to continue')}
              </p>
            </div>
          </div>

          {/* Language Options */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedLanguage === lang.code
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                aria-label={`Select ${lang.nativeName} language`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl" role="img" aria-label={`${lang.name} flag`}>
                      {lang.flag}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {lang.nativeName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {lang.name}
                      </div>
                    </div>
                  </div>
                  {selectedLanguage === lang.code && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <Button 
            onClick={handleContinue}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg"
            aria-label={t('language.continue', 'Continue with selected language')}
          >
            <span>{t('language.continue', 'Continue')}</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Accessibility Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              {t('language.accessibility', 'This app supports screen readers and accessibility features')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSelection;
