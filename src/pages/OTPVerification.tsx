
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const phone = localStorage.getItem('fyke_phone');
    if (!phone) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all fields are filled
    if (newOtp.every(digit => digit !== '') && value) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    if (code.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const phone = localStorage.getItem('fyke_phone') || '';
      await login(phone, code);
      navigate('/home');
      toast({
        title: "Welcome to Fyke!",
        description: "Your account has been verified successfully"
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setResendTimer(60);
    toast({
      title: "OTP Resent",
      description: "New verification code sent to your phone"
    });
  };

  const phone = localStorage.getItem('fyke_phone');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-white text-xl font-bold">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verify Your Phone</h1>
            <p className="text-gray-600">
              Enter the 6-digit code sent to<br />
              <span className="font-semibold">+91 {phone}</span>
            </p>
          </div>
        </div>

        {/* OTP Card */}
        <Card className="p-6 shadow-xl border-0">
          <div className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  maxLength={1}
                />
              ))}
            </div>

            {/* Auto-verification note */}
            <p className="text-center text-sm text-gray-500">
              Code will be verified automatically
            </p>

            {/* Manual verify button */}
            <Button
              onClick={() => handleVerify()}
              disabled={otp.some(digit => digit === '') || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Code'
              )}
            </Button>

            {/* Resend */}
            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend code in {resendTimer}s
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
          <p className="text-xs text-gray-500">
            This helps us keep your account safe and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
