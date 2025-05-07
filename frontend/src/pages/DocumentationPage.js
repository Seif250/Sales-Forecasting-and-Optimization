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

  // Sample API documentation
  const apiEndpoints = [
    {
      name: 'Predict Sales',
      method: 'POST',
      endpoint: '/api/predict',
      description: 'Get sales forecast based on input parameters',
      requestExample: `{
  "store_id": 1,
  "dept_id": 5,
  "temperature": 75.5,
  "fuel_price": 3.45,
  "markdown1": 0,
  "markdown2": 10.5,
  "markdown3": 0,
  "markdown4": 0,
  "markdown5": 0,
  "cpi": 225.38,
  "unemployment": 7.5,
  "isHoliday": true
}`,
      responseExample: `{
  "prediction": 3245.78,
  "confidence_interval": [3100.45, 3390.23],
  "status": "success"
}`
    },
    {
      name: 'Batch Prediction',
      method: 'POST',
      endpoint: '/api/batch-predict',
      description: 'Submit a CSV file for batch prediction',
      requestExample: `// Form data with 'file' field containing the CSV file
Content-Type: multipart/form-data`,
      responseExample: `{
  "job_id": "job-12345",
  "status": "processing",
  "estimated_completion_time": "2023-06-15T15:30:00Z"
}`
    },
    {
      name: 'Get Batch Results',
      method: 'GET',
      endpoint: '/api/batch-results/{job_id}',
      description: 'Retrieve the results of a batch prediction job',
      requestExample: `// No request body needed`,
      responseExample: `{
  "status": "completed",
  "results": [
    { "row_id": 1, "store_id": 1, "dept_id": 5, "prediction": 3245.78 },
    { "row_id": 2, "store_id": 1, "dept_id": 6, "prediction": 2178.45 }
  ],
  "download_url": "/api/download/results-12345.csv"
}`
    }
  ];

  // Usage examples
  const pythonExample = `import requests
import json

# Define the API endpoint
url = "https://your-sales-forecasting-api.com/api/predict"

# Prepare the data
data = {
    "store_id": 1,
    "dept_id": 5,
    "temperature": 75.5,
    "fuel_price": 3.45,
    "markdown1": 0,
    "markdown2": 10.5,
    "markdown3": 0,
    "markdown4": 0,
    "markdown5": 0,
    "cpi": 225.38,
    "unemployment": 7.5,
    "isHoliday": True
}

# Send the request
response = requests.post(url, json=data)

# Process the response
if response.status_code == 200:
    result = response.json()
    print(f"Predicted sales: {result['prediction']}")
    print(f"Confidence interval: {result['confidence_interval']}")
else:
    print(f"Error: {response.status_code}")
    print(response.text)`;

  const javascriptExample = `// Using fetch API
const apiUrl = 'https://your-sales-forecasting-api.com/api/predict';

const data = {
  store_id: 1,
  dept_id: 5,
  temperature: 75.5,
  fuel_price: 3.45,
  markdown1: 0,
  markdown2: 10.5,
  markdown3: 0,
  markdown4: 0,
  markdown5: 0,
  cpi: 225.38,
  unemployment: 7.5,
  isHoliday: true
};

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
  .then(response => response.json())
  .then(result => {
    console.log('Predicted sales:', result.prediction);
    console.log('Confidence interval:', result.confidence_interval);
  })
  .catch(error => {
    console.error('Error:', error);
  });`;

  const TabPanel = ({ children, value, index }) => {
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: <DescriptionIcon fontSize="small" /> },
    { id: 'api-reference', title: 'API Reference', icon: <ApiIcon fontSize="small" /> },
    { id: 'model-details', title: 'Model Details', icon: <CodeIcon fontSize="small" /> },
    { id: 'csv-format', title: 'CSV Format', icon: <ArticleIcon fontSize="small" /> },
    { id: 'faq', title: 'FAQs', icon: <HelpOutlineIcon fontSize="small" /> }
  ];

  const getSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'getting-started':
        return (
          <>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Getting Started with Predixio
            </Typography>
            <Typography variant="body1" paragraph>
              The Sales Forecasting and Optimization system uses advanced machine learning algorithms to predict future sales 
              based on historical data and various features such as store details, economic indicators, weather, and promotions.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Key Features:</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Chip label="1" color="primary" size="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Individual Store Predictions" 
                  secondary="Get sales forecasts for specific stores and departments" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Chip label="2" color="primary" size="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Batch Processing" 
                  secondary="Upload CSV files for bulk prediction operations" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Chip label="3" color="primary" size="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Data Visualization" 
                  secondary="Interactive charts and graphs for better insights" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Chip label="4" color="primary" size="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="API Integration" 
                  secondary="Easy integration with your existing systems" 
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>How It Works:</Typography>
            <Typography variant="body1" paragraph>
              Our system uses an ensemble of machine learning models including XGBoost, trained on historical sales data.
              The models take into account numerous factors such as holidays, promotions, economic indicators, and local events
              to provide accurate sales forecasts.
            </Typography>
          </>
        );
      case 'api-reference':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>API Reference</Typography>
            <Typography variant="body1" paragraph>
              Our REST API allows you to integrate sales forecasting capabilities into your applications.
              All endpoints accept and return JSON data (except for file uploads which use multipart/form-data).
            </Typography>
            
            {apiEndpoints.map((endpoint, index) => (
              <Paper 
                key={index} 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label={endpoint.method} 
                    color={endpoint.method === 'GET' ? 'info' : 'success'} 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {endpoint.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {endpoint.description}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Endpoint: <code>{endpoint.endpoint}</code>
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Request:</Typography>
                    <SyntaxHighlighter language="json" style={docco} customStyle={{ borderRadius: '4px' }}>
                      {endpoint.requestExample}
                    </SyntaxHighlighter>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Response:</Typography>
                    <SyntaxHighlighter language="json" style={docco} customStyle={{ borderRadius: '4px' }}>
                      {endpoint.responseExample}
                    </SyntaxHighlighter>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        );
      case 'model-details':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>Input Data Reference</Typography>
            <Typography variant="body1" paragraph>
              The model requires specific input features to generate accurate predictions.
              Here's a detailed description of each input parameter:
            </Typography>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
              <thead>
                <tr style={{ backgroundColor: theme.palette.action.hover }}>
                  <th style={{ padding: '10px', textAlign: 'left', border: `1px solid ${theme.palette.divider}` }}>Parameter</th>
                  <th style={{ padding: '10px', textAlign: 'left', border: `1px solid ${theme.palette.divider}` }}>Type</th>
                  <th style={{ padding: '10px', textAlign: 'left', border: `1px solid ${theme.palette.divider}` }}>Description</th>
                  <th style={{ padding: '10px', textAlign: 'left', border: `1px solid ${theme.palette.divider}` }}>Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}><code>store_id</code></td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>integer</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Unique identifier for the store</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>1</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}><code>dept_id</code></td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>integer</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Department identifier</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>5</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}><code>temperature</code></td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>float</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Average temperature for the forecast period (in Fahrenheit)</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>75.5</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}><code>fuel_price</code></td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>float</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Fuel price in the region (per gallon)</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>3.45</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}><code>markdown1-5</code></td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>float</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Promotional markdown values</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>10.5</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}><code>cpi</code></td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>float</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Consumer Price Index</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>225.38</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}><code>unemployment</code></td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>float</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Unemployment rate</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>7.5</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}><code>isHoliday</code></td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>boolean</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>Whether the forecast period includes a holiday</td>
                  <td style={{ padding: '10px', border: `1px solid ${theme.palette.divider}` }}>true</td>
                </tr>
              </tbody>
            </table>
          </Box>
        );
      case 'csv-format':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>Expected CSV Format</Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Your CSV should include the following columns:
            </Typography>
            
            <Box component="ul" sx={{ pl: 2 }}>
              {['Store', 'Temperature', 'Fuel_Price', 'CPI', 'Unemployment', 'Holiday_Flag', 'weekday', 'month', 'year'].map((col) => (
                <Box component="li" key={col} sx={{ mb: 0.5 }}>
                  <Typography variant="body2">
                    <Box component="span" sx={{ color: theme => theme.palette.accent.pink, fontWeight: 600 }}>{col}</Box> - 
                    {col === 'Store' && ' Store identifier number'}
                    {col === 'Temperature' && ' Temperature in Fahrenheit'}
                    {col === 'Fuel_Price' && ' Cost of fuel in the region'}
                    {col === 'CPI' && ' Consumer Price Index'}
                    {col === 'Unemployment' && ' Unemployment rate'}
                    {col === 'Holiday_Flag' && ' Whether the week is a holiday week (0 or 1)'}
                    {col === 'weekday' && ' Day of week (0-6)'}
                    {col === 'month' && ' Month (1-12)'}
                    {col === 'year' && ' Year (e.g., 2023)'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        );
      case 'faq':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>FAQs</Typography>
            <Typography variant="body1" paragraph>
              Here are some frequently asked questions about our system and its capabilities:
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>How accurate is the prediction?</Typography>
            <Typography variant="body1" paragraph>
              The accuracy of our predictions can vary depending on the complexity of the data and the specific model used.
              Generally, our models have a high level of accuracy, but it's important to validate predictions with actual data.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Can I customize the model?</Typography>
            <Typography variant="body1" paragraph>
              Yes, you can customize the model by training it on your own data or by selecting a different model from our available options.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>How long does it take to get results?</Typography>
            <Typography variant="body1" paragraph>
              The time it takes to get results depends on the size of the dataset and the complexity of the model.
              For batch predictions, it can take a few minutes to process a large dataset.
            </Typography>
          </Box>
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
              <Typography variant="h5" fontWeight={600}>
                {sections.find(s => s.id === selectedSection)?.title}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            {getSectionContent(selectedSection)}
          </ModernCard>
        </>
      ) : (
        <>
          <Paper elevation={1} sx={{ mb: 4, borderRadius: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="documentation tabs"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<DataObjectIcon />} label="Overview" />
              <Tab icon={<CodeIcon />} label="API Reference" />
              <Tab icon={<TableChartIcon />} label="Input Data" />
              <Tab icon={<IntegrationInstructionsIcon />} label="Integration" />
            </Tabs>
            
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>System Overview</Typography>
                {getSectionContent('getting-started')}
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>API Reference</Typography>
                {getSectionContent('api-reference')}
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>Input Data Reference</Typography>
                {getSectionContent('model-details')}
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>Expected CSV Format</Typography>
                {getSectionContent('csv-format')}
              </Box>
            </TabPanel>
          </Paper>
          
          <Grid container spacing={3}>
            {sections.map((section) => (
              <Grid item xs={12} md={6} key={section.id}>
                <ModernCard 
                  glowColor={section.id === 'getting-started' ? 'blue' : section.id === 'api-reference' ? 'pink' : section.id === 'model-details' ? 'green' : section.id === 'csv-format' ? 'purple' : 'pink'}
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
                      backgroundImage: `url(/images/${section.id === 'getting-started' ? 'img5.png' : 
                                                  section.id === 'api-reference' ? 'img2.png' : 
                                                  section.id === 'model-details' ? 'img3.png' : 
                                                  section.id === 'csv-format' ? 'img4.png' : 'img1.png'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 1 }}>
                      {section.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2, flexGrow: 1 }}>
                      {section.id === 'getting-started' && "Learn how to get started with our Sales Forecasting system."}
                      {section.id === 'api-reference' && "Explore our API endpoints for integration with your applications."}
                      {section.id === 'model-details' && "Understand the input data requirements for accurate predictions."}
                      {section.id === 'csv-format' && "Format your CSV files correctly for batch processing."}
                      {section.id === 'faq' && "Find answers to commonly asked questions about our system."}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <ModernButton 
                        color={section.id === 'getting-started' ? 'blue' : section.id === 'api-reference' ? 'pink' : section.id === 'model-details' ? 'green' : section.id === 'csv-format' ? 'purple' : 'pink'} 
                        variant="outlined"
                        onClick={() => setSelectedSection(section.id)}
                      >
                        {section.id === 'getting-started' ? 'Get Started' : section.id === 'api-reference' ? 'View API Reference' : section.id === 'model-details' ? 'View Input Data' : section.id === 'csv-format' ? 'View CSV Format' : 'View FAQs'}
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