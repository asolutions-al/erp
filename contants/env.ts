const IS_DEV = process.env.NODE_ENV === "development"
/**
 * Production: APP_URL
 * Preview: VERCEL_URL
 * Development: http://localhost:3000
 */
const APP_URL = IS_DEV
  ? "http://localhost:3000"
  : `https://${process.env.APP_URL}`

/**
 * Production: AUTH_URL
 * Preview: AUTH_URL
 * Development: http://localhost:3001
 */
const AUTH_URL = IS_DEV
  ? "http://localhost:3001"
  : `https://${process.env.AUTH_URL}`

/**
 * Production: DOMAIN
 * Preview: DOMAIN
 * Development: localhost
 */
const DOMAIN = IS_DEV ? "localhost" : process.env.APP_URL

export { APP_URL, AUTH_URL, DOMAIN, IS_DEV }
