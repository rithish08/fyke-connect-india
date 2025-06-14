
import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, Shield, MessageCircle, Phone, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface WorkerCardProps {
  id: string | number;
  name: string;
  category: string;
  skills: string[];
  rating: number;
  completedJobs?: number;
  verificationLevel?: 'basic' | 'verified' | 'premium';
  responseTime?: string;
  distance?: string;
  hourlyRate?: number;
  isOnline?: boolean;
  profileImage?: string;
  onClick?: (worker: any) => void;
  showModal?: (worker: any) => void;
}

const WorkerCard: React.FC<WorkerCardProps> = ({
  id,
  name,
  category,
  skills = [],
  rating,
  completedJobs = 0,
  verificationLevel = 'basic',
  responseTime = '< 1hr',
  distance = '2km',
  hourlyRate = 300,
  isOnline = false,
  profileImage = "/placeholder.svg",
  onClick,
  showModal,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (showModal) {
      showModal({ id, name, category, skills, rating, completedJobs, verificationLevel, responseTime, distance, hourlyRate, isOnline, profileImage });
    } else if (onClick) {
      onClick({ id, name, category, skills, rating, completedJobs, verificationLevel, responseTime, distance, hourlyRate, isOnline, profileImage });
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Calling...",
      description: `Calling ${name}`,
    });
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/messages', { state: { workerId: id, workerName: name } });
  };

  const handleHire = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Hire Request Sent!",
      description: `Your hire request has been sent to ${name}.`,
    });
  };

  return (
    <div
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${name}`}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        {/* Profile Photo */}
        <div className="relative">
          <Avatar className="w-20 h-24 rounded-2xl border-2 border-gray-100">
            <AvatarImage src={profileImage} alt={name} className="object-cover rounded-2xl" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl rounded-2xl">
              {name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'N/A'}
            </AvatarFallback>
          </Avatar>
          
          {/* Online Status */}
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-3 border-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          )}
          
          {/* Verification Badge */}
          {verificationLevel !== 'basic' && (
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-3 border-white">
              <Shield className="w-4 h-4 text-white" fill="currentColor" />
            </div>
          )}
        </div>

        {/* Right Side Info */}
        <div className="flex items-center gap-2">
          {isOnline && (
            <Badge className="bg-green-100 text-green-700 text-sm px-3 py-1 font-semibold border border-green-200">
              online
            </Badge>
          )}
        </div>
      </div>

      {/* Name and Category with Rating */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name || 'Unknown Worker'}</h3>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-lg text-gray-600 font-medium">{category}</span>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
            <span className="font-bold text-lg text-gray-900">{rating}</span>
            <span className="text-gray-500">({completedJobs || 0})</span>
          </div>
        </div>
        
        {/* Distance Info */}
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-gray-900">₹ {hourlyRate}</span>
            <span className="text-sm text-gray-500">/hr</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-sm text-gray-500 py-2 font-medium">+{skills.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Hire Button - Combined with Rate */}
        <Button
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          onClick={handleHire}
          tabIndex={-1}
        >
          <UserPlus className="w-6 h-6" />
          Hire
        </Button>
        
        {/* Call and Chat Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl font-semibold text-gray-700 flex items-center justify-center gap-2"
            onClick={handleCall}
            tabIndex={-1}
          >
            <Phone className="w-5 h-5" />
            Call
          </Button>
          <Button
            variant="outline"
            className="h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl font-semibold text-gray-700 flex items-center justify-center gap-2"
            onClick={handleChat}
            tabIndex={-1}
          >
            <MessageCircle className="w-5 h-5" />
            Chat
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WorkerCard;
