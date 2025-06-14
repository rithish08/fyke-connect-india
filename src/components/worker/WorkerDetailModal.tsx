
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, CheckCircle, ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WorkerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: {
    id: string;
    name: string;
    category: string;
    skills: string[];
    rating: number;
    distance: string;
    responseTime: string;
    hourlyRate: number;
    isOnline: boolean;
    completedJobs: number;
    verificationLevel: 'basic' | 'verified' | 'premium';
  };
  onHire: (workerId: string) => void;
}

const WorkerDetailModal: React.FC<WorkerDetailModalProps> = ({
  isOpen,
  onClose,
  worker,
  onHire
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 rounded-3xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder.svg" alt={worker.name} />
                <AvatarFallback className="bg-gray-100 text-gray-600 text-2xl font-bold">
                  {worker.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {worker.verificationLevel !== 'basic' && (
                <div className="absolute -top-2 -right-2">
                  <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full" fill="currentColor" />
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{worker.name}</h2>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">Online</span>
              {worker.verificationLevel !== 'basic' && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Star className="w-4 h-4 text-gray-900" fill="currentColor" />
                <span className="font-bold text-lg">{worker.rating}</span>
              </div>
              <p className="text-sm text-gray-500">Rating</p>
            </div>
            <div>
              <div className="font-bold text-lg">{worker.completedJobs}</div>
              <p className="text-sm text-gray-500">jobs completed</p>
            </div>
            <div>
              <div className="font-bold text-lg">₹{worker.hourlyRate}/hr</div>
              <p className="text-sm text-gray-500">Rate</p>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h4 className="font-bold text-lg text-gray-900 mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Location & Response */}
          <div className="flex items-center justify-between py-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{worker.distance} away</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">< {worker.responseTime}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-12 rounded-2xl border-2 border-gray-200 font-medium"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat
              </Button>
              <Button 
                variant="outline" 
                className="h-12 rounded-2xl border-2 border-gray-200 font-medium"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call
              </Button>
            </div>
            
            <Button 
              onClick={() => onHire(worker.id)}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-lg font-medium"
            >
              Hire Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerDetailModal;
