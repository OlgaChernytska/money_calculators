import React from 'react';
import { TextField, styled } from '@mui/material';

interface TextFieldBaseProps {
  label: string;
  type?: string;
  name: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
const TextFieldBase = styled(TextField)<TextFieldBaseProps>({
  backgroundColor: 'white', // Set background color
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#01beb5', // Custom border color on focus
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#008f89', // Custom label color on focus
    },
  },
});

export default TextFieldBase;