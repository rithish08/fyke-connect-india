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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center mx-auto border border-gray-100">
            <span className="text-2xl font-bold text-gray-800">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500">Enter your phone number to continue</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="p-6 shadow border-gray-100 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  +91
                </span>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit number"
                  className="pl-12 py-3 text-lg rounded-2xl border border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-0"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                We'll send you a verification code
              </p>
            </div>

            <Button
              type="submit"
              disabled={phone.length !== 10 || loading}
              className={`w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-100 text-white font-medium py-3 rounded-2xl shadow transition-all duration-200`}
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
        </Card>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-lg text-gray-700">⚡</span>
            </div>
            <p className="text-xs text-gray-400">Instant<br />Matching</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-lg text-gray-700">🛡️</span>
            </div>
            <p className="text-xs text-gray-400">Verified<br />Profiles</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-lg text-gray-700">💰</span>
            </div>
            <p className="text-xs text-gray-400">Fair<br />Payments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
