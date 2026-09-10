import { ContributionAmount } from "../types/insurance";

export interface ContributionOption {
  amount: ContributionAmount;
  label: string;
  tier: string;
  description: string;
}

export interface SimulatorScenario {
  id: string;
  label: string;
  tagline: string;
  explanation: string;
  coverageNote: string;
  whatToSubmit: string[];
}

export const CONTRIBUTION_OPTIONS: ContributionOption[] = [
  {
    amount: 10,
    label: "₹10/day",
    tier: "Basic",
    description: "Basic protection for essential needs",
  },
  {
    amount: 20,
    label: "₹20/day",
    tier: "Standard",
    description: "Balanced protection for regular workers",
  },
  {
    amount: 30,
    label: "₹30/day",
    tier: "Enhanced",
    description: "Higher protection with broader coverage",
  },
];

export const SIMULATOR_SCENARIOS: SimulatorScenario[] = [
  {
    id: "Hospitalization",
    label: "Hospitalization",
    tagline: "Unexpected hospital care",
    explanation:
      "If a covered hospitalization occurs, the worker can submit the required medical documents and claim the eligible support according to the active policy terms.",
    coverageNote:
      "Actual eligibility and reimbursement depend on verified documents and the active policy.",
    whatToSubmit: [
      "Hospital or discharge document",
      "Medical bills or receipts",
      "Identity and policy details",
    ],
  },
  {
    id: "Accident",
    label: "Accident",
    tagline: "Accidental injury",
    explanation:
      "For a covered accident, the worker can raise a claim with the relevant medical and incident documents for verification.",
    coverageNote:
      "Claim approval depends on policy rules and verification.",
    whatToSubmit: [
      "Medical treatment document",
      "Relevant incident information",
      "Medical bills or receipts",
    ],
  },
  {
    id: "Medical Emergency",
    label: "Medical Emergency",
    tagline: "Urgent medical treatment",
    explanation:
      "A worker can submit a claim for an eligible medical emergency with supporting medical records and receipts.",
    coverageNote:
      "Support is subject to the active insurance policy and verification.",
    whatToSubmit: [
      "Doctor or hospital document",
      "Medical receipts",
      "Policy and identity details",
    ],
  },
];

export function getProtectionLevel(
  contribution: ContributionAmount | null | undefined
): string {
  if (contribution === null || contribution === undefined) {
    return "Not selected";
  }

  const option = CONTRIBUTION_OPTIONS.find(
    (item) => item.amount === contribution
  );

  return option?.tier ?? "Not selected";
}

export function getMonthlyContribution(
  dailyContribution: number | null | undefined,
  workingDays: number | null | undefined
): number | null {
  if (
    dailyContribution === null ||
    dailyContribution === undefined ||
    !Number.isFinite(dailyContribution) ||
    workingDays === null ||
    workingDays === undefined ||
    !Number.isFinite(workingDays) ||
    workingDays < 0
  ) {
    return null;
  }

  return dailyContribution * workingDays;
}

export function getRecommendedContribution(
  dailyEarnings: number | null | undefined
): ContributionOption | null {
  if (
    dailyEarnings === null ||
    dailyEarnings === undefined ||
    !Number.isFinite(dailyEarnings) ||
    dailyEarnings < 0
  ) {
    return null;
  }

  if (dailyEarnings < 500) {
    return CONTRIBUTION_OPTIONS[0];
  }

  if (dailyEarnings < 1000) {
    return CONTRIBUTION_OPTIONS[1];
  }

  return CONTRIBUTION_OPTIONS[2];
}

export function formatContribution(
  amount: number | null | undefined
): string {
  if (
    amount === null ||
    amount === undefined ||
    !Number.isFinite(amount)
  ) {
    return "Data not available";
  }

  return `₹${amount}`;
}

export function getRecommendationExplanation(
  dailyEarnings: number | null | undefined,
  recommendedAmount: ContributionAmount | null
): string {
  if (
    dailyEarnings === null ||
    dailyEarnings === undefined ||
    !Number.isFinite(dailyEarnings) ||
    recommendedAmount === null
  ) {
    return "Contribution recommendation is unavailable until verified earnings data is available.";
  }

  return `Based on your verified daily earnings of ₹${dailyEarnings}, ₹${recommendedAmount}/day is the recommended contribution.`;
}

export function calculateMonthlyContribution(
  dailyContribution: ContributionAmount | null,
  workingDays: number | null | undefined
): number | null {
  return getMonthlyContribution(dailyContribution, workingDays);
}
