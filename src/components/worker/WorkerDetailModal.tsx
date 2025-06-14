
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TrustScore from '@/components/trust/TrustScore';
import SkillBadge from '@/components/verification/SkillBadge';
import CommunicationButtons from '@/components/communication/CommunicationButtons';
import { Star, MapPin, Clock } from 'lucide-react';

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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Worker Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">
                {worker.name[0]}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">{worker.name}</h3>
              <p className="text-gray-600">{worker.category}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`${worker.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {worker.isOnline ? 'Online' : 'Offline'}
                </Badge>
                <Badge variant="outline">{worker.verificationLevel}</Badge>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <span className="font-bold">{worker.rating}</span>
              </div>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
            <div>
              <div className="font-bold">{worker.completedJobs}</div>
              <p className="text-xs text-gray-500">Jobs Done</p>
            </div>
            <div>
              <div className="font-bold">₹{worker.hourlyRate}/hr</div>
              <p className="text-xs text-gray-500">Rate</p>
            </div>
          </div>

          {/* Trust Score */}
          <TrustScore
            score={worker.rating}
            verificationLevel={worker.verificationLevel}
            completedJobs={worker.completedJobs}
            responseTime={worker.responseTime}
          />

          {/* Skills */}
          <div>
            <h4 className="font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill, idx) => (
                <SkillBadge
                  key={idx}
                  skill={skill}
                  level={idx === 0 ? 'expert' : 'intermediate'}
                  verified={idx < 2}
                />
              ))}
            </div>
          </div>

          {/* Location & Response */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{worker.distance} away</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Responds {worker.responseTime}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <CommunicationButtons
              targetId={worker.id}
              targetName={worker.name}
              targetType="worker"
              className="justify-center"
            />
            
            <Button 
              onClick={() => onHire(worker.id)}
              className="w-full bg-green-600 hover:bg-green-700"
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
