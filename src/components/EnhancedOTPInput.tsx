
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface EnhancedOTPInputProps {
  value: string[];
  onChange: (otp: string[]) => void;
  onComplete: (otp: string) => void;
}

const EnhancedOTPInput = ({ value, onChange, onComplete }: EnhancedOTPInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, inputValue: string) => {
    if (inputValue.length > 1) return;
    
    const newOtp = [...value];
    newOtp[index] = inputValue;
    onChange(newOtp);

    // Auto-focus next input
    if (inputValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-complete when all fields are filled
    if (newOtp.every(digit => digit !== '') && inputValue) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center space-x-2 sm:space-x-3 w-full">
      {value.map((digit, index) => (
        <div key={index} className="relative flex-1 max-w-[50px]">
          <Input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-full h-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 rounded-xl transition-all duration-200 ${
              digit 
                ? 'border-green-500 bg-green-50 scale-105' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            maxLength={1}
          />
          {/* Success Animation */}
          {digit && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full rounded-xl bg-green-500 opacity-20 animate-ping"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EnhancedOTPInput;
