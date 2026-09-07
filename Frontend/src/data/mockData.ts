import { 
  User, 
  WorkerProfile, 
  ServiceItem, 
  Booking, 
  Review, 
  WelfareScheme, 
  WelfareClaim,
  Complaint, 
  DemandForecastItem, 
  NotificationItem, 
  Transaction,
  CooperativeInfo
} from '../types';

export const MOCK_COOPERATIVES: CooperativeInfo[] = [
  {
    id: 'coop-001',
    name: 'Delhi Labour Welfare Cooperative Society Ltd.',
    registrationNumber: 'DL/COOP/2018/8892',
    district: 'Central Delhi',
    state: 'Delhi NCR',
    establishedYear: 2018,
    affiliatedFederation: 'National Federation of Labour Cooperatives (NFLC) / NCCT',
    totalMembers: 460,
    activeWorkers: 390,
    contactPerson: 'Harish Chandra Sharma',
    contactPhone: '+91 98112 34567',
    rating: 4.8,
  },
  {
    id: 'coop-002',
    name: 'Pragati Shramik Sahakari Samiti',
    registrationNumber: 'UP/COOP/2019/4102',
    district: 'Noida / Gautam Buddha Nagar',
    state: 'Uttar Pradesh',
    establishedYear: 2019,
    affiliatedFederation: 'UP State Labour Cooperative Federation',
    totalMembers: 380,
    activeWorkers: 310,
    contactPerson: 'Sunita Verma',
    contactPhone: '+91 98765 43210',
    rating: 4.7,
  },
  {
    id: 'coop-003',
    name: 'Samarthya Urban Skill Workers Cooperative',
    registrationNumber: 'HR/COOP/2021/7211',
    district: 'Gurugram',
    state: 'Haryana',
    establishedYear: 2021,
    affiliatedFederation: 'Haryana Cooperative Union',
    totalMembers: 410,
    activeWorkers: 340,
    contactPerson: 'Rajeshwar Hooda',
    contactPhone: '+91 99123 77890',
    rating: 4.9,
  }
];

export const MOCK_USERS: Record<string, User> = {
  customer: {
    id: 'cust-101',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 12340',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    address: 'B-402, Green Valley Apartments, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    joinedDate: '2024-03-15'
  },
  worker: {
    id: 'work-201',
    name: 'Ravi Kumar',
    email: 'ravi.plumber@sahakargig.coop',
    phone: '+91 98123 45678',
    role: 'worker',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    cooperativeId: 'coop-001',
    cooperativeName: 'Delhi Labour Welfare Cooperative Society Ltd.',
    address: 'H-12, Shakarpur, Laxmi Nagar',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110092',
    joinedDate: '2023-08-10'
  },
  admin: {
    id: 'admin-001',
    name: 'Dr. Rameshwar Rao',
    email: 'admin.delhi@ncct.sahakargig.gov.in',
    phone: '+91 98990 01122',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    cooperativeId: 'coop-001',
    cooperativeName: 'Delhi Labour Welfare Cooperative Society Ltd.',
    address: 'Cooperative Bhawan, Asaf Ali Road',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110002',
    joinedDate: '2022-01-01'
  }
};

