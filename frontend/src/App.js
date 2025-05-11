import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import VisualizationPage from './pages/VisualizationPage';
import BlogPage from './pages/BlogPage';
import DocumentationPage from './pages/DocumentationPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import DataAnalyzer from './pages/DataAnalyzer';
import MessagesPage from './pages/MessagesPage';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  // Create a custom theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#4d69fa',
        light: '#7994ff',
        dark: '#2541c7',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#ff6e86',
        light: '#ff9bac',
        dark: '#c83e55',
        contrastText: '#ffffff',
      },
      accent: {
        blue: '#4d69fa',
        pink: '#ff6e86',
        purple: '#9c6eff',
        green: '#36d7b7',
        gold: '#ffcb45',
      },
      background: {
        default: darkMode ? '#0a0a10' : '#f5f7fa',
        paper: darkMode ? '#121219' : '#ffffff',
        header: darkMode ? '#000000' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e6e6e6' : '#172b4d',
        secondary: darkMode ? '#a0a0a0' : '#6b778c',
      }
    },
    typography: {
      fontFamily: [
        '"Inter"',
        '"Segoe UI"',
        'Roboto',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: darkMode ? '#121219' : '#ffffff',
            backgroundImage: darkMode ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))' : 'none',
            boxShadow: darkMode ? 
              '0 0 15px rgba(77, 105, 250, 0.3), 0 0 30px rgba(77, 105, 250, 0.1)' : 
              '0 0 15px rgba(77, 105, 250, 0.1), 0 0 30px rgba(77, 105, 250, 0.05)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
            animation: 'pulsate-blue 3s infinite alternate',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: darkMode ? 
                '0 0 20px rgba(77, 105, 250, 0.5), 0 0 40px rgba(77, 105, 250, 0.2)' : 
                '0 0 20px rgba(77, 105, 250, 0.2), 0 0 40px rgba(77, 105, 250, 0.1)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#000000' : '#ffffff',
            color: darkMode ? '#ffffff' : '#172b4d',
          },
        },
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/visualize" element={<VisualizationPage />} />
          <Route path="/analyze" element={<DataAnalyzer />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App; 