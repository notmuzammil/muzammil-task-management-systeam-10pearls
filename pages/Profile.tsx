import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { RootState } from '../store';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4 }}>
          Please log in to view your profile
        </Typography>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Profile
          </Typography>
          <Box sx={{ mt: 3, width: '100%' }}>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Edit Profile
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 