"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { customer } from "@/orm/app/schema"
import { CustomerFormSchemaT } from "@/providers/customer-form"
import { eq } from "drizzle-orm"

type FormSchemaT = CustomerFormSchemaT

const create = ({
  values,
  unitId,
  orgId,
}: {
  values: FormSchemaT
  unitId: string
  orgId: string
}) =>
  db.insert(customer).values({
    ...values,
    unitId,
    orgId,
  })

const update = ({ values, id }: { values: FormSchemaT; id: string }) =>
  db.update(customer).set(values).where(eq(customer.id, id))

const markAsFavorite = ({
  id,
  isFavorite,
}: {
  id: string
  isFavorite: boolean
}) => db.update(customer).set({ isFavorite }).where(eq(customer.id, id))

export {
  create as createCustomer,
  markAsFavorite as markCustomerAsFavorite,
  update as updateCustomer,
}
