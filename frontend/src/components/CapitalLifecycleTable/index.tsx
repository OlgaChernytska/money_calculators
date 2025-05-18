import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TableRowData } from '../../types';
import { useTranslation } from 'react-i18next';

interface TableProps {
  tableData: TableRowData[];
}

const CapitalLifecycleTable: React.FC<TableProps> = ({ tableData }) => {
  const { t } = useTranslation();
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{t('detailed_info')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table> {/* This is the MUI Table component */}
            <TableHead>
              <TableRow>
                <TableCell>{t('age')}</TableCell>
                <TableCell align="right">{t('capital_start')}</TableCell>
                <TableCell align="right">{t('interest')}</TableCell>
                <TableCell align="right">{t('saved_withdrawn')}</TableCell>
                <TableCell align="right">{t('capital_end')}</TableCell>
                <TableCell align="right">{t('monthly_saved_withdrawn')}</TableCell>
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
