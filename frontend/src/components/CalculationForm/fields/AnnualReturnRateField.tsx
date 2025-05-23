import React from 'react';
import { Grid } from '@mui/material';
import TextFieldBase from './TextFieldBase/TextFieldBase';
import { ClientData } from '../../../types';
import { useTranslation } from 'react-i18next';

interface AnnualReturnRateFieldProps {
  clientData: ClientData;
  onInputChange: (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AnnualReturnRateField: React.FC<AnnualReturnRateFieldProps> = ({ clientData, onInputChange }) => {
  const { t } = useTranslation();
  return (
    <Grid item xs={12} sm={6}>
      <TextFieldBase
        fullWidth
        label={t('annual_return_rate')}
        type="number"
        name="r"
        inputProps={{ max: 50 }}
        value={clientData.r === null ? '' : Math.round(clientData.r * 100)}
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
          onInputChange('r')(newEvent);
        }}
      />
    </Grid>
  );
};

export default AnnualReturnRateField;