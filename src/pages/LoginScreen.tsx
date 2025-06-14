
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Smartphone, ArrowLeft } from "lucide-react";

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP } = useAuth();
  const { translateText } = useTranslation();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phone || !name) return;
    
    setIsLoading(true);
    try {
      await sendOTP(phone, name);
      navigate('/otp-verification');
    } catch (error) {
      console.error('Failed to send OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLanguage = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToLanguage}
            className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {translateText('login.title', 'Welcome to Fyke')}
            </h1>
          </div>
          <div className="w-10 h-10"></div>
        </div>

        {/* Login Card */}
        <Card className="p-6 shadow-xl rounded-3xl bg-white border-0">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {translateText('login.verifyNumber', 'Verify your number')}
              </h2>
              <p className="text-gray-600 text-sm">
                {translateText('login.enterDetails', 'Enter your details to get started')}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder={translateText('login.fullName', 'Your Full Name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-lg rounded-xl border-gray-200"
                />
              </div>
              
              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="h-12 text-lg rounded-xl border-gray-200"
                  maxLength={10}
                />
              </div>
            </div>

            <Button
              onClick={handleSendOTP}
              disabled={!phone || !name || isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg"
            >
              {isLoading ? 'Sending...' : translateText('login.sendOTP', 'Send OTP')}
            </Button>

            <p className="text-xs text-gray-500 text-center leading-relaxed">
              {translateText('login.termsAgreement', 'By continuing, you agree to our Terms of Service and Privacy Policy')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
