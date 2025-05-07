import React from 'react';
import { 
  Grid, 
  Typography, 
  Button, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Link } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import ModernCard from '../components/ModernCard';

const Dashboard = () => {
  // معلومات البطاقات السريعة
  const quickActions = [
    {
      title: 'Store Analysis',
      description: 'View sales performance across different stores and identify top performers and areas for improvement.',
      icon: <StorefrontIcon fontSize="large" />,
      linkTo: '/visualize',
      buttonText: 'View Analysis',
      color: 'blue'
    },
    {
      title: 'Data Analysis',
      description: 'Analyze your sales data with advanced statistical tools and gain insights about your business.',
      icon: <AnalyticsIcon fontSize="large" />,
      linkTo: '/analyze',
      buttonText: 'Analyze Data',
      color: 'pink'
    },
    {
      title: 'Trends & Patterns',
      description: 'Explore seasonal trends, holiday effects, and other patterns in sales data through interactive visualizations.',
      icon: <AssessmentIcon fontSize="large" />,
      linkTo: '/visualize',
      buttonText: 'Explore Trends',
      color: 'purple'
    }
  ];

  return (
    <PageLayout>
      {/* عنوان الصفحة */}
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome to the Predixio forecasting platform. This dashboard allows you to analyze sales data and view historical sales patterns."
        icon={<DashboardIcon />}
      />

      {/* بطاقات الإجراءات السريعة */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} md={4} key={index}>
            <ModernCard glowColor={action.color}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ color: theme => theme.palette.accent[action.color], mr: 1.5 }}>
                  {action.icon}
                </Box>
                <Typography variant="h5" component="div" fontWeight={600}>
                  {action.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {action.description}
              </Typography>
              <Button 
                component={Link} 
                to={action.linkTo} 
                variant="contained"
                fullWidth
                sx={{ 
                  borderRadius: '30px',
                  background: `linear-gradient(45deg, ${theme => theme.palette.accent[action.color]}, ${theme => action.color === 'green' ? theme.palette.accent.gold : action.color === 'blue' ? theme.palette.accent.purple : theme.palette.accent.purple})`,
                  boxShadow: `0 4px 15px ${theme => theme.palette.accent[action.color]}40`,
                  '&:hover': {
                    boxShadow: `0 6px 20px ${theme => theme.palette.accent[action.color]}60`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {action.buttonText}
              </Button>
            </ModernCard>
          </Grid>
        ))}
      </Grid>

      {/* مقارنة النماذج */}
      <ModernCard glowColor="blue">
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Data Analysis Features
        </Typography>
        <Typography variant="body2" paragraph color="text.secondary">
          Our platform offers multiple analytical tools to help you understand your sales data:
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Feature</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Benefits</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Visualization Tools</TableCell>
                <TableCell>Interactive charts and graphs to explore sales patterns</TableCell>
                <TableCell>Identify trends and seasonality at a glance</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Data Preprocessing</TableCell>
                <TableCell>Cleaning and transformation of raw sales data</TableCell>
                <TableCell>Improve data quality for better analysis</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Statistical Analysis</TableCell>
                <TableCell>Advanced statistical methods to analyze sales factors</TableCell>
                <TableCell>Understand what drives your sales performance</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Reporting Tools</TableCell>
                <TableCell>Generate comprehensive reports on sales performance</TableCell>
                <TableCell>Share insights with stakeholders effectively</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            component={Link} 
            to="/visualize" 
            variant="contained"
            sx={{ 
              borderRadius: '30px',
              px: 3,
              background: 'linear-gradient(45deg, #4d69fa, #5d79ff)',
              boxShadow: '0 4px 15px rgba(77, 105, 250, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(77, 105, 250, 0.6)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Explore Visualizations
          </Button>
          <Button 
            component={Link} 
            to="/analyze" 
            variant="outlined"
            sx={{ 
              borderRadius: '30px', 
              px: 3,
              borderColor: theme => theme.palette.accent.pink,
              color: theme => theme.palette.accent.pink,
              '&:hover': {
                borderColor: theme => theme.palette.accent.pink,
                backgroundColor: 'rgba(255, 110, 134, 0.05)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Analyze Data
          </Button>
        </Box>
      </ModernCard>
    </PageLayout>
  );
};

export default Dashboard; 