
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('fyke_phone', phone);
      navigate('/otp-verification');
      toast({
        title: "OTP Sent",
        description: "Verification code sent to your phone number"
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-white text-xl font-bold">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">Enter your phone number to continue</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="p-6 shadow-xl border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  +91
                </span>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit number"
                  className="pl-12 py-3 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll send you a verification code
              </p>
            </div>

            <Button
              type="submit"
              disabled={phone.length !== 10 || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending OTP...</span>
                </div>
              ) : (
                'Continue with Phone'
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-lg">🔒</span>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Secure & Private</h4>
                <p className="text-xs text-blue-700 mt-1">
                  We use industry-standard encryption to protect your data and never share your information without consent.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-lg">⚡</span>
            </div>
            <p className="text-xs text-gray-600">Instant<br />Matching</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-lg">🛡️</span>
            </div>
            <p className="text-xs text-gray-600">Verified<br />Profiles</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-lg">💰</span>
            </div>
            <p className="text-xs text-gray-600">Fair<br />Payments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
