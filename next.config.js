/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora os erros do corretor ortográfico no lançamento
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora os erros de tipagem no lançamento
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;