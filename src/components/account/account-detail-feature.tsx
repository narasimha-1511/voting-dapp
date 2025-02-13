'use client'

import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { Box, Container, Typography, Paper, Grid } from '@mui/material'
import { motion } from 'framer-motion'

import { useParams } from 'next/navigation'

import { ExplorerLink } from '../cluster/cluster-ui'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { AccountBalance, AccountButtons, AccountTokens, AccountTransactions } from './account-ui'

export default function AccountDetailFeature() {
  const params = useParams()
  const address = useMemo(() => {
    if (!params.address) {
      return
    }
    try {
      return new PublicKey(params.address)
    } catch (e) {
      console.log(`Invalid public key`, e)
    }
  }, [params])
  if (!address) {
    return <div>Error loading account</div>
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
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            <Paper
              elevation={3}
              sx={{
                background: 'rgba(44, 46, 53, 0.95)',
                borderRadius: '24px',
                border: '1px solid rgba(162, 136, 166, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
              }}
            >
              {/* Header Section - Centered */}
              <Box sx={{ 
                p: 4, 
                background: 'linear-gradient(to right, rgba(162, 136, 166, 0.1), rgba(187, 155, 176, 0.05))',
                borderBottom: '1px solid rgba(162, 136, 166, 0.2)',
                textAlign: 'center'
              }}>
                <Typography variant="h4" sx={{ 
                  color: '#F1E3E4',
                  fontWeight: 'bold',
                  mb: 3,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}>
                  <AccountBalance address={address} />
                </Typography>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  color: '#CCBCBC',
                  flexWrap: 'wrap'
                }}>
                  <ExplorerLink 
                    path={`account/${address}`} 
                    label={ellipsify(address.toString())}
                    sx={{
                      color: '#A288A6',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#BB9BB0',
                        textDecoration: 'underline',
                      }
                    }}
                  />
                  <AccountButtons address={address} />
                </Box>
              </Box>

              {/* Account Details Section */}
              <Box sx={{ p: 4 }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      background: 'rgba(28, 29, 33, 0.6)',
                      borderRadius: '16px',
                      p: 3,
                      height: '100%',
                      border: '1px solid rgba(162, 136, 166, 0.2)',
                    }}>
                      <Typography variant="h6" sx={{ 
                        color: '#F1E3E4',
                        mb: 3,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Box component="span" sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%',
                          backgroundColor: '#A288A6',
                          display: 'inline-block'
                        }}/>
                        Tokens
                      </Typography>
                      <Box sx={{ 
                        maxHeight: '400px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: 'rgba(162, 136, 166, 0.1)',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: 'rgba(162, 136, 166, 0.3)',
                          borderRadius: '4px',
                          '&:hover': {
                            background: 'rgba(162, 136, 166, 0.4)',
                          }
                        }
                      }}>
                        <AccountTokens address={address} />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      background: 'rgba(28, 29, 33, 0.6)',
                      borderRadius: '16px',
                      p: 3,
                      height: '100%',
                      border: '1px solid rgba(162, 136, 166, 0.2)',
                    }}>
                      <Typography variant="h6" sx={{ 
                        color: '#F1E3E4',
                        mb: 3,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Box component="span" sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%',
                          backgroundColor: '#BB9BB0',
                          display: 'inline-block'
                        }}/>
                        Recent Transactions
                      </Typography>
                      <Box sx={{ 
                        maxHeight: '400px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: 'rgba(162, 136, 166, 0.1)',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: 'rgba(162, 136, 166, 0.3)',
                          borderRadius: '4px',
                          '&:hover': {
                            background: 'rgba(162, 136, 166, 0.4)',
                          }
                        }
                      }}>
                        <AccountTransactions address={address} />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
