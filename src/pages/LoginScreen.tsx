
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from "@/contexts/LocalizationContext";
import { Phone, MessageSquare, User, Users2, User2 } from "lucide-react";

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'jobseeker' | 'employer' | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const { login, updateProfile } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'jobseeker' | 'employer') => {
    setSelectedRole(role);
    setShowRoleSelection(false);
  };

  const handleSendOTP = async () => {
    console.log('Sending OTP to:', phone);
    localStorage.setItem('fyke_phone', phone || '');
    localStorage.setItem('fyke_name', name || '');
    setOtpSent(true);
  };

  const handleVerifyOTP = async () => {
    try {
      await login(phone, otp);
      
      // Update user profile with name and role
      updateProfile({
        name: name,
        role: selectedRole!,
        profileComplete: selectedRole === 'employer' ? true : false
      });
      
      // Navigate based on role
      if (selectedRole === 'employer') {
        navigate('/home');
      } else {
        navigate('/profile-setup');
      }
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  // Role Selection Screen
  if (showRoleSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card className="w-full max-w-sm shadow-xl border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">f</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Choose Your Role</h1>
              <p className="text-gray-500 text-sm">How would you like to use Fyke?</p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => handleRoleSelection('jobseeker')}
                className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-center space-x-2"
              >
                <User2 className="w-5 h-5" />
                <span>I'm Looking for Work</span>
              </Button>
              <Button 
                onClick={() => handleRoleSelection('employer')}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-center space-x-2"
              >
                <Users2 className="w-5 h-5" />
                <span>I Want to Hire Workers</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                {otpSent ? 'Verify your number' : 'Enter your details to get started'}
              </p>
              {selectedRole && (
                <p className="text-xs text-blue-600 mt-1">
                  Signing up as {selectedRole === 'jobseeker' ? 'Job Seeker' : 'Employer'}
                </p>
              )}
            </div>
          </div>

          {/* Name and Phone Input */}
          {!otpSent ? (
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
          ) : (
            /* OTP Input */
            <div className="space-y-4">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  OTP sent to +91 {phone}
                </p>
              </div>
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="h-14 text-lg text-center tracking-wider border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setOtpSent(false)}
                  className="flex-1 h-12 rounded-xl border-gray-200"
                >
                  Change Number
                </Button>
                <Button 
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl"
                >
                  Verify
                </Button>
              </div>
            </div>
          )}

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
