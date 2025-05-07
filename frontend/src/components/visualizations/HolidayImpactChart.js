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

// Sample data based on Holiday_Flag impact
const holidayData = [
  { holiday: 'Non-Holiday (0)', sales: 1520000, fill: '#82ca9d' },
  { holiday: 'Holiday (1)', sales: 1830000, fill: '#8884d8' }
];

const HolidayImpactChart = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Impact of Holidays on Weekly Sales
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={holidayData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="holiday" />
          <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="sales" name="Average Weekly Sales" fill={(data) => data.fill} />
        </BarChart>
      </ResponsiveContainer>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        This chart shows how holidays impact the weekly sales. 
        Holidays tend to increase sales by approximately 20%.
      </Typography>
    </Paper>
  );
};

export default HolidayImpactChart; 