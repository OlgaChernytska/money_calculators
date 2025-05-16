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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  tableData: TableRowData[];
}

const Chart: React.FC<ChartProps> = ({ tableData }) => {
  try {
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

    return <Bar data={chartData} options={chartOptions} />;
  } catch (error) {
    console.error('Chart rendering error:', error);
    return <Typography color="error">Failed to render chart.</Typography>;
  }
};

export default Chart;