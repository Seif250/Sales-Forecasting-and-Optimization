import React from 'react';
import { Button, useTheme } from '@mui/material';

// مكون الزر العصري بنفس نمط صفحة الرئيسية للاستخدام في جميع الصفحات
const ModernButton = ({ 
  variant = 'contained', 
  color = 'blue',
  children, 
  startIcon,
  endIcon,
  fullWidth = false,
  ...props 
}) => {
  const theme = useTheme();
  
  // تحديد الألوان والتأثيرات حسب نوع الزر واللون المحدد
  const getStyles = () => {
    if (variant === 'contained') {
      // أزرار مملوءة بالألوان
      let gradientStart, gradientEnd, shadowColor;
      
      switch (color) {
        case 'pink':
          gradientStart = theme.palette.accent.pink;
          gradientEnd = theme.palette.accent.purple;
          shadowColor = `${theme.palette.accent.pink}50`;
          break;
        case 'green':
          gradientStart = theme.palette.accent.green;
          gradientEnd = theme.palette.accent.gold;
          shadowColor = `${theme.palette.accent.green}50`;
          break;
        case 'purple':
          gradientStart = theme.palette.accent.purple;
          gradientEnd = theme.palette.accent.pink;
          shadowColor = `${theme.palette.accent.purple}50`;
          break;
        case 'blue':
        default:
          gradientStart = theme.palette.accent.blue;
          gradientEnd = '#5d79ff';
          shadowColor = `${theme.palette.accent.blue}50`;
      }
      
      return {
        borderRadius: '30px',
        px: 3,
        py: 1,
        background: `linear-gradient(45deg, ${gradientStart}, ${gradientEnd})`,
        boxShadow: `0 4px 15px ${shadowColor}`,
        color: '#fff',
        '&:hover': {
          background: `linear-gradient(45deg, ${gradientEnd}, ${gradientStart})`,
          boxShadow: `0 6px 20px ${shadowColor}`,
          transform: 'translateY(-2px)'
        }
      };
    } else {
      // أزرار محددة الحدود
      let borderColor, textColor, hoverBgColor;
      
      switch (color) {
        case 'pink':
          borderColor = theme.palette.accent.pink;
          textColor = theme.palette.accent.pink;
          hoverBgColor = `${theme.palette.accent.pink}10`;
          break;
        case 'green':
          borderColor = theme.palette.accent.green;
          textColor = theme.palette.accent.green;
          hoverBgColor = `${theme.palette.accent.green}10`;
          break;
        case 'purple':
          borderColor = theme.palette.accent.purple;
          textColor = theme.palette.accent.purple;
          hoverBgColor = `${theme.palette.accent.purple}10`;
          break;
        case 'blue':
        default:
          borderColor = theme.palette.accent.blue;
          textColor = theme.palette.accent.blue;
          hoverBgColor = `${theme.palette.accent.blue}10`;
      }
      
      return {
        borderRadius: '30px',
        px: 3,
        py: 1,
        borderColor: borderColor,
        color: textColor,
        '&:hover': {
          borderColor: borderColor,
          backgroundColor: hoverBgColor,
          transform: 'translateY(-2px)'
        }
      };
    }
  };

  return (
    <Button 
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      sx={{
        ...getStyles(),
        fontWeight: 500,
        transition: 'all 0.3s ease',
        textTransform: 'none',
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ModernButton; 