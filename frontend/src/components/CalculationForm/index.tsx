import React from 'react';
import { Button, Grid, Box } from '@mui/material';
import './style.css';

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

const CalculationForm: React.FC<CalculationFormProps> = ({
  clientData,
  onInputChange,
  onCalculate,
  validationErrors,
}) => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <Grid container spacing={3}>
        <CurrentAgeField
            clientData={clientData}
            onInputChange={onInputChange}
            validationErrors={validationErrors}
          />

          <RetirementAgeField
            clientData={clientData}
            onInputChange={onInputChange}
            validationErrors={validationErrors}
          />

          <ExpectedAgeOfDeathField
            clientData={clientData}
            onInputChange={onInputChange}
            validationErrors={validationErrors}
          />



          <InitialCapitalField
            clientData={clientData}
            onInputChange={onInputChange}
          />


          <MonthlySavingsField clientData={clientData} onInputChange={onInputChange} />

          <AnnualReturnRateField clientData={clientData} onInputChange={onInputChange} />

          <AnnualGrowthRateOfSavingsField clientData={clientData} onInputChange={onInputChange} />

          <AnnualInflationRateField clientData={clientData} onInputChange={onInputChange} />

      </Grid>

      {/* Calculate Button */}
      <Box mt={3} display="flex" justifyContent="center">
        <Button id="calculatorButton" variant="contained" color="primary" onClick={onCalculate} >
          Calculate
        </Button>
      </Box>
    </Box>
  );
};

export default CalculationForm;