
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

export const mockJobs: Job[] = [
  {
    id: 'job-001',
    title: 'Construction Worker',
    company: 'BuildPro Construction',
    location: 'Mumbai, Maharashtra',
    category: 'Construction',
    subcategory: 'General Construction',
    description: 'We are looking for experienced construction workers for a residential building project. The work includes concrete pouring, brick laying, and general construction activities.',
    requirements: [
      'Minimum 1 year construction experience',
      'Physical fitness required',
      'Basic tools knowledge',
      'Safety protocol awareness'
    ],
    salary: {
      min: 400,
      max: 600,
      period: 'daily'
    },
    type: 'contract',
    urgent: true,
    postedDate: '2025-06-14',
    deadline: '2025-06-20',
    contactInfo: {
      phone: '+91 9876543210',
      whatsapp: '+91 9876543210'
    },
    verified: true,
    skills: ['Construction', 'Manual Labor', 'Safety Protocols']
  },
  {
    id: 'job-002',
    title: 'Delivery Partner',
    company: 'QuickDelivery Services',
    location: 'Delhi, NCR',
    category: 'Delivery',
    subcategory: 'Food Delivery',
    description: 'Join our team as a delivery partner. Flexible working hours, earn up to ₹25,000 per month. Own vehicle required.',
    requirements: [
      'Own two-wheeler with valid documents',
      'Valid driving license',
      'Smartphone with internet',
      'Good knowledge of local area'
    ],
    salary: {
      min: 20000,
      max: 25000,
      period: 'monthly'
    },
    type: 'part-time',
    urgent: false,
    postedDate: '2025-06-13',
    contactInfo: {
      phone: '+91 9876543211',
      email: 'hr@quickdelivery.com'
    },
    verified: true,
    skills: ['Driving', 'Customer Service', 'Time Management']
  },
  {
    id: 'job-003',
    title: 'House Cleaning',
    company: 'CleanPro Services',
    location: 'Bangalore, Karnataka',
    category: 'Cleaning',
    subcategory: 'Residential Cleaning',
    description: 'Professional house cleaning services needed. Part-time work, flexible hours, training provided.',
    requirements: [
      'Previous cleaning experience preferred',
      'Attention to detail',
      'Reliable and trustworthy',
      'Physical ability to perform cleaning tasks'
    ],
    salary: {
      min: 300,
      max: 500,
      period: 'daily'
    },
    type: 'part-time',
    urgent: false,
    postedDate: '2025-06-12',
    contactInfo: {
      phone: '+91 9876543212'
    },
    verified: true,
    skills: ['Cleaning', 'Time Management', 'Customer Service']
  },
  {
    id: 'job-004',
    title: 'Security Guard',
    company: 'SecureMax Security',
    location: 'Pune, Maharashtra',
    category: 'Security',
    subcategory: 'Residential Security',
    description: 'Night shift security guard required for residential complex. 12-hour shifts, 6 days a week.',
    requirements: [
      'Previous security experience',
      'Physical fitness',
      'Basic English communication',
      'Clean background check'
    ],
    salary: {
      min: 15000,
      max: 18000,
      period: 'monthly'
    },
    type: 'full-time',
    urgent: true,
    postedDate: '2025-06-14',
    deadline: '2025-06-18',
    contactInfo: {
      phone: '+91 9876543213',
      email: 'jobs@securemax.com'
    },
    verified: true,
    skills: ['Security', 'Physical Fitness', 'Communication']
  },
  {
    id: 'job-005',
    title: 'Cook/Chef',
    company: 'Tasty Bites Restaurant',
    location: 'Chennai, Tamil Nadu',
    category: 'Cooking',
    subcategory: 'Restaurant Cooking',
    description: 'Experienced cook needed for busy restaurant. Must know South Indian and North Indian cuisine.',
    requirements: [
      'Minimum 2 years cooking experience',
      'Knowledge of Indian cuisine',
      'Food safety awareness',
      'Ability to work under pressure'
    ],
    salary: {
      min: 18000,
      max: 25000,
      period: 'monthly'
    },
    type: 'full-time',
    urgent: false,
    postedDate: '2025-06-11',
    contactInfo: {
      phone: '+91 9876543214'
    },
    verified: true,
    skills: ['Cooking', 'Food Safety', 'Time Management']
  }
];

export const searchJobs = (query: string, category?: string, location?: string, urgentOnly?: boolean): Job[] => {
  let results = mockJobs;

  // Filter by search query
  if (query.trim()) {
    const searchTerm = query.toLowerCase().trim();
    results = results.filter(job => 
      job.title.toLowerCase().includes(searchTerm) ||
      job.category.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
  }

  // Filter by category
  if (category) {
    results = results.filter(job => 
      job.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by location
  if (location && location.trim()) {
    results = results.filter(job => 
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  // Filter urgent only
  if (urgentOnly) {
    results = results.filter(job => job.urgent);
  }

  return results;
};

export const getJobById = (id: string): Job | undefined => {
  return mockJobs.find(job => job.id === id);
};
