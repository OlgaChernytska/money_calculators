import React from 'react';
import { Grid } from '@mui/material';
import { ClientData } from '../../../types';
import TextFieldBase from './TextFieldBase/TextFieldBase';

interface AnnualReturnRateFieldProps {
  clientData: ClientData;
  onInputChange: (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AnnualReturnRateField: React.FC<AnnualReturnRateFieldProps> = ({ clientData, onInputChange }) => {
  return (
    <Grid item xs={12} sm={6}>
      <TextFieldBase
        fullWidth
        label="Annual Return Rate (%)"
        type="number"
        name="r"
        value={clientData.r === null ? '' : Math.round(clientData.r * 100)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onInputChange('r')(e); 
        }}
      />
    </Grid>
  );
};

export default AnnualReturnRateField;