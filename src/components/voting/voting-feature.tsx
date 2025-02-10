'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Button, 
  Box,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  IconButton,
  Fade,
  Grow
} from '@mui/material'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
import TimelineIcon from '@mui/icons-material/Timeline'
import PeopleIcon from '@mui/icons-material/People'
import { motion } from 'framer-motion'

export function VotingFeature() {
  const { connected } = useWallet()
  const [polls, setPolls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPoll, setSelectedPoll] = useState<number | null>(null)

  useEffect(() => {
    setPolls([
      {
        id: 1,
        description: "Community Development Fund Allocation",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        totalVotes: 214,
        candidates: [
          { id: 1, name: "Education Initiative", votes: 125, description: "Allocate funds to educational programs" },
          { id: 2, name: "Infrastructure Development", votes: 89, description: "Improve community infrastructure" },
        ]
      },
      {
        id: 2,
        description: "Protocol Upgrade Proposal",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(),
        totalVotes: 156,
        candidates: [
          { id: 1, name: "Version 2.0", votes: 98, description: "Major protocol upgrade with new features" },
          { id: 2, name: "Security Patch", votes: 58, description: "Focus on security improvements" },
        ]
      }
    ])
    setLoading(false)
  }, [])

  const handleVote = async (pollId: number, candidateId: number) => {
    try {
      console.log(`Voting for candidate ${candidateId} in poll ${pollId}`)
      // Add your voting logic here
    } catch (err) {
      setError('Failed to submit vote. Please try again.')
    }
  }

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
          Loading Polls...
        </Typography>
      </Box>
    )
  }

  const StatsCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
        }
      }}
    >
      {icon}
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6">
          {value}
        </Typography>
      </Box>
    </Paper>
  )

  return (
    <Box>
      {!connected ? (
        <Fade in timeout={1000}>
          <Paper 
            elevation={6} 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              maxWidth: 600,
              margin: 'auto'
            }}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <HowToVoteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            </motion.div>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Welcome to Decentralized Voting
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Connect your wallet to participate in secure and transparent voting
            </Typography>
            <WalletMultiButton />
          </Paper>
        </Fade>
      ) : (
        <Box>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <StatsCard 
                icon={<HowToVoteIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
                title="Active Polls"
                value={polls.length.toString()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatsCard 
                icon={<TimelineIcon sx={{ fontSize: 40, color: 'secondary.main' }} />}
                title="Total Votes"
                value={polls.reduce((acc, poll) => acc + poll.totalVotes, 0).toString()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatsCard 
                icon={<PeopleIcon sx={{ fontSize: 40, color: 'success.main' }} />}
                title="Participants"
                value="1,234"
              />
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {polls.map((poll, index) => (
              <Grid item xs={12} key={poll.id}>
                <Grow in timeout={1000 * (index + 1)}>
                  <Card 
                    elevation={5}
                    sx={{ 
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: 4,
                      overflow: 'hidden',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h4" gutterBottom fontWeight="bold">
                        {poll.description}
                      </Typography>
                      
                      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                        <Chip 
                          label={`Starts: ${new Date(poll.startDate).toLocaleDateString()}`}
                          color="primary"
                          sx={{ borderRadius: 2, px: 2 }}
                        />
                        <Chip 
                          label={`Ends: ${new Date(poll.endDate).toLocaleDateString()}`}
                          color="secondary"
                          sx={{ borderRadius: 2, px: 2 }}
                        />
                        <Chip 
                          label={`Total Votes: ${poll.totalVotes}`}
                          color="info"
                          sx={{ borderRadius: 2, px: 2 }}
                        />
                      </Box>

                      <Grid container spacing={3}>
                        {poll.candidates.map((candidate: any) => (
                          <Grid item xs={12} sm={6} key={candidate.id}>
                            <Paper 
                              elevation={3}
                              sx={{ 
                                p: 3,
                                height: '100%',
                                background: 'rgba(255,255,255,0.9)',
                                borderRadius: 3,
                                transition: 'all 0.3s',
                                '&:hover': {
                                  transform: 'scale(1.02)',
                                  boxShadow: 6,
                                }
                              }}
                            >
                              <Typography variant="h5" gutterBottom fontWeight="bold">
                                {candidate.name}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" paragraph>
                                {candidate.description}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                                <Typography variant="h6" color="primary">
                                  {candidate.votes} votes
                                </Typography>
                                <Button 
                                  variant="contained" 
                                  color="primary"
                                  size="large"
                                  onClick={() => handleVote(poll.id, candidate.id)}
                                  sx={{ 
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    boxShadow: 3,
                                    '&:hover': {
                                      transform: 'translateY(-2px)',
                                      boxShadow: 5,
                                    }
                                  }}
                                >
                                  Vote Now
                                </Button>
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2,
            borderRadius: 2,
            animation: 'slideIn 0.5s ease-out'
          }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  )
}
