import React from 'react';
import { MenuItem, Select, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

const handleChange = (event: SelectChangeEvent<string>) => {
  const selectedLanguage = event.target.value;
  void i18n.changeLanguage(selectedLanguage);
};

  return (
    <FormControl variant="outlined" size="small" sx={{ color: '#99d9d9', borderColor: '#99d9d9' }}>
      <Select
        value={i18n.language}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Select language' }}
        sx={{
          color: '#99d9d9',
          '.MuiOutlinedInput-notchedOutline': { borderColor: '#99d9d9' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#99d9d9' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#99d9d9' },
          '.MuiSelect-icon': { color: '#99d9d9' },
          minWidth: '60px',
        }}
      >
        <MenuItem value="en">EN</MenuItem>
        <MenuItem value="ua">UA</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;