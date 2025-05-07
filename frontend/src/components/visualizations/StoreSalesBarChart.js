import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Typography, Paper } from '@mui/material';

// Using sample data similar to what's in the eda.py script
const storeData = [
  { Store: 1, Weekly_Sales: 8963524 },
  { Store: 2, Weekly_Sales: 7548963 },
  { Store: 3, Weekly_Sales: 9784512 },
  { Store: 4, Weekly_Sales: 5689741 },
  { Store: 5, Weekly_Sales: 6321478 },
  { Store: 6, Weekly_Sales: 8964752 },
  { Store: 7, Weekly_Sales: 7458963 },
  { Store: 8, Weekly_Sales: 5698741 },
  { Store: 9, Weekly_Sales: 6987451 },
  { Store: 10, Weekly_Sales: 8745632 }
];

const StoreSalesBarChart = () => {
  // Format the sales values for better readability in tooltips
  const formatSales = (value) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Total Weekly Sales by Store
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={storeData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Store" />
          <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
          <Tooltip formatter={(value) => formatSales(value)} />
          <Legend />
          <Bar dataKey="Weekly_Sales" fill="#1976d2" name="Weekly Sales" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default StoreSalesBarChart; 