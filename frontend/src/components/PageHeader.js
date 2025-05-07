import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

// مكون للعناوين الرئيسية للصفحات بنمط موحد
const PageHeader = ({ title, subtitle, icon }) => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        mb: 5,
        position: 'relative'
      }}
    >
      {/* العنوان الرئيسي */}
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          fontWeight: 700, 
          mb: 1,
          background: 'linear-gradient(90deg, #4d69fa, #ff6e86)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.5
        }}
      >
        {icon && <Box component="span" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          fontSize: 'inherit',
          color: theme.palette.accent.blue
        }}>
          {icon}
        </Box>}
        {title}
      </Typography>
      
      {/* العنوان الفرعي */}
      {subtitle && (
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            maxWidth: '800px', 
            opacity: 0.8 
          }}
        >
          {subtitle}
        </Typography>
      )}

      {/* خط تزييني تحت العنوان */}
      <Box sx={{ 
        mt: 2,
        height: '3px',
        width: '80px',
        borderRadius: '3px',
        background: `linear-gradient(90deg, ${theme.palette.accent.blue}, ${theme.palette.accent.pink})`,
      }} />
    </Box>
  );
};

export default PageHeader; 