export const MOCK_SERVICES: ServiceItem[] = [
  {
    id: 'srv-plumb',
    name: 'Plumbing Services & Repairs',
    category: 'Plumber',
    description: 'Expert tap leak repairs, pipe fitting, drainage unclogging, water tank repair, and bathroom sanitary installations by certified cooperative plumbers.',
    iconName: 'Wrench',
    basePrice: 350,
    priceRange: '₹300 – ₹600',
    durationMinutes: 60,
    popular: true,
    emergencyAvailable: true,
    inclusions: [
      'Inspection & leak detection',
      'Pipe fitting & joint sealing',
      'Sanitaryware fitting',
      '30-day cooperative service warranty'
    ]
  },
  {
    id: 'srv-elec',
    name: 'Electrical Repairs & Installation',
    category: 'Electrician',
    description: 'Short circuit troubleshooting, fan installation, switchboard repair, MCB panel wiring, and safety earthing by certified electricians.',
    iconName: 'Zap',
    basePrice: 300,
    priceRange: '₹250 – ₹550',
    durationMinutes: 45,
    popular: true,
    emergencyAvailable: true,
    inclusions: [
      'Safety voltage testing',
      'Switchboard & wiring fixes',
      'Appliance connection',
      'Cooperative certified safety standards'
    ]
  },
  {
    id: 'srv-carp',
    name: 'Carpentry & Furniture Repair',
    category: 'Carpenter',
    description: 'Door lock repair, furniture assembly, hinge fixing, modular kitchen adjustments, and customized woodwork by skilled artisan workers.',
    iconName: 'Hammer',
    basePrice: 400,
    priceRange: '₹350 – ₹800',
    durationMinutes: 90,
    popular: true,
    emergencyAvailable: false,
    inclusions: [
      'Hardware alignment',
      'Precision cutting & fitting',
      'Sturdy fixing with durable adhesives',
      'Post-service dust cleanup'
    ]
  },
  {
    id: 'srv-paint',
    name: 'Home & Office Painting',
    category: 'Painter',
    description: 'Wall touch-ups, moisture damp proofing, interior emulsion, exterior weather coating, and texture finishes with cooperative rate transparency.',
    iconName: 'Paintbrush',
    basePrice: 800,
    priceRange: '₹600 – ₹2,500',
    durationMinutes: 180,
    popular: false,
    emergencyAvailable: false,
    inclusions: [
      'Wall sanding & putty application',
      'Primer coat + 2 finish coats',
      'Furniture masking & floor protection',
      'Cooperative approved non-toxic paints'
    ]
  },
  {
    id: 'srv-clean',
    name: 'Deep Cleaning & Sanitization',
    category: 'Cleaner',
    description: 'Intense kitchen degreasing, bathroom descaling, balcony scrubbing, sofa shampooing, and whole-house eco-sanitization.',
    iconName: 'Sparkles',
    basePrice: 450,
    priceRange: '₹400 – ₹1,200',
    durationMinutes: 120,
    popular: true,
    emergencyAvailable: false,
    inclusions: [
      'High-pressure chemical-safe cleaning',
      'Stain & lime-scale removal',
      'Bio-friendly disinfectants',
      'Tile & floor buffing'
    ]
  },
  {
    id: 'srv-help',
    name: 'Domestic Household Support',
    category: 'Domestic Helper',
    description: 'Daily meal prep assistance, dishwashing, floor sweeping/mopping, laundry folding, and domestic organization by verified cooperative domestic helpers.',
    iconName: 'Home',
    basePrice: 300,
    priceRange: '₹250 – ₹450',
    durationMinutes: 60,
    popular: true,
    emergencyAvailable: false,
    inclusions: [
      'Background-verified helpers',
      'Kitchen hygiene maintenance',
      'Punctual shift adherence',
      'Cooperative identity badge'
    ]
  },
  {
    id: 'srv-care',
    name: 'Elderly & Patient Caregiving',
    category: 'Caregiver',
    description: 'Compassionate assistance for senior citizens, post-operative mobility aid, vitals monitoring, medication reminders, and companionship.',
    iconName: 'HeartHandshake',
    basePrice: 600,
    priceRange: '₹500 – ₹1,500',
    durationMinutes: 180,
    popular: true,
    emergencyAvailable: true,
    inclusions: [
      'Certified First Aid & Nursing assistance',
      'Patient mobility support',
      'Diet & medication monitoring',
      'Regular family daily updates'
    ]
  },
  {
    id: 'srv-drive',
    name: 'Professional Chauffeur & Driver',
    category: 'Driver',
    description: 'Experienced licensed drivers for intra-city transit, emergency errands, senior hospital drop-offs, and highway travel.',
    iconName: 'Car',
    basePrice: 350,
    priceRange: '₹300 – ₹700',
    durationMinutes: 120,
    popular: false,
    emergencyAvailable: true,
    inclusions: [
      'Commercial & heavy/light vehicle license',
      'Clean background check',
      'Route navigation awareness',
      'Courteous cooperative conduct'
    ]
  },
  {
    id: 'srv-gard',
    name: 'Gardening & Landscape Maintenance',
    category: 'Gardener',
    description: 'Pruning, lawn mowing, terrace garden setup, organic fertilizer enrichment, pest control, and seasonal floral care.',
    iconName: 'Sprout',
    basePrice: 350,
    priceRange: '₹300 – ₹600',
    durationMinutes: 90,
    popular: false,
    emergencyAvailable: false,
    inclusions: [
      'Organic vermicompost enrichment',
      'Precision trimming & shaping',
      'Pest prevention sprays',
      'Plant health inspection'
    ]
  },
  {
    id: 'srv-tech',
    name: 'Appliance & Tech Maintenance',
    category: 'Technician',
    description: 'AC gas refill & filter service, refrigerator cooling repair, washing machine drum fix, RO water purifier servicing, and microwave repair.',
    iconName: 'Cpu',
    basePrice: 450,
    priceRange: '₹400 – ₹900',
    durationMinutes: 75,
    popular: true,
    emergencyAvailable: true,
    inclusions: [
      'Full diagnostic run',
      'Genuine cooperative supply spare parts',
      'Performance calibration',
      '45-day warranty'
    ]
  }
];

