
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import EnhancedOTPInput from '@/components/EnhancedOTPInput';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const { translateText } = useTranslation();

  useEffect(() => {
    const phone = localStorage.getItem('fyke_phone');
    if (!phone) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOTPComplete = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      toast({
        title: translateText('common.invalidOTP', 'Invalid OTP'),
        description: translateText('common.enterCompleteCode', 'Please enter the complete 6-digit code'),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const phone = localStorage.getItem('fyke_phone') || '';
      await login(phone, otpCode);
      
      // Navigate to role selection after successful OTP verification
      navigate('/role-selection');
      
      toast({
        title: translateText('common.phoneVerified', 'Phone Verified!'),
        description: translateText('common.chooseRoleToContinue', 'Now choose your role to continue')
      });
    } catch (error) {
      toast({
        title: translateText('common.verificationFailed', 'Verification Failed'),
        description: translateText('common.invalidOTPTryAgain', 'Invalid OTP. Please try again.'),
        variant: "destructive"
      });
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setResendTimer(60);
    toast({
      title: translateText('common.otpResent', 'OTP Resent'),
      description: translateText('common.newCodeSent', 'New verification code sent to your phone')
    });
  };

  const phone = localStorage.getItem('fyke_phone');

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center mx-auto border border-gray-100">
            <span className="text-2xl font-bold text-gray-800">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {translateText('common.verifyPhone', 'Verify Your Phone')}
            </h1>
            <p className="text-gray-500">
              {translateText('common.enterCode', 'Enter the 6-digit code sent to')}<br />
              <span className="font-semibold text-gray-700">+91 {phone}</span>
            </p>
          </div>
        </div>

        {/* OTP Card */}
        <Card className="p-6 shadow border-gray-100 bg-white">
          <div className="space-y-6">
            {/* Enhanced OTP Input */}
            <EnhancedOTPInput
              value={otp}
              onChange={setOtp}
              onComplete={handleOTPComplete}
            />

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-500">
                  {translateText('common.codeVerifiedAutomatically', 'Code will be verified automatically')}
                </p>
              </div>
            </div>

            <div className="text-center">
              {resendTimer > 0 ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-400">
                    {translateText('common.resendIn', 'Resend in')} {resendTimer}s
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium"
                >
                  {translateText('common.resendOTP', 'Resend OTP')}
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Security Info */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <span className="text-sm">🛡️</span>
            <span className="text-sm font-medium">
              {translateText('common.secureVerification', 'Secure Verification')}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {translateText('common.keepAccountSafe', 'This helps us keep your account safe and secure')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
