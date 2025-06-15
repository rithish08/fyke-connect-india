
import { useState, useEffect } from 'react';
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
  const navigate = useNavigate();
  const { verifyOTP, sendOTP, userProfile, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const phone = localStorage.getItem('fyke_phone');
    if (!phone) {
      navigate('/login');
      return;
    }

    // If user is already authenticated, redirect appropriately
    if (isAuthenticated && userProfile) {
      const selectedRole = localStorage.getItem('fyke_selected_role');
      
      if (!userProfile.role && selectedRole) {
        navigate('/role-selection');
      } else if (userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
        navigate('/profile-setup');
      } else if (userProfile.role) {
        navigate('/home');
      } else {
        navigate('/role-selection');
      }
    }
  }, [navigate, isAuthenticated, userProfile]);

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

    try {
      console.log('[OTPVerification] Submitting OTP verification:', otpCode);
      
      const result = await verifyOTP(otpCode);
      
      if (result.success) {
        console.log('[OTPVerification] OTP verification succeeded');
        
        // Clear phone from localStorage since we're now authenticated
        localStorage.removeItem('fyke_phone');
        
        // Check if role was pre-selected
        const selectedRole = localStorage.getItem('fyke_selected_role');
        
        if (selectedRole) {
          // Role was already selected, go to appropriate screen
          localStorage.removeItem('fyke_selected_role');
          if (selectedRole === 'employer') {
            navigate('/home');
          } else {
            navigate('/profile-setup');
          }
        } else {
          // No role selected, go to role selection
          navigate('/role-selection');
        }

        toast({
          title: "Phone Verified!",
          description: "Successfully authenticated"
        });
      } else {
        setOtp(['', '', '', '', '', '']);
        // Error toast is already shown by verifyOTP
      }
    } catch (error: any) {
      console.error('[OTPVerification] Verification Failed:', error);
      toast({
        title: "Verification Failed",
        description: error?.message || "Invalid OTP. Please try again.",
        variant: "destructive"
      });
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const phone = localStorage.getItem('fyke_phone');
    if (!phone) return;

    setLoading(true);
    try {
      await sendOTP(phone);
      setResendTimer(60);
      toast({
        title: "OTP Resent",
        description: "New verification code sent to your phone"
      });
    } catch (error) {
      console.error('Error resending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const phone = localStorage.getItem('fyke_phone');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* Hidden recaptcha container for Firebase */}
      <div id="recaptcha-container"></div>
      
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
                />
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-500">Code will be verified automatically</p>
              </div>
            </div>

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
