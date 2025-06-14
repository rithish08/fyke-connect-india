
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const ALL_CATEGORIES = [
  { name: "Construction", sub: ["Mason", "Plumber", "Painter"] },
  { name: "Delivery", sub: ["Bike Delivery", "Van Delivery"] },
  { name: "Cleaning", sub: ["House", "Office"] },
  { name: "Security", sub: ["Guard", "CCTV"] },
  { name: "Driver", sub: ["Car", "Van", "Truck"] },
  { name: "Cooking", sub: ["Cook", "Helper"] },
  { name: "Gardening", sub: ["Gardener", "Landscaper"] },
];

const SignupForm = ({ onComplete }: { onComplete: () => void }) => {
  const { updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [primaryCategory, setPrimaryCategory] = useState<string>("");
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>({});

  const handleCategory = (category: string) => {
    let updated = [...categories];
    if (updated.includes(category)) {
      updated = updated.filter((c) => c !== category);
      if (primaryCategory === category) setPrimaryCategory(updated[0] || "");
      setSubcategories((prev) => ({ ...prev, [category]: [] }));
    } else if (updated.length < 3) {
      updated.push(category);
      if (!primaryCategory) setPrimaryCategory(category); // first one is primary
    }
    setCategories(updated);
  };

  const handleSubcategory = (cat: string, sub: string) => {
    const selected = subcategories[cat] || [];
    setSubcategories((prev) => ({
      ...prev,
      [cat]: selected.includes(sub) ? selected.filter((s) => s !== sub) : [...selected, sub],
    }));
  };

  const canSubmit = name.trim() && categories.length > 0 && primaryCategory;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    updateProfile({
      name,
      categories,
      primaryCategory,
      subcategories,
      profileComplete: true,
    });
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow w-full max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Sign Up</h2>
      <div>
        <label className="block text-sm font-medium">Your Name</label>
        <input
          className="mt-1 w-full border px-3 py-2 rounded-lg"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Select up to 3 categories (one will be your primary)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {ALL_CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.name}
              className={`px-3 py-2 rounded-full border-2 text-sm ${categories.includes(c.name) ? "border-blue-600 bg-blue-50 font-semibold" : "border-gray-200 bg-white hover:border-blue-300"}`}
              onClick={() => handleCategory(c.name)}
              disabled={!categories.includes(c.name) && categories.length >= 3}
            >
              {c.name}
              {primaryCategory === c.name && (
                <span className="ml-2 text-xs text-green-500">(Primary)</span>
              )}
            </button>
          ))}
        </div>
        {categories.length > 0 && (
          <div className="text-xs text-gray-500 mb-1">
            Click a selected category to remove. Click a selected one again to set as primary.
          </div>
        )}
        {categories.length > 0 && (
          <div className="mb-1">
            <label className="block text-xs font-medium mb-1">Tap a category to make primary</label>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  className={`rounded px-2 py-1 border ${primaryCategory === cat ? "border-green-600 bg-green-50 font-bold" : "border-gray-200"}`}
                  key={cat}
                  onClick={() => setPrimaryCategory(cat)}
                >{cat}</button>
              ))}
            </div>
          </div>
        )}
      </div>
      {categories.map((cat) => {
        const found = ALL_CATEGORIES.find((c) => c.name === cat);
        if (!found || !found.sub.length) return null;
        return (
          <div key={cat}>
            <div className="text-sm font-medium mb-1">{cat} sub-categories:</div>
            <div className="flex flex-wrap gap-2">
              {found.sub.map((sub) => (
                <button
                  type="button"
                  key={sub}
                  className={`px-3 py-1 rounded border text-xs ${subcategories[cat]?.includes(sub) ? "border-blue-600 bg-blue-100" : "border-gray-200"}`}
                  onClick={() => handleSubcategory(cat, sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <Button type="submit" className="w-full bg-gray-900 text-white mt-4" disabled={!canSubmit}>
        Complete Registration
      </Button>
    </form>
  );
};

export default SignupForm;
