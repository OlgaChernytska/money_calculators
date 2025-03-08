import React from 'react';
import { Grid } from '@mui/material';
import TextFieldBase from './TextFieldBase/TextFieldBase';
import { ClientData } from '../../../types';

interface InitialCapitalFieldProps {
  clientData: ClientData;
  onInputChange: (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InitialCapitalField: React.FC<InitialCapitalFieldProps> = ({ clientData, onInputChange }) => {
  return (
    <Grid item xs={12} sm={6}>
      <TextFieldBase
        fullWidth
        label="Initial Capital ($)"
        type="number"
        name="c0"
        value={clientData.c0}
        onChange={onInputChange('c0')}
      />
    </Grid>
  );
};

export default InitialCapitalField;