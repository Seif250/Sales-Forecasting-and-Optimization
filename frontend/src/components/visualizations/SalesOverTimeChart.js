import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Typography, Paper } from '@mui/material';

// Sample time series data
const timeSeriesData = [
  { date: 'Jan 2010', sales: 1520000 },
  { date: 'Feb 2010', sales: 1620000 },
  { date: 'Mar 2010', sales: 1720000 },
  { date: 'Apr 2010', sales: 1680000 },
  { date: 'May 2010', sales: 1580000 },
  { date: 'Jun 2010', sales: 1670000 },
  { date: 'Jul 2010', sales: 1700000 },
  { date: 'Aug 2010', sales: 1750000 },
  { date: 'Sep 2010', sales: 1810000 },
  { date: 'Oct 2010', sales: 1890000 },
  { date: 'Nov 2010', sales: 1950000 },
  { date: 'Dec 2010', sales: 2230000 },
  { date: 'Jan 2011', sales: 1780000 },
  { date: 'Feb 2011', sales: 1650000 },
  { date: 'Mar 2011', sales: 1820000 }
];

const SalesOverTimeChart = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Weekly Sales Over Time
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={timeSeriesData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name="Weekly Sales"
          />
        </LineChart>
      </ResponsiveContainer>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Sales show seasonality with peaks during holiday periods (November-December) 
        and more stable patterns during other months.
      </Typography>
    </Paper>
  );
};

export default SalesOverTimeChart; 