
import React from 'react';
import { ArrowRight, Users, Briefcase, Star, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Hero, 
  Heading2, 
  Heading3, 
  Body, 
  Caption, 
  Container, 
  HierarchyCard, 
  HierarchyButton 
} from '@/components/ui/visual-hierarchy';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section - Maximum Visual Weight */}
      <section className="pt-16 pb-24">
        <Container size="content" spacing="large">
          <div className="text-center">
            <Hero className="mb-6 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              Connect. Work. Thrive.
            </Hero>
            <Body className="mb-8 text-xl text-gray-600 max-w-2xl mx-auto">
              India's most trusted platform connecting skilled workers with opportunities. 
              Find work or hire talent in minutes.
            </Body>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <HierarchyButton 
                variant="primary" 
                size="large"
                onClick={() => navigate('/language-selection')}
                className="w-full sm:w-auto"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </HierarchyButton>
              <HierarchyButton 
                variant="secondary" 
                size="large"
                className="w-full sm:w-auto"
              >
                Learn More
              </HierarchyButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section - Secondary Visual Weight */}
      <section className="py-16 bg-white">
        <Container size="wide" spacing="large">
          <div className="text-center mb-16">
            <Heading2 className="mb-4">Why Choose Fyke?</Heading2>
            <Body className="text-gray-600 max-w-2xl mx-auto">
              Built for India's workforce with features that matter most to workers and employers.
            </Body>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <HierarchyCard interactive elevation="medium">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <Heading3 className="mb-4">For Job Seekers</Heading3>
                <Body className="mb-6">
                  Find daily wage work, part-time jobs, and full-time opportunities in your area.
                </Body>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Quick job applications
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Daily payment options
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Verified employers
                  </li>
                </ul>
              </div>
            </HierarchyCard>

            <HierarchyCard interactive elevation="medium">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8 text-green-600" />
                </div>
                <Heading3 className="mb-4">For Employers</Heading3>
                <Body className="mb-6">
                  Hire skilled workers instantly with our verified talent pool and smart matching.
                </Body>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Instant worker matching
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Secure payments
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Quality assurance
                  </li>
                </ul>
              </div>
            </HierarchyCard>

            <HierarchyCard interactive elevation="medium">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <Heading3 className="mb-4">Trust & Safety</Heading3>
                <Body className="mb-6">
                  Built with security and trust at the core, ensuring safe transactions for everyone.
                </Body>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Identity verification
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Secure payments
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    24/7 support
                  </li>
                </ul>
              </div>
            </HierarchyCard>
          </div>
        </Container>
      </section>

      {/* Stats Section - Supporting Visual Weight */}
      <section className="py-16 bg-gray-900 text-white">
        <Container size="content" spacing="medium">
          <div className="text-center mb-12">
            <Heading2 className="text-white mb-4">Trusted by Thousands</Heading2>
            <Body className="text-gray-300">
              Join the growing community of workers and employers
            </Body>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <Caption className="text-gray-400">Active Workers</Caption>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <Caption className="text-gray-400">Employers</Caption>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">100K+</div>
              <Caption className="text-gray-400">Jobs Completed</Caption>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">4.8★</div>
              <Caption className="text-gray-400">Average Rating</Caption>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section - Final Focus Point */}
      <section className="py-16">
        <Container size="narrow" spacing="medium">
          <HierarchyCard elevation="high" className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <Heading2 className="mb-4">Ready to Get Started?</Heading2>
            <Body className="mb-8 text-gray-600">
              Join thousands of workers and employers who trust Fyke for their daily work needs.
            </Body>
            <HierarchyButton 
              variant="accent" 
              size="large"
              onClick={() => navigate('/language-selection')}
              className="w-full sm:w-auto"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </HierarchyButton>
          </HierarchyCard>
        </Container>
      </section>

      {/* Footer - Minimal Visual Weight */}
      <footer className="py-8 bg-gray-50 border-t border-gray-200">
        <Container size="content">
          <div className="text-center">
            <Caption className="text-gray-500">
              © 2024 Fyke. Built for India's workforce.
            </Caption>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Index;
