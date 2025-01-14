import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./orm/(auth)",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.AUTH_DATABASE_URL!,
  },
})
