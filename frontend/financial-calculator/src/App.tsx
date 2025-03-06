import React, { useState } from 'react';
import {
  Button,
  Container,
  TextField,
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

  // Handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setClientData({
      ...clientData,
      [name]: parseFloat(value),
    });
  };

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
                  <TextField
                    fullWidth
                    label="Current Age"
                    type="number"
                    name="ageNow"
                    value={clientData.ageNow}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Retirement Age"
                    type="number"
                    name="ageRetirement"
                    value={clientData.ageRetirement}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expected Age of Death"
                    type="number"
                    name="ageDeath"
                    value={clientData.ageDeath}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Initial Capital ($)"
                    type="number"
                    name="c0"
                    value={clientData.c0}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Monthly Savings ($)"
                    type="number"
                    name="p"
                    value={clientData.p}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Annual Return Rate (%)"
                    type="number"
                    name="r"
                    value={clientData.r * 100}
                    onChange={(e) =>
                      setClientData({
                        ...clientData,
                        r: parseFloat(e.target.value) / 100,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Annual Growth Rate of Savings (%)"
                    type="number"
                    name="g"
                    value={clientData.g * 100}
                    onChange={(e) =>
                      setClientData({
                        ...clientData,
                        g: parseFloat(e.target.value) / 100,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Annual Inflation Rate (%)"
                    type="number"
                    name="i"
                    value={clientData.i * 100}
                    onChange={(e) =>
                      setClientData({
                        ...clientData,
                        i: parseFloat(e.target.value) / 100,
                      })
                    }
                  />
                </Grid>
              </Grid>
              <Box mt={3} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={handleCalculate} id="calculateButton">
                  Calculate
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
        {monthlyPassiveIncome !== null && (
          <Box mt={3} textAlign="center">
            <Typography variant="h6">
              Estimated Monthly Passive Income: <strong>${monthlyPassiveIncome.toFixed(2)}</strong>
            </Typography>
          </Box>
        )}
        {tableData.length > 0 && (
          <>
            <Box mt={3}>
              <Typography variant="h6" gutterBottom align="center">
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