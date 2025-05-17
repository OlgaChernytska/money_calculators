import { calculateMonthlyPassiveIncome } from './calculateMonthlyPassiveIncome';
import { ClientData } from '../../types';

describe('calculateMonthlyPassiveIncome', () => {
  it('should calculate the monthly passive income correctly', () => {
    const client: ClientData = {
      ageNow: 32,
      ageRetirement: 40,
      ageDeath: 80,
      c0: 5000,
      p: 2000,
      r: 0.07,
      g: 0.02,
      i: 0.02,
    };

    const expectedMonthlyPassiveIncome = 1121.0388749801793;
    const result = calculateMonthlyPassiveIncome(client);

    expect(result).toBeCloseTo(expectedMonthlyPassiveIncome, 4); // Allowing for a small margin of error
  });
});