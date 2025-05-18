import React from 'react';
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
import { TableRowData } from '../../types';
import {  Typography } from '@mui/material';
import './style.css';
import { useTranslation } from 'react-i18next';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  tableData: TableRowData[];
}

const Chart: React.FC<ChartProps> = ({ tableData }) => {
  const { t } = useTranslation();
  try {
    const chartData = {
      labels: tableData.map((row) => row.age),
      datasets: [
        {
          label: t('capital_at_end_of_year'),
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
          text: t('capital_growth_over_time'),
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: t('age'),
          },
        },
        y: {
          title: {
            display: true,
            text: t('capital_at_end_of_year'),
          },
        },
      },
    };

    return <Bar data={chartData} options={chartOptions} />;
  } catch (error) {
    console.error('Chart rendering error:', error);
    return <Typography color="error">{t('chart_render_error')}</Typography>;
  }
};

export default Chart;