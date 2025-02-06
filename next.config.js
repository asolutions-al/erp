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
    ppr: "incremental",
  },
  rewrites: async () => {
    return [
      {
        source: "/",
        destination: "/o/list",
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
