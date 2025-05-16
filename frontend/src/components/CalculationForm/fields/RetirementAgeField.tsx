import React from 'react';
import { Grid, Typography } from '@mui/material';
import CustomTextField from './TextFieldBase/TextFieldBase';
import { ClientData } from '../../../types';

interface RetirementAgeFieldProps {
  clientData: ClientData;
  onInputChange: (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrors: Record<string, { isValid: boolean; reason: string }>;
}

const RetirementAgeField: React.FC<RetirementAgeFieldProps> = ({
  clientData,
  onInputChange,
  validationErrors,
}) => {
  return (
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
  );
};

export default RetirementAgeField;