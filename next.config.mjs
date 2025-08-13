/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... your other configs like typescript, eslint, etc.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // This destination is ONLY for local development
        // In production, Vercel handles this automatically
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;