const IS_DEV = process.env.NODE_ENV === "development"

const DOMAIN = IS_DEV ? "localhost" : process.env.APP_URL

const APP_URL = IS_DEV ? "http://localhost:3000" : process.env.APP_URL

const AUTH_URL = IS_DEV ? "http://localhost:3001" : process.env.AUTH_URL

export { APP_URL, AUTH_URL, DOMAIN, IS_DEV }
