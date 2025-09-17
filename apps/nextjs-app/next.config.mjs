/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow all hosts for Replit proxy compatibility
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
