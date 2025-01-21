import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./orm/app",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})

/**
 * REMINDER:
 * Whenerver introspection is done, the schema file will update.
 * But for movement table, the productsDetails column will be missing types since it's a jsonb column.
 * To fix this, we need to manually add the types to the schema file.
 * Just place the below code at the chain of productDetails column in the schema file.
 * .$type<SelectProductType>()
 */
