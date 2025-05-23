import React, { useState, useEffect } from 'react';
import { Button, Grid, Box } from '@mui/material';
import './style.css';
import { useTranslation } from 'react-i18next';

import { ClientData } from '../../types';

import CurrentAgeField from './fields/CurrentAgeField';
import RetirementAgeField from './fields/RetirementAgeField';
import ExpectedAgeOfDeathField from './fields/ExpectedAgeOfDeathField';
import InitialCapitalField from './fields/InitialCapitalField';
import MonthlySavingsField from './fields/MonthlySavingsField';
import AnnualReturnRateField from './fields/AnnualReturnRateField';
import AnnualGrowthRateOfSavingsField from './fields/AnnualGrowthRateOfSavingsField';
import AnnualInflationRateField from './fields/AnnualInflationRateField';

interface CalculationFormProps {
  clientData: ClientData;
  onInputChange: (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCalculate: () => void;
  validationErrors: Record<string, { isValid: boolean; reason: string }>;
}

const validateAges = (clientData: ClientData) => {
  const errors: Record<string, { isValid: boolean; reason: string }> = {
    ageNow: { isValid: true, reason: '' },
    ageRetirement: { isValid: true, reason: '' },
    ageDeath: { isValid: true, reason: '' },
  };

  // Only validate if both fields have values
  if (clientData.ageNow !== null && clientData.ageRetirement !== null) {
    if (clientData.ageNow > clientData.ageRetirement) {
      errors.ageNow = { isValid: false, reason: 'Current age must be less than retirement age' };
      errors.ageRetirement = { isValid: false, reason: 'Retirement age must be greater than current age' };
    }
  }

  if (clientData.ageRetirement !== null && clientData.ageDeath !== null) {
    if (clientData.ageRetirement >= clientData.ageDeath) {
      errors.ageRetirement = { isValid: false, reason: 'Retirement age must be less than expected age of death' };
      errors.ageDeath = { isValid: false, reason: 'Expected age of death must be greater than retirement age' };
    }
  }

  return errors;
};

const CalculationForm: React.FC<CalculationFormProps> = ({
  clientData,
  onInputChange,
  onCalculate,
  validationErrors: initialValidationErrors,
}) => {
  const { t } = useTranslation();
  const [validationErrors, setValidationErrors] = useState(initialValidationErrors);

  useEffect(() => {
    // Validate ages whenever clientData changes
    const ageErrors = validateAges(clientData);
    setValidationErrors((prev) => ({
      ...prev,
      ageNow: ageErrors.ageNow,
      ageRetirement: ageErrors.ageRetirement,
      ageDeath: ageErrors.ageDeath,
    }));
  }, [clientData]);

  const handleCalculate = () => {
    const ageErrors = validateAges(clientData);
    setValidationErrors((prev) => ({
      ...prev,
      ageNow: ageErrors.ageNow,
      ageRetirement: ageErrors.ageRetirement,
      ageDeath: ageErrors.ageDeath,
    }));

    const hasErrors = Object.values(ageErrors).some((error) => !error.isValid);
    if (!hasErrors) {
      onCalculate();
    }
  };

  const hasValidationErrors = Object.values(validationErrors).some((error) => !error.isValid);

  // Map error reasons to translation keys
  const errorTranslations: Record<string, string> = {
    'Current age must be less than retirement age': t('error_current_age_less_than_retirement'),
    'Retirement age must be greater than current age': t('error_retirement_age_greater_than_current'),
    'Retirement age must be less than expected age of death': t('error_retirement_age_less_than_death'),
    'Expected age of death must be greater than retirement age': t('error_death_age_greater_than_retirement'),
  };

  // Patch validationErrors to use translated reasons
  const translatedValidationErrors = Object.fromEntries(
    Object.entries(validationErrors).map(([key, val]) => [
      key,
      val.isValid
        ? val
        : { ...val, reason: errorTranslations[val.reason] || val.reason },
    ])
  );

  return (
    <Box component="form" noValidate autoComplete="off">
      <Grid container spacing={3}>
        <CurrentAgeField
          clientData={clientData}
          onInputChange={onInputChange}
          validationErrors={translatedValidationErrors}
        />

        <RetirementAgeField
          clientData={clientData}
          onInputChange={onInputChange}
          validationErrors={translatedValidationErrors}
        />

        <ExpectedAgeOfDeathField
          clientData={clientData}
          onInputChange={onInputChange}
          validationErrors={translatedValidationErrors}
        />

        <InitialCapitalField clientData={clientData} onInputChange={onInputChange} />

        <MonthlySavingsField clientData={clientData} onInputChange={onInputChange} />

        <AnnualReturnRateField clientData={clientData} onInputChange={onInputChange} />

        <AnnualGrowthRateOfSavingsField clientData={clientData} onInputChange={onInputChange} />

        <AnnualInflationRateField clientData={clientData} onInputChange={onInputChange} />
      </Grid>

      {/* Calculate Button */}
      <Box mt={3} display="flex" justifyContent="center">
        <Button
          id="calculatorButton"
          variant="contained"
          color="primary"
          onClick={handleCalculate}
          disabled={hasValidationErrors}
        >
          {t('calculate')}
        </Button>
      </Box>
    </Box>
  );
};

export default CalculationForm;