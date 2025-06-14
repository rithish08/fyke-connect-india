
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
      // Complete list of jobs for all categories
      const allJobs: Job[] = [
        // Construction Jobs
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
          title: "Mason Required Urgently", 
          company: "City Builders",
          category: "Construction", 
          salary: "₹600-800/day",
          location: "Delhi",
          urgent: true,
          distance: "1.2km",
          postedTime: "1h ago",
          skills: ["Mason", "Brick Laying"]
        },
        { 
          id: 3, 
          title: "Electrician for Wiring", 
          company: "ElectroMax",
          category: "Construction", 
          salary: "₹700-900/day",
          location: "Bangalore",
          urgent: false,
          distance: "3.1km",
          postedTime: "4h ago",
          skills: ["Electrician", "Wiring"]
        },

        // Delivery Jobs
        { 
          id: 4, 
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
          id: 5, 
          title: "Food Delivery Partner", 
          company: "FoodFast",
          category: "Delivery", 
          salary: "₹500-700/day",
          location: "Chennai",
          urgent: true,
          distance: "0.9km",
          postedTime: "30min ago",
          skills: ["Food Delivery", "Fast Service"]
        },

        // Cleaning Jobs
        { 
          id: 6, 
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
          id: 7, 
          title: "Office Cleaning Required", 
          company: "Corporate Clean",
          category: "Cleaning", 
          salary: "₹400-600/day",
          location: "Gurgaon",
          urgent: false,
          distance: "2.8km",
          postedTime: "5h ago",
          skills: ["Office Cleaning", "Sanitization"]
        },

        // Security Jobs
        { 
          id: 8, 
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
          id: 9, 
          title: "Night Watchman", 
          company: "Safe Guard Services",
          category: "Security", 
          salary: "₹400-500/day",
          location: "Mumbai",
          urgent: true,
          distance: "2.1km",
          postedTime: "2h ago",
          skills: ["Night Guard", "Patrolling"]
        },

        // Driver Jobs
        { 
          id: 10, 
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
          id: 11, 
          title: "Taxi Driver Needed", 
          company: "City Cabs",
          category: "Driver", 
          salary: "₹500-700/day",
          location: "Kolkata",
          urgent: false,
          distance: "4.2km",
          postedTime: "3h ago",
          skills: ["Taxi Driver", "Customer Service"]
        },

        // Cooking Jobs
        { 
          id: 12, 
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
          id: 13, 
          title: "Restaurant Chef", 
          company: "Spice Palace",
          category: "Cooking", 
          salary: "₹600-900/day",
          location: "Mumbai",
          urgent: true,
          distance: "1.7km",
          postedTime: "1h ago",
          skills: ["Restaurant Chef", "Multi-Cuisine"]
        },

        // Gardening Jobs
        { 
          id: 14, 
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
          id: 15, 
          title: "Landscaper Required", 
          company: "Nature Pro",
          category: "Gardening", 
          salary: "₹400-600/day",
          location: "Bangalore",
          urgent: false,
          distance: "3.5km",
          postedTime: "4h ago",
          skills: ["Landscaping", "Garden Design"]
        },

        // Beauty Jobs
        { 
          id: 16, 
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
        { 
          id: 17, 
          title: "Makeup Artist Needed", 
          company: "Beauty Studio",
          category: "Beauty", 
          salary: "₹600-800/day",
          location: "Delhi",
          urgent: false,
          distance: "2.4km",
          postedTime: "3h ago",
          skills: ["Makeup Artist", "Bridal Makeup"]
        },
      ];
      
      // Filter jobs based on user's selected category
      if (user?.primaryCategory) {
        const filteredJobs = allJobs.filter(j => j.category === user.primaryCategory);
        setJobs(filteredJobs);
      } else {
        // If no primary category, show all jobs
        setJobs(allJobs);
      }
    }, 1200); // fake load
  }, [user]);

  return { jobs, isLoading: jobs === null };
};
