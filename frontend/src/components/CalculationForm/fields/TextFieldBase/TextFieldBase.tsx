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

const TextFieldBase: React.FC<TextFieldBaseProps> = (props) => {
  const { type, onChange, ...rest } = props;

  // Custom onChange to prevent negative values for number fields
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const value = event.target.value;
      // Allow empty string for controlled input
      if (value === '' || Number(value) >= 0) {
        onChange(event);
      } else {
        // If negative, set to zero
        const newEvent = {
          ...event,
          target: {
            ...event.target,
            value: '0',
          } as HTMLInputElement,
        };
        onChange(newEvent);
      }
    } else {
      onChange(event);
    }
  };

  return (
    <StyledTextFieldBase
      {...rest}
      type={type}
      onChange={handleChange}
      inputProps={{ min: 0, ...(rest.inputProps || {}) }}
    />
  );
};

// Create the styled component
const StyledTextFieldBase = styled(TextField)<TextFieldBaseProps>({
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