export const MOCK_WORKERS: WorkerProfile[] = [
  {
    id: 'work-201',
    userId: 'user-w1',
    name: 'Ravi Kumar',
    phone: '+91 98123 45678',
    email: 'ravi.plumber@sahakargig.coop',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    primaryCategory: 'Plumber',
    cooperativeId: 'coop-001',
    cooperativeName: 'Delhi Labour Welfare Cooperative Society Ltd.',
    experienceYears: 5,
    rating: 4.8,
    reviewCount: 124,
    completedJobsCount: 248,
    verificationStatus: 'Verified',
    isAvailable: true,
    availabilityStatus: 'Available',
    emergencyAvailable: true,
    latitude: 28.6304,
    longitude: 77.2773,
    locationAccuracy: 10,
    locationUpdatedAt: '2026-09-06T08:30:00Z',
    locationAddress: 'H-12, Shakarpur, Laxmi Nagar, East Delhi 110092',
    serviceRadiusKm: 15,
    distanceKm: 1.4,
    serviceArea: 'Central Delhi, Laxmi Nagar, Connaught Place, Mayur Vihar',
    hourlyRate: 350,
    priceRange: '₹300 – ₹500',
    skills: [
      {
        id: 'sk-1',
        category: 'Plumber',
        name: 'High Pressure Pipe Joints & Concealed Leakage',
        yearsExperience: 5,
        level: 'Advanced',
        verificationStatus: 'Verified',
        certifiedBy: 'NCCT / ITI Delhi'
      },
      {
        id: 'sk-2',
        category: 'Plumber',
        name: 'RO & Water Purifier Installation',
        yearsExperience: 3,
        level: 'Intermediate',
        verificationStatus: 'Verified',
        certifiedBy: 'Delhi Labour Federation'
      },
      {
        id: 'sk-3',
        category: 'Plumber',
        name: 'Bathroom Sanitary & Mixer Tap Assembly',
        yearsExperience: 5,
        level: 'Master',
        verificationStatus: 'Verified',
        certifiedBy: 'NSDC Skill India'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'NSDC Certified Master Plumber Level 4',
        issuingOrganization: 'National Skill Development Corporation (NSDC)',
        issueDate: '2021-06-15',
        expiryDate: '2027-06-15',
        verificationStatus: 'Verified',
        certificateNumber: 'NSDC-PLMB-2021-9982'
      },
      {
        id: 'cert-2',
        name: 'Cooperative Artisan Registered Identity',
        issuingOrganization: 'Ministry of Cooperation / NCCT Delhi Chapter',
        issueDate: '2023-01-10',
        verificationStatus: 'Verified',
        certificateNumber: 'NCCT-COOP-DEL-4412'
      }
    ],
    schedule: [
      { day: 'Monday', enabled: true, start: '09:00', end: '19:00' },
      { day: 'Tuesday', enabled: true, start: '09:00', end: '19:00' },
      { day: 'Wednesday', enabled: true, start: '09:00', end: '19:00' },
      { day: 'Thursday', enabled: true, start: '09:00', end: '19:00' },
      { day: 'Friday', enabled: true, start: '09:00', end: '19:00' },
      { day: 'Saturday', enabled: true, start: '09:00', end: '18:00' },
      { day: 'Sunday', enabled: false, start: '10:00', end: '14:00' }
    ],
    bankDetails: {
      accountName: 'Ravi Kumar',
      accountNumber: '9188201004523',
      ifsc: 'PUNB0021400',
      upiId: 'ravikumar@coopbank'
    },
    welfareStatus: {
      insuranceActive: true,
      policyNumber: 'PMSBY-COOP-882194',
      validUntil: '2027-03-31',
      schemeName: 'Pradhan Mantri Suraksha Bima (Cooperative Group Policy)'
    }
  },
  {
    id: 'work-202',
    userId: 'user-w2',
    name: 'Suresh Patel',
    phone: '+91 98234 56789',
    email: 'suresh.patel@sahakargig.coop',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    primaryCategory: 'Electrician',
    cooperativeId: 'coop-001',
    cooperativeName: 'Delhi Labour Welfare Cooperative Society Ltd.',
    experienceYears: 7,
    rating: 4.9,
    reviewCount: 188,
    completedJobsCount: 312,
    verificationStatus: 'Verified',
    isAvailable: true,
    availabilityStatus: 'Available',
    emergencyAvailable: true,
    latitude: 28.5244,
    longitude: 77.2066,
    locationAccuracy: 12,
    locationUpdatedAt: '2026-09-06T09:15:00Z',
    locationAddress: 'Block J, Saket, South Delhi 110017',
    serviceRadiusKm: 12,
    distanceKm: 2.1,
    serviceArea: 'South Delhi, Saket, Malviya Nagar, Hauz Khas',
    hourlyRate: 380,
    priceRange: '₹350 – ₹600',
    skills: [
      {
        id: 'sk-4',
        category: 'Electrician',
        name: 'Three Phase Wiring & MCB Distribution',
        yearsExperience: 7,
        level: 'Master',
        verificationStatus: 'Verified',
        certifiedBy: 'Govt. ITI Pusa'
      },
      {
        id: 'sk-5',
        category: 'Electrician',
        name: 'Inverter & Solar PV Installation',
        yearsExperience: 4,
        level: 'Advanced',
        verificationStatus: 'Verified',
        certifiedBy: 'Ministry of New and Renewable Energy'
      }
    ],
    certifications: [
      {
        id: 'cert-3',
        name: 'Licensed Wireman Grade 1',
        issuingOrganization: 'Central Electricity Authority',
        issueDate: '2019-04-12',
        expiryDate: '2029-04-12',
        verificationStatus: 'Verified',
        certificateNumber: 'CEA-WRM-7712'
      }
    ],
    schedule: [
      { day: 'Monday', enabled: true, start: '08:30', end: '18:30' },
      { day: 'Tuesday', enabled: true, start: '08:30', end: '18:30' },
      { day: 'Wednesday', enabled: true, start: '08:30', end: '18:30' },
      { day: 'Thursday', enabled: true, start: '08:30', end: '18:30' },
      { day: 'Friday', enabled: true, start: '08:30', end: '18:30' },
      { day: 'Saturday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Sunday', enabled: true, start: '10:00', end: '16:00' }
    ],
    welfareStatus: {
      insuranceActive: true,
      policyNumber: 'PMSBY-COOP-882195',
      validUntil: '2027-03-31',
      schemeName: 'NCCT Shramik Suraksha Kavach'
    }
  },
  {
    id: 'work-203',
    userId: 'user-w3',
    name: 'Sunita Devi',
    phone: '+91 98345 67890',
    email: 'sunita.devi@sahakargig.coop',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    primaryCategory: 'Caregiver',
    cooperativeId: 'coop-002',
    cooperativeName: 'Pragati Shramik Sahakari Samiti',
    experienceYears: 4,
    rating: 4.9,
    reviewCount: 95,
    completedJobsCount: 190,
    verificationStatus: 'Verified',
    isAvailable: true,
    availabilityStatus: 'Available',
    emergencyAvailable: true,
    latitude: 28.6280,
    longitude: 77.3649,
    locationAccuracy: 8,
    locationUpdatedAt: '2026-09-07T04:00:00Z',
    locationAddress: 'Sector 62, Noida, Gautam Buddha Nagar 201301',
    serviceRadiusKm: 10,
    distanceKm: 2.8,
    serviceArea: 'Noida Sector 15 to 75, Greater Noida West',
    hourlyRate: 500,
    priceRange: '₹450 – ₹800',
    skills: [
      {
        id: 'sk-6',
        category: 'Caregiver',
        name: 'Geriatric Care & Mobility Assistance',
        yearsExperience: 4,
        level: 'Advanced',
        verificationStatus: 'Verified',
        certifiedBy: 'Red Cross Society / NCCT'
      },
      {
        id: 'sk-7',
        category: 'Caregiver',
        name: 'Post-Surgical Nursing Aid & Medication Log',
        yearsExperience: 3,
        level: 'Intermediate',
        verificationStatus: 'Verified',
        certifiedBy: 'Max Healthcare Training Institute'
      }
    ],
    certifications: [
      {
        id: 'cert-4',
        name: 'Certified Home Health Aide',
        issuingOrganization: 'Healthcare Sector Skill Council (HSSC)',
        issueDate: '2022-02-18',
        expiryDate: '2028-02-18',
        verificationStatus: 'Verified',
        certificateNumber: 'HSSC-HHA-44109'
      }
    ],
    schedule: [
      { day: 'Monday', enabled: true, start: '08:00', end: '17:00' },
      { day: 'Tuesday', enabled: true, start: '08:00', end: '17:00' },
      { day: 'Wednesday', enabled: true, start: '08:00', end: '17:00' },
      { day: 'Thursday', enabled: true, start: '08:00', end: '17:00' },
      { day: 'Friday', enabled: true, start: '08:00', end: '17:00' },
      { day: 'Saturday', enabled: true, start: '08:00', end: '14:00' },
      { day: 'Sunday', enabled: false, start: '08:00', end: '12:00' }
    ],
    welfareStatus: {
      insuranceActive: true,
      policyNumber: 'PMSBY-COOP-882196',
      validUntil: '2027-03-31',
      schemeName: 'Pragati Cooperative Mahila Swasthya Yojana'
    }
  },
  {
    id: 'work-204',
    userId: 'user-w4',
    name: 'Vikram Singh',
    phone: '+91 98456 78901',
    email: 'vikram.singh@sahakargig.coop',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    primaryCategory: 'Carpenter',
    cooperativeId: 'coop-001',
    cooperativeName: 'Delhi Labour Welfare Cooperative Society Ltd.',
    experienceYears: 6,
    rating: 4.7,
    reviewCount: 88,
    completedJobsCount: 165,
    verificationStatus: 'Verified',
    isAvailable: true,
    availabilityStatus: 'Available',
    emergencyAvailable: false,
    latitude: 28.6083,
    longitude: 77.2958,
    locationAccuracy: 14,
    locationUpdatedAt: '2026-09-05T14:20:00Z',
    locationAddress: 'Pocket 1, Mayur Vihar Phase 1, East Delhi 110091',
    serviceRadiusKm: 15,
    distanceKm: 3.5,
    serviceArea: 'East Delhi, Noida, Indirapuram',
    hourlyRate: 400,
    priceRange: '₹350 – ₹700',
    skills: [
      {
        id: 'sk-8',
        category: 'Carpenter',
        name: 'Modular Furniture & Hydraulic Fittings',
        yearsExperience: 6,
        level: 'Master',
        verificationStatus: 'Verified',
        certifiedBy: 'Furniture & Fittings Skill Council'
      }
    ],
    certifications: [
      {
        id: 'cert-5',
        name: 'Artisan Woodcraft Specialization',
        issuingOrganization: 'All India Handicrafts & Labour Union',
        issueDate: '2020-09-01',
        verificationStatus: 'Verified',
        certificateNumber: 'AIH-CRPT-5521'
      }
    ],
    schedule: [
      { day: 'Monday', enabled: true, start: '09:00', end: '18:00' },
      { day: 'Tuesday', enabled: true, start: '09:00', end: '18:00' },
      { day: 'Wednesday', enabled: true, start: '09:00', end: '18:00' },
      { day: 'Thursday', enabled: true, start: '09:00', end: '18:00' },
      { day: 'Friday', enabled: true, start: '09:00', end: '18:00' },
      { day: 'Saturday', enabled: true, start: '09:00', end: '16:00' },
      { day: 'Sunday', enabled: false, start: '09:00', end: '14:00' }
    ],
    welfareStatus: {
      insuranceActive: true,
      policyNumber: 'PMSBY-COOP-882197',
      validUntil: '2027-03-31',
      schemeName: 'NCCT Artisan Welfare Plan'
    }
  },
  {
    id: 'work-205',
    userId: 'user-w5',
    name: 'Meena Kumari',
    phone: '+91 98567 89012',
    email: 'meena.cleaner@sahakargig.coop',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    primaryCategory: 'Cleaner',
    cooperativeId: 'coop-002',
    cooperativeName: 'Pragati Shramik Sahakari Samiti',
    experienceYears: 3,
    rating: 4.8,
    reviewCount: 76,
    completedJobsCount: 140,
    verificationStatus: 'Verified',
    isAvailable: true,
    availabilityStatus: 'Available',
    emergencyAvailable: false,
    latitude: 28.5750,
    longitude: 77.3685,
    locationAccuracy: 10,
    locationUpdatedAt: '2026-09-07T03:30:00Z',
    locationAddress: 'Sector 50 Metro Station Area, Noida, UP 201301',
    serviceRadiusKm: 8,
    distanceKm: 1.8,
    serviceArea: 'Noida Sector 50, 62, 76, Indirapuram',
    hourlyRate: 350,
    priceRange: '₹300 – ₹600',
    skills: [
      {
        id: 'sk-9',
        category: 'Cleaner',
        name: 'Deep Kitchen & Tile Acid-Free Descaling',
        yearsExperience: 3,
        level: 'Advanced',
        verificationStatus: 'Verified',
        certifiedBy: 'Swachh Bharat Cooperative Initiative'
      }
    ],
    certifications: [
      {
        id: 'cert-6',
        name: 'Sanitation & Hygiene Master Practitioner',
        issuingOrganization: 'National Sanitation Federation',
        issueDate: '2023-05-10',
        verificationStatus: 'Verified',
        certificateNumber: 'NSF-CL-992'
      }
    ],
    schedule: [
      { day: 'Monday', enabled: true, start: '08:00', end: '17:00' },
      { day: 'Tuesday', enabled: true, start: '08:00', end: '17:00' },
      { day: 'Wednesday', enabled: true, start: '08:00', end: '17:00' },
      { day: 'Thursday', enabled: true, start: '08:00', end: '17:00' },
      { day: 'Friday', enabled: true, start: '08:00', end: '17:00' },
      { day: 'Saturday', enabled: true, start: '08:00', end: '17:00' },
      { day: 'Sunday', enabled: false, start: '08:00', end: '14:00' }
    ],
    welfareStatus: {
      insuranceActive: true,
      policyNumber: 'PMSBY-COOP-882198',
      validUntil: '2027-03-31',
      schemeName: 'Pragati Cooperative Mahila Swasthya Yojana'
    }
  },
  {
    id: 'work-206',
    userId: 'user-w6',
    name: 'Amit Sharma',
    phone: '+91 98678 90123',
    email: 'amit.ac@sahakargig.coop',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    primaryCategory: 'Technician',
    cooperativeId: 'coop-003',
    cooperativeName: 'Samarthya Urban Skill Workers Cooperative',
    experienceYears: 5,
    rating: 4.9,
    reviewCount: 112,
    completedJobsCount: 210,
    verificationStatus: 'Verified',
    isAvailable: true,
    availabilityStatus: 'Available',
    emergencyAvailable: true,
    latitude: 28.4682,
    longitude: 77.0864,
    locationAccuracy: 16,
    locationUpdatedAt: '2026-09-06T11:00:00Z',
    locationAddress: 'DLF Phase 4, Galleria Market, Gurugram, Haryana 122002',
    serviceRadiusKm: 15,
    distanceKm: 2.4,
    serviceArea: 'Gurugram DLF Phases 1-5, Cyber City, Sector 56',
    hourlyRate: 450,
    priceRange: '₹400 – ₹850',
    skills: [
      {
        id: 'sk-10',
        category: 'Technician',
        name: 'Inverter AC Jet Pump Servicing & Gas Charging',
        yearsExperience: 5,
        level: 'Master',
        verificationStatus: 'Verified',
        certifiedBy: 'Daikin / NCCT HVAC Training'
      }
    ],
    certifications: [
      {
        id: 'cert-7',
        name: 'HVAC Certified Refrigeration Specialist',
        issuingOrganization: 'Electronics Sector Skills Council of India',
        issueDate: '2021-11-20',
        verificationStatus: 'Verified',
        certificateNumber: 'ESSCI-HVAC-3318'
      }
    ],
    schedule: [
      { day: 'Monday', enabled: true, start: '09:00', end: '19:00' },
      { day: 'Tuesday', enabled: true, start: '09:00', end: '19:00' },
      { day: 'Wednesday', enabled: true, start: '09:00', end: '19:00' },
      { day: 'Thursday', enabled: true, start: '09:00', end: '19:00' },
      { day: 'Friday', enabled: true, start: '09:00', end: '19:00' },
      { day: 'Saturday', enabled: true, start: '09:00', end: '19:00' },
      { day: 'Sunday', enabled: true, start: '10:00', end: '15:00' }
    ],
    welfareStatus: {
      insuranceActive: true,
      policyNumber: 'PMSBY-COOP-882199',
      validUntil: '2027-03-31',
      schemeName: 'Samarthya Cooperative Group Cover'
    }
  },
  {
    id: 'work-207',
    userId: 'user-w7',
    name: 'Kiran Verma',
    phone: '+91 98789 01234',
    email: 'kiran.verma@sahakargig.coop',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    primaryCategory: 'Domestic Helper',
    cooperativeId: 'coop-001',
    cooperativeName: 'Delhi Labour Welfare Cooperative Society Ltd.',
    experienceYears: 4,
    rating: 4.8,
    reviewCount: 64,
    completedJobsCount: 110,
    verificationStatus: 'Pending',
    isAvailable: false,
    availabilityStatus: 'Offline',
    emergencyAvailable: false,
    latitude: 28.6517,
    longitude: 77.1906,
    locationAccuracy: 15,
    locationUpdatedAt: '2026-09-04T16:45:00Z',
    locationAddress: 'Ajmal Khan Road, Karol Bagh, Central Delhi 110005',
    serviceRadiusKm: 10,
    distanceKm: 4.2,
    serviceArea: 'Central Delhi, Karol Bagh, Patel Nagar',
    hourlyRate: 300,
    priceRange: '₹250 – ₹450',
    skills: [
      {
        id: 'sk-11',
        category: 'Domestic Helper',
        name: 'Nutritious Indian Vegetarian Cooking & Hygiene',
        yearsExperience: 4,
        level: 'Intermediate',
        verificationStatus: 'Pending',
        certifiedBy: 'Delhi Labour Society'
      }
    ],
    certifications: [
      {
        id: 'cert-8',
        name: 'Food Safety & Kitchen Hygiene Basic',
        issuingOrganization: 'FSSAI Training Partner',
        issueDate: '2024-01-15',
        verificationStatus: 'Pending',
        certificateNumber: 'FSSAI-FST-8812'
      }
    ],
    schedule: [
      { day: 'Monday', enabled: true, start: '07:30', end: '16:30' },
      { day: 'Tuesday', enabled: true, start: '07:30', end: '16:30' },
      { day: 'Wednesday', enabled: true, start: '07:30', end: '16:30' },
      { day: 'Thursday', enabled: true, start: '07:30', end: '16:30' },
      { day: 'Friday', enabled: true, start: '07:30', end: '16:30' },
      { day: 'Saturday', enabled: true, start: '08:00', end: '14:00' },
      { day: 'Sunday', enabled: false, start: '08:00', end: '12:00' }
    ],
    welfareStatus: {
      insuranceActive: false,
      policyNumber: '',
      validUntil: '',
      schemeName: 'Awaiting Verification Approval'
    }
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-2026-0891',
    customerId: 'cust-101',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 12340',
    customerAddress: 'B-402, Green Valley Apartments, Sector 62, Noida',
    workerId: 'work-201',
    workerName: 'Ravi Kumar',
    workerPhone: '+91 98123 45678',
    workerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    cooperativeName: 'Delhi Labour Welfare Cooperative Society Ltd.',
    serviceCategory: 'Plumber',
    serviceTitle: 'Main Washbasin Concealed Pipe Joint Leakage',
    date: '2026-09-07',
    timeSlot: '11:00 AM – 12:00 PM',
    description: 'High pressure water leaking from under the master bathroom sink. Needs emergency replacement of CPVC coupling.',
    isEmergency: true,
    estimatedPrice: 450,
    finalPrice: 450,
    status: 'Worker On The Way',
    statusTimeline: [
      { status: 'Booking Requested', timestamp: '10:32 AM', note: 'Emergency request initiated by customer' },
      { status: 'Worker Assigned', timestamp: '10:33 AM', note: 'Geo-radius matching: Ravi Kumar located 1.4 km away' },
      { status: 'Worker Accepted', timestamp: '10:34 AM', note: 'Worker confirmed instant dispatch' },
      { status: 'Worker On The Way', timestamp: '10:36 AM', note: 'ETA 15 minutes. Route via Sector 62 main road' }
    ],
    paymentStatus: 'Pending',
    otp: '4829',
    createdAt: '2026-09-07T05:02:00Z'
  },
  {
    id: 'BK-2026-0884',
    customerId: 'cust-101',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 12340',
    customerAddress: 'B-402, Green Valley Apartments, Sector 62, Noida',
    workerId: 'work-202',
    workerName: 'Suresh Patel',
    workerPhone: '+91 98234 56789',
    workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    cooperativeName: 'Delhi Labour Welfare Cooperative Society Ltd.',
    serviceCategory: 'Electrician',
    serviceTitle: 'Living Room Ceiling Fan & Smart Switchboard Wiring',
    date: '2026-09-04',
    timeSlot: '03:00 PM – 04:30 PM',
    description: 'Installation of high-speed BLDC fan and 4-way modular switchboard.',
    isEmergency: false,
    estimatedPrice: 380,
    finalPrice: 380,
    status: 'Payment Completed',
    statusTimeline: [
      { status: 'Booking Requested', timestamp: 'Sep 03, 04:10 PM' },
      { status: 'Worker Accepted', timestamp: 'Sep 03, 04:25 PM' },
      { status: 'Service Completed', timestamp: 'Sep 04, 04:40 PM' },
      { status: 'Payment Completed', timestamp: 'Sep 04, 04:45 PM' }
    ],
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    transactionId: 'TXN-SGIG-2026-00912',
    invoiceId: 'INV-2026-0884',
    createdAt: '2026-09-03T10:40:00Z'
  },
  {
    id: 'BK-2026-0870',
    customerId: 'cust-101',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 12340',
    customerAddress: 'B-402, Green Valley Apartments, Sector 62, Noida',
    workerId: 'work-205',
    workerName: 'Meena Kumari',
    workerPhone: '+91 98567 89012',
    workerAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    cooperativeName: 'Pragati Shramik Sahakari Samiti',
    serviceCategory: 'Cleaner',
    serviceTitle: 'Festival Full Kitchen Degreasing & Deep Cleaning',
    date: '2026-08-28',
    timeSlot: '10:00 AM – 01:00 PM',
    description: 'Deep tile cleaning, chimney exterior wash, and cabinet sanitization.',
    isEmergency: false,
    estimatedPrice: 650,
    finalPrice: 650,
    status: 'Payment Completed',
    statusTimeline: [
      { status: 'Booking Requested', timestamp: 'Aug 27, 09:00 AM' },
      { status: 'Service Completed', timestamp: 'Aug 28, 01:15 PM' },
      { status: 'Payment Completed', timestamp: 'Aug 28, 01:20 PM' }
    ],
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    transactionId: 'TXN-SGIG-2026-00845',
    invoiceId: 'INV-2026-0870',
    createdAt: '2026-08-27T03:30:00Z'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    bookingId: 'BK-2026-0884',
    customerId: 'cust-101',
    customerName: 'Priya Sharma',
    workerId: 'work-202',
    workerName: 'Suresh Patel',
    rating: 5,
    comment: 'Suresh ji was very professional, arrived on time, and brought proper cooperative-stamped safety gear. Excellent work on the BLDC fan installation!',
    date: '2026-09-04',
    serviceCategory: 'Electrician'
  },
  {
    id: 'rev-02',
    bookingId: 'BK-2026-0870',
    customerId: 'cust-101',
    customerName: 'Priya Sharma',
    workerId: 'work-205',
    workerName: 'Meena Kumari',
    rating: 5,
    comment: 'Meena did an exceptional job cleaning our kitchen tiles and cabinets. The cooperative model gives great trust and fair price!',
    date: '2026-08-28',
    serviceCategory: 'Cleaner'
  },
  {
    id: 'rev-03',
    bookingId: 'BK-2026-0811',
    customerId: 'cust-202',
    customerName: 'Manish Malhotra',
    workerId: 'work-201',
    workerName: 'Ravi Kumar',
    rating: 5,
    comment: 'Ravi solved a difficult concealed pipe leakage that two private contractors failed to diagnose. Highly skilled cooperative artisan.',
    date: '2026-08-15',
    serviceCategory: 'Plumber'
  }
];

