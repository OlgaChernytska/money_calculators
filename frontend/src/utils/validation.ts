import { ClientData } from '../types';

export const checkValidationRules = (field: string, value: number, clientData: ClientData) => {
  const { ageNow, ageRetirement, ageDeath } = clientData;

  switch (field) {
    case 'ageNow':
      if (ageRetirement !== null && value >= ageRetirement) {
        return { isValid: false, reason: 'Current Age must be less than Retirement Age' };
      }
      if (ageDeath !== null && value >= ageDeath) {
        return { isValid: false, reason: 'Current Age must be less than Expected Age of Death' };
      }
      return { isValid: true, reason: '' };
    case 'ageRetirement':
      if (ageNow !== null && value <= ageNow) {
        return { isValid: false, reason: 'Retirement Age must be greater than Current Age' };
      }
      if (ageDeath !== null && value >= ageDeath) {
        return { isValid: false, reason: 'Retirement Age must be less than Expected Age of Death' };
      }
      return { isValid: true, reason: '' };
    case 'ageDeath':
      if (ageNow !== null && value <= ageNow) {
        return { isValid: false, reason: 'Expected Age of Death must be greater than Current Age' };
      }
      if (ageRetirement !== null && value <= ageRetirement) {
        return { isValid: false, reason: 'Expected Age of Death must be greater than Retirement Age' };
      }
      return { isValid: true, reason: '' };
    default:
      return { isValid: true, reason: '' };
  }
};