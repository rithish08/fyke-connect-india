
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  company: string;
  category: string;
  subcategory?: string;
  salary: string;
  location: string;
  urgent: boolean;
  distance: string;
  timePosted: string;
  skills: string[];
  rating?: number;
  description?: string;
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
          id: "1", 
          title: "Construction Worker Needed", 
          company: "BuildPro Construction",
          category: "Construction",
          subcategory: "Mason",
          salary: "₹500-700/day",
          location: "Mumbai",
          urgent: true,
          distance: "2.5km",
          timePosted: "2h ago",
          skills: ["Cement Work", "Building"],
          rating: 4.5,
          description: "Looking for experienced construction workers for residential project"
        },
        { 
          id: "2", 
          title: "Mason Required Urgently", 
          company: "City Builders",
          category: "Construction",
          subcategory: "Mason",
          salary: "₹600-800/day",
          location: "Delhi",
          urgent: true,
          distance: "1.2km",
          timePosted: "1h ago",
          skills: ["Mason", "Brick Laying"],
          rating: 4.8
        },
        { 
          id: "3", 
          title: "Electrician for Wiring", 
          company: "ElectroMax",
          category: "Construction",
          subcategory: "Electrician",
          salary: "₹700-900/day",
          location: "Bangalore",
          urgent: false,
          distance: "3.1km",
          timePosted: "4h ago",
          skills: ["Electrician", "Wiring"],
          rating: 4.2
        },

        // Delivery Jobs
        { 
          id: "4", 
          title: "Delivery Executive", 
          company: "QuickDelivery Services",
          category: "Delivery",
          subcategory: "Package Delivery",
          salary: "₹400-600/day",
          location: "Pune",
          urgent: false,
          distance: "1.8km",
          timePosted: "4h ago",
          skills: ["Two Wheeler", "Navigation"]
        },
        { 
          id: "5", 
          title: "Food Delivery Partner", 
          company: "FoodFast",
          category: "Delivery",
          subcategory: "Food Delivery",
          salary: "₹500-700/day",
          location: "Chennai",
          urgent: true,
          distance: "0.9km",
          timePosted: "30min ago",
          skills: ["Food Delivery", "Fast Service"],
          rating: 4.6
        },

        // Cleaning Jobs
        { 
          id: "6", 
          title: "House Cleaning Service", 
          company: "CleanMax Services",
          category: "Cleaning",
          subcategory: "House Cleaning",
          salary: "₹300-500/day",
          location: "Bangalore",
          urgent: true,
          distance: "1.5km",
          timePosted: "1h ago",
          skills: ["Deep Cleaning", "House Cleaning"],
          rating: 4.3
        },

        // Security Jobs
        { 
          id: "8", 
          title: "Security Guard", 
          company: "SecureMax",
          category: "Security",
          subcategory: "Night Guard",
          salary: "₹350-450/day",
          location: "Chennai",
          urgent: false,
          distance: "3.2km",
          timePosted: "6h ago",
          skills: ["Night Shift", "CCTV"]
        },

        // Driver Jobs
        { 
          id: "10", 
          title: "Personal Driver Required", 
          company: "Elite Transport",
          category: "Driver",
          subcategory: "Personal Driver",
          salary: "₹600-800/day",
          location: "Delhi",
          urgent: false,
          distance: "3.8km",
          timePosted: "5h ago",
          skills: ["Personal Driver", "City Navigation"]
        }
      ];
      
      // Filter jobs based on user's selected categories and subcategories
      if (user?.categories && user.categories.length > 0) {
        const filteredJobs = allJobs.filter(job => {
          // Check if job category matches any of user's categories
          const categoryMatch = user.categories.includes(job.category);
          
          // Check if job subcategory matches any of user's subcategories
          const subcategoryMatch = user.subcategories && job.subcategory ? 
            user.subcategories.includes(job.subcategory) : true;
          
          return categoryMatch && subcategoryMatch;
        });
        setJobs(filteredJobs);
      } else if (user?.primaryCategory) {
        // Fallback to primary category if no categories array
        const filteredJobs = allJobs.filter(j => j.category === user.primaryCategory);
        setJobs(filteredJobs);
      } else {
        // If no categories, show all jobs
        setJobs(allJobs);
      }
    }, 1200);
  }, [user]);

  return { jobs, isLoading: jobs === null };
};
