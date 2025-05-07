import React from 'react';
import { Grid, Typography, Box, Chip, Avatar } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import ModernCard from '../components/ModernCard';
import ModernButton from '../components/ModernButton';

const BlogPage = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'Improving Sales Forecasting Accuracy with Machine Learning',
      excerpt: 'Learn how modern ML techniques can enhance your retail sales predictions...',
      date: 'April 15, 2024',
      author: 'Seif Ezz',
      image: '/images/img5.png',
      tags: ['Machine Learning', 'Forecasting', 'Retail'],
      color: 'blue'
    },
    {
      id: 2,
      title: 'The Impact of Holidays on Retail Sales Patterns',
      excerpt: 'Our analysis reveals key patterns in how different holidays affect consumer behavior...',
      date: 'March 22, 2024',
      author: 'Seif Mohamed',
      image: '/images/img2.png',
      tags: ['Holiday Shopping', 'Analysis', 'Retail Trends'],
      color: 'pink'
    },
    {
      id: 3,
      title: 'Economic Indicators That Influence Retail Performance',
      excerpt: 'Discover which economic factors have the strongest correlation with sales fluctuations...',
      date: 'February 8, 2024',
      author: 'Yousef Aymen',
      image: '/images/img3.png',
      tags: ['Economics', 'Retail', 'Analysis'],
      color: 'green'
    },
    {
      id: 4,
      title: 'Comparing XGBoost and Linear Regression for Sales Prediction',
      excerpt: 'A detailed performance comparison of different ML models on retail sales data...',
      date: 'January 30, 2024',
      author: 'Mohamed Tarek',
      image: '/images/img4.png',
      tags: ['Machine Learning', 'XGBoost', 'Linear Regression'],
      color: 'purple'
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Blog & Insights"
        subtitle="Learn about sales forecasting techniques, industry trends, and how to leverage data for better business decisions."
        icon={<BookIcon />}
      />
      
      <Grid container spacing={4}>
        {/* Featured post */}
        <Grid item xs={12}>
          <ModernCard 
            glowColor="blue"
            sx={{
              position: 'relative',
              p: 0,
              overflow: 'hidden'
            }}
          >
            <Box sx={{
              background: `url(/images/img1.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: { xs: 200, md: 400 },
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(18,18,25,0.3), rgba(18,18,25,0.9))',
                zIndex: 1
              }
            }}>
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                p: 4,
                width: '100%',
                zIndex: 2
              }}>
                <Chip 
                  label="Featured" 
                  size="small" 
                  sx={{ 
                    mb: 2, 
                    bgcolor: theme => theme.palette.accent.blue,
                    color: 'white',
                    fontWeight: 600
                  }} 
                />
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                  Build Better Sales Strategies with Data-Driven Predictions
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                  How top retailers are leveraging machine learning to gain a competitive advantage in today's dynamic market.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <ModernButton color="blue">
                    Read Article
                  </ModernButton>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    <Typography variant="body2">May 5, 2023</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </ModernCard>
        </Grid>
        
        {/* Blog posts grid */}
        {blogPosts.map((post) => (
          <Grid item xs={12} md={6} lg={3} key={post.id}>
            <ModernCard 
              glowColor={post.color}
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
                  backgroundImage: `url(${post.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 1 }}>
                  {post.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2, flexGrow: 1 }}>
                  {post.excerpt}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {post.tags.map((tag, index) => (
                    <Chip 
                      key={index} 
                      label={tag} 
                      size="small" 
                      sx={{ 
                        bgcolor: theme => `${theme.palette.accent[post.color]}15`,
                        color: theme => theme.palette.accent[post.color],
                        fontSize: '0.7rem'
                      }} 
                    />
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: theme => theme.palette.accent[post.color] }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {post.author}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    {post.date}
                  </Typography>
                </Box>
              </Box>
            </ModernCard>
          </Grid>
        ))}
        
        {/* Categories section */}
        <Grid item xs={12}>
          <ModernCard glowColor="pink">
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Popular Categories
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {[
                'Machine Learning',
                'Retail Analysis',
                'Data Science',
                'Business Intelligence',
                'Sales Forecasting',
                'Economic Indicators',
                'Market Trends',
                'XGBoost',
                'Neural Networks',
                'Customer Behavior',
                'Seasonal Patterns',
                'Regression Analysis'
              ].map((category, index) => (
                <Chip 
                  key={index} 
                  label={category} 
                  sx={{ 
                    bgcolor: theme => `${theme.palette.accent[['blue', 'pink', 'green', 'purple'][index % 4]]}15`,
                    color: theme => theme.palette.accent[['blue', 'pink', 'green', 'purple'][index % 4]],
                    '&:hover': {
                      bgcolor: theme => `${theme.palette.accent[['blue', 'pink', 'green', 'purple'][index % 4]]}25`,
                    },
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }} 
                />
              ))}
            </Box>
          </ModernCard>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default BlogPage;