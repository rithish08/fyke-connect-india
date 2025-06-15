export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  subcategory?: string;
  description: string;
  requirements: string[];
  salary: {
    min: number;
    max: number;
    period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  };
  type: 'full-time' | 'part-time' | 'contract' | 'gig';
  urgent: boolean;
  postedDate: string;
  deadline?: string;
  contactInfo: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  verified: boolean;
  skills: string[];
}

export interface Worker {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  location: string;
  availability: 'full-time' | 'part-time' | 'flexible';
  skills: string[];
  experience: string;
  hourlyRate: number;
  rating: number;
  profilePicture: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
}

export const mockWorkers = {
  construction: [
    {
      id: 'worker-001',
      name: 'Rajesh Kumar',
      category: 'Construction',
      subcategory: 'Mason',
      location: 'Mumbai, Maharashtra',
      availability: 'full-time',
      skills: ['Bricklaying', 'Plastering', 'Tiling'],
      experience: '5 years',
      hourlyRate: 150,
      rating: 4.5,
      profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
      phone: '+91 9876543210',
      whatsapp: '+91 9876543210'
    },
    {
      id: 'worker-002',
      name: 'Priya Sharma',
      category: 'Construction',
      subcategory: 'Carpenter',
      location: 'Delhi, NCR',
      availability: 'part-time',
      skills: ['Woodworking', 'Furniture making', 'Repair'],
      experience: '3 years',
      hourlyRate: 120,
      rating: 4.2,
      profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'priya.sharma@email.com'
    }
  ],
  delivery: [
    {
      id: 'worker-003',
      name: 'Amit Patel',
      category: 'Delivery',
      subcategory: 'Courier',
      location: 'Bangalore, Karnataka',
      availability: 'flexible',
      skills: ['Driving', 'Navigation', 'Customer Service'],
      experience: '2 years',
      hourlyRate: 100,
      rating: 4.0,
      profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
      phone: '+91 9876543211'
    }
  ],
  cleaning: [
    {
      id: 'worker-004',
      name: 'Sunita Devi',
      category: 'Cleaning',
      subcategory: 'Housekeeping',
      location: 'Chennai, Tamil Nadu',
      availability: 'part-time',
      skills: ['Sweeping', 'Mopping', 'Dusting'],
      experience: '4 years',
      hourlyRate: 80,
      rating: 4.3,
      profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
      phone: '+91 9876543212'
    }
  ],
  security: [
    {
      id: 'worker-005',
      name: 'Karthik Nair',
      category: 'Security',
      subcategory: 'Security Guard',
      location: 'Pune, Maharashtra',
      availability: 'full-time',
      skills: ['Surveillance', 'Patrolling', 'First Aid'],
      experience: '6 years',
      hourlyRate: 180,
      rating: 4.7,
      profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg',
      email: 'karthik.nair@email.com'
    }
  ],
  driver: [
    {
      id: 'worker-006',
      name: 'Lakshmi Reddy',
      category: 'Driver',
      subcategory: 'Taxi Driver',
      location: 'Hyderabad, Telangana',
      availability: 'flexible',
      skills: ['Driving', 'Navigation', 'Customer Service'],
      experience: '4 years',
      hourlyRate: 130,
      rating: 4.4,
      profilePicture: 'https://randomuser.me/api/portraits/women/6.jpg',
      phone: '+91 9876543213'
    }
  ],
  cooking: [
    {
      id: 'worker-007',
      name: 'Govind Singh',
      category: 'Cooking',
      subcategory: 'Chef',
      location: 'Kolkata, West Bengal',
      availability: 'full-time',
      skills: ['Indian Cuisine', 'Continental Cuisine', 'Baking'],
      experience: '8 years',
      hourlyRate: 200,
      rating: 4.8,
      profilePicture: 'https://randomuser.me/api/portraits/men/7.jpg',
      email: 'govind.singh@email.com'
    }
  ],
  gardening: [
    {
      id: 'worker-008',
      name: 'Meena Kumari',
      category: 'Gardening',
      subcategory: 'Gardener',
      location: 'Ahmedabad, Gujarat',
      availability: 'part-time',
      skills: ['Planting', 'Pruning', 'Landscaping'],
      experience: '3 years',
      hourlyRate: 100,
      rating: 4.1,
      profilePicture: 'https://randomuser.me/api/portraits/women/8.jpg',
      phone: '+91 9876543214'
    }
  ],
  beauty: [
    {
      id: 'worker-009',
      name: 'Farida Khan',
      category: 'Beauty',
      subcategory: 'Beautician',
      location: 'Surat, Gujarat',
      availability: 'flexible',
      skills: ['Hair Styling', 'Makeup', 'Skincare'],
      experience: '5 years',
      hourlyRate: 160,
      rating: 4.6,
      profilePicture: 'https://randomuser.me/api/portraits/women/9.jpg',
      email: 'farida.khan@email.com'
    }
  ]
};

