
import { Button } from '@/components/ui/button';

interface StepProps {
  availability: 'available' | 'busy' | 'offline';
  setAvailability: (v: 'available' | 'busy' | 'offline') => void;
  onBack: () => void;
  onFinish: () => void;
}

const AvailabilityStep = ({ availability, setAvailability, onBack, onFinish }: StepProps) => (
  <div>
    <h2 className="font-bold text-lg mb-3">Availability</h2>
    <div className="flex items-center gap-5 mb-5">
      {(["available", "busy", "offline"] as const).map(status => (
        <button
          key={status}
          className={`rounded-xl px-5 py-2 border-2 text-sm transition
            ${availability === status ? "border-green-500 bg-green-50 scale-105 font-bold" : "border-gray-200 bg-white hover:border-green-400"}`}
          onClick={() => setAvailability(status)}
          type="button"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
    <div className="flex gap-2 mt-4">
      <Button type="button" onClick={onBack} className="w-1/2 bg-gray-100 text-gray-700">Back</Button>
      <Button
        className="w-1/2 bg-green-700 text-white"
        onClick={onFinish}
      >
        Finish & Continue
      </Button>
    </div>
  </div>
);

export default AvailabilityStep;
