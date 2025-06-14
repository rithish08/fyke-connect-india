
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Shield, MessageCircle, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';

interface WorkerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: any;
}

const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({ isOpen, onClose, worker }) => {
  const { toast } = useToast();
  const [showContact, setShowContact] = useState(false);

  const handleHire = () => {
    toast({
      title: "Hire Request Sent!",
      description: `Your hire request has been sent to ${worker?.name}. They will respond soon.`,
    });
    onClose();
  };

  const handleMessage = () => {
    toast({
      title: "Opening Chat",
      description: "Starting conversation with worker.",
    });
    onClose();
  };

  const handleCall = () => {
    if (worker?.phone) {
      window.open(`tel:${worker.phone}`, '_self');
    } else {
      toast({
        title: "Contact Information",
        description: "Phone number not available. Please use the message feature.",
      });
    }
  };

  if (!worker) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-3xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-t-3xl">
          <DialogHeader>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AvatarImage src="/placeholder.svg" alt={worker.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                    {worker.name?.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {worker.verificationLevel && worker.verificationLevel !== 'basic' && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Shield className="w-3 h-3 text-white" fill="currentColor" />
                  </div>
                )}
                {worker.isOnline && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <DialogTitle className="text-xl font-bold text-gray-900 mb-1">{worker.name}</DialogTitle>
              <p className="text-gray-600 mb-2">{worker.category}</p>
              
              <div className="flex items-center justify-center space-x-1 mb-3">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="font-bold text-lg text-gray-900">{worker.rating}</span>
                <span className="text-gray-500">({worker.reviewCount || worker.completedJobs} reviews)</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-600 font-medium text-sm">Available now</span>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 rounded-2xl p-4">
            <div>
              <div className="text-lg font-bold text-gray-900">₹{worker.hourlyRate}</div>
              <div className="text-xs text-gray-500">per hour</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{worker.completedJobs}</div>
              <div className="text-xs text-gray-500">jobs done</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{worker.responseTime}</div>
              <div className="text-xs text-gray-500">response</div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {worker.skills?.map((skill: string, index: number) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Location & Availability */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
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
          </div>

          {/* About */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed">{worker.description}</p>
          </div>

          {/* Contact Information */}
          {showContact && (
            <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900">{worker.phone}</span>
                </div>
                {worker.email && (
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📧</span>
                    <span className="text-gray-900">{worker.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 rounded-b-3xl">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-12 rounded-xl border-2 border-gray-200 font-medium hover:border-gray-300"
                onClick={handleMessage}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat
              </Button>
              <Button 
                variant="outline" 
                className="h-12 rounded-xl border-2 border-gray-200 font-medium hover:border-gray-300"
                onClick={handleCall}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call
              </Button>
            </div>
            
            <Button 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={handleHire}
            >
              Hire Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerProfileModal;
