
export const mockWorkers = {
  construction: [
    {
      id: 'w1',
      name: 'Rajesh Kumar',
      category: 'Construction',
      skills: ['Masonry', 'Concrete Work', 'Building'],
      rating: 4.8,
      distance: '2.3 km',
      responseTime: '15 min',
      hourlyRate: 500,
      isOnline: true,
      completedJobs: 45,
      verificationLevel: 'verified' as const,
    },
    {
      id: 'w2',
      name: 'Suresh Patil',
      category: 'Construction',
      skills: ['Painting', 'Plastering', 'Tiling'],
      rating: 4.6,
      distance: '1.8 km',
      responseTime: '20 min',
      hourlyRate: 450,
      isOnline: true,
      completedJobs: 32,
      verificationLevel: 'basic' as const,
    }
  ],
  plumbing: [
    {
      id: 'w3',
      name: 'Mohammed Ali',
      category: 'Plumbing',
      skills: ['Pipe Repair', 'Water Tank', 'Drainage'],
      rating: 4.9,
      distance: '3.1 km',
      responseTime: '10 min',
      hourlyRate: 600,
      isOnline: true,
      completedJobs: 67,
      verificationLevel: 'premium' as const,
    }
  ],
  electrical: [
    {
      id: 'w4',
      name: 'Amit Sharma',
      category: 'Electrical',
      skills: ['Wiring', 'Panel Board', 'Appliance Repair'],
      rating: 4.7,
      distance: '2.8 km',
      responseTime: '12 min',
      hourlyRate: 550,
      isOnline: false,
      completedJobs: 38,
      verificationLevel: 'verified' as const,
    }
  ]
};

export const mockJobs = {
  construction: [
    {
      id: 'j1',
      title: 'Construction Worker Needed',
      company: 'BuildRight Construction',
      location: 'Andheri West, Mumbai',
      salary: '500',
      distance: '2.5 km',
      timePosted: '2 hours ago',
      rating: 4.5,
      urgent: true,
      description: 'Need experienced construction worker for residential building project.'
    },
    {
      id: 'j2',
      title: 'Mason Required',
      company: 'Home Builders',
      location: 'Bandra East, Mumbai',
      salary: '600',
      distance: '3.2 km',
      timePosted: '4 hours ago',
      rating: 4.3,
      urgent: false,
      description: 'Looking for skilled mason for interior work.'
    }
  ],
  plumbing: [
    {
      id: 'j3',
      title: 'Plumber for Urgent Repair',
      company: 'Quick Fix Services',
      location: 'Powai, Mumbai',
      salary: '700',
      distance: '1.8 km',
      timePosted: '1 hour ago',
      rating: 4.7,
      urgent: true,
      description: 'Emergency plumbing repair needed immediately.'
    }
  ],
  electrical: [
    {
      id: 'j4',
      title: 'Electrician for Wiring',
      company: 'Power Solutions',
      location: 'Malad West, Mumbai',
      salary: '550',
      distance: '4.1 km',
      timePosted: '6 hours ago',
      rating: 4.4,
      urgent: false,
      description: 'New house wiring project, experienced electrician needed.'
    }
  ]
};
