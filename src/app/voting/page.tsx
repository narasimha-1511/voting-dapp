'use client';
import { VotingFeature } from '@/components/voting/voting-feature';
import { Container, Typography, Box } from '@mui/material';

export default function VotingPage() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      py: 8 
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            color: 'white',
            textAlign: 'center',
            mb: 6,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Decentralized Voting Platform
        </Typography>
        <VotingFeature />
      </Container>
    </Box>
  );
}
