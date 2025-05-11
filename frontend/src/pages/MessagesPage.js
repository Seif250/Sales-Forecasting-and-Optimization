import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Container, Grid, Divider, Avatar,
  List, ListItem, ListItemAvatar, ListItemText, Paper,
  TextField, IconButton
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SendIcon from '@mui/icons-material/Send';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import ArchiveIcon from '@mui/icons-material/Archive';
import PersonIcon from '@mui/icons-material/Person';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import ModernCard from '../components/ModernCard';
import ModernButton from '../components/ModernButton';

const MessagesPage = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState([]);
  
  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('userMessages') || '[]');
    setMessages(storedMessages);
  }, []);
  
  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setReplyText('');
    
    // Mark message as read
    if (!message.read) {
      const updatedMessages = messages.map(msg => 
        msg.id === message.id ? { ...msg, read: true } : msg
      );
      setMessages(updatedMessages);
      localStorage.setItem('userMessages', JSON.stringify(updatedMessages));
    }
  };

  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  const handleSendReply = () => {
    if (replyText.trim() === '') return;
    
    // Create a reply message
    const replyMessage = {
      id: Date.now(),
      sender: 'Support Team',
      email: 'support@salesforecasting.com',
      subject: `Re: ${selectedMessage.subject}`,
      content: replyText,
      date: new Date().toISOString().split('T')[0],
      read: true,
      avatar: 'S',
      isReply: true,
      replyTo: selectedMessage.id
    };
    
    // Add to messages
    const updatedMessages = [replyMessage, ...messages];
    setMessages(updatedMessages);
    localStorage.setItem('userMessages', JSON.stringify(updatedMessages));
    
    // Clear reply text
    setReplyText('');
    
    // Show confirmation
    alert('Your reply has been sent!');
  };

  const handleDeleteMessage = (messageId) => {
    // Filter out the deleted message
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    
    // Update state and localStorage
    setMessages(updatedMessages);
    localStorage.setItem('userMessages', JSON.stringify(updatedMessages));
    
    // Clear selected message if it was deleted
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(null);
    }
  };

  // Message category links with dynamic counts
  const messageCategories = [
    {
      title: 'Inbox',
      description: 'View all received messages',
      icon: <InboxIcon sx={{ fontSize: 48, mb: 1 }} />,
      color: 'blue',
      count: messages.filter(m => !m.read).length
    },
    {
      title: 'Sent',
      description: 'View your sent messages',
      icon: <SendIcon sx={{ fontSize: 48, mb: 1 }} />,
      color: 'pink',
      count: messages.filter(m => m.sent).length
    },
    {
      title: 'All Messages',
      description: 'View all messages',
      icon: <MailOutlineIcon sx={{ fontSize: 48, mb: 1 }} />,
      color: 'green',
      count: messages.length
    },
    {
      title: 'Archived',
      description: 'Previously archived messages',
      icon: <ArchiveIcon sx={{ fontSize: 48, mb: 1 }} />,
      color: 'purple',
      count: 0
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Messages"
        subtitle="Manage your communications and stay updated"
        icon={<MailOutlineIcon />}
      />

      {/* Message Categories */}
      <Grid container spacing={3} sx={{ mb: 5 }} className="fade-in">
        {messageCategories.map((category, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ModernCard 
              glowColor={category.color}
              sx={{ height: '100%', textAlign: 'center', p: 3 }}
              className="card-3d"
            >
              <Box sx={{ 
                color: theme => theme.palette.accent[category.color],
                display: 'flex',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {category.icon}
                {category.count > 0 && (
                  <Box sx={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    bgcolor: theme => theme.palette.accent[category.color],
                    color: 'white',
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {category.count}
                  </Box>
                )}
              </Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                {category.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {category.description}
              </Typography>
            </ModernCard>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={4} className="fade-in">
        {/* Message List */}
        <Grid item xs={12} md={4}>
          <ModernCard glowColor="blue" sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ 
              p: 2, 
              borderBottom: theme => `1px solid ${theme.palette.divider}`,
              bgcolor: theme => theme.palette.background.paper
            }}>
              <Typography variant="h6" fontWeight={600}>
                Recent Messages
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <ListItem 
                    key={message.id}
                    alignItems="flex-start" 
                    sx={{
                      cursor: 'pointer',
                      borderBottom: theme => `1px solid ${theme.palette.divider}`,
                      bgcolor: selectedMessage?.id === message.id ? 
                        theme => `${theme.palette.action.selected}` : 
                        message.read ? 'transparent' : theme => `${theme.palette.action.hover}`,
                      '&:hover': {
                        bgcolor: theme => `${theme.palette.action.hover}`
                      }
                    }}
                    onClick={() => handleSelectMessage(message)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: message.read ? 'grey.500' : theme => theme.palette.primary.main
                      }}>
                        {message.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: message.read ? 400 : 700 }}>
                            {message.sender}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {message.date}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ 
                              display: 'block',
                              fontWeight: message.read ? 400 : 600,
                              mb: 0.5
                            }}
                          >
                            {message.subject}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {message.content}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No messages yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Submit a message using the contact form
                  </Typography>
                </Box>
              )}
            </List>
          </ModernCard>
        </Grid>

        {/* Message View */}
        <Grid item xs={12} md={8}>
          {selectedMessage ? (
            <ModernCard glowColor="pink" sx={{ p: 3 }} className="glass-effect-light">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight={600}>
                  {selectedMessage.subject}
                </Typography>
                <IconButton onClick={() => handleDeleteMessage(selectedMessage.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                p: 2,
                bgcolor: theme => theme.palette.action.hover,
                borderRadius: 1
              }}>
                <Avatar sx={{ mr: 2 }}>{selectedMessage.avatar}</Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {selectedMessage.sender}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedMessage.email}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                  {selectedMessage.date}
                </Typography>
              </Box>
              
              <Paper elevation={0} sx={{ 
                p: 3, 
                mb: 3, 
                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 2
              }}>
                <Typography variant="body1" paragraph>
                  {selectedMessage.content}
                </Typography>
              </Paper>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Reply
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Type your reply here..."
                variant="outlined"
                value={replyText}
                onChange={handleReplyChange}
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ModernButton
                  variant="contained"
                  color="primary"
                  onClick={handleSendReply}
                  startIcon={<SendIcon />}
                  disabled={!replyText.trim()}
                  className="pulse-button"
                >
                  Send Reply
                </ModernButton>
              </Box>
            </ModernCard>
          ) : (
            <ModernCard glowColor="blue" sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <MailOutlineIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 3, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" align="center">
                Select a message to view its contents
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Click on any message from the list on the left
              </Typography>
            </ModernCard>
          )}
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default MessagesPage; 