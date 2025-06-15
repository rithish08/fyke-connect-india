import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const SignupForm = ({ onComplete }: { onComplete: () => void }) => {
  const { updateProfile } = useAuth();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile({ 
      name: name.trim(),
      profile_complete: false // Use correct key!
    });
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
          <p className="text-gray-500">Let's get started with your name</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg" 
            disabled={!name.trim()}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
