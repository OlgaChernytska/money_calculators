import React from 'react';
import { Grid } from '@mui/material';
import TextFieldBase from './TextFieldBase/TextFieldBase';
import { ClientData } from '../../../types';
import { useTranslation } from 'react-i18next';

interface InitialCapitalFieldProps {
  clientData: ClientData;
  onInputChange: (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InitialCapitalField: React.FC<InitialCapitalFieldProps> = ({ clientData, onInputChange }) => {
  const { t } = useTranslation();
  return (
    <Grid item xs={12} sm={6}>
      <TextFieldBase
        fullWidth
        label={t('initial_capital')}
        type="number"
        name="c0"
        inputProps={{ max: 1000000 }}
        value={clientData.c0}
        onChange={onInputChange('c0')}
      />
    </Grid>
  );
};

export default InitialCapitalField;