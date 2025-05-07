import React from 'react';
import { Container, Box, Paper, useTheme, useMediaQuery } from '@mui/material';

// مكون تخطيط الصفحة المستخدم في جميع صفحات التطبيق
const PageLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        pt: { xs: 8, md: 9 },
        pb: { xs: 5, md: 8 },
        mt: { xs: 2, md: 4 }, 
        mb: { xs: 5, md: 8 }
      }}
    >
      <Box>
        {/* محتوى الصفحة */}
        {children}
      </Box>
    </Container>
  );
};

export default PageLayout;