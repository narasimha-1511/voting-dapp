'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { Box, Container, Typography, Paper } from '@mui/material'
import { motion } from 'framer-motion'

import { redirect } from 'next/navigation'
import { WalletButton } from '../solana/solana-provider'

export default function AccountListFeature() {
  const { publicKey } = useWallet()

  if (publicKey) {
    return redirect(`/account/${publicKey.toString()}`)
  }

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
            variant="h2" 
            sx={{ 
              color: '#F1E3E4',
              textAlign: 'center',
              mb: 6,
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(28, 29, 33, 0.5)',
              letterSpacing: '-0.02em',
            }}
          >
            Account Management
          </Typography>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              background: 'rgba(44, 46, 53, 0.95)',
              borderRadius: 4,
              transition: 'all 0.3s ease',
              border: '1px solid rgba(162, 136, 166, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              '& .wallet-adapter-button': {
                backgroundColor: '#A288A6',
                color: '#F1E3E4',
                '&:hover': {
                  backgroundColor: '#BB9BB0',
                },
                '&:not(:disabled):hover': {
                  backgroundColor: '#BB9BB0',
                }
              }
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#CCBCBC',
                textAlign: 'center',
                mb: 2
              }}
            >
              Connect your wallet to manage your account
            </Typography>
            <WalletButton />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  )
}
