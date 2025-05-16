import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TableRowData } from '../../types';

interface TableProps {
  tableData: TableRowData[];
}

const CapitalLifecycleTable: React.FC<TableProps> = ({ tableData }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Detailed Info</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table> {/* This is the MUI Table component */}
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
  );
};

export default CapitalLifecycleTable;
