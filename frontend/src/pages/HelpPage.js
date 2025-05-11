import React, { useState } from 'react';
import { 
  Typography, Box, Accordion, AccordionSummary, AccordionDetails,
  TextField, Grid, Divider, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Paper, Avatar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import ArticleIcon from '@mui/icons-material/Article';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import ModernCard from '../components/ModernCard';
import ModernButton from '../components/ModernButton';

const HelpPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [sentMessage, setSentMessage] = useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new message object
    const newMessage = {
      id: Date.now(), // Use timestamp as a simple unique ID
      sender: formData.name,
      email: formData.email,
      subject: formData.subject,
      content: formData.message,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      read: false,
      avatar: formData.name.charAt(0).toUpperCase(), // First letter of name as avatar
      sent: true // Mark this as a message sent by the user
    };
    
    // Get existing messages from localStorage or initialize empty array
    const existingMessages = JSON.parse(localStorage.getItem('userMessages') || '[]');
    
    // Add new message to the array
    const updatedMessages = [newMessage, ...existingMessages];
    
    // Save back to localStorage
    localStorage.setItem('userMessages', JSON.stringify(updatedMessages));
    
    // Set the sent message and open dialog
    setSentMessage(newMessage);
    setOpenDialog(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const faqs = [
    {
      question: 'How accurate are the sales forecasts?',
      answer: 'Our system typically achieves a mean absolute percentage error (MAPE) of 8-15% depending on the product category, store location, and time range. Forecasts are generally more accurate for shorter time horizons (1-4 weeks ahead) and for products with stable sales patterns.'
    },
    {
      question: 'How often is the forecasting model updated?',
      answer: 'The forecasting models are retrained weekly with the latest sales data to ensure they capture recent trends. However, the underlying model architecture is reviewed and potentially updated quarterly based on performance metrics.'
    },
    {
      question: 'Can I export the forecast results?',
      answer: 'Yes, all forecast results can be exported in CSV, Excel, or JSON formats. Look for the download button in the top right corner of any results page.'
    },
    {
      question: 'How many store locations and departments can I analyze at once?',
      answer: 'The standard version allows for up to 50 stores and 30 departments to be analyzed simultaneously. Enterprise customers have higher or unlimited limits depending on their subscription.'
    },
    {
      question: 'What data is needed to generate a forecast?',
      answer: 'At minimum, the system requires historical sales data, store information, and date. For optimal results, we recommend including additional features such as promotions, local events, holidays, weather data, and economic indicators.'
    },
    {
      question: 'How far into the future can the system predict?',
      answer: 'The system can generate forecasts for up to 12 months into the future. However, accuracy typically decreases as the forecast horizon extends, with best results in the 1-3 month range.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all data is encrypted both in transit and at rest. We follow industry best practices for data security and comply with regulations such as GDPR and CCPA. Additionally, we do not share your data with third parties.'
    }
  ];

  const supportLinks = [
    {
      title: 'FAQs',
      description: 'Find answers to common questions about our system',
      icon: <HelpOutlineIcon sx={{ fontSize: 48, mb: 1 }} />,
      color: 'blue'
    },
    {
      title: 'User Guide',
      description: 'Detailed instructions for using all features',
      icon: <ArticleIcon sx={{ fontSize: 48, mb: 1 }} />,
      color: 'pink'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides for common tasks',
      icon: <LiveHelpIcon sx={{ fontSize: 48, mb: 1 }} />,
      color: 'green'
    },
    {
      title: 'Contact Us',
      description: 'Get in touch with our support team',
      icon: <ContactSupportIcon sx={{ fontSize: 48, mb: 1 }} />,
      color: 'purple'
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Help & Support"
        subtitle="Find answers to your questions and get assistance with our system"
        icon={<HelpOutlineIcon />}
      />

      {/* Quick Links */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {supportLinks.map((link, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ModernCard 
              glowColor={link.color}
              sx={{ height: '100%', textAlign: 'center', p: 3 }}
            >
              <Box sx={{ 
                color: theme => theme.palette.accent[link.color],
                display: 'flex',
                justifyContent: 'center'
              }}>
                {link.icon}
              </Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                {link.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {link.description}
              </Typography>
            </ModernCard>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* FAQs */}
        <Grid item xs={12} md={7}>
          <ModernCard glowColor="blue" sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Frequently Asked Questions
            </Typography>
            <Box sx={{ mt: 3 }}>
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={handleChange(`panel${index}`)}
                  sx={{ 
                    mb: 1.5, 
                    '&:before': { display: 'none' },
                    bgcolor: 'background.paper',
                    boxShadow: 'none',
                    border: theme => `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px !important',
                    overflow: 'hidden'
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: theme => theme.palette.accent.blue }} />}
                    aria-controls={`panel${index}bh-content`}
                    id={`panel${index}bh-header`}
                    sx={{ 
                      backgroundColor: 'background.paper',
                      '&.Mui-expanded': {
                        borderBottom: theme => `1px solid ${theme.palette.divider}`
                      }
                    }}
                  >
                    <Typography sx={{ fontWeight: 500 }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2">{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </ModernCard>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={5}>
          <ModernCard glowColor="pink" sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Contact Support
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    name="name"
                    variant="outlined"
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Subject"
                    name="subject"
                    variant="outlined"
                    value={formData.subject}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={formData.message}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ModernButton
                    type="submit"
                    color="pink"
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                  >
                    Submit
                  </ModernButton>
                </Grid>
              </Grid>
            </form>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Other Ways to Reach Us
              </Typography>
              <Typography variant="body2">
                Email: datawizard@salesforecasting.com
              </Typography>
              <Typography variant="body2">
                Phone: (20) 1145424030
              </Typography>
              <Typography variant="body2">
                Hours: Monday-Friday, 9AM-5PM EST
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
      </Grid>

      {/* Dialog for sent message */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`,
            pb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon sx={{ color: 'success.main', mr: 2 }} />
            <Typography variant="h6">Message Sent Successfully</Typography>
          </Box>
          <IconButton edge="end" color="inherit" onClick={handleCloseDialog} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          {sentMessage && (
            <>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                p: 2,
                bgcolor: theme => theme.palette.action.hover,
                borderRadius: 1
              }}>
                <Avatar sx={{ mr: 2, bgcolor: theme => theme.palette.primary.main }}>
                  {sentMessage.avatar}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {sentMessage.sender}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {sentMessage.email}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                  {sentMessage.date}
                </Typography>
              </Box>
              
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {sentMessage.subject}
              </Typography>
              
              <Paper elevation={0} sx={{ 
                p: 3, 
                mb: 2, 
                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 2
              }}>
                <Typography variant="body1">
                  {sentMessage.content}
                </Typography>
              </Paper>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Your message has been saved. You can view all your messages in the Messages page.
              </Typography>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: theme => `1px solid ${theme.palette.divider}` }}>
          <ModernButton onClick={handleCloseDialog} color="grey" variant="outlined">
            Close
          </ModernButton>
          <ModernButton 
            onClick={() => { 
              handleCloseDialog(); 
              window.location.href = '/messages'; 
            }} 
            color="pink"
          >
            View All Messages
          </ModernButton>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default HelpPage;