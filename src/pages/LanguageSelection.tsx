
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' }
];

const LanguageSelection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const { setLanguage } = useAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    setLanguage(selectedLanguage);
    navigate('/role-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Welcome */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white text-2xl font-bold">F</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Fyke</h1>
            <p className="text-gray-600">India's Premier Blue-Collar Job Marketplace</p>
          </div>
        </div>

        {/* Language Selection */}
        <Card className="p-6 shadow-xl border-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Choose Your Language
          </h2>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.name)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                  selectedLanguage === lang.name
                    ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg font-medium text-gray-900">{lang.native}</div>
                <div className="text-sm text-gray-600">{lang.name}</div>
              </button>
            ))}
          </div>

          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-200"
          >
            Continue
          </Button>
        </Card>

        <div className="text-center text-sm text-gray-500">
          Choose your preferred language to continue
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
