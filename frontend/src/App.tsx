import React, { useState } from 'react';
import { Container, Box, Typography, CssBaseline, Card, CardContent } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CalculationForm from './components/CalculationForm/index';
import Chart from './components/Chart/index';
import CapitalLifecycleTable from './components/CapitalLifecycleTable/index';
import { ClientData, TableRowData } from './types';
import { calculateMonthlyPassiveIncome, createCapitalLifecycleTable } from './utils/calculation';
import { checkValidationRules } from './utils/validation';

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
  const [clientData, setClientData] = useState<ClientData>({
    ageNow: 32,
    ageRetirement: 40,
    ageDeath: 80,
    c0: 5000,
    p: 2000,
    r: 0.07,
    g: 0.02,
    i: 0.02,
  });
  const [monthlyPassiveIncome, setMonthlyPassiveIncome] = useState<number | null>(null);
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [validationErrors, setValidationErrors] = useState({
    ageNow: { isValid: true, reason: '' },
    ageRetirement: { isValid: true, reason: '' },
    ageDeath: { isValid: true, reason: '' },
  });

  // Handle input changes
  const handleInputChange = (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue === '' ? null : parseFloat(inputValue);
  
    // Check validation rules only if numericValue is not null
    if (numericValue !== null) {
      const validationResult = checkValidationRules(field, numericValue, clientData);
      setValidationErrors((prev) => ({ ...prev, [field]: validationResult }));
    }
  
    // Update client data
    setClientData((prev) => ({ ...prev, [field]: numericValue }));
  };

  // Handle calculation
  const handleCalculate = () => {
    try {
      // Validate inputs
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
  
      // Calculate monthly passive income
      const result = calculateMonthlyPassiveIncome(clientData);
      setMonthlyPassiveIncome(result);
  
      // Generate table data
      const table = createCapitalLifecycleTable(clientData);
      setTableData(table);
    } catch (error) {
      console.error('Calculation error:', error);
      // Optionally, set an error state and display a message to the user
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box mt={4} mb={4}>
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Financial Calculator
          </Typography>
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
                  Estimated Monthly Passive Income: <strong>${monthlyPassiveIncome.toFixed(2)}</strong>
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
        {tableData.length > 0 && (
          <>
            <Box mt={3}>
              <Typography variant="h4" gutterBottom align="center">
                Capital Growth Over Time
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