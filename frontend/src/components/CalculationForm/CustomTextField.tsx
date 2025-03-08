import { TextField, styled } from '@mui/material';
import React from 'react';

// Define the type for props (if needed)
interface CustomTextFieldProps {
  label: string;
  type?: string;
  name: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
}

// Create the styled component
const CustomTextField = styled(TextField)<CustomTextFieldProps>({
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

export default CustomTextField;