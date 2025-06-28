import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useCategories } from '@/hooks/useCategories';
import { getCurrentLocationArea } from '@/utils/locationUtils';

// Categories data from the static file
const categoriesData = [
  { 
    name: "Construction", 
    icon: "🏗️", 
    description: "Construction and building related work",
    subcategories: ["Mason", "Carpenter", "Electrician", "Plumber", "Painter", "Welder"] 
  },
  { 
    name: "Delivery", 
    icon: "🚚", 
    description: "Delivery and transportation services",
    subcategories: ["Food Delivery", "Package Delivery", "Grocery Delivery", "Medicine Delivery"] 
  },
  { 
    name: "Cleaning", 
    icon: "🧹", 
    description: "Cleaning and maintenance services",
    subcategories: ["House Cleaning", "Office Cleaning", "Deep Cleaning", "Post-Construction Cleaning"] 
  },
  { 
    name: "Security", 
    icon: "🛡️", 
    description: "Security and protection services",
    subcategories: ["Night Guard", "Event Security", "CCTV Operator", "Residential Security"] 
  },
  { 
    name: "Driver", 
    icon: "🚗", 
    description: "Driving and transportation services",
    subcategories: ["Taxi Driver", "Delivery Driver", "Personal Driver", "Tour Guide"] 
  },
  { 
    name: "Vehicle Owners", 
    icon: "🚛", 
    description: "Vehicle ownership and operation services",
    subcategories: [
      "Cargo Auto", "Mini Truck (Tata Ace)", "Lorry / Truck (6–12 wheeler)", 
      "Tractor with Trailer", "Bike with Carrier", "Auto Rickshaw", "Bike Taxi", 
      "Taxi (Sedan/Hatchback)", "Passenger Van (Eeco, Force)", "Private Bus (15–50 seats)", 
      "Water Tanker", "Ambulance"
    ] 
  },
  { 
    name: "Mechanic", 
    icon: "🔧", 
    description: "Mechanical and repair services",
    subcategories: ["Two Wheeler Mechanic", "Trucker Mechanic", "Car Mechanic", "Heavy Vehicle Mechanic", "Puncture Repair Worker"] 
  },
  { 
    name: "Cooking", 
    icon: "👨‍🍳", 
    description: "Cooking and culinary services",
    subcategories: ["Home Cook", "Event Cook", "Kitchen Helper", "Catering Assistant"] 
  },
  { 
    name: "Gardening", 
    icon: "🌱", 
    description: "Gardening and landscaping services",
    subcategories: ["Gardener", "Landscaper", "Plant Care", "Lawn Maintenance"] 
  },
  { 
    name: "Beauty", 
    icon: "💄", 
    description: "Beauty and personal care services",
    subcategories: ["Hair Stylist", "Makeup Artist", "Nail Technician", "Spa Therapist"] 
  },
  { 
    name: "Media & Content", 
    icon: "📸", 
    description: "Media and content creation services",
    subcategories: ["Photographer", "Videographer", "Video Editor", "Social Media Manager", "YouTube Video Scriptwriter"] 
  },
  { 
    name: "Repairs & Maintenance", 
    icon: "🧰", 
    description: "Repair and maintenance services",
    subcategories: ["AC / Fridge / Washing Machine Repair", "TV / Electronics Repair", "Mobile / Laptop Repair", "Appliance Installation"] 
  },
  { 
    name: "Farming & Agro", 
    icon: "🚜", 
    description: "Farming and agricultural services",
    subcategories: ["Farm Laborer", "Tractor Operator", "Irrigation Assistant", "Crop Harvester"] 
  },
  { 
    name: "Warehouse & Logistics", 
    icon: "📦", 
    description: "Warehouse and logistics services",
    subcategories: ["Picker / Packer", "Warehouse Assistant", "Inventory Handler", "Forklift Operator"] 
  },
  { 
    name: "Office / Admin", 
    icon: "💼", 
    description: "Office and administrative services",
    subcategories: ["Office Boy / Peon", "Data Entry Operator", "Document Courier", "Front Desk Assistant"] 
  },
  { 
    name: "Event & Hospitality", 
    icon: "🎪", 
    description: "Event and hospitality services",
    subcategories: ["Event Helper / Setup Crew", "Waiter / Steward", "Bartender (Licensed)", "Event Venue Cleaner"] 
  },
  { 
    name: "Elderly & Child Care", 
    icon: "🧓", 
    description: "Elderly and child care services",
    subcategories: ["Babysitter / Nanny", "Elder Care Assistant", "Home Nurse", "Disability Caregiver"] 
  },
  { 
    name: "Retail / Shop Assistance", 
    icon: "🛍️", 
    description: "Retail and shop assistance services",
    subcategories: ["Sales Assistant", "Cashier", "Shelf Stocker", "Store Cleaner"] 
  },
  { 
    name: "Tailoring & Handicrafts", 
    icon: "🧵", 
    description: "Tailoring and handicraft services",
    subcategories: ["Tailor / Stitching Expert", "Embroidery Artist", "Crochet / Knitting Specialist", "Handloom Assistant"] 
  },
  { 
    name: "Health & Wellness", 
    icon: "🧪", 
    description: "Health and wellness services",
    subcategories: ["Yoga Instructor", "Zumba / Fitness Trainer", "Physiotherapist Assistant", "Home Therapy Aide"] 
  }
];

