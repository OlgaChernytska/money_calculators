import React from 'react';
import { Grid, Typography } from '@mui/material';
import CustomTextField from './TextFieldBase/TextFieldBase';
import { ClientData } from '../../../types';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (    
    <Grid item xs={12} sm={6}>
      <CustomTextField
        fullWidth
        label={t('retirement_age')}
        type="number"
        name="ageRetirement"
        value={clientData.ageRetirement ?? ''}
        onChange={onInputChange('ageRetirement')}
        inputProps={{ max: 99 }}
      />
      {!validationErrors.ageRetirement.isValid && clientData.ageRetirement !== null && (
        <Typography color="error" variant="body2">
          {validationErrors.ageRetirement.reason}
        </Typography>
      )}
    </Grid>
  );
};

export default RetirementAgeField;