export const MOCK_WELFARE_SCHEMES: WelfareScheme[] = [
  {
    id: 'welf-1',
    name: 'NCCT Shramik Suraksha Kavach (Group Accidental Insurance)',
    type: 'Insurance',
    provider: 'National Council for Cooperative Training (NCCT) & LIC',
    description: 'Comprehensive accidental disability and term life protection specifically structured for registered labour cooperative gig workers.',
    coverageAmount: '₹5,00,000 Accidental Cover + ₹2,00,000 Term Life',
    eligibility: 'All active cooperative members with >10 completed monthly gigs',
    subsidyPercentage: 100,
    status: 'Active'
  },
  {
    id: 'welf-2',
    name: 'Ayushman Bharat — Sahakar Health Linkage',
    type: 'Health',
    provider: 'National Health Authority & Ministry of Cooperation',
    description: 'Cashless hospitalization in empaneled multi-specialty hospitals with zero deductible for worker and up to 4 dependents.',
    coverageAmount: '₹5,00,000 per family per year',
    eligibility: 'Verified unorganized cooperative workers registered on e-Shram & SahakarGig',
    subsidyPercentage: 100,
    status: 'Active'
  },
  {
    id: 'welf-3',
    name: 'Cooperative Shramik Tool & Equipment Upgrade Grant',
    type: 'Tool Subsidy',
    provider: 'Ministry of Cooperation Special Fund',
    description: 'Direct financial subsidy to purchase certified modern diagnostic devices, industrial grade drills, cutters, and safety kits.',
    coverageAmount: 'Up to ₹15,000 per artisan',
    eligibility: 'Workers with minimum 1-year verified cooperative tenure',
    subsidyPercentage: 75,
    status: 'Active'
  },
  {
    id: 'welf-4',
    name: 'Sahakar Vidya — Worker Children Merit Scholarship',
    type: 'Education',
    provider: 'Labour Cooperative Federation Welfare Trust',
    description: 'Annual educational stipends and coaching allowances for children of registered gig workers pursuing STEM, diploma, or degree courses.',
    coverageAmount: '₹12,000 – ₹25,000 per academic year',
    eligibility: 'Children scoring >70% in 10th or 12th board exams',
    subsidyPercentage: 100,
    status: 'Active'
  }
];

