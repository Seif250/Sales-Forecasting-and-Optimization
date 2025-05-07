import React from 'react';
import { Card, CardContent, useTheme } from '@mui/material';

// مكون البطاقة العصرية بنفس نمط صفحة الرئيسية للاستخدام في جميع الصفحات
const ModernCard = ({ children, glowColor, accentColor, sx = {} }) => {
  const theme = useTheme();
  
  let glowClass = '';
  let gradientColors = [theme.palette.accent.blue, theme.palette.accent.purple];
  
  // تحديد لون التوهج والتدرج اللوني حسب المدخلات
  switch (glowColor) {
    case 'blue':
      glowClass = 'glow-blue';
      gradientColors = [theme.palette.accent.blue, theme.palette.accent.purple];
      break;
    case 'pink':
      glowClass = 'glow-pink';
      gradientColors = [theme.palette.accent.pink, theme.palette.accent.purple];
      break;
    case 'green':
      glowClass = 'glow-green';
      gradientColors = [theme.palette.accent.green, theme.palette.accent.gold];
      break;
    case 'purple':
      glowClass = 'glow-purple';
      gradientColors = [theme.palette.accent.purple, theme.palette.accent.pink];
      break;
    default:
      break;
  }
  
  // إذا تم تحديد لون مباشرة
  if (accentColor) {
    gradientColors = Array.isArray(accentColor) ? accentColor : [accentColor, accentColor];
  }

  return (
    <Card 
      className={`modern-card ${glowClass}`}
      sx={{ 
        height: '100%',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${gradientColors[0]}, ${gradientColors[1]})`,
        },
        ...sx
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default ModernCard; 