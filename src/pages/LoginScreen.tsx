
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModernCard } from '@/components/ui/modern-card';
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAuth } from '@/contexts/AuthContext';
import { Phone } from "lucide-react";

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocalization();
  const { sendOTP, userProfile, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[LoginScreen] Auth state check:', { isAuthenticated, user: !!user, userProfile });
    
    if (isAuthenticated && user && userProfile) {
      console.log('[LoginScreen] User already authenticated, determining redirect');
      
      if (!userProfile.role) {
        console.log('[LoginScreen] No role, redirecting to role selection');
        navigate('/role-selection');
      } else if (userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
        console.log('[LoginScreen] Incomplete jobseeker profile, redirecting to setup');
        navigate('/profile-setup');
      } else {
        console.log('[LoginScreen] Complete profile, redirecting to home');
        navigate('/home');
      }
    }
  }, [isAuthenticated, user, userProfile, navigate]);

  // Clear phone field (for usability after back navigation)
  useEffect(() => {
    setPhone('');
    setError(null);
  }, []);

  const handleSendOTP = async () => {
    if (phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number starting with 6-9");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      localStorage.setItem('fyke_phone', phone);
      const result = await sendOTP(phone);

      if (result.success) {
        navigate('/otp-verification');
      } else {
        setError(result.error?.message || "Failed to send OTP. Please try again.");
        localStorage.removeItem('fyke_phone');
      }
    } catch (error: any) {
      setError("Something went wrong. Please try again.");
      localStorage.removeItem('fyke_phone');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center px-2 sm:px-4">
      <div className="max-w-sm mx-auto w-full">
        <ModernCard variant="elevated" className="px-4 sm:px-8 py-8 shadow-2xl rounded-3xl">
          <div className="text-center space-y-5 mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-3">Welcome to Fyke</h1>
              <p className="text-gray-600 leading-relaxed text-base">Sign in with your phone number to continue</p>
            </div>
          </div>
          {/* Divider for visual structure on mobile */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 border-t border-gray-200" />
            <span className="mx-3 text-xs text-gray-400">OR</span>
            <div className="w-12 border-t border-gray-200" />
          </div>
          {/* Phone Input */}
          <div className="space-y-5">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none pointer-events-none text-base">+91</div>
              <Input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter your phone number"
                value={phone}
                onChange={handlePhoneChange}
                className="pl-14 h-14 sm:h-16 text-lg border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-gray-50 transition-all"
                disabled={loading}
                autoFocus
                pattern="[6-9]{1}[0-9]{9}"
                aria-label="Phone number"
              />
            </div>
            {error && <div className="text-sm text-red-500 text-center min-h-[20px]">{error}</div>}
            <Button
              onClick={handleSendOTP}
              disabled={phone.length !== 10 || loading}
              className="w-full h-14 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
              aria-label="Send OTP"
              style={{ minHeight: 56, fontSize: 18 }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending…</span>
                </div>
              ) : (
                'Send OTP'
              )}
            </Button>
          </div>
          {/* Accessibility: Add spacer for safe-tap zone on mobile */}
          <div className="h-5" />
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500 leading-relaxed">
              By continuing, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};
export default LoginScreen;

