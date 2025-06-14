
import React from "react";

interface BannerAdProps {
  text?: string;
  type?: 'text' | 'image' | 'video';
  imageUrl?: string;
  videoUrl?: string;
  onClose?: () => void;
  onClick?: () => void;
}

const BannerAd: React.FC<BannerAdProps> = ({
  text = "Ad: Unlock Fyke Pro to secure more jobs and premium support!",
  type = 'text',
  imageUrl,
  videoUrl,
  onClose,
  onClick
}) => {
  const renderContent = () => {
    switch (type) {
      case 'image':
        return (
          <div className="flex items-center space-x-4">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Advertisement" 
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <span className="text-sm font-semibold">{text}</span>
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="flex items-center space-x-4">
            {videoUrl && (
              <video 
                src={videoUrl} 
                className="w-16 h-16 rounded-lg object-cover"
                muted
                autoPlay
                loop
              />
            )}
            <div className="flex-1">
              <span className="text-sm font-semibold">{text}</span>
            </div>
          </div>
        );
      
      default:
        return <span className="text-sm font-semibold">{text}</span>;
    }
  };

  return (
    <div 
      className={`relative flex items-center justify-between bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl px-6 py-4 text-yellow-800 my-4 max-w-2xl mx-auto shadow-lg border border-yellow-200 ${
        onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex-1">
        {renderContent()}
      </div>
      {onClose && (
        <button
          className="ml-4 p-2 rounded-full hover:bg-yellow-200 text-yellow-700 transition-colors"
          aria-label="Close Ad"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default BannerAd;
