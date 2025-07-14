import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Briefcase, PlusCircle, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WageEditModal } from './WageEditModal';
import { Wage, AvailabilityStatus } from '@/types/profile';

// Map online to available for compatibility
const mapAvailabilityStatus = (status: AvailabilityStatus): 'available' | 'busy' | 'offline' => {
  return status === 'online' ? 'available' : status as 'available' | 'busy' | 'offline';
};

export const AvailabilityWages: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [availability, setAvailability] = useState<AvailabilityStatus>('offline');
  const [wages, setWages] = useState<Record<string, Wage>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setAvailability(user.availability as AvailabilityStatus || 'offline');
      setWages(user.category_wages || {});
    }
  }, [user]);

  const handleOpenModal = (category: string) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveWage = async (category: string, newWage: Wage) => {
    const updatedWages = { ...wages, [category]: newWage };
    await updateProfile({ category_wages: updatedWages });
    setWages(updatedWages);
    handleCloseModal();
  };

  const handleAvailabilityChange = async (value: AvailabilityStatus) => {
    setIsLoading(true);
    setAvailability(value);
    await updateProfile({ availability: mapAvailabilityStatus(value) });
    setIsLoading(false);
  };

  const userCategories = user?.categories || [];

  const getWageDisplay = (wage: Wage | undefined) => {
    if (!wage || !wage.rate) return <span className="text-gray-500">Not Set</span>;
    const unitMap = { per_hour: '/hr', per_day: '/day', fixed: 'fixed' };
    return `₹${wage.rate} ${unitMap[wage.unit]}`;
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Availability & Wages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Availability Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="availability-status" className="font-semibold text-md">My Status</Label>
            <Select value={availability} onValueChange={handleAvailabilityChange} disabled={isLoading}>
              <SelectTrigger id="availability-status">
                <SelectValue placeholder="Set your status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online - Available for work</SelectItem>
                <SelectItem value="busy">Busy - Not taking new work</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Wages List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-md">My Rates</h4>
            {userCategories.length > 0 ? (
              userCategories.map(category => (
                <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-bold text-gray-800">{category}</p>
                    <p className="text-sm">{getWageDisplay(wages[category])}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleOpenModal(category)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 px-4 bg-gray-50 text-gray-700 rounded-lg space-y-3">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto"/>
                <p className="font-semibold">Add work categories to set wages</p>
                <p className="text-sm">You need to select your skills before you can set rates for them.</p>
                <Button variant="outline" size="sm" onClick={() => navigate('/profile-setup')}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Categories
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <WageEditModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
        currentWage={selectedCategory ? wages[selectedCategory] : null}
        onSave={handleSaveWage}
      />
    </>
  );
};
