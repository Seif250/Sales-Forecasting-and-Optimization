import React from 'react';
import { Card, CardContent, useTheme } from '@mui/material';

// مكون البطاقة العصرية بنفس نمط صفحة الرئيسية للاستخدام في جميع الصفحات
const ModernCard = ({ children, glowColor, accentColor, sx = {} }) => {
  const theme = useTheme();
  
  let glowClass = '';
  let gradientColors = [theme.palette.accent.blue, theme.palette.accent.purple];
  let animationName = '';
  
  // تحديد لون التوهج والتدرج اللوني حسب المدخلات
  switch (glowColor) {
    case 'blue':
      glowClass = 'glow-blue';
      gradientColors = [theme.palette.accent.blue, theme.palette.accent.purple];
      animationName = 'pulsate-blue';
      break;
    case 'pink':
      glowClass = 'glow-pink';
      gradientColors = [theme.palette.accent.pink, theme.palette.accent.purple];
      animationName = 'pulsate-pink';
      break;
    case 'green':
      glowClass = 'glow-green';
      gradientColors = [theme.palette.accent.green, theme.palette.accent.gold];
      animationName = 'pulsate-green';
      break;
    case 'purple':
      glowClass = 'glow-purple';
      gradientColors = [theme.palette.accent.purple, theme.palette.accent.pink];
      animationName = 'pulsate-purple';
      break;
    default:
      glowClass = 'glow-blue';
      animationName = 'pulsate-blue';
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
        animation: `${animationName} 3s infinite alternate`,
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${gradientColors[0]}, ${gradientColors[1]})`,
        },
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.palette.mode === 'dark' ? 
            `0 0 20px ${gradientColors[0]}99, 0 0 40px ${gradientColors[0]}44` : 
            `0 0 20px ${gradientColors[0]}66, 0 0 40px ${gradientColors[0]}22`,
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