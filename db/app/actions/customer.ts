import { db } from "@/db/app/instance"
import { customer } from "@/orm/app/schema"
import { CustomerFormSchemaT } from "@/providers/customer-form"
import { eq } from "drizzle-orm"

type FormSchemaT = CustomerFormSchemaT

const create = async ({
  values,
  unitId,
}: {
  values: FormSchemaT
  unitId: string
}) => {
  "use server"
  await db.insert(customer).values({
    ...values,
    unitId,
  })
}

const update = async ({ values, id }: { values: FormSchemaT; id: string }) => {
  "use server"
  await db.update(customer).set(values).where(eq(customer.id, id))
}

export { create as createCustomer, update as updateCustomer }
