
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, CheckCircle, ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNavigation from '@/components/BottomNavigation';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

  // Mock worker data - in real app this would come from API
  const worker = {
    id: id || '1',
    name: 'Sanjay Kumar',
    phone: '+91 98765 43210',
    email: 'sanjay.kumar@email.com',
    location: 'Mumbai, Maharashtra',
    distance: '3.8 km',
    category: 'Delivery',
    skills: ['Delivery Driver', 'Heavy Vehicle', 'Long Distance'],
    experience: '5 years',
    rating: 4.6,
    reviewCount: 156,
    availability: 'available' as const,
    profilePhoto: null,
    verified: true,
    hourlyRate: 480,
    completedJobs: 67,
    description: 'Experienced delivery driver with expertise in heavy vehicle operations and long distance transport. Reliable and punctual.',
    vehicle: 'Heavy Vehicle License',
    languages: ['Hindi', 'English', 'Marathi'],
    responseTime: '18 min',
    isOnline: true
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
      <div className="bg-white p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder.svg" alt={worker.name} />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-2xl font-bold">
                {worker.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {worker.verified && (
              <div className="absolute -top-2 -right-2">
                <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full" fill="currentColor" />
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{worker.name}</h1>
          
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-medium">Online</span>
            {worker.verified && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Star className="w-5 h-5 text-gray-900" fill="currentColor" />
                <span className="font-bold text-xl">{worker.rating}</span>
              </div>
              <p className="text-gray-500">Rating</p>
            </div>
            <div>
              <div className="font-bold text-xl text-gray-900">{worker.completedJobs}</div>
              <p className="text-gray-500">jobs completed</p>
            </div>
            <div>
              <div className="font-bold text-xl text-green-600">₹{worker.hourlyRate}/hr</div>
              <p className="text-gray-500">Rate</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Location & Response Time */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 font-medium">{worker.distance} away</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 font-medium">< {worker.responseTime}</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-3">About</h3>
          <p className="text-gray-700 leading-relaxed">{worker.description}</p>
        </div>

        {/* Contact Information */}
        {showContact && (
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <h3 className="font-bold text-lg text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{worker.phone}</span>
              </div>
              {worker.email && (
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>{worker.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12 rounded-2xl border-2 border-gray-200 font-medium"
              onClick={handleContact}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat
            </Button>
            <Button 
              variant="outline" 
              className="h-12 rounded-2xl border-2 border-gray-200 font-medium"
              onClick={handleContact}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call
            </Button>
          </div>
          
          <Button 
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-lg font-medium"
            onClick={handleHire}
          >
            Hire Now
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default WorkerProfile;
