import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';

// --- Languages and Color Setup ---
const languages = [
  { code: 'en', name: 'English', native: 'English', flag: 'GB', color: 'bg-blue-400' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: 'IN', color: 'bg-yellow-400' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: 'IN', color: 'bg-pink-300' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: 'IN', color: 'bg-green-400' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: 'IN', color: 'bg-purple-400' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: 'IN', color: 'bg-red-400' },
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
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-2 py-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center my-8">
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center shadow-lg border border-gray-100">
            <span className="text-2xl font-bold text-white font-mono tracking-wider">fyke</span>
          </div>
        </div>
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Choose Your Language</h1>
          <p className="text-gray-500 text-base mt-2">Select your preferred language</p>
        </div>
        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {languages.map((lang) => {
            const selected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={[
                  "flex flex-col items-center rounded-2xl border transition-all px-0 py-6 shadow-sm relative group w-full h-full",
                  selected
                    ? "border-2 border-blue-400 ring-2 ring-blue-200 bg-white shadow-md"
                    : "border border-gray-200 bg-white/95 hover:border-blue-200",
                  "focus:outline-none"
                ].join(' ')}
                type="button"
              >
                {/* Flag */}
                <span className={`mb-2 w-12 h-12 flex items-center justify-center text-lg font-bold text-white ${lang.color} rounded-full border border-white shadow`}>
                  {lang.flag}
                </span>
                {/* Language Name and Native */}
                <span className="font-bold text-lg text-gray-900">{lang.name}</span>
                <span className="text-base text-gray-500">{lang.native !== lang.name ? lang.native : <>&nbsp;</>}</span>
                {/* Selected State */}
                {selected && (
                  <div className="absolute bottom-3 left-0 w-full flex flex-col items-center">
                    <span className="flex items-center gap-1 text-xs font-medium text-blue-500">
                      <svg width={16} height={16} className="inline" fill="none" viewBox="0 0 20 20"><path d="M5 10.8l3.5 3.7 7-7.9" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Selected
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {/* Continue Button */}
        <div className="mt-12 mb-2">
          <Button
            onClick={handleContinue}
            className="w-full h-14 rounded-xl bg-gray-900 text-white text-lg font-semibold shadow-xl hover:bg-gray-950 transition"
            style={{ letterSpacing: 0.2 }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
export default LanguageSelection;
