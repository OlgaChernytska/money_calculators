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
    <FormControl variant="outlined" size="small">
      <Select
        value={i18n.language}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Select language' }}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="ua">Українська</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;