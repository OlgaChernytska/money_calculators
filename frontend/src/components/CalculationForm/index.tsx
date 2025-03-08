import React from 'react';
import { Button, Grid, Box, Typography } from '@mui/material';
import CustomTextField from './CustomTextField';
import { ClientData } from '../../types';
import './style.css';

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
        {/* Current Age */}
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label="Current Age"
            type="number"
            name="ageNow"
            value={clientData.ageNow === null ? '' : clientData.ageNow}
            onChange={onInputChange('ageNow')}
          />
          {!validationErrors.ageNow.isValid && (
            <Typography color="error" variant="body2">
              {validationErrors.ageNow.reason}
            </Typography>
          )}
        </Grid>

        {/* Retirement Age */}
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label="Retirement Age"
            type="number"
            name="ageRetirement"
            value={clientData.ageRetirement === null ? '' : clientData.ageRetirement}
            onChange={onInputChange('ageRetirement')}
          />
          {!validationErrors.ageRetirement.isValid && (
            <Typography color="error" variant="body2">
              {validationErrors.ageRetirement.reason}
            </Typography>
          )}
        </Grid>

        {/* Expected Age of Death */}
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label="Expected Age of Death"
            type="number"
            name="ageDeath"
            value={clientData.ageDeath === null ? '' : clientData.ageDeath}
            onChange={onInputChange('ageDeath')}
          />
          {!validationErrors.ageDeath.isValid && (
            <Typography color="error" variant="body2">
              {validationErrors.ageDeath.reason}
            </Typography>
          )}
        </Grid>

        {/* Initial Capital */}
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label="Initial Capital ($)"
            type="number"
            name="c0"
            value={clientData.c0}
            onChange={onInputChange('c0')}
          />
        </Grid>

        {/* Monthly Savings */}
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label="Monthly Savings ($)"
            type="number"
            name="p"
            value={clientData.p}
            onChange={onInputChange('p')}
          />
        </Grid>

        {/* Annual Return Rate */}
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label="Annual Return Rate (%)"
            type="number"
            name="r"
            value={clientData.r === null ? '' : Math.round(clientData.r * 100)}
            onChange={(e) => {
              const inputValue = e.target.value;
              const numericValue = inputValue === '' ? null : parseFloat(inputValue) / 100;
              onInputChange('r')({ ...e, target: { ...e.target, value: numericValue } });
            }}
          />
        </Grid>

        {/* Annual Growth Rate of Savings */}
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label="Annual Growth Rate of Savings (%)"
            type="number"
            name="g"
            value={clientData.g === null ? '' : Math.round(clientData.g * 100)}
            onChange={(e) => {
              const inputValue = e.target.value;
              const numericValue = inputValue === '' ? null : parseFloat(inputValue) / 100;
              onInputChange('g')({ ...e, target: { ...e.target, value: numericValue } });
            }}
          />
        </Grid>

        {/* Annual Inflation Rate */}
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label="Annual Inflation Rate (%)"
            type="number"
            name="i"
            value={clientData.i === null ? '' : Math.round(clientData.i * 100)}
            onChange={(e) => {
              const inputValue = e.target.value;
              const numericValue = inputValue === '' ? null : parseFloat(inputValue) / 100;
              onInputChange('i')({ ...e, target: { ...e.target, value: numericValue } });
            }}
          />
        </Grid>
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