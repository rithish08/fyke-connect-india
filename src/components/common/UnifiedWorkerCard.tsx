
import React, { useState } from 'react';
import { AccessibleCard, CardContent } from '@/components/common/AccessibleCard';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Star icon for rating
function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function DeleteIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors duration-200 rounded-full p-1"
      onClick={onClick}
      title="Revoke request"
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}

function CallIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.5 3.5a2 2 0 00-1.41-1.41L17 2.5h-2A10 10 0 005 12.5v2a2 2 0 001.41 1.95L7 16.5a2 2 0 001.95 1.41A10 10 0 0019 8.05L19.5 7.5a2 2 0 001.41-1.95V3.5a2 2 0 00-2.41-2z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
    </svg>
  );
}

interface UnifiedWorkerCardProps {
  worker: {
    id: string;
    name: string;
    profile_photo?: string;
    category?: string;
    subcategory?: string;
    rating?: number;
    hourly_rate?: number;
    distance?: string;
    availability?: 'available' | 'busy' | 'offline';
    phone?: string;
    allow_call?: boolean;
    primaryCategory?: string;
  };
  isRequested?: boolean;
  onRequest?: (workerId: string) => void;
  onRevoke?: (workerId: string) => void;
  className?: string;
}

function handleCall(phone?: string, allowCall?: boolean) {
  if (phone && allowCall) {
    window.open(`tel:${phone}`, '_self');
  }
}

function handleChat(phone?: string) {
  if (!phone) {
    alert('Phone number not available for WhatsApp chat.');
    return;
  }
  // Remove any non-digit characters and leading country code
  const cleaned = phone.replace(/\D/g, '').replace(/^91/, '');
  if (cleaned.length !== 10) {
    alert('Invalid phone number for WhatsApp chat.');
    return;
  }
  const msg = encodeURIComponent('Hi, I found your profile on Fyke Connect and would like to connect regarding work.');
  window.open(`https://wa.me/91${cleaned}?text=${msg}`, '_blank');
}

function CallButton({ phone, allowCall }: { phone?: string; allowCall?: boolean }) {
  return (
    <button
      className="bg-white text-black rounded-full flex items-center justify-center border border-gray-400 shadow-sm hover:bg-gray-100 transition-colors duration-200 text-sm disabled:opacity-40"
      style={{ width: '76.54px', height: '38px', padding: '0 12px' }}
      onClick={() => handleCall(phone, allowCall)}
      disabled={!allowCall || !phone}
      aria-label="Call"
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2A19.72 19.72 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.6 6.6l1.27-1.27a2 2 0 012.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0122 16.92z" />
      </svg>
      <span>Call</span>
    </button>
  );
}

function ChatButton({ phone }: { phone?: string }) {
  return (
    <button
      className="bg-white text-black rounded-full flex items-center justify-center border border-gray-400 shadow-sm hover:bg-gray-100 transition-colors duration-200 text-sm"
      style={{ width: '76.54px', height: '38px', padding: '0 12px' }}
      onClick={() => handleChat(phone)}
      aria-label="Chat"
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
        <circle cx="12" cy="12" r="10" /><path d="M8 12h.01M12 12h.01M16 12h.01" />
      </svg>
      <span>Chat</span>
    </button>
  );
}

function CallChatButtons({ phone, allowCall }: { phone?: string; allowCall?: boolean }) {
  return (
    <div className="flex flex-col items-end space-y-2 pr-1">
      <CallButton phone={phone} allowCall={allowCall} />
      <ChatButton phone={phone} />
    </div>
  );
}

function RequestButton({ isRequested, setIsRequested, onRequest, onRevoke, workerId }: { isRequested: boolean; setIsRequested: (v: boolean) => void; onRequest?: (id: string) => void; onRevoke?: (id: string) => void; workerId: string }) {
  return (
    <div className="flex flex-col items-center space-y-1">
      {!isRequested && (
        <div className="flex items-center space-x-1 text-xs text-gray-600 justify-center">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Available</span>
        </div>
      )}
      <div className="flex items-center space-x-2">
        {isRequested && <DeleteIcon onClick={() => { setIsRequested(false); onRevoke && onRevoke(workerId); }} />}
        {isRequested ? (
          <span className="text-gray-700 font-bold opacity-10 text-sm ml-1" style={{ fontSize: '14px' }}>Requested</span>
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-full font-bold transition-colors duration-300 hover:bg-green-600 min-w-fit"
            onClick={() => { setIsRequested(true); onRequest && onRequest(workerId); }}
            type="button"
          >
            Request
          </button>
        )}
      </div>
    </div>
  );
}

const UnifiedWorkerCard: React.FC<UnifiedWorkerCardProps> = ({ 
  worker, 
  isRequested: requestedProp, 
  onRequest, 
  onRevoke, 
  className = ''
}) => {
  const [isRequested, setIsRequested] = useState(!!requestedProp);

  // Remove mainCategory and subCategory variables, and their fallbacks
  const isSubBelow = (worker.category || worker.primaryCategory || '').length > 12 || (worker.subcategory || '').length > 12;

  const availabilityColor = worker.availability === 'available' ? 'bg-green-500' : worker.availability === 'busy' ? 'bg-yellow-400' : 'bg-gray-400';
  const availabilityText = worker.availability === 'available' ? 'Available' : worker.availability === 'busy' ? 'Busy' : 'Offline';

  return (
    <AccessibleCard 
      className={`transition-all duration-200 border-black ${isRequested ? 'bg-blue-50' : 'hover:shadow-md'} ${className}`}
      ariaLabel={`Worker: ${worker.name}, ${worker.category || worker.primaryCategory}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center w-full">
          {/* Left Section: Profile image and text */}
          <div className="flex items-center min-w-0 flex-1">
            <Avatar className="w-20 h-20 mr-4 flex-shrink-0 border border-gray-300 rounded-md overflow-hidden">
              <AvatarImage className="w-full h-full object-cover rounded-md" src={worker.profile_photo} alt={`${worker.name}'s profile`} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold rounded-md">
                {worker.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex flex-col">
              <h2 className="text-lg font-bold text-gray-800 truncate">{worker.name}</h2>
              <div className={isSubBelow ? "flex flex-col items-start space-y-1 mt-0.5" : "flex items-center space-x-2 mt-0.5"}>
                {worker.category || worker.primaryCategory ? (
                  <span className="text-sm text-gray-600 truncate">{worker.category || worker.primaryCategory}</span>
                ) : null}
                {worker.subcategory && <Badge variant="secondary" className="text-xs">{worker.subcategory}</Badge>}
              </div>
              <div className="flex items-center text-xs text-gray-500 space-x-2 mt-2">
                <div className="flex items-center">
                  <StarIcon />
                  <span className="ml-1">{worker.rating || 4.8}</span>
                </div>
                <span className="text-green-500 font-bold">₹{worker.hourly_rate || 350}/hr</span>
                <span className="text-xs text-gray-500">{worker.distance || "1.2km"}</span>
              </div>
            </div>
          </div>
          
          {/* Right Section: Actions */}
          <div className="flex flex-col items-end justify-center space-y-2 ml-4">
            <RequestButton isRequested={isRequested} setIsRequested={setIsRequested} onRequest={onRequest} onRevoke={onRevoke} workerId={worker.id} />
            {isRequested && <CallChatButtons phone={worker.phone} allowCall={worker.allow_call} />}
          </div>
        </div>
      </CardContent>
    </AccessibleCard>
  );
};

export default UnifiedWorkerCard;
