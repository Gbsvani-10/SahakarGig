export interface ContributionOption {
  amount: number;
  label: string;
  tier: string;
  description: string;
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

export function getMonthlyContribution(
  dailyContribution: number,
  workingDays: number | null | undefined
): number | null {
  if (
    !Number.isFinite(dailyContribution) ||
    workingDays === null ||
    workingDays === undefined ||
    !Number.isFinite(workingDays)
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
    !Number.isFinite(dailyEarnings)
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
  if (amount === null || amount === undefined || !Number.isFinite(amount)) {
    return "Data not available";
  }

  return `₹${amount}`;
}
