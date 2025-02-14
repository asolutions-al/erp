import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./orm/app",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
