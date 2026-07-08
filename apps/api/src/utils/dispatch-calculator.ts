export interface DispatchCalculationInput {
  capacity: number;
  busFare: number;
  saccoFee?: number;
}

export interface DispatchCalculationResult {
  capacity: number;
  busFare: number;

  expectedRevenue: number;

  platformRate: number;
  platformFee: number;

  saccoFee: number;

  totalPayableToMarshal: number;
}

const PLATFORM_RATE =
  Number(process.env.PLATFORM_RATE ?? "2.5") / 100;

function roundPlatformFee(amount: number): number {
  const wholeAmount = Math.floor(amount);

  const lastDigit = wholeAmount % 10;

  // Already ends in 0 or 5
  if (lastDigit === 0 || lastDigit === 5) {
    return wholeAmount;
  }

  // Round up to the next 5
  if (lastDigit < 5) {
    return wholeAmount + (5 - lastDigit);
  }

  // Round up to the next 10
  return wholeAmount + (10 - lastDigit);
}

export function calculateDispatchCharges(
  input: DispatchCalculationInput
): DispatchCalculationResult {
  const capacity = input.capacity;
  const busFare = Number(input.busFare);
  const saccoFee = Number(input.saccoFee ?? 0);

  const expectedRevenue = capacity * busFare;

  // Raw 2.5% calculation
  const rawPlatformFee = expectedRevenue * PLATFORM_RATE;

  // Apply cash rounding
  const platformFee = roundPlatformFee(rawPlatformFee);

  const totalPayableToMarshal =
    platformFee + saccoFee;

  return {
    capacity,
    busFare,
    expectedRevenue,
    platformRate:
    Number(process.env.PLATFORM_RATE ?? "2.5"),
    platformFee,

    saccoFee,

    totalPayableToMarshal,
  };
}