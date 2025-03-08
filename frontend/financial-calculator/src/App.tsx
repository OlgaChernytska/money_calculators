import React, { useState } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CssBaseline,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import CustomTextField from "./CustomTextField"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the ClientData interface
export interface ClientData {
  ageNow: number;
  ageRetirement: number;
  ageDeath: number;
  c0: number;
  p: number;
  r: number;
  g: number;
  i: number;
}

// Define the table row interface
interface TableRowData {
  age: number;
  capitalYearStart: number;
  interest: number;
  saved: number;
  capitalYearEnd: number;
  savedPpMonthly: number;
}

// Calculate future value (FV)
const calculateFV = (c0: number, r: number, g: number, p: number, N: number): number => {
  return c0 * Math.pow(1 + r, N) + p * Array.from({ length: N }, (_, k) => Math.pow(1 + r, N - (k + 1)) * Math.pow(1 + g, k)).reduce((a, b) => a + b, 0);
};

// Calculate initial withdrawal amount (W1)
const calculateW1 = (c0: number, r: number, i: number, N: number): number => {
  return (c0 * Math.pow(1 + r, N)) / Array.from({ length: N }, (_, k) => Math.pow(1 + r, N - 1 - k) * Math.pow(1 + i, k)).reduce((a, b) => a + b, 0);
};

// Calculate monthly passive income
export const calculateMonthlyPassiveIncome = (client: ClientData): number => {
  const fv = calculateFV(client.c0, client.r, client.g, client.p * 12, client.ageRetirement - client.ageNow);
  const w1 = calculateW1(fv, client.r, client.i, client.ageDeath - client.ageRetirement + 1);
  const wPP = w1 / Math.pow(1 + client.i, client.ageRetirement - client.ageNow);
  return wPP / 12;
};

// Create capital lifecycle table
const createCapitalLifecycleTable = (client: ClientData): TableRowData[] => {
  const results: TableRowData[] = [];
  let capitalPrev = client.c0;

  // Accumulation phase
  for (let age = client.ageNow; age < client.ageRetirement; age++) {
    const capital = calculateFV(client.c0, client.r, client.g, client.p * 12, age - client.ageNow + 1);
    results.push({
      age,
      capitalYearStart: capitalPrev,
      interest: capitalPrev * client.r,
      saved: client.p * 12 * Math.pow(1 + client.g, age - client.ageNow),
      capitalYearEnd: capital,
      savedPpMonthly: (client.p * 12 * Math.pow(1 + client.g, age - client.ageNow)) / 12,
    });
    capitalPrev = capital;
  }

  // Distribution phase
  const fv = calculateFV(client.c0, client.r, client.g, client.p * 12, client.ageRetirement - client.ageNow);
  const w1 = calculateW1(fv, client.r, client.i, client.ageDeath - client.ageRetirement + 1);

  for (let age = client.ageRetirement; age <= client.ageDeath; age++) {
    const withdrawal = w1 * Math.pow(1 + client.i, age - client.ageRetirement);
    const capital = capitalPrev * (1 + client.r) - withdrawal;
    results.push({
      age,
      capitalYearStart: capitalPrev,
      interest: capitalPrev * client.r,
      saved: -withdrawal,
      capitalYearEnd: capital,
      savedPpMonthly: -withdrawal / 12,
    });
    capitalPrev = capital;
  }

  return results;
};

