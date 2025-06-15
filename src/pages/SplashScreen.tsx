
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        // Determine where to navigate based on user state
        if (!user) {
          navigate('/');
        } else if (!user.role) {
          navigate('/role-selection');
        } else if (user.role === 'jobseeker' && !user.profileComplete) {
          navigate('/profile-setup');
        } else {
          navigate('/home');
        }
      }
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="w-32 h-32 mb-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl">
        <span className="text-5xl font-black text-white tracking-tight">f</span>
      </div>
      
      {/* App Name */}
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">fyke</h1>
      <p className="text-gray-600 text-lg mb-8">Find work. Find workers.</p>
      
      {/* Loading Animation */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      
      {/* Version */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-400 text-sm">Version 1.0.0</p>
        <p className="text-gray-400 text-xs mt-1">Connecting opportunities</p>
      </div>
    </div>
  );
};

export default SplashScreen;
