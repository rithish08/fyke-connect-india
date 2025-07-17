import { Button } from '@/components/ui/button';

interface StepProps {
  salary: { amount: string; period: 'daily' | 'weekly' | 'monthly' };
  setSalary: (s: { amount: string; period: 'daily' | 'weekly' | 'monthly' }) => void;
  onNext: () => void;
  onBack: () => void;
}
const periods = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

const SalaryStep = ({ salary, setSalary, onNext, onBack }: StepProps) => (
  <div>
    <h2 className="font-bold text-lg mb-3">Salary Expectation</h2>
    <div className="flex items-center space-x-3 mb-5">
      <span className="font-bold text-xl text-gray-700">₹</span>
      <input
        type="number"
        placeholder="Amount"
        value={salary.amount}
        onChange={e => setSalary({ ...salary, amount: e.target.value.replace(/\D/g, "") })}
        className="w-32 px-3 py-2 border rounded-lg text-lg"
        min={0}
      />
      <select
        title="Select wage period"
        aria-label="Wage period"
        className="px-2 py-2 border rounded-lg"
        value={salary.period}
        onChange={e => setSalary({ ...salary, period: e.target.value as 'daily' | 'weekly' | 'monthly' })}
      >
        {periods.map(p => (
          <option key={p.key} value={p.key}>{p.label}</option>
        ))}
      </select>
    </div>
    <div className="flex gap-2 mt-4">
      <Button type="button" onClick={onBack} className="w-1/2 bg-gray-100 text-gray-700">Back</Button>
      <Button
        className="w-1/2 bg-gray-900 text-white"
        disabled={!salary.amount}
        onClick={onNext}
      >
        Next
      </Button>
    </div>
  </div>
);

export default SalaryStep;
