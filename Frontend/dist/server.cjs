var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express2 = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");

// src/server/api.ts
var import_express = require("express");

// src/data/mockData.ts
var MOCK_WORKERS = [
  {
    id: "work-201",
    userId: "user-w1",
    name: "Ravi Kumar",
    phone: "+91 98123 45678",
    email: "ravi.plumber@sahakargig.coop",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    primaryCategory: "Plumber",
    cooperativeId: "coop-001",
    cooperativeName: "Delhi Labour Welfare Cooperative Society Ltd.",
    experienceYears: 5,
    rating: 4.8,
    reviewCount: 124,
    completedJobsCount: 248,
    verificationStatus: "Verified",
    isAvailable: true,
    availabilityStatus: "Available",
    emergencyAvailable: true,
    latitude: 28.6304,
    longitude: 77.2773,
    locationAccuracy: 10,
    locationUpdatedAt: "2026-09-06T08:30:00Z",
    locationAddress: "H-12, Shakarpur, Laxmi Nagar, East Delhi 110092",
    serviceRadiusKm: 15,
    distanceKm: 1.4,
    serviceArea: "Central Delhi, Laxmi Nagar, Connaught Place, Mayur Vihar",
    hourlyRate: 350,
    priceRange: "\u20B9300 \u2013 \u20B9500",
    skills: [
      {
        id: "sk-1",
        category: "Plumber",
        name: "High Pressure Pipe Joints & Concealed Leakage",
        yearsExperience: 5,
        level: "Advanced",
        verificationStatus: "Verified",
        certifiedBy: "NCCT / ITI Delhi"
      },
      {
        id: "sk-2",
        category: "Plumber",
        name: "RO & Water Purifier Installation",
        yearsExperience: 3,
        level: "Intermediate",
        verificationStatus: "Verified",
        certifiedBy: "Delhi Labour Federation"
      },
      {
        id: "sk-3",
        category: "Plumber",
        name: "Bathroom Sanitary & Mixer Tap Assembly",
        yearsExperience: 5,
        level: "Master",
        verificationStatus: "Verified",
        certifiedBy: "NSDC Skill India"
      }
    ],
    certifications: [
      {
        id: "cert-1",
        name: "NSDC Certified Master Plumber Level 4",
        issuingOrganization: "National Skill Development Corporation (NSDC)",
        issueDate: "2021-06-15",
        expiryDate: "2027-06-15",
        verificationStatus: "Verified",
        certificateNumber: "NSDC-PLMB-2021-9982"
      },
      {
        id: "cert-2",
        name: "Cooperative Artisan Registered Identity",
        issuingOrganization: "Ministry of Cooperation / NCCT Delhi Chapter",
        issueDate: "2023-01-10",
        verificationStatus: "Verified",
        certificateNumber: "NCCT-COOP-DEL-4412"
      }
    ],
    schedule: [
      { day: "Monday", enabled: true, start: "09:00", end: "19:00" },
      { day: "Tuesday", enabled: true, start: "09:00", end: "19:00" },
      { day: "Wednesday", enabled: true, start: "09:00", end: "19:00" },
      { day: "Thursday", enabled: true, start: "09:00", end: "19:00" },
      { day: "Friday", enabled: true, start: "09:00", end: "19:00" },
      { day: "Saturday", enabled: true, start: "09:00", end: "18:00" },
      { day: "Sunday", enabled: false, start: "10:00", end: "14:00" }
    ],
    bankDetails: {
      accountName: "Ravi Kumar",
      accountNumber: "9188201004523",
      ifsc: "PUNB0021400",
      upiId: "ravikumar@coopbank"
    },
    welfareStatus: {
      insuranceActive: true,
      policyNumber: "PMSBY-COOP-882194",
      validUntil: "2027-03-31",
      schemeName: "Pradhan Mantri Suraksha Bima (Cooperative Group Policy)"
    }
  },
  {
    id: "work-202",
    userId: "user-w2",
    name: "Suresh Patel",
    phone: "+91 98234 56789",
    email: "suresh.patel@sahakargig.coop",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    primaryCategory: "Electrician",
    cooperativeId: "coop-001",
    cooperativeName: "Delhi Labour Welfare Cooperative Society Ltd.",
    experienceYears: 7,
    rating: 4.9,
    reviewCount: 188,
    completedJobsCount: 312,
    verificationStatus: "Verified",
    isAvailable: true,
    availabilityStatus: "Available",
    emergencyAvailable: true,
    latitude: 28.5244,
    longitude: 77.2066,
    locationAccuracy: 12,
    locationUpdatedAt: "2026-09-06T09:15:00Z",
    locationAddress: "Block J, Saket, South Delhi 110017",
    serviceRadiusKm: 12,
    distanceKm: 2.1,
    serviceArea: "South Delhi, Saket, Malviya Nagar, Hauz Khas",
    hourlyRate: 380,
    priceRange: "\u20B9350 \u2013 \u20B9600",
    skills: [
      {
        id: "sk-4",
        category: "Electrician",
        name: "Three Phase Wiring & MCB Distribution",
        yearsExperience: 7,
        level: "Master",
        verificationStatus: "Verified",
        certifiedBy: "Govt. ITI Pusa"
      },
      {
        id: "sk-5",
        category: "Electrician",
        name: "Inverter & Solar PV Installation",
        yearsExperience: 4,
        level: "Advanced",
        verificationStatus: "Verified",
        certifiedBy: "Ministry of New and Renewable Energy"
      }
    ],
    certifications: [
      {
        id: "cert-3",
        name: "Licensed Wireman Grade 1",
        issuingOrganization: "Central Electricity Authority",
        issueDate: "2019-04-12",
        expiryDate: "2029-04-12",
        verificationStatus: "Verified",
        certificateNumber: "CEA-WRM-7712"
      }
    ],
    schedule: [
      { day: "Monday", enabled: true, start: "08:30", end: "18:30" },
      { day: "Tuesday", enabled: true, start: "08:30", end: "18:30" },
      { day: "Wednesday", enabled: true, start: "08:30", end: "18:30" },
      { day: "Thursday", enabled: true, start: "08:30", end: "18:30" },
      { day: "Friday", enabled: true, start: "08:30", end: "18:30" },
      { day: "Saturday", enabled: true, start: "09:00", end: "17:00" },
      { day: "Sunday", enabled: true, start: "10:00", end: "16:00" }
    ],
    welfareStatus: {
      insuranceActive: true,
      policyNumber: "PMSBY-COOP-882195",
      validUntil: "2027-03-31",
      schemeName: "NCCT Shramik Suraksha Kavach"
    }
  },
  {
    id: "work-203",
    userId: "user-w3",
    name: "Sunita Devi",
    phone: "+91 98345 67890",
    email: "sunita.devi@sahakargig.coop",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    primaryCategory: "Caregiver",
    cooperativeId: "coop-002",
    cooperativeName: "Pragati Shramik Sahakari Samiti",
    experienceYears: 4,
    rating: 4.9,
    reviewCount: 95,
    completedJobsCount: 190,
    verificationStatus: "Verified",
    isAvailable: true,
    availabilityStatus: "Available",
    emergencyAvailable: true,
    latitude: 28.628,
    longitude: 77.3649,
    locationAccuracy: 8,
    locationUpdatedAt: "2026-09-07T04:00:00Z",
    locationAddress: "Sector 62, Noida, Gautam Buddha Nagar 201301",
    serviceRadiusKm: 10,
    distanceKm: 2.8,
    serviceArea: "Noida Sector 15 to 75, Greater Noida West",
    hourlyRate: 500,
    priceRange: "\u20B9450 \u2013 \u20B9800",
    skills: [
      {
        id: "sk-6",
        category: "Caregiver",
        name: "Geriatric Care & Mobility Assistance",
        yearsExperience: 4,
        level: "Advanced",
        verificationStatus: "Verified",
        certifiedBy: "Red Cross Society / NCCT"
      },
      {
        id: "sk-7",
        category: "Caregiver",
        name: "Post-Surgical Nursing Aid & Medication Log",
        yearsExperience: 3,
        level: "Intermediate",
        verificationStatus: "Verified",
        certifiedBy: "Max Healthcare Training Institute"
      }
    ],
    certifications: [
      {
        id: "cert-4",
        name: "Certified Home Health Aide",
        issuingOrganization: "Healthcare Sector Skill Council (HSSC)",
        issueDate: "2022-02-18",
        expiryDate: "2028-02-18",
        verificationStatus: "Verified",
        certificateNumber: "HSSC-HHA-44109"
      }
    ],
    schedule: [
      { day: "Monday", enabled: true, start: "08:00", end: "17:00" },
      { day: "Tuesday", enabled: true, start: "08:00", end: "17:00" },
      { day: "Wednesday", enabled: true, start: "08:00", end: "17:00" },
      { day: "Thursday", enabled: true, start: "08:00", end: "17:00" },
      { day: "Friday", enabled: true, start: "08:00", end: "17:00" },
      { day: "Saturday", enabled: true, start: "08:00", end: "14:00" },
      { day: "Sunday", enabled: false, start: "08:00", end: "12:00" }
    ],
    welfareStatus: {
      insuranceActive: true,
      policyNumber: "PMSBY-COOP-882196",
      validUntil: "2027-03-31",
      schemeName: "Pragati Cooperative Mahila Swasthya Yojana"
    }
  },
  {
    id: "work-204",
    userId: "user-w4",
    name: "Vikram Singh",
    phone: "+91 98456 78901",
    email: "vikram.singh@sahakargig.coop",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    primaryCategory: "Carpenter",
    cooperativeId: "coop-001",
    cooperativeName: "Delhi Labour Welfare Cooperative Society Ltd.",
    experienceYears: 6,
    rating: 4.7,
    reviewCount: 88,
    completedJobsCount: 165,
    verificationStatus: "Verified",
    isAvailable: true,
    availabilityStatus: "Available",
    emergencyAvailable: false,
    latitude: 28.6083,
    longitude: 77.2958,
    locationAccuracy: 14,
    locationUpdatedAt: "2026-09-05T14:20:00Z",
    locationAddress: "Pocket 1, Mayur Vihar Phase 1, East Delhi 110091",
    serviceRadiusKm: 15,
    distanceKm: 3.5,
    serviceArea: "East Delhi, Noida, Indirapuram",
    hourlyRate: 400,
    priceRange: "\u20B9350 \u2013 \u20B9700",
    skills: [
      {
        id: "sk-8",
        category: "Carpenter",
        name: "Modular Furniture & Hydraulic Fittings",
        yearsExperience: 6,
        level: "Master",
        verificationStatus: "Verified",
        certifiedBy: "Furniture & Fittings Skill Council"
      }
    ],
    certifications: [
      {
        id: "cert-5",
        name: "Artisan Woodcraft Specialization",
        issuingOrganization: "All India Handicrafts & Labour Union",
        issueDate: "2020-09-01",
        verificationStatus: "Verified",
        certificateNumber: "AIH-CRPT-5521"
      }
    ],
    schedule: [
      { day: "Monday", enabled: true, start: "09:00", end: "18:00" },
      { day: "Tuesday", enabled: true, start: "09:00", end: "18:00" },
      { day: "Wednesday", enabled: true, start: "09:00", end: "18:00" },
      { day: "Thursday", enabled: true, start: "09:00", end: "18:00" },
      { day: "Friday", enabled: true, start: "09:00", end: "18:00" },
      { day: "Saturday", enabled: true, start: "09:00", end: "16:00" },
      { day: "Sunday", enabled: false, start: "09:00", end: "14:00" }
    ],
    welfareStatus: {
      insuranceActive: true,
      policyNumber: "PMSBY-COOP-882197",
      validUntil: "2027-03-31",
      schemeName: "NCCT Artisan Welfare Plan"
    }
  },
  {
    id: "work-205",
    userId: "user-w5",
    name: "Meena Kumari",
    phone: "+91 98567 89012",
    email: "meena.cleaner@sahakargig.coop",
    avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    primaryCategory: "Cleaner",
    cooperativeId: "coop-002",
    cooperativeName: "Pragati Shramik Sahakari Samiti",
    experienceYears: 3,
    rating: 4.8,
    reviewCount: 76,
    completedJobsCount: 140,
    verificationStatus: "Verified",
    isAvailable: true,
    availabilityStatus: "Available",
    emergencyAvailable: false,
    latitude: 28.575,
    longitude: 77.3685,
    locationAccuracy: 10,
    locationUpdatedAt: "2026-09-07T03:30:00Z",
    locationAddress: "Sector 50 Metro Station Area, Noida, UP 201301",
    serviceRadiusKm: 8,
    distanceKm: 1.8,
    serviceArea: "Noida Sector 50, 62, 76, Indirapuram",
    hourlyRate: 350,
    priceRange: "\u20B9300 \u2013 \u20B9600",
    skills: [
      {
        id: "sk-9",
        category: "Cleaner",
        name: "Deep Kitchen & Tile Acid-Free Descaling",
        yearsExperience: 3,
        level: "Advanced",
        verificationStatus: "Verified",
        certifiedBy: "Swachh Bharat Cooperative Initiative"
      }
    ],
    certifications: [
      {
        id: "cert-6",
        name: "Sanitation & Hygiene Master Practitioner",
        issuingOrganization: "National Sanitation Federation",
        issueDate: "2023-05-10",
        verificationStatus: "Verified",
        certificateNumber: "NSF-CL-992"
      }
    ],
    schedule: [
      { day: "Monday", enabled: true, start: "08:00", end: "17:00" },
      { day: "Tuesday", enabled: true, start: "08:00", end: "17:00" },
      { day: "Wednesday", enabled: true, start: "08:00", end: "17:00" },
      { day: "Thursday", enabled: true, start: "08:00", end: "17:00" },
      { day: "Friday", enabled: true, start: "08:00", end: "17:00" },
      { day: "Saturday", enabled: true, start: "08:00", end: "17:00" },
      { day: "Sunday", enabled: false, start: "08:00", end: "14:00" }
    ],
    welfareStatus: {
      insuranceActive: true,
      policyNumber: "PMSBY-COOP-882198",
      validUntil: "2027-03-31",
      schemeName: "Pragati Cooperative Mahila Swasthya Yojana"
    }
  },
  {
    id: "work-206",
    userId: "user-w6",
    name: "Amit Sharma",
    phone: "+91 98678 90123",
    email: "amit.ac@sahakargig.coop",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    primaryCategory: "Technician",
    cooperativeId: "coop-003",
    cooperativeName: "Samarthya Urban Skill Workers Cooperative",
    experienceYears: 5,
    rating: 4.9,
    reviewCount: 112,
    completedJobsCount: 210,
    verificationStatus: "Verified",
    isAvailable: true,
    availabilityStatus: "Available",
    emergencyAvailable: true,
    latitude: 28.4682,
    longitude: 77.0864,
    locationAccuracy: 16,
    locationUpdatedAt: "2026-09-06T11:00:00Z",
    locationAddress: "DLF Phase 4, Galleria Market, Gurugram, Haryana 122002",
    serviceRadiusKm: 15,
    distanceKm: 2.4,
    serviceArea: "Gurugram DLF Phases 1-5, Cyber City, Sector 56",
    hourlyRate: 450,
    priceRange: "\u20B9400 \u2013 \u20B9850",
    skills: [
      {
        id: "sk-10",
        category: "Technician",
        name: "Inverter AC Jet Pump Servicing & Gas Charging",
        yearsExperience: 5,
        level: "Master",
        verificationStatus: "Verified",
        certifiedBy: "Daikin / NCCT HVAC Training"
      }
    ],
    certifications: [
      {
        id: "cert-7",
        name: "HVAC Certified Refrigeration Specialist",
        issuingOrganization: "Electronics Sector Skills Council of India",
        issueDate: "2021-11-20",
        verificationStatus: "Verified",
        certificateNumber: "ESSCI-HVAC-3318"
      }
    ],
    schedule: [
      { day: "Monday", enabled: true, start: "09:00", end: "19:00" },
      { day: "Tuesday", enabled: true, start: "09:00", end: "19:00" },
      { day: "Wednesday", enabled: true, start: "09:00", end: "19:00" },
      { day: "Thursday", enabled: true, start: "09:00", end: "19:00" },
      { day: "Friday", enabled: true, start: "09:00", end: "19:00" },
      { day: "Saturday", enabled: true, start: "09:00", end: "19:00" },
      { day: "Sunday", enabled: true, start: "10:00", end: "15:00" }
    ],
    welfareStatus: {
      insuranceActive: true,
      policyNumber: "PMSBY-COOP-882199",
      validUntil: "2027-03-31",
      schemeName: "Samarthya Cooperative Group Cover"
    }
  },
  {
    id: "work-207",
    userId: "user-w7",
    name: "Kiran Verma",
    phone: "+91 98789 01234",
    email: "kiran.verma@sahakargig.coop",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    primaryCategory: "Domestic Helper",
    cooperativeId: "coop-001",
    cooperativeName: "Delhi Labour Welfare Cooperative Society Ltd.",
    experienceYears: 4,
    rating: 4.8,
    reviewCount: 64,
    completedJobsCount: 110,
    verificationStatus: "Pending",
    isAvailable: false,
    availabilityStatus: "Offline",
    emergencyAvailable: false,
    latitude: 28.6517,
    longitude: 77.1906,
    locationAccuracy: 15,
    locationUpdatedAt: "2026-09-04T16:45:00Z",
    locationAddress: "Ajmal Khan Road, Karol Bagh, Central Delhi 110005",
    serviceRadiusKm: 10,
    distanceKm: 4.2,
    serviceArea: "Central Delhi, Karol Bagh, Patel Nagar",
    hourlyRate: 300,
    priceRange: "\u20B9250 \u2013 \u20B9450",
    skills: [
      {
        id: "sk-11",
        category: "Domestic Helper",
        name: "Nutritious Indian Vegetarian Cooking & Hygiene",
        yearsExperience: 4,
        level: "Intermediate",
        verificationStatus: "Pending",
        certifiedBy: "Delhi Labour Society"
      }
    ],
    certifications: [
      {
        id: "cert-8",
        name: "Food Safety & Kitchen Hygiene Basic",
        issuingOrganization: "FSSAI Training Partner",
        issueDate: "2024-01-15",
        verificationStatus: "Pending",
        certificateNumber: "FSSAI-FST-8812"
      }
    ],
    schedule: [
      { day: "Monday", enabled: true, start: "07:30", end: "16:30" },
      { day: "Tuesday", enabled: true, start: "07:30", end: "16:30" },
      { day: "Wednesday", enabled: true, start: "07:30", end: "16:30" },
      { day: "Thursday", enabled: true, start: "07:30", end: "16:30" },
      { day: "Friday", enabled: true, start: "07:30", end: "16:30" },
      { day: "Saturday", enabled: true, start: "08:00", end: "14:00" },
      { day: "Sunday", enabled: false, start: "08:00", end: "12:00" }
    ],
    welfareStatus: {
      insuranceActive: false,
      policyNumber: "",
      validUntil: "",
      schemeName: "Awaiting Verification Approval"
    }
  }
];

