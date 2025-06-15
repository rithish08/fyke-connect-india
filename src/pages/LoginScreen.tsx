
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalization } from "@/contexts/LocalizationContext";
import { Phone, MessageSquare, User } from "lucide-react";

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const { t } = useLocalization();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    console.log('Sending OTP to:', phone);
    localStorage.setItem('fyke_phone', phone || '');
    localStorage.setItem('fyke_name', name || '');
    navigate('/otp-verification');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
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
                Enter your details to get started
              </p>
            </div>
          </div>

          {/* Name and Phone Input */}
          <div className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-12 h-14 text-lg border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Phone Input */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                +91
              </div>
              <Input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="pl-12 h-14 text-lg border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <Button 
              onClick={handleSendOTP} 
              disabled={phone.length !== 10 || !name.trim()}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg"
            >
              Send OTP
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
