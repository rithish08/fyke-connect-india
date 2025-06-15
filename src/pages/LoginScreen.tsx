
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();
  const { t } = useLocalization();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.role) {
        navigate('/role-selection');
      } else if (user.role === 'jobseeker' && !user.profileComplete) {
        navigate('/profile-setup');
      } else {
        navigate('/home');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: t('login.invalid_phone', 'Invalid Phone Number'),
        description: t('login.phone_required', 'Please enter a valid 10-digit phone number'),
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(phoneNumber);
      toast({
        title: t('login.otp_sent', 'OTP Sent'),
        description: t('login.otp_description', 'Please check your phone for verification code')
      });
      navigate('/otp-verification');
    } catch (error) {
      toast({
        title: t('login.error', 'Login Failed'),
        description: t('login.error_description', 'Please try again'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={() => navigate('/')}
                className="absolute left-4 top-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('login.welcome', 'Welcome to fyke')}
            </h1>
            <p className="text-gray-600">
              {t('login.subtitle', 'Connect with work opportunities')}
            </p>
          </div>

          {/* Login Card */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <span>{t('login.phone_login', 'Phone Login')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('login.phone_label', 'Phone Number')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    +91
                  </span>
                  <Input
                    type="tel"
                    placeholder={t('login.phone_placeholder', 'Enter 10-digit number')}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-12 h-12 text-lg"
                    maxLength={10}
                  />
                </div>
              </div>

              <Button
                onClick={handleLogin}
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? t('login.sending', 'Sending OTP...') : t('login.send_otp', 'Send OTP')}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                {t('login.terms', 'By continuing, you agree to our Terms of Service and Privacy Policy')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
