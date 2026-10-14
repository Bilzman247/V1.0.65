/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/.git/**', '**/node_modules/**', '**/.next/**'],
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
