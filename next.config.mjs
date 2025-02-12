/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_HELIUS_RPC_URL: process.env.NEXT_HELIUS_RPC_URL,
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
