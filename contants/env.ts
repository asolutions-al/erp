/**
 * Production: DOMAIN_URL
 * Preview: VERCEL_URL
 * Development: http://localhost:3000
 */
const APP_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${process.env.DOMAIN_URL || process.env.VERCEL_URL}`

export { APP_URL }

