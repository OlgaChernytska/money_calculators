import React, { useState } from 'react';
import { Container, Box, Typography, CssBaseline, Card, CardContent } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CalculationForm from './components/CalculationForm/CalculationForm';
import Chart from './components/Chart/index';
import CapitalLifecycleTable from './components/CapitalLifecycleTable/index';
import { ClientData, TableRowData } from './types';
import { calculateMonthlyPassiveIncome } from './components/CalculationForm/calculateMonthlyPassiveIncome';
import { createCapitalLifecycleTable } from './components/CapitalLifecycleTable/createCapitalLifecycleTable';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/i118/switcher';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ffffff',
    },
    background: {
      default: '#035d59',
    },
  },
});

const App: React.FC = () => {
  const { t } = useTranslation();
  const [clientData, setClientData] = useState<ClientData>({
    ageNow: 30,
    ageRetirement: 60,
    ageDeath: 85,
    c0: 0,
    p: 200,
    r: 0.07,
    g: 0.02,
    i: 0.02,
  });
  const [monthlyPassiveIncome, setMonthlyPassiveIncome] = useState<number | null>(null);
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [validationErrors] = useState({
    ageNow: { isValid: true, reason: '' },
    ageRetirement: { isValid: true, reason: '' },
    ageDeath: { isValid: true, reason: '' },
  });

  const handleInputChange = (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue === '' ? null : parseFloat(inputValue);
    setClientData((prev) => ({ ...prev, [field]: numericValue }));
  };

  const handleCalculate = () => {
    try {
      if (
        clientData.ageNow === null ||
        clientData.ageRetirement === null ||
        clientData.ageDeath === null ||
        clientData.c0 === null ||
        clientData.p === null ||
        clientData.r === null ||
        clientData.g === null ||
        clientData.i === null
      ) {
        throw new Error('All fields are required.');
      }

      const result = calculateMonthlyPassiveIncome(clientData);
      setMonthlyPassiveIncome(result);

      const table = createCapitalLifecycleTable(clientData);
      setTableData(table);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box mt={4} mb={4} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" gutterBottom align="center" color="primary">
            {t('financial_calculator')}
            <span style={{ color: "#99d9d9", fontStyle: 'italic', marginLeft: 12, fontFamily: "'Better Grade', cursive", fontSize: '3rem' }}>
              <a
                href="https://www.instagram.com/eat.love.write/"
                target="_blank"
                rel="noopener noreferrer"
                title="Made by Olha Chernytska"
                style={{ color: 'inherit' }}
              >
                Made by Olha Chernytska
              </a>
            </span>
          </Typography>
          <LanguageSwitcher />
        </Box>
        <Card id="calculator">
          <CardContent>
            <CalculationForm
              clientData={clientData}
              onInputChange={handleInputChange}
              onCalculate={handleCalculate}
              validationErrors={validationErrors}
            />
            {monthlyPassiveIncome !== null && (
              <Box mt={3} textAlign="center">
                <Typography variant="h6" id="income">
                  {t('estimated_monthly_passive_income')}: <strong>${monthlyPassiveIncome.toFixed(2)}</strong>
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
        {tableData.length > 0 && (
          <>
            <Box mt={3}>
              <Typography variant="h4" gutterBottom align="center">
                {t('capital_growth_over_time')}
              </Typography>
              <Chart tableData={tableData} />
            </Box>
            <Box mt={3} id="spoiler">
              <CapitalLifecycleTable tableData={tableData} />
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;