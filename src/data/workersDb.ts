
export const workersDb = [
  // Construction Workers
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

  // Delivery Workers
  { 
    id: '4', 
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
    id: '5', 
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

  // Cleaning Workers
  { 
    id: '6', 
    name: "Priya Sharma", 
    category: "Cleaning", 
    skills: ["House Cleaning", "Deep Cleaning", "Sanitization"], 
    rating: 4.8,
    distance: "1.5km",
    responseTime: "< 10min",
    hourlyRate: 280,
    isOnline: true,
    completedJobs: 78,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '7', 
    name: "Sunita Devi", 
    category: "Cleaning", 
    skills: ["Office Cleaning", "Window Cleaning", "Floor Care"], 
    rating: 4.6,
    distance: "2.7km",
    responseTime: "< 15min",
    hourlyRate: 320,
    isOnline: false,
    completedJobs: 45,
    verificationLevel: 'basic' as const,
    profileImage: "/placeholder.svg"
  },

  // Security Workers
  { 
    id: '8', 
    name: "Manoj Gupta", 
    category: "Security", 
    skills: ["Night Guard", "CCTV Operation", "Access Control"], 
    rating: 4.7,
    distance: "2.1km",
    responseTime: "< 12min",
    hourlyRate: 380,
    isOnline: true,
    completedJobs: 56,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '9', 
    name: "Ravi Tiwari", 
    category: "Security", 
    skills: ["Event Security", "Crowd Control", "Emergency Response"], 
    rating: 4.4,
    distance: "4.5km",
    responseTime: "< 25min",
    hourlyRate: 420,
    isOnline: false,
    completedJobs: 34,
    verificationLevel: 'basic' as const,
    profileImage: "/placeholder.svg"
  },

  // Drivers
  { 
    id: '10', 
    name: "Devika Sharma", 
    category: "Driver", 
    skills: ["Taxi Driver", "City Navigation", "Safe Driving"], 
    rating: 4.9,
    distance: "0.8km",
    responseTime: "< 3min",
    hourlyRate: 420,
    isOnline: true,
    completedJobs: 189,
    verificationLevel: 'premium' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '11', 
    name: "Sanjay Kumar", 
    category: "Driver", 
    skills: ["Delivery Driver", "Heavy Vehicle", "Long Distance"], 
    rating: 4.6,
    distance: "3.8km",
    responseTime: "< 18min",
    hourlyRate: 480,
    isOnline: true,
    completedJobs: 67,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },

  // Cooks
  { 
    id: '12', 
    name: "Kavita Rao", 
    category: "Cooking", 
    skills: ["Home Cook", "Indian Cuisine", "Vegetarian"], 
    rating: 4.8,
    distance: "1.9km",
    responseTime: "< 8min",
    hourlyRate: 350,
    isOnline: true,
    completedJobs: 92,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '13', 
    name: "Amit Chef", 
    category: "Cooking", 
    skills: ["Restaurant Chef", "Multi-Cuisine", "Event Catering"], 
    rating: 4.7,
    distance: "2.5km",
    responseTime: "< 15min",
    hourlyRate: 500,
    isOnline: false,
    completedJobs: 45,
    verificationLevel: 'premium' as const,
    profileImage: "/placeholder.svg"
  },

  // Gardening Workers
  { 
    id: '14', 
    name: "Amit Singh", 
    category: "Gardening", 
    skills: ["Landscaping", "Plant Care", "Irrigation"], 
    rating: 4.4,
    distance: "2.1km",
    responseTime: "< 10min",
    hourlyRate: 280,
    isOnline: true,
    completedJobs: 23,
    verificationLevel: 'basic' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '15', 
    name: "Gopal Verma", 
    category: "Gardening", 
    skills: ["Garden Maintenance", "Tree Pruning", "Pest Control"], 
    rating: 4.6,
    distance: "3.4km",
    responseTime: "< 20min",
    hourlyRate: 320,
    isOnline: true,
    completedJobs: 38,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },

  // Beauty Workers
  { 
    id: '16', 
    name: "Sneha Patel", 
    category: "Beauty", 
    skills: ["Hair Stylist", "Hair Cutting", "Makeup"], 
    rating: 4.9,
    distance: "1.6km",
    responseTime: "< 5min",
    hourlyRate: 450,
    isOnline: true,
    completedJobs: 134,
    verificationLevel: 'premium' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '17', 
    name: "Meera Jain", 
    category: "Beauty", 
    skills: ["Makeup Artist", "Bridal Makeup", "Nail Art"], 
    rating: 4.7,
    distance: "2.8km",
    responseTime: "< 12min",
    hourlyRate: 500,
    isOnline: false,
    completedJobs: 67,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },

  // Warehouse Workers
  { 
    id: '18', 
    name: "Rohit Mehta", 
    category: "Warehouse", 
    skills: ["Packing", "Loading", "Inventory Management"], 
    rating: 4.5,
    distance: "4.2km",
    responseTime: "< 25min",
    hourlyRate: 320,
    isOnline: true,
    completedJobs: 45,
    verificationLevel: 'basic' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '19', 
    name: "Ajay Singh", 
    category: "Warehouse", 
    skills: ["Forklift Operator", "Quality Check", "Heavy Lifting"], 
    rating: 4.7,
    distance: "3.9km",
    responseTime: "< 22min",
    hourlyRate: 400,
    isOnline: true,
    completedJobs: 62,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },

  // Manufacturing Workers
  { 
    id: '20', 
    name: "Deepak Kumar", 
    category: "Manufacturing", 
    skills: ["Machine Operator", "Assembly Line", "Quality Control"], 
    rating: 4.6,
    distance: "5.1km",
    responseTime: "< 30min",
    hourlyRate: 380,
    isOnline: false,
    completedJobs: 78,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  }
];
