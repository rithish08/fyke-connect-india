
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { categories } from '@/data/categories';
import { ChevronDown, Check, X } from "lucide-react";
import { FloatingCard } from '@/components/ui/floating-card';
import { Badge } from '@/components/ui/badge';

interface ModernCategoryStepProps {
  form: UseFormReturn<ProfileSetupFormData>;
  onNext: () => Promise<boolean>;
  userName: string;
}

const ModernCategoryStep: React.FC<ModernCategoryStepProps> = ({ form, onNext, userName }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Track selected category/subcategories
  const selectedCategory = form.watch("category") || "";
  const selectedSubcategories: string[] = form.watch("subcategories") || [];

  // Select category and auto-close dropdown
  const handleCategorySelect = (cat: string) => {
    form.setValue("category", cat);
    form.setValue("subcategories", []); // Reset subcategory on new main category
    setShowDropdown(false);
  };

  // Toggle subcategory (max 3)
  const handleSubcategoryToggle = (sub: string) => {
    if (selectedSubcategories.includes(sub)) {
      form.setValue(
        "subcategories",
        selectedSubcategories.filter((s) => s !== sub)
      );
    } else if (selectedSubcategories.length < 3) {
      form.setValue("subcategories", [...selectedSubcategories, sub]);
    }
  };

  // Remove subcat badge
  const removeSubcategory = (sub: string) => {
    form.setValue(
      "subcategories",
      selectedSubcategories.filter((s) => s !== sub)
    );
  };

  // Only subcats for selected category
  const categoryObj = categories.find((cat) => cat.name === selectedCategory);

  // Continue button activation
  const canContinue = selectedCategory && selectedSubcategories.length > 0;

  // On continue
  const handleContinue = () => {
    if (canContinue) onNext();
  };

  return (
    <div className="flex flex-col items-center pt-6 mb-36 min-h-[70vh]">
      <FloatingCard size="md" variant="glow" className="w-full max-w-lg">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            {userName ? `Welcome, ${userName}!` : "Welcome!"}
          </h2>
          <p className="text-gray-600 mt-2">Pick your main work category and what you do</p>
        </div>

        {/* Category dropdown */}
        <div className="relative w-full mb-6">
          <button
            className="w-full flex items-center justify-between px-4 h-14 rounded-xl border-2 border-violet-300 bg-white drop-shadow-sm hover:shadow-md text-lg font-semibold text-violet-900 transition-all"
            onClick={() => setShowDropdown((b) => !b)}
            type="button"
          >
            <span>{selectedCategory || "Select main category"}</span>
            <ChevronDown className="w-5 h-5" />
          </button>
          {showDropdown && (
            <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl border shadow-lg z-40 max-h-64 overflow-y-auto animate-fade-in">
              {categories.map(cat => (
                <button
                  className={`flex items-center w-full text-left px-4 py-3 hover:bg-violet-50 rounded-xl gap-3 ${
                    selectedCategory === cat.name ? "bg-violet-50 font-bold text-violet-700" : ""
                  }`}
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="flex-1">{cat.name}</span>
                  {selectedCategory === cat.name && <Check className="w-4 h-4 ml-2 text-violet-700" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Subcategory grid */}
        {categoryObj && (
          <div>
            <div className="font-medium text-gray-800 text-base mb-2 ml-1">Your specializations (max 3)</div>
            <div className="grid grid-cols-2 gap-2">
              {categoryObj.subcategories.map(sub => {
                const selected = selectedSubcategories.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    disabled={
                      !selected && selectedSubcategories.length >= 3
                    }
                    className={`
                      rounded-xl px-3 py-3 text-base font-semibold border-2 border-violet-200 transition-all duration-150
                      ${
                        selected
                          ? "bg-gradient-to-r from-violet-200 via-blue-200 to-blue-100 text-violet-900 border-violet-400 shadow"
                          : "bg-white text-gray-900 hover:bg-violet-50 hover:border-violet-300"
                      }
                      ${
                        !selected && selectedSubcategories.length >= 3
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }
                    `}
                    onClick={() => handleSubcategoryToggle(sub)}
                  >
                    <span>{sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected subcats badges */}
        <div className="flex gap-2 flex-wrap mt-4 min-h-[36px]">
          {selectedSubcategories.map((sub) => (
            <Badge key={sub}
              className="flex gap-1 items-center bg-violet-100 border-violet-300/80 text-violet-900 pl-3 pr-1 py-1 font-medium"
            >
              <span>{sub}</span>
              <button onClick={() => removeSubcategory(sub)} type="button"
                className="rounded-full hover:bg-violet-200/80 transition p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </FloatingCard>
      {/* Padding for sticky footer */}
      <div className="h-36 w-full" />
    </div>
  );
};

export default ModernCategoryStep;