// src/server/geoUtils.ts
function validateCoordinates(lat, lng) {
  if (typeof lat !== "number" || isNaN(lat)) {
    return { valid: false, error: "Latitude must be a valid number" };
  }
  if (typeof lng !== "number" || isNaN(lng)) {
    return { valid: false, error: "Longitude must be a valid number" };
  }
  if (lat < -90 || lat > 90) {
    return { valid: false, error: "Latitude must be between -90 and +90 degrees" };
  }
  if (lng < -180 || lng > 180) {
    return { valid: false, error: "Longitude must be between -180 and +180 degrees" };
  }
  return { valid: true };
}
function validateRadius(radius, defaultRadius = 5) {
  if (radius === void 0 || radius === null || radius === "") {
    return { valid: true, radiusKm: defaultRadius };
  }
  const parsed = typeof radius === "number" ? radius : parseFloat(String(radius));
  if (isNaN(parsed) || parsed <= 0) {
    return { valid: false, radiusKm: defaultRadius, error: "Radius must be a positive number" };
  }
  if (parsed < 0.5) {
    return { valid: false, radiusKm: defaultRadius, error: "Search radius minimum is 0.5 km" };
  }
  if (parsed > 50) {
    return { valid: false, radiusKm: defaultRadius, error: "Search radius maximum is 50 km to ensure prompt artisan dispatch" };
  }
  return { valid: true, radiusKm: Math.round(parsed * 10) / 10 };
}
function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}
function getBoundingBox(centerLat, centerLng, radiusKm) {
  const earthRadiusKm = 6371;
  const radDist = radiusKm / earthRadiusKm;
  const radLat = centerLat * Math.PI / 180;
  const minLat = centerLat - radDist * 180 / Math.PI;
  const maxLat = centerLat + radDist * 180 / Math.PI;
  const deltaLng = Math.asin(Math.sin(radDist) / Math.cos(radLat));
  const minLng = centerLng - deltaLng * 180 / Math.PI;
  const maxLng = centerLng + deltaLng * 180 / Math.PI;
  return { minLat, maxLat, minLng, maxLng };
}
function calculateMatchScore(worker, distanceKm, radiusKm, requestedService) {
  let score = 0;
  const serviceCategory = requestedService?.toLowerCase().trim();
  const workerCategory = worker.primaryCategory.toLowerCase().trim();
  const hasSkillMatch = worker.skills.some(
    (s) => s.name.toLowerCase().includes(serviceCategory || "") || s.category.toLowerCase().includes(serviceCategory || "")
  );
  if (!serviceCategory || serviceCategory === "all") {
    score += 20;
  } else if (workerCategory === serviceCategory) {
    score += 40;
  } else if (hasSkillMatch) {
    score += 25;
  }
  if (worker.availabilityStatus === "Available" || worker.isAvailable) {
    score += 30;
  } else if (worker.availabilityStatus === "Busy") {
    score += 10;
  } else {
    score += 0;
  }
  if (worker.verificationStatus === "Verified") {
    score += 25;
  } else if (worker.verificationStatus === "Pending") {
    score += 10;
  }
  const normalizedDistanceRatio = Math.max(0, 1 - distanceKm / Math.max(radiusKm, 1));
  score += Math.round(normalizedDistanceRatio * 25);
  const ratingScore = Math.min(5, Math.max(0, worker.rating || 4.5));
  score += Math.round(ratingScore / 5 * 15);
  const expScore = Math.min(10, Math.max(0, worker.experienceYears || 1));
  score += Math.round(expScore / 10 * 5);
  return score;
}
function findNearbyWorkers(allWorkers, customerLat, customerLng, radiusKm, options = {}) {
  const { service, availableOnly = false, minRating } = options;
  const bbox = getBoundingBox(customerLat, customerLng, radiusKm);
  const results = [];
  const targetCategory = service && service.toLowerCase() !== "all" ? service.toLowerCase().trim() : null;
  for (const worker of allWorkers) {
    if (typeof worker.latitude !== "number" || typeof worker.longitude !== "number") {
      continue;
    }
    if (worker.latitude < bbox.minLat || worker.latitude > bbox.maxLat || worker.longitude < bbox.minLng || worker.longitude > bbox.maxLng) {
      continue;
    }
    if (targetCategory) {
      const matchPrimary = worker.primaryCategory.toLowerCase() === targetCategory;
      const matchSkill = worker.skills.some(
        (s) => s.category.toLowerCase() === targetCategory || s.name.toLowerCase().includes(targetCategory)
      );
      if (!matchPrimary && !matchSkill) {
        continue;
      }
    }
    if (availableOnly && worker.availabilityStatus !== "Available" && !worker.isAvailable) {
      continue;
    }
    if (typeof minRating === "number" && worker.rating < minRating) {
      continue;
    }
    const distanceKm = calculateHaversineDistanceKm(
      customerLat,
      customerLng,
      worker.latitude,
      worker.longitude
    );
    if (distanceKm > radiusKm) {
      continue;
    }
    if (worker.serviceRadiusKm && distanceKm > worker.serviceRadiusKm) {
      continue;
    }
    const matchScore = calculateMatchScore(worker, distanceKm, radiusKm, targetCategory || void 0);
    results.push({
      worker: {
        ...worker,
        distanceKm
        // Update with accurate calculated distance
      },
      distanceKm,
      matchScore
    });
  }
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.distanceKm - b.distanceKm;
  });
  return results;
}

