const createNextIntlPlugin = require("next-intl/plugin")

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./i18n.ts",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "xczxozyteslsqdxtljzq.supabase.co",
      },
      {
        hostname: "bundui-images.netlify.app",
      },
    ],
  },
  experimental: {
    typedRoutes: true,
    dynamicIO: true,
    ppr: true,
  },
}

module.exports = withNextIntl(nextConfig)
