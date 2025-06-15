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

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('[LoginScreen] Sending OTP to:', phone);
      localStorage.setItem('fyke_phone', phone);
      const result = await sendOTP(phone);
      
      if (result.success) {
        console.log('[LoginScreen] OTP sent successfully');
        navigate('/otp-verification');
      } else {
        console.error('[LoginScreen] Failed to send OTP:', result.error);
        setError(result.error?.message || "Failed to send OTP. Please try again.");
        localStorage.removeItem('fyke_phone');
      }
    } catch (error: any) {
      console.error('[LoginScreen] Exception sending OTP:', error);
      setError("Something went wrong. Please try again.");
      localStorage.removeItem('fyke_phone');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    if (error) setError(null); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center px-6">
      <div className="max-w-sm mx-auto w-full">
        <ModernCard variant="elevated" className="p-8 shadow-2xl">
          {/* Header section with logo/icon */}
          <div className="text-center space-y-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Fyke</h1>
              <p className="text-gray-600 leading-relaxed">
                Sign in with your phone number to continue
              </p>
            </div>
          </div>
          {/* Phone Input */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                +91
              </div>
              <Input 
                type="tel" 
                placeholder="Enter your phone number" 
                value={phone} 
                onChange={handlePhoneChange}
                className="pl-14 h-14 text-lg border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" 
                disabled={loading}
                autoFocus
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}
            <Button 
              onClick={handleSendOTP} 
              disabled={phone.length !== 10 || loading} 
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                'Send OTP'
              )}
            </Button>
          </div>
          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500 leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default LoginScreen;
