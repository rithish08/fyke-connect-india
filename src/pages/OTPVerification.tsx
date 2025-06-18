
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import EnhancedOTPInput from '@/components/EnhancedOTPInput';
import { useLocalization } from '@/contexts/LocalizationContext';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [errorState, setErrorState] = useState<string | null>(null);
  const navigate = useNavigate();
  const { verifyOTP, sendOTP, userProfile, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocalization();
  const didAutoNavigate = useRef(false);
  const isVerifying = useRef(false);

  const phone = localStorage.getItem('fyke_phone');

  // Demo OTP for testing - remove in production
  const DEMO_OTP = '123456';

  // Navigation logic based on auth state
  useEffect(() => {
    console.log('[OTPVerification] Auth state:', { isAuthenticated, user: !!user, userProfile });
    
    if (!phone) {
      console.log('[OTPVerification] No phone found, redirecting to login');
      navigate('/login');
      return;
    }

    if (isAuthenticated && user && userProfile && !didAutoNavigate.current) {
      didAutoNavigate.current = true;
      localStorage.removeItem('fyke_phone');
      
      console.log('[OTPVerification] Authenticated with profile, determining next route');
      
      if (!userProfile.role) {
        console.log('[OTPVerification] No role, going to role selection');
        navigate('/role-selection');
      } else if (userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
        console.log('[OTPVerification] Jobseeker with incomplete profile, going to profile setup');
        navigate('/profile-setup');
      } else {
        console.log('[OTPVerification] Complete profile, going to home');
        navigate('/home');
      }
    }
  }, [isAuthenticated, user, userProfile, navigate, phone]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOTPComplete = async (otpCode: string) => {
    if (otpCode.length !== 6 || isVerifying.current || !phone) {
      return;
    }

    isVerifying.current = true;
    setLoading(true);
    setErrorState(null);

    try {
      console.log('[OTPVerification] Verifying OTP for phone:', phone);
      
      // Check for demo OTP first
      if (otpCode === DEMO_OTP) {
        console.log('[OTPVerification] Demo OTP detected, simulating successful verification');
        toast({
          title: "Demo Login Successful!",
          description: "Using demo OTP for testing"
        });
        // Simulate successful auth for demo
        setTimeout(() => {
          navigate('/role-selection');
        }, 1000);
        return;
      }

      const result = await verifyOTP(phone, otpCode);
      
      if (result.success) {
        console.log('[OTPVerification] OTP verification successful');
        toast({
          title: "Phone Verified!",
          description: "Successfully authenticated"
        });
      } else {
        console.error('[OTPVerification] OTP verification failed:', result.error);
        setErrorState(result.error?.message || "Invalid OTP. Please try again.");
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error: any) {
      console.error('[OTPVerification] Exception during OTP verification:', error);
      setErrorState(error?.message || "Failed to verify OTP, please try again.");
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
      isVerifying.current = false;
    }
  };

  const handleResend = async () => {
    if (!phone) {
      setErrorState("Missing phone number, return to login.");
      return;
    }
    
    setLoading(true);
    setErrorState(null);
    
    try {
      console.log('[OTPVerification] Resending OTP to:', phone);
      await sendOTP(phone);
      setResendTimer(60);
      toast({
        title: "OTP Resent",
        description: "New verification code sent to your phone"
      });
    } catch (error: any) {
      console.error('[OTPVerification] Error resending OTP:', error);
      setErrorState("Failed to resend OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    localStorage.removeItem('fyke_phone');
    navigate('/login');
  };

  const handleDemoLogin = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    handleOTPComplete('123456');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-2 py-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 shadow-xl flex items-center justify-center mx-auto">
            <span className="text-3xl font-bold text-white" style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>fyke</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{t('otp.title', 'Verify Your Phone')}</h1>
            <p className="text-gray-600 text-sm leading-relaxed px-2">
              {t('otp.enterCode', 'Enter the 6-digit code sent to')}<br />
              <span className="font-semibold text-gray-800">+91 {phone}</span>
            </p>
          </div>
        </div>

        <Card className="p-4 sm:p-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl">
          <div className="space-y-5 sm:space-y-6">
            <div className="flex justify-center px-2">
              <div className="w-full max-w-xs">
                <EnhancedOTPInput
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleOTPComplete}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs sm:text-sm text-gray-500">{t('otp.auto', 'Code will be verified automatically')}</p>
              </div>
            </div>

            {errorState && (
              <div className="text-center text-xs sm:text-sm text-red-500 min-h-[20px]">{errorState}</div>
            )}

            <div className="text-center">
              {resendTimer > 0 ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-xs sm:text-sm text-gray-500">
                    {t('otp.resendIn', 'Resend in')} {resendTimer}s
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors disabled:opacity-50"
                >
                  {t('otp.resendBtn', 'Resend OTP')}
                </button>
              )}
            </div>

            <div className="flex flex-col space-y-2 pt-2 sm:pt-4">
              <Button
                onClick={handleDemoLogin}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                Demo Login (Use OTP: 123456)
              </Button>
              <Button
                variant="outline"
                onClick={handleBackToLogin}
                className="w-full"
                disabled={loading}
              >
                {t('otp.backToLogin', 'Back to Login')}
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center space-y-2 px-2 sm:px-4">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <span className="text-sm">🛡️</span>
            <span className="text-xs sm:text-sm font-medium">{t('otp.secure', 'Secure Verification')}</span>
          </div>
          <p className="text-xs text-gray-500">
            {t('otp.safe', 'This helps us keep your account safe and secure')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
