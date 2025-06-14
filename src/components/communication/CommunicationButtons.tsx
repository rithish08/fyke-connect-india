
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone } from 'lucide-react';

interface CommunicationButtonsProps {
  targetId: string;
  targetName: string;
  targetType: 'worker' | 'employer';
  size?: 'sm' | 'md';
  showCall?: boolean;
  showChat?: boolean;
  className?: string;
}

const CommunicationButtons: React.FC<CommunicationButtonsProps> = ({
  targetId,
  targetName,
  targetType,
  size = 'md',
  showCall = true,
  showChat = true,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate(`/messages?user=${targetId}&name=${encodeURIComponent(targetName)}&type=${targetType}`);
  };

  const handleCall = () => {
    // For now, just show alert - can be enhanced with actual calling functionality
    alert(`Calling ${targetName}...`);
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
          className="flex items-center space-x-1"
        >
          <MessageCircle className={iconSize} />
          {size === 'md' && <span>Chat</span>}
        </Button>
      )}
      {showCall && (
        <Button
          variant="outline"
          size={buttonSize}
          onClick={handleCall}
          className="flex items-center space-x-1"
        >
          <Phone className={iconSize} />
          {size === 'md' && <span>Call</span>}
        </Button>
      )}
    </div>
  );
};

export default CommunicationButtons;
