
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Plus, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StepProps {
  skills: string[];
  setSkills: (skills: string[]) => void;
  category: string;
  onNext: () => void;
  onBack: () => void;
}

const categorySkills: Record<string, string[]> = {
  Construction: ["Mason", "Carpenter", "Electrician", "Plumber", "Painter", "Welder", "Tile Work", "Ceiling Work", "Flooring", "RCC Work"],
  Delivery: ["Bike Delivery", "Car Delivery", "Food Delivery", "Package Handling", "Navigation", "Cash Handling", "Time Management", "Customer Service"],
  Cleaning: ["House Cleaning", "Office Cleaning", "Window Cleaning", "Deep Cleaning", "Sanitization", "Floor Polishing", "Bathroom Cleaning", "Kitchen Cleaning"],
  Driver: ["Safe Driving", "City Navigation", "Customer Service", "Vehicle Maintenance", "GPS Navigation", "Night Driving", "Highway Driving", "Parking"],
  Security: ["Surveillance", "Access Control", "Emergency Response", "CCTV Operation", "Patrol Duty", "Crowd Control", "Fire Safety", "First Aid"],
  Cooking: ["Indian Cuisine", "Fast Cooking", "Food Safety", "Kitchen Management", "Vegetarian Cooking", "Non-Veg Cooking", "Catering", "Food Presentation"],
  Gardening: ["Plant Care", "Landscaping", "Lawn Maintenance", "Pest Control", "Irrigation", "Tree Pruning", "Organic Farming", "Flower Arrangement"],
  Beauty: ["Hair Cutting", "Hair Styling", "Makeup", "Nail Art", "Facial Treatment", "Massage", "Eyebrow Threading", "Skin Care"],
};

const SkillSelectionStep = ({ skills, setSkills, category, onNext, onBack }: StepProps) => {
  const [customSkill, setCustomSkill] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const suggestedSkills = categorySkills[category] || [];
  const filteredSkills = suggestedSkills.filter(skill => 
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="space-y-6 max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">What are your skills?</h2>
        <p className="text-gray-500">Select skills that match your expertise in {category}</p>
      </div>

      {/* Selected Skills Display */}
      {skills.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-900">Selected Skills</h3>
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {skills.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <div
                key={skill}
                className="bg-blue-500 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl border-gray-200 focus:border-blue-500"
        />
      </div>

      {/* Suggested Skills */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-lg mr-2">💼</span>
          Popular {category} Skills
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {filteredSkills.map(skill => {
            const isSelected = skills.includes(skill);
            return (
              <button
                key={skill}
                className={`p-3 rounded-xl border-2 text-left transition-all text-sm font-medium ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-105"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                }`}
                onClick={() => handleToggleSkill(skill)}
                type="button"
              >
                <div className="flex items-center justify-between">
                  {skill}
                  {isSelected && <span className="text-blue-500 font-bold">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {filteredSkills.length === 0 && searchQuery && (
          <div className="text-center py-8 text-gray-500">
            <p>No skills found for "{searchQuery}"</p>
            <p className="text-sm mt-1">Try adding it as a custom skill below</p>
          </div>
        )}
      </div>

      {/* Add Custom Skill */}
      <div className="border-t border-gray-100 pt-4">
        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <Plus className="w-4 h-4" />
            Add custom skill
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Enter skill name"
                className="flex-1 rounded-xl border-gray-200 focus:border-blue-500"
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
            </div>
            <Button
              onClick={() => {
                setShowCustomInput(false);
                setCustomSkill("");
              }}
              variant="outline"
              className="w-full rounded-xl border-gray-200"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
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
          Continue with {skills.length} skill{skills.length !== 1 ? 's' : ''}
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default SkillSelectionStep;
