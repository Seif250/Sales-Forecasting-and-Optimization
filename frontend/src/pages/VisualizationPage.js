import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import ModernCard from '../components/ModernCard';
import ModernButton from '../components/ModernButton';
import HolidayImpactChart from '../components/visualizations/HolidayImpactChart';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = 'http://localhost:8000';

const VisualizationPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [department, setDepartment] = useState('all');
  const [timeRange, setTimeRange] = useState('year');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null);
  const [storeOptions, setStoreOptions] = useState([]);
  const [selectedStore, setSelectedStore] = useState('all');

  useEffect(() => {
    // Load the Walmart.csv file automatically
    loadWalmartData();
  }, []);

  const loadWalmartData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch the Walmart.csv file
      let response;
      let text;
      
      try {
        // First attempt using relative path
        response = await fetch('/data/Walmart.csv');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Walmart.csv: ${response.status}`);
        }
        
        text = await response.text();
        console.log("CSV loaded from relative path, length:", text.length);
      } catch (fetchError) {
        console.warn("Failed to load CSV from relative path:", fetchError);
        
        // Fallback to absolute path
        try {
          response = await fetch('http://localhost:3000/data/Walmart.csv');
          
          if (!response.ok) {
            throw new Error(`Failed to fetch from absolute path: ${response.status}`);
          }
          
          text = await response.text();
          console.log("CSV loaded from absolute path, length:", text.length);
        } catch (absoluteError) {
          console.warn("Failed to load CSV from absolute path:", absoluteError);
          
          // Fallback to hardcoded sample data for demonstration
          text = "Store,Date,Weekly_Sales,Holiday_Flag,Temperature,Fuel_Price,CPI,Unemployment\n" +
                 "1,05-02-2010,1643690.9,0,42.31,2.572,211.0963582,8.106\n" +
                 "1,12-02-2010,1641957.44,1,38.51,2.548,211.2421698,8.106\n" +
                 "1,19-02-2010,1611968.17,0,39.93,2.514,211.2891429,8.106\n" +
                 "1,26-02-2010,1409727.59,0,46.63,2.561,211.3196429,8.106\n" +
                 "1,05-03-2010,1554806.68,0,46.5,2.625,211.3501429,8.106";
          
          console.log("Using sample data as fallback");
        }
      }
      
      if (!text || text.length === 0) {
        throw new Error("Failed to load CSV data");
      }
      
      // Parse the CSV
      const rows = text.split('\n');
      console.log("CSV headers:", rows[0]);
      console.log("Total rows:", rows.length);
      
      const headers = rows[0].split(',');
      const dataRows = rows.slice(1).filter(row => row.trim()).map(row => row.split(','));
      console.log("Processed rows:", dataRows.length);
      
      // Extract unique store IDs for the dropdown
      const stores = [...new Set(dataRows.map(row => row[0]))].sort((a, b) => parseInt(a) - parseInt(b));
      setStoreOptions(stores);
      
      setCsvData({ headers, rows: dataRows });
      
      // Process the data for visualizations
      processData(headers, dataRows);
    } catch (error) {
      console.error("Error loading Walmart data:", error);
      setError("Failed to load Walmart data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const processData = (headers, dataRows) => {
    if (!headers || !dataRows || dataRows.length === 0) {
      console.error("Invalid data for processing", { headers, rowCount: dataRows?.length });
      return;
    }
    
    console.log("Processing data with headers:", headers);
    console.log("First row sample:", dataRows[0]);
    
    // Create visualization data from the CSV
    const temperatureImpact = processTemperatureData(headers, dataRows);
    const economicFactors = processEconomicData(headers, dataRows);
    const storePerformance = processStorePerformance(headers, dataRows);
    const holidayImpact = processHolidayImpact(headers, dataRows);
    const weeklySalesTrends = processWeeklySalesTrends(headers, dataRows);
    
    console.log("Processed data results:", {
      temperatureImpact: !!temperatureImpact,
      economicFactors: !!economicFactors,
      storePerformance: storePerformance?.length,
      holidayImpact: !!holidayImpact,
      weeklySalesTrends: !!weeklySalesTrends
    });
    
    const visualizations = {
      temperatureImpact,
      economicFactors,
      storePerformance,
      holidayImpact,
      weeklySalesTrends,
    };
    
    setVisualizationData(visualizations);
  };
  
  const processTemperatureData = (headers, dataRows) => {
    const tempIndex = headers.indexOf('Temperature');
    const salesIndex = headers.indexOf('Weekly_Sales');
    
    if (tempIndex === -1 || salesIndex === -1) return null;
    
    const temperatures = [];
    const sales = [];
    
    // Get a sample of the data (max 100 points for readability)
    const sampleSize = Math.min(100, dataRows.length);
    const step = Math.floor(dataRows.length / sampleSize);
    
    for (let i = 0; i < dataRows.length; i += step) {
      const row = dataRows[i];
      if (row[tempIndex] && row[salesIndex]) {
        temperatures.push(parseFloat(row[tempIndex]));
        sales.push(parseFloat(row[salesIndex]));
      }
      
      if (temperatures.length >= sampleSize) break;
    }
    
    return { temperatures, sales };
  };
  
  const processEconomicData = (headers, dataRows) => {
    // Directly log the headers to see what we have
    console.log("Economic data processing with headers:", headers);
    
    const cpiIndex = headers.indexOf('CPI');
    const unemIndex = headers.indexOf('Unemployment');
    const fuelIndex = headers.indexOf('Fuel_Price');
    const dateIndex = headers.indexOf('Date');
    
    console.log("Column indexes:", { cpiIndex, unemIndex, fuelIndex, dateIndex });
    
    if (cpiIndex === -1 || unemIndex === -1 || fuelIndex === -1 || dateIndex === -1) {
      console.error("Required columns not found in CSV headers");
      return null;
    }
    
    try {
      const cpi = [];
      const unemployment = [];
      const fuelPrice = [];
      const dates = [];
      
      // Get a sample of the data (max 50 points for readability)
      const sampleSize = Math.min(50, dataRows.length);
      const step = Math.max(1, Math.floor(dataRows.length / sampleSize));
      
      let processedRows = 0;
      let skippedRows = 0;
      
      for (let i = 0; i < dataRows.length; i += step) {
        const row = dataRows[i];
        
        if (!row || row.length <= Math.max(cpiIndex, unemIndex, fuelIndex, dateIndex)) {
          skippedRows++;
          continue;
        }
        
        const cpiValue = parseFloat(row[cpiIndex]);
        const unemValue = parseFloat(row[unemIndex]);
        const fuelValue = parseFloat(row[fuelIndex]);
        const date = row[dateIndex];
        
        if (isNaN(cpiValue) || isNaN(unemValue) || isNaN(fuelValue) || !date) {
          skippedRows++;
          continue;
        }
        
        cpi.push(cpiValue);
        unemployment.push(unemValue);
        fuelPrice.push(fuelValue);
        dates.push(date);
        processedRows++;
        
        if (cpi.length >= sampleSize) break;
      }
      
      console.log(`Economic data processed: ${processedRows} rows used, ${skippedRows} rows skipped`);
      
      // Only return data if we have at least some points
      if (dates.length > 0) {
        const result = { cpi, unemployment, fuelPrice, dates };
        console.log("Economic data sample:", {
          cpi: cpi.slice(0, 3),
          unemployment: unemployment.slice(0, 3),
          fuelPrice: fuelPrice.slice(0, 3),
          dates: dates.slice(0, 3),
          totalPoints: dates.length
        });
        return result;
      }
      
      console.error("No valid economic data points found");
      return null;
    } catch (err) {
      console.error("Error processing economic data:", err);
      return null;
    }
  };
  
  const processStorePerformance = (headers, dataRows) => {
    const storeIndex = headers.indexOf('Store');
    const salesIndex = headers.indexOf('Weekly_Sales');
    
    if (storeIndex === -1 || salesIndex === -1) return [];
    
    // Group by store
    const storeMap = {};
    
    dataRows.forEach(row => {
      const store = row[storeIndex];
      const sales = parseFloat(row[salesIndex]);
      
      if (!isNaN(sales)) {
        if (!storeMap[store]) {
          storeMap[store] = {
            total: 0,
            count: 0
          };
        }
        
        storeMap[store].total += sales;
        storeMap[store].count++;
      }
    });
    
    // Calculate average sales by store
    return Object.keys(storeMap).map(store => ({
      store,
      average_sales: storeMap[store].total / storeMap[store].count
    })).sort((a, b) => b.average_sales - a.average_sales);
  };
  
  const renderTopSellingStoresChart = () => {
    if (!visualizationData || !visualizationData.storePerformance || visualizationData.storePerformance.length === 0) return null;
    
    // Take top 10 stores
    const topStores = visualizationData.storePerformance.slice(0, 10);
    
    const data = {
      labels: topStores.map(item => `Store ${item.store}`),
      datasets: [
        {
          label: 'Average Weekly Sales',
          data: topStores.map(item => item.average_sales),
          backgroundColor: 'rgba(77, 105, 250, 0.7)',
          borderColor: 'rgb(77, 105, 250)',
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Top 10 Selling Stores',
        },
      },
    };
    
    return <Bar data={data} options={options} />;
  };
  
  const renderLeastSellingStoresChart = () => {
    if (!visualizationData || !visualizationData.storePerformance || visualizationData.storePerformance.length === 0) return null;
    
    // Take least 5 stores
    const leastStores = [...visualizationData.storePerformance].sort((a, b) => a.average_sales - b.average_sales).slice(0, 5);
    
    const data = {
      labels: leastStores.map(item => `Store ${item.store}`),
      datasets: [
        {
          label: 'Average Weekly Sales',
          data: leastStores.map(item => item.average_sales),
          backgroundColor: 'rgba(255, 110, 134, 0.7)',
          borderColor: 'rgb(255, 110, 134)',
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Least 5 Selling Stores',
        },
      },
    };
    
    return <Bar data={data} options={options} />;
  };
  
  const processHolidayImpact = (headers, dataRows) => {
    const holidayIndex = headers.indexOf('Holiday_Flag');
    const salesIndex = headers.indexOf('Weekly_Sales');
    
    if (holidayIndex === -1 || salesIndex === -1) return null;
    
    const holidaySales = [];
    const nonHolidaySales = [];
    
    dataRows.forEach(row => {
      const isHoliday = parseInt(row[holidayIndex]) === 1;
      const sales = parseFloat(row[salesIndex]);
      
      if (!isNaN(sales)) {
        if (isHoliday) {
          holidaySales.push(sales);
        } else {
          nonHolidaySales.push(sales);
        }
      }
    });
    
    const avgHolidaySales = holidaySales.reduce((sum, sales) => sum + sales, 0) / holidaySales.length;
    const avgNonHolidaySales = nonHolidaySales.reduce((sum, sales) => sum + sales, 0) / nonHolidaySales.length;
    
    return { avgHolidaySales, avgNonHolidaySales };
  };
  
  const processWeeklySalesTrends = (headers, dataRows) => {
    const dateIndex = headers.indexOf('Date');
    const salesIndex = headers.indexOf('Weekly_Sales');
    
    if (dateIndex === -1 || salesIndex === -1) return null;
    
    // Sort by date
    const sortedData = [...dataRows].sort((a, b) => {
      const dateA = new Date(a[dateIndex].split('-').reverse().join('-'));
      const dateB = new Date(b[dateIndex].split('-').reverse().join('-'));
      return dateA - dateB;
    });
    
    const dates = [];
    const sales = [];
    
    // Get a sample of the data (max 50 points for readability)
    const sampleSize = Math.min(50, sortedData.length);
    const step = Math.floor(sortedData.length / sampleSize);
    
    for (let i = 0; i < sortedData.length; i += step) {
      const row = sortedData[i];
      if (row[dateIndex] && row[salesIndex]) {
        dates.push(row[dateIndex]);
        sales.push(parseFloat(row[salesIndex]));
      }
      
      if (dates.length >= sampleSize) break;
    }
    
    return { dates, sales };
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  const handleStoreChange = (event) => {
    setSelectedStore(event.target.value);
    // Re-process data for the selected store
    if (csvData) {
      const filtered = event.target.value === 'all' 
        ? csvData.rows 
        : csvData.rows.filter(row => row[0] === event.target.value);
      processData(csvData.headers, filtered);
    }
  };

  const renderTemperatureChart = () => {
    if (!visualizationData || !visualizationData.temperatureImpact) return null;
    
    const { temperatures, sales } = visualizationData.temperatureImpact;
    
    const data = {
      labels: temperatures.map((_, i) => `Data ${i+1}`),
      datasets: [
        {
          label: 'Temperature (°F)',
          data: temperatures,
          borderColor: '#4d69fa',
          backgroundColor: 'rgba(77, 105, 250, 0.2)',
          yAxisID: 'y',
        },
        {
          label: 'Weekly Sales ($)',
          data: sales,
          borderColor: '#ff6e86',
          backgroundColor: 'rgba(255, 110, 134, 0.2)',
          yAxisID: 'y1',
        }
      ],
    };
    
    const options = {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Temperature vs Sales',
        },
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Temperature (°F)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
          title: {
            display: true,
            text: 'Weekly Sales ($)'
          }
        },
      },
    };
    
    return <Line data={data} options={options} />;
  };
  
  const renderEconomicFactorsChart = () => {
    if (!visualizationData) {
      console.log("No visualization data available");
      return null;
    }
    
    if (!visualizationData.economicFactors) {
      console.log("No economic factors data available");
      return null;
    }
    
    const { cpi, unemployment, fuelPrice, dates } = visualizationData.economicFactors;
    
    if (!cpi || !unemployment || !fuelPrice || !dates || cpi.length === 0) {
      console.log("Incomplete economic data:", { 
        cpiLength: cpi?.length, 
        unemploymentLength: unemployment?.length,
        fuelPriceLength: fuelPrice?.length,
        datesLength: dates?.length 
      });
      return null;
    }
    
    console.log("Rendering economic chart with data points:", dates.length);
    
    const data = {
      labels: dates,
      datasets: [
        {
          label: 'CPI',
          data: cpi,
          borderColor: '#36d7b7',
          backgroundColor: 'rgba(54, 215, 183, 0.2)',
        },
        {
          label: 'Unemployment',
          data: unemployment,
          borderColor: '#9c6eff',
          backgroundColor: 'rgba(156, 110, 255, 0.2)',
        },
        {
          label: 'Fuel Price',
          data: fuelPrice,
          borderColor: '#ffcb45',
          backgroundColor: 'rgba(255, 203, 69, 0.2)',
        }
      ],
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Economic Factors Over Time',
        },
      },
    };
    
    return <Line data={data} options={options} />;
  };
  
  const renderStorePerformanceChart = () => {
    if (!visualizationData || !visualizationData.storePerformance || visualizationData.storePerformance.length === 0) return null;
    
    // Take top 10 stores for better visualization
    const topStores = visualizationData.storePerformance.slice(0, 10);
    
    const data = {
      labels: topStores.map(item => `Store ${item.store}`),
      datasets: [
        {
          label: 'Average Sales by Store',
          data: topStores.map(item => item.average_sales),
          backgroundColor: 'rgba(255, 110, 134, 0.7)',
          borderColor: 'rgb(255, 110, 134)',
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Store Performance Comparison',
        },
      },
    };
    
    return <Bar data={data} options={options} />;
  };
  
  const renderHolidayImpactChart = () => {
    if (!visualizationData || !visualizationData.holidayImpact) return null;
    
    const { avgHolidaySales, avgNonHolidaySales } = visualizationData.holidayImpact;
    
    const data = {
      labels: ['Non-Holiday', 'Holiday'],
      datasets: [
        {
          label: 'Average Sales',
          data: [avgNonHolidaySales, avgHolidaySales],
          backgroundColor: ['rgba(77, 105, 250, 0.7)', 'rgba(255, 110, 134, 0.7)'],
          borderColor: ['rgb(77, 105, 250)', 'rgb(255, 110, 134)'],
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Holiday vs Non-Holiday Sales Comparison',
        },
      },
    };
    
    return <Bar data={data} options={options} />;
  };
  
  const renderWeeklySalesTrends = () => {
    if (!visualizationData || !visualizationData.weeklySalesTrends) return null;
    
    const { dates, sales } = visualizationData.weeklySalesTrends;
    
    const data = {
      labels: dates,
      datasets: [
        {
          label: 'Weekly Sales',
          data: sales,
          borderColor: '#4d69fa',
          backgroundColor: 'rgba(77, 105, 250, 0.2)',
          fill: true,
        }
      ],
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Weekly Sales Trends Over Time',
        },
      },
    };
    
    return <Line data={data} options={options} />;
  };

  return (
    <PageLayout>
      <PageHeader
        title="Walmart Sales Insights"
        subtitle="Automatic visualization of Walmart sales data showing patterns, trends, and key performance indicators."
        icon={<InsightsIcon />}
      />
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {!loading && !error && visualizationData && (
        <>
          <ModernCard glowColor="blue" sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
              mb: 2
            }}>
              <Tabs 
                value={selectedTab} 
                onChange={handleTabChange}
                sx={{
                  '.MuiTabs-indicator': {
                    background: 'linear-gradient(90deg, #4d69fa, #ff6e86)',
                    height: 3,
                    borderRadius: '3px'
                  },
                  mb: { xs: 2, md: 0 }
                }}
              >
                <Tab 
                  icon={<TimelineIcon />} 
                  label="Sales Trends" 
                  iconPosition="start"
                  sx={{ 
                    minHeight: 'auto',
                    py: 1.5,
                    '&.Mui-selected': {
                      color: theme => theme.palette.accent.blue
                    }
                  }} 
                />
                <Tab 
                  icon={<BarChartIcon />} 
                  label="Store Performance" 
                  iconPosition="start"
                  sx={{ 
                    minHeight: 'auto',
                    py: 1.5,
                    '&.Mui-selected': {
                      color: theme => theme.palette.accent.pink
                    }
                  }}
                />
                <Tab 
                  icon={<DonutLargeIcon />} 
                  label="Factor Impact" 
                  iconPosition="start"
                  sx={{ 
                    minHeight: 'auto',
                    py: 1.5,
                    '&.Mui-selected': {
                      color: theme => theme.palette.accent.green
                    }
                  }}
                />
              </Tabs>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Store</InputLabel>
                  <Select
                    value={selectedStore}
                    label="Store"
                    onChange={handleStoreChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="all">All Stores</MenuItem>
                    {storeOptions.map(store => (
                      <MenuItem key={store} value={store}>Store {store}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ 
              minHeight: '200px',
              flexGrow: 1,
              p: 1, 
              borderRadius: 2, 
              bgcolor: 'background.paper', 
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {selectedTab === 0 && (
                renderWeeklySalesTrends() || (
                  <Typography variant="body1" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    No sales trend data available
                  </Typography>
                )
              )}
              
              {selectedTab === 1 && (
                renderStorePerformanceChart() || (
                  <Typography variant="body1" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    No store performance data available
                  </Typography>
                )
              )}
              
              {selectedTab === 2 && (
                renderHolidayImpactChart() || (
                  <Typography variant="body1" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    No holiday impact data available
                  </Typography>
                )
              )}
            </Box>
          </ModernCard>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ModernCard glowColor="pink">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Temperature Impact on Sales
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Relationship between temperature and weekly sales performance.
                </Typography>
                
                <Box sx={{ 
                  minHeight: '200px',
                  flexGrow: 1
                }}>
                  {renderTemperatureChart() || (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '100%',
                      bgcolor: 'rgba(255, 110, 134, 0.1)',
                      borderRadius: 2
                    }}>
                      <Typography color="text.secondary">
                        Temperature impact data not available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </ModernCard>
            </Grid>
            
            <Grid item xs={12}>
              <ModernCard glowColor="blue">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Top 10 Selling Stores
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Walmart stores with highest average weekly sales performance.
                </Typography>
                
                <Box sx={{ 
                  minHeight: '200px',
                  flexGrow: 1
                }}>
                  {renderTopSellingStoresChart() || (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '100%',
                      bgcolor: 'rgba(77, 105, 250, 0.1)',
                      borderRadius: 2
                    }}>
                      <Typography color="text.secondary">
                        Store sales data not available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </ModernCard>
            </Grid>
            
            <Grid item xs={12}>
              <ModernCard glowColor="purple">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Least 5 Selling Stores
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Walmart stores with lowest average weekly sales performance.
                </Typography>
                
                <Box sx={{ 
                  minHeight: '200px',
                  flexGrow: 1
                }}>
                  {renderLeastSellingStoresChart() || (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '100%',
                      bgcolor: 'rgba(255, 110, 134, 0.1)',
                      borderRadius: 2
                    }}>
                      <Typography color="text.secondary">
                        Store sales data not available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </ModernCard>
            </Grid>
            
            <Grid item xs={12}>
              <ModernCard glowColor="purple">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Walmart Data Overview
                </Typography>
                
                {csvData && (
                  <TableContainer component={Paper} sx={{ maxHeight: 400, borderRadius: 2 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          {csvData.headers.map((header, index) => (
                            <TableCell key={index} sx={{ fontWeight: 600 }}>
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {csvData.rows.slice(0, 10).map((row, rowIndex) => (
                          <TableRow key={rowIndex} hover>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>
                                {cellIndex === csvData.headers.indexOf('Weekly_Sales') 
                                  ? parseFloat(cell).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
                                  : cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                
                {csvData && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    Displaying 10 of {csvData.rows.length} records from Walmart dataset
                  </Typography>
                )}
              </ModernCard>
            </Grid>
          </Grid>
        </>
      )}
    </PageLayout>
  );
};

export default VisualizationPage; 