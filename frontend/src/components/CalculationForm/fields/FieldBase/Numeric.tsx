import React from 'react';
import { TextField, styled } from '@mui/material';

interface NumericFieldBaseProps {
  label: string;
  name: string;
  value: number | null;
  onChange: (value: number | null) => void;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  inputProps?: {
    min?: number;
    max?: number;
    step?: number;
  };
}

// Create the styled component
const NumericFieldBase = styled(TextField)<NumericFieldBaseProps>({
  backgroundColor: 'white',
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#01beb5',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#008f89',
    },
  },
});

const NumericFieldBaseComponent: React.FC<NumericFieldBaseProps> = ({
  label,
  name,
  value,
  onChange,
  fullWidth,
  error,
  helperText,
  inputProps,
}) => {
  return (
    <NumericFieldBase
      fullWidth={fullWidth}
      label={label}
      type="number"
      name={name}
      value={value === null ? '' : value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numericValue = inputValue === '' ? null : parseFloat(inputValue);
        onChange(numericValue);
      }}
      error={error}
      helperText={helperText}
      inputProps={inputProps}
    />
  );
};

export default NumericFieldBaseComponent;