import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Globe, ArrowRight } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';
import { useAuth } from '@/contexts/AuthContext';

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { language, setLanguage, getSupportedLanguages, t } = useLocalization();
  const { announceMessage } = useAccessibility();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const { user, isAuthenticated } = useAuth();

  // Redirect authenticated users away from language screen
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.role) {
        navigate('/role-selection', { replace: true });
      } else if (user.role === 'jobseeker' && !user.profileComplete) {
        navigate('/profile-setup', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);
  
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
        {/* Stronger blur and shadow for card background */}
        <div className="absolute inset-0 z-0 rounded-3xl bg-white/40 backdrop-blur-2xl shadow-2xl" style={{ filter: 'blur(2.5px)' }}></div>
        <Card className="relative z-10 w-full rounded-3xl overflow-hidden border border-gray-200 bg-white/80 shadow-xl">
          <CardContent className="p-4 sm:p-6 md:p-10 space-y-6">
            {/* Fyke Logo */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-white font-extrabold text-2xl sm:text-3xl font-sans" style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>fyke</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-sans" style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                  {t('language.select', 'Select Your Language', [], selectedLanguage)}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base font-sans">
                  {t('language.subtitle', 'Choose your preferred language to continue', [], selectedLanguage)}
                </p>
              </div>
            </div>

            {/* Language Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-h-[60vh] overflow-y-auto hide-scrollbar" role="radiogroup" aria-label={t('language.languageList', 'Language options')}>
              {supportedLanguages.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                const { letter, bg, text } = getLangCircle(lang.code);
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`group w-full flex flex-col items-center justify-center rounded-2xl p-4 md:p-6 border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 bg-white shadow-md relative select-none cursor-pointer min-h-[120px] min-w-[100px] ${isSelected ? 'border-blue-600 ring-2 ring-blue-200 shadow-xl' : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'}`}
                    aria-label={t('language.selectLanguage', 'Select language', [lang.nativeName])}
                    aria-checked={!!isSelected}
                    role="radio"
                    tabIndex={0}
                    dir={lang.rtl ? 'rtl' : 'ltr'}
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full font-extrabold text-xl md:text-2xl mb-2 shadow transition-all duration-200 ${bg} ${text} ${isSelected ? 'scale-110' : ''}`}>{letter}</div>
                    <div className="text-center">
                      <div className="font-bold text-lg md:text-xl text-gray-900 font-sans" style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>{lang.nativeName}</div>
                      <div className="text-xs text-gray-500 font-medium font-sans">{lang.name}</div>
                      {isSelected && (
                        <div className="flex items-center justify-center mt-1 text-green-600 text-xs font-semibold font-sans">
                          <Check className="w-4 h-4 mr-1" />
                          {t('language.selected', 'Selected')}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        {/* Sticky Continue Button and Accessibility Message below Card */}
        <div className="fixed bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-full flex justify-center pointer-events-auto">
            <div className="w-[80%] max-w-lg mx-auto px-4 pb-2">
              <Button
                onClick={handleContinue}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-black/90 to-gray-900/90 backdrop-blur-sm shadow-2xl hover:from-gray-800/90 hover:to-black/90 text-white font-bold font-sans transition-all duration-300 text-base"
                aria-label={t('language.continue', 'Continue with selected language')}
              >
                <span>{t('language.continue', 'Continue')}</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
          <div className="w-full flex justify-center mt-1 mb-4">
            <p className="text-center text-sm font-bold font-sans text-gray-500 bg-white/30 rounded-xl px-4 py-2 shadow-md backdrop-blur-sm" style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>
              {t('language.accessibility', 'This app supports screen readers and accessibility features')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
