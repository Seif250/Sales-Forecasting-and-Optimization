import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  useMediaQuery, 
  useTheme,
  Switch
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsightsIcon from '@mui/icons-material/Insights';
import BookIcon from '@mui/icons-material/Book';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const Header = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', text: 'Home', icon: <HomeIcon fontSize="small" sx={{ mr: 0.5 }} /> },
    { path: '/dashboard', text: 'Dashboard', icon: <DashboardIcon fontSize="small" sx={{ mr: 0.5 }} /> },
    { path: '/analyze', text: 'Data Analyzer', icon: <AnalyticsIcon fontSize="small" sx={{ mr: 0.5 }} /> },
    { path: '/visualize', text: 'Insights', icon: <InsightsIcon fontSize="small" sx={{ mr: 0.5 }} /> },
    { path: '/blog', text: 'Blog', icon: <BookIcon fontSize="small" sx={{ mr: 0.5 }} /> },
    { path: '/docs', text: 'Documentation', icon: <ArticleIcon fontSize="small" sx={{ mr: 0.5 }} /> },
    { path: '/messages', text: 'Messages', icon: <MailOutlineIcon fontSize="small" sx={{ mr: 0.5 }} /> },
    { path: '/about', text: 'About', icon: <InfoIcon fontSize="small" sx={{ mr: 0.5 }} /> },
    { path: '/help', text: 'Help', icon: <HelpIcon fontSize="small" sx={{ mr: 0.5 }} /> },
  ];

  return (
    <AppBar 
      position="fixed" 
      elevation={4} 
      sx={{ 
        background: theme.palette.mode === 'dark' ? 
          'linear-gradient(90deg, #121219, #181825)' : 
          'linear-gradient(90deg, #ffffff, #f5f7fa)',
        boxShadow: theme.palette.mode === 'dark' ? 
          '0 4px 20px rgba(0,0,0,0.2)' : 
          '0 4px 20px rgba(0,0,0,0.05)',
        borderBottom: theme.palette.mode === 'dark' ? 
          '1px solid rgba(255,255,255,0.08)' : 
          '1px solid rgba(0,0,0,0.05)',
        mb: 4,
        zIndex: theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ maxWidth: '1280px', width: '100%', mx: 'auto', px: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: { xs: 1, md: 0 } }}>
          <img 
            src={`${process.env.PUBLIC_URL}/images/logo.png`}
            alt="Predix Logo" 
            style={{ 
              height: '40px', 
              marginRight: '12px',
              borderRadius: '8px',
              boxShadow: '0 0 15px rgba(77, 105, 250, 0.7)'
            }} 
          />
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              fontSize: '1.5rem',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(90deg, #4d69fa, #ff6e86)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mr: 2,
              textShadow: '0 0 20px rgba(77, 105, 250, 0.5)'
            }}
          >
            Predix
          </Typography>
        </Box>
        
        {isMobile ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                sx={{ 
                  ml: 1, 
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#172b4d'
                }}
                onClick={toggleDarkMode}
                size="small"
              >
                {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
              <IconButton
                edge="end"
                sx={{ 
                  ml: 1, 
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#172b4d'
                }}
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {navItems.map((item) => (
                <MenuItem 
                  key={item.path} 
                  onClick={handleClose} 
                  component={Link} 
                  to={item.path}
                  selected={isActive(item.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {item.icon}
                  {item.text}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button 
                key={item.path}
                component={Link} 
                to={item.path}
                startIcon={item.icon}
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#172b4d',
                  mx: 0.5,
                  px: 1.5,
                  fontWeight: isActive(item.path) ? 600 : 400,
                  position: 'relative',
                  '&:after': isActive(item.path) ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #4d69fa, #ff6e86)',
                    borderRadius: '2px',
                    boxShadow: '0 0 10px rgba(77, 105, 250, 0.7)'
                  } : {},
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 
                      'rgba(255, 255, 255, 0.1)' : 
                      'rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                {item.text}
              </Button>
            ))}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              ml: 2,
              pl: 2,
              borderLeft: theme.palette.mode === 'dark' ? 
                '1px solid rgba(255,255,255,0.2)' : 
                '1px solid rgba(0,0,0,0.1)'
            }}>
              <IconButton
                onClick={toggleDarkMode}
                size="small"
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#172b4d'
                }}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 