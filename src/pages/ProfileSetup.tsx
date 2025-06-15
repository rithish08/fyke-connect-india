
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProfileCategoryStep from '@/components/profile/ProfileCategoryStep';
import ModernMultiSalaryStep from '@/components/profile/ModernMultiSalaryStep';
import PersonalDetailsStep from '@/components/profile/PersonalDetailsStep';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSetupSchema, ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('');
  const [vehicle, setVehicle] = useState('');

  const { userProfile, completeProfileSetup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      name: '',
      category: '',
      subcategories: [],
      vehicle: '',
      salaryBySubcategory: {},
      availability: 'available'
    }
  });

  useEffect(() => {
    if (!userProfile) {
      navigate('/role-selection');
      return;
    }
    
    if (userProfile.role !== 'jobseeker') {
      navigate('/home');
      return;
    }
    
    if (userProfile.profile_complete) {
      navigate('/home');
      return;
    }

    if (userProfile.name) setName(userProfile.name);
    if (userProfile.location) setLocation(userProfile.location);
    if (userProfile.bio) setBio(userProfile.bio);
  }, [userProfile, navigate]);

  useEffect(() => {
    if (category) {
      form.setValue('category', category);
    }
  }, [category, form]);

  useEffect(() => {
    if (vehicle) {
      form.setValue('vehicle', vehicle);
    }
  }, [vehicle, form]);

  const handleNext = () => {
    if (currentStep === 1) {
      const savedSubcategories = localStorage.getItem('fyke_selected_subcategories');
      const subcategories = savedSubcategories ? JSON.parse(savedSubcategories) : [];
      
      form.setValue('subcategories', subcategories);
      
      const vehicleOwnerSubs = [
        'Cargo Auto', 'Mini Truck (e.g., Tata Ace)', 'Lorry / Truck (6–12 wheeler)',
        'Tractor with Trailer', 'Bike with Carrier', 'Auto Rickshaw', 'Bike Taxi',
        'Taxi (Sedan/Hatchback)', 'Passenger Van (Eeco, Force)', 'Private Bus (15–50 seats)',
        'Water Tanker', 'Ambulance'
      ];
      
      const hasOnlyVehicleCategories = subcategories.length > 0 && 
        subcategories.every((sub: string) => vehicleOwnerSubs.includes(sub));
      
      if (hasOnlyVehicleCategories) {
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSalaryNext = () => {
    setCurrentStep(3);
  };

  const handleComplete = async () => {
    if (!name.trim() || !location.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await completeProfileSetup();
      
      localStorage.removeItem('fyke_selected_subcategories');
      localStorage.removeItem('fyke_profile_category');
      localStorage.removeItem('fyke_profile_subcategories');
      localStorage.removeItem('fyke_profile_vehicle');
      
      toast({
        title: "Profile Complete!",
        description: "Welcome to Fyke! You can now start finding jobs."
      });
      
      navigate('/home');
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to complete profile setup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProfileCategoryStep
            category={category}
            setCategory={setCategory}
            vehicle={vehicle}
            setVehicle={setVehicle}
            role="jobseeker"
            onNext={handleNext}
          />
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Set Your Rates</h2>
              <p className="text-gray-500">How much do you charge for each service?</p>
            </div>
            
            <ModernMultiSalaryStep
              form={form}
              onNext={handleSalaryNext}
              onBack={handleBack}
            />
            
            <div className="flex justify-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <PersonalDetailsStep
            name={name}
            setName={setName}
            location={location}
            setLocation={setLocation}
            bio={bio}
            setBio={setBio}
            onComplete={handleComplete}
            loading={loading}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        )}
        <div className="flex-1 text-center">
          <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
