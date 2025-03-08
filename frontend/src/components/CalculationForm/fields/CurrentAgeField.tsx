import React from 'react';
import { Grid, Typography } from '@mui/material';
import TextFieldBase from './TextFieldBase/TextFieldBase';
import { ClientData } from '../../../types';

interface CurrentAgeFieldProps {
  clientData: ClientData;
  onInputChange: (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrors: Record<string, { isValid: boolean; reason: string }>;
}

const CurrentAgeField: React.FC<CurrentAgeFieldProps> = ({
  clientData,
  onInputChange,
  validationErrors,
}) => {
  return (
    <Grid item xs={12} sm={6}>
      <TextFieldBase
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
  );
};

export default CurrentAgeField;