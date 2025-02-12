export const getRpcEndpoint = () => {
  const heliusRpc = process.env.NEXT_HELIUS_RPC_URL;
  if (!heliusRpc) {
    throw new Error('NEXT_HELIUS_RPC_URL is not defined in environment variables');
  }
  return heliusRpc;
};
