
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getResponsiveTextSize } from '@/utils/textSizing';

interface WorkerActionsProps {
  id: string | number;
  name: string;
  hourlyRate: number;
}

const WorkerActions: React.FC<WorkerActionsProps> = ({
  id,
  name,
  hourlyRate
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hireRequested, setHireRequested] = useState(false);

  const handleHire = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hireRequested) {
      setHireRequested(true);
      toast({
        title: 'Hire request sent',
        description: `You requested to hire ${name}.`,
        duration: 3000,
      });
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: 'Calling...',
      description: `Calling ${name}`,
    });
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/messages', {
      state: {
        workerId: id,
        workerName: name,
      },
    });
  };

  const hireFontSize = getResponsiveTextSize(String(hourlyRate), {
    baseSize: 12,
    minSize: 10,
    maxSize: 13
  });

  return (
    <div className="flex flex-col items-end justify-center pl-3 min-w-[75px] w-full max-w-[90px]">
      {/* Helper text */}
      <div className="mb-1 w-full text-[9px] text-center text-gray-400 font-medium leading-tight">
        tap to request
      </div>
      
      {/* Hire Button - 40px height as requested */}
      <Button
        variant={hireRequested ? 'secondary' : 'default'}
        className={`h-10 w-full px-2 mb-1.5 rounded-lg font-semibold shadow transition-all duration-150 border-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 flex items-center justify-center
          ${hireRequested
            ? 'bg-green-100 text-green-700 cursor-default'
            : 'bg-gradient-to-tr from-blue-500 via-sky-400 to-indigo-400 text-white hover:scale-105 hover:bg-blue-600'
          }`}
        tabIndex={-1}
        disabled={hireRequested}
        style={{
          letterSpacing: '0.01em',
          boxShadow: '0 2px 8px 0 #2563eb15',
          fontSize: hireFontSize
        }}
        onClick={handleHire}
      >
        {hireRequested ? 'Requested' : `₹${hourlyRate}`}
      </Button>
      
      {/* Call Button - 40px height */}
      <Button
        variant="outline"
        className="mb-1.5 h-10 w-full px-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 flex items-center justify-center"
        onClick={handleCall}
        tabIndex={-1}
      >
        <Phone className="w-3 h-3 mr-1" />
        <span>Call</span>
      </Button>
      
      {/* Chat Button - 40px height */}
      <Button
        variant="outline"
        className="h-10 w-full px-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 flex items-center justify-center"
        onClick={handleChat}
        tabIndex={-1}
      >
        <MessageCircle className="w-3 h-3 mr-1" />
        <span>Chat</span>
      </Button>
    </div>
  );
};

export default WorkerActions;
