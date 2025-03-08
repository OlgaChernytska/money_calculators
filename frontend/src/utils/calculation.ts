import { ClientData, TableRowData } from '../types';

export const calculateFV = (c0: number, r: number, g: number, p: number, N: number): number => {
  return c0 * Math.pow(1 + r, N) + p * Array.from({ length: N }, (_, k) => Math.pow(1 + r, N - (k + 1)) * Math.pow(1 + g, k)).reduce((a, b) => a + b, 0);
};

export const calculateW1 = (c0: number, r: number, i: number, N: number): number => {
  return (c0 * Math.pow(1 + r, N)) / Array.from({ length: N }, (_, k) => Math.pow(1 + r, N - 1 - k) * Math.pow(1 + i, k)).reduce((a, b) => a + b, 0);
};

export const calculateMonthlyPassiveIncome = (client: ClientData): number => {
  const fv = calculateFV(client.c0, client.r, client.g, client.p * 12, client.ageRetirement - client.ageNow);
  const w1 = calculateW1(fv, client.r, client.i, client.ageDeath - client.ageRetirement + 1);
  const wPP = w1 / Math.pow(1 + client.i, client.ageRetirement - client.ageNow);
  return wPP / 12;
};

export const createCapitalLifecycleTable = (client: ClientData): TableRowData[] => {
  const results: TableRowData[] = [];
  let capitalPrev = client.c0;

  // Accumulation phase
  for (let age = client.ageNow; age < client.ageRetirement; age++) {
    const capital = calculateFV(client.c0, client.r, client.g, client.p * 12, age - client.ageNow + 1);
    results.push({
      age,
      capitalYearStart: capitalPrev,
      interest: capitalPrev * client.r,
      saved: client.p * 12 * Math.pow(1 + client.g, age - client.ageNow),
      capitalYearEnd: capital,
      savedPpMonthly: (client.p * 12 * Math.pow(1 + client.g, age - client.ageNow)) / 12,
    });
    capitalPrev = capital;
  }

  // Distribution phase
  const fv = calculateFV(client.c0, client.r, client.g, client.p * 12, client.ageRetirement - client.ageNow);
  const w1 = calculateW1(fv, client.r, client.i, client.ageDeath - client.ageRetirement + 1);

  for (let age = client.ageRetirement; age <= client.ageDeath; age++) {
    const withdrawal = w1 * Math.pow(1 + client.i, age - client.ageRetirement);
    const capital = capitalPrev * (1 + client.r) - withdrawal;
    results.push({
      age,
      capitalYearStart: capitalPrev,
      interest: capitalPrev * client.r,
      saved: -withdrawal,
      capitalYearEnd: capital,
      savedPpMonthly: -withdrawal / 12,
    });
    capitalPrev = capital;
  }

  return results;
};