export const mockJobs = {
  construction: [
    {
      id: 'job1',
      title: 'Construction Worker',
      company: 'BuildPro Construction',
      location: 'Mumbai, Maharashtra',
      category: 'Construction',
      description: 'We are looking for experienced construction workers for a residential building project.',
      salary: '500',
      salaryPeriod: 'day',
      urgent: true,
      postedTime: '2 hours ago',
      employerId: 'emp1',
      requirements: ['1+ years experience', 'Physical fitness', 'Safety awareness'],
      benefits: ['Daily payment', 'Safety equipment provided', 'Overtime pay']
    },
    {
      id: 'job2',
      title: 'Site Supervisor',
      company: 'MegaBuild Corp',
      location: 'Delhi, NCR',
      category: 'Construction',
      description: 'Supervise construction activities and ensure quality standards.',
      salary: '800',
      salaryPeriod: 'day',
      urgent: false,
      postedTime: '1 day ago',
      employerId: 'emp2',
      requirements: ['5+ years experience', 'Leadership skills', 'Technical knowledge'],
      benefits: ['Performance bonus', 'Career growth', 'Health insurance']
    }
  ],
  delivery: [
    {
      id: 'job3',
      title: 'Delivery Partner',
      company: 'QuickDelivery',
      location: 'Bangalore, Karnataka',
      category: 'Delivery',
      description: 'Join our delivery team with flexible working hours.',
      salary: '20000',
      salaryPeriod: 'month',
      urgent: false,
      postedTime: '3 hours ago',
      employerId: 'emp3',
      requirements: ['Own vehicle', 'Valid license', 'Smartphone'],
      benefits: ['Fuel allowance', 'Flexible hours', 'Insurance coverage']
    }
  ],
  cleaning: [
    {
      id: 'job4',
      title: 'Office Cleaner',
      company: 'CleanPro Services',
      location: 'Chennai, Tamil Nadu',
      category: 'Cleaning',
      description: 'Professional cleaning services for corporate offices.',
      salary: '300',
      salaryPeriod: 'day',
      urgent: false,
      postedTime: '5 hours ago',
      employerId: 'emp4',
      requirements: ['Attention to detail', 'Reliability', 'Previous experience'],
      benefits: ['Weekly payment', 'Training provided', 'Uniform provided']
    }
  ],
  security: [
    {
      id: 'job5',
      title: 'Security Guard',
      company: 'SecureMax Security',
      location: 'Pune, Maharashtra',
      category: 'Security',
      description: 'Night shift security guard for residential complex.',
      salary: '15000',
      salaryPeriod: 'month',
      urgent: true,
      postedTime: '1 hour ago',
      employerId: 'emp5',
      requirements: ['Security training', 'Physical fitness', 'Night shift availability'],
      benefits: ['Monthly salary', 'Accommodation provided', 'Health checkup']
    }
  ]
};
