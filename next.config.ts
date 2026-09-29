import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.2', '192.168.1.2:3000'],
  devIndicators: false
};

export default withPWA(nextConfig);
