
export const constructionWorkers = [
  { 
    id: '1', 
    name: "Raj Kumar", 
    category: "Construction", 
    skills: ["Mason", "Brick Laying", "Cement Work"], 
    rating: 4.8,
    distance: "1.2km",
    responseTime: "< 5min",
    hourlyRate: 350,
    isOnline: true,
    completedJobs: 47,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '2', 
    name: "Suresh Patil", 
    category: "Construction", 
    skills: ["Electrician", "Wiring", "Maintenance"], 
    rating: 4.6,
    distance: "2.3km",
    responseTime: "< 15min",
    hourlyRate: 400,
    isOnline: true,
    completedJobs: 32,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '3', 
    name: "Ramesh Singh", 
    category: "Construction", 
    skills: ["Plumber", "Pipe Fitting", "Repair"], 
    rating: 4.9,
    distance: "1.8km",
    responseTime: "< 10min",
    hourlyRate: 450,
    isOnline: false,
    completedJobs: 65,
    verificationLevel: 'premium' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '4', 
    name: "Vikash Yadav", 
    category: "Construction", 
    skills: ["Carpenter", "Wood Work", "Furniture"], 
    rating: 4.7,
    distance: "2.1km",
    responseTime: "< 8min",
    hourlyRate: 380,
    isOnline: true,
    completedJobs: 28,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '5', 
    name: "Mohan Gupta", 
    category: "Construction", 
    skills: ["Painter", "Wall Painting", "Decoration"], 
    rating: 4.5,
    distance: "3.2km",
    responseTime: "< 20min",
    hourlyRate: 320,
    isOnline: true,
    completedJobs: 41,
    verificationLevel: 'basic' as const,
    profileImage: "/placeholder.svg"
  }
];
