
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/BottomNavigation';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

  // Mock worker data - in real app this would come from API
  const worker = {
    id: id || '1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    location: 'Mumbai, Maharashtra',
    distance: '2.3 km',
    category: 'Construction',
    skills: ['Cement Work', 'Brick Laying', 'Basic Plumbing', 'Painting'],
    experience: '5 years',
    rating: 4.8,
    reviewCount: 156,
    availability: 'available' as const,
    profilePhoto: null,
    verified: true,
    salaryExpectation: { min: 500, max: 800 },
    salaryPeriod: 'daily' as const,
    completedJobs: 89,
    description: 'Experienced construction worker with expertise in cement work and basic repairs. Reliable and punctual.',
    vehicle: null,
    languages: ['Hindi', 'English', 'Marathi']
  };

  const handleContact = () => {
    setShowContact(true);
  };

  const handleHire = () => {
    alert(`Sending hire request to ${worker.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            ←
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Worker Profile</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <ModernCard className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-xl font-bold text-gray-900">{worker.name}</h2>
                {worker.verified && (
                  <Badge className="bg-green-100 text-green-700 text-xs">✓ Verified</Badge>
                )}
              </div>
              <p className="text-gray-600 mb-2">{worker.category} Worker</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>📍 {worker.distance}</span>
                <span>⭐ {worker.rating} ({worker.reviewCount})</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  worker.availability === 'available' ? 'bg-green-100 text-green-700' :
                  worker.availability === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {worker.availability}
                </span>
              </div>
            </div>
          </div>
        </ModernCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <ModernCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{worker.completedJobs}</div>
            <div className="text-xs text-gray-500">Jobs Done</div>
          </ModernCard>
          <ModernCard className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{worker.experience}</div>
            <div className="text-xs text-gray-500">Experience</div>
          </ModernCard>
          <ModernCard className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">₹{worker.salaryExpectation.min}-{worker.salaryExpectation.max}</div>
            <div className="text-xs text-gray-500">Per {worker.salaryPeriod}</div>
          </ModernCard>
        </div>

        {/* Skills */}
        <ModernCard className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {skill}
              </Badge>
            ))}
          </div>
        </ModernCard>

        {/* About */}
        <ModernCard className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">About</h3>
          <p className="text-gray-700 leading-relaxed">{worker.description}</p>
        </ModernCard>

        {/* Languages */}
        <ModernCard className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {worker.languages.map((language, index) => (
              <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                {language}
              </Badge>
            ))}
          </div>
        </ModernCard>

        {/* Contact Information */}
        {showContact && (
          <ModernCard className="p-6 bg-green-50 border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span className="font-medium">{worker.phone}</span>
              </div>
              {worker.email && (
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>{worker.email}</span>
                </div>
              )}
            </div>
          </ModernCard>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-12 rounded-xl border-gray-300"
            onClick={handleContact}
          >
            {showContact ? '📞 Call Now' : '👁️ View Contact'}
          </Button>
          <Button 
            className="h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl"
            onClick={handleHire}
          >
            💼 Hire Now
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default WorkerProfile;
