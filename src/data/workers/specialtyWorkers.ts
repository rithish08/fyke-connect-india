
export const driverWorkers = [
  { 
    id: '18', 
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
    id: '19', 
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
  { 
    id: '20', 
    name: "Rajesh Khanna", 
    category: "Driver", 
    skills: ["Personal Driver", "Executive Transport", "Punctual"], 
    rating: 4.8,
    distance: "2.2km",
    responseTime: "< 10min",
    hourlyRate: 450,
    isOnline: false,
    completedJobs: 93,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '21', 
    name: "Amit Patel", 
    category: "Driver", 
    skills: ["Tour Guide", "Outstation", "Multi-lingual"], 
    rating: 4.7,
    distance: "1.6km",
    responseTime: "< 6min",
    hourlyRate: 500,
    isOnline: true,
    completedJobs: 54,
    verificationLevel: 'premium' as const,
    profileImage: "/placeholder.svg"
  }
];

export const cookingWorkers = [
  { 
    id: '22', 
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
    id: '23', 
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
  { 
    id: '24', 
    name: "Rekha Devi", 
    category: "Cooking", 
    skills: ["Event Cook", "Large Quantities", "Traditional Food"], 
    rating: 4.6,
    distance: "3.1km",
    responseTime: "< 20min",
    hourlyRate: 380,
    isOnline: true,
    completedJobs: 67,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '25', 
    name: "Rajesh Cook", 
    category: "Cooking", 
    skills: ["Kitchen Helper", "Prep Cook", "Fast Food"], 
    rating: 4.4,
    distance: "2.8km",
    responseTime: "< 12min",
    hourlyRate: 320,
    isOnline: true,
    completedJobs: 38,
    verificationLevel: 'basic' as const,
    profileImage: "/placeholder.svg"
  }
];

export const gardeningWorkers = [
  { 
    id: '26', 
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
    id: '27', 
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
  { 
    id: '28', 
    name: "Suresh Mali", 
    category: "Gardening", 
    skills: ["Plant Care", "Organic Farming", "Soil Management"], 
    rating: 4.7,
    distance: "1.7km",
    responseTime: "< 8min",
    hourlyRate: 300,
    isOnline: false,
    completedJobs: 52,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '29', 
    name: "Krishna Pal", 
    category: "Gardening", 
    skills: ["Lawn Maintenance", "Grass Cutting", "Garden Design"], 
    rating: 4.5,
    distance: "2.6km",
    responseTime: "< 15min",
    hourlyRate: 290,
    isOnline: true,
    completedJobs: 29,
    verificationLevel: 'basic' as const,
    profileImage: "/placeholder.svg"
  }
];

export const beautyWorkers = [
  { 
    id: '30', 
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
    id: '31', 
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
  { 
    id: '32', 
    name: "Priya Beauty", 
    category: "Beauty", 
    skills: ["Nail Technician", "Manicure", "Pedicure"], 
    rating: 4.6,
    distance: "2.1km",
    responseTime: "< 10min",
    hourlyRate: 380,
    isOnline: true,
    completedJobs: 89,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  },
  { 
    id: '33', 
    name: "Sonia Spa", 
    category: "Beauty", 
    skills: ["Spa Therapist", "Massage", "Facial"], 
    rating: 4.8,
    distance: "1.4km",
    responseTime: "< 7min",
    hourlyRate: 420,
    isOnline: true,
    completedJobs: 76,
    verificationLevel: 'verified' as const,
    profileImage: "/placeholder.svg"
  }
];