export const MOCK_WELFARE_CLAIMS: WelfareClaim[] = [
  {
    id: 'CLM-2026-0041',
    workerId: 'work-201',
    workerName: 'Ravi Kumar',
    schemeId: 'welf-3',
    schemeName: 'Cooperative Shramik Tool & Equipment Upgrade Grant',
    claimAmount: 8500,
    status: 'Approved',
    submissionDate: '2026-08-10',
    approvalDate: '2026-08-18',
    remarks: 'Approved for purchase of digital ultrasonic pipe leakage detector from cooperative store.'
  },
  {
    id: 'CLM-2026-0052',
    workerId: 'work-204',
    workerName: 'Vikram Singh',
    schemeId: 'welf-4',
    schemeName: 'Sahakar Vidya — Worker Children Merit Scholarship',
    claimAmount: 18000,
    status: 'Disbursed',
    submissionDate: '2026-07-02',
    approvalDate: '2026-07-20',
    remarks: 'Disbursed directly to daughter Ananya Singh tuition account for polytechnic diploma.'
  },
  {
    id: 'CLM-2026-0063',
    workerId: 'work-203',
    workerName: 'Sunita Devi',
    schemeId: 'welf-2',
    schemeName: 'Ayushman Bharat — Sahakar Health Linkage',
    claimAmount: 4200,
    status: 'Under Review',
    submissionDate: '2026-09-01',
    remarks: 'OPD diagnostic bill verification pending from empaneled district hospital.'
  }
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2026-012',
    bookingId: 'BK-2026-0799',
    customerId: 'cust-404',
    customerName: 'Rohit Deshmukh',
    workerId: 'work-204',
    workerName: 'Vikram Singh',
    category: 'Worker Delay',
    priority: 'Medium',
    status: 'Resolved',
    description: 'Worker was delayed by 40 minutes due to unexpected traffic on NH24 without prior SMS alert.',
    createdAt: '2026-08-25',
    resolutionNotes: 'Society supervisor contacted customer. Apology issued and ₹50 cooperative credit credited.'
  },
  {
    id: 'CMP-2026-015',
    bookingId: 'BK-2026-0820',
    customerId: 'cust-512',
    customerName: 'Kavita Menon',
    workerId: 'work-207',
    workerName: 'Kiran Verma',
    category: 'Pricing Issue',
    priority: 'High',
    status: 'Under Review',
    description: 'Customer requested clarification regarding extra material cost charged for drain cleaner liquid.',
    createdAt: '2026-09-05',
    resolutionNotes: 'Receipt requested from worker; investigating invoice itemization.'
  }
];

