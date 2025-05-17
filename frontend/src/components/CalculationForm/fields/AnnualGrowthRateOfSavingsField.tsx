import React from 'react';
import { Grid } from '@mui/material';
import TextFieldBase from './TextFieldBase/TextFieldBase';
import { ClientData } from '../../../types';

interface AnnualGrowthRateOfSavingsFieldProps {
  clientData: ClientData;
  onInputChange: (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AnnualGrowthRateOfSavingsField: React.FC<AnnualGrowthRateOfSavingsFieldProps> = ({
  clientData,
  onInputChange,
}) => {
  return (
    <Grid item xs={12} sm={6}>
      <TextFieldBase
        fullWidth
        label="Annual Growth Rate of Savings (%)"
        type="number"
        name="g"
        value={clientData.g === null ? '' : Math.round(clientData.g * 100)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          const numericValue = inputValue === '' ? null : parseFloat(inputValue) / 100;
          const newEvent = {
            ...e,
            target: {
              ...e.target,
              value: numericValue === null ? '' : numericValue.toString(),
            } as HTMLInputElement,
          };
          onInputChange('g')(newEvent);
        }}
      />
    </Grid>
  );
};

export default AnnualGrowthRateOfSavingsField;