// src/server/geoService.ts
var serverWorkersStore = JSON.parse(JSON.stringify(MOCK_WORKERS));
var serverGeoService = {
  /**
   * Get all workers from server store
   */
  getAllWorkers() {
    return [...serverWorkersStore];
  },
  /**
   * Find worker by id
   */
  getWorkerById(id) {
    return serverWorkersStore.find((w) => w.id === id || w.userId === id);
  },
  /**
   * Search nearby workers with validation and ranking
   */
  searchNearby(params) {
    const coordValidation = validateCoordinates(params.latitude, params.longitude);
    if (!coordValidation.valid) {
      return { success: false, error: coordValidation.error };
    }
    const lat = params.latitude;
    const lng = params.longitude;
    const radiusValidation = validateRadius(params.radiusKm, 5);
    if (!radiusValidation.valid) {
      return { success: false, error: radiusValidation.error };
    }
    const radius = radiusValidation.radiusKm;
    let minRatingNum;
    if (params.minRating !== void 0 && params.minRating !== null && params.minRating !== "") {
      const parsed = parseFloat(String(params.minRating));
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 5) {
        minRatingNum = parsed;
      }
    }
    const matches = findNearbyWorkers(serverWorkersStore, lat, lng, radius, {
      service: params.service,
      availableOnly: Boolean(params.availableOnly),
      minRating: minRatingNum
    });
    return {
      success: true,
      center: { latitude: lat, longitude: lng },
      radiusKm: radius,
      count: matches.length,
      results: matches
    };
  },
  /**
   * Update worker location with authorization & range checks (Section 5, 16, 18)
   */
  updateWorkerLocation(requester, targetWorkerId, payload) {
    const workerIndex = serverWorkersStore.findIndex(
      (w) => w.id === targetWorkerId || w.userId === targetWorkerId
    );
    if (workerIndex === -1) {
      return { success: false, error: "Artisan profile not found" };
    }
    const targetWorker = serverWorkersStore[workerIndex];
    const isSelf = requester.workerId === targetWorker.id || requester.userId === targetWorker.userId || requester.userId === "user-w1" || // Demo active worker fallback
    requester.role === "admin";
    if (!isSelf && requester.role !== "admin" && requester.role !== "worker") {
      return { success: false, error: "Unauthorized: You can only update your own service location" };
    }
    const coordValidation = validateCoordinates(payload.latitude, payload.longitude);
    if (!coordValidation.valid) {
      return { success: false, error: coordValidation.error };
    }
    let radiusKm = targetWorker.serviceRadiusKm || 10;
    if (payload.serviceRadiusKm !== void 0) {
      const radiusValidation = validateRadius(payload.serviceRadiusKm, 10);
      if (!radiusValidation.valid) {
        return { success: false, error: radiusValidation.error };
      }
      radiusKm = radiusValidation.radiusKm;
    }
    const updatedWorker = {
      ...targetWorker,
      latitude: payload.latitude,
      longitude: payload.longitude,
      locationAccuracy: payload.locationAccuracy || 10,
      locationAddress: payload.locationAddress || targetWorker.locationAddress || "Service Area Verified",
      serviceRadiusKm: radiusKm,
      locationUpdatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    serverWorkersStore[workerIndex] = updatedWorker;
    return {
      success: true,
      worker: updatedWorker
    };
  },
  /**
   * Reset server store for demo scenarios
   */
  resetStore() {
    serverWorkersStore = JSON.parse(JSON.stringify(MOCK_WORKERS));
  }
};

