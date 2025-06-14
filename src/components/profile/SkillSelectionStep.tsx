
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface StepProps {
  skills: string[];
  setSkills: (skills: string[]) => void;
  category: string;
  onNext: () => void;
  onBack: () => void;
}

const categorySkills: Record<string, string[]> = {
  Construction: ["Mason", "Carpenter", "Electrician", "Plumber", "Painter", "Welder", "Tile Work"],
  Delivery: ["Bike Delivery", "Car Delivery", "Food Delivery", "Package Handling", "Navigation"],
  Cleaning: ["House Cleaning", "Office Cleaning", "Window Cleaning", "Deep Cleaning", "Sanitization"],
  Driver: ["Safe Driving", "City Navigation", "Customer Service", "Vehicle Maintenance"],
  Security: ["Surveillance", "Access Control", "Emergency Response", "CCTV Operation"],
  Cooking: ["Indian Cuisine", "Fast Cooking", "Food Safety", "Kitchen Management"],
  Gardening: ["Plant Care", "Landscaping", "Lawn Maintenance", "Pest Control"],
};

const SkillSelectionStep = ({ skills, setSkills, category, onNext, onBack }: StepProps) => {
  const [customSkill, setCustomSkill] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const suggestedSkills = categorySkills[category] || [];

  const handleToggleSkill = (skill: string) => {
    setSkills(skills.includes(skill) 
      ? skills.filter(s => s !== skill) 
      : [...skills, skill]
    );
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill("");
      setShowCustomInput(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your skills?</h2>
        <p className="text-gray-500">Select skills that match your expertise</p>
      </div>

      {/* Selected Skills */}
      {skills.length > 0 && (
        <div className="bg-blue-50 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Selected Skills ({skills.length})</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <div
                key={skill}
                className="bg-blue-500 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Skills */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Suggested for {category}</h3>
        <div className="grid grid-cols-2 gap-2">
          {suggestedSkills.map(skill => (
            <button
              key={skill}
              className={`p-3 rounded-xl border-2 text-left transition-all text-sm ${
                skills.includes(skill)
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
              onClick={() => handleToggleSkill(skill)}
              type="button"
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Skill */}
      <div>
        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-600"
          >
            <Plus className="w-4 h-4" />
            Add custom skill
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="Enter skill name"
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSkill()}
              autoFocus
            />
            <Button
              onClick={handleAddCustomSkill}
              disabled={!customSkill.trim()}
              className="px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              Add
            </Button>
            <Button
              onClick={() => {
                setShowCustomInput(false);
                setCustomSkill("");
              }}
              variant="outline"
              className="px-4 rounded-xl"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button 
          onClick={onBack} 
          variant="outline"
          className="flex-1 h-12 rounded-xl border-gray-200"
        >
          Back
        </Button>
        <Button
          className={`flex-1 h-12 rounded-xl font-semibold ${
            skills.length > 0
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          disabled={skills.length === 0}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SkillSelectionStep;
