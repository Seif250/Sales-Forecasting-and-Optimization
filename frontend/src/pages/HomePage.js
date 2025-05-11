import React from 'react';
import { 
  Container, Typography, Button, Box, Grid, Card, CardContent, 
  CardMedia, useTheme, useMediaQuery, Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsightsIcon from '@mui/icons-material/Insights';
import DescriptionIcon from '@mui/icons-material/Description';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const benefits = [
    {
      title: 'Accurate Predictions',
      description: 'Our AI model delivers highly accurate sales forecasts to help you plan inventory and staffing more effectively',
      icon: <TimelineIcon fontSize="large" color="primary" />
    },
    {
      title: 'AI-Powered Insights',
      description: 'Leverage machine learning to uncover hidden patterns and optimize your sales strategy',
      icon: <InsightsIcon fontSize="large" color="primary" />
    },
    {
      title: 'Easy-to-Use',
      description: 'Simple interface designed for business users - no technical expertise required',
      icon: <TrendingUpIcon fontSize="large" color="primary" />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ pt: 5, pb: 10 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 1,
          mb: 10
        }}
      >
        {/* Animated background particles */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: -1,
          overflow: 'hidden'
        }}>
          {/* Static elements to simulate particles */}
          <Box sx={{ 
            position: 'absolute',
            top: '30%',
            right: '20%',
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: theme.palette.accent.blue,
            opacity: 0.7,
            animation: 'pulsate-blue 3s infinite alternate',
          }} className="glow-blue" />

          <Box sx={{ 
            position: 'absolute',
            top: '40%',
            right: '30%',
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: theme.palette.accent.blue,
            opacity: 0.5,
            animation: 'pulsate-blue 2.5s infinite alternate',
          }} className="glow-blue" />

          <Box sx={{ 
            position: 'absolute',
            top: '25%',
            left: '40%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: theme.palette.accent.pink,
            opacity: 0.6,
            animation: 'pulsate-pink 3.2s infinite alternate',
          }} className="glow-pink" />

          <Box sx={{ 
            position: 'absolute',
            bottom: '35%',
            left: '25%',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: theme.palette.accent.pink,
            opacity: 0.7,
            animation: 'pulsate-pink 2.8s infinite alternate',
          }} className="glow-pink" />

          {/* Dashboard-like graphic */}
          <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            opacity: 0.7,
          }}>
            {/* Simulated elements */}
            <Box sx={{ 
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: '80%',
              height: '2px',
              backgroundColor: theme.palette.accent.gold,
              opacity: 0.6,
            }} />

            <Box sx={{ 
              position: 'absolute',
              top: '40%',
              left: '30%',
              width: '60%',
              height: '2px',
              backgroundColor: theme.palette.accent.gold,
              opacity: 0.6,
            }} />

            <Box sx={{ 
              position: 'absolute',
              top: '60%',
              left: '20%',
              width: '70%',
              height: '2px',
              backgroundColor: theme.palette.accent.gold,
              opacity: 0.6,
            }} />

            <Box sx={{ 
              position: 'absolute',
              top: '80%',
              left: '40%',
              width: '50%',
              height: '2px',
              backgroundColor: theme.palette.accent.gold,
              opacity: 0.6,
            }} />
          </Box>
        </Box>

        {/* Hero Content */}
        <Typography 
          variant="h2" 
          component="h1" 
          align="center"
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            mb: 3, 
            fontSize: { xs: '2.5rem', md: '3.75rem' },
            background: 'linear-gradient(90deg, #4d69fa, #ff6e86)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 2px 10px rgba(77, 105, 250, 0.3)'
          }}
        >
          Predixio
        </Typography>

        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary" 
          paragraph 
          sx={{ 
            maxWidth: '800px', 
            mx: 'auto', 
            mb: 6,
            opacity: 0.8
          }}
        >
          Harness the power of AI to predict future sales and make data-driven business decisions
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            to="/analyze" 
            sx={{ 
              borderRadius: '30px', 
              px: 4, 
              py: 1.5,
              background: 'linear-gradient(45deg, #4d69fa, #5d79ff)',
              boxShadow: '0 4px 20px rgba(77, 105, 250, 0.5)',
              '&:hover': {
                background: 'linear-gradient(45deg, #3d59ea, #4d69fa)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(77, 105, 250, 0.6)',
              }
            }}
          >
            Try Forecast Now
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            component={Link} 
            to="/docs"
            sx={{ 
              borderRadius: '30px', 
              px: 4, 
              py: 1.5,
              borderColor: theme.palette.accent.pink,
              color: theme.palette.accent.pink,
              '&:hover': {
                borderColor: theme.palette.accent.pink,
                backgroundColor: 'rgba(255, 110, 134, 0.05)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Learn More
          </Button>
        </Box>

        {/* Scroll indicator */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 30, 
            left: '50%', 
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 100%': {
                transform: 'translateX(-50%) translateY(0)',
              },
              '50%': {
                transform: 'translateX(-50%) translateY(10px)',
              },
            },
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 1, textAlign: 'center' }}
          >
            Explore More
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <KeyboardArrowDownIcon color="secondary" />
          </Box>
        </Box>
      </Box>

      {/* Benefits Section */}
      <Typography 
        variant="h4" 
        component="h2" 
        textAlign="center" 
        sx={{ 
          mb: 5,
          fontWeight: 600,
          fontSize: { xs: '1.75rem', md: '2.25rem' },
        }}
      >
        Why Choose Our Platform
      </Typography>

      {/* Benefits Cards */}
      <Grid container spacing={3} sx={{ mb: 10 }}>
        {benefits.map((benefit, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              className="modern-card" 
              sx={{ 
                height: '100%', 
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: index === 0 
                    ? `linear-gradient(90deg, ${theme.palette.accent.blue}, ${theme.palette.accent.purple})`
                    : index === 1
                      ? `linear-gradient(90deg, ${theme.palette.accent.pink}, ${theme.palette.accent.purple})`
                      : `linear-gradient(90deg, ${theme.palette.accent.green}, ${theme.palette.accent.gold})`,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ 
                  mb: 2, 
                  color: index === 0 
                    ? theme.palette.accent.blue
                    : index === 1
                      ? theme.palette.accent.pink
                      : theme.palette.accent.green
                }}>
                  {benefit.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {benefit.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CTA Section */}
      <Box 
        sx={{ 
          p: 6,
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark' ? 
            '0 10px 40px rgba(0, 0, 0, 0.3)' : 
            '0 10px 40px rgba(0, 0, 0, 0.1)',
          background: theme.palette.mode === 'dark' ? 
            'linear-gradient(135deg, rgba(18, 18, 25, 0.95), rgba(18, 18, 25, 0.7))' : 
            'linear-gradient(135deg, rgba(245, 247, 250, 0.95), rgba(255, 255, 255, 0.85))',
          backdropFilter: 'blur(10px)',
          border: theme.palette.mode === 'dark' ? 
            '1px solid rgba(255, 255, 255, 0.05)' : 
            '1px solid rgba(0, 0, 0, 0.05)',
          animation: 'pulsate-pink 3s infinite alternate',
        }}
        className="glow-pink"
      >
        {/* Background elements */}
        <Box sx={{ 
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(77, 105, 250, 0.2) 0%, rgba(77, 105, 250, 0) 70%)',
        }} 
        className="glow-blue" />
        
        <Box sx={{ 
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 110, 134, 0.15) 0%, rgba(255, 110, 134, 0) 70%)',
        }} 
        className="glow-pink" />

        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          sx={{ 
            mb: 3,
            fontWeight: 700,
            background: theme.palette.mode === 'dark' ? 
              'linear-gradient(90deg, #ffffff, #a0a0a0)' : 
              'linear-gradient(90deg, #172b4d, #2c3e50)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Ready to optimize your sales strategy?
        </Typography>
        
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            mb: 4,
            maxWidth: '700px',
            mx: 'auto',
            color: 'text.secondary',
          }}
        >
          Start making data-driven decisions today with our powerful AI-driven sales forecasting platform.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={Link}
            to="/dashboard"
            sx={{ 
              borderRadius: '30px', 
              px: 4, 
              py: 1.5,
              boxShadow: '0 4px 20px rgba(255, 110, 134, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(255, 110, 134, 0.4)',
              }
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage; 