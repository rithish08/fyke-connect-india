
import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLoginProtection } from '@/hooks/useLoginProtection';
import { useToast } from '@/hooks/use-toast';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog';
import EmptyState from '@/components/common/EmptyState';
import { Star, MapPin, MessageCircle, UserPlus } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  category: string;
  rating: number;
  location: string;
  distance: string;
  availability: 'available' | 'busy' | 'offline';
  skills: string[];
  hourlyRate: number;
}

const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    category: 'Construction',
    rating: 4.8,
    location: 'Mumbai, Maharashtra',
    distance: '2.3 km',
    availability: 'available',
    skills: ['Masonry', 'Plumbing', 'Electrical'],
    hourlyRate: 500
  },
  {
    id: '2',
    name: 'Amit Sharma',
    category: 'Delivery',
    rating: 4.6,
    location: 'Mumbai, Maharashtra',
    distance: '1.8 km',
    availability: 'available',
    skills: ['Two Wheeler', 'Fast Delivery'],
    hourlyRate: 300
  }
];

const EnhancedNearbyWorkersSection = () => {
  const { requireRole } = useLoginProtection();
  const { toast } = useToast();
  const { goTo } = useScreenNavigation();
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showHireConfirm, setShowHireConfirm] = useState(false);

  const handleHire = (worker: Worker) => {
    requireRole('employer', () => {
      setSelectedWorker(worker);
      setShowHireConfirm(true);
    }, "Only employers can hire workers");
  };

  const confirmHire = () => {
    if (selectedWorker) {
      // TODO: Implement actual hiring logic
      toast({
        title: "Hire Request Sent",
        description: `Your hire request has been sent to ${selectedWorker.name}.`
      });
    }
    setShowHireConfirm(false);
    setSelectedWorker(null);
  };

  const handleMessage = (worker: Worker) => {
    requireRole('employer', () => {
      goTo('/messages');
    }, "Please log in to contact workers");
  };

  const handleViewProfile = (worker: Worker) => {
    goTo(`/worker/${worker.id}`);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (mockWorkers.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="No Workers Nearby"
        description="There are currently no workers available in your area. Try expanding your search radius."
        actionText="Refresh"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Nearby Workers</h2>
          <Button variant="ghost" onClick={() => goTo('/search')}>
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {mockWorkers.map((worker) => (
            <ModernCard key={worker.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                    <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(worker.availability)}`} />
                  </div>
                  <p className="text-sm text-gray-600">{worker.category}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{worker.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">₹{worker.hourlyRate}/hr</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{worker.distance} away</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {worker.skills.slice(0, 2).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {worker.skills.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{worker.skills.length - 2} more
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleHire(worker)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={worker.availability === 'offline'}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Hire
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleMessage(worker)}
                  className="px-3"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleViewProfile(worker)}
                  className="px-3"
                >
                  View
                </Button>
              </div>
            </ModernCard>
          ))}
        </div>
      </div>

      <ConfirmationDialog
        open={showHireConfirm}
        onOpenChange={setShowHireConfirm}
        title="Confirm Hire Request"
        description={
          selectedWorker 
            ? `Send a hire request to ${selectedWorker.name} for ₹${selectedWorker.hourlyRate}/hr?`
            : ''
        }
        confirmText="Send Request"
        onConfirm={confirmHire}
      />
    </>
  );
};

export default EnhancedNearbyWorkersSection;