// Create a light theme
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
  // State for form inputs
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

  // State for result
  const [monthlyPassiveIncome, setMonthlyPassiveIncome] = useState<number | null>(null);

  // State for the table data
  const [tableData, setTableData] = useState<TableRowData[]>([]);

  // // Handle input changes
  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   setClientData({
  //     ...clientData,
  //     [name]: parseFloat(value),
  //   });
  // };

  // Handle calculation
  const handleCalculate = () => {
    const result = calculateMonthlyPassiveIncome(clientData);
    setMonthlyPassiveIncome(result);

    // Generate table data
    const table = createCapitalLifecycleTable(clientData);
    setTableData(table);
  };

  // Chart data
  const chartData = {
    labels: tableData.map((row) => row.age),
    datasets: [
      {
        label: 'Capital at End of Year ($)',
        data: tableData.map((row) => row.capitalYearEnd),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Capital Growth Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Age',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Capital at End of Year ($)',
        },
      },
    },
  };

    // State to track validation errors and reasons
    const [validationErrors, setValidationErrors] = useState({
      ageNow: { isValid: true, reason: "" },
      ageRetirement: { isValid: true, reason: "" },
      ageDeath: { isValid: true, reason: "" },
    });
  
    // Function to check interlinked validation rules and return a reason
    const checkValidationRules = (field, value) => {
      const { ageNow, ageRetirement, ageDeath } = clientData;
  
      switch (field) {
        case "ageNow":
          if (ageRetirement !== null && value >= ageRetirement) {
            return { isValid: false, reason: "Current Age must be less than Retirement Age" };
          }
          if (ageDeath !== null && value >= ageDeath) {
            return { isValid: false, reason: "Current Age must be less than Expected Age of Death" };
          }
          return { isValid: true, reason: "" };
        case "ageRetirement":
          if (ageNow !== null && value <= ageNow) {
            return { isValid: false, reason: "Retirement Age must be greater than Current Age" };
          }
          if (ageDeath !== null && value >= ageDeath) {
            return { isValid: false, reason: "Retirement Age must be less than Expected Age of Death" };
          }
          return { isValid: true, reason: "" };
        case "ageDeath":
          if (ageNow !== null && value <= ageNow) {
            return { isValid: false, reason: "Expected Age of Death must be greater than Current Age" };
          }
          if (ageRetirement !== null && value <= ageRetirement) {
            return { isValid: false, reason: "Expected Age of Death must be greater than Retirement Age" };
          }
          return { isValid: true, reason: "" };
        default:
          return { isValid: true, reason: "" };
      }
    };
  
    // Handle input change
    const handleInputChange = (field) => (e) => {
      const inputValue = e.target.value;
  
      // If the input is empty, set the value to null or 0
      if (inputValue === "") {
        setClientData({
          ...clientData,
          [field]: null, // or 0, depending on your use case
        });
        setValidationErrors((prev) => ({ ...prev, [field]: { isValid: true, reason: "" } })); // Clear validation error
      } else {
        const numericValue = parseFloat(inputValue);
  
        // Validate input: must be a whole number between 0 and 200
        if (
          !isNaN(numericValue) &&
          numericValue >= 0 &&
          numericValue <= 200 &&
          Number.isInteger(numericValue) // Ensure no decimals
        ) {
          // Check interlinked validation rules
          const validationResult = checkValidationRules(field, numericValue);
  
          setValidationErrors((prev) => ({ ...prev, [field]: validationResult })); // Set validation error and reason
          setClientData({
            ...clientData,
            [field]: numericValue, // Store as a number
          });
        }
      }
    };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box mt={4} mb={4} >
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Financial Calculator
          </Typography>
        </Box>
        <Card id="calculator">
          <CardContent>
            <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={3}>
  <Grid item xs={12} sm={6}>
    <CustomTextField
      fullWidth
      label="Current Age"
      type="number"
      name="ageNow"
      value={clientData.ageNow === null ? "" : clientData.ageNow} // Handle empty input
      onChange={(e) => {
        const inputValue = e.target.value;

        // If the input is empty, set the value to null or 0
        if (inputValue === "") {
          setClientData({
            ...clientData,
            ageNow: null, // or 0, depending on your use case
          });
        } else {
          const numericValue = parseFloat(inputValue);

          // Validate input: must be a whole number between 0 and 200
          if (
            !isNaN(numericValue) &&
            numericValue >= 0 &&
            numericValue <= 200 &&
            Number.isInteger(numericValue) // Ensure no decimals
          ) {
            // Check interlinked validation rules
            if (
              (clientData.ageRetirement === null || numericValue < clientData.ageRetirement) &&
              (clientData.ageDeath === null || numericValue < clientData.ageDeath)
            ) {
              setClientData({
                ...clientData,
                ageNow: numericValue, // Store as a number
              });
            }
          }
        }
      }}
      inputProps={{
        min: 0, // Minimum value
        max: 200, // Maximum value
        step: 1, // Allow only whole numbers
      }}
    />
  </Grid>

  <Grid item xs={12} sm={6}>
    <CustomTextField
      fullWidth
      label="Retirement Age"
      type="number"
      name="ageRetirement"
      value={clientData.ageRetirement === null ? "" : clientData.ageRetirement} // Handle empty input
      onChange={(e) => {
        const inputValue = e.target.value;

        // If the input is empty, set the value to null or 0
        if (inputValue === "") {
          setClientData({
            ...clientData,
            ageRetirement: null, // or 0, depending on your use case
          });
        } else {
          const numericValue = parseFloat(inputValue);

          // Validate input: must be a whole number between 0 and 200
          if (
            !isNaN(numericValue) &&
            numericValue >= 0 &&
            numericValue <= 200 &&
            Number.isInteger(numericValue) // Ensure no decimals
          ) {
            // Check interlinked validation rules
            if (
              (clientData.ageNow === null || numericValue > clientData.ageNow) &&
              (clientData.ageDeath === null || numericValue < clientData.ageDeath)
            ) {
              setClientData({
                ...clientData,
                ageRetirement: numericValue, // Store as a number
              });
            }
          }
        }
      }}
      inputProps={{
        min: 0, // Minimum value
        max: 200, // Maximum value
        step: 1, // Allow only whole numbers
      }}
    />
  </Grid>

  {/* Expected Age of Death */}
  <Grid item xs={12} sm={6}>
    <CustomTextField
      fullWidth
      label="Expected Age of Death"
      type="number"
      name="ageDeath"
      value={clientData.ageDeath === null ? "" : clientData.ageDeath} // Handle empty input
      onChange={(e) => {
        const inputValue = e.target.value;

        // If the input is empty, set the value to null or 0
        if (inputValue === "") {
          setClientData({
            ...clientData,
            ageDeath: null, // or 0, depending on your use case
          });
        } else {
          const numericValue = parseFloat(inputValue);

          // Validate input: must be a whole number between 0 and 200
          if (
            !isNaN(numericValue) &&
            numericValue >= 0 &&
            numericValue <= 200 &&
            Number.isInteger(numericValue) // Ensure no decimals
          ) {
            // Check interlinked validation rules
            if (
              (clientData.ageNow === null || numericValue > clientData.ageNow) &&
              (clientData.ageRetirement === null || numericValue > clientData.ageRetirement)
            ) {
              setClientData({
                ...clientData,
                ageDeath: numericValue, // Store as a number
              });
            }
          }
        }
      }}
      inputProps={{
        min: 0, // Minimum value
        max: 200, // Maximum value
        step: 1, // Allow only whole numbers
      }}
    />
  </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          label="Initial Capital ($)"
          type="number"
          name="c0"
          value={clientData.c0}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          label="Monthly Savings ($)"
          type="number"
          name="p"
          value={clientData.p}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
      <CustomTextField
  fullWidth
  label="Annual Return Rate (%)"
  type="number"
  name="r"
  value={clientData.r === null ? "" : Math.round(clientData.r * 100)} // Handle empty input
  onChange={(e) => {
    const inputValue = e.target.value;

    // If the input is empty, set the value to null or 0
    if (inputValue === "") {
      setClientData({
        ...clientData,
        r: null, // or 0, depending on your use case
      });
    } else {
      const numericValue = parseFloat(inputValue);

      // Validate input: must be a number between 0 and 100
      if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 200) {
        setClientData({
          ...clientData,
          r: numericValue / 100, // Convert back to decimal
        });
      }
    }
  }}
  inputProps={{
    min: 0, // Minimum value
    max: 200, // Maximum value
    step: 1, // Allow only whole numbers
  }}
