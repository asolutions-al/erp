import * as relations from "@/orm/auth/relations"
import * as schema from "@/orm/auth/schema"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const client = postgres(process.env.AUTH_DATABASE_URL!, { prepare: false })

const db = drizzle(client, {
  schema: {
    ...schema,
    ...relations,
  },
})

export { db }