const DatabaseSeeder: React.FC = () => {
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');
  const { categories, refreshCategories } = useCategories();

  const seedDatabase = async () => {
    setSeeding(true);
    setMessage('🌱 Starting database seeding...');

    try {
      // Check if categories exist
      const { data: existingCategories } = await supabase
        .from('categories')
        .select('id, name');

      if (existingCategories && existingCategories.length > 0) {
        setMessage('✅ Categories already exist!');
        return;
      }

      // Insert sample categories
      const sampleCategories = [
        { name: 'Construction', icon: '🏗️', description: 'Construction work' },
        { name: 'Delivery', icon: '🚚', description: 'Delivery services' },
        { name: 'Cleaning', icon: '🧹', description: 'Cleaning services' },
        { name: 'Security', icon: '🛡️', description: 'Security services' },
        { name: 'Driver', icon: '🚗', description: 'Driving services' },
        { name: 'Vehicle Owners', icon: '🚛', description: 'Vehicle ownership services' },
        { name: 'Mechanic', icon: '🔧', description: 'Mechanical services' },
        { name: 'Cooking', icon: '👨‍🍳', description: 'Cooking services' },
        { name: 'Gardening', icon: '🌱', description: 'Gardening services' },
        { name: 'Beauty', icon: '💄', description: 'Beauty services' }
      ];

      for (const category of sampleCategories) {
        const { error } = await supabase
          .from('categories')
          .insert({
            name: category.name,
            icon: category.icon,
            description: category.description,
            active: true
          });
        
        if (error) {
          console.error('Error inserting category:', error);
        } else {
          console.log('Inserted category:', category.name);
        }
      }

      setMessage('🎉 Database seeded successfully!');
      await refreshCategories();
      
    } catch (error) {
      setMessage('💥 Error seeding database: ' + (error as Error).message);
    } finally {
      setSeeding(false);
    }
  };

  const testLocation = async () => {
    setMessage('📍 Testing location detection...');
    try {
      const locationData = await getCurrentLocationArea();
      if (locationData) {
        setMessage(`📍 Location detected: ${locationData.area} (${locationData.lat.toFixed(4)}, ${locationData.lng.toFixed(4)})`);
      } else {
        setMessage('❌ Could not detect location');
      }
    } catch (error) {
      setMessage('💥 Location test failed: ' + (error as Error).message);
    }
  };

  return (
    <Card className="p-4 m-4 bg-yellow-50 border-yellow-200">
      <h3 className="text-lg font-semibold mb-2">Database Seeder (Remove after testing)</h3>
      
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          Current categories: {categories.length}
        </p>
        {categories.length > 0 && (
          <p className="text-xs text-gray-500">
            {categories.map(cat => cat.name).join(', ')}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Button 
          onClick={seedDatabase} 
          disabled={seeding}
          size="sm"
          className="w-full"
        >
          {seeding ? '🌱 Seeding...' : '🌱 Seed Database'}
        </Button>

        <Button 
          onClick={testLocation} 
          size="sm"
          variant="outline"
          className="w-full"
        >
          📍 Test Location
        </Button>
      </div>

      {message && (
        <div className="mt-3 p-2 bg-white rounded text-sm">
          {message}
        </div>
      )}
    </Card>
  );
};

export default DatabaseSeeder; 