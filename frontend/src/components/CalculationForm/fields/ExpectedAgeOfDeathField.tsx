import React from 'react';
import { Grid, Typography } from '@mui/material';
import TextFieldBase from './TextFieldBase/TextFieldBase';
import { ClientData } from '../../../types';
import { useTranslation } from 'react-i18next';

interface ExpectedAgeOfDeathFieldProps {
  clientData: ClientData;
  onInputChange: (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrors: Record<string, { isValid: boolean; reason: string }>;
}

const ExpectedAgeOfDeathField: React.FC<ExpectedAgeOfDeathFieldProps> = ({
  clientData,
  onInputChange,
  validationErrors,
}) => {
  const { t } = useTranslation();
  return (
    <Grid item xs={12} sm={6}>
      <TextFieldBase
        fullWidth
        label={t('expected_age_of_death')}
        type="number"
        name="ageDeath"
        value={clientData.ageDeath ?? ''}
        onChange={onInputChange('ageDeath')}
      />
      {!validationErrors.ageDeath.isValid && (
        <Typography color="error" variant="body2">
          {validationErrors.ageDeath.reason}
        </Typography>
      )}
    </Grid>
  );
};

export default ExpectedAgeOfDeathField;