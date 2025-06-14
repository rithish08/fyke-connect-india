
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Job {
  id: number;
  title: string;
  company: string;
  category: string;
  salary: string;
  location: string;
  urgent: boolean;
  distance: string;
  postedTime: string;
  skills: string[];
}

export const useJobSeekerJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[] | null>(null);

  useEffect(() => {
    setTimeout(() => {
      // Example jobs with more details
      const allJobs: Job[] = [
        { 
          id: 1, 
          title: "Construction Worker Needed", 
          company: "BuildPro Construction",
          category: "Construction", 
          salary: "₹500-700/day",
          location: "Mumbai",
          urgent: true,
          distance: "2.5km",
          postedTime: "2h ago",
          skills: ["Cement Work", "Building"]
        },
        { 
          id: 2, 
          title: "Delivery Executive", 
          company: "QuickDelivery Services",
          category: "Delivery", 
          salary: "₹400-600/day",
          location: "Pune",
          urgent: false,
          distance: "1.8km",
          postedTime: "4h ago",
          skills: ["Two Wheeler", "Navigation"]
        },
        { 
          id: 3, 
          title: "Security Guard", 
          company: "SecureMax",
          category: "Security", 
          salary: "₹350-450/day",
          location: "Chennai",
          urgent: false,
          distance: "3.2km",
          postedTime: "6h ago",
          skills: ["Night Shift", "CCTV"]
        },
        { 
          id: 4, 
          title: "House Cleaning Service", 
          company: "CleanMax Services",
          category: "Cleaning", 
          salary: "₹300-500/day",
          location: "Bangalore",
          urgent: true,
          distance: "1.5km",
          postedTime: "1h ago",
          skills: ["Deep Cleaning", "House Cleaning"]
        },
        { 
          id: 5, 
          title: "Personal Driver Required", 
          company: "Elite Transport",
          category: "Driver", 
          salary: "₹600-800/day",
          location: "Delhi",
          urgent: false,
          distance: "3.8km",
          postedTime: "5h ago",
          skills: ["Personal Driver", "City Navigation"]
        },
        { 
          id: 6, 
          title: "Home Cook Needed", 
          company: "Family Kitchen",
          category: "Cooking", 
          salary: "₹400-600/day",
          location: "Hyderabad",
          urgent: false,
          distance: "2.2km",
          postedTime: "3h ago",
          skills: ["Home Cook", "Indian Cuisine"]
        },
        { 
          id: 7, 
          title: "Garden Maintenance", 
          company: "Green Spaces",
          category: "Gardening", 
          salary: "₹350-450/day",
          location: "Pune",
          urgent: false,
          distance: "4.1km",
          postedTime: "7h ago",
          skills: ["Plant Care", "Landscaping"]
        },
        { 
          id: 8, 
          title: "Hair Stylist Required", 
          company: "Glamour Salon",
          category: "Beauty", 
          salary: "₹500-700/day",
          location: "Mumbai",
          urgent: true,
          distance: "1.9km",
          postedTime: "30min ago",
          skills: ["Hair Styling", "Customer Service"]
        },
      ];
      
      // Filter jobs based on user's selected category
      if (user?.primaryCategory) {
        setJobs(allJobs.filter(j => j.category === user.primaryCategory));
      } else {
        setJobs(allJobs);
      }
    }, 1200); // fake load
  }, [user]);

  return { jobs, isLoading: jobs === null };
};
