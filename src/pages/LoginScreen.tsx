
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from "@/contexts/LocalizationContext";
import { Phone } from "lucide-react";

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { login, user } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    // Simulate OTP sending
    console.log('Sending OTP to:', phone);
    localStorage.setItem('fyke_phone', phone || '');
    setOtpSent(true);
  };

  const handleVerifyOTP = async () => {
    try {
      await login(phone, otp);
      navigate('/profile-setup');
    } catch (error) {
      console.error('OTP Verification Failed:', error);
    }
  };

  // Always show login (phone/otp) and on success, go to /profile-setup
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-4 rounded-lg shadow-md">
        <CardContent className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{t('login.title', 'Login')}</h2>
            <p className="text-gray-500">{t('login.subtitle', 'Enter your phone number to continue')}</p>
          </div>
          <div className="space-y-2">
            <Input
              type="tel"
              placeholder={t('login.phone_placeholder', 'Phone Number')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={otpSent}
              className="border rounded-md"
            />
            {!otpSent ? (
              <Button onClick={handleSendOTP} className="w-full bg-gray-900 text-white rounded-md">
                {t('login.send_otp', 'Send OTP')}
              </Button>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder={t('login.otp_placeholder', 'Enter OTP')}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border rounded-md"
                />
                <Button onClick={handleVerifyOTP} className="w-full bg-gray-900 text-white rounded-md">
                  {t('login.verify_otp', 'Verify OTP')}
                </Button>
              </>
            )}
          </div>
          <div className="text-center text-sm text-gray-500">
            {t('login.terms', 'By continuing, you agree to our Terms of Service and Privacy Policy')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
