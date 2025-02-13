'use client'

import { Box, Container, Typography, Paper, Grid } from '@mui/material'
import { motion } from 'framer-motion'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'

export default function DashboardFeature() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1C1D21 0%, #A288A6 100%)',
      backgroundImage: `
        radial-gradient(at 40% 20%, rgba(187, 155, 176, 0.1) 0px, transparent 50%),
        radial-gradient(at 80% 0%, rgba(204, 188, 188, 0.1) 0px, transparent 50%),
        radial-gradient(at 0% 50%, rgba(241, 227, 228, 0.1) 0px, transparent 50%)
      `,
      py: 8 
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h1" 
            sx={{ 
              color: '#F1E3E4',
              textAlign: 'center',
              mb: 4,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(28, 29, 33, 0.5)',
              letterSpacing: '-0.02em',
            }}
          >
            Decentralized Voting Platform
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#CCBCBC',
              textAlign: 'center',
              mb: 8,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Secure, transparent, and efficient voting system powered by Solana blockchain
          </Typography>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto'>
            {features.map((feature, index) => (
              <div key={index} className='w-full'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className='h-full'
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      height: '100%',
                      minHeight: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(44, 46, 53, 0.95)',
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(162, 136, 166, 0.3)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(28, 29, 33, 0.15)',
                        background: 'rgba(44, 46, 53, 0.98)',
                      }
                    }}
                  >
                    <div className='flex flex-col items-center justify-center text-center h-full'>
                      <div className='mb-4'>
                        {feature.icon}
                      </div>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: '#F1E3E4',
                          mb: 2,
                          fontWeight: 'bold'
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: '#CCBCBC',
                          lineHeight: 1.6,
                          maxWidth: '90%'
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </div>
                  </Paper>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Box>
  )
}

const features = [
  {
    icon: <HowToVoteIcon sx={{ fontSize: 48, color: '#A288A6' }} />,
    title: 'Secure Voting',
    description: 'Cast your votes securely using blockchain technology with complete transparency and immutability.'
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 48, color: '#BB9BB0' }} />,
    title: 'Decentralized',
    description: 'Fully decentralized system ensuring no single point of control or failure.'
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 48, color: '#CCBCBC' }} />,
    title: 'Real-time Results',
    description: 'View voting results in real-time as they are recorded on the blockchain.'
  }
]
