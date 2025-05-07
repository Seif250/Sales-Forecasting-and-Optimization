import React, { useState } from 'react';
import { 
  Grid, 
  Typography,
  CircularProgress,
  Alert,
  Box,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InsightsIcon from '@mui/icons-material/Insights';
import TableChartIcon from '@mui/icons-material/TableChart';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import ModernCard from '../components/ModernCard';
import ModernButton from '../components/ModernButton';
import BarChart from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
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

const DataAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [preprocessedData, setPreprocessedData] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    
    // Parse the CSV file to display a preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const rows = content.split('\n');
        const headers = rows[0].split(',');
        
        // Get first 5 rows for preview
        const dataRows = rows.slice(1, 6).map(row => row.split(','));
        
        setCsvData({ headers, rows: dataRows });
      };
      reader.readAsText(selectedFile);
    }
  };

  const processData = async () => {
    if (!file) {
      setError('Please select a CSV file');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Step 1: Process and visualize data
      const visualizeResponse = await fetch(`${API_URL}/visualize_data`, {
        method: 'POST',
        body: formData,
      });
      
      if (!visualizeResponse.ok) {
        throw new Error(`Visualization error: ${visualizeResponse.status}`);
      }
      
      const visualizationResult = await visualizeResponse.json();
      setVisualizationData(visualizationResult);
      setPreprocessedData(visualizationResult.preprocessed_data);
      
      // Step 2: Get predictions from both models
      // Linear Regression
      const linearFormData = new FormData();
      linearFormData.append('file', file);
      linearFormData.append('model', 'linear_regression');
      
      const linearResponse = await fetch(`${API_URL}/predict_from_csv`, {
        method: 'POST',
        body: linearFormData,
      });
      
      if (!linearResponse.ok) {
        throw new Error(`Linear regression error: ${linearResponse.status}`);
      }
      
      const linearData = await linearResponse.json();
      
      // XGBoost
      const xgboostFormData = new FormData();
      xgboostFormData.append('file', file);
      xgboostFormData.append('model', 'xgboost');
      
      const xgboostResponse = await fetch(`${API_URL}/predict_from_csv`, {
        method: 'POST',
        body: xgboostFormData,
      });
      
      if (!xgboostResponse.ok) {
        throw new Error(`XGBoost error: ${xgboostResponse.status}`);
      }
      
      const xgboostData = await xgboostResponse.json();
      
      // Combine predictions
      setPredictions({
        linear_regression: linearData.predictions,
        xgboost: xgboostData.predictions,
        success: true
      });
      
    } catch (err) {
      console.error('Error processing data:', err);
      setError('Failed to process data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock visualization data if API doesn't return it yet
  const getMockVisualizations = () => {
    return (
      <Grid container spacing={3}>
        {/* Sales Trend Over Time */}
        <Grid item xs={12}>
          <ModernCard glowColor="blue">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Sales Trend Over Time
            </Typography>
            <Box
              sx={{
                height: 300,
                bgcolor: 'rgba(77, 105, 250, 0.1)',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TimelineIcon sx={{ fontSize: 100, opacity: 0.5, color: theme => theme.palette.accent.blue }} />
            </Box>
          </ModernCard>
        </Grid>
        
        {/* Sales by Department and Store Performance */}
        <Grid item xs={12} md={6}>
          <ModernCard glowColor="pink">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Sales by Department
            </Typography>
            <Box
              sx={{
                height: 300,
                bgcolor: 'rgba(255, 110, 134, 0.1)',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DonutLargeIcon sx={{ fontSize: 100, opacity: 0.5, color: theme => theme.palette.accent.pink }} />
            </Box>
          </ModernCard>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ModernCard glowColor="green">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Store Performance
            </Typography>
            <Box
              sx={{
                height: 300,
                bgcolor: 'rgba(75, 192, 192, 0.1)',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BarChart sx={{ fontSize: 100, opacity: 0.5, color: theme => theme.palette.accent.green }} />
            </Box>
          </ModernCard>
        </Grid>
      </Grid>
    );
  };

  // Render real visualizations based on API data
  const renderVisualizations = () => {
    if (!visualizationData) {
      return getMockVisualizations();
    }

    const { visualizations, preprocessed_data } = visualizationData;
    
    // Temperature Impact Chart
    const temperatureData = {
      labels: csvData ? csvData.rows.map((_, idx) => `Sample ${idx + 1}`) : [],
      datasets: [
        {
          label: 'Temperature (°F)',
          data: csvData ? csvData.rows.map(row => {
            const tempIndex = csvData.headers.findIndex(h => h.trim() === 'Temperature');
            return tempIndex >= 0 ? parseFloat(row[tempIndex]) : 0;
          }) : [],
          borderColor: '#4d69fa',
          backgroundColor: 'rgba(77, 105, 250, 0.2)',
          yAxisID: 'y',
        },
        {
          label: 'Weekly Sales',
          data: csvData ? csvData.rows.map(row => {
            const salesIndex = csvData.headers.findIndex(h => h.trim() === 'Weekly_Sales');
            return salesIndex >= 0 ? parseFloat(row[salesIndex]) : 0;
          }) : [],
          borderColor: '#ff6e86',
          backgroundColor: 'rgba(255, 110, 134, 0.2)',
          yAxisID: 'y1',
        }
      ],
    };
    
    const temperatureOptions = {
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
            text: 'Weekly Sales'
          }
        },
      },
    };
    
    // Economic Factors Chart (CPI, Unemployment, Fuel Price)
    const economicData = {
      labels: csvData ? csvData.rows.map((_, idx) => `Sample ${idx + 1}`) : [],
      datasets: [
        {
          label: 'CPI',
          data: csvData ? csvData.rows.map(row => {
            const cpiIndex = csvData.headers.findIndex(h => h.trim() === 'CPI');
            return cpiIndex >= 0 ? parseFloat(row[cpiIndex]) : 0;
          }) : [],
          borderColor: '#36d7b7',
          backgroundColor: 'rgba(54, 215, 183, 0.2)',
        },
        {
          label: 'Unemployment',
          data: csvData ? csvData.rows.map(row => {
            const unemploymentIndex = csvData.headers.findIndex(h => h.trim() === 'Unemployment');
            return unemploymentIndex >= 0 ? parseFloat(row[unemploymentIndex]) : 0;
          }) : [],
          borderColor: '#9c6eff',
          backgroundColor: 'rgba(156, 110, 255, 0.2)',
        },
        {
          label: 'Fuel Price',
          data: csvData ? csvData.rows.map(row => {
            const fuelIndex = csvData.headers.findIndex(h => h.trim() === 'Fuel_Price');
            return fuelIndex >= 0 ? parseFloat(row[fuelIndex]) : 0;
          }) : [],
          borderColor: '#ffcb45',
          backgroundColor: 'rgba(255, 203, 69, 0.2)',
        }
      ],
    };
    
    const economicOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Economic Factors',
        },
      },
    };

    // Holiday Impact Chart
    const holidayData = {
      labels: ['Non-Holiday', 'Holiday'],
      datasets: [
        {
          label: 'Average Sales',
          data: [0, 0], // Will be calculated below
          backgroundColor: ['rgba(77, 105, 250, 0.7)', 'rgba(255, 110, 134, 0.7)'],
          borderColor: ['rgb(77, 105, 250)', 'rgb(255, 110, 134)'],
          borderWidth: 1,
        },
      ],
    };

    // Calculate average sales by holiday flag
    if (csvData) {
      const salesByHoliday = [0, 0];
      const countByHoliday = [0, 0];
      
      csvData.rows.forEach(row => {
        const holidayIndex = csvData.headers.findIndex(h => h.trim() === 'Holiday_Flag');
        const salesIndex = csvData.headers.findIndex(h => h.trim() === 'Weekly_Sales');
        
        if (holidayIndex >= 0 && salesIndex >= 0) {
          const holidayFlag = parseInt(row[holidayIndex], 10);
          const sales = parseFloat(row[salesIndex]);
          
          if (!isNaN(holidayFlag) && !isNaN(sales)) {
            if (holidayFlag === 0 || holidayFlag === 1) {
              salesByHoliday[holidayFlag] += sales;
              countByHoliday[holidayFlag]++;
            }
          }
        }
      });
      
      holidayData.datasets[0].data = [
        countByHoliday[0] > 0 ? salesByHoliday[0] / countByHoliday[0] : 0,
        countByHoliday[1] > 0 ? salesByHoliday[1] / countByHoliday[1] : 0
      ];
    }

    // Store Performance Chart (if store data is available)
    const storeData = {
      labels: visualizations.store_performance.map(item => `Store ${item.store}`),
      datasets: [
        {
          label: 'Average Sales by Store',
          data: visualizations.store_performance.map(item => item.average_sales),
          backgroundColor: 'rgba(255, 110, 134, 0.7)',
          borderColor: 'rgb(255, 110, 134)',
          borderWidth: 1,
        },
      ],
    };
    
    const storeOptions = {
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
    
    return (
      <Grid container spacing={3}>
        {/* Temperature vs Sales */}
        <Grid item xs={12}>
          <ModernCard glowColor="blue">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Temperature vs Sales
            </Typography>
            <Box>
              {csvData && csvData.headers.includes('Temperature') ? (
                <Line data={temperatureData} options={temperatureOptions} />
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'rgba(77, 105, 250, 0.1)',
                  borderRadius: 2
                }}>
                  <Typography color="text.secondary">
                    Temperature data not available in the CSV.
                  </Typography>
                </Box>
              )}
            </Box>
          </ModernCard>
        </Grid>
        
        {/* Economic Factors */}
        <Grid item xs={12}>
          <ModernCard glowColor="green">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Economic Factors (CPI, Unemployment, Fuel Price)
            </Typography>
            <Box>
              {csvData && (csvData.headers.includes('CPI') || 
                           csvData.headers.includes('Unemployment') || 
                           csvData.headers.includes('Fuel_Price')) ? (
                <Line data={economicData} options={economicOptions} />
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'rgba(54, 215, 183, 0.1)',
                  borderRadius: 2
                }}>
                  <Typography color="text.secondary">
                    Economic factors data not available in the CSV.
                  </Typography>
                </Box>
              )}
            </Box>
          </ModernCard>
        </Grid>
        
        {/* Store Performance and Holiday Impact */}
        <Grid item xs={12} md={6}>
          <ModernCard glowColor="pink">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Store Performance
            </Typography>
            <Box>
              {visualizations.store_performance.length > 0 ? (
                <Bar data={storeData} options={storeOptions} />
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'rgba(255, 110, 134, 0.1)',
                  borderRadius: 2
                }}>
                  <Typography color="text.secondary">
                    No store data available. Add 'Store' column to your CSV.
                  </Typography>
                </Box>
              )}
            </Box>
          </ModernCard>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ModernCard glowColor="purple">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Holiday Impact on Sales
            </Typography>
            <Box>
              {csvData && csvData.headers.includes('Holiday_Flag') ? (
                <Bar data={holidayData} />
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'rgba(156, 110, 255, 0.1)',
                  borderRadius: 2
                }}>
                  <Typography color="text.secondary">
                    No holiday data available. Add 'Holiday_Flag' column to your CSV.
                  </Typography>
                </Box>
              )}
            </Box>
          </ModernCard>
        </Grid>
        
        {/* Data Statistics */}
        <Grid item xs={12}>
          <ModernCard glowColor="gold">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Data Statistics After Preprocessing
            </Typography>
            {visualizationData.preprocessed_data ? (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Column</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Min</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Max</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Mean</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Median</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(visualizationData.preprocessed_data.statistics).map(([column, stats]) => (
                      <TableRow key={column} hover>
                        <TableCell>{column}</TableCell>
                        <TableCell>{stats.min !== null ? stats.min.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell>{stats.max !== null ? stats.max.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell>{stats.mean !== null ? stats.mean.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell>{stats.median !== null ? stats.median.toFixed(2) : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No statistics available
                </Typography>
              </Box>
            )}
          </ModernCard>
        </Grid>
      </Grid>
    );
  };

  const renderPredictions = () => {
    if (!predictions) {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Process the data to view predictions
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {/* Linear Regression Predictions */}
        <Grid item xs={12} md={6}>
          <ModernCard glowColor="blue">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Linear Regression Predictions
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Index</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Predicted Sales</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {predictions.linear_regression && predictions.linear_regression.length > 0 ? 
                    predictions.linear_regression.slice(0, 10).map((pred, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>${typeof pred === 'number' ? pred.toFixed(2) : pred}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">No predictions available</TableCell>
                      </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </TableContainer>
            {predictions.linear_regression && predictions.linear_regression.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Showing first 10 predictions out of {predictions.linear_regression.length}
              </Typography>
            )}
          </ModernCard>
        </Grid>
        
        {/* XGBoost Predictions */}
        <Grid item xs={12} md={6}>
          <ModernCard glowColor="pink">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              XGBoost Predictions
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Index</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Predicted Sales</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {predictions.xgboost && predictions.xgboost.length > 0 ? 
                    predictions.xgboost.slice(0, 10).map((pred, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>${typeof pred === 'number' ? pred.toFixed(2) : pred}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">No predictions available</TableCell>
                      </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </TableContainer>
            {predictions.xgboost && predictions.xgboost.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Showing first 10 predictions out of {predictions.xgboost.length}
              </Typography>
            )}
          </ModernCard>
        </Grid>
        
        {/* Model Comparison */}
        <Grid item xs={12}>
          <ModernCard glowColor="purple">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Model Comparison
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Index</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Linear Regression</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>XGBoost</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Difference</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {predictions.linear_regression && predictions.xgboost && 
                   predictions.linear_regression.length > 0 && predictions.xgboost.length > 0 ? 
                    predictions.linear_regression.slice(0, 5).map((pred, idx) => {
                      const xgbValue = predictions.xgboost[idx];
                      const diff = xgbValue - pred;
                      return (
                        <TableRow key={idx} hover>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>${typeof pred === 'number' ? pred.toFixed(2) : pred}</TableCell>
                          <TableCell>${typeof xgbValue === 'number' ? xgbValue.toFixed(2) : xgbValue}</TableCell>
                          <TableCell sx={{ 
                            color: diff > 0 ? theme => theme.palette.accent.green : theme => theme.palette.accent.pink,
                            fontWeight: 'bold'
                          }}>
                            {diff > 0 ? '+' : ''}{typeof diff === 'number' ? diff.toFixed(2) : diff}
                          </TableCell>
                        </TableRow>
                      );
                    }) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No comparison data available</TableCell>
                      </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </ModernCard>
        </Grid>
      </Grid>
    );
  };

  return (
    <PageLayout>
      <PageHeader
        title="Data Analysis and Prediction"
        subtitle="Upload your CSV file for preprocessing, visualization, and sales predictions with multiple models."
        icon={<AnalyticsIcon />}
      />
      
      <ModernCard glowColor="blue" sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          mb: 3
        }}>
          <Box sx={{ 
            flex: 1,
            border: '2px dashed rgba(77, 105, 250, 0.5)', 
            borderRadius: 3, 
            p: 3, 
            textAlign: 'center',
            transition: 'all 0.3s ease',
            bgcolor: 'rgba(77, 105, 250, 0.03)',
            '&:hover': {
              bgcolor: 'rgba(77, 105, 250, 0.05)',
              borderColor: 'rgba(77, 105, 250, 0.7)',
            }
          }}>
            <input
              accept=".csv"
              style={{ display: 'none' }}
              id="csv-file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="csv-file-upload">
              <ModernButton
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                color="blue"
              >
                Select CSV File
              </ModernButton>
            </label>
            
            {file && (
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Selected file: <Box component="span" sx={{ color: theme => theme.palette.accent.blue, fontWeight: 600 }}>{file.name}</Box>
              </Typography>
            )}
          </Box>
          
          <ModernButton 
            color="pink" 
            onClick={processData}
            disabled={!file || loading}
            sx={{ 
              height: { sm: 54 },
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 180 }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Process Data'}
          </ModernButton>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {csvData && (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Data Preview
            </Typography>
            
            <TableContainer sx={{ 
              maxHeight: 300, 
              borderRadius: 2, 
              border: '1px solid rgba(255,255,255,0.1)',
              mb: 3
            }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {csvData.headers.map((header, index) => (
                      <TableCell key={index} sx={{ bgcolor: 'rgba(77, 105, 250, 0.1)', fontWeight: 'bold' }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {csvData.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex} hover>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </ModernCard>
      
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          variant="fullWidth"
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
            icon={<InsightsIcon />} 
            label="Visualizations" 
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
            icon={<TableChartIcon />} 
            label="Predictions" 
            iconPosition="start"
            sx={{ 
              minHeight: 'auto',
              py: 1.5,
              '&.Mui-selected': {
                color: theme => theme.palette.accent.pink
              }
            }}
          />
        </Tabs>
      </Box>
      
      {selectedTab === 0 && (
        <>
          {visualizationData ? (
            <Box>
              {renderVisualizations()}
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Upload and process a CSV file to view visualizations
              </Typography>
            </Box>
          )}
        </>
      )}
      
      {selectedTab === 1 && renderPredictions()}
    </PageLayout>
  );
};

export default DataAnalyzer; 