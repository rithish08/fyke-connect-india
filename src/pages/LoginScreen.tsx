import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Phone } from "lucide-react";

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLocalization();
  const { sendOTP, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/role-selection');
    }
  }, [isAuthenticated, navigate]);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      toast({
        title: t('login.invalid_phone_title', 'Invalid Input'),
        description: t('login.invalid_phone_desc', 'Please enter a valid 10-digit phone number'),
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await sendOTP(phone);
      
      if (error) {
        toast({
          title: t('login.otp_send_error_title', 'Error'),
          description: t('login.otp_send_error_desc', 'Failed to send OTP. Please try again.'),
          variant: "destructive"
        });
        return;
      }

      toast({
        title: t('login.otp_sent_title', 'OTP Sent'),
        description: t('login.otp_sent_desc', `Verification code sent to +91 ${phone}`)
      });
      navigate('/otp-verification');
    } catch (error) {
      toast({
        title: t('login.otp_send_error_title', 'Error'),
        description: t('login.otp_send_error_desc', 'Failed to send OTP. Please try again.'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
                {t('login.subtitle', 'Enter your phone number to get started')}
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
            >
              {loading ? t('login.sending_otp', 'Sending...') : t('login.send_otp_btn', 'Send OTP')}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('login.terms', 'By continuing, you agree to our Terms of Service and Privacy Policy')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
