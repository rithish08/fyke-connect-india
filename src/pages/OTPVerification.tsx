import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/contexts/LocalizationContext';
import EnhancedOTPInput from '@/components/EnhancedOTPInput';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const navigate = useNavigate();
  const { verifyOTP, sendOTP, user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useLocalization();

  useEffect(() => {
    const phone = localStorage.getItem('fyke_phone');
    if (!phone) {
      navigate('/login');
    }
  }, [navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Defensive: Always check for missing role and redirect
      if (!user.role) {
        navigate('/role-selection', { replace: true });
        return;
      } else if (user.role === 'jobseeker' && !user.profileComplete) {
        navigate('/profile-setup', { replace: true });
        return;
      } else {
        navigate('/home', { replace: true });
        return;
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOTPComplete = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      toast({
        title: t('auth.invalid_otp', 'Invalid OTP'),
        description: t('auth.enter_complete_code', 'Please enter the complete 6-digit code'),
        variant: 'destructive'
      });
      return;
    }
    setLoading(true);
    try {
      const phone = localStorage.getItem('fyke_phone') || '';
      const { error } = await verifyOTP(phone, otpCode);
      if (error) {
        toast({
          title: t('auth.verification_failed', 'Verification Failed'),
          description: t('auth.invalid_otp_try_again', 'Invalid OTP. Please try again.'),
          variant: 'destructive'
        });
        setOtp(['', '', '', '', '', '']);
        return;
      }
      toast({
        title: t('auth.phone_verified', 'Phone Verified!'),
        description: t('auth.choose_role_continue', 'Now choose your role to continue')
      });
    } catch (error) {
      toast({
        title: t('auth.verification_failed', 'Verification Failed'),
        description: t('auth.invalid_otp_try_again', 'Invalid OTP. Please try again.'),
        variant: 'destructive'
      });
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const phone = localStorage.getItem('fyke_phone');
    if (phone) {
      const { error } = await sendOTP(phone);
      if (!error) {
        setResendTimer(60);
        toast({
          title: t('auth.otp_resent', 'OTP Resent'),
          description: t('auth.new_code_sent', 'New verification code sent to your phone')
        });
      }
    }
  };

  const phone = localStorage.getItem('fyke_phone')?.replace('+91', '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto border border-blue-100">
            <span className="text-2xl font-bold text-blue-600">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('auth.verify_phone', 'Verify Your Phone')}
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed px-2">
              {t('auth.enter_code', 'Enter the 6-digit code sent to')}<br />
              <span className="font-semibold text-gray-800">+91 {phone}</span>
            </p>
          </div>
        </div>

        {/* OTP Card */}
        <Card className="p-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Enhanced OTP Input */}
            <div className="flex justify-center px-2">
              <div className="w-full max-w-xs">
                <EnhancedOTPInput
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleOTPComplete}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-500">
                  {t('auth.code_auto_verify', 'Code will be verified automatically')}
                </p>
              </div>
            </div>

            <div className="text-center">
              {resendTimer > 0 ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500">
                    {t('auth.resend_in', 'Resend in {0}s', [resendTimer.toString()])}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {t('auth.resend_otp', 'Resend OTP')}
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Security Info */}
        <div className="text-center space-y-2 px-4">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <span className="text-sm">🛡️</span>
            <span className="text-sm font-medium">
              {t('auth.secure_verification', 'Secure Verification')}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {t('auth.security_help', 'This helps us keep your account safe and secure')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
