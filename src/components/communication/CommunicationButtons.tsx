
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone } from 'lucide-react';
import { handlePhoneCall, handleInAppChat, handleEmployerContact } from '@/utils/communicationHandlers';

interface CommunicationButtonsProps {
  targetId: string;
  targetName: string;
  targetType: 'worker' | 'employer';
  phoneNumber?: string;
  size?: 'sm' | 'md';
  showCall?: boolean;
  showChat?: boolean;
  className?: string;
  context?: string; // Additional context like job title
}

const CommunicationButtons: React.FC<CommunicationButtonsProps> = ({
  targetId,
  targetName,
  targetType,
  phoneNumber,
  size = 'md',
  showCall = true,
  showChat = true,
  className = '',
  context
}) => {
  const navigate = useNavigate();

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (targetType === 'worker') {
      handleInAppChat(targetId, targetName, navigate, context);
    } else {
      handleEmployerContact(targetId, targetName, navigate, context);
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    handlePhoneCall(phoneNumber, targetName);
  };

  const buttonSize = size === 'sm' ? 'sm' : 'default';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className={`flex space-x-2 ${className}`}>
      {showChat && (
        <Button
          variant="outline"
          size={buttonSize}
          onClick={handleChat}
          className="flex items-center justify-center flex-1"
        >
          <MessageCircle className={iconSize} />
          {size === 'md' && <span className="ml-1">Chat</span>}
        </Button>
      )}
      {showCall && (
        <Button
          variant="outline"
          size={buttonSize}
          onClick={handleCall}
          className="flex items-center justify-center flex-1"
        >
          <Phone className={iconSize} />
          {size === 'md' && <span className="ml-1">Call</span>}
        </Button>
      )}
    </div>
  );
};

export default CommunicationButtons;
