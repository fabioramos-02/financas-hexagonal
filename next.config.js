/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuração para build otimizado
  output: 'standalone',
  
  // Configurações de imagem
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Configuração do webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Configurações personalizadas do webpack aqui
    return config
  },
  
  // Configuração de redirecionamentos
  async redirects() {
    return [
      // Adicionar redirecionamentos se necessário
    ]
  },
  
  // Configuração de rewrites
  async rewrites() {
    return [
      // Adicionar rewrites se necessário
    ]
  },
}

module.exports = nextConfig