import {
  ContributionAmount,
  ProtectionTier,
  ContributionOption,
  ProtectionBenefit,
  FAQItem,
} from '../types';

export const DEFAULT_WORKING_DAYS_PER_MONTH = 26;

export const CONTRIBUTION_TIERS: ContributionOption[] = [
  {
    amount: 5,
    tier: 'Basic',
    title: 'Basic Protection',
    tagline: 'Lightest on your daily pocket',
    color: 'text-amber-700',
    lightBg: 'bg-amber-50/70 border-amber-200',
    accentBorder: 'border-amber-400',
    features: [
      'Accident emergency medical aid support',
      'Basic hospitalization relief benefit',
      'Instant phone claim assistance',
    ],
  },
  {
    amount: 10,
    tier: 'Balanced',
    title: 'Balanced Protection',
    tagline: 'Ideal daily balance for everyday workers',
    recommended: true,
    color: 'text-emerald-700',
    lightBg: 'bg-emerald-50/70 border-emerald-300',
    accentBorder: 'border-emerald-500',
    features: [
      'Comprehensive accident & injury support',
      'Extended hospital stay assistance',
      'Emergency medicine reimbursement aid',
      'Family interim financial relief',
    ],
  },
  {
    amount: 20,
    tier: 'Strong',
    title: 'Higher Protection',
    tagline: 'Maximum safety shield for your family',
    color: 'text-blue-700',
    lightBg: 'bg-blue-50/70 border-blue-300',
    accentBorder: 'border-blue-500',
    features: [
      'Highest medical & critical accident support',
      'Specialist consultations & testing aid',
      'Extended hospitalization room & nursing',
      'Enhanced family distress benefit',
    ],
  },
];

/**
 * Calculates estimated monthly contribution given daily contribution and working days
 */
export function calculateMonthlyContribution(
  dailyContribution: number,
  workingDays: number = DEFAULT_WORKING_DAYS_PER_MONTH
): number {
  return Math.round(dailyContribution * (workingDays || DEFAULT_WORKING_DAYS_PER_MONTH));
}

/**
 * Calculates estimated remaining daily earnings after insurance deduction
 */
export function calculateRemainingEarnings(
  dailyEarnings: number | null,
  dailyContribution: number
): number | null {
  if (dailyEarnings === null || dailyEarnings === undefined) return null;
  return Math.max(0, dailyEarnings - dailyContribution);
}

/**
 * Rule-based recommendation engine for low-income daily workers:
 * - daily earnings <= ₹250  -> ₹5/day
 * - ₹251 – ₹400             -> ₹10/day
 * - > ₹400                  -> ₹20/day
 * If earnings data is unavailable, defaults to ₹10/day with transparent notice.
 */
export function getRecommendedContribution(dailyEarnings: number | null): ContributionAmount {
  if (dailyEarnings === null || dailyEarnings === undefined) {
    return 10;
  }
  if (dailyEarnings <= 250) {
    return 5;
  }
  if (dailyEarnings <= 400) {
    return 10;
  }
  return 20;
}

/**
 * Returns human-readable protection tier
 */
export function getProtectionLevel(dailyContribution: ContributionAmount): ProtectionTier {
  switch (dailyContribution) {
    case 5:
      return 'Basic';
    case 10:
      return 'Balanced';
    case 20:
      return 'Strong';
    default:
      return 'Balanced';
  }
}

/**
 * Recommendation explanation text based on daily earnings and contribution
 */
export function getRecommendationExplanation(
  dailyEarnings: number | null,
  recommendedAmount: ContributionAmount
): { tierName: string; rationale: string; percentageNote: string } {
  if (dailyEarnings === null || dailyEarnings === undefined) {
    return {
      tierName: 'Balanced Protection',
      rationale:
        'Recommended standard tier providing balanced coverage while your active wage record is being verified.',
      percentageNote: 'Based on standard gig worker baseline',
    };
  }

  const percentOfEarnings = ((recommendedAmount / dailyEarnings) * 100).toFixed(1);

  if (recommendedAmount === 5) {
    return {
      tierName: 'Basic Protection',
      rationale:
        'Calibrated for your verified daily income range (₹' +
        dailyEarnings +
        '/day) to keep daily expenses manageable while ensuring essential protection.',
      percentageNote: `Takes only ${percentOfEarnings}% of your verified daily wage`,
    };
  } else if (recommendedAmount === 10) {
    return {
      tierName: 'Balanced Protection',
      rationale:
        'Affordable for your verified daily wage (₹' +
        dailyEarnings +
        '/day) while providing broader protection for you and your family.',
      percentageNote: `Takes only ${percentOfEarnings}% of your verified daily wage`,
    };
  } else {
    return {
      tierName: 'Higher Protection',
      rationale:
        'Optimal tier given your higher daily income capacity (₹' +
        dailyEarnings +
        '/day), maximizing coverage for hospital stays and accident emergencies.',
      percentageNote: `Takes only ${percentOfEarnings}% of your verified daily wage`,
    };
  }
}

/**
 * Protection overview benefit cards with illustrative benefits
 */
