const createNextIntlPlugin = require("next-intl/plugin")

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./i18n.ts",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "sgiuwqvbmszlqxbfajwl.supabase.co",
      },
    ],
  },
  experimental: {
    typedRoutes: true,
    ppr: "incremental",
    staleTimes: {
      dynamic: 0,
    },
  },
}

module.exports = withNextIntl(nextConfig)
