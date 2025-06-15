
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OTPVerification = () => {
  const navigate = useNavigate();
  const { verifyOTP, user, isAuthenticated } = useAuth();
  const { t } = useLocalization();
  const { toast } = useToast();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast({
        title: t('otp.invalid', 'Invalid OTP'),
        description: t('otp.six_digits', 'Please enter all 6 digits'),
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(otpCode);
      toast({
        title: t('otp.verified', 'Phone Verified'),
        description: t('otp.success', 'Your phone number has been verified successfully')
      });
    } catch (error) {
      toast({
        title: t('otp.error', 'Verification Failed'),
        description: t('otp.invalid_code', 'Invalid OTP code. Please try again.'),
        variant: 'destructive'
      });
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setResendTimer(30);
    setCanResend(false);
    toast({
      title: t('otp.resent', 'OTP Resent'),
      description: t('otp.resent_description', 'A new OTP has been sent to your phone')
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={() => navigate('/login')}
                className="absolute left-4 top-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('otp.title', 'Verify Phone Number')}
            </h1>
            <p className="text-gray-600">
              {t('otp.subtitle', 'Enter the 6-digit code sent to your phone')}
            </p>
          </div>

          {/* OTP Card */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">
                {t('otp.enter_code', 'Enter Verification Code')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* OTP Inputs */}
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 focus:border-blue-500"
                  />
                ))}
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerify}
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? t('otp.verifying', 'Verifying...') : t('otp.verify', 'Verify & Continue')}
              </Button>

              {/* Resend */}
              <div className="text-center">
                {canResend ? (
                  <Button
                    variant="ghost"
                    onClick={handleResend}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t('otp.resend', 'Resend OTP')}
                  </Button>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {t('otp.resend_in', 'Resend OTP in')} {resendTimer}s
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
