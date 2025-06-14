import React from "react";
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ShimmerLoader from './ui/ShimmerLoader';
const steps = [{
  id: 'name',
  title: "Add Your Name",
  benefit: "60% more trusted",
  icon: "👤"
}, {
  id: 'photo',
  title: "Upload Photo",
  benefit: "70% more likely hired",
  icon: "📸"
}, {
  id: 'skills',
  title: "List Skills",
  benefit: "3x jobs",
  icon: "🛠️"
}, {
  id: 'location',
  title: "Set Location",
  benefit: "See jobs nearby",
  icon: "📍"
}];
const ProfileProgress = () => {
  const {
    user
  } = useAuth();
  if (!user) return <ShimmerLoader height={96} className="my-6 mx-auto max-w-xl" />;
  const completion = steps.reduce((acc, step) => user[step.id] ? acc + 1 : acc, 0);
  const pct = Math.round(completion / steps.length * 100);
  if (pct === 100) return null;
  return;
};
export default ProfileProgress;