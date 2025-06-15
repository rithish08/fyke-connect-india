
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAuth } from '@/contexts/AuthContext';
import { Phone } from "lucide-react";

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLocalization();
  const { sendOTP, userProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect them
    if (isAuthenticated && userProfile) {
      console.log('[LoginScreen] User already authenticated, redirecting...');
      if (userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
        navigate('/profile-setup');
      } else if (userProfile.role) {
        navigate('/home');
      } else {
        navigate('/role-selection');
      }
    }
  }, [isAuthenticated, userProfile, navigate]);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      return;
    }
    
    setLoading(true);
    try {
      console.log('[LoginScreen] Sending OTP to:', phone);
      
      // Store phone for later use
      localStorage.setItem('fyke_phone', phone);

      const result = await sendOTP(phone);
      if (result.success) {
        console.log('[LoginScreen] OTP sent successfully, navigating to verification');
        navigate('/otp-verification');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      {/* Hidden recaptcha container for Firebase */}
      <div id="recaptcha-container"></div>
      
      <Card className="w-full max-w-sm shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('login.title', 'Welcome to Fyke')}</h1>
              <p className="text-gray-500 text-sm">
                Enter your phone number to get started
              </p>
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                +91
              </div>
              <Input 
                type="tel" 
                placeholder="9876543210" 
                value={phone} 
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                className="pl-12 h-14 text-lg border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            
            <Button 
              onClick={handleSendOTP} 
              disabled={phone.length !== 10 || loading} 
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
