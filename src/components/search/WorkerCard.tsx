import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Shield, Briefcase } from 'lucide-react';
import WorkerProfileModal from '@/components/modals/WorkerProfileModal';
import { Profile } from '@/hooks/useWorkers';
import { useLocalization } from '@/contexts/LocalizationContext';

interface WorkerCardProps {
  worker: Profile;
}

const WorkerCard = ({ worker }: WorkerCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLocalization();

  const availabilityColor: { [key: string]: string } = {
    available: 'bg-green-400',
    busy: 'bg-yellow-400',
    offline: 'bg-gray-300',
  };

  const availabilityText: { [key: string]: string } = {
    available: t('worker.available', 'Available'),
    busy: t('worker.busy', 'Busy'),
    offline: t('worker.offline', 'Offline'),
  };

  return (
    <>
      <ModernCard 
        className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 bg-white rounded-2xl"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                <AvatarImage src={worker.profile_photo || undefined} alt={worker.name || 'Worker'} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                  {worker.name?.split(' ').map((n) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              {worker.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Shield className="w-3 h-3 text-white" fill="currentColor" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate text-lg">{worker.name}</h3>
              
              <div className="text-sm text-gray-600 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-gray-400"/>
                {t('worker.generalWorker', 'General Worker')}
              </div>

              {worker.location && (
                <div className="text-sm text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{worker.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills - Using placeholder since skills field doesn't exist in DB */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <Badge 
              variant="secondary" 
              className="text-sm px-3 py-1 bg-blue-50 text-blue-800 border-blue-100 font-normal"
            >
              {t('skill.general', 'General Skills')}
            </Badge>
            <Badge 
              variant="secondary" 
              className="text-sm px-3 py-1 bg-green-50 text-green-800 border-green-100 font-normal"
            >
              {t('skill.available', 'Available')}
            </Badge>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${availabilityColor[worker.availability || 'offline']}`}></div>
              <span className={`text-sm font-semibold text-gray-700`}>
                {availabilityText[worker.availability || 'offline']}
              </span>
            </div>
            <Button
              size="sm"
              className="h-9 px-4 text-sm bg-blue-600 hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              {t('worker.viewProfile', 'View Profile')}
            </Button>
          </div>
        </div>
      </ModernCard>
      <WorkerProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workerId={worker.id}
      />
    </>
  );
};

export default WorkerCard;
