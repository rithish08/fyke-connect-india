import { supabase } from '@/integrations/supabase/client';

// Categories data from the static file
const categoriesData = [
  { 
    name: "Construction", 
    icon: "🏗️", 
    description: "Construction and building related work",
    subcategories: ["Mason", "Carpenter", "Electrician", "Plumber", "Painter", "Welder"] 
  },
  { 
    name: "Delivery", 
    icon: "🚚", 
    description: "Delivery and transportation services",
    subcategories: ["Food Delivery", "Package Delivery", "Grocery Delivery", "Medicine Delivery"] 
  },
  { 
    name: "Cleaning", 
    icon: "🧹", 
    description: "Cleaning and maintenance services",
    subcategories: ["House Cleaning", "Office Cleaning", "Deep Cleaning", "Post-Construction Cleaning"] 
  },
  { 
    name: "Security", 
    icon: "🛡️", 
    description: "Security and protection services",
    subcategories: ["Night Guard", "Event Security", "CCTV Operator", "Residential Security"] 
  },
  { 
    name: "Driver", 
    icon: "🚗", 
    description: "Driving and transportation services",
    subcategories: ["Taxi Driver", "Delivery Driver", "Personal Driver", "Tour Guide"] 
  },
  { 
    name: "Vehicle Owners", 
    icon: "🚛", 
    description: "Vehicle ownership and operation services",
    subcategories: [
      "Cargo Auto", "Mini Truck (Tata Ace)", "Lorry / Truck (6–12 wheeler)", 
      "Tractor with Trailer", "Bike with Carrier", "Auto Rickshaw", "Bike Taxi", 
      "Taxi (Sedan/Hatchback)", "Passenger Van (Eeco, Force)", "Private Bus (15–50 seats)", 
      "Water Tanker", "Ambulance"
    ] 
  },
  { 
    name: "Mechanic", 
    icon: "🔧", 
    description: "Mechanical and repair services",
    subcategories: ["Two Wheeler Mechanic", "Trucker Mechanic", "Car Mechanic", "Heavy Vehicle Mechanic", "Puncture Repair Worker"] 
  },
  { 
    name: "Cooking", 
    icon: "👨‍🍳", 
    description: "Cooking and culinary services",
    subcategories: ["Home Cook", "Event Cook", "Kitchen Helper", "Catering Assistant"] 
  },
  { 
    name: "Gardening", 
    icon: "🌱", 
    description: "Gardening and landscaping services",
    subcategories: ["Gardener", "Landscaper", "Plant Care", "Lawn Maintenance"] 
  },
  { 
    name: "Beauty", 
    icon: "💄", 
    description: "Beauty and personal care services",
    subcategories: ["Hair Stylist", "Makeup Artist", "Nail Technician", "Spa Therapist"] 
  },
  { 
    name: "Media & Content", 
    icon: "📸", 
    description: "Media and content creation services",
    subcategories: ["Photographer", "Videographer", "Video Editor", "Social Media Manager", "YouTube Video Scriptwriter"] 
  },
  { 
    name: "Repairs & Maintenance", 
    icon: "🧰", 
    description: "Repair and maintenance services",
    subcategories: ["AC / Fridge / Washing Machine Repair", "TV / Electronics Repair", "Mobile / Laptop Repair", "Appliance Installation"] 
  },
  { 
    name: "Farming & Agro", 
    icon: "🚜", 
    description: "Farming and agricultural services",
    subcategories: ["Farm Laborer", "Tractor Operator", "Irrigation Assistant", "Crop Harvester"] 
  },
  { 
    name: "Warehouse & Logistics", 
    icon: "📦", 
    description: "Warehouse and logistics services",
    subcategories: ["Picker / Packer", "Warehouse Assistant", "Inventory Handler", "Forklift Operator"] 
  },
  { 
    name: "Office / Admin", 
    icon: "💼", 
    description: "Office and administrative services",
    subcategories: ["Office Boy / Peon", "Data Entry Operator", "Document Courier", "Front Desk Assistant"] 
  },
  { 
    name: "Event & Hospitality", 
    icon: "🎪", 
    description: "Event and hospitality services",
    subcategories: ["Event Helper / Setup Crew", "Waiter / Steward", "Bartender (Licensed)", "Event Venue Cleaner"] 
  },
  { 
    name: "Elderly & Child Care", 
    icon: "🧓", 
    description: "Elderly and child care services",
    subcategories: ["Babysitter / Nanny", "Elder Care Assistant", "Home Nurse", "Disability Caregiver"] 
  },
  { 
    name: "Retail / Shop Assistance", 
    icon: "🛍️", 
    description: "Retail and shop assistance services",
    subcategories: ["Sales Assistant", "Cashier", "Shelf Stocker", "Store Cleaner"] 
  },
  { 
    name: "Tailoring & Handicrafts", 
    icon: "🧵", 
    description: "Tailoring and handicraft services",
    subcategories: ["Tailor / Stitching Expert", "Embroidery Artist", "Crochet / Knitting Specialist", "Handloom Assistant"] 
  },
  { 
    name: "Health & Wellness", 
    icon: "🧪", 
    description: "Health and wellness services",
    subcategories: ["Yoga Instructor", "Zumba / Fitness Trainer", "Physiotherapist Assistant", "Home Therapy Aide"] 
  }
];

