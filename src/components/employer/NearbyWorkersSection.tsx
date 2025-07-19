import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Helper: fetch requested profiles for the current employer
async function fetchRequestedProfiles(employerId) {
  // Find all applications sent by this employer with status 'requested' or 'pending'
  const { data, error } = await supabase
    .from('applications')
    .select('*, profiles:applicant_id(*)')
    .eq('employer_id', employerId)
    .in('status', ['requested', 'pending']);
  if (error) throw error;
  // Map to unique profiles
  const profiles = (data || [])
    .map(app => app.profiles)
    .filter(Boolean)
    .reduce((acc, profile) => {
      if (!acc.find(p => p.id === profile.id)) acc.push(profile);
      return acc;
    }, []);
  return profiles;
}

export const RequestedProfilesSection = () => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Track request state per profile (id -> bool)
  const [requestStates, setRequestStates] = useState({});

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchRequestedProfiles(user.id)
      .then(profiles => {
        setProfiles(profiles);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load requested profiles.');
        setLoading(false);
      });
  }, [user]);

  const handleRequest = (profileId) => {
    setRequestStates(prev => ({ ...prev, [profileId]: true }));
    // Optionally: send request to backend
  };
  const handleRevoke = (profileId) => {
    setRequestStates(prev => ({ ...prev, [profileId]: false }));
    // Optionally: send revoke to backend
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{t('home.requestedProfiles', 'Requested Profiles')}</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/search')}
          aria-label={t('home.viewAll', 'View All')}
        >
          {t('home.viewAll', 'View All')}
        </Button>
      </div>
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      )}
      {error && (
        <Card className="p-5 bg-red-50 border-red-200 rounded-xl flex items-center gap-4">
          <span className="text-red-600 font-bold">{error}</span>
        </Card>
      )}
      {!loading && !error && profiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map(profile => {
            const isRequested = requestStates[profile.id] ?? true; // default true for requested
            return (
              <div key={profile.id} className="bg-white border-2 border-black shadow-lg rounded-lg p-4 max-w-md mx-auto transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  {/* Left Section: Profile Image, Name, Role, Rating, Distance */}
                  <div className="flex items-center">
                    {/* Profile Image (Centered Vertically) */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 mr-4 flex-shrink-0">
                      <img
                        src={profile.profile_photo || 'https://placehold.co/200x200'}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Text Content */}
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{profile.name}</h2>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{profile.category || 'Construction'}</span>
                        <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">{profile.subcategory || 'Mason'}</div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 space-x-2 mt-2">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span className="ml-1">{profile.rating || '4.8'}</span>
                        </div>
                        <span className="text-green-500 font-bold">₹{profile.hourly_rate || '350'}/hr</span>
                        <span className="text-xs text-gray-500">{profile.distance || '1.2km'}</span>
                      </div>
                    </div>
                  </div>
                  {/* Right Section: Request Button + Delete Icon */}
                  <div className="flex flex-col items-end space-y-2">
                    {/* Availability Dot + Request Button (Vertically Aligned) */}
                    <div className="flex flex-col items-end space-y-1">
                      {!isRequested && (
                        <div className="flex items-center space-x-1 text-xs text-gray-600 self-end">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>Available</span>
                        </div>
                      )}
                      {/* Request / Requested Button with Delete Icon */}
                      <div className="flex items-center space-x-2">
                        {isRequested && (
                          <button
                            className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors duration-200 rounded-full p-1"
                            onClick={() => handleRevoke(profile.id)}
                            title="Revoke request"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                        <button
                          className={`bg-green-500 text-white px-4 py-2 rounded-full font-bold transition-colors duration-300 ${isRequested ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                          onClick={() => handleRequest(profile.id)}
                          disabled={isRequested}
                        >
                          {isRequested ? 'Requested' : 'Request'}
                        </button>
                      </div>
                    </div>
                    {/* Call & Chat Buttons (Visible Only After Request) */}
                    {isRequested && (
                      <div className="flex space-x-2">
                        <button className="bg-white text-black px-3 py-1.5 rounded-full flex items-center space-x-1 border border-gray-400 shadow-sm hover:bg-gray-100 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M19.5 3.5a2 2 0 00-1.41-1.41L17 2.5h-2A10 10 0 005 12.5v2a2 2 0 001.41 1.95L7 16.5a2 2 0 001.95 1.41A10 10 0 0019 8.05L19.5 7.5a2 2 0 001.41-1.95V3.5a2 2 0 00-2.41-2z" />
                          </svg>
                          <span>Call</span>
                        </button>
                        <button className="bg-white text-black px-3 py-1.5 rounded-full flex items-center space-x-1 border border-gray-400 shadow-sm hover:bg-gray-100 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                          </svg>
                          <span>Chat</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!loading && !error && profiles.length === 0 && (
        <Card className="p-8 text-center rounded-xl bg-gray-50">
          <h3 className="font-semibold text-gray-800">{t('home.noRequestedProfiles', 'No Requested Profiles')}</h3>
          <p className="text-sm text-gray-600 mt-2">{t('home.noRequestedProfilesDesc', 'You have not requested any worker profiles yet.')}</p>
          <Button onClick={() => navigate('/search')} className="mt-4">{t('home.browseAllWorkers', 'Browse All Workers')}</Button>
        </Card>
      )}
    </div>
  );
};
