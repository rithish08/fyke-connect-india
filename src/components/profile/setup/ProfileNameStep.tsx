
import React, { useState } from 'react';
import { ArrowLeft, User } from "lucide-react";
import { AestheticCard } from '@/components/ui/aesthetic-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProfileNameStepProps {
  onSubmit: (name: string) => void;
  initialName: string;
}

const ProfileNameStep = ({ onSubmit, initialName }: ProfileNameStepProps) => {
  const [localName, setLocalName] = useState(initialName);
  const navigate = useNavigate();

  const handleNameSubmit = () => {
    if (!localName.trim()) return;
    onSubmit(localName.trim());
  };
  
  const handleBack = () => {
    navigate('/role-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="w-full max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-105"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Profile Setup
            </span>
          </div>
          <div className="w-12 h-12"></div>
        </div>

        {/* Name Input Card */}
        <AestheticCard variant="glass" className="shadow-xl border-0 p-6">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your name?</h2>
              <p className="text-gray-600">This will help employers know who you are</p>
            </div>
            
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your full name"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="h-14 text-lg border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
              />
              
              <Button 
                onClick={handleNameSubmit}
                disabled={!localName.trim()}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg"
                aria-label="Continue"
              >
                Continue
              </Button>
            </div>
          </div>
        </AestheticCard>
      </div>
    </div>
  );
};

export default ProfileNameStep;