export const MOCK_DEMAND_FORECAST: DemandForecastItem[] = [
  {
    service: 'Plumber',
    currentDemandScore: 78,
    forecastDemandScore: 94,
    percentageChange: 20.5,
    projectedWorkersNeeded: 120,
    availableWorkers: 95,
    shortfallOrSurplus: -25,
    seasonalTrendNote: 'Monsoon drainage clogging & groundwater overhead tank maintenance surge',
    priorityAction: 'Deploy 25 apprentice cooperative plumbers from Delhi & Noida societies.'
  },
  {
    service: 'Cleaner',
    currentDemandScore: 82,
    forecastDemandScore: 98,
    percentageChange: 19.5,
    projectedWorkersNeeded: 180,
    availableWorkers: 150,
    shortfallOrSurplus: -30,
    seasonalTrendNote: 'Upcoming festive season pre-Diwali home deep cleaning peak',
    priorityAction: 'Organize express weekend deep cleaning workforce batches with Pragati Samiti.'
  },
  {
    service: 'Electrician',
    currentDemandScore: 85,
    forecastDemandScore: 88,
    percentageChange: 3.5,
    projectedWorkersNeeded: 110,
    availableWorkers: 115,
    shortfallOrSurplus: 5,
    seasonalTrendNote: 'Stable high baseline demand for appliance servicing and backup inverters',
    priorityAction: 'Optimal allocation; keep 10 standby workers for emergency power outages.'
  },
  {
    service: 'Technician',
    currentDemandScore: 90,
    forecastDemandScore: 72,
    percentageChange: -20.0,
    projectedWorkersNeeded: 65,
    availableWorkers: 85,
    shortfallOrSurplus: 20,
    seasonalTrendNote: 'AC servicing tapering down as monsoon cools ambient temperature',
    priorityAction: 'Upskill surplus technicians into commercial RO and washing machine maintenance.'
  },
  {
    service: 'Painter',
    currentDemandScore: 45,
    forecastDemandScore: 86,
    percentageChange: 91.1,
    projectedWorkersNeeded: 130,
    availableWorkers: 70,
    shortfallOrSurplus: -60,
    seasonalTrendNote: 'Massive festive painting demand commencing post-monsoon dry spell',
    priorityAction: 'Initiate 2-week fast-track cooperative certification for rural painters in UP federation.'
  },
  {
    service: 'Caregiver',
    currentDemandScore: 68,
    forecastDemandScore: 75,
    percentageChange: 10.3,
    projectedWorkersNeeded: 60,
    availableWorkers: 54,
    shortfallOrSurplus: -6,
    seasonalTrendNote: 'Consistent geriatric home care request growth in NCR urban apartments',
    priorityAction: 'Liaise with HSSC to induct 10 freshly certified nursing assistants.'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    recipientRole: 'customer',
    title: 'Worker On The Way 🛵',
    message: 'Ravi Kumar (Plumber) has departed and will reach your address in ~15 minutes.',
    timestamp: '10:36 AM',
    isRead: false,
    type: 'emergency',
    linkTo: '/customer/bookings'
  },
  {
    id: 'notif-2',
    recipientRole: 'customer',
    title: 'Payment Successful ✓',
    message: 'Invoice INV-2026-0884 for ₹380 paid successfully to Delhi Labour Cooperative.',
    timestamp: 'Sep 04, 04:45 PM',
    isRead: true,
    type: 'payment',
    linkTo: '/customer/invoices'
  },
  {
    id: 'notif-3',
    recipientRole: 'worker',
    title: '🚨 Emergency Job Alert Near You!',
    message: 'New Emergency Plumbing request in Sector 62, Noida (1.4 km). Tap to accept.',
    timestamp: '10:33 AM',
    isRead: false,
    type: 'emergency',
    linkTo: '/worker/jobs'
  },
  {
    id: 'notif-4',
    recipientRole: 'worker',
    title: 'Weekly Cooperative Settlement Disbursed',
    message: '₹4,850 credited to your registered Punjab National Bank account via DBT.',
    timestamp: 'Sep 01, 10:00 AM',
    isRead: true,
    type: 'payment',
    linkTo: '/worker/earnings'
  },
  {
    id: 'notif-5',
    recipientRole: 'admin',
    title: 'Worker Verification Request Pending',
    message: 'Kiran Verma (Domestic Helper) submitted ITI & Aadhaar KYC documents for approval.',
    timestamp: '09:15 AM',
    isRead: false,
    type: 'verification',
    linkTo: '/admin/verification'
  },
  {
    id: 'notif-6',
    recipientRole: 'admin',
    title: 'High Demand Surge Detected',
    message: 'Plumbing & Emergency leak requests increased by 22% in Central Delhi.',
    timestamp: '08:45 AM',
    isRead: false,
    type: 'system',
    linkTo: '/admin/demand-forecast'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-SGIG-2026-00912',
    bookingId: 'BK-2026-0884',
    amount: 380,
    workerPayout: 342,
    cooperativeFee: 26.6,
    platformFee: 11.4,
    customerName: 'Priya Sharma',
    workerName: 'Suresh Patel',
    serviceCategory: 'Electrician',
    date: '2026-09-04',
    status: 'Successful',
    paymentMethod: 'UPI (GPay / BHIM)'
  },
  {
    id: 'TXN-SGIG-2026-00845',
    bookingId: 'BK-2026-0870',
    amount: 650,
    workerPayout: 585,
    cooperativeFee: 45.5,
    platformFee: 19.5,
    customerName: 'Priya Sharma',
    workerName: 'Meena Kumari',
    serviceCategory: 'Cleaner',
    date: '2026-08-28',
    status: 'Successful',
    paymentMethod: 'UPI'
  },
  {
    id: 'TXN-SGIG-2026-00780',
    bookingId: 'BK-2026-0811',
    amount: 520,
    workerPayout: 468,
    cooperativeFee: 36.4,
    platformFee: 15.6,
    customerName: 'Manish Malhotra',
    workerName: 'Ravi Kumar',
    serviceCategory: 'Plumber',
    date: '2026-08-15',
    status: 'Successful',
    paymentMethod: 'Debit Card'
  },
  {
    id: 'TXN-SGIG-2026-00711',
    bookingId: 'BK-2026-0740',
    amount: 850,
    workerPayout: 765,
    cooperativeFee: 59.5,
    platformFee: 25.5,
    customerName: 'Anil Sengupta',
    workerName: 'Amit Sharma',
    serviceCategory: 'Technician',
    date: '2026-08-10',
    status: 'Successful',
    paymentMethod: 'Net Banking'
  }
];