// src/server/api.ts
var apiRouter = (0, import_express.Router)();
function extractRequester(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (token.includes("worker")) {
    return { role: "worker", userId: "user-w1", workerId: "work-201" };
  } else if (token.includes("admin")) {
    return { role: "admin", userId: "admin-001" };
  }
  return { role: "customer", userId: "cust-101" };
}
apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    platform: "SahakarGig Cooperative Platform",
    geolocationEnabled: true,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
var handleNearbySearch = (req, res) => {
  try {
    const lat = req.method === "POST" ? req.body?.latitude : req.query.latitude ? parseFloat(req.query.latitude) : void 0;
    const lng = req.method === "POST" ? req.body?.longitude : req.query.longitude ? parseFloat(req.query.longitude) : void 0;
    const service = req.method === "POST" ? req.body?.service : req.query.service;
    const radiusKm = req.method === "POST" ? req.body?.radiusKm : req.query.radiusKm ? parseFloat(req.query.radiusKm) : void 0;
    const availableOnly = req.method === "POST" ? req.body?.availableOnly : req.query.availableOnly === "true";
    const minRating = req.method === "POST" ? req.body?.minRating : req.query.minRating ? parseFloat(req.query.minRating) : void 0;
    const searchResult = serverGeoService.searchNearby({
      latitude: lat,
      longitude: lng,
      service,
      radiusKm,
      availableOnly,
      minRating
    });
    if (!searchResult.success) {
      return res.status(400).json({
        success: false,
        error: searchResult.error || "Invalid search parameters",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    return res.json({
      success: true,
      data: {
        center: searchResult.center,
        radiusKm: searchResult.radiusKm,
        count: searchResult.count,
        workers: searchResult.results
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (err) {
    console.error("Error in /api/services/nearby:", err);
    return res.status(500).json({
      success: false,
      error: "We could not search for nearby services right now. Please try again.",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
};
apiRouter.get("/services/nearby", handleNearbySearch);
apiRouter.post("/services/nearby", handleNearbySearch);
apiRouter.patch("/workers/location", (req, res) => {
  try {
    const requester = extractRequester(req);
    const workerId = req.body?.workerId || requester.workerId || "work-201";
    const result = serverGeoService.updateWorkerLocation(requester, workerId, {
      latitude: req.body?.latitude,
      longitude: req.body?.longitude,
      locationAccuracy: req.body?.locationAccuracy,
      locationAddress: req.body?.locationAddress,
      serviceRadiusKm: req.body?.serviceRadiusKm
    });
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    return res.json({
      success: true,
      data: result.worker,
      message: "Artisan service location updated successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (err) {
    console.error("Error in PATCH /api/workers/location:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to update service location",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
});
apiRouter.put("/workers/:id/location", (req, res) => {
  try {
    const requester = extractRequester(req);
    const targetWorkerId = req.params.id;
    const result = serverGeoService.updateWorkerLocation(requester, targetWorkerId, {
      latitude: req.body?.latitude,
      longitude: req.body?.longitude,
      locationAccuracy: req.body?.locationAccuracy,
      locationAddress: req.body?.locationAddress,
      serviceRadiusKm: req.body?.serviceRadiusKm
    });
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    return res.json({
      success: true,
      data: result.worker,
      message: "Worker service location updated",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (err) {
    console.error("Error in PUT /api/workers/:id/location:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to update location",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
});
apiRouter.get("/workers/:id/location", (req, res) => {
  const worker = serverGeoService.getWorkerById(req.params.id);
  if (!worker) {
    return res.status(404).json({ success: false, error: "Worker not found" });
  }
  return res.json({
    success: true,
    data: {
      workerId: worker.id,
      workerName: worker.name,
      primaryCategory: worker.primaryCategory,
      latitude: worker.latitude,
      longitude: worker.longitude,
      serviceRadiusKm: worker.serviceRadiusKm || 10,
      serviceArea: worker.serviceArea,
      locationUpdatedAt: worker.locationUpdatedAt
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
apiRouter.get("/geocode/search", (req, res) => {
  const query = (req.query.q || "").toLowerCase().trim();
  if (!query) {
    return res.status(400).json({ success: false, error: "Search query required" });
  }
  const PRESET_PLACES = {
    "sector 62": { lat: 28.628, lng: 77.3649, displayName: "Sector 62, Noida, Gautam Buddha Nagar, Uttar Pradesh" },
    "sector 18": { lat: 28.5708, lng: 77.326, displayName: "Sector 18 Market, Noida, Uttar Pradesh" },
    "sector 50": { lat: 28.575, lng: 77.3685, displayName: "Sector 50, Noida, Uttar Pradesh" },
    "laxmi nagar": { lat: 28.6304, lng: 77.2773, displayName: "Laxmi Nagar, Shakarpur, East Delhi" },
    "connaught place": { lat: 28.6315, lng: 77.2167, displayName: "Connaught Place, Central Delhi" },
    "saket": { lat: 28.5244, lng: 77.2066, displayName: "Saket District Centre, South Delhi" },
    "mayur vihar": { lat: 28.6083, lng: 77.2958, displayName: "Mayur Vihar Phase 1, East Delhi" },
    "karol bagh": { lat: 28.6517, lng: 77.1906, displayName: "Karol Bagh, Central Delhi" },
    "indirapuram": { lat: 28.641, lng: 77.371, displayName: "Indirapuram, Ghaziabad, Uttar Pradesh" },
    "dlf cyber city": { lat: 28.495, lng: 77.0895, displayName: "DLF Cyber City, Gurugram, Haryana" },
    "gurugram": { lat: 28.4595, lng: 77.0266, displayName: "Gurugram, Haryana" },
    "noida": { lat: 28.5355, lng: 77.391, displayName: "Noida, Gautam Buddha Nagar, Uttar Pradesh" },
    "delhi": { lat: 28.6139, lng: 77.209, displayName: "New Delhi, Delhi" }
  };
  const matches = Object.entries(PRESET_PLACES).filter(([key]) => query.includes(key) || key.includes(query)).map(([_, val]) => val);
  if (matches.length > 0) {
    return res.json({ success: true, data: matches });
  }
  return res.json({
    success: true,
    data: [
      {
        lat: 28.628,
        lng: 77.3649,
        displayName: `${req.query.q} (Sector 62, Noida Cooperative Hub Area)`
      }
    ]
  });
});

// server.ts
async function startServer() {
  const app = (0, import_express2.default)();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
  app.use(import_express2.default.json());
  app.use("/api", apiRouter);
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const possibleDistPaths = [
      import_path.default.join(process.cwd(), "dist"),
      import_path.default.join(process.cwd(), "Frontend", "dist"),
      import_path.default.resolve(__dirname),
      import_path.default.resolve(__dirname, "dist"),
      import_path.default.resolve(__dirname, "../dist")
    ];
    const distPath = possibleDistPaths.find((p) => import_fs.default.existsSync(import_path.default.join(p, "index.html"))) || possibleDistPaths[0];
    app.use(import_express2.default.static(distPath));
    app.get("*", (_req, res) => {
      const indexPath = import_path.default.join(distPath, "index.html");
      if (import_fs.default.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("SahakarGig frontend build not found. Please run 'npm run build' first.");
      }
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SahakarGig server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
