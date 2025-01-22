/**
 * Below does not work when using custom domain in Vercel
 */
// export const appUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}` // prod
//   : "http://localhost:3001"; // dev

export const appUrl = process.env.APP_URL!
export const accountsUrl = process.env.ACCOUNTS_URL!

export const publicStorageUrl =
  "https://sgiuwqvbmszlqxbfajwl.supabase.co/storage/v1/object/public"
