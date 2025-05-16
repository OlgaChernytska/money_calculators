import { ClientData } from '../../types';

export const CalculateFV = (c0: number, r: number, g: number, p: number, N: number): number => {
  return c0 * Math.pow(1 + r, N) + p * Array.from({ length: N }, (_, k) => Math.pow(1 + r, N - (k + 1)) * Math.pow(1 + g, k)).reduce((a, b) => a + b, 0);
};

export const CalculateW1 = (c0: number, r: number, i: number, N: number): number => {
  return (c0 * Math.pow(1 + r, N)) / Array.from({ length: N }, (_, k) => Math.pow(1 + r, N - 1 - k) * Math.pow(1 + i, k)).reduce((a, b) => a + b, 0);
};

export const calculateMonthlyPassiveIncome = (client: ClientData): number => {
  const fv = CalculateFV(client.c0, client.r, client.g, client.p * 12, client.ageRetirement - client.ageNow);
  const w1 = CalculateW1(fv, client.r, client.i, client.ageDeath - client.ageRetirement + 1);
  const wPP = w1 / Math.pow(1 + client.i, client.ageRetirement - client.ageNow);
  return wPP / 12;
};