export const PROTECTION_BENEFITS: ProtectionBenefit[] = [
  {
    id: 'med',
    category: 'Medical',
    title: 'Medical Support',
    icon: 'Hospital',
    descriptions: {
      5: 'Assistance for standard outpatient visits and essential generic medicines following acute illness.',
      10: 'Broader support for eligible medical prescriptions, doctor consultations, and diagnostic tests.',
      20: 'Enhanced aid for multi-day treatments, specialist consults, and advanced laboratory investigations.',
    },
    illustrativeBenefit: 'Illustrative benefit: Support for eligible medical expenses according to the selected policy.',
  },
  {
    id: 'acc',
    category: 'Accident',
    title: 'Accident Support',
    icon: 'ShieldAlert',
    descriptions: {
      5: 'Immediate first-aid coverage and emergency clinic transport assistance for work-related minor injuries.',
      10: 'Substantial aid for bone fractures, workplace injury treatment, and recovery medication support.',
      20: 'High-priority trauma care relief, temporary wage loss buffer, and rehabilitation support.',
    },
    illustrativeBenefit: 'Illustrative benefit: Emergency injury and clinic care relief per policy schedule.',
  },
  {
    id: 'emg',
    category: 'Emergency',
    title: 'Emergency Protection',
    icon: 'Activity',
    descriptions: {
      5: 'Rapid hotline guidance and urgent cash voucher access for verified local emergencies.',
      10: 'Fast-track emergency admission support at empaneled community hospitals without delays.',
      20: 'Priority cashless admission assistance and dedicated welfare officer field support.',
    },
    illustrativeBenefit: 'Illustrative benefit: Emergency admission coordination and welfare relief aid.',
  },
  {
    id: 'fam',
    category: 'Family',
    title: 'Family Support',
    icon: 'HeartHandshake',
    descriptions: {
      5: 'Dependent child emergency medical guidance and community health worker check-in.',
      10: 'Extended family member hospitalization subsidy aid and urgent nutrition voucher.',
      20: 'Comprehensive spouse and dependent child health relief and compassionate assistance.',
    },
    illustrativeBenefit: 'Illustrative benefit: Family emergency buffer and dependent welfare care relief.',
  },
];

/**
 * Protection Simulator Scenarios
 */
export const SIMULATOR_SCENARIOS = [
  {
    id: 'Accident',
    label: 'Accident',
    icon: 'ShieldAlert',
    tagline: 'Workplace injury, transit accident, or fall',
    explanation:
      'If you experience an accidental injury while on duty or commuting, the welfare policy coordinates immediate treatment support and helps cover immediate clinic costs.',
    whatToSubmit: [
      'Doctor prescription or clinic emergency card',
      'Medical bills or pharmacy receipts',
      'Brief description of date and location',
    ],
    coverageNote:
      'Coverage details and claim eligibility depend on the selected insurance policy terms.',
  },
  {
    id: 'Hospitalization',
    label: 'Hospitalization',
    icon: 'Hospital',
    tagline: 'Admitted to a clinic or hospital for treatment',
    explanation:
      'Depending on your policy, eligible hospitalization expenses may receive financial support for bed charges, nursing, and medicines during your stay.',
    whatToSubmit: [
      'Hospital admission and discharge summary',
      'Original consolidated hospital bill',
      'Patient Aadhaar or worker welfare ID card',
    ],
    coverageNote:
      'Coverage and claim eligibility depend on the insurance policy terms.',
  },
  {
    id: 'Medical Emergency',
    label: 'Medical Emergency',
    icon: 'Activity',
    tagline: 'Sudden severe illness, acute infection, or fever',
    explanation:
      'When sudden acute illness strikes, emergency medical support helps cover rapid diagnostic lab tests, urgent antibiotics, and doctor fees so you can recover quickly.',
    whatToSubmit: [
      'Registered doctor consultation paper',
      'Pharmacy cash memo for prescribed medicines',
      'Diagnostic lab test results (if any)',
    ],
    coverageNote:
      'Coverage and claim eligibility depend on the insurance policy terms.',
  },
  {
    id: 'Other',
    label: 'Other Unexpected Event',
    icon: 'HelpCircle',
    tagline: 'Other health-related or physical distress crisis',
    explanation:
      'Our welfare committee reviews other unforeseen health shocks and physical distress situations on a case-by-case compassionate relief basis.',
    whatToSubmit: [
      'Description of the incident or distress',
      'Any available medical or civic documentation',
      'Active mobile phone number for welfare agent callback',
    ],
    coverageNote:
      'Coverage and claim eligibility depend on the insurance policy terms.',
  },
];

/**
 * Micro-insurance Educational FAQs
 */
export const INSURANCE_FAQS: FAQItem[] = [
  {
    question: 'What is insurance?',
    category: 'General',
    answer:
      'Micro-insurance is designed specifically for low-income and daily earners. You contribute a small amount regularly (₹5, ₹10, or ₹20/day). If a covered unexpected event happens, the insurance policy provides financial support so you do not have to borrow money at high interest.',
  },
  {
    question: 'How much do I contribute?',
    category: 'Payments',
    answer:
      'You choose a small daily amount: ₹5/day (Basic), ₹10/day (Balanced), or ₹20/day (Higher). Across an estimated 26 working days in a month, this equals approximately ₹130, ₹260, or ₹520 per month. You are never charged percentage deductions on your gross earnings.',
  },
  {
    question: 'Can I change my contribution?',
    category: 'Flexibility',
    answer:
      'Yes, at any time! You are in complete control. You can request to adjust your contribution through the "Manage Contribution" option whenever your earnings change or during seasonal wage drops.',
  },
  {
    question: 'How does a claim work?',
    category: 'Claims',
    answer:
      'Submitting a claim is simple and takes 3 quick steps: 1) Select what happened, 2) Enter clinic/hospital details and attach documents, 3) Submit. The welfare assistance desk verifies your claim in coordination with the insurer.',
  },
  {
    question: 'What happens if my income is low?',
    category: 'Flexibility',
    answer:
      'Daily wage earnings can vary across seasons or weather disruptions. You can easily adjust your contribution to ₹5/day without losing your core protection shield. The system never adjusts your contribution automatically without your explicit consent.',
  },
];
