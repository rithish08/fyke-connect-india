
import { useState } from "react";
import { Button } from '@/components/ui/button';

interface StepProps {
  skills: string[];
  setSkills: (skills: string[]) => void;
  category: string;
  onNext: () => void;
  onBack: () => void;
}

const categorySkills: Record<string, string[]> = {
  Construction: ["Mason", "Carpenter", "Labor", "Electrician", "Plumber"],
  Delivery: ["Bike Delivery", "Car Delivery", "Logistics"],
  Cleaning: ["Home Cleaning", "Office Cleaning", "Window Cleaning"],
  Driver: ["Rideshare", "Transport", "Delivery Driver"],
  Security: ["Watchman", "Bouncer", "CCTV Operator"],
  Cooking: ["Cook", "Helper"],
  Gardening: ["Gardener", "Landscaper"],
};

const SkillSelectionStep = ({ skills, setSkills, category, onNext, onBack }: StepProps) => {
  const [input, setInput] = useState("");
  const list = categorySkills[category] || [];

  const handleToggle = (skill: string) => {
    setSkills(skills.includes(skill) ? skills.filter(s => s !== skill) : [...skills, skill]);
  };

  return (
    <div>
      <h2 className="font-bold text-lg mb-2">Select your skills</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {list.map(skill => (
          <button
            key={skill}
            type="button"
            className={`px-4 py-2 rounded-lg border-2 text-sm transition ${skills.includes(skill) ? "border-indigo-600 bg-indigo-50 font-semibold" : "border-gray-200 bg-white hover:border-indigo-300"}`}
            onClick={() => handleToggle(skill)}
          >
            {skill}
          </button>
        ))}
      </div>
      {/* Custom Skill input */}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Add custom skill"
        className="px-3 py-2 border rounded-lg w-full mb-2 text-sm"
        onKeyDown={e => {
          if (e.key === "Enter" && input) {
            setSkills([...skills, input]);
            setInput("");
          }
        }}
      />
      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={onBack} className="w-1/2 bg-gray-100 text-gray-700">Back</Button>
        <Button
          className="w-1/2 bg-gray-900 text-white"
          disabled={skills.length === 0}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SkillSelectionStep;
