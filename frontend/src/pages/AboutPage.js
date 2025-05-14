import React from 'react';
import { Typography, Box, Grid, Chip, Divider, Avatar } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';
import BuildIcon from '@mui/icons-material/Build';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import ModernCard from '../components/ModernCard';
import ModernButton from '../components/ModernButton';

const AboutPage = () => {  const technologies = [
    {
      category: 'Frontend',
      icon: <CodeIcon fontSize="large" />,
      items: ['React', 'Material UI', 'Recharts', 'React Router Dom'],
      color: 'blue'
    },
    {
      category: 'Backend',
      icon: <StorageIcon fontSize="large" />,
      items: ['Python', 'FastAPI', 'SQLAlchemy', 'PostgreSQL'],
      color: 'pink'
    },
    {
      category: 'Machine Learning',
      icon: <BarChartIcon fontSize="large" />,
      items: ['XGBoost', 'Scikit-learn', 'Pandas', 'NumPy'],
      color: 'green'
    }
  ];

  const teamMembers = [
    {
      role: 'Data Science',
      description: 'Responsible for developing and training the machine learning models, feature engineering, and continuous model improvement based on performance metrics.',
      color: 'blue',
      image: '/images/img3.png'
    },
    {
      role: 'Backend Development',
      description: 'Created the API infrastructure, database design, data processing pipelines, and integrated the machine learning models into the production environment.',
      color: 'pink',
      image: '/images/img5.png'
    },
    {
      role: 'Frontend Development',
      description: 'Designed and implemented the user interface, data visualization components, and ensured a responsive, intuitive user experience across devices.',
      color: 'green',
      image: '/images/img2.png'
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="About Our Project"
        subtitle="Learn about our Sales Forecasting and Optimization system and the team behind it."
        icon={<InfoIcon />}
      />

      <ModernCard glowColor="blue" sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
          Project Overview
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              The Sales Forecasting and Optimization project was developed to help retail businesses make data-driven decisions 
              by accurately predicting future sales based on historical patterns and external factors.
            </Typography>
            <Typography variant="body1" paragraph>
              This system allows retailers to optimize inventory management, staffing, and marketing strategies by providing
              reliable sales predictions at both the store and department levels.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/img4.png"
              alt="AI Data Analysis"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              }}
            />
          </Grid>
        </Grid>
      </ModernCard>
      
      <ModernCard glowColor="pink" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <BusinessIcon sx={{ fontSize: 28, mr: 2, color: theme => theme.palette.accent.pink }} />
          <Typography variant="h5" fontWeight={600}>
            Our Story
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          The project began as a response to the challenges faced by retail businesses in predicting sales accurately
          during volatile market conditions. Traditional forecasting methods often failed to account for complex 
          interactions between various factors such as holidays, weather, economic indicators, and marketing campaigns.
        </Typography>
        
        <Typography variant="body1" paragraph>
          By leveraging advanced machine learning techniques and big data analytics, we've created a solution that can
          identify patterns and relationships that would be impossible to detect using conventional forecasting methods.
        </Typography>
        
        <Typography variant="body1" paragraph>
          The system has been trained on extensive historical data from multiple retail stores, incorporating features
          such as promotional events, seasonal trends, local economic indicators, and even weather patterns to deliver
          highly accurate predictions.
        </Typography>
      </ModernCard>
      
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CodeIcon sx={{ fontSize: 28, mr: 2, color: theme => theme.palette.accent.blue }} />
          <Typography variant="h5" fontWeight={600}>
            Technologies Used
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {technologies.map((tech, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ModernCard 
                glowColor={tech.color}
                sx={{ height: '100%' }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 2,
                  color: theme => theme.palette.accent[tech.color]
                }}>
                  {tech.icon}
                </Box>
                <Typography variant="h6" align="center" gutterBottom fontWeight={600}>
                  {tech.category}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  justifyContent: 'center' 
                }}>
                  {tech.items.map((item, i) => (
                    <Chip 
                      key={i} 
                      label={item} 
                      size="small" 
                      sx={{ 
                        bgcolor: theme => `${theme.palette.accent[tech.color]}15`,
                        color: theme => theme.palette.accent[tech.color],
                      }}
                    />
                  ))}
                </Box>
              </ModernCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PeopleIcon sx={{ fontSize: 28, mr: 2, color: theme => theme.palette.accent.green }} />
          <Typography variant="h5" fontWeight={600}>
            The Team
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          Our team consists of data scientists, machine learning engineers, and full-stack developers passionate about
          creating innovative solutions for real-world business problems.
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <ModernCard 
                glowColor={member.color}
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
                    backgroundImage: `url(${member.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.description}
                  </Typography>
                </Box>
              </ModernCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageLayout>
  );
};

export default AboutPage;