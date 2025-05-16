import React from 'react';
import { Grid } from '@mui/material';
import TextFieldBase from './TextFieldBase/TextFieldBase';
import { ClientData } from '../../../types';

interface AnnualInflationRateFieldProps {
  clientData: ClientData;
  onInputChange: (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AnnualInflationRateField: React.FC<AnnualInflationRateFieldProps> = ({ clientData, onInputChange }) => {
  return (
    <Grid item xs={12} sm={6}>
      <TextFieldBase
        fullWidth
        label="Annual Inflation Rate (%)"
        type="number"
        name="i"
        value={clientData.i === null ? '' : Math.round(clientData.i * 100)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onInputChange('i')(e);
        }}
      />
    </Grid>
  );
};

export default AnnualInflationRateField;