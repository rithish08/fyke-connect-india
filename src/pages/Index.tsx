import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserFlow } from '@/hooks/useUserFlow';
import { useNavigate } from 'react-router-dom';
import ShimmerLoader from '@/components/ui/ShimmerLoader';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase, Star, Shield } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const { determineNextScreen } = useUserFlow();
  const navigate = useNavigate();

  // Auto-redirect authenticated users to their proper flow
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const nextScreen = determineNextScreen();
      if (nextScreen && nextScreen !== '/login') {
        navigate(nextScreen, { replace: true });
      }
    }
  }, [isAuthenticated, loading, determineNextScreen, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <ShimmerLoader height={60} width="200px" />
      </div>
    );
  }

  // Only show landing page for unauthenticated users
  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 text-gray-900">
            Fyke Connect India
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            India's premier gig economy platform connecting skilled workers with local opportunities. 
            Find work, hire talent, and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/login')}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={() => navigate('/language')}
              variant="outline" 
              size="lg"
              className="border-2 border-blue-600 text-blue-700 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-blue-50"
            >
              Choose Language
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Find Skilled Workers</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect with verified professionals across construction, delivery, services, and more.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Discover Opportunities</h3>
            <p className="text-gray-600 leading-relaxed">
              Browse thousands of job opportunities in your area with flexible work arrangements.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Secure & Trusted</h3>
            <p className="text-gray-600 leading-relaxed">
              Verified profiles, secure payments, and rating system ensure quality connections.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Workers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
              <div className="text-gray-600">Jobs Posted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">20+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
              <div className="text-gray-600 flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                Rating
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of workers and employers building the future of work in India.
          </p>
          <Button 
            onClick={() => navigate('/login')}
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-xl"
          >
            Join Fyke Today <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
