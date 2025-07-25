import "server-only"

import * as relations from "@/orm/app/relations"
import * as schema from "@/orm/app/schema"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const client = postgres(process.env.DATABASE_URL!, { prepare: false })

const db = drizzle(client, {
  schema: {
    ...schema,
    ...relations,
  },
})

export { db }
