export const categories = [
  { 
    id: "construction",
    name: "Construction", 
    icon: "🏗️", 
    color: "from-orange-400 to-red-500",
    subcategories: ["Mason", "Carpenter", "Electrician", "Plumber", "Painter", "Welder"] 
  },
  { 
    id: "delivery",
    name: "Delivery", 
    icon: "🚚", 
    color: "from-blue-400 to-indigo-500",
    subcategories: ["Food Delivery", "Package Delivery", "Grocery Delivery", "Medicine Delivery"] 
  },
  { 
    id: "cleaning",
    name: "Cleaning", 
    icon: "🧹", 
    color: "from-green-400 to-emerald-500",
    subcategories: ["House Cleaning", "Office Cleaning", "Deep Cleaning", "Post-Construction Cleaning"] 
  },
  { 
    id: "security",
    name: "Security", 
    icon: "🛡️", 
    color: "from-purple-400 to-violet-500",
    subcategories: ["Night Guard", "Event Security", "CCTV Operator", "Residential Security"] 
  },
  { 
    id: "driver",
    name: "Driver", 
    icon: "🚗", 
    color: "from-yellow-400 to-orange-500",
    subcategories: ["Taxi Driver", "Delivery Driver", "Personal Driver", "Tour Guide"] 
  },
  { 
    id: "vehicle-owners",
    name: "Vehicle Owners", 
    icon: "🚛", 
    color: "from-slate-400 to-gray-600",
    subcategories: [
      "Cargo Auto", "Mini Truck (Tata Ace)", "Lorry / Truck (6–12 wheeler)", 
      "Tractor with Trailer", "Bike with Carrier", "Auto Rickshaw", "Bike Taxi", 
      "Taxi (Sedan/Hatchback)", "Passenger Van (Eeco, Force)", "Private Bus (15–50 seats)", 
      "Water Tanker", "Ambulance"
    ] 
  },
  { 
    id: "mechanic",
    name: "Mechanic", 
    icon: "🔧", 
    color: "from-red-400 to-pink-500",
    subcategories: ["Two Wheeler Mechanic", "Trucker Mechanic", "Car Mechanic", "Heavy Vehicle Mechanic", "Puncture Repair Worker"] 
  },
  { 
    id: "cooking",
    name: "Cooking", 
    icon: "👨‍🍳", 
    color: "from-pink-400 to-rose-500",
    subcategories: ["Home Cook", "Event Cook", "Kitchen Helper", "Catering Assistant"] 
  },
  { 
    id: "gardening",
    name: "Gardening", 
    icon: "🌱", 
    color: "from-lime-400 to-green-500",
    subcategories: ["Gardener", "Landscaper", "Plant Care", "Lawn Maintenance"] 
  },
  { 
    id: "beauty",
    name: "Beauty", 
    icon: "💄", 
    color: "from-fuchsia-400 to-pink-500",
    subcategories: ["Hair Stylist", "Makeup Artist", "Nail Technician", "Spa Therapist"] 
  },
  { 
    id: "media-content",
    name: "Media & Content", 
    icon: "📸", 
    color: "from-cyan-400 to-blue-500",
    subcategories: ["Photographer", "Videographer", "Video Editor", "Social Media Manager", "YouTube Video Scriptwriter"] 
  },
  { 
    id: "repairs-maintenance",
    name: "Repairs & Maintenance", 
    icon: "🧰", 
    color: "from-amber-400 to-yellow-500",
    subcategories: ["AC / Fridge / Washing Machine Repair", "TV / Electronics Repair", "Mobile / Laptop Repair", "Appliance Installation"] 
  },
  { 
    id: "farming-agro",
    name: "Farming & Agro", 
    icon: "🚜", 
    color: "from-emerald-400 to-green-600",
    subcategories: ["Farm Laborer", "Tractor Operator", "Irrigation Assistant", "Crop Harvester"] 
  },
  { 
    id: "warehouse-logistics",
    name: "Warehouse & Logistics", 
    icon: "📦", 
    color: "from-indigo-400 to-blue-600",
    subcategories: ["Picker / Packer", "Warehouse Assistant", "Inventory Handler", "Forklift Operator"] 
  },
  { 
    id: "office-admin",
    name: "Office / Admin", 
    icon: "💼", 
    color: "from-violet-400 to-purple-600",
    subcategories: ["Office Boy / Peon", "Data Entry Operator", "Document Courier", "Front Desk Assistant"] 
  },
  { 
    id: "event-hospitality",
    name: "Event & Hospitality", 
    icon: "🎪", 
    color: "from-rose-400 to-pink-600",
    subcategories: ["Event Helper / Setup Crew", "Waiter / Steward", "Bartender (Licensed)", "Event Venue Cleaner"] 
  },
  { 
    id: "elderly-child-care",
    name: "Elderly & Child Care", 
    icon: "🧓", 
    color: "from-teal-400 to-cyan-600",
    subcategories: ["Babysitter / Nanny", "Elder Care Assistant", "Home Nurse", "Disability Caregiver"] 
  },
  { 
    id: "retail-shop",
    name: "Retail / Shop Assistance", 
    icon: "🛍️", 
    color: "from-orange-400 to-amber-500",
    subcategories: ["Sales Assistant", "Cashier", "Shelf Stocker", "Store Cleaner"] 
  },
  { 
    id: "tailoring-handicrafts",
    name: "Tailoring & Handicrafts", 
    icon: "🧵", 
    color: "from-purple-400 to-indigo-500",
    subcategories: ["Tailor / Stitching Expert", "Embroidery Artist", "Crochet / Knitting Specialist", "Handloom Assistant"] 
  },
  { 
    id: "health-wellness",
    name: "Health & Wellness", 
    icon: "🧪", 
    color: "from-green-400 to-teal-500",
    subcategories: ["Yoga Instructor", "Zumba / Fitness Trainer", "Physiotherapist Assistant", "Home Therapy Aide"] 
  }
];

export const vehicles = [
  { key: "bike", label: "🏍️ Motorcycle", description: "2-wheeler delivery", wage: "₹400-600/day" },
  { key: "car", label: "🚗 Car", description: "Passenger transport", wage: "₹800-1200/day" },
  { key: "auto", label: "🛺 Auto Rickshaw", description: "Local transport", wage: "₹600-900/day" },
  { key: "van", label: "🚐 Van", description: "Large delivery", wage: "₹1000-1500/day" },
];