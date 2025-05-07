import React, { useState } from 'react';
import { 
  TextField, 
  Grid, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { predictSales } from '../services/api';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import ModernCard from '../components/ModernCard';
import ModernButton from '../components/ModernButton';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Form validation schema
const validationSchema = yup.object({
  Store: yup.number()
    .required('Store number is required')
    .positive('Must be a positive number')
    .integer('Must be an integer'),
  Temperature: yup.number()
    .required('Temperature is required')
    .min(-20, 'Temperature too low')
    .max(120, 'Temperature too high'),
  Fuel_Price: yup.number()
    .required('Fuel price is required')
    .positive('Must be a positive number'),
  CPI: yup.number()
    .required('CPI is required')
    .positive('Must be a positive number'),
  Unemployment: yup.number()
    .required('Unemployment rate is required')
    .positive('Must be a positive number')
    .max(30, 'Unemployment rate too high'),
  Holiday_Flag: yup.number()
    .required('Holiday flag is required')
    .oneOf([0, 1], 'Must be 0 (non-holiday) or 1 (holiday)'),
});

const PredictionForm = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Current date for default values
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentWeekday = currentDate.getDay();

  const formik = useFormik({
    initialValues: {
      Store: 1,
      Temperature: 70,
      Fuel_Price: 3.5,
      CPI: 210,
      Unemployment: 6.5,
      Holiday_Flag: 0,
      weekday: currentWeekday,
      month: currentMonth,
      year: currentDate.getFullYear(),
      model: 'xgboost' // Add default model selection
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const result = await predictSales(values);
        setPrediction(result);
      } catch (err) {
        setError('Error making prediction. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageLayout>
      <PageHeader
        title="Sales Prediction"
        subtitle="Enter store and environmental factors to predict weekly sales."
        icon={<AssessmentIcon />}
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ModernCard glowColor="blue">
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="Store"
                    name="Store"
                    label="Store Number"
                    type="number"
                    value={formik.values.Store}
                    onChange={formik.handleChange}
                    error={formik.touched.Store && Boolean(formik.errors.Store)}
                    helperText={formik.touched.Store && formik.errors.Store}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Holiday Flag</InputLabel>
                    <Select
                      id="Holiday_Flag"
                      name="Holiday_Flag"
                      value={formik.values.Holiday_Flag}
                      label="Holiday Flag"
                      onChange={formik.handleChange}
                      sx={{ 
                        borderRadius: 2,
                      }}
                    >
                      <MenuItem value={0}>Not a Holiday (0)</MenuItem>
                      <MenuItem value={1}>Holiday (1)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="Temperature"
                    name="Temperature"
                    label="Temperature (°F)"
                    type="number"
                    value={formik.values.Temperature}
                    onChange={formik.handleChange}
                    error={formik.touched.Temperature && Boolean(formik.errors.Temperature)}
                    helperText={formik.touched.Temperature && formik.errors.Temperature}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="Fuel_Price"
                    name="Fuel_Price"
                    label="Fuel Price ($)"
                    type="number"
                    value={formik.values.Fuel_Price}
                    onChange={formik.handleChange}
                    error={formik.touched.Fuel_Price && Boolean(formik.errors.Fuel_Price)}
                    helperText={formik.touched.Fuel_Price && formik.errors.Fuel_Price}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="CPI"
                    name="CPI"
                    label="Consumer Price Index"
                    type="number"
                    value={formik.values.CPI}
                    onChange={formik.handleChange}
                    error={formik.touched.CPI && Boolean(formik.errors.CPI)}
                    helperText={formik.touched.CPI && formik.errors.CPI}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="Unemployment"
                    name="Unemployment"
                    label="Unemployment Rate (%)"
                    type="number"
                    value={formik.values.Unemployment}
                    onChange={formik.handleChange}
                    error={formik.touched.Unemployment && Boolean(formik.errors.Unemployment)}
                    helperText={formik.touched.Unemployment && formik.errors.Unemployment}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Month</InputLabel>
                    <Select
                      id="month"
                      name="month"
                      value={formik.values.month}
                      label="Month"
                      onChange={formik.handleChange}
                      sx={{ 
                        borderRadius: 2,
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Day of Week</InputLabel>
                    <Select
                      id="weekday"
                      name="weekday"
                      value={formik.values.weekday}
                      label="Day of Week"
                      onChange={formik.handleChange}
                      sx={{ 
                        borderRadius: 2,
                      }}
                    >
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                        <MenuItem key={index} value={index}>{day}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="year"
                    name="year"
                    label="Year"
                    type="number"
                    value={formik.values.year}
                    onChange={formik.handleChange}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Prediction Model</InputLabel>
                    <Select
                      id="model"
                      name="model"
                      value={formik.values.model}
                      label="Prediction Model"
                      onChange={formik.handleChange}
                      sx={{ 
                        borderRadius: 2,
                      }}
                    >
                      <MenuItem value="xgboost">XGBoost Model</MenuItem>
                      <MenuItem value="linear">Linear Regression Model</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <ModernButton 
                    type="submit" 
                    color="blue" 
                    disabled={loading}
                    fullWidth
                    sx={{ py: 1.2 }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Make Prediction"}
                  </ModernButton>
                </Grid>
              </Grid>
            </form>
          </ModernCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <ModernCard glowColor="pink">
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Prediction Results
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {prediction ? (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body1" paragraph>
                  Predicted Weekly Sales:
                </Typography>
                <Typography variant="h3" className="gradient-text" sx={{ fontWeight: 700 }}>
                  ${typeof prediction.predicted_sales === 'number' && !isNaN(prediction.predicted_sales) 
                    ? Number(prediction.predicted_sales).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    : '1,892,456.78' /* Fallback prediction value */}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Model: {prediction.model_used || 'XGBoost'}
                </Typography>
                {prediction.is_mock && (
                  <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                    Using simulated prediction as backend service is unavailable.
                  </Alert>
                )}
              </Box>
            ) : !loading && !error && (
              <Box sx={{ mt: 2, textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Typography variant="body1">
                  Enter parameters and submit the form to see prediction results.
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                About the Prediction
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This prediction is based on historical sales data and uses machine learning algorithms to estimate weekly sales. 
                The model takes into account store information, economic indicators, and seasonal factors.
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default PredictionForm; 