export async function populateDatabase() {
  console.log('Starting database population...');

  try {
    // First, let's check if categories already exist
    const { data: existingCategories, error: checkError } = await supabase
      .from('categories')
      .select('id, name');

    if (checkError) {
      console.error('Error checking existing categories:', checkError);
      return;
    }

    if (existingCategories && existingCategories.length > 0) {
      console.log('Categories already exist in database. Skipping population.');
      return;
    }

    // Insert categories
    for (const category of categoriesData) {
      console.log(`Inserting category: ${category.name}`);
      
      const { data: insertedCategory, error: categoryError } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          icon: category.icon,
          description: category.description,
          active: true
        })
        .select()
        .single();

      if (categoryError) {
        console.error(`Error inserting category ${category.name}:`, categoryError);
        continue;
      }

      console.log(`Successfully inserted category: ${category.name} with ID: ${insertedCategory.id}`);

      // Insert subcategories for this category
      for (const subcategoryName of category.subcategories) {
        console.log(`  Inserting subcategory: ${subcategoryName}`);
        
        const { error: subcategoryError } = await supabase
          .from('subcategories')
          .insert({
            name: subcategoryName,
            category_id: insertedCategory.id,
            active: true
          });

        if (subcategoryError) {
          console.error(`Error inserting subcategory ${subcategoryName}:`, subcategoryError);
        } else {
          console.log(`  Successfully inserted subcategory: ${subcategoryName}`);
        }
      }
    }

    console.log('Database population completed successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  }
}

async function seedDemoData() {
  // Insert employer profile
  const { data: employer, error: employerError } = await supabase
    .from('profiles')
    .insert([
      {
        id: 'employer-demo-1',
        name: 'Demo Employer',
        phone: '+911234567890',
        role: 'employer',
        bio: 'Demo employer for testing',
        email: 'employer@example.com',
        profile_photo: '',
        categories: ['construction'],
        skills: ['management'],
        verified: true
      }
    ])
    .select()
    .single();
  if (employerError) {
    console.error('Error inserting employer:', employerError);
  } else {
    console.log('Inserted employer:', employer);
  }

  // Insert jobseeker profiles
  const jobseekers = [
    {
      id: 'jobseeker-demo-1',
      name: 'Alice Worker',
      phone: '+919876543210',
      role: 'jobseeker',
      bio: 'Experienced construction worker',
      email: 'alice@example.com',
      profile_photo: '',
      categories: ['construction'],
      skills: ['plumbing', 'carpentry'],
      verified: true
    },
    {
      id: 'jobseeker-demo-2',
      name: 'Bob Helper',
      phone: '+919812345678',
      role: 'jobseeker',
      bio: 'General helper and cleaner',
      email: 'bob@example.com',
      profile_photo: '',
      categories: ['cleaning'],
      skills: ['cleaning', 'moving'],
      verified: false
    }
  ];
  const { data: jobseekerData, error: jobseekerError } = await supabase
    .from('profiles')
    .insert(jobseekers);
  if (jobseekerError) {
    console.error('Error inserting jobseekers:', jobseekerError);
  } else {
    console.log('Inserted jobseekers:', jobseekerData);
  }

  // Insert a demo job for the employer
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .insert([
      {
        employer_id: 'employer-demo-1',
        title: 'Demo Construction Job',
        category: 'construction',
        subcategory: 'plumbing',
        description: 'Looking for a skilled plumber for a 2-week project.',
        location: 'Chennai',
        salary_min: 500,
        salary_max: 800,
        salary_period: 'daily',
        urgent: true,
        status: 'open',
      }
    ]);
  if (jobError) {
    console.error('Error inserting job:', jobError);
  } else {
    console.log('Inserted job:', job);
  }
}

// Run the seed function
seedDemoData().then(() => {
  console.log('Demo data seeding complete.');
}).catch((err) => {
  console.error('Error running seedDemoData:', err);
});

// Run the population if this script is executed directly
if (typeof window === 'undefined') {
  populateDatabase();
} 