/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! PERIGO: Isso manda a Vercel ignorar os erros vermelhos e publicar o site mesmo assim !!
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig