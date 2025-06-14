
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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

  return (
    <div className="flex flex-col items-end justify-center pl-4 min-w-[85px] w-full max-w-[140px]">
      {/* Helper text */}
      <div className="mb-1 w-full text-[10px] text-left text-gray-400 font-medium leading-tight" style={{ lineHeight: 1.1, marginBottom: 3 }}>
        click to request
      </div>
      
      {/* Hire Button */}
      <Button
        variant={hireRequested ? 'secondary' : 'default'}
        className={`h-14 w-[70px] min-w-[70px] max-w-[110px] px-2 py-1 mb-1 rounded-lg font-semibold shadow transition-all duration-150 border-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400
          ${hireRequested
            ? 'bg-green-100 text-green-700 cursor-default'
            : 'bg-gradient-to-tr from-blue-500 via-sky-400 to-indigo-400 text-white hover:scale-105 hover:bg-blue-600'
          }`}
        tabIndex={-1}
        disabled={hireRequested}
        style={{
          letterSpacing: '0.01em',
          boxShadow: '0 4px 16px 0 #2563eb20',
          fontSize: !hireRequested && String(hourlyRate).length > 10 ? '11px' : '12px',
          minHeight: '56px',
          minWidth: '70px'
        }}
        onClick={handleHire}
      >
        {hireRequested ? 'Requested' : `₹${hourlyRate}`}
      </Button>
      
      {/* Call Button */}
      <Button
        variant="outline"
        className="mb-1 h-10 w-[70px] min-w-[70px] max-w-[110px] px-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 flex items-center justify-center"
        onClick={handleCall}
        tabIndex={-1}
      >
        <Phone className="w-3.5 h-3.5 mr-1" />
        Call
      </Button>
      
      {/* Chat Button */}
      <Button
        variant="outline"
        className="h-10 w-[70px] min-w-[70px] max-w-[110px] px-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 flex items-center justify-center"
        onClick={handleChat}
        tabIndex={-1}
      >
        <MessageCircle className="w-3.5 h-3.5 mr-1" />
        Chat
      </Button>
    </div>
  );
};

export default WorkerActions;
