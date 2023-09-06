/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },

  headers: {
    'Cache-Control': 'no-store',
  },

};

module.exports = nextConfig;