/>
</Grid> 
<Grid item xs={12} sm={6}>
  <CustomTextField
    fullWidth
    label="Annual Growth Rate of Savings (%)"
    type="number"
    name="g"
    value={clientData.g === null ? "" : Math.round(clientData.g * 100)} // Handle empty input
    onChange={(e) => {
      const inputValue = e.target.value;

      // If the input is empty, set the value to null or 0
      if (inputValue === "") {
        setClientData({
          ...clientData,
          g: null, // or 0, depending on your use case
        });
      } else {
        const numericValue = parseFloat(inputValue);

        // Validate input: must be a number between 0 and 100
        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 200) {
          setClientData({
            ...clientData,
            g: numericValue / 100, // Convert back to decimal
          });
        }
      }
    }}
    inputProps={{
      min: 0, // Minimum value
      max: 200, // Maximum value
      step: 1, // Allow only whole numbers
    }}
  />
</Grid>
<Grid item xs={12} sm={6}>
  <CustomTextField
    fullWidth
    label="Annual Inflation Rate (%)"
    type="number"
    name="i"
    value={clientData.i === null ? "" : Math.round(clientData.i * 100)} // Handle empty input
    onChange={(e) => {
      const inputValue = e.target.value;

      // If the input is empty, set the value to null or 0
      if (inputValue === "") {
        setClientData({
          ...clientData,
          i: null, // or 0, depending on your use case
        });
      } else {
        const numericValue = parseFloat(inputValue);

        // Validate input: must be a number between 0 and 100
        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 200) {
          setClientData({
            ...clientData,
            i: numericValue / 100, // Convert back to decimal
          });
        }
      }
    }}
    inputProps={{
      min: 0, // Minimum value
      max: 200, // Maximum value
      step: 1, // Allow only whole numbers
    }}
  />
