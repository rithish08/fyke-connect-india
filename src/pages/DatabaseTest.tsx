import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useCategories } from '@/hooks/useCategories';

const DatabaseTest: React.FC = () => {
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');
  const { categories, loading, error, refreshCategories } = useCategories();

  const seedDatabase = async () => {
    setSeeding(true);
    setMessage('Starting database seeding...');

    try {
      // Check if categories exist
      const { data: existingCategories } = await supabase
        .from('categories')
        .select('id, name');

      if (existingCategories && existingCategories.length > 0) {
        setMessage('Categories already exist!');
        return;
      }

      // Insert sample categories
      const sampleCategories = [
        { name: 'Construction', icon: '🏗️', description: 'Construction work' },
        { name: 'Delivery', icon: '🚚', description: 'Delivery services' },
        { name: 'Cleaning', icon: '🧹', description: 'Cleaning services' },
        { name: 'Security', icon: '🛡️', description: 'Security services' },
        { name: 'Driver', icon: '🚗', description: 'Driving services' }
      ];

      for (const category of sampleCategories) {
        await supabase
          .from('categories')
          .insert({
            name: category.name,
            icon: category.icon,
            description: category.description,
            active: true
          });
      }

      setMessage('Database seeded successfully!');
      await refreshCategories();
      
    } catch (error) {
      setMessage('Error seeding database: ' + (error as Error).message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Integration Test</h1>
      
      <Card className="p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">Categories Status</h2>
        
        {loading && <p>Loading categories...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        
        <div className="mb-4">
          <p>Categories found: {categories.length}</p>
          {categories.map(cat => (
            <div key={cat.id} className="text-sm text-gray-600">
              {cat.icon} {cat.name}
            </div>
          ))}
        </div>

        <Button 
          onClick={seedDatabase} 
          disabled={seeding}
          className="w-full"
        >
          {seeding ? 'Seeding...' : 'Seed Database'}
        </Button>

        {message && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            {message}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DatabaseTest; 