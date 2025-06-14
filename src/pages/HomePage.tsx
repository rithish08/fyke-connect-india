
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import JobSeekerHome from '@/components/JobSeekerHome';
import EmployerHome from '@/components/EmployerHome';
import CompactRoleSwitcher from '@/components/CompactRoleSwitcher';
import SmartJobRecommendations from '@/components/matching/SmartJobRecommendations';
import TrustVerificationBadge from '@/components/trust/TrustVerificationBadge';
import UserLevel from '@/components/gamification/UserLevel';
import QuickChatPreview from '@/components/communication/QuickChatPreview';
import CommunityTestimonials from '@/components/social/CommunityTestimonials';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Shield, Trophy, MessageCircle, Users } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const { translateText } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {translateText('common.loading', 'Loading...')}
          </h1>
        </div>
      </div>
    );
  }

  const isJobSeeker = user.role === 'jobseeker';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Role Switcher */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {translateText('home.welcome', 'Welcome')}, {user.name || 'User'}!
              </h1>
              {isJobSeeker && (
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Smart Matching Enabled
                  </span>
                </div>
              )}
            </div>
            <CompactRoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Enhanced Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <span>🏠</span>
              <span>Home</span>
            </TabsTrigger>
            <TabsTrigger value="smart" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Smart</span>
            </TabsTrigger>
            <TabsTrigger value="trust" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Trust</span>
            </TabsTrigger>
            <TabsTrigger value="level" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Level</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Community</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            {isJobSeeker ? <JobSeekerHome /> : <EmployerHome />}
            
            {/* Quick Chat Preview */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                Recent Conversations
              </h3>
              <div className="space-y-4">
                <QuickChatPreview
                  contactName="BuildTech Solutions"
                  contactRole="employer"
                  isOnline={true}
                  lastSeen="now"
                  unreadCount={2}
                />
                <QuickChatPreview
                  contactName="Amit Patel"
                  contactRole="worker"
                  isOnline={false}
                  lastSeen="2 hours ago"
                  unreadCount={0}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="smart" className="space-y-6">
            {isJobSeeker && <SmartJobRecommendations />}
            {!isJobSeeker && (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Smart Features Coming Soon
                </h3>
                <p className="text-gray-600">
                  AI-powered worker matching for employers is in development
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trust" className="space-y-6">
            <TrustVerificationBadge
              verificationLevel={user.verified ? 'verified' : 'basic'}
              score={4.8}
              completedJobs={23}
              responseTime="<2h"
            />
          </TabsContent>

          <TabsContent value="level" className="space-y-6">
            <UserLevel
              currentLevel={5}
              currentXP={750}
              nextLevelXP={1000}
              badges={['Fast Responder', 'Quality Work', 'Punctual', 'Customer Favorite', 'Skilled Pro', 'Reliable']}
              completedJobs={23}
            />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <CommunityTestimonials />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HomePage;
