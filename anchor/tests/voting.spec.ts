import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import { Keypair , PublicKey } from '@solana/web3.js'
import { Voting } from '../target/types/voting'
import { startAnchor } from 'anchor-bankrun'
import { BankrunProvider } from 'anchor-bankrun'
import { after } from 'node:test'

const IDL = require('../target/idl/voting.json');

const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

describe('voting', () => {
  let provider: BankrunProvider;
  let votingProgram: Program<Voting>;

  // Configure the client to use the local cluster.
  beforeAll(async () => {
    const context = await startAnchor("" , [{name: "voting", programId: votingAddress}] , []);
    provider = new BankrunProvider(context);
    votingProgram = new Program<Voting>(IDL, provider);
  })


  it('Initialize Poll', async () => {

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your fav Color?",
      new anchor.BN(0),
      new anchor.BN(1899213685),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer , 'le' , 8)],
      votingAddress
    );
    
    const poll = await votingProgram.account.poll.fetch(pollAddress);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your fav Color?");
    expect(poll.pollStart.toNumber()).toEqual(0);
    expect(poll.pollEnd.toNumber()).toEqual(1899213685);
    expect(poll.candidateAmount.toNumber()).toEqual(0);

  })

  it('Initialize Candidate', async () => {

    await votingProgram.methods.initializeCandidate(
      new anchor.BN(1),// poll id
      new anchor.BN(1),// candidate id
      "Devil_Duck",// candidate name
    ).rpc();

    await votingProgram.methods.initializeCandidate(
      new anchor.BN(1),// poll id
      new anchor.BN(2),// candidate id
      "Devil_Duck2",// candidate name
    ).rpc();

    const [candidateAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer , 'le' , 8), new anchor.BN(1).toArrayLike(Buffer , 'le' , 8)],
      votingAddress
    );

    const [candidateAddress2] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer , 'le' , 8), new anchor.BN(2).toArrayLike(Buffer , 'le' , 8)],
      votingAddress
    );
    
    const candidate = await votingProgram.account.candidate.fetch(candidateAddress);


    expect(candidate.candidateId.toNumber()).toEqual(1);
    expect(candidate.candidateName).toEqual("Devil_Duck");
    expect(candidate.candidateVotes.toNumber()).toEqual(0);

    const candidate2 = await votingProgram.account.candidate.fetch(candidateAddress2);

    expect(candidate2.candidateId.toNumber()).toEqual(2);
    expect(candidate2.candidateName).toEqual("Devil_Duck2");
    expect(candidate2.candidateVotes.toNumber()).toEqual(0);
  });
  
  it('Vote', async () => {

    await votingProgram.methods.vote(
      new anchor.BN(1),
      new anchor.BN(1),
    ).rpc();

      const [candidateAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer , 'le' , 8), new anchor.BN(1).toArrayLike(Buffer , 'le' , 8)],
      votingAddress
    );

    const candidate = await votingProgram.account.candidate.fetch(candidateAddress);

    expect(candidate.candidateVotes.toNumber()).toEqual(1);
  })
})
