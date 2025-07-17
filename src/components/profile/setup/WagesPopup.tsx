import React, { useState } from 'react';
import { FloatingCard } from '@/components/ui/floating-card';
import { DollarSign, X } from 'lucide-react';

interface WagesPopupProps {
  categories: string[];
  onClose: (wages: Record<string, { amount: string; period: string }> | undefined) => void;
}

const periods = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const WagesPopup: React.FC<WagesPopupProps> = ({ categories, onClose }) => {
  const [wages, setWages] = useState<Record<string, { amount: string; period: string }>>({});

  const handleChange = (category: string, field: 'amount' | 'period', value: string) => {
    setWages(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onClose(wages);
  };

  const handleSkip = () => {
    onClose(undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in">
      <FloatingCard variant="glow" size="md" className="relative w-full max-w-sm mx-auto rounded-2xl p-0 flex flex-col shadow-2xl animate-scale-in">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          onClick={() => onClose(undefined)}
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex flex-col items-center pt-6 pb-1 px-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-1 shadow-md">
            <DollarSign className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-lg font-bold text-green-700 mb-0.5">Set Your Rates</h2>
          <p className="text-gray-600 text-xs mb-2 text-center font-medium">Set your payment for each category (optional)</p>
        </div>
        <div className="overflow-y-auto hide-scrollbar px-2 pb-2 w-full" style={{ maxHeight: '36vh' }}>
          <div className={`grid gap-2 ${categories.length > 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}> 
            {categories.map(category => (
              <div key={category} className="bg-white/80 backdrop-blur rounded-xl shadow p-2 flex flex-col gap-1 min-w-0">
                <h3 className="font-semibold text-gray-900 flex items-center text-sm mb-0.5">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {category}
                </h3>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <label className="text-xs text-gray-500">Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="500"
                      value={wages[category]?.amount || ''}
                      onChange={e => handleChange(category, 'amount', e.target.value)}
                      className="h-9 rounded-md border border-gray-200 w-full px-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Period</label>
                    <select
                      aria-label={`Select period for ${category}`}
                      value={wages[category]?.period || ''}
                      onChange={e => handleChange(category, 'period', e.target.value)}
                      className="h-9 rounded-md border border-gray-200 w-full px-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                    >
                      <option value="">Period</option>
                      {periods.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sticky bottom-0 left-0 right-0 bg-transparent rounded-b-2xl px-4 py-2 flex flex-col gap-1">
          <button
            onClick={handleSave}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500/90 to-blue-700/90 shadow text-white font-bold text-base transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-400"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="w-full h-9 rounded-lg border border-blue-300 text-blue-700 bg-white/60 hover:bg-blue-50 font-semibold shadow-sm transition-all duration-200 text-sm mt-1"
          >
            Skip for now
          </button>
        </div>
      </FloatingCard>
    </div>
  );
};

export default WagesPopup; 