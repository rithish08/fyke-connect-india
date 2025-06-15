
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAuth } from '@/contexts/AuthContext';
import { Phone } from "lucide-react";
import EnhancedOTPInput from '@/components/EnhancedOTPInput';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { t } = useLocalization();
  const { sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      return;
    }
    
    setLoading(true);
    try {
      // Store phone for later use
      localStorage.setItem('fyke_phone', phone);

      const result = await sendOTP(phone);
      if (result.success) {
        setShowOTP(true);
        setResendTimer(60);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPComplete = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await verifyOTP(otpCode);
      if (result.success) {
        navigate('/role-selection');
      } else {
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const result = await sendOTP(phone);
      if (result.success) {
        setResendTimer(60);
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowOTP(false);
    setOtp(['', '', '', '', '', '']);
  };

  if (showOTP) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        {/* Hidden recaptcha container for Firebase */}
        <div id="recaptcha-container"></div>
        
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center mx-auto border border-gray-100">
              <span className="text-2xl font-bold text-gray-800">F</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Verify Your Phone</h1>
              <p className="text-gray-500">
                Enter the 6-digit code sent to<br />
                <span className="font-semibold text-gray-700">+91 {phone}</span>
              </p>
            </div>
          </div>

          {/* OTP Card */}
          <Card className="p-6 shadow border-gray-100 bg-white">
            <div className="space-y-6">
              {/* Enhanced OTP Input */}
              <EnhancedOTPInput value={otp} onChange={setOtp} onComplete={handleOTPComplete} />

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-500">Code will be verified automatically</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={handleBack} className="text-sm text-gray-600 hover:text-gray-800">
                  ← Change Number
                </button>
                
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-400">
                    Resend in {resendTimer}s
                  </p>
                ) : (
                  <button 
                    onClick={handleResend} 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          </Card>

          {/* Security Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <span className="text-sm">🛡️</span>
              <span className="text-sm font-medium">Secure Verification</span>
            </div>
            <p className="text-xs text-gray-400">
              This helps us keep your account safe and secure
            </p>
          </div>
        </div>
      </div>
    );
  }

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
