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
  Number(import.meta.env.VITE_PLATFORM_RATE) || 2.5;

/**
 * Rounds platform fee to the nearest 0 or 5.
 *
 * Examples:
 * 201 -> 205
 * 202 -> 205
 * 203 -> 205
 * 204 -> 205
 * 205 -> 205
 * 206 -> 210
 * 207 -> 210
 * 208 -> 210
 * 209 -> 210
 * 210 -> 210
 */
function roundPlatformFee(amount: number): number {
  const wholeAmount = Math.round(amount);

  const lastDigit = wholeAmount % 10;

  if (lastDigit === 0 || lastDigit === 5) {
    return wholeAmount;
  }

  if (lastDigit < 5) {
    return wholeAmount + (5 - lastDigit);
  }

  return wholeAmount + (10 - lastDigit);
}

export function calculateDispatchCharges(
  input: DispatchCalculationInput
): DispatchCalculationResult {
  const capacity = Number(input.capacity);

  const busFare = Number(input.busFare);

  const saccoFee = Number(input.saccoFee ?? 0);

  const expectedRevenue =
    capacity * busFare;

  const rawPlatformFee =
    expectedRevenue * (PLATFORM_RATE / 100);

  const platformFee =
    roundPlatformFee(rawPlatformFee);

  const totalPayableToMarshal =
    platformFee + saccoFee;

  return {
    capacity,
    busFare,

    expectedRevenue,

    platformRate: PLATFORM_RATE,

    platformFee,

    saccoFee,

    totalPayableToMarshal,
  };
}