import { createCapitalLifecycleTable } from './createCapitalLifecycleTable';
import { ClientData, TableRowData } from '../../types';

describe('createCapitalLifecycleTable', () => {
  const client: ClientData = {
    ageNow: 32,
    ageRetirement: 35,
    ageDeath: 38,
    c0: 5000,
    p: 2000,
    r: 0.07,
    g: 0.02,
    i: 0.02,
  };

  const expectedTable: TableRowData[] = [
    { age: 32, capitalYearStart: 5000, interest: 350, saved: 24000, capitalYearEnd: 29350, savedPpMonthly: 2000 },
    { age: 33, capitalYearStart: 29350, interest: 2055, saved: 24480, capitalYearEnd: 55885, savedPpMonthly: 2000 },
    { age: 34, capitalYearStart: 55885, interest: 3912, saved: 24970, capitalYearEnd: 84766, savedPpMonthly: 2000 },
    { age: 35, capitalYearStart: 84766, interest: 5934, saved: -24328, capitalYearEnd: 66372, savedPpMonthly: -1910 },
    { age: 36, capitalYearStart: 66372, interest: 4646, saved: -24814, capitalYearEnd: 46204, savedPpMonthly: -1910 },
    { age: 37, capitalYearStart: 46204, interest: 3234, saved: -25310, capitalYearEnd: 24128, savedPpMonthly: -1910 },
    { age: 38, capitalYearStart: 24128, interest: 1689, saved: -25817, capitalYearEnd: 0, savedPpMonthly: -1910 },
  ];

  it('should generate capital lifecycle table matching expected values', () => {
    const result: TableRowData[] = createCapitalLifecycleTable(client);

    expect(result).toHaveLength(expectedTable.length);

    result.forEach((row, index) => {
      const expected = expectedTable[index];
      expect(row.age).toBe(expected.age);
      expect(row.capitalYearStart).toBeCloseTo(expected.capitalYearStart, 4);
      expect(row.interest).toBeCloseTo(expected.interest, 4);
      expect(row.saved).toBeCloseTo(expected.saved, 4);
      expect(row.capitalYearEnd).toBeCloseTo(expected.capitalYearEnd, 4);
      expect(row.savedPpMonthly).toBeCloseTo(expected.savedPpMonthly, 4);
    });
  });

  it('should handle single-year accumulation phase correctly', () => {
    const singleYearClient: ClientData = {
      ...client,
      ageRetirement: 33,
    };

    const result: TableRowData[] = createCapitalLifecycleTable(singleYearClient);
    expect(result).toHaveLength((33 - 32) + (38 - 33 + 1)); // 1 + 6 = 7 rows
    expect(result[0].age).toBe(32); // Accumulation phase
    expect(result[1].age).toBe(33); // Start of distribution phase
  });
});