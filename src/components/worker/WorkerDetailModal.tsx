
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, ArrowLeft, MessageCircle, Phone, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';

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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewFullProfile = () => {
    onClose();
    navigate(`/worker/${worker.id}`, {
      state: { worker }
    });
  };

  const handleHire = () => {
    onHire(worker.id);
    toast({
      title: "Hire Request Sent!",
      description: `Your hire request has been sent to ${worker.name}.`,
    });
    onClose();
  };

  const handleMessage = () => {
    onClose();
    navigate('/messages', { state: { workerId: worker.id, workerName: worker.name } });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0 rounded-3xl bg-white">
        {/* Header with Back Button */}
        <DialogHeader className="relative p-6 pb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-4">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src="/placeholder.svg" alt={worker.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                  {worker.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {worker.verificationLevel !== 'basic' && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-3 border-white">
                  <Shield className="w-4 h-4 text-white" fill="currentColor" />
                </div>
              )}
              {worker.isOnline && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{worker.name}</h2>
            <p className="text-gray-600 mb-2">{worker.category}</p>
            
            <div className="flex items-center justify-center space-x-1 mb-4">
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              <span className="font-bold text-lg text-gray-900">{worker.rating}</span>
              <span className="text-gray-500">({worker.completedJobs} reviews)</span>
            </div>

            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Available now
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">₹{worker.hourlyRate}</div>
              <div className="text-sm text-gray-500">per hour</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{worker.completedJobs}</div>
              <div className="text-sm text-gray-500">jobs done</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{worker.responseTime}</div>
              <div className="text-sm text-gray-500">response</div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {worker.skills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                >
                  {skill}
                </span>
              ))}
              {worker.skills.length > 4 && (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">
                  +{worker.skills.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Location & Availability */}
          <div className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-2xl mb-6">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">{worker.distance} away</div>
                <div className="text-sm text-gray-500">Current location</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 font-medium text-sm">{worker.responseTime}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-12 rounded-2xl border-2 border-gray-200 font-medium hover:border-gray-300"
                onClick={handleMessage}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat
              </Button>
              <Button 
                variant="outline" 
                className="h-12 rounded-2xl border-2 border-gray-200 font-medium hover:border-gray-300"
                onClick={handleViewFullProfile}
              >
                View Profile
              </Button>
            </div>
            
            <Button 
              onClick={handleHire}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
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
