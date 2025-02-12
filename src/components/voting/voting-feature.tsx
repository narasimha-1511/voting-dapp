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
  Grow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack
} from '@mui/material'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
import TimelineIcon from '@mui/icons-material/Timeline'
import PeopleIcon from '@mui/icons-material/People'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { motion } from 'framer-motion'
import { useAnchorProvider } from '../solana/solana-provider'
import { getVotingProgram } from '@project/anchor'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { SystemProgram } from '@solana/web3.js';

interface CreatePollProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (pollData: {
    name: string;
    description: string;
    pollStart: string;
    pollEnd: string;
    candidates: string[];
  }) => void;
}

function CreatePoll({ open, onClose, onSubmit }: CreatePollProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pollStart, setPollStart] = useState('');
  const [pollEnd, setPollEnd] = useState('');
  const [candidates, setCandidates] = useState<string[]>(['', '']); // Start with 2 empty candidates

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      pollStart,
      pollEnd,
      candidates: candidates.filter(c => c.trim() !== ''), // Only submit non-empty candidates
    });
    // Reset form
    setName('');
    setDescription('');
    setPollStart('');
    setPollEnd('');
    setCandidates(['', '']);
  };

  const handleCandidateChange = (index: number, value: string) => {
    const newCandidates = [...candidates];
    newCandidates[index] = value;
    setCandidates(newCandidates);
  };

  const addCandidate = () => {
    setCandidates([...candidates, '']);
  };

  const removeCandidate = (index: number) => {
    if (candidates.length > 2) { // Maintain minimum 2 candidates
      const newCandidates = candidates.filter((_, i) => i !== index);
      setCandidates(newCandidates);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Poll</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              label="Poll Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Start Date"
              type="datetime-local"
              value={pollStart}
              onChange={(e) => setPollStart(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="datetime-local"
              value={pollEnd}
              onChange={(e) => setPollEnd(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Candidates
              </Typography>
              {candidates.map((candidate, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label={`Candidate ${index + 1}`}
                    value={candidate}
                    onChange={(e) => handleCandidateChange(index, e.target.value)}
                    required
                    fullWidth
                  />
                  {candidates.length > 2 && (
                    <IconButton 
                      onClick={() => removeCandidate(index)}
                      color="error"
                      sx={{ mt: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addCandidate}
                variant="outlined"
                size="small"
              >
                Add Candidate
              </Button>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Create Poll</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export function VotingFeature() {
  const { connected, publicKey } = useWallet()
  const [polls, setPolls] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPoll, setSelectedPoll] = useState<number | null>(null)
  const [createPollOpen, setCreatePollOpen] = useState(false)
  const provider = useAnchorProvider();

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const program = getVotingProgram(provider);
      
      // Fetch all polls and candidates in parallel to reduce RPC calls
      const [allPolls, allCandidates] = await Promise.all([
        program.account.poll.all(),
        program.account.candidate.all()
      ]);
      
      // Create a map of pollId to candidates for efficient lookup
      const candidatesByPollId = allCandidates.reduce((acc, candidate) => {
        const pollId = candidate.account.pollId.toString('hex');
        if (!acc[pollId]) {
          acc[pollId] = [];
        }
        acc[pollId].push({
          ...candidate.account,
          publicKey: candidate.publicKey
        });
        return acc;
      }, {} as Record<string, any[]>);

      // Combine polls with their candidates
      const pollsWithCandidates = allPolls.map(poll => ({
        ...poll,
        candidates: candidatesByPollId[poll.account.pollId.toString('hex')] || []
      }));
      
      // Sort polls by start time, most recent first
      const sortedPolls = pollsWithCandidates.sort((a, b) => 
        b.account.pollStart.toNumber() - a.account.pollStart.toNumber()
      );

      setPolls(sortedPolls);
      console.log("Polls with candidates:", sortedPolls);
    } catch (err) {
      console.error('Error fetching polls:', err);
      setError('Failed to fetch polls: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch polls on component mount and when a new poll is created
  useEffect(() => {
    if (provider) {
      fetchPolls();
    }
  }, []);

  const handleCreatePollSuccess = async () => {
    setCreatePollOpen(false);
    await fetchPolls(); // Refresh polls after creating a new one
  };

  const handleCreatePoll = async (pollData: {
    name: string;
    description: string;
    pollStart: string;
    pollEnd: string;
    candidates: string[];
  }) => {
    try {
      setError(null);
      console.log('Creating poll:', pollData);
      const program = getVotingProgram(provider)
      if(publicKey == null){
        return;
      }

      const startTimestamp = new BN(new Date(pollData.pollStart).getTime() / 1000);
      const endTimestamp = new BN(new Date(pollData.pollEnd).getTime() / 1000);

      const [pollPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("poll"),
          publicKey.toBuffer(),
          startTimestamp.toArrayLike(Buffer, 'le', 8)
        ],
        program.programId
      );

      // Create the poll
      await program.methods
        .initializePoll(
          pollData.description,
          startTimestamp,
          endTimestamp,
          pollData.name,
        )
        .accounts({
          authority: publicKey,
          poll: pollPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      console.log("Poll created with PDA:", pollPda.toString());

      // Fetch the created poll account
      let pollAccount = await program.account.poll.fetch(pollPda);

      // Initialize candidates
      for (const candidateName of pollData.candidates) {
        try {
          console.log("Creating candidate with nextCandidateId:", pollAccount.nextCandidateId.toString());
          
          const [candidatePda] = PublicKey.findProgramAddressSync(
            [
              Buffer.from("candidate"),
              pollPda.toBuffer(),
              pollAccount.nextCandidateId.toArrayLike(Buffer, 'le', 8)
            ],
            program.programId
          );
          console.log("Candidate PDA:", candidatePda.toString());

          await program.methods
            .initializeCandidate(candidateName)
            .accounts({
              authority: publicKey,
              poll: pollPda,
              candidate: candidatePda,
              systemProgram: SystemProgram.programId,
            })
            .rpc();
          
          console.log("Candidate created:", candidateName);
          
          // Fetch the updated poll account for the next iteration
          pollAccount = await program.account.poll.fetch(pollPda);
          console.log("Updated next candidate id:", pollAccount.nextCandidateId.toString());
        } catch (err) {
          console.error('Error creating candidate:', candidateName, err);
          setError('Failed to create candidate: ' + (err as Error).message);
          return; // Stop creating more candidates if one fails
        }
      }

      handleCreatePollSuccess();
    } catch (err) {
      console.error('Error creating poll:', err);
      setError('Failed to create poll: ' + (err as Error).message);
    }
  };

  const handleVote = async (pollId: BN, candidateId: BN) => {
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      const program = getVotingProgram(provider);
      
      console.log("Voting with pollId:", pollId.toString(), "candidateId:", candidateId.toString());

      // First get all polls to find the one we want to vote on
      const allPolls = await program.account.poll.all();
      const targetPoll = allPolls.find(p => p.account.pollId.eq(pollId));
      const allCandidates = await program.account.candidate.all();
      const targetCandidate = allCandidates.find(c => c.account.candidateId.eq(candidateId));

      
      if (!targetPoll) {
        throw new Error('Poll not found');
      }

      // Get poll details
      const pollStartTime = targetPoll.account.pollStart;
      const pollAuthority = targetPoll.publicKey;
      
      console.log("Poll details - start time:", pollStartTime.toString(), "authority:", pollAuthority.toString());
      
      // // Find the poll PDA using authority and start time
      // const [pollPda] = PublicKey.findProgramAddressSync(
      //   [
      //     Buffer.from("poll"),
      //     pollAuthority.toBuffer(),
      //     pollStartTime.toArrayLike(Buffer, 'le', 8)
      //   ],
      //   program.programId
      // );

      // console.log("Poll PDA:", pollPda.toString());

      let pollAccount = await program.account.poll.fetch(pollAuthority);

      console.log("Poll Fteched", pollAccount);

      // Find the candidate PDA using poll PDA and candidate ID
      const candidatePda = targetCandidate?.publicKey;

      let candidateAccount = await program.account.candidate.fetch(candidatePda);

      console.log("Candidate Fetched", candidateAccount);

      console.log("PDAs - poll:", pollAuthority.toString(), "candidate:", candidatePda.toString());

      // Submit vote transaction
      await program.methods
        .vote()
        .accounts({
          signer: publicKey,
          poll: pollAuthority,
          candidate: candidatePda,
        })
        .rpc();

      // Refresh the polls to show updated vote count
      await fetchPolls();
      
    } catch (err) {
      console.error('Error voting:', err);
      setError('Failed to vote: ' + (err as Error).message);
    }
  }

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
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreatePollOpen(true)}
            >
              Create Poll
            </Button>
          </Box>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
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
                <HowToVoteIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active Polls
                  </Typography>
                  <Typography variant="h6">
                    {polls.length.toString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
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
                <TimelineIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Votes
                  </Typography>
                  <Typography variant="h6">
                    {polls.reduce((acc, poll) => acc + poll.account.candidateAmount.toNumber(), 0).toString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
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
                <PeopleIcon sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Participants
                  </Typography>
                  <Typography variant="h6">
                    1,234
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {polls.map((poll) => (
              <Grid item xs={12} key={poll.publicKey.toString()}>
                <Grow in timeout={1000}>
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
                        {poll.account.name}
                      </Typography>
                      
                      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                        <Chip 
                          label={`Starts: ${new Date(poll.account.pollStart.toNumber() * 1000).toLocaleDateString()}`}
                          color="primary"
                          sx={{ borderRadius: 2, px: 2 }}
                        />
                        <Chip 
                          label={`Ends: ${new Date(poll.account.pollEnd.toNumber() * 1000).toLocaleDateString()}`}
                          color="secondary"
                          sx={{ borderRadius: 2, px: 2 }}
                        />
                        <Chip 
                          label={`Total Votes: ${poll.account.candidateAmount.toString()}`}
                          color="info"
                          sx={{ borderRadius: 2, px: 2 }}
                        />
                      </Box>

                      <Grid container spacing={3}>
                        {poll.candidates?.map((candidate) => (
                          <Grid item xs={12} sm={6} key={candidate.publicKey.toString()}>
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
                                {candidate.candidateName}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" paragraph>
                                {candidate.candidateDescription}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                                <Typography variant="h6" color="primary">
                                  {candidate.candidateVotes.toString()} votes
                                </Typography>
                                <Button 
                                  variant="contained" 
                                  color="primary"
                                  size="large"
                                  onClick={() => handleVote(poll.account.pollId, candidate.candidateId)}
                                  disabled={
                                    !publicKey || // Not connected
                                    Date.now() < poll.account.pollStart.toNumber() * 1000 || // Poll hasn't started
                                    Date.now() > poll.account.pollEnd.toNumber() * 1000 // Poll has ended
                                  }
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
                                  Vote
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

      <CreatePoll
        open={createPollOpen}
        onClose={() => setCreatePollOpen(false)}
        onSubmit={handleCreatePoll}
      />

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
