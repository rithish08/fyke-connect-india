
export const deliveryWorkers = [
  { 
    id: '6', 
    name: "Arjun Reddy", 
    category: "Delivery", 
    skills: ["Food Delivery", "Two Wheeler", "Fast Service"], 
    rating: 4.7,
    distance: "0.8km",
    responseTime: "< 3min",
    hourlyRate: 300,
    isOnline: true,
    completedJobs: 156,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '7', 
    name: "Vikram Joshi", 
    category: "Delivery", 
    skills: ["Package Delivery", "Four Wheeler", "Long Distance"], 
    rating: 4.5,
    distance: "3.2km",
    responseTime: "< 20min",
    hourlyRate: 400,
    isOnline: true,
    completedJobs: 89,
    verificationLevel: 'basic' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '8', 
    name: "Rohit Sharma", 
    category: "Delivery", 
    skills: ["Grocery Delivery", "Two Wheeler", "Customer Service"], 
    rating: 4.6,
    distance: "1.5km",
    responseTime: "< 7min",
    hourlyRate: 290,
    isOnline: true,
    completedJobs: 112,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '9', 
    name: "Ankit Kumar", 
    category: "Delivery", 
    skills: ["Medicine Delivery", "Urgent Delivery", "Safe Handling"], 
    rating: 4.8,
    distance: "2.4km",
    responseTime: "< 5min",
    hourlyRate: 350,
    isOnline: false,
    completedJobs: 94,
    verificationLevel: 'premium' as const,
    profileImage: "/placeholder.svg"
  }
];
