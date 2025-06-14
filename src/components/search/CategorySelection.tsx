
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { 
  Hammer, 
  Truck, 
  Sparkles, 
  Shield, 
  Package, 
  Factory, 
  Car, 
  ChefHat, 
  Users, 
  Wrench,
  ArrowLeft
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  subcategories: string[];
  color: string;
}

const categories: Category[] = [
  {
    id: 'construction',
    name: 'Construction',
    icon: Hammer,
    subcategories: ['Cement Work', 'Brick Laying', 'Plumbing', 'Electrical', 'Painting', 'Carpentry'],
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'delivery',
    name: 'Delivery',
    icon: Truck,
    subcategories: ['Food Delivery', 'Package Delivery', 'Two Wheeler', 'Four Wheeler', 'Heavy Vehicle'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: Sparkles,
    subcategories: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Car Washing', 'Window Cleaning'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    subcategories: ['Security Guard', 'Watchman', 'Bouncer', 'CCTV Operator', 'Event Security'],
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    icon: Package,
    subcategories: ['Packing', 'Loading', 'Inventory', 'Quality Check', 'Forklift Operator'],
    color: 'from-gray-500 to-slate-600'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: Factory,
    subcategories: ['Machine Operator', 'Assembly Line', 'Quality Control', 'Maintenance', 'Supervisor'],
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'driver',
    name: 'Driver',
    icon: Car,
    subcategories: ['Taxi Driver', 'Truck Driver', 'Bus Driver', 'Personal Driver', 'Delivery Driver'],
    color: 'from-teal-500 to-green-500'
  },
  {
    id: 'cook',
    name: 'Cook',
    icon: ChefHat,
    subcategories: ['Home Cook', 'Restaurant Chef', 'Catering', 'Baker', 'Fast Food'],
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'helper',
    name: 'Helper',
    icon: Users,
    subcategories: ['Office Boy', 'House Help', 'Event Helper', 'Moving Helper', 'General Labor'],
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    icon: Wrench,
    subcategories: ['AC Repair', 'Appliance Repair', 'Building Maintenance', 'Garden Maintenance', 'IT Support'],
    color: 'from-indigo-500 to-blue-500'
  }
];

interface CategorySelectionProps {
  onCategorySelect: (categoryId: string, categoryName: string) => void;
  onBack?: () => void;
  title?: string;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ 
  onCategorySelect, 
  onBack,
  title = "Select Category"
}) => {
  return (
    <div className="space-y-4">
      {onBack && (
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <ModernCard
              key={category.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => onCategorySelect(category.id, category.name)}
            >
              <div className="text-center space-y-3">
                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.subcategories.length} types</p>
                </div>
              </div>
            </ModernCard>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelection;
export { categories };
