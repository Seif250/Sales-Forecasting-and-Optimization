import React, { useState } from 'react';
import { 
  Container, Typography, Box, Tabs, Tab, Paper, Divider, 
  List, ListItem, ListItemText, ListItemIcon, Chip, Grid, useTheme, TextField, InputAdornment
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TableChartIcon from '@mui/icons-material/TableChart';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ArticleIcon from '@mui/icons-material/Article';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import ApiIcon from '@mui/icons-material/Api';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import ModernCard from '../components/ModernCard';
import ModernButton from '../components/ModernButton';

const DocumentationPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState(null);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Documentation sections content
  const introContent = `
# Introduction to Predix

## Overview of our platform and capabilities
Predix is a state-of-the-art platform designed to analyze and predict retail sales patterns using advanced AI algorithms. Our system can process historical sales data, identify patterns, and provide accurate forecasts to help optimize inventory management and business operations.

Built on the Walmart sales dataset, our platform leverages machine learning techniques to analyze and visualize sales patterns across multiple stores and departments.
  `;

  const datasetContent = `
# Dataset

## Information about the underlying data powering our platform
Predix is powered by the Walmart sales dataset, which contains historical sales data across diverse store locations and departments. This comprehensive dataset enables our models to understand sales patterns in different retail contexts.

The dataset includes:
- Weekly sales data from various store locations
- Store-specific features (size, type)
- External factors (temperature, fuel price, CPI, unemployment)
- Holiday and promotional markdown information
  `;

  const preprocessingContent = `
# Data Preprocessing Pipeline

## How we prepare sales data for analysis
Our platform implements a robust preprocessing pipeline to ensure high-quality data analysis:

### Date Feature Extraction
We transform date information into useful features that capture seasonal patterns.

### Categorical Encoding
For each store and department, we apply binary encoding to effectively capture categorical information.

### Statistical Feature Generation
We identify correlations between external factors and sales performance to generate informative features.

### Outlier Handling
Our preprocessing pipeline identifies and addresses anomalous data points to ensure model robustness.

### Normalization
All numerical features are normalized to improve model convergence and performance.

### Missing Value Imputation
We employ strategic imputation techniques to handle missing values in the dataset.
  `;

  const apiEndpoints = [
    {
      name: '/api/predict_json',
      method: 'POST',
      description: 'Submit data for prediction in JSON format',
      requestExample: `{
  "data": {
    "Store": 1,
    "Temperature": 73.5,
    "Fuel_Price": 3.25,
    "CPI": 138.2,
    "Unemployment": 8.1,
    "Holiday_Flag": 0,
    "weekday": 5,
    "month": 7,
    "year": 2023
  },
  "model_name": "xgboost"  // Optional, defaults to 'xgboost'
}`,
      responseExample: `{
  "predictions": [45678.90],  // Predicted sales value
  "model": "xgboost",
  "confidence_interval": [42390.15, 48967.65],
  "success": true,
  "processing_time_ms": 125
}`
    },
    {
      name: '/api/predict_csv',
      method: 'POST',
      description: 'Upload a CSV file for batch predictions',
      requestExample: `// Form data with 'file' field containing the CSV file
Content-Type: multipart/form-data`,
      responseExample: `{
  "predictions": {
    "linear_regression": [45678.90, 23456.78, ...],
    "xgboost": [46789.01, 24567.89, ...],
    "ensemble": [46123.45, 24012.34, ...]
  },
  "rows_processed": 100,
  "success": true,
  "processing_time_ms": 1250
}`
    },
    {
      name: '/api/visualize_data',
      method: 'POST',
      description: 'Submit a CSV file to get preprocessed data and visualizations',
      requestExample: `// Form data with 'file' field containing the CSV file
Content-Type: multipart/form-data`,
      responseExample: `{
  "preprocessed_data": {
    "columns": ["Store", "Dept", "Date", "Weekly_Sales", ...],
    "rows": 1000,
    "statistics": {
      "Weekly_Sales": {
        "min": 1234.56, 
        "max": 98765.43, 
        "mean": 45678.90
      },
      // Statistics for other numerical columns
    }
  },
  "visualizations": {
    "store_performance": [...],
    "time_trend": [...],
    "department_sales": [...]
  },
  "success": true,
  "message": "Data visualization processed successfully."
}`
    }
  ];

  const modelArchContent = `
# Model Architecture

## Technical details of our AI models

Predix employs multiple machine learning models to deliver accurate sales forecasts:

### Linear Regression
Our baseline model provides fundamental trend analysis and serves as a benchmark for our more complex models.

Features:
- Interpretable coefficients for feature importance analysis
- Fast training and prediction times
- Effective for understanding basic sales relationships

### XGBoost
Our advanced model captures complex non-linear relationships in the data.

Features:
- Gradient boosting framework for enhanced accuracy
- Handles non-linear feature interactions
- Robust to outliers and missing values
- Advanced feature importance metrics

### Feature Engineering Pipeline
Both models leverage our sophisticated feature engineering pipeline:

- Date-based features (month, weekday, year)
- Binary-encoded categorical variables
- Standardized numerical features
- Holiday and promotion indicators

Our models are trained to identify meaningful patterns in sales data while being robust to seasonal variations and external economic factors.
  `;
  
  const usageContent = `
# Using the Analysis Platform

## How to interact with Predix

You can analyze sales data through our interface by:

1. **Data Uploading**
   - Upload new sales data in CSV format
   - Select models for prediction (Linear Regression, XGBoost)

2. **Visualization Exploration**
   - Explore sales trends across different stores and time periods
   - Analyze the impact of external factors like weather and economic indicators
   - Identify seasonal patterns and holiday effects

3. **Sales Forecasting**
   - Generate predictions for future sales periods
   - Compare predictions from different models
   - Export results for further analysis or reporting

The platform processes your input data through our preprocessing pipeline and applies our pre-trained models to provide accurate sales forecasts.
  `;
  
  const usageContent2 = `
Additional information about using the platform and processing your data through our pipeline.
  `;
  
  const apiRefContent = `
# API Reference

## Technical details for developers

Our platform provides the following API endpoints:

* **/api/predict_json (POST)**: Submit individual data points for prediction
* **/api/predict_csv (POST)**: Upload CSV files for batch prediction
* **/api/visualize_data (POST)**: Get data visualizations and statistics

For detailed API documentation, including request and response formats, please refer to our developer guide or contact our development team.
  `;

  // Usage examples
  const pythonExample = `import requests
import json

# Define the API endpoint
url = "http://localhost:8000/api/predict_json"

# Prepare the data
data = {
    "data": [{
        "store_id": 1,
        "dept_id": 5,
        "temperature": 75.5,
        "fuel_price": 3.25,
        "cpi": 138.2,
        "unemployment": 8.1,
        "holiday_flag": 0,
        "weekday": 5,
        "month": 7,
        "year": 2023
    }],
    "model_name": "xgboost"
}

# Send the request
response = requests.post(
    url,
    data=json.dumps(data),
    headers={"Content-Type": "application/json"}
)

# Parse the response
if response.status_code == 200:
    result = response.json()
    print(f"Predicted sales: {result['predictions'][0]}")
else:
    print(f"Error: {response.status_code} - {response.text}")`;

  const jsExample = `// JavaScript Fetch API Example
const apiUrl = 'http://localhost:8000/api/predict_json';

const data = {
  data: [{
    store_id: 1,
    dept_id: 5,
    temperature: 75.5,
    fuel_price: 3.25,
    cpi: 138.2,
    unemployment: 8.1,
    holiday_flag: 0,
    weekday: 5,
    month: 7,
    year: 2023
  }],
  model_name: 'xgboost'
};

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(result => {
    console.log(\`Predicted sales: \${result.predictions[0]}\`);
  })
  .catch(error => {
    console.error('Error:', error);
  });`;

  // TabPanel component for documentation tabs
  const TabPanel = ({ children, value, index }) => {
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };
  
  const sections = [
    { id: 'introduction', title: 'Introduction', icon: <DescriptionIcon fontSize="small" /> },
    { id: 'dataset', title: 'Dataset', icon: <TableChartIcon fontSize="small" /> },
    { id: 'preprocessing', title: 'Data Preprocessing', icon: <DataObjectIcon fontSize="small" /> },
    { id: 'model-architecture', title: 'Model Architecture', icon: <CodeIcon fontSize="small" /> },
    { id: 'usage', title: 'Using the Platform', icon: <ArticleIcon fontSize="small" /> },
    { id: 'api-reference', title: 'API Reference', icon: <ApiIcon fontSize="small" /> }
  ];
  
  const getSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'introduction':
        return (
          <>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Introduction to Predix
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Overview of our platform and capabilities</Typography>
            <Typography variant="body1" paragraph>
              Predix is a state-of-the-art platform designed to analyze and predict retail sales patterns using advanced AI algorithms. 
              Our system can process historical sales data, identify patterns, and provide accurate forecasts to help optimize inventory 
              management and business operations.
            </Typography>
            <Typography variant="body1" paragraph>
              Built on the Walmart sales dataset, our platform leverages machine learning techniques to analyze and visualize 
              sales patterns across multiple stores and departments.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Key Features:</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Advanced Sales Forecasting with AI" secondary="Predict future sales with high accuracy" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Data Visualization Tools" secondary="Explore sales trends and patterns visually" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="API Integration" secondary="Connect our prediction capabilities to your existing systems" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Multiple Model Support" secondary="Choose from linear regression or XGBoost models" />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Benefits for Retailers:</Typography>
            <Typography variant="body1" paragraph>
              By accurately forecasting sales, retailers can optimize their inventory management, staffing, and marketing strategies,
              leading to reduced costs and improved customer satisfaction. Our platform helps businesses make data-driven decisions
              that adapt to changing market conditions.
            </Typography>
          </>
        );
      case 'dataset':
        return (
          <>
            <Typography variant="h5" gutterBottom fontWeight={600}>Dataset</Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Information about the underlying data</Typography>
            <Typography variant="body1" paragraph>
              Our platform is powered by the Walmart sales dataset, which contains rich historical sales data across multiple store locations and departments.
            </Typography>
            <Typography variant="body1" paragraph>
              The dataset includes:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Weekly sales data from various store locations" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Store-specific features (size, type)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="External factors (temperature, fuel price, CPI, unemployment)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Holiday and promotional markdown information" />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Data Sources</Typography>
            <Typography variant="body1" paragraph>
              The primary dataset is based on historical Walmart sales data, supplemented with:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Economic indicators from reliable government sources" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Weather data from meteorological databases" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Calendar information for holiday identification" />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Data Structure</Typography>
            <Box sx={{ mb: 3 }}>
              <SyntaxHighlighter language="javascript" style={docco}>
{`// Sample data structure
{
  "Store": 1,                   // Store identifier
  "Dept": 1,                    // Department number
  "Date": "2010-02-05",         // Sales date
  "Weekly_Sales": 24924.50,     // Target variable (what we predict)
  "IsHoliday": true,            // Whether the week is a holiday week
  "Temperature": 67.87,         // Average temperature
  "Fuel_Price": 2.47,           // Cost of fuel
  "CPI": 211.08,                // Consumer price index
  "Unemployment": 8.10,         // Unemployment rate
  "Type": "A",                  // Store type
  "Size": 151315                // Store size
}`}
              </SyntaxHighlighter>
            </Box>
          </>
        );
      case 'preprocessing':
        return (
          <>
            <Typography variant="h5" gutterBottom fontWeight={600}>Data Preprocessing</Typography>
            <Typography variant="body1" paragraph>
              Our platform implements a robust preprocessing pipeline to ensure high-quality data analysis and modeling.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Date Feature Extraction</Typography>
            <Typography variant="body1" paragraph>
              We transform date information into useful features that capture seasonal patterns:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Day of week (encoded as categorical variable)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Month (to capture monthly seasonality)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Year (to capture long-term trends)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Week of year (to capture seasonal patterns)" />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Categorical Encoding</Typography>
            <Typography variant="body1" paragraph>
              For each store and department, we apply binary encoding to effectively capture categorical information.
              Store types are one-hot encoded to allow the model to learn store-specific patterns.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Statistical Feature Generation</Typography>
            <Typography variant="body1" paragraph>
              We identify correlations between external factors and sales performance to generate informative features:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Rolling averages for sales (7-day, 14-day, 28-day)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Lag features to capture time dependencies" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Interaction features between temperature and holidays" />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Outlier Handling</Typography>
            <Typography variant="body1" paragraph>
              Our preprocessing pipeline identifies and addresses anomalous data points to ensure model robustness:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Z-score based outlier detection" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Capping extreme values at 99th percentile" />
              </ListItem>
            </List>
          </>
        );
      case 'model-architecture':
        return (
          <>
            <Typography variant="h5" gutterBottom fontWeight={600}>Model Architecture</Typography>
            <Typography variant="body1" paragraph>
              Predix employs multiple machine learning models to provide accurate sales forecasts.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Linear Regression</Typography>
            <Typography variant="body1" paragraph>
              Our baseline model provides fundamental trend analysis and serves as a benchmark for our more complex models.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>Features:</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Interpretable coefficients for feature importance analysis" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Fast training and prediction times" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Effective for understanding basic sales relationships" />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>XGBoost</Typography>
            <Typography variant="body1" paragraph>
              Our advanced model captures complex non-linear relationships in the data.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>Features:</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Gradient boosting framework for enhanced accuracy" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Handles non-linear feature interactions" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Robust to outliers and missing values" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Advanced feature importance metrics" />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3, mb: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>Model Parameters</Typography>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <th style={{ textAlign: 'left', padding: '10px', fontWeight: 600, color: theme.palette.primary.main }}>Parameter</th>
                    <th style={{ textAlign: 'left', padding: '10px', fontWeight: 600, color: theme.palette.primary.main }}>Linear Regression</th>
                    <th style={{ textAlign: 'left', padding: '10px', fontWeight: 600, color: theme.palette.primary.main }}>XGBoost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Training Time</td>
                    <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Fast (seconds)</td>
                    <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Medium (minutes)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Inference Speed</td>
                    <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Very fast</td>
                    <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Fast</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Accuracy</td>
                    <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Moderate (RMSE ~1500)</td>
                    <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>High (RMSE ~950)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Interpretability</td>
                    <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>High</td>
                    <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Medium</td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </>
        );
      case 'usage':
        return (
          <>
            <Typography variant="h5" gutterBottom fontWeight={600}>Using the Platform</Typography>
            <Typography variant="body1" paragraph>
              You can analyze sales data through our interface by following these steps:
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>1. Data Uploading</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Upload new sales data in CSV format" secondary="Use the Data Analyzer page to upload your files" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Select models for prediction" secondary="Choose between Linear Regression and XGBoost" />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>2. Visualization Exploration</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Explore sales trends across different stores and time periods" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Analyze the impact of external factors like weather and economic indicators" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Identify seasonal patterns and holiday effects" />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>3. Sales Forecasting</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Generate predictions for future sales periods" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Compare predictions from different models" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRightIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Export results for further analysis or reporting" />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Sample Workflow</Typography>
              <Typography variant="body2" paragraph sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                The platform processes your input data through our preprocessing pipeline and applies our pre-trained models to provide accurate sales forecasts.
              </Typography>
              
              <ol style={{ paddingLeft: '20px' }}>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Navigate to the <b>Data Analyzer</b> page
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Upload your CSV file containing sales data
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Configure visualization parameters to explore your data
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Select forecast parameters (time period, models to use)
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Generate and review forecasts
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Export results in your preferred format
                  </Typography>
                </li>
              </ol>
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Frequently Asked Questions</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>What file formats are supported?</Typography>
              <Typography variant="body1" paragraph>
                Currently, we support CSV files with the required columns for analysis. Please refer to the Dataset section for details on the expected format.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>How accurate are the predictions?</Typography>
              <Typography variant="body1" paragraph>
                Our XGBoost model typically achieves RMSE (Root Mean Square Error) values of approximately 950 on test data, which represents high accuracy for retail sales forecasting.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>How long does it take to get results?</Typography>
              <Typography variant="body1" paragraph>
                The time it takes to get results depends on the size of the dataset and the complexity of the model.
                For batch predictions, it can take a few minutes to process a large dataset.
              </Typography>
            </Box>          </>
        );
      case 'api-reference':
        return (
          <>
            <Typography variant="h5" gutterBottom fontWeight={600}>API Reference</Typography>
            <Typography variant="body1" paragraph>
              Our platform provides several API endpoints that allow you to integrate our prediction capabilities with your applications.
            </Typography>
            
            {apiEndpoints.map((endpoint, index) => (
              <Box key={index} sx={{ mt: 3, mb: 4 }}>
                <Box sx={{ 
                  p: 1, 
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  backgroundColor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Chip 
                    label={endpoint.method} 
                    size="small" 
                    sx={{ 
                      backgroundColor: endpoint.method === 'GET' ? '#61affe' : '#49cc90',
                      color: '#fff',
                      fontWeight: 'bold',
                      mr: 2
                    }} 
                  />
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {endpoint.name}
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ mt: 1 }} paragraph>
                  {endpoint.description}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mt: 2, color: 'text.secondary', fontWeight: 600 }}>
                  Request Example:
                </Typography>
                <Box sx={{ mt: 1, mb: 2 }}>
                  <SyntaxHighlighter language="javascript" style={docco}>
                    {endpoint.requestExample}
                  </SyntaxHighlighter>
                </Box>
                
                <Typography variant="subtitle2" sx={{ mt: 2, color: 'text.secondary', fontWeight: 600 }}>
                  Response Example:
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <SyntaxHighlighter language="javascript" style={docco}>
                    {endpoint.responseExample}
                  </SyntaxHighlighter>
                </Box>
              </Box>
            ))}
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>Code Examples</Typography>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
              Python:
            </Typography>
            <Box sx={{ mt: 1, mb: 3 }}>
              <SyntaxHighlighter language="python" style={docco}>
                {pythonExample}
              </SyntaxHighlighter>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
              JavaScript:
            </Typography>
            <Box sx={{ mt: 1 }}>
              <SyntaxHighlighter language="javascript" style={docco}>
                {jsExample}
              </SyntaxHighlighter>
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Documentation"
        subtitle="Find detailed information about our system and how to use it effectively."
        icon={<ArticleIcon />}
      />
      
      {selectedSection ? (
        <>
          <ModernCard glowColor="blue" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ModernButton 
                startIcon={<ArrowBackIcon />} 
                variant="outlined" 
                color="blue" 
                sx={{ mr: 2 }}
                onClick={() => setSelectedSection(null)}
              >
                Back to Sections
              </ModernButton>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {sections.find(s => s.id === selectedSection)?.title}
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {getSectionContent(selectedSection)}
          </ModernCard>
        </>
      ) : (
        <>
          <ModernCard glowColor="blue" sx={{ mb: 4 }}>
            <TextField 
              fullWidth
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <Paper sx={{ mb: 3 }}>
              <Tabs 
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Overview" icon={<DescriptionIcon />} iconPosition="start" />
                <Tab label="API" icon={<ApiIcon />} iconPosition="start" />
                <Tab label="Samples" icon={<CodeIcon />} iconPosition="start" />
                <Tab label="FAQ" icon={<HelpOutlineIcon />} iconPosition="start" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1" paragraph>
                  Welcome to the Predix documentation. Here you will find comprehensive guides and documentation to help you
                  understand and use our platform effectively. Our documentation is organized into several key sections.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  For newcomers, we recommend starting with the Introduction section, followed by the Dataset section to understand
                  the data format our system expects. When you're ready to begin using the platform, the Using the Platform section
                  provides a step-by-step guide to get you started.
                </Typography>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Typography variant="body1" paragraph>
                  Our API allows you to integrate our prediction capabilities with your existing systems. The API Reference section
                  provides detailed information about each endpoint, including request and response formats, as well as code examples.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  For technical questions about our API, please contact our support team or refer to the FAQ section for common questions.
                </Typography>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="body1" paragraph>
                  We provide sample code snippets for various programming languages to help you integrate with our API.
                  These samples demonstrate how to prepare data, make requests, and handle responses.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Python Example:</Typography>
                <Box sx={{ mb: 3 }}>
                  <SyntaxHighlighter language="python" style={docco}>
                    {pythonExample}
                  </SyntaxHighlighter>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={3}>
                <Typography variant="h6" gutterBottom>Frequently Asked Questions</Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>What file formats are supported?</Typography>
                <Typography variant="body1" paragraph>
                  Currently, we support CSV files with the required columns for analysis. Please refer to the Dataset section for details on the expected format.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>How accurate are the predictions?</Typography>
                <Typography variant="body1" paragraph>
                  Our XGBoost model typically achieves RMSE (Root Mean Square Error) values of approximately 950 on test data, which represents high accuracy for retail sales forecasting.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>How long does it take to get results?</Typography>
                <Typography variant="body1" paragraph>
                  The time it takes to get results depends on the size of the dataset and the complexity of the model.
                  For batch predictions, it can take a few minutes to process a large dataset.
                </Typography>
              </TabPanel>
            </Paper>
          </ModernCard>
          
          <Grid container spacing={3}>
            {sections.map((section) => (
              <Grid item xs={12} md={6} key={section.id}>
                <ModernCard 
                  glowColor={section.id === 'introduction' ? 'blue' : section.id === 'api-reference' ? 'pink' : section.id === 'model-architecture' ? 'green' : section.id === 'dataset' ? 'purple' : section.id === 'preprocessing' ? 'orange' : 'teal'}
                  sx={{ 
                    p: 0, 
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box 
                    sx={{                      
                      height: 180, 
                      width: '100%', 
                      backgroundImage: `url(/images/${section.id === 'introduction' ? 'img5.png' : 
                                                  section.id === 'api-reference' ? 'img2.png' : 
                                                  section.id === 'model-architecture' ? 'img3.png' : 
                                                  section.id === 'dataset' ? 'img4.png' : 
                                                  section.id === 'preprocessing' ? 'img1.png' : 'img5.png'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 1 }}>
                      {section.title}
                    </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2, flexGrow: 1 }}>
                      {section.id === 'introduction' && "Learn about the Predix platform and its sales forecasting capabilities."}
                      {section.id === 'dataset' && "Understand the Walmart sales dataset powering our forecasting system."}
                      {section.id === 'preprocessing' && "Explore our data preprocessing pipeline for sales data."}
                      {section.id === 'model-architecture' && "Learn about our AI model architecture and prediction capabilities."}
                      {section.id === 'usage' && "Find out how to use our platform for sales analysis and predictions."}
                      {section.id === 'api-reference' && "Explore our API endpoints for integration with your applications."}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>                      
                      <ModernButton 
                        color={section.id === 'introduction' ? 'blue' : section.id === 'api-reference' ? 'pink' : section.id === 'model-architecture' ? 'green' : section.id === 'dataset' ? 'purple' : section.id === 'preprocessing' ? 'orange' : 'teal'} 
                        variant="outlined"
                        onClick={() => setSelectedSection(section.id)}
                      >
                        {section.id === 'introduction' ? 'Introduction' : 
                          section.id === 'dataset' ? 'Dataset Details' : 
                          section.id === 'preprocessing' ? 'Data Processing' : 
                          section.id === 'model-architecture' ? 'Model Architecture' : 
                          section.id === 'usage' ? 'Platform Usage' : 
                          'API Reference'}
                      </ModernButton>
                    </Box>
                  </Box>
                </ModernCard>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </PageLayout>
  );
};

export default DocumentationPage;
