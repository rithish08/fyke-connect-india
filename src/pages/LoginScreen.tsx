import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, MessageSquare } from "lucide-react";
import EnhancedOTPInput from '@/components/EnhancedOTPInput';
import { Haptics, NotificationType } from '@capacitor/haptics';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { t } = useLocalization();
  const { sendOTP, verifyOTP, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      toast({
        title: t('login.invalidInputTitle', 'Invalid Input'),
        description: t('login.invalidInputDesc', 'Please enter a valid 10-digit phone number'),
        variant: 'destructive'
      });
      if (window && 'navigator' in window && 'vibrate' in window.navigator) window.navigator.vibrate(100);
      try { await Haptics.notification({ type: NotificationType.Error }); } catch (e) { /* ignore */ }
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await sendOTP(phone);
      
      if (error) {
        toast({
          title: t('common.error', 'Error'),
          description: t('login.otpSendFailed', 'Failed to send OTP. Please try again.'),
          variant: 'destructive'
        });
        if (window && 'navigator' in window && 'vibrate' in window.navigator) window.navigator.vibrate(100);
        try { await Haptics.notification({ type: NotificationType.Error }); } catch (e) { /* ignore */ }
        return;
      }

      setShowOTP(true);
      setResendTimer(60);
      toast({
        title: t('login.otpSentTitle', 'OTP Sent'),
        description: t('login.otpSentDesc', 'Verification code sent to +91 {0}', [phone])
      });
      try { await Haptics.notification({ type: NotificationType.Success }); } catch (e) { /* ignore */ }
    } catch (error) {
      toast({
        title: t('common.error', 'Error'),
        description: t('login.otpSendFailed', 'Failed to send OTP. Please try again.'),
        variant: 'destructive'
      });
      if (window && 'navigator' in window && 'vibrate' in window.navigator) window.navigator.vibrate(100);
      try { await Haptics.notification({ type: NotificationType.Error }); } catch (e) { /* ignore */ }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPComplete = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      toast({
        title: t('login.invalidOtpTitle', 'Invalid OTP'),
        description: t('login.invalidOtpDesc', 'Please enter the complete 6-digit code'),
        variant: 'destructive'
      });
      if (window && 'navigator' in window && 'vibrate' in window.navigator) window.navigator.vibrate(100);
      try { await Haptics.notification({ type: NotificationType.Error }); } catch (e) { /* ignore */ }
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await verifyOTP(phone, otpCode);
      
      if (error) {
        toast({
          title: t('login.verificationFailedTitle', 'Verification Failed'),
          description: t('login.invalidOtpTryAgain', 'Invalid OTP. Please try again.'),
          variant: 'destructive'
        });
        setOtp(['', '', '', '', '', '']);
        if (window && 'navigator' in window && 'vibrate' in window.navigator) window.navigator.vibrate(100);
        try { await Haptics.notification({ type: NotificationType.Error }); } catch (e) { /* ignore */ }
        return;
      }

      toast({
        title: t('login.successTitle', 'Login Successful!'),
        description: t('login.successDesc', 'Welcome to Fyke Connect')
      });
      try { await Haptics.notification({ type: NotificationType.Success }); } catch (e) { /* ignore */ }
      
      // Add a small delay to allow auth state to update
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      toast({
        title: t('login.verificationFailedTitle', 'Verification Failed'),
        description: t('login.invalidOtpTryAgain', 'Invalid OTP. Please try again.'),
        variant: 'destructive'
      });
      setOtp(['', '', '', '', '', '']);
      if (window && 'navigator' in window && 'vibrate' in window.navigator) window.navigator.vibrate(100);
      try { await Haptics.notification({ type: NotificationType.Error }); } catch (e) { /* ignore */ }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const { error } = await sendOTP(phone);
    if (!error) {
      setResendTimer(60);
      toast({
        title: "OTP Resent",
        description: "New verification code sent to your phone"
      });
    }
  };

  const handleBack = () => {
    setShowOTP(false);
    setOtp(['', '', '', '', '', '']);
  };

  if (showOTP) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
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

          <Card className="p-6 shadow border-gray-100 bg-white">
            <div className="space-y-6">
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
                  <button onClick={handleResend} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          </Card>

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
      <Card className="w-full max-w-sm shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-8 space-y-6">
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
              aria-label={t('login.sendOtp', 'Send OTP')}
            >
              {loading ? t('login.sending', 'Sending...') : t('login.sendOtp', 'Send OTP')}
            </Button>
          </div>

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
