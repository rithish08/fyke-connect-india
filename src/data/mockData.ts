
// Mock data for all categories
export const mockWorkers = {
  construction: [
    {
      id: '1',
      name: 'Rajesh Kumar',
      category: 'Construction',
      skills: ['Masonry', 'Concrete Work'],
      rating: 4.8,
      distance: '1.2km',
      responseTime: '15 min',
      hourlyRate: 450,
      isOnline: true,
      completedJobs: 127,
      verificationLevel: 'verified' as const,
    },
    {
      id: '2',
      name: 'Sunil Sharma',
      category: 'Construction',
      skills: ['Carpentry', 'Furniture'],
      rating: 4.6,
      distance: '2.1km',
      responseTime: '30 min',
      hourlyRate: 380,
      isOnline: true,
      completedJobs: 89,
      verificationLevel: 'basic' as const,
    }
  ],
  delivery: [
    {
      id: '3',
      name: 'Amit Singh',
      category: 'Delivery',
      skills: ['Food Delivery', 'Express'],
      rating: 4.9,
      distance: '0.8km',
      responseTime: '10 min',
      hourlyRate: 300,
      isOnline: true,
      completedJobs: 203,
      verificationLevel: 'premium' as const,
    }
  ],
  cleaning: [
    {
      id: '4',
      name: 'Priya Patel',
      category: 'Cleaning',
      skills: ['Deep Cleaning', 'Office'],
      rating: 4.7,
      distance: '1.5km',
      responseTime: '20 min',
      hourlyRate: 250,
      isOnline: true,
      completedJobs: 156,
      verificationLevel: 'verified' as const,
    }
  ],
  security: [
    {
      id: '5',
      name: 'Vikram Yadav',
      category: 'Security',
      skills: ['Night Guard', 'CCTV'],
      rating: 4.8,
      distance: '3.2km',
      responseTime: '45 min',
      hourlyRate: 350,
      isOnline: false,
      completedJobs: 95,
      verificationLevel: 'verified' as const,
    }
  ],
  driver: [
    {
      id: '6',
      name: 'Ravi Gupta',
      category: 'Driver',
      skills: ['Taxi', 'Personal Driver'],
      rating: 4.5,
      distance: '2.8km',
      responseTime: '25 min',
      hourlyRate: 400,
      isOnline: true,
      completedJobs: 178,
      verificationLevel: 'basic' as const,
    }
  ],
  cooking: [
    {
      id: '7',
      name: 'Sunita Devi',
      category: 'Cooking',
      skills: ['Home Cook', 'Event'],
      rating: 4.9,
      distance: '1.8km',
      responseTime: '30 min',
      hourlyRate: 320,
      isOnline: true,
      completedJobs: 234,
      verificationLevel: 'verified' as const,
    }
  ],
  gardening: [
    {
      id: '8',
      name: 'Mohan Lal',
      category: 'Gardening',
      skills: ['Landscaping', 'Plant Care'],
      rating: 4.6,
      distance: '4.1km',
      responseTime: '60 min',
      hourlyRate: 280,
      isOnline: true,
      completedJobs: 67,
      verificationLevel: 'basic' as const,
    }
  ],
  beauty: [
    {
      id: '9',
      name: 'Kavita Sharma',
      category: 'Beauty',
      skills: ['Hair Styling', 'Makeup'],
      rating: 4.8,
      distance: '2.3km',
      responseTime: '40 min',
      hourlyRate: 500,
      isOnline: true,
      completedJobs: 143,
      verificationLevel: 'premium' as const,
    }
  ]
};

export const mockJobs = {
  construction: [
    {
      id: 'job1',
      title: 'House Construction Helper',
      company: 'BuildRight Construction',
      location: 'Sector 21, Gurgaon',
      salary: '500',
      distance: '2.1km',
      timePosted: '3h ago',
      rating: 4.5,
      urgent: true,
      description: 'Need experienced construction worker for house building project.'
    }
  ],
  delivery: [
    {
      id: 'job2',
      title: 'Food Delivery Partner',
      company: 'QuickEats',
      location: 'Central Delhi',
      salary: '400',
      distance: '1.2km',
      timePosted: '1h ago',
      rating: 4.7,
      urgent: false,
      description: 'Flexible hours food delivery job with bike provided.'
    }
  ],
  cleaning: [
    {
      id: 'job3',
      title: 'Office Cleaning Staff',
      company: 'CleanCorp Services',
      location: 'Cyber City, Gurgaon',
      salary: '350',
      distance: '3.5km',
      timePosted: '5h ago',
      rating: 4.3,
      urgent: false,
      description: 'Regular office cleaning position with good benefits.'
    }
  ],
  security: [
    {
      id: 'job4',
      title: 'Night Security Guard',
      company: 'SecureMax',
      location: 'Industrial Area',
      salary: '450',
      distance: '4.2km',
      timePosted: '2h ago',
      rating: 4.6,
      urgent: true,
      description: 'Night shift security position for industrial complex.'
    }
  ],
  driver: [
    {
      id: 'job5',
      title: 'Personal Driver',
      company: 'Elite Drivers',
      location: 'South Delhi',
      salary: '600',
      distance: '2.8km',
      timePosted: '4h ago',
      rating: 4.8,
      urgent: false,
      description: 'Full-time personal driver for family with good salary.'
    }
  ],
  cooking: [
    {
      id: 'job6',
      title: 'Home Cook',
      company: 'HomeMeals',
      location: 'Vasant Kunj',
      salary: '400',
      distance: '1.9km',
      timePosted: '6h ago',
      rating: 4.4,
      urgent: false,
      description: 'Cook for small family, flexible timings.'
    }
  ],
  gardening: [
    {
      id: 'job7',
      title: 'Garden Maintenance',
      company: 'GreenThumb Services',
      location: 'Golf Course Road',
      salary: '350',
      distance: '5.1km',
      timePosted: '8h ago',
      rating: 4.2,
      urgent: false,
      description: 'Regular garden maintenance for residential society.'
    }
  ],
  beauty: [
    {
      id: 'job8',
      title: 'Hair Stylist',
      company: 'Glamour Salon',
      location: 'Connaught Place',
      salary: '700',
      distance: '3.7km',
      timePosted: '2h ago',
      rating: 4.9,
      urgent: true,
      description: 'Experienced hair stylist needed for busy salon.'
    }
  ]
};
