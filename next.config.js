const withPlugins = require('next-compose-plugins')

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return []
  },
}

module.exports = nextConfig
