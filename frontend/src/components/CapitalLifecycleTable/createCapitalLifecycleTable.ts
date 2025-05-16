import { ClientData, TableRowData } from '../../types';
import {  CalculateFV, CalculateW1 }   from '../CalculationForm/calculateMonthlyPassiveIncome';



export const createCapitalLifecycleTable = (client: ClientData): TableRowData[] => {
  const results: TableRowData[] = [];
  let capitalPrev = client.c0;

  // Accumulation phase
  for (let age = client.ageNow; age < client.ageRetirement; age++) {
    const capital = CalculateFV(client.c0, client.r, client.g, client.p * 12, age - client.ageNow + 1);
    const saved = client.p * 12 * Math.pow(1 + client.g, age - client.ageNow);
    results.push({
      age,
      capitalYearStart: Math.round(capitalPrev),
      interest: Math.round(capitalPrev * client.r),
      saved: Math.round(saved),
      capitalYearEnd: Math.round(capital),
      savedPpMonthly: Math.round(saved / Math.pow(1 + client.i, age - client.ageNow) / 12),
    });
    capitalPrev = capital;
  }

  // Distribution phase
  const fv = CalculateFV(client.c0, client.r, client.g, client.p * 12, client.ageRetirement - client.ageNow);
  const w1 = CalculateW1(fv, client.r, client.i, client.ageDeath - client.ageRetirement + 1);

  for (let age = client.ageRetirement; age <= client.ageDeath; age++) {
    const withdrawal = w1 * Math.pow(1 + client.i, age - client.ageRetirement);
    const capital = capitalPrev * (1 + client.r) - withdrawal;
    results.push({
      age,
      capitalYearStart: Math.round(capitalPrev),
      interest: Math.round(capitalPrev * client.r),
      saved: Math.round(-withdrawal),
      capitalYearEnd: Math.round(capital),
      savedPpMonthly: Math.round(-withdrawal / Math.pow(1 + client.i, age - client.ageNow) / 12),
    });
    capitalPrev = capital;
  }

  return results;
};