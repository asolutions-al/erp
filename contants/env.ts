/**
 * Production: DOMAIN_URL
 * Preview: VERCEL_URL
 * Development: http://localhost:3000
 */
const APP_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${process.env.DOMAIN_URL || process.env.VERCEL_URL}`

/**
 * Production: ACCOUNTS_URL
 * Preview: ACCOUNTS_URL
 * Development: http://localhost:3001
 */
const ACCOUNTS_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : `https://${process.env.ACCOUNTS_URL}`

export { ACCOUNTS_URL, APP_URL }