</Grid>
    </Grid>
              <Box mt={3} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={handleCalculate} id="calculateButton">
                  Calculate
                </Button>
              </Box>
              {monthlyPassiveIncome !== null && (
          <Box mt={3} textAlign="center" >
            <Typography variant="h6" id="income">
              Estimated Monthly Passive Income: <strong>${monthlyPassiveIncome.toFixed(2)}</strong>
            </Typography>
          </Box>
        )}
            </Box>
          </CardContent>
        </Card>
        {tableData.length > 0 && (
          <>
            <Box mt={3}>
              <Typography variant="h4" gutterBottom align="center">
                Capital Growth Over Time
              </Typography>
              <Bar data={chartData} options={chartOptions} />
            </Box>
            <Box mt={3} id="spoiler">
              <Accordion >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Detailed Info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Age</TableCell>
                          <TableCell align="right">Capital Start ($)</TableCell>
                          <TableCell align="right">Interest ($)</TableCell>
                          <TableCell align="right">Saved/Withdrawn ($)</TableCell>
                          <TableCell align="right">Capital End ($)</TableCell>
                          <TableCell align="right">Monthly Saved/Withdrawn ($)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableData.map((row) => (
                          <TableRow key={row.age}>
                            <TableCell>{row.age}</TableCell>
                            <TableCell align="right">{row.capitalYearStart.toFixed(2)}</TableCell>
                            <TableCell align="right">{row.interest.toFixed(2)}</TableCell>
                            <TableCell align="right">{row.saved.toFixed(2)}</TableCell>
                            <TableCell align="right">{row.capitalYearEnd.toFixed(2)}</TableCell>
                            <TableCell align="right">{row.savedPpMonthly.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;