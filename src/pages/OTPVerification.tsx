
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import EnhancedOTPInput from '@/components/EnhancedOTPInput';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [errorState, setErrorState] = useState<string | null>(null);
  const navigate = useNavigate();
  const { verifyOTP, sendOTP, userProfile, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const didAutoNavigate = useRef(false);

  const phone = localStorage.getItem('fyke_phone');

  // Main onboarding/correct auth flow
  useEffect(() => {
    // No phone, go back to login
    if (!phone) {
      navigate('/login');
      return;
    }
    // Successful login and profile, navigate away by role
    if (isAuthenticated && user && userProfile && !didAutoNavigate.current) {
      didAutoNavigate.current = true; // prevent racey double navigation
      localStorage.removeItem('fyke_phone');
      if (!userProfile.role) {
        navigate('/role-selection');
      } else if (userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
        navigate('/profile-setup');
      } else {
        navigate('/home');
      }
    }
  }, [isAuthenticated, user, userProfile, navigate, phone]);

  // Timer logic for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOTPComplete = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setErrorState(null);

    try {
      const result = await verifyOTP(otpCode);
      if (result.success) {
        toast({
          title: "Phone Verified!",
          description: "Successfully authenticated"
        });
        // auth navigation will happen automatically from useEffect above
      } else {
        setErrorState(result.error || "OTP verification failed. Please try again.");
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error: any) {
      setErrorState(error?.message || "Failed to verify OTP, please try again.");
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
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
      await sendOTP(phone);
      setResendTimer(60);
      toast({
        title: "OTP Resent",
        description: "New verification code sent to your phone"
      });
    } catch (error: any) {
      setErrorState("Failed to resend OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto border border-blue-100">
            <span className="text-2xl font-bold text-blue-600">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Phone</h1>
            <p className="text-gray-600 text-sm leading-relaxed px-2">
              Enter the 6-digit code sent to<br />
              <span className="font-semibold text-gray-800">+91 {phone}</span>
            </p>
          </div>
        </div>
        
        {/* OTP Card */}
        <Card className="p-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <div className="space-y-6">
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
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-500">Code will be verified automatically</p>
              </div>
            </div>
            
            {(errorState || !phone) && (
              <div className="text-center text-sm text-red-500">{errorState}</div>
            )}
            
            <div className="text-center">
              {resendTimer > 0 ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500">
                    Resend in {resendTimer}s
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors disabled:opacity-50"
                >
                  Resend OTP
                </button>
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex flex-col space-y-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('fyke_phone');
                  navigate('/login');
                }}
                className="w-full"
                disabled={loading}
              >
                Back to Login
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Security Info */}
        <div className="text-center space-y-2 px-4">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <span className="text-sm">🛡️</span>
            <span className="text-sm font-medium">Secure Verification</span>
          </div>
          <p className="text-xs text-gray-500">
            This helps us keep your account safe and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
