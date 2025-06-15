
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, Briefcase, Shield, Star } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Fyke</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            India's most trusted gig economy platform. Connect with opportunities, 
            hire skilled workers, and grow your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              onClick={() => navigate('/auth')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/admin')}
            >
              <Shield className="mr-2 h-5 w-5" />
              Admin Access
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">For Job Seekers</h3>
              <p className="text-gray-600">
                Find flexible work opportunities across India. 
                From delivery to construction, tutoring to tech support.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Briefcase className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">For Employers</h3>
              <p className="text-gray-600">
                Hire verified, skilled workers for your projects. 
                Post jobs and connect with the right talent instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trusted Platform</h3>
              <p className="text-gray-600">
                Secure payments, verified profiles, and 24/7 support. 
                Your safety and success are our priorities.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Preview */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Delivery', icon: '🚚' },
              { name: 'Construction', icon: '🏗️' },
              { name: 'Cleaning', icon: '🧹' },
              { name: 'Transportation', icon: '🚗' },
              { name: 'Beauty & Wellness', icon: '💆‍♀️' }
            ].map((category) => (
              <Card key={category.name} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="text-center pt-4">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <p className="font-medium">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of users who trust Fyke for their gig economy needs.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            onClick={() => navigate('/auth')}
          >
            Create Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Fyke. All rights reserved. | Made for India's gig economy
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
