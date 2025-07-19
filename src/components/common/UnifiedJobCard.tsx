import React from 'react';
// import { StarIcon, CallButton, ChatButton } from './UnifiedWorkerCard'; // If exported, otherwise copy logic
import { Star } from 'lucide-react';

function CallButton({ phone, allowCall }: { phone?: string; allowCall?: boolean }) {
  return (
    <button
      className="bg-white text-black rounded-full flex items-center justify-center border border-gray-400 shadow-sm hover:bg-gray-100 transition-colors duration-200 text-sm disabled:opacity-40"
      style={{ width: '76.54px', height: '38px', padding: '0 12px' }}
      onClick={() => phone && allowCall && window.open(`tel:${phone}`, '_self')}
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
      onClick={() => {
        if (!phone) {
          alert('Phone number not available for WhatsApp chat.');
          return;
        }
        const cleaned = phone.replace(/\D/g, '').replace(/^91/, '');
        if (cleaned.length !== 10) {
          alert('Invalid phone number for WhatsApp chat.');
          return;
        }
        const msg = encodeURIComponent('Hi, I found your job post on Fyke Connect and would like to apply.');
        window.open(`https://wa.me/91${cleaned}?text=${msg}`, '_blank');
      }}
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

const UnifiedJobCard = ({ job, onApply, onViewDetails, hasApplied }: any) => {
  // Determine if subcategory should be below main category (if name is long)
  const mainCategory = job.category || 'General';
  const subCategory = job.subcategory || '';
  const isSubBelow = mainCategory.length > 12 || subCategory.length > 12;

  return (
    <div className="bg-white border-2 border-black shadow-lg rounded-lg p-4 max-w-md mx-auto transition-all duration-300 hover:shadow-xl flex flex-row w-full items-center" style={{ minWidth: 320 }}>
      {/* Left Section: Job info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-gray-800 truncate">{job.title}</h2>
        <div className="text-sm text-gray-600 truncate mb-1">{job.company}</div>
        <div className={isSubBelow ? "flex flex-col items-start space-y-1 mt-0.5" : "flex items-center space-x-2 mt-0.5"}>
          <span className="text-sm text-gray-600 truncate">{mainCategory}</span>
          {subCategory && <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs truncate mt-0.5">{subCategory}</div>}
        </div>
        <div className="flex items-center text-xs text-gray-500 space-x-2 mt-2">
          {job.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              <span className="ml-1">{job.rating}</span>
          </div>
          )}
          {job.salary_min && (
            <span className="text-green-500 font-bold">₹{job.salary_min}{job.salary_max ? ` - ₹${job.salary_max}` : ''}/{job.salary_period || 'hr'}</span>
          )}
          {job.location && <span className="text-xs text-gray-500">{job.location}</span>}
        </div>
      </div>
      {/* Right Section: Actions */}
      <div className="flex flex-col items-end justify-center space-y-2 ml-2 min-w-[7rem] pr-2">
        <button
          className={`bg-blue-600 text-white px-4 py-2 rounded-full font-bold transition-colors duration-300 hover:bg-blue-700 min-w-fit ${hasApplied ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onApply}
          disabled={hasApplied}
          type="button"
        >
          {hasApplied ? 'Applied' : 'Apply'}
        </button>
        <ChatButton phone={job.phone} />
        <CallButton phone={job.phone} allowCall={job.allow_call} />
      </div>
    </div>
  );
};

export default UnifiedJobCard;
