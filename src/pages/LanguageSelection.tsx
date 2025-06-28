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
      announceMessage(t('language.selected', 'Selected {0}', [selectedLang.nativeName]));
    }
  };

  // Helper to get unique letter and color for each language
  const getLangCircle = (langCode: string) => {
    switch (langCode) {
      case 'en': return { letter: 'E', bg: 'bg-blue-500', text: 'text-white' };
      case 'hi': return { letter: 'ह', bg: 'bg-orange-400', text: 'text-white' };
      case 'ta': return { letter: 'த', bg: 'bg-pink-400', text: 'text-white' };
      case 'te': return { letter: 'త', bg: 'bg-green-500', text: 'text-white' };
      case 'bn': return { letter: 'ব', bg: 'bg-purple-500', text: 'text-white' };
      case 'mr': return { letter: 'म', bg: 'bg-red-500', text: 'text-white' };
      case 'gu': return { letter: 'ગ', bg: 'bg-yellow-500', text: 'text-gray-900' };
      case 'kn': return { letter: 'ಕ', bg: 'bg-teal-500', text: 'text-white' };
      case 'ml': return { letter: 'മ', bg: 'bg-indigo-500', text: 'text-white' };
      case 'pa': return { letter: 'ਪ', bg: 'bg-lime-500', text: 'text-gray-900' };
      case 'ur': return { letter: 'ا', bg: 'bg-emerald-600', text: 'text-white' };
      case 'ar': return { letter: 'ع', bg: 'bg-gray-700', text: 'text-white' };
      default: return { letter: '?', bg: 'bg-gray-300', text: 'text-gray-700' };
    }
  };

  const handleContinue = () => {
    setLanguage(selectedLanguage);
    announceMessage(t('language.continuing', 'Continuing with selected language'));
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto relative">
        <div className="absolute inset-0 z-0 rounded-3xl bg-white/40 backdrop-blur-xl shadow-2xl" style={{ filter: 'blur(0.5px)' }}></div>
        <Card className="relative z-10 w-full rounded-3xl overflow-hidden border border-gray-200 bg-white/80 shadow-xl">
          <CardContent className="p-4 sm:p-6 md:p-10 space-y-6">
            {/* Fyke Logo */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-white font-extrabold text-2xl sm:text-3xl font-sans">fyke</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {t('language.select', 'Select Your Language')}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {t('language.subtitle', 'Choose your preferred language to continue')}
                </p>
              </div>
            </div>

            {/* Language Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-h-[60vh] overflow-y-auto" role="radiogroup" aria-label={t('language.languageList', 'Language options')}>
              {supportedLanguages.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                const { letter, bg, text } = getLangCircle(lang.code);
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`group w-full flex flex-col items-center justify-center rounded-2xl p-4 md:p-6 border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 bg-white shadow-md relative select-none cursor-pointer min-h-[120px] min-w-[100px]
                      ${isSelected ? 'border-blue-600 ring-2 ring-blue-200 shadow-xl' : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'}
                    `}
                    aria-label={t('language.selectLanguage', 'Select language', [lang.nativeName])}
                    aria-checked={isSelected}
                    role="radio"
                    tabIndex={0}
                    dir={lang.rtl ? 'rtl' : 'ltr'}
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full font-extrabold text-xl md:text-2xl mb-2 shadow transition-all duration-200 ${bg} ${text} ${isSelected ? 'scale-110' : ''}`}>
                      {letter}
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg md:text-xl text-gray-900">
                        {lang.nativeName}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {lang.name}
                      </div>
                      {isSelected && (
                        <div className="flex items-center justify-center mt-1 text-green-600 text-xs font-semibold">
                          <Check className="w-4 h-4 mr-1" />
                          {t('language.selected', 'Selected')}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sticky Continue Button */}
            <div className="sticky bottom-0 left-0 right-0 z-20 pt-4 bg-gradient-to-t from-white/90 via-white/70 to-transparent -mx-4 md:-mx-10 pb-2 backdrop-blur-md">
              <Button 
                onClick={handleContinue}
                className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl shadow-lg text-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label={t('language.continue', 'Continue with selected language')}
              >
                <span>{t('language.continue', 'Continue')}</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Accessibility Notice */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500 leading-relaxed">
                {t('language.accessibility', 'This app supports screen readers and accessibility features')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LanguageSelection;
