import React from 'react';
import { Grid } from '@mui/material';
import TextFieldBase from './TextFieldBase/TextFieldBase';
import { ClientData } from '../../../types';
import { useTranslation } from 'react-i18next';

interface MonthlySavingsFieldProps {
  clientData: ClientData;
  onInputChange: (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MonthlySavingsField: React.FC<MonthlySavingsFieldProps> = ({ clientData, onInputChange }) => {
  const { t } = useTranslation();
  return (
    <Grid item xs={12} sm={6}>
      <TextFieldBase
        fullWidth
        label={t('monthly_savings')}
        type="number"
        name="p"
        value={clientData.p}
        onChange={onInputChange('p')}
      />
    </Grid>
  );
};

export default MonthlySavingsField;