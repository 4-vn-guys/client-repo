export type DepositPolicyInput = {
  depositEnabled: boolean;
  depositType: 'percent' | 'fixed';
  depositValue: number;
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function computeDepositAmount(
  policy: DepositPolicyInput | null | undefined,
  totalPrice: number,
): { deposit: number; balance: number } {
  if (!policy?.depositEnabled || totalPrice <= 0) {
    return { deposit: 0, balance: round2(totalPrice) };
  }
  const raw =
    policy.depositType === 'percent'
      ? (totalPrice * Number(policy.depositValue)) / 100
      : Math.min(Number(policy.depositValue), totalPrice);
  const deposit = round2(Math.min(Math.max(raw, 0), totalPrice));
  return { deposit, balance: round2(totalPrice - deposit) };
}
