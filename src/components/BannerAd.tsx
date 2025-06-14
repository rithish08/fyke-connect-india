
import React from 'react';
import { X } from 'lucide-react';

interface BannerAdProps {
  onClose: () => void;
}

const BannerAd: React.FC<BannerAdProps> = ({ onClose }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 relative">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <div>
              <p className="font-semibold text-sm">Find Work Faster!</p>
              <p className="text-xs opacity-90">Join thousands of workers finding jobs daily on Fyke</p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